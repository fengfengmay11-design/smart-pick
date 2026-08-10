# Step 6 — Coverage Gap Analysis（覆盖缺口分析）

> 本步骤为**纯分析**，未修改任何 V2 数据。目的：量化当前 659 款产品的品类 / 品牌覆盖缺口，为后续分批扩库提供数据依据。
> 生成物：`migration/coverage-analysis.json`、`migration/config/coverage-core-brands.json`（核心品牌期望清单，可编辑）。

---

## 1. 整体覆盖现状

| 指标 | 数值 |
|------|------|
| 产品总数 | 659 |
| 品牌总数 | 67 |
| 叶子分类总数（L2/L3 无子节点） | 51 |
| **已有产品的分类数** | **13** |
| **空分类数（0 产品）** | **38** |
| 覆盖率分母：核心品牌期望条目 | 见 `coverage-core-brands.json` |

结论：当前数据高度集中在 13 个旧品类，**分类树 51 个叶子中 38 个完全为空**，是产品库扩充的主要空间。

---

## 2. 已覆盖品类覆盖率排名（core_brand_coverage）

覆盖率 = 该品类已有产品的核心品牌数 ÷ 期望核心品牌数。

| 品类 | 产品数 | 品牌数 | 核心品牌覆盖 | 平均完整度 |
|------|------|------|------|------|
| cpu | 40 | 2 | **100%** (2/2) | 100 |
| gpu | 209 | 3 | **100%** (3/3) | 99 |
| cleaning_robot | 40 | 9 | **100%** (9/9) | 100 |
| smart_appliance | 40 | 8 | **100%** (7/7) | 100 |
| earphone | 45 | 16 | 83% (15/18) | 100 |
| laptop | 40 | 13 | 76% (13/17) | 100 |
| monitor | 40 | 14 | 67% (14/21) | 100 |
| tv | 24 | 10 | 67% (10/15) | 86 |
| tablet | 24 | 8 | 58% (7/12) | 100 |
| smartphone | 93 | 9 | 53% (9/17) | 100 |
| smartwatch | 20 | 7 | 46% (6/13) | 78 |
| keyboard | 20 | 8 | 47% (8/17) | 82 |
| camera | 24 | 5 | 38% (5/13) | 100 |

**S 级品类（任务书定义：手机/笔记本/平板/耳机/显示器/手表）缺口最值得优先补：**
- smartphone 53% — 缺 google / motorola / sony / asus / redmi / meizu / nubia / iqoo
- smartwatch 46% — 缺 amazfit / fitbit / oppo / vivo / google / oneplus / coros
- keyboard 47% — 缺 razer / cherry / corsair / hhkb / ducky / steelseries / ikbc
- tablet 58% — 缺 microsoft / realme / oneplus / google / redmi
- monitor 67% — 缺 huawei / redmi / gigabyte / acer / tcl / sanc / skyworth
- earphone 83% — 缺 jabra / soundcore / shokz（已基本到位）

---

## 3. 空分类清单（38 个，按优先级）

### S 级相关（已有 S 品类的兄弟细分，缺口直接影响用户体验）
- `foldable_phone` 折叠屏 — 空（需 samsung/huawei/honor/oppo/vivo/xiaomi/google/motorola/apple）
- `gaming_phone` 游戏手机 — 空（asus/nubia/lenovo/xiaomi/iqoo/oneplus）

### A 级（任务书重点品类，整类缺失）
- `desktop` 台式机、`mini_pc` 迷你主机、`pc_handheld` PC掌机
- `motherboard` 主板、`memory` 内存、`ssd` SSD、`psu` 电源、`cooler` 散热
- `mouse` 鼠标、`ereader` 电子书阅读器
- `speaker` 音箱、`microphone` 麦克风、`projector` 投影仪、`soundbar` 回音壁
- `lens` 镜头、`action_cam` 运动相机、`gimbal` 云台、`drone` 无人机
- `console` 游戏主机、`handheld_console` 掌机、`gamepad` 手柄、`racing_wheel` 方向盘
- `router` 路由器、`mesh` Mesh、`switch` 交换机、`nas` NAS

### B 级 / 新型
- `dock` 扩展坞、`webcam` 摄像头、`mobile_storage` 移动存储
- `smartband` 手环、`smartring` 智能戒指、`smartglasses` 智能眼镜、`vr`、`ar`
- `ai_device` AI设备、`robot_device` 消费机器人

---

## 4. 品牌缺口

| 类型 | 数量 | 说明 |
|------|------|------|
| **需新建品牌**（全库均不存在） | **162** | 扩库时须先建品牌表条目 |
| 已有品牌但缺该品类产品 | 35 | 如 apple 需进 tablet/foldable 等；xiaomi 需进 many 空类 |

**需新建的代表性品牌（节选）**：google, motorola, sony(手机线), redmi, meizu, nubia, iqoo, razer, cherry, corsair, jabra, shokz, fitbit, amazfit, olympus, gopro, dji, insta360, leica, nintendo, microsoft(xbox), sony(ps), valve, logitech(鼠标), tplink, asus(路由), netgear, synology, qnap, gigabyte, kingston, crucial, wd, seagate, samsung(内存/SSD), dji, xreal, meta, oura …

> 注：162 是「把所有定义的核心品牌补齐」的理论上限，实际扩库应按批次、按优先级选取，不追求一次补齐。

---

## 5. 建议的分批扩充策略（S > A > B）

> 以下为**建议方案**，实际插入产品前需与你确认品牌/型号清单（见第 7 节）。

**批次 A（优先，2–3 周目标）—  deepening S 级 + 填补最高频空类**
1. smartphone：补 google(Pixel)/motorola/sony/xiaomi-redmi/meizu/nubia/iqoo 各 2–4 款（旗舰+中端+上代）
2. smartwatch：补 amazfit/fitbit/oppo/vivo/oneplus/coros
3. keyboard：补 razer/cherry/corsair/hhkb/ducky/steelseries
4. foldable_phone / gaming_phone：各 6–10 款（折叠屏与游戏手机是高频比较场景）
5. mouse：logitech/razer/steelseries/corsair/zowie 各 2–3 款

**批次 B（次优先）— A 级空类补齐**
- laptop 深化：razer/lg/samsung/gigabyte 游戏/轻薄线
- monitor 深化：huawei/redmi/gigabyte/acer/tcl
- tablet 深化：microsoft/realme/oneplus/google/redmi
- pc_hardware 空类：motherboard/memory/ssd/psu/cooler（华硕/微星/金士顿/芝奇/三星/西数/海力士…）
- camera 深化：olympus/dji/gopro/insta360/leica
- 网络：router/mesh/nas（tplink/asus/netgear/synology/qnap）
- 影像外设：lens/action_cam/gimbal/drone
- 游戏：console/handheld_console/gamepad

**批次 C（长尾）— B 级与新型**
- ereader/speaker/microphone/projector/soundbar/dock/webcam/mobile_storage
- smartband/smartring/smartglasses/vr/ar
- ai_device/robot_device

---

## 6. Validation 结果

- 本次为只读分析，未改动 `database/v2/*`，故无数据校验风险。
- `validate-db.js` 当前仍 0 致命、659 产品完整（基准未动）。

---

## 7. 下一步：需你确认后再插数据

按任务书 §82（分批、先核对再插）与之前约定，插入产品前需对齐：

1. **品牌范围**：是否按本报告的 162 新建品牌清单逐步补，还是先聚焦某几类？
2. **型号范围**：每品牌每类补哪些型号（旗舰/次旗舰/中端/入门/上代旗舰）？是否以「近 3 年主流在售」为准？
3. **数据来源**：新增产品参数来源（官网_spec / 评测媒体 / 零售页），是否要求附 `source_url`？
4. **首批范围选择**：先执行「批次 A」还是你另有侧重（如先补网络/NAS）？

确认后我将：
- 在 `brands.json` 按规范新增品牌（brand_id 稳定可读 + aliases）；
- 按对应 `parameter-schemas` 录入产品，Variant/Price 解耦；
- 每批插完跑 `validate-db.js` + adapter 等价校验；
- 更新 Coverage Gap 指标，循环推进。

---

## 8. 遗留问题（来自 Step 5，未擅自改动）

- 标签空间混入规格型 token（`8gb`/`geforce_40`/`zen_5` 等 RAM/架构值泄漏进 tags）：是否迁移到 specs/Series 需你建模决策，本报告未处理。
