# Content Roadmap

> Last updated: 2026-03-20
> Planning horizon: Q2-Q3 2026

## Current State (March 2026)

### Shipped Content

| Section | Pages | Status | Notes |
|---------|:-----:|--------|-------|
| Getting Started (installation) | 1 | Complete | Covers macOS, Linux, Windows (WSL) |
| MasterClass Overview | 1 | Complete | Course structure and prerequisites |
| MasterClass Module 01 (Foundations) | 1 | Complete | Architecture, Gateway, first agent |
| MasterClass Module 06 (Automation) | 1 | Complete | n8n integration, cron patterns |
| Top 50 Skills Overview | 1 | Complete | Full ranking table, methodology, role recommendations |
| Resources (Official Links) | 1 | Complete | Official repos, docs, social links |
| Resources (Learning Path) | 1 | Complete | Beginner to advanced progression |
| Intro / Landing | 1 | Complete | Site introduction and navigation guide |
| Blog infrastructure | Setup | Complete | Custom blog plugin with tags, pagination |
| OpenAPI reference | Setup | Complete | Gateway spec integrated, generation scripts ready |

**Total shipped pages: ~8 content pages + infrastructure**

### In Progress

| Content | Assignee | ETA | Blockers |
|---------|----------|-----|----------|
| MasterClass Module 02 (Gateway) | Erik | 2026-03-28 | Waiting for Gateway v0.9.5 API changes |
| MasterClass Module 03 (Skills System) | Erik | 2026-04-05 | None |
| Top 50 Skills: individual skill pages (batch 1: top 10) | Content team | 2026-04-10 | Need hands-on testing for each |
| Communities Top 10 page | Content team | 2026-03-25 | Research data complete |
| Reddit Top 30 Showcases page | Content team | 2026-03-30 | Selection in progress |

## Priority Order: Next Content

### P0 — Ship by end of April 2026

These are the pages most frequently requested or most likely to drive traffic.

1. **MasterClass Modules 02-05** — Completes the first half of the course. Modules 02 (Gateway) and 03 (Skills System) are the most requested based on Discord feedback.
2. **Individual Skill Pages (Top 10)** — Deep-dive pages for GitHub, Web Browsing, GOG, Tavily, Gmail, Calendar, Slack, n8n, Obsidian, Home Assistant. Each page covers: installation, configuration, use cases, troubleshooting, security notes.
3. **Communities Top 10** — Curated guide to the best places to get help.
4. **Reddit Top 30 Showcases** — Drives engagement and inspires new users.
5. **Security Best Practices** — Referenced in footer and multiple skill pages. Currently a dead link.
6. **FAQ page** — Referenced in footer. Collects answers to the 20 most common questions from Discord and Reddit.

### P1 — Ship by end of June 2026

7. **MasterClass Modules 06-09** — Module 06 exists; Modules 07 (Browser), 08 (Multi-Agent), 09 (Security) are new.
8. **Individual Skill Pages (11-30)** — Second batch of skill deep-dives.
9. **Resources: API Keys Guide** — How to obtain and manage API keys for common services (OpenAI, Anthropic, Tavily, etc.).
10. **Resources: Tools Ecosystem** — Companion tools, CLIs, GUI wrappers, monitoring dashboards.
11. **Troubleshooting Guide** — Common errors, diagnostic steps, log interpretation.
12. **Architecture Overview** — Visual diagrams of OpenClaw internals, component relationships.
13. **Reddit Discussion Hacks** — How to get the most out of r/openclaw (search techniques, flair filtering, power users to follow).

### P2 — Ship by end of September 2026

14. **MasterClass Modules 10-12** — Production deployment, Voice & Canvas, Enterprise features.
15. **Individual Skill Pages (31-50)** — Remaining skill deep-dives.
16. **Glossary** — Definitions for OpenClaw-specific terminology.
17. **Methodology page** — Public-facing version of our ranking methodology (condensed from research docs).
18. **What's New: Monthly updates** — April, May, June, July, August editions.
19. **Blog posts** — Target 2 posts per month covering release analysis, skill spotlights, community interviews.
20. **Architecture: API Reference (generated)** — Generated from OpenAPI spec. Depends on spec stabilization.

### P3 — Stretch / Future

21. **Interactive skill comparison tool** — React component for comparing 2-3 skills side by side.
22. **Video walkthroughs** — Embedded Loom/YouTube for MasterClass modules (requires recording setup).
23. **Contributor guides** — How to contribute content, style guide, PR workflow.
24. **Certification/quiz system** — Self-assessment quizzes at the end of each MasterClass module (Docusaurus plugin or custom MDX).

## Content Dependencies

```
MasterClass Module 02 (Gateway)
  └── depends on: Gateway v0.9.5 spec finalization

Individual Skill Pages
  └── depends on: hands-on testing of each skill
  └── depends on: research/skills-ranking-data.md scores

API Reference (generated)
  └── depends on: openapi/openclaw-gateway.yaml completeness
  └── depends on: docusaurus-plugin-openapi-docs config validation

Localization (all content)
  └── depends on: English content being stable (P0/P1 complete)
  └── see: docs-internal/localization-plan.md
```

## Success Metrics

| Metric | Current | Q2 Target | Q3 Target |
|--------|:-------:|:---------:|:---------:|
| Total content pages | 8 | 45 | 90 |
| MasterClass modules complete | 3/12 | 8/12 | 12/12 |
| Individual skill pages | 0/50 | 10/50 | 30/50 |
| Locales with content | 1 (zh-Hant) | 2 (+ en) | 3 (+ ja) |
| Monthly unique visitors | ~500 | 3,000 | 8,000 |
| Blog posts published | 0 | 4 | 12 |
