/**
 * Step10 全库健康检查：跨「V2 数据库 / 构建产物 / 前端配置」三层做一致性与质量体检。
 * 输出 migration/health-check-result.json，同时在终端打印摘要。
 *
 * 字段口径（与 V2 实际结构对齐）：
 *   products.primary_category_id / official_url / data_source / data_confidence / needs_review
 *   parameter-schemas.json 是「品类 -> 字段名数组」的对象
 *   product-specs.specs 的值可能是标量，也可能是 {value, unit, display_value}
 *   categories 分层：level 1 为大类（天然无商品），level 2+ 才挂商品
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const V2 = path.join(ROOT, 'database/v2');
const rd = (f) => JSON.parse(fs.readFileSync(path.join(V2, f), 'utf8'));

const products = rd('products.json');
const brands = rd('brands.json');
const categories = rd('categories.json');
const specs = rd('product-specs.json');
const variants = rd('product-variants.json');
const prices = rd('prices.json');
const schemaMap = rd('parameter-schemas.json');
const tags = rd('tags.json');
let series = []; try { series = rd('series.json'); } catch (e) {}

const R = { generated_at: new Date().toISOString().slice(0, 19).replace('T', ' ') };
const schemaCats = Object.keys(schemaMap).filter(k => !k.startsWith('_'));

R.scale = {
  products: products.length, brands: brands.length, categories: categories.length,
  specs: specs.length, variants: variants.length, prices: prices.length,
  schema_categories: schemaCats.length, tags: tags.length, series: series.length,
};

// ---------- 1. 引用完整性 ----------
const brandIds = new Set(brands.map(b => b.brand_id));
const catIds = new Set(categories.map(c => c.category_id));
const prodIds = new Set(products.map(p => p.product_id));
const seriesIds = new Set(series.map(s => s.series_id));
R.integrity = {
  dup_product_id: products.length - prodIds.size,
  invalid_brand_ref: products.filter(p => !brandIds.has(p.brand_id)).map(p => p.product_id),
  invalid_category_ref: products.filter(p => !catIds.has(p.primary_category_id)).map(p => p.product_id),
  dangling_series_ref: products.filter(p => p.series_id && !seriesIds.has(p.series_id)).map(p => p.product_id),
  orphan_specs: specs.filter(s => !prodIds.has(s.product_id)).map(s => s.product_id),
  orphan_variants: variants.filter(v => !prodIds.has(v.product_id)).map(v => v.product_id),
  orphan_prices: prices.filter(p => !prodIds.has(p.product_id)).map(p => p.product_id),
  products_without_specs: products.filter(p => !specs.some(s => s.product_id === p.product_id)).map(p => p.product_id),
};
const bm = new Map();
products.forEach(p => {
  const k = p.brand_id + '||' + String(p.model || '').toLowerCase().trim();
  bm.set(k, (bm.get(k) || []).concat(p.product_id));
});
R.integrity.dup_brand_model = [...bm.entries()].filter(([, v]) => v.length > 1).map(([k, v]) => ({ key: k, ids: v }));

// ---------- 2. 价格 ----------
const pricedProd = new Set();
prices.forEach(p => { if (p.price > 0) pricedProd.add(p.product_id); });
const noPrice = products.filter(p => !pricedProd.has(p.product_id));
const bySrc = {};
prices.forEach(p => { bySrc[p.source] = (bySrc[p.source] || 0) + 1; });
const brandName = (id) => (brands.find(b => b.brand_id === id) || {}).brand_name || id;
R.pricing = {
  total_price_records: prices.length,
  by_source: bySrc,
  products_with_price: products.length - noPrice.length,
  products_without_price: noPrice.length,
  coverage_pct: +(100 * (products.length - noPrice.length) / products.length).toFixed(1),
  records_with_source_url: prices.filter(p => p.source_url).length,
  zero_or_negative: prices.filter(p => !(p.price > 0)).map(p => p.price_id),
  no_price_list: noPrice.map(p => ({
    id: p.product_id, brand: brandName(p.brand_id), model: p.model, category: p.primary_category_id,
  })),
};

// ---------- 3. 品类分布 ----------
const byCat = {};
products.forEach(p => { byCat[p.primary_category_id] = (byCat[p.primary_category_id] || 0) + 1; });
const leafCats = categories.filter(c => (c.category_level || 1) > 1);
R.categories = {
  total: categories.length,
  level1: categories.length - leafCats.length,
  leaf: leafCats.length,
  populated: Object.keys(byCat).length,
  empty_leaf: leafCats.filter(c => !byCat[c.category_id]).map(c => c.category_id),
  distribution: Object.entries(byCat).sort((a, b) => b[1] - a[1]),
};

// ---------- 4. 规格完整度 ----------
const specByProd = new Map();
specs.forEach(s => specByProd.set(s.product_id, s.specs || {}));
const isFilled = (v) => {
  if (v === null || v === undefined || v === '') return false;
  if (typeof v === 'object') return v.value !== null && v.value !== undefined && v.value !== '';
  return true;
};
let filled = 0, expected = 0;
const thin = [];
for (const p of products) {
  const fields = schemaMap[p.primary_category_id];
  if (!Array.isArray(fields) || !fields.length) continue;
  const sp = specByProd.get(p.product_id) || {};
  const have = fields.filter(f => isFilled(sp[f])).length;
  filled += have; expected += fields.length;
  if (have / fields.length < 0.5) thin.push({ id: p.product_id, have, need: fields.length });
}
let zeroSpec = 0; const zeroSample = [];
specs.forEach(s => {
  Object.entries(s.specs || {}).forEach(([k, v]) => {
    const num = (v && typeof v === 'object') ? v.value : v;
    if (num === 0 || num === '0') { zeroSpec++; if (zeroSample.length < 12) zeroSample.push(s.product_id + '.' + k); }
  });
});
R.specs_quality = {
  overall_fill_pct: expected ? +(100 * filled / expected).toFixed(1) : null,
  categories_without_schema: [...new Set(products.map(p => p.primary_category_id))].filter(c => !schemaMap[c]),
  thin_products_count: thin.length,
  thin_products_sample: thin.slice(0, 15),
  zero_value_fields: zeroSpec,
  zero_value_sample: zeroSample,
};

// ---------- 5. 标签 ----------
const tagIds = new Set(tags.map(t => t.tag_id));
const usedTags = new Map();
products.forEach(p => (p.tags || []).forEach(t => usedTags.set(t, (usedTags.get(t) || 0) + 1)));
const leakRe = /^\s*\d+(\.\d+)?\s*(GB|TB|MB|Hz|W|mAh|英寸|inch|mm|g|kg|K|fps|nit|bit|核|线程)\s*$/i;
R.tags = {
  defined: tags.length,
  used_distinct: usedTags.size,
  used_not_defined: [...usedTags.keys()].filter(t => !tagIds.has(t)),
  defined_not_used: [...tagIds].filter(t => !usedTags.has(t)).length,
  products_without_tags: products.filter(p => !p.tags || !p.tags.length).map(p => p.product_id),
  spec_leak_tags: [...usedTags.keys()].filter(t => leakRe.test(t)),
  top_tags: [...usedTags.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12),
};

// ---------- 6. 溯源与置信度 ----------
R.provenance = {
  with_official_url: products.filter(p => p.official_url).length,
  without_official_url: products.filter(p => !p.official_url).length,
  needs_review: products.filter(p => p.needs_review).length,
  confidence: products.reduce((a, p) => { a[p.data_confidence] = (a[p.data_confidence] || 0) + 1; return a; }, {}),
  data_source: products.reduce((a, p) => { a[p.data_source] = (a[p.data_source] || 0) + 1; return a; }, {}),
  avg_completeness: +(products.reduce((s, p) => s + (p.data_completeness || 0), 0) / products.length).toFixed(1),
};

// ---------- 7. 构建产物 ----------
const sb = {}; vm.createContext(sb);
const dataFiles = fs.readdirSync(path.join(ROOT, 'data')).filter(f => /^(data-.*|phone-data)\.js$/.test(f)).sort();
let buildTotal = 0; const perFile = {};
for (const f of dataFiles) {
  const src = fs.readFileSync(path.join(ROOT, 'data', f), 'utf8');
  const m = src.match(/^\s*(?:const|var|let)\s+([A-Z0-9_]+)\s*=/m);
  vm.runInContext(src.replace(/^\s*const\s/m, 'var '), sb);
  const n = Array.isArray(sb[m[1]]) ? sb[m[1]].length : 0;
  perFile[f] = n; buildTotal += n;
}
R.build = { files: dataFiles.length, total_items: buildTotal, matches_db: buildTotal === products.length, per_file: perFile };

// ---------- 8. 前端 ----------
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const catBlock = html.slice(html.indexOf('const CATEGORIES = {'), html.indexOf('\n};', html.indexOf('const CATEGORIES = {')));
const feKeys = [...catBlock.matchAll(/^  ([a-z_0-9]+):\s*\{/gm)].map(m => m[1]);
const gStart = html.indexOf('const CATEGORY_GROUPS = [');
const gBlock = html.slice(gStart, html.indexOf('\n];', gStart));
const groups = [...gBlock.matchAll(/key:\s*'([^']+)',\s*name:\s*'([^']+)',\s*cats:\s*\[([^\]]+)\]/g)]
  .map(m => ({ key: m[1], name: m[2], cats: m[3].split(',').map(s => s.trim().replace(/'/g, '')).filter(Boolean) }));
const grouped = groups.flatMap(g => g.cats);
const scriptRefs = [...html.matchAll(/<script\s+src="([^"]+\.js)"/g)].map(m => m[1]);
R.frontend = {
  registered_categories: feKeys.length,
  groups: groups.map(g => ({ name: g.name, cats: g.cats.length })),
  ungrouped: feKeys.filter(k => !grouped.includes(k)),
  grouped_not_registered: grouped.filter(k => !feKeys.includes(k)),
  data_script_refs: scriptRefs.filter(s => /^(data-|phone-data)/.test(s)).length,
  missing_script_refs: dataFiles.filter(f => !scriptRefs.includes(f)),
  uses_pickPrice: (html.match(/getPrice: pickPrice/g) || []).length,
  uses_pickSource: (html.match(/getPriceSource: pickSource/g) || []).length,
  hardcoded_price_min: (html.match(/Math\.min\(\s*(item|opt|o)\.price/g) || []).length,
  raw_yen_interpolation: (html.match(/¥\$\{(?!.*(priceLabel|yuan))[^}]*price[^}]*\}/g) || []).length,
};
R.frontend.db_leaf_cats_not_exposed = Object.keys(byCat).filter(c => !feKeys.includes(c));

// 前端 44 品类 -> 覆盖多少商品
let feCovered = 0;
const feCatToVar = {};
for (const k of feKeys) {
  const m = catBlock.match(new RegExp('^  ' + k + ':[\\s\\S]*?data:\\s*\\(\\)\\s*=>\\s*([A-Z0-9_]+)', 'm'));
  if (m) { feCatToVar[k] = m[1]; feCovered += Array.isArray(sb[m[1]]) ? sb[m[1]].length : 0; }
}
R.frontend.items_reachable = feCovered;
R.frontend.all_items_reachable = feCovered === products.length;

// ---------- 汇总 ----------
const issues = [];
const add = (lvl, cond, msg) => { if (cond) issues.push({ level: lvl, msg }); };
add('CRITICAL', R.integrity.dup_product_id > 0, `重复 product_id ${R.integrity.dup_product_id} 个`);
add('CRITICAL', R.integrity.invalid_brand_ref.length, `品牌引用失效 ${R.integrity.invalid_brand_ref.length} 条`);
add('CRITICAL', R.integrity.invalid_category_ref.length, `品类引用失效 ${R.integrity.invalid_category_ref.length} 条`);
add('CRITICAL', R.integrity.orphan_specs.length, `孤儿规格 ${R.integrity.orphan_specs.length} 条`);
add('CRITICAL', R.integrity.orphan_prices.length, `孤儿价格 ${R.integrity.orphan_prices.length} 条`);
add('CRITICAL', R.integrity.orphan_variants.length, `孤儿变体 ${R.integrity.orphan_variants.length} 条`);
add('CRITICAL', R.integrity.products_without_specs.length, `无规格商品 ${R.integrity.products_without_specs.length} 款`);
add('CRITICAL', R.pricing.zero_or_negative.length, `非正价格记录 ${R.pricing.zero_or_negative.length} 条`);
add('CRITICAL', !R.build.matches_db, `构建产物 ${R.build.total_items} 与数据库 ${R.scale.products} 不一致`);
add('CRITICAL', R.frontend.ungrouped.length, `前端品类未分组 ${R.frontend.ungrouped.length} 个`);
add('CRITICAL', R.frontend.grouped_not_registered.length, `分组引用未注册品类 ${R.frontend.grouped_not_registered.length} 个`);
add('CRITICAL', R.frontend.missing_script_refs.length, `data 文件未被引用 ${R.frontend.missing_script_refs.length} 个`);
add('CRITICAL', R.frontend.hardcoded_price_min > 0, `残留 Math.min 价格硬编码 ${R.frontend.hardcoded_price_min} 处`);
add('CRITICAL', !R.frontend.all_items_reachable, `前端可达商品 ${R.frontend.items_reachable} ≠ 全库 ${products.length}`);
add('CRITICAL', R.tags.used_not_defined.length, `使用了未定义标签 ${R.tags.used_not_defined.length} 个`);
add('CRITICAL', R.specs_quality.categories_without_schema.length, `有商品但无 schema 的品类 ${R.specs_quality.categories_without_schema.length} 个`);
add('WARNING', R.integrity.dangling_series_ref.length, `悬空 series_id ${R.integrity.dangling_series_ref.length} 条`);
add('WARNING', R.integrity.dup_brand_model.length, `brand+model 疑似重复 ${R.integrity.dup_brand_model.length} 组`);
add('WARNING', R.pricing.products_without_price, `无价商品 ${R.pricing.products_without_price} 款（已确认无国行报价）`);
add('WARNING', R.categories.empty_leaf.length, `空叶子品类 ${R.categories.empty_leaf.length} 个`);
add('WARNING', R.specs_quality.zero_value_fields, `规格数值为 0 的字段 ${R.specs_quality.zero_value_fields} 个`);
add('WARNING', R.specs_quality.thin_products_count, `规格填充率<50% 的商品 ${R.specs_quality.thin_products_count} 款`);
add('WARNING', R.tags.spec_leak_tags.length, `疑似参数泄漏标签 ${R.tags.spec_leak_tags.length} 个`);
add('WARNING', R.tags.products_without_tags.length, `无标签商品 ${R.tags.products_without_tags.length} 款`);
add('WARNING', R.provenance.without_official_url, `无官网链接商品 ${R.provenance.without_official_url} 款`);
add('WARNING', R.provenance.needs_review, `标记待复核商品 ${R.provenance.needs_review} 款`);
add('WARNING', R.frontend.raw_yen_interpolation, `未过滤的 ¥ 直插值 ${R.frontend.raw_yen_interpolation} 处`);
R.issues = issues;
R.summary = { critical: issues.filter(i => i.level === 'CRITICAL').length, warning: issues.filter(i => i.level === 'WARNING').length };

fs.writeFileSync(path.join(__dirname, 'health-check-result.json'), JSON.stringify(R, null, 2) + '\n');

console.log('===== 全库健康检查 =====');
console.log('规模:', JSON.stringify(R.scale));
console.log('价格覆盖:', R.pricing.coverage_pct + '%', `(${R.pricing.products_with_price}/${R.scale.products})`,
  '| 记录', R.pricing.total_price_records, '| 来源', JSON.stringify(R.pricing.by_source));
console.log('规格填充率:', R.specs_quality.overall_fill_pct + '% | 平均完整度:', R.provenance.avg_completeness);
console.log('构建产物:', R.build.files, '文件', R.build.total_items, '款', R.build.matches_db ? '✅' : '❌');
console.log('前端:', R.frontend.registered_categories, '品类 /', R.frontend.groups.length, '分组 | 可达商品',
  R.frontend.items_reachable, R.frontend.all_items_reachable ? '✅' : '❌');
console.log('\nCRITICAL:', R.summary.critical, '| WARNING:', R.summary.warning);
issues.forEach(i => console.log(`  ${i.level === 'CRITICAL' ? '❌' : '⚠️ '} ${i.msg}`));
console.log('\n→ migration/health-check-result.json');
