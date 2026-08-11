'use strict';
/**
 * Step10 手机规格字段规范化：
 * Step 7 补录的 7 款手机（ai_extracted 来源）specs 用了别名键
 *   resolution / refresh_rate / weight / display
 * 而 smartphone schema 与前端 adapter 期望的是
 *   screen_resolution / screen_refresh_rate / body_weight
 * 导致前端列表第二行与对比页缺数据。本脚本把别名值复制到标准键（保留原键，不删）。
 * 另外把 display 的组合信息（含分辨率/刷新率）拆出的字段合并到标准键。
 */
const fs = require('fs');
const path = require('path');
const V2 = path.join(__dirname, '..', 'database/v2');
const read = (f) => JSON.parse(fs.readFileSync(path.join(V2, f), 'utf8'));
const write = (f, o) => fs.writeFileSync(path.join(V2, f), JSON.stringify(o, null, 2) + '\n');

const specs = read('product-specs.json');
const TARGET = new Set([
  'google-pixel-9', 'google-pixel-9-pro-xl', 'motorola-edge-50-ultra',
  'redmi-redmi-k80', 'iqoo-iqoo-13', 'meizu-meizu-21', 'nubia-z70-ultra',
]);

// 标准键 <- 候选别名（按序取第一个非空）
const MAP = {
  screen_resolution: ['resolution'],
  screen_refresh_rate: ['refresh_rate'],
  body_weight: ['weight'],
};
let patched = 0, addedKeys = 0;
for (const s of specs) {
  if (!TARGET.has(s.product_id)) continue;
  let changed = false;
  for (const [std, alts] of Object.entries(MAP)) {
    if (s.specs[std] !== undefined && s.specs[std] !== null && s.specs[std] !== '') continue;
    for (const a of alts) {
      const v = s.specs[a];
      if (v !== undefined && v !== null && v !== '') {
        s.specs[std] = v;
        addedKeys++; changed = true; break;
      }
    }
  }
  if (changed) { patched++; console.log('  ✅', s.product_id); }
}
write('product-specs.json', specs);
console.log(`\n补丁完成：${patched} 款手机，新增标准键 ${addedKeys} 个`);
