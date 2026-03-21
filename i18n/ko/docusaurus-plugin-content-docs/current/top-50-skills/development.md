---
title: "개발 도구 Skills"
sidebar_position: 3
description: "OpenClaw 개발 도구 Skills 완전 평가: GitHub, Security-check, Cron-backup, Linear, n8n, Codex Orchestration"
---

# 개발 도구 Skills (Development)

개발 도구 Skills 讓 OpenClaw Agent 深度融入軟體開發流程 — 從版本控制、Issue 管理到 CI/CD 自動化，Agent 可以成為你的 pair programmer 和 DevOps 助手。

---

## #1 — GitHub

| 屬性 | 內容 |
|------|------|
| **排名** | #1 / 50 |
| **類別** | Development |
| **總分** | 72 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社群** | 官方 (Official) |
| **설치方式** | `clawhub install openclaw/github` |
| **目標사용자** | 所有軟體개발자 |

### 기능 설명

GitHub Skill 是 OpenClaw 評分最高的 Skill，提供完整的 Git workflow 整合：

- **Repository 管理**：생성、Clone、검색 repos
- **Branch & PR workflow**：생성分支、제출 commit、開 Pull Request、Code Review
- **Issue 管理**：생성、검색、分類、指派 Issues
- **CI/CD 整合**：트리거 GitHub Actions、조회 workflow 狀態
- **Code Search**：跨 repo 검색程式碼
- **Release 管理**：생성 tag、배포 release notes

### 중요한 이유

GitHub 是全球最大的程式碼託管平台。這個 Skill 讓 Agent 成為真正的開發夥伴 — 不只是寫程式碼，還能管理整個開發流程。單一 Skill 就能覆蓋 Issue → Branch → Code → PR → Review → Merge 的完整 cycle。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** |

**排名理由**：滿分的相關性與相容性，加上 OpenClaw 官方團隊維護，品質穩定。唯一扣分點在安全性（需要 GitHub Token，具有較高권한）和學習價值（Git 概念已廣為人知）。

### 설치 및 설정

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

### 의존성 및 보안

- **依賴**：GitHub Account、Personal Access Token 或 GitHub CLI
- **권한需求**：`repo`, `workflow`, `read:org`（依功能可限縮）
- **安全性**：SEC 8/10 — 官方維護且開源，但 GitHub Token 권한範圍大，建議使用 Fine-grained PAT

:::warning Token 보안
- 使用 **Fine-grained Personal Access Token**，只授予需要的 repository 存取權
- 切勿使用 Classic PAT 的 `repo` 全域권한
- 建議搭配 1Password Skill（#23）管理 Token
:::

- **替代方案**：GitLab 사용자可改用社群的 `community/gitlab-claw`

---

## #12 — Security-check

| 屬性 | 內容 |
|------|------|
| **排名** | #12 / 50 |
| **類別** | Development |
| **總分** | 60 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/security-check` |
| **目標사용자** | 安全意識사용자、Skill 개발자 |

### 기능 설명

專門用來심사其他 Skills 安全性的 meta-skill：

- 靜態分析 Skill 原始碼，偵測可疑 API 呼叫
- 檢查권한宣告是否過度
- 偵測硬編碼的 secrets 和 tokens
- 分析網路請求目的地
- 產生安全評估報告

### 중요한 이유

OpenClaw 生態系中有大量社群 Skills，品質參差不齊。Security-check 是你설치任何第三方 Skill 前的「守門員」。詳見 [安全守則](./safety-guide) 中的 ClawHavoc 事件。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** |

### 설치 및 사용

```bash
clawhub install community/security-check

# 掃描特定 Skill
openclaw run security-check --target community/some-skill

# 掃描所有已설치 Skills
openclaw run security-check --all

# 在설치前掃描（推薦流程）
clawhub inspect community/new-skill | openclaw run security-check --stdin
```

### 의존성 및 보안

- **依賴**：無外部依賴
- **권한需求**：讀取其他 Skills 的설치目錄
- **安全性**：SEC 9/10 — 本身就是安全工具
- **替代方案**：手動심사程式碼 + VirusTotal API

---

## #14 — Linear

| 屬性 | 內容 |
|------|------|
| **排名** | #14 / 50 |
| **類別** | Development |
| **總分** | 59 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/linear-claw` |
| **目標사용자** | Linear 사용자、開發團隊 |

### 기능 설명

與 Linear 專案管理工具深度整合：

- 생성、업데이트、검색 Issues
- 管理 Cycles 和 Projects
- 狀態轉換自動化
- 從對話中自動생성 Issue
- 與 GitHub Skill 聯動：PR merge 自動關閉 Issue

### 중요한 이유

Linear 已成為許多新創和開發團隊的首選專案管理工具。GitHub Skill 處理程式碼層面，Linear Skill 則處理專案管理層面，兩者搭配覆蓋完整開發流程。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** |

### 설치 및 설정

```bash
clawhub install community/linear-claw

# 설정 Linear API Key
openclaw skill configure linear-claw \
  --api-key lin_api_xxxxxxxxxxxx \
  --default-team your-team-key
```

### 의존성 및 보안

- **依賴**：Linear API Key
- **권한需求**：Issues 讀寫
- **安全性**：SEC 8/10 — Linear API 권한粒度合理
- **替代方案**：Jira Bridge（#46）for Jira 사용자、Trello（#41）

---

## #20 — Cron-backup

| 屬性 | 內容 |
|------|------|
| **排名** | #20 / 50 |
| **類別** | Development |
| **總分** | 57 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/cron-backup` |
| **目標사용자** | 重視데이터安全的사용자 |

### 기능 설명

為 OpenClaw 的설정、記憶和 Skill 데이터提供스케줄링백업：

- 定時백업 Agent 記憶데이터
- 백업 Skill 설정 파일
- 백업對話歷史
- 支援本機和雲端저장（S3、Google Drive）
- 增量백업與版本控制

### 중요한 이유

OpenClaw 的記憶系統저장了你與 Agent 的所有互動脈絡。一旦遺失，需要大量時間重建。Cron-backup 確保你不會因為系統故障而失去這些寶貴데이터。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 8 | 5 | 8 | 7 | 8 | 8 | 6 | **57** |

### 설치 및 설정

```bash
clawhub install community/cron-backup

# 설정本機백업
openclaw skill configure cron-backup \
  --destination ~/openclaw-backups \
  --schedule "0 2 * * *"  # 每天凌晨 2 點

# 설정 S3 백업
openclaw skill configure cron-backup \
  --destination s3://my-bucket/openclaw-backups \
  --schedule "0 */6 * * *"  # 每 6 小時
```

### 의존성 및 보안

- **依賴**：cron daemon（本機）或 S3 credentials（雲端）
- **권한需求**：OpenClaw 데이터目錄讀取、백업目的地寫入
- **安全性**：SEC 8/10 — 백업內容可能包含敏感데이터，建議암호화
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
| **설치方式** | `clawhub install community/codex-orch` |
| **目標사용자** | 進階개발자、multi-agent 架構實驗者 |

### 기능 설명

讓 OpenClaw Agent 協調多個 Codex-style 子任務：

- 將大型開發任務拆分為子任務
- 平行실행多個 code generation 任務
- 結果合併與衝突解決
- 進度追蹤與失敗重試
- 與 GitHub Skill 聯動，自動생성 feature branch

### 중요한 이유

這是 OpenClaw 朝向 multi-agent 架構的實驗性 Skill。它讓單一 Agent 能「分身」處理複雜的開發專案，概念上類似 OpenAI Codex 的任務分派模式，但建構在 OpenClaw 的 Skill 系統上。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 5 | 8 | 6 | 7 | 7 | 8 | **54** |

### 설치 및 설정

```bash
clawhub install community/codex-orch

# 설정並行上限
openclaw skill configure codex-orch \
  --max-parallel 3 \
  --timeout 600
```

:::warning 실험적 Skill
Codex Orchestration 目前為 Alpha 狀態，API 可能在未來版本大幅變動。不建議用於 production 工作流。適合學習 multi-agent 架構模式。
:::

### 의존성 및 보안

- **依賴**：OpenClaw Core v0.9+, GitHub Skill（選用）
- **권한需求**：高 — 需要실행任意程式碼的권한
- **安全性**：SEC 7/10 — 並行실행增加攻擊面
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
| **설치方式** | `clawhub install community/jira-bridge` |
| **目標사용자** | 使用 Jira 的엔터프라이즈團隊 |

### 기능 설명

Atlassian Jira 的基礎整合：

- 검색和조회 Issues
- 생성和업데이트 Issues
- 轉換 Issue 狀態
- 新增留言

### 중요한 이유

Jira 仍是엔터프라이즈環境中最普遍的專案管理工具。雖然 Linear Skill 品質更好，但對於使用 Jira 的團隊來說，這是目前唯一的選擇。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **46** |

### 설치 및 설정

```bash
clawhub install community/jira-bridge

openclaw skill configure jira-bridge \
  --url https://yourcompany.atlassian.net \
  --email you@company.com \
  --api-token your_jira_api_token
```

### 의존성 및 보안

- **依賴**：Jira Cloud API Token
- **권한需求**：Issue 讀寫
- **安全性**：SEC 7/10 — Jira API Token 권한較粗
- **替代方案**：Linear（#14）品質更好，但需要團隊遷移

---

## 개발자 Skills 組合推薦

### 全端개발자

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
# 搭配 Web Browsing 查閱문서
```

### 進階實驗者

```bash
clawhub install openclaw/github
clawhub install community/codex-orch
clawhub install community/n8n-openclaw
# 多 Agent 開發流程實驗
```
