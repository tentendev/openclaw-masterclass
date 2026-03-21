---
sidebar_position: 1
title: "Top 50 Skills 总览"
description: "OpenClaw 社区最推荐的 50 个 Skills 完整排名、评分方法与安装指南"
keywords: [OpenClaw, Skills, ClawHub, Top 50, 排名, 评分]
---

# Top 50 Skills 总览

> 最后更新：2026-03-20 ｜ 基于 OpenClaw v0.9.x ｜ 数据来源：ClawHub 统计 + 社区投票 + 编辑实测

本指南收录 OpenClaw 生态系统中最具价值的 50 个 Skills，依照 **八维度量化评分** 进行排名，帮助你快速找到适合自己工作流程的 Skills 组合。

---

## 评分方法论 (Scoring Methodology)

每个 Skill 依照以下 8 个维度进行 1–10 分评分，满分 **80 分**：

| 维度 | 代号 | 说明 |
|------|------|------|
| **相关性** (Relevance) | REL | 对一般 OpenClaw 用户的实用程度 |
| **兼容性** (Compatibility) | COM | 与 OpenClaw 核心架构的整合深度 |
| **社区热度** (Traction) | TRC | ClawHub 下载量、GitHub Stars、Discord 讨论量 |
| **价值** (Value) | VAL | 带来的效率提升或功能扩展幅度 |
| **维护度** (Maintenance) | MNT | 更新频率、Issue 响应速度、文档质量 |
| **可靠度** (Reliability) | RLB | 稳定性、错误率、边界情况处理 |
| **安全性** (Security) | SEC | 反转计分：10 = 最安全，1 = 高风险 |
| **学习价值** (Learning Value) | LRN | 对理解 OpenClaw 架构或 AI Agent 模式的教育意义 |

**总分 = REL + COM + TRC + VAL + MNT + RLB + SEC + LRN（满分 80）**

### 成熟度等级

| 等级 | 标签 | 说明 |
|------|------|------|
| 🟢 | **Stable** | 经过广泛测试，可用于生产环境 |
| 🟡 | **Beta** | 功能完整但仍有已知问题 |
| 🟠 | **Alpha** | 实验性质，API 可能变动 |
| 🔴 | **Experimental** | 概念验证阶段，勿用于重要工作流 |

---

## Top 10 快速总览

| 排名 | Skill 名称 | 类别 | 总分 | 安装方式 | 成熟度 |
|:----:|-----------|------|:----:|---------|:------:|
| 1 | **GitHub** | 开发 | 72 | `clawhub install openclaw/github` | 🟢 |
| 2 | **Web Browsing** | 研究 | 70 | 内置（bundled） | 🟢 |
| 3 | **GOG** | 生产力 | 68 | `clawhub install openclaw/gog` | 🟢 |
| 4 | **Tavily** | 研究 | 67 | `clawhub install framix-team/openclaw-tavily` | 🟢 |
| 5 | **Gmail** | 生产力 | 66 | 内置（bundled） | 🟢 |
| 6 | **Calendar** | 生产力 | 65 | 内置（bundled） | 🟢 |
| 7 | **Slack** | 通讯 | 64 | `clawhub install steipete/slack` | 🟡 |
| 8 | **n8n** | 自动化 | 63 | `clawhub install community/n8n-openclaw` | 🟡 |
| 9 | **Obsidian** | 生产力 | 62 | `clawhub install community/obsidian-claw` | 🟡 |
| 10 | **Home Assistant** | 智能家居 | 61 | `clawhub install openclaw/homeassistant` | 🟡 |

---

## 完整排名表 (Top 50)

| # | Skill | 类别 | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:-:|-------|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 1 | GitHub | 开发 | 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** |
| 2 | Web Browsing | 研究 | 10 | 10 | 10 | 9 | 8 | 7 | 7 | 9 | **70** |
| 3 | GOG | 生产力 | 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** |
| 4 | Tavily | 研究 | 9 | 9 | 8 | 9 | 8 | 8 | 8 | 8 | **67** |
| 5 | Gmail | 生产力 | 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** |
| 6 | Calendar | 生产力 | 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** |
| 7 | Slack | 通讯 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | **64** |
| 8 | n8n | 自动化 | 8 | 7 | 8 | 9 | 8 | 8 | 7 | 8 | **63** |
| 9 | Obsidian | 生产力 | 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** |
| 10 | Home Assistant | 智能家居 | 7 | 8 | 7 | 9 | 8 | 8 | 7 | 7 | **61** |
| 11 | Capability Evolver | AI/ML | 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** |
| 12 | Security-check | 开发 | 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** |
| 13 | Notion | 生产力 | 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** |
| 14 | Linear | 开发 | 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** |
| 15 | Felo Search | 研究 | 8 | 7 | 7 | 8 | 7 | 7 | 8 | 7 | **59** |
| 16 | Browser Automation | 自动化 | 8 | 7 | 7 | 8 | 7 | 7 | 6 | 8 | **58** |
| 17 | Todoist | 生产力 | 8 | 7 | 6 | 7 | 8 | 8 | 8 | 6 | **58** |
| 18 | Firecrawl | 数据 | 7 | 7 | 7 | 8 | 8 | 7 | 7 | 7 | **58** |
| 19 | Summarize | 生产力 | 8 | 8 | 7 | 7 | 6 | 7 | 9 | 6 | **58** |
| 20 | Cron-backup | 开发 | 7 | 8 | 5 | 8 | 7 | 8 | 8 | 6 | **57** |
| 21 | Apify | 数据 | 7 | 7 | 7 | 8 | 7 | 7 | 6 | 7 | **56** |
| 22 | Ontology | AI/ML | 6 | 7 | 5 | 8 | 6 | 7 | 8 | 9 | **56** |
| 23 | 1Password | 安全 | 7 | 7 | 6 | 7 | 8 | 8 | 9 | 4 | **56** |
| 24 | AgentMail | 通讯 | 7 | 7 | 6 | 7 | 7 | 7 | 7 | 8 | **56** |
| 25 | Felo Slides | 媒体 | 7 | 7 | 7 | 8 | 7 | 6 | 7 | 6 | **55** |
| 26 | Telegram Bot | 通讯 | 7 | 7 | 6 | 7 | 7 | 7 | 7 | 7 | **55** |
| 27 | Spotify | 媒体 | 6 | 7 | 7 | 7 | 7 | 7 | 8 | 6 | **55** |
| 28 | DuckDB CRM | 数据 | 6 | 7 | 5 | 8 | 7 | 8 | 8 | 6 | **55** |
| 29 | Codex Orchestration | 开发 | 7 | 6 | 5 | 8 | 6 | 7 | 7 | 8 | **54** |
| 30 | Philips Hue | 智能家居 | 6 | 7 | 6 | 7 | 7 | 8 | 7 | 6 | **54** |
| 31 | Things 3 | 生产力 | 7 | 6 | 5 | 7 | 7 | 8 | 8 | 5 | **53** |
| 32 | YouTube Digest | 媒体 | 7 | 6 | 6 | 7 | 6 | 7 | 8 | 6 | **53** |
| 33 | WhatsApp CLI | 通讯 | 7 | 6 | 6 | 7 | 5 | 6 | 7 | 8 | **52** |
| 34 | Reddit Readonly | 数据 | 6 | 7 | 6 | 6 | 7 | 7 | 8 | 5 | **52** |
| 35 | Image Generation | 媒体 | 7 | 6 | 6 | 7 | 6 | 6 | 7 | 7 | **52** |
| 36 | Elgato | 智能家居 | 5 | 7 | 5 | 7 | 7 | 8 | 8 | 5 | **52** |
| 37 | IFTTT | 自动化 | 7 | 5 | 6 | 7 | 6 | 7 | 7 | 6 | **51** |
| 38 | RAG Pipeline | AI/ML | 6 | 6 | 5 | 8 | 5 | 6 | 7 | 8 | **51** |
| 39 | TweetClaw | 媒体 | 6 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | **50** |
| 40 | Voice / Vapi | 媒体 | 6 | 6 | 5 | 7 | 6 | 6 | 7 | 7 | **50** |
| 41 | Trello | 生产力 | 7 | 6 | 5 | 6 | 6 | 7 | 8 | 5 | **50** |
| 42 | BambuLab 3D | 智能家居 | 4 | 6 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |
| 43 | WHOOP Health | 健康 | 5 | 5 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |
| 44 | Prompt Library | AI/ML | 6 | 7 | 4 | 6 | 5 | 7 | 9 | 5 | **49** |
| 45 | CSV Analyzer | 数据 | 6 | 7 | 4 | 6 | 6 | 7 | 8 | 5 | **49** |
| 46 | Jira Bridge | 开发 | 7 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **46** |
| 47 | Airtable | 数据 | 6 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **45** |
| 48 | Webhook Relay | 自动化 | 5 | 6 | 3 | 6 | 5 | 6 | 7 | 6 | **44** |
| 49 | PDF Parser | 生产力 | 6 | 6 | 3 | 5 | 5 | 6 | 8 | 5 | **44** |
| 50 | Matrix Chat | 通讯 | 5 | 5 | 3 | 5 | 5 | 6 | 8 | 6 | **43** |

---

## 如何使用这份指南

### 按角色推荐

| 角色 | 必装 Skills | 建议搭配 |
|------|-----------|---------|
| **软件工程师** | GitHub, Security-check, Linear | Codex Orchestration, n8n |
| **市场人员** | Gmail, Slack, Web Browsing | Felo Search, TweetClaw, Summarize |
| **研究者** | Tavily, Web Browsing, Summarize | Obsidian, Ontology, Reddit Readonly |
| **项目经理** | Calendar, Notion, Linear | Todoist, Slack, n8n |
| **创作者** | Image Generation, Felo Slides, Spotify | YouTube Digest, Voice/Vapi |
| **IoT 玩家** | Home Assistant, Philips Hue | Elgato, BambuLab 3D |

### 快速安装你的第一组 Skills

```bash
# 开发者起手式
clawhub install openclaw/github
clawhub install community/security-check
clawhub install community/n8n-openclaw

# 研究者起手式
clawhub install framix-team/openclaw-tavily
clawhub install community/obsidian-claw
clawhub install community/summarize

# 生产力起手式
clawhub install openclaw/gog
clawhub install community/notion-claw
clawhub install community/todoist-claw
```

:::warning 安全提醒
安装任何第三方 Skill 前，请务必阅读本指南的 [安全守则](./safety-guide) 页面。社区 Skills 未经 OpenClaw 团队审核，可能存在数据泄露风险。
:::

---

## 分类目录

- [生产力 Skills](./productivity) — Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize
- [开发工具 Skills](./development) — GitHub, Security-check, Cron-backup, Linear, n8n, Codex Orchestration
- [通讯 Skills](./communication) — Slack, WhatsApp CLI, Telegram Bot, AgentMail
- [研究 Skills](./research) — Tavily, Web Browsing, Felo Search, Summarize
- [自动化 Skills](./automation) — Browser Automation, Home Assistant, n8n, IFTTT
- [AI/ML Skills](./ai-ml) — Capability Evolver, Ontology, RAG Pipeline
- [智能家居 Skills](./smart-home) — Philips Hue, Elgato, Home Assistant, BambuLab 3D
- [媒体 Skills](./media) — Spotify, YouTube Digest, Image Generation, Felo Slides, TweetClaw
- [数据 Skills](./data) — Apify, Firecrawl, DuckDB CRM, Reddit Readonly
- [安全守则](./safety-guide) — ClawHavoc 案例、VirusTotal 整合、最小权限原则
