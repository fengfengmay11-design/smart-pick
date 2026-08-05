#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
价格刷新脚本 —— 用京东联盟 API 批量更新 data-*.js 中的价格字段

用法：
  # 刷新全部品类（需要先配好 .env）
  python server/refresh_prices.py

  # 只刷新手机
  python server/refresh_prices.py --only phone-data.js

  # 预览模式（不写文件，只打印差异）
  python server/refresh_prices.py --dry-run

输出：
  - 每款产品的：旧价 → 新价（京东参考到手价）
  - 变化超过 ±10% 的会标 ⚠
  - 最终生成新的 data-*.js 文件（原地覆盖前自动备份）

依赖：
  - server/jd_client.py（京东联盟客户端）
  - server/.env（JD_APP_KEY / JD_APP_SECRET）

注意：
  - 京东联盟有调用频率限制，默认每款间隔 0.5s
  - 价格为「京东到手价」（非券后价），仅供参考
  - 拼多多价格暂无法通过公开 API 获取，保持原值不变
"""

import argparse
import json
import os
import shutil
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from jd_client import refresh_product_price


DATA_FILES = {
    "phone-data.js": ("PHONE_DATA", "phone"),
    "data-tablet.js": ("TABLET_DATA", "tablet"),
    "data-camera.js": ("CAMERA_DATA", "camera"),
    "data-tv.js": ("TV_DATA", "tv"),
    "data-watch.js": ("WATCH_DATA", "watch"),
    "data-keyboard.js": ("KEYBOARD_DATA", "keyboard"),
}


def load_data(filepath, const_name):
    """用 node 求值数据文件。"""
    import subprocess
    script = (
        'const fs=require("fs");'
        f'const code=fs.readFileSync({json.dumps(filepath)},"utf8");'
        f'const arr=new Function(code+"\\nreturn {const_name};")();'
        'console.log(JSON.stringify(arr));'
    )
    out = subprocess.check_output(["node", "-e", script], stderr=subprocess.DEVNULL)
    return json.loads(out.decode("utf-8"))


def refresh_one(item, delay=0.5):
    """刷新单款产品。返回 (ok, new_jd_price, info_dict)。"""
    r = refresh_product_price(item.get("brand", ""), item.get("model", ""))
    time.sleep(delay)
    if not r["ok"]:
        return False, None, {"error": r.get("error", "未知错误")}
    return True, r["jd_price"], {
        "source_name": r.get("source_name", ""),
        "source_sku": r.get("source_sku", ""),
        "jd_image": r.get("jd_image", ""),
    }


def main():
    ap = argparse.ArgumentParser(description="批量刷新产品价格")
    ap.add_argument("--only", help="只处理指定数据文件")
    ap.add_argument("--dry-run", action="store_true", help="预览不写入")
    ap.add_argument("--delay", type=float, default=0.5, help="请求间隔秒数")
    args = ap.parse_args()

    targets = {args.only: DATA_FILES[args.only]} if args.only and args.only in DATA_FILES else DATA_FILES
    if args.only and args.only not in DATA_FILES:
        print(f"未知文件：{args.only}\n可选：{', '.join(DATA_FILES)}")
        sys.exit(1)

    total_ok = total_fail = total_changed = 0
    report_lines = []

    for fname, (const, cat) in targets.items():
        path = os.path.join(ROOT, fname)
        if not os.path.exists(path):
            print(f"跳过（文件不存在）：{fname}")
            continue

        items = load_data(path, const)
        print(f"\n{'='*50}")
        print(f"📦 {cat} ({fname}) — 共 {len(items)} 款")

        changed_items = []
        for i, item in enumerate(items, 1):
            old_jd = item.get("prices", {}).get("jd", 0)
            old_pdd = item.get("prices", {}).get("pdd", 0)

            ok, new_jd, info = refresh_one(item, args.delay)

            if not ok:
                total_fail += 1
                print(f"  [{i:>3}/{len(items)}] ✗ {item['id']:<24} {info.get('error','')}")
                continue

            total_ok += 1
            pct_change = ((new_jd - old_jd) / old_jd * 100) if old_jd > 0 else 999
            flag = ""
            if abs(pct_change) > 10:
                flag = " ⚠"
                total_changed += 1

            status = "→" if new_jd != old_jd else "="
            print(f"  [{i:>3}/{len(items)}] {flag} {item['id']:<24} ¥{old_jd} {status} ¥{new_jd:.0f} ({pct_change:+.1f}%)")

            if new_jd != old_jd:
                changed_items.append((item, new_jd, info))

        if changed_items and not args.dry_run:
            # 备份原文件
            bak = path + ".bak." + str(int(time.time()))
            shutil.copy2(path, bak)
            print(f"  备份 → {os.path.basename(bak)}")

            # 写入新价格
            for item, new_jd, _ in changed_items:
                item["prices"]["jd"] = int(new_jd)
                # pdd 保持原值（无拼多多 API）
                item["lastVerified"] = time.strftime("%Y-%m-%d")

            js = f"const {const} = [\n"
            blocks = [json.dumps(it, ensure_ascii=False, indent=2) for it in items]
            js += ",\n".join(blocks) + "\n];\n"
            with open(path, "w", encoding="utf-8") as f:
                f.write(js)
            print(f"  已写入 {len(changed_items)} 条价格更新")

        elif changed_items and args.dry_run:
            print(f"  [DRY-RUN] 将更新 {len(changed_items)} 条（未写入）")

    print(f"\n{'='*50}")
    print(f"完成：成功 {total_ok} / 失败 {total_fail} / 变动 {total_changed}")
    if args.dry_run:
        print("[--dry-run] 未修改任何文件")


if __name__ == "__main__":
    main()
