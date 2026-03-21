---
title: What is OpenClaw? Complete Introduction
description: A comprehensive guide to OpenClaw — the open-source autonomous AI agent platform. History, architecture, features, and ecosystem explained from the ground up.
sidebar_position: 1
---

# What is OpenClaw? Complete Introduction

**OpenClaw** is an open-source autonomous AI agent platform that runs locally on your own machine and connects to more than 20 messaging platforms. It gives you a personal AI assistant that can think, remember, and take action — while keeping all your data under your control.

In Asian communities, OpenClaw has an affectionate nickname: **"Raising Lobsters"** (養龍蝦). The project's mascot is a lobster named **Molty**. The name comes from OpenClaw's "Claw" (as in a lobster's claw), symbolizing powerful and flexible grasping and manipulation capabilities.

:::info Key Numbers
- GitHub Stars: **250,000+**
- ClawHub Marketplace: **13,000+ skills**
- Supported Messaging Platforms: **20+**
- Supported LLMs: **Claude, GPT, Gemini, DeepSeek, Ollama, and more**
- Created by: **Peter Steinberger**
:::

---

## Why Choose OpenClaw?

In 2026, with AI tools popping up everywhere, OpenClaw stands out for three key reasons:

1. **Fully Local Execution**: Your conversation history, memory data, and configuration files are all stored locally. Nothing is uploaded to third-party servers.
2. **Cross-Platform Integration**: A single AI agent can simultaneously connect to WhatsApp, Telegram, Discord, Slack, LINE, Signal, iMessage, Matrix, and more.
3. **Skill Ecosystem**: Through the ClawHub marketplace, you can install over 13,000 community-developed skills — from auto-reply to smart home control and everything in between.

---

## The History of OpenClaw: From Clawdbot to Today

OpenClaw's development has gone through three major phases:

### Phase 1: Clawdbot (Early 2024)

Peter Steinberger initially built a personal project called **Clawdbot**, aimed at letting AI converse through instant messaging apps. The functionality was quite basic at this stage — it only supported Telegram and could call a single LLM.

### Phase 2: Moltbot (Mid 2024)

As the community grew rapidly, the project was renamed **Moltbot** (inspired by the lobster's molting process). This release introduced the memory system and multi-platform support, laying the foundation for the four-layer architecture.

### Phase 3: OpenClaw (Early 2025 to Present)

The project was officially renamed **OpenClaw** and gained the ClawHub skill marketplace, sandboxed execution environments, and a comprehensive security architecture. By late 2025 it surpassed 200K GitHub Stars, making it one of the fastest-growing open-source AI projects.

In February 2026, creator Peter Steinberger joined OpenAI, though OpenClaw continues as a thriving open-source project maintained by its community and core contributors.

---

## Four-Layer Architecture Overview

OpenClaw uses a clean four-layer architecture where each layer has a distinct responsibility:

```
┌─────────────────────────────────────────┐
│  Layer 1: Gateway                       │
│  Port 18789 — Receives all messages     │
├─────────────────────────────────────────┤
│  Layer 2: Reasoning Layer               │
│  Connects to LLMs, handles intent       │
│  recognition and response generation    │
├─────────────────────────────────────────┤
│  Layer 3: Memory System                 │
│  WAL + Markdown Compaction for          │
│  long-term memory management            │
├─────────────────────────────────────────┤
│  Layer 4: Skills / Execution Layer      │
│  Runs skills in sandboxed containers    │
└─────────────────────────────────────────┘
```

### Layer 1: Gateway

The Gateway is OpenClaw's front door, listening on **port 18789** by default. It receives incoming messages from all connected messaging platforms, normalizes them into an internal standard format, and passes them to the Reasoning Layer for processing.

:::danger Security Warning
The Gateway's port 18789 is OpenClaw's largest attack surface. As of early 2026, over **30,000 instances** have been compromised because their Gateway was exposed to the public internet (bound to `0.0.0.0`). Always bind to `127.0.0.1`. See [Security Best Practices](/docs/security/best-practices) for details.
:::

### Layer 2: Reasoning Layer

The Reasoning Layer is OpenClaw's brain. It sends user messages to the configured LLM (such as Claude Opus 4.6 or GPT-5.2 Codex), receives responses, and decides on the next action — whether that is replying directly, invoking a skill, or querying memory.

### Layer 3: Memory System

The Memory System uses a hybrid approach combining **WAL (Write-Ahead Log)** with **Markdown Compaction**. Short-term memory is written quickly via WAL, while long-term memory is periodically compacted into structured Markdown files for efficient context management.

### Layer 4: Skills / Execution Layer

All skills run inside a **sandboxed environment** to prevent malicious code from affecting the host system. Skills can access the network, a restricted portion of the filesystem, and external APIs, but all access is governed by strict permission controls.

:::tip Deep Dive
Want to learn more about the architecture? Head to the [Architecture Overview](/docs/architecture/overview) page.
:::

---

## Security Overview

Security is a critical concern when running OpenClaw. Here are the most significant security incidents to date:

| Incident | Description |
|----------|-------------|
| **CVE-2026-25253** | Gateway remote code execution vulnerability affecting versions prior to v3.x |
| **ClawHavoc** | 2,400+ malicious skills were planted in ClawHub, later fully removed |
| **Port 18789 Exposure** | 30,000+ instances compromised due to misconfiguration |

:::warning Read This Before Using OpenClaw
Security is not optional. Every user should read the [Security Best Practices](/docs/security/best-practices) and the [Skill Audit Checklist](/docs/security/skill-audit-checklist) before getting started.
:::

---

## Who Should Use OpenClaw?

| User Type | Why It Fits |
|-----------|------------|
| **Developers** | Build custom skills, deeply customize behavior, integrate into existing workflows |
| **Privacy-Conscious Users** | Fully local execution — data never leaves your machine |
| **Community Managers** | One AI agent managing communities across multiple messaging platforms |
| **Automation Enthusiasts** | Combine skills to build complex automation pipelines |
| **Enterprise IT Teams** | Deploy on internal networks with enterprise-grade security settings |

If all you need is a simple chatbot, a commercial solution (such as ChatGPT's off-the-shelf apps) may be a better fit. OpenClaw's strength lies in **deep customization** and **multi-platform integration** — it is more like an AI agent you can raise and train over time than a disposable tool.

---

## Next Steps

Ready to get started? Follow this sequence to have your first OpenClaw instance running in about 30 minutes:

1. [Installation Guide](./getting-started/installation.md) — Install OpenClaw on your system
2. [First Setup](./getting-started/first-setup.md) — Complete the initial configuration
3. [Connect Messaging Platforms](./getting-started/connect-channels.md) — Connect your first messaging platform
4. [Choose an AI Model](./getting-started/choose-llm.md) — Configure your LLM provider
5. [SOUL.md Personality Config](./getting-started/soul-md-config.md) — Craft your AI's personality

Join over 250,000 developers and start building your own AI agent today.
