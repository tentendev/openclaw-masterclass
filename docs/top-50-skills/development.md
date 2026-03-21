---
sidebar_position: 3
title: "開發工具 Skills"
description: "OpenClaw 開發工具類 Skills 完整評測：GitHub、Security-check、Cron-backup、Linear、n8n、Codex Orchestration"
keywords: [OpenClaw, Skills, Development, GitHub, Security, Linear, n8n, Codex]
---

# 開發工具 Skills (Development)

開發工具類 Skills 讓 OpenClaw Agent 深度融入軟體開發流程 — 從版本控制、Issue 管理到 CI/CD 自動化，Agent 可以成為你的 pair programmer 和 DevOps 助手。

---

## #1 — GitHub

| 屬性 | 內容 |
|------|------|
| **排名** | #1 / 50 |
| **類別** | Development |
| **總分** | 72 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社群** | 官方 (Official) |
| **安裝方式** | `clawhub install openclaw/github` |
| **目標使用者** | 所有軟體開發者 |

### 功能說明

GitHub Skill 是 OpenClaw 評分最高的 Skill，提供完整的 Git workflow 整合：

- **Repository 管理**：建立、Clone、搜尋 repos
- **Branch & PR workflow**：建立分支、提交 commit、開 Pull Request、Code Review
- **Issue 管理**：建立、搜尋、分類、指派 Issues
- **CI/CD 整合**：觸發 GitHub Actions、查看 workflow 狀態
- **Code Search**：跨 repo 搜尋程式碼
- **Release 管理**：建立 tag、發布 release notes

### 為什麼重要

GitHub 是全球最大的程式碼託管平台。這個 Skill 讓 Agent 成為真正的開發夥伴 — 不只是寫程式碼，還能管理整個開發流程。單一 Skill 就能覆蓋 Issue → Branch → Code → PR → Review → Merge 的完整 cycle。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** |

**排名理由**：滿分的相關性與相容性，加上 OpenClaw 官方團隊維護，品質穩定。唯一扣分點在安全性（需要 GitHub Token，具有較高權限）和學習價值（Git 概念已廣為人知）。

### 安裝與設定

```bash
clawhub install openclaw/github

# 方法 1：使用 GitHub CLI 授權（推薦）
gh auth login
openclaw skill configure github --auth-method gh-cli

# 方法 2：使用 Personal Access Token
openclaw skill configure github \
  --token ghp_xxxxxxxxxxxx \
  --default-org your-org
```

### 依賴與安全

- **依賴**：GitHub Account、Personal Access Token 或 GitHub CLI
- **權限需求**：`repo`, `workflow`, `read:org`（依功能可限縮）
- **安全性**：SEC 8/10 — 官方維護且開源，但 GitHub Token 權限範圍大，建議使用 Fine-grained PAT

:::warning Token 安全
- 使用 **Fine-grained Personal Access Token**，只授予需要的 repository 存取權
- 切勿使用 Classic PAT 的 `repo` 全域權限
- 建議搭配 1Password Skill（#23）管理 Token
:::

- **替代方案**：GitLab 使用者可改用社群的 `community/gitlab-claw`

---

## #12 — Security-check

| 屬性 | 內容 |
|------|------|
| **排名** | #12 / 50 |
| **類別** | Development |
| **總分** | 60 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/security-check` |
| **目標使用者** | 安全意識使用者、Skill 開發者 |

### 功能說明

專門用來審核其他 Skills 安全性的 meta-skill：

- 靜態分析 Skill 原始碼，偵測可疑 API 呼叫
- 檢查權限宣告是否過度
- 偵測硬編碼的 secrets 和 tokens
- 分析網路請求目的地
- 產生安全評估報告

### 為什麼重要

OpenClaw 生態系中有大量社群 Skills，品質參差不齊。Security-check 是你安裝任何第三方 Skill 前的「守門員」。詳見 [安全守則](./safety-guide) 中的 ClawHavoc 事件。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** |

### 安裝與使用

```bash
clawhub install community/security-check

# 掃描特定 Skill
openclaw run security-check --target community/some-skill

# 掃描所有已安裝 Skills
openclaw run security-check --all

# 在安裝前掃描（推薦流程）
clawhub inspect community/new-skill | openclaw run security-check --stdin
```

### 依賴與安全

- **依賴**：無外部依賴
- **權限需求**：讀取其他 Skills 的安裝目錄
- **安全性**：SEC 9/10 — 本身就是安全工具
- **替代方案**：手動審核程式碼 + VirusTotal API

---

## #14 — Linear

| 屬性 | 內容 |
|------|------|
| **排名** | #14 / 50 |
| **類別** | Development |
| **總分** | 59 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/linear-claw` |
| **目標使用者** | Linear 使用者、開發團隊 |

### 功能說明

與 Linear 專案管理工具深度整合：

- 建立、更新、搜尋 Issues
- 管理 Cycles 和 Projects
- 狀態轉換自動化
- 從對話中自動建立 Issue
- 與 GitHub Skill 聯動：PR merge 自動關閉 Issue

### 為什麼重要

Linear 已成為許多新創和開發團隊的首選專案管理工具。GitHub Skill 處理程式碼層面，Linear Skill 則處理專案管理層面，兩者搭配覆蓋完整開發流程。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** |

### 安裝與設定

```bash
clawhub install community/linear-claw

# 設定 Linear API Key
openclaw skill configure linear-claw \
  --api-key lin_api_xxxxxxxxxxxx \
  --default-team your-team-key
```

### 依賴與安全

- **依賴**：Linear API Key
- **權限需求**：Issues 讀寫
- **安全性**：SEC 8/10 — Linear API 權限粒度合理
- **替代方案**：Jira Bridge（#46）for Jira 使用者、Trello（#41）

---

## #20 — Cron-backup

| 屬性 | 內容 |
|------|------|
| **排名** | #20 / 50 |
| **類別** | Development |
| **總分** | 57 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/cron-backup` |
| **目標使用者** | 重視資料安全的使用者 |

### 功能說明

為 OpenClaw 的設定、記憶和 Skill 資料提供排程備份：

- 定時備份 Agent 記憶資料
- 備份 Skill 設定檔
- 備份對話歷史
- 支援本機和雲端儲存（S3、Google Drive）
- 增量備份與版本控制

### 為什麼重要

OpenClaw 的記憶系統儲存了你與 Agent 的所有互動脈絡。一旦遺失，需要大量時間重建。Cron-backup 確保你不會因為系統故障而失去這些寶貴資料。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 8 | 5 | 8 | 7 | 8 | 8 | 6 | **57** |

### 安裝與設定

```bash
clawhub install community/cron-backup

# 設定本機備份
openclaw skill configure cron-backup \
  --destination ~/openclaw-backups \
  --schedule "0 2 * * *"  # 每天凌晨 2 點

# 設定 S3 備份
openclaw skill configure cron-backup \
  --destination s3://my-bucket/openclaw-backups \
  --schedule "0 */6 * * *"  # 每 6 小時
```

### 依賴與安全

- **依賴**：cron daemon（本機）或 S3 credentials（雲端）
- **權限需求**：OpenClaw 資料目錄讀取、備份目的地寫入
- **安全性**：SEC 8/10 — 備份內容可能包含敏感資料，建議加密
- **替代方案**：手動 `cp -r ~/.openclaw/data ~/backup/`

---

## #29 — Codex Orchestration

| 屬性 | 內容 |
|------|------|
| **排名** | #29 / 50 |
| **類別** | Development |
| **總分** | 54 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/codex-orch` |
| **目標使用者** | 進階開發者、multi-agent 架構實驗者 |

### 功能說明

讓 OpenClaw Agent 協調多個 Codex-style 子任務：

- 將大型開發任務拆分為子任務
- 平行執行多個 code generation 任務
- 結果合併與衝突解決
- 進度追蹤與失敗重試
- 與 GitHub Skill 聯動，自動建立 feature branch

### 為什麼重要

這是 OpenClaw 朝向 multi-agent 架構的實驗性 Skill。它讓單一 Agent 能「分身」處理複雜的開發專案，概念上類似 OpenAI Codex 的任務分派模式，但建構在 OpenClaw 的 Skill 系統上。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 5 | 8 | 6 | 7 | 7 | 8 | **54** |

### 安裝與設定

```bash
clawhub install community/codex-orch

# 設定並行上限
openclaw skill configure codex-orch \
  --max-parallel 3 \
  --timeout 600
```

:::warning 實驗性 Skill
Codex Orchestration 目前為 Alpha 狀態，API 可能在未來版本大幅變動。不建議用於 production 工作流。適合學習 multi-agent 架構模式。
:::

### 依賴與安全

- **依賴**：OpenClaw Core v0.9+, GitHub Skill（選用）
- **權限需求**：高 — 需要執行任意程式碼的權限
- **安全性**：SEC 7/10 — 並行執行增加攻擊面
- **替代方案**：手動使用 OpenClaw 的 `--fork` 模式

---

## #46 — Jira Bridge

| 屬性 | 內容 |
|------|------|
| **排名** | #46 / 50 |
| **類別** | Development |
| **總分** | 46 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/jira-bridge` |
| **目標使用者** | 使用 Jira 的企業團隊 |

### 功能說明

Atlassian Jira 的基礎整合：

- 搜尋和查看 Issues
- 建立和更新 Issues
- 轉換 Issue 狀態
- 新增留言

### 為什麼重要

Jira 仍是企業環境中最普遍的專案管理工具。雖然 Linear Skill 品質更好，但對於使用 Jira 的團隊來說，這是目前唯一的選擇。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **46** |

### 安裝與設定

```bash
clawhub install community/jira-bridge

openclaw skill configure jira-bridge \
  --url https://yourcompany.atlassian.net \
  --email you@company.com \
  --api-token your_jira_api_token
```

### 依賴與安全

- **依賴**：Jira Cloud API Token
- **權限需求**：Issue 讀寫
- **安全性**：SEC 7/10 — Jira API Token 權限較粗
- **替代方案**：Linear（#14）品質更好，但需要團隊遷移

---

## 開發者 Skills 組合推薦

### 全端開發者

```bash
clawhub install openclaw/github
clawhub install community/linear-claw
clawhub install community/security-check
clawhub install community/cron-backup
```

### 開源貢獻者

```bash
clawhub install openclaw/github
clawhub install community/security-check
# 搭配 Web Browsing 查閱文件
```

### 進階實驗者

```bash
clawhub install openclaw/github
clawhub install community/codex-orch
clawhub install community/n8n-openclaw
# 多 Agent 開發流程實驗
```
