# Migration Report — Step 4 数据库规范化迁移

**执行时间**：2026-08-07
**分支**：`db-normalization`（从 `main` 切出，main 保持迁移前状态）
**基线文件**：`migration-baseline.json`
**迁移脚本**：`migration/migrate.js`、`migration/validate-db.js`、`migration/db-adapter.js`
**配置目录**：`migration/config/`（brand-mapping / category-mapping / tag-mapping / unit-rules）

---

## 1. 迁移前后数量对比

| 指标 | 迁移前(基线) | 迁移后(V2) | 状态 |
|------|-------------|-----------|------|
| 产品 Products | 659 | 659 | ✅ 一致 |
| 品牌 Brands | 67 | 67（标准化为 brand_id） | ✅ 一致 |
| 分类 Categories | 13（扁平） | 64（10 个一级 + 二三级树） | 重构 |
| 手机变体 Variants | 246 | 246 | ✅ 一致 |
| 价格记录 Prices | 1624 | 1624 | ✅ 一致 |
| Series | 0 | 22（手机可识别系列） | 新增 |
| Tags | 散落字符串 | 529（归一化） | 重构 |
| 重复 product_id | — | 0 | ✅ |
| 无效 brand 引用 | — | 0 | ✅ |
| 无效 category 引用 | — | 0 | ✅ |
| Critical 校验错误 | — | 0 | ✅ |

---

## 2. 旧 13 分类 → 新分类树映射

| 旧分类 | 产品数 | 新 category_id | 新分类路径 | 优先级 |
|--------|-------|----------------|-----------|--------|
| phone | 93 | smartphone | 手机与移动设备 / 智能手机 | core |
| laptop | 40 | laptop | 电脑与计算硬件 / 电脑整机 / 笔记本 | core |
| cpu | 40 | cpu | 电脑与计算硬件 / PC核心硬件 / CPU | core |
| gpu | 209 | gpu | 电脑与计算硬件 / PC核心硬件 / 显卡 | core |
| tablet | 24 | tablet | 平板与阅读设备 / 平板电脑 | core |
| monitor | 40 | monitor | 外设与显示设备 / 显示器 | core |
| keyboard | 20 | keyboard | 外设与显示设备 / 键盘 | core |
| earphone | 45 | earphone | 音频与影音设备 / 耳机 | core |
| tv | 24 | tv | 音频与影音设备 / 电视 | core |
| watch | 20 | smartwatch | 智能穿戴与XR / 智能手表 | core |
| camera | 24 | camera | 摄影影像与无人机 / 相机 | core |
| robot | 40 | cleaning_robot | 网络存储与智能设备 / 智能设备 / 清洁机器人 | **secondary** |
| ac | 40 | smart_appliance | 网络存储与智能设备 / 智能设备 / 智能家电 | **secondary** |

> 空调(40) + 扫地机器人(40) 按既定决策**保留不删**，迁入 `secondary` 兼容性分类，未来不重点扩充。
> `游戏与娱乐硬件`、`AI硬件与新型科技产品` 两个一级分类当前无产品映射（扩展位），符合预期。

---

## 3. 迁移统计

- 自动迁移产品：**659 / 659（100%）**
- 需人工复核（needs_review）：**0**（无解析歧义，所有单价参数均成功规范化）
- 单位规范化字段：屏幕/机身尺寸、重量、刷新率、RAM、存储、电池容量、充电功率、VRAM、TDP、吸力等全部转为 `{value, unit, display_value, original_value}`
- 品牌创建：67 个 brand_id，均含中英文名 + aliases（如 `苹果/Apple/APPLE`）
- Series 创建：22 个（仅手机可可靠识别，其余品类 series 留空——不臆造）
- 价格记录创建：1624（手机按 storageOption 拆 jd/pdd；其余按 prices.jd/pdd；平台来源独立保留，未取平均）

---

## 4. 本次新增/修改文件清单

**新增（V2 新库，旧 data-*.js 未动）：**
- `database/v2/categories.json` — 64 节点分类树
- `database/v2/brands.json` — 67 标准化品牌
- `database/v2/series.json` — 22 系列
- `database/v2/tags.json` — 529 归一化标签
- `database/v2/products.json` — 659 产品主表
- `database/v2/product-specs.json` — 参数（含单位结构化）
- `database/v2/product-variants.json` — 246 手机容量变体
- `database/v2/prices.json` — 1624 价格记录
- `database/v2/parameter-schemas.json` — 13 品类参数 Schema（用于完整度计算）

**新增（迁移工具与配置）：**
- `migration/migrate.js`、`migration/validate-db.js`、`migration/db-adapter.js`
- `migration/config/brand-mapping.json`、`category-mapping.json`、`tag-mapping.json`、`unit-rules.json`
- `migration-baseline.json`（迁移前基准）
- `docs/migration-report.md`、`docs/data-quality-report.md`

**备份（未修改原始数据）：**
- `backup/pre-migration/`（13 个原始 data 文件物理副本）
- `db-normalization` 分支（main 仍为迁移前干净状态）

---

## 5. needs_review 列表

**本期无需人工复核项。** 所有产品均成功自动迁移，无单位解析失败、无品牌/分类悬空引用。
（后续若新增来源不可靠数据，迁移脚本会自动将该产品 `needs_review=true` 并写入清单。）

---

## 6. 回滚方式

若发现问题需回退到迁移前：

```bash
# 方式 A：切回 main（迁移前干净状态，V2 文件在分支上不影响 main）
git checkout main

# 方式 B：保留分支但放弃本次改动
git checkout db-normalization
git reset --hard <迁移前 commit>   # 见下方 pre-migration hash

# 物理备份始终在 backup/pre-migration/，可随时手动还原
```

**pre-migration commit hash**：本次迁移所有改动均提交在 `db-normalization` 分支；`main` 分支指向的即为迁移前状态，可直接 `git checkout main` 一键恢复旧前端运行环境。

---

## 7. 验收结论

满足 Step 4 全部硬性验收标准：

```
Products = 659          ✅
Duplicate product_id = 0 ✅
Invalid brand reference = 0 ✅
Invalid category reference = 0 ✅
Critical validation error = 0 ✅
Phone variants = 246    ✅
旧前端核心功能：V2 经 db-adapter 可完整重建 659/246/1624，等价 ✅
```

**Step 4 完成，未进入 Step 5（扩库）。** 等待确认数据库迁移质量后，再启动 Step 5：品牌覆盖分析与产品扩充。
