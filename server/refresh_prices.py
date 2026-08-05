#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
价格刷新脚本 —— 用京东联盟 API 批量更新 data-*.js 中的京东价

用法：
  python server/refresh_prices.py --dry-run              # 预览（强烈建议先跑这个）
  python server/refresh_prices.py --only data-tablet.js  # 只刷平板
  python server/refresh_prices.py                        # 全量刷新（自动备份）

设计要点（踩过的坑）：
  1. **定点替换而非整文件重写**。phone-data.js 尾部有 helper 函数、
     用的是 JS 风格 `id: "x"`，整文件 JSON 重写会抹掉 helper 且改坏格式。
     这里只替换价格数字本身，其余字节不动，diff 最小。
  2. **两种数据格式**：
     - data-*.js  → JSON 风格，价格在 "prices": {"jd": N, "pdd": N}
     - phone-data.js → JS 风格，价格在 storageOptions[].priceJd（多版本）
       只刷 defaultStorage 对应的那一档。
  3. **优先走免权限通道**。产品若有 skuId 字段就用 promotiongoodsinfo.query
     精确查价（免权限、不会搜错型号）；没有才退回关键词搜索（需申请权限）。
  4. 拼多多价格无公开 API，保持原值不变。

自测（不需要 API Key）：
  python server/refresh_prices.py --self-test
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)          # ← 关键：jd_client.py 在 server/ 下，不是项目根

DATA_FILES = {
    "phone-data.js":    ("PHONE_DATA",    "手机",   "js"),
    "data-tablet.js":   ("TABLET_DATA",   "平板",   "json"),
    "data-camera.js":   ("CAMERA_DATA",   "相机",   "json"),
    "data-tv.js":       ("TV_DATA",       "电视",   "json"),
    "data-watch.js":    ("WATCH_DATA",    "手表",   "json"),
    "data-keyboard.js": ("KEYBOARD_DATA", "键盘",   "json"),
    "data-laptop.js":   ("LAPTOP_DATA",   "笔记本", "json"),
    "data-earphone.js": ("EARPHONE_DATA", "耳机",   "json"),
    "data-monitor.js":  ("MONITOR_DATA",  "显示器", "json"),
    "data-ac.js":       ("AC_DATA",       "空调",   "json"),
    "data-robot.js":    ("ROBOT_DATA",    "扫地机", "json"),
}


def node_bin() -> str:
    """找可用的 node（优先托管版本，回退 PATH）。"""
    managed = "/Users/tornadoli/.workbuddy/binaries/node/versions/22.12.0/bin/node"
    if os.path.exists(managed):
        return managed
    return "node"


# ---------------------------------------------------------------------------
# 数据读取
# ---------------------------------------------------------------------------
def load_data(filepath: str, const_name: str):
    """用 node 求值数据文件，拿到产品数组。"""
    script = (
        'const fs=require("fs");'
        f'const code=fs.readFileSync({json.dumps(filepath)},"utf8");'
        f'const arr=new Function(code+"\\nreturn {const_name};")();'
        'console.log(JSON.stringify(arr));'
    )
    out = subprocess.check_output([node_bin(), "-e", script], stderr=subprocess.PIPE)
    return json.loads(out.decode("utf-8"))


# ---------------------------------------------------------------------------
# 定点价格替换
# ---------------------------------------------------------------------------
def locate_block(text: str, pid: str):
    """定位产品 id 所在对象的 [start, end) 字符区间。找不到返回 None。"""
    # 兼容 "id": "x" / "id":"x" / id: "x"
    m = re.search(r'"?id"?\s*:\s*"' + re.escape(pid) + r'"', text)
    if not m:
        return None
    # 向前找该对象的起始 {
    start = text.rfind("{", 0, m.start())
    if start < 0:
        return None
    # 括号配平找闭合（忽略字符串内的花括号）
    depth, i, in_str, esc = 0, start, False, False
    while i < len(text):
        ch = text[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
        else:
            if ch == '"':
                in_str = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return (start, i + 1)
        i += 1
    return None


def patch_price_json(text: str, pid: str, new_price: int):
    """JSON 风格：替换 "prices": {"jd": N} 里的 N。返回 (新文本, 是否成功)。"""
    span = locate_block(text, pid)
    if not span:
        return text, False
    s, e = span
    block = text[s:e]
    new_block, n = re.subn(r'("jd"\s*:\s*)\d+', lambda m: m.group(1) + str(new_price),
                           block, count=1)
    if n == 0:
        return text, False
    return text[:s] + new_block + text[e:], True


def patch_price_js(text: str, pid: str, new_price: int, default_storage: str = ""):
    """JS 风格（phone-data.js）：替换 defaultStorage 对应档位的 priceJd。"""
    span = locate_block(text, pid)
    if not span:
        return text, False
    s, e = span
    block = text[s:e]

    if default_storage:
        # 精确定位 { storage: "256GB", priceJd: N, ... } 这一档
        pat = (r'(storage\s*:\s*"' + re.escape(default_storage) +
               r'"[^}]*?priceJd\s*:\s*)\d+')
        new_block, n = re.subn(pat, lambda m: m.group(1) + str(new_price), block, count=1)
        if n:
            return text[:s] + new_block + text[e:], True

    # 回退：替换块内第一个 priceJd
    new_block, n = re.subn(r'(priceJd\s*:\s*)\d+', lambda m: m.group(1) + str(new_price),
                           block, count=1)
    if n == 0:
        return text, False
    return text[:s] + new_block + text[e:], True


def current_price(item: dict, style: str) -> int:
    """读取产品当前的京东价，兼容两种数据结构。"""
    if style == "json":
        return int((item.get("prices") or {}).get("jd", 0) or 0)
    opts = item.get("storageOptions") or []
    if not opts:
        return 0
    default = item.get("defaultStorage", "")
    hit = next((o for o in opts if o.get("storage") == default), opts[0])
    return int(hit.get("priceJd", 0) or 0)


# ---------------------------------------------------------------------------
# 自测（无需 API Key）
# ---------------------------------------------------------------------------
def self_test() -> int:
    """验证定点替换逻辑正确，且不破坏文件其余内容。"""
    print("=" * 56)
    print("自测：定点价格替换（不调用 API，不修改任何文件）")
    print("=" * 56)
    fails = 0

    def check(name, cond):
        nonlocal fails
        print(("  ✓ " if cond else "  ✗ ") + name)
        if not cond:
            fails += 1

    # 1. JSON 风格
    sample_json = '''const TABLET_DATA = [
  {
  "id": "ipad-pro-13-m4",
  "brand": "苹果",
  "prices": {
    "jd": 8999,
    "pdd": 8699
  },
  "tags": ["旗舰"]
},
  {
  "id": "mate-pad-pro",
  "prices": {
    "jd": 4999,
    "pdd": 4799
  }
}
];
'''
    out, ok = patch_price_json(sample_json, "ipad-pro-13-m4", 7899)
    check("JSON 风格：命中目标产品", ok)
    check("JSON 风格：jd 已更新为 7899", '"jd": 7899' in out)
    check("JSON 风格：pdd 保持不变", '"pdd": 8699' in out)
    check("JSON 风格：未误改其他产品", '"jd": 4999' in out)
    check("JSON 风格：其余字节零改动",
          len(out) - len(sample_json) == len("7899") - len("8999"))

    # 2. JS 风格 + 多存储档位
    sample_js = '''const PHONE_DATA = [
  {
    id: "iphone-16-pro",
    brand: "苹果",
    defaultStorage: "256GB",
    storageOptions: [
      { storage: "128GB", priceJd: 7999, pricePdd: 7799 },
      { storage: "256GB", priceJd: 8999, pricePdd: 8799 }
    ]
  }
];
function getPhoneById(id) { return PHONE_DATA.find(p => p.id === id); }
'''
    out2, ok2 = patch_price_js(sample_js, "iphone-16-pro", 8499, "256GB")
    check("JS 风格：命中目标产品", ok2)
    check("JS 风格：只改 defaultStorage(256GB) 档",
          "priceJd: 8499" in out2 and "priceJd: 7999" in out2)
    check("JS 风格：128GB 档未被误改", '{ storage: "128GB", priceJd: 7999' in out2)
    check("JS 风格：尾部 helper 函数保留", "function getPhoneById" in out2)

    # 3. 找不到的 id 应安全返回
    out3, ok3 = patch_price_json(sample_json, "not-exist", 1)
    check("不存在的 id：安全跳过且不改文件", (not ok3) and out3 == sample_json)

    # 4. 真实文件上做只读演练
    real = os.path.join(ROOT, "data-tablet.js")
    if os.path.exists(real):
        txt = open(real, encoding="utf-8").read()
        items = load_data(real, "TABLET_DATA")
        pid = items[0]["id"]
        old = current_price(items[0], "json")
        patched, ok4 = patch_price_json(txt, pid, old + 1)
        check(f"真实文件 data-tablet.js：定位 {pid} 成功", ok4)
        check("真实文件：仅 1 处字节变化",
              sum(1 for a, b in zip(txt, patched) if a != b) <= len(str(old + 1)))
        check("真实文件：未写回磁盘", open(real, encoding="utf-8").read() == txt)

    print("-" * 56)
    print(f"自测结果：{'全部通过' if fails == 0 else str(fails) + ' 项失败'}")
    return 1 if fails else 0


# ---------------------------------------------------------------------------
# 主流程
# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="用京东联盟 API 批量刷新产品价格")
    ap.add_argument("--only", help="只处理指定数据文件，如 data-tablet.js")
    ap.add_argument("--dry-run", action="store_true", help="预览差异，不写文件")
    ap.add_argument("--delay", type=float, default=0.3, help="请求间隔秒数（默认0.3，QPS限5）")
    ap.add_argument("--limit", type=int, default=0, help="每个品类最多处理几款（调试用）")
    ap.add_argument("--max-drop", type=float, default=60.0,
                    help="价格跌幅超过该百分比则跳过（防抓到配件/翻新，默认60%%）")
    ap.add_argument("--self-test", action="store_true", help="自测替换逻辑，无需 API Key")
    args = ap.parse_args()

    if args.self_test:
        sys.exit(self_test())

    from jd_client import refresh_product_price, JdError   # 延迟导入，自测时不需要凭据

    if args.only and args.only not in DATA_FILES:
        print(f"未知文件：{args.only}\n可选：{', '.join(DATA_FILES)}")
        sys.exit(1)
    targets = {args.only: DATA_FILES[args.only]} if args.only else DATA_FILES

    total_ok = total_fail = total_written = total_skip = 0
    perm_warned = False

    for fname, (const, label, style) in targets.items():
        path = os.path.join(ROOT, fname)
        if not os.path.exists(path):
            continue

        try:
            items = load_data(path, const)
        except Exception as e:
            print(f"跳过 {fname}：无法解析（{e}）")
            continue

        if args.limit:
            items = items[:args.limit]

        print(f"\n{'=' * 56}")
        print(f"{label}  {fname}  共 {len(items)} 款")
        print("=" * 56)

        text = open(path, encoding="utf-8").read()
        patched_count = 0

        for i, item in enumerate(items, 1):
            pid = item.get("id", "?")
            old = current_price(item, style)

            r = refresh_product_price(
                item.get("brand", ""), item.get("model", ""),
                sku_id=str(item.get("skuId", "") or ""),
            )
            time.sleep(args.delay)

            if not r.get("ok"):
                total_fail += 1
                if r.get("need_permission") and not perm_warned:
                    print("\n  ⚠ 关键词搜索无权限。两个选择：")
                    print("    a) 去联盟后台申请 jd.union.open.goods.query（1-3工作日）")
                    print("    b) 给产品补 skuId 字段，走免权限的按SKU查价通道")
                    print("    详见 docs/JD_UNION_SETUP.md\n")
                    perm_warned = True
                print(f"  [{i:>3}/{len(items)}] ✗ {pid:<26} {r.get('error', '')[:44]}")
                continue

            new = int(round(r["jd_price"]))
            total_ok += 1

            if new <= 0 or old <= 0:
                print(f"  [{i:>3}/{len(items)}] - {pid:<26} 价格无效，跳过")
                total_skip += 1
                continue

            pct = (new - old) / old * 100
            # 跌幅过大通常是搜到了配件/保护壳/翻新机，宁可不改
            if pct < -args.max_drop:
                total_skip += 1
                print(f"  [{i:>3}/{len(items)}] ⚠ {pid:<26} ¥{old} → ¥{new} "
                      f"({pct:+.0f}%) 疑似匹配错误，跳过")
                continue

            if new == old:
                print(f"  [{i:>3}/{len(items)}] = {pid:<26} ¥{old}")
                continue

            if style == "json":
                text, done = patch_price_json(text, pid, new)
            else:
                text, done = patch_price_js(text, pid, new, item.get("defaultStorage", ""))

            flag = " ⚠" if abs(pct) > 15 else ""
            print(f"  [{i:>3}/{len(items)}]{flag} {pid:<26} ¥{old} → ¥{new} ({pct:+.1f}%)"
                  + ("" if done else "  [替换失败]"))
            if done:
                patched_count += 1

        if patched_count and not args.dry_run:
            bak = f"{path}.bak.{int(time.time())}"
            shutil.copy2(path, bak)
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
            # 写完立刻验证语法，坏了就自动回滚
            try:
                subprocess.check_call([node_bin(), "--check", path],
                                      stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"  已写入 {patched_count} 条  备份 → {os.path.basename(bak)}")
                total_written += patched_count
            except subprocess.CalledProcessError:
                shutil.copy2(bak, path)
                print(f"  ✗ 写入后语法校验失败，已自动回滚（备份 {os.path.basename(bak)}）")
        elif patched_count:
            print(f"  [DRY-RUN] 将更新 {patched_count} 条（未写入）")

    print(f"\n{'=' * 56}")
    print(f"完成：成功 {total_ok} / 失败 {total_fail} / 跳过 {total_skip} / 已写入 {total_written}")
    if args.dry_run:
        print("[--dry-run] 未修改任何文件")


if __name__ == "__main__":
    main()
