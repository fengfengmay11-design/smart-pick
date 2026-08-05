#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
京东联盟 API 客户端 —— 商品查询 / 价格刷新 / 主图提取

设计原则：**注册当天就能跑通**。
京东联盟的接口分两档权限，本客户端按「免权限优先」组织：

  ┌ 免权限（注册+实名后立即可用）
  │   jd.union.open.goods.jingfen.query        京粉精选商品池
  │   jd.union.open.goods.material.query       猜你喜欢/物料商品池
  │   jd.union.open.category.goods.get         商品类目查询
  └ 需申请（提交推广模式申请，审批通过后自动开通）
      jd.union.open.goods.query                关键词 / SKU / 类目搜索
      jd.union.open.goods.bigfield.query       商品图文详情

关键限制：**免权限接口都不能搜指定型号**。
jingfen / material 只能按「频道 ID」拉平台推荐的商品池，
要按「品牌+型号」或「skuId」精确定位自己的 659 款产品，
必须有 jd.union.open.goods.query 权限。

所以路径是：
  1. 拿到 key 当天 → jingfen.query 验证签名链路通不通
  2. 提交推广模式申请 → 开通 goods.query
  3. goods.query 同时支持 keyword 和 skuIds，skuIds 更精确（不会搜错型号）

前置条件：
  1. 注册京东联盟：https://union.jd.com/openplatform/
  2. 实名认证 → 推广管理创建网站/APP → 拿 app_key / secret_key
  3. 权限申请：https://union.jd.com/openplatform/groupApply （选推广模式）
  4. cp server/.env.example server/.env 并填入凭据
  5. python server/verify_setup.py   ← 一键自检当前有哪些权限

注意：timestamp 与京东服务器时差需 <10 分钟，否则签名校验失败。

签名规则：
  sign = MD5(app_secret + sorted_params_concat + app_secret).upper()

参考文档：https://union.jd.com/openplatform/api
"""

import hashlib
import json
import os
import time
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

# ---------------------------------------------------------------------------
# .env 加载（零依赖，不强制安装 python-dotenv）
# ---------------------------------------------------------------------------
_ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")


def _load_env(path: str = _ENV_PATH) -> None:
    """加载 .env 到 os.environ。优先用 python-dotenv，没装则手写解析。

    这一步很关键：之前版本只调 os.getenv，用户把凭据填进 .env 也读不到。
    """
    try:
        from dotenv import load_dotenv  # type: ignore
        load_dotenv(path)
        return
    except ImportError:
        pass

    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            key, val = key.strip(), val.strip()
            # 去掉包裹的引号
            if len(val) >= 2 and val[0] == val[-1] and val[0] in ("'", '"'):
                val = val[1:-1]
            os.environ.setdefault(key, val)


_load_env()


# ---------------------------------------------------------------------------
# 配置
# ---------------------------------------------------------------------------
def _cfg(name: str, default: str = "") -> str:
    """每次调用时实时读取，方便测试中动态注入。"""
    return os.getenv(name, default).strip()


GATEWAY = "https://api.jd.com/routerjson"

# 接口权限分级（依据京东联盟官方帮助中心 13246-13312-108188）
FREE_METHODS = {
    "jd.union.open.goods.jingfen.query": "京粉精选商品池",
    "jd.union.open.goods.material.query": "猜你喜欢商品推荐",
    "jd.union.open.category.goods.get": "商品类目查询",
}
APPLY_METHODS = {
    "jd.union.open.goods.query": "关键词/SKU 搜索商品",
    "jd.union.open.goods.bigfield.query": "商品图文详情",
}


class JdError(RuntimeError):
    """京东 API 调用异常，带上业务错误码便于判断是否为权限问题。"""

    def __init__(self, message: str, code: str = "", raw: Any = None):
        super().__init__(message)
        self.code = code
        self.raw = raw

    @property
    def is_permission_error(self) -> bool:
        # 京东权限相关错误码：
        #   isv.permission-deny / 无权限 / 未授权
        text = f"{self.code} {self}"
        return any(k in text for k in ("permission", "权限", "未授权", "not-authorized", "apply"))


# ---------------------------------------------------------------------------
# 签名与请求
# ---------------------------------------------------------------------------
def _sign(params: Dict[str, str], secret: str) -> str:
    sorted_str = "".join(f"{k}{v}" for k, v in sorted(params.items()))
    raw = secret + sorted_str + secret
    return hashlib.md5(raw.encode("utf-8")).hexdigest().upper()


def is_placeholder(val: str) -> bool:
    """判断是否还是 .env.example 里的占位符而非真实凭据。

    不加这层检查的话，用户复制了 .env.example 但没填 JD 凭据时，
    占位符会被当成真 key 发出去，只回一个「签名错误」，极难排查。
    真实 appkey/secret 是 32 位十六进制串。
    """
    if not val:
        return True
    low = val.lower()
    if low.startswith("your_") or low.endswith("_here"):
        return True
    if "你的" in val or val in ("xxx", "todo", "changeme"):
        return True
    return len(val) < 16


def _build_params(method: str, biz: Optional[Dict] = None) -> Dict[str, str]:
    app_key, app_secret = _cfg("JD_APP_KEY"), _cfg("JD_APP_SECRET")
    if is_placeholder(app_key) or is_placeholder(app_secret):
        which = []
        if is_placeholder(app_key):
            which.append("JD_APP_KEY")
        if is_placeholder(app_secret):
            which.append("JD_APP_SECRET")
        raise JdError(
            f"{' 和 '.join(which)} 尚未填入真实凭据（当前是占位符或为空）。\n"
            "  1) cp server/.env.example server/.env\n"
            "  2) 填入京东联盟的 appkey / secretkey（32 位十六进制串）\n"
            "  3) python server/verify_setup.py 自检\n"
            "  申请步骤：docs/JD_UNION_SETUP.md",
            code="no_credentials",
        )
    params = {
        "app_key": app_key,
        "method": method,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
        "format": "json",
        "v": "1.0",
        "sign_method": "md5",
    }
    if biz is not None:
        params["360buy_param_json"] = json.dumps(biz, ensure_ascii=False)
    params["sign"] = _sign(params, app_secret)
    return params


def _post(method: str, biz: Optional[Dict] = None, timeout: int = 15) -> Dict[str, Any]:
    """发请求并剥掉京东的三层响应包装，直接返回业务数据。

    京东的响应结构非常绕：
      {"jd_union_open_xxx_response": {"code":"0", "result": "<JSON字符串>"}}
    result 常常是被转义的 JSON 字符串，需要二次 parse。
    """
    params = _build_params(method, biz)
    body = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(GATEWAY, data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise JdError(f"HTTP {e.code}: {e.reason}", code=f"http_{e.code}") from e
    except Exception as e:
        raise JdError(f"网络错误：{e}", code="network") from e

    # 网关级错误
    if "error_response" in raw:
        err = raw["error_response"]
        raise JdError(
            err.get("zh_desc") or err.get("en_desc") or str(err),
            code=str(err.get("code", "")),
            raw=err,
        )

    # 业务响应：key 形如 jd_union_open_goods_query_response
    resp_key = method.replace(".", "_") + "_response"
    payload = raw.get(resp_key) or {}
    if not payload:
        raise JdError(f"响应缺少 {resp_key}", code="bad_response", raw=raw)

    code = str(payload.get("code", "0"))
    if code not in ("0", "200"):
        raise JdError(payload.get("message", f"业务错误 code={code}"), code=code, raw=payload)

    result = payload.get("result")
    if isinstance(result, str):
        try:
            result = json.loads(result)
        except json.JSONDecodeError:
            raise JdError("result 字段无法解析为 JSON", code="bad_result", raw=result)
    result = result or {}

    inner_code = str(result.get("code", "200"))
    if inner_code not in ("200", "0"):
        raise JdError(result.get("message", f"业务错误 code={inner_code}"), code=inner_code, raw=result)

    return result


# ---------------------------------------------------------------------------
# 响应归一化
# ---------------------------------------------------------------------------
def _norm_goods(g: Dict) -> Dict:
    """把京东各接口返回的商品对象统一成同一份结构。"""
    img = ""
    image_info = g.get("imageInfo") or {}
    img_list = image_info.get("imageList") or []
    if img_list:
        img = img_list[0].get("url", "")
    if not img:
        img = g.get("picUrl") or g.get("imgUrl") or ""

    # 价格字段在不同接口里叫法不同
    price_info = g.get("priceInfo") or {}
    price = (
        price_info.get("lowestCouponPrice")
        or price_info.get("lowestPrice")
        or price_info.get("price")
        or g.get("price")
        or 0
    )

    comment_info = g.get("commentInfo") or {}
    return {
        "skuId": str(g.get("skuId", "")),
        "name": g.get("skuName") or g.get("goodsName") or "",
        "brandName": g.get("brandName", ""),
        "price": float(price or 0),
        "image": img,
        "shopType": "自营" if g.get("isJdSale") or g.get("owner") == "g" else "第三方",
        "sales": int(g.get("inOrderCount30Days") or g.get("inOrderCount") or 0),
        "comments": int(comment_info.get("commentCount") or g.get("comments") or 0),
        "goodRate": float(comment_info.get("goodCommentsShare") or g.get("goodCommentsShare") or 0),
        "url": g.get("materialUrl", ""),
    }


def _extract_list(result: Dict) -> List[Dict]:
    items = result.get("data")
    if isinstance(items, dict):
        items = items.get("data") or []
    return items or []


# ==================== 免权限接口 ====================

def jingfen_query(elite_id: int = 1, page: int = 1, size: int = 20,
                  sort_name: str = "inOrderCount30Days") -> Dict:
    """京粉精选商品池（**免权限**，用于验证签名链路是否打通）。

    Args:
        elite_id: 频道 ID。1=好券商品 2=超级大牌 10=9.9包邮 22=热销爆品
                  15=京东配送 25=秒杀 30=京东好物 33=居家 34=美妆
    """
    result = _post("jd.union.open.goods.jingfen.query", {
        "goodsReqDTO": {
            "eliteId": elite_id,
            "pageIndex": page,
            "pageSize": min(size, 30),
            "sortName": sort_name,
        }
    })
    items = _extract_list(result)
    return {"ok": True, "total": result.get("totalCount", len(items)),
            "results": [_norm_goods(g) for g in items]}


def material_query(elite_id: int = 1, page: int = 1, size: int = 20) -> Dict:
    """物料商品池（**免权限**）。"""
    result = _post("jd.union.open.goods.material.query", {
        "goodsReq": {
            "eliteId": elite_id,
            "pageIndex": page,
            "pageSize": min(size, 30),
        }
    })
    items = _extract_list(result)
    return {"ok": True, "total": result.get("totalCount", len(items)),
            "results": [_norm_goods(g) for g in items]}


def category_query(parent_id: int = 0, grade: int = 0) -> Dict:
    """商品类目查询（**免权限**，可用来验证签名链路）。"""
    result = _post("jd.union.open.category.goods.get", {
        "req": {"parentId": parent_id, "grade": grade}
    })
    items = _extract_list(result)
    return {"ok": True, "results": items}


def query_by_skus(sku_ids: List[str]) -> Dict:
    """按 SKU ID 批量查价 —— 精确刷价的推荐方式，不会搜错型号。

    优先用 goods.query 的 skuIds 参数（官方文档确认支持 skuid 搜索），
    失败时回退老接口 promotiongoodsinfo.query。一次最多 100 个 SKU。
    """
    if not sku_ids:
        return {"ok": True, "results": []}
    ids = ",".join(str(s) for s in sku_ids[:100])

    try:
        result = _post("jd.union.open.goods.query", {"goodsReqDTO": {"skuIds": ids}})
        items = _extract_list(result)
        if items:
            return {"ok": True, "results": [_norm_goods(g) for g in items]}
    except JdError as primary:
        # 老接口兜底；两条都失败则抛出更有信息量的那个
        try:
            result = _post("jd.union.open.goods.promotiongoodsinfo.query", {"skuIds": ids})
            items = _extract_list(result)
            return {"ok": True, "results": [_norm_goods(g) for g in items]}
        except JdError:
            raise primary

    return {"ok": True, "results": []}


# ==================== 需申请权限的接口 ====================

def search_goods(keyword: str, page: int = 1, size: int = 20,
                 sort: str = "inOrderCount30Days") -> Dict:
    """关键词搜索商品（**需申请 goods.query 权限**）。

    这是按「品牌+型号」自动匹配产品的唯一通道。
    无权限时会抛 JdError(is_permission_error=True)，调用方可据此提示用户去申请。
    """
    result = _post("jd.union.open.goods.query", {
        "goodsReqDTO": {
            "keyword": keyword,
            "pageIndex": page,
            "pageSize": min(size, 20),
            "sortName": sort,
        }
    })
    items = _extract_list(result)
    return {"ok": True, "total": result.get("totalCount", len(items)),
            "results": [_norm_goods(g) for g in items]}


# ==================== 权限探测 ====================

def probe_permissions() -> Dict[str, Dict]:
    """逐个探测当前 app_key 对各接口的权限状态。

    Returns:
        {method: {"name":..., "tier":"free|apply", "ok":bool, "detail":str}}
    """
    probes = [
        ("jd.union.open.goods.jingfen.query", "free", lambda: jingfen_query(size=1)),
        ("jd.union.open.goods.material.query", "free", lambda: material_query(size=1)),
        ("jd.union.open.category.goods.get", "free", lambda: category_query()),
        ("jd.union.open.goods.query", "apply", lambda: search_goods("手机", size=1)),
    ]
    out: Dict[str, Dict] = {}
    for method, tier, fn in probes:
        label = FREE_METHODS.get(method) or APPLY_METHODS.get(method, method)
        try:
            r = fn()
            n = len(r.get("results", []))
            out[method] = {"name": label, "tier": tier, "ok": True,
                           "detail": f"返回 {n} 条数据"}
        except JdError as e:
            out[method] = {
                "name": label, "tier": tier, "ok": False,
                "detail": ("无权限，需在联盟后台申请" if e.is_permission_error
                           else f"{e}（code={e.code}）"),
            }
        time.sleep(0.35)   # 基础权限 QPS 限 5/s，留足余量
    return out


# ==================== 价格刷新 ====================

def refresh_product_price(brand: str, model: str, sku_id: str = "") -> Dict:
    """查询单款产品的京东现价。

    优先级：
      1. 有 sku_id → 按 SKU 精确查（不会搜错型号，强烈推荐）
      2. 无 sku_id → 关键词搜索「品牌 型号」（可能匹配到配件/翻新）

    两条路径都依赖 goods.query 权限；SKU 路径会自动回退老接口。

    Returns:
        {ok, jd_price, jd_image, source_name, source_sku, method, error?}
    """
    # 路径 1：SKU 精确查询
    if sku_id:
        try:
            r = query_by_skus([sku_id])
            if r["results"]:
                g = r["results"][0]
                return {"ok": True, "jd_price": g["price"], "jd_image": g["image"],
                        "source_name": g["name"], "source_sku": g["skuId"],
                        "method": "sku"}
            return {"ok": False, "error": f"SKU {sku_id} 未返回数据", "method": "sku"}
        except JdError as e:
            return {"ok": False, "error": str(e), "method": "sku"}

    # 路径 2：关键词搜索（需权限）
    q = f"{brand} {model}".strip()
    try:
        r = search_goods(q, size=10)
    except JdError as e:
        hint = "需申请 goods.query 权限，或给产品补 skuId 字段走免权限通道" \
            if e.is_permission_error else str(e)
        return {"ok": False, "error": hint, "method": "keyword",
                "need_permission": e.is_permission_error}

    if not r["results"]:
        return {"ok": False, "error": f"未搜到「{q}」", "method": "keyword"}

    # 自营优先；同为自营时取最低价，避免抓到配件/翻新
    self_items = [x for x in r["results"] if x["shopType"] == "自营" and x["price"] > 0]
    pool = self_items or [x for x in r["results"] if x["price"] > 0]
    if not pool:
        return {"ok": False, "error": f"「{q}」结果价格均为 0", "method": "keyword"}
    best = min(pool, key=lambda x: x["price"])

    return {"ok": True, "jd_price": best["price"], "jd_image": best["image"],
            "source_name": best["name"], "source_sku": best["skuId"],
            "method": "keyword"}


# ==================== CLI ====================

if __name__ == "__main__":
    import sys

    def _dump(obj):
        print(json.dumps(obj, ensure_ascii=False, indent=2))

    if len(sys.argv) < 2:
        print(__doc__)
        print("用法：")
        print("  python jd_client.py probe                  # 探测接口权限")
        print("  python jd_client.py jingfen [eliteId]      # 京粉精选（免权限）")
        print("  python jd_client.py category               # 类目查询（免权限）")
        print("  python jd_client.py sku SKU_ID[,SKU_ID2]   # 按SKU查价（需权限，最精确）")
        print("  python jd_client.py search \"关键词\"         # 关键词搜索（需权限）")
        print("  python jd_client.py refresh 品牌 型号        # 刷单款价格")
        sys.exit(0)

    cmd = sys.argv[1]
    try:
        if cmd == "probe":
            for m, info in probe_permissions().items():
                mark = "✓" if info["ok"] else "✗"
                print(f"{mark} [{info['tier']:>5}] {info['name']:<26} {info['detail']}")
        elif cmd == "jingfen":
            _dump(jingfen_query(int(sys.argv[2]) if len(sys.argv) > 2 else 1, size=5))
        elif cmd == "category":
            _dump(category_query())
        elif cmd == "sku":
            _dump(query_by_skus(sys.argv[2].split(",")))
        elif cmd == "search":
            _dump(search_goods(sys.argv[2], size=5))
        elif cmd == "refresh":
            _dump(refresh_product_price(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else ""))
        else:
            print(f"未知命令：{cmd}")
            sys.exit(1)
    except JdError as e:
        print(f"✗ 调用失败：{e}")
        if e.is_permission_error:
            print("  → 这是权限问题，请到联盟后台申请该接口权限")
        sys.exit(1)
