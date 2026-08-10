'use strict';
/**
 * step5b-tag-clean.js — Step 5 遗留清理：把规格型 token 从 product.tags 迁移/清理。
 * - 扫描全部 product.tags，识别规格泄漏 token（RAM/VRAM/刷新率/架构/芯片 等）。
 * - 仅“移除”这些 token，使 tags 只保留语义标签（gaming/flagship/OLED…）。
 * - 对无歧义的 Ngb / Nhz token，若对应 spec 字段当前为空，则把值从 tag 搬迁进 specs（非编造，值直接来自 token）。
 * 运行：node migration/step5b-tag-clean.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/tornadoli/WorkBuddy/2026-07-15-16-38-34/phone-compare';
const V2 = path.join(ROOT, 'database/v2');
const load = f => JSON.parse(fs.readFileSync(path.join(V2, f), 'utf8'));
const save = (f, d) => fs.writeFileSync(path.join(V2, f), JSON.stringify(d, null, 2) + '\n');

const products = load('products.json');
const specs = load('product-specs.json');
const schemas = load('parameter-schemas.json');

const SCHEMA_COMMENT = '_comment';
const schemaFields = cid => {
  const def = schemas[cid];
  if (!def) return [];
  return (Array.isArray(def) ? def : (def.fields || [])).filter(k => k && !String(k).startsWith('_'));
};

// 规格泄漏 token 识别（与历史诊断一致）
const SPEC_RE = /(\d+\s*(gb|tb|hz|ghz|wh|w|mp|mhz)\b)|(geforce|radeon|rtx|gtx|rx_|navi|polaris|vega|zen_?\d|cortex|snapdragon|kirin|dimensity|exynos|ax\d+|wifi\d|a\d+b\d+|6_2ghz|4k_|2k_|1080p_|8000hz|120w|65w|usb_c_|instinct|mx_)/i;
const gbRe = /^(\d+)gb$/i;
const hzRe = /^(\d+)hz$/i;

// 1) 收集实际出现的规格泄漏 token（只处理真实存在于 tags 的，避免误伤语义标签）
const specTokens = new Set();
products.forEach(p => (p.tags || []).forEach(t => { if (SPEC_RE.test(t)) specTokens.add(t); }));

const spMap = {};
specs.forEach(x => { spMap[x.product_id] = x.specs || {}; });

let removedCount = 0, migrated = 0, affectedProducts = 0;
const removedByToken = {};

function getField(p, name) {
  const sp = spMap[p.product_id] || {};
  const v = sp[name];
  if (v === undefined || v === null) return [null, false];
  if (typeof v === 'object' && 'value' in v) return [v.value, true];
  return [v, true];
}
function setField(p, name, num, unit) {
  const sp = spMap[p.product_id] || (spMap[p.product_id] = {});
  sp[name] = { value: num, unit, display_value: num + unit, original_value: String(num) };
}

// 2) 逐产品清理 + 安全搬迁
for (const p of products) {
  const before = p.tags || [];
  const after = before.filter(t => !specTokens.has(t));
  if (after.length !== before.length) {
    removedByToken; // noop
    const removed = before.filter(t => specTokens.has(t));
    removed.forEach(t => { removedByToken[t] = (removedByToken[t] || 0) + 1; removedCount++; });
    p.tags = after;
    affectedProducts++;

    // 安全搬迁：Ngb / Nhz
    const fields = schemaFields(p.primary_category_id);
    for (const t of removed) {
      const m = t.match(gbRe);
      if (m) {
        const num = parseInt(m[1], 10);
        if (fields.includes('vram') && getField(p, 'vram')[1] === false) { setField(p, 'vram', num, 'GB'); migrated++; continue; }
        if (fields.includes('ram') && getField(p, 'ram')[1] === false) { setField(p, 'ram', num, 'GB'); migrated++; continue; }
      }
      const h = t.match(hzRe);
      if (h) {
        const num = parseInt(h[1], 10);
        if (fields.includes('screen_refresh_rate') && getField(p, 'screen_refresh_rate')[1] === false) { setField(p, 'screen_refresh_rate', num, 'Hz'); migrated++; continue; }
        if (fields.includes('refresh_rate') && getField(p, 'refresh_rate')[1] === false) { setField(p, 'refresh_rate', num, 'Hz'); migrated++; continue; }
      }
    }
  }
}

// 3) 重算 data_completeness（与 expand.js 一致）
products.forEach(p => {
  const fields = schemaFields(p.primary_category_id);
  const total = fields.length;
  if (!total) return;
  const sp_ = spMap[p.product_id] || {};
  const filled = fields.filter(f => sp_[f] !== undefined && sp_[f] !== null).length;
  p.data_completeness = Math.round(filled / total * 100);
});

// 4) 写回
save('product-specs.json', specs);
save('products.json', products);

console.log('===== Step5b 标签清理 =====');
console.log('受影响产品数:', affectedProducts);
console.log('移除 token 总数:', removedCount, '| 安全搬迁进 specs:', migrated);
console.log('移除的 token 分布(Top20):');
Object.entries(removedByToken).sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([k, v]) => console.log('  ' + k + ': ' + v));
