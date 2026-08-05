# 智选 · 阶段二 AI 后端（LLM 意图理解）

把用户的自然语言需求，用**大模型**翻译成结构化选购意图 JSON，再交给前端原有的加权打分引擎排序。

> 这是「规则引擎 → LLM 意图理解 → RAG 知识库」三阶段演进中的**第二阶段**。
> 大模型只负责「听懂人话」，推荐排序仍由确定性引擎完成 —— 结果可解释、可复现。

---

## 一、3 分钟申请一个免费 Key（推荐 DeepSeek）

1. 打开 <https://platform.deepseek.com> 注册登录（支持手机号）。
2. 左侧「API keys」→「创建 API key」，复制出来的 `sk-xxxx`。
3. 新用户通常有免费额度，解析一次请求只消耗几百 token，基本花不到钱。

> 也可以换通义千问 / Kimi / 智谱 / OpenAI，任选其一，见 `.env.example` 里的注释。

---

## 二、启动后端（3 步）

```bash
cd server

# 1) 建虚拟环境并装依赖
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

# 2) 配置 Key：复制模板，填入你的 sk-xxxx
cp .env.example .env
#   然后编辑 .env，把 LLM_API_KEY 改成你的真实 Key

# 3) 启动
./venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

看到 `Uvicorn running on http://127.0.0.1:8000` 就成功了。

自检：
```bash
curl http://127.0.0.1:8000/api/health
# 配好 Key 会返回 {"ok":true,"engine":"llm","model":"deepseek-chat"}
```

---

## 三、和前端联调

1. 后端保持运行（上面第 3 步）。
2. 浏览器打开项目根目录的 `index.html`。
3. 在首页「AI 帮我选」输入框里说人话，例如：
   - `给爸妈买个手机，预算两千，字要大、拍照清楚`
   - `打游戏不卡的，五千以内`
4. 结果弹窗顶部会显示 **☁️ 云端大模型** 徽章，代表本次意图是大模型解析的。

**关掉后端会怎样？** 前端 8 秒超时后自动降级，徽章变成 **⚡ 本地规则引擎**，功能照常可用 —— 这就是「优雅降级」，也是面试亮点。

---

## 四、接口说明

`POST /api/parse`
```json
// 请求
{ "query": "预算五千打游戏不卡", "category": "phone" }

// 返回
{
  "ok": true,
  "engine": "llm",
  "model": "deepseek-chat",
  "latency_ms": 820,
  "intent": {
    "budget": 5000,
    "brand": null,
    "intents": ["性能强"],
    "user": "游戏玩家"
  }
}
```

`GET /api/health` — 健康检查，前端用它判断后端是否可用、是否配了 Key。

---

## 五、面试怎么讲（核心话术）

**面试官问：你这个 AI 是真的大模型吗？**
> 是。我用了「LLM 做意图理解 + 确定性引擎做排序」的分层架构。大模型只干它最擅长的事——把用户模糊口语翻译成结构化字段；推荐排序交给可解释的打分引擎。这样既有大模型的理解力，又保证结果可复现、可审计，不会「幻觉」出不存在的商品。

**面试官问：为什么不全用大模型直接推荐？**
> 三个原因：① 成本，每次全量推荐要把几百款产品塞进上下文，token 贵且慢；② 可解释性，纯大模型推荐说不清"为什么是它"，而打分引擎每一分都有依据；③ 可控性，业务规则（预算硬约束、库存）用代码写死更可靠。这是典型的「LLM 负责理解，代码负责决策」工程范式。

**面试官问：Key 放哪？安全吗？**
> Key 只存在后端环境变量，`.env` 加入 `.gitignore` 绝不进仓库，前端永远拿不到。前端只调自己的后端接口，杜绝了 Key 泄露被盗刷的风险。

**面试官问：后端挂了怎么办？**
> 前端有 8 秒超时 + 自动降级，后端不可用时无缝回退到本地规则引擎，用户无感。核心功能永远可用，大模型是「增强」而非「依赖」。

**下一步（阶段三）：** 接入 RAG，把真实评测/参数手册/用户口碑灌进向量库，让「为什么推荐它」的解释带上可溯源的引用，解决大模型幻觉问题。

---

## 六、京东联盟价格刷新（新增）

### 6.1 能力

通过京东联盟开放 API 实时查询商品价格和主图，批量回写到 `data-*.js` 的 `prices.jd` 字段。

### 6.2 申请 Key

1. 打开 [京东联盟开放平台](https://union.jd.com/openplatform/) 注册登录
2. 左侧「应用管理」→「创建应用」，拿到 **app_key** 和 **app_secret**
3. 申请接口权限：`jd.union.open.goods.query`（商品搜索）+ `jd.union.open.promotiongoodsinfo.query`（商品详情）
4. 复制 `.env.example` 为 `.env`，填入凭据

```bash
cd server
cp .env.example .env
# 编辑 .env，填入 JD_APP_KEY / JD_APP_SECRET / JD_SITE_ID
```

### 6.3 使用

```bash
# 预览模式（只看差异不写入）
python refresh_prices.py --dry-run

# 刷新全部品类
python refresh_prices.py

# 只刷新手机
python refresh_prices.py --only phone-data.js

# 单个产品测试
python jd_client.py search "iPhone 16 Pro"
python jd_client.py detail 100065474274
python jd_client.py refresh 苹果 iPhone 16 Pro
```

### 6.4 注意事项

- 调用频率限制：默认每款间隔 0.5s（`--delay` 可调）
- 价格为京东到手价参考值，拼多多价格暂无法自动刷新（保持原值）
- 无 Key 时脚本会报错提示，不影响前端正常使用（前端有优雅降级）

### 6.5 文件说明

| 文件 | 职责 |
|------|------|
| `jd_client.py` | 京东联盟 API 客户端（签名/搜索/详情/单款刷新） |
| `refresh_prices.py` | 批量价格刷新脚本（遍历 data-*.js → API → 回写） |
