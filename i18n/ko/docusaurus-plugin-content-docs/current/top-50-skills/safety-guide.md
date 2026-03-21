---
title: "안전 가이드"
sidebar_position: 11
description: "OpenClaw Skills 보안 가이드: ClawHavoc 사건 분석, VirusTotal 통합, 최소 권한 원칙, 설치 전 감사 체크리스트"
---

# Skills 安全守則 (Safety Guide)

OpenClaw 的 Skill 系統是開放式架構 — 任何人都可以배포 Skill 到 ClawHub。這帶來了豐富的生態系，但也帶來了安全風險。本章節提供完整的安全가이드，幫助你安全地使用和심사 Skills。

:::danger 중요 경고
社群배포的 Skills **未經 OpenClaw 官方團隊安全심사**。설치第三方 Skill 等同於在你的系統上실행不受信任的程式碼。請務必遵循本가이드的安全原則。
:::

---

## ClawHavoc 事件 — 案例分析

### 事件概述

2025 年 11 月，一個名為 `productivity-boost-pro` 的 Skill 在 ClawHub 上架後，短短兩週內獲得超過 8,000 次설치。該 Skill 宣稱能「大幅提升 Agent 的任務完成效率」，但實際上在背景실행了以下惡意行為：

1. **데이터外洩**：將사용자的對話記錄、API Keys、環境變數傳送到外部서버
2. **記憶注入**：수정 Agent 的記憶系統，植入偏向特定產品的推薦
3. **Credential 竊取**：擷取사용자的 OAuth Token 並轉發

### 時間線

```
2025-11-02  productivity-boost-pro 上架 ClawHub
2025-11-03  獲得數個假계정的五星好評
2025-11-07  설치量突破 2,000
2025-11-14  社群사용자 @sec_researcher 注意到異常網路流量
2025-11-15  설치量達 8,000+
2025-11-15  OpenClaw 團隊確認惡意行為，緊急下架
2025-11-16  ClawHub 배포安全公告，受影響사용자通知
2025-11-20  OpenClaw 引入 Skill 簽章機制（v0.8.5）
2025-12-01  ClawHub 新增自動靜態分析掃描
```

### 事件教訓

| 教訓 | 具體措施 |
|------|---------|
| **다운로드量不代表安全** | 惡意 Skill 也可能有高다운로드量（透過社交工程或假계정） |
| **심사好評** | 檢查評論者的계정歷史，新계정的好評可能是假的 |
| **모니터링網路流量** | 使用 `security-check` Skill 或手動모니터링異常連線 |
| **最小권한** | 不要授予 Skill 超出其功能所需的권한 |
| **定期심사** | 定期심사已설치的 Skills 和它們的권한 |

---

## 最小권한原則 (Principle of Least Privilege)

### 핵심 개념

每個 Skill 應該只被授予**完成其功能所需的最少권한**。

### 권한層級

```
Level 0 — 無권한（純計算）
  例：Summarize, Prompt Library

Level 1 — 唯讀（本機）
  例：Reddit Readonly, YouTube Digest

Level 2 — 讀寫（本機）
  例：Obsidian, DuckDB CRM, Cron-backup

Level 3 — 唯讀（網路）
  例：Tavily, Felo Search, Web Browsing

Level 4 — 讀寫（網路）
  例：Gmail, GitHub, Slack, n8n

Level 5 — 系統控制
  例：Home Assistant, Browser Automation, Codex Orchestration
```

### 實際操作

```bash
# 조회 Skill 的권한宣告
clawhub inspect community/some-skill --permissions

# 限制 Skill 권한
openclaw skill restrict some-skill \
  --deny network \
  --deny filesystem-write

# 설정 Skill 沙盒
openclaw skill sandbox some-skill \
  --network-whitelist "api.tavily.com" \
  --filesystem-whitelist "~/Documents/MyVault"
```

---

## 설치前심사清單

在설치任何第三方 Skill 之前，請逐項檢查以下清單：

### 1. 배포者信譽

- [ ] 조회배포者在 ClawHub 上的其他 Skills
- [ ] 確認배포者的 GitHub 계정存在且活躍
- [ ] 檢查是否為已知的社群貢獻者

```bash
# 조회배포者資訊
clawhub publisher info community/some-skill
```

### 2. 原始碼심사

- [ ] Skill 是否開源？能否조회原始碼？
- [ ] 是否有硬編碼的 URL 或 IP 位址？
- [ ] 是否有암호화或混淆的程式碼？
- [ ] 是否有不必要的 `eval()` 或動態程式碼실행？

```bash
# 다운로드但不설치，僅供심사
clawhub download community/some-skill --inspect-only

# 使用 security-check Skill 自動掃描
openclaw run security-check --target community/some-skill
```

### 3. 권한合理性

- [ ] 宣告的권한是否合理？（例：一個待辦事項 Skill 不需要網路存取）
- [ ] 是否要求了過度的檔案系統권한？
- [ ] 是否要求了 Admin / Root 권한？

### 4. 社群평가

- [ ] ClawHub 上的評論是否真實？（檢查評論者계정）
- [ ] Discord / Reddit 上是否有關於此 Skill 的討論？
- [ ] 是否有已知的安全問題被回報？

### 5. 網路行為

- [ ] Skill 連線的外部服務是否合理？
- [ ] 是否有不明的 telemetry 或 analytics 回報？

```bash
# 在沙盒中테스트並모니터링網路行為
openclaw skill test community/some-skill \
  --sandbox \
  --monitor-network \
  --timeout 60
```

---

## VirusTotal 整合

OpenClaw 支援透過 VirusTotal API 掃描 Skill 的可실행檔案：

```bash
# 설정 VirusTotal API Key（免費方案可用）
openclaw config set security.virustotal_key your_vt_api_key

# 掃描特定 Skill
openclaw security scan community/some-skill

# 掃描所有已설치 Skills
openclaw security scan --all

# 自動掃描（在 clawhub install 時自動실행）
openclaw config set security.auto_scan true
```

### VirusTotal 掃描結果解讀

```
✅ 0/72 detections — 安全
⚠️ 1-3/72 detections — 可能為誤報，但建議進一步審查
❌ 4+/72 detections — 高風險，不建議설치
```

---

## Security-check Skill 詳細使用

Security-check（[#12](./development#12--security-check)）是專門심사其他 Skills 的 meta-skill：

```bash
# 完整掃描報告
openclaw run security-check --target community/some-skill --verbose

# 報告예시輸出：
# ┌──────────────────────────────────────────────┐
# │ Security Report: community/some-skill v1.2.3 │
# ├──────────────────────────────────────────────┤
# │ Source Code Analysis                          │
# │   ✅ No hardcoded secrets found               │
# │   ✅ No obfuscated code detected              │
# │   ⚠️  Uses eval() in line 142                 │
# │   ✅ No known vulnerability patterns          │
# │                                               │
# │ Permission Analysis                           │
# │   ✅ Requested: filesystem-read               │
# │   ⚠️  Requested: network-outbound             │
# │   ✅ No system-level permissions              │
# │                                               │
# │ Network Analysis                              │
# │   ✅ Connects to: api.service.com (known)     │
# │   ❌ Connects to: unknown-server.xyz (!)      │
# │                                               │
# │ Overall Risk: MEDIUM                          │
# │ Recommendation: Review network connections    │
# └──────────────────────────────────────────────┘
```

---

## 1Password Skill 安全整合

1Password Skill（[#23](./overview)）可用於安全管理 Skills 所需的 API Key 和 Token：

```bash
clawhub install community/1password-claw

# 설정 1Password CLI 連線
openclaw skill configure 1password-claw \
  --account your.1password.com

# 讓其他 Skills 從 1Password 取得 credentials
openclaw config set github.token "op://Vault/GitHub/token"
openclaw config set tavily.api_key "op://Vault/Tavily/api_key"

# 這樣 API Key 不會以明文存放在설정 파일中
```

---

## 緊急應變流程

如果你懷疑已설치的 Skill 有惡意行為：

### Step 1：立即停用

```bash
# 停用可疑 Skill
openclaw skill disable suspicious-skill

# 如果無法停用，直接移除
clawhub uninstall suspicious-skill --force
```

### Step 2：檢查影響範圍

```bash
# 조회 Skill 的存取記錄
openclaw skill audit suspicious-skill --last 30d

# 檢查是否有異常的網路連線
openclaw security network-log --skill suspicious-skill

# 檢查記憶系統是否被수정
openclaw memory diff --since "2026-03-01"
```

### Step 3：輪換 Credentials

```bash
# 列出可能受影響的 credentials
openclaw security credentials --exposed-by suspicious-skill

# 輪換所有相關 API Key 和 Token
# （需要到各服務的管理介面操作）
```

### Step 4：回報

```bash
# 向 ClawHub 回報惡意 Skill
clawhub report suspicious-skill --reason malware

# 在 Discord #security 채널通報社群
```

---

## 보안 설정 모범 사례

### 全域安全설정

```bash
# 啟用 Skill 簽章검증（拒絕未簽章的 Skills）
openclaw config set security.require_signature true

# 啟用自動 VirusTotal 掃描
openclaw config set security.auto_scan true

# 啟用網路모니터링
openclaw config set security.network_monitor true

# 限制 Skill 的預設권한
openclaw config set security.default_permissions "filesystem-read,network-none"

# 설정 Skill 설치需要確認
openclaw config set security.confirm_install true
```

### 定期심사스케줄링

```bash
# 搭配 Cron-backup Skill 定期실행安全掃描
openclaw run security-check --all --schedule "0 9 * * 1"
# 每週一早上 9 點掃描所有已설치 Skills
```

---

## 보안 등급 빠른 참조표

| 安全等級 | 說明 | 適用情境 |
|---------|------|---------|
| **嚴格** | 只설치官方 Skills，啟用所有安全機制 | 엔터프라이즈環境、處理機密데이터 |
| **標準** | 설치高評分社群 Skills，啟用 VirusTotal 掃描 | 一般사용자 |
| **寬鬆** | 설치任意 Skills，手動심사 | 개발자/實驗環境 |

### 嚴格模式설정

```bash
openclaw config set security.require_signature true
openclaw config set security.auto_scan true
openclaw config set security.network_monitor true
openclaw config set security.allow_community_skills false
openclaw config set security.sandbox_all true
```

### 標準模式설정（推薦）

```bash
openclaw config set security.require_signature false
openclaw config set security.auto_scan true
openclaw config set security.network_monitor true
openclaw config set security.allow_community_skills true
openclaw config set security.confirm_install true
```

---

## 官方 vs 社群 Skills 安全對比

| 項目 | 官方 Skills | 社群 Skills |
|------|:---------:|:----------:|
| 程式碼심사 | ✅ OpenClaw 團隊심사 | ❌ 無官方심사 |
| 數位簽章 | ✅ 官方簽章 | ❌ 通常無簽章 |
| 업데이트頻率 | 穩定（跟隨主版本） | 不定（依維護者） |
| 安全事件回應 | 快速（24 小時內） | 不一定 |
| 原始碼透明度 | ✅ 開源 | 不一定 |
| 支援管道 | 官方 GitHub Issues | 各自維護者 |

:::warning 이 가이드의 한계
本安全가이드提供的是最佳實踐建議，不能保證 100% 的安全。即使遵循所有建議，使用第三方 Skills 仍然存在固有風險。請根據你的風險承受能力做出判斷。
:::
