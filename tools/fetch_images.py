#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
产品图本地化脚本 —— 给 data-*.js / phone-data.js 里缺图的产品补 images/<id>.jpg

为什么要本地化：
  前端 phoneImage() 是三级降级（本地图 → 在线图 → SVG 占位）。
  在线图走 Bing 热链，GitHub Pages 上不稳定且依赖第三方；本地化后离线可看、加载快。

用法：
  # 只看缺哪些，不下载
  python tools/fetch_images.py --dry-run

  # 补全部缺图
  python tools/fetch_images.py

  # 只补某个文件
  python tools/fetch_images.py --only data/phone-data.js

  # 覆盖重下（比如某张图抓错了）
  python tools/fetch_images.py --only data/data-tv.js --force

依赖：仅标准库。
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "images")

# 数据文件 -> (常量名, 搜索词后缀)
# 后缀用来消歧义，避免搜「小米 15」搜出一堆无关图
# 注意：数据文件已收进 data/ 子目录，键名带 data/ 前缀
SOURCES = {
    "data/phone-data.js":    ("PHONE_DATA",    "手机 官方图"),
    "data/data-tablet.js":   ("TABLET_DATA",   "平板电脑 官方图"),
    "data/data-camera.js":   ("CAMERA_DATA",   "相机 官方图"),
    "data/data-tv.js":       ("TV_DATA",       "电视 官方图"),
    "data/data-watch.js":    ("WATCH_DATA",    "智能手表 官方图"),
    "data/data-keyboard.js": ("KEYBOARD_DATA", "键盘 官方图"),
    "data/data-gpu.js":      ("GPU_DATA",      "显卡 官方图"),
    "data/data-cpu.js":      ("CPU_DATA",      "处理器 盒装图"),
    "data/data-laptop.js":   ("LAPTOP_DATA",   "笔记本电脑 官方图"),
    "data/data-ac.js":       ("AC_DATA",       "空调 官方图"),
    "data/data-robot.js":    ("ROBOT_DATA",    "扫地机器人 官方图"),
    "data/data-earphone.js": ("EARPHONE_DATA", "耳机 官方图"),
    "data/data-monitor.js":  ("MONITOR_DATA",  "显示器 官方图"),
}

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
MIN_BYTES = 2000  # 小于这个基本是占位图/错误页，判为失败


def load_items(filename, const_name):
    """用 node 求值数据文件，拿到 [{id, brand, model}, ...]。
    比正则解析可靠——各数据文件的 JS 风格并不统一。"""
    path = os.path.join(ROOT, "data", filename)
    if not os.path.exists(path):
        return []
    script = (
        'const fs=require("fs");'
        f'const code=fs.readFileSync({json.dumps(path)},"utf8");'
        f'const arr=new Function(code+"\\nreturn {const_name};")();'
        'console.log(JSON.stringify(arr.map(p=>({id:p.id,brand:p.brand||"",model:p.model||p.name||""}))));'
    )
    try:
        out = subprocess.check_output([NODE, "-e", script], stderr=subprocess.DEVNULL)
        return json.loads(out.decode("utf-8"))
    except Exception as e:
        print(f"  ! {filename} 解析失败（常量名可能不是 {const_name}）：{e}")
        return []


def bing_url(query, size=400):
    q = urllib.parse.quote(query.strip())
    return f"https://tse1.mm.bing.net/th?q={q}&w={size}&h={size}&c=7"


def download(url, dest, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        if r.status != 200:
            return 0, f"HTTP {r.status}"
        data = r.read()
    if len(data) < MIN_BYTES:
        return 0, f"体积过小 {len(data)}B（疑似占位图）"
    if not data.startswith(b"\xff\xd8"):  # JPEG magic
        return 0, "非 JPEG 内容"
    with open(dest, "wb") as f:
        f.write(data)
    return len(data), None


def find_node():
    for p in [
        "/Users/tornadoli/.workbuddy/binaries/node/versions/22.12.0/bin/node",
        "/Users/tornadoli/.workbuddy/binaries/node/versions/22.22.2/bin/node",
        "node",
    ]:
        try:
            subprocess.check_output([p, "-v"], stderr=subprocess.DEVNULL)
            return p
        except Exception:
            continue
    sys.exit("找不到可用的 node，脚本需要它来求值数据文件")


NODE = find_node()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="只处理指定数据文件，如 phone-data.js")
    ap.add_argument("--dry-run", action="store_true", help="只列出缺图，不下载")
    ap.add_argument("--force", action="store_true", help="已有本地图也重新下载")
    ap.add_argument("--sleep", type=float, default=0.4, help="每次下载间隔秒数，默认 0.4")
    ap.add_argument("--size", type=int, default=400, help="图片边长，默认 400")
    args = ap.parse_args()

    os.makedirs(IMG_DIR, exist_ok=True)
    targets = {args.only: SOURCES[args.only]} if args.only else SOURCES
    if args.only and args.only not in SOURCES:
        sys.exit(f"未知数据文件：{args.only}\n可选：{', '.join(SOURCES)}")

    missing = []
    for fname, (const, suffix) in targets.items():
        for it in load_items(fname, const):
            dest = os.path.join(IMG_DIR, it["id"] + ".jpg")
            if os.path.exists(dest) and not args.force:
                continue
            query = f'{it["brand"]} {it["model"]} {suffix}'.strip()
            missing.append((fname, it["id"], query, dest))

    if not missing:
        print("所有产品都已有本地图，无需补图。")
        return

    print(f"待补图 {len(missing)} 张：")
    by_file = {}
    for f, *_ in missing:
        by_file[f] = by_file.get(f, 0) + 1
    for f, n in by_file.items():
        print(f"  {n:>3}  {f}")

    if args.dry_run:
        print("\n--dry-run 模式，未下载。")
        return

    print()
    ok = fail = 0
    failed = []
    for i, (fname, pid, query, dest) in enumerate(missing, 1):
        try:
            size, err = download(bing_url(query, args.size), dest)
        except Exception as e:
            size, err = 0, str(e)[:60]
        if err:
            fail += 1
            failed.append((pid, err))
            print(f"[{i:>3}/{len(missing)}] ✗ {pid:<24} {err}")
        else:
            ok += 1
            print(f"[{i:>3}/{len(missing)}] ✓ {pid:<24} {size/1024:.1f} KB")
        time.sleep(args.sleep)

    print(f"\n完成：成功 {ok}，失败 {fail}")
    if failed:
        print("失败清单（可手动补 images/<id>.jpg，或调整搜索词后重跑）：")
        for pid, err in failed:
            print(f"  {pid}  —  {err}")
    print("\n提示：抓到的图请抽查是否对版，错的删掉后用 --force 重跑单个文件。")


if __name__ == "__main__":
    main()
