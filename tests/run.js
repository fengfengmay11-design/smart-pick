/*
 * tests/run.js — 零依赖测试运行器（Node 18+，全局 fetch/AbortController 即可）
 *
 * 运行方式：
 *   node tests/run.js
 *   # 或 npx： npx --yes node tests/run.js
 *
 * 覆盖的是 engine.js / data-source.js 里的「真实代码」（非副本），
 * 保证推荐引擎的核心逻辑有可验证的正确性。
 */
const path = require('path');
const engine = require(path.join(__dirname, '..', 'engine.js'));
const ds = require(path.join(__dirname, '..', 'data-source.js'));

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name); }
}
function eq(name, a, b) { ok(name + ' (得到 ' + JSON.stringify(a) + ')', a === b); }

async function run() {
  console.log('\n[1] 品类识别 detectCategory');
  eq('「帮我选一款电脑」→ laptop', engine.detectCategory('帮我选一款电脑'), 'laptop');
  eq('「8000块的电脑打游戏」→ laptop', engine.detectCategory('8000块的电脑打游戏'), 'laptop');
  eq('「4000档2K光追显卡」→ gpu', engine.detectCategory('4000档2K光追显卡'), 'gpu');
  eq('「通勤深度降噪耳机」→ earphone', engine.detectCategory('通勤深度降噪耳机'), 'earphone');
  eq('「轻薄本全天续航」→ laptop', engine.detectCategory('轻薄本全天续航'), 'laptop');
  eq('「2K高刷电竞屏色彩准」→ monitor', engine.detectCategory('2K高刷电竞屏色彩准'), 'monitor'); // 不被「电脑」抢走
  eq('「只说预算3000」→ null', engine.detectCategory('只说预算3000'), null);
  ok('覆盖 8 个品类关键词', Object.keys(engine.CAT_KEYWORDS).length === 8);

  console.log('\n[2] 预算解析 parseAiBudget');
  eq('「5000左右」→ 5000', engine.parseAiBudget('5000左右'), 5000);
  eq('「预算1万」→ 10000', engine.parseAiBudget('预算1万'), 10000);
  eq('「2k」→ 2000', engine.parseAiBudget('2k'), 2000);
  eq('「8千」→ 8000', engine.parseAiBudget('8千'), 8000);
  eq('「没说钱」→ null', engine.parseAiBudget('没说钱'), null);
  eq('「199」单价不应误判为预算」→ null', engine.parseAiBudget('这个199'), null);

  console.log('\n[3] 实时数据归一化 normalizeLiveProduct');
  const n = ds.normalizeLiveProduct({ id: 9, title: 'WD 2TB', price: 64, image: 'https://x/9.png', rating: { rate: 3.3, count: 203 } });
  eq('id 加 live- 前缀', n.id, 'live-9');
  eq('映射 model', n.model, 'WD 2TB');
  eq('映射 price', n.price, 64);
  eq('映射 rating', n.rating, 3.3);
  eq('映射 ratingCount', n.ratingCount, 203);
  ok('标记 live=true', n.live === true);

  console.log('\n[4] 实时数据获取 fetchLiveProducts（mock fetch）');
  global.fetch = async () => ({ ok: true, json: async () => ([{ id: 9, title: 'A', price: 1, image: 'u', rating: { rate: 4, count: 5 } }]) });
  const items = await ds.fetchLiveProducts('electronics', { timeoutMs: 3000 });
  eq('返回数量', items.length, 1);
  eq('返回项已归一化', items[0].id, 'live-9');

  // 超时降级：mock 监听 abort 信号
  global.fetch = (url, opts) => new Promise((res, rej) => { opts.signal.addEventListener('abort', () => rej(new Error('aborted'))); });
  let threw = false;
  try { await ds.fetchLiveProducts('electronics', { timeoutMs: 150 }); }
  catch (e) { threw = true; }
  ok('超时会抛出（上层据此降级到本地数据）', threw);

  console.log('\n========================================');
  console.log(`  通过 ${pass} 项，失败 ${fail} 项`);
  console.log('========================================\n');
  process.exit(fail === 0 ? 0 : 1);
}

run().catch(e => { console.error('测试运行异常:', e); process.exit(1); });
