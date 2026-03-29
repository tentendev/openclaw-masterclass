---
title: OpenClaw 是什麼？完整介紹
description: 全面認識 OpenClaw — 開源自主 AI 代理平台的歷史、架構、功能與生態系統。從零到精通的第一步。
sidebar_position: 1
---

# OpenClaw 是什麼？完整介紹

**OpenClaw** 是一個開源的自主 AI 代理（Autonomous AI Agent）平台，能夠在你的本機電腦上執行，並連接超過 20 個通訊平台。它讓你擁有一個可以思考、記憶、行動的 AI 助理——而且所有資料都在你自己的掌控之中。

在亞洲社群中，OpenClaw 有個親切的暱稱叫做**「養龍蝦」**，吉祥物是一隻名為 **Molty** 的龍蝦。這個名字來自 OpenClaw 的「Claw」（螯），象徵著強大而靈活的抓取與操作能力。

:::info 關鍵數據
- GitHub Stars：**250,000+**
- ClawHub 技能市集：**13,000+ 技能**
- 支援通訊平台：**20+ 個**
- 支援 LLM 模型：**Claude、GPT、Gemini、DeepSeek、Ollama 等**
- 創始人：**Peter Steinberger**
:::

---

## 為什麼選擇 OpenClaw？

在 AI 工具遍地開花的 2026 年，OpenClaw 之所以脫穎而出，原因有五：

1. **完全本機運行**：你的對話紀錄、記憶資料、設定檔全部儲存在本機，不會上傳到任何第三方伺服器。
2. **跨平台整合**：一個 AI 代理可以同時連接 WhatsApp、Telegram、Discord、Slack、LINE、Signal、iMessage、Matrix 等平台。
3. **技能生態系統**：透過 ClawHub 技能市集（13,000+ 技能）、Pipelines 框架（541 Functions + 276 Tools）、以及 50+ MCP 連接器，打造無限擴充的 AI 能力。
4. **企業級功能**：使用者群組、RBAC 權限管理、SSO 整合（OAuth/OIDC/LDAP）、Arena 模型盲測、Knowledge Base 與 Agentic RAG。
5. **多模態互動**：不只是文字——支援語音（ElevenLabs/Deepgram/Whisper）、圖像分析、視訊通話、Canvas 畫布、Jupyter Notebook 整合。

---

## OpenClaw 的歷史：從 Clawdbot 到今天

OpenClaw 的發展經歷了三個主要階段：

### 第一階段：Clawdbot（2024 年初）

Peter Steinberger 最初開發了一個名為 **Clawdbot** 的個人專案，目的是讓 AI 能夠透過即時通訊軟體進行對話。當時的功能非常基本——僅支援 Telegram，且只能呼叫單一 LLM。

### 第二階段：Moltbot（2024 年中）

社群快速成長後，專案更名為 **Moltbot**（取自龍蝦蛻殼 "molt" 的意象），加入了記憶系統與多平台支援。這個階段奠定了四層式架構的基礎。

### 第三階段：OpenClaw（2025 年初至今）

正式更名為 **OpenClaw**，引入了 ClawHub 技能市集、沙箱執行環境、以及完整的安全架構。2025 年底突破 200K GitHub Stars，成為成長最快的開源 AI 專案之一。

---

## 四層式架構概覽

OpenClaw 採用清晰的四層架構設計，每一層各司其職：

```
┌─────────────────────────────────────────┐
│  第一層：Gateway（閘道層）               │
│  Port 18789 — 統一接收所有通訊平台訊息   │
├─────────────────────────────────────────┤
│  第二層：Reasoning Layer（推理層）       │
│  連接 LLM 模型、處理意圖識別與回應產生   │
├─────────────────────────────────────────┤
│  第三層：Memory System（記憶系統）       │
│  WAL + Markdown 壓縮、長期記憶管理       │
├─────────────────────────────────────────┤
│  第四層：Skills / Execution Layer       │
│  （技能 / 執行層）沙箱環境中執行技能     │
└─────────────────────────────────────────┘
```

### 第一層：Gateway（閘道層）

Gateway 是 OpenClaw 的入口，預設監聽 **port 18789**。它負責統一接收來自各通訊平台的訊息，將其轉換為內部標準格式後交給推理層處理。

:::danger 安全警告
Gateway 的 18789 埠是 OpenClaw 最大的攻擊面。截至 2026 年初，已有超過 **30,000 個實例**因為將此埠暴露於公開網路（綁定 `0.0.0.0`）而遭到入侵。請務必綁定到 `127.0.0.1`。詳見 [安全性最佳實踐](/docs/security/best-practices)。
:::

### 第二層：Reasoning Layer（推理層）

推理層是 OpenClaw 的大腦。它會將使用者的訊息送交所設定的 LLM 模型（如 Claude Opus 4.6、GPT-5.2 Codex 等），取得回應後決定下一步行動——可能是直接回覆、呼叫技能、或查詢記憶。

### 第三層：Memory System（記憶系統）

記憶系統採用 **WAL（Write-Ahead Log）** 加上 **Markdown 壓縮** 的混合方案。短期記憶使用 WAL 快速寫入，長期記憶則會定期壓縮為結構化的 Markdown 檔案，實現高效的上下文管理。

### 第四層：Skills / Execution Layer（技能 / 執行層）

所有技能都在**沙箱環境**中執行，防止惡意程式碼影響系統。技能可以存取網路、檔案系統（受限範圍）、以及外部 API，但都受到嚴格的權限控管。

:::tip 深入學習
想了解架構的更多細節？請前往 [架構概覽](/docs/architecture/overview) 頁面。
:::

---

## 安全性概覽

OpenClaw 的安全議題不容忽視。以下是幾個重大安全事件：

| 事件 | 說明 |
|------|------|
| **CVE-2026-25253** | Gateway 遠端程式碼執行漏洞，影響 v3.x 之前的版本 |
| **ClawHavoc 事件** | 2,400+ 個惡意技能被植入 ClawHub，後已全數移除 |
| **18789 埠暴露** | 30,000+ 個實例因錯誤設定而遭入侵 |

:::warning 使用 OpenClaw 前，請務必閱讀
安全性不是可選的。每一位使用者都應該在開始使用前閱讀 [安全性最佳實踐](/docs/security/best-practices) 與 [技能稽核清單](/docs/security/skill-audit-checklist)。
:::

---

## 誰適合使用 OpenClaw？

| 使用者類型 | 適合原因 |
|-----------|---------|
| **開發者** | 可自行開發技能、深度客製化、整合到現有工作流程 |
| **重視隱私的使用者** | 完全本機運行，資料不離開你的電腦 |
| **社群經營者** | 一個 AI 同時管理多個通訊平台的社群 |
| **自動化愛好者** | 透過技能組合實現複雜的自動化流程 |
| **企業 IT 團隊** | 可在內部網路部署，支援企業級安全設定 |

如果你只是需要一個簡單的聊天機器人，商用方案（如 ChatGPT 的現成應用）可能更適合你。OpenClaw 的強項在於**深度客製化**與**多平台整合**——它更像是一個你可以「養成」的 AI 代理，而非一個即用即棄的工具。

---

## 下一步

準備好開始了嗎？跟著這個順序，你將在 30 分鐘內啟動你的第一個 OpenClaw 實例：

1. [安裝指南](./getting-started/installation.md) — 安裝 OpenClaw 到你的系統
2. [首次設定](./getting-started/first-setup.md) — 完成初始設定
3. [連接通訊平台](./getting-started/connect-channels.md) — 連接你的第一個通訊平台
4. [選擇 AI 模型](./getting-started/choose-llm.md) — 設定 LLM 提供者
5. [SOUL.md 人格設定](./getting-started/soul-md-config.md) — 打造你的 AI 人格

---

## 探索更多

| 你想要... | 前往 |
|----------|------|
| 系統化學習 OpenClaw | [MasterClass 12 模組課程](./masterclass/overview.md) |
| 了解最新功能 | [2026 Q1 新功能總覽](./whats-new/q1-2026-features.md) |
| 設定 Pipelines 與 RAG | [功能指南](./features/overview.md) |
| 連接 Ollama / OpenAI | [整合指南](./integrations/ollama.md) |
| 部署到雲端 | [部署指南](./deployment/docker-guide.md) |
| 找到好用的 Skills | [Top 50 必裝 Skills](./top-50-skills/overview.md) |
| 加強安全性 | [安全性最佳實踐](./security/best-practices.md) |

歡迎加入超過 250,000 位開發者的行列，一起養龍蝦！
