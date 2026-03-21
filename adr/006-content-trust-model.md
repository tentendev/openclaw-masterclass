# ADR-006: Content Verification Tiers

**Date:** 2026-03-01
**Status:** Accepted
**Deciders:** Erik, content team, community moderators

## Context

OpenClaw MasterClass is a community-driven documentation site, not an official OpenClaw publication. Content comes from multiple sources with varying reliability:

- Official OpenClaw documentation and changelogs
- Hands-on testing by the editorial team
- Community-reported findings from Reddit, Discord, and GitHub Discussions
- Reverse-engineering of undocumented behavior
- Third-party skill documentation maintained by external authors

Readers need to understand the confidence level of any claim they encounter. A skill compatibility statement tested by the editorial team carries different weight than one reported by a single Reddit user. Without explicit trust signals, readers may treat all content as equally authoritative, leading to frustration when community-reported workarounds fail.

### Approaches Considered

**No trust markers (treat everything as equally reliable)**
- Pros: Simple. No editorial overhead.
- Cons: Misleads readers. Damages credibility when unverified claims prove wrong. No incentive for contributors to verify their submissions.

**Binary verified/unverified**
- Pros: Simple to implement. Clear signal.
- Cons: Too coarse. A claim backed by 50 Reddit users and the author's personal testing is very different from a single unconfirmed report. Binary labels lose this nuance.

**Four-tier trust model**
- Pros: Captures the meaningful gradations in our content. Provides clear editorial guidelines for classifying claims. Enables readers to make informed decisions about which content to act on.
- Cons: Adds editorial overhead. Requires training contributors on the tier system. Risk of inconsistent application.

## Decision

We adopt a **four-tier content verification model** applied to all factual claims in the documentation:

### Tier Definitions

| Tier | Label | Badge | Criteria |
|------|-------|-------|----------|
| 1 | **Verified** | `:::verified` | Confirmed by official OpenClaw documentation, official changelog, or editorial team hands-on testing on the current OpenClaw version (v0.9.x). Requires at least one editor to have reproduced the claim. |
| 2 | **Likely** | `:::likely` | Supported by strong community consensus (5+ independent reports), editorial team testing on a prior version, or official documentation for a closely related feature. High confidence but not definitively confirmed on current version. |
| 3 | **Unverified** | `:::unverified` | Reported by 1-4 community members without editorial verification. May be version-specific, environment-specific, or based on misunderstanding. Included because it is plausible and potentially useful. |
| 4 | **Community-reported** | `:::community` | Single-source reports, speculative analysis, or workarounds discovered through reverse-engineering. No editorial verification attempted. Included with explicit disclaimers. May be removed if contradicted by later evidence. |

### Implementation

Trust tiers are rendered using Docusaurus admonitions with custom styling:

```md
:::verified
The `clawhub install` command supports `--version` pinning as of OpenClaw v0.9.2.
Tested by editorial team on 2026-03-15.
:::

:::community
Some users report that running `clawhub install` with `--force` bypasses checksum
verification. This has not been independently confirmed and may be version-specific.
Source: Reddit u/clawfan42, 2026-02-28.
:::
```

### Editorial Guidelines

1. **Default tier is Unverified.** All new content starts as Unverified unless the author provides evidence for a higher tier.
2. **Promotion requires evidence.** Moving content from Unverified to Likely requires linking 5+ independent sources. Moving to Verified requires editorial team reproduction.
3. **Demotion is immediate.** If a Verified claim is contradicted by a new OpenClaw release, it is immediately demoted to Unverified pending re-testing.
4. **Source attribution is mandatory** for Community-reported content. Include the source (Reddit username, Discord message link, GitHub issue number) and date.
5. **Version tagging.** All tier badges should include the OpenClaw version they were verified against. Claims verified on v0.8.x are automatically demoted to Likely when v0.9.x is the current version.

## Consequences

### Positive

- Readers can calibrate their trust appropriately. A developer deciding whether to use a workaround in production can see at a glance whether it is Verified or Community-reported.
- Contributors have clear guidelines for classifying their submissions, reducing editorial back-and-forth.
- The promotion/demotion system incentivizes verification. Community members can earn "Verified" status for their contributions by providing reproduction evidence.
- Version-aware demotion ensures that stale claims do not persist with unearned confidence levels.
- Transparency builds credibility: explicitly marking uncertainty is more trustworthy than hiding it.

### Negative

- Editorial overhead: every factual claim needs a tier assignment. For the initial 100+ pages, this is a significant one-time cost. Ongoing cost is manageable as most new content is incremental.
- Admonition visual noise: too many trust badges on a single page can disrupt reading flow. Guideline: apply tier badges to non-obvious or potentially contentious claims, not to universally known facts.
- Tier disagreements: contributors may disagree about whether a claim is Likely vs. Verified. The editorial team has final say, with reasoning documented in PR comments.
- Custom admonition styling adds to the CSS surface area. Implemented via 4 custom admonition types in `src/css/custom.css`.

### Adoption Plan

1. **Phase 1 (March 2026):** Apply tiers to Top 50 Skills pages, which contain the most actionable claims.
2. **Phase 2 (April 2026):** Apply tiers to MasterClass modules and troubleshooting guides.
3. **Phase 3 (May 2026):** Apply tiers to all remaining content. Establish community contribution workflow with tier assignment in PR template.
