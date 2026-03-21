---
title: First Setup
description: Post-installation setup for OpenClaw — from the interactive setup wizard and SOUL.md creation to LLM connection and testing your first command.
sidebar_position: 2
---

# First Setup

Congratulations on completing the [installation](./installation.md)! This guide walks you through the first-time setup process to get OpenClaw up and running.

---

## Setup Overview

First-time setup involves four steps:

1. Run the interactive setup wizard
2. Create your SOUL.md personality file
3. Connect your first LLM provider
4. Test basic commands

The entire process takes about 5-10 minutes.

---

## Step 1: Run the Setup Wizard

OpenClaw ships with an interactive setup wizard that handles basic configuration quickly:

```bash
openclaw setup
```

The wizard will walk you through the following prompts:

```
🦞 Welcome to OpenClaw Setup!

? Choose your preferred language: English
? Select container engine: Podman (recommended)
? Gateway bind address: 127.0.0.1 (localhost only)
? Gateway port: 18789
? Choose your primary LLM provider: (Use arrow keys)
  ❯ Anthropic (Claude)
    OpenAI (GPT)
    Google (Gemini)
    DeepSeek
    Ollama (Local)
    Skip for now
? Enter your API key: sk-ant-•••••••••
? Create a default SOUL.md personality? Yes

✅ Setup complete! Config saved to ~/.openclaw/
```

:::tip Not Sure Which LLM to Pick?
If you have not decided on an LLM provider yet, choose "Skip for now." You can learn about the differences on the [Choose an AI Model](./choose-llm.md) page and come back to configure it later.
:::

---

## Step 2: Create Your SOUL.md Personality File

SOUL.md is one of OpenClaw's most distinctive features — it defines the "soul" of your AI agent. The setup wizard creates a basic template for you:

```bash
# View the default SOUL.md
cat ~/.openclaw/soul.md
```

The default content looks like this:

```markdown
# SOUL.md

## Basic Info
- Name: Claw
- Language: English
- Style: Friendly, professional, with a touch of humor

## Behavioral Guidelines
- Keep replies concise unless the user asks for detail
- When uncertain about something, be honest rather than guessing
- Respect the user's time — avoid unnecessary filler

## Areas of Expertise
- General knowledge Q&A
- Daily task assistance
- Technical troubleshooting
```

You can customize your SOUL.md in more depth later. See [SOUL.md Personality Configuration](./soul-md-config.md) for the complete guide.

---

## Step 3: Connect an LLM Provider

If you already entered an API key during the setup wizard, verify the connection:

```bash
# Test the LLM connection
openclaw provider test
```

Expected output:

```
Testing connection to Anthropic (Claude)...
✓ API key valid
✓ Model claude-opus-4-6 available
✓ Response time: 342ms
✓ Connection successful!
```

### Manual LLM Provider Configuration

If you skipped the LLM step during setup, you can manually edit the config file:

```bash
# Edit the LLM provider config
nano ~/.openclaw/providers/default.yaml
```

```yaml
# ~/.openclaw/providers/default.yaml

provider:
  name: anthropic
  model: claude-opus-4-6
  api_key: "${ANTHROPIC_API_KEY}"  # Use environment variables
  max_tokens: 4096
  temperature: 0.7

# Fallback provider (auto-switches when the primary is unavailable)
fallback:
  name: ollama
  model: llama3.3:70b
  endpoint: "http://127.0.0.1:11434"
```

:::warning API Key Security
**Never** hardcode API keys directly in config files. Use environment variables instead:

```bash
# Add to ~/.bashrc or ~/.zshrc
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
export OPENAI_API_KEY="sk-your-key-here"
```

Reference environment variables in config files using the `${VARIABLE_NAME}` syntax.
:::

---

## Step 4: Start OpenClaw and Test

### Start the Gateway

```bash
# Start in foreground mode (good for testing — press Ctrl+C to stop)
openclaw start

# Or start as a background daemon
openclaw start --daemon
```

After starting, you will see:

```
🦞 OpenClaw v4.2.1 starting...
├─ Gateway listening on 127.0.0.1:18789
├─ Memory system: WAL initialized
├─ Container engine: Podman 5.4.0 (rootless)
├─ LLM provider: Anthropic (claude-opus-4-6)
└─ Skills loaded: 0 (install skills from ClawHub!)

Ready! Use 'openclaw chat' to start a conversation.
```

### Chat via CLI

```bash
# Open an interactive chat session
openclaw chat
```

```
🦞 OpenClaw Chat (type 'exit' to quit)

You: Hello! Who are you?
Claw: Hey there! I'm Claw, your AI assistant 🦞 What can I help you with?

You: What's the weather like today?
Claw: I don't have a weather skill installed yet. You can add one with:
      openclaw skill install weather
      Once it's installed, I'll be able to check the weather for you!

You: exit
Goodbye! 🦞
```

### Test the Gateway API

You can also test OpenClaw directly via its HTTP API:

```bash
# Send a test message to the Gateway
curl -X POST http://127.0.0.1:18789/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, OpenClaw!",
    "channel": "api",
    "user_id": "test-user"
  }'
```

Expected response:

```json
{
  "status": "ok",
  "response": "Hey there! I'm Claw, what can I help you with?",
  "metadata": {
    "model": "claude-opus-4-6",
    "tokens_used": 42,
    "response_time_ms": 387
  }
}
```

---

## Install Your First Skills

A fresh OpenClaw installation has no skills. Let's install a few useful basics:

```bash
# Search for skills
openclaw skill search "translate"

# Install a translator skill
openclaw skill install translator-pro

# Install a web search skill
openclaw skill install web-search

# List installed skills
openclaw skill list
```

:::info ClawHub Skill Security
Before installing any skill, check its security rating and community reviews. During the ClawHavoc incident, 2,400+ malicious skills were planted in ClawHub. Before installing, verify:
- The author's verification status
- Community rating and download count
- Whether the requested permissions are reasonable

See the [Skill Audit Checklist](/docs/security/skill-audit-checklist) for details.
:::

---

## Common Management Commands

| Command | Description |
|---------|-------------|
| `openclaw start` | Start the Gateway |
| `openclaw start --daemon` | Start as a background daemon |
| `openclaw stop` | Stop the Gateway |
| `openclaw restart` | Restart the Gateway |
| `openclaw status` | Check running status |
| `openclaw chat` | Open interactive chat |
| `openclaw doctor` | Run a health check |
| `openclaw logs` | View live logs |
| `openclaw logs --tail 50` | View the last 50 log lines |
| `openclaw config edit` | Edit configuration files |
| `openclaw skill list` | List installed skills |

---

## Next Steps

Your OpenClaw instance is up and running! From here you can:

- [Connect Messaging Platforms](./connect-channels.md) — Bring your AI to WhatsApp, Telegram, LINE, and more
- [Choose an AI Model](./choose-llm.md) — Compare LLM providers and pick the best fit
- [SOUL.md Personality Config](./soul-md-config.md) — Craft a unique personality for your agent
