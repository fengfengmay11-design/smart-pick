# 数据录入说明（tools/）

项目所有品类数据都是「一份 CSV 源 → 生成 `data-<cat>.js`」的纯前端静态数据，
**不依赖任何爬虫、不调用任何平台接口**，数据均由人工/半结构化方式整理后入库。

## 工作流

```
你整理的 CSV  ──►  tools/import_csv.py  ──►  data-<cat>.js  ──►  前端 CATEGORIES 配置引用
```

1. 在 `tools/templates/` 下按品类维护一份 CSV（可参考已生成的 tablet/camera/tv/watch/keyboard 模板）
2. 运行导入脚本：

   ```bash
   python tools/import_csv.py --csv tools/templates/tablet.csv \
                              --out data-tablet.js --const TABLET_DATA
   ```

3. 在 `index.html` 增加 `<script src="data-tablet.js"></script>` 与 `CATEGORIES.tablet` 配置 + 对比维度函数（见下）

## CSV 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| id | 文本 | 唯一标识，建议 `品牌-型号` 小写连字符，如 `ipad-pro-13-m4` |
| brand | 文本 | 品牌 |
| model | 文本 | 型号/商品名 |
| image | 文本 | 图片 URL（可空，留空则用占位图） |
| launchDate | 文本 | 上市年月，如 `2024-05` |
| popularity | 整数 0~100 | 热度（用于排序/打分） |
| sales | 整数 0~100 | 销量指数（用于排序/打分） |
| priceDrop | true/false | 近期是否降价 |
| price_jd | 整数 | 京东参考价（元） |
| price_pdd | 整数 | 拼多多参考价（元） |
| specs | JSON 文本 | 该品类的参数字典（见下方各品类 specs 约定） |
| tags | 分号分隔 | 标签，如 `M4;OLED;120Hz` |
| officialUrl | 文本 | 官网链接（可空） |
| lastVerified | 文本 | 数据核对日期，如 `2026-08-05` |

## 各品类 specs 约定（与 CATEGORIES 中 getListLine1/2 对应）

- **平板 tablet**：`size, resolution, chip, ram, storage, battery, weight, refreshRate`
- **相机 camera**：`sensor, resolution, video, mount, ibis, weight, screen`
- **电视 tv**：`size, resolution, panel, refreshRate, hdr, brightness, ports`
- **手表 watch**：`size, screen, battery, gps, health, weight, os`
- **键盘 keyboard**：`layout, switch, connection, battery, weight`

> 注：以上 specs 仅决定列表里展示哪两行参数，字段可自行增减，但要与
> `index.html` 中对应品类的 `getListLine1/2` 读取的 key 保持一致。

## 校验规则（import_csv.py）

- 必填字段缺失 → 报错退出
- id 重复 → 报错退出
- popularity / sales 不在 0~100 → 报错退出
- price_jd / price_pdd 不能都为 0
- specs 必须是合法 JSON 对象

## 数据准确性

种子数据（tools/templates/*.csv）基于各机型公开发布的规格参数与参考价整理，
`lastVerified` 为生成日期。**正式对外展示前，请按真实到手价与最新规格核对一遍**。
