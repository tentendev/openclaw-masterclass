# Skills Ranking Raw Data

> Last updated: 2026-03-20
> Methodology version: 2.1
> Evaluators: Editorial team (3 members) + community panel (5 members)
> OpenClaw version tested: v0.9.4

## Scoring Dimensions

Each skill is scored 1-10 on 8 dimensions. Maximum total: 80.

| Code | Dimension | Description | Weight |
|------|-----------|-------------|--------|
| REL | Relevance | Practical usefulness for a typical OpenClaw user | Equal |
| COM | Compatibility | Integration depth with OpenClaw core (Gateway, memory, permissions) | Equal |
| TRC | Traction | ClawHub downloads (30d), GitHub stars, Discord mention frequency | Equal |
| VAL | Value | Efficiency gain or capability expansion delivered | Equal |
| MNT | Maintenance | Update frequency, issue response time, documentation quality | Equal |
| RLB | Reliability | Stability, error rate, edge case handling, crash frequency | Equal |
| SEC | Security (inverted) | 10 = minimal risk, 1 = severe risk. Considers permissions requested, data exfiltration surface, dependency supply chain | Equal |
| LRN | Learning Value | Educational benefit for understanding OpenClaw architecture or AI agent patterns | Equal |

## Data Sources

- **ClawHub download counts**: Official ClawHub API, 30-day rolling window as of 2026-03-15.
- **GitHub stars**: Scraped 2026-03-14.
- **Discord mention frequency**: Manual count of skill mentions in #general, #skills, #showcase channels, 2026-02-15 to 2026-03-15.
- **Hands-on testing**: Each top-20 skill was installed and tested by at least 2 editorial team members on macOS (Apple Silicon) and Ubuntu 22.04.
- **Security review**: Permissions audit of `manifest.json` for each skill. Dependency tree scanned with `npm audit` equivalent.

## Raw Scores: Top 50

### Tier A (65+ points)

| # | Skill | Category | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total | ClawHub DL (30d) | Stars |
|:-:|-------|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|:---------:|:-----:|
| 1 | GitHub | Development | 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** | 48,200 | 2,340 |
| 2 | Web Browsing | Research | 10 | 10 | 10 | 9 | 8 | 7 | 7 | 9 | **70** | bundled | N/A |
| 3 | GOG | Productivity | 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** | 41,500 | 1,890 |
| 4 | Tavily | Research | 9 | 9 | 8 | 9 | 8 | 8 | 8 | 8 | **67** | 35,700 | 1,620 |
| 5 | Gmail | Productivity | 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** | bundled | N/A |
| 6 | Calendar | Productivity | 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** | bundled | N/A |

### Tier B (58-64 points)

| # | Skill | Category | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total | ClawHub DL (30d) | Stars |
|:-:|-------|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|:---------:|:-----:|
| 7 | Slack | Communication | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | **64** | 28,900 | 1,450 |
| 8 | n8n | Automation | 8 | 7 | 8 | 9 | 8 | 8 | 7 | 8 | **63** | 26,100 | 1,380 |
| 9 | Obsidian | Productivity | 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** | 22,400 | 1,210 |
| 10 | Home Assistant | Smart Home | 7 | 8 | 7 | 9 | 8 | 8 | 7 | 7 | **61** | 19,800 | 1,150 |
| 11 | Capability Evolver | AI/ML | 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** | 17,200 | 980 |
| 12 | Security-check | Development | 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** | 16,500 | 920 |
| 13 | Notion | Productivity | 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** | 15,800 | 870 |
| 14 | Linear | Development | 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** | 14,200 | 810 |
| 15 | Felo Search | Research | 8 | 7 | 7 | 8 | 7 | 7 | 8 | 7 | **59** | 13,900 | 780 |
| 16 | Browser Automation | Automation | 8 | 7 | 7 | 8 | 7 | 7 | 6 | 8 | **58** | 13,100 | 740 |
| 17 | Todoist | Productivity | 8 | 7 | 6 | 7 | 8 | 8 | 8 | 6 | **58** | 12,600 | 690 |
| 18 | Firecrawl | Data | 7 | 7 | 7 | 8 | 8 | 7 | 7 | 7 | **58** | 12,100 | 710 |
| 19 | Summarize | Productivity | 8 | 8 | 7 | 7 | 6 | 7 | 9 | 6 | **58** | 11,800 | 650 |
| 20 | Cron-backup | Development | 7 | 8 | 5 | 8 | 7 | 8 | 8 | 6 | **57** | 10,400 | 580 |

### Tier C (50-57 points)

| # | Skill | Category | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total | ClawHub DL (30d) | Stars |
|:-:|-------|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|:---------:|:-----:|
| 21 | Apify | Data | 7 | 7 | 7 | 8 | 7 | 7 | 6 | 7 | **56** | 9,200 | 520 |
| 22 | Ontology | AI/ML | 6 | 7 | 5 | 8 | 6 | 7 | 8 | 9 | **56** | 8,700 | 610 |
| 23 | 1Password | Security | 7 | 7 | 6 | 7 | 8 | 8 | 9 | 4 | **56** | 8,400 | 490 |
| 24 | AgentMail | Communication | 7 | 7 | 6 | 7 | 7 | 7 | 7 | 8 | **56** | 7,900 | 470 |
| 25 | Felo Slides | Media | 7 | 7 | 7 | 8 | 7 | 6 | 7 | 6 | **55** | 7,600 | 430 |
| 26 | Telegram Bot | Communication | 7 | 7 | 6 | 7 | 7 | 7 | 7 | 7 | **55** | 7,100 | 410 |
| 27 | Spotify | Media | 6 | 7 | 7 | 7 | 7 | 7 | 8 | 6 | **55** | 6,800 | 540 |
| 28 | DuckDB CRM | Data | 6 | 7 | 5 | 8 | 7 | 8 | 8 | 6 | **55** | 6,200 | 380 |
| 29 | Codex Orchestration | Development | 7 | 6 | 5 | 8 | 6 | 7 | 7 | 8 | **54** | 5,900 | 420 |
| 30 | Philips Hue | Smart Home | 6 | 7 | 6 | 7 | 7 | 8 | 7 | 6 | **54** | 5,400 | 350 |
| 31 | Things 3 | Productivity | 7 | 6 | 5 | 7 | 7 | 8 | 8 | 5 | **53** | 4,800 | 310 |
| 32 | YouTube Digest | Media | 7 | 6 | 6 | 7 | 6 | 7 | 8 | 6 | **53** | 4,500 | 340 |
| 33 | WhatsApp CLI | Communication | 7 | 6 | 6 | 7 | 5 | 6 | 7 | 8 | **52** | 4,200 | 290 |
| 34 | Reddit Readonly | Data | 6 | 7 | 6 | 6 | 7 | 7 | 8 | 5 | **52** | 3,900 | 270 |
| 35 | Image Generation | Media | 7 | 6 | 6 | 7 | 6 | 6 | 7 | 7 | **52** | 3,700 | 310 |
| 36 | Elgato | Smart Home | 5 | 7 | 5 | 7 | 7 | 8 | 8 | 5 | **52** | 3,400 | 240 |
| 37 | IFTTT | Automation | 7 | 5 | 6 | 7 | 6 | 7 | 7 | 6 | **51** | 3,100 | 220 |
| 38 | RAG Pipeline | AI/ML | 6 | 6 | 5 | 8 | 5 | 6 | 7 | 8 | **51** | 2,800 | 360 |
| 39 | TweetClaw | Media | 6 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | **50** | 2,500 | 200 |
| 40 | Voice / Vapi | Media | 6 | 6 | 5 | 7 | 6 | 6 | 7 | 7 | **50** | 2,300 | 250 |

### Tier D (Below 50 points)

| # | Skill | Category | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total | ClawHub DL (30d) | Stars |
|:-:|-------|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|:---------:|:-----:|
| 41 | Trello | Productivity | 7 | 6 | 5 | 6 | 6 | 7 | 8 | 5 | **50** | 2,100 | 180 |
| 42 | BambuLab 3D | Smart Home | 4 | 6 | 5 | 7 | 6 | 7 | 7 | 7 | **49** | 1,900 | 280 |
| 43 | WHOOP Health | Health | 5 | 5 | 5 | 7 | 6 | 7 | 7 | 7 | **49** | 1,700 | 210 |
| 44 | Prompt Library | AI/ML | 6 | 7 | 4 | 6 | 5 | 7 | 9 | 5 | **49** | 1,500 | 190 |
| 45 | CSV Analyzer | Data | 6 | 7 | 4 | 6 | 6 | 7 | 8 | 5 | **49** | 1,300 | 160 |
| 46 | Jira Bridge | Development | 7 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **46** | 1,100 | 140 |
| 47 | Airtable | Data | 6 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **45** | 950 | 120 |
| 48 | Webhook Relay | Automation | 5 | 6 | 3 | 6 | 5 | 6 | 7 | 6 | **44** | 800 | 100 |
| 49 | PDF Parser | Productivity | 6 | 6 | 3 | 5 | 5 | 6 | 8 | 5 | **44** | 700 | 90 |
| 50 | Matrix Chat | Communication | 5 | 5 | 3 | 5 | 5 | 6 | 8 | 6 | **43** | 550 | 110 |

## Score Distribution Analysis

### By Dimension (Mean across Top 50)

| Dimension | Mean | Std Dev | Min | Max |
|-----------|:----:|:-------:|:---:|:---:|
| REL | 7.02 | 1.31 | 4 | 10 |
| COM | 6.88 | 1.24 | 5 | 10 |
| TRC | 5.96 | 1.68 | 3 | 10 |
| VAL | 7.18 | 0.96 | 5 | 9 |
| MNT | 6.64 | 1.06 | 5 | 9 |
| RLB | 7.10 | 0.79 | 6 | 9 |
| SEC | 7.54 | 0.76 | 6 | 9 |
| LRN | 6.72 | 1.23 | 4 | 9 |

### By Category (Mean total score)

| Category | Count | Mean Score | Top Skill |
|----------|:-----:|:----------:|-----------|
| Productivity | 10 | 57.5 | GOG (68) |
| Development | 7 | 57.4 | GitHub (72) |
| Research | 4 | 64.0 | Web Browsing (70) |
| Communication | 5 | 54.4 | Slack (64) |
| Automation | 4 | 54.0 | n8n (63) |
| AI/ML | 4 | 54.0 | Capability Evolver (60) |
| Media | 6 | 52.5 | Felo Slides (55) |
| Data | 5 | 53.4 | Firecrawl (58) |
| Smart Home | 4 | 54.3 | Home Assistant (61) |
| Security | 1 | 56.0 | 1Password (56) |
| Health | 1 | 49.0 | WHOOP (49) |

## Scoring Calibration Notes

- **Web Browsing TRC = 10**: Bundled skill, so no ClawHub download count. Score reflects that 100% of users have it active. Adjusted to max traction.
- **Security-check SEC = 9**: This skill's entire purpose is security auditing. Its own security posture is excellent (read-only, no network access beyond vulnerability DBs). Rated near-max.
- **WhatsApp CLI MNT = 5**: Relies on unofficial WhatsApp Web reverse-engineering. Frequent breakage when WhatsApp updates their protocol. Maintenance is reactive.
- **BambuLab 3D REL = 4**: Extremely niche (3D printer owners only). High value for that audience but low relevance to the general population.
- **Ontology LRN = 9**: Outstanding educational value for understanding how OpenClaw represents knowledge internally. Used in MasterClass Module 5 as a teaching tool.

## Methodology Changes from v2.0

- Added ClawHub 30-day download counts as a quantitative input to TRC scoring (previously TRC was purely qualitative).
- Formalized the security scoring rubric: permissions requested (3 points), data exfiltration surface (3 points), dependency supply chain (2 points), track record (2 points).
- Increased evaluator panel from 5 to 8 members (3 editorial + 5 community) to reduce individual bias.
