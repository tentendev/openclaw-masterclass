---
sidebar_position: 11
title: "セキュリティガイド"
description: "OpenClaw Skills セキュリティガイド：ClawHavoc 事件分析、VirusTotal 統合、最小権限の原則、インストール前審査チェックリスト"
keywords: [OpenClaw, Skills, セキュリティ, Security, ClawHavoc, VirusTotal, 最小権限]
---

# スキルセキュリティガイド (Safety Guide)

OpenClaw のスキルシステムはオープンアーキテクチャで、誰でもスキルを ClawHub に公開できます。これは豊かなエコシステムをもたらしますが、セキュリティリスクも伴います。

:::danger 重要な警告
コミュニティが公開したスキルは **OpenClaw 公式チームによるセキュリティ審査を受けていません**。サードパーティスキルのインストールは、システム上で信頼されていないコードを実行することと同義です。
:::

---

## ClawHavoc 事件 — ケーススタディ

### 事件概要

2025年11月、`productivity-boost-pro` というスキルが ClawHub に公開され、わずか2週間で 8,000 回以上インストールされました。このスキルは「エージェントのタスク完了効率を大幅に向上」と謳っていましたが、実際にはバックグラウンドで悪意ある動作を実行していました：

1. **データ漏洩**：ユーザーの会話記録、API Key、環境変数を外部サーバーに送信
2. **記憶注入**：エージェントの記憶システムを改ざんし、特定製品の推薦を植え付け
3. **クレデンシャル窃取**：ユーザーの OAuth Token を取得し転送

---

## 最小権限の原則 (Principle of Least Privilege)

各スキルには**機能を遂行するために必要な最小限の権限**のみを付与すべきです。

### 権限レベル

```
Level 0 — 権限なし（純粋な計算）
  例：Summarize, Prompt Library

Level 1 — 読み取りのみ（ローカル）
  例：Reddit Readonly, YouTube Digest

Level 2 — 読み書き（ローカル）
  例：Obsidian, DuckDB CRM

Level 3 — 読み取りのみ（ネットワーク）
  例：Tavily, Felo Search

Level 4 — 読み書き（ネットワーク）
  例：Gmail, GitHub, Slack

Level 5 — システム制御
  例：Home Assistant, Browser Automation
```

---

## インストール前審査チェックリスト

### 1. パブリッシャーの信頼性
- [ ] ClawHub 上の他のスキルを確認
- [ ] GitHub アカウントの存在と活動状況を確認

### 2. ソースコード審査
- [ ] スキルはオープンソースか？
- [ ] ハードコードされた URL や IP アドレスがないか？
- [ ] 不要な `eval()` や動的コード実行がないか？

### 3. 権限の妥当性
- [ ] 宣言された権限が妥当か？
- [ ] Admin / Root 権限を要求していないか？

---

## VirusTotal 統合

```bash
# VirusTotal API Key の設定
openclaw config set security.virustotal_key your_vt_api_key

# 特定スキルのスキャン
openclaw security scan community/some-skill

# 自動スキャン（clawhub install 時に自動実行）
openclaw config set security.auto_scan true
```

---

## セキュリティレベルクイックリファレンス

| セキュリティレベル | 説明 | 適用シーン |
|---------|------|---------|
| **厳格** | 公式スキルのみ、すべてのセキュリティ機構を有効化 | エンタープライズ環境、機密データの処理 |
| **標準** | 高評価のコミュニティスキル、VirusTotal スキャン有効 | 一般ユーザー |
| **緩和** | 任意のスキルインストール、手動審査 | 開発者/実験環境 |
