---
sidebar_position: 3
title: "開発ツールスキル"
description: "OpenClaw 開発ツールカテゴリのスキル完全レビュー：GitHub、Security-check、Cron-backup、Linear、n8n、Codex Orchestration"
keywords: [OpenClaw, Skills, Development, GitHub, Security, Linear, n8n, Codex]
---

# 開発ツールスキル (Development)

開発ツールカテゴリのスキルにより、OpenClaw エージェントはソフトウェア開発フローに深く統合されます — バージョン管理、Issue 管理から CI/CD 自動化まで、エージェントはペアプログラマーと DevOps アシスタントになれます。

---

## #1 — GitHub

| 属性 | 内容 |
|------|------|
| **ランキング** | #1 / 50 |
| **総合スコア** | 72 / 80 |
| **公式/コミュニティ** | 公式 (Official) |
| **インストール方法** | `clawhub install openclaw/github` |

GitHub スキルは OpenClaw で最高スコアのスキルです。完全な Git ワークフロー統合を提供します：リポジトリ管理、Branch & PR ワークフロー、Issue 管理、CI/CD 統合、コード検索、リリース管理をサポートします。

---

## #12 — Security-check

他のスキルのセキュリティを審査するためのメタスキルです。静的解析、権限宣言の過剰チェック、ハードコードされた secrets とトークンの検出、ネットワークリクエスト先の分析、セキュリティ評価レポートの生成を行います。

---

## #14 — Linear

Linear プロジェクト管理ツールとの深い統合を提供します。Issue の作成・更新・検索、Cycles と Projects の管理、GitHub スキルとの連動をサポートします。

---

## #20 — Cron-backup

OpenClaw の設定、記憶、スキルデータのスケジュールバックアップを提供します。ローカルとクラウドストレージ（S3、Google Drive）をサポートし、増分バックアップとバージョン管理を行います。

---

## #29 — Codex Orchestration

OpenClaw エージェントが複数の Codex スタイルサブタスクを調整できるようにする実験的なスキルです。大規模開発タスクの分割、並列コード生成タスクの実行をサポートします。

:::warning 実験的スキル
Codex Orchestration は現在 Alpha 状態で、API は将来のバージョンで大幅に変更される可能性があります。本番ワークフローでの使用は推奨しません。
:::

---

## #46 — Jira Bridge

Atlassian Jira の基本統合を提供します。Issue の検索・表示、作成・更新、ステータス遷移、コメント追加をサポートします。
