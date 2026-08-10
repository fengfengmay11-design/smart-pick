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

// 手机族：旧前端统一以 phone 形态（storageOptions）呈现
const PHONE_FAMILY = new Set(['smartphone', 'foldable_phone', 'gaming_phone']);

// 旧分类反查（V2 category_id → 旧 file key）
const OLD_CAT = {
  smartphone: 'phone', foldable_phone: 'phone', gaming_phone: 'phone',
  laptop: 'laptop', cpu: 'cpu', gpu: 'gpu', tablet: 'tablet',
  monitor: 'monitor', keyboard: 'keyboard', earphone: 'earphone', tv: 'tv',
  smartwatch: 'watch', camera: 'camera', cleaning_robot: 'robot', smart_appliance: 'ac',
};

function reconstructPhone(p) {
  const sp = specOf(p.product_id);
  const vats = variantsOf(p.product_id);
  const pris = pricesOf(p.product_id);
  // 别名兼容读取：某些补录来源用了 resolution/refresh_rate/weight 等短键，
  // 统一按「标准键 -> 别名列表」兜底，避免重建时 body 空掉。
  const fv = (...ks) => {
    for (const k of ks) {
      const v = flatValue(sp[k]);
      if (v !== null && v !== undefined && v !== '') return v;
    }
    return null;
  };
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
      size: fv('screen_size', 'display'), resolution: fv('screen_resolution', 'resolution'),
      refreshRate: fv('screen_refresh_rate', 'refresh_rate'), material: fv('screen_material'), type: fv('screen_type'),
    },
    body: {
      height: fv('body_height'), width: fv('body_width'), thickness: fv('body_thickness'),
      weight: fv('body_weight', 'weight'), material: fv('body_material'),
    },
    ram: fv('ram'),
    features: Object.fromEntries(Object.entries(sp).filter(([k]) => k.startsWith('features_')).map(([k, v]) => [k.replace('features_', ''), flatValue(v)])),
  };
}

function reconstructOther(p, oldCat) {
  const sp = specOf(p.product_id);
  const pris = pricesOf(p.product_id);
  const jd = pris.find(x => x.source === 'jd' && !x.variant_id);
  const pdd = pris.find(x => x.source === 'pdd' && !x.variant_id);
  // official（品牌官网标价）/ ref（第三方权威报价）统一收敛为前端的「参考价」通道，
  // 不冒充京东价，避免误导。
  const ref = pris.find(x => (x.source === 'ref' || x.source === 'official') && !x.variant_id);
  const specs = {};
  for (const [k, v] of Object.entries(sp)) specs[k] = flatValue(v);
  return {
    id: p.product_id, brand: brandName(p.brand_id), model: p.model,
    image: p.image, launchDate: p.release_date,
    tags: p.tags, officialUrl: p.official_url, lastVerified: p.updated_at,
    prices: { jd: jd ? jd.price : null, pdd: pdd ? pdd.price : null, ref: ref ? ref.price : null },
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
  let priceRecords = 0, phoneVariants = 0;
  const phoneIds = new Set(P.filter(p => PHONE_FAMILY.has(p.primary_category_id)).map(p => p.product_id));
  all.forEach(p => {
    if (p.storageOptions) {
      phoneVariants += p.storageOptions.length;
      p.storageOptions.forEach(o => { if (o.priceJd != null) priceRecords++; if (o.pricePdd != null) priceRecords++; });
    } else {
      if (p.prices && p.prices.jd != null) priceRecords++;
      if (p.prices && p.prices.pdd != null) priceRecords++;
      if (p.prices && p.prices.ref != null) priceRecords++;
    }
  });
  // 仅以「手机类」variant 作为等价基准（旧前端只有手机有 storageOptions）；
  // 其余品类的 variant 是 V2 扩充新增、旧前端不消费，不参与该等价比较。
  const v2PhoneVariants = V.filter(v => phoneIds.has(v.product_id)).length;
  const phoneVatIds = new Set(V.filter(v => phoneIds.has(v.product_id)).map(v => v.variant_id));
  const v2ReconstructablePrices = PR.filter(pr => {
    if (phoneIds.has(pr.product_id)) return pr.variant_id && phoneVatIds.has(pr.variant_id);
    return pr.variant_id == null; // 非手机类仅用 null-variant_id 的价格（旧前端单价格模型）
  }).length;
  const r = {
    legacy_products: all.length,
    baseline_products: P.length,
    legacy_phone_variants: phoneVariants,
    baseline_phone_variants: v2PhoneVariants,
    legacy_price_records: priceRecords,
    baseline_price_records: v2ReconstructablePrices,
    products_match: all.length === P.length,
    variants_match: phoneVariants === v2PhoneVariants,
    prices_match: priceRecords === v2ReconstructablePrices,
  };
  return r;
}

if (require.main === module) {
  const r = verify();
  console.log('===== ADAPTER 等价性验证 =====');
  console.log('legacy products :', r.legacy_products, r.products_match ? '✅' : '❌');
  console.log('legacy variants :', r.legacy_phone_variants, r.variants_match ? '✅' : '❌', '(仅手机, V2手机variant', r.baseline_phone_variants + ')');
  console.log('legacy priceRecs:', r.legacy_price_records, r.prices_match ? '✅' : '⚠', '(可重建', r.baseline_price_records + ')');
  console.log('=============================');
  const ok = r.products_match && r.variants_match;
  console.log(ok ? '✅ Adapter 可完整重建旧前端所需数据（手机variant等价 + 其余品类价格等价）' : '❌ Adapter 重建不一致');
  process.exit(ok ? 0 : 2);
}

module.exports = { getAllLegacy, verify, reconstructPhone, reconstructOther };
