---
title: 通信プラットフォームの接続
description: OpenClaw を WhatsApp、Telegram、Discord、Slack、LINE、Signal、iMessage、Matrix など 20+ の通信プラットフォームに接続する完全設定ガイド。
sidebar_position: 3
---

# 通信プラットフォームの接続

OpenClaw の最も強力な機能の一つは、複数の通信プラットフォームに同時接続できることです。1つの AI エージェントが WhatsApp、Telegram、Discord、LINE などのプラットフォームで同時にサービスを提供し、すべての会話記憶が共有されます。

---

## 通信プラットフォーム一覧

| プラットフォーム | 安定度 | 難易度 | 備考 |
|------|--------|------|------|
| **Telegram** | ⭐⭐⭐⭐⭐ | 簡単 | 初心者向け推奨 |
| **Discord** | ⭐⭐⭐⭐⭐ | 簡単 | Bot トークンのみ |
| **LINE** | ⭐⭐⭐⭐ | 中等 | LINE Messaging API が必要 |
| **Slack** | ⭐⭐⭐⭐ | 中等 | Slack App の作成が必要 |
| **WhatsApp** | ⭐⭐⭐⭐ | 中等 | WhatsApp Business API 推奨 |
| **Matrix** | ⭐⭐⭐⭐ | 中等 | オープンソースプロトコル、プライバシー重視 |

---

## Telegram（入門推奨）

### ステップ 1：Telegram Bot の作成

1. Telegram で **@BotFather** を検索
2. `/newbot` を送信
3. 指示に従ってボット名を設定
4. Bot Token を取得

### ステップ 2：OpenClaw の設定

```yaml
# ~/.openclaw/channels/telegram.yaml
channel:
  type: telegram
  enabled: true
  token: "${TELEGRAM_BOT_TOKEN}"
  allowed_users:
    - "123456789"
```

:::warning Token セキュリティ
Telegram Bot Token はボットの完全な制御権に相当します。環境変数を使用して保管し、バージョン管理システムにコミットしないでください。
:::

---

## マルチプラットフォーム同時運行

```bash
# すべての有効なプラットフォームを表示
openclaw channel list
```

:::tip クロスプラットフォーム記憶共有
ユーザーが異なるプラットフォームで AI と対話する際、OpenClaw は記憶システムを通じて一貫したコンテキストを維持します。
:::
