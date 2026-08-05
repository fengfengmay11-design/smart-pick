/*
 * engine.js — 可解释的推荐引擎（纯逻辑层，与 DOM 解耦）
 * 同时供 index.html（浏览器全局）与 tests/（Node require）使用，保证测试覆盖的是真实代码。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;            // Node / 测试环境
  } else {
    Object.assign(root, api);        // 浏览器经典脚本：挂到全局
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // 从自然语言里解析预算（元）
  function parseAiBudget(q) {
    let s = q.replace(/[，,、。\s]/g, '');
    // 万 -> 元
    let m = s.match(/(\d+(?:\.\d+)?)\s*万/);
    if (m) return Math.round(parseFloat(m[1]) * 10000);
    // k / 千 -> 千
    m = s.match(/(\d+(?:\.\d+)?)\s*[kK千]/);
    if (m) return Math.round(parseFloat(m[1]) * 1000);
    // 预算XXXX / XXXX左右 / XXXX元 / XXXX以内 / XXXX块
    m = s.match(/(?:预算|大概|大约)?(\d{3,6})(?:元|块|左右|上下|以内|以下|内|附近)?/);
    if (m) { const v = parseInt(m[1]); if (v >= 200) return v; }
    return null;
  }

  // 从自然语言里识别用户想要的品类（AI 选购独立于当前选中标签的关键）
  // 采用「最长匹配」：避免短词误伤（如「电竞屏」里的「电脑」不会抢走显示器）
  const CAT_KEYWORDS = {
    phone:    ['手机','iphone','安卓机','旗舰机','千元机'],
    gpu:      ['显卡','gpu','rtx','rx ','显存','光追','甜品卡','游戏卡','独显卡'],
    cpu:      ['cpu','处理器','酷睿','锐龙','ryzen','i5','i7','i9'],
    laptop:   ['笔记本电脑','笔记本','笔电','游戏本','轻薄本','本子','超极本','电脑','台式机','台式','一体机','macbook','电竞本'],
    ac:       ['空调','挂机','柜机','变频空调'],
    robot:    ['扫地机','扫地机器人','拖地机','扫拖机'],
    earphone: ['耳机','耳塞','降噪豆','蓝牙耳机','tws','入耳','头戴'],
    monitor:  ['显示器','显示屏','电竞屏','带鱼屏','曲面屏','外接屏'],
    tablet:   ['平板','平板电脑','ipad','pad','大屏娱乐'],
    camera:   ['相机','微单','单反','照相机','数码相机','拍照片','全画幅'],
    tv:       ['电视','电视机','智慧屏','大屏电视','客厅电视'],
    watch:    ['手表','智能手表','运动手表','apple watch','智能腕表'],
    keyboard: ['键盘','机械键盘','客制化键盘','三模键盘','码字键盘','打字键盘']
  };
  function detectCategory(q) {
    const lower = (q || '').toLowerCase();
    let best = null, bestLen = 0;
    for (const k in CAT_KEYWORDS) {
      for (const w of CAT_KEYWORDS[k]) {
        if (lower.includes(w.toLowerCase()) && w.length > bestLen) { best = k; bestLen = w.length; }
      }
    }
    return best; // 未识别到明确品类则返回 null
  }

  return { CAT_KEYWORDS, detectCategory, parseAiBudget };
});
