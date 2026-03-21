---
title: "モジュール 6: Cron Jobs / Heartbeat / プロアクティブ通知"
sidebar_position: 7
description: "OpenClaw のスケジュールタスク、Heartbeat プロアクティブメッセージプッシュ、自動化監視システムの構築方法を学ぶ"
keywords: [OpenClaw, cron, heartbeat, automation, スケジュール, 自動化, 通知]
---

# モジュール 6: Cron Jobs / Heartbeat / プロアクティブ通知

## 学習目標

本モジュールを修了すると、以下のことが可能になります：

- OpenClaw スケジューリングシステムのアーキテクチャと動作原理を理解する
- Cron Jobs で定期タスクを設定する
- Heartbeat メカニズムでエージェントからの能動的メッセージ送信を有効にする
- デイリーダイジェスト（Daily Digest）自動化フローを構築する
- リアルタイム監視とアラートシステムを設計する

## コアコンセプト

### スケジュールアーキテクチャ概要

OpenClaw の自動化アーキテクチャは2つのコアメカニズムの上に構築されています：

| メカニズム | 説明 | 適用シーン |
|------|------|---------|
| **Cron Jobs** | cron 式に基づく定時タスク | 定期レポート、データバックアップ、スケジュールクリーニング |
| **Heartbeat** | エージェントが能動的にトリガーする周期的動作 | 能動的挨拶、状態チェック、リアルタイムリマインダー |
| **Event Triggers** | イベントベースの受動的トリガー | Webhook 応答、メッセージ監視、状態変更 |

### 実装：基本 Cron Job の設定

```json
{
  "cron": {
    "enabled": true,
    "jobs": [
      {
        "name": "daily-digest",
        "schedule": "0 9 * * *",
        "action": "send_daily_digest",
        "channel": "discord",
        "timezone": "Asia/Tokyo"
      }
    ]
  }
}
```

:::tip タイムゾーン設定
必ず `timezone` フィールドを設定してください。設定しない場合、OpenClaw はデフォルトで UTC タイムゾーンを使用します。日本のユーザーは `Asia/Tokyo` に設定してください。
:::

---

## 次のステップ

- [モジュール 7: ブラウザ自動化とウェブスクレイピング](./module-07-browser)
- [モジュール 8: マルチエージェントアーキテクチャ](./module-08-multi-agent)
