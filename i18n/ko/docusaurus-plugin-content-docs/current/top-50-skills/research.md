---
title: "리서치 Skills"
sidebar_position: 5
description: "OpenClaw 리서치 Skills 완전 평가: Web Browsing, Tavily, Felo Search, Summarize"
---

# 리서치 Skills (Research)

리서치 Skills 賦予 OpenClaw Agent 「上網查데이터」的能力。從基礎的網頁瀏覽到 AI 驅動的智慧검색，這些 Skills 讓 Agent 能即時取得最新資訊，而非僅依賴訓練데이터。

---

## #2 — Web Browsing

| 屬性 | 內容 |
|------|------|
| **排名** | #2 / 50 |
| **類別** | Research |
| **總分** | 70 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社群** | 官方（內建） |
| **설치方式** | 內建（bundled），無需설치 |
| **ClawHub 統計** | 180K+ 使用次數 |
| **目標사용자** | 所有사용자 |

### 기능 설명

Web Browsing 是 OpenClaw 最核心的 Skill 之一，直接內建於系統中：

- **網頁導覽**：前往任意 URL，解析 HTML 內容
- **內容擷取**：智慧提取文章正文、表格、程式碼區塊
- **검색整合**：透過검색引擎查詢（預設 Google）
- **JavaScript 渲染**：處理 SPA 和動態載入內容
- **截圖能力**：擷取網頁視覺快照
- **多標籤管理**：同時瀏覽多個頁面

### 중요한 이유

Web Browsing 是讓 Agent 從「封閉系統」變為「開放系統」的關鍵 Skill。沒有它，Agent 只能依賴訓練데이터；有了它，Agent 能存取即時的網路資訊。180K+ 的설치使用量說明了它的不可或缺性。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 10 | 10 | 10 | 9 | 8 | 7 | 7 | 9 | **70** |

**排名理由**：相關性、相容性、社群熱度三項滿分。可靠度稍低（某些網站會封鎖自動化存取），安全性需注意（Agent 可能被誘導存取惡意網站）。

### 설정 방법

```bash
# Web Browsing 為內建 Skill，直接可用
openclaw skill status web-browsing

# 自訂설정
openclaw config set web-browsing.default_search google
openclaw config set web-browsing.timeout 30000
openclaw config set web-browsing.javascript true

# 설정 Proxy（엔터프라이즈網路常需要）
openclaw config set web-browsing.proxy http://proxy.corp.com:8080
```

### 의존성 및 보안

- **依賴**：Chromium runtime（隨 OpenClaw 설치）
- **권한需求**：網路存取
- **安全性**：SEC 7/10 — Agent 可能被 prompt injection 誘導至惡意網站

:::warning 網頁注入風險
惡意網站可能嵌入針對 AI Agent 的 prompt injection 攻擊。建議：
- 설정 URL 白名單：`openclaw config set web-browsing.allowed_domains "*.github.com,*.stackoverflow.com"`
- 啟用沙盒模式：`openclaw config set web-browsing.sandbox true`
- 避免讓 Agent 自動點擊不明連結
:::

- **替代方案**：Tavily（#4）提供更結構化的검색結果；Firecrawl（#18）適合大量크롤링

---

## #4 — Tavily

| 屬性 | 內容 |
|------|------|
| **排名** | #4 / 50 |
| **類別** | Research |
| **總分** | 67 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社群** | 社群（framix-team） |
| **설치方式** | `clawhub install framix-team/openclaw-tavily` |
| **目標사용자** | 리서치者、需要高品質검색的사용자 |

### 기능 설명

Tavily 是專為 AI Agent 設計的검색引擎，提供：

- **AI 검색**：語義理解查詢意圖，回傳結構化結果
- **網頁크롤링**：深度크롤링指定 URL，提取結構化內容
- **即時回答**：直接回答事實性問題（附來源引用）
- **검색深度控制**：`basic`（快速）vs `advanced`（深度）
- **來源可信度評分**：每個검색結果附帶可信度分數

### 중요한 이유

相較於 Web Browsing 的通用瀏覽能力，Tavily 專注於「검색」場景並做到極致。它的結果已經過 AI 預處理，Agent 可以直接使用，不需要再自行解析 HTML。對於리서치密集型工作流來說，Tavily 比 Web Browsing 更有效率。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 9 | 8 | 9 | 8 | 8 | 8 | 8 | **67** |

### 설치 및 설정

```bash
clawhub install framix-team/openclaw-tavily

# 설정 Tavily API Key（免費方案每月 1000 次查詢）
openclaw skill configure tavily \
  --api-key tvly-xxxxxxxxxxxx

# 使用예시
openclaw run "用 Tavily 검색 OpenClaw 最新版本的功能"
```

### 의존성 및 보안

- **依賴**：Tavily API Key（免費方案可用）
- **권한需求**：網路存取（僅連線 Tavily API）
- **安全性**：SEC 8/10 — 只存取 Tavily API，不直接瀏覽網頁，降低注入風險
- **替代方案**：Felo Search（#15）提供中文검색優化；Web Browsing（#2）更通用

---

## #15 — Felo Search

| 屬性 | 內容 |
|------|------|
| **排名** | #15 / 50 |
| **類別** | Research |
| **總分** | 59 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install felo-search` |
| **目標사용자** | 需要多語言검색的사용자、中文사용자 |

### 기능 설명

Felo Search 是另一個 AI 驅動的검색工具，特色在於：

- **多語言優化**：中文、日文검색品質優於 Tavily
- **引用標註**：每句回答都附帶來源連結
- **即時回答模式**：直接產生요약而非連結清單
- **主題追蹤**：持續追蹤特定主題的最新資訊

### 중요한 이유

對於한국어사용자來說，Felo Search 在中文內容的검색品質上通常優於 Tavily。如果你的主要리서치語言是中文或日文，Felo Search 是更好的選擇。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 7 | 7 | 8 | 7 | **59** |

### 설치 및 설정

```bash
clawhub install felo-search

# 설정 API Key
openclaw skill configure felo-search \
  --api-key your_felo_api_key

# 使用예시（中文검색）
openclaw run "用 Felo 검색한국 AI 新創最新動態"
```

### 의존성 및 보안

- **依賴**：Felo Search API Key
- **권한需求**：網路存取（僅連線 Felo API）
- **安全性**：SEC 8/10 — 與 Tavily 類似的安全模型
- **替代方案**：Tavily（#4）英文검색品質更好；Web Browsing（#2）最通用

---

## #19 — Summarize（리서치面向）

Summarize Skill 的完整介紹請見[생산성 Skills](./productivity#19--summarize)。在리서치工作流中，Summarize 扮演的角色如下：

### 리서치工作流中的 Summarize

```bash
# 검색 → 요약的 pipeline
openclaw run "
  1. 用 Tavily 검색 'transformer architecture 2026 improvements'
  2. 對前 5 個結果進行요약
  3. 整合為一份리서치筆記存入 Obsidian
"
```

Summarize Skill 最適合搭配 Tavily 或 Web Browsing 使用，把검색到的大量資訊壓縮為可行動的洞察。

---

## 리서치 Skills 比較表

| 特性 | Web Browsing | Tavily | Felo Search | Summarize |
|------|:----------:|:------:|:-----------:|:---------:|
| 검색能力 | ✅ | ✅ | ✅ | ❌ |
| 網頁瀏覽 | ✅ | ❌ | ❌ | ❌ |
| 크롤링能力 | ✅ | ✅ | ❌ | ❌ |
| 結構化輸出 | ❌ | ✅ | ✅ | ✅ |
| 中文優化 | ❌ | 一般 | ✅ | ✅ |
| 引用標註 | ❌ | ✅ | ✅ | ❌ |
| 需要 API Key | ❌ | ✅ | ✅ | ❌ |
| 離線可用 | ❌ | ❌ | ❌ | ✅ |

### 리서치者推薦組合

```bash
# 深度리서치流程
clawhub install framix-team/openclaw-tavily
clawhub install community/summarize
clawhub install community/obsidian-claw
# 搭配內建 Web Browsing

# 中文리서치流程
clawhub install felo-search
clawhub install community/summarize
clawhub install community/notion-claw

# 極簡리서치流程（零成本）
# 只用內建 Web Browsing + Summarize
clawhub install community/summarize
```
