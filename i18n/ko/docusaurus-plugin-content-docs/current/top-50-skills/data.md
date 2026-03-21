---
title: "데이터 Skills"
sidebar_position: 10
description: "OpenClaw 데이터 Skills 완전 평가: Apify, Firecrawl, DuckDB CRM, Reddit Readonly, CSV Analyzer, Airtable"
---

# 데이터 Skills (Data)

데이터 Skills 讓 OpenClaw Agent 具備大規模데이터擷取、分析和管理的能力。從網頁크롤링到本機데이터庫查詢，這些 Skills 把 Agent 變成你的데이터工程師。

---

## #18 — Firecrawl

| 屬性 | 內容 |
|------|------|
| **排名** | #18 / 50 |
| **類別** | Data |
| **總分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/firecrawl-claw` |
| **目標사용자** | 데이터工程師、需要大量網頁데이터的사용자 |

### 기능 설명

Firecrawl 是專為 AI Agent 設計的網頁크롤링服務：

- **智慧크롤링**：自動處理 JavaScript 渲染、分頁、Infinite Scroll
- **結構化輸出**：將網頁內容轉為 Markdown 或 JSON
- **批次크롤링**：同時크롤링整個網站
- **Sitemap 支援**：自動偵測和遵循 sitemap
- **反爬蟲處理**：自動處理 CAPTCHA 和 rate limiting
- **LLM 友善格式**：輸出格式最佳化，適合 LLM 消化

### 중요한 이유

Web Browsing Skill 適合瀏覽個別網頁，但若需要크롤링整個網站的데이터，Firecrawl 是更高效的選擇。它的輸出格式直接為 LLM 最佳化，Agent 可以立即處理，不需要額外的데이터清理。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 7 | 8 | 8 | 7 | 7 | 7 | **58** |

### 설치 및 설정

```bash
clawhub install community/firecrawl-claw

# 설정 Firecrawl API Key
openclaw skill configure firecrawl-claw \
  --api-key fc-xxxxxxxxxxxx

# 單頁크롤링
openclaw run "用 Firecrawl 크롤링 https://docs.example.com/api 並轉為 Markdown"

# 整站크롤링
openclaw run firecrawl-claw \
  --crawl https://docs.example.com \
  --max-pages 100 \
  --output ~/data/example-docs/
```

### 의존성 및 보안

- **依賴**：Firecrawl API Key（免費方案 500 頁/月）
- **권한需求**：網路存取、本機檔案寫入
- **安全性**：SEC 7/10 — 크롤링的網頁內容可能包含惡意데이터
- **替代方案**：Apify（#21）更強大但更複雜；Web Browsing（#2）for 個別頁面

---

## #21 — Apify

| 屬性 | 內容 |
|------|------|
| **排名** | #21 / 50 |
| **類別** | Data |
| **總分** | 56 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/apify-claw` |
| **目標사용자** | 데이터工程師、需要複雜爬蟲的사용자 |

### 기능 설명

Apify 是全球最大的網頁크롤링平台，提供：

- **2000+ 預建 Actors**：針對 Amazon、Google Maps、Instagram 等特定網站的爬蟲
- **自訂爬蟲**：使用 Apify SDK 생성客製化爬蟲
- **데이터저장**：內建 Dataset 和 Key-Value Store
- **스케줄링실행**：定時自動크롤링
- **Proxy 管理**：內建 Proxy 池，降低被封鎖機率

### 중요한 이유

相較於 Firecrawl 的通用크롤링，Apify 的優勢在於針對特定網站的「Actors」。例如你想크롤링 Amazon 商品데이터，Apify 有現成的 Actor 可以使用，不需要自己處理 Amazon 的反爬蟲機制。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 7 | 8 | 7 | 7 | 6 | 7 | **56** |

### 설치 및 설정

```bash
clawhub install community/apify-claw

# 설정 Apify API Token
openclaw skill configure apify-claw \
  --token apify_api_xxxxxxxxxxxx

# 실행預建 Actor
openclaw run apify-claw \
  --actor "apify/google-search-scraper" \
  --input '{"queries": ["OpenClaw skills"]}'

# 使用自然語言
openclaw run "用 Apify 크롤링 Google Maps 上서울市的咖啡廳데이터"
```

### 의존성 및 보안

- **依賴**：Apify API Token（免費方案有使用額度）
- **권한需求**：Apify Platform 存取
- **安全性**：SEC 6/10 — 크롤링的데이터和 Actors 品質參差不齊

:::warning 크롤링컴플라이언스
大規模크롤링可能違反目標網站的 Terms of Service。使用 Apify 前請確認：
- 目標網站是否允許크롤링（檢查 robots.txt）
- 是否遵守相關데이터保護法規（如 GDPR）
- 크롤링頻率是否合理
:::

- **替代方案**：Firecrawl（#18）更簡單；Web Browsing（#2）for 小規模需求

---

## #28 — DuckDB CRM

| 屬性 | 內容 |
|------|------|
| **排名** | #28 / 50 |
| **類別** | Data |
| **總分** | 55 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/duckdb-crm` |
| **目標사용자** | 業務人員、需要輕量 CRM 的사용자 |

### 기능 설명

基於 DuckDB 的輕量級 CRM 系統：

- **聯絡人管理**：存儲和검색客戶/聯絡人데이터
- **互動記錄**：記錄每次互動（郵件、電話、會議）
- **SQL 查詢**：直接用 SQL 或自然語言查詢 CRM 데이터
- **임포트/엑스포트**：支援 CSV、JSON、Parquet
- **分析報表**：自動產生客戶分析報表

### 중요한 이유

不是每個人都需要 Salesforce 或 HubSpot。DuckDB CRM 提供一個本機、輕量、免費的 CRM 方案，데이터完全存放在你的電腦上。Agent 可以自動從 Gmail 和 Calendar 中擷取互動記錄，維護你的客戶關係。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 5 | 8 | 7 | 8 | 8 | 6 | **55** |

### 설치 및 설정

```bash
clawhub install community/duckdb-crm

# 初始化 CRM 데이터庫
openclaw skill configure duckdb-crm \
  --db-path ~/openclaw-crm.duckdb

# 임포트現有聯絡人
openclaw run duckdb-crm --import contacts.csv

# 自然語言查詢
openclaw run "過去 30 天沒有聯繫的客戶有哪些？"
openclaw run "本月新增了多少筆交易？"
```

### 의존성 및 보안

- **依賴**：DuckDB（隨 Skill 自動설치）
- **권한需求**：本機檔案系統讀寫
- **安全性**：SEC 8/10 — 純本機데이터庫，데이터不外傳
- **替代方案**：Notion 데이터庫 + Notion Skill（#13）；Airtable Skill（#47）

---

## #34 — Reddit Readonly

| 屬性 | 內容 |
|------|------|
| **排名** | #34 / 50 |
| **類別** | Data |
| **總分** | 52 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/reddit-readonly` |
| **目標사용자** | Reddit 사용자、市場리서치者 |

### 기능 설명

唯讀存取 Reddit 內容：

- 讀取特定 subreddit 的熱門/最新貼文
- 검색 Reddit 內容
- 讀取貼文和답변
- 追蹤特定 subreddit 或關鍵字
- 情緒分析（搭配 LLM）

### 중요한 이유

Reddit 是許多社群的核心討論平台。Agent 可以幫你追蹤 r/openclaw、r/artificial 等 subreddit 的最新討論，產生每日요약，讓你不遺漏重要資訊。唯讀設計確保 Agent 不會意外發文。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 6 | 6 | 7 | 7 | 8 | 5 | **52** |

### 설치 및 설정

```bash
clawhub install community/reddit-readonly

# 설정 Reddit API（免費）
openclaw skill configure reddit-readonly \
  --client-id your_reddit_client_id \
  --client-secret your_reddit_secret

# 使用예시
openclaw run "r/openclaw 今天有什麼熱門討論？"
openclaw run "검색 Reddit 上關於 OpenClaw skills 安全性的討論"
```

### 의존성 및 보안

- **依賴**：Reddit API credentials（免費取得）
- **권한需求**：Reddit API 唯讀存取
- **安全性**：SEC 8/10 — 唯讀設計，不會意外發文或投票
- **替代方案**：Web Browsing Skill 直接瀏覽 Reddit（不需 API Key 但效率較低）

---

## #45 — CSV Analyzer

| 屬性 | 內容 |
|------|------|
| **排名** | #45 / 50 |
| **類別** | Data |
| **總分** | 49 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/csv-analyzer` |
| **目標사용자** | 데이터分析師、需要處理 CSV 的사용자 |

### 기능 설명

快速分析和處理 CSV 檔案：

- 讀取並요약 CSV 結構
- 自然語言查詢 CSV 데이터
- 產生統計요약和차트
- 데이터清理和轉換
- 엑스포트為其他格式

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 4 | 6 | 6 | 7 | 8 | 5 | **49** |

### 설치 및 설정

```bash
clawhub install community/csv-analyzer

# 使用예시
openclaw run csv-analyzer --file ~/data/sales.csv
openclaw run "分析 sales.csv，找出銷售額最高的前 10 個產品"
```

### 의존성 및 보안

- **依賴**：DuckDB（底層引擎）
- **권한需求**：本機檔案讀取
- **安全性**：SEC 8/10 — 本機處理
- **替代方案**：DuckDB CRM（#28）提供更完整的데이터庫功能

---

## #47 — Airtable

| 屬性 | 內容 |
|------|------|
| **排名** | #47 / 50 |
| **類別** | Data |
| **總分** | 45 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/airtable-claw` |
| **目標사용자** | Airtable 사용자 |

### 기능 설명

與 Airtable 데이터庫整合：

- 讀取和寫入 Airtable 記錄
- 검색和篩選
- 생성和管理 Views
- 自動同步데이터

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **45** |

### 설치 및 설정

```bash
clawhub install community/airtable-claw

openclaw skill configure airtable-claw \
  --api-key your_airtable_api_key \
  --base-id appXXXXXXXXXXX
```

### 의존성 및 보안

- **依賴**：Airtable API Key
- **권한需求**：Airtable Base 讀寫
- **安全性**：SEC 7/10 — Airtable API 권한粒度一般
- **替代方案**：Notion（#13）功能更完整；DuckDB CRM（#28）本機方案

---

## 데이터 Skills 比較表

| 特性 | Firecrawl | Apify | DuckDB CRM | Reddit | CSV Analyzer | Airtable |
|------|:---------:|:-----:|:----------:|:------:|:------------:|:--------:|
| 데이터來源 | 網頁 | 網頁 | 本機 | Reddit | 本機 | 雲端 |
| 規模 | 中～大 | 大 | 中 | 中 | 小～中 | 中 |
| 成本 | API 費用 | API 費用 | 免費 | 免費 | 免費 | API 費用 |
| 即時性 | 高 | 高 | 低 | 高 | 低 | 中 |
| 離線可用 | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| 結構化程度 | 高 | 高 | 最高 | 中 | 高 | 高 |

### 데이터工程師組合推薦

```bash
# 網頁데이터擷取
clawhub install community/firecrawl-claw
clawhub install community/apify-claw

# 本機데이터分析
clawhub install community/duckdb-crm
clawhub install community/csv-analyzer

# 社群모니터링
clawhub install community/reddit-readonly
clawhub install community/tweetclaw
clawhub install community/summarize
```
