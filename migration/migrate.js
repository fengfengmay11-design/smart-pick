'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/tornadoli/WorkBuddy/2026-07-15-16-38-34/phone-compare';
const V2 = path.join(ROOT, 'database/v2');
const CFG = path.join(ROOT, 'migration/config');
const BASE = require(path.join(ROOT, 'migration-baseline.json'));

// ---------- helpers ----------
const read = f => fs.readFileSync(f, 'utf8');
const jread = f => JSON.parse(read(f));
const jwrite = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 2));

function loadData(file) {
  const code = read(path.join(ROOT, file));
  const m = code.match(/const\s+\w+_DATA\s*=\s*(\[[\s\S]*?\];)/);
  if (!m) throw new Error('无法解析数组: ' + file);
  return eval(m[1].replace(/;\s*$/, ''));
}

const slug = s => String(s).toLowerCase().trim()
  .replace(/[^\w\u4e00-\u9fa5]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

const unitRules = jread(path.join(CFG, 'unit-rules.json'));
const UA = unitRules.unit_aliases;
const KEYHINTS = unitRules.key_hints;
const DISP = unitRules.display_unit;

function normalizeKey(k) {
  // camelCase / PascalCase -> snake_case
  return k.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').toLowerCase();
}

function normalizeValue(key, raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') {
    const hint = KEYHINTS[key] || null;
    if (hint) {
      return { value: raw, unit: hint, display_value: raw + (DISP[hint] || hint), original_value: String(raw) };
    }
    return { value: raw, unit: null, display_value: String(raw), original_value: String(raw) };
  }
  if (typeof raw === 'boolean') return raw;
  const s = String(raw).trim();
  if (s === '') return null;
  // 仅当整串为「数字 + 可选单位」时才结构化，避免把 "2560×1664"/"Wi-Fi 7" 误拆
  const m = s.match(/^(-?\d+(?:\.\d+)?)\s*([A-Za-z一-龥%°]+)?\s*$/);
  if (m) {
    const num = parseFloat(m[1]);
    let unitToken = m[2] || null;
    let unit = null, disp = s;
    if (unitToken) {
      unit = UA[unitToken] || unitToken;
      disp = num + (DISP[unit] || unit);
    } else if (KEYHINTS[key]) {
      unit = KEYHINTS[key];
      disp = num + (DISP[unit] || unit);
    }
    return { value: num, unit, display_value: disp, original_value: s };
  }
  return s; // 纯文本参数原样保留
}

// ---------- configs ----------
const catMap = jread(path.join(CFG, 'category-mapping.json'));
const brandMap = jread(path.join(CFG, 'brand-mapping.json'));
const tagMap = jread(path.join(CFG, 'tag-mapping.json'));
const schemas = jread(path.join(V2, 'parameter-schemas.json'));
const categories = jread(path.join(V2, 'categories.json'));
const catPriority = {};
categories.forEach(c => { catPriority[c.category_id] = c.priority; });

const FILES = {
  phone: 'phone-data.js', gpu: 'data-gpu.js', ac: 'data-ac.js', robot: 'data-robot.js',
  laptop: 'data-laptop.js', cpu: 'data-cpu.js', earphone: 'data-earphone.js',
  monitor: 'data-monitor.js', tablet: 'data-tablet.js', camera: 'data-camera.js',
  tv: 'data-tv.js', watch: 'data-watch.js', keyboard: 'data-keyboard.js',
};

// ---------- collections ----------
const products = [], specsOut = [], variants = [], prices = [], needsReview = [];
const brandsUsed = {}, seriesMap = {}, tagSet = {};
let parseFailures = 0;

function extractPhoneSeries(model) {
  const m = model.match(/^([A-Za-z]+|[一-龥]+)/);
  if (!m) return { series: null, generation: null };
  const series = m[1].trim();
  const rest = model.slice(series.length).trim();
  return { series, generation: rest || null };
}

function normTags(tags) {
  if (!Array.isArray(tags)) return [];
  const out = [];
  for (const t of tags) {
    const c = tagMap[t] || slug(t);
    if (!out.includes(c)) out.push(c);
    tagSet[c] = tagSet[c] || (tagMap[t] || t);
  }
  return out;
}

function flattenPhone(p) {
  const sp = {};
  if (p.screen) {
    sp.screen_size = normalizeValue('screen_size', p.screen.size);
    sp.screen_resolution = normalizeValue('screen_resolution', p.screen.resolution);
    sp.screen_refresh_rate = normalizeValue('screen_refresh_rate', p.screen.refreshRate);
    sp.screen_material = normalizeValue('screen_material', p.screen.material);
    sp.screen_type = normalizeValue('screen_type', p.screen.type);
  }
  if (p.body) {
    sp.body_height = normalizeValue('body_height', p.body.height);
    sp.body_width = normalizeValue('body_width', p.body.width);
    sp.body_thickness = normalizeValue('body_thickness', p.body.thickness);
    sp.body_weight = normalizeValue('body_weight', p.body.weight);
    sp.body_material = normalizeValue('body_material', p.body.material);
  }
  sp.ram = normalizeValue('ram', p.ram);
  if (p.features) {
    for (const [k, v] of Object.entries(p.features)) {
      sp['features_' + normalizeKey(k)] = (typeof v === 'boolean') ? (v ? '支持' : '不支持') : normalizeValue('features_' + normalizeKey(k), v);
    }
  }
  return sp;
}

function flattenSpecs(specObj) {
  const sp = {};
  if (!specObj) return sp;
  for (const [k, v] of Object.entries(specObj)) {
    sp[normalizeKey(k)] = normalizeValue(normalizeKey(k), v);
  }
  return sp;
}

function computeCompleteness(catId, sp) {
  const sc = schemas[catId];
  if (!sc || !sc.required || sc.required.length === 0) return null;
  const filled = sc.required.filter(k => {
    const v = sp[k];
    if (v === undefined || v === null) return false;
    if (typeof v === 'object' && 'value' in v) return v.value !== null && v.value !== undefined;
    return true;
  }).length;
  return Math.round(filled / sc.required.length * 100);
}

// ---------- migration loop ----------
let stopReason = null;
const baselineVariantCount = BASE.totals.phone_variants;

for (const [oldCat, file] of Object.entries(FILES)) {
  const arr = loadData(file);
  const cmap = catMap[oldCat];
  if (!cmap) { stopReason = '分类映射缺失: ' + oldCat; break; }
  const targetCat = cmap.target;
  const catPriorityVal = cmap.priority || catPriority[targetCat] || 'core';

  for (const p of arr) {
    const bmap = brandMap[p.brand];
    if (!bmap) { stopReason = `品牌无法映射: "${p.brand}" (${oldCat}/${p.id})`; break; }
    const brandId = bmap.brand_id;
    brandsUsed[brandId] = bmap;

    const productId = p.id;
    const { series, generation } = (oldCat === 'phone') ? extractPhoneSeries(p.model) : { series: null, generation: null };
    let seriesId = null;
    if (series) {
      seriesId = slug(brandId + '_' + series);
      seriesMap[seriesId] = { series_id: seriesId, brand_id: brandId, series_name: series };
    }

    const fullName = `${bmap.brand_name} ${p.model}`;
    const aliases = Array.from(new Set([p.model, String(p.model).toLowerCase(), String(p.model).replace(/\s+/g, ''), String(p.model).replace(/[-_]/g, '')].filter(Boolean)));

    const sp = (oldCat === 'phone') ? flattenPhone(p) : flattenSpecs(p.specs);
    const completeness = computeCompleteness(targetCat, sp);

    const product = {
      product_id: productId,
      legacy_id: productId,
      brand_id: brandId,
      primary_category_id: targetCat,
      series_id: seriesId,
      generation,
      model: p.model,
      variant: null,
      full_name: fullName,
      aliases,
      status: 'active',
      tags: normTags(p.tags),
      release_date: p.launchDate || null,
      image: p.image || '',
      official_url: p.officialUrl || '',
      data_completeness: completeness,
      data_confidence: 'medium',
      needs_review: false,
      created_at: p.lastVerified || BASE.generated_at,
      updated_at: p.lastVerified || BASE.generated_at,
    };
    products.push(product);
    specsOut.push({ product_id: productId, specs: sp });

    // prices + variants
    if (oldCat === 'phone' && Array.isArray(p.storageOptions)) {
      for (const so of p.storageOptions) {
        const vid = slug(productId + '_' + so.storage);
        variants.push({
          variant_id: vid, product_id: productId, variant_name: so.storage,
          storage: so.storage, memory: p.ram || null, color: null, sku: null, status: 'active',
        });
        if (so.priceJd != null) prices.push({ price_id: vid + '_jd', product_id: productId, variant_id: vid, source: 'jd', price: so.priceJd, currency: 'CNY', price_type: 'retail', last_updated_at: p.lastVerified || BASE.generated_at });
        if (so.pricePdd != null) prices.push({ price_id: vid + '_pdd', product_id: productId, variant_id: vid, source: 'pdd', price: so.pricePdd, currency: 'CNY', price_type: 'retail', last_updated_at: p.lastVerified || BASE.generated_at });
      }
    } else if (p.prices) {
      if (p.prices.jd != null) prices.push({ price_id: productId + '_jd', product_id: productId, variant_id: null, source: 'jd', price: p.prices.jd, currency: 'CNY', price_type: 'retail', last_updated_at: p.lastVerified || BASE.generated_at });
      if (p.prices.pdd != null) prices.push({ price_id: productId + '_pdd', product_id: productId, variant_id: null, source: 'pdd', price: p.prices.pdd, currency: 'CNY', price_type: 'retail', last_updated_at: p.lastVerified || BASE.generated_at });
    }
  }
  if (stopReason) break;
}

// ---------- HARD STOP CONDITIONS ----------
const errors = [];
if (stopReason) errors.push('STOP: ' + stopReason);
if (products.length !== BASE.totals.products) errors.push(`STOP C1: 产品数 ${products.length} ≠ 基线 ${BASE.totals.products}`);
const dupIds = products.map(p => p.product_id).filter((v, i, a) => a.indexOf(v) !== i);
if (dupIds.length) errors.push(`STOP C2: 重复 product_id ${dupIds.length} 个`);
const invalidBrand = products.filter(p => !brandsUsed[p.brand_id]).map(p => p.product_id);
if (invalidBrand.length) errors.push(`STOP C3: 无效 brand_id ${invalidBrand.length} 个`);
const invalidCat = products.filter(p => !catPriority[p.primary_category_id]).map(p => p.product_id);
if (invalidCat.length) errors.push(`STOP C4: 无效 category_id ${invalidCat.length} 个`);
if (variants.length !== baselineVariantCount) errors.push(`STOP C5: 手机 variant 数 ${variants.length} ≠ 基线 ${baselineVariantCount}`);
const lostPrices = products.filter(p => !prices.some(pr => pr.product_id === p.product_id)).map(p => p.product_id);
if (lostPrices.length > products.length * 0.2) errors.push(`STOP C6: 大量产品缺失价格 (${lostPrices.length}/${products.length})`);
if (errors.length) {
  console.error('\n========== 迁移中止 ==========');
  errors.forEach(e => console.error(e));
  process.exit(1);
}

// ---------- build brand / series / tag tables ----------
const brands = Object.values(brandsUsed).map(b => ({
  brand_id: b.brand_id, brand_name: b.brand_name,
  brand_name_cn: b.brand_name_cn || '', brand_name_en: b.brand_name_en || '',
  aliases: b.aliases || [], official_url: '', logo: '', status: 'active',
}));
const series = Object.values(seriesMap);
const tags = Object.entries(tagSet).map(([id, name]) => ({ tag_id: id, tag_name: name, tag_aliases: [] }));

// ---------- write V2 ----------
['products', 'product-specs', 'product-variants', 'prices', 'brands', 'series', 'tags'].forEach(() => {});
jwrite(path.join(V2, 'products.json'), products);
jwrite(path.join(V2, 'product-specs.json'), specsOut);
jwrite(path.join(V2, 'product-variants.json'), variants);
jwrite(path.join(V2, 'prices.json'), prices);
jwrite(path.join(V2, 'brands.json'), brands);
jwrite(path.join(V2, 'series.json'), series);
jwrite(path.join(V2, 'tags.json'), tags);

// ---------- migration report data ----------
const report = {
  generated_at: new Date().toISOString(),
  baseline: BASE.totals,
  result: {
    products: products.length,
    brands: brands.length,
    categories: categories.length,
    variants: variants.length,
    prices: prices.length,
    series: series.length,
    tags: tags.length,
  },
  critical_errors: 0,
  needs_review: needsReview.length,
  per_new_category: {},
};
products.forEach(p => { report.per_new_category[p.primary_category_id] = (report.per_new_category[p.primary_category_id] || 0) + 1; });
jwrite(path.join(ROOT, 'migration-report.json'), report);

console.log('=== 迁移成功 ===');
console.log('products:', products.length, '(基线', BASE.totals.products + ')');
console.log('variants:', variants.length, '(基线', baselineVariantCount + ')');
console.log('prices:', prices.length);
console.log('brands:', brands.length, '(基线', BASE.totals.brands + ')');
console.log('series:', series.length, 'tags:', tags.length);
console.log('新分类树节点:', categories.length);
console.log('parse_failures:', parseFailures);
console.log('per_new_category:', JSON.stringify(report.per_new_category, null, 0));
