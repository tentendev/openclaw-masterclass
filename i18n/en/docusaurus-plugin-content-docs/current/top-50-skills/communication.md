---
sidebar_position: 4
title: "Communication Skills"
description: "Complete review of OpenClaw communication Skills: Slack, WhatsApp CLI, Telegram Bot, AgentMail, Matrix Chat"
keywords: [OpenClaw, Skills, Communication, Slack, WhatsApp, Telegram, AgentMail, Matrix]
---

# Communication Skills

Communication Skills let the OpenClaw Agent operate across different messaging platforms as your unified communication assistant. From enterprise Slack to personal WhatsApp, the Agent can read, reply to, and manage messages on your behalf.

---

## #7 — Slack

| Property | Details |
|----------|---------|
| **Rank** | #7 / 50 |
| **Category** | Communication |
| **Total Score** | 64 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community (steipete) |
| **Installation** | `clawhub install steipete/slack` |
| **Target Users** | Slack users, team collaboration |

### Feature Overview

A Slack integration Skill maintained by well-known developer steipete:

- Read and search channel messages
- Send messages and reply to threads
- Manage Direct Messages
- Set up and trigger Slack notifications
- Generate channel summaries
- Supports Slack Blocks formatted messages

### Why It Matters

Slack is one of the tools knowledge workers spend the most time on daily. Letting the Agent track important channels, summarize long threads, and auto-reply to common questions can dramatically reduce context-switching costs.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | **64** |

### Installation & Setup

```bash
clawhub install steipete/slack

# Authorize with Slack Bot Token
openclaw skill configure slack \
  --bot-token xoxb-xxxxxxxxxxxx \
  --app-token xapp-xxxxxxxxxxxx

# Configure channels to monitor
openclaw skill configure slack \
  --watch-channels general,engineering,random
```

:::warning Slack Workspace Admin Permission
Installing the Slack Skill requires Workspace admin approval for the Bot application. Test functionality in a test Workspace first.
:::

### Dependencies & Security

- **Dependencies**: Slack Bot Token + App Token
- **Permissions Required**: `channels:read`, `channels:history`, `chat:write`, `users:read`
- **Security**: SEC 8/10 — Slack's Bot permission model is mature with fine-grained channel access control
- **Alternatives**: Microsoft Teams users can watch for the community-developed `community/teams-claw`

---

## #24 — AgentMail

| Property | Details |
|----------|---------|
| **Rank** | #24 / 50 |
| **Category** | Communication |
| **Total Score** | 56 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/agentmail` |
| **Target Users** | Users who need a dedicated Agent mailbox |

### Feature Overview

Creates an independent, managed email identity for your Agent:

- Create an Agent-dedicated mailbox (`your-agent@agentmail.dev`)
- Send and receive email without affecting your personal inbox
- Configure auto-reply rules
- Manage multiple Agent identities
- Isolated mailbox separate from the Gmail Skill

### Why It Matters

Giving the Agent direct access to your personal Gmail carries security risks. AgentMail provides an "Agent-dedicated mailbox" — the Agent can only access this isolated mailbox, and even if something goes wrong, your primary inbox is unaffected. This is a more thorough isolation approach than Gmail Skill's draft-only mode.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 7 | 6 | 7 | 7 | 7 | 7 | 8 | **56** |

### Installation & Setup

```bash
clawhub install community/agentmail

# Register an Agent mailbox
openclaw skill configure agentmail \
  --create-identity my-agent \
  --domain agentmail.dev

# Set up forwarding rules (forward specific emails from personal inbox to Agent mailbox)
openclaw skill configure agentmail \
  --forward-from your@gmail.com \
  --filter "subject:invoice OR subject:receipt"
```

### Dependencies & Security

- **Dependencies**: AgentMail service account
- **Permissions Required**: AgentMail API (limited to Agent mailbox only)
- **Security**: SEC 7/10 — safer by design than direct personal inbox access, but relies on a third-party service
- **Alternatives**: Gmail Skill + draft-only mode

---

## #26 — Telegram Bot

| Property | Details |
|----------|---------|
| **Rank** | #26 / 50 |
| **Category** | Communication |
| **Total Score** | 55 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/telegram-claw` |
| **Target Users** | Telegram users, mobile Agent interaction |

### Feature Overview

Wraps the OpenClaw Agent as a Telegram Bot:

- Chat with the Agent via Telegram
- Receive proactive notifications from the Agent
- Share files and images for Agent processing
- Supports group mode (Agent as a group member)
- Voice message to text processing

### Why It Matters

A Telegram Bot lets you interact with the Agent anywhere, anytime via your phone. No need to sit at a computer — you can ask the Agent for help while on the go. This is the simplest "mobile Agent" solution.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 7 | 6 | 7 | 7 | 7 | 7 | 7 | **55** |

### Installation & Setup

```bash
clawhub install community/telegram-claw

# 1. Get a Bot Token from @BotFather
# 2. Configure the Skill
openclaw skill configure telegram-claw \
  --bot-token 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 \
  --allowed-users your_telegram_id
```

:::warning Public Access Risk
Make sure to set `--allowed-users` to restrict interaction to only your Telegram account. Otherwise, anyone who finds your Bot can control your Agent.
:::

### Dependencies & Security

- **Dependencies**: Telegram Bot Token (obtained from @BotFather)
- **Permissions Required**: Telegram Bot API
- **Security**: SEC 7/10 — strict access control configuration required
- **Alternatives**: WhatsApp CLI (#33), Discord Bot (community development in progress)

---

## #33 — WhatsApp CLI

| Property | Details |
|----------|---------|
| **Rank** | #33 / 50 |
| **Category** | Communication |
| **Total Score** | 52 / 80 |
| **Maturity** | 🟠 Alpha |
| **Official/Community** | Community (third-party) |
| **Installation** | `clawhub install community/whatsapp-claw` |
| **Target Users** | Heavy WhatsApp users |

### Feature Overview

Interact with WhatsApp via the wacli (WhatsApp CLI) tool:

- Read and send messages
- Group message management
- Media file send/receive
- Contact search

### Why It Matters

In Asian and European markets, WhatsApp is the primary instant messaging tool. This Skill fills the gap in OpenClaw's WhatsApp integration.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 6 | 6 | 7 | 5 | 6 | 7 | 8 | **52** |

### Installation & Setup

```bash
clawhub install community/whatsapp-claw

# Install wacli first
brew install wacli  # macOS
# or
pip install wacli   # Cross-platform

# Scan QR Code to log in
wacli login

# Configure the Skill
openclaw skill configure whatsapp-claw
```

:::warning Unofficial API
WhatsApp CLI uses an unofficial WhatsApp Web API. There is a risk of account suspension. Meta may change the API at any time, breaking functionality. Recommended for personal experimentation only — do not use for critical business communications.
:::

### Dependencies & Security

- **Dependencies**: wacli tool, WhatsApp account
- **Permissions Required**: WhatsApp Web Session
- **Security**: SEC 7/10 — unofficial API carries account risk, but data is not transmitted to third parties
- **Alternatives**: Telegram Bot (#26) is more stable and uses the official API

---

## #50 — Matrix Chat

| Property | Details |
|----------|---------|
| **Rank** | #50 / 50 |
| **Category** | Communication |
| **Total Score** | 43 / 80 |
| **Maturity** | 🟠 Alpha |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/matrix-claw` |
| **Target Users** | Matrix/Element users, privacy advocates |

### Feature Overview

Integration with the Matrix decentralized communication protocol:

- Send and receive encrypted messages
- Room management
- Basic Bot functionality

### Why It Matters

Matrix is an open-source, decentralized communication protocol, especially popular among users who value privacy and open-source principles. While functionality is currently limited, it is the only option for the Matrix community.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 5 | 5 | 3 | 5 | 5 | 6 | 8 | 6 | **43** |

### Installation & Setup

```bash
clawhub install community/matrix-claw

openclaw skill configure matrix-claw \
  --homeserver https://matrix.org \
  --username @your-bot:matrix.org \
  --password your_password
```

### Dependencies & Security

- **Dependencies**: Matrix Homeserver account
- **Permissions Required**: Matrix Client API
- **Security**: SEC 8/10 — supports end-to-end encryption, best privacy
- **Alternatives**: Slack (#7) for enterprise, Telegram (#26) for personal use

---

## Communication Skills Comparison

| Feature | Slack | Telegram | WhatsApp | AgentMail | Matrix |
|---------|:-----:|:--------:|:--------:|:---------:|:------:|
| Enterprise-ready | Yes | No | No | Yes | Yes |
| Mobile interaction | Yes | Yes | Yes | No | Yes |
| Official API | Yes | Yes | No | Yes | Yes |
| End-to-end encryption | No | Yes | Yes | No | Yes |
| Setup difficulty | Medium | Easy | Complex | Easy | Complex |
| Maturity | 🟡 | 🟡 | 🟠 | 🟡 | 🟠 |

### Recommended Communication Combinations

```bash
# Enterprise team
clawhub install steipete/slack
clawhub install community/agentmail

# Personal use
clawhub install community/telegram-claw
# Paired with bundled Gmail

# Privacy-first
clawhub install community/matrix-claw
clawhub install community/agentmail
```
