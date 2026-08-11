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
// 手机族：旧前端用 storageOptions（variant 级）承载价格，价格必须挂到 variant，
// 否则旧前端无法重建（A-1 曾因此产生 7 条断链价格）。其余品类为 product 级单价格模型。
const PHONE_FAMILY = new Set(['smartphone', 'foldable_phone', 'gaming_phone']);
const existingKeys = new Set(products.map(p => (p.brand_id + '|' + (p.model || '').toLowerCase())));
// 已分配 id 集合（含已有 + 本批新分配），防止同一批次内多个产品 slug 撞 id
const assignedIds = new Set(products.map(p => p.product_id));

// 生成稳定 product_id：优先 brand + model slug，冲突则加序号
function slug(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function genId(brand, model) {
  let id = `${brand}-${slug(model)}`;
  let n = 2;
  while (assignedIds.has(id)) { id = `${brand}-${slug(model)}-${n++}`; }
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
  assignedIds.add(pid);
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
  report.inserted++;
  if (s.specs) specs.push({ product_id: pid, specs: s.specs });
  const newVats = (s.variants || []).map((v, i) => Object.assign({ variant_id: `${pid}-v${i + 1}`, product_id: pid }, v));
  newVats.forEach(v => variants.push(v));
  const isPhoneFamily = PHONE_FAMILY.has(s.primary_category_id) && newVats.length > 0;
  (s.prices || []).forEach((pr, i) => {
    // 手机族价格挂到 variant（可在 seed 用 variant_index 指定，默认首个）；其余品类挂 product 级
    let vid = null;
    if (isPhoneFamily) {
      const idx = Number.isInteger(pr.variant_index) ? pr.variant_index : 0;
      vid = (newVats[idx] || newVats[0]).variant_id;
    }
    const rec = Object.assign(
      { price_id: `${pid}-p${i + 1}`, product_id: pid, variant_id: vid, currency: 'CNY', price_type: 'current', last_updated_at: now },
      pr
    );
    delete rec.variant_index;
    prices.push(rec);
  });
}

if (dryRun) {
  console.log('[DRY-RUN] 不写盘');
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

// 合并（不依赖 require 缓存，直接用内存中的 merged）
const merged = products.concat(newProducts);

// 重算 data_completeness（依赖 parameter-schemas；schema 缺失/空则保留初始值）
try {
  const schema = load('parameter-schemas.json');
  const spMap = {}; specs.forEach(x => { spMap[x.product_id] = x.specs || {}; });
  merged.forEach(p => {
    const def = schema[p.primary_category_id];
    const fields = (def && (def.fields || def)) || [];
    const total = Array.isArray(fields) ? fields.length : 0;
    if (!total) return;
    const sp_ = spMap[p.product_id] || {};
    const filled = fields.filter(f => { const k = typeof f === 'string' ? f : f.key; return sp_[k] !== undefined && sp_[k] !== null; }).length;
    p.data_completeness = Math.round(filled / total * 100);
  });
} catch (e) { console.log('⚠ 完整度重算跳过:', e.message); }

// 写盘（products 最后写入，避免被缓存模块覆盖）
save('product-specs.json', specs);
save('product-variants.json', variants);
save('prices.json', prices);
save('products.json', merged);

console.log(JSON.stringify(report, null, 2));
console.log(`✓ 写入完成：新增 ${newProducts.length} 款。请运行 node migration/validate-db.js 最终校验。`);
