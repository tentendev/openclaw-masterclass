---
title: Connect Messaging Platforms
description: Complete setup guide for connecting OpenClaw to 20+ messaging platforms including WhatsApp, Telegram, Discord, Slack, LINE, Signal, iMessage, Matrix, Zalo, and Nostr.
sidebar_position: 3
---

# Connect Messaging Platforms

One of OpenClaw's most powerful features is connecting to multiple messaging platforms simultaneously. A single AI agent can serve across WhatsApp, Telegram, Discord, LINE, and more — all sharing conversation memory for a consistent experience.

---

## Platform Overview

| Platform | Stability | Difficulty | Notes |
|----------|-----------|------------|-------|
| **Telegram** | 5/5 | Easy | Recommended for beginners |
| **Discord** | 5/5 | Easy | Bot token is all you need |
| **WhatsApp** | 4/5 | Medium | Requires WhatsApp Business API or Baileys bridge |
| **Slack** | 4/5 | Medium | Requires creating a Slack App |
| **LINE** | 4/5 | Medium | Requires LINE Messaging API |
| **Signal** | 3/5 | Harder | Via signal-cli bridge |
| **iMessage** | 3/5 | Harder | macOS only, requires AppleScript bridge |
| **Matrix** | 4/5 | Medium | Open protocol, privacy-friendly |

---

## General Configuration

All platform configurations are stored in `~/.openclaw/channels/`. Each platform gets its own YAML file:

```bash
ls ~/.openclaw/channels/
openclaw channel add <platform>
```

---

## Telegram (Recommended First Platform)

Telegram is the easiest platform to set up — ideal as your first connection.

### Step 1: Create a Telegram Bot

1. Search for **@BotFather** in Telegram
2. Send `/newbot`
3. Follow the prompts to set the bot name
4. Get the Bot Token (format: `123456789:ABCdefGhIjKlMnOpQrStUvWxYz`)

### Step 2: Configure OpenClaw

```yaml
# ~/.openclaw/channels/telegram.yaml
channel:
  type: telegram
  enabled: true
  token: "${TELEGRAM_BOT_TOKEN}"
  allowed_users:
    - "123456789"
  response:
    typing_indicator: true
    max_message_length: 4096
    split_long_messages: true
```

### Step 3: Start and Test

```bash
export TELEGRAM_BOT_TOKEN="your-token-here"
openclaw restart
```

---

## WhatsApp

### Option A: WhatsApp Business API (Recommended for Production)

```yaml
channel:
  type: whatsapp
  mode: business_api
  enabled: true
  business_api:
    phone_number_id: "${WA_PHONE_NUMBER_ID}"
    access_token: "${WA_ACCESS_TOKEN}"
    verify_token: "${WA_VERIFY_TOKEN}"
    webhook_url: "https://your-domain.com/webhook/whatsapp"
```

### Option B: Baileys Bridge (Personal Use)

```yaml
channel:
  type: whatsapp
  mode: baileys
  enabled: true
  baileys:
    session_dir: "~/.openclaw/channels/.whatsapp-session"
```

:::danger WhatsApp Usage Notice
Using the Baileys bridge with a personal WhatsApp account may violate WhatsApp's Terms of Service, risking account suspension. Use WhatsApp Business API for production.
:::

---

## Discord

```yaml
channel:
  type: discord
  enabled: true
  token: "${DISCORD_BOT_TOKEN}"
  slash_commands: true
  response:
    embed_style: true
    thread_replies: true
```

---

## Multi-Platform Operation

You can enable multiple platforms simultaneously. OpenClaw manages all connections automatically:

```bash
openclaw channel list
# CHANNEL      STATUS    CONNECTED SINCE
# telegram     active    2026-03-20 10:00
# discord      active    2026-03-20 10:00
# whatsapp     error     Token expired
```

:::tip Cross-Platform Memory Sharing
When users interact with your AI on different platforms, OpenClaw maintains consistent context through the memory system. Topics discussed on Telegram are remembered when mentioned on LINE. This requires proper user identity mapping configuration.
:::

---

## Token Security Best Practices

1. **Use environment variables**: Inject all Tokens via environment variables
2. **Never commit to Git**: Add `~/.openclaw/channels/*.yaml` to `.gitignore`
3. **Rotate regularly**: Replace tokens at least every 90 days
4. **Use a password manager**: Pair with 1Password CLI, Bitwarden CLI, or HashiCorp Vault
5. **Least privilege**: Grant Bots only the minimum required permissions

---

## Next Steps

- [Choose an AI Model](./choose-llm.md) — Pick the best LLM for your needs
- [SOUL.md Personality Config](./soul-md-config.md) — Customize your AI personality
- [Top 50 Must-Install Skills](/docs/top-50-skills/overview) — Install practical skills
