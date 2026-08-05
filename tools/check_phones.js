const fs = require('fs');
const code = fs.readFileSync('phone-data.js', 'utf8');
const fn = new Function(code + '\nreturn PHONE_DATA;');
const DATA = fn();
const NEW = [
  "oneplus-13", "oneplus-ace5", "oneplus-ace5-pro", "oneplus-13t",
  "realme-gt7-pro", "realme-gt6", "realme-neo7",
  "oppo-find-x8-ultra", "oppo-find-x8s", "vivo-x200s", "vivo-x200-ultra",
  "honor-gt-pro", "redmi-turbo-4-pro", "xiaomi-civi-5-pro",
  "iphone-17", "iphone-17-pro", "iphone-17-pro-max",
  "samsung-s26", "samsung-s26-ultra"
];
let errs = 0;
function fail(m) { console.log('  X ' + m); errs++; }

const ids = DATA.map(d => d.id);
if (new Set(ids).size !== ids.length) fail('存在重复 id');

for (const id of NEW) {
  const p = DATA.find(d => d.id === id);
  if (!p) { fail('缺失机型 ' + id); continue; }
  for (const f of ['brand','model','launchDate','colors','popularity','sales','priceDrop','tags','officialUrl','lastVerified','storageOptions','defaultStorage','screen','body','ram','features'])
    if (!(f in p)) fail(id + ' 缺字段 ' + f);
  if (typeof p.popularity !== 'number' || p.popularity < 0 || p.popularity > 100) fail(id + ' popularity 越界');
  if (typeof p.sales !== 'number' || p.sales < 0 || p.sales > 200) fail(id + ' sales 越界');
  const ds = p.storageOptions.find(o => o.storage === p.defaultStorage) || p.storageOptions[0];
  if (!ds) fail(id + ' 无匹配默认版本');
  for (const o of p.storageOptions) {
    if (typeof o.priceJd !== 'number' || typeof o.pricePdd !== 'number' || o.priceJd < 0 || o.pricePdd < 0) fail(id + ' 价格非法');
    if (!o.storage) fail(id + ' storageOptions 缺 storage');
  }
  for (const f of ['size','resolution','refreshRate','material','type']) if (!(f in p.screen)) fail(id + ' screen 缺 ' + f);
  for (const f of ['height','width','thickness','weight','material']) if (!(f in p.body)) fail(id + ' body 缺 ' + f);
  for (const f of ['expandableStorage','dualSim','fiveG','nfc','infrared','esim','satellite','wifi','bluetooth','usb','waterproof'])
    if (!(f in p.features)) fail(id + ' features 缺 ' + f);
  const price = Math.min(ds.priceJd, ds.pricePdd);
  if (price < 999 || price > 19999) fail(id + ' 默认版本价格异常 ' + price);
}
console.log('机型总数 ' + DATA.length + '，新增校验 ' + (errs === 0 ? '全部通过' : (errs + ' 处问题')));
process.exit(errs ? 1 : 0);
