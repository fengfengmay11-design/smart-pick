# 当前产品数据库诊断报告（2026-08-07）

> 扫描范围：本地仓库 `phone-compare` 全部 13 个数据文件（13 个扁平品类）
> 扫描方式：Node 脚本全量解析 `PHONE_DATA` / `*-DATA` 数组，逐项统计
> 原则：**只诊断、未修改任何数据**

---

## 〇、总览

| 指标 | 当前值 | 说明 |
|------|--------|------|
| 产品总数 | **659** | 13 个品类之和 |
| 品牌总数（自由字符串） | **67** | 无 brand 表，brand 直接写死在每条产品里 |
| 一级分类数 | **13** | 全部为扁平，无层级 |
| 二级 / 三级分类数 | **0 / 0** | 完全没有层级 |
| 产品图片覆盖率 | **74 / 659（11%）** | 仅手机有图，其余 12 类全空 |
| 参数模板统一性 | **分裂为 2 套** | 手机一套，其余 12 类一套 |
| 单位存储方式 | **字符串内嵌** | "5200mAh""170W""13英寸" 不可计算 |
| 元数据字段 | **0** | 无 status / completeness / confidence / source / aliases |

---

## 一、各分类产品数与品牌数

| 当前 category key | 名称 | 产品数 | 品牌数 | 是否纯电子 |
|-------------------|------|--------|--------|------------|
| phone | 手机 | 93 | 9 | ✅ |
| gpu | 显卡 | 209 | 3 | ✅ |
| ac | 空调 | 40 | 8 | ❌ **家电** |
| robot | 扫地机器人 | 40 | 9 | ⚠️ 边缘（清洁家电） |
| laptop | 笔记本 | 40 | 13 | ✅ |
| cpu | CPU | 40 | 2 | ✅ |
| earphone | 耳机 | 45 | 16 | ✅ |
| monitor | 显示器 | 40 | 14 | ✅ |
| tablet | 平板 | 24 | 8 | ✅ |
| camera | 相机 | 24 | 5 | ✅ |
| tv | 电视 | 24 | 10 | ✅ |
| watch | 智能手表 | 20 | 7 | ✅ |
| keyboard | 机械键盘 | 20 | 8 | ✅ |

> 违反"纯消费电子"定位的品类：**空调（40）+ 扫地机器人（40）= 80 款** 应移出或重分类。
> 纯电子实有 **579 款**。

---

## 二、按你列出的 18 项逐项诊断

### 1. 重复产品（完全相同 id）
**未发现**（重复 id = 0）。✅ 基础唯一性良好。

### 2. 同品牌 + 同型号重复
**未发现**（跨文件 / 同文件 brand+model 重复 = 0）。✅

### 3. 重复品牌（同实体多记录）
**未发现字面重复**。但见第 9 点——跨品类拼写法不统一，缺乏统一 brand_id。

### 4. 同产品中英文名称重复
**未发现**单品类内中英文双写。

### 5. 同型号不同空格 / 大小写
**未发现**（品牌大小写/空格变体组数 = 0）。✅

### 6. 品牌名称重复（Apple/APPLE/苹果）
当前数据集内部无字面分裂。但 **`苹果`（手机/笔记本/耳机/平板/手表）与潜在英文 `Apple` 并未建立映射**——搜索 "Apple" 无法命中中文品牌产品。属"缺品牌表"问题，见第四节。

### 7. 分类名称不统一
无二级/三级，故无此问题；但**一级分类粒度不当**：`机械键盘` 应属"电脑外设→键盘"三级；`空调`/`扫地机器人` 不应在一层。

### 8. 产品放错分类
自动启发式（phone 内型号含"笔记本/显示器/平板"）**未发现**。⚠️ 但 `ac`/`robot` 整类属定位错误（见第 1 节）。

### 9. 型号字段不规范
- **品牌名写进 model（冗余，7 处）**：
  ```
  realme GT7 Pro / realme GT6 / realme Neo7
  OPPO Find X8 Ultra / OPPO Find X8s
  vivo X200s / vivo X200 Ultra
  ```
  建议 model 只存 `GT7 Pro`，brand 存 `realme`。
- model 为单一字符串，未拆分 series / generation / variant。

### 10. 品牌直接写进产品名称
见第 9 点（7 处）。其余产品 model 未含品牌名。✅ 大部分规范。

### 11. 参数字段混乱（跨品类同义多字段名）
已识别的"同义多字段名"（需统一为单一 snake_case）：
- `battery` → 出现在 robot / laptop / earphone / tablet / watch / keyboard（统一 ✅，但单位内嵌字符串）
- `refreshRate`（统一写法，但手机用 `screen.refreshRate` 嵌套）
- `weight`（统一写法，但手机用 `body.weight` 嵌套）
- **手机完全独立**：用 `screen.*` / `body.*` / `storageOptions[]` 顶层结构，**无 `specs` 对象**，与其它 12 类不能共用字段名。

### 12. 大量空字段
- **image 空：585 / 659（89%）**——仅手机有图（74/93）。
- **specs 空：93**——即全部 93 款手机无 `specs`（因其用顶层结构，非真空）。
- prices 全空：93（即手机，因用 storageOptions）。
- 其余字段（brand/model/id）缺失均为 0。✅

### 13. 同一参数多种字段名
当前各品类内部字段名基本统一（77 个字段中跨类重复名已收敛为同一写法）。
主要问题是**手机 vs 其它 12 类的结构分裂**，而非字段别名。

### 14. 单位混乱（字符串内嵌，不可计算）
**全品类普遍**（手机除外，手机用数值）。示例：
```
扫地机器人: suction=11000Pa  battery=5200mAh  height=10.3cm
笔记本:     ram=16GB  storage=256GB  screen=13.6寸 Liquid Retina
CPU:        tdp=170W
耳机:       weight=5.3g  driver=40mm定制
显示器:     size=27寸  refreshRate=120Hz  brightness=350nit
平板:       size=13英寸  ram=8GB
相机:       weight=658g  screen=3英寸翻转屏
电视:       size=65英寸  brightness=1200nits
手表:       size=46mm  weight=36.6g
键盘:       weight=810g  battery=4000mAh
```
→ 无法排序/筛选/评分，必须拆成 `raw_value + unit`。

### 15. 无法参与对比的异常产品
未检出结构性异常产品。GPU 存在数值 `0`：
```
tensorCores=148 处、rtCores=104 处、memoryBus=34 处、vram=34 处、rops=11 处、memoryBandwidth=34 处
```
经核对这些 `0` 多为 **架构不适用（N/A，如 AMD 无 tensor/rt Cores）**，属合理 0；但需与"未知=0"区分标记（见第十六节）。

### 16. 缺失值是否用 0 代替
- GPU 的 0 多为架构 N/A（见上），**建议显式标记 N/A 而非 0**，避免评分误判。
- 其余品类未发现明显"未知=0"。

### 17. 重复产品 / 品牌（综合）
见第 1–3、6 点：无字面重复，缺的是**规范化实体（brand_id / category_id）**而非去重。

### 18. 其它结构缺陷（超出 18 项，但致命）
1. **手机与其它品类数据结构分裂**（顶层 vs specs 包装）——最大障碍。
2. **无品牌表**：67 品牌是自由字符串，无 brand_id / 中英文名 / aliases。
3. **无分类层级**：13 扁平项，无 一级→二级→三级。
4. **无 series/generation/model/variant 拆分**。
5. **无标签体系**：tags 是自由字符串数组（"轻薄""AI"），无受控词表。
6. **无元数据**：status / data_completeness / data_confidence / data_source / last_verified 缺失或仅 lastVerified 字符串。
7. **价格结构分裂**：手机用 `storageOptions[]`（按容量分价），其余用 `prices{jd,pdd}`。
8. **无搜索别名 / 未命中补库 / 健康度看板**。
9. **前端硬编码品类**：`CATEGORIES` 对象、各 `brands` 数组、各 `getListLine` 访问器全部写死在 `index.html`（约 787–996 行），新增品牌/品类需改代码。

---

## 三、关键结论（按严重程度）

| 等级 | 问题 | 影响 |
|------|------|------|
| 🔴 P0 | 手机 vs 其它 12 类**数据结构分裂** | 无法建统一参数模板，前端必须特判 |
| 🔴 P0 | `空调`+`扫地机器人` **80 款非电子产品** | 违反产品定位，污染"电子"库 |
| 🟠 P1 | 参数**单位内嵌字符串**，不可计算 | 排序/筛选/评分全靠正则解析，易错 |
| 🟠 P1 | **无品牌表**（67 自由串） | 中英文/别名无法归一，搜索漏命中 |
| 🟠 P1 | **无分类层级** | "机械键盘"等应下沉三级 |
| 🟡 P2 | 无 series/generation/variant 拆分 | 同代/跨代对比无法实现 |
| 🟡 P2 | 图片 89% 缺失 | 展示体验差 |
| 🟡 P2 | model 含品牌前缀（7 处） | 冗余 |
| 🟢 P3 | 无元数据/标签体系/健康度 | 不可持续扩展 |
| 🟢 P3 | 前端硬编码品类与品牌 | 扩展需改代码 |

**好消息**：基础数据质量尚可——**无重复 id、无重复产品、品牌写法内部一致、无错放分类**。问题集中在**结构规范化**而非数据污染，迁移风险可控。

---

## 四、建议的"目标结构"（预览，待确认后细化）

```
BRAND (brand_id, name_cn, name_en, aliases[], country, logo)
CATEGORY (category_id, name, level, parent_id, slug)
SERIES (brand_id, series, generation)
PRODUCT (product_id, brand_id, primary_category_id, series, generation, model, variant, full_name, aliases[], release_date, status, price_ref, currency, image, source, completeness, confidence, last_verified)
PARAM (product_id, field, raw_value, unit, display_value)   -- 按 category 套 schema
TAG (tag_id, name)  +  PRODUCT_TAG
MISSING_QUERY (query, predicted_*, request_count)            -- 搜索反向补库
```

下一步（Step 3–7）将：设计完整 Category Tree（17 个一级）、写迁移脚本（旧→新，保留全部有效数据）、清洗、迁移、质量校验。

---

## 五、待你确认后再执行

诊断已完成。**在动任何 659 条数据前，请确认以下三点**：

1. **非电子品类处理**：`空调(40)` + `扫地机器人(40)` 是否移出本项目？（倾向：移出至独立仓库或删除，保证"纯电子"定位）
2. **手机结构是否并入统一 `specs` 模板**：将 `screen/body/storageOptions` 拍平为与其它品类一致的 `specs` + 独立 `price_options`，还是保留手机特例、仅做字段映射？
3. **目标一级分类范围**：是否采用你文档中的 17 个一级分类（手机/平板/电脑/PC硬件/显示/外设/音频/穿戴/影像/无人机机器人/游戏/网络存储/影音/充电/智能家居/办公/AI硬件）？

确认后我再输出《目标分类树 + 数据结构设计 + 迁移方案》，然后开始清洗与迁移。
