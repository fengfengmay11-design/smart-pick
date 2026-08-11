# C. 659 款产品迁移方案

> Step 3 设计文档 · 仅设计不改动数据
> 目标：旧扁平结构 → 新规范结构（Brand/Category/Series/Product/Variant/Specs/Price/Tag…）
> 原则：保留全部有效数据、可回滚、不破坏现有对比/评分/推荐功能。

---

## 〇、迁移前备份（强制）

1. `git checkout -b pre-migration-20260807` 并 `git tag backup-20260807`。
2. 复制全部 `data-*.js` + `phone-data.js` 到 `backup/20260807/` 物理留档。
3. 写 `migration-manifest.json` 记录：源文件↔目标文件↔产品数↔负责人↔时间。
4. 任何一步失败 → `git checkout pre-migration-20260807` 或恢复 `backup/` 即回滚。

---

## 一、构建参考表（先于产品迁移）

### 1.1 分类表 `categories.js`
按《A. 目标 Category Tree》生成 10 个 L1 + 全部 L2/L3，含 `category_id`/`parent_id`/`priority`/`schema_ref`。
现有 13 分类全部可映射（见 A 表三），无孤儿。

### 1.2 品牌表 `brands.js`（67 → 规范）
- 扫描全部产品的 `brand` 字符串，去重得 67 个。
- 人工/规则归并（本次诊断已确认**无同品牌多写法**，故 67 个即 67 条，不需合并）。
- 分配 `brand_id`（小写 slug，如 `Apple`→`apple`），填 `brand_name`/`brand_name_cn`/`aliases`。
- 中英文名缺失的标记 `needs_review`（如部分品牌无中文名）。
- **映射表**：`{ "Apple":"apple", "华为":"huawei", ... }` 供产品迁移查表。

### 1.3 标签表 `tags.js`
建立首批标签并归一别名：`gaming`(游戏/电竞/Gaming)、`flagship`(旗舰)、`budget`(性价比)、`OLED`、`MiniLED`、`WiFi7`、`photography`(摄影)、`business`(商务)、`portable`(轻薄/便携)、`creator`(创作)、`outdoor`(户外)、`AI`。

### 1.4 参数模板 `schemas.js`
为每类 L3 建 `ParameterSchema`（手机/笔记本/显卡/CPU/显示器/耳机/手表/平板/相机/电视/键盘/空调/扫地机器人）。
- 数值字段声明 `unit`（电池 mAh、充电 W、重量 g、屏幕 inch、价格 元…）。
- 字符字段 `type:"string"`（芯片/系统/面板/接口）。
- 参考用户给的模板（手机 chipset/display/camera/battery…；笔记本 cpu/gpu/memory/…；耳机 driver/anc/codec…）。

---

## 二、产品迁移（分三类）

### 2.1 手机 phone（93 款 + 246 容量变体）→ `smartphone`
- 主结构：`product_id` 沿用旧 id（如 `iphone17pro`）；`brand_id` 查映射；`primary_category_id=smartphone`；`full_name` 由 `brand+model` 拼；`status` 默认 `active`（旧款标 `legacy`）。
- **screen / body / storageOptions → specs + variants**：
  - `specs` 提取：`display`(尺寸/分辨率/刷新率，数值带 unit)、`body`(重量 g/尺寸)、`battery`(mAh)、`chipset`(字符串)、`camera`(字符串)…
  - `storageOptions`(246) → **ProductVariant[]**：`{storage, ram, price_jd, price_pdd, official}`；价格同时写 `Price` 表（channel 区分）。
  - 基础 `price` 取最低容量档，保证旧 `prices` 字段语义不丢。
- 折叠/游戏机型：加 `tags:["foldable"]` / `["gaming"]`，不拆 L3。
- 型号字段：**剥离品牌前缀**（如 `Apple iPhone 17 Pro` → model=`iPhone 17 Pro`）。

### 2.2 其余 12 类（566 款）→ 对应 L3
- 通用映射：`brand`→`brand_id`；`category`→新 `primary_category_id`（按 A 表三）；`specs` 原对象**原地归一化**：
  - 数值字段 `"5200mAh"`→`{value:5200,unit:"mAh",display_value:"5200mAh"}`（规则见 2.4）。
  - 字符字段原样保留。
  - 未知值 → `null`（原 `"暂无"`/`""`/缺失 统一为 null）。
- `model`/`full_name` 按 `brand_name + model` 重算；剥离型号中的品牌前缀（诊断发现的 7 处）。
- `prices{jd,pdd}` → `Price[]`（channel=jd/pdd）。
- `tags`：按现有 `tags` 数组映射到规范 `tag_id`。

### 2.3 空调 ac(40) + 扫地机器人 robot(40) → `net_smart.smart_device`（**secondary**）
- 结构与 2.2 相同归一化。
- `primary_category_id` = `clean_robot` / `smart_home_appliance`。
- 分类节点 `priority=secondary`；产品 `status` 多为 `legacy`（历史保留、不重点扩充）。
- **不新增冰箱/洗衣机等家电**（收紧扩库方向，仅规范化已有 80 款）。

### 2.4 参数单位迁移规则（自动 + needs_review）
正则规则表（自动）：
| 原字符串 | value | unit | display |
|---------|-------|------|---------|
| `5200mAh` / `5200 mAh` | 5200 | mAh | 5200mAh |
| `170W` / `170 W` | 170 | W | 170W |
| `6.7英寸` / `6.7"` | 6.7 | inch | 6.7英寸 |
| `199g` | 199 | g | 199g |
| `512GB` | 512 | GB | 512GB |
| `2999元` / `¥2999` | 2999 | CNY | ¥2999 |
- 命中规则 → 自动转 `{value,unit,display_value}`。
- **未命中 / 歧义（如 `大容量`、`约5000`）→ 标记 `needs_review`，不臆造数值**。
- 字符型字段（chipset/os/panel/interface）**强制保持字符串**，不转 value/unit。

### 2.5 ID 策略
- **保留现有稳定 id** 作 `product_id`（slug 形式，前端已依赖）。
- 校验全局唯一：冲突则追加 `-2`/`-3`；原 id 存入 `legacy_id`。
- 变体 id：`${product_id}__${storage}_${ram}`。
- 价格 id：`${product_id}__${channel}__(variant?)`。

---

## 三、自动完成 vs 需人工审核（needs_review）

| 项 | 处理 | 说明 |
|----|------|------|
| 结构扁平→规范 | 自动 | 脚本批处理 |
| brand 字符串→brand_id | 自动 | 映射表查表（无多写法） |
| category→新 category_id | 自动 | A 表三映射 |
| 数值单位归一 | 自动 | 规则表命中 |
| storageOptions→variants+price | 自动 | 手机专属脚本 |
| prices→Price 表 | 自动 | |
| 图片缺失(89%) | 自动留空 | 不阻塞 |
| **品牌无中英文名** | needs_review | 人工补 |
| **单位字符串歧义** | needs_review | 不臆造 |
| **型号含品牌前缀(7处)** | 自动剥离+人工抽检 | |
| **耳机/相机细分 L3 不确定** | needs_review | 信息不足不下沉 |
| **data_completeness<40%** | needs_review | 低完整度不进强推荐 |
| **跨分类疑似重复** | needs_review | 诊断确认无重复，仍抽检 |

---

## 四、数据质量与校验（迁移后必跑）

脚本 `validate-db.js` 断言：
1. 所有 `brand_id` 存在于 `BRANDS`；所有 `primary_category_id` 存在于 `CATEGORIES_TREE`。
2. `product_id` 全局唯一；`legacy_id` 可回溯。
3. 无数值参数以 `"5200mAh"` 字符串存于新 schema（必须已拆 value/unit）。
4. 无 `0` 伪装未知（specs 中数值型缺值应为 null）。
5. 每个 L3 至少有 1 产品（孤儿分类告警）。
6. 输出 `DataQualityReport.md`：总数/品牌数/分类数/各分类产品数/缺失品牌数/needs_review 数/平均完整度。

---

## 五、适配层（保证旧功能不中断）

`src/db-adapter.js` 暴露旧接口：
- `CATEGORIES`（旧 13 分类视图，内部映射到新树）
- `getPhoneData()` / `GPU_DATA` 等（返回旧形状，由新结构反向拼装）
- 旧前端 `index.html` 取数切到 adapter，**搜索/对比/评分/推荐零改动先行跑通**。
稳定后（1-2 个迭代）再逐步移除 adapter、直用新结构。

---

## 六、回滚

- 代码回滚：`git checkout pre-migration-20260807`。
- 数据回滚：恢复 `backup/20260807/` 原文件。
- 因迁移为"新增归一化文件 + adapter 切换"，回滚不影响旧文件，风险低。

---

## 七、执行顺序（未来 Step 4+ 用）

1. 备份（〇）
2. 建参考表 brands/categories/tags/schemas（一）
3. 写迁移脚本 `migrate.js`（二）
4. 跑迁移 + 单位规则（2.1~2.5）
5. 跑 `validate-db.js`，修 needs_review（四）
6. 接 `db-adapter.js`，回归测试搜索/对比/评分/推荐（五）
7. 输出 `DataQualityReport.md`
8. 提交 `git commit`，**不直接 push 到 main**，开 PR review 后再合。
