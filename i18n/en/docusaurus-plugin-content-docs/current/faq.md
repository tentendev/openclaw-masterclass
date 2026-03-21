---
title: FAQ
description: Frequently asked questions about OpenClaw — covering basic concepts, security, costs, setup, LLMs, skills, and advanced usage.
sidebar_position: 99
---

# FAQ

This page answers the most common questions from both new and experienced OpenClaw users.

---

## Basic Concepts

### Q: What is OpenClaw? How is it different from ChatGPT?

**A:** OpenClaw is an open-source **autonomous AI agent platform** that runs on your own machine. Key differences from ChatGPT:

| Feature | ChatGPT | OpenClaw |
|---------|---------|----------|
| Where It Runs | OpenAI cloud | Your local machine |
| Data Control | OpenAI owns it | You own it |
| Autonomous Actions | Conversation only | Can perform tasks (send emails, control smart home, etc.) |
| Multi-Platform | ChatGPT interface only | 20+ messaging platforms (Telegram, Discord, etc.) |
| Extensibility | Limited GPTs | 13,000+ ClawHub skills |
| Cost | Monthly subscription | Open-source and free (you pay for LLM API usage) |

### Q: Is OpenClaw free?

**A:** OpenClaw itself is **open-source and free** (MIT license). However, you are responsible for:

- **LLM API costs** — Using cloud models like Claude or GPT requires payment. Using Ollama with local models is free.
- **Messaging platforms** — Most are free (Telegram Bot, Discord Bot, etc.); a few may have costs.
- **Hardware** — Your own computer or server.

Typical monthly costs:

| Usage Level | Estimated Monthly Cost |
|-------------|----------------------|
| Light (a few conversations per day) | $5-15 |
| Moderate (daily assistant) | $15-50 |
| Heavy (multi-agent + automation) | $50-200+ |
| Fully local (Ollama) | $0 (electricity aside) |

### Q: What does "Raising Lobsters" mean?

**A:** This is OpenClaw's nickname in Asian communities. "Claw" refers to a lobster's claw, and OpenClaw's mascot **Molty** is a lobster. Users liken the process of configuring and training an OpenClaw agent to "raising a lobster" — you feed it (SOUL.md configuration), train it (memory accumulation), and care for it (maintenance and updates).

### Q: Do I need to know how to code to use OpenClaw?

**A:** Basic usage does not require programming skills. Installation and setup can be completed by following the step-by-step guides. Day-to-day use simply involves chatting with your agent through a messaging app like Telegram.

Advanced usage (custom skills, API integration, multi-agent deployment) does require some programming knowledge.

---

## Security

### Q: Is OpenClaw secure?

**A:** OpenClaw's design is secure, but **misconfiguration** can create serious risks. Known security issues include:

- **CVE-2026-25253**: Gateway remote code execution vulnerability (patched)
- **ClawHavoc**: 2,400+ malicious skills planted in ClawHub (cleaned up)
- **30,000+ instances** compromised due to exposed Gateway ports

**When configured correctly** (bound to localhost, authentication enabled, Podman rootless), OpenClaw is secure. See [Security Best Practices](/docs/security/best-practices) for the full guide.

### Q: Is my conversation data uploaded anywhere?

**A:** OpenClaw itself **does not upload** your data. However, the LLM provider you use will receive your conversation content:

- **Cloud LLMs** (Claude, GPT, etc.): Your conversations are sent to the provider's servers for processing
- **Local LLMs** (Ollama): All data stays on your machine, fully offline

If privacy is your top priority, use Ollama with a local model.

### Q: Are ClawHub skills safe?

**A:** ClawHub skills are submitted by community developers and are **not guaranteed to be safe**. After the ClawHavoc incident, ClawHub added VirusTotal scanning, but automated scanning cannot detect all malicious behavior.

Before installing any skill, complete the checks in the [Skill Audit Checklist](/docs/security/skill-audit-checklist).

### Q: Why is Podman recommended over Docker?

**A:** The Docker daemon runs with root privileges. If a skill sandbox is breached, an attacker could gain root access to the host machine. Podman's rootless mode does not require root — even if the sandbox is breached, the attacker only gains regular user privileges, dramatically reducing risk.

---

## Installation and Setup

### Q: Which operating systems does OpenClaw support?

**A:**

| Operating System | Support Status |
|-----------------|----------------|
| macOS 13+ | Fully supported |
| Ubuntu 22.04+ | Fully supported |
| Debian 12+ | Fully supported |
| Fedora 38+ | Fully supported |
| Arch Linux | Community supported (AUR) |
| Windows 11 (WSL2) | Supported (requires WSL2) |
| Windows (native) | Not supported |
| ChromeOS | Not supported |

### Q: What are the minimum hardware requirements?

**A:**

| Component | Minimum | Recommended | Heavy Usage |
|-----------|---------|-------------|-------------|
| CPU | 2 cores | 4 cores | 8+ cores |
| RAM | 4 GB | 8 GB | 16+ GB |
| Disk | 2 GB | 5 GB | 20+ GB |
| GPU | Not required | Not required | Nvidia (local LLM acceleration) |

### Q: Can I run OpenClaw on a Raspberry Pi?

**A:** Technically yes, on a Raspberry Pi 4/5 (4GB+ RAM), but performance will be limited. It is only suitable for lightweight use cases (simple notifications and automation) and is not a good fit for large LLMs.

### Q: How do I update OpenClaw?

**A:**
```bash
# npm installation
npm install -g @openclaw/cli@latest

# Homebrew installation
brew upgrade openclaw

# Run migration after updating
openclaw migrate

# Verify
openclaw doctor
```

---

## LLMs and Models

### Q: Which LLMs does OpenClaw support?

**A:** All major LLM providers are supported:

| Provider | Models | Best For |
|----------|--------|----------|
| Anthropic | Claude Opus 4.6, Sonnet 4.5 | General conversation, complex reasoning |
| OpenAI | GPT-5.2 Codex, GPT-4.1 | Code generation, general conversation |
| Google | Gemini 2.5 Pro | Multimodal, long context |
| DeepSeek | DeepSeek-V3 | High value for the cost |
| Ollama (local) | Llama 3.3, Qwen 2.5, Mistral | Offline use, privacy-first |
| Groq | Various open-source models | Ultra-low latency |

### Q: Which model is best?

**A:** It depends on your needs:

- **Best general conversation**: Claude Opus 4.6
- **Best code generation**: GPT-5.2 Codex
- **Best value**: DeepSeek-V3 or Claude Sonnet 4.5
- **Best privacy**: Ollama + Llama 3.3 (fully local)
- **Lowest latency**: Groq

We recommend configuring multiple models and using the LLM Router to automatically route by task type.

### Q: Can I use multiple LLMs at the same time?

**A:** Yes. OpenClaw's LLM Router supports routing different task types to different models. For example: code tasks go to GPT-5.2, conversations go to Claude, and simple tasks go to a local model.

---

## Skills and ClawHub

### Q: Which skills are recommended?

**A:** See [Top 50 Must-Have Skills](/docs/top-50-skills/overview) for a comprehensive ranking with category recommendations and security ratings.

### Q: How do I develop my own skills?

**A:** A skill is essentially a Node.js or Python program that conforms to the OpenClaw manifest format. The basic steps:

1. Create a `manifest.yaml` declaring skill metadata and permissions
2. Write the main logic (`index.js` or `main.py`)
3. Test locally
4. Publish to ClawHub

See [MasterClass Module 3: Skills System](/docs/masterclass/module-03-skills-system) for a complete walkthrough.

### Q: Can skills access my computer?

**A:** Skills run in container sandboxes and **cannot access your computer by default**. Skills must declare required permissions (network, filesystem, shell, etc.) in their `manifest.yaml`, and you can further restrict access via `permissions.override.yaml`.

---

## Messaging Platforms

### Q: Can I connect multiple messaging platforms at once?

**A:** Yes. This is one of OpenClaw's core features. You can simultaneously connect Telegram, Discord, WhatsApp, Slack, LINE, and more, all handled by the same agent.

### Q: Does the agent share memory across platforms?

**A:** Yes. The memory system is unified. Regardless of which platform a message comes from, the agent has access to the full memory.

### Q: Can I set different response styles for different platforms?

**A:** Yes. In your SOUL.md, you can define platform-specific behavior:

```markdown
## Platform-Specific Behavior
- Telegram: Keep replies short, use emoji
- Slack: Professional tone, use Markdown formatting
- Discord: Casual style, humor is fine
```

---

## Memory and SOUL.md

### Q: What is SOUL.md?

**A:** SOUL.md is a Markdown file that defines your agent's personality, behavioral rules, safety boundaries, and daily tasks. It is the agent's "soul" — it determines how the agent thinks and acts.

### Q: How long can the agent remember conversations?

**A:** Theoretically forever. OpenClaw's memory system writes all conversations to the WAL and periodically compacts them into long-term memory. However, during each interaction, the agent can only access recent conversations and relevant long-term memories within the LLM's context window limit.

### Q: How do I make the agent forget something?

**A:**
```bash
# Delete a specific conversation
openclaw memory delete --conversation-id "conv_abc123"

# Prune memory older than a date
openclaw memory prune --before "2025-01-01"

# Full reset
openclaw memory reset --confirm
```

---

## Multi-Agent

### Q: What is multi-agent?

**A:** Multi-agent refers to multiple OpenClaw instances collaborating on tasks. Each agent has a different SOUL.md personality and area of expertise, communicating and coordinating through platforms like Discord or Matrix.

### Q: Do I need multiple computers?

**A:** Not necessarily. You can run multiple OpenClaw instances on the same machine (using different ports and config directories). For performance reasons, large-scale deployments should be distributed across multiple machines.

---

## Cost and Performance

### Q: How can I reduce LLM API costs?

**A:**

1. **Use LLM Router** — Route simple tasks to cheaper models
2. **Use local models** — Ollama is free (just electricity)
3. **Optimize context** — Reduce memory size to lower token consumption
4. **Set usage limits** — Configure monthly caps in your LLM provider's dashboard
5. **Use DeepSeek** — Quality close to Claude/GPT at a fraction of the price

### Q: How fast is OpenClaw?

**A:** Response speed depends primarily on the LLM:

| Scenario | Typical Latency |
|----------|----------------|
| Cloud LLM (simple question) | 1-3 seconds |
| Cloud LLM (complex task + skills) | 3-15 seconds |
| Local LLM (Ollama + GPU) | 2-10 seconds |
| Local LLM (CPU only) | 10-60 seconds |

---

## Community and Learning

### Q: Where can I get help?

**A:**

1. [Troubleshooting](/docs/troubleshooting/common-issues) — Immediate answers to common problems
2. [GitHub Issues](https://github.com/openclaw/openclaw/issues) — Official bug reports
3. [Discord #help](https://discord.gg/openclaw) — Real-time community support
4. [Reddit r/openclaw](https://reddit.com/r/openclaw) — Discussion and historical Q&A search

### Q: How can I contribute to OpenClaw?

**A:** Contributions of any kind are welcome:

- **Report bugs** — Submit issues on GitHub
- **Develop skills** — Publish to ClawHub
- **Write documentation** — Improve the official docs
- **Translate** — Help with localization
- **Answer questions** — Help others on Reddit and Discord
- **Share showcases** — Post your projects on r/openclaw

### Q: Is there an official learning course?

**A:** The [MasterClass Course](/docs/masterclass/overview) on this site is the most comprehensive learning resource currently available, covering 12 modules from fundamentals to advanced topics.

---

## Further Reading

- [What is OpenClaw?](/docs/intro) — Complete introduction
- [Installation Guide](/docs/getting-started/installation) — Get started
- [MasterClass Course](/docs/masterclass/overview) — Structured learning
- [Glossary](/docs/glossary) — Term definitions
