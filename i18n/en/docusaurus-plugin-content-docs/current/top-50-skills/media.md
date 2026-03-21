---
sidebar_position: 9
title: "Media Skills"
description: "Complete review of OpenClaw media Skills: Felo Slides, Spotify, YouTube Digest, Image Generation, TweetClaw, Voice/Vapi"
keywords: [OpenClaw, Skills, Media, Felo Slides, Spotify, YouTube, Image Generation, TweetClaw, Voice]
---

# Media Skills

Media Skills give the OpenClaw Agent multimedia processing capabilities — from generating presentations and managing music to summarizing YouTube videos. These Skills expand the Agent's range from pure text to multimodal.

---

## #25 — Felo Slides

| Property | Details |
|----------|---------|
| **Rank** | #25 / 50 |
| **Category** | Media |
| **Total Score** | 55 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install felo-slides` |
| **Target Users** | Users who need to quickly create presentations |

### Feature Overview

Generate professional presentations (PPT/PDF) from natural language descriptions:

- **Natural language to slides**: Describe the topic and outline to generate
- **Template system**: Multiple professional design templates
- **Chart generation**: Automatically generate charts and infographics
- **Multilingual support**: Traditional Chinese, English, Japanese, and more
- **Export formats**: PPTX, PDF, Google Slides
- **Content population**: Combines with search Skills to auto-fill latest data

### Why It Matters

Creating presentations is one of the most time-consuming tasks for knowledge workers. Felo Slides lets the Agent produce a well-structured, professionally designed presentation in minutes — you just review and fine-tune.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 7 | 7 | 8 | 7 | 6 | 7 | 6 | **55** |

### Installation & Setup

```bash
clawhub install felo-slides

openclaw skill configure felo-slides \
  --api-key your_felo_slides_key

# Usage examples
openclaw run "Create a 10-slide presentation about AI Agent trends in enterprise using Felo Slides"

openclaw run felo-slides \
  --template business-modern \
  --language en \
  --topic "Q1 Operations Report"
```

### Dependencies & Security

- **Dependencies**: Felo Slides API Key
- **Permissions Required**: Network access (API calls), local file write (export)
- **Security**: SEC 7/10 — presentation content is sent to Felo servers for processing
- **Alternatives**: Google Slides API direct manipulation; Markdown to PPTX conversion tools

---

## #27 — Spotify

| Property | Details |
|----------|---------|
| **Rank** | #27 / 50 |
| **Category** | Media |
| **Total Score** | 55 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install community/spotify-claw` |
| **Target Users** | Spotify Premium users |

### Feature Overview

Control Spotify playback and manage music:

- Play/pause/skip tracks
- Search songs, albums, and artists
- Manage playlists
- Context-based music recommendations (e.g., "Play music suitable for coding")
- View recent listening history

### Why It Matters

Music is part of many people's workflow. Let the Agent automatically adjust background music based on your calendar and tasks — Lo-fi during focused work, relaxing music before meetings, high-energy playlists during exercise.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 7 | 7 | 7 | 7 | 7 | 8 | 6 | **55** |

### Installation & Setup

```bash
clawhub install community/spotify-claw

# OAuth authorization
openclaw auth spotify

# Usage examples
openclaw run "Play some Lo-fi music suitable for working"
openclaw run "Add the current song to my 'Favorites' playlist"
```

### Dependencies & Security

- **Dependencies**: Spotify Premium account, Spotify OAuth
- **Permissions Required**: `user-modify-playback-state`, `playlist-modify-private`
- **Security**: SEC 8/10 — Spotify permissions are limited in scope, no sensitive data involved
- **Alternatives**: Apple Music integration is in community development

---

## #32 — YouTube Digest

| Property | Details |
|----------|---------|
| **Rank** | #32 / 50 |
| **Category** | Media |
| **Total Score** | 53 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install community/youtube-digest` |
| **Target Users** | Heavy YouTube users, learners |

### Feature Overview

Extract knowledge from YouTube videos:

- **Subtitle extraction**: Retrieve auto/manual subtitles from videos
- **Content summaries**: Generate key-point summaries
- **Timestamped notes**: Mark important time points
- **Channel tracking**: Follow new videos from specific channels
- **Playlist analysis**: Consolidate knowledge from entire playlists

### Why It Matters

YouTube is one of the world's largest knowledge repositories, but watching a 1-hour tutorial takes significant time. YouTube Digest lets the Agent generate a video summary in seconds so you can quickly decide whether it's worth watching in full.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 6 | 6 | 7 | 6 | 7 | 8 | 6 | **53** |

### Installation & Setup

```bash
clawhub install community/youtube-digest

# Optional: YouTube API Key improves efficiency
openclaw skill configure youtube-digest \
  --youtube-api-key your_api_key  # optional

# Usage examples
openclaw run "Summarize this video: https://youtube.com/watch?v=xxxxx"
openclaw run "Follow the Fireship channel and give me weekly new video summaries"
```

### Dependencies & Security

- **Dependencies**: YouTube API Key (optional — works without it but slower)
- **Permissions Required**: YouTube Data API (read-only)
- **Security**: SEC 8/10 — read-only access, does not modify any data
- **Alternatives**: Use the Web Browsing Skill to browse YouTube and summarize manually

---

## #35 — Image Generation

| Property | Details |
|----------|---------|
| **Rank** | #35 / 50 |
| **Category** | Media |
| **Total Score** | 52 / 80 |
| **Maturity** | 🟡 Beta |
| **Installation** | `clawhub install community/image-gen` |
| **Target Users** | Users needing quick image generation |

### Feature Overview

Create images through multiple AI image generation services:

- **Text to image**: Generate images from natural language descriptions
- **Multi-model support**: DALL-E 3, Stable Diffusion, Midjourney API
- **Image editing**: Modify existing images
- **Batch generation**: Generate multiple variants at once
- **Style control**: Specify art style, aspect ratio, and resolution

### Why It Matters

When you need social media post images, presentation illustrations, or concept visualizations, the Image Generation Skill lets you produce them without leaving OpenClaw. Works especially well paired with Felo Slides.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 6 | 6 | 7 | 6 | 6 | 7 | 7 | **52** |

### Installation & Setup

```bash
clawhub install community/image-gen

# Configure image generation service (choose one)
openclaw skill configure image-gen \
  --provider openai \
  --api-key sk-xxxxxxxxxxxx

# Usage example
openclaw run "Generate a cyberpunk-style illustration of Taipei 101"
```

### Dependencies & Security

- **Dependencies**: Image generation API Key (OpenAI, Stability AI, etc.)
- **Permissions Required**: API calls + local file write
- **Security**: SEC 7/10 — image descriptions are sent to third-party services
- **Alternatives**: Use DALL-E or Midjourney official interfaces directly

---

## #39 — TweetClaw

| Property | Details |
|----------|---------|
| **Rank** | #39 / 50 |
| **Category** | Media / Social |
| **Total Score** | 50 / 80 |
| **Maturity** | 🟠 Alpha |
| **Installation** | `clawhub install community/tweetclaw` |
| **Target Users** | Social media managers, X/Twitter users |

### Feature Overview

X (formerly Twitter) content management:

- Read latest tweets from specific accounts
- Search tweets by topic
- Draft tweets (manual confirmation required before publishing)
- Track trending topics
- Analyze tweet engagement metrics

### Why It Matters

For users managing social media, TweetClaw lets the Agent track industry trends, draft tweets, and analyze engagement. Pair with the Summarize Skill for daily Twitter digests.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | **50** |

### Installation & Setup

```bash
clawhub install community/tweetclaw

# Set X API (requires Basic or Pro plan)
openclaw skill configure tweetclaw \
  --api-key your_x_api_key \
  --api-secret your_x_api_secret \
  --access-token your_access_token \
  --access-secret your_access_secret
```

:::warning X API Costs
The X API is now paid. The Basic plan costs $100/month with limited features. TweetClaw's read-only features can be substituted with the free Web Browsing Skill.
:::

### Dependencies & Security

- **Dependencies**: X API Key (paid)
- **Permissions Required**: Tweet read/write
- **Security**: SEC 7/10 — recommend restricting to read-only mode, publish tweets manually
- **Alternatives**: Web Browsing Skill with X search (free but limited)

---

## #40 — Voice / Vapi

| Property | Details |
|----------|---------|
| **Rank** | #40 / 50 |
| **Category** | Media |
| **Total Score** | 50 / 80 |
| **Maturity** | 🟠 Alpha |
| **Installation** | `clawhub install community/voice-vapi` |
| **Target Users** | Users who want voice interaction |

### Feature Overview

Add voice capabilities to the OpenClaw Agent:

- **Voice input**: Speech-to-Text (STT)
- **Voice output**: Text-to-Speech (TTS)
- **Voice conversation**: Real-time voice interaction mode
- **Multilingual**: Supports Chinese, English, Japanese, Korean, and more
- **Custom voices**: Choose from different TTS voices

### Why It Matters

Voice is the most natural human-computer interaction method. The Voice/Vapi Skill lets you control the Agent by speaking, perfect for scenarios where typing is inconvenient — driving, doing housework, etc.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 6 | 5 | 7 | 6 | 6 | 7 | 7 | **50** |

### Installation & Setup

```bash
clawhub install community/voice-vapi

# Configure voice service (Vapi)
openclaw skill configure voice-vapi \
  --provider vapi \
  --api-key your_vapi_key \
  --voice-id alloy \
  --language en-US

# Start voice mode
openclaw voice
```

### Dependencies & Security

- **Dependencies**: Vapi API Key or other TTS/STT service
- **Permissions Required**: Microphone access, network access
- **Security**: SEC 7/10 — voice data is sent to third-party services for processing
- **Alternatives**: Future OpenClaw versions may include built-in voice capabilities (see Module 11)

---

## Recommended Media Skill Combinations

### Content Creator

```bash
clawhub install felo-slides
clawhub install community/image-gen
clawhub install community/tweetclaw
clawhub install community/spotify-claw
```

### Learner

```bash
clawhub install community/youtube-digest
clawhub install community/summarize
clawhub install community/obsidian-claw
```

### Multimodal Agent

```bash
clawhub install community/voice-vapi
clawhub install community/image-gen
clawhub install community/youtube-digest
# See, hear, speak, draw — a fully multimodal Agent
```
