---
sidebar_position: 2
title: "生產力 Skills"
description: "OpenClaw 生產力類 Skills 完整評測：Gmail、Calendar、Obsidian、Notion、Todoist、GOG、Things 3、Summarize"
keywords: [OpenClaw, Skills, 生產力, Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize]
---

# 生產力 Skills (Productivity)

生產力類 Skills 是多數使用者安裝 OpenClaw 後的第一站。這些 Skills 讓你的 AI Agent 能直接操作郵件、行事曆、筆記與任務管理工具，將日常重複工作自動化。

---

## #3 — GOG (General Organizer for Grit)

| 屬性 | 內容 |
|------|------|
| **排名** | #3 / 50 |
| **類別** | Productivity |
| **總分** | 68 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社群** | 官方 (Official) |
| **安裝方式** | `clawhub install openclaw/gog` |
| **ClawHub 下載量** | 最高（所有 Skills 中第一名） |
| **目標使用者** | 所有 OpenClaw 使用者 |

### 功能說明

GOG 是 OpenClaw 生態系中**下載量最高**的 Skill。它提供一個統一的「組織器」介面，讓 Agent 能夠：

- 自動整理你的檔案、筆記、書籤
- 建立與追蹤待辦事項和提醒
- 跨工具彙整資訊（結合 Gmail、Calendar 等 Skill 的輸出）
- 產生每日/每週摘要報告

### 為什麼重要

GOG 是「黏著劑」Skill — 它把其他 Skills 的輸出串聯起來，形成統一的工作流。沒有 GOG，你的 Agent 只能各做各的；有了 GOG，Agent 能主動整合並排序你的任務。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** |

### 安裝與設定

```bash
clawhub install openclaw/gog

# 確認安裝
clawhub list --installed | grep gog

# 初次設定（互動式）
openclaw skill configure gog
```

### 依賴與安全

- **依賴**：無外部依賴，獨立運行
- **權限需求**：檔案系統讀寫（限定工作目錄）
- **安全性**：官方維護，程式碼開源，SEC 評分 8/10
- **替代方案**：Notion + Todoist 組合可達到類似效果，但整合度不如 GOG

---

## #5 — Gmail

| 屬性 | 內容 |
|------|------|
| **排名** | #5 / 50 |
| **類別** | Productivity |
| **總分** | 66 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社群** | 官方（內建） |
| **安裝方式** | 內建（bundled），無需安裝 |
| **目標使用者** | 需要 Email 自動化的使用者 |

### 功能說明

Gmail Skill 隨 OpenClaw 核心一同安裝，提供完整的 Email 管理能力：

- 讀取、搜尋、分類收件匣
- 撰寫與發送郵件（支援草稿審核模式）
- 自動回覆常見郵件類型
- 附件處理（上傳/下載/解析）
- 標籤管理與篩選器建立

### 為什麼重要

Email 仍是職場最核心的通訊管道。讓 Agent 處理收件匣能節省每天 30–60 分鐘。搭配 Summarize Skill 可自動產生每日郵件摘要。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** |

### 設定方式

```bash
# Gmail 為內建 Skill，只需授權
openclaw auth google --scope gmail

# 驗證授權
openclaw skill status gmail
```

:::warning 安全考量
Gmail Skill 可讀取你的所有郵件內容。建議：
- 啟用 **draft-only mode**（`openclaw config set gmail.send_mode draft`），讓 Agent 只能建立草稿
- 設定 **sender whitelist**，限制自動回覆對象
- 定期在 Google 安全性設定中審核應用程式存取權
:::

### 依賴與安全

- **依賴**：Google OAuth 2.0 授權
- **權限需求**：`gmail.readonly` + `gmail.send`（可限縮為 `gmail.readonly`）
- **安全性**：SEC 7/10 — 可存取敏感郵件內容，建議啟用 draft-only mode
- **替代方案**：AgentMail（#24）提供隔離的 Agent 專用信箱

---

## #6 — Calendar

| 屬性 | 內容 |
|------|------|
| **排名** | #6 / 50 |
| **類別** | Productivity |
| **總分** | 65 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社群** | 官方（內建） |
| **安裝方式** | 內建（bundled），無需安裝 |
| **目標使用者** | 需要行事曆管理的使用者 |

### 功能說明

支援 Google Calendar 與 CalDAV 協定的行事曆管理 Skill：

- 查詢、建立、修改、刪除行程
- 衝突偵測與自動排程建議
- 跨日曆彙整（個人 + 工作）
- 會議提醒與準備事項自動產生
- 時區智慧轉換

### 為什麼重要

結合 Gmail Skill，Agent 可以自動從郵件中擷取會議邀請、安排後續追蹤行程。這是打造完整「個人助理」的基礎。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** |

### 設定方式

```bash
# 與 Gmail 共用 Google OAuth
openclaw auth google --scope calendar

# 或使用 CalDAV（如 iCloud、Fastmail）
openclaw skill configure calendar --provider caldav \
  --url https://caldav.example.com/user/calendar \
  --username you@example.com
```

### 依賴與安全

- **依賴**：Google OAuth 2.0 或 CalDAV 伺服器
- **權限需求**：`calendar.events`（讀寫）
- **安全性**：SEC 8/10 — 行事曆資料敏感度較郵件低
- **替代方案**：Things 3 Skill 可做簡易時程管理，但不支援完整行事曆協定

---

## #9 — Obsidian

| 屬性 | 內容 |
|------|------|
| **排名** | #9 / 50 |
| **類別** | Productivity |
| **總分** | 62 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/obsidian-claw` |
| **目標使用者** | Obsidian 使用者、知識工作者 |

### 功能說明

讓 OpenClaw Agent 直接操作你的 Obsidian Vault：

- 建立、編輯、搜尋筆記
- 管理 backlinks 和 tags
- 自動產生 daily notes
- 依據對話內容建立新筆記
- 支援 Dataview 查詢語法

### 為什麼重要

Obsidian 是許多知識工作者的第二大腦。透過這個 Skill，Agent 可以在對話中直接引用你的筆記，也能把研究成果自動存入 Vault，形成「對話即筆記」的工作流。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** |

### 安裝與設定

```bash
clawhub install community/obsidian-claw

# 設定 Vault 路徑
openclaw skill configure obsidian-claw \
  --vault-path ~/Documents/MyVault
```

### 依賴與安全

- **依賴**：本機 Obsidian Vault（不需 Obsidian App 運行）
- **權限需求**：Vault 目錄的檔案系統讀寫
- **安全性**：SEC 8/10 — 純本機操作，不傳輸資料到外部
- **替代方案**：Notion Skill（#13）適合偏好雲端協作的使用者

---

## #13 — Notion

| 屬性 | 內容 |
|------|------|
| **排名** | #13 / 50 |
| **類別** | Productivity |
| **總分** | 59 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/notion-claw` |
| **目標使用者** | Notion 使用者、團隊協作需求 |

### 功能說明

透過 Notion API 讓 Agent 管理你的 Notion workspace：

- 建立、編輯頁面與資料庫
- 查詢資料庫並篩選結果
- 管理 Kanban 看板狀態
- 自動從對話建立會議紀錄
- 匯出頁面內容為 Markdown

### 為什麼重要

Notion 是許多團隊的知識庫和專案管理中心。讓 Agent 能直接與 Notion 互動，等於把 AI 嵌入了團隊的核心工作流。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** |

### 安裝與設定

```bash
clawhub install community/notion-claw

# 設定 Notion Integration Token
openclaw skill configure notion-claw \
  --token ntn_xxxxxxxxxxxxx
```

:::warning 權限提醒
建立 Notion Integration 時，請只授予 Agent 需要的頁面/資料庫存取權，避免授權整個 workspace。
:::

### 依賴與安全

- **依賴**：Notion API Key（Integration Token）
- **權限需求**：依 Integration 設定的頁面範圍
- **安全性**：SEC 8/10 — 可透過 Notion Integration 精細控制權限
- **替代方案**：Obsidian（#9）適合偏好本機離線的使用者

---

## #17 — Todoist

| 屬性 | 內容 |
|------|------|
| **排名** | #17 / 50 |
| **類別** | Productivity |
| **總分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/todoist-claw` |
| **目標使用者** | Todoist 使用者、GTD 實踐者 |

### 功能說明

完整的 Todoist 任務管理整合：

- 建立、完成、排程任務
- 管理專案和標籤
- 設定優先順序與到期日
- 自然語言輸入（「明天下午三點提醒我回信」）
- 每日任務彙報

### 為什麼重要

對 GTD 工作法的使用者來說，Todoist 是任務管理核心。Agent 能在對話過程中自動建立 follow-up 任務，確保沒有事項遺漏。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 6 | 7 | 8 | 8 | 8 | 6 | **58** |

### 安裝與設定

```bash
clawhub install community/todoist-claw

# 設定 API Token
openclaw skill configure todoist-claw \
  --api-token your_todoist_api_token
```

### 依賴與安全

- **依賴**：Todoist API Token
- **權限需求**：全部任務讀寫
- **安全性**：SEC 8/10 — 任務資料敏感度較低
- **替代方案**：Things 3（#31，macOS 限定）、Trello（#41）

---

## #19 — Summarize

| 屬性 | 內容 |
|------|------|
| **排名** | #19 / 50 |
| **類別** | Productivity / Research |
| **總分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/summarize` |
| **目標使用者** | 資訊過載的知識工作者 |

### 功能說明

將長篇內容轉換為結構化摘要：

- 網頁文章摘要
- PDF / 文件摘要
- 郵件串摘要
- 會議逐字稿摘要
- 自訂摘要格式（bullet points、段落、表格）

### 為什麼重要

摘要是 AI Agent 最自然的能力之一。這個 Skill 把「幫我摘要」標準化為一個可重複呼叫的工具，搭配 Web Browsing 或 Gmail Skill 效果尤佳。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 7 | 7 | 6 | 7 | 9 | 6 | **58** |

### 安裝與設定

```bash
clawhub install community/summarize

# 使用範例
openclaw run "幫我摘要這個網頁：https://example.com/article"
```

### 依賴與安全

- **依賴**：無外部依賴（使用 OpenClaw 核心 LLM）
- **權限需求**：無額外權限
- **安全性**：SEC 9/10 — 不存取外部服務，純文字處理
- **替代方案**：直接在對話中請 Agent 摘要即可，但此 Skill 提供標準化格式和批次處理

---

## #31 — Things 3

| 屬性 | 內容 |
|------|------|
| **排名** | #31 / 50 |
| **類別** | Productivity |
| **總分** | 53 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/things3-claw` |
| **目標使用者** | macOS / iOS 使用者、Things 3 愛好者 |

### 功能說明

透過 Things 3 URL Scheme 和 AppleScript 整合任務管理：

- 建立新任務和專案
- 設定到期日、標籤、區域
- 查詢 Today、Upcoming 清單
- 完成和移動任務
- 支援 Heading 結構

### 為什麼重要

Things 3 是 macOS 生態系中最受好評的任務管理 App 之一。這個 Skill 讓 Apple 生態系的使用者不必離開慣用工具，就能享受 AI Agent 自動化的好處。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 5 | 7 | 7 | 8 | 8 | 5 | **53** |

### 安裝與設定

```bash
clawhub install community/things3-claw

# 需要 Things 3 已安裝於本機
# macOS 限定
openclaw skill configure things3-claw
```

:::warning 平台限制
Things 3 Skill 僅支援 macOS，且需要本機安裝 Things 3 App（付費軟體）。跨平台使用者建議改用 Todoist（#17）。
:::

### 依賴與安全

- **依賴**：Things 3 App（macOS 限定）
- **權限需求**：AppleScript / Automation 權限
- **安全性**：SEC 8/10 — 本機操作，不涉及網路傳輸
- **替代方案**：Todoist（#17）跨平台、Trello（#41）團隊協作

---

## 生產力 Skills 組合推薦

### 個人知識工作者

```bash
clawhub install openclaw/gog
clawhub install community/obsidian-claw
clawhub install community/summarize
# 搭配內建 Gmail + Calendar
```

### 團隊協作者

```bash
clawhub install community/notion-claw
clawhub install community/todoist-claw
# 搭配內建 Gmail + Calendar
# 加上 Slack Skill（見通訊篇）
```

### Apple 生態系使用者

```bash
clawhub install openclaw/gog
clawhub install community/things3-claw
clawhub install community/obsidian-claw
# 搭配 Calendar（CalDAV 模式連接 iCloud）
```
