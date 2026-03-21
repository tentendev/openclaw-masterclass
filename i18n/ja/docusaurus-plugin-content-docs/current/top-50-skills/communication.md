---
sidebar_position: 4
title: "コミュニケーションスキル"
description: "OpenClaw コミュニケーションカテゴリのスキル完全レビュー：Slack、WhatsApp CLI、Telegram Bot、AgentMail、Matrix Chat"
keywords: [OpenClaw, Skills, Communication, Slack, WhatsApp, Telegram, AgentMail, Matrix]
---

# コミュニケーションスキル (Communication)

コミュニケーションカテゴリのスキルにより、OpenClaw エージェントは異なるメッセージプラットフォームを横断して統一されたコミュニケーションアシスタントとなります。

---

## #7 — Slack

著名な開発者 steipete が保守する Slack 統合スキルです。チャネルメッセージの読み取り・検索、メッセージ送信とスレッド返信、ダイレクトメッセージ管理、チャネルサマリー生成をサポートします。

## #24 — AgentMail

エージェント専用のマネージドメール ID を作成します。個人の受信トレイに影響せず、Gmail スキルの draft-only mode よりも徹底した分離方式を提供します。

## #26 — Telegram Bot

OpenClaw エージェントを Telegram Bot としてラッピングします。Telegram 経由でのエージェント対話、エージェントからのプロアクティブ通知の受信、ファイルや画像の共有をサポートします。

## #33 — WhatsApp CLI

wacli（WhatsApp CLI）ツールを通じた WhatsApp との対話をサポートします。

:::warning 非公式 API
WhatsApp CLI は非公式の WhatsApp Web API を使用しており、アカウント凍結のリスクがあります。個人的な実験での使用にとどめてください。
:::

## #50 — Matrix Chat

Matrix 分散型通信プロトコルとの統合を提供します。暗号化メッセージの送受信、ルーム管理、基本的な Bot 機能をサポートします。

---

## コミュニケーションスキル比較表

| 特性 | Slack | Telegram | WhatsApp | AgentMail | Matrix |
|------|:-----:|:--------:|:--------:|:---------:|:------:|
| エンタープライズ対応 | ✅ | ❌ | ❌ | ✅ | ✅ |
| モバイル対話 | ✅ | ✅ | ✅ | ❌ | ✅ |
| 公式 API | ✅ | ✅ | ❌ | ✅ | ✅ |
| E2E 暗号化 | ❌ | ✅ | ✅ | ❌ | ✅ |
