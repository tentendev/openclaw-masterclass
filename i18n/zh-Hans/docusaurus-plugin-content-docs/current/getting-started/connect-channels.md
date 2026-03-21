---
title: 连接通信平台
description: 将 OpenClaw 连接到 WhatsApp、Telegram、Discord、Slack、LINE、Signal、iMessage、Matrix、Zalo、Nostr 等 20+ 通信平台的完整配置指南。
sidebar_position: 3
---

# 连接通信平台

OpenClaw 最强大的功能之一，就是能够同时连接多个通信平台。一个 AI 代理可以同时在 WhatsApp、Telegram、Discord、LINE 等平台上服务——所有对话记忆共享，体验一致。

---

## 通信平台总览

| 平台 | 稳定度 | 难度 | 备注 |
|------|--------|------|------|
| **WhatsApp** | ⭐⭐⭐⭐ | 中等 | 需 WhatsApp Business API 或 Baileys bridge |
| **Telegram** | ⭐⭐⭐⭐⭐ | 简单 | 推荐初学者首选 |
| **Discord** | ⭐⭐⭐⭐⭐ | 简单 | Bot token 即可 |
| **Slack** | ⭐⭐⭐⭐ | 中等 | 需创建 Slack App |
| **LINE** | ⭐⭐⭐⭐ | 中等 | 需 LINE Messaging API |
| **Signal** | ⭐⭐⭐ | 较难 | 透过 signal-cli bridge |
| **iMessage** | ⭐⭐⭐ | 较难 | 仅限 macOS，需 AppleScript bridge |
| **Matrix** | ⭐⭐⭐⭐ | 中等 | 开源协议，隐私友好 |
| **Zalo** | ⭐⭐⭐ | 中等 | 越南主流通信软件 |
| **Nostr** | ⭐⭐⭐ | 中等 | 去中心化协议 |

---

## 通用配置方式

所有通信平台的配置都存放在 `~/.openclaw/channels/` 目录下。每个平台一个 YAML 文件：

```bash
# 查看已配置的平台
ls ~/.openclaw/channels/

# 使用 CLI 新增平台
openclaw channel add <platform>
```

---

## Telegram（推荐入门）

Telegram 是最容易配置的平台，非常适合作为你的第一个连接目标。

### 步骤 1：创建 Telegram Bot

1. 在 Telegram 中搜索 **@BotFather**
2. 发送 `/newbot`
3. 按照指示配置机器人名称
4. 获取 Bot Token（格式如 `123456789:ABCdefGhIjKlMnOpQrStUvWxYz`）

### 步骤 2：配置 OpenClaw

```bash
openclaw channel add telegram
```

或手动创建配置文件：

```yaml
# ~/.openclaw/channels/telegram.yaml

channel:
  type: telegram
  enabled: true
  token: "${TELEGRAM_BOT_TOKEN}"

  # 选用配置
  allowed_users:          # 限制可存取的用户
    - "123456789"         # Telegram user ID
    - "987654321"
  allowed_groups: []      # 留空表示不限制群组

  # 响应配置
  response:
    typing_indicator: true    # 显示「正在输入...」
    max_message_length: 4096  # Telegram 消息长度上限
    split_long_messages: true # 自动分割过长消息
```

### 步骤 3：启动并测试

```bash
# 配置环境变量
export TELEGRAM_BOT_TOKEN="your-token-here"

# 重启 OpenClaw
openclaw restart

# 在 Telegram 中向你的 Bot 发送消息测试
```

:::warning Token 安全
Telegram Bot Token 等同于你的 Bot 的完全控制权。获取 Token 的人可以冒充你的 Bot 发送消息。务必使用环境变量存储，不要提交到版本控制系统。
:::

---

## WhatsApp

WhatsApp 集成有两种方式：

### 方式 A：WhatsApp Business API（推荐用于正式环境）

```yaml
# ~/.openclaw/channels/whatsapp.yaml

channel:
  type: whatsapp
  mode: business_api
  enabled: true

  business_api:
    phone_number_id: "${WA_PHONE_NUMBER_ID}"
    access_token: "${WA_ACCESS_TOKEN}"
    verify_token: "${WA_VERIFY_TOKEN}"
    webhook_url: "https://your-domain.com/webhook/whatsapp"

  allowed_numbers:
    - "+886912345678"
    - "+886987654321"
```

### 方式 B：Baileys Bridge（个人使用）

```yaml
# ~/.openclaw/channels/whatsapp-baileys.yaml

channel:
  type: whatsapp
  mode: baileys
  enabled: true

  baileys:
    session_dir: "~/.openclaw/channels/.whatsapp-session"
    # 首次启动会生成 QR Code，用手机扫描链接
```

:::danger WhatsApp 使用注意
使用 Baileys bridge 连接个人 WhatsApp 账号可能违反 WhatsApp 的服务条款，有被封号的风险。正式用途请使用 WhatsApp Business API。
:::

---

## Discord

```yaml
# ~/.openclaw/channels/discord.yaml

channel:
  type: discord
  enabled: true
  token: "${DISCORD_BOT_TOKEN}"

  # 限制响应的服务器与频道
  allowed_guilds:
    - "1234567890123456789"
  allowed_channels:
    - "9876543210987654321"

  # 命令前缀（如果不使用 Slash Commands）
  prefix: "!claw"

  # Slash Commands
  slash_commands: true

  # 响应配置
  response:
    embed_style: true      # 使用 Discord Embed 格式
    thread_replies: true   # 在讨论串中回复
```

Discord Bot 创建步骤：

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications)
2. 创建新的 Application
3. 在 Bot 页面获取 Token
4. 开启 **Message Content Intent**
5. 使用 OAuth2 URL Generator 生成邀请链接，将 Bot 加入你的服务器

---

## Slack

```yaml
# ~/.openclaw/channels/slack.yaml

channel:
  type: slack
  enabled: true

  slack:
    bot_token: "${SLACK_BOT_TOKEN}"
    app_token: "${SLACK_APP_TOKEN}"    # Socket Mode
    signing_secret: "${SLACK_SIGNING_SECRET}"

  # Socket Mode（推荐，不需要公开 URL）
  socket_mode: true

  allowed_channels:
    - "C0123456789"

  response:
    thread_replies: true   # 在讨论串中回复
    unfurl_links: false
```

Slack App 创建步骤：

1. 前往 [Slack API](https://api.slack.com/apps) 创建新 App
2. 启用 **Socket Mode**
3. 在 **OAuth & Permissions** 中加入必要的 Bot Token Scopes：
   - `chat:write`
   - `channels:history`
   - `app_mentions:read`
4. 安装 App 到你的 Workspace

---

## LINE

```yaml
# ~/.openclaw/channels/line.yaml

channel:
  type: line
  enabled: true

  line:
    channel_access_token: "${LINE_CHANNEL_ACCESS_TOKEN}"
    channel_secret: "${LINE_CHANNEL_SECRET}"
    webhook_url: "https://your-domain.com/webhook/line"

  response:
    max_message_length: 5000
    use_flex_messages: true   # 使用 LINE Flex Message 格式
```

LINE Messaging API 配置步骤：

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 创建 Provider 与 Messaging API Channel
3. 获取 Channel Access Token 与 Channel Secret
4. 配置 Webhook URL

:::info LINE 在台湾的特殊地位
LINE 是台湾最主要的通信软件，月活跃用户超过 2,100 万。如果你的使用场景主要面向台湾用户，LINE 是必须优先集成的平台。
:::

---

## Signal

Signal 集成需要透过 signal-cli bridge：

```bash
# 安装 signal-cli
brew install signal-cli  # macOS
# 或
sudo snap install signal-cli  # Linux
```

```yaml
# ~/.openclaw/channels/signal.yaml

channel:
  type: signal
  enabled: true

  signal:
    phone_number: "+886912345678"
    signal_cli_path: "/usr/local/bin/signal-cli"
    data_dir: "~/.openclaw/channels/.signal-data"

  allowed_contacts:
    - "+886987654321"
```

---

## iMessage（仅限 macOS）

```yaml
# ~/.openclaw/channels/imessage.yaml

channel:
  type: imessage
  enabled: true

  imessage:
    # 使用 AppleScript bridge
    bridge_type: applescript
    check_interval_seconds: 5   # 检查新消息的间隔

  allowed_contacts:
    - "+886912345678"
    - "friend@icloud.com"
```

:::warning macOS 权限
iMessage 集成需要在 macOS 的 **系统配置 > 隐私权与安全性 > 自动化** 中授予 OpenClaw（或 Terminal）存取「消息」App 的权限。
:::

---

## Matrix

```yaml
# ~/.openclaw/channels/matrix.yaml

channel:
  type: matrix
  enabled: true

  matrix:
    homeserver: "https://matrix.org"
    user_id: "@openclaw-bot:matrix.org"
    access_token: "${MATRIX_ACCESS_TOKEN}"

  allowed_rooms:
    - "!abc123:matrix.org"

  encryption:
    enabled: true   # 端对端加密支援
    verify_devices: true
```

---

## Zalo

```yaml
# ~/.openclaw/channels/zalo.yaml

channel:
  type: zalo
  enabled: true

  zalo:
    app_id: "${ZALO_APP_ID}"
    secret_key: "${ZALO_SECRET_KEY}"
    access_token: "${ZALO_ACCESS_TOKEN}"
    webhook_url: "https://your-domain.com/webhook/zalo"
```

---

## Nostr

```yaml
# ~/.openclaw/channels/nostr.yaml

channel:
  type: nostr
  enabled: true

  nostr:
    private_key: "${NOSTR_PRIVATE_KEY}"   # nsec 格式
    relays:
      - "wss://relay.damus.io"
      - "wss://nos.lol"
      - "wss://relay.nostr.band"

  # 只回复 mention 或 DM
  respond_to:
    - mentions
    - direct_messages
```

---

## 多平台同时运行

你可以同时启用多个平台。OpenClaw 会自动管理所有连接：

```bash
# 查看所有已启用的平台
openclaw channel list

# 输出示例：
# CHANNEL      STATUS    CONNECTED SINCE
# telegram     ✓ active  2026-03-20 10:00
# discord      ✓ active  2026-03-20 10:00
# line         ✓ active  2026-03-20 10:01
# whatsapp     ✗ error   Token expired
```

:::tip 跨平台记忆共享
当用户在不同平台上与你的 AI 对话时，OpenClaw 会透过记忆系统维持一致的上下文。例如，用户在 Telegram 上讨论过的话题，在 LINE 上提起时 AI 仍然记得。这需要正确配置用户身份对应（user identity mapping）。
:::

---

## Token 管理安全最佳实践

1. **使用环境变量**：所有 Token 一律透过环境变量注入
2. **不要提交到 Git**：在 `.gitignore` 中加入 `~/.openclaw/channels/*.yaml`
3. **定期更换 Token**：至少每 90 天更换一次
4. **使用密码管理工具**：搭配 1Password CLI、Bitwarden CLI 或 HashiCorp Vault
5. **最小权限原则**：只授予 Bot 所需的最低权限

```bash
# 示例：使用 1Password CLI 注入 Token
export TELEGRAM_BOT_TOKEN=$(op read "op://Vault/OpenClaw/telegram-token")
export DISCORD_BOT_TOKEN=$(op read "op://Vault/OpenClaw/discord-token")
openclaw start
```

---

## 下一步

连接好通信平台后，你可能想要：

- [选择 AI 模型](./choose-llm.md) — 挑选最适合你的 LLM
- [SOUL.md 人格配置](./soul-md-config.md) — 定制化你的 AI 人格
- [Top 50 必装 Skills](/docs/top-50-skills/overview) — 安装实用技能
