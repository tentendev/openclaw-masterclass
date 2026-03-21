# Reddit Showcases Selection Criteria

> Last updated: 2026-03-18
> Applies to: Top 30 Reddit Showcases page (`docs/reddit/top-30-showcases`)

## Purpose

The Top 30 Reddit Showcases page curates the most valuable showcase posts from r/openclaw and related subreddits. The goal is to surface posts that teach, inspire, or demonstrate non-obvious capabilities of OpenClaw, rather than simply collecting the most upvoted posts.

## Selection Process

### 1. Candidate Pool

Sources scanned for candidates:

- r/openclaw: all posts with the "Showcase" flair (primary source)
- r/openclaw: posts with "Demo" or "Build" flair that include video/screenshots
- r/LocalLLaMA: posts mentioning "openclaw" with demonstration content
- r/selfhosted: posts about OpenClaw deployments
- r/homeautomation: posts featuring OpenClaw + Home Assistant integrations

**Time window:** Rolling 6-month window. Currently 2025-09-20 to 2026-03-20.

**Minimum threshold:** Post must have 25+ upvotes to enter the candidate pool (filters out low-engagement posts).

### 2. Scoring Dimensions

Each candidate is scored on 5 dimensions, each 1-10. Maximum: 50 points.

| Code | Dimension | Description | Scoring Guide |
|------|-----------|-------------|---------------|
| UNQ | Uniqueness | How novel is the use case or approach? | 10 = never seen before, pushes boundaries of what people think OpenClaw can do. 5 = interesting variation on a known pattern. 1 = common tutorial content. |
| TCX | Technical Complexity | Sophistication of the implementation | 10 = multi-agent orchestration, custom skills, complex memory usage, production deployment. 5 = moderate skill chaining, some configuration. 1 = single skill, default config. |
| RPR | Reproducibility | Can another user recreate this? | 10 = full config shared, step-by-step instructions, linked repo. 5 = general approach described but missing some details. 1 = "look what I did" with no explanation. |
| ENG | Community Engagement | Discussion quality in comments | 10 = 50+ comments with substantive Q&A, author actively responds, follow-up posts. 5 = 10-20 comments with some discussion. 1 = few or no meaningful comments. |
| PVL | Practical Value | Usefulness to other users | 10 = solves a common pain point, directly applicable workflow. 5 = interesting but niche application. 1 = proof of concept with no practical use. |

### 3. Selection Threshold

- Posts scoring 35+ are automatically included (exceptional showcases).
- Posts scoring 28-34 are included if they fill a category gap (e.g., we lack Smart Home showcases, so a 29-point Home Assistant post may be included over a 31-point Productivity post we already have several of).
- Posts scoring below 28 are excluded unless they represent a category with zero other representation.

### 4. Category Balance

We aim for representation across use case categories:

| Category | Target Count | Rationale |
|----------|:----------:|-----------|
| Development & Coding | 6-8 | Largest user segment |
| Productivity & Workflows | 5-7 | High practical value |
| Research & Knowledge | 3-5 | Growing use case |
| Smart Home & IoT | 3-4 | Visually compelling, high engagement |
| Creative & Media | 3-4 | Inspires new users |
| Automation & DevOps | 3-4 | Technical audience appeal |
| Enterprise & Business | 2-3 | Demonstrates professional use |

If category targets conflict with score rankings, we prioritize score but reserve at least 2 slots per category.

### 5. Recency Bias Adjustment

Posts from the most recent 30 days receive no adjustment. Posts older than 30 days receive a -1 penalty to their total score to account for potential staleness (OpenClaw evolves quickly, older showcases may no longer work as shown). Posts older than 90 days receive -2.

This adjustment is applied after initial scoring and only affects borderline decisions (scores 28-34).

## Exclusion Criteria

A post is excluded regardless of score if:

1. **Self-promotion without substance:** Author is promoting a paid product/service with no educational content.
2. **Unverifiable claims:** "My agent made $10,000" without evidence or reproducible workflow.
3. **Security anti-patterns:** Post demonstrates practices that could harm users (storing API keys in plain text, disabling security features, granting excessive permissions) without adequate warnings.
4. **Outdated beyond repair:** Post relies on OpenClaw features that have been removed or fundamentally changed, and no migration path exists.
5. **Duplicate of existing selection:** Substantially similar to a post already in the Top 30. The higher-scoring post is retained.

## Data Collected Per Showcase

For each selected showcase, we record:

| Field | Description |
|-------|-------------|
| Reddit URL | Permalink to the post |
| Author | Reddit username |
| Date posted | Original post date |
| Upvotes at selection | Snapshot at time of evaluation |
| Comment count | At time of evaluation |
| Category | Primary use case category |
| Skills used | OpenClaw skills mentioned or demonstrated |
| OpenClaw version | If stated or inferable |
| Scores | UNQ, TCX, RPR, ENG, PVL |
| Summary | 2-3 sentence editorial summary |
| Reproduction link | GitHub repo, gist, or config file if available |
| Trust tier | Per ADR-006 (most showcases are Community-reported or Unverified) |

## Maintenance

- **Monthly review:** Scan for new high-scoring showcases. Add if they score above threshold and improve category balance.
- **Quarterly pruning:** Remove showcases that are confirmed broken on the current OpenClaw version with no workaround.
- **Version tags:** Each showcase entry includes the OpenClaw version it was demonstrated on. When a major version ships, all showcases are flagged for re-evaluation.

## Editorial Standards

- Summaries are written by the editorial team, not copied from the Reddit post. We describe what makes the showcase valuable, not just what it does.
- We credit the original author by Reddit username and link directly to their post.
- If a showcase has known issues on the current version, we add an editorial note rather than removing it (preserves educational value).
- We do not rank the Top 30 in strict order. They are grouped by category. Within each category, showcases are ordered by score.
