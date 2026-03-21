---
sidebar_position: 10
title: "Data Skills"
description: "Complete review of OpenClaw data Skills: Apify, Firecrawl, DuckDB CRM, Reddit Readonly, CSV Analyzer, Airtable"
keywords: [OpenClaw, Skills, Data, Apify, Firecrawl, DuckDB, Reddit, CSV, Airtable]
---

# Data Skills

Data Skills give the OpenClaw Agent large-scale data extraction, analysis, and management capabilities. From web crawling to local database queries, these Skills turn the Agent into your data engineer.

---

## #18 — Firecrawl

| Property | Details |
|----------|---------|
| **Rank** | #18 / 50 |
| **Category** | Data |
| **Total Score** | 58 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install community/firecrawl-claw` |
| **Target Users** | Data engineers, users needing large-scale web data |

### Feature Overview

Firecrawl is a web crawling service designed specifically for AI Agents:

- **Smart crawling**: Automatically handles JavaScript rendering, pagination, infinite scroll
- **Structured output**: Converts web content to Markdown or JSON
- **Batch crawling**: Crawl entire websites simultaneously
- **Sitemap support**: Auto-detect and follow sitemaps
- **Anti-bot handling**: Automatically handles CAPTCHAs and rate limiting
- **LLM-friendly format**: Output optimized for LLM consumption

### Why It Matters

The Web Browsing Skill is good for individual pages, but when you need to crawl an entire website's data, Firecrawl is far more efficient. Its output format is directly optimized for LLMs, so the Agent can process it immediately without extra data cleaning.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 7 | 7 | 8 | 8 | 7 | 7 | 7 | **58** |

### Installation & Setup

```bash
clawhub install community/firecrawl-claw

openclaw skill configure firecrawl-claw \
  --api-key fc-xxxxxxxxxxxx

# Single page crawl
openclaw run "Use Firecrawl to crawl https://docs.example.com/api and convert to Markdown"

# Full site crawl
openclaw run firecrawl-claw \
  --crawl https://docs.example.com \
  --max-pages 100 \
  --output ~/data/example-docs/
```

### Dependencies & Security

- **Dependencies**: Firecrawl API Key (free plan: 500 pages/month)
- **Permissions Required**: Network access, local file write
- **Security**: SEC 7/10 — crawled web content may contain malicious data
- **Alternatives**: Apify (#21) more powerful but more complex; Web Browsing (#2) for individual pages

---

## #21 — Apify

| Property | Details |
|----------|---------|
| **Rank** | #21 / 50 |
| **Category** | Data |
| **Total Score** | 56 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install community/apify-claw` |
| **Target Users** | Data engineers, users needing complex crawlers |

### Feature Overview

Apify is the world's largest web scraping platform:

- **2000+ pre-built Actors**: Site-specific scrapers for Amazon, Google Maps, Instagram, etc.
- **Custom crawlers**: Build custom scrapers using the Apify SDK
- **Data storage**: Built-in Dataset and Key-Value Store
- **Scheduled execution**: Timed automatic scraping
- **Proxy management**: Built-in proxy pool to reduce blocking risk

### Why It Matters

Compared to Firecrawl's general-purpose crawling, Apify's advantage lies in site-specific "Actors." For example, to scrape Amazon product data, Apify has a ready-made Actor — no need to handle Amazon's anti-scraping mechanisms yourself.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 7 | 7 | 8 | 7 | 7 | 6 | 7 | **56** |

### Installation & Setup

```bash
clawhub install community/apify-claw

openclaw skill configure apify-claw \
  --token apify_api_xxxxxxxxxxxx

# Run a pre-built Actor
openclaw run apify-claw \
  --actor "apify/google-search-scraper" \
  --input '{"queries": ["OpenClaw skills"]}'

# Natural language usage
openclaw run "Use Apify to scrape coffee shop data from Google Maps in Taipei"
```

### Dependencies & Security

- **Dependencies**: Apify API Token (free plan has usage limits)
- **Permissions Required**: Apify Platform access
- **Security**: SEC 6/10 — scraped data and Actor quality varies

:::warning Crawling Compliance
Large-scale crawling may violate target websites' Terms of Service. Before using Apify, verify:
- Whether the target website allows crawling (check robots.txt)
- Whether you comply with relevant data protection regulations (e.g., GDPR)
- Whether your crawling frequency is reasonable
:::

- **Alternatives**: Firecrawl (#18) is simpler; Web Browsing (#2) for small-scale needs

---

## #28 — DuckDB CRM

| Property | Details |
|----------|---------|
| **Rank** | #28 / 50 |
| **Category** | Data |
| **Total Score** | 55 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install community/duckdb-crm` |
| **Target Users** | Sales professionals, users needing a lightweight CRM |

### Feature Overview

A lightweight CRM system built on DuckDB:

- **Contact management**: Store and search customer/contact data
- **Interaction records**: Log each interaction (email, phone, meeting)
- **SQL queries**: Query CRM data directly with SQL or natural language
- **Import/Export**: Supports CSV, JSON, Parquet
- **Analytics reports**: Auto-generate customer analysis reports

### Why It Matters

Not everyone needs Salesforce or HubSpot. DuckDB CRM provides a local, lightweight, free CRM solution with data stored entirely on your computer. The Agent can automatically extract interaction records from Gmail and Calendar to maintain your customer relationships.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 7 | 5 | 8 | 7 | 8 | 8 | 6 | **55** |

### Installation & Setup

```bash
clawhub install community/duckdb-crm

openclaw skill configure duckdb-crm \
  --db-path ~/openclaw-crm.duckdb

# Import existing contacts
openclaw run duckdb-crm --import contacts.csv

# Natural language queries
openclaw run "Which customers haven't been contacted in the last 30 days?"
openclaw run "How many new deals were added this month?"
```

### Dependencies & Security

- **Dependencies**: DuckDB (auto-installed with the Skill)
- **Permissions Required**: Local filesystem read/write
- **Security**: SEC 8/10 — purely local database, no data transmitted externally
- **Alternatives**: Notion database + Notion Skill (#13); Airtable Skill (#47)

---

## #34 — Reddit Readonly

| Property | Details |
|----------|---------|
| **Rank** | #34 / 50 |
| **Category** | Data |
| **Total Score** | 52 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install community/reddit-readonly` |
| **Target Users** | Reddit users, market researchers |

### Feature Overview

Read-only access to Reddit content:

- Read hot/new posts from specific subreddits
- Search Reddit content
- Read posts and comments
- Track specific subreddits or keywords
- Sentiment analysis (with LLM)

### Why It Matters

Reddit is the core discussion platform for many communities. The Agent can track r/openclaw, r/artificial, and other subreddits for the latest discussions, generating daily digests so you never miss important information. The read-only design ensures the Agent cannot accidentally post.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 7 | 6 | 6 | 7 | 7 | 8 | 5 | **52** |

### Installation & Setup

```bash
clawhub install community/reddit-readonly

openclaw skill configure reddit-readonly \
  --client-id your_reddit_client_id \
  --client-secret your_reddit_secret

# Usage examples
openclaw run "What's trending on r/openclaw today?"
openclaw run "Search Reddit for discussions about OpenClaw skills security"
```

### Dependencies & Security

- **Dependencies**: Reddit API credentials (free to obtain)
- **Permissions Required**: Reddit API read-only access
- **Security**: SEC 8/10 — read-only design prevents accidental posting or voting
- **Alternatives**: Web Browsing Skill to browse Reddit directly (no API Key needed but less efficient)

---

## #45 — CSV Analyzer

| Property | Details |
|----------|---------|
| **Rank** | #45 / 50 |
| **Category** | Data |
| **Total Score** | 49 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install community/csv-analyzer` |
| **Target Users** | Data analysts, users working with CSV files |

### Feature Overview

Quickly analyze and process CSV files:

- Read and summarize CSV structure
- Natural language queries on CSV data
- Generate statistical summaries and charts
- Data cleaning and transformation
- Export to other formats

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 7 | 4 | 6 | 6 | 7 | 8 | 5 | **49** |

### Installation & Setup

```bash
clawhub install community/csv-analyzer

openclaw run csv-analyzer --file ~/data/sales.csv
openclaw run "Analyze sales.csv and find the top 10 products by revenue"
```

### Dependencies & Security

- **Dependencies**: DuckDB (underlying engine)
- **Permissions Required**: Local file read
- **Security**: SEC 8/10 — local processing
- **Alternatives**: DuckDB CRM (#28) provides more complete database functionality

---

## #47 — Airtable

| Property | Details |
|----------|---------|
| **Rank** | #47 / 50 |
| **Category** | Data |
| **Total Score** | 45 / 80 |
| **Maturity** | 🟠 Alpha |
| **Installation** | `clawhub install community/airtable-claw` |
| **Target Users** | Airtable users |

### Feature Overview

Integration with Airtable databases:

- Read and write Airtable records
- Search and filter
- Create and manage Views
- Auto-sync data

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **45** |

### Installation & Setup

```bash
clawhub install community/airtable-claw

openclaw skill configure airtable-claw \
  --api-key your_airtable_api_key \
  --base-id appXXXXXXXXXXX
```

### Dependencies & Security

- **Dependencies**: Airtable API Key
- **Permissions Required**: Airtable Base read/write
- **Security**: SEC 7/10 — Airtable API permission granularity is average
- **Alternatives**: Notion (#13) for more complete features; DuckDB CRM (#28) for a local solution

---

## Data Skills Comparison

| Feature | Firecrawl | Apify | DuckDB CRM | Reddit | CSV Analyzer | Airtable |
|---------|:---------:|:-----:|:----------:|:------:|:------------:|:--------:|
| Data source | Web | Web | Local | Reddit | Local | Cloud |
| Scale | Medium-Large | Large | Medium | Medium | Small-Medium | Medium |
| Cost | API fees | API fees | Free | Free | Free | API fees |
| Real-time | High | High | Low | High | Low | Medium |
| Works offline | No | No | Yes | No | Yes | No |
| Structure level | High | High | Highest | Medium | High | High |

### Recommended Data Engineer Combinations

```bash
# Web data extraction
clawhub install community/firecrawl-claw
clawhub install community/apify-claw

# Local data analysis
clawhub install community/duckdb-crm
clawhub install community/csv-analyzer

# Community monitoring
clawhub install community/reddit-readonly
clawhub install community/tweetclaw
clawhub install community/summarize
```
