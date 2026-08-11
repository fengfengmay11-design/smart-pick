# A. 目标 Category Tree（分类树）

> Step 3 设计文档 · 仅设计不改动数据
> 决策依据：① 空调/扫地机器人保留但标记 `secondary`；② 手机并入统一架构但保留独立 specs Schema；③ 一级分类控制在 **10 个**，二三级负责精细化；④ 分类≠标签。

---

## 一、设计原则

1. **一级分类 10 个，稳定少变**；二级/三级负责精细化。
2. **最多三级**：`L1 → L2 → L3 → Product`。
3. **每个产品仅一个 `primary_category_id`**（唯一主分类），跨品类特点用 `tags` 表达。
4. **分类 = 它是什么**；**标签 = 它有什么特点**（如 `gaming` / `OLED` / `flagship`）。
5. 每个分类节点带 `priority`：`core`（重点扩充）/ `secondary`（保留历史、不重点扩充）/ `legacy`（历史归档）。
6. 分类用 `category_id`（英文 slug）做关联键，前端/后端均不依赖中文名。

---

## 二、目标分类树（10 个一级）

> 格式：`category_id`(priority) 显示名 ← 现有来源映射

### 01 手机与移动设备 `mobile` (core)
- L2 `smartphone` 智能手机 ← **phone(93)**
  - L3 `phone_std` 标准智能手机
  - L3 `phone_fold` 折叠屏手机（或 tag: foldable）
  - L3 `phone_gaming` 游戏手机（或 tag: gaming）
  - *说明：折叠/游戏优先用 tag 而非拆 L3，避免碎片；如需统计再下沉 L3。*

### 02 电脑与计算硬件 `computer` (core)
- L2 `computer_system` 电脑整机 ← **laptop(40)**
  - L3 `laptop` 笔记本（含轻薄/游戏/商务/创作，用 tag 区分）
  - L3 `desktop` 台式机
  - L3 `mini_pc` 迷你主机
  - L3 `pc_handheld` PC掌机
- L2 `pc_component` PC核心硬件 ← **cpu(40)、gpu(209)**
  - L3 `cpu` CPU
  - L3 `gpu` 显卡
  - L3 `motherboard` 主板
  - L3 `memory` 内存
  - L3 `ssd` 固态硬盘
  - L3 `psu` 电源
  - L3 `cooling` 散热

### 03 平板与阅读设备 `tablet` (core)
- L2 `tablet` 平板电脑 ← **tablet(24)**
  - L3 `tablet_std` 标准平板
  - L3 `tablet_win` Windows平板
  - L3 `tablet_gaming` 游戏平板
- L2 `reader` 阅读设备
  - L3 `eink_reader` 电子书阅读器
  - L3 `eink_tablet` 墨水屏平板

### 04 外设与显示设备 `peripheral` (core)
- L2 `monitor` 显示器 ← **monitor(40)**
  - L3 `monitor_std` 标准显示器
  - L3 `monitor_gaming` 游戏显示器（tag: gaming）
  - L3 `monitor_pro` 专业显示器
- L2 `input` 输入设备
  - L3 `keyboard` 键盘 ← **keyboard(20)**
  - L3 `mouse` 鼠标（预留）
  - L3 `gamepad` 手柄（预留，非鼠标/键盘）
- L2 `ext_peripheral` 扩展与影像外设
  - L3 `dock` 扩展坞
  - L3 `webcam` 摄像头
  - L3 `mobile_storage` 移动存储

### 05 音频与影音设备 `audio_av` (core)
- L2 `earphone` 耳机 ← **earphone(45)**
  - L3 `tws` TWS耳机
  - L3 `headphone` 头戴耳机
  - L3 `open_ear` 开放式耳机
  - L3 `bone` 骨传导
  - L3 `wired` 有线耳机
  - L3 `monitor_hp` 监听耳机
- L2 `speaker` 音箱
  - L3 `bt_speaker` 蓝牙音箱
  - L3 `desktop_spk` 桌面音箱
  - L3 `smart_spk` 智能音箱
- L2 `mic` 麦克风与声卡
- L2 `av_display` 影音大屏 ← **tv(24)**
  - L3 `tv` 智能电视
  - L3 `projector` 投影仪
  - L3 `soundbar` 回音壁
  - L3 `streamer` 流媒体设备

### 06 智能穿戴与XR `wearable` (core)
- L2 `smartwatch` 智能手表 ← **watch(20)**
- L2 `band_ring` 手环与戒指
  - L3 `band` 智能手环
  - L3 `ring` 智能戒指
- L2 `xr` 智能眼镜与XR
  - L3 `ai_glasses` AI眼镜
  - L3 `ar` AR设备
  - L3 `vr` VR设备

### 07 摄影、影像与无人机 `imaging` (core)
- L2 `camera` 相机 ← **camera(24)**
  - L3 `mirrorless` 微单
  - L3 `compact` 数码相机
  - L3 `action` 运动相机
  - L3 `panorama` 全景相机
  - L3 `vlog` Vlog相机
  - L3 `pocket_gimbal` 口袋云台相机
- L2 `lens_acc` 镜头与配件
  - L3 `lens` 镜头
  - L3 `gimbal` 云台/稳定器
- L2 `drone` 无人机（预留）
  - L3 `consumer_drone` 消费级无人机

### 08 游戏与娱乐硬件 `gaming` (core)
- L2 `console` 游戏主机
- L2 `handheld_console` 掌机
- L2 `game_peripheral` 游戏外设
  - L3 `gamepad` 游戏手柄
  - L3 `wheel` 方向盘
  - *注意：游戏鼠标/键盘/耳机不在此重复，归属 04/05 + tag:gaming*

### 09 网络、存储与智能设备 `net_smart` (core / **secondary**)
- L2 `network` 网络设备
  - L3 `router` 路由器（预留）
  - L3 `mesh` Mesh路由
  - L3 `switch` 交换机
  - L3 `nic` 网卡
  - L3 `mobile_wifi` 随身WiFi
- L2 `nas_storage` 存储设备
  - L3 `nas` 网络存储（预留）
  - L3 `portable_ssd` 移动SSD
- L2 `smart_device` 智能设备 **(priority=secondary)**
  - L3 `clean_robot` 清洁机器人 ← **robot(40)** `priority=secondary`
  - L3 `smart_home_appliance` 智能家电 ← **ac(40)** `priority=secondary`
    - L4 不展开，ac 直接挂此 L3 下（保留历史，不重点扩充）
  - （未来：智能门锁/摄像头/网关 也挂此 L2）

### 10 AI硬件与新型科技产品 `ai_emerging` (core)
- L2 `ai_device` AI设备
  - L3 `ai_recorder` AI录音
  - L3 `ai_glasses` AI眼镜
  - L3 `ai_assistant` AI随身助手
  - L3 `ai_meeting` AI会议
  - L3 `ai_learn` AI学习硬件
- L2 `emerging` 新型消费电子（保留扩展性）

---

## 三、现有 13 个分类 → 新树 映射总表

| 现有分类 | 产品数 | → 新 primary_category_id | 新分类路径 | priority |
|---------|-------|------------------------|-----------|----------|
| phone | 93 | `smartphone` | 01手机 → 智能手机 | core |
| gpu | 209 | `gpu` | 02电脑 → PC核心硬件 → 显卡 | core |
| cpu | 40 | `cpu` | 02电脑 → PC核心硬件 → CPU | core |
| laptop | 40 | `laptop` | 02电脑 → 电脑整机 → 笔记本 | core |
| monitor | 40 | `monitor_std` | 04外设显示 → 显示器 | core |
| keyboard | 20 | `keyboard` | 04外设显示 → 输入设备 → 键盘 | core |
| earphone | 45 | `tws`/`headphone`/… | 05音频影音 → 耳机 → (按类型) | core |
| tv | 24 | `tv` | 05音频影音 → 影音大屏 → 电视 | core |
| tablet | 24 | `tablet_std` | 03平板阅读 → 平板电脑 | core |
| camera | 24 | `mirrorless`/… | 07影像 → 相机 → (按类型) | core |
| watch | 20 | `smartwatch` | 06穿戴 → 智能手表 | core |
| robot | 40 | `clean_robot` | 09网络存储智能 → 智能设备 → 清洁机器人 | **secondary** |
| ac | 40 | `smart_home_appliance` | 09网络存储智能 → 智能设备 → 智能家电 | **secondary** |
| **合计** | **659** | | | |

> 备注：耳机/相机按现有 `type`/`tags` 细分到对应 L3；若无细分信息则先挂 L2 默认 L3，标记 `needs_review`。

---

## 四、为未来预留的空位（不立即填产品）

- 04：`mouse` 鼠标、`dock` 扩展坞、`webcam` 摄像头
- 05：`speaker` 全系、`mic` 麦克风
- 07：`drone` 无人机、`lens` 镜头
- 08：游戏主机/掌机/手柄
- 09：`router` 路由器、`nas` 网络存储
- 14/15 级（充电、办公、智能家居门锁等）：待体量足够再评估是否新增一级，现阶段可先挂 09 或 10。

---

## 五、分类健康度字段（每个 L3）

`product_count` / `brand_count` / `core_brand_coverage` / `core_model_coverage` / `avg_completeness` / `avg_updated` / `search_hit_rate` → 评级 `Excellent/Good/Fair/Poor`，后台优先补 `Poor`。
