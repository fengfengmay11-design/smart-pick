/*
 * data-source.js — 实时数据源抽象层（演示：接入真实公开 REST 接口）
 * 设计要点：
 *   1. 单一数据入口 fetchLiveProducts()，返回归一化后的商品结构
 *   2. 内置 AbortController 超时控制，避免接口卡死
 *   3. 调用方负责「失败降级到本地 528 款数据」（见 index.html loadLiveData）
 *   4. 同时供浏览器（全局）与 Node 测试使用
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    Object.assign(root, api);
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const LIVE_API_BASE = 'https://fakestoreapi.com/products';

  // 把第三方接口的原始字段，映射成应用内部统一的商品结构
  function normalizeLiveProduct(p) {
    return {
      id: 'live-' + (p.id != null ? p.id : Math.random().toString(36).slice(2)),
      brand: '',
      model: p.title || ('商品 #' + p.id),
      image: p.image || '',
      price: typeof p.price === 'number' ? p.price : null,
      rating: p.rating && typeof p.rating.rate === 'number' ? p.rating.rate : null,
      ratingCount: p.rating && p.rating.count ? p.rating.count : 0,
      desc: p.description || '',
      live: true
    };
  }

  // 拉取某分类下的实时商品；category 默认 electronics（fakestoreapi 仅 electronics 等有限分类）
  async function fetchLiveProducts(category = 'electronics', { timeoutMs = 8000 } = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(`${LIVE_API_BASE}/category/${encodeURIComponent(category)}`, {
        signal: ctrl.signal,
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const raw = await res.json();
      return Array.isArray(raw) ? raw.map(normalizeLiveProduct) : [];
    } finally {
      clearTimeout(timer);
    }
  }

  return { LIVE_API_BASE, normalizeLiveProduct, fetchLiveProducts };
});
