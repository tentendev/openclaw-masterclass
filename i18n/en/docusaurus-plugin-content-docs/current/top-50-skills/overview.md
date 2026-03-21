---
sidebar_position: 1
title: "Top 50 Skills Overview"
description: "The 50 most recommended OpenClaw skills — complete rankings, scoring methodology, and installation guide"
keywords: [OpenClaw, Skills, ClawHub, Top 50, ranking, scoring]
---

# Top 50 Skills Overview

> Last updated: 2026-03-20 | Based on OpenClaw v0.9.x | Data sources: ClawHub statistics + community votes + editorial testing

This guide catalogs the 50 most valuable skills in the OpenClaw ecosystem, ranked using an **eight-dimension quantitative scoring system** to help you quickly identify the right skill combination for your workflow.

---

## Scoring Methodology

Each skill is scored from 1-10 across 8 dimensions, for a maximum of **80 points**:

| Dimension | Code | Description |
|-----------|------|-------------|
| **Relevance** | REL | Practical usefulness for the average OpenClaw user |
| **Compatibility** | COM | Depth of integration with OpenClaw's core architecture |
| **Traction** | TRC | ClawHub downloads, GitHub Stars, Discord discussion volume |
| **Value** | VAL | Efficiency gains or feature expansion delivered |
| **Maintenance** | MNT | Update frequency, issue response time, documentation quality |
| **Reliability** | RLB | Stability, error rate, edge-case handling |
| **Security** | SEC | Inverse scoring: 10 = most secure, 1 = highest risk |
| **Learning Value** | LRN | Educational value for understanding OpenClaw architecture or AI Agent patterns |

**Total = REL + COM + TRC + VAL + MNT + RLB + SEC + LRN (max 80)**

### Maturity Levels

| Level | Label | Description |
|-------|-------|-------------|
| 🟢 | **Stable** | Extensively tested, production-ready |
| 🟡 | **Beta** | Feature-complete but with known issues |
| 🟠 | **Alpha** | Experimental — API may change |
| 🔴 | **Experimental** | Proof of concept — do not use in critical workflows |

---

## Top 10 at a Glance

| Rank | Skill Name | Category | Score | Installation | Maturity |
|:----:|-----------|----------|:-----:|-------------|:--------:|
| 1 | **GitHub** | Development | 72 | `clawhub install openclaw/github` | 🟢 |
| 2 | **Web Browsing** | Research | 70 | Built-in (bundled) | 🟢 |
| 3 | **GOG** | Productivity | 68 | `clawhub install openclaw/gog` | 🟢 |
| 4 | **Tavily** | Research | 67 | `clawhub install framix-team/openclaw-tavily` | 🟢 |
| 5 | **Gmail** | Productivity | 66 | Built-in (bundled) | 🟢 |
| 6 | **Calendar** | Productivity | 65 | Built-in (bundled) | 🟢 |
| 7 | **Slack** | Communication | 64 | `clawhub install steipete/slack` | 🟡 |
| 8 | **n8n** | Automation | 63 | `clawhub install community/n8n-openclaw` | 🟡 |
| 9 | **Obsidian** | Productivity | 62 | `clawhub install community/obsidian-claw` | 🟡 |
| 10 | **Home Assistant** | Smart Home | 61 | `clawhub install openclaw/homeassistant` | 🟡 |

---

## Full Rankings (Top 50)

| # | Skill | Category | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:-:|-------|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
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

## How to Use This Guide

### Recommended Skills by Role

| Role | Must-Have Skills | Suggested Add-Ons |
|------|-----------------|-------------------|
| **Software Engineer** | GitHub, Security-check, Linear | Codex Orchestration, n8n |
| **Marketing** | Gmail, Slack, Web Browsing | Felo Search, TweetClaw, Summarize |
| **Researcher** | Tavily, Web Browsing, Summarize | Obsidian, Ontology, Reddit Readonly |
| **Project Manager** | Calendar, Notion, Linear | Todoist, Slack, n8n |
| **Content Creator** | Image Generation, Felo Slides, Spotify | YouTube Digest, Voice/Vapi |
| **IoT Enthusiast** | Home Assistant, Philips Hue | Elgato, BambuLab 3D |

### Quick-Install Your First Skill Set

```bash
# Developer starter pack
clawhub install openclaw/github
clawhub install community/security-check
clawhub install community/n8n-openclaw

# Researcher starter pack
clawhub install framix-team/openclaw-tavily
clawhub install community/obsidian-claw
clawhub install community/summarize

# Productivity starter pack
clawhub install openclaw/gog
clawhub install community/notion-claw
clawhub install community/todoist-claw
```

:::warning Security Reminder
Before installing any third-party skill, read the [Safety Guide](./safety-guide) page in this section. Community skills are not reviewed by the OpenClaw team and may pose data exfiltration risks.
:::

---

## Category Directory

- [Productivity Skills](./productivity) — Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize
- [Development Skills](./development) — GitHub, Security-check, Cron-backup, Linear, n8n, Codex Orchestration
- [Communication Skills](./communication) — Slack, WhatsApp CLI, Telegram Bot, AgentMail
- [Research Skills](./research) — Tavily, Web Browsing, Felo Search, Summarize
- [Automation Skills](./automation) — Browser Automation, Home Assistant, n8n, IFTTT
- [AI/ML Skills](./ai-ml) — Capability Evolver, Ontology, RAG Pipeline
- [Smart Home Skills](./smart-home) — Philips Hue, Elgato, Home Assistant, BambuLab 3D
- [Media Skills](./media) — Spotify, YouTube Digest, Image Generation, Felo Slides, TweetClaw
- [Data Skills](./data) — Apify, Firecrawl, DuckDB CRM, Reddit Readonly
- [Safety Guide](./safety-guide) — ClawHavoc case study, VirusTotal integration, least-privilege principle
