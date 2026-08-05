# -*- coding: utf-8 -*-
"""
fix_indent.py — 重建 phone-data.js，使新增机型与原有 74 款缩进风格一致（2 空格基准 + 4 空格属性）

原理：
  - 当前文件 = 原 74 款 + 已插入的 19 款（旧版 2 空格缩进）+ helper 函数
  - 本脚本定位 19 款新机型的起始 `{` 行，截取其前的「原数组部分」，再按新缩进重排 19 款后闭合 `];`，并接回 helper 函数
  - 依赖 gen_phone_append 的 NEW_PHONES 与 to_js（已调整为 2 空格基准）
"""
import sys
sys.path.insert(0, '.')
from gen_phone_append import NEW_PHONES, to_js

PATH = "phone-data.js"
with open(PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()

# 新机型块起点：第一个 oneplus-13 对象的 `{` 行
idx_obj = None
for i, ln in enumerate(lines):
    if 'id: "oneplus-13"' in ln:
        idx_obj = i
        break
if idx_obj is None:
    raise SystemExit("未找到新增机型起点，可能已修复或结构变化")

# 向上找到对象开括号 `{`
block_start = idx_obj - 1
while block_start > 0 and lines[block_start].strip() != '{':
    block_start -= 1

# 数组闭合 `];`（文件末尾最后一个）
last_close = None
for i in range(len(lines) - 1, -1, -1):
    if lines[i].strip() == '];':
        last_close = i
        break
if last_close is None:
    raise SystemExit("未找到数组闭合 ];")

original_arr = "".join(lines[:block_start]).rstrip()
# 去掉旧插入分隔符可能残留的尾部逗号，避免产生空数组槽位
while original_arr.endswith(','):
    original_arr = original_arr[:-1].rstrip()
helpers = "".join(lines[last_close + 1:]).lstrip("\n")

joined = ",\n\n".join(to_js(p) for p in NEW_PHONES)
new_content = original_arr + ",\n\n" + joined + "\n];\n\n" + helpers

with open(PATH, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"重建完成：原数组({block_start} 行) + 19 款(新缩进) + helpers，共 {len(NEW_PHONES)} 款新增。")
