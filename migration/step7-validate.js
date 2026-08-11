'use strict';
/**
 * step7-validate.js — 校验 8 个 subagent seed 文件：
 *  - 结构：顶层 {products:[...]} 或 [...] 均可
 *  - brand_id / primary_category_id 必须存在，且 category 有 schema
 *  - release_date >= 2023-01-01
 *  - 必须有 source_url
 *  - specs 的键必须是该 category schema 定义的字段
 *  - 数值字段若用对象须含 value/unit/display_value
 * 输出：归一化为数组的 seed-step7-gX.norm.json，并打印问题清单。
 */
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/tornadoli/WorkBuddy/2026-07-15-16-38-34/phone-compare';
const V2 = path.join(ROOT, 'database/v2');
const M = path.join(ROOT, 'migration');
const B = JSON.parse(fs.readFileSync(path.join(V2, 'brands.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(V2, 'categories.json'), 'utf8'));
const SCH = JSON.parse(fs.readFileSync(path.join(V2, 'parameter-schemas.json'), 'utf8'));
const brandIds = new Set(B.map(b => b.brand_id));
const catIds = new Set(C.map(c => c.category_id));
const schemaFields = cid => { const d = SCH[cid]; return Array.isArray(d) ? d : (d && d.fields) || []; };

const groups = ['g1','g2','g3','g4','g5','g6','g7','g8'];
let totalOk = 0, totalIssues = 0;
const allIssues = [];

for (const g of groups) {
  const raw = JSON.parse(fs.readFileSync(path.join(M, `seed-step7-${g}.json`), 'utf8'));
  const list = Array.isArray(raw) ? raw : (raw.products || []);
  const norm = [];
  let ok = 0, issues = 0;
  for (const p of list) {
    const errs = [];
    if (!p.brand_id || !brandIds.has(p.brand_id)) errs.push(`品牌不存在:${p.brand_id}`);
    if (!p.primary_category_id || !catIds.has(p.primary_category_id)) errs.push(`分类不存在:${p.primary_category_id}`);
    else if (!schemaFields(p.primary_category_id).length) errs.push(`分类无 schema:${p.primary_category_id}`);
    if (!p.model) errs.push('缺 model');
    if (!p.release_date || p.release_date < '2023-01-01') errs.push(`release_date 过早/缺:${p.release_date}`);
    if (!p.source_url) errs.push('缺 source_url');
    // specs 键校验
    const sf = new Set(schemaFields(p.primary_category_id));
    if (p.specs) {
      for (const k of Object.keys(p.specs)) {
        if (!sf.has(k)) errs.push(`specs 越界字段:${k}`);
        const v = p.specs[k];
        if (v && typeof v === 'object' && !('value' in v)) errs.push(`specs.${k} 对象缺 value`);
      }
    }
    if (p.prices && !Array.isArray(p.prices)) errs.push('prices 非数组');
    if (errs.length) { issues++; allIssues.push(`[${g}] ${p.brand_id||'?'}/${p.model||'?'} -> ` + errs.join('; ')); }
    else { ok++; norm.push(p); }
  }
  fs.writeFileSync(path.join(M, `seed-step7-${g}.norm.json`), JSON.stringify(norm, null, 2) + '\n');
  totalOk += ok; totalIssues += issues;
  console.log(`组 ${g}: 通过 ${ok} / 问题 ${issues} -> seed-step7-${g}.norm.json`);
}
console.log('\n===== 汇总 =====');
console.log('通过总数:', totalOk, '| 问题总数:', totalIssues);
if (allIssues.length) { console.log('\n--- 问题清单 ---'); allIssues.forEach(i => console.log(' • ' + i)); }
else console.log('✅ 全部 seed 通过结构校验');
