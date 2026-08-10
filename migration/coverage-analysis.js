// Step 6 Coverage Gap Analysis — 纯分析，不改数据
// 计算每个品类 product_count / brand_count / core_brand_coverage / 完整度 / 缺失核心品牌
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..', 'database', 'v2');
const products = require(path.join(base, 'products.json'));
const brands = require(path.join(base, 'brands.json'));
const cats = require(path.join(base, 'categories.json'));
const expect = require('./config/coverage-core-brands.json');

const brandIds = new Set(brands.map(b => b.brand_id));
const catMap = {}; cats.forEach(c => catMap[c.category_id] = c);

// 每个品类实际产品 & 品牌
const byCat = {};
products.forEach(p => {
  const c = p.primary_category_id;
  byCat[c] = byCat[c] || { count: 0, brands: new Set(), completeness: [] };
  byCat[c].count++;
  byCat[c].brands.add(p.brand_id);
  byCat[c].completeness.push(p.data_completeness || 0);
});

// 品牌是否整体存在于 DB（任何品类）
function brandExistsAnywhere(bid) { return brandIds.has(bid); }

const results = [];
const leafCats = cats.filter(c => !cats.some(x => x.parent_category_id === c.category_id));

for (const cat of leafCats) {
  const cid = cat.category_id;
  const exp = expect[cid];
  const actual = byCat[cid] || { count: 0, brands: new Set(), completeness: [] };
  const coreBrands = exp ? exp.core_brands : [];
  const covered = coreBrands.filter(b => actual.brands.has(b));
  const missing = coreBrands.filter(b => !actual.brands.has(b));
  // 缺失核心品牌中，哪些品牌在 DB 其他品类存在（仅缺该品类产品）
  const missingButBrandExists = missing.filter(b => brandExistsAnywhere(b));
  const missingBrandToo = missing.filter(b => !brandExistsAnywhere(b));
  const avgComp = actual.completeness.length
    ? Math.round(actual.completeness.reduce((a, b) => a + b, 0) / actual.completeness.length)
    : null;

  results.push({
    category_id: cid,
    category_name: cat.category_name,
    level: cat.category_level,
    parent: cat.parent_category_id,
    priority: cat.priority,
    product_count: actual.count,
    brand_count: actual.brands.size,
    core_brand_total: coreBrands.length,
    core_brand_covered: covered.length,
    core_brand_coverage_pct: coreBrands.length ? Math.round(covered.length / coreBrands.length * 100) : null,
    missing_core_brands: missing,
    missing_brand_exists_elsewhere: missingButBrandExists,
    missing_brand_too: missingBrandToo,
    avg_completeness: avgComp
  });
}

// 排序：有产品的优先（按覆盖率升序暴露缺口），空的在后面
results.sort((a, b) => {
  if ((a.product_count > 0) !== (b.product_count > 0)) return a.product_count > 0 ? -1 : 1;
  return (a.core_brand_coverage_pct || 0) - (b.core_brand_coverage_pct || 0);
});

const out = {
  generated_at: new Date().toISOString(),
  total_products: products.length,
  total_brands: brands.length,
  total_leaf_categories: leafCats.length,
  categories_with_products: results.filter(r => r.product_count > 0).length,
  empty_categories: results.filter(r => r.product_count === 0).map(r => r.category_id),
  results
};
fs.writeFileSync(path.join(__dirname, 'coverage-analysis.json'), JSON.stringify(out, null, 2));

// 控制台摘要
console.log('=== STEP 6 COVERAGE GAP ANALYSIS ===');
console.log('Products:', products.length, '| Brands:', brands.length, '| Leaf categories:', leafCats.length);
console.log('Categories with products:', out.categories_with_products, '| Empty:', out.empty_categories.length);
console.log('\n--- 有产品的品类（按覆盖率升序）---');
results.filter(r => r.product_count > 0).forEach(r => {
  console.log(`${r.category_id.padEnd(16)} n=${String(r.product_count).padStart(3)} brands=${String(r.brand_count).padStart(2)} cov=${String(r.core_brand_coverage_pct).padStart(3)}% (${r.core_brand_covered}/${r.core_brand_total}) comp=${r.avg_completeness}`);
});
console.log('\n--- 空品类（0 产品，重要缺口）---');
results.filter(r => r.product_count === 0).forEach(r => {
  console.log(`${r.category_id.padEnd(16)} [${r.priority}] need ${r.core_brand_total} core brands: ${r.missing_core_brands.slice(0,8).join(',')}${r.missing_core_brands.length>8?'...':''}`);
});
console.log('\nwrote migration/coverage-analysis.json');
