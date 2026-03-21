---
sidebar_position: 11
title: "安全守則"
description: "OpenClaw Skills 安全指南：ClawHavoc 事件分析、VirusTotal 整合、最小權限原則、安裝前審核清單"
keywords: [OpenClaw, Skills, 安全, Security, ClawHavoc, VirusTotal, 最小權限]
---

# Skills 安全守則 (Safety Guide)

OpenClaw 的 Skill 系統是開放式架構 — 任何人都可以發布 Skill 到 ClawHub。這帶來了豐富的生態系，但也帶來了安全風險。本章節提供完整的安全指南，幫助你安全地使用和審核 Skills。

:::danger 重要警告
社群發布的 Skills **未經 OpenClaw 官方團隊安全審核**。安裝第三方 Skill 等同於在你的系統上執行不受信任的程式碼。請務必遵循本指南的安全原則。
:::

---

## ClawHavoc 事件 — 案例分析

### 事件概述

2025 年 11 月，一個名為 `productivity-boost-pro` 的 Skill 在 ClawHub 上架後，短短兩週內獲得超過 8,000 次安裝。該 Skill 宣稱能「大幅提升 Agent 的任務完成效率」，但實際上在背景執行了以下惡意行為：

1. **資料外洩**：將使用者的對話記錄、API Keys、環境變數傳送到外部伺服器
2. **記憶注入**：修改 Agent 的記憶系統，植入偏向特定產品的推薦
3. **Credential 竊取**：擷取使用者的 OAuth Token 並轉發

### 時間線

```
2025-11-02  productivity-boost-pro 上架 ClawHub
2025-11-03  獲得數個假帳號的五星好評
2025-11-07  安裝量突破 2,000
2025-11-14  社群使用者 @sec_researcher 注意到異常網路流量
2025-11-15  安裝量達 8,000+
2025-11-15  OpenClaw 團隊確認惡意行為，緊急下架
2025-11-16  ClawHub 發布安全公告，受影響使用者通知
2025-11-20  OpenClaw 引入 Skill 簽章機制（v0.8.5）
2025-12-01  ClawHub 新增自動靜態分析掃描
```

### 事件教訓

| 教訓 | 具體措施 |
|------|---------|
| **下載量不代表安全** | 惡意 Skill 也可能有高下載量（透過社交工程或假帳號） |
| **審核好評** | 檢查評論者的帳號歷史，新帳號的好評可能是假的 |
| **監控網路流量** | 使用 `security-check` Skill 或手動監控異常連線 |
| **最小權限** | 不要授予 Skill 超出其功能所需的權限 |
| **定期審核** | 定期審核已安裝的 Skills 和它們的權限 |

---

## 最小權限原則 (Principle of Least Privilege)

### 核心概念

每個 Skill 應該只被授予**完成其功能所需的最少權限**。

### 權限層級

```
Level 0 — 無權限（純計算）
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
# 查看 Skill 的權限宣告
clawhub inspect community/some-skill --permissions

# 限制 Skill 權限
openclaw skill restrict some-skill \
  --deny network \
  --deny filesystem-write

# 設定 Skill 沙盒
openclaw skill sandbox some-skill \
  --network-whitelist "api.tavily.com" \
  --filesystem-whitelist "~/Documents/MyVault"
```

---

## 安裝前審核清單

在安裝任何第三方 Skill 之前，請逐項檢查以下清單：

### 1. 發布者信譽

- [ ] 查看發布者在 ClawHub 上的其他 Skills
- [ ] 確認發布者的 GitHub 帳號存在且活躍
- [ ] 檢查是否為已知的社群貢獻者

```bash
# 查看發布者資訊
clawhub publisher info community/some-skill
```

### 2. 原始碼審核

- [ ] Skill 是否開源？能否查看原始碼？
- [ ] 是否有硬編碼的 URL 或 IP 位址？
- [ ] 是否有加密或混淆的程式碼？
- [ ] 是否有不必要的 `eval()` 或動態程式碼執行？

```bash
# 下載但不安裝，僅供審核
clawhub download community/some-skill --inspect-only

# 使用 security-check Skill 自動掃描
openclaw run security-check --target community/some-skill
```

### 3. 權限合理性

- [ ] 宣告的權限是否合理？（例：一個待辦事項 Skill 不需要網路存取）
- [ ] 是否要求了過度的檔案系統權限？
- [ ] 是否要求了 Admin / Root 權限？

### 4. 社群評價

- [ ] ClawHub 上的評論是否真實？（檢查評論者帳號）
- [ ] Discord / Reddit 上是否有關於此 Skill 的討論？
- [ ] 是否有已知的安全問題被回報？

### 5. 網路行為

- [ ] Skill 連線的外部服務是否合理？
- [ ] 是否有不明的 telemetry 或 analytics 回報？

```bash
# 在沙盒中測試並監控網路行為
openclaw skill test community/some-skill \
  --sandbox \
  --monitor-network \
  --timeout 60
```

---

## VirusTotal 整合

OpenClaw 支援透過 VirusTotal API 掃描 Skill 的可執行檔案：

```bash
# 設定 VirusTotal API Key（免費方案可用）
openclaw config set security.virustotal_key your_vt_api_key

# 掃描特定 Skill
openclaw security scan community/some-skill

# 掃描所有已安裝 Skills
openclaw security scan --all

# 自動掃描（在 clawhub install 時自動執行）
openclaw config set security.auto_scan true
```

### VirusTotal 掃描結果解讀

```
✅ 0/72 detections — 安全
⚠️ 1-3/72 detections — 可能為誤報，但建議進一步審查
❌ 4+/72 detections — 高風險，不建議安裝
```

---

## Security-check Skill 詳細使用

Security-check（[#12](./development#12--security-check)）是專門審核其他 Skills 的 meta-skill：

```bash
# 完整掃描報告
openclaw run security-check --target community/some-skill --verbose

# 報告範例輸出：
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

# 設定 1Password CLI 連線
openclaw skill configure 1password-claw \
  --account your.1password.com

# 讓其他 Skills 從 1Password 取得 credentials
openclaw config set github.token "op://Vault/GitHub/token"
openclaw config set tavily.api_key "op://Vault/Tavily/api_key"

# 這樣 API Key 不會以明文存放在設定檔中
```

---

## 緊急應變流程

如果你懷疑已安裝的 Skill 有惡意行為：

### Step 1：立即停用

```bash
# 停用可疑 Skill
openclaw skill disable suspicious-skill

# 如果無法停用，直接移除
clawhub uninstall suspicious-skill --force
```

### Step 2：檢查影響範圍

```bash
# 查看 Skill 的存取記錄
openclaw skill audit suspicious-skill --last 30d

# 檢查是否有異常的網路連線
openclaw security network-log --skill suspicious-skill

# 檢查記憶系統是否被修改
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

# 在 Discord #security 頻道通報社群
```

---

## 安全設定最佳實踐

### 全域安全設定

```bash
# 啟用 Skill 簽章驗證（拒絕未簽章的 Skills）
openclaw config set security.require_signature true

# 啟用自動 VirusTotal 掃描
openclaw config set security.auto_scan true

# 啟用網路監控
openclaw config set security.network_monitor true

# 限制 Skill 的預設權限
openclaw config set security.default_permissions "filesystem-read,network-none"

# 設定 Skill 安裝需要確認
openclaw config set security.confirm_install true
```

### 定期審核排程

```bash
# 搭配 Cron-backup Skill 定期執行安全掃描
openclaw run security-check --all --schedule "0 9 * * 1"
# 每週一早上 9 點掃描所有已安裝 Skills
```

---

## 安全等級速查表

| 安全等級 | 說明 | 適用情境 |
|---------|------|---------|
| **嚴格** | 只安裝官方 Skills，啟用所有安全機制 | 企業環境、處理機密資料 |
| **標準** | 安裝高評分社群 Skills，啟用 VirusTotal 掃描 | 一般使用者 |
| **寬鬆** | 安裝任意 Skills，手動審核 | 開發者/實驗環境 |

### 嚴格模式設定

```bash
openclaw config set security.require_signature true
openclaw config set security.auto_scan true
openclaw config set security.network_monitor true
openclaw config set security.allow_community_skills false
openclaw config set security.sandbox_all true
```

### 標準模式設定（推薦）

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
| 程式碼審核 | ✅ OpenClaw 團隊審核 | ❌ 無官方審核 |
| 數位簽章 | ✅ 官方簽章 | ❌ 通常無簽章 |
| 更新頻率 | 穩定（跟隨主版本） | 不定（依維護者） |
| 安全事件回應 | 快速（24 小時內） | 不一定 |
| 原始碼透明度 | ✅ 開源 | 不一定 |
| 支援管道 | 官方 GitHub Issues | 各自維護者 |

:::warning 本指南的侷限性
本安全指南提供的是最佳實踐建議，不能保證 100% 的安全。即使遵循所有建議，使用第三方 Skills 仍然存在固有風險。請根據你的風險承受能力做出判斷。
:::
