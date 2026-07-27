"""
智选 · 阶段二 AI 后端
=====================
职责：把用户的自然语言需求，用大模型翻译成「结构化选购意图 JSON」，
再交给前端原有的加权打分引擎去排序。

设计要点（面试可讲）：
1. 大模型只负责「听懂人话」这一层（意图理解），不负责推荐排序，
   排序仍由确定性的打分引擎完成 —— 结果可解释、可复现。
2. API Key 只存在于后端环境变量，绝不下发到前端，避免被盗刷。
3. 兼容 OpenAI 接口协议，换模型只改 BASE_URL/MODEL 两个变量，
   DeepSeek / 通义 / Kimi / 智谱 / OpenAI 都能直接用。
4. 输出的意图名严格约束在前端已支持的枚举内，保证前后端契约一致。
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
from openai import OpenAI

# ---------------------------------------------------------------------------
# 配置：全部走环境变量，改模型只需改 .env
# ---------------------------------------------------------------------------
API_KEY = os.getenv("LLM_API_KEY", "")
BASE_URL = os.getenv("LLM_BASE_URL", "https://api.deepseek.com/v1")
MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

client = OpenAI(api_key=API_KEY, base_url=BASE_URL) if API_KEY else None

# 每个品类允许的意图关键词，必须与前端 AI_INTENTS 的 label 对齐
CATEGORY_INTENTS = {
    "phone":    ["影像强", "续航强", "轻薄", "大屏", "性能强", "性价比", "自拍好"],
    "gpu":      ["4K/光追", "大显存", "高性能", "低功耗", "性价比"],
    "cpu":      ["高性能", "日常够用", "低功耗"],
    "laptop":   ["轻薄", "性能强", "续航久", "性价比"],
    "ac":       ["卧室/静音", "客厅/大风量", "省电节能"],
    "robot":    ["全能基站", "大吸力", "智能避障"],
    "earphone": ["主动降噪", "续航久", "音质好", "运动防水"],
    "monitor":  ["高刷电竞", "4K/色准", "大屏", "性价比"],
}

CATEGORY_CN = {
    "phone": "手机", "gpu": "显卡", "cpu": "CPU", "laptop": "笔记本",
    "ac": "空调", "robot": "扫地机器人", "earphone": "耳机", "monitor": "显示器",
}


def build_prompt(query: str, category: str):
    """构造给大模型的系统提示 + 用户提示。"""
    intents = CATEGORY_INTENTS.get(category, [])
    cat_cn = CATEGORY_CN.get(category, "电子产品")
    system = (
        "你是一个专业的电子产品选购需求解析引擎。"
        "用户会用口语描述购买" + cat_cn + "的需求，"
        "你要把它翻译成严格的 JSON，供下游打分引擎使用。\n"
        "输出字段：\n"
        '- budget: 数字或 null，用户预算上限（单位：元）。“五千”→5000，“1万”→10000，没提到则 null。\n'
        '- brand: 字符串或 null，用户明确指定的品牌名，没提到则 null。\n'
        '- intents: 字符串数组，只能从以下枚举里选，可多选也可为空：'
        + str(intents) + "。\n"
        '- user: 字符串或 null，使用人群（如“老人”“学生”“游戏玩家”），没提到则 null。\n'
        "把用户模糊表达映射到最贴切的意图，例如“给爸妈用、字大点”→[\"大屏\"]，"
        "“打游戏不卡”→[\"性能强\"]，“便宜够用”→[\"性价比\"]。\n"
        "只输出 JSON，不要任何解释文字、不要 markdown 代码块。"
    )
    user = "用户需求：" + query
    return system, user


app = FastAPI(title="智选 AI 选购后端", version="2.0")

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

    system, user = build_prompt(req.query, req.category)
    t0 = time.time()
    try:
        resp = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        raw = resp.choices[0].message.content.strip()
        parsed = json.loads(raw)
    except Exception as e:
        return {
            "ok": False,
            "engine": "llm_error",
            "message": "大模型调用失败：" + str(e) + "，前端请降级到本地规则解析。",
        }

    # 清洗：意图只保留合法枚举，预算转数字
    allowed = set(CATEGORY_INTENTS.get(req.category, []))
    intents = [i for i in (parsed.get("intents") or []) if i in allowed]
    budget = parsed.get("budget")
    if isinstance(budget, str):
        digits = "".join(ch for ch in budget if ch.isdigit())
        budget = int(digits) if digits else None

    return {
        "ok": True,
        "engine": "llm",
        "model": MODEL,
        "latency_ms": int((time.time() - t0) * 1000),
        "intent": {
            "budget": budget,
            "brand": parsed.get("brand") or None,
            "intents": intents,
            "user": parsed.get("user") or None,
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
