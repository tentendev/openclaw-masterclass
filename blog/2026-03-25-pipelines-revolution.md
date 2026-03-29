---
title: "Pipelines 革命：OpenClaw 的無限擴充能力"
description: "深入探索 OpenClaw Pipelines 框架——如何用 Functions 與 Tools 打造你專屬的 AI 工作流"
authors: [team]
tags: [pipelines, functions, tools, openclaw, 教學]
date: 2026-03-25
---

# Pipelines 革命：OpenClaw 的無限擴充能力

OpenClaw 的 Pipelines 框架讓你可以像搭積木一樣建構 AI 工作流——從簡單的訊息過濾器到複雜的多步驟 RAG 管道，一切都透過直覺的 Python API 完成。

<!-- truncate -->

## 什麼是 Pipelines？

Pipelines 是 OpenClaw 的核心擴充框架，它提供了一個 **UI 無關、OpenAI 相容** 的插件系統。你可以把它想像成 AI 世界的 middleware——每一則訊息都會經過你定義的管道處理。

### 三種核心類型

| 類型 | 用途 | 範例 |
|------|------|------|
| **Filter Pipeline** | 攔截並修改訊息 | 有害內容過濾、速率限制 |
| **Function Pipeline** | 擴充模型能力 | 函式呼叫、RAG 注入 |
| **Pipe Pipeline** | 完全自訂回應 | 自訂模型端點、翻譯 |

## 社群生態現況

截至 2026 年 3 月，OpenClaw 的擴充生態已經相當豐富：

- **541 個 Functions** — 社群貢獻的功能擴充
- **276 個 Tools** — LLM 可呼叫的即時工具
- **OpenWebUI Hub** — 集中式的發現與安裝平台

## 快速上手：建立你的第一個 Pipeline

以下是一個簡單的訊息日誌 Pipeline，會將所有對話記錄到 Langfuse：

```python
from typing import Optional
from pydantic import BaseModel

class Pipeline:
    class Valves(BaseModel):
        langfuse_host: str = "https://cloud.langfuse.com"
        langfuse_public_key: str = ""
        langfuse_secret_key: str = ""

    def __init__(self):
        self.name = "Langfuse Monitor"
        self.valves = self.Valves()

    async def on_startup(self):
        from langfuse import Langfuse
        self.langfuse = Langfuse(
            host=self.valves.langfuse_host,
            public_key=self.valves.langfuse_public_key,
            secret_key=self.valves.langfuse_secret_key,
        )

    async def inlet(self, body: dict, user: dict) -> dict:
        """訊息進入時記錄"""
        self.langfuse.trace(
            name="chat",
            user_id=user.get("id"),
            input=body.get("messages", [])[-1]
        )
        return body

    async def outlet(self, body: dict, user: dict) -> dict:
        """回應產生後記錄"""
        self.langfuse.trace(
            name="response",
            output=body.get("messages", [])[-1]
        )
        return body
```

## Tools vs Functions 的差異

這是很多人會混淆的概念：

- **Tools**：讓 LLM 可以存取真實世界的資料（天氣、股價、搜尋引擎等）。LLM 決定什麼時候呼叫 Tool。
- **Functions**：擴展 OpenClaw 平台本身的能力（新的模型支援、自訂按鈕、訊息過濾器等）。Functions 在系統層級運作。

## 安全注意事項

:::warning 安全第一
安裝社群 Pipeline 前，請務必：
1. 閱讀完整的原始碼
2. 檢查網路請求的目的地
3. 確認不會外洩你的 API key
4. 在沙箱環境中先行測試
:::

## 延伸閱讀

- [Pipelines 完整文件](/docs/features/pipelines) — 所有 Pipeline 類型的詳細教學
- [Knowledge Base 與 RAG](/docs/features/knowledge-rag) — 建構自訂 RAG Pipeline
- [安全性最佳實踐](/docs/security/best-practices) — Pipeline 安全指南

Pipelines 框架讓 OpenClaw 從一個聊天介面進化為一個**完全可程式化的 AI 平台**。開始動手打造你的專屬管道吧！
