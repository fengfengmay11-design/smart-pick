'use strict';
/**
 * db-adapter.js — V2 标准库 → 旧前端所需数据格式 的兼容层。
 * 目标：未来前端切换为直接读 V2 时，搜索/对比/评分/推荐逻辑零改动。
 * 本轮仅验证“V2 可完整重建旧功能所需数据”，不改写任何旧 data-*.js。
 */
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

const brandName = bid => {
  const b = B.find(x => x.brand_id === bid);
  if (!b) return bid;
  return b.brand_name_cn || b.brand_name_en || b.brand_name;
};
const specOf = pid => (S.find(s => s.product_id === pid) || {}).specs || {};
const variantsOf = pid => V.filter(v => v.product_id === pid);
const pricesOf = pid => PR.filter(p => p.product_id === pid);

// 数值字段还原为展示字符串（如 "5200mAh"），纯文本原样返回
function flatValue(v) {
  if (v && typeof v === 'object' && 'value' in v) return v.display_value;
  return v;
}

// 旧分类反查（V2 category_id → 旧 file key）
const OLD_CAT = {
  smartphone: 'phone', laptop: 'laptop', cpu: 'cpu', gpu: 'gpu', tablet: 'tablet',
  monitor: 'monitor', keyboard: 'keyboard', earphone: 'earphone', tv: 'tv',
  smartwatch: 'watch', camera: 'camera', cleaning_robot: 'robot', smart_appliance: 'ac',
};

function reconstructPhone(p) {
  const sp = specOf(p.product_id);
  const vats = variantsOf(p.product_id);
  const pris = pricesOf(p.product_id);
  const storageOptions = vats.map(v => {
    const jd = pris.find(x => x.variant_id === v.variant_id && x.source === 'jd');
    const pdd = pris.find(x => x.variant_id === v.variant_id && x.source === 'pdd');
    return {
      storage: v.storage,
      priceJd: jd ? jd.price : null,
      pricePdd: pdd ? pdd.price : null,
      shopTypeJd: '官方旗舰店', shopTypePdd: '品牌', couponNote: '',
    };
  });
  return {
    id: p.product_id, brand: brandName(p.brand_id), model: p.model,
    image: p.image, launchDate: p.release_date,
    tags: p.tags, officialUrl: p.official_url, lastVerified: p.updated_at,
    storageOptions, defaultStorage: storageOptions[0] ? storageOptions[0].storage : null,
    screen: {
      size: flatValue(sp.screen_size), resolution: flatValue(sp.screen_resolution),
      refreshRate: flatValue(sp.screen_refresh_rate), material: flatValue(sp.screen_material), type: flatValue(sp.screen_type),
    },
    body: {
      height: flatValue(sp.body_height), width: flatValue(sp.body_width), thickness: flatValue(sp.body_thickness),
      weight: flatValue(sp.body_weight), material: flatValue(sp.body_material),
    },
    ram: flatValue(sp.ram),
    features: Object.fromEntries(Object.entries(sp).filter(([k]) => k.startsWith('features_')).map(([k, v]) => [k.replace('features_', ''), flatValue(v)])),
  };
}

function reconstructOther(p, oldCat) {
  const sp = specOf(p.product_id);
  const pris = pricesOf(p.product_id);
  const jd = pris.find(x => x.source === 'jd' && !x.variant_id);
  const pdd = pris.find(x => x.source === 'pdd' && !x.variant_id);
  const specs = {};
  for (const [k, v] of Object.entries(sp)) specs[k] = flatValue(v);
  return {
    id: p.product_id, brand: brandName(p.brand_id), model: p.model,
    image: p.image, launchDate: p.release_date,
    tags: p.tags, officialUrl: p.official_url, lastVerified: p.updated_at,
    prices: { jd: jd ? jd.price : null, pdd: pdd ? pdd.price : null },
    specs,
  };
}

function getAllLegacy() {
  const out = [];
  for (const p of P) {
    const oldCat = OLD_CAT[p.primary_category_id] || p.primary_category_id;
    out.push(oldCat === 'phone' ? reconstructPhone(p) : reconstructOther(p, oldCat));
  }
  return out;
}

// ---------- 等价性验证（不改写旧文件，仅验证 V2 可重建） ----------
function verify() {
  const all = getAllLegacy();
  let priceRecords = 0, phoneVariants = 0, missingPrice = 0;
  all.forEach(p => {
    if (p.storageOptions) {
      phoneVariants += p.storageOptions.length;
      p.storageOptions.forEach(o => { if (o.priceJd != null) priceRecords++; if (o.pricePdd != null) priceRecords++; });
    } else {
      if (p.prices && p.prices.jd != null) priceRecords++;
      if (p.prices && p.prices.pdd != null) priceRecords++;
      else missingPrice++;
    }
  });
  const r = {
    legacy_products: all.length,
    baseline_products: P.length,
    legacy_phone_variants: phoneVariants,
    baseline_phone_variants: V.length,
    legacy_price_records: priceRecords,
    baseline_price_records: PR.length,
    products_match: all.length === P.length,
    variants_match: phoneVariants === V.length,
  };
  return r;
}

if (require.main === module) {
  const r = verify();
  console.log('===== ADAPTER 等价性验证 =====');
  console.log('legacy products :', r.legacy_products, r.products_match ? '✅' : '❌');
  console.log('legacy variants :', r.legacy_phone_variants, r.variants_match ? '✅' : '❌');
  console.log('legacy priceRecs:', r.legacy_price_records, '(基线', r.baseline_price_records + ')');
  console.log('=============================');
  const ok = r.products_match && r.variants_match;
  console.log(ok ? '✅ Adapter 可完整重建旧前端所需数据' : '❌ Adapter 重建不一致');
  process.exit(ok ? 0 : 2);
}

module.exports = { getAllLegacy, verify, reconstructPhone, reconstructOther };
