---
title: API リファレンス
description: OpenClaw Gateway REST API 完全リファレンス — エンドポイント、認証、リクエスト形式、レスポンス形式とエラー処理。
sidebar_position: 2
---

# API リファレンス

OpenClaw Gateway は REST API を提供し、外部プログラムがエージェントと対話できるようにします。API はデフォルトで `http://127.0.0.1:18789` でリッスンします。

:::danger セキュリティ警告
Gateway API はローカルマシンでのみ使用してください。18789 ポートを**絶対に**公開ネットワークに露出しないでください。リモートアクセスが必要な場合は SSH トンネルまたは VPN を使用してください。
:::

---

## 認証

すべての API リクエストでは Header に認証トークンを含める必要があります：

```bash
curl -H "Authorization: Bearer YOUR_GATEWAY_TOKEN" \
  http://127.0.0.1:18789/api/v1/health
```

---

## エンドポイント一覧

| メソッド | エンドポイント | 説明 |
|------|------|------|
| `GET` | `/health` | ヘルスチェック |
| `GET` | `/status` | システム状態 |
| `POST` | `/message` | エージェントにメッセージ送信 |
| `GET` | `/conversations` | 会話一覧 |
| `GET` | `/memory/stats` | 記憶システム統計 |
| `POST` | `/memory/search` | 記憶検索 |
| `GET` | `/skills` | インストール済みスキル一覧 |
| `POST` | `/skills/install` | スキルインストール |
| `GET` | `/channels` | 接続中の通信プラットフォーム一覧 |
| `GET` | `/config` | 設定取得（機密情報マスク済み） |

---

## エラー処理

すべてのエラーレスポンスは統一形式に準拠：

```json
{
  "error": "error_code",
  "message": "人間が読めるエラー説明",
  "status": 400,
  "details": {}
}
```

### 一般的なエラーコード

| HTTP ステータスコード | エラーコード | 説明 |
|------------|--------|------|
| 401 | `unauthorized` | 認証失敗 |
| 429 | `rate_limited` | レート制限超過 |
| 500 | `internal_error` | 内部エラー |
