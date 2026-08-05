"""
智选 · 阶段三 AI 后端（增强版）
=====================================
职责：
1. /api/parse   — 自然语言 → 结构化意图 JSON（阶段二，保留）
2. /api/recommend — 打分结果 + 用户需求 → 大模型生成个性化推荐内容（阶段三新增）
3. /api/followup — 多轮追问 → 大模型实时回答（阶段三新增）

架构设计（面试可讲）：
- 打分排序仍由前端确定性引擎完成，大模型不参与排序决策
- 大模型负责「解释层」：把冷冰冰的参数分数翻译成有温度的选购建议
- 三层降级：LLM 不可用 → 模板化理由（现有行为）→ 纯本地规则
- Token 经济：只发送产品摘要（品牌+型号+价格+核心参数），不发全量数据
"""

import os
import json
import time

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from openai import OpenAI

# ---------------------------------------------------------------------------
# 配置
# ---------------------------------------------------------------------------
API_KEY = os.getenv("LLM_API_KEY", "")
BASE_URL = os.getenv("LLM_BASE_URL", "https://api.deepseek.com/v1")
MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

client = OpenAI(api_key=API_KEY, base_url=BASE_URL) if API_KEY else None

# 每个品类允许的意图关键词，必须与前端 AI_INTENTS 的 label 严格对齐（13 类全量）
CATEGORY_INTENTS = {
    "phone":    ["影像强", "续航强", "轻薄", "大屏", "性能强", "性价比", "自拍好"],
    "gpu":      ["4K/光追", "大显存", "高性能", "低功耗", "性价比"],
    "cpu":      ["高性能", "日常够用", "低功耗"],
    "laptop":   ["轻薄", "性能强", "续航久", "性价比"],
    "ac":       ["卧室/静音", "客厅/大风量", "省电节能"],
    "robot":    ["全能基站", "大吸力", "智能避障"],
    "earphone": ["主动降噪", "续航久", "音质好", "运动防水"],
    "monitor":  ["高刷电竞", "4K/色准", "大屏", "性价比"],
    "tablet":   ["影音娱乐", "轻办公", "性能强", "续航久"],
    "camera":   ["全画幅", "视频利器", "防抖好", "入门友好"],
    "tv":       ["画质好", "高刷游戏", "大屏", "性价比"],
    "watch":    ["续航久", "运动健康", "生态联动"],
    "keyboard": ["客制化", "办公静音", "性价比"],
}

CATEGORY_CN = {
    "phone": "手机", "gpu": "显卡", "cpu": "CPU", "laptop": "笔记本",
    "ac": "空调", "robot": "扫地机器人", "earphone": "耳机", "monitor": "显示器",
    "tablet": "平板", "camera": "相机", "tv": "电视", "watch": "手表", "keyboard": "键盘",
}

# 品牌口语别名 -> 标准品牌名（避免「果子/菊花/蓝厂」等进不了前端 brands 白名单）
BRAND_ALIASES = {
    "果子": "苹果", "iphone": "苹果", "ipad": "苹果",
    "菊花": "华为", "菊厂": "华为", "遥遥领先": "华为",
    "米": "小米", "小米": "小米", "红米": "小米", "粗粮": "小米",
    "蓝厂": "vivo", "绿厂": "OPPO", "OV": "OPPO",
    "星": "三星", "三星": "三星", "samsung": "三星",
    "索尼": "索尼", "sony": "索尼", "大法": "索尼",
}


def _call_llm(system: str, user: str, temperature: float = 0.7) -> Optional[str]:
    """统一调用大模型，返回文本内容。失败返回 None。"""
    if not client:
        return None
    try:
        resp = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=temperature,
        )
        return resp.choices[0].message.content.strip()
    except Exception:
        return None


def _call_llm_json(system: str, user: str) -> Optional[Dict]:
    """调用大模型并解析 JSON 输出。失败返回 None。"""
    if not client:
        return None
    try:
        resp = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw = resp.choices[0].message.content.strip()
        # 容错：去掉可能的 markdown 代码块包裹
        if raw.startswith("```"):
            lines = raw.split("\n")
            raw = "\n".join(l for l in lines if not l.startswith("```"))
        return json.loads(raw)
    except Exception:
        return None


# ==================== 阶段二：意图解析（保留不变）====================

def build_prompt(query: str, category: str):
    """构造给大模型的系统提示 + 用户提示。"""
    intents = CATEGORY_INTENTS.get(category, [])
    cat_cn = CATEGORY_CN.get(category, "电子产品")
    system = (
        "你是一个专业的电子产品选购需求解析引擎。"
        "用户会用口语描述购买" + cat_cn + "的需求，"
        "你要把它翻译成严格的 JSON，供下游打分引擎使用。\n"
        "输出字段：\n"
        "- budget: 整数或 null，必须是「纯整数、单位为元」的预算上限。换算规则：\n"
        "  · 万级：\"一万\"→10000，\"1万5/一万五\"→15000，\"两万\"→20000\n"
        "  · 千级：\"五千\"→5000，\"三四千\"→3500(取中值)，\"五六千\"→5500\n"
        "  · 带约/左右/大概：\"五千左右\"→5000，\"1万出头\"→11000\n"
        "  · 区间取上限：\"5000到6000\"→6000，\"5000内\"→5000\n"
        "  · 绝对不要输出\"1.5万\"\"约5000\"这种带单位或小数点的字符串，一律换算成纯整数元。\n"
        "  · 没提到预算则 null。\n"
        "- brand: 字符串或 null，用户明确指定的品牌（用标准名：苹果/华为/小米/OPPO/vivo/三星/索尼…）。\n"
        "  口语别名需归一：\"果子/iphone\"→苹果，\"菊花/菊厂\"→华为，\"米/粗粮\"→小米，"
        "\"蓝厂\"→vivo，\"绿厂\"→OPPO，\"三星/星\"→三星，\"索尼/大法\"→索尼。没提到则 null。\n"
        "- intents: 字符串数组，只能从以下枚举里选，可多选也可为空："
        + str(intents) + "。\n"
        "  把用户模糊表达映射到最贴切的意图：\n"
        "  · \"给爸妈用、字大点/看剧\"→[\"大屏\"]，\"打游戏不卡/电竞\"→[\"性能强\"]，\"便宜够用\"→[\"性价比\"]\n"
        "  · \"拍照好/拍娃/人像\"→[\"影像强\"]，\"轻/薄/单手\"→[\"轻薄\"]，\"续航一天/不焦虑\"→[\"续航强\"]\n"
        "  · \"追剧/看视频\"→[\"影音娱乐\"]，\"入门练手/学生\"→[\"入门友好\"]，\"运动/跑步\"→[\"运动健康\"]\n"
        "  · 若用户只说品类没说偏好，intents 可为空数组[]，不要硬凑。\n"
        "- user: 字符串或 null，使用人群（如\"女朋友\"\"老人\"\"学生\"\"游戏玩家\"），没提到则 null。\n"
        "只输出 JSON，不要任何解释文字、不要 markdown 代码块、不要外层花括号以外的字符。"
    )
    user_msg = "用户需求：" + query
    return system, user_msg


app = FastAPI(title="智选 AI 选购后端", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ParseRequest(BaseModel):
    query: str
    category: str = "phone"


@app.get("/api/health")
def health():
    """健康检查：前端用它判断后端是否可用、是否配了 Key。"""
    return {
        "ok": True,
        "engine": "llm" if client else "no_key",
        "model": MODEL if client else None,
    }


@app.post("/api/parse")
def parse(req: ParseRequest):
    """核心接口：自然语言 -> 结构化选购意图 JSON。"""
    if not client:
        return {
            "ok": False,
            "engine": "no_key",
            "message": "后端未配置 LLM_API_KEY，前端请降级到本地规则解析。",
        }

    system, user_msg = build_prompt(req.query, req.category)
    t0 = time.time()
    try:
        parsed = _call_llm_json(system, user_msg)
        if not parsed:
            raise ValueError("LLM 返回空")
    except Exception as e:
        return {
            "ok": False,
            "engine": "llm_error",
            "message": "大模型调用失败：" + str(e) + "，前端请降级到本地规则解析。",
        }

    allowed = set(CATEGORY_INTENTS.get(req.category, []))
    intents = [i for i in (parsed.get("intents") or []) if i in allowed]
    budget = parsed.get("budget")
    if isinstance(budget, str):
        digits = "".join(ch for ch in budget if ch.isdigit())
        budget = int(digits) if digits else None
    elif isinstance(budget, float):
        budget = int(budget)

    raw_brand = (parsed.get("brand") or "").strip()
    brand = BRAND_ALIASES.get(raw_brand, raw_brand) or None

    return {
        "ok": True,
        "engine": "llm",
        "model": MODEL,
        "latency_ms": int((time.time() - t0) * 1000),
        "intent": {
            "budget": budget,
            "brand": brand,
            "intents": intents,
            "user": parsed.get("user") or None,
        },
    }


# ==================== 阶段三：AI 推荐内容生成 ====================

class ProductSummary(BaseModel):
    """前端传来的产品摘要（精简，省 token）。"""
    rank: int                    # 排名 1/2/3
    brand: str
    model: str
    price: float
    score: int                   # 打分引擎给的原始分
    match_pct: int               # 归一化匹配度百分比
    reasons: List[str]           # 引擎给出的匹配原因
    tradeoffs: List[str]         # 引擎指出的取舍项
    specs: Optional[Dict[str, Any]] = None   # 核心参数（可选）


class RecommendRequest(BaseModel):
    query: str                   # 用户原始输入
    category: str                # 品类标识
    intent: Dict[str, Any]       # 解析后的意图 {budget, brand, intents, user}
    products: List[ProductSummary]  # Top N 产品摘要（已按分数排序）


@app.post("/api/recommend")
def recommend(req: RecommendRequest):
    """
    阶段三核心：根据用户需求 + 打分结果，让大模型生成个性化推荐内容。

    返回：
    - reason:     针对 Top1 的个性化推荐理由（2-3 句话，结合用户具体需求）
    - comparison: Top 候选之间的对比分析（各有什么优势、适合什么场景）
    - advice:     决策建议（含避坑提醒、是否值得加预算等）
    - summary:    一句话总结
    """
    if not client:
        return {"ok": False, "engine": "no_key"}

    cat_cn = CATEGORY_CN.get(req.category, "电子产品")
    products_text = "\n".join(
        f"第{p.rank}名：{p.brand} {p.model}（¥{p.price}，匹配度{p.match_pct}%）"
        + (f"\n  匹配原因：{'、'.join(p.reasons)}" if p.reasons else "")
        + (f"\n  取舍注意：{'；'.join(p.tradeoffs)}" if p.tradeoffs else "")
        + (f"\n  参数：{json.dumps(p.specs, ensure_ascii=False)}" if p.specs else "")
        for p in req.products
    )

    intent_parts = []
    if req.intent.get("budget"):
        intent_parts.append(f"预算约 ¥{req.intent['budget']}")
    if req.intent.get("brand"):
        intent_parts.append(f"偏好品牌：{req.intent['brand']}")
    if req.intent.get("intents"):
        intent_parts.append(f"关注点：{'、'.join(req.intent['intents'])}")
    if req.intent.get("user"):
        intent_parts.append(f"使用人群：{req.intent['user']}")
    intent_str = "；".join(intent_parts) if intent_parts else "未提供具体条件"

    system = (
        "你是一位经验丰富的" + cat_cn + "选购顾问，擅长把技术参数翻译成普通人能懂的购买建议。\n"
        "你的风格：专业但不晦涩，有观点但客观，会给出明确的倾向性建议同时说明理由。\n"
        "你会收到用户的原始需求、解析出的意图、以及打分引擎排好的 Top 候选产品（含参考价、匹配度、参数）。\n"
        "请基于这些信息，输出严格 JSON 格式的推荐内容。\n\n"
        "输出字段：\n"
        '{\n'
        '  "reason": "针对第1名产品的个性化推荐理由，2-3句话。必须正面回应用户明确说出的关注点'
        "（例如用户要\"影像强\"就必须讲相机/传感器/长焦，要\"续航久\"就讲电池/能耗），"
        "用产品真实参数佐证为什么它最适合 TA，禁止泛泛而谈或套模板。如果用户没说关注点，则围绕预算与综合优势说明。\",\n"
        '  "comparison": "逐一点评 Top 候选：每款一句话说清核心优势 + 最适合哪类人群/场景，要公平，'
        "不盲目捧第一名，也要说清第二名、第三名对什么人更划算。\",\n"
        '  "advice": "2-3条可落地的决策建议，必须包含：'
        "①Top1 是否在用户预算内（超预算要明确提醒并给更便宜的替代）；"
        "②避坑与隐性开销（如配件/耗材/安装费，尽量给具体金额或比例）；"
        "③预算可上可下时怎么调（如加XXX元上更大存储/降到某档更值）。\",\n"
        '  "summary": "一句话总结推荐结论，像朋友给建议那样自然，带一点倾向性。"\n'
        "}\n\n"
        "硬性要求：\n"
        "- reason 必须点名用户的具体需求关键词，不可出现\"这款综合表现优秀\"这类空话。\n"
        "- 若产品带参数(specs)，用参数支撑观点，不要编造未提供的参数。\n"
        "- comparison 中每个候选都要落到\"适合谁\"，不要只堆参数。\n"
        "- advice 必须出现具体金额或比例（如\"+300 上 256G\"\"支架约 150 元\"）。\n"
        "- 全部中文，语气亲切专业；只输出 JSON，不要 markdown 代码块、不要多余字符。"
    )

    user_msg = (
        f"用户原始需求：{req.query}\n"
        f"品类：{cat_cn}\n"
        f"解析出的意图：{intent_str}\n\n"
        f"打分引擎排序结果：\n{products_text}\n\n"
        "请基于以上信息生成推荐内容。"
    )

    t0 = time.time()
    result = _call_llm_json(system, user_msg)

    if not result:
        return {
            "ok": False,
            "engine": "llm_error",
            "message": "推荐内容生成失败，前端请使用模板化推荐理由。",
        }

    return {
        "ok": True,
        "engine": "llm",
        "model": MODEL,
        "latency_ms": int((time.time() - t0) * 1000),
        "recommendation": {
            "reason": result.get("reason", ""),
            "comparison": result.get("comparison", ""),
            "advice": result.get("advice", ""),
            "summary": result.get("summary", ""),
        },
    }


# ==================== 阶段三：多轮追问 ====================

class FollowUpRequest(BaseModel):
    query: str                       # 用户原始需求
    category: str                    # 品类
    followup_question: str           # 追问内容
    conversation_history: List[Dict[str, str]]  # [{role:"user"/"assistant", content:"..."}]
    context_products: List[ProductSummary]  # 当前推荐的产品上下文


@app.post("/api/followup")
def followup(req: FollowUpRequest):
    """
    多轮追问：用户对推荐结果提出进一步问题。
    """
    if not client:
        return {"ok": False, "engine": "no_key"}

    cat_cn = CATEGORY_CN.get(req.category, "电子产品")

    # 构建对话历史
    messages = [
        {
            "role": "system",
            "content": (
                f"你是「智选」" + cat_cn + "选购助手。用户正在挑选" + cat_cn + "，"
                "你已经给出了初步推荐，现在用户在追问。\n"
                "你的回答原则：\n"
                "1. 基于产品事实回答，不要编造参数\n"
                "2. 如果问题涉及你没掌握的信息，诚实说明\n"
                "3. 保持简洁，2-4句话说清\n"
                "4. 可以主动引导用户关注关键决策因素\n"
                "5. 用中文，语气友好专业"
            ),
        }
    ]

    # 加入历史对话（最近 6 轮，控制 token）
    for turn in req.conversation_history[-6:]:
        messages.append({"role": turn["role"], "content": turn["content"]})

    # 加入当前产品上下文
    if req.context_products:
        prod_ctx = "当前推荐的产品：\n" + "\n".join(
            f"- {p.brand} {p.model}（¥{p.price}）"
            + (f"：{'、'.join(p.reasons)}" if p.reasons else "")
            for p in req.context_products[:3]
        )
        messages.append({
            "role": "system",
            "content": prod_ctx,
        })

    # 加入当前追问
    messages.append({"role": "user", "content": req.followup_question})

    t0 = time.time()
    answer = _call_llm(
        system="你是智选购顾问，基于已有推荐回答用户追问。保持简洁实用。",
        user=req.followup_question,
        temperature=0.6,
    )

    if not answer:
        return {
            "ok": False,
            "engine": "llm_error",
            "message": "追问回答生成失败。",
        }

    return {
        "ok": True,
        "engine": "llm",
        "model": MODEL,
        "latency_ms": int((time.time() - t0) * 1000),
        "answer": answer,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
