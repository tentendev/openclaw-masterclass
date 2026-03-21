---
title: "모듈 4: ClawHub 마켓플레이스"
sidebar_position: 5
description: "ClawHub 마켓플레이스의 설치, 배포, 심사 메커니즘 및 보안 스캔 프로세스 마스터하기"
---

# 模組 4: ClawHub 마켓플레이스

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- 使用 `clawhub` CLI 검색、설치與管理 Skills
- 理解 ClawHub 的심사機制與信任模型
- 將自己開發的 Skill 배포到 ClawHub
- 說明 ClawHavoc 事件的影響與後續安全強化措施
- 評估 Skill 的安全性，辨識潛在風險

:::info 선행 조건
먼저 완료해 주세요: [模組 3: Skills 系統與 SKILL.md 規格](./module-03-skills-system)，確保你已理解 Skill 的結構與開發方式。
:::

---

## ClawHub 개요

**ClawHub** 是 OpenClaw 的官方 Skill 마켓플레이스，類似 npm、PyPI 或 Docker Hub，但專為 AI Agent Skills 設計。截至 2026 年 3 月，ClawHub 上有超過 **13,000 個 Skills**，涵蓋생산성、개발 도구、데이터分析、自動化等領域。

### ClawHub 生態系統

```
개발자                    ClawHub                     사용자
┌──────────┐           ┌──────────────────┐        ┌──────────┐
│ 開發 Skill│          │                  │        │ 검색     │
│ ────────▶│── push ──▶│  Skill Registry  │◀─ search─│ ────────▶│
│          │          │  ┌────────────┐  │        │          │
│ SKILL.md │          │  │ 13,000+    │  │        │ 설치     │
│ 程式碼   │          │  │  Skills    │  │        │ ────────▶│
│ 테스트     │          │  └────────────┘  │        │          │
└──────────┘          │                  │        │ 評分     │
                      │  ┌────────────┐  │        │ ────────▶│
                      │  │ 심사管線   │  │        └──────────┘
                      │  │ VirusTotal │  │
                      │  │ 靜態分析   │  │
                      │  │ 簽名검증   │  │
                      │  └────────────┘  │
                      └──────────────────┘
```

### 關鍵數據

| 指標 | 數值 |
|------|------|
| 總 Skills 數量 | 13,000+ |
| 인증개발자 | 2,800+ |
| 官方 Skills | 150+ |
| 每日설치次數 | 45,000+ |
| 平均심사時間 | 24 小時 |
| VirusTotal 掃描率 | 100%（強制） |

---

## 使用 ClawHub CLI

### 검색 Skills

```bash
# 基本검색
clawhub search weather

# 依標籤篩選
clawhub search --tag productivity

# 依作者篩選
clawhub search --author openclaw-official

# 只顯示인증的 Skills
clawhub search weather --verified

# 依설치數排序
clawhub search --sort downloads --limit 20
```

검색結果예시：

```
NAME                          AUTHOR              DOWNLOADS  RATING  VERIFIED
─────────────────────────────────────────────────────────────────────────────
weather-lookup                openclaw-official    124,500    4.9     ✓
weather-forecast-pro          weather-dev          45,200     4.7     ✓
weather-alerts                community-tools      12,300     4.5     ✓
weather-radar                 wx-enthusiast         8,700     4.3
weather-historical            data-archive          3,200     4.1
```

### 설치 Skills

```bash
# 標準설치
clawhub install openclaw-official/weather-lookup

# 설치特定版本
clawhub install openclaw-official/weather-lookup@1.2.0

# 설치並跳過互動確認（CI/CD 場景）
clawhub install openclaw-official/weather-lookup --yes

# 조회설치前的安全報告
clawhub inspect openclaw-official/weather-lookup
```

설치流程：

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

### 管理已설치的 Skills

```bash
# 列出所有已설치的 Skills
clawhub list

# 조회特定 Skill 的詳細資訊
clawhub info weather-lookup

# 업데이트單一 Skill
clawhub update weather-lookup

# 업데이트所有 Skills
clawhub update --all

# 移除 Skill
clawhub remove weather-lookup

# 조회 Skill 的變更記錄
clawhub changelog weather-lookup
```

---

## ClawHub 信任模型

ClawHub 使用多層信任模型，幫助사용자評估 Skill 的신뢰성：

### 信任等級

| 等級 | 標記 | 說明 | 심사方式 |
|------|------|------|----------|
| **Official** | 🏛️ | OpenClaw 團隊開發與維護 | 內部심사 |
| **Verified** | ✓ | 인증개발자，通過完整심사 | 自動化 + 人工심사 |
| **Community** | — | 社群貢獻，通過基本掃描 | 自動化掃描 |
| **Unverified** | ⚠️ | 新배포，尚未完成심사 | 排隊中 |
| **Flagged** | 🚩 | 被社群回報有問題 | 調查中 |

:::warning 보안 권고
- 優先설치 **Official** 或 **Verified** 的 Skills
- 설치 **Community** Skill 前，務必檢查其권한宣告
- **絕對不要** 설치 **Flagged** 的 Skill
- 使用 `clawhub inspect` 在설치前조회完整的安全報告
:::

### 보안 스캔 파이프라인

每個업로드到 ClawHub 的 Skill 都會經過以下掃描：

```
업로드 → SHA-256 簽名검증 → VirusTotal 掃描（72 引擎）→
靜態程式碼分析 → 권한審計 → 依賴項檢查 → 沙盒테스트실행 →
[人工심사（Verified 以上）] → 배포
```

1. **簽名검증**：確認檔案完整性，未被竄改
2. **VirusTotal 掃描**：使用 72 個防毒引擎掃描
3. **靜態分析**：檢查可疑的程式碼模式（如 `eval()`、混淆程式碼、可疑的網路請求）
4. **권한審計**：確認宣告的권한與實際程式碼一致
5. **依賴項檢查**：掃描 npm/pip 依賴項中的已知취약점
6. **沙盒테스트**：在隔離環境中실행，검증行為符合預期

---

## ClawHavoc 事件回顧

:::danger 중대 보안 사건
**ClawHavoc**（2026 年 1 月）是 OpenClaw 歷史上最嚴重的供應鏈攻擊事件。공격자업로드了 **2,400 個惡意 Skills** 到 ClawHub，這些 Skills 偽裝成合法的工具，但暗中竊取사용자的 API Keys、環境變數與檔案。
:::

### 事件時間線

| 日期 | 事件 |
|------|------|
| 2026-01-08 | 공격자開始大量업로드惡意 Skills |
| 2026-01-15 | 社群成員回報異常行為 |
| 2026-01-16 | OpenClaw 團隊確認攻擊，開始調查 |
| 2026-01-17 | 緊急下架 2,400 個惡意 Skills |
| 2026-01-20 | 배포安全업데이트，強制 VirusTotal 掃描 |
| 2026-01-25 | 推出新的信任模型與심사管線 |
| 2026-02-01 | 所有既有 Skills 完成重新掃描 |

### ClawHavoc 後的改進

1. **強制 VirusTotal 掃描**：所有 Skills 업로드前必須通過 72 引擎掃描
2. **권한透明化**：설치時明確顯示所有請求的권한
3. **靜態分析強化**：新增可疑模式偵測（混淆程式碼、隱藏網路請求）
4. **개발자身份검증**：新增 Verified Developer 計畫
5. **社群回報機制**：一鍵回報可疑 Skill
6. **自動撤回**：VirusTotal 偵測率 > 0 的 Skills 自動下架

### 自我檢查

如果你在 ClawHavoc 期間설치過 Skills，請立即실행：

```bash
# 檢查是否설치了已知的惡意 Skills
clawhub audit

# 輸出예시：
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

## 실습: 배포你的 Skill 到 ClawHub

讓我們把 [模組 3](./module-03-skills-system) 中생성的 Pomodoro Timer Skill 배포到 ClawHub。

### 步驟 1：생성 ClawHub 계정

```bash
# 註冊계정
clawhub register

# 或登入既有계정
clawhub login
```

### 步驟 2：準備배포

```bash
cd ~/.openclaw/skills/local/pomodoro-timer

# 검증 Skill 結構
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

### 步驟 4：배포

```bash
# 배포到 ClawHub
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

### 步驟 5：管理已배포的 Skill

```bash
# 조회你배포的所有 Skills
clawhub my-skills

# 조회다운로드統計
clawhub stats pomodoro-timer

# 배포업데이트版本
# 1. 수정 SKILL.md 中的 version
# 2. 重新배포
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

# 조회評論
clawhub reviews weather-lookup

# 回報問題
clawhub report weather-lookup --reason "suspicious-behavior" \
  --details "Skill 嘗試存取未宣告的 network endpoint"
```

### 選擇 Skill 的檢查清單

설치社群 Skill 前，建議依照以下清單評估：

- [ ] 信任等級是否為 Verified 以上？
- [ ] 권한宣告是否合理？（검색 Skill 不應需要 filesystem:write）
- [ ] 評分是否 4.0 以上？
- [ ] 最近一次업데이트是否在 6 個月內？
- [ ] 是否有足夠的다운로드量與評論？
- [ ] 程式碼是否開源可審查？
- [ ] `clawhub inspect` 的報告是否無異常？

---

## 자주 발생하는 오류 및 문제 해결

### 錯誤 1：배포失敗 — 名稱已被佔用

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
# 조회詳細報告
clawhub scan-report pomodoro-timer

# 如果是誤判，可以提出申訴
clawhub appeal pomodoro-timer --reason "False positive: detected pattern is standard API call"
```

### 錯誤 3：설치失敗 — 版本衝突

```
Error: Dependency conflict: skill-a requires node:18 but skill-b requires node:20
```

**解法**：每個 Skill 在獨立컨테이너中실행，Runtime 衝突通常不會發生。如果遇到，請업데이트到最新版本。

### 錯誤 4：권한審計失敗

```
Error: Permission audit failed: code accesses 'api.hidden-endpoint.com' but only declares 'api.example.com'
```

**解法**：在 SKILL.md 中正確宣告所有網路存取目標。

---

## 연습 문제

1. **Skill 探索**：使用 `clawhub search` 找出다운로드量前 10 名的 Skills，並分析它們的共同特徵（권한需求、功能類型、作者分布）。

2. **安全審計**：對你已설치的所有 Skills 실행 `clawhub audit`，記錄結果並處理任何警告。

3. **배포練習**：將你在模組 3 開發的 Pomodoro Timer 배포到 ClawHub（可以是테스트環境），完成從開發到배포的完整流程。

4. **評估練習**：選擇 5 個 Community 等級的 Skills，使用本模組介紹的檢查清單評估它們的安全性，並記錄你的判斷。

---

## 퀴즈

1. **ClawHub 上目前有多少個 Skills？**
   - A) 5,000+
   - B) 8,000+
   - C) 13,000+
   - D) 20,000+

2. **설치 Skill 的正確指令是？**
   - A) `openclaw install weather-lookup`
   - B) `clawhub install openclaw-official/weather-lookup`
   - C) `npm install weather-lookup`
   - D) `pip install weather-lookup`

3. **ClawHavoc 事件中，공격자업로드了多少個惡意 Skills？**
   - A) 100
   - B) 500
   - C) 2,400
   - D) 10,000

4. **以下哪個信任等級表示 Skill 已通過完整심사？**
   - A) Community
   - B) Unverified
   - C) Verified
   - D) Flagged

5. **ClawHavoc 後，哪項安全措施變成強制性的？**
   - A) 人工심사
   - B) 兩步검증
   - C) VirusTotal 掃描
   - D) 區塊鏈簽名

<details>
<summary>정답 확인</summary>

1. **C** — ClawHub 截至 2026 年 3 月有超過 13,000 個 Skills。
2. **B** — 使用 `clawhub install <author>/<skill>` 格式설치 Skills。
3. **C** — ClawHavoc 事件中有 2,400 個惡意 Skills 被업로드。
4. **C** — Verified 等級表示 Skill 由인증개발자배포，並通過自動化與人工심사。
5. **C** — ClawHavoc 後，VirusTotal 掃描（72 引擎）成為所有 Skill 업로드的強制要求。

</details>

---

## 다음 단계

你已經掌握了 ClawHub 마켓플레이스的使用與安全概念。下一步，讓我們深入探索 OpenClaw 的記憶系統，了解 Agent 如何跨對話維持上下文。

**[前往模組 5: 持久記憶與個人化 →](./module-05-memory)**
