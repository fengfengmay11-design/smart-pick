'use strict';
/**
 * build-data-js.js — Step 8 去硬编码：把 V2 规范库编译为前端所需的 data-*.js 构建产物。
 * 复用 db-adapter 的等价重建逻辑；生成后 data-*.js 变为自动产物，不再手工维护。
 * 运行：node migration/build-data-js.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/tornadoli/WorkBuddy/2026-07-15-16-38-34/phone-compare';
const { getAllLegacy } = require('./db-adapter.js');

// 旧分类反查（与 db-adapter 一致）
const OLD_CAT = {
  smartphone: 'phone', foldable_phone: 'phone', gaming_phone: 'phone',
  laptop: 'laptop', cpu: 'cpu', gpu: 'gpu', tablet: 'tablet',
  monitor: 'monitor', keyboard: 'keyboard', earphone: 'earphone', tv: 'tv',
  smartwatch: 'watch', camera: 'camera', cleaning_robot: 'robot', smart_appliance: 'ac',
};
// 旧文件 → 变量名映射（沿用现有约定）
const FILEMAP = {
  phone: ['phone-data.js', 'PHONE_DATA'],
  laptop: ['data-laptop.js', 'LAPTOP_DATA'],
  cpu: ['data-cpu.js', 'CPU_DATA'],
  gpu: ['data-gpu.js', 'GPU_DATA'],
  tablet: ['data-tablet.js', 'TABLET_DATA'],
  monitor: ['data-monitor.js', 'MONITOR_DATA'],
  keyboard: ['data-keyboard.js', 'KEYBOARD_DATA'],
  earphone: ['data-earphone.js', 'EARPHONE_DATA'],
  tv: ['data-tv.js', 'TV_DATA'],
  watch: ['data-watch.js', 'WATCH_DATA'],
  camera: ['data-camera.js', 'CAMERA_DATA'],
  robot: ['data-robot.js', 'ROBOT_DATA'],
  ac: ['data-ac.js', 'AC_DATA'],
};

const all = getAllLegacy();
// getAllLegacy 返回对象不含 primary_category_id，按相同顺序与源 products 对齐取回分类
const P = require(path.join(ROOT, 'database/v2/products.json'));
const groups = {};
all.forEach((prod, i) => {
  const src = P[i] || {};
  const oldCat = OLD_CAT[src.primary_category_id] || src.primary_category_id;
  if (!oldCat) return;
  (groups[oldCat] = groups[oldCat] || []).push(prod);
});

let total = 0;
for (const [key, arr] of Object.entries(groups)) {
  const fm = FILEMAP[key];
  const [file, varName] = fm || [`data-${key}.js`, key.toUpperCase() + '_DATA'];
  const content = `// AUTO-GENERATED from database/v2 via migration/build-data-js.js — DO NOT EDIT BY HAND\nconst ${varName} = ${JSON.stringify(arr, null, 2)};\n`;
  fs.writeFileSync(path.join(ROOT, file), content);
  total += arr.length;
  console.log(`  ${file.padEnd(22)} ${varName.padEnd(16)} ${arr.length} 款`);
}
console.log(`\n===== Step8 生成完成：${Object.keys(groups).length} 个文件，${total} 款产品 =====`);
