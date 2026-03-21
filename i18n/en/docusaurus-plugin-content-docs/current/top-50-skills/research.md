---
sidebar_position: 5
title: "Research Skills"
description: "Complete review of OpenClaw research Skills: Web Browsing, Tavily, Felo Search, Summarize"
keywords: [OpenClaw, Skills, Research, Web Browsing, Tavily, Felo Search, Summarize]
---

# Research Skills

Research Skills give the OpenClaw Agent the ability to "search the web." From basic web browsing to AI-powered intelligent search, these Skills let the Agent access the latest information in real time rather than relying solely on training data.

---

## #2 — Web Browsing

| Property | Details |
|----------|---------|
| **Rank** | #2 / 50 |
| **Category** | Research |
| **Total Score** | 70 / 80 |
| **Maturity** | 🟢 Stable |
| **Official/Community** | Official (bundled) |
| **Installation** | Bundled — no installation needed |
| **ClawHub Stats** | 180K+ usage count |
| **Target Users** | All users |

### Feature Overview

Web Browsing is one of OpenClaw's most essential Skills, built directly into the system:

- **Web navigation**: Visit any URL, parse HTML content
- **Content extraction**: Intelligently extract article body text, tables, and code blocks
- **Search integration**: Query via search engines (Google by default)
- **JavaScript rendering**: Handle SPAs and dynamically loaded content
- **Screenshot capability**: Capture visual snapshots of web pages
- **Multi-tab management**: Browse multiple pages simultaneously

### Why It Matters

Web Browsing is the key Skill that transforms the Agent from a "closed system" into an "open system." Without it, the Agent can only rely on training data; with it, the Agent can access real-time web information. The 180K+ usage count speaks to its indispensability.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 10 | 10 | 10 | 9 | 8 | 7 | 7 | 9 | **70** |

**Ranking rationale**: Perfect scores in relevance, compatibility, and community traction. Reliability is slightly lower (some websites block automated access), and security requires attention (the Agent could be tricked into visiting malicious sites).

### Configuration

```bash
# Web Browsing is a bundled Skill — ready to use
openclaw skill status web-browsing

# Custom settings
openclaw config set web-browsing.default_search google
openclaw config set web-browsing.timeout 30000
openclaw config set web-browsing.javascript true

# Set proxy (often needed on corporate networks)
openclaw config set web-browsing.proxy http://proxy.corp.com:8080
```

### Dependencies & Security

- **Dependencies**: Chromium runtime (installed with OpenClaw)
- **Permissions Required**: Network access
- **Security**: SEC 7/10 — the Agent may be lured to malicious sites via prompt injection

:::warning Web Injection Risk
Malicious websites may embed prompt injection attacks targeting AI Agents. Recommendations:
- Set a URL whitelist: `openclaw config set web-browsing.allowed_domains "*.github.com,*.stackoverflow.com"`
- Enable sandbox mode: `openclaw config set web-browsing.sandbox true`
- Avoid letting the Agent automatically click unknown links
:::

- **Alternatives**: Tavily (#4) provides more structured search results; Firecrawl (#18) is better for large-scale crawling

---

## #4 — Tavily

| Property | Details |
|----------|---------|
| **Rank** | #4 / 50 |
| **Category** | Research |
| **Total Score** | 67 / 80 |
| **Maturity** | 🟢 Stable |
| **Official/Community** | Community (framix-team) |
| **Installation** | `clawhub install framix-team/openclaw-tavily` |
| **Target Users** | Researchers, users needing high-quality search |

### Feature Overview

Tavily is a search engine designed specifically for AI Agents:

- **AI Search**: Semantic understanding of query intent, returning structured results
- **Web crawling**: Deep-crawl specified URLs and extract structured content
- **Instant answers**: Directly answer factual questions (with source citations)
- **Search depth control**: `basic` (fast) vs `advanced` (deep)
- **Source credibility scoring**: Each search result includes a credibility score

### Why It Matters

Compared to Web Browsing's general browsing capability, Tavily focuses exclusively on "search" and excels at it. Its results are pre-processed by AI, so the Agent can use them directly without additional HTML parsing. For research-intensive workflows, Tavily is more efficient than Web Browsing.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 9 | 9 | 8 | 9 | 8 | 8 | 8 | 8 | **67** |

### Installation & Setup

```bash
clawhub install framix-team/openclaw-tavily

# Set the Tavily API Key (free plan: 1000 queries/month)
openclaw skill configure tavily \
  --api-key tvly-xxxxxxxxxxxx

# Usage example
openclaw run "Use Tavily to search for the latest OpenClaw version features"
```

### Dependencies & Security

- **Dependencies**: Tavily API Key (free plan available)
- **Permissions Required**: Network access (Tavily API only)
- **Security**: SEC 8/10 — only accesses the Tavily API, no direct web browsing, reducing injection risk
- **Alternatives**: Felo Search (#15) offers optimized Chinese-language search; Web Browsing (#2) is more general-purpose

---

## #15 — Felo Search

| Property | Details |
|----------|---------|
| **Rank** | #15 / 50 |
| **Category** | Research |
| **Total Score** | 59 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install felo-search` |
| **Target Users** | Users needing multilingual search, Chinese-language users |

### Feature Overview

Felo Search is another AI-powered search tool with distinctive features:

- **Multilingual optimization**: Chinese and Japanese search quality superior to Tavily
- **Citation markup**: Every answer sentence includes source links
- **Instant answer mode**: Generates summaries instead of link lists
- **Topic tracking**: Continuously track the latest information on specific topics

### Why It Matters

For Chinese-language users, Felo Search typically outperforms Tavily in Chinese content search quality. If your primary research language is Chinese or Japanese, Felo Search is the better choice.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 7 | 7 | 8 | 7 | 7 | 8 | 7 | **59** |

### Installation & Setup

```bash
clawhub install felo-search

# Set the API Key
openclaw skill configure felo-search \
  --api-key your_felo_api_key

# Usage example (Chinese search)
openclaw run "Use Felo to search for the latest AI startup news in Taiwan"
```

### Dependencies & Security

- **Dependencies**: Felo Search API Key
- **Permissions Required**: Network access (Felo API only)
- **Security**: SEC 8/10 — similar security model to Tavily
- **Alternatives**: Tavily (#4) for better English search quality; Web Browsing (#2) for the most general-purpose solution

---

## #19 — Summarize (Research Perspective)

For the full introduction to the Summarize Skill, see [Productivity Skills](./productivity#19--summarize). In research workflows, Summarize plays the following role:

### Summarize in Research Workflows

```bash
# Search → Summarize pipeline
openclaw run "
  1. Use Tavily to search for 'transformer architecture 2026 improvements'
  2. Summarize the top 5 results
  3. Consolidate into a research note and save to Obsidian
"
```

The Summarize Skill works best in combination with Tavily or Web Browsing, compressing large amounts of search results into actionable insights.

---

## Research Skills Comparison

| Feature | Web Browsing | Tavily | Felo Search | Summarize |
|---------|:----------:|:------:|:-----------:|:---------:|
| Search capability | Yes | Yes | Yes | No |
| Web browsing | Yes | No | No | No |
| Crawling capability | Yes | Yes | No | No |
| Structured output | No | Yes | Yes | Yes |
| Chinese optimization | No | Average | Yes | Yes |
| Citation markup | No | Yes | Yes | No |
| Requires API Key | No | Yes | Yes | No |
| Works offline | No | No | No | Yes |

### Recommended Research Combinations

```bash
# Deep research workflow
clawhub install framix-team/openclaw-tavily
clawhub install community/summarize
clawhub install community/obsidian-claw
# Paired with bundled Web Browsing

# Chinese research workflow
clawhub install felo-search
clawhub install community/summarize
clawhub install community/notion-claw

# Minimal research workflow (zero cost)
# Use only bundled Web Browsing + Summarize
clawhub install community/summarize
```
