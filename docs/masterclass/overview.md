---
title: "MasterClass 課程總覽"
sidebar_position: 1
description: "OpenClaw MasterClass 完整學習路線 — 從零到專家的 AI Agent 實戰課程"
keywords: [OpenClaw, MasterClass, 課程, AI agent, 學習路線]
---

# MasterClass 課程總覽

歡迎來到 **OpenClaw MasterClass** — 全球最完整的 OpenClaw 系統化學習課程。本課程涵蓋從基礎架構到企業級部署的所有面向，帶你從初學者成為 OpenClaw 專家。

:::tip 課程設計理念
每個模組都遵循「概念 → 實作 → 驗證」的學習循環。你不只是閱讀文件，而是動手建構真實的 AI Agent 工作流程。
:::

---

## 適合對象

| 角色 | 你會學到什麼 |
|------|-------------|
| **軟體工程師** | OpenClaw 架構原理、Skill 開發、API 整合、安全最佳實踐 |
| **DevOps / SRE** | 部署策略、容器化、監控、Production 級安全設定 |
| **AI 研究者** | Mega-prompting 策略、Memory 系統、多 Agent 協作 |
| **技術主管** | 企業級導入策略、安全評估、團隊協作模式 |
| **進階使用者** | 自動化工作流、Skill 生態系、個人化設定 |

---

## 先備知識

開始本課程前，請確認你具備以下基礎：

- **命令列操作**：熟悉 Terminal / Shell 基本指令
- **容器概念**：了解 Docker 或 Podman 的基本運作原理
- **程式設計基礎**：至少熟悉一種程式語言（JavaScript、Python、Go 等）
- **網路基礎**：了解 HTTP、WebSocket、REST API 的基本概念
- **OpenClaw 已安裝**：請先完成 [安裝指南](/docs/getting-started/installation)

:::info 硬體需求
- 至少 8 GB RAM（建議 16 GB）
- 10 GB 可用磁碟空間
- macOS 13+、Ubuntu 22.04+ 或 Windows 11（WSL2）
- 穩定的網路連線（下載 Skill 及 LLM Model 需要）
:::

---

## 課程架構

本 MasterClass 由 **12 個模組** 組成，分為三個階段：

### 階段一：核心基礎（模組 1–5）

打下堅實的基礎，理解 OpenClaw 的核心運作原理。

| 模組 | 主題 | 預估時間 |
|------|------|---------|
| [模組 1: 基礎架構](./module-01-foundations) | 四層架構、系統健康檢查、目錄結構 | 2 小時 |
| [模組 2: Gateway 深入解析](./module-02-gateway) | WebSocket 協調、訊息路由、Channel 抽象 | 2.5 小時 |
| [模組 3: Skills 系統](./module-03-skills-system) | SKILL.md 規格、Skill 生命週期、開發你的第一個 Skill | 3 小時 |
| [模組 4: ClawHub 市集](./module-04-clawhub) | 安裝、發布、審核機制、安全掃描 | 2 小時 |
| [模組 5: 持久記憶](./module-05-memory) | Write-Ahead Logging、Markdown Compaction、記憶生命週期 | 2.5 小時 |

### 階段二：進階應用（模組 6–9）

掌握進階功能，建構複雜的 AI Agent 工作流程。

| 模組 | 主題 | 預估時間 |
|------|------|---------|
| 模組 6: 自動化 | Heartbeat 系統、Cron 排程、事件驅動工作流 | 2.5 小時 |
| 模組 7: 瀏覽器整合 | 瀏覽器自動化、網頁擷取、視覺回饋 | 2 小時 |
| 模組 8: 多 Agent 協作 | Agent 間通訊、任務分配、協作模式 | 3 小時 |
| 模組 9: 安全性 | CVE-2026-25253、ClawHavoc 事件、安全加固 | 2.5 小時 |

### 階段三：生產部署（模組 10–12）

將 OpenClaw 部署到生產環境，處理企業級需求。

| 模組 | 主題 | 預估時間 |
|------|------|---------|
| 模組 10: 生產部署 | Podman 部署、反向代理、TLS、監控 | 3 小時 |
| 模組 11: 語音 & Canvas | 語音交互、Canvas 視覺化、多模態 | 2 小時 |
| 模組 12: 企業級應用 | 團隊協作、權限管理、合規性、大規模部署 | 3 小時 |

---

## 學習路線圖

```
階段一（核心基礎）              階段二（進階應用）              階段三（生產部署）
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  模組 1      │          │  模組 6      │          │  模組 10     │
│  基礎架構    │──┐       │  自動化      │──┐       │  生產部署    │
└──────────────┘  │       └──────────────┘  │       └──────────────┘
┌──────────────┐  │       ┌──────────────┐  │       ┌──────────────┐
│  模組 2      │  ├──────▶│  模組 7      │  ├──────▶│  模組 11     │
│  Gateway     │  │       │  瀏覽器      │  │       │  語音/Canvas │
└──────────────┘  │       └──────────────┘  │       └──────────────┘
┌──────────────┐  │       ┌──────────────┐  │       ┌──────────────┐
│  模組 3      │  │       │  模組 8      │  │       │  模組 12     │
│  Skills 系統 │──┤       │  多 Agent    │──┘       │  企業級      │
└──────────────┘  │       └──────────────┘          └──────────────┘
┌──────────────┐  │       ┌──────────────┐
│  模組 4      │  │       │  模組 9      │
│  ClawHub     │──┤       │  安全性      │
└──────────────┘  │       └──────────────┘
┌──────────────┐  │
│  模組 5      │──┘
│  記憶系統    │
└──────────────┘
```

---

## 如何使用本課程

### 循序漸進

建議按照模組編號依序學習。每個模組都建立在前一個模組的概念之上。

### 動手實作

每個模組都包含實作練習（標記為 `實作` 區塊）。請在你自己的 OpenClaw 環境中完成這些練習。

### 自我評量

每個模組結尾都有：
- **練習題**：開放式問題，鼓勵深度探索
- **隨堂測驗**：選擇題，快速驗證理解程度

### 社群互動

遇到問題時：
1. 查看模組內的「常見錯誤」和「疑難排解」段落
2. 到 [OpenClaw Discord](https://discord.gg/openclaw) 的 `#masterclass` 頻道提問
3. 在 [GitHub Discussions](https://github.com/openclaw/openclaw/discussions) 搜尋或發起討論

---

## 快速開始

準備好了嗎？從第一個模組開始吧！

```bash
# 確認 OpenClaw 已正確安裝
openclaw --version

# 執行系統健康檢查
openclaw doctor

# 開始你的 MasterClass 之旅
openclaw start
```

:::caution 安全提醒
在學習過程中，請始終遵守安全最佳實踐。特別注意：
- 永遠綁定 `127.0.0.1`，不要使用 `0.0.0.0`
- 優先使用 Podman 而非 Docker
- 從 ClawHub 安裝 Skill 前務必查看審核狀態
:::

**[前往模組 1: OpenClaw 基礎架構 →](./module-01-foundations)**

---

## 關於 OpenClaw

OpenClaw 是一個開源的 AI Agent 平台，由 Peter Steinberger 創建，在 GitHub 上擁有超過 **250,000 顆星**。它完全在本地運行，不依賴雲端服務（LLM API 除外），讓使用者對自己的資料保有完整的控制權。

### 核心特色

- **四層架構**：Gateway、Reasoning Layer、Memory System、Skills/Execution Layer，各層職責明確、可獨立擴展
- **ClawHub 市集**：超過 13,000 個社群貢獻的 Skills，使用 `clawhub install <author>/<skill>` 即可安裝
- **持久記憶**：透過 Write-Ahead Logging 和 Markdown Compaction，Agent 能跨對話記住重要資訊
- **沙盒安全**：所有 Skills 在隔離的容器環境中執行（建議使用 Podman），確保系統安全
- **個人化**：使用 SOUL.md 定義 Agent 的人格特質，SKILL.md 定義技能行為
- **自動化**：Heartbeat 系統支援主動通知，Cron 排程支援定時任務

### 為什麼選擇 OpenClaw

與其他 AI Agent 框架相比，OpenClaw 的優勢在於：

1. **本地優先**：資料不離開你的機器，隱私有保障
2. **生態系豐富**：13,000+ Skills 覆蓋大多數使用場景
3. **安全導向**：經歷 ClawHavoc 事件後，安全機制大幅強化
4. **社群活躍**：250K+ GitHub Stars，活躍的 Discord 與 Reddit 社群
5. **高度可設定**：從 SOUL.md 人格到記憶保留策略，一切都可以自訂

---

## 隨堂測驗：課程導覽

1. **OpenClaw 的四層架構分別是什麼？**
   - A) Frontend、Backend、Database、Cache
   - B) Gateway、Reasoning Layer、Memory System、Skills/Execution Layer
   - C) UI、API、Storage、Network
   - D) Client、Server、Queue、Worker

2. **開始 MasterClass 前，以下哪項不是必備條件？**
   - A) 命令列操作能力
   - B) 容器概念基礎
   - C) 機器學習專業知識
   - D) 網路基礎知識

3. **ClawHub 上有多少個 Skills 可供使用？**
   - A) 1,000+
   - B) 5,000+
   - C) 13,000+
   - D) 50,000+

<details>
<summary>查看答案</summary>

1. **B** — Gateway、Reasoning Layer、Memory System、Skills/Execution Layer 是 OpenClaw 的四層核心架構。
2. **C** — 機器學習專業知識不是必備條件。OpenClaw 將 LLM 的複雜性抽象化，讓你專注於應用開發。
3. **C** — ClawHub 市集目前提供超過 13,000 個社群貢獻的 Skills。

</details>
