---
title: "생산성 Skills"
sidebar_position: 2
description: "OpenClaw 생산성 Skills 완전 평가: Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize"
---

# 생산성 Skills (Productivity)

생산성 Skills 是多數사용자설치 OpenClaw 後的第一站。這些 Skills 讓你的 AI Agent 能直接操作郵件、行事曆、筆記與任務管理工具，將日常重複工作自動化。

---

## #3 — GOG (General Organizer for Grit)

| 屬性 | 內容 |
|------|------|
| **排名** | #3 / 50 |
| **類別** | Productivity |
| **總分** | 68 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社群** | 官方 (Official) |
| **설치方式** | `clawhub install openclaw/gog` |
| **ClawHub 다운로드量** | 最高（所有 Skills 中第一名） |
| **目標사용자** | 所有 OpenClaw 사용자 |

### 기능 설명

GOG 是 OpenClaw 生態系中**다운로드量最高**的 Skill。它提供一個統一的「組織器」介面，讓 Agent 能夠：

- 自動整理你的檔案、筆記、書籤
- 생성與追蹤待辦事項和提醒
- 跨工具彙整資訊（結合 Gmail、Calendar 等 Skill 的輸出）
- 產生每日/每週요약報告

### 중요한 이유

GOG 是「黏著劑」Skill — 它把其他 Skills 的輸出串聯起來，形成統一的工作流。沒有 GOG，你的 Agent 只能各做各的；有了 GOG，Agent 能主動整合並排序你的任務。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** |

### 설치 및 설정

```bash
clawhub install openclaw/gog

# 確認설치
clawhub list --installed | grep gog

# 初次설정（互動式）
openclaw skill configure gog
```

### 의존성 및 보안

- **依賴**：無外部依賴，獨立運行
- **권한需求**：檔案系統讀寫（限定工作目錄）
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
| **설치方式** | 內建（bundled），無需설치 |
| **目標사용자** | 需要 Email 自動化的사용자 |

### 기능 설명

Gmail Skill 隨 OpenClaw 核心一同설치，提供完整的 Email 管理能力：

- 讀取、검색、分類收件匣
- 撰寫與發送郵件（支援草稿심사模式）
- 自動답변常見郵件類型
- 附件處理（업로드/다운로드/解析）
- 標籤管理與篩選器생성

### 중요한 이유

Email 仍是職場最核心的커뮤니케이션管道。讓 Agent 處理收件匣能節省每天 30–60 分鐘。搭配 Summarize Skill 可自動產生每日郵件요약。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** |

### 설정 방법

```bash
# Gmail 為內建 Skill，只需授權
openclaw auth google --scope gmail

# 검증授權
openclaw skill status gmail
```

:::warning 보안 고려사항
Gmail Skill 可讀取你的所有郵件內容。建議：
- 啟用 **draft-only mode**（`openclaw config set gmail.send_mode draft`），讓 Agent 只能생성草稿
- 설정 **sender whitelist**，限制自動답변對象
- 定期在 Google 安全性설정中심사應用程式存取權
:::

### 의존성 및 보안

- **依賴**：Google OAuth 2.0 授權
- **권한需求**：`gmail.readonly` + `gmail.send`（可限縮為 `gmail.readonly`）
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
| **설치方式** | 內建（bundled），無需설치 |
| **目標사용자** | 需要行事曆管理的사용자 |

### 기능 설명

支援 Google Calendar 與 CalDAV 協定的行事曆管理 Skill：

- 查詢、생성、수정、삭제行程
- 衝突偵測與自動스케줄링建議
- 跨日曆彙整（個人 + 工作）
- 會議提醒與準備事項自動產生
- 時區智慧轉換

### 중요한 이유

結合 Gmail Skill，Agent 可以自動從郵件中擷取會議邀請、安排後續追蹤行程。這是打造完整「個人助理」的基礎。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** |

### 설정 방법

```bash
# 與 Gmail 共用 Google OAuth
openclaw auth google --scope calendar

# 或使用 CalDAV（如 iCloud、Fastmail）
openclaw skill configure calendar --provider caldav \
  --url https://caldav.example.com/user/calendar \
  --username you@example.com
```

### 의존성 및 보안

- **依賴**：Google OAuth 2.0 或 CalDAV 서버
- **권한需求**：`calendar.events`（讀寫）
- **安全性**：SEC 8/10 — 行事曆데이터敏感度較郵件低
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
| **설치方式** | `clawhub install community/obsidian-claw` |
| **目標사용자** | Obsidian 사용자、知識工作者 |

### 기능 설명

讓 OpenClaw Agent 直接操作你的 Obsidian Vault：

- 생성、編輯、검색筆記
- 管理 backlinks 和 tags
- 自動產生 daily notes
- 依據對話內容생성新筆記
- 支援 Dataview 查詢語法

### 중요한 이유

Obsidian 是許多知識工作者的第二大腦。透過這個 Skill，Agent 可以在對話中直接引用你的筆記，也能把리서치成果自動存入 Vault，形成「對話即筆記」的工作流。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** |

### 설치 및 설정

```bash
clawhub install community/obsidian-claw

# 설정 Vault 路徑
openclaw skill configure obsidian-claw \
  --vault-path ~/Documents/MyVault
```

### 의존성 및 보안

- **依賴**：本機 Obsidian Vault（不需 Obsidian App 運行）
- **권한需求**：Vault 目錄的檔案系統讀寫
- **安全性**：SEC 8/10 — 純本機操作，不傳輸데이터到外部
- **替代方案**：Notion Skill（#13）適合偏好雲端協作的사용자

---

## #13 — Notion

| 屬性 | 內容 |
|------|------|
| **排名** | #13 / 50 |
| **類別** | Productivity |
| **總分** | 59 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/notion-claw` |
| **目標사용자** | Notion 사용자、團隊協作需求 |

### 기능 설명

透過 Notion API 讓 Agent 管理你的 Notion workspace：

- 생성、編輯頁面與데이터庫
- 查詢데이터庫並篩選結果
- 管理 Kanban 看板狀態
- 自動從對話생성會議紀錄
- 엑스포트頁面內容為 Markdown

### 중요한 이유

Notion 是許多團隊的知識庫和專案管理中心。讓 Agent 能直接與 Notion 互動，等於把 AI 嵌入了團隊的核心工作流。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** |

### 설치 및 설정

```bash
clawhub install community/notion-claw

# 설정 Notion Integration Token
openclaw skill configure notion-claw \
  --token ntn_xxxxxxxxxxxxx
```

:::warning 권한 주의
생성 Notion Integration 時，請只授予 Agent 需要的頁面/데이터庫存取權，避免授權整個 workspace。
:::

### 의존성 및 보안

- **依賴**：Notion API Key（Integration Token）
- **권한需求**：依 Integration 설정的頁面範圍
- **安全性**：SEC 8/10 — 可透過 Notion Integration 精細控制권한
- **替代方案**：Obsidian（#9）適合偏好本機離線的사용자

---

## #17 — Todoist

| 屬性 | 內容 |
|------|------|
| **排名** | #17 / 50 |
| **類別** | Productivity |
| **總分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/todoist-claw` |
| **目標사용자** | Todoist 사용자、GTD 實踐者 |

### 기능 설명

完整的 Todoist 任務管理整合：

- 생성、完成、스케줄링任務
- 管理專案和標籤
- 설정優先順序與到期日
- 自然語言輸入（「明天下午三點提醒我回信」）
- 每日任務彙報

### 중요한 이유

對 GTD 工作法的사용자來說，Todoist 是任務管理核心。Agent 能在對話過程中自動생성 follow-up 任務，確保沒有事項遺漏。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 6 | 7 | 8 | 8 | 8 | 6 | **58** |

### 설치 및 설정

```bash
clawhub install community/todoist-claw

# 설정 API Token
openclaw skill configure todoist-claw \
  --api-token your_todoist_api_token
```

### 의존성 및 보안

- **依賴**：Todoist API Token
- **권한需求**：全部任務讀寫
- **安全性**：SEC 8/10 — 任務데이터敏感度較低
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
| **설치方式** | `clawhub install community/summarize` |
| **目標사용자** | 資訊過載的知識工作者 |

### 기능 설명

將長篇內容轉換為結構化요약：

- 網頁文章요약
- PDF / 문서요약
- 郵件串요약
- 會議逐字稿요약
- 自訂요약格式（bullet points、段落、表格）

### 중요한 이유

요약是 AI Agent 最自然的能力之一。這個 Skill 把「幫我요약」標準化為一個可重複呼叫的工具，搭配 Web Browsing 或 Gmail Skill 效果尤佳。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 7 | 7 | 6 | 7 | 9 | 6 | **58** |

### 설치 및 설정

```bash
clawhub install community/summarize

# 使用예시
openclaw run "幫我요약這個網頁：https://example.com/article"
```

### 의존성 및 보안

- **依賴**：無外部依賴（使用 OpenClaw 核心 LLM）
- **권한需求**：無額外권한
- **安全性**：SEC 9/10 — 不存取外部服務，純文字處理
- **替代方案**：直接在對話中請 Agent 요약即可，但此 Skill 提供標準化格式和批次處理

---

## #31 — Things 3

| 屬性 | 內容 |
|------|------|
| **排名** | #31 / 50 |
| **類別** | Productivity |
| **總分** | 53 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/things3-claw` |
| **目標사용자** | macOS / iOS 사용자、Things 3 愛好者 |

### 기능 설명

透過 Things 3 URL Scheme 和 AppleScript 整合任務管理：

- 생성新任務和專案
- 설정到期日、標籤、區域
- 查詢 Today、Upcoming 清單
- 完成和移動任務
- 支援 Heading 結構

### 중요한 이유

Things 3 是 macOS 生態系中最受好評的任務管理 App 之一。這個 Skill 讓 Apple 生態系的사용자不必離開慣用工具，就能享受 AI Agent 自動化的好處。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 5 | 7 | 7 | 8 | 8 | 5 | **53** |

### 설치 및 설정

```bash
clawhub install community/things3-claw

# 需要 Things 3 已설치於本機
# macOS 限定
openclaw skill configure things3-claw
```

:::warning 플랫폼 제한
Things 3 Skill 僅支援 macOS，且需要本機설치 Things 3 App（付費軟體）。跨平台사용자建議改用 Todoist（#17）。
:::

### 의존성 및 보안

- **依賴**：Things 3 App（macOS 限定）
- **권한需求**：AppleScript / Automation 권한
- **安全性**：SEC 8/10 — 本機操作，不涉及網路傳輸
- **替代方案**：Todoist（#17）跨平台、Trello（#41）團隊協作

---

## 생산성 Skills 組合推薦

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
# 加上 Slack Skill（見커뮤니케이션篇）
```

### Apple 生態系사용자

```bash
clawhub install openclaw/gog
clawhub install community/things3-claw
clawhub install community/obsidian-claw
# 搭配 Calendar（CalDAV 模式連接 iCloud）
```
