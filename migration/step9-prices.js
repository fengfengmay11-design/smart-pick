#!/usr/bin/env node
/*
 * step9-prices.js — 为 Step 7 新增品类中「无任何价格」的商品补录售价
 *
 * 数据来源：3 个子代理联网核真 → 主进程逐条复核（WebFetch 实抓页面）
 * 只有「我亲自复核过、页面上能直接读到该型号价格数字」的条目才写库。
 * 被否决的条目一律不写，理由记录在 REJECTED 中，最终进健康报告。
 */
const fs = require('fs');
const path = require('path');

const V2 = path.join(__dirname, '..', 'database', 'v2');
const load = f => JSON.parse(fs.readFileSync(path.join(V2, f), 'utf8'));
const save = (f, d) => fs.writeFileSync(path.join(V2, f), JSON.stringify(d, null, 2) + '\n');

// ---------------------------------------------------------------------------
// 已复核通过（每条都由主进程 WebFetch/WebSearch 实抓页面确认过价格数字）
// source: jd = 京东挂牌 / official = 品牌官网标价 / ref = 第三方权威报价页
// ---------------------------------------------------------------------------
const ACCEPTED = [
  { product_id: 'lenovo-legion-go', source: 'ref', price: 4899,
    url: 'https://m.lenovo.com.cn/wiki/product-doc-41360.html',
    note: '联想官方商城参考价，Z1 Extreme/16GB/512GB 幻影黑' },

  { product_id: 'razer-wolverine-v3-pro', source: 'jd', price: 1399,
    url: 'https://g.pconline.com.cn/product/gameside/razer/2670379_price.html',
    note: 'PConline 报价页：官方报价¥1479，京东挂牌¥1399' },

  { product_id: '8bitdo-ultimate-2-wireless', source: 'ref', price: 269,
    url: 'https://finance.sina.com.cn/tech/digi/2026-06-23/doc-iniekeev9831640.shtml',
    note: 'IT之家/新浪科技 2026-06-23：官方定价 ¥269' },

  { product_id: 'oura-oura-ring-4', source: 'jd', price: 3299,
    url: 'https://m.smzdm.com/p/178895428',
    note: '京东全球购（跨境）页面价 ¥3299，五社海外专营店' },

  { product_id: 'sony-vpl-xw5000es', source: 'jd', price: 35999,
    url: 'https://detail.zol.com.cn/projector/index1424670.shtml',
    note: 'ZOL 参考报价 ¥35999，页内京东链接同价' },

  { product_id: 'lg-s95tr', source: 'jd', price: 5599,
    url: 'https://m.smzdm.com/p/134097167/',
    note: '京东活动售价 ¥5599（国补后到手更低）' },

  { product_id: 'huawei-s2', source: 'official', price: 7399,
    url: 'https://consumer.huawei.com/cn/wholehome/business-product/',
    note: '华为官网全屋智能商用产品页标价 ¥7399' },

  { product_id: 'iflytek-ai-t20-pro', source: 'ref', price: 8999,
    url: 'https://detail.zol.com.cn/Mills/index1941367.shtml',
    note: 'ZOL 参考报价 ¥8999（13.3英寸/512GB），天猫同价' },

  { product_id: 'xiaomi-cyberdog-2-ms2242cn', source: 'ref', price: 12999,
    url: 'https://news.zol.com.cn/828/8289893.html',
    note: '小米官方发布价 ¥12999（限量开发者产品）' },
];

// ---------------------------------------------------------------------------
// 复核否决 / 确认无价（不写库，仅留档）
// ---------------------------------------------------------------------------
const REJECTED = [
  ['8bitdo-ultimate-2c-wireless', '子代理自述「价史页反爬未直读，取整¥200」——属估算，否决'],
  ['valve-steam-deck-oled',       '子代理给的 source_url 是百度企查查排行榜页，非价格页——判定幻觉，否决'],
  ['nintendo-nintendo-switch-2',  '国内无行货，¥3300 系水货行情价而非挂牌价，否决'],
  ['amazon-kindle-colorsoft',     '亚马逊已退出中国，¥2600 为「海外购到手约」估算，否决'],
  ['ecovacs-winbot-w2-omni',      '¥2039 实为另一型号（窗宝 W2S / WG893-12）的价，型号不符，否决'],
  ['fanatec-clubsport-dd',        '国内无官方行货渠道（海外 €599.95 / $699.99）'],
  ['fanatec-clubsport-dd-2',      '国内无官方行货渠道（海外 €799.95 / $899.99）'],
  ['ecovacs-goat-g1',             '国内无行货，德国官网已下架'],
  ['dreame-roboticmower-a1',      '国内未上市（追觅国内在售为 A3 系列）'],
  ['boox-boox-go-color-7',        '国内无行货，文石中国官网无此型号'],
  ['boox-boox-page',              '国内无行货，文石中国官网未上架 Page 系列'],
  ['asus-asus-zenwifi-bq16',      '国内无行货，华硕中国 ZenWiFi 线无 BQ16'],
  ['netgear-netgear-orbi-970-rbe973', '国内无行货，仅京东全球购跨境（约 ¥4 万）'],
  ['benq-gp520',                  '国内无行货，明基中国官网无 GP 系列'],
  ['anker-anker-675-usb-c-docking-station-a8377', '国内无行货，仅 Anker 美/欧站在售 $249.99'],
];

// ---------------------------------------------------------------------------
function main() {
  const products = load('products.json');
  const prices = load('prices.json');
  const byId = new Map(products.map(p => [p.product_id, p]));
  const today = new Date().toISOString().slice(0, 10);

  const existing = new Set(prices.map(x => x.price_id));
  let added = 0, skipped = 0;

  for (const a of ACCEPTED) {
    const p = byId.get(a.product_id);
    if (!p) { console.error(`  ✗ 产品不存在: ${a.product_id}`); skipped++; continue; }
    const already = prices.some(x => x.product_id === a.product_id && x.variant_id == null);
    if (already) { console.log(`  – 已有价格，跳过: ${a.product_id}`); skipped++; continue; }

    let price_id = `${a.product_id}_${a.source}`;
    let n = 1;
    while (existing.has(price_id)) price_id = `${a.product_id}_${a.source}${++n}`;
    existing.add(price_id);

    prices.push({
      price_id,
      product_id: a.product_id,
      variant_id: null,
      source: a.source,
      price: a.price,
      currency: 'CNY',
      price_type: 'retail',
      last_updated_at: today,
    });
    // 价格来源 URL 记到产品的 source_url（若原本为空）
    if (!p.source_url) p.source_url = a.url;
    console.log(`  ✓ ${a.product_id.padEnd(46)} ${a.source.padEnd(8)} ¥${a.price}`);
    added++;
  }

  save('prices.json', prices);
  save('products.json', products);

  console.log(`\n写入 ${added} 条价格，跳过 ${skipped} 条。prices 总数 ${prices.length}`);
  console.log(`\n复核否决 / 确认无行货价 ${REJECTED.length} 款：`);
  REJECTED.forEach(([id, why]) => console.log(`  · ${id.padEnd(46)} ${why}`));

  // 留档，供健康报告引用
  fs.writeFileSync(path.join(__dirname, 'step9-price-audit.json'),
    JSON.stringify({ audited_at: today, accepted: ACCEPTED, rejected: REJECTED }, null, 2) + '\n');
}

main();
