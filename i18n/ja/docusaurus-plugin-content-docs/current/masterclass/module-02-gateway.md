---
title: "モジュール 2: Gateway 詳細解析"
sidebar_position: 3
description: "OpenClaw Gateway の WebSocket 協調メカニズム、メッセージルーティング、Channel 抽象化とデバッグ技術を深く理解する"
keywords: [OpenClaw, Gateway, WebSocket, メッセージルーティング, Channel, port 18789]
---

# モジュール 2: Gateway 詳細解析

## 学習目標

本モジュールを修了すると、以下のことが可能になります：

- Gateway の WebSocket 協調メカニズムと接続ライフサイクルを説明する
- メッセージルーティングと Channel 抽象化の動作原理を理解する
- ツールを使用して WebSocket トラフィックを検査・デバッグする
- Gateway の詳細パラメータ（レート制限、Heartbeat など）を設定する
- よくある Gateway 接続問題を解決する

:::info 前提条件
[モジュール 1: OpenClaw 基礎アーキテクチャ](./module-01-foundations) を先に完了し、4層アーキテクチャの基本概念を理解してください。
:::

---

## Gateway アーキテクチャ概要

Gateway は OpenClaw と外部世界との唯一のインターフェースです。**ポート 18789** で稼働し、すべての WebSocket 接続を管理し、メッセージを正しい内部コンポーネントにルーティングします。

```
外部クライアント                         Gateway 内部
┌──────────┐                  ┌──────────────────────────────┐
│ CLI      │──┐               │                              │
└──────────┘  │               │  ┌────────────────────┐      │
┌──────────┐  │  WebSocket    │  │  Connection Pool   │      │
│ Web UI   │──┼──────────────▶│  │  ┌──────┐┌──────┐ │      │
└──────────┘  │  :18789       │  │  │Conn 1││Conn 2│ │      │
┌──────────┐  │               │  │  └──────┘└──────┘ │      │
│ サードパ │──┘               │  └────────┬───────────┘      │
│ ーティ   │                  │           │                   │
└──────────┘                  │  ┌────────▼───────────┐      │
                              │  │  Message Router     │      │
                              │  │  ┌───────────────┐ │      │
                              │  │  │ Route Table   │ │      │
                              │  │  └───────────────┘ │      │
                              │  └────────┬───────────┘      │
                              │           │                   │
                              │  ┌────────▼───────────┐      │
                              │  │  Channel Manager   │      │
                              │  │  ┌─────┐ ┌─────┐  │      │
                              │  │  │ CH-1│ │ CH-2│  │      │
                              │  │  └─────┘ └─────┘  │      │
                              │  └────────────────────┘      │
                              └──────────────────────────────┘
```

---

## WebSocket 接続ライフサイクル

各 WebSocket 接続は明確なライフサイクル段階を経ます：

### 1. ハンドシェイク段階

```
Client                          Gateway
  │                                │
  │── HTTP Upgrade Request ───────▶│
  │   GET / HTTP/1.1               │
  │   Upgrade: websocket           │
  │   Connection: Upgrade          │
  │   Sec-WebSocket-Key: xxx       │
  │                                │
  │◀── 101 Switching Protocols ────│
  │   Upgrade: websocket           │
  │   Sec-WebSocket-Accept: yyy    │
  │                                │
  │══════ WebSocket 接続確立 ══════│
```

### 2. 認証段階

接続確立後、クライアントは **5秒以内** に認証メッセージを送信する必要があります：

```json
{
  "jsonrpc": "2.0",
  "method": "auth.handshake",
  "params": {
    "client_id": "cli-macbook-pro",
    "client_version": "0.9.4",
    "token": "oc_local_xxxxxxxxxxxx"
  },
  "id": "auth-001"
}
```

### 3. アクティブ段階

認証後、アクティブ段階に入ります。この段階では Gateway が以下のメカニズムを維持します：

- **Heartbeat**：30秒ごと（設定可能）に ping/pong を送信
- **メッセージルーティング**：`method` フィールドに基づいてメッセージを対応するハンドラーに分配
- **Channel 管理**：複数の同時会話 Channel をサポート

### 4. 終了段階

接続は以下の理由で終了する場合があります：

| 終了理由 | Close Code | 説明 |
|----------|-----------|------|
| 正常切断 | 1000 | クライアントの自主的な切断 |
| 認証タイムアウト | 4001 | 5秒以内に認証未完了 |
| Heartbeat タイムアウト | 4002 | 3回連続で Heartbeat 未応答 |
| レート制限 | 4003 | メッセージ頻度上限超過 |
| サーバーシャットダウン | 1001 | Gateway がシャットダウン中 |
| プロトコルエラー | 1002 | 無効なメッセージ形式 |

---

## メッセージルーティング

Gateway の Message Router は **method-based routing** を使用し、JSON-RPC メッセージの `method` フィールドに基づいて宛先を決定します：

```
method プレフィックス          宛先ハンドラー
─────────────────────────────────
chat.*           →  Reasoning Layer
memory.*         →  Memory System
skill.*          →  Skills Manager
system.*         →  System Controller
channel.*        →  Channel Manager
heartbeat.*      →  Heartbeat Handler
```

### ストリーミング応答メカニズム

Reasoning Layer が LLM を通じて応答を生成する際、Gateway はストリーミング方式でリアルタイムに各トークンを送信します：

```json
// 最初のチャンク
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"こんに","index":0,"channel":"default"}}

// 2番目のチャンク
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"ちは！今日","index":1,"channel":"default"}}

// 完了通知
{"jsonrpc":"2.0","method":"chat.complete","params":{"total_tokens":156,"channel":"default","duration_ms":1230}}
```

---

## Channel 抽象化

Channel は OpenClaw における「会話コンテキスト」の抽象化です。各 Channel は独立した会話履歴と記憶空間を持ちます。

### Channel の特性

- **分離性**：異なる Channel の記憶は互いに影響しない
- **永続性**：Channel の記憶は Memory System に永続化される
- **並行性**：同一接続で複数の Channel を同時に操作可能
- **名前空間**：各 Channel は一意の ID とオプションの名前を持つ

---

## Heartbeat システム

Heartbeat は Gateway が接続の活性を検出するためのメカニズムです。接続ヘルスチェックに加えて、OpenClaw は Heartbeat を使って**プロアクティブ通知（Proactive Notifications）**機能も実現しています。

:::tip Heartbeat とプロアクティブ通知
Heartbeat は単純な ping/pong ではありません。Gateway は Heartbeat メッセージにスケジュールリマインダー、スキル完了通知、システム警告などの通知を含めます。このメカニズムによりエージェントはユーザーに「能動的に」連絡することができます。詳細はモジュール 6 の自動化章を参照してください。
:::

---

## 実習：WebSocket トラフィックの検査とデバッグ

### ステップ 1：`websocat` で接続

```bash
# インストール
brew install websocat  # macOS

# Gateway に接続
websocat ws://127.0.0.1:18789
```

### ステップ 2：OpenClaw 組み込みデバッグモードの使用

```bash
# Gateway デバッグモードの起動
openclaw gateway --debug

# 別のターミナルでリアルタイムメッセージフローを監視
openclaw gateway trace --verbose
```

### ステップ 3：Gateway 指標の監視

```bash
# Gateway のリアルタイム状態確認
openclaw status gateway --watch
```

---

## Gateway 詳細設定

### レート制限

```toml
[gateway.rate_limit]
enabled = true
messages_per_second = 10         # 1秒あたりの最大メッセージ数
messages_per_minute = 200        # 1分あたりの最大メッセージ数
burst_size = 20                  # バースト許容量
cooldown_seconds = 60            # トリガー後のクールダウン時間
```

### TLS 設定（本番環境）

```toml
[gateway.tls]
enabled = true
cert_path = "/etc/openclaw/tls/cert.pem"
key_path = "/etc/openclaw/tls/key.pem"
min_version = "1.2"
```

:::warning 本番環境必須
本番環境では必ず TLS を有効にしてください。暗号化されていない WebSocket 接続（`ws://`）は公開ネットワーク上で安全ではありません。`wss://` 暗号化接続を使用してください。詳細はモジュール 10 の本番デプロイ章を参照してください。
:::

---

## 確認テスト

1. **OpenClaw Gateway が使用する通信プロトコルは？**
   - A) HTTP REST API
   - B) gRPC
   - C) WebSocket
   - D) MQTT

2. **クライアントが WebSocket 接続を確立後、何秒以内に認証を完了する必要があるか？**
   - A) 1秒
   - B) 5秒
   - C) 10秒
   - D) 30秒

3. **Heartbeat システムは接続状態の検出以外に何の機能があるか？**
   - A) メッセージ圧縮
   - B) プロアクティブ通知（Proactive Notifications）
   - C) トラフィック暗号化
   - D) 記憶同期

<details>
<summary>回答を見る</summary>

1. **C** — Gateway は WebSocket プロトコルをポート 18789 で使用します。
2. **B** — クライアントは 5秒以内に `auth.handshake` を完了する必要があります。
3. **B** — Heartbeat メッセージにはプロアクティブ通知が含まれ、エージェントがユーザーにスケジュールリマインダーやタスク完了などのイベントを能動的に通知できます。

</details>

---

## 次のステップ

Gateway の動作メカニズムを深く理解できました。次は OpenClaw の最も強力な機能の一つ、Skills システムに進みましょう。

**[モジュール 3: Skills システムと SKILL.md 仕様へ進む →](./module-03-skills-system)**
