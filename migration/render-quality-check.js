'use strict';
/**
 * Step10 渲染质量检查：对 44 品类 × 全部商品跑前端 getter，抓三类渲染缺陷：
 *  A. 输出含 undefined/null/NaN
 *  B. 单位重复（英寸英寸 / gg / WW / HzHz / GBGB / MHzMHz / dBdB / mmmm / nmnm ...）
 *  C. 数值字段 ||0 兜底导致的假 0（Boost:0MHz 之类）
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = '/Users/tornadoli/WorkBuddy/2026-07-15-16-38-34/phone-compare';
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const sandbox = {};
vm.createContext(sandbox);
const files = fs.readdirSync(ROOT).filter(f => /^(data-.*|phone-data)\.js$/.test(f)).sort();
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  vm.runInContext(src.replace(/^\s*const\s/m, 'var '), sandbox, { timeout: 8000 });
}
const start = html.indexOf('function pickPrice(');
const endMark = html.indexOf('function groupOfCat(');
const code = html.slice(start, html.indexOf('\n}', endMark) + 2).replace(/^const /gm, 'var ');
vm.runInContext(code, sandbox, { timeout: 8000 });

const C = sandbox.CATEGORIES;
const UNIT_RE = /(英寸英寸|gg|WW|HzHz|GBGB|MHzMHz|dBdB|mmmm|nmnm|kgkg|bitbit)/;
const BAD_TOKEN = /undefined|null|NaN/;

let total = 0;
const problems = [];
for (const [key, cat] of Object.entries(C)) {
  const arr = cat.data() || [];
  for (const it of arr) {
    total++;
    const l1 = cat.getListLine1(it);
    const l2 = cat.getListLine2(it);
    const tags = (cat.getTags(it) || []).join('/');
    const src = cat.getPriceSource(it);
    const p = cat.getPrice(it);
    const check = (label, s) => {
      if (s == null) return;
      s = String(s);
      if (BAD_TOKEN.test(s)) problems.push(`[${key}] ${it.id} ${label}: ${s.slice(0, 90)}`);
      if (UNIT_RE.test(s)) problems.push(`[${key}] ${it.id} ${label} 单位重复: ${s.slice(0, 90)}`);
      if (/(\d)\.0x|:0MHz|:0W|:0GHz|CUDA:0\b/.test(s)) problems.push(`[${key}] ${it.id} ${label} 假0: ${s.slice(0, 90)}`);
    };
    check('L1', l1);
    check('L2', l2);
    check('TAGS', tags);
    check('SOURCE', src.platform + (src.shopType || ''));
    // 有价商品必须能显示价格标签
    if (p > 0 && (src.price !== p)) problems.push(`[${key}] ${it.id} 价格来源不一致 price=${p} src=${src.price}`);
  }
}

console.log(`遍历 ${total} 款商品，发现问题 ${problems.length} 条`);
const byCat = {};
problems.forEach(x => { const c = x.slice(1, x.indexOf(']')); byCat[c] = (byCat[c] || 0) + 1; });
console.log('按品类:', JSON.stringify(byCat));
problems.slice(0, 40).forEach(x => console.log('  ', x));
fs.writeFileSync(path.join(ROOT, 'migration/render-quality-result.json'), JSON.stringify(problems, null, 2) + '\n');
