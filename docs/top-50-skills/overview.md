---
sidebar_position: 1
title: "Top 50 Skills 總覽"
description: "OpenClaw 社群最推薦的 50 個 Skills 完整排名、評分方法與安裝指南"
keywords: [OpenClaw, Skills, ClawHub, Top 50, 排名, 評分]
---

# Top 50 Skills 總覽

> 最後更新：2026-03-20 ｜ 基於 OpenClaw v0.9.x ｜ 資料來源：ClawHub 統計 + 社群投票 + 編輯實測

本指南收錄 OpenClaw 生態系中最具價值的 50 個 Skills，依照 **八維度量化評分** 進行排名，協助你快速找到適合自己工作流程的 Skills 組合。

---

## 評分方法論 (Scoring Methodology)

每個 Skill 依照以下 8 個維度進行 1–10 分評分，滿分 **80 分**：

| 維度 | 代號 | 說明 |
|------|------|------|
| **相關性** (Relevance) | REL | 對一般 OpenClaw 使用者的實用程度 |
| **相容性** (Compatibility) | COM | 與 OpenClaw 核心架構的整合深度 |
| **社群熱度** (Traction) | TRC | ClawHub 下載量、GitHub Stars、Discord 討論量 |
| **價值** (Value) | VAL | 帶來的效率提升或功能擴展幅度 |
| **維護度** (Maintenance) | MNT | 更新頻率、Issue 回應速度、文件品質 |
| **可靠度** (Reliability) | RLB | 穩定性、錯誤率、edge case 處理 |
| **安全性** (Security) | SEC | 反轉計分：10 = 最安全，1 = 高風險 |
| **學習價值** (Learning Value) | LRN | 對理解 OpenClaw 架構或 AI Agent 模式的教育意義 |

**總分 = REL + COM + TRC + VAL + MNT + RLB + SEC + LRN（滿分 80）**

### 成熟度等級

| 等級 | 標籤 | 說明 |
|------|------|------|
| 🟢 | **Stable** | 經過廣泛測試，可用於 production |
| 🟡 | **Beta** | 功能完整但仍有已知問題 |
| 🟠 | **Alpha** | 實驗性質，API 可能變動 |
| 🔴 | **Experimental** | 概念驗證階段，勿用於重要工作流 |

---

## Top 10 快速總覽

| 排名 | Skill 名稱 | 類別 | 總分 | 安裝方式 | 成熟度 |
|:----:|-----------|------|:----:|---------|:------:|
| 1 | **GitHub** | Development | 72 | `clawhub install openclaw/github` | 🟢 |
| 2 | **Web Browsing** | Research | 70 | 內建（bundled） | 🟢 |
| 3 | **GOG** | Productivity | 68 | `clawhub install openclaw/gog` | 🟢 |
| 4 | **Tavily** | Research | 67 | `clawhub install framix-team/openclaw-tavily` | 🟢 |
| 5 | **Gmail** | Productivity | 66 | 內建（bundled） | 🟢 |
| 6 | **Calendar** | Productivity | 65 | 內建（bundled） | 🟢 |
| 7 | **Slack** | Communication | 64 | `clawhub install steipete/slack` | 🟡 |
| 8 | **n8n** | Automation | 63 | `clawhub install community/n8n-openclaw` | 🟡 |
| 9 | **Obsidian** | Productivity | 62 | `clawhub install community/obsidian-claw` | 🟡 |
| 10 | **Home Assistant** | Smart Home | 61 | `clawhub install openclaw/homeassistant` | 🟡 |

---

## 完整排名表 (Top 50)

| # | Skill | 類別 | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:-:|-------|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 1 | GitHub | Development | 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** |
| 2 | Web Browsing | Research | 10 | 10 | 10 | 9 | 8 | 7 | 7 | 9 | **70** |
| 3 | GOG | Productivity | 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** |
| 4 | Tavily | Research | 9 | 9 | 8 | 9 | 8 | 8 | 8 | 8 | **67** |
| 5 | Gmail | Productivity | 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** |
| 6 | Calendar | Productivity | 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** |
| 7 | Slack | Communication | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | **64** |
| 8 | n8n | Automation | 8 | 7 | 8 | 9 | 8 | 8 | 7 | 8 | **63** |
| 9 | Obsidian | Productivity | 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** |
| 10 | Home Assistant | Smart Home | 7 | 8 | 7 | 9 | 8 | 8 | 7 | 7 | **61** |
| 11 | Capability Evolver | AI/ML | 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** |
| 12 | Security-check | Development | 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** |
| 13 | Notion | Productivity | 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** |
| 14 | Linear | Development | 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** |
| 15 | Felo Search | Research | 8 | 7 | 7 | 8 | 7 | 7 | 8 | 7 | **59** |
| 16 | Browser Automation | Automation | 8 | 7 | 7 | 8 | 7 | 7 | 6 | 8 | **58** |
| 17 | Todoist | Productivity | 8 | 7 | 6 | 7 | 8 | 8 | 8 | 6 | **58** |
| 18 | Firecrawl | Data | 7 | 7 | 7 | 8 | 8 | 7 | 7 | 7 | **58** |
| 19 | Summarize | Productivity | 8 | 8 | 7 | 7 | 6 | 7 | 9 | 6 | **58** |
| 20 | Cron-backup | Development | 7 | 8 | 5 | 8 | 7 | 8 | 8 | 6 | **57** |
| 21 | Apify | Data | 7 | 7 | 7 | 8 | 7 | 7 | 6 | 7 | **56** |
| 22 | Ontology | AI/ML | 6 | 7 | 5 | 8 | 6 | 7 | 8 | 9 | **56** |
| 23 | 1Password | Security | 7 | 7 | 6 | 7 | 8 | 8 | 9 | 4 | **56** |
| 24 | AgentMail | Communication | 7 | 7 | 6 | 7 | 7 | 7 | 7 | 8 | **56** |
| 25 | Felo Slides | Media | 7 | 7 | 7 | 8 | 7 | 6 | 7 | 6 | **55** |
| 26 | Telegram Bot | Communication | 7 | 7 | 6 | 7 | 7 | 7 | 7 | 7 | **55** |
| 27 | Spotify | Media | 6 | 7 | 7 | 7 | 7 | 7 | 8 | 6 | **55** |
| 28 | DuckDB CRM | Data | 6 | 7 | 5 | 8 | 7 | 8 | 8 | 6 | **55** |
| 29 | Codex Orchestration | Development | 7 | 6 | 5 | 8 | 6 | 7 | 7 | 8 | **54** |
| 30 | Philips Hue | Smart Home | 6 | 7 | 6 | 7 | 7 | 8 | 7 | 6 | **54** |
| 31 | Things 3 | Productivity | 7 | 6 | 5 | 7 | 7 | 8 | 8 | 5 | **53** |
| 32 | YouTube Digest | Media | 7 | 6 | 6 | 7 | 6 | 7 | 8 | 6 | **53** |
| 33 | WhatsApp CLI | Communication | 7 | 6 | 6 | 7 | 5 | 6 | 7 | 8 | **52** |
| 34 | Reddit Readonly | Data | 6 | 7 | 6 | 6 | 7 | 7 | 8 | 5 | **52** |
| 35 | Image Generation | Media | 7 | 6 | 6 | 7 | 6 | 6 | 7 | 7 | **52** |
| 36 | Elgato | Smart Home | 5 | 7 | 5 | 7 | 7 | 8 | 8 | 5 | **52** |
| 37 | IFTTT | Automation | 7 | 5 | 6 | 7 | 6 | 7 | 7 | 6 | **51** |
| 38 | RAG Pipeline | AI/ML | 6 | 6 | 5 | 8 | 5 | 6 | 7 | 8 | **51** |
| 39 | TweetClaw | Media | 6 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | **50** |
| 40 | Voice / Vapi | Media | 6 | 6 | 5 | 7 | 6 | 6 | 7 | 7 | **50** |
| 41 | Trello | Productivity | 7 | 6 | 5 | 6 | 6 | 7 | 8 | 5 | **50** |
| 42 | BambuLab 3D | Smart Home | 4 | 6 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |
| 43 | WHOOP Health | Health | 5 | 5 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |
| 44 | Prompt Library | AI/ML | 6 | 7 | 4 | 6 | 5 | 7 | 9 | 5 | **49** |
| 45 | CSV Analyzer | Data | 6 | 7 | 4 | 6 | 6 | 7 | 8 | 5 | **49** |
| 46 | Jira Bridge | Development | 7 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **46** |
| 47 | Airtable | Data | 6 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **45** |
| 48 | Webhook Relay | Automation | 5 | 6 | 3 | 6 | 5 | 6 | 7 | 6 | **44** |
| 49 | PDF Parser | Productivity | 6 | 6 | 3 | 5 | 5 | 6 | 8 | 5 | **44** |
| 50 | Matrix Chat | Communication | 5 | 5 | 3 | 5 | 5 | 6 | 8 | 6 | **43** |

---

## 如何使用這份指南

### 依角色推薦

| 角色 | 必裝 Skills | 建議搭配 |
|------|-----------|---------|
| **軟體工程師** | GitHub, Security-check, Linear | Codex Orchestration, n8n |
| **行銷人員** | Gmail, Slack, Web Browsing | Felo Search, TweetClaw, Summarize |
| **研究者** | Tavily, Web Browsing, Summarize | Obsidian, Ontology, Reddit Readonly |
| **專案經理** | Calendar, Notion, Linear | Todoist, Slack, n8n |
| **創作者** | Image Generation, Felo Slides, Spotify | YouTube Digest, Voice/Vapi |
| **IoT 玩家** | Home Assistant, Philips Hue | Elgato, BambuLab 3D |

### 快速安裝你的第一組 Skills

```bash
# 開發者起手式
clawhub install openclaw/github
clawhub install community/security-check
clawhub install community/n8n-openclaw

# 研究者起手式
clawhub install framix-team/openclaw-tavily
clawhub install community/obsidian-claw
clawhub install community/summarize

# 生產力起手式
clawhub install openclaw/gog
clawhub install community/notion-claw
clawhub install community/todoist-claw
```

:::warning 安全提醒
安裝任何第三方 Skill 前，請務必閱讀本指南的 [安全守則](./safety-guide) 頁面。社群 Skills 未經 OpenClaw 團隊審核，可能存在資料外洩風險。
:::

---

## 分類目錄

- [生產力 Skills](./productivity) — Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize
- [開發工具 Skills](./development) — GitHub, Security-check, Cron-backup, Linear, n8n, Codex Orchestration
- [通訊 Skills](./communication) — Slack, WhatsApp CLI, Telegram Bot, AgentMail
- [研究 Skills](./research) — Tavily, Web Browsing, Felo Search, Summarize
- [自動化 Skills](./automation) — Browser Automation, Home Assistant, n8n, IFTTT
- [AI/ML Skills](./ai-ml) — Capability Evolver, Ontology, RAG Pipeline
- [智慧家庭 Skills](./smart-home) — Philips Hue, Elgato, Home Assistant, BambuLab 3D
- [媒體 Skills](./media) — Spotify, YouTube Digest, Image Generation, Felo Slides, TweetClaw
- [資料 Skills](./data) — Apify, Firecrawl, DuckDB CRM, Reddit Readonly
- [安全守則](./safety-guide) — ClawHavoc 案例、VirusTotal 整合、最小權限原則
