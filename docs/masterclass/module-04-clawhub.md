---
title: "模組 4: ClawHub 市集"
sidebar_position: 5
description: "掌握 ClawHub 市集的安裝、發布、審核機制與安全掃描流程"
keywords: [OpenClaw, ClawHub, 市集, Skill 發布, VirusTotal, ClawHavoc, 安全]
---

# 模組 4: ClawHub 市集

## 學習目標

完成本模組後，你將能夠：

- 使用 `clawhub` CLI 搜尋、安裝與管理 Skills
- 理解 ClawHub 的審核機制與信任模型
- 將自己開發的 Skill 發布到 ClawHub
- 說明 ClawHavoc 事件的影響與後續安全強化措施
- 評估 Skill 的安全性，辨識潛在風險

:::info 前置條件
請先完成 [模組 3: Skills 系統與 SKILL.md 規格](./module-03-skills-system)，確保你已理解 Skill 的結構與開發方式。
:::

---

## ClawHub 概覽

**ClawHub** 是 OpenClaw 的官方 Skill 市集，類似 npm、PyPI 或 Docker Hub，但專為 AI Agent Skills 設計。截至 2026 年 3 月，ClawHub 上有超過 **13,000 個 Skills**，涵蓋生產力、開發工具、資料分析、自動化等領域。

### ClawHub 生態系統

```
開發者                    ClawHub                     使用者
┌──────────┐           ┌──────────────────┐        ┌──────────┐
│ 開發 Skill│          │                  │        │ 搜尋     │
│ ────────▶│── push ──▶│  Skill Registry  │◀─ search─│ ────────▶│
│          │          │  ┌────────────┐  │        │          │
│ SKILL.md │          │  │ 13,000+    │  │        │ 安裝     │
│ 程式碼   │          │  │  Skills    │  │        │ ────────▶│
│ 測試     │          │  └────────────┘  │        │          │
└──────────┘          │                  │        │ 評分     │
                      │  ┌────────────┐  │        │ ────────▶│
                      │  │ 審核管線   │  │        └──────────┘
                      │  │ VirusTotal │  │
                      │  │ 靜態分析   │  │
                      │  │ 簽名驗證   │  │
                      │  └────────────┘  │
                      └──────────────────┘
```

### 關鍵數據

| 指標 | 數值 |
|------|------|
| 總 Skills 數量 | 13,000+ |
| 認證開發者 | 2,800+ |
| 官方 Skills | 150+ |
| 每日安裝次數 | 45,000+ |
| 平均審核時間 | 24 小時 |
| VirusTotal 掃描率 | 100%（強制） |

---

## 使用 ClawHub CLI

### 搜尋 Skills

```bash
# 基本搜尋
clawhub search weather

# 依標籤篩選
clawhub search --tag productivity

# 依作者篩選
clawhub search --author openclaw-official

# 只顯示認證的 Skills
clawhub search weather --verified

# 依安裝數排序
clawhub search --sort downloads --limit 20
```

搜尋結果範例：

```
NAME                          AUTHOR              DOWNLOADS  RATING  VERIFIED
─────────────────────────────────────────────────────────────────────────────
weather-lookup                openclaw-official    124,500    4.9     ✓
weather-forecast-pro          weather-dev          45,200     4.7     ✓
weather-alerts                community-tools      12,300     4.5     ✓
weather-radar                 wx-enthusiast         8,700     4.3
weather-historical            data-archive          3,200     4.1
```

### 安裝 Skills

```bash
# 標準安裝
clawhub install openclaw-official/weather-lookup

# 安裝特定版本
clawhub install openclaw-official/weather-lookup@1.2.0

# 安裝並跳過互動確認（CI/CD 場景）
clawhub install openclaw-official/weather-lookup --yes

# 查看安裝前的安全報告
clawhub inspect openclaw-official/weather-lookup
```

安裝流程：

```
clawhub install openclaw-official/weather-lookup
╭─────────────────────────────────────────────╮
│  Installing weather-lookup v1.2.0           │
│  Author: openclaw-official (verified ✓)     │
│                                             │
│  Permissions requested:                     │
│    ✓ network:api.openweathermap.org         │
│    ✓ network:api.weatherapi.com             │
│                                             │
│  Security scan:                             │
│    ✓ VirusTotal: 0/72 detections            │
│    ✓ Static analysis: passed                │
│    ✓ Signature: valid (SHA-256)             │
│                                             │
│  Accept? [Y/n]                              │
╰─────────────────────────────────────────────╯
```

### 管理已安裝的 Skills

```bash
# 列出所有已安裝的 Skills
clawhub list

# 查看特定 Skill 的詳細資訊
clawhub info weather-lookup

# 更新單一 Skill
clawhub update weather-lookup

# 更新所有 Skills
clawhub update --all

# 移除 Skill
clawhub remove weather-lookup

# 查看 Skill 的變更記錄
clawhub changelog weather-lookup
```

---

## ClawHub 信任模型

ClawHub 使用多層信任模型，幫助使用者評估 Skill 的可靠性：

### 信任等級

| 等級 | 標記 | 說明 | 審核方式 |
|------|------|------|----------|
| **Official** | 🏛️ | OpenClaw 團隊開發與維護 | 內部審核 |
| **Verified** | ✓ | 認證開發者，通過完整審核 | 自動化 + 人工審核 |
| **Community** | — | 社群貢獻，通過基本掃描 | 自動化掃描 |
| **Unverified** | ⚠️ | 新發布，尚未完成審核 | 排隊中 |
| **Flagged** | 🚩 | 被社群回報有問題 | 調查中 |

:::warning 安全建議
- 優先安裝 **Official** 或 **Verified** 的 Skills
- 安裝 **Community** Skill 前，務必檢查其權限宣告
- **絕對不要** 安裝 **Flagged** 的 Skill
- 使用 `clawhub inspect` 在安裝前查看完整的安全報告
:::

### 安全掃描管線

每個上傳到 ClawHub 的 Skill 都會經過以下掃描：

```
上傳 → SHA-256 簽名驗證 → VirusTotal 掃描（72 引擎）→
靜態程式碼分析 → 權限審計 → 依賴項檢查 → 沙盒測試執行 →
[人工審核（Verified 以上）] → 發布
```

1. **簽名驗證**：確認檔案完整性，未被竄改
2. **VirusTotal 掃描**：使用 72 個防毒引擎掃描
3. **靜態分析**：檢查可疑的程式碼模式（如 `eval()`、混淆程式碼、可疑的網路請求）
4. **權限審計**：確認宣告的權限與實際程式碼一致
5. **依賴項檢查**：掃描 npm/pip 依賴項中的已知漏洞
6. **沙盒測試**：在隔離環境中執行，驗證行為符合預期

---

## ClawHavoc 事件回顧

:::danger 重大安全事件
**ClawHavoc**（2026 年 1 月）是 OpenClaw 歷史上最嚴重的供應鏈攻擊事件。攻擊者上傳了 **2,400 個惡意 Skills** 到 ClawHub，這些 Skills 偽裝成合法的工具，但暗中竊取使用者的 API Keys、環境變數與檔案。
:::

### 事件時間線

| 日期 | 事件 |
|------|------|
| 2026-01-08 | 攻擊者開始大量上傳惡意 Skills |
| 2026-01-15 | 社群成員回報異常行為 |
| 2026-01-16 | OpenClaw 團隊確認攻擊，開始調查 |
| 2026-01-17 | 緊急下架 2,400 個惡意 Skills |
| 2026-01-20 | 發布安全更新，強制 VirusTotal 掃描 |
| 2026-01-25 | 推出新的信任模型與審核管線 |
| 2026-02-01 | 所有既有 Skills 完成重新掃描 |

### ClawHavoc 後的改進

1. **強制 VirusTotal 掃描**：所有 Skills 上傳前必須通過 72 引擎掃描
2. **權限透明化**：安裝時明確顯示所有請求的權限
3. **靜態分析強化**：新增可疑模式偵測（混淆程式碼、隱藏網路請求）
4. **開發者身份驗證**：新增 Verified Developer 計畫
5. **社群回報機制**：一鍵回報可疑 Skill
6. **自動撤回**：VirusTotal 偵測率 > 0 的 Skills 自動下架

### 自我檢查

如果你在 ClawHavoc 期間安裝過 Skills，請立即執行：

```bash
# 檢查是否安裝了已知的惡意 Skills
clawhub audit

# 輸出範例：
# Auditing installed skills...
# ✓ 45/47 skills passed security check
# ⚠ 2 skills require attention:
#   - suspicious-tool v1.0.0 (REMOVED from ClawHub)
#   - fake-helper v0.3.2 (FLAGGED: potential data exfiltration)
#
# Run 'clawhub remove <skill>' to uninstall flagged skills
# Run 'clawhub audit --rotate-keys' to rotate compromised API keys

# 移除可疑 Skills 並輪換 API Keys
clawhub remove suspicious-tool fake-helper
clawhub audit --rotate-keys
```

---

## 實作：發布你的 Skill 到 ClawHub

讓我們把 [模組 3](./module-03-skills-system) 中建立的 Pomodoro Timer Skill 發布到 ClawHub。

### 步驟 1：建立 ClawHub 帳號

```bash
# 註冊帳號
clawhub register

# 或登入既有帳號
clawhub login
```

### 步驟 2：準備發布

```bash
cd ~/.openclaw/skills/local/pomodoro-timer

# 驗證 Skill 結構
clawhub validate .

# 輸出：
# Validating pomodoro-timer...
# ✓ SKILL.md: valid
# ✓ index.js: found
# ✓ Permissions: none requested (safe)
# ✓ Runtime: node:20-slim (supported)
# ✓ Version: 0.1.0 (valid semver)
# Ready to publish!
```

### 步驟 3：撰寫 README.md（給 ClawHub 頁面）

```bash
cat > README.md << 'EOF'
# Pomodoro Timer Skill

A simple yet effective Pomodoro timer for OpenClaw.

## Features

- Start, pause, and reset Pomodoro sessions
- Customizable work and break durations
- Session tracking and statistics
- Multi-language support (zh-TW, en, ja)

## Usage

Just tell your OpenClaw agent:

- "開始一個番茄鐘" (Start a Pomodoro)
- "番茄鐘狀態" (Check status)
- "暫停番茄鐘" (Pause)
- "重置番茄鐘" (Reset)

## Installation

```bash
clawhub install your-username/pomodoro-timer
```

## License

MIT
EOF
```

### 步驟 4：發布

```bash
# 發布到 ClawHub
clawhub publish .

# 輸出：
# Publishing pomodoro-timer v0.1.0...
# ✓ Package created (12.3 KB)
# ✓ SHA-256 signature generated
# ✓ Uploaded to ClawHub
# ✓ VirusTotal scan queued
#
# Your skill is now available at:
# https://clawhub.dev/your-username/pomodoro-timer
#
# Note: Full security scan takes ~24 hours.
# Status: Unverified → Community (after scan passes)
```

### 步驟 5：管理已發布的 Skill

```bash
# 查看你發布的所有 Skills
clawhub my-skills

# 查看下載統計
clawhub stats pomodoro-timer

# 發布更新版本
# 1. 修改 SKILL.md 中的 version
# 2. 重新發布
clawhub publish . --bump patch  # 0.1.0 → 0.1.1

# 撤回特定版本
clawhub unpublish pomodoro-timer@0.1.0

# 轉移所有權
clawhub transfer pomodoro-timer --to new-owner
```

---

## Skill 評分與回饋

### 評分機制

ClawHub 使用五星評分制搭配文字評論：

```bash
# 為 Skill 評分
clawhub rate weather-lookup --stars 5 --comment "非常好用，回應快速！"

# 查看評論
clawhub reviews weather-lookup

# 回報問題
clawhub report weather-lookup --reason "suspicious-behavior" \
  --details "Skill 嘗試存取未宣告的 network endpoint"
```

### 選擇 Skill 的檢查清單

安裝社群 Skill 前，建議依照以下清單評估：

- [ ] 信任等級是否為 Verified 以上？
- [ ] 權限宣告是否合理？（搜尋 Skill 不應需要 filesystem:write）
- [ ] 評分是否 4.0 以上？
- [ ] 最近一次更新是否在 6 個月內？
- [ ] 是否有足夠的下載量與評論？
- [ ] 程式碼是否開源可審查？
- [ ] `clawhub inspect` 的報告是否無異常？

---

## 常見錯誤與疑難排解

### 錯誤 1：發布失敗 — 名稱已被佔用

```
Error: Skill name 'weather-lookup' is already taken
```

**解法**：選擇不同的名稱，或加上你的命名空間前綴（如 `your-username/my-weather-lookup`）。

### 錯誤 2：VirusTotal 掃描未通過

```
Error: VirusTotal detected 2/72 positives
```

**解法**：
```bash
# 查看詳細報告
clawhub scan-report pomodoro-timer

# 如果是誤判，可以提出申訴
clawhub appeal pomodoro-timer --reason "False positive: detected pattern is standard API call"
```

### 錯誤 3：安裝失敗 — 版本衝突

```
Error: Dependency conflict: skill-a requires node:18 but skill-b requires node:20
```

**解法**：每個 Skill 在獨立容器中執行，Runtime 衝突通常不會發生。如果遇到，請更新到最新版本。

### 錯誤 4：權限審計失敗

```
Error: Permission audit failed: code accesses 'api.hidden-endpoint.com' but only declares 'api.example.com'
```

**解法**：在 SKILL.md 中正確宣告所有網路存取目標。

---

## 練習題

1. **Skill 探索**：使用 `clawhub search` 找出下載量前 10 名的 Skills，並分析它們的共同特徵（權限需求、功能類型、作者分布）。

2. **安全審計**：對你已安裝的所有 Skills 執行 `clawhub audit`，記錄結果並處理任何警告。

3. **發布練習**：將你在模組 3 開發的 Pomodoro Timer 發布到 ClawHub（可以是測試環境），完成從開發到發布的完整流程。

4. **評估練習**：選擇 5 個 Community 等級的 Skills，使用本模組介紹的檢查清單評估它們的安全性，並記錄你的判斷。

---

## 隨堂測驗

1. **ClawHub 上目前有多少個 Skills？**
   - A) 5,000+
   - B) 8,000+
   - C) 13,000+
   - D) 20,000+

2. **安裝 Skill 的正確指令是？**
   - A) `openclaw install weather-lookup`
   - B) `clawhub install openclaw-official/weather-lookup`
   - C) `npm install weather-lookup`
   - D) `pip install weather-lookup`

3. **ClawHavoc 事件中，攻擊者上傳了多少個惡意 Skills？**
   - A) 100
   - B) 500
   - C) 2,400
   - D) 10,000

4. **以下哪個信任等級表示 Skill 已通過完整審核？**
   - A) Community
   - B) Unverified
   - C) Verified
   - D) Flagged

5. **ClawHavoc 後，哪項安全措施變成強制性的？**
   - A) 人工審核
   - B) 兩步驗證
   - C) VirusTotal 掃描
   - D) 區塊鏈簽名

<details>
<summary>查看答案</summary>

1. **C** — ClawHub 截至 2026 年 3 月有超過 13,000 個 Skills。
2. **B** — 使用 `clawhub install <author>/<skill>` 格式安裝 Skills。
3. **C** — ClawHavoc 事件中有 2,400 個惡意 Skills 被上傳。
4. **C** — Verified 等級表示 Skill 由認證開發者發布，並通過自動化與人工審核。
5. **C** — ClawHavoc 後，VirusTotal 掃描（72 引擎）成為所有 Skill 上傳的強制要求。

</details>

---

## 建議下一步

你已經掌握了 ClawHub 市集的使用與安全概念。下一步，讓我們深入探索 OpenClaw 的記憶系統，了解 Agent 如何跨對話維持上下文。

**[前往模組 5: 持久記憶與個人化 →](./module-05-memory)**
