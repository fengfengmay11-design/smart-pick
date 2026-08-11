// Step 6 批次A：新增品牌实体（仅新增，不改动已有 67 条）
// 这些品牌是客观存在的消费电子品牌，非编造。brand_id 稳定可读 + aliases 支持中英文/大小写搜索。
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..', 'database', 'v2');
const brands = require(path.join(base, 'brands.json'));

const existing = new Set(brands.map(b => b.brand_id));
const additions = [
  { brand_id:'google',   brand_name:'谷歌',   brand_name_cn:'谷歌',   brand_name_en:'Google',   aliases:['谷歌','google','Google','GOOGLE','Google Pixel','Pixel'] },
  { brand_id:'motorola', brand_name:'摩托罗拉', brand_name_cn:'摩托罗拉', brand_name_en:'Motorola', aliases:['摩托罗拉','motorola','Motorola','Moto','moto'] },
  { brand_id:'meizu',    brand_name:'魅族',   brand_name_cn:'魅族',   brand_name_en:'Meizu',    aliases:['魅族','meizu','Meizu','MEIZU'] },
  { brand_id:'nubia',    brand_name:'努比亚', brand_name_cn:'努比亚', brand_name_en:'nubia',    aliases:['努比亚','nubia','Nubia','红魔','Red Magic','redmagic'], note:'中兴子品牌；游戏线 Red Magic' },
  { brand_id:'iqoo',     brand_name:'iQOO',   brand_name_cn:'iQOO',   brand_name_en:'iQOO',     aliases:['iQOO','iqoo','IQOO','爱酷'], note:'vivo 子品牌' },
  { brand_id:'redmi',    brand_name:'红米',   brand_name_cn:'红米',   brand_name_en:'Redmi',    aliases:['红米','redmi','Redmi','REDMINote','Note'], note:'小米子品牌' },
  { brand_id:'amazfit',  brand_name:'Amazfit', brand_name_cn:'Amazfit', brand_name_en:'Amazfit', aliases:['Amazfit','amazfit','Zepp'] },
  { brand_id:'fitbit',   brand_name:'Fitbit', brand_name_cn:'Fitbit', brand_name_en:'Fitbit',  aliases:['Fitbit','fitbit','FITBIT'] },
  { brand_id:'coros',    brand_name:'COROS',  brand_name_cn:'高驰',   brand_name_en:'COROS',    aliases:['高驰','COROS','coros','Coros'] },
  { brand_id:'razer',    brand_name:'雷蛇',   brand_name_cn:'雷蛇',   brand_name_en:'Razer',    aliases:['雷蛇','razer','Razer','RAZER'] },
  { brand_id:'cherry',   brand_name:'CHERRY', brand_name_cn:'樱桃',   brand_name_en:'CHERRY',  aliases:['樱桃','CHERRY','cherry','Cherry'] },
  { brand_id:'corsair',  brand_name:'海盗船', brand_name_cn:'海盗船', brand_name_en:'Corsair', aliases:['海盗船','corsair','Corsair','CORSAIR'] },
  { brand_id:'hhkb',     brand_name:'HHKB',   brand_name_cn:'HHKB',   brand_name_en:'HHKB',     aliases:['HHKB','hhkb','Happy Hacking Keyboard','PFU'] },
  { brand_id:'ducky',    brand_name:'Ducky',  brand_name_cn:'鸭子',   brand_name_en:'Ducky',    aliases:['鸭子','Ducky','ducky','DUCKY'] },
  { brand_id:'steelseries', brand_name:'赛睿', brand_name_cn:'赛睿', brand_name_en:'SteelSeries', aliases:['赛睿','steelseries','SteelSeries','STEELSERIES'] },
  { brand_id:'ikbc',     brand_name:'iKBC',   brand_name_cn:'iKBC',   brand_name_en:'iKBC',     aliases:['iKBC','ikbc','IKBC'] },
  { brand_id:'zowie',    brand_name:'卓威',   brand_name_cn:'卓威',   brand_name_en:'ZOWIE',    aliases:['卓威','ZOWIE','zowie','BenQ ZOWIE'], note:'明基电竞子品牌' },
  { brand_id:'glorious', brand_name:'Glorious', brand_name_cn:'Glorious', brand_name_en:'Glorious', aliases:['Glorious','glorious','GLORIOUS'] },
  { brand_id:'roccat',   brand_name:'ROCCAT', brand_name_cn:'巨爪',   brand_name_en:'ROCCAT',   aliases:['巨爪','ROCCAT','roccat','Roccat'] }
];

let added = 0, skipped = 0;
for (const a of additions) {
  if (existing.has(a.brand_id)) { skipped++; continue; }
  brands.push({
    brand_id: a.brand_id,
    brand_name: a.brand_name,
    brand_name_cn: a.brand_name_cn,
    brand_name_en: a.brand_name_en,
    aliases: a.aliases,
    official_url: '',
    logo: '',
    status: 'active'
  });
  existing.add(a.brand_id);
  added++;
}
fs.writeFileSync(path.join(base, 'brands.json'), JSON.stringify(brands, null, 2) + '\n');
console.log(`✓ brands.json: 新增 ${added} 个，跳过已存在 ${skipped} 个，现共 ${brands.length} 个`);
