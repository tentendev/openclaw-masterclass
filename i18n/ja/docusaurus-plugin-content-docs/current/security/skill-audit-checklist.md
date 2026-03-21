---
title: スキル監査チェックリスト
description: OpenClaw スキルインストール前の完全なセキュリティ審査チェックリスト — ソースコード検査、権限分析から VirusTotal スキャンまでのステップバイステップガイド。
sidebar_position: 3
---

# スキル監査チェックリスト

ClawHavoc 事件では 2,400+ の悪意あるスキルが ClawHub を通じて数千の OpenClaw インスタンスに配布されました。このチェックリストは、スキルをインストールする前にセキュリティを体系的に評価するのに役立ちます。

:::danger セキュリティ審査をスキップしないでください
ClawHub のスキルはコミュニティ開発者が提出したものです。ClawHub が VirusTotal スキャンを統合していても、自動スキャンでは悪意ある動作をすべて検出できません。**人工審査は依然として必要です**。
:::

---

## クイックリスク評価

| 質問 | はい → リスク高 | いいえ → リスク低 |
|------|-------------|-------------|
| スキルにネットワークアクセスが必要？ | データ外部送信の可能性 | オフライン操作でより安全 |
| ファイルシステムアクセスが必要？ | 機密ファイル読み取りの可能性 | ローカルデータにアクセス不可 |
| shell 実行権限が必要？ | 任意コマンド実行の可能性 | サンドボックスに制限 |
| 新規公開（30日未満）？ | 時間の検証なし | コミュニティが一定期間使用済み |

**「はい」が3つ以上の場合、完全な深掘り審査を実施してください。**

---

## 第1段階：基本情報チェック

```bash
openclaw skill info <skill-name>
```

## 第2段階：ソースコード審査

```bash
# ダウンロードのみ（インストールせず）、審査用
clawhub download community/some-skill --inspect-only

# security-check スキルで自動スキャン
openclaw run security-check --target community/some-skill
```

## 第3段階：サンドボックステスト

```bash
# サンドボックス内でテストしネットワーク動作を監視
openclaw skill test community/some-skill \
  --sandbox \
  --monitor-network \
  --timeout 60
```
