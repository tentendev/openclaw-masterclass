# Research Methodology

> Last updated: 2026-03-20
> Applies to all research data and rankings published on OpenClaw MasterClass

## Purpose

This document describes how the editorial team conducts research, evaluates sources, and produces the rankings and recommendations published on the site. Transparency in methodology is essential for a community-driven project that makes evaluative claims about tools and communities.

## Source Tiers

All information sources used in research are classified into four tiers. These tiers inform the content trust model (see ADR-006) but are distinct from it: source tiers describe the provenance of information, while content trust tiers describe our confidence in specific claims.

### Tier 1: Primary / Official Sources

| Source | Example | Reliability |
|--------|---------|-------------|
| Official OpenClaw documentation | docs.openclaw.dev | Highest for documented features. May lag behind actual behavior. |
| Official changelogs and release notes | GitHub releases | Authoritative for what changed and when. |
| OpenClaw source code | github.com/openclaw/openclaw | Ground truth for behavior. Requires code reading ability. |
| Official team statements | Discord #announcements, official blog | Authoritative for plans and known issues. |

**Usage policy:** Tier 1 sources are always preferred. Claims sourced from Tier 1 are eligible for "Verified" trust status if editorially confirmed.

### Tier 2: Authoritative Community Sources

| Source | Example | Reliability |
|--------|---------|-------------|
| ClawHub package metadata | ClawHub API, package manifests | Reliable for download counts, dependencies, permissions. |
| GitHub repository metrics | Stars, issues, commit frequency | Reliable as quantitative signals. Can be gamed but rare in practice. |
| Skill author documentation | README files in skill repos | Generally reliable but may be outdated or incomplete. |
| OpenClaw core team comments (informal) | Discord messages, Reddit comments | Reliable but not official. Team members sometimes share preliminary information. |

**Usage policy:** Tier 2 sources are used for quantitative scoring (traction, maintenance metrics) and to corroborate Tier 1 claims. Claims sourced exclusively from Tier 2 are eligible for "Likely" trust status.

### Tier 3: Community Reports

| Source | Example | Reliability |
|--------|---------|-------------|
| Reddit posts and comments | r/openclaw, r/LocalLLaMA | Variable. Upvote count provides a weak quality signal. |
| Discord discussions | Non-official channels | Variable. Real-time troubleshooting often reveals genuine issues. |
| Blog posts and tutorials | Medium, personal blogs | Variable. Check author credentials and recency. |
| YouTube demonstrations | Tutorials, walkthroughs | Variable. Visual evidence is stronger than text claims. |

**Usage policy:** Tier 3 sources are used for discovering issues, identifying use cases, and gauging sentiment. Claims require 5+ independent Tier 3 reports to reach "Likely" trust status. Single reports are "Community-reported".

### Tier 4: Indirect / Inferred

| Source | Example | Reliability |
|--------|---------|-------------|
| Reverse-engineering | Inspecting undocumented API behavior | May break without notice. Not supported by OpenClaw team. |
| Inference from related products | "Other AI agents do X, so OpenClaw probably does too" | Speculative. Useful for hypothesis generation only. |
| Outdated documentation | Docs for OpenClaw v0.7.x when current is v0.9.x | May or may not still apply. Must be tested. |

**Usage policy:** Tier 4 sources are used for investigation leads only. Claims based solely on Tier 4 are always "Community-reported" or "Unverified" and include explicit disclaimers.

## Research Process

### For Skills Rankings (research/skills-ranking-data.md)

1. **Candidate identification:** Scan ClawHub registry for all skills with 100+ downloads. Cross-reference with Discord #skills mentions and Reddit showcase posts.
2. **Quantitative data collection:** Pull ClawHub download counts (30-day), GitHub stars, open issue counts, last commit date from APIs.
3. **Qualitative evaluation:** Each evaluator installs the skill on a test OpenClaw instance and rates each dimension independently.
4. **Score calibration:** Evaluators meet to discuss divergent scores (>2 point spread on any dimension). Discuss reasoning and adjust if consensus is reached.
5. **Final scores:** Average of evaluator scores, rounded to nearest integer.
6. **Documentation:** Record raw data, calibration notes, and any adjustments in the research file.

### For Communities Rankings (research/communities-ranking-data.md)

1. **Observation period:** Two editorial team members join each community and observe for 60 days minimum.
2. **Quantitative signals:** Message/post counts, response times (sampled: 20 random questions per community, measure time to first helpful reply), member counts.
3. **Qualitative assessment:** Content quality, inclusivity, moderation quality, unique value assessed through direct participation.
4. **Score independently, calibrate together:** Same process as skills rankings.

### For Reddit Showcases (research/showcases-selection-criteria.md)

1. **Candidate scanning:** Weekly scan of r/openclaw and related subreddits for showcase posts.
2. **Threshold filtering:** 25+ upvotes to enter candidate pool.
3. **Scoring:** Two evaluators score each candidate on 5 dimensions.
4. **Category balancing:** Ensure representation across use case categories.
5. **Editorial summary:** Write 2-3 sentence summary focusing on what makes the showcase valuable.

## Verification Process

When making a factual claim about OpenClaw behavior:

```
1. Check Tier 1 sources (official docs, source code)
   ├── Found and confirmed → Trust: Verified
   └── Not found → proceed to step 2

2. Check Tier 2 sources (ClawHub, GitHub, team comments)
   ├── Found with 3+ independent confirmations → Trust: Likely
   └── Found with fewer confirmations → proceed to step 3

3. Check Tier 3 sources (Reddit, Discord, blogs)
   ├── Found with 5+ independent reports → Trust: Likely
   ├── Found with 1-4 reports → Trust: Unverified
   └── Not found → proceed to step 4

4. Hands-on testing by editorial team
   ├── Reproduced on current version → Trust: Verified
   ├── Partially reproduced or version-dependent → Trust: Likely
   └── Could not reproduce → Trust: Community-reported (with note)
```

Hands-on testing (step 4) can be applied at any point to escalate trust level.

## Conflict of Interest Policy

- No editorial team member has a financial interest in any OpenClaw skill or tool being ranked.
- If a team member is the author of a skill under evaluation, they recuse themselves from scoring that skill.
- We do not accept payment or sponsorship in exchange for rankings or reviews.
- The site is funded by the core team's personal time and Vercel's free hosting tier.

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 2.1 | 2026-03-20 | Added ClawHub download data to TRC scoring. Expanded evaluator panel to 8 members. |
| 2.0 | 2026-02-01 | Formalized source tiers and verification process. Added security scoring rubric. |
| 1.0 | 2025-12-15 | Initial methodology. 5-dimension scoring (REL, COM, TRC, VAL, RLB). |
