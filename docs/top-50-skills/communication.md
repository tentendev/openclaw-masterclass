---
sidebar_position: 4
title: "通訊 Skills"
description: "OpenClaw 通訊類 Skills 完整評測：Slack、WhatsApp CLI、Telegram Bot、AgentMail、Matrix Chat"
keywords: [OpenClaw, Skills, Communication, Slack, WhatsApp, Telegram, AgentMail, Matrix]
---

# 通訊 Skills (Communication)

通訊類 Skills 讓 OpenClaw Agent 跨越不同訊息平台，成為你的統一通訊助手。從企業級 Slack 到個人 WhatsApp，Agent 都能幫你讀取、回覆和管理訊息。

---

## #7 — Slack

| 屬性 | 內容 |
|------|------|
| **排名** | #7 / 50 |
| **類別** | Communication |
| **總分** | 64 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群（steipete） |
| **安裝方式** | `clawhub install steipete/slack` |
| **目標使用者** | Slack 使用者、團隊協作 |

### 功能說明

由知名開發者 steipete 維護的 Slack 整合 Skill：

- 讀取和搜尋頻道訊息
- 發送訊息和回覆 thread
- 管理 Direct Messages
- 設定和觸發 Slack 通知
- 頻道摘要產生
- 支援 Slack Blocks 格式化訊息

### 為什麼重要

Slack 是知識工作者每天花最多時間的工具之一。讓 Agent 幫你追蹤重要頻道、摘要長 thread、自動回覆常見問題，可以大幅降低「Context switching」的成本。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | **64** |

### 安裝與設定

```bash
clawhub install steipete/slack

# 使用 Slack Bot Token 授權
openclaw skill configure slack \
  --bot-token xoxb-xxxxxxxxxxxx \
  --app-token xapp-xxxxxxxxxxxx

# 設定要監聽的頻道
openclaw skill configure slack \
  --watch-channels general,engineering,random
```

:::warning Slack Workspace 管理員權限
安裝 Slack Skill 需要 Workspace 管理員批准 Bot 應用程式。建議先在測試用的 Workspace 中驗證功能。
:::

### 依賴與安全

- **依賴**：Slack Bot Token + App Token
- **權限需求**：`channels:read`, `channels:history`, `chat:write`, `users:read`
- **安全性**：SEC 8/10 — Slack Bot 權限模型成熟，可精細控制頻道存取
- **替代方案**：Microsoft Teams 使用者可關注社群開發中的 `community/teams-claw`

---

## #24 — AgentMail

| 屬性 | 內容 |
|------|------|
| **排名** | #24 / 50 |
| **類別** | Communication |
| **總分** | 56 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/agentmail` |
| **目標使用者** | 需要 Agent 專用信箱的使用者 |

### 功能說明

為 Agent 建立獨立的受管理 Email 身份：

- 建立 Agent 專用信箱（`your-agent@agentmail.dev`）
- 收發郵件不影響你的個人信箱
- 自動回覆規則設定
- 多個 Agent 身份管理
- 與 Gmail Skill 隔離的安全信箱

### 為什麼重要

直接讓 Agent 存取你的個人 Gmail 有安全風險。AgentMail 提供一個「Agent 專用信箱」概念 — Agent 只能存取這個隔離的信箱，即使出錯也不會影響你的主要信箱。這是比 Gmail Skill 的 draft-only mode 更徹底的隔離方案。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 6 | 7 | 7 | 7 | 7 | 8 | **56** |

### 安裝與設定

```bash
clawhub install community/agentmail

# 註冊 Agent 信箱
openclaw skill configure agentmail \
  --create-identity my-agent \
  --domain agentmail.dev

# 設定自動轉寄規則（將特定郵件從個人信箱轉到 Agent 信箱）
openclaw skill configure agentmail \
  --forward-from your@gmail.com \
  --filter "subject:invoice OR subject:receipt"
```

### 依賴與安全

- **依賴**：AgentMail 服務帳號
- **權限需求**：AgentMail API（僅限 Agent 信箱）
- **安全性**：SEC 7/10 — 設計上比直接存取個人信箱安全，但依賴第三方服務
- **替代方案**：Gmail Skill + draft-only mode

---

## #26 — Telegram Bot

| 屬性 | 內容 |
|------|------|
| **排名** | #26 / 50 |
| **類別** | Communication |
| **總分** | 55 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/telegram-claw` |
| **目標使用者** | Telegram 使用者、需要行動端 Agent 互動 |

### 功能說明

將 OpenClaw Agent 包裝為 Telegram Bot：

- 透過 Telegram 與 Agent 對話
- 接收 Agent 的主動通知
- 分享檔案和圖片給 Agent 處理
- 支援群組模式（Agent 作為群組成員）
- 語音訊息轉文字處理

### 為什麼重要

Telegram Bot 讓你隨時隨地透過手機與 Agent 互動。不需要坐在電腦前，出門在外也能請 Agent 幫忙處理任務。這是最簡單的「行動端 Agent」方案。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 6 | 7 | 7 | 7 | 7 | 7 | **55** |

### 安裝與設定

```bash
clawhub install community/telegram-claw

# 1. 先從 @BotFather 取得 Bot Token
# 2. 設定 Skill
openclaw skill configure telegram-claw \
  --bot-token 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 \
  --allowed-users your_telegram_id
```

:::warning 公開存取風險
務必設定 `--allowed-users`，限制只有你的 Telegram 帳號可以與 Bot 互動。否則任何人找到你的 Bot 都能操控你的 Agent。
:::

### 依賴與安全

- **依賴**：Telegram Bot Token（從 @BotFather 取得）
- **權限需求**：Telegram Bot API
- **安全性**：SEC 7/10 — 需要嚴格設定存取控制
- **替代方案**：WhatsApp CLI（#33）, Discord Bot（社群開發中）

---

## #33 — WhatsApp CLI

| 屬性 | 內容 |
|------|------|
| **排名** | #33 / 50 |
| **類別** | Communication |
| **總分** | 52 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群（第三方） |
| **安裝方式** | `clawhub install community/whatsapp-claw` |
| **目標使用者** | WhatsApp 重度使用者 |

### 功能說明

透過 wacli（WhatsApp CLI）工具與 WhatsApp 互動：

- 讀取和發送訊息
- 群組訊息管理
- 媒體檔案收發
- 聯絡人搜尋

### 為什麼重要

在亞洲和歐洲市場，WhatsApp 是主要的即時通訊工具。這個 Skill 填補了 OpenClaw 在 WhatsApp 整合上的缺口。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 6 | 7 | 5 | 6 | 7 | 8 | **52** |

### 安裝與設定

```bash
clawhub install community/whatsapp-claw

# 需要先安裝 wacli
brew install wacli  # macOS
# 或
pip install wacli   # 跨平台

# 掃描 QR Code 登入
wacli login

# 設定 Skill
openclaw skill configure whatsapp-claw
```

:::warning 非官方 API
WhatsApp CLI 使用非官方的 WhatsApp Web API，有被封鎖帳號的風險。Meta 可能隨時變更 API 導致功能失效。建議用於個人實驗，不要用於重要的商業通訊。
:::

### 依賴與安全

- **依賴**：wacli 工具、WhatsApp 帳號
- **權限需求**：WhatsApp Web Session
- **安全性**：SEC 7/10 — 非官方 API 有帳號風險，但不傳輸資料到第三方
- **替代方案**：Telegram Bot（#26）較穩定且使用官方 API

---

## #50 — Matrix Chat

| 屬性 | 內容 |
|------|------|
| **排名** | #50 / 50 |
| **類別** | Communication |
| **總分** | 43 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/matrix-claw` |
| **目標使用者** | Matrix/Element 使用者、隱私優先者 |

### 功能說明

與 Matrix 去中心化通訊協定整合：

- 收發加密訊息
- 房間管理
- 基本的 Bot 功能

### 為什麼重要

Matrix 是開源、去中心化的通訊協定，特別受到重視隱私和開源精神的使用者歡迎。雖然目前功能有限，但對於 Matrix 社群的使用者來說是唯一選擇。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 5 | 5 | 3 | 5 | 5 | 6 | 8 | 6 | **43** |

### 安裝與設定

```bash
clawhub install community/matrix-claw

openclaw skill configure matrix-claw \
  --homeserver https://matrix.org \
  --username @your-bot:matrix.org \
  --password your_password
```

### 依賴與安全

- **依賴**：Matrix Homeserver 帳號
- **權限需求**：Matrix Client API
- **安全性**：SEC 8/10 — 支援端對端加密，隱私性最佳
- **替代方案**：Slack（#7）for 企業、Telegram（#26）for 個人

---

## 通訊 Skills 比較表

| 特性 | Slack | Telegram | WhatsApp | AgentMail | Matrix |
|------|:-----:|:--------:|:--------:|:---------:|:------:|
| 企業適用 | ✅ | ❌ | ❌ | ✅ | ✅ |
| 行動端互動 | ✅ | ✅ | ✅ | ❌ | ✅ |
| 官方 API | ✅ | ✅ | ❌ | ✅ | ✅ |
| 端對端加密 | ❌ | ✅ | ✅ | ❌ | ✅ |
| 設定難度 | 中等 | 簡單 | 複雜 | 簡單 | 複雜 |
| 成熟度 | 🟡 | 🟡 | 🟠 | 🟡 | 🟠 |

### 通訊組合推薦

```bash
# 企業團隊
clawhub install steipete/slack
clawhub install community/agentmail

# 個人使用
clawhub install community/telegram-claw
# 搭配內建 Gmail

# 隱私優先
clawhub install community/matrix-claw
clawhub install community/agentmail
```
