'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/tornadoli/WorkBuddy/2026-07-15-16-38-34/phone-compare';
const V2 = path.join(ROOT, 'database/v2');
const BASE = require(path.join(ROOT, 'migration-baseline.json'));

const P = require(path.join(V2, 'products.json'));
const S = require(path.join(V2, 'product-specs.json'));
const V = require(path.join(V2, 'product-variants.json'));
const PR = require(path.join(V2, 'prices.json'));
const B = require(path.join(V2, 'brands.json'));
const C = require(path.join(V2, 'categories.json'));

const crit = []; // 致命错误 → 触发停止
const warn = []; // 警告（不阻断）

// ---- Products ----
const pidSet = new Set();
const dupPid = [];
P.forEach(p => {
  if (pidSet.has(p.product_id)) dupPid.push(p.product_id);
  pidSet.add(p.product_id);
  if (!p.model || !String(p.model).trim()) crit.push(`空 model: ${p.product_id}`);
  if (!p.full_name || !String(p.full_name).trim()) crit.push(`空 full_name: ${p.product_id}`);
  if (!B.find(b => b.brand_id === p.brand_id)) crit.push(`无效 brand_id: ${p.product_id} -> ${p.brand_id}`);
  if (!C.find(c => c.category_id === p.primary_category_id)) crit.push(`无效 category_id: ${p.product_id} -> ${p.primary_category_id}`);
});
if (dupPid.length) crit.push(`重复 product_id: ${dupPid.length} -> ${dupPid.slice(0,5).join(',')}`);
if (P.length !== BASE.totals.products) crit.push(`产品数 ${P.length} ≠ 基线 ${BASE.totals.products}`);

// legacy_id 重复检查
const lid = {};
P.forEach(p => { lid[p.legacy_id] = (lid[p.legacy_id]||0)+1; });
const dupLid = Object.entries(lid).filter(([,n])=>n>1);
if (dupLid.length) warn.push(`legacy_id 重复: ${dupLid.length}`);

// ---- Brands ----
const bidSet = new Set();
const bnLow = {};
B.forEach(b => {
  if (bidSet.has(b.brand_id)) crit.push(`重复 brand_id: ${b.brand_id}`);
  bidSet.add(b.brand_id);
  const low = String(b.brand_name).toLowerCase();
  if (bnLow[low]) crit.push(`品牌名称重复(忽略大小写): ${b.brand_name} / ${bnLow[low]}`);
  bnLow[low] = b.brand_name;
});
// alias 冲突
const aliasMap = {};
B.forEach(b => (b.aliases||[]).forEach(a => {
  if (aliasMap[a] && aliasMap[a] !== b.brand_id) crit.push(`alias 冲突: "${a}" -> ${aliasMap[a]} & ${b.brand_id}`);
  aliasMap[a] = b.brand_id;
}));

// ---- Categories ----
const cidSet = new Set();
let cycle = false;
C.forEach(c => {
  if (cidSet.has(c.category_id)) crit.push(`重复 category_id: ${c.category_id}`);
  cidSet.add(c.category_id);
  if (c.parent_category_id) {
    const parent = C.find(x => x.category_id === c.parent_category_id);
    if (!parent) crit.push(`父分类不存在: ${c.category_id} -> ${c.parent_category_id}`);
    else if (parent.parent_category_id) {
      const gp = C.find(x => x.category_id === parent.parent_category_id);
      if (gp && gp.parent_category_id) cycle = true; // L4 出现
    }
  }
  if (c.category_level > 3) crit.push(`层级超过3: ${c.category_id} (L${c.category_level})`);
});
if (cycle) crit.push('分类存在超过3层的嵌套（疑似循环/过深）');

// ---- Variants ----
const vidSet = new Set();
const dupVid = [];
V.forEach(v => {
  if (vidSet.has(v.variant_id)) dupVid.push(v.variant_id);
  vidSet.add(v.variant_id);
  if (!pidSet.has(v.product_id)) crit.push(`variant 指向不存在 product: ${v.variant_id}`);
});
if (dupVid.length) crit.push(`重复 variant_id: ${dupVid.length}`);
if (V.length !== BASE.totals.phone_variants) crit.push(`手机 variant ${V.length} ≠ 基线 ${BASE.totals.phone_variants}`);

// ---- Prices ----
let badPrice = 0, missingCur = 0, orphanPrice = 0;
PR.forEach(pr => {
  if (typeof pr.price !== 'number' || pr.price < 0) badPrice++;
  if (!pr.currency) missingCur++;
  if (!pidSet.has(pr.product_id)) orphanPrice++;
  else if (pr.variant_id && !vidSet.has(pr.variant_id)) orphanPrice++;
});
if (badPrice) crit.push(`非法价格(负数/非数字): ${badPrice}`);
if (missingCur) crit.push(`缺失货币: ${missingCur}`);
if (orphanPrice) crit.push(`价格孤儿(无对应产品/变体): ${orphanPrice}`);

// ---- Specs ----
const sidSet = new Set(S.map(s => s.product_id));
let zeroVal = 0, strUnitLeft = 0;
S.forEach(s => {
  if (!pidSet.has(s.product_id)) crit.push(`specs 孤儿: ${s.product_id}`);
  for (const [k, v] of Object.entries(s.specs || {})) {
    if (v && typeof v === 'object' && 'value' in v) {
      if (v.value === 0) zeroVal++; // 警告：未知值不应为0
    }
  }
});
if (zeroVal) warn.push(`specs 中数值为 0 的字段: ${zeroVal}（需人工确认是否真实为0）`);

// ---- 汇总 ----
const result = {
  generated_at: new Date().toISOString(),
  products: P.length,
  brands: B.length,
  categories: C.length,
  variants: V.length,
  prices: PR.length,
  critical_errors: crit.length,
  warnings: warn.length,
  details: { duplicate_product_id: dupPid.length, invalid_brand_ref: P.filter(p=>!bidSet.has(p.brand_id)).length, invalid_category_ref: P.filter(p=>!cidSet.has(p.primary_category_id)).length, zero_value_specs: zeroVal },
};
fs.writeFileSync(path.join(ROOT, 'validation-result.json'), JSON.stringify(result, null, 2));

console.log('===== VALIDATE-DB 结果 =====');
console.log('products        :', P.length, P.length===BASE.totals.products ? 'OK' : 'MISMATCH');
console.log('brands          :', B.length);
console.log('categories      :', C.length);
console.log('variants        :', V.length, V.length===BASE.totals.phone_variants ? 'OK' : 'MISMATCH');
console.log('prices          :', PR.length);
console.log('dup product_id  :', dupPid.length);
console.log('invalid brand   :', result.details.invalid_brand_ref);
console.log('invalid category:', result.details.invalid_category_ref);
console.log('zero-value specs:', zeroVal);
console.log('WARNINGS        :', warn.length);
warn.forEach(w => console.log('  ⚠ ', w));
console.log('CRITICAL        :', crit.length);
crit.forEach(c => console.log('  ✗ ', c));
console.log('=============================');
console.log(crit.length === 0 ? '✅ 校验通过（0 致命错误）' : '❌ 校验失败，请修复后重试');
process.exit(crit.length === 0 ? 0 : 2);
