'use strict';
/**
 * step7-schemas.js — 为 30 个空二级类目补建 parameter-schema（数组形式，与现有品类一致）。
 * 字段按各品类通用维度定义；未知字段在 seed 中填 null，完整度按 filled/total 计算。
 */
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/tornadoli/WorkBuddy/2026-07-15-16-38-34/phone-compare';
const V2 = path.join(ROOT, 'database/v2');
const f = path.join(V2, 'parameter-schemas.json');
const schemas = JSON.parse(fs.readFileSync(f, 'utf8'));

const NEW = {
  computer_system: ['cpu', 'gpu', 'ram', 'storage', 'screen_size', 'screen_resolution', 'refresh_rate', 'weight', 'os', 'ports'],
  pc_hardware: ['type', 'interface', 'power', 'compatibility', 'form_factor', 'weight'],
  ereader: ['screen_size', 'resolution', 'panel', 'storage', 'battery', 'weight', 'waterproof', 'os'],
  dock: ['ports', 'interface', 'power_delivery', 'compatibility', 'weight'],
  webcam: ['resolution', 'fps', 'fov', 'autofocus', 'microphone', 'interface', 'connection'],
  mobile_storage: ['capacity', 'interface', 'read_speed', 'write_speed', 'form_factor', 'weight'],
  speaker: ['power', 'driver', 'connectivity', 'battery', 'waterproof', 'weight'],
  microphone: ['pattern', 'connectivity', 'frequency_response', 'sample_rate', 'interface'],
  projector: ['brightness', 'resolution', 'contrast', 'throw_ratio', 'tech', 'os', 'speakers', 'ports'],
  soundbar: ['channels', 'power', 'connectivity', 'dolby', 'ports', 'subwoofer'],
  smartband: ['screen', 'battery', 'health', 'gps', 'waterproof', 'weight', 'os'],
  smartring: ['battery', 'health', 'waterproof', 'weight', 'sensor', 'compatibility'],
  smartglasses: ['weight', 'battery', 'display', 'camera', 'microphone', 'connectivity'],
  vr: ['resolution', 'refresh_rate', 'fov', 'tracking', 'weight', 'connectivity', 'platform'],
  ar: ['resolution', 'fov', 'weight', 'battery', 'display', 'connectivity', 'platform'],
  lens: ['mount', 'focal_length', 'aperture', 'stabilization', 'weight', 'filter_thread'],
  action_cam: ['resolution', 'fps', 'stabilization', 'waterproof', 'weight', 'battery', 'connectivity'],
  gimbal: ['payload', 'weight', 'battery', 'axes', 'connectivity', 'compatibility'],
  drone: ['camera_resolution', 'flight_time', 'range', 'weight', 'gimbal', 'sensors', 'max_speed'],
  console: ['cpu', 'gpu', 'storage', 'ram', 'resolution', 'fps', 'disc_drive', 'weight'],
  handheld_console: ['cpu', 'gpu', 'screen_size', 'resolution', 'refresh_rate', 'battery', 'storage', 'weight'],
  gamepad: ['connectivity', 'compatibility', 'battery', 'weight', 'features'],
  racing_wheel: ['compatibility', 'rotation', 'force_feedback', 'pedals', 'connectivity'],
  router: ['wifi_standard', 'speed', 'bands', 'ports', 'cpu', 'ram', 'coverage'],
  mesh: ['nodes', 'wifi_standard', 'speed', 'coverage', 'ports', 'cpu'],
  switch: ['ports', 'speed', 'managed', 'poe', 'layers'],
  nas: ['bays', 'cpu', 'ram', 'max_capacity', 'ports', 'raid'],
  smart_device: ['type', 'connectivity', 'power', 'compatibility'],
  ai_device: ['type', 'model', 'connectivity', 'battery', 'display', 'compatibility'],
  robot_device: ['type', 'battery', 'connectivity', 'weight', 'sensors', 'navigation'],
};

let added = 0;
for (const [k, v] of Object.entries(NEW)) {
  if (!schemas[k]) { schemas[k] = v; added++; }
}
// 重新按字母序整理（含 _comment），保持文件整洁
const comment = schemas._comment;
const sorted = {};
if (comment) sorted._comment = comment;
Object.keys(schemas).filter(k => k !== '_comment').sort().forEach(k => { sorted[k] = schemas[k]; });

fs.writeFileSync(f, JSON.stringify(sorted, null, 2) + '\n');
console.log('===== Step7 schema 补建 =====');
console.log('新增 schema 类目数:', added, '/', Object.keys(NEW).length);
console.log('schema 总类目数:', Object.keys(sorted).filter(k => k !== '_comment').length);
