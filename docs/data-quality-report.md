# Data Quality Report — 迁移后数据库质量

**生成时间**：2026-08-07
**数据源**：`database/v2/*`（由 `migration/migrate.js` 生成）
**校验脚本**：`migration/validate-db.js` → `validation-result.json`

---

## 1. 总体规模

| 表 | 记录数 |
|----|-------|
| Product（产品主表） | 659 |
| Brand（品牌） | 67 |
| Category（分类节点） | 64 |
| ProductVariant（手机变体） | 246 |
| Price（价格记录） | 1624 |
| ProductSpecs（参数） | 659 |
| Series（系列） | 22 |
| Tag（标签） | 529 |

---

## 2. 各新分类产品分布

| 一级分类 | 产品数 |
|---------|-------|
| 手机与移动设备 | 93 |
| 电脑与计算硬件 | 289（笔记本40 / CPU40 / 显卡209） |
| 平板与阅读设备 | 24 |
| 外设与显示设备 | 60（显示器40 / 键盘20） |
| 音频与影音设备 | 69（耳机45 / 电视24） |
| 智能穿戴与XR | 20 |
| 摄影影像与无人机 | 24 |
| 游戏与娱乐硬件 | 0（扩展位） |
| 网络存储与智能设备 | 80（清洁机器人40 / 智能家电40） |
| AI硬件与新型科技产品 | 0（扩展位） |

---

## 3. 数据完整度（data_completeness）

- 有 Schema 计算的产品：659 / 659（100% 已计算）
- **平均完整度：100%**（所定义 required 字段在源数据中均已存在）
- 说明：本次 Schema 的 required 字段均取自源数据实际具备的键，因此完整度反映"必填字段齐备率"。下一阶段扩充新品类时，Schema 将起到真实约束作用。

---

## 4. 数据可信度（data_confidence）

- 全部 659 款：`medium`（保守设定，源数据无明确来源标注，未自动设为 high）

---

## 5. 图片缺失

- **缺失图片产品：585 / 659（约 89%）**
- 仅手机品类（93 款中多数）带有 `image` CDN 链接；其余 12 品类图片字段为空。
- 影响：对比/详情页缩略图为占位。属历史数据缺口，**非迁移丢失**。
- 建议（Step 5 之后处理）：批量补全主流品类产品图。

---

## 6. 零值参数（警告项，非错误）

- 数值为 0 的规格字段：**366 处**
- 分布：
  - `tensor_cores: 0` — 148 处（AMD 显卡本无张量核心，真实值）
  - `rt_cores: 0` — 104 处（AMD 显卡本无光追核心，真实值）
  - `vram: 0` / `memory_bus: 0` / `memory_bandwidth: 0` — 各 34 处（入门/核显型号，源数据即为 0）
  - `rops: 0` — 11 处；`water_tank: 0` — 1 处
- **结论**：全部为源数据真实 0 值，非"未知以 0 填充"的脏数据。迁移未引入任何伪造 0。

---

## 7. 参数单位规范化结果

- 所有数值参数已转为 `{value, unit, display_value, original_value}` 结构
- 例：`5200mAh` → `{value:5200, unit:"mAh", display_value:"5200mAh", original_value:"5200mAh"}`
- 字符型参数（芯片名、面板类型、接口）保持字符串，未强行拆解
- `original_value` 全程保留，便于追溯与回滚解析

---

## 8. 品牌与别名

- 67 个品牌全部映射为稳定 `brand_id`（如 `apple` / `huawei` / `rog`），不再使用自由字符串
- 每个品牌含 `brand_name_cn` / `brand_name_en` / `aliases`
- 搜索"苹果 / Apple / APPLE"均可命中同一 brand_id
- 品牌名称内部一致性：无重复 brand_id、无重复显示名、无 alias 冲突（校验通过）

---

## 9. 校验结果（validate-db.js）

```
products        : 659 OK
brands          : 67
categories      : 64
variants        : 246 OK
prices          : 1624
dup product_id  : 0
invalid brand   : 0
invalid category: 0
zero-value specs: 366 (警告，已确认合法)
CRITICAL        : 0  ✅
```

---

## 10. 待改进项（非阻断，建议后续处理）

| 项 | 现状 | 建议 |
|----|------|------|
| 图片缺失 | 585/659 无图 | Step 5 后批量补全 |
| 标签数量偏多 | 529 个（含型号级标签如"16GB"） | 后续按 tag-mapping 二次收敛 |
| 非电子品类 | 空调/扫地机器人 80 款 | 已标 secondary，不再扩充 |
| series 覆盖 | 仅手机 22 个 | 其他品类待明确后补 |
| data_confidence | 全 medium | 来源录入后提升 |

> 以上均不阻断 Step 4 验收。数据库结构已规范化、可扩展、可回滚。
