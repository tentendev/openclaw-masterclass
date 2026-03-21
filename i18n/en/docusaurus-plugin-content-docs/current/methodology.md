---
title: Ranking Methodology
description: Methodology behind all rankings, scores, and recommendations on the OpenClaw MasterClass site — data sources, scoring criteria, weighting, and update processes.
sidebar_position: 100
---

# Ranking Methodology

This page explains the methodology behind all rankings, scores, and recommendation lists on the OpenClaw MasterClass site. We are committed to a transparent, reproducible evaluation process so readers understand the basis behind each recommendation.

---

## Scope

This methodology applies to:

| List | Page |
|------|------|
| Top 50 Must-Install Skills | [/docs/top-50-skills/overview](/docs/top-50-skills/overview) |
| Top 30 Reddit Showcases | [/docs/reddit/top-30-showcases](/docs/reddit/top-30-showcases) |
| Top 10 Community Recommendations | [/docs/communities/top-10](/docs/communities/top-10) |
| Resource Recommendations | [/docs/resources/](/docs/resources/official-links) series |

---

## Data Sources

### Primary Sources (Directly Verified)

| Source | Purpose | Verification |
|--------|---------|-------------|
| OpenClaw GitHub Repository | Version info, Issues, PRs | Direct access |
| ClawHub Platform | Skill info, installs, ratings | Direct access |
| Reddit Original Posts | Showcase content, votes | Link verification |
| Official Documentation | Architecture, API, configuration | Direct access |
| CVE Database | Security vulnerability information | Official source |

### Secondary Sources (Indirect Reference)

| Source | Purpose | Reliability |
|--------|---------|------------|
| Reddit comments | Community feedback, experiences | Medium |
| Discord discussions | Real-time feedback, issue reports | Medium |
| Blog articles | Tutorials, reviews | Medium-High |
| Security research reports (Bitdefender, etc.) | Security analysis | High |

---

## Top 50 Skills Methodology

### Scoring Dimensions (8 dimensions, 10 points each, total 80)

- **REL** — Relevance to most users
- **COM** — Compatibility with OpenClaw ecosystem
- **TRC** — Community traction (downloads, usage)
- **VAL** — Value delivered to users
- **MNT** — Maintenance quality and frequency
- **RLB** — Reliability and stability
- **SEC** — Security posture
- **LRN** — Learning value for understanding AI Agent architecture

### Ranking Rules

1. Sort by total score descending
2. Ties broken by security score
3. Further ties broken by install count
4. Skills with security score below 5/10 are excluded

---

## Update Frequency

| List | Frequency | Next Update |
|------|-----------|-------------|
| Top 50 Skills | Monthly | April 2026 |
| Top 30 Showcases | Monthly | April 2026 |
| Top 10 Communities | Quarterly | June 2026 |
| Security Guides | Immediately on major events | Ongoing |

---

## Disclosure

OpenClaw MasterClass is a **community-driven learning resource**, not an official OpenClaw website.

- This site does not accept sponsorship from skill developers or service providers
- All recommendations are based on the publicly stated methodology above
- The editorial team holds no financial interest in recommended products
- Any future sponsorship or partnerships will be explicitly disclosed here

---

## Feedback

If you believe a ranking is unfair, information is inaccurate, or something is missing, please provide feedback via:

1. **GitHub Issue** — [Submit feedback](https://github.com/tenten/openclaw-masterclass/issues/new?labels=methodology)
2. **Reddit** — Discuss on r/openclaw
3. **Discord** — Leave a comment in the #feedback channel

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-20 | Initial methodology published |

---

## Further Reading

- [Top 50 Must-Install Skills](/docs/top-50-skills/overview) — Skill rankings using this methodology
- [Top 30 Reddit Showcases](/docs/reddit/top-30-showcases) — Showcase rankings using this methodology
- [FAQ](/docs/faq) — Frequently asked questions
