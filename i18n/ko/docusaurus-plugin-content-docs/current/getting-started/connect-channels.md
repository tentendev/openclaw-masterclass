---
title: "통신 플랫폼 연결"
sidebar_position: 3
description: "OpenClaw를 WhatsApp, Telegram, Discord, Slack, LINE, Signal, iMessage, Matrix, Zalo, Nostr 등 20+ 통신 플랫폼에 연결하는 완전 설정 가이드"
---

# 連接커뮤니케이션平台

OpenClaw 最強大的功能之一，就是能夠同時連接多個커뮤니케이션平台。一個 AI 代理可以同時在 WhatsApp、Telegram、Discord、LINE 等平台上服務——所有對話記憶共享，體驗一致。

---

## 커뮤니케이션平台總覽

| 平台 | 穩定度 | 難度 | 備註 |
|------|--------|------|------|
| **WhatsApp** | ⭐⭐⭐⭐ | 中等 | 需 WhatsApp Business API 或 Baileys bridge |
| **Telegram** | ⭐⭐⭐⭐⭐ | 簡單 | 推薦初學者首選 |
| **Discord** | ⭐⭐⭐⭐⭐ | 簡單 | Bot token 即可 |
| **Slack** | ⭐⭐⭐⭐ | 中等 | 需생성 Slack App |
| **LINE** | ⭐⭐⭐⭐ | 中等 | 需 LINE Messaging API |
| **Signal** | ⭐⭐⭐ | 較難 | 透過 signal-cli bridge |
| **iMessage** | ⭐⭐⭐ | 較難 | 僅限 macOS，需 AppleScript bridge |
| **Matrix** | ⭐⭐⭐⭐ | 中等 | 開源協定，隱私友好 |
| **Zalo** | ⭐⭐⭐ | 中等 | 越南主流커뮤니케이션軟體 |
| **Nostr** | ⭐⭐⭐ | 中等 | 去中心化協定 |

---

## 通用설정 방법

所有커뮤니케이션平台的설정都存放在 `~/.openclaw/channels/` 目錄下。每個平台一個 YAML 檔案：

```bash
# 조회已설정的平台
ls ~/.openclaw/channels/

# 使用 CLI 新增平台
openclaw channel add <platform>
```

---

## Telegram（推薦入門）

Telegram 是最容易설정的平台，非常適合作為你的第一個連接目標。

### 步驟 1：생성 Telegram Bot

1. 在 Telegram 中검색 **@BotFather**
2. 發送 `/newbot`
3. 按照指示설정機器人名稱
4. 取得 Bot Token（格式如 `123456789:ABCdefGhIjKlMnOpQrStUvWxYz`）

### 步驟 2：설정 OpenClaw

```bash
openclaw channel add telegram
```

或手動생성설정 파일：

```yaml
# ~/.openclaw/channels/telegram.yaml

channel:
  type: telegram
  enabled: true
  token: "${TELEGRAM_BOT_TOKEN}"

  # 選用설정
  allowed_users:          # 限制可存取的사용자
    - "123456789"         # Telegram user ID
    - "987654321"
  allowed_groups: []      # 留空表示不限制群組

  # 回應설정
  response:
    typing_indicator: true    # 顯示「正在輸入...」
    max_message_length: 4096  # Telegram 메시지長度上限
    split_long_messages: true # 自動分割過長메시지
```

### 步驟 3：啟動並테스트

```bash
# 설정環境變數
export TELEGRAM_BOT_TOKEN="your-token-here"

# 重新啟動 OpenClaw
openclaw restart

# 在 Telegram 中向你的 Bot 發送메시지테스트
```

:::warning Token 보안
Telegram Bot Token 等同於你的 Bot 的完全控制權。取得 Token 的人可以冒充你的 Bot 發送메시지。務必使用環境變數저장，不要제출到版本控制系統。
:::

---

## WhatsApp

WhatsApp 整合有兩種方式：

### 方式 A：WhatsApp Business API（推薦用於正式環境）

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

### 方式 B：Baileys Bridge（個人使用）

```yaml
# ~/.openclaw/channels/whatsapp-baileys.yaml

channel:
  type: whatsapp
  mode: baileys
  enabled: true

  baileys:
    session_dir: "~/.openclaw/channels/.whatsapp-session"
    # 首次啟動會產生 QR Code，用手機掃描連結
```

:::danger WhatsApp 사용 주의
使用 Baileys bridge 連接個人 WhatsApp 계정可能違反 WhatsApp 的服務條款，有被封號的風險。正式用途請使用 WhatsApp Business API。
:::

---

## Discord

```yaml
# ~/.openclaw/channels/discord.yaml

channel:
  type: discord
  enabled: true
  token: "${DISCORD_BOT_TOKEN}"

  # 限制回應的서버與채널
  allowed_guilds:
    - "1234567890123456789"
  allowed_channels:
    - "9876543210987654321"

  # 指令前綴（如果不使用 Slash Commands）
  prefix: "!claw"

  # Slash Commands
  slash_commands: true

  # 回應설정
  response:
    embed_style: true      # 使用 Discord Embed 格式
    thread_replies: true   # 在討論串中답변
```

Discord Bot 생성步驟：

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications)
2. 생성新的 Application
3. 在 Bot 頁面取得 Token
4. 開啟 **Message Content Intent**
5. 使用 OAuth2 URL Generator 產生邀請連結，將 Bot 加入你的서버

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

  # Socket Mode（推薦，不需要公開 URL）
  socket_mode: true

  allowed_channels:
    - "C0123456789"

  response:
    thread_replies: true   # 在討論串中답변
    unfurl_links: false
```

Slack App 생성步驟：

1. 前往 [Slack API](https://api.slack.com/apps) 생성新 App
2. 啟用 **Socket Mode**
3. 在 **OAuth & Permissions** 中加入必要的 Bot Token Scopes：
   - `chat:write`
   - `channels:history`
   - `app_mentions:read`
4. 설치 App 到你的 Workspace

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

LINE Messaging API 설정步驟：

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 생성 Provider 與 Messaging API Channel
3. 取得 Channel Access Token 與 Channel Secret
4. 설정 Webhook URL

:::info LINE 在한국的特殊地位
LINE 是한국最主要的커뮤니케이션軟體，月活躍用戶超過 2,100 萬。如果你的使用情境主要面向한국用戶，LINE 是必須優先整合的平台。
:::

---

## Signal

Signal 整合需要透過 signal-cli bridge：

```bash
# 설치 signal-cli
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

## iMessage（僅限 macOS）

```yaml
# ~/.openclaw/channels/imessage.yaml

channel:
  type: imessage
  enabled: true

  imessage:
    # 使用 AppleScript bridge
    bridge_type: applescript
    check_interval_seconds: 5   # 檢查新메시지的間隔

  allowed_contacts:
    - "+886912345678"
    - "friend@icloud.com"
```

:::warning macOS 권한
iMessage 整合需要在 macOS 的 **系統설정 > 隱私權與安全性 > 自動化** 中授予 OpenClaw（或 Terminal）存取「메시지」App 的권한。
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
    enabled: true   # 端對端암호화支援
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

  # 只답변 mention 或 DM
  respond_to:
    - mentions
    - direct_messages
```

---

## 多平台同時運行

你可以同時啟用多個平台。OpenClaw 會自動管理所有連線：

```bash
# 조회所有已啟用的平台
openclaw channel list

# 輸出예시：
# CHANNEL      STATUS    CONNECTED SINCE
# telegram     ✓ active  2026-03-20 10:00
# discord      ✓ active  2026-03-20 10:00
# line         ✓ active  2026-03-20 10:01
# whatsapp     ✗ error   Token expired
```

:::tip 跨平台記憶共享
當사용자在不同平台上與你的 AI 對話時，OpenClaw 會透過記憶系統維持一致的上下文。例如，사용자在 Telegram 上討論過的話題，在 LINE 上提起時 AI 仍然記得。這需要正確설정사용자身份對應（user identity mapping）。
:::

---

## Token 管理安全最佳實踐

1. **使用環境變數**：所有 Token 一律透過環境變數注入
2. **不要제출到 Git**：在 `.gitignore` 中加入 `~/.openclaw/channels/*.yaml`
3. **定期更換 Token**：至少每 90 天更換一次
4. **使用비밀번호管理工具**：搭配 1Password CLI、Bitwarden CLI 或 HashiCorp Vault
5. **最小권한原則**：只授予 Bot 所需的最低권한

```bash
# 예시：使用 1Password CLI 注入 Token
export TELEGRAM_BOT_TOKEN=$(op read "op://Vault/OpenClaw/telegram-token")
export DISCORD_BOT_TOKEN=$(op read "op://Vault/OpenClaw/discord-token")
openclaw start
```

---

## 다음 단계

連接好커뮤니케이션平台後，你可能想要：

- [選擇 AI 模型](./choose-llm.md) — 挑選最適合你的 LLM
- [SOUL.md 人格설정](./soul-md-config.md) — 客製化你的 AI 人格
- [Top 50 必裝 Skills](/docs/top-50-skills/overview) — 설치實用스킬
