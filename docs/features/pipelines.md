---
title: Pipelines 與 Functions 生態系
description: 深入了解 OpenClaw 的 Pipelines 框架與 Functions/Tools 擴充生態系統
sidebar_position: 1
keywords: [OpenClaw, Pipelines, Functions, Tools, 擴充, 外掛]
---

# Pipelines 與 Functions 生態系

OpenClaw 的 **Pipelines** 是一套通用、與 UI 無關的 **OpenAI API 相容外掛框架**，讓你能以模組化的方式擴充 AI 工作流程。搭配 **Functions** 與 **Tools** 生態系，你可以打造從簡單的訊息過濾器到完整的 RAG 系統，而無需修改核心程式碼。

---

## 總體架構

```
使用者請求
    │
    ▼
┌──────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                   │
│  ┌────────────────────────────────────────────────┐  │
│  │              Pipeline Router                    │  │
│  │  根據 URL 路徑 / 模型名稱路由到對應 Pipeline     │  │
│  └───────────┬──────────────┬──────────────┬──────┘  │
│              │              │              │          │
│       ┌──────▼──────┐ ┌────▼────┐ ┌───────▼───────┐ │
│       │  Inlet      │ │ Pipeline│ │   Outlet      │ │
│       │  Filters    │ │  Core   │ │   Filters     │ │
│       │ (前處理)    │ │ (主邏輯)│ │  (後處理)     │ │
│       └──────┬──────┘ └────┬────┘ └───────┬───────┘ │
│              │              │              │          │
│              └──────────────┼──────────────┘          │
│                             │                        │
│  ┌──────────────────────────▼─────────────────────┐  │
│  │              Functions & Tools Registry         │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐          │  │
│  │  │ Tools   │ │Functions│ │ Valves  │          │  │
│  │  │ (541+)  │ │ (276+) │ │ (設定)  │          │  │
│  │  └─────────┘ └─────────┘ └─────────┘          │  │
│  └────────────────────────────────────────────────┘  │
│                             │                        │
│                      ┌──────▼──────┐                 │
│                      │   LLM API   │                 │
│                      │  (OpenAI    │                 │
│                      │  相容格式)   │                 │
│                      └─────────────┘                 │
└──────────────────────────────────────────────────────┘
```

---

## 什麼是 Pipeline?

Pipeline 是一個獨立的 Python 模組，實作了 OpenAI Chat Completions API 介面。每個 Pipeline 可以攔截、修改、或完全替換 AI 的請求與回應流程。

### 核心特性

| 特性 | 說明 |
|------|------|
| **OpenAI API 相容** | 對外暴露標準的 `/v1/chat/completions` 端點 |
| **UI 無關** | 可搭配任何支援 OpenAI API 的前端使用 |
| **可串聯** | 多個 Pipeline 可組合成處理鏈 |
| **熱插拔** | 無需重啟即可新增或移除 Pipeline |
| **Valve 設定** | 透過 Valves 機制進行動態參數設定 |

### Pipeline 處理流程

```
使用者訊息
    │
    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Inlet Filter│────▶│  Pipeline   │────▶│Outlet Filter│
│ (前處理)    │     │  (核心邏輯)  │     │ (後處理)    │
│             │     │             │     │             │
│ - 輸入驗證  │     │ - LLM 呼叫  │     │ - 格式轉換  │
│ - 速率限制  │     │ - RAG 檢索  │     │ - 日誌記錄  │
│ - 毒性偵測  │     │ - 工具呼叫  │     │ - 翻譯處理  │
│ - 權限檢查  │     │ - 自訂邏輯  │     │ - 快取儲存  │
└─────────────┘     └─────────────┘     └─────────────┘
    │                                        │
    │          Valves (動態設定)               │
    │  ┌──────────────────────────────┐      │
    └──│ API Keys、閾值、開關、模型選擇 │──────┘
       └──────────────────────────────┘
```

---

## Pipeline 類型

### 1. Function Calling Pipeline

讓不支援原生 Function Calling 的模型也能使用工具呼叫：

```python
"""
title: Function Calling Pipeline
author: openclaw-community
version: 1.0.0
license: MIT
"""

from typing import List, Optional
from pydantic import BaseModel
import json


class Pipeline:
    """為任何模型加入 Function Calling 能力。"""

    class Valves(BaseModel):
        """可透過 UI 調整的設定參數。"""
        OPENAI_API_KEY: str = ""
        MODEL_ID: str = "gpt-4o"
        MAX_FUNCTION_CALLS: int = 5

    def __init__(self):
        self.name = "Function Calling Pipeline"
        self.valves = self.Valves()
        self.tools = []

    async def on_startup(self):
        """Pipeline 啟動時載入可用工具。"""
        print(f"[{self.name}] 正在載入工具定義...")
        self.tools = await self._load_tool_definitions()

    async def on_shutdown(self):
        """Pipeline 關閉時清理資源。"""
        print(f"[{self.name}] 正在清理資源...")

    def pipe(self, user_message: str, model_id: str,
             messages: List[dict], body: dict) -> str:
        """
        主處理函式。
        攔截使用者訊息，注入工具定義，並處理 function call 回應。
        """
        # 注入工具定義
        body["tools"] = self.tools
        body["tool_choice"] = "auto"

        # 呼叫 LLM
        response = self._call_llm(messages, body)

        # 處理 function call 結果
        call_count = 0
        while (response.get("tool_calls")
               and call_count < self.valves.MAX_FUNCTION_CALLS):
            for tool_call in response["tool_calls"]:
                result = self._execute_tool(tool_call)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call["id"],
                    "content": json.dumps(result, ensure_ascii=False)
                })
            response = self._call_llm(messages, body)
            call_count += 1

        return response["content"]

    def _call_llm(self, messages, body):
        """呼叫 LLM API。"""
        import openai
        client = openai.OpenAI(api_key=self.valves.OPENAI_API_KEY)
        resp = client.chat.completions.create(
            model=self.valves.MODEL_ID,
            messages=messages,
            tools=body.get("tools"),
            tool_choice=body.get("tool_choice")
        )
        return resp.choices[0].message.model_dump()

    def _execute_tool(self, tool_call):
        """執行工具呼叫並回傳結果。"""
        func_name = tool_call["function"]["name"]
        func_args = json.loads(tool_call["function"]["arguments"])
        # 在實際環境中，此處會路由到對應的工具執行器
        return {"result": f"已執行 {func_name}，參數：{func_args}"}

    async def _load_tool_definitions(self):
        """從 Registry 載入工具定義。"""
        return [
            {
                "type": "function",
                "function": {
                    "name": "web_search",
                    "description": "搜尋網路上的資訊",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "搜尋關鍵字"}
                        },
                        "required": ["query"]
                    }
                }
            }
        ]
```

### 2. Custom RAG Pipeline

自訂的 RAG（Retrieval-Augmented Generation）Pipeline，整合向量資料庫進行知識檢索：

```python
"""
title: Custom RAG Pipeline
author: openclaw-community
version: 2.1.0
license: MIT
"""

from typing import List, Generator
from pydantic import BaseModel


class Pipeline:
    """基於 ChromaDB 的自訂 RAG Pipeline。"""

    class Valves(BaseModel):
        CHROMADB_HOST: str = "http://localhost:8000"
        COLLECTION_NAME: str = "knowledge_base"
        TOP_K: int = 5
        SIMILARITY_THRESHOLD: float = 0.7
        OPENAI_API_KEY: str = ""

    def __init__(self):
        self.name = "Custom RAG Pipeline"
        self.valves = self.Valves()
        self.chromadb_client = None

    async def on_startup(self):
        """連接 ChromaDB。"""
        import chromadb
        self.chromadb_client = chromadb.HttpClient(
            host=self.valves.CHROMADB_HOST
        )
        print(f"[RAG] 已連接到 ChromaDB: {self.valves.CHROMADB_HOST}")

    def pipe(self, user_message: str, model_id: str,
             messages: List[dict], body: dict) -> Generator:
        """
        RAG 處理流程：
        1. 將使用者問題向量化
        2. 在 ChromaDB 中搜尋相關文件
        3. 將檢索結果注入上下文
        4. 呼叫 LLM 生成回答
        """
        # 步驟 1 & 2：檢索相關文件
        collection = self.chromadb_client.get_collection(
            self.valves.COLLECTION_NAME
        )
        results = collection.query(
            query_texts=[user_message],
            n_results=self.valves.TOP_K
        )

        # 步驟 3：過濾低相關性結果並組裝上下文
        context_docs = []
        for doc, distance in zip(
            results["documents"][0], results["distances"][0]
        ):
            if distance <= self.valves.SIMILARITY_THRESHOLD:
                context_docs.append(doc)

        context = "\n---\n".join(context_docs)

        # 步驟 4：注入系統提示並呼叫 LLM
        rag_system_prompt = f"""你是一個知識問答助理。請根據以下參考資料回答問題。
如果參考資料中沒有相關資訊，請誠實告知。

## 參考資料
{context}
"""
        augmented_messages = [
            {"role": "system", "content": rag_system_prompt},
            *messages
        ]

        import openai
        client = openai.OpenAI(api_key=self.valves.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=model_id,
            messages=augmented_messages,
            stream=True
        )

        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
```

### 3. Message Monitoring Pipeline (Langfuse)

將所有對話記錄送往 Langfuse 進行可觀測性追蹤：

```python
"""
title: Langfuse Monitoring Pipeline
author: openclaw-community
version: 1.3.0
license: MIT
"""

from typing import List, Optional
from pydantic import BaseModel
import time


class Pipeline:
    """整合 Langfuse 的訊息監控 Pipeline。"""

    class Valves(BaseModel):
        LANGFUSE_PUBLIC_KEY: str = ""
        LANGFUSE_SECRET_KEY: str = ""
        LANGFUSE_HOST: str = "https://cloud.langfuse.com"
        TRACE_NAME: str = "openclaw-chat"
        ENABLE_COST_TRACKING: bool = True

    def __init__(self):
        self.name = "Langfuse Monitor"
        self.valves = self.Valves()
        self.langfuse = None

    async def on_startup(self):
        from langfuse import Langfuse
        self.langfuse = Langfuse(
            public_key=self.valves.LANGFUSE_PUBLIC_KEY,
            secret_key=self.valves.LANGFUSE_SECRET_KEY,
            host=self.valves.LANGFUSE_HOST
        )

    def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        """在訊息進入前記錄 trace。"""
        trace = self.langfuse.trace(
            name=self.valves.TRACE_NAME,
            user_id=user.get("id", "anonymous") if user else "anonymous",
            metadata={
                "model": body.get("model"),
                "message_count": len(body.get("messages", []))
            }
        )
        body["_langfuse_trace_id"] = trace.id
        return body

    def outlet(self, body: dict, user: Optional[dict] = None) -> dict:
        """在回應送出後記錄完成資訊。"""
        trace_id = body.get("_langfuse_trace_id")
        if trace_id and self.langfuse:
            self.langfuse.score(
                trace_id=trace_id,
                name="completion",
                value=1.0,
                comment="成功完成回應"
            )
        return body

    async def on_shutdown(self):
        if self.langfuse:
            self.langfuse.flush()
```

### 4. Rate Limit Filter

基於使用者或 API Key 的速率限制過濾器：

```python
"""
title: Rate Limit Filter
author: openclaw-community
version: 1.0.0
license: MIT
"""

from typing import Optional
from pydantic import BaseModel
import time
from collections import defaultdict


class Pipeline:
    """使用滑動視窗演算法的速率限制 Filter Pipeline。"""

    class Valves(BaseModel):
        REQUESTS_PER_MINUTE: int = 20
        REQUESTS_PER_HOUR: int = 200
        BURST_LIMIT: int = 5
        RATE_LIMIT_MESSAGE: str = "您的請求過於頻繁，請稍後再試。"

    def __init__(self):
        self.name = "Rate Limit Filter"
        self.valves = self.Valves()
        # 使用者請求時間戳記錄
        self._request_log: dict[str, list[float]] = defaultdict(list)

    def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        """在訊息進入前檢查速率限制。"""
        user_id = user.get("id", "anonymous") if user else "anonymous"
        now = time.time()

        # 清理過期記錄
        self._request_log[user_id] = [
            ts for ts in self._request_log[user_id]
            if now - ts < 3600  # 保留一小時內的記錄
        ]

        timestamps = self._request_log[user_id]

        # 檢查每分鐘限制
        recent_minute = [ts for ts in timestamps if now - ts < 60]
        if len(recent_minute) >= self.valves.REQUESTS_PER_MINUTE:
            raise Exception(self.valves.RATE_LIMIT_MESSAGE)

        # 檢查每小時限制
        if len(timestamps) >= self.valves.REQUESTS_PER_HOUR:
            raise Exception(self.valves.RATE_LIMIT_MESSAGE)

        # 檢查瞬時限制（5 秒內）
        burst_recent = [ts for ts in timestamps if now - ts < 5]
        if len(burst_recent) >= self.valves.BURST_LIMIT:
            raise Exception("請求過於密集，請稍等幾秒。")

        # 記錄本次請求
        self._request_log[user_id].append(now)
        return body
```

### 5. Real-Time Translation Pipeline (LibreTranslate)

整合 LibreTranslate 實現即時多語言翻譯：

```python
"""
title: LibreTranslate Pipeline
author: openclaw-community
version: 1.2.0
license: MIT
"""

from typing import List, Optional
from pydantic import BaseModel
import requests


class Pipeline:
    """即時翻譯 Pipeline，使用 LibreTranslate 作為後端。"""

    class Valves(BaseModel):
        LIBRETRANSLATE_URL: str = "http://localhost:5000"
        SOURCE_LANG: str = "auto"
        TARGET_LANG: str = "zh"
        TRANSLATE_INPUT: bool = True
        TRANSLATE_OUTPUT: bool = True
        API_KEY: str = ""

    def __init__(self):
        self.name = "Real-Time Translation"
        self.valves = self.Valves()

    def _translate(self, text: str, source: str, target: str) -> str:
        """呼叫 LibreTranslate API 進行翻譯。"""
        response = requests.post(
            f"{self.valves.LIBRETRANSLATE_URL}/translate",
            json={
                "q": text,
                "source": source,
                "target": target,
                "api_key": self.valves.API_KEY
            },
            timeout=10
        )
        response.raise_for_status()
        return response.json()["translatedText"]

    def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        """將使用者輸入翻譯為英文（提升 LLM 理解能力）。"""
        if not self.valves.TRANSLATE_INPUT:
            return body

        messages = body.get("messages", [])
        if messages and messages[-1]["role"] == "user":
            original = messages[-1]["content"]
            translated = self._translate(
                original,
                self.valves.SOURCE_LANG,
                "en"
            )
            # 保留原文作為上下文
            messages[-1]["content"] = (
                f"{translated}\n\n[原文: {original}]"
            )
        return body

    def outlet(self, body: dict, user: Optional[dict] = None) -> dict:
        """將 LLM 回應翻譯為目標語言。"""
        if not self.valves.TRANSLATE_OUTPUT:
            return body

        messages = body.get("messages", [])
        if messages and messages[-1]["role"] == "assistant":
            original = messages[-1]["content"]
            messages[-1]["content"] = self._translate(
                original,
                "en",
                self.valves.TARGET_LANG
            )
        return body
```

### 6. Toxic Message Filter

使用分類模型偵測並攔截有害訊息：

```python
"""
title: Toxic Message Filter
author: openclaw-community
version: 2.0.0
license: MIT
"""

from typing import Optional
from pydantic import BaseModel


class Pipeline:
    """基於 transformer 分類模型的毒性訊息過濾器。"""

    class Valves(BaseModel):
        TOXICITY_THRESHOLD: float = 0.8
        MODEL_NAME: str = "unitary/toxic-bert"
        BLOCK_MESSAGE: str = "您的訊息因包含不當內容而被攔截。"
        LOG_BLOCKED: bool = True
        CATEGORIES: list = [
            "toxic", "severe_toxic", "obscene",
            "threat", "insult", "identity_hate"
        ]

    def __init__(self):
        self.name = "Toxic Message Filter"
        self.valves = self.Valves()
        self.classifier = None

    async def on_startup(self):
        """載入毒性分類模型。"""
        from transformers import pipeline
        self.classifier = pipeline(
            "text-classification",
            model=self.valves.MODEL_NAME,
            top_k=None
        )
        print(f"[ToxicFilter] 模型已載入: {self.valves.MODEL_NAME}")

    def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        """分析使用者訊息的毒性分數。"""
        messages = body.get("messages", [])
        if not messages or messages[-1]["role"] != "user":
            return body

        text = messages[-1]["content"]
        results = self.classifier(text)[0]

        # 檢查各毒性類別
        for result in results:
            if (result["label"] in self.valves.CATEGORIES
                    and result["score"] >= self.valves.TOXICITY_THRESHOLD):
                if self.valves.LOG_BLOCKED:
                    user_id = user.get("id", "unknown") if user else "unknown"
                    print(
                        f"[ToxicFilter] 已攔截使用者 {user_id} 的訊息 "
                        f"(類別: {result['label']}, "
                        f"分數: {result['score']:.3f})"
                    )
                raise Exception(self.valves.BLOCK_MESSAGE)

        return body
```

---

## Tools 與 Functions 的區別

OpenClaw 的擴充生態系分為兩大類：**Tools** 和 **Functions**，兩者用途截然不同。

```
┌───────────────────────────────────────────────────────┐
│                   OpenClaw 擴充生態系                   │
│                                                       │
│  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │       Tools          │  │       Functions          │ │
│  │                      │  │                          │ │
│  │  LLM 主動呼叫        │  │  系統層級擴充             │ │
│  │  取得即時資料         │  │  修改核心行為             │ │
│  │                      │  │                          │ │
│  │  - 網路搜尋          │  │  - 新增模型支援           │ │
│  │  - API 查詢          │  │  - 自訂按鈕              │ │
│  │  - 資料庫存取         │  │  - 訊息過濾器            │ │
│  │  - 檔案操作          │  │  - Pipeline 邏輯         │ │
│  │  - 計算執行          │  │  - UI 擴充               │ │
│  │                      │  │                          │ │
│  │  社群: 541+ 個       │  │  社群: 276+ 個           │ │
│  └─────────────────────┘  └─────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

### 比較表

| 面向 | Tools | Functions |
|------|-------|-----------|
| **呼叫者** | LLM 自主決定何時呼叫 | 系統自動執行或使用者觸發 |
| **用途** | 存取即時外部資料 | 擴充 OpenClaw 核心功能 |
| **執行時機** | LLM 推理過程中 | 訊息處理前/後、UI 互動時 |
| **典型範例** | 天氣查詢、股價查詢、網路搜尋 | 新模型整合、自訂按鈕、訊息過濾 |
| **回傳結果** | 回傳給 LLM 做進一步推理 | 直接修改系統行為 |
| **社群數量** | 541+ | 276+ |

### Tool 範例：即時股價查詢

```python
"""
title: Stock Price Tool
author: openclaw-community
version: 1.0.0
"""


class Tools:
    """LLM 可呼叫此 Tool 查詢即時股票價格。"""

    def __init__(self):
        pass

    def get_stock_price(self, symbol: str) -> str:
        """
        查詢指定股票的即時價格。
        :param symbol: 股票代碼，例如 AAPL、2330.TW
        :return: 股票即時報價資訊
        """
        import yfinance as yf
        stock = yf.Ticker(symbol)
        info = stock.info
        return (
            f"股票: {info.get('shortName', symbol)}\n"
            f"現價: {info.get('currentPrice', 'N/A')}\n"
            f"漲跌: {info.get('regularMarketChange', 'N/A')}\n"
            f"成交量: {info.get('volume', 'N/A')}"
        )
```

### Function 範例：自訂 UI 按鈕

```python
"""
title: Quick Reply Buttons
author: openclaw-community
version: 1.0.0
"""


class Functions:
    """在聊天介面加入快速回覆按鈕。"""

    def __init__(self):
        self.buttons = [
            {"label": "摘要", "action": "summarize"},
            {"label": "翻譯成英文", "action": "translate_en"},
            {"label": "程式碼審查", "action": "code_review"},
        ]

    def get_buttons(self, message: str, user: dict) -> list:
        """根據訊息內容回傳可用的快速按鈕。"""
        available = []
        for btn in self.buttons:
            available.append({
                "type": "button",
                "label": btn["label"],
                "value": btn["action"]
            })
        return available

    def handle_action(self, action: str, message: str, user: dict) -> str:
        """處理按鈕點擊事件。"""
        if action == "summarize":
            return f"請為以下內容生成摘要：\n\n{message}"
        elif action == "translate_en":
            return f"請將以下內容翻譯成英文：\n\n{message}"
        elif action == "code_review":
            return f"請審查以下程式碼並提供改善建議：\n\n{message}"
        return message
```

---

## 建立自訂 Pipeline

### 步驟 1：建立 Pipeline 檔案

```bash
# 建立 Pipeline 專案目錄
mkdir -p ~/.openclaw/pipelines/my-custom-pipeline
cd ~/.openclaw/pipelines/my-custom-pipeline

# 建立主要的 Pipeline 檔案
touch pipeline.py
touch requirements.txt
```

### 步驟 2：撰寫 Pipeline 程式碼

```python
"""
title: My Custom Pipeline
author: your-username
version: 0.1.0
license: MIT
description: 自訂 Pipeline 範本
"""

from typing import List, Optional, Generator
from pydantic import BaseModel


class Pipeline:
    class Valves(BaseModel):
        """Valves 是可透過 UI 動態調整的設定參數。"""
        MY_API_KEY: str = ""
        ENABLE_FEATURE_X: bool = True
        MAX_RETRIES: int = 3

    def __init__(self):
        self.name = "My Custom Pipeline"
        self.valves = self.Valves()

    async def on_startup(self):
        """Pipeline 啟動時的初始化邏輯。"""
        print(f"[{self.name}] 啟動中...")

    async def on_shutdown(self):
        """Pipeline 關閉時的清理邏輯。"""
        print(f"[{self.name}] 關閉中...")

    async def on_valves_updated(self):
        """當 Valves 設定被更新時觸發。"""
        print(f"[{self.name}] 設定已更新")

    def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        """前處理：在訊息送往 LLM 之前進行處理。"""
        # 在此加入你的前處理邏輯
        return body

    def pipe(self, user_message: str, model_id: str,
             messages: List[dict], body: dict) -> Generator:
        """主處理函式：核心 Pipeline 邏輯。"""
        # 在此加入你的核心邏輯
        yield "Hello from My Custom Pipeline!"

    def outlet(self, body: dict, user: Optional[dict] = None) -> dict:
        """後處理：在回應送回使用者之前進行處理。"""
        # 在此加入你的後處理邏輯
        return body
```

### 步驟 3：定義相依套件

```
# requirements.txt
pydantic>=2.0.0
requests>=2.31.0
```

### 步驟 4：測試與部署

```bash
# 驗證 Pipeline 語法
openclaw pipeline validate ./pipeline.py

# 本地測試
openclaw pipeline test ./pipeline.py \
  --input '{"messages":[{"role":"user","content":"你好"}]}'

# 安裝到 OpenClaw
openclaw pipeline install ./pipeline.py

# 查看已安裝的 Pipelines
openclaw pipeline list
```

---

## Pipeline 設定與部署

### Docker Compose 部署

```yaml
# docker-compose.pipelines.yaml
version: "3.8"

services:
  openclaw:
    image: ghcr.io/openclaw/openclaw:latest
    ports:
      - "3000:8080"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - openclaw-data:/app/backend/data
    depends_on:
      - pipelines

  pipelines:
    image: ghcr.io/openclaw/pipelines:latest
    ports:
      - "9099:9099"
    environment:
      - PIPELINES_DIR=/app/pipelines
    volumes:
      - ./my-pipelines:/app/pipelines
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  openclaw-data:
```

### 環境變數設定

```bash
# .env
# Pipeline 服務設定
PIPELINES_HOST=0.0.0.0
PIPELINES_PORT=9099

# Langfuse 監控
LANGFUSE_PUBLIC_KEY=pk-lf-xxxxxxxx
LANGFUSE_SECRET_KEY=sk-lf-xxxxxxxx

# LibreTranslate
LIBRETRANSLATE_URL=http://libretranslate:5000

# ChromaDB
CHROMADB_HOST=http://chromadb:8000
```

### 連接 OpenClaw 與 Pipeline 服務

在 OpenClaw 管理介面中設定：

```
設定 → 連線 → OpenAI API
  URL: http://pipelines:9099
  API Key: （留空或填入自訂金鑰）
```

:::tip 部署提示
Pipeline 服務作為獨立的 HTTP 伺服器運行，與 OpenClaw 主服務分離。這代表你可以在不影響主服務的情況下，獨立擴展和更新 Pipeline。
:::

---

## 社群生態系

### OpenWebUI Hub 市集

OpenClaw 的 Pipeline 與 Functions 生態系基於 [OpenWebUI Hub](https://openwebui.com) 市集，社群貢獻了大量的擴充模組：

| 類別 | 數量 | 熱門項目 |
|------|------|---------|
| **Tools（工具）** | 541+ | 網路搜尋、YouTube 摘要、天氣查詢、股票分析 |
| **Functions（函式）** | 276+ | Ollama 整合、自訂模型支援、語音轉文字、圖片生成 |
| **Pipelines** | 80+ | RAG、Langfuse、速率限制、翻譯、毒性過濾 |

### 安裝社群 Pipeline

```bash
# 從 OpenWebUI Hub 安裝
openclaw pipeline install hub://langfuse-monitoring
openclaw pipeline install hub://rate-limiter
openclaw pipeline install hub://rag-chromadb

# 從 GitHub 安裝
openclaw pipeline install github://user/repo/pipeline.py

# 從 URL 安裝
openclaw pipeline install https://example.com/my-pipeline.py
```

### 透過管理介面安裝

1. 進入 **管理面板** → **Functions / Tools**
2. 點擊右上角的 **+** 按鈕
3. 瀏覽 Hub 市集或貼上 Pipeline URL
4. 檢視程式碼後點擊 **安裝**
5. 設定 Valves 參數（API Keys 等）

:::warning 安全警告
安裝社群 Pipeline 前，務必檢視原始碼。Pipeline 具有存取您 API Key 和使用者資料的權限。只從信任的來源安裝 Pipeline，並定期審計已安裝的擴充模組。
:::

---

## 管理 Pipelines

### CLI 管理指令

```bash
# 列出所有已安裝的 Pipelines
openclaw pipeline list

# 查看 Pipeline 詳細資訊
openclaw pipeline info langfuse-monitoring

# 啟用 / 停用 Pipeline
openclaw pipeline enable langfuse-monitoring
openclaw pipeline disable rate-limiter

# 更新 Pipeline
openclaw pipeline update langfuse-monitoring

# 移除 Pipeline
openclaw pipeline remove langfuse-monitoring

# 查看 Pipeline 日誌
openclaw pipeline logs langfuse-monitoring --tail 50
```

### Valve 設定管理

```bash
# 查看 Pipeline 的 Valves 設定
openclaw pipeline valves langfuse-monitoring

# 更新 Valve 值
openclaw pipeline set-valve langfuse-monitoring \
  LANGFUSE_PUBLIC_KEY=pk-lf-xxxxxxxx

# 或者透過管理介面：
# 管理面板 → Pipelines → 點擊 Pipeline → Valves 設定
```

### JavaScript 用戶端呼叫

如果你的應用需要透過 JavaScript 呼叫 Pipeline：

```javascript
// 使用標準 OpenAI SDK 呼叫 Pipeline
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:9099/v1",
  apiKey: "your-api-key",
});

async function chatWithPipeline() {
  const response = await client.chat.completions.create({
    // model 名稱對應 Pipeline 的識別名稱
    model: "custom-rag-pipeline",
    messages: [
      { role: "system", content: "你是一個知識問答助理。" },
      { role: "user", content: "OpenClaw 的架構是什麼？" },
    ],
    stream: true,
  });

  for await (const chunk of response) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
}

chatWithPipeline();
```

串流回應的前端處理：

```javascript
// 前端使用 fetch + ReadableStream
async function streamChat(message) {
  const response = await fetch("http://localhost:9099/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer your-api-key",
    },
    body: JSON.stringify({
      model: "custom-rag-pipeline",
      messages: [{ role: "user", content: message }],
      stream: true,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

    for (const line of lines) {
      const data = line.replace("data: ", "");
      if (data === "[DONE]") return;

      const parsed = JSON.parse(data);
      const content = parsed.choices[0]?.delta?.content || "";
      // 更新 UI
      appendToChat(content);
    }
  }
}
```

---

## 最佳實踐

### 1. Valve 設計原則

```python
class Pipeline:
    class Valves(BaseModel):
        # 將敏感資料放在 Valves 中，避免寫死在程式碼裡
        API_KEY: str = ""

        # 提供合理的預設值
        MAX_RETRIES: int = 3
        TIMEOUT_SECONDS: int = 30

        # 使用清晰的命名
        ENABLE_CACHE: bool = True
        CACHE_TTL_SECONDS: int = 3600
```

:::tip Valve 命名慣例
使用全大寫蛇形命名（UPPER_SNAKE_CASE），並加上有意義的前綴。例如 `LANGFUSE_PUBLIC_KEY` 而非 `key1`。
:::

### 2. 錯誤處理

```python
def pipe(self, user_message: str, model_id: str,
         messages: list, body: dict):
    try:
        result = self._process(messages)
        return result
    except ConnectionError:
        # 回退到直接回應，而非讓整個請求失敗
        return "外部服務暫時無法使用，請稍後再試。"
    except Exception as e:
        # 記錄錯誤但不暴露內部細節
        print(f"[Pipeline Error] {type(e).__name__}: {e}")
        return "處理您的請求時發生錯誤，請稍後再試。"
```

### 3. 效能最佳化

```python
async def on_startup(self):
    # 在啟動時預載入模型和建立連線，避免首次請求延遲
    self._model = await self._load_model()
    self._db_pool = await self._create_connection_pool()

def pipe(self, user_message, model_id, messages, body):
    # 使用快取減少重複計算
    cache_key = self._compute_cache_key(user_message)
    cached = self._cache.get(cache_key)
    if cached:
        return cached

    result = self._process(messages)
    self._cache.set(cache_key, result, ttl=self.valves.CACHE_TTL_SECONDS)
    return result
```

### 4. 安全性考量

:::danger 安全重點
Pipeline 在伺服器端執行，擁有完整的系統存取權限。請遵守以下原則：
:::

| 原則 | 說明 |
|------|------|
| **最小權限** | Pipeline 只應存取完成任務所需的最少資源 |
| **輸入驗證** | 永遠驗證和清理使用者輸入，防止注入攻擊 |
| **敏感資料保護** | API Key 必須放在 Valves 中，不可寫死在程式碼 |
| **日誌審慎** | 不要在日誌中記錄使用者的完整訊息或敏感資料 |
| **依賴管理** | 定期更新相依套件，使用固定版號避免供應鏈攻擊 |
| **程式碼審查** | 安裝社群 Pipeline 前必須審查原始碼 |

```python
# 輸入驗證範例
def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
    messages = body.get("messages", [])

    for msg in messages:
        content = msg.get("content", "")
        # 限制訊息長度
        if len(content) > 10000:
            raise Exception("訊息長度超過限制（最多 10,000 字元）。")
        # 過濾潛在的 prompt injection 模式
        if self._detect_injection(content):
            raise Exception("偵測到潛在的安全風險，請修改您的訊息。")

    return body
```

---

## 練習題

### 練習 1：打造情緒分析 Pipeline

建立一個 Pipeline，在使用者訊息送往 LLM 之前進行情緒分析，並將分析結果附加到系統提示中，讓 LLM 能根據使用者情緒調整回應語氣。

**提示：**
- 使用 `inlet()` 進行前處理
- 使用 `transformers` 的 sentiment analysis pipeline
- 將結果注入 `system` 訊息

### 練習 2：對話摘要 Outlet

建立一個 Outlet Filter，在每次對話結束後自動生成摘要，並儲存到本地檔案系統。

**要求：**
- 使用 `outlet()` 進行後處理
- 當對話超過 10 輪時觸發摘要
- 摘要以 Markdown 格式儲存到 `~/.openclaw/summaries/`

### 練習 3：多模型路由 Pipeline

建立一個 Pipeline，根據使用者訊息的內容自動選擇最合適的模型：

| 訊息類型 | 路由目標 |
|---------|---------|
| 程式碼相關 | GPT-5.2 Codex |
| 一般對話 | Claude Opus |
| 簡單問答 | Llama 3.3 (本地) |

**提示：**
- 使用關鍵字或分類器判斷訊息類型
- 在 `pipe()` 中動態切換 `model_id`
- 透過 Valves 設定各模型的 API Key

### 練習 4：安全審計

檢查你已安裝的所有 Pipelines 和 Functions，回答以下問題：

1. 有多少個 Pipeline 需要外部 API Key？
2. 是否有 Pipeline 存取了不必要的資源？
3. 是否有 Pipeline 在日誌中記錄了敏感資訊？
4. 所有的 Valves 都使用了安全的預設值嗎？

---

## 延伸閱讀

- [架構概覽](/docs/architecture/overview) — OpenClaw 四層式架構解析
- [Skills 系統](/docs/masterclass/module-03-skills-system) — Skills 與 SKILL.md 規格詳解
- [安全性最佳實踐](/docs/security/best-practices) — 全面的安全設定指南
- [API 參考](/docs/architecture/api-reference) — Pipeline REST API 完整文件
