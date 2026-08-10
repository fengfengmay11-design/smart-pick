# 全库健康检查报告（Step 10）

- **检查时间**：2026-08-10
- **检查范围**：V2 规范化数据库（`database/v2/`）→ 构建产物（`data-*.js` × 44）→ 前端（`index.html`，44 品类）三层一致性
- **检查工具**：`migration/health-check.js`（结果 `migration/health-check-result.json`）、`migration/render-quality-check.js`、`migration/validate-db.js`、`migration/db-adapter.js verify`
- **结论**：**0 致命错误（CRITICAL=0）**，7 项遗留警告（均已有明确说明，非阻塞）

---

## 一、总体规模

| 维度 | 数量 |
|---|---|
| 商品（products） | **803** 款 |
| 品牌（brands） | 141 |
| 品类（categories） | 64（分层，叶子品类挂商品） |
| 规格（specs） | 803 条（1:1 全覆盖） |
| 变体（variants，仅手机） | 301（手机 266 + 预留） |
| 价格记录（prices） | **1753** 条 |
| 参数 schema | 46 个品类 |
| 标签词典（tags） | 754（本轮补齐 226） |
| 系列（series） | 22 |
| 构建产物 | 44 个 data 文件、803 款，与库**完全一致** |
| 前端品类注册 | 44 品类 / 8 分组折叠导航，可达商品 **803/803** |

## 二、价格

- 覆盖 **98.1%**（788/803 有价，15 款确认无国行在售报价）
- 记录分布：京东 936 / 拼多多 812 / 参考价 4 / 官方标价 1
- 全部 9 条 Step 9 补录价格均带可复核 `source_url`
- 无 ¥0 假价（修复详情见第四节）

## 三、规格与标签

- 规格填充率 **96.9%**，平均数据完整度 96.6
- 标签体系已对齐：**754 个定义**覆盖全部在用标签，清理 69 个规格泄漏 token（"4k"、"16核"、"980g"、"75%" 等参数混入语义标签）
- 渲染质量：**803 款 × 44 品类 × 列表摘要/标签/价格来源全量检查 = 0 缺陷**（无 undefined、无单位重复、无假 0）

## 四、本轮修复的问题（Step 9 遗留 + Step 10 新发现）

| # | 问题 | 影响 | 修复 |
|---|---|---|---|
| 1 | 13 款手机有真实京东价却显示 **¥0**（`Math.min(jd,null)` 被强转 0） | 价格误导 | `soPrice/soMinAll/soBestOpt/soSource` 只取 >0 真实值；手机列表/弹窗/详情全路径修复 |
| 2 | **106 款手机列表第二行单位重复**：`6.1英寸英寸 · 170gg`（Step 8 产物改为带单位 display 值，前端仍手工拼单位） | 全量视觉错误 | `getListLine2` 改用 `j()` 拼接 display 值 |
| 3 | **GPU 209 款** `Boost:0MHz`（前端读驼峰 `boostClock`，数据是下划线 `boost_clock`）且 `16GBGB` 单位重复 | 全量错误 | 改用 schema 字段 + `j()` 拼接 |
| 4 | AC/CPU/robot/earphone/monitor/tablet/camera/tv/watch/keyboard L1/L2 手工拼单位 + 驼峰字段 + `\|\|0` 假值（如 `制冷0W`、`噪音18dBdB`） | 局部错误 | 24 处统一改 `j()` + 下划线字段 |
| 5 | 对比页 dimBlock：`6.1英寸英寸`、`7.8mmmm`、`60HzHz`、`575WW`、FP32 `.toFixed` 崩溃 | 对比页损坏 | 新增 `withUnit`，值带单位则原样；重写 `fmtNum` 支持 display 字符串；GPU/AC/CPU 字段名对齐 |
| 6 | **7 款 Step 7 手机 `body` 为空**（specs 用了 `resolution/refresh_rate/weight` 别名，schema 要求 `screen_resolution/screen_refresh_rate/body_weight`） | 列表/对比缺数据 | 数据层补 21 个标准键；adapter `fv()` 别名兼容 |
| 7 | 无价商品霸占「价格↑」首位、被塞进最低价档、AI 选购被当成 ¥0 最低价、对比价差出现负差价 | 排序/筛选/推荐误导 | 无价一律沉底、不参与价格区间、价格维度略过、差价需 ≥2 个有效报价 |
| 8 | 容量弹窗/详情页出现 `¥null`、`¥0` | 显示错误 | `yuan()`/`priceLabel()`/`sourceLabel()` 统一收敛 |

## 五、遗留警告（非阻塞，后续可处理）

| 警告 | 数量 | 说明与建议 |
|---|---|---|
| 悬空 `series_id` | 19 条 | 历史遗留：引用了不存在的系列。建议后续为对应产品补建系列或清空字段 |
| 无国行报价 | 15 款 | 已逐款联网核真确认无国行在售（Fanatec/Boox/水货 Switch 2 等），前端如实显示"暂无报价"，不编造 |
| 空叶子品类 | 8 个 | `desktop/mini_pc/pc_handheld/motherboard/memory/ssd/psu/cooler`：已建 schema 未录产品，属**待扩库**品类 |
| 规格数值为 0 | 366 个 | 抽检确认多为**真实 0**（AMD 显卡无 Tensor Core、核显无独立显存、无光驱等），非缺失 |
| 规格填充率 <50% | 7 款 | Step 7 轻量录入的手机（Pixel 9/K80 等），缺 body 尺寸与 features 明细；列表已能正常显示核心规格，完整度待后续补采 |
| 无官网链接 | 501 款 | 增量商品未采集 `official_url`，仅影响溯源便利性，不影响功能 |
| 待复核标记 | 51 款 | 历史标记，建议安排一轮人工抽检后批量清除 |

## 六、数据可信度声明

1. **不编造原则**：全库无任何估算价；联网核真价格均带可复核 `source_url`；无价商品如实显示"暂无报价"。
2. **等价性**：`db-adapter verify` 确认 V2 可完整重建旧前端数据（803 商品 / 266 手机变体 / 1753 价格记录，100% 等价）。
3. **三层一致**：数据库 ↔ 构建产物 ↔ 前端注册数量一致，`health-check` 与 `render-quality-check` 均 0 缺陷。

---

*报告由 `migration/health-check.js` 自动生成数据 + 人工审定，命令可随时重跑复检。*
