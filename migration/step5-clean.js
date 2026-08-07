#!/usr/bin/env node
/**
 * Step 5: 数据库清洗 + 参数规范化 + 数据质量体系
 *
 * 安全原则：
 *  - 不删除任何产品（659 款保持）
 *  - 不重命名字段为未知值
 *  - 电池 runtime 字符串（6h+30h / 约10小时）语义 ≠ 容量(mAh)，不强行结构化
 *  - 仅做可验证、可逆、低风险的规范化
 *
 * 产物：
 *  - database/v2/parameter-schemas.json  (填充 13 个品类标准字段，修复空占位)
 *  - migration/config/parameter-key-mapping.json (字段规范文档)
 *  - database/v2/tags.json (合并 miniled→mini_led + 填充 tag_aliases)
 *  - database/v2/products.json (data_completeness / data_confidence / data_source / needs_review)
 *  - 备份 database/v2 至 database/v2.step4.bak
 */
const fs = require('fs');
const path = require('path');

const V2 = path.join(__dirname, '..', 'database', 'v2');
const CFG = path.join(__dirname, 'config');

function load(f) { return JSON.parse(fs.readFileSync(path.join(V2, f), 'utf8')); }
function save(f, d) { fs.writeFileSync(path.join(V2, f), JSON.stringify(d, null, 2) + '\n', 'utf8'); }

// ---------- 0. 备份 ----------
const bak = path.join(__dirname, '..', 'database', 'v2.step4.bak');
if (!fs.existsSync(bak)) {
  fs.cpSync(V2, bak, { recursive: true });
  console.log('✓ 已备份 V2 → database/v2.step4.bak');
}

let products = load('products.json');
let specs = load('product-specs.json');
let tags = load('tags.json');
let brands = load('brands.json');
let categories = load('categories.json');

const catOf = {};
products.forEach(p => catOf[p.product_id] = p.primary_category_id);

// ---------- 1. 填充 parameter-schemas.json ----------
// 从实际数据抽取每个有 spec 的品类的字段集合（规范字段）
const schemaByCat = {};
for (const s of specs) {
  const c = catOf[s.product_id];
  if (!c) continue;
  const keys = Object.keys(s.specs || {}).sort();
  if (!schemaByCat[c]) schemaByCat[c] = new Set();
  keys.forEach(k => schemaByCat[c].add(k));
}
// 固定顺序（按出现频率稳定排序），转数组
const schemas = { _comment: '每个有 spec 的品类对应的标准参数字段集；其他品类通过 category→schema 继承最近祖先的 schema（见 parameter-key-mapping.json 的 schema_family 映射）。' };
for (const c of Object.keys(schemaByCat).sort()) {
  schemas[c] = Array.from(schemaByCat[c]).sort();
}
save('parameter-schemas.json', schemas);
console.log('✓ parameter-schemas.json 已填充，品类数:', Object.keys(schemas).length - 1);

// category → schema_family 继承映射（为未直接含 spec 的品类提供继承）
const catById = {}; categories.forEach(c => catById[c.category_id] = c);
function schemaForCategory(catId) {
  let cur = catId;
  const seen = new Set();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    if (schemaByCat[cur]) return cur;
    const node = catById[cur];
    cur = node ? node.parent_category_id : null;
  }
  return null;
}

// ---------- 2. parameter-key-mapping.json (规范文档) ----------
const keyMapping = {
  _comment: '字段规范与跨品类别名说明。本步骤不做破坏性字段重命名，仅在文档层记录规范。',
  canonical_field_convention: {
    numeric_computable: '使用 {value, unit, display_value, original_value} 结构化（如 screen_size, weight, vram）',
    non_numeric_or_compound: '保留为字符串（如 resolution "2556×1179"、screen "14英寸 2.8K OLED"、battery runtime "6h+30h"）'
  },
  cross_category_aliases: {
    body_weight: 'smartphone 用 body_weight；laptop/tablet/earphone 等用 weight；二者同义（产品重量），schema 各自独立，搜索层应按别名归一',
    screen: 'laptop/tablet/smartwatch/camera/tv 用组合字符串 screen；smartphone 拆分为 screen_size/screen_resolution/screen_material/screen_type/screen_refresh_rate',
    battery: '语义分裂：laptop/cleaning_robot 的 battery = 容量(mAh) 结构化；earphone/keyboard/smartwatch/tablet 的 battery = 续航时长(字符串，如 6h+30h / 约10小时)，二者不同义，不强行统一'
  },
  schema_family: {}
};
for (const c of Object.keys(schemaByCat).sort()) {
  keyMapping.schema_family[c] = schemaForCategory(c);
}
if (!fs.existsSync(CFG)) fs.mkdirSync(CFG, { recursive: true });
fs.writeFileSync(path.join(CFG, 'parameter-key-mapping.json'), JSON.stringify(keyMapping, null, 2) + '\n', 'utf8');
console.log('✓ migration/config/parameter-key-mapping.json 已生成');

// ---------- 3. Tag 规范化 ----------
// 3a. 明确同义合并：miniled ↔ mini_led（分隔符差异）
const tagIndex = {}; tags.forEach((t, i) => tagIndex[t.tag_id] = i);
const MERGES = { miniled: 'mini_led' }; // 仅最明确的分隔符变体
const tagRename = {};
for (const [from, to] of Object.entries(MERGES)) {
  if (tagIndex[from] != null && tagIndex[to] != null) {
    // 合并：把 from 的别名并入 to，删除 from
    const fromTag = tags[tagIndex[from]];
    const toTag = tags[tagIndex[to]];
    toTag.tag_aliases = Array.from(new Set([...(toTag.tag_aliases || []), from, ...(fromTag.tag_aliases || [])]));
    tags.splice(tagIndex[from], 1);
    tagRename[from] = to;
    delete tagIndex[from];
    // 重建 index（splice 后索引偏移，简单重建）
    tags.forEach((t, i) => tagIndex[t.tag_id] = i);
    console.log(`✓ 合并标签: ${from} → ${to}`);
  }
}
// 更新产品引用
let tagRefChanges = 0;
products.forEach(p => {
  if (!p.tags) return;
  const before = p.tags.length;
  p.tags = p.tags.map(t => tagRename[t] || t);
  // 去重（合并后可能重复）
  p.tags = Array.from(new Set(p.tags));
  if (p.tags.length !== before) tagRefChanges++;
});

// 3b. 保守填充 tag_aliases（可加性，提升搜索，不移动产品引用）
const ALIAS_MAP = {
  flagship: ['旗舰', '旗舰机'],
  gaming: ['游戏', '电竞'],
  lightweight: ['轻薄'],
  oled: ['OLED'],
  ai: ['人工智能', 'AI'],
  business: ['商务'],
  miniled: ['Mini-LED', 'MiniLED', 'mini-led', 'Mini_LED'],
  '高刷': ['高刷新率', 'high_refresh_rate'],
  '长续航': ['超长续航', '续航长'],
  '大电池': ['大电量', '超大电池'],
  '快充': ['快速充电', 'fast_charging'],
  '护眼': ['护眼屏', 'eye_care'],
  '高性价比': ['性价比'],
  '影像旗舰': ['拍照旗舰'],
  '自拍': ['前置 camera'],
  '卫星通信': ['卫星'],
  '无线': ['wireless']
};
for (const t of tags) {
  const extra = ALIAS_MAP[t.tag_id];
  if (extra) {
    t.tag_aliases = Array.from(new Set([...(t.tag_aliases || []), ...extra]));
  }
}
save('tags.json', tags);
console.log(`✓ tags.json 规范化完成：合并 ${Object.keys(MERGES).length} 组，填充别名；产品引用变更 ${tagRefChanges} 款`);

// 3c. 修复跨产品 alias 碰撞（品牌无关的裸别名导致搜索歧义，如 Pad3Pro 同时被 OPPO/vivo 占用）
// 策略：把裸别名加上 brand_id 前缀，保留可搜索性，消除碰撞。
const brandById = {}; brands.forEach(b => brandById[b.brand_id] = b);
const aliasSeen = {};
for (const p of products) {
  if (!p.aliases) continue;
  p.aliases = p.aliases.map(a => {
    const nk = a.toLowerCase().replace(/[\s\-_]/g, '');
    if (aliasSeen[nk] && aliasSeen[nk] !== p.product_id) {
      // 碰撞：加品牌前缀
      const bname = (brandById[p.brand_id] && (brandById[p.brand_id].brand_name_en || brandById[p.brand_id].brand_name)) || p.brand_id;
      const fixed = `${bname} ${a}`.trim();
      aliasSeen[nk + '::' + p.product_id] = p.product_id;
      console.log(`  ⚠ 修复 alias 碰撞: ${p.product_id} "${a}" → "${fixed}"`);
      return fixed;
    }
    aliasSeen[nk] = p.product_id;
    return a;
  });
}

// ---------- 4. 品牌别名审计（只读，确认无问题） ----------
let brandIssues = 0;
const seenAlias = {};
for (const b of brands) {
  const al = new Set();
  for (const a of (b.aliases || [])) {
    if (al.has(a)) { brandIssues++; console.log('  ⚠ 品牌内重复别名', b.brand_id, a); }
    al.add(a);
    if (seenAlias[a] && seenAlias[a] !== b.brand_id) { brandIssues++; console.log('  ⚠ 跨品牌别名冲突', a, seenAlias[a], b.brand_id); }
    else seenAlias[a] = b.brand_id;
  }
}
console.log(`✓ 品牌别名审计：${brandIssues} 个问题（应为 0）`);

// ---------- 5. data_completeness / data_confidence / data_source / needs_review ----------
const specByPid = {}; specs.forEach(s => specByPid[s.product_id] = s.specs || {});
let compSum = 0, compCount = 0;
let reviewCount = 0;
for (const p of products) {
  const c = p.primary_category_id;
  const fam = schemaForCategory(c);
  const schema = fam ? schemas[fam] : [];
  const sp = specByPid[p.product_id] || {};
  let present = 0;
  if (schema.length) {
    schema.forEach(k => { if (sp[k] !== undefined && sp[k] !== null && sp[k] !== '') present++; });
    p.data_completeness = Math.round((present / schema.length) * 100);
  } else {
    p.data_completeness = 0;
  }
  compSum += p.data_completeness; compCount++;

  // data_confidence 启发式
  const hasImage = !!p.image && p.image.length > 0;
  if (hasImage && p.data_completeness >= 80) p.data_confidence = 'high';
  else if (p.data_completeness >= 50 || hasImage) p.data_confidence = 'medium';
  else p.data_confidence = 'low';

  // data_source（诚实标注：由 V1 整理数据迁移而来）
  p.data_source = p.data_source || 'migration_legacy';

  // needs_review：电池 runtime 语义不清 / 极低完整度
  let review = false;
  const batt = sp.battery;
  if (batt !== undefined && (typeof batt === 'string')) {
    // 续航时长字符串（非容量），schema 层需澄清
    review = true;
  }
  if (p.data_completeness < 30 && schema.length > 0) review = true;
  p.needs_review = review;
  if (review) reviewCount++;
}
save('products.json', products);
console.log(`✓ products.json 质量字段更新：平均完整度 ${(compSum/compCount).toFixed(1)}%，needs_review=${reviewCount}`);

console.log('\n=== Step5 关键产物计数 ===');
console.log('products:', products.length);
console.log('tags:', tags.length);
console.log('schemas filled:', Object.keys(schemas).length - 1);
console.log('brands audited (issues):', brandIssues);
console.log('DONE');
