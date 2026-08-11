/**
 * Step9 补丁：把 step9-price-audit.json 里已复核通过的来源链接，
 * 落到 prices.json 对应记录的 source_url 字段上。
 *
 * 背景：prices.json 原 schema 无 source_url，价格溯源只能翻审计文件。
 * 本次新增的 9 条价格全部经主进程 WebFetch/WebSearch 实读页面确认，
 * 把链接写进记录本身，后续任何人都能一键复核。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRICES = path.join(ROOT, 'database/v2/prices.json');
const AUDIT = path.join(__dirname, 'step9-price-audit.json');

const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf8'));
const raw = JSON.parse(fs.readFileSync(PRICES, 'utf8'));
const arr = Array.isArray(raw) ? raw : raw.prices;

let patched = 0, missed = [];
for (const a of audit.accepted) {
  if (!a.url || !/^https?:\/\//.test(a.url)) { missed.push(a.product_id + ' (无合法URL)'); continue; }
  const rec = arr.find(p => p.product_id === a.product_id && p.source === a.source && !p.variant_id);
  if (!rec) { missed.push(a.product_id + ' (未找到价格记录)'); continue; }
  if (rec.price !== a.price) { missed.push(`${a.product_id} (价格不符: 库${rec.price} vs 审计${a.price})`); continue; }
  rec.source_url = a.url;
  if (a.note) rec.note = a.note;
  patched++;
}

fs.writeFileSync(PRICES, JSON.stringify(Array.isArray(raw) ? arr : raw, null, 2) + '\n');

console.log('补链完成:', patched, '/', audit.accepted.length);
if (missed.length) { console.log('未处理:'); missed.forEach(m => console.log('  -', m)); }
console.log('\n核对：');
for (const a of audit.accepted) {
  const rec = arr.find(p => p.product_id === a.product_id && p.source === a.source && !p.variant_id);
  console.log(' ', (rec ? '✅' : '❌'), a.product_id.padEnd(30), String(a.price).padStart(6),
    (rec && rec.source_url ? rec.source_url : '(无)').slice(0, 62));
}
