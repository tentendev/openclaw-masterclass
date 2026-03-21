---
sidebar_position: 6
title: "Automation Skills"
description: "Complete review of OpenClaw automation Skills: n8n, Browser Automation, Home Assistant, IFTTT, Webhook Relay"
keywords: [OpenClaw, Skills, Automation, n8n, Browser Automation, Home Assistant, IFTTT]
---

# Automation Skills

Automation Skills elevate the OpenClaw Agent from "passive responder" to "active executor." They let the Agent build automated workflows, control browsers for repetitive operations, connect different services, and even manage your smart home devices.

---

## #8 — n8n

| Property | Details |
|----------|---------|
| **Rank** | #8 / 50 |
| **Category** | Automation / Development |
| **Total Score** | 63 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/n8n-openclaw` |
| **Target Users** | Automation engineers, no-code/low-code users |

### Feature Overview

n8n is an open-source workflow automation platform. This Skill lets the OpenClaw Agent control n8n:

- **Create workflows**: Build n8n workflows from natural language descriptions
- **Execute workflows**: Trigger existing workflows
- **Monitor status**: View workflow execution logs and errors
- **Node management**: Add, modify, and delete nodes within workflows
- **500+ integrations**: Connect 500+ third-party services through n8n

### Why It Matters

n8n itself can connect hundreds of services, but requires manual workflow design. With the OpenClaw Agent, you simply describe the automation flow in natural language, and the Agent builds and maintains the n8n workflow for you. This is the best combination of "AI + automation."

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 7 | 8 | 9 | 8 | 8 | 7 | 8 | **63** |

### Installation & Setup

```bash
clawhub install community/n8n-openclaw

# You need a running n8n instance first
# Method 1: Docker (recommended)
docker run -d --name n8n -p 5678:5678 n8nio/n8n

# Method 2: npm
npm install -g n8n && n8n start

# Configure the Skill connection
openclaw skill configure n8n-openclaw \
  --url http://localhost:5678 \
  --api-key your_n8n_api_key
```

### Dependencies & Security

- **Dependencies**: n8n instance (Docker or local installation)
- **Permissions Required**: Full n8n API access
- **Security**: SEC 7/10 — n8n workflows can execute arbitrary operations; manage with care

:::warning n8n Security Setup
- Set a strong password and API Key for n8n
- Restrict n8n's network access scope
- Review Agent-created workflows before enabling them
- Use `--dry-run` mode to preview workflows first
:::

- **Alternatives**: IFTTT (#37) is simpler but more limited; Zapier integration is in development

---

## #16 — Browser Automation

| Property | Details |
|----------|---------|
| **Rank** | #16 / 50 |
| **Category** | Automation |
| **Total Score** | 58 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/browser-auto` |
| **Target Users** | Users who need automated browser operations |

### Feature Overview

A more advanced browser automation tool than the Web Browsing Skill:

- **Form filling**: Automatically fill in web forms
- **Click operations**: Simulate user clicks, scrolling, and dragging
- **Login automation**: Manage login sessions
- **Data extraction**: Extract dynamically loaded data from SPAs
- **Flow recording**: Record browser operations and auto-replay them
- **Playwright-based**: Built on the Playwright framework

### Why It Matters

Web Browsing excels at "reading web pages," while Browser Automation excels at "operating web pages." For services without APIs (such as certain government websites or legacy enterprise systems), Browser Automation is the only way to automate.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 7 | 7 | 8 | 7 | 7 | 6 | 8 | **58** |

### Installation & Setup

```bash
clawhub install community/browser-auto

# Install the Playwright browser
npx playwright install chromium

# Configure
openclaw skill configure browser-auto \
  --browser chromium \
  --headless true \
  --timeout 30000
```

:::warning Security & Compliance
Browser Automation can simulate user behavior and may violate some websites' Terms of Service. Confirm that your usage complies with the target website's ToS. Do not use it to bypass CAPTCHAs or access restrictions.
:::

### Dependencies & Security

- **Dependencies**: Playwright + Chromium
- **Permissions Required**: Network access, local browser execution
- **Security**: SEC 6/10 — can execute arbitrary browser operations, larger attack surface
- **Alternatives**: Web Browsing (#2) for simple browsing; Apify (#21) for large-scale crawling

---

## #10 — Home Assistant (Automation Perspective)

For the full Home Assistant introduction, see [Smart Home Skills](./smart-home#10--home-assistant). In automation workflows, it plays the following role:

### Automation Scenarios

```bash
# Context-aware automation combining the Calendar Skill
openclaw run "
  Every morning at 8 AM before work:
  1. Check today's calendar
  2. If there are video meetings, set the office lights to 'work mode'
  3. Play Focus music on the living room speaker
  4. Enable Do Not Disturb until the first meeting ends
"
```

The Home Assistant Skill lets the Agent control smart home devices. Combined with Calendar, Gmail, and other Skills, you can achieve truly "context-aware automation."

---

## #37 — IFTTT

| Property | Details |
|----------|---------|
| **Rank** | #37 / 50 |
| **Category** | Automation |
| **Total Score** | 51 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/ifttt-claw` |
| **Target Users** | IFTTT users, simple automation needs |

### Feature Overview

Trigger automations through IFTTT Webhooks:

- Trigger IFTTT Applets
- Receive IFTTT event notifications
- Manage Webhook endpoints
- Connect to 700+ services supported by IFTTT

### Why It Matters

IFTTT is the most beginner-friendly automation platform. For users who do not want to set up n8n, IFTTT provides a "zero-infrastructure" automation solution. Less powerful than n8n, but wins on simplicity.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 5 | 6 | 7 | 6 | 7 | 7 | 6 | **51** |

### Installation & Setup

```bash
clawhub install community/ifttt-claw

# Set the Webhooks Key (obtained from IFTTT)
openclaw skill configure ifttt-claw \
  --webhooks-key your_ifttt_webhooks_key
```

### Dependencies & Security

- **Dependencies**: IFTTT account, Webhooks service enabled
- **Permissions Required**: IFTTT Webhooks API
- **Security**: SEC 7/10 — triggers only via Webhooks, limited permissions
- **Alternatives**: n8n (#8) is more powerful and open-source

---

## #48 — Webhook Relay

| Property | Details |
|----------|---------|
| **Rank** | #48 / 50 |
| **Category** | Automation |
| **Total Score** | 44 / 80 |
| **Maturity** | 🟠 Alpha |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/webhook-relay` |
| **Target Users** | Advanced automation developers |

### Feature Overview

Lets the OpenClaw Agent receive external Webhook calls and react:

- Create Webhook endpoints
- Parse incoming payloads
- Trigger Agent actions
- Supports retry and dead-letter queue

### Why It Matters

Webhook Relay turns the Agent into a "callee" — external services (such as GitHub, Stripe, Shopify) can notify the Agent when events occur. This enables an "event-driven" Agent pattern.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 5 | 6 | 3 | 6 | 5 | 6 | 7 | 6 | **44** |

### Installation & Setup

```bash
clawhub install community/webhook-relay

# Create an endpoint
openclaw skill configure webhook-relay \
  --port 9876 \
  --secret your_webhook_secret

# Set up forwarding rules
openclaw run "When a GitHub push event is received, run a security scan"
```

### Dependencies & Security

- **Dependencies**: Publicly accessible network endpoint (or use ngrok)
- **Permissions Required**: Network port listening
- **Security**: SEC 7/10 — exposed endpoints require proper authentication
- **Alternatives**: n8n (#8) has built-in Webhook triggers

---

## Recommended Automation Skill Combinations

### Full Automation

```bash
clawhub install community/n8n-openclaw
clawhub install community/browser-auto
clawhub install openclaw/homeassistant
# n8n handles service-to-service connections, Browser Auto handles no-API services, Home Assistant handles physical devices
```

### Lightweight Automation

```bash
clawhub install community/ifttt-claw
# Paired with bundled Gmail + Calendar
# Ideal for users who don't want to set up infrastructure
```

### Event-Driven Architecture

```bash
clawhub install community/n8n-openclaw
clawhub install community/webhook-relay
clawhub install openclaw/github
# Agent passively receives events and proactively processes them
```
