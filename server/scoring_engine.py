# ---- 7维度数据驱动评分引擎（替代原伪随机逻辑） ----
# 输入：products(含price/match_pct/reasons/rank/specs), intent(budget/brand/intents)
# 输出：每个产品的7维度分数 + 加权总分 + 评分理由

_DIMS = [
    ("功能适配度",   25, "fit"),
    ("性能与质量",   20, "perf"),
    ("成本效益",     20, "value"),
    ("使用体验",     15, "ux"),
    ("服务与保障",   10, "svc"),
    ("安全与风险",    5, "safe"),
    ("发展与兼容性",  5, "future"),
]

# 品牌服务评分（基于市场认知，可后续接入外部数据）
_BRAND_SVC = {
    "苹果": 88, "华为": 85, "小米": 78, "vivo": 75, "oppo": 75,
    "三星": 82, "荣耀": 76, "一加": 74, "谷歌": 80, "索尼": 76,
    "联想": 74, "华硕": 72, "惠普": 73, "戴尔": 74, "微软": 76,
    "英特尔": 75, "amd": 72, "英伟达": 78, "科大讯飞": 70,
}
# 默认分
_DFLT_SVC = 68

def _clamp(v, lo=48, hi=96):
    return max(lo, min(hi, round(v)))

def _score_fit(p, intent, all_prices):
    """功能适配度：核心功能匹配程度"""
    base = p.match_pct
    # 命中理由数加成
    nr = len(p.reasons or [])
    reason_bonus = min(nr * 3, 12)  # 每条理由+3，上限+12
    # 品牌偏好匹配
    brand_pref = intent.get("brand") or ""
    brand_bonus = 8 if (brand_pref and brand_pref in (p.brand or "")) else 0
    # 关注点匹配
    intents = intent.get("intents") or []
    intent_str = " ".join(
        x.get("t", "") or x.get("label", "") or str(x) if isinstance(x, dict) else str(x)
        for x in intents
    ).lower()
    intent_bonus = 0
    if intent_str:
        # 从产品理由中找关注点命中
        reason_text = " ".join(p.reasons or []).lower()
        kw_hits = sum(1 for kw in ["影像","拍照","相机","续航","电池","性能","游戏","屏幕","轻薄"] if kw in intent_str and kw in reason_text)
        intent_bonus = min(kw_hits * 4, 10)
    return _clamp(base + reason_bonus + brand_bonus + intent_bonus)

def _score_perf(p, specs):
    """性能与质量：硬件参数品质"""
    s = specs or {}
    score = 60.0  # 基准分
    # 屏幕刷新率
    rr = 0
    if isinstance(s.get("refreshRate"), (int, float)):
        rr = s["refreshRate"]
    elif isinstance(s.get("screen"), dict):
        rr = s["screen"].get("refreshRate") or 0
    if rr >= 120: score += 12
    elif rr >= 90: score += 8
    elif rr >= 60: score += 4
    # RAM
    ram = 0
    ram_raw = s.get("ram", "")
    if isinstance(ram_raw, str):
        import re
        m = re.search(r'(\d+)', ram_raw)
        if m: ram = int(m.group(1))
    elif isinstance(ram_raw, int): ram = ram_raw
    if ram >= 12: score += 8
    elif ram >= 8: score += 5
    elif ram >= 6: score += 2
    # 防水
    wp = ""
    if isinstance(s.get("features"), dict):
        wp = s["features"].get("waterproof") or ""
    elif isinstance(s.get("waterproof"), str):
        wp = s["waterproof"]
    if "IP68" in wp or "ip68" in wp: score += 5
    elif "IP67" in wp or "ip67" in wp: score += 3
    # 处理器/芯片（从 tags 或 specs 推断）
    tags = s.get("tags") or []
    tag_str = " ".join(tags) if isinstance(tags, list) else str(tags)
    if any(kw in tag_str for kw in ["旗舰", "Pro", "Max", "Ultra", "高端"]): score += 6
    elif any(kw in tag_str for kw in ["性能", "游戏"]): score += 3
    # 排名加成（排名靠前通常参数更好）
    rank = getattr(p, 'rank', 99)
    if rank == 1: score += 4
    elif rank == 2: score += 2
    return _clamp(score)

def _score_value(p, budget, all_prices):
    """成本效益：价格竞争力"""
    price = p.price or 0
    scores = [x for x in all_prices if x > 0]
    if not scores or price <= 0:
        return _clamp(p.match_pct - 5)
    min_p = min(scores)
    max_p = max(scores)
    score = 65.0
    # 预算匹配
    if budget > 0:
        ratio = price / budget if budget > 0 else 999
        if ratio <= 0.7: score += 20      # 远低于预算
        elif ratio <= 0.85: score += 16   # 明显低于预算
        elif ratio <= 1.0: score += 10    # 预算内
        elif ratio <= 1.15: score += 2    # 略超
        elif ratio <= 1.3: score -= 8     # 超一些
        else: score -= 16                 # 大超
    # 同类价格竞争力
    if max_p > min_p:
        pos = (price - min_p) / (max_p - min_p) if max_p != min_p else 0.5
        score += round((1 - pos) * 12)  # 价格越低加分越多
    # 是否最低价
    if price == min_p and len(scores) > 1: score += 4
    return _clamp(score)

def _score_ux(p, specs, intent):
    """使用体验：日常操作舒适度"""
    s = specs or {}
    score = 62.0
    # 重量（手机等便携设备）
    weight = 0
    if isinstance(s.get("body"), dict):
        weight = s["body"].get("weight") or 0
    elif isinstance(s.get("weight"), (int, float)):
        weight = s["weight"]
    elif isinstance(s.get("weight"), str):
        import re
        m = re.search(r'([\d.]+)', s["weight"])
        if m: weight = float(m.group(1))
    
    prefer = (intent.get("intents") or [])
    pref_str = " ".join(
        x.get("t","") or x.get("label","") or str(x) if isinstance(x,dict) else str(x)
        for x in prefer
    ).lower()
    
    if weight > 0:
        if "轻薄" in pref_str or "轻" in pref_str:
            if weight <= 180: score += 14
            elif weight <= 200: score += 8
            elif weight <= 220: score += 2
            else: score -= 4
        elif "大屏" in pref_str or "大" in pref_str:
            # 大屏用户对重量容忍度高
            if weight <= 220: score += 6
            elif weight <= 250: score += 2
        else:
            # 无偏好，适中最好
            if weight <= 190: score += 8
            elif weight <= 220: score += 4
            elif weight <= 250: score -= 2
            else: score -= 6
    
    # 屏幕大小
    screen_size = 0
    if isinstance(s.get("screen"), dict):
        screen_size = s["screen"].get("size") or 0
    elif isinstance(s.get("size"), (int, float)):
        screen_size = s["size"]
    
    if screen_size > 0:
        if "大屏" in pref_str:
            if screen_size >= 6.7: score += 10
            elif screen_size >= 6.3: score += 5
        elif "轻薄" in pref_str or "小屏" in pref_str:
            if screen_size <= 6.2: score += 8
            elif screen_size <= 6.5: score += 3
    
    # 排名加成（第一名体验通常更优）
    if getattr(p, 'rank', 99) == 1: score += 4
    return _clamp(score)

def _score_svc(p):
    """服务与保障：品牌售后体系"""
    brand = p.brand or ""
    base = _BRAND_SVC.get(brand, _DFLT_SVC)
    # 排名第一略加分
    if getattr(p, 'rank', 99) == 1: base += 3
    return _clamp(base, 50, 92)

def _score_safe(p, specs):
    """安全与风险：隐私保护"""
    s = specs or {}
    score = 64.0
    # 品牌（iOS 通常隐私更好）
    brand = p.brand or ""
    if brand in ("苹果", "谷歌", "华为"): score += 10
    elif brand in ("三星", "小米", "荣耀"): score += 4
    # 防水 = 物理安全性
    wp = ""
    if isinstance(s.get("features"), dict):
        wp = s["features"].get("waterproof") or ""
    if "IP68" in wp: score += 4
    # 卫星通信 = 紧急安全
    if isinstance(s.get("features"), dict):
        if s["features"].get("satellite"): score += 6
    return _clamp(score, 52, 90)

def _score_future(p, specs):
    """发展与兼容性：系统更新与生态"""
    s = specs or {}
    score = 62.0
    brand = p.brand or ""
    # 系统更新支持（基于品牌历史）
    if brand in ("苹果", "谷歌"): score += 14   # 5-7年更新
    elif brand in ("华为", "三星", "荣耀"): score += 8  # 3-4年
    elif brand in ("小米", "vivo", "oppo"): score += 4  # 2-3年
    # 生态完整性
    if brand == "苹果": score += 6  # 生态最完整
    # 新机型加分
    tags = s.get("tags") or []
    tag_str = " ".join(tags) if isinstance(tags, list) else str(tags)
    if any(kw in tag_str for kw in ["AI", "新"]): score += 4
    return _clamp(score, 50, 90)


def compute_dim_scores(products, intent):
    """
    计算所有候选产品的7维度评分。
    返回 list of dict: {name, brand, model, dims:[7], weighted_total, match_pct, dim_reasons:[7]}
    """
    budget = float(intent.get("budget") or 0)
    all_prices = [(p.price or 0) for p in products]
    
    results = []
    for idx, p in enumerate(products):
        specs = p.specs or {}
        
        fit = _score_fit(p, intent, all_prices)
        perf = _score_perf(p, specs)
        value = _score_value(p, budget, all_prices)
        ux = _score_ux(p, specs, intent)
        svc = _score_svc(p)
        safe = _score_safe(p, specs)
        future = _score_future(p, specs)
        
        dims = [fit, perf, value, ux, svc, safe, future]
        wt = round(sum(d * w / 100 for d, (_, w, _) in zip(dims, _DIMS)))
        
        # 各维度理由
        reasons = [
            _fit_reason(fit, p, intent),
            _perf_reason(perf, p, specs),
            _value_reason(value, p, budget),
            _ux_reason(ux, p, specs, intent),
            _svc_reason(svc, p),
            _safe_reason(safe, p),
            _future_reason(future, p),
        ]
        
        results.append({
            "name": f"{p.brand} {p.model}",
            "brand": p.brand,
            "model": p.model,
            "dims": dims,
            "weighted_total": wt,
            "match_pct": p.match_pct,
            "dim_reasons": reasons,
        })
    return results


def _fit_reason(score, p, intent):
    if score >= 82: return f"核心功能高度匹配需求，{len(p.reasons or [])}项需求命中"
    elif score >= 72: return f"主要功能满足预期，{len(p.reasons or [])}项需求命中"
    elif score >= 62: return f"基本功能覆盖，部分需求有差距"
    return "功能适配存在差距，建议确认核心需求"

def _perf_reason(score, p, specs):
    s = specs or {}
    rr = 0
    if isinstance(s.get("refreshRate"), (int,float)): rr = s["refreshRate"]
    elif isinstance(s.get("screen"),dict): rr = s["screen"].get("refreshRate") or 0
    ram_str = str(s.get("ram",""))
    highlights = []
    if rr >= 120: highlights.append(f"{rr}Hz高刷")
    if "12" in ram_str or "16" in ram_str: highlights.append(f"{ram_str}内存")
    wp = ""
    if isinstance(s.get("features"),dict): wp = s["features"].get("waterproof") or ""
    if "IP68" in wp: highlights.append("IP68防水")
    h = "、".join(highlights) if highlights else "参数表现均衡"
    if score >= 78: return f"硬件参数表现优异（{h}）"
    elif score >= 66: return f"性能处于中上水平（{h}）"
    return f"性能表现一般（{h}）"

def _value_reason(score, p, budget):
    price = p.price or 0
    if price > 0 and budget > 0:
        rp = round(price / budget * 100)
        if rp <= 80: return f"性价比突出（¥{price}，仅预算{rp}%）"
        elif rp <= 100: return f"价格在预算内（¥{price}，{rp}%）"
        elif rp <= 130: return f"略超预算（¥{price}，{rp}%）但可接受"
        return f"超出预算较多（¥{price}，{rp}%）"
    if score >= 74: return "价格竞争力强"
    elif score >= 62: return "价格适中"
    return "价格偏高"

def _ux_reason(score, p, specs, intent):
    s = specs or {}
    weight = 0
    if isinstance(s.get("body"),dict): weight = s["body"].get("weight") or 0
    if weight: return f"{'体验出色' if score>=74 else '体验良好' if score>=64 else '体验一般'}（{weight}g）"
    return f"{'用户体验出色' if score>=74 else '体验良好' if score>=64 else '体验有提升空间'}"

def _svc_reason(score, p):
    if score >= 78: return f"{p.brand or ''}售后体系完善"
    elif score >= 66: return "售后服务基本到位"
    return "售后保障一般"

def _safe_reason(score, p):
    if score >= 74: return f"{p.brand or ''}隐私与安全性较好"
    elif score >= 62: return "安全表现尚可"
    return "需注意隐私风险"

def _future_reason(score, p):
    if score >= 74: return f"{p.brand or ''}系统更新积极，生态兼容好"
    elif score >= 62: return "生态支持基本够用"
    return "后续升级空间有限"
