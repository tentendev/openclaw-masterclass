---
sidebar_position: 10
title: "数据 Skills"
description: "OpenClaw 数据类 Skills 完整评测：Apify、Firecrawl、DuckDB CRM、Reddit Readonly、CSV Analyzer、Airtable"
keywords: [OpenClaw, Skills, Data, Apify, Firecrawl, DuckDB, Reddit, CSV, Airtable]
---

# 数据 Skills (Data)

数据类 Skills 让 OpenClaw Agent 具备大规模数据提取、分析和管理的能力。从网页爬取到本机数据库查询，这些 Skills 把 Agent 变成你的数据工程师。

---

## #18 — Firecrawl

| 属性 | 内容 |
|------|------|
| **排名** | #18 / 50 |
| **类别** | Data |
| **总分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/firecrawl-claw` |
| **目标用户** | 数据工程师、需要大量网页数据的用户 |

### 功能说明

Firecrawl 是专为 AI Agent 设计的网页爬取服务：

- **智慧爬取**：自动处理 JavaScript 渲染、分页、Infinite Scroll
- **结构化输出**：将网页内容转为 Markdown 或 JSON
- **批次爬取**：同时爬取整个网站
- **Sitemap 支援**：自动检测和遵循 sitemap
- **反爬虫处理**：自动处理 CAPTCHA 和 rate limiting
- **LLM 友善格式**：输出格式优化，适合 LLM 消化

### 为什么重要

Web Browsing Skill 适合浏览个别网页，但若需要爬取整个网站的数据，Firecrawl 是更高效的选择。它的输出格式直接为 LLM 优化，Agent 可以立即处理，不需要额外的数据清理。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 7 | 8 | 8 | 7 | 7 | 7 | **58** |

### 安装与配置

```bash
clawhub install community/firecrawl-claw

# 配置 Firecrawl API Key
openclaw skill configure firecrawl-claw \
  --api-key fc-xxxxxxxxxxxx

# 单页爬取
openclaw run "用 Firecrawl 爬取 https://docs.example.com/api 并转为 Markdown"

# 整站爬取
openclaw run firecrawl-claw \
  --crawl https://docs.example.com \
  --max-pages 100 \
  --output ~/data/example-docs/
```

### 依赖与安全

- **依赖**：Firecrawl API Key（免费方案 500 页/月）
- **权限需求**：网络存取、本机文件写入
- **安全性**：SEC 7/10 — 爬取的网页内容可能包含恶意数据
- **替代方案**：Apify（#21）更强大但更复杂；Web Browsing（#2）for 个别页面

---

## #21 — Apify

| 属性 | 内容 |
|------|------|
| **排名** | #21 / 50 |
| **类别** | Data |
| **总分** | 56 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/apify-claw` |
| **目标用户** | 数据工程师、需要复杂爬虫的用户 |

### 功能说明

Apify 是全球最大的网页爬取平台，提供：

- **2000+ 预建 Actors**：针对 Amazon、Google Maps、Instagram 等特定网站的爬虫
- **自定义爬虫**：使用 Apify SDK 创建定制化爬虫
- **数据存储**：内建 Dataset 和 Key-Value Store
- **调度执行**：定时自动爬取
- **Proxy 管理**：内建 Proxy 池，降低被封锁机率

### 为什么重要

相较于 Firecrawl 的通用爬取，Apify 的优势在于针对特定网站的「Actors」。例如你想爬取 Amazon 商品数据，Apify 有现成的 Actor 可以使用，不需要自己处理 Amazon 的反爬虫机制。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 7 | 8 | 7 | 7 | 6 | 7 | **56** |

### 安装与配置

```bash
clawhub install community/apify-claw

# 配置 Apify API Token
openclaw skill configure apify-claw \
  --token apify_api_xxxxxxxxxxxx

# 执行预建 Actor
openclaw run apify-claw \
  --actor "apify/google-search-scraper" \
  --input '{"queries": ["OpenClaw skills"]}'

# 使用自然语言
openclaw run "用 Apify 爬取 Google Maps 上台北市的咖啡厅数据"
```

### 依赖与安全

- **依赖**：Apify API Token（免费方案有使用额度）
- **权限需求**：Apify Platform 存取
- **安全性**：SEC 6/10 — 爬取的数据和 Actors 品质参差不齐

:::warning 爬取合规
大规模爬取可能违反目标网站的 Terms of Service。使用 Apify 前请确认：
- 目标网站是否允许爬取（检查 robots.txt）
- 是否遵守相关数据保护法规（如 GDPR）
- 爬取频率是否合理
:::

- **替代方案**：Firecrawl（#18）更简单；Web Browsing（#2）for 小规模需求

---

## #28 — DuckDB CRM

| 属性 | 内容 |
|------|------|
| **排名** | #28 / 50 |
| **类别** | Data |
| **总分** | 55 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/duckdb-crm` |
| **目标用户** | 业务人员、需要轻量 CRM 的用户 |

### 功能说明

基于 DuckDB 的轻量级 CRM 系统：

- **联络人管理**：存储和搜索客户/联络人数据
- **交互记录**：记录每次交互（邮件、电话、会议）
- **SQL 查询**：直接用 SQL 或自然语言查询 CRM 数据
- **导入/导出**：支援 CSV、JSON、Parquet
- **分析报表**：自动生成客户分析报表

### 为什么重要

不是每个人都需要 Salesforce 或 HubSpot。DuckDB CRM 提供一个本机、轻量、免费的 CRM 方案，数据完全存放在你的电脑上。Agent 可以自动从 Gmail 和 Calendar 中提取交互记录，维护你的客户关系。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 5 | 8 | 7 | 8 | 8 | 6 | **55** |

### 安装与配置

```bash
clawhub install community/duckdb-crm

# 初始化 CRM 数据库
openclaw skill configure duckdb-crm \
  --db-path ~/openclaw-crm.duckdb

# 导入现有联络人
openclaw run duckdb-crm --import contacts.csv

# 自然语言查询
openclaw run "过去 30 天没有联系的客户有哪些？"
openclaw run "本月新增了多少笔交易？"
```

### 依赖与安全

- **依赖**：DuckDB（随 Skill 自动安装）
- **权限需求**：本机文件系统读写
- **安全性**：SEC 8/10 — 纯本机数据库，数据不外传
- **替代方案**：Notion 数据库 + Notion Skill（#13）；Airtable Skill（#47）

---

## #34 — Reddit Readonly

| 属性 | 内容 |
|------|------|
| **排名** | #34 / 50 |
| **类别** | Data |
| **总分** | 52 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/reddit-readonly` |
| **目标用户** | Reddit 用户、市场研究者 |

### 功能说明

唯读存取 Reddit 内容：

- 读取特定 subreddit 的热门/最新贴文
- 搜索 Reddit 内容
- 读取贴文和回复
- 追踪特定 subreddit 或关键字
- 情绪分析（搭配 LLM）

### 为什么重要

Reddit 是许多社区的核心讨论平台。Agent 可以帮你追踪 r/openclaw、r/artificial 等 subreddit 的最新讨论，生成每日摘要，让你不遗漏重要信息。唯读设计确保 Agent 不会意外发文。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 6 | 6 | 7 | 7 | 8 | 5 | **52** |

### 安装与配置

```bash
clawhub install community/reddit-readonly

# 配置 Reddit API（免费）
openclaw skill configure reddit-readonly \
  --client-id your_reddit_client_id \
  --client-secret your_reddit_secret

# 使用示例
openclaw run "r/openclaw 今天有什么热门讨论？"
openclaw run "搜索 Reddit 上关于 OpenClaw skills 安全性的讨论"
```

### 依赖与安全

- **依赖**：Reddit API credentials（免费获取）
- **权限需求**：Reddit API 唯读存取
- **安全性**：SEC 8/10 — 唯读设计，不会意外发文或投票
- **替代方案**：Web Browsing Skill 直接浏览 Reddit（不需 API Key 但效率较低）

---

## #45 — CSV Analyzer

| 属性 | 内容 |
|------|------|
| **排名** | #45 / 50 |
| **类别** | Data |
| **总分** | 49 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/csv-analyzer` |
| **目标用户** | 数据分析师、需要处理 CSV 的用户 |

### 功能说明

快速分析和处理 CSV 文件：

- 读取并摘要 CSV 结构
- 自然语言查询 CSV 数据
- 生成统计摘要和图表
- 数据清理和转换
- 导出为其他格式

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 4 | 6 | 6 | 7 | 8 | 5 | **49** |

### 安装与配置

```bash
clawhub install community/csv-analyzer

# 使用示例
openclaw run csv-analyzer --file ~/data/sales.csv
openclaw run "分析 sales.csv，找出销售额最高的前 10 个产品"
```

### 依赖与安全

- **依赖**：DuckDB（底层引擎）
- **权限需求**：本机文件读取
- **安全性**：SEC 8/10 — 本机处理
- **替代方案**：DuckDB CRM（#28）提供更完整的数据库功能

---

## #47 — Airtable

| 属性 | 内容 |
|------|------|
| **排名** | #47 / 50 |
| **类别** | Data |
| **总分** | 45 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/airtable-claw` |
| **目标用户** | Airtable 用户 |

### 功能说明

与 Airtable 数据库集成：

- 读取和写入 Airtable 记录
- 搜索和筛选
- 创建和管理 Views
- 自动同步数据

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **45** |

### 安装与配置

```bash
clawhub install community/airtable-claw

openclaw skill configure airtable-claw \
  --api-key your_airtable_api_key \
  --base-id appXXXXXXXXXXX
```

### 依赖与安全

- **依赖**：Airtable API Key
- **权限需求**：Airtable Base 读写
- **安全性**：SEC 7/10 — Airtable API 权限粒度一般
- **替代方案**：Notion（#13）功能更完整；DuckDB CRM（#28）本机方案

---

## 数据 Skills 比较表

| 特性 | Firecrawl | Apify | DuckDB CRM | Reddit | CSV Analyzer | Airtable |
|------|:---------:|:-----:|:----------:|:------:|:------------:|:--------:|
| 数据来源 | 网页 | 网页 | 本机 | Reddit | 本机 | 云端 |
| 规模 | 中～大 | 大 | 中 | 中 | 小～中 | 中 |
| 成本 | API 费用 | API 费用 | 免费 | 免费 | 免费 | API 费用 |
| 实时性 | 高 | 高 | 低 | 高 | 低 | 中 |
| 离线可用 | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| 结构化程度 | 高 | 高 | 最高 | 中 | 高 | 高 |

### 数据工程师组合推荐

```bash
# 网页数据提取
clawhub install community/firecrawl-claw
clawhub install community/apify-claw

# 本机数据分析
clawhub install community/duckdb-crm
clawhub install community/csv-analyzer

# 社区监控
clawhub install community/reddit-readonly
clawhub install community/tweetclaw
clawhub install community/summarize
```
