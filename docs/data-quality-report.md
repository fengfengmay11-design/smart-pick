# Data Quality Report — V2 数据库质量（Step 4 + Step 5）

**更新时间**：2026-08-07
**数据源**：`database/v2/*`
**校验脚本**：`migration/validate-db.js` → `validation-result.json`
**Step 5 清洗脚本**：`migration/step5-clean.js`（可复现）

---

## 1. 总体规模

| 表 | 记录数 | 备注 |
|----|-------|------|
| Product | 659 | 无增减 |
| Brand | 67 | 别名零重复/零碰撞 |
| Category | 64 | 10 L1 / 41 L2 / 13 L3 |
| ProductVariant | 246 | 手机容量变体 |
| Price | 1624 | JD/PDD 独立 |
| ProductSpecs | 659 | 单位结构化 |
| Series | 22 | 仅手机 |
| Tag | 528 | Step 5 合并 `miniled`→`mini_led`（529→528） |
| ParameterSchema | 13 | Step 5 由空占位填充为真实字段集 |

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

## 3. 数据完整度（data_completeness，Step 5 起可真实计算）

- **平均完整度：98.1%**
- 分布：100% → 583 款；80–99% → 45 款；50–79% → 31 款；<50% → 0 款
- 计算口径：按各品类 `ParameterSchema` 字段集，已填字段数 / 字段总数 × 100。
- 与 Step 4 的差异：Step 4 报告中的「100%」是基于占位 Schema 的假设值；Step 5 填充真实字段集后，完整度才具备实际意义。

---

## 4. 数据可信度（data_confidence，Step 5）

| 等级 | 数量 | 判定 |
|------|------|------|
| high | 74 | 有图片 且 完整度 ≥ 80% |
| medium | 585 | 完整度 ≥ 50% 或 有图片 |
| low | 0 | 完整度 < 50% |
| unknown | 0 | — |

> 全部标记 `data_source: migration_legacy`（由 V1 整理数据迁移，诚实溯源，未自动设为 high）。

---

## 5. 图片缺失

- **缺失图片产品：585 / 659（约 89%）**
- 仅手机品类多数带 `image` CDN 链接；其余 12 品类图片字段为空。
- 属历史数据缺口，**非迁移丢失**。建议 Step 5 之后批量补全主流品类产品图。

---

## 6. 零值参数（警告项，非错误）

- 数值为 0 的规格字段：**366 处**，全部为真实零值，非脏数据：
  - `tensor_cores: 0` — 148 处（AMD 显卡本无张量核心）
  - `rt_cores: 0` — 104 处（AMD 显卡本无光追核心）
  - `vram/memory_bus/memory_bandwidth: 0` — 各 34 处（入门/核显型号）
  - `rops: 0` — 11 处；`water_tank: 0` — 1 处

---

## 7. 参数单位与字段规范化（Step 5）

- 所有数值参数保持 `{value, unit, display_value, original_value}` 结构。
- **跨品类字段语义分裂（已记录，未强行统一，见 `parameter-key-mapping.json`）**：
  - `battery`：laptop/cleaning_robot = 容量(mAh) 结构化；earphone/keyboard/smartwatch/tablet = 续航时长字符串（`6h+30h`、`约10小时`、`约14天`、`续航数月`/`无`）。二者不同义，按 §27 保留原值并标记 `needs_review`。
  - `screen`：laptop/tablet 等为组合字符串；smartphone 拆分为 `screen_size/screen_resolution/screen_material/screen_type/screen_refresh_rate`。
  - `body_weight`(smartphone) ↔ `weight`(其他)：同义，schema 各自独立。
- `parameter-schemas.json`：13 个有 spec 的品类填入标准字段集；其他品类通过 `schema_family` 继承最近祖先 schema。

---

## 8. 标签规范化（Step 5）

- 合并明确同义：`miniled` → `mini_led`（仅分隔符差异），产品引用同步更新。
- 保守填充 `tag_aliases`（可加性，用于搜索归一）：flagship↔旗舰、gaming↔游戏/电竞、oled↔OLED、miniled↔Mini-LED、高刷↔高刷新率 等。
- 修复跨产品 alias 碰撞：`vivo-pad3-pro` 的裸别名 `Pad3Pro` 加品牌前缀，消除与 `oppo-pad3-pro` 的碰撞（剩余碰撞 0）。
- **遗留（待用户决策）**：标签空间混入大量「规格型 token」——`8gb`/`16gb`/`0gb`（RAM 容量）、`geforce_40`/`rdna_2_0`（GPU 架构）、`zen_5`/`raptor_lake`（CPU 架构）。这些是规格属性泄漏进标签，是否迁移到 specs/series 需建模决策，Step 5 未擅自改动。

---

## 9. 品牌与别名

- 67 品牌均映射为稳定 `brand_id`，含 `brand_name_cn/en/aliases`。
- Step 5 审计：0 重复别名 / 0 跨品牌碰撞 / 0 重复 brand_id（无需改动）。

---

## 10. 校验结果（validate-db.js）

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

Adapter 旧前端等价校验：`legacy_products=659 / phone_variants=246 / price_records=1624` 全部 match=true。

---

## 11. 待改进项（非阻断）

| 项 | 现状 | 建议 |
|----|------|------|
| 图片缺失 | 585/659 无图 | Step 5 后批量补全 |
| 标签中的规格型 token | 约 200+ 个 RAM/架构 token | 用户决策是否迁移至 specs |
| 非电子品类 | 空调/扫地机器人 80 款 | 已标 secondary，不扩充 |
| series 覆盖 | 仅手机 22 个 | 其他品类待明确后补 |
| `value`(40)/`ampere`(26) 等疑似误标标签 | 需人工复核语义 | Step 6 前人工确认 |

> 以上均不阻断 Step 4 / Step 5 验收。数据库结构已规范化、可扩展、可回滚。
