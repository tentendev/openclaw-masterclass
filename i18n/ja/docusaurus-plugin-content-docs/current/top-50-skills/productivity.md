---
sidebar_position: 2
title: "生産性スキル"
description: "OpenClaw 生産性カテゴリのスキル完全レビュー：Gmail、Calendar、Obsidian、Notion、Todoist、GOG、Things 3、Summarize"
keywords: [OpenClaw, Skills, 生産性, Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize]
---

# 生産性スキル (Productivity)

生産性カテゴリのスキルは、多くのユーザーが OpenClaw をインストールした後に最初に導入するものです。これらのスキルにより、AI エージェントがメール、カレンダー、ノート、タスク管理ツールを直接操作し、日常的な反復作業を自動化できます。

---

## #3 — GOG (General Organizer for Grit)

| 属性 | 内容 |
|------|------|
| **ランキング** | #3 / 50 |
| **カテゴリ** | Productivity |
| **総合スコア** | 68 / 80 |
| **成熟度** | 🟢 Stable |
| **公式/コミュニティ** | 公式 (Official) |
| **インストール方法** | `clawhub install openclaw/gog` |
| **ClawHub ダウンロード数** | 全スキル中最多 |

### 機能説明

GOG は OpenClaw エコシステムで**ダウンロード数最多**のスキルです。統一された「オーガナイザー」インターフェースを提供し、エージェントがファイル、ノート、ブックマークの自動整理、タスクの作成・追跡、クロスツール情報集約、デイリー/ウィークリーサマリーレポートの生成を行えます。

---

## #5 — Gmail

| 属性 | 内容 |
|------|------|
| **ランキング** | #5 / 50 |
| **カテゴリ** | Productivity |
| **総合スコア** | 66 / 80 |
| **インストール方法** | 組み込み（bundled）、インストール不要 |

### 機能説明

Gmail スキルは OpenClaw コアと共にインストールされ、完全なメール管理機能を提供します。受信トレイの読み取り、検索、分類、メールの作成・送信（下書きレビューモード対応）、一般的なメールタイプへの自動返信をサポートします。

:::warning セキュリティ上の考慮事項
Gmail スキルはすべてのメール内容を読み取ることができます。推奨事項：
- **draft-only mode** を有効にする（`openclaw config set gmail.send_mode draft`）
- **sender whitelist** を設定し、自動返信の対象を制限
:::

---

## #6 — Calendar

組み込みスキルとして Google Calendar と CalDAV プロトコルをサポートします。行程の照会、作成、変更、削除、衝突検出と自動スケジュール提案、クロスカレンダー集約をサポートします。

---

## #9 — Obsidian

OpenClaw エージェントが Obsidian Vault を直接操作できるようにします。ノートの作成・編集・検索、backlinks とタグの管理、daily notes の自動生成、Dataview クエリ構文のサポートを提供します。

---

## #13 — Notion

Notion API を通じてエージェントが Notion ワークスペースを管理します。ページとデータベースの作成・編集、Kanban ボードのステータス管理、会話からの自動会議メモ作成をサポートします。

---

## #17 — Todoist

完全な Todoist タスク管理統合：タスクの作成、完了、スケジューリング、プロジェクトとラベルの管理、自然言語入力（「明日午後3時にメール返信をリマインド」）をサポートします。

---

## #19 — Summarize

長文コンテンツを構造化されたサマリーに変換します。ウェブ記事サマリー、PDF/ドキュメントサマリー、メールスレッドサマリー、会議トランスクリプトサマリーをサポートします。

---

## #31 — Things 3

Things 3 URL Scheme と AppleScript を通じたタスク管理統合です。macOS 限定で、Things 3 App のインストールが必要です。

---

## 生産性スキル推奨コンビネーション

### 個人ナレッジワーカー

```bash
clawhub install openclaw/gog
clawhub install community/obsidian-claw
clawhub install community/summarize
# 組み込みの Gmail + Calendar と組み合わせ
```

### チームコラボレーション

```bash
clawhub install community/notion-claw
clawhub install community/todoist-claw
# 組み込みの Gmail + Calendar と組み合わせ
```
