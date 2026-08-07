# Step 5 报告：数据库清洗 + 参数规范化 + 数据质量体系

> 执行时间：2026-08-07（基于 Step 4 已迁移的 V2 标准库 `database/v2/`）
> 设计依据：`docs/target-db-structure.md` §19/§38-§42，总任务书 Step 5 章节
> 安全原则：不删产品、不重命名未知字段、不强行结构化语义不同的数据、所有修改可经 `git` 与 `database/v2.step4.bak` 回滚

---

## 1 当前完成内容

| 子项 | 结果 |
|------|------|
| 填充 `parameter-schemas.json`（原为空占位） | ✅ 13 个有 spec 的品类填入标准字段集 |
| 生成 `migration/config/parameter-key-mapping.json` | ✅ 字段规范 + 跨品类别名说明 + schema 继承映射 |
| 标签规范化（Tag） | ✅ 合并 `miniled`→`mini_led`；保守填充 `tag_aliases`；修复跨产品 alias 碰撞 |
| 品牌别名审计（Brand） | ✅ 0 重复别名 / 0 跨品牌碰撞 / 0 重复 brand_id（无需改动） |
| 参数单位规范化复核 | ✅ 结构化字段完好；定位 `battery` 语义分裂（容量 vs 续航），按 §27 记录不强行统一 |
| `data_completeness` 重算 | ✅ 基于各品类 ParameterSchema 计算 |
| `data_confidence` 设置 | ✅ high 74 / medium 585 / low 0 |
| `data_source` 字段 | ✅ 全部标记 `migration_legacy`（诚实溯源） |
| `needs_review` 标记 | ✅ 51 款（续航字符串语义不清 + 极低完整度） |
| 重复检测（产品/别名） | ✅ 发现并修复 1 处跨产品 alias 碰撞 |

---

## 2 修改文件

- `database/v2/parameter-schemas.json`（空 → 13 品类标准字段）
- `database/v2/tags.json`（529 → 528；合并一组；填充别名；）
- `database/v2/products.json`（新增/重算 `data_completeness`/`data_confidence`/`data_source`/`needs_review`；修复 2 款 pad 的 alias）
- `migration/config/parameter-key-mapping.json`（新增）
- `migration/step5-clean.js`（新增，可复现清洗脚本）
- `database/v2.step4.bak/`（备份，Step 4 成果快照）

> 旧 `data-*.js`、前端 `index.html`、`db-adapter.js` 均未改动。

---

## 3 数据变化

| 指标 | Step 4 | Step 5 | 说明 |
|------|--------|--------|------|
| Products | 659 | 659 | 无增减 |
| Brands | 67 | 67 | 无增减 |
| Tags | 529 | 528 | 合并 `miniled`→`mini_led` |
| ParameterSchemas | 0（空占位） | 13 | 已填充 |
| 平均参数完整度 | — | 98.1% | 基于 schema 首次可计算 |
| data_confidence | — | high 74 / medium 585 | 启发式 |
| needs_review | — | 51 | 详见 §6 |
| 跨产品 alias 碰撞 | 1 | 0 | 修复 |

完整度分布：100% → 583 款；80–99% → 45 款；50–79% → 31 款；<50% → 0 款。

---

## 4 Validation 结果

```
products        : 659 OK
brands          : 67
categories      : 64
variants        : 246 OK
prices          : 1624
dup product_id  : 0
invalid brand   : 0
invalid category: 0
zero-value specs: 366  (均为真实零值，非脏数据，见 Step 4 报告)
WARNINGS        : 1
CRITICAL        : 0
✅ 校验通过（0 致命错误）
```

Adapter 旧前端等价校验：`legacy_products=659 / phone_variants=246 / price_records=1624` 全部 match=true。

---

## 5 Warning

- `specs` 中 366 个数值为 0：经 Step 4 核查均为真实零值（如 AMD 显卡无 tensor/RT core），非脏数据，保留。
- 跨品类 `battery` 字段语义不同：laptop/cleaning_robot 为容量(mAh)结构化；earphone/keyboard/smartwatch/tablet 为续航时长字符串（`6h+30h`、`约10小时`、`约14天`、`续航数月`/`无`）。二者不可比，未强行统一，已在 `parameter-key-mapping.json` 记录。

---

## 6 Needs Review（51 款）

全部位于电池为「续航时长字符串」的品类，需人工确认 schema 表达：

- `earphone`：35 款
- `tablet`：7 款
- `keyboard`：7 款
- `smartwatch`：2 款

其余均为 0 碰撞、0 重复、0 悬空引用。

---

## 7 是否满足验收标准（§72）

| Step 5 验收项 | 状态 |
|---------------|------|
| 品牌规范 | ✅ 67 品牌别名零重复/零碰撞 |
| Tag 规范 | ✅ 合并同义、填充别名、修复碰撞 |
| 参数 Key 规范 | ✅ `parameter-key-mapping.json` 记录规范与别名 |
| 单位规范 | ✅ 结构化字段完好；语义分裂已记录而非强行统一 |
| data_completeness | ✅ 按品类 schema 计算（98.1% 均值） |
| data_confidence | ✅ high/medium/low 区分 |
| needs_review | ✅ 51 款标记 |
| 质量报告 | ✅ 本报告 + `data-quality-report.md` |
| 无大量不可解释的数据自动变化 | ✅ 仅 1 标签合并 + 2 款 alias 修复 + 质量字段补充 |

**结论：Step 5 验收通过，无 Critical 问题，可进入 Step 6。**

---

## 8 下一步建议（Step 6）

1. 先做 **Coverage Gap Analysis**（§44）：统计每个三级品类的 product_count / brand_count / 核心品牌覆盖。
2. 按 S/A/B 分级（§45）优先扩 **S 级**（手机/笔记本/平板/耳机/显示器/智能手表）。
3. 新增产品前严格查重（brand_id + model + variant + aliases，§50）；未知参数保持 `null`，不猜（§26）。
4. **遗留问题（待用户决策，不擅自处理）**：
   - 标签空间混入大量「规格型 token」：`8gb`/`16gb`/`0gb`（RAM 容量）、`geforce_40`/`rdna_2_0`（GPU 架构）、`zen_5`/`raptor_lake`（CPU 架构）。这些是规格属性泄漏进标签，是否迁移到 specs/系列字段需产品建模决策。
   - `value`(40) / `ampere`(26) 等疑似误标标签，建议人工复核语义。

---

## 回滚方案

- 数据库回滚：`rm -rf database/v2 && mv database/v2.step4.bak database/v2`
- Git 回滚：当前改动未提交；如需回到 Step 4 提交：`git checkout db-normalization -- database/v2`（保留 working tree 其它内容）或整体 `git reset --hard 9004a79`
