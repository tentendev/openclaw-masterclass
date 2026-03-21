---
title: "モジュール 5: 永続記憶とパーソナライゼーション"
sidebar_position: 6
description: "OpenClaw の Memory System — Write-Ahead Logging、Markdown Compaction、Context Window 管理と記憶パーソナライゼーションを深く理解する"
keywords: [OpenClaw, Memory, WAL, Markdown Compaction, 記憶, Context Window, パーソナライゼーション]
---

# モジュール 5: 永続記憶とパーソナライゼーション

## 学習目標

本モジュールを修了すると、以下のことが可能になります：

- OpenClaw Memory System の3大コアコンポーネントを説明する
- Write-Ahead Logging (WAL) の動作メカニズムとデータ安全保証を理解する
- Markdown Compaction がフラグメント記憶を構造化サマリーに圧縮する仕組みを説明する
- Context Window 管理戦略を設定する
- 記憶保持ポリシーを構成し、エージェントのパーソナライゼーションを実現する

---

## Memory System アーキテクチャ

OpenClaw の Memory System はエージェントが会話やセッションを超えて重要な情報を記憶できるようにします。単純な会話履歴ではなく、**書き込み保護**、**自動圧縮**、**インテリジェント検索**機能を備えた記憶管理システムです。

### 3大コアコンポーネント

| コンポーネント | 役割 | 類似概念 |
|------|------|------|
| **WAL Engine** | すべての記憶変更を先に WAL に書き込み、データ損失を防止 | DB の Transaction Log |
| **Markdown Compaction** | WAL 内のフラグメント記憶を定期的に構造化 Markdown サマリーに圧縮 | DB の Compaction / Vacuum |
| **Context Window Manager** | 関連する記憶をインテリジェントに選択し、LLM の Context Window に注入 | 検索エンジンの Ranking |

---

## Write-Ahead Logging (WAL)

WAL は記憶システムの基本的な安全メカニズムです。すべての記憶操作（追加、変更、削除）は先に WAL ファイルに書き込まれ、システムが予期せずクラッシュしても記憶データが失われないことを保証します。

### WAL の安全保証

- **永続性（Durability）**：WAL 書き込み後に `fsync` でディスクへの書き込みを保証
- **原子性（Atomicity）**：各 WAL エントリは完全に書き込まれるか、まったく書き込まれないか
- **順序性（Ordering）**：WAL エントリは厳密に時系列順に並ぶ
- **回復可能性（Recoverability）**：システム再起動時に WAL から未圧縮の記憶を自動回復

---

## Markdown Compaction

WAL 内の記憶エントリはフラグメント化されています。**Markdown Compaction** はこれらのフラグメントを定期的に構造化された Markdown ファイルに圧縮し、ストレージスペースを削減し検索効率を向上させます。

---

## Context Window 管理

Context Window Manager は各 LLM 呼び出し時に、記憶庫から最も関連性の高い記憶フラグメントをインテリジェントに選択して Prompt に注入します。

### 選択戦略

```
最終スコア = (関連性 × 0.4) + (重要度 × 0.3) + (新鮮度 × 0.2) + (頻度 × 0.1)
```

| 要素 | 重み | 説明 |
|------|------|------|
| **関連性（Relevance）** | 0.4 | 記憶内容と現在の会話のセマンティック類似度 |
| **重要度（Importance）** | 0.3 | WAL に記録された重要度スコア |
| **新鮮度（Recency）** | 0.2 | より最近の記憶ほどスコアが高い |
| **頻度（Frequency）** | 0.1 | 参照回数が多い記憶ほどスコアが高い |

---

## 確認テスト

1. **WAL の正式名称は？** → B) Write-Ahead Logging
2. **Markdown Compaction の主な目的は？** → B) フラグメント化された記憶を構造化された Markdown サマリーに圧縮する
3. **Context Window Manager が記憶を選択する際、最も重みが高い要素は？** → C) 関連性（Relevance）

---

## 次のステップ

**[コース概要に戻る →](./overview)**
