'use strict';
/** Step10 前端渲染修复：旧 13 品类 L1/L2 统一改造成 j() + 下划线 schema 字段。
 *  - 消除手工拼单位导致的「16GBGB」「噪音18dBdB」
 *  - 修正驼峰字段名（boostClock→boost_clock / refreshRate→refresh_rate / busInterface→bus_interface…）
 *  - 消除 ||0 兜底导致的「制冷0W」假值
 */
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const REPL = [
  // phone
  ["getListLine1: (item) => (item.ram||'')+'+'+item.defaultStorage+' · 默认版本',",
   "getListLine1: (item) => j(item.ram, item.defaultStorage) + ' · 默认版本',"],
  // gpu
  ["getListLine1: (item) => (item.specs?.vram||0)+'GB '+ (item.specs?.vramType||'') +' · '+ (item.specs?.busInterface||''),",
   "getListLine1: (item) => j(item.specs?.vram, item.specs?.vram_type, item.specs?.bus_interface),"],
  // ac
  ["getListLine1: (item) => (item.specs?.type||'')+' · '+(item.specs?.horsepower||'')+' · '+(item.specs?.energyRating||''),",
   "getListLine1: (item) => j(item.specs?.type, item.specs?.horsepower, item.specs?.energy_rating),"],
  ["getListLine2: (item) => '制冷'+(item.specs?.coolingCapacity||0)+'W · 噪音'+(item.specs?.noise||0)+'dB · '+(item.specs?.area||''),",
   "getListLine2: (item) => j('制冷' + item.specs?.cooling_capacity, '噪音' + item.specs?.noise, item.specs?.area),"],
  // robot
  ["getListLine1: (item) => (item.specs?.suction||'')+' · 电池'+(item.specs?.battery||'')+' · '+(item.specs?.baseStation?'全能基站':''),",
   "getListLine1: (item) => j(item.specs?.suction, '电池' + item.specs?.battery, item.specs?.base_station ? '全能基站' : ''),"],
  ["getListLine2: (item) => '高度'+(item.specs?.height||'')+' · '+(item.specs?.lidar?'LDS激光导航':'')+' · '+(item.specs?.obstacleAvoidance||''),",
   "getListLine2: (item) => j('高度' + item.specs?.height, item.specs?.lidar ? 'LDS激光导航' : '', item.specs?.obstacle_avoidance),"],
  // laptop
  ["getListLine1: (item) => (item.specs?.cpu||'')+' · '+(item.specs?.ram||'')+' · '+(item.specs?.storage||''),",
   "getListLine1: (item) => j(item.specs?.cpu, item.specs?.ram, item.specs?.storage),"],
  ["getListLine2: (item) => (item.specs?.screen||'')+' · '+(item.specs?.resolution||'')+' · '+(item.specs?.weight||''),",
   "getListLine2: (item) => j(item.specs?.screen, item.specs?.resolution, item.specs?.weight),"],
  // cpu
  ["getListLine1: (item) => (item.specs?.cores||'')+' · Base '+(item.specs?.baseClock||'')+' · Boost '+(item.specs?.boostClock||''),",
   "getListLine1: (item) => j(item.specs?.cores, 'Base ' + item.specs?.base_clock, 'Boost ' + item.specs?.boost_clock),"],
  ["getListLine2: (item) => 'TDP '+(item.specs?.tdp||'')+' · '+(item.specs?.cache||'')+' · '+(item.specs?.socket||''),",
   "getListLine2: (item) => j('TDP ' + item.specs?.tdp, item.specs?.cache, item.specs?.socket),"],
  // earphone
  ["getListLine1: (item) => (item.specs?.type||'')+' · '+(item.specs?.noise||'')+' · '+(item.specs?.driver||''),",
   "getListLine1: (item) => j(item.specs?.type, item.specs?.noise, item.specs?.driver),"],
  ["getListLine2: (item) => '续航 '+(item.specs?.battery||'')+' · '+ (item.specs?.codec||'')+' · '+(item.specs?.weight||''),",
   "getListLine2: (item) => j('续航 ' + item.specs?.battery, item.specs?.codec, item.specs?.weight),"],
  // monitor
  ["getListLine1: (item) => (item.specs?.size||'')+' · '+(item.specs?.resolution||'')+' · '+(item.specs?.refreshRate||''),",
   "getListLine1: (item) => j(item.specs?.size, item.specs?.resolution, item.specs?.refresh_rate),"],
  ["getListLine2: (item) => (item.specs?.panel||'')+' · '+(item.specs?.hdr||'')+' · '+(item.specs?.ports||'').substring(0,40),",
   "getListLine2: (item) => j(item.specs?.panel, item.specs?.hdr, item.specs?.ports),"],
  // tablet
  ["getListLine1: (item) => (item.specs?.chip||'')+' · '+(item.specs?.ram||'')+' · '+(item.specs?.storage||''),",
   "getListLine1: (item) => j(item.specs?.chip, item.specs?.ram, item.specs?.storage),"],
  ["getListLine2: (item) => (item.specs?.size||'')+' · '+(item.specs?.resolution||'')+' · '+(item.specs?.refreshRate||''),",
   "getListLine2: (item) => j(item.specs?.size, item.specs?.resolution, item.specs?.refresh_rate),"],
  // camera
  ["getListLine1: (item) => (item.specs?.sensor||'')+' · '+(item.specs?.resolution||''),",
   "getListLine1: (item) => j(item.specs?.sensor, item.specs?.resolution),"],
  ["getListLine2: (item) => '视频'+(item.specs?.video||'')+' · '+(item.specs?.mount||'')+' · 防抖'+(item.specs?.ibis||''),",
   "getListLine2: (item) => j('视频' + item.specs?.video, item.specs?.mount, '防抖' + item.specs?.ibis),"],
  // tv
  ["getListLine1: (item) => (item.specs?.size||'')+' · '+(item.specs?.resolution||'')+' · '+(item.specs?.panel||''),",
   "getListLine1: (item) => j(item.specs?.size, item.specs?.resolution, item.specs?.panel),"],
  ["getListLine2: (item) => '刷新'+(item.specs?.refreshRate||'')+' · '+(item.specs?.hdr||'')+' · '+(item.specs?.brightness||''),",
   "getListLine2: (item) => j('刷新' + item.specs?.refresh_rate, item.specs?.hdr, item.specs?.brightness),"],
  // watch
  ["getListLine1: (item) => (item.specs?.size||'')+' · '+(item.specs?.screen||''),",
   "getListLine1: (item) => j(item.specs?.size, item.specs?.screen),"],
  ["getListLine2: (item) => '续航'+(item.specs?.battery||'')+' · '+(item.specs?.gps||'')+' · '+(item.specs?.health||''),",
   "getListLine2: (item) => j('续航' + item.specs?.battery, item.specs?.gps, item.specs?.health),"],
  // keyboard
  ["getListLine1: (item) => (item.specs?.layout||'')+' · '+(item.specs?.switch||''),",
   "getListLine1: (item) => j(item.specs?.layout, item.specs?.switch),"],
  ["getListLine2: (item) => '连接'+(item.specs?.connection||'')+' · '+(item.specs?.battery||''),",
   "getListLine2: (item) => j('连接' + item.specs?.connection, item.specs?.battery),"],
];

let ok = 0, fail = 0;
for (const [old, neu] of REPL) {
  if (!html.includes(old)) { console.log('  ❌ 未命中:', old.slice(0, 70)); fail++; continue; }
  html = html.replace(old, neu); ok++;
}
fs.writeFileSync(file, html);
console.log(`替换完成：成功 ${ok} / ${REPL.length}${fail ? '，失败 ' + fail : ''}`);
