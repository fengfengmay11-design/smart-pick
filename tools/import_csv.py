#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSV → data-<cat>.js 导入工具
============================
把一份 CSV（含必填字段 + 一个 specs JSON 列）转换成项目里 data-*.js 可用的
`const X_DATA = [ ... ];` 格式，与现有 data-ac.js / data-gpu.js 完全同构。

用法：
    python tools/import_csv.py --csv tools/templates/tablet.csv \
                               --out data-tablet.js --const TABLET_DATA

字段说明见 tools/SCHEMA.md。

设计原则：
- 纯本地、零依赖（只用标准库 csv / json / argparse）
- 强校验：必填项、id 唯一、价格/热度数值合法、specs 可解析
- 不改现有数据文件，输出是全新文件，方便 git diff 审查
- 中文不转义（ensure_ascii=False），方便人工核对
"""

import argparse
import csv
import json
import os
import sys


# 所有品类共用的必填字段
REQUIRED = ["id", "brand", "model", "launchDate", "popularity", "sales",
            "price_jd", "price_pdd", "specs", "tags", "lastVerified"]

# 数值型字段（需能转 int）
INT_FIELDS = ["popularity", "sales", "price_jd", "price_pdd"]

# 布尔字段
BOOL_FIELDS = ["priceDrop"]


def die(msg):
    print("❌ " + msg, file=sys.stderr)
    sys.exit(1)


def parse_row(row, line_no):
    """把 CSV 一行转成目标 dict，并做单条校验。"""
    # 必填检查
    for f in REQUIRED:
        if f not in row or str(row.get(f, "")).strip() == "":
            die(f"第 {line_no} 行缺少必填字段 `{f}`：{row}")

    out = {}
    out["id"] = row["id"].strip()
    out["brand"] = row["brand"].strip()
    out["model"] = row["model"].strip()
    out["image"] = row.get("image", "").strip()
    out["launchDate"] = row["launchDate"].strip()

    # 数值字段
    for f in INT_FIELDS:
        try:
            out[f] = int(str(row[f]).strip())
        except ValueError:
            die(f"第 {line_no} 行 `{f}` 不是合法整数：{row[f]!r}")
    # 热度/销量应在 0-100 区间（便于打分引擎使用）
    for f in ("popularity", "sales"):
        if not (0 <= out[f] <= 100):
            die(f"第 {line_no} 行 `{f}` 应在 0~100：{out[f]}")

    # 布尔字段
    pd = str(row.get("priceDrop", "false")).strip().lower()
    out["priceDrop"] = pd in ("1", "true", "yes", "y", "是")

    # 价格
    out["prices"] = {"jd": out.pop("price_jd"), "pdd": out.pop("price_pdd")}
    if out["prices"]["jd"] <= 0 and out["prices"]["pdd"] <= 0:
        die(f"第 {line_no} 行 京东/拼多多价格不能都为 0")

    # specs JSON
    specs_raw = row["specs"].strip()
    try:
        specs = json.loads(specs_raw)
    except json.JSONDecodeError as e:
        die(f"第 {line_no} 行 `specs` 不是合法 JSON：{e}\n  内容：{specs_raw[:120]}")
    if not isinstance(specs, dict):
        die(f"第 {line_no} 行 `specs` 必须是 JSON 对象")
    out["specs"] = specs

    # tags：分号分隔
    tags_raw = row.get("tags", "").strip()
    out["tags"] = [t.strip() for t in tags_raw.split(";") if t.strip()] if tags_raw else []

    out["officialUrl"] = row.get("officialUrl", "").strip()
    out["lastVerified"] = row["lastVerified"].strip()

    return out


def main():
    ap = argparse.ArgumentParser(description="CSV → data-*.js 导入工具")
    ap.add_argument("--csv", required=True, help="输入 CSV 路径")
    ap.add_argument("--out", required=True, help="输出 JS 文件路径，如 data-tablet.js")
    ap.add_argument("--const", required=True, help="JS 常量名，如 TABLET_DATA")
    args = ap.parse_args()

    if not os.path.exists(args.csv):
        die(f"找不到 CSV 文件：{args.csv}")

    items = []
    seen_ids = set()
    with open(args.csv, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            die("CSV 为空或无法解析表头")
        for i, row in enumerate(reader, start=2):  # 第 1 行是表头
            item = parse_row(row, i)
            if item["id"] in seen_ids:
                die(f"第 {i} 行 id 重复：{item['id']}")
            seen_ids.add(item["id"])
            items.append(item)

    if not items:
        die("CSV 中没有有效数据行")

    # 生成 JS：与现有 data-*.js 完全同构（双引号 JSON + 缩进 2）
    js = "const " + args.const + " = [\n"
    blocks = []
    for it in items:
        blocks.append("  " + json.dumps(it, ensure_ascii=False, indent=2))
    js += ",\n".join(blocks)
    js += "\n];\n"

    out_dir = os.path.dirname(os.path.abspath(args.out))
    os.makedirs(out_dir, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(js)

    print(f"✅ 已生成 {args.out}（{len(items)} 款，常量名 {args.const}）")


if __name__ == "__main__":
    main()
