---
title: 架構概覽
description: OpenClaw 四層式架構深度解析——Gateway、Reasoning Layer、Memory System、Skills Execution Layer 的設計原理與實作細節。
sidebar_position: 1
---

# 架構概覽

OpenClaw 採用清晰的四層式架構設計，每一層各司其職、鬆散耦合。本篇將深入分析每一層的設計原理、內部運作機制、以及各層之間的交互方式。

---

## 總體架構圖

```
                    使用者
                      │
          ┌───────────┼───────────┐
          │     通訊平台 Channels   │
          │  Telegram│Discord│LINE │
          │  WhatsApp│Slack│Signal │
          └───────────┼───────────┘
                      │
    ╔═════════════════╪═════════════════╗
    ║  第一層：Gateway（閘道層）        ║
    ║  Port 18789                       ║
    ║  ┌────────────────────────────┐   ║
    ║  │ Channel Adapters           │   ║
    ║  │ Message Queue              │   ║
    ║  │ Auth & Rate Limiting       │   ║
    ║  │ REST API (internal)        │   ║
    ║  └────────────────────────────┘   ║
    ╠═══════════════════════════════════╣
    ║  第二層：Reasoning Layer（推理層）║
    ║  ┌────────────────────────────┐   ║
    ║  │ Intent Recognition         │   ║
    ║  │ LLM Router                 │   ║
    ║  │ Tool Selection             │   ║
    ║  │ Response Generation        │   ║
    ║  │ SOUL.md Personality        │   ║
    ║  └────────────────────────────┘   ║
    ╠═══════════════════════════════════╣
    ║  第三層：Memory System（記憶系統）║
    ║  ┌────────────────────────────┐   ║
    ║  │ WAL (Write-Ahead Log)      │   ║
    ║  │ Markdown Compaction        │   ║
    ║  │ Context Window Manager     │   ║
    ║  │ Long-term Memory Index     │   ║
    ║  └────────────────────────────┘   ║
    ╠═══════════════════════════════════╣
    ║  第四層：Skills / Execution      ║
    ║  ┌────────────────────────────┐   ║
    ║  │ Skill Registry             │   ║
    ║  │ Sandbox (Podman/Docker)    │   ║
    ║  │ Permission Enforcer        │   ║
    ║  │ Result Processor           │   ║
    ║  └────────────────────────────┘   ║
    ╚═══════════════════════════════════╝
```

---

## 第一層：Gateway（閘道層）

Gateway 是 OpenClaw 與外部世界溝通的唯一入口，預設監聽 **port 18789**。

### 核心職責

1. **統一訊息接收** — 接收來自 20+ 通訊平台的訊息
2. **格式標準化** — 將不同平台的訊息格式轉換為內部標準格式
3. **認證與授權** — 驗證連入的請求是否合法
4. **速率限制** — 防止過量請求影響系統穩定性
5. **訊息佇列** — 管理訊息的排隊與優先順序

### Channel Adapter 架構

每個通訊平台都有一個對應的 **Channel Adapter**，負責處理該平台特有的協定：

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Telegram    │  │  Discord     │  │  WhatsApp    │
│  Adapter     │  │  Adapter     │  │  Adapter     │
│  (Bot API)   │  │  (WebSocket) │  │  (Baileys)   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────┬───────┘─────────────────┘
                 │
         ┌───────▼───────┐
         │  Unified      │
         │  Message      │
         │  Format       │
         └───────┬───────┘
                 │
         ┌───────▼───────┐
         │  Message      │
         │  Queue        │
         └───────────────┘
```

### 統一訊息格式

```json
{
  "id": "msg_abc123",
  "timestamp": "2026-03-20T10:30:00Z",
  "channel": {
    "type": "telegram",
    "id": "chat_456",
    "name": "My Chat"
  },
  "sender": {
    "id": "user_789",
    "name": "使用者名稱",
    "role": "user"
  },
  "content": {
    "type": "text",
    "text": "幫我查一下明天的天氣",
    "attachments": []
  },
  "metadata": {
    "reply_to": null,
    "thread_id": null,
    "platform_specific": {}
  }
}
```

### Gateway 設定

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"
  auth:
    enabled: true
    token: "${GATEWAY_AUTH_TOKEN}"
  rate_limit:
    requests_per_minute: 60
    burst: 10
  queue:
    max_size: 1000
    timeout_ms: 30000
  logging:
    level: "info"  # debug | info | warn | error
    file: "~/.openclaw/logs/gateway.log"
```

:::danger 安全提醒
Gateway 是 OpenClaw 最大的攻擊面。已有超過 30,000 個實例因暴露 18789 埠而被入侵。**永遠綁定到 `127.0.0.1`**。詳見 [安全性最佳實踐](/docs/security/best-practices)。
:::

### 支援的通訊平台

| 平台 | 協定 | Adapter 狀態 |
|------|------|-------------|
| Telegram | Bot API (HTTP) | 穩定 |
| Discord | WebSocket + REST | 穩定 |
| WhatsApp | Baileys (WebSocket) | 穩定 |
| Slack | Events API + WebSocket | 穩定 |
| LINE | Messaging API | 穩定 |
| Signal | signal-cli (DBus) | 穩定 |
| iMessage | AppleScript bridge | Beta |
| Matrix | Matrix Client-Server API | 穩定 |
| Microsoft Teams | Graph API | 穩定 |
| Messenger | Graph API | Beta |
| WeChat | WeChatFerry | 社群維護 |
| Email (IMAP/SMTP) | 標準協定 | 穩定 |
| Web UI | WebSocket | 穩定 |
| REST API | HTTP | 穩定 |

---

## 第二層：Reasoning Layer（推理層）

推理層是 OpenClaw 的「大腦」，負責理解使用者意圖、決定行動策略、並生成回應。

### 處理流程

```
收到訊息
    │
    ▼
┌─────────────┐
│ 載入上下文   │ ← 從 Memory System 取得相關記憶
│ (Context)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 意圖識別     │ ← 判斷使用者想做什麼
│ (Intent)     │
└──────┬──────┘
       │
       ├── 直接回答 ──→ 生成回應 ──→ 傳回 Gateway
       │
       ├── 呼叫技能 ──→ Tool Selection ──→ Skills Layer
       │                                      │
       │                              ← 技能結果 ─┘
       │
       └── 查詢記憶 ──→ Memory System ──→ 回應
```

### LLM Router

OpenClaw 支援多個 LLM 提供者，Reasoning Layer 中的 **LLM Router** 負責將請求路由到正確的模型：

```yaml
# ~/.openclaw/providers/default.yaml
providers:
  primary:
    type: anthropic
    model: claude-opus-4-6
    api_key: "${ANTHROPIC_API_KEY}"
    max_tokens: 8192

  secondary:
    type: openai
    model: gpt-5.2-codex
    api_key: "${OPENAI_API_KEY}"

  local:
    type: ollama
    model: llama-3.3-70b
    endpoint: "http://127.0.0.1:11434"

  routing:
    # 根據任務類型路由到不同模型
    code_generation: secondary     # GPT-5.2 Codex 擅長程式碼
    general_conversation: primary  # Claude 擅長對話
    simple_tasks: local           # 簡單任務用本地模型省錢
    fallback: primary             # 預設回退
```

### SOUL.md 人格系統

SOUL.md 是 OpenClaw 的核心設定檔，定義了 Agent 的人格、行為規則和任務清單：

```markdown
<!-- ~/.openclaw/soul.md -->
# 我的 AI 助理

## 人格
你是一位友善、專業的個人助理。使用繁體中文回覆。

## 安全規則
- 永遠不要透露 API key 或密碼
- 不要執行未經確認的危險操作
- 涉及金錢的操作需要二次確認

## 日常任務
- 每天早上 8:00 發送天氣報告和行程摘要
- 收到新郵件時進行分類並通知重要信件

## 偏好
- 回覆簡潔，避免冗長
- 使用 Markdown 格式
- 時區：Asia/Taipei (UTC+8)
```

### Tool Selection 機制

當推理層判斷需要使用技能時，Tool Selection 模組會根據以下因素選擇最適合的技能：

| 因素 | 說明 |
|------|------|
| **意圖匹配** | 使用者的意圖與技能的功能描述匹配度 |
| **權限檢查** | 技能是否有執行所需操作的權限 |
| **效能考量** | 技能的平均執行時間和資源消耗 |
| **可用性** | 技能是否已安裝且正常運行 |
| **優先順序** | SOUL.md 中設定的技能偏好 |

---

## 第三層：Memory System（記憶系統）

記憶系統採用 **WAL + Markdown Compaction** 的混合架構，平衡了寫入效能和長期儲存效率。

### 記憶架構

```
即時對話
    │
    ▼
┌─────────────────────┐
│  WAL (Write-Ahead   │  ← 快速寫入，保留完整對話
│  Log)                │     ~/.openclaw/memory/wal/
│  ┌───┬───┬───┬───┐  │
│  │ 1 │ 2 │ 3 │ 4 │  │  每條訊息即時追加
│  └───┴───┴───┴───┘  │
└──────────┬──────────┘
           │ 定期壓縮（compaction）
           ▼
┌─────────────────────┐
│  Compacted Markdown │  ← 結構化的長期記憶
│                      │     ~/.openclaw/memory/compacted/
│  - 對話摘要          │
│  - 使用者偏好        │
│  - 學到的事實        │
│  - 任務歷史          │
└──────────┬──────────┘
           │ 查詢
           ▼
┌─────────────────────┐
│  Context Window     │  ← 管理送入 LLM 的上下文
│  Manager            │
│                      │
│  最近對話 + 相關記憶 │
│  = 精心組裝的 prompt │
└─────────────────────┘
```

### WAL（Write-Ahead Log）

WAL 是記憶系統的第一層，負責即時記錄所有對話：

```
~/.openclaw/memory/wal/
├── 2026-03-20.wal      # 每日一個 WAL 檔案
├── 2026-03-19.wal
├── 2026-03-18.wal
└── ...
```

**WAL 條目格式：**

```json
{
  "seq": 12345,
  "timestamp": "2026-03-20T10:30:00Z",
  "type": "message",
  "channel": "telegram",
  "role": "user",
  "content": "幫我查一下明天的天氣",
  "metadata": {
    "tokens": 15,
    "conversation_id": "conv_abc"
  }
}
```

### Markdown Compaction（壓縮）

WAL 中的原始對話會定期壓縮為結構化的 Markdown 檔案：

```markdown
<!-- ~/.openclaw/memory/compacted/user-preferences.md -->
# 使用者偏好

## 飲食
- 不吃辣
- 喜歡日本料理
- 對花生過敏

## 工作
- 軟體工程師
- 使用 TypeScript 和 Python
- 偏好 VS Code

## 時區與習慣
- 時區：Asia/Taipei (UTC+8)
- 通常在 9:00-18:00 工作
- 週末較晚起床
```

```markdown
<!-- ~/.openclaw/memory/compacted/conversation-summaries/2026-03.md -->
# 2026 年 3 月對話摘要

## 3/18 — 購車研究
使用者正在考慮購買 Toyota RAV4。Agent 搜尋了市場行情，
建議在月底促銷期購買，預估可省 $4,000-5,000。

## 3/19 — 部落格遷移
協助使用者將 Notion 上的 18 篇文章遷移到 Astro。
已完成格式轉換和 Cloudflare DNS 設定。

## 3/20 — 天氣與行程
早上發送了天氣報告。使用者詢問了明天的天氣。
```

### Context Window Manager

Context Window Manager 負責在 LLM 的 token 限制內，組裝最有價值的上下文：

```
上下文組裝優先順序：
1. System Prompt（SOUL.md）        — 最高優先
2. 最近 N 輪對話                   — 短期記憶
3. 相關的壓縮記憶                  — 長期記憶
4. 可用技能列表                    — Tool definitions
5. 當前任務的補充資訊              — 最低優先
```

**Token 分配策略：**

| 組件 | 預設分配 | 說明 |
|------|---------|------|
| System Prompt | 15% | SOUL.md 和安全指令 |
| 最近對話 | 40% | 最近的對話紀錄 |
| 長期記憶 | 20% | 相關的壓縮記憶 |
| Tool 定義 | 15% | 可用技能的描述 |
| 保留空間 | 10% | 留給模型的回應空間 |

---

## 第四層：Skills / Execution Layer（技能 / 執行層）

技能層負責在安全的沙箱環境中執行各種操作。

### 技能生命週期

```
ClawHub                 本機
  │                       │
  │  openclaw skill       │
  │  install xxx          │
  ├───────────────────────►│
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 下載 &    │
  │                 │ VirusTotal│
  │                 │ 驗證      │
  │                 └─────┬─────┘
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 安裝到    │
  │                 │ Skills 目錄│
  │                 └─────┬─────┘
  │                       │
  │     使用者請求呼叫技能  │
  │                       │
  │                 ┌─────▼─────┐
  │                 │ Permission│
  │                 │ Check     │
  │                 └─────┬─────┘
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 建立沙箱  │
  │                 │ Container │
  │                 └─────┬─────┘
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 執行技能  │
  │                 └─────┬─────┘
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 回傳結果  │
  │                 └───────────┘
```

### 沙箱架構

```
┌─────────────────────────────────────┐
│  主機系統                           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Podman Rootless Container  │   │
│  │                             │   │
│  │  ┌───────────────────────┐  │   │
│  │  │  Skill Runtime        │  │   │
│  │  │  (Node.js / Python)   │  │   │
│  │  └───────────────────────┘  │   │
│  │                             │   │
│  │  限制：                     │   │
│  │  - 記憶體：512MB            │   │
│  │  - CPU：1 core              │   │
│  │  - 網路：受限域名           │   │
│  │  - 檔案：只讀 + /tmp       │   │
│  │  - 無 root 權限             │   │
│  │  - seccomp profile          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Skill Registry

Skill Registry 管理所有已安裝的技能，並提供給 Reasoning Layer 的 Tool Selection 使用：

```
~/.openclaw/skills/
├── web-search/
│   ├── manifest.yaml    # 技能宣告
│   ├── index.js         # 主程式
│   ├── package.json     # 相依
│   └── permissions.override.yaml  # 權限覆蓋
├── email-manager/
│   ├── manifest.yaml
│   ├── main.py
│   └── requirements.txt
├── browser-use/
│   └── ...
└── .cache/              # 技能快取
```

### 技能與 LLM 的互動

技能以 **Tool Use / Function Calling** 的方式與 LLM 互動：

```json
// LLM 收到的技能定義（自動從 manifest.yaml 生成）
{
  "type": "function",
  "function": {
    "name": "web_search",
    "description": "搜尋網路上的資訊",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "搜尋關鍵字"
        },
        "num_results": {
          "type": "integer",
          "description": "回傳結果數量",
          "default": 5
        }
      },
      "required": ["query"]
    }
  }
}
```

---

## 各層之間的通訊

### 內部通訊協定

各層之間透過 **內部事件匯流排（Event Bus）** 溝通：

| 事件 | 來源 | 目標 | 說明 |
|------|------|------|------|
| `message.received` | Gateway | Reasoning | 收到新訊息 |
| `message.send` | Reasoning | Gateway | 發送回應到通訊平台 |
| `memory.read` | Reasoning | Memory | 查詢記憶 |
| `memory.write` | Reasoning | Memory | 寫入新記憶 |
| `skill.invoke` | Reasoning | Skills | 呼叫技能 |
| `skill.result` | Skills | Reasoning | 技能執行結果 |
| `skill.error` | Skills | Reasoning | 技能執行失敗 |

### 請求-回應流程範例

以「幫我查一下明天台北的天氣」為例：

```
1. 使用者在 Telegram 發送訊息
2. Telegram Adapter 接收 → 轉換為統一格式
3. Gateway 將訊息推入佇列
4. Reasoning Layer 取出訊息
5. Context Window Manager 組裝上下文
   - SOUL.md
   - 最近 5 輪對話
   - 使用者偏好（記得在台北）
6. LLM Router → 送交 Claude
7. Claude 判斷需要呼叫 weather skill
8. Tool Selection → weather skill
9. Permission Enforcer 檢查權限 ✅
10. 建立 Podman container
11. weather skill 呼叫天氣 API
12. 回傳天氣資料
13. Claude 根據天氣資料生成回應
14. Memory 寫入本次對話
15. Gateway 透過 Telegram Adapter 發送回應
```

---

## 效能考量

### 延遲分析

| 階段 | 典型延遲 | 瓶頸因素 |
|------|---------|---------|
| Gateway 接收 | < 10ms | 網路延遲 |
| 上下文組裝 | 50-200ms | 記憶查詢 |
| LLM 推理 | 1-10s | 模型大小、API 延遲 |
| 技能執行 | 100ms-30s | 外部 API、容器啟動 |
| Gateway 回傳 | < 10ms | 網路延遲 |
| **總計** | **1.5-40s** | 主要取決於 LLM |

### 容器啟動最佳化

```yaml
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  optimization:
    # 預熱容器池——避免冷啟動延遲
    warm_pool_size: 3
    # 容器重複使用
    reuse_containers: true
    reuse_timeout_seconds: 300
```

---

## 延伸閱讀

- [API 參考](/docs/architecture/api-reference) — Gateway REST API 完整文件
- [安全性最佳實踐](/docs/security/best-practices) — 各層的安全設定
- [威脅模型分析](/docs/security/threat-model) — 各層的安全威脅分析
