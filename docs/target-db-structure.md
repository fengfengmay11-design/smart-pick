# B. 目标数据库结构设计

> Step 3 设计文档 · 仅设计不改动数据
> 形态：静态站点（GitHub Pages / anydev）无 SQL，采用 **JS 模块 + 纯对象** 存储，等价于关系表；通过 `id` 外键关联。所有表集中在 `data/` 目录，前端经 `db-adapter.js` 适配层访问。

---

## 一、实体关系（ER）

```
Brand (brand_id)
  │ 1
  ├─┐
  │ │ Series (series_id, brand_id)
  │ │   │ 1
  │ │   └─┐
  │ │      │ 1
  ▼ ▼      ▼
Product (product_id, brand_id, primary_category_id, series_id?, tags[])
  │ 1
  ├─┬─ ProductVariant (variant_id, product_id)        ← 手机容量/颜色等
  │ │       │ 1
  │ │       └─ Price (price_id, variant_id?|product_id, channel)
  │ │
  │ └─ ProductSpecs (product_id, schema_id, specs{})
  │         │ 1
  │         └─ ParameterSchema (schema_id, category_id, fields[])
  │
  └─ DataSource (source_id, type, url, last_verified_at)

Category (category_id, level, parent_id, priority)
Tag (tag_id, aliases[])
Alias (内嵌于各表 aliases[]，构建搜索索引)
MissingProduct (query, predicted_*, request_count, status)
```

---

## 二、各表字段定义

### 1. Brand 品牌表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `brand_id` | string(slug) | ✅ | 主键，如 `apple` |
| `brand_name` | string | ✅ | 规范名，如 `Apple` |
| `brand_name_cn` | string | ⬜ | 中文名，如 `苹果` |
| `brand_name_en` | string | ⬜ | 英文名（同 brand_name 时可为空） |
| `aliases` | string[] | ⬜ | 别名：`Apple`/`apple`/`APPLE`/`苹果`（搜索归一） |
| `country` | string | ⬜ | 国家/地区 |
| `logo` | string(url) | ⬜ | Logo 地址 |
| `official_url` | string | ⬜ | 官网 |
| `status` | enum | ✅ | `active`/`legacy` |

### 2. Category 分类表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `category_id` | string(slug) | ✅ | 主键，如 `gpu` |
| `name` | string | ✅ | 显示名 |
| `level` | 1\|2\|3 | ✅ | 层级 |
| `parent_id` | string\|null | ✅ | 上级 category_id，L1 为 null |
| `slug` | string | ✅ | URL 友好 |
| `priority` | enum | ✅ | `core`/`secondary`/`legacy` |
| `schema_ref` | string | ⬜ | 关联 ParameterSchema.schema_id |
| `description` | string | ⬜ | |
| `status` | enum | ✅ | `active`/`archived` |

### 3. Series 系列表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `series_id` | string | ✅ | 主键 |
| `brand_id` | string(FK) | ✅ | 归属品牌 |
| `name` | string | ✅ | 系列名，如 `iPhone` |
| `category_id` | string(FK) | ⬜ | 主要品类（可选） |
| `description` | string | ⬜ | |

### 4. Product 产品主表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `product_id` | string | ✅ | **主键**（保留旧 id 作稳定 slug，冲突加后缀） |
| `legacy_id` | string | ⬜ | 迁移前原 id，留痕追溯 |
| `brand_id` | string(FK) | ✅ | 关联 Brand |
| `primary_category_id` | string(FK) | ✅ | **唯一主分类** |
| `series_id` | string(FK) | ⬜ | 关联 Series（可空） |
| `generation` | string | ⬜ | 代际，如 `iPhone 17 Series`（可空） |
| `model` | string | ✅ | 型号，如 `iPhone 17 Pro` |
| `variant` | string | ⬜ | 版本后缀，如 `256GB`（可空） |
| `full_name` | string | ✅ | 完整名 `Apple iPhone 17 Pro 256GB` |
| `aliases` | string[] | ⬜ | 搜索别名：`17 Pro`/`17PM`/`苹果17PM` |
| `tags` | string[](tag_id) | ⬜ | 特点标签 `gaming`/`OLED`/`flagship` |
| `release_date` | string(ISO) | ⬜ | 发布日期 |
| `status` | enum | ✅ | `active`/`legacy`/`discontinued`/`archived`/`upcoming` |
| `image` | string(url) | ⬜ | 图片（89% 缺失，允许空） |
| `official_url` | string | ⬜ | |
| `data_completeness` | int(0-100) | ✅ | 核心字段填充率 |
| `data_confidence` | enum | ✅ | `high`/`medium`/`low`（AI提取≠high） |
| `created_at` / `updated_at` | string(ISO) | ✅ | 时间戳 |
| `source_ref` | string(FK) | ⬜ | 数据来源 |

### 5. ProductVariant 变体表（手机容量/颜色等）
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `variant_id` | string | ✅ | 主键 |
| `product_id` | string(FK) | ✅ | 父产品 |
| `attributes` | object | ✅ | `{storage, ram, color, ...}` |
| `status` | enum | ✅ | `active`/`legacy` |

> **手机 storageOptions 不拆成独立产品**，而是 1 个 Product + N 个 ProductVariant（保留 246 个容量-价格组合）。

### 6. Price 价格表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `price_id` | string | ✅ | 主键 |
| `product_id` | string(FK) | ✅ | 关联产品 |
| `variant_id` | string(FK) | ⬜ | 关联变体（手机按容量区分价时填） |
| `channel` | enum | ✅ | `jd`/`pdd`/`official`/`other` |
| `amount` | number | ✅ | 数值（单位元，不存 `"2999元"`） |
| `currency` | string | ✅ | `CNY` |
| `captured_at` | string(ISO) | ⬜ | 抓取时间 |
| `source_url` | string | ⬜ | |

### 7. ProductSpecs 参数表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `product_id` | string(FK) | ✅ | 关联产品 |
| `schema_id` | string(FK) | ✅ | 关联 ParameterSchema |
| `specs` | object | ✅ | 见下方「参数值规范」 |

**参数值规范（关键）**
- 数值型：`{ value: 5200, unit: "mAh", display_value: "5200mAh" }`
- 字符型（芯片/系统/面板/接口）：直接存字符串 `"Snapdragon 8 Gen 4"`
- **未知值用 `null`，绝不用 `0`**（避免评分误判）

### 8. ParameterSchema 参数模板表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `schema_id` | string | ✅ | 主键，如 `schema_phone` |
| `category_id` | string(FK) | ✅ | 适用分类 |
| `fields` | array | ✅ | 字段定义列表 |

`fields[]` 每项：
```
{ key:"battery_capacity", label_cn:"电池容量", type:"number", unit:"mAh",
  required:false, min:0, max:10000, options:null }
{ key:"chipset", label_cn:"处理器", type:"string", unit:null, options:null }
```

### 9. Tag 标签表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `tag_id` | string(slug) | ✅ | 主键，如 `gaming` |
| `name` | string | ✅ | 显示名 `游戏` |
| `aliases` | string[] | ⬜ | `gaming`/`Gaming`/`电竞`/`游戏` 归一 |

### 10. DataSource 来源表
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `source_id` | string | ✅ | 主键 |
| `type` | enum | ✅ | `official`/`manufacturer`/`trusted`/`retailer`/`review`/`manual`/`ai_extracted` |
| `url` | string | ⬜ | 来源链接 |
| `last_verified_at` | string(ISO) | ⬜ | 最近核验 |

### 11. MissingProduct 缺品记录表（搜索驱动补库）
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `query` | string | ✅ | 用户原始搜索词 |
| `predicted_brand` | string | ⬜ | 预测品牌 |
| `predicted_category` | string | ⬜ | 预测分类 |
| `request_count` | int | ✅ | 命中次数（越高越优先补） |
| `first_requested_at` / `last_requested_at` | string | ✅ | |
| `status` | enum | ✅ | `pending`/`filled`/`ignored` |

---

## 三、必填 / 可空 汇总

**必填（缺则阻塞迁移，标记 needs_review）**
`product_id` `brand_id` `primary_category_id` `model` `full_name` `status` `data_completeness` `data_confidence` `created_at`；外键目标必须存在（brand/category/series/schema）。

**可空（允许 null，不阻塞）**
`series_id` `generation` `variant` `aliases` `tags` `release_date` `image` `official_url` `source_ref` `updated_at`。

**参数铁律**：数值存 `{value,unit,display_value}`；未知存 `null` 非 `0`；字符型直接字符串。

---

## 四、存储与访问（静态站点适配）

```
data/
  brands.js          → export const BRANDS = [...]
  categories.js      → export const CATEGORIES_TREE = [...]
  tags.js            → export const TAGS = [...]
  series.js          → export const SERIES = [...]
  schemas.js         → export const SCHEMAS = [...]
  products/
    phone.js laptop.js gpu.js cpu.js monitor.js keyboard.js
    earphone.js tv.js tablet.js camera.js watch.js robot.js ac.js
                      → 每个导出该品类归一化后的 Product[]+Variant[]+Price[]+Specs[]
  missing.js         → export const MISSING = [...]
src/
  db-adapter.js      → 把新结构转回旧前端所需格式（CATEGORIES / getPhoneData 等）
```

前端短期不变，仅把取数切到 `db-adapter`；稳定后逐步直接用新结构。
