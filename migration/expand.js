// Step 6 产品扩充流水线（安全插入）
// 用法:
//   node migration/expand.js --seed <seed.json> [--dry-run] [--batch <name>]
// seed.json 形状: [{ brand_id, primary_category_id, model, full_name, status, release_date,
//                    series_id?, generation?, aliases?, tags?, image?, official_url?,
//                    data_source, source_url?, specs?:{...}, variants?:[{...}], prices?:[{source,price,...}] }]
// 安全规则:
//   - 不删除任何已有产品
//   - 按 brand_id+model 去重，重复则跳过并报告
//   - 未知参数用 null，绝不填 0
//   - 每批插入后跑 validate-db 等价检查
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..', 'database', 'v2');

function load(f) { return require(path.join(base, f)); }
function save(f, d) { fs.writeFileSync(path.join(base, f), JSON.stringify(d, null, 2) + '\n'); }

const args = process.argv.slice(2);
const getArg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const dryRun = args.includes('--dry-run');
const seedPath = getArg('--seed');
const batchName = getArg('--batch') || 'batch';

if (!seedPath) { console.error('用法: node migration/expand.js --seed <seed.json> [--dry-run]'); process.exit(1); }
if (!fs.existsSync(seedPath)) { console.error('seed 文件不存在:', seedPath); process.exit(1); }

const products = load('products.json');
const specs = load('product-specs.json');
const variants = load('product-variants.json');
const prices = load('prices.json');
const brands = load('brands.json');
const cats = load('categories.json');

const brandIds = new Set(brands.map(b => b.brand_id));
const catIds = new Set(cats.map(c => c.category_id));
const existingKeys = new Set(products.map(p => (p.brand_id + '|' + (p.model || '').toLowerCase())));

// 生成稳定 product_id：优先 brand + model slug，冲突则加序号
function slug(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function genId(brand, model) {
  let id = `${brand}-${slug(model)}`;
  let n = 2;
  while (products.some(p => p.product_id === id) || existingKeys.has(id)) { id = `${brand}-${slug(model)}-${n++}`; }
  return id;
}

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const report = { total: seed.length, inserted: 0, skipped_dup: 0, skipped_invalid: 0, errors: [] };
const newProducts = [];

for (const s of seed) {
  // 必填校验
  if (!s.brand_id || !brandIds.has(s.brand_id)) { report.skipped_invalid++; report.errors.push(`品牌不存在: ${s.brand_id} (${s.model})`); continue; }
  if (!s.primary_category_id || !catIds.has(s.primary_category_id)) { report.skipped_invalid++; report.errors.push(`分类不存在: ${s.primary_category_id} (${s.model})`); continue; }
  if (!s.model) { report.skipped_invalid++; report.errors.push(`缺 model: ${JSON.stringify(s).slice(0, 80)}`); continue; }
  const key = s.brand_id + '|' + s.model.toLowerCase();
  if (existingKeys.has(key)) { report.skipped_dup++; report.errors.push(`重复跳过: ${key}`); continue; }

  const pid = genId(s.brand_id, s.model);
  existingKeys.add(key);
  const now = new Date().toISOString().slice(0, 10);
  const prod = {
    product_id: pid,
    legacy_id: pid,
    brand_id: s.brand_id,
    primary_category_id: s.primary_category_id,
    series_id: s.series_id || null,
    generation: s.generation || null,
    model: s.model,
    full_name: s.full_name || s.model,
    aliases: s.aliases || [],
    status: s.status || 'active',
    tags: s.tags || [],
    release_date: s.release_date || null,
    image: s.image || null,
    official_url: s.official_url || null,
    data_completeness: 0, // 由 specs 后续计算
    data_confidence: s.source_url ? 'medium' : (s.data_source === 'manual' ? 'low' : 'unknown'),
    needs_review: !s.source_url,
    data_source: s.data_source || 'ai_extracted',
    source_url: s.source_url || null,
    created_at: now,
    updated_at: now
  };
  newProducts.push(prod);
  if (s.specs) specs.push({ product_id: pid, specs: s.specs });
  (s.variants || []).forEach((v, i) => variants.push(Object.assign({ variant_id: `${pid}-v${i + 1}`, product_id: pid }, v)));
  (s.prices || []).forEach((pr, i) => prices.push(Object.assign({ price_id: `${pid}-p${i + 1}`, product_id: pid, variant_id: null, currency: 'CNY', price_type: 'current', last_updated_at: now }, pr)));
}

if (dryRun) {
  console.log('[DRY-RUN] 不写盘');
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

// 合并写盘
save('products.json', products.concat(newProducts));
save('product-specs.json', specs);
save('product-variants.json', variants);
save('prices.json', prices);

// 重算 data_completeness（依赖 parameter-schemas，若缺失则用现有值）
try {
  const schema = load('parameter-schemas.json');
  const ps = require(path.join(base, 'products.json'));
  const sp = require(path.join(base, 'product-specs.json'));
  const scMap = {}; ps.forEach(p => scMap[p.product_id] = p.primary_category_id);
  ps.forEach(p => {
    const cat = scMap[p.product_id];
    const fields = (schema[cat] && (schema[cat].fields || schema[cat])) || [];
    const sp_ = (sp.find(x => x.product_id === p.product_id) || {}).specs || {};
    const total = Array.isArray(fields) ? fields.length : 0;
    const filled = total ? fields.filter(f => { const k = typeof f === 'string' ? f : f.key; return sp_[k] !== undefined && sp_[k] !== null; }).length : 0;
    p.data_completeness = total ? Math.round(filled / total * 100) : p.data_completeness;
  });
  save('products.json', ps);
} catch (e) { console.log('⚠ 完整度重算跳过:', e.message); }

console.log(JSON.stringify(report, null, 2));
console.log(`✓ 写入完成：新增 ${newProducts.length} 款。请运行 node migration/validate-db.js 最终校验。`);
