# Communities Ranking Raw Data

> Last updated: 2026-03-18
> Evaluation period: 2026-01-15 to 2026-03-15 (60 days)
> Evaluators: 2 editorial team members observing each community

## Scoring Dimensions

7 dimensions, maximum total: 70 points.

| Code | Dimension | Range | Description |
|------|-----------|:-----:|-------------|
| ACT | Activity | 1-10 | Volume and regularity of posts, messages, or threads. 10 = multiple meaningful posts per hour. |
| CQL | Content Quality | 1-10 | Depth, accuracy, and originality of contributions. 10 = consistently expert-level, well-sourced content. |
| RSP | Response Time | 1-10 | Median time to first helpful reply for a new question. 10 = under 15 minutes during active hours. |
| INC | Inclusivity | 1-10 | Welcoming to beginners, enforcement of conduct rules, language accessibility. 10 = exemplary onboarding and moderation. |
| SNR | Signal-to-Noise | 1-10 | Ratio of useful content to spam, memes, off-topic posts. 10 = nearly all content is substantive. |
| OFF | Official Support | 1-5 | Presence and responsiveness of OpenClaw team members. 5 = core team actively participates daily. |
| SPV | Specialization Value | 1-5 | Unique content or perspective not available elsewhere. 5 = indispensable for its niche. |

## Raw Scores: Top 10 Communities

| # | Community | Platform | ACT | CQL | RSP | INC | SNR | OFF | SPV | Total | Members |
|:-:|-----------|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|--------:|
| 1 | Official Discord | Discord | 9 | 8 | 9 | 8 | 7 | 5 | 5 | **51** | 42,000 |
| 2 | r/openclaw | Reddit | 9 | 7 | 7 | 7 | 6 | 4 | 4 | **44** | 38,500 |
| 3 | GitHub Discussions | GitHub | 7 | 9 | 6 | 8 | 9 | 5 | 4 | **48** | N/A |
| 4 | OpenClaw 中文社群 | Discord (zh) | 7 | 7 | 8 | 9 | 7 | 3 | 5 | **46** | 8,200 |
| 5 | ClawHub Community | GitHub | 6 | 8 | 6 | 7 | 8 | 4 | 5 | **44** | N/A |
| 6 | OpenClaw Japan | Discord (ja) | 6 | 7 | 7 | 8 | 8 | 2 | 4 | **42** | 3,800 |
| 7 | X / Twitter #openclaw | X/Twitter | 8 | 5 | 4 | 6 | 4 | 3 | 3 | **33** | N/A |
| 8 | r/LocalLLaMA (OpenClaw threads) | Reddit | 7 | 8 | 5 | 6 | 5 | 1 | 4 | **36** | 420,000 |
| 9 | AI Agent Builders | Discord | 6 | 7 | 6 | 7 | 6 | 1 | 4 | **37** | 15,600 |
| 10 | OpenClaw Korea | KakaoTalk + Discord | 5 | 6 | 7 | 8 | 7 | 1 | 4 | **38** | 1,900 |

## Detailed Assessments

### 1. Official Discord (51/70)

**Strengths:** Highest activity of any community. Core team members (including CTO and two engineers) participate daily in #general and #bugs. Dedicated channels per topic (#skills, #gateway, #memory, #showcase, #beginners). Bot-assisted FAQ answers for common questions. Voice chat events twice monthly.

**Weaknesses:** Signal-to-noise drops during peak hours. The #general channel can become difficult to follow with 200+ messages/day. Moderation is present but overwhelmed during release days. Some advanced discussions get buried under beginner questions.

**Unique value:** Only place to get direct responses from core team. Pre-release information occasionally shared in #beta-testers (invite-only).

### 2. r/openclaw (44/70)

**Strengths:** High volume of showcase posts, configuration tips, and workflow comparisons. Upvote system naturally surfaces quality content. Weekly "Skill of the Week" thread is consistently useful. Strong meme culture keeps engagement high.

**Weaknesses:** Repetitive "how do I install" questions. Moderation is volunteer-based and inconsistent. Some posts contain outdated information without version tags. Official team presence is limited to monthly AMAs.

**Unique value:** Best source for real-world use cases and creative applications. The showcase posts are unmatched in any other community.

### 3. GitHub Discussions (48/70)

**Strengths:** Highest content quality. Threaded discussions with code samples, reproduction steps, and linked PRs. Discussions are searchable and permanent (unlike Discord). Official team participates actively in Q&A and RFC categories. Strong signal-to-noise because the platform discourages casual posting.

**Weaknesses:** Lower activity than Discord or Reddit. Response times can be slow (median 4 hours). Not beginner-friendly; the audience skews toward developers. No real-time conversation.

**Unique value:** Canonical source for architecture discussions, RFC feedback, and bug triage. Many documentation corrections originate here.

### 4. OpenClaw Chinese Community (46/70)

**Strengths:** Highly inclusive toward Mandarin speakers. Fast response times due to concentrated timezone activity (UTC+8 peak hours). Strong localized content: translated guides, region-specific API key guides (Alipay/WeChat payment for API credits), CJK-specific troubleshooting. Active moderators.

**Weaknesses:** Limited official team presence (1 community manager, no engineers). Content sometimes diverges from upstream docs without noting version differences.

**Unique value:** Only community with deep CJK-specific content. Essential for zh-Hant and zh-Hans locale documentation sourcing.

### 5. ClawHub Community (44/70)

**Strengths:** Focused entirely on skill development. High content quality with code reviews, manifest.json best practices, and security auditing discussions. Strong signal-to-noise. Official ClawHub maintainers are active.

**Weaknesses:** Narrow scope means lower overall activity. Not useful for general OpenClaw questions. Assumes significant technical background.

**Unique value:** Indispensable for skill authors. The only community with peer review for skill submissions.

### 6-10. Brief Notes

**OpenClaw Japan (#6, 42/70):** Small but high-quality community. Active translation efforts. Low official support but strong self-organization. Unique value: Japanese-specific integration guides (LINE, Notion JP workflows).

**X/Twitter #openclaw (#7, 33/70):** High volume but low signal-to-noise. Mostly announcement reshares and brief opinions. Useful for trend monitoring but not deep learning. Official account posts release notes.

**r/LocalLLaMA (#8, 36/70):** Not an OpenClaw community per se, but OpenClaw threads appear regularly with high-quality technical discussion. Cross-pollination with local LLM deployment topics is valuable. No official support.

**AI Agent Builders (#9, 37/70):** Multi-tool community (OpenClaw, AutoGPT, CrewAI). Comparative discussions are useful for understanding OpenClaw's strengths and weaknesses relative to alternatives. No official support.

**OpenClaw Korea (#10, 38/70):** Smallest but proportionally very active. KakaoTalk group for casual discussion, Discord for technical threads. Strong inclusivity and welcoming culture. Unique value: Korean localization coordination.

## Scoring Calibration Notes

- **Official Discord OFF = 5 (max):** CTO responds to questions directly at least 3 times per week. Two engineers are daily participants. This is the benchmark for maximum official support.
- **r/LocalLLaMA OFF = 1:** No official OpenClaw presence. Score reflects that it is not an OpenClaw-affiliated community.
- **GitHub Discussions SNR = 9:** Platform mechanics (no real-time chat, structured categories) naturally filter noise. Only discussions.golang.org-style forums score higher.
- **X/Twitter SNR = 4:** High volume of low-effort posts, quote tweets, and self-promotion. Useful signal exists but requires significant filtering.
