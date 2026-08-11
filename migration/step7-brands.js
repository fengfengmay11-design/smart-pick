'use strict';
/**
 * step7-brands.js — 为 Step 7 的 30 个空类目预置所需品牌（幂等：已存在则跳过）。
 * 仅补充现有 86 品牌之外的厂商；不删除/不改写已有品牌。
 */
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/tornadoli/WorkBuddy/2026-07-15-16-38-34/phone-compare';
const V2 = path.join(ROOT, 'database/v2');
const f = path.join(V2, 'brands.json');
const brands = JSON.parse(fs.readFileSync(f, 'utf8'));
const have = new Set(brands.map(b => b.brand_id));

const add = (id, cn, en, aliases = []) => {
  if (have.has(id)) return false;
  const a = Array.from(new Set([cn, en, id, ...aliases].filter(Boolean)));
  brands.push({
    brand_id: id, brand_name: cn, brand_name_cn: cn, brand_name_en: en,
    aliases: a, official_url: '', logo: '', status: 'active'
  });
  have.add(id);
  return true;
};

const LIST = [
  ['dji', '大疆', 'DJI'], ['nintendo', '任天堂', 'Nintendo'], ['valve', 'Valve', 'Valve'],
  ['gopro', 'GoPro', 'GoPro'], ['insta360', '影石', 'Insta360'], ['zhiyun', '智云', 'Zhiyun'],
  ['xreal', 'XREAL', 'XREAL'], ['rokid', 'Rokid', 'Rokid'], ['oura', 'Oura', 'Oura'],
  ['meta', 'Meta', 'Meta'], ['pico', '小鸟看看', 'PICO'], ['htc', '宏达电', 'HTC'],
  ['amazon', '亚马逊', 'Amazon', ['kindle', 'Kindle']], ['boox', '文石', 'BOOX'], ['ireader', '掌阅', 'iReader'],
  ['ugreen', '绿联', 'UGREEN'], ['baseus', '倍思', 'Baseus'], ['elgato', 'Elgato', 'Elgato'],
  ['obsbot', '睿魔', 'OBSBOT'], ['sandisk', '闪迪', 'SanDisk'], ['wd', '西部数据', 'Western Digital'],
  ['seagate', '希捷', 'Seagate'], ['crucial', '英睿达', 'Crucial'], ['kingston', '金士顿', 'Kingston'],
  ['blue', 'Blue', 'Blue Microphones'], ['shure', '舒尔', 'Shure'], ['rode', 'RØDE', 'RØDE'],
  ['audio_technica', '铁三角', 'Audio-Technica'], ['marshall', 'Marshall', 'Marshall'], ['harman', '哈曼', 'Harman'],
  ['xgimi', '极米', 'XGIMI'], ['epson', '爱普生', 'Epson'], ['jmgo', '坚果', 'JMGO'],
  ['tplink', '普联', 'TP-Link'], ['netgear', '网件', 'NETGEAR'], ['tenda', '腾达', 'Tenda'],
  ['cisco', '思科', 'Cisco'], ['h3c', '新华三', 'H3C'], ['ubiquiti', 'Ubiquiti', 'Ubiquiti'],
  ['synology', '群晖', 'Synology'], ['qnap', '威联通', 'QNAP'], ['asustor', '华芸', 'Asustor'],
  ['8bitdo', '八位堂', '8BitDo'], ['thrustmaster', '图马思特', 'Thrustmaster'], ['fanatec', 'Fanatec', 'Fanatec'],
  ['sigma', '适马', 'Sigma'], ['tamron', '腾龙', 'Tamron'], ['tuya', '涂鸦智能', 'Tuya'],
  ['broadlink', '博联', 'Broadlink'], ['iflytek', '科大讯飞', 'iFlytek'], ['gigabyte', '技嘉', 'Gigabyte'],
  ['seasonic', '海韵', 'Seasonic'], ['noctua', '猫头鹰', 'Noctua'], ['ayaneo', 'AYANEO', 'AYANEO'],
  ['alienware', '外星人', 'Alienware'],
];
let n = 0;
LIST.forEach(([id, cn, en, al]) => { if (add(id, cn, en, al)) n++; });
fs.writeFileSync(f, JSON.stringify(brands, null, 2) + '\n');
console.log('===== Step7 品牌预置 =====');
console.log('新增品牌:', n, '| 现有总数:', brands.length);
