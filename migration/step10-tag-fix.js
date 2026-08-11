'use strict';
/**
 * Step10 标签体系修复：
 * 1. 从 products.tags 清除规格泄漏 token（"4k"、"16核"、"980g"、"75%" 等参数混入语义标签）
 * 2. 将实际使用但未登记的语义标签补注册进 tags.json（词典对齐）
 * 3. 清除后 tags 为空的产品补一个品类级语义标签，避免裸奔
 */
const fs = require('fs');
const path = require('path');
const V2 = path.join(__dirname, '..', 'database/v2');
const read = (f) => JSON.parse(fs.readFileSync(path.join(V2, f), 'utf8'));
const write = (f, o) => fs.writeFileSync(path.join(V2, f), JSON.stringify(o, null, 2) + '\n');

const P = read('products.json');
const T = read('tags.json');

// ---- 泄漏 token 正则：纯数值参数，不含任何语义 ----
const LEAK = /^\s*(?:\d+(?:\.\d+)?\s*(?:GB|TB|MB|Hz|W|mAh|英寸|inch|mm|g|kg|K|fps|nit|bit|核|线程|TFLOPS)|\d+(?:\.\d+)?%|4k|8k|2k|4K|8K|2K|5g)\s*$/;

// ---- 1. 清理泄漏标签 ----
let removed = 0;
const leakByProd = new Map();
for (const p of P) {
  if (!Array.isArray(p.tags)) continue;
  const before = p.tags.length;
  const leaked = p.tags.filter(t => LEAK.test(String(t)));
  p.tags = p.tags.filter(t => !LEAK.test(String(t)));
  removed += before - p.tags.length;
  leaked.forEach(t => {
    const k = p.product_id;
    if (!leakByProd.has(k)) leakByProd.set(k, []);
    leakByProd.get(k).push(t);
  });
}
console.log('清理泄漏标签:', removed, '个，涉及产品:', leakByProd.size, '款');

// ---- 2. 空 tags 产品补品类语义标签 ----
const CAT_TAG = {
  smartphone: '手机', foldable_phone: '折叠屏', gaming_phone: '游戏手机',
  monitor: '显示器', cpu: '处理器', gpu: '显卡', laptop: '笔记本',
  keyboard: '机械键盘', earphone: '耳机', tv: '电视', tablet: '平板',
  smartwatch: '智能手表', camera: '相机', cleaning_robot: '扫地机器人', smart_appliance: '空调',
  mouse: '鼠标', lens: '镜头', nas: 'NAS', router: '路由器', console: '游戏主机',
};
const emptied = [];
for (const p of P) {
  if (!Array.isArray(p.tags) || p.tags.length === 0) {
    const fallback = CAT_TAG[p.primary_category_id] || p.primary_category_id;
    p.tags = [fallback];
    emptied.push(p.product_id + ' -> ' + fallback);
  }
}
console.log('清除后为空、已补品类标签:', emptied.length, emptied.slice(0, 10).join(', '));

// ---- 3. 补注册语义标签（used 且未定义且非泄漏） ----
const tagIds = new Set(T.map(t => t.tag_id));
const used = new Set();
P.forEach(p => (p.tags || []).forEach(t => used.add(t)));
const toAdd = [...used].filter(t => !tagIds.has(t) && !LEAK.test(String(t))).sort();
for (const name of toAdd) {
  T.push({ tag_id: name, tag_name: name, tag_aliases: [] });
}
console.log('补注册标签:', toAdd.length, '个（tags.json ' + (T.length - toAdd.length) + ' -> ' + T.length + '）');

// ---- 4. 写回 ----
write('products.json', P);
write('tags.json', T);
console.log('\n✅ products.json / tags.json 已更新');
