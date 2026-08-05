#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
京东联盟 API 客户端 —— 商品查询 / 价格刷新 / 主图提取

用途：
  1. 按关键词搜索京东商品（价格/主图/销量/评价）
  2. 按 SKU ID 查商品详情
  3. 批量刷新 data-*.js 中的 price_jd / price_pdd 字段
  4. 提取商品主图 URL 供 images/ 本地化使用

前置条件：
  - 注册京东联盟开发者账号：https://union.jd.com/openplatform/
  - 创建应用，拿到 app_key 和 app_secret
  - 申请「商品查询」接口权限（jd.union.open.goods.query 等）
  - 将凭据写入 server/.env（见 .env.example）

签名规则：
  sign = MD5(app_secret + sorted_params_string + app_secret).upper()

参考文档：
  https://union.jd.com/helpcenter/13246-13312-108188
"""

import hashlib
import json
import os
import time
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# 配置（从环境变量读取）
# ---------------------------------------------------------------------------
APP_KEY = os.getenv("JD_APP_KEY", "")
APP_SECRET = os.getenv("JD_APP_SECRET", "")
SITE_ID = os.getenv("JD_SITE_ID", "")       # 网站 ID（推广位）

GATEWAY = "https://api.jd.com/routerjson"     # 正式环境
# GATEWAY = "https://api-sandbox.jd.com/routerjson"  # 沙箱（测试用）


def _sign(params: Dict[str, str]) -> str:
    """生成 MD5 签名。"""
    sorted_str = "".join(f"{k}{v}" for k, v in sorted(params.items()))
    raw = APP_SECRET + sorted_str + APP_SECRET
    return hashlib.md5(raw.encode("utf-8")).hexdigest().upper()


def _build_params(method: str, extra: Optional[Dict] = None) -> Dict[str, str]:
    """构建带签名的请求参数。"""
    if not APP_KEY or not APP_SECRET:
        raise RuntimeError(
            "未配置 JD_APP_KEY / JD_APP_SECRET。\n"
            "请 cp server/.env.example server/.env 并填入你的京东联盟凭据。"
        )
    base = {
        "app_key": APP_KEY,
        "method": method,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
        "format": "json",
        "v": "1.0",
        "sign_method": "md5",
    }
    if extra:
        base.update(extra)
    base["sign"] = _sign(base)
    return base


def _post(method: str, extra: Optional[Dict] = None) -> Dict[str, Any]:
    """发送 POST 请求并解析 JSON 响应。"""
    params = _build_params(method, extra)
    body = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(GATEWAY, data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"error": str(e), "error_type": "network"}


# ==================== 公开接口 ====================

def search_goods(keyword: str, page=1, size=20, sort="inOrderCount30Days") -> Dict:
    """
    关键词搜索商品。

    Args:
        keyword: 搜索词，如「iPhone 16 Pro」「小米平板7」
        page:   页码（从 1 开始）
        size:   每页条数（最大 20）
        sort:   排序方式：
                inOrderCount30Days — 近30天销量（默认）
                price_asc / price_desc — 价格升/降
                commissionRate_desc — 佣金比例降序

    Returns:
        {ok, total, results: [{skuId, name, brandName, price, image,
         shopType, inOrderCount30Days, ...}], error?}
    """
    biz = json.dumps({
        "goodsReqDTO": {
            "keyword": keyword,
            "pageIndex": page,
            "pageSize": size,
            "sortName": sort,
        }
    }, ensure_ascii=False)

    raw = _post("jd.union.open.goods.query", {"360buy_param_json": biz})

    if "error_response" in raw:
        return {"ok": False, "total": 0, "results": [], "error": raw["error_response"].get("zh_desc", str(raw["error_response"]))}

    resp = raw.get("jd_union_open_goods_query_response", {})
    result = resp.get("result", {})
    data = json.loads(result) if isinstance(result, str) else result or {}

    goods_list = data.get("data", [])
    total = data.get("total", len(goods_list))

    results = []
    for g in goods_list:
        results.append({
            "skuId": g.get("skuId", ""),
            "name": g.get("goodsName", ""),
            "brandName": g.get("brandName", ""),
            "price": float(g.get("price", 0)),
            "image": g.get("imageInfo", {}).get("imageList", [{}])[0].get("url", ""),
            "shopType": "自营" if g.get("isSelfOperated") else "第三方",
            "sales": int(g.get("inOrderCount30Days", 0)),
            "commissionRatio": g.get("commissionShare", 0),
        })

    return {"ok": True, "total": total, "results": results}


def get_goods_detail(sku_id: str) -> Dict:
    """
    按 SKU ID 查商品详情（含主图、参数、评价等）。

    Args:
        sku_id: 京东 SKU 编号，如 '100065474274'

    Returns:
        {ok, detail: {skuId, name, brandName, price, image, specs?, ...}, error?}
    """
    biz = json.dumps({"skuIds": sku_id}, ensure_ascii=False)
    raw = _post("jd.union.open.promotiongoodsinfo.query", {"360buy_param_json": biz})

    if "error_response" in raw:
        return {"ok": False, "detail": {}, "error": raw["error_response"].get("zh_desc", str(raw["error_response"]))}

    resp = raw.get("jd_union_open_promotiongoodsinfo_query_response", {})
    result = resp.get("result", {})
    data = json.loads(result) if isinstance(result, str) else result or {}
    goods_list = data.get("data", [])

    if not goods_list:
        return {"ok": False, "detail": {}, "error": f"SKU {sku_id} 未找到"}

    g = goods_list[0]
    img_url = (g.get("imageInfo") or {}).get("imageList", [{}])[0].get("url", "")

    return {
        "ok": True,
        "detail": {
            "skuId": g.get("skuId", ""),
            "name": g.get("goodsName", ""),
            "brandName": g.get("brandName", ""),
            "price": float(g.get("price", 0)),
            "image": img_url,
            "shopType": "自营" if g.get("isSelfOperated") else "第三方",
            "sales": int(g.get("inOrderCount30Days", 0)),
            "comments": g.get("comments", 0),
            "goodCommentsRate": g.get("goodCommentsShare", 0),
        },
    }


# ==================== 价格刷新工具函数 ====================

def refresh_product_price(brand: str, model: str) -> Dict:
    """
    用品牌+型号搜京东，返回最低价。

    用途：给 data-*.js 里每款产品找当前实时到手价。
    """
    q = f"{brand} {model}"
    result = search_goods(q, size=5)
    if not result["ok"]:
        return {"ok": False, "jd_price": None, "pdd_price": None, "error": result.get("error")}
    if not result["results"]:
        return {"ok": False, "jd_price": None, "pdd_price": None, "error": f"未找到「{q}」"}

    # 取自营优先，否则取最低价
    self_items = [r for r in result["results"] if r["shopType"] == "自营"]
    best = self_items[0] if self_items else min(result["results"], key=lambda x: x["price"])

    return {
        "ok": True,
        "jd_price": best["price"],
        "jd_image": best.get("image", ""),
        "source_name": best["name"],
        "source_sku": best["skuId"],
    }


if __name__ == "__main__":
    # 简单 CLI 测试
    import sys
    if len(sys.argv) < 2:
        print("用法:")
        print("  python jd_client.py search \"关键词\"")
        print("  python jd_client.py detail SKU_ID")
        print("  python jd_client.py refresh 品牌 型号")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "search":
        r = search_goods(sys.argv[2])
        print(json.dumps(r, ensure_ascii=False, indent=2))
    elif cmd == "detail":
        r = get_goods_detail(sys.argv[2])
        print(json.dumps(r, ensure_ascii=False, indent=2))
    elif cmd == "refresh":
        brand = sys.argv[2] if len(sys.argv) > 2 else ""
        model = sys.argv[3] if len(sys.argv) > 3 else ""
        r = refresh_product_price(brand, model)
        print(json.dumps(r, ensure_ascii=False, indent=2))
