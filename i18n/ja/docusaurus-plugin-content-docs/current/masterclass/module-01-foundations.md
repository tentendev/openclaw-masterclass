---
title: "モジュール 1: OpenClaw 基礎アーキテクチャ"
sidebar_position: 2
description: "OpenClaw の4層アーキテクチャ、コンポーネント間通信、ディレクトリ構造、システムヘルスチェックを深く理解する"
keywords: [OpenClaw, アーキテクチャ, Gateway, Reasoning, Memory, Skills, 基礎]
---

# モジュール 1: OpenClaw 基礎アーキテクチャ

## 学習目標

本モジュールを修了すると、以下のことが可能になります：

- OpenClaw の4層アーキテクチャと各層の役割を説明する
- 各層間の通信方式とデータフローを説明する
- OpenClaw の主要なディレクトリ構造と設定ファイルを特定する
- `openclaw doctor` でシステムヘルスチェックを実行し、結果を解釈する
- SOUL.md でエージェントの基本的なパーソナリティを定義する

:::info 前提条件
[コース概要](./overview) の前提知識チェックを完了し、OpenClaw のインストールが成功していることを確認してください。
:::

---

## 4層アーキテクチャの全体像

OpenClaw は精巧に設計された4層アーキテクチャを採用しており、各層が明確な役割を持ち、定義されたインターフェースで通信します。この設計により、システムは高度なモジュール性と拡張性を備えています。

```
┌─────────────────────────────────────────────┐
│             ユーザー / 外部システム             │
└──────────────────────┬──────────────────────┘
                       │ WebSocket (port 18789)
                       ▼
┌─────────────────────────────────────────────┐
│          第1層：Gateway Layer               │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │WebSocket│  │ Message  │  │ Channel   │  │
│  │ Server  │  │ Router   │  │ Manager   │  │
│  └─────────┘  └──────────┘  └───────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Internal RPC
                       ▼
┌─────────────────────────────────────────────┐
│        第2層：Reasoning Layer               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   LLM    │  │  Mega-   │  │  SOUL.md │  │
│  │ Provider │  │Prompting │  │  Parser  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Read/Write
                       ▼
┌─────────────────────────────────────────────┐
│         第3層：Memory System                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   WAL    │  │ Markdown │  │ Context  │  │
│  │  Engine  │  │Compaction│  │ Window   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Execute
                       ▼
┌─────────────────────────────────────────────┐
│     第4層：Skills / Execution Layer         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Sandboxed│  │ SKILL.md │  │ ClawHub  │  │
│  │Container │  │  Runner  │  │ Registry │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

### 第1層：Gateway Layer

Gateway は OpenClaw のエントリーポイントであり、すべての外部接続を管理します。**ポート 18789** で WebSocket サーバーを稼働させ、メッセージの受信とルーティングを処理します。

**コア機能：**
- WebSocket 接続の確立と管理
- メッセージフォーマットの検証とルーティング
- Channel 抽象化（複数の同時会話をサポート）
- レート制限と基本的なセキュリティフィルタリング

:::warning セキュリティ上の重要事項
Gateway はデフォルトで `127.0.0.1:18789` にバインドされます。**絶対に** `0.0.0.0` に変更しないでください。変更するとネットワーク上に露出します。これは CVE-2026-25253 の根本原因です。詳細はモジュール 9 のセキュリティ章を参照してください。
:::

> 詳細：[モジュール 2: Gateway 詳細解析](./module-02-gateway)

### 第2層：Reasoning Layer

Reasoning Layer は OpenClaw の「頭脳」です。**Mega-prompting** 戦略を用いて LLM と対話し、ユーザーの意図を実行可能なアクションプランに変換します。

**コア機能：**
- SOUL.md の解析によるエージェントパーソナリティの定義
- Mega-prompt の構築（コンテキスト、記憶、スキル一覧の統合）
- LLM プロバイダー接続の管理（OpenAI、Anthropic、ローカルモデルなどをサポート）
- 意思決定：ユーザーへの応答にどのスキルを呼び出すか判断

**Mega-prompting フロー：**

```
ユーザー入力 → SOUL.md パーソナリティの読み込み → 関連記憶の注入 →
利用可能なスキルの一覧化 → Mega-prompt の組み立て → LLM 呼び出し →
応答の解析 → 実行アクションの決定
```

### 第3層：Memory System

Memory System は永続的な記憶機能を提供し、エージェントが会話を跨いでコンテキストを維持できるようにします。

**コアコンポーネント：**
- **Write-Ahead Logging (WAL)**：すべての記憶変更は先に WAL に書き込まれ、データ損失を防止
- **Markdown Compaction**：散在する記憶フラグメントを定期的に構造化された Markdown サマリーに圧縮
- **Context Window Manager**：LLM に注入するコンテキストサイズを動的に管理

> 詳細：[モジュール 5: 永続記憶とパーソナライゼーション](./module-05-memory)

### 第4層：Skills / Execution Layer

Skills Layer は OpenClaw の「手」です。各スキルは**サンドボックス化されたコンテナ**内で実行され、システムの安全性を確保します。

**コア機能：**
- SKILL.md 定義ファイルの解析とスキル能力の読み込み
- サンドボックスコンテナ内でのスキル実行（Podman / Docker）
- スキルのインストール、更新、削除の管理
- ClawHub Registry との同期

> 詳細：[モジュール 3: Skills システムと SKILL.md 仕様](./module-03-skills-system)

---

## 各層間の通信方式

各層は明確に定義されたインターフェースで通信します：

| 送信元 | 送信先 | 通信方式 | データ形式 |
|--------|--------|----------|----------|
| 外部 → Gateway | Gateway | WebSocket | JSON-RPC 2.0 |
| Gateway → Reasoning | Reasoning | Internal RPC | Protocol Buffers |
| Reasoning → Memory | Memory | Direct Call | Structured Objects |
| Reasoning → Skills | Skills | Container API | JSON + Streams |
| Memory → ディスク | 永続化ストレージ | File I/O | WAL + Markdown |

```json
// 典型的な WebSocket メッセージ形式
{
  "jsonrpc": "2.0",
  "method": "chat.send",
  "params": {
    "channel": "default",
    "message": "今日の天気を検索してください",
    "context": {
      "location": "東京"
    }
  },
  "id": "msg-001"
}
```

---

## ディレクトリ構造

OpenClaw インストール後の主要ファイルとディレクトリの構成は以下の通りです：

```
~/.openclaw/
├── config.toml              # メイン設定ファイル
├── SOUL.md                  # エージェントパーソナリティ定義
├── skills/                  # インストール済みスキル
│   ├── official/            # 公式スキル
│   └── community/           # コミュニティスキル
├── memory/                  # 記憶システムデータ
│   ├── wal/                 # Write-Ahead Log ファイル
│   ├── compacted/           # 圧縮済み記憶サマリー
│   └── index.json           # 記憶インデックス
├── logs/                    # システムログ
│   ├── gateway.log
│   ├── reasoning.log
│   └── execution.log
├── containers/              # サンドボックスコンテナ設定
│   └── podman-compose.yml
└── cache/                   # キャッシュファイル
    ├── models/              # LLM モデルキャッシュ
    └── hub/                 # ClawHub キャッシュ
```

### メイン設定ファイル：config.toml

```toml
# ~/.openclaw/config.toml

[gateway]
host = "127.0.0.1"          # 必ず 127.0.0.1 を使用
port = 18789
max_connections = 10
heartbeat_interval = 30      # 秒

[reasoning]
provider = "anthropic"       # または "openai", "local"
model = "claude-sonnet-4-20250514"
max_tokens = 8192
temperature = 0.7

[memory]
wal_enabled = true
compaction_interval = 3600   # 1時間ごとに圧縮
max_context_tokens = 4096
retention_days = 90          # 記憶保持日数

[execution]
runtime = "podman"           # Docker ではなく Podman を推奨
sandbox_memory = "512m"
sandbox_cpu = "1.0"
timeout = 30                 # スキル実行タイムアウト（秒）

[security]
bind_localhost_only = true
verify_skills = true
virustotal_scan = true       # ClawHavoc 以降の新設定
```

---

## 実習：システムヘルスチェック

### ステップ 1：`openclaw doctor` の実行

```bash
openclaw doctor
```

期待される出力：

```
OpenClaw Doctor v0.9.4
======================

[✓] Runtime: Podman 4.9.3 detected
[✓] Gateway: listening on 127.0.0.1:18789
[✓] Memory: WAL engine healthy (23 entries)
[✓] Skills: 47 skills installed, 47 verified
[✓] Config: config.toml valid
[✓] SOUL.md: loaded (personality: "helpful-assistant")
[✓] LLM Provider: Anthropic API reachable
[✓] Security: localhost-only binding confirmed

All checks passed! OpenClaw is healthy.
```

### ステップ 2：各層の状態確認

```bash
# Gateway の状態確認
openclaw status gateway

# Memory の統計情報確認
openclaw status memory

# インストール済みスキルの一覧
openclaw skills list

# システムログの確認
openclaw logs --tail 50
```

### ステップ 3：最初の SOUL.md を作成

SOUL.md はエージェントのパーソナリティ特性を定義します。簡単なパーソナリティ定義を作成しましょう：

```bash
cat > ~/.openclaw/SOUL.md << 'EOF'
# エージェントパーソナリティ定義

## 名前
龍太（Ryuta）

## 役割
あなたは親切なテクニカルアシスタントで、ソフトウェア開発とシステム管理を専門としています。

## 言語設定
- メイン言語：日本語
- 技術用語は英語を維持

## 行動規範
- 回答は簡潔だが完全であること
- 関連する背景知識を積極的に提供する
- 不確かなことは推測せず、正直に伝える
- コードを提供する際は必ず説明を添付する

## 制限事項
- システムに損害を与える可能性のある操作は実行しない
- 機密データへのアクセスはユーザーの明示的な許可がない限り行わない
EOF
```

SOUL.md が正しく読み込まれたか確認：

```bash
openclaw soul show
```

---

## よくあるエラーとトラブルシューティング

### エラー 1：Gateway が起動できない

```
Error: Address already in use (127.0.0.1:18789)
```

**解決方法：**
```bash
# ポートを使用しているプロセスを特定
lsof -i :18789

# 古い OpenClaw プロセスを停止
openclaw stop
# または強制終了
kill -9 <PID>

# 再起動
openclaw start
```

### エラー 2：LLM プロバイダー接続失敗

```
Error: Failed to connect to reasoning provider
```

**解決方法：**
```bash
# API Key が設定されているか確認
openclaw config get reasoning.api_key

# API Key を再設定
openclaw config set reasoning.api_key "sk-your-key-here"

# 接続テスト
openclaw test provider
```

### エラー 3：Podman が未インストール

```
Error: No container runtime found
```

**解決方法：**
```bash
# macOS
brew install podman
podman machine init
podman machine start

# Ubuntu
sudo apt install podman

# 確認
podman --version
openclaw doctor
```

### エラー 4：config.toml 構文エラー

```
Error: Failed to parse config.toml at line 15
```

**解決方法：**
```bash
# 設定ファイルの構文を検証
openclaw config validate

# デフォルト設定にリセット
openclaw config reset --backup
```

---

## 練習問題

1. **アーキテクチャ探索**：`openclaw status` コマンド群を使用して4層アーキテクチャの各状態を確認し、各層の主要な指標（接続数、記憶エントリ数、インストール済みスキル数など）を記録してください。

2. **カスタム SOUL.md**：コードレビュー専用のエージェントパーソナリティを定義するカスタム SOUL.md を作成してください。異なるパーソナリティ設定が応答スタイルにどう影響するか試してみましょう。

3. **設定チューニング**：`config.toml` の `[memory]` セクションで `compaction_interval` を 1800 秒（30分）に変更し、記憶圧縮の動作変化を観察してください。

4. **ログ分析**：OpenClaw を起動して1回の会話を実行し、`gateway.log` と `reasoning.log` を確認して、メッセージの受信から応答までの完全なフローを追跡してください。

---

## 確認テスト

1. **OpenClaw Gateway がデフォルトでリッスンするポートは？**
   - A) 8080
   - B) 3000
   - C) 18789
   - D) 443

2. **Memory System がデータ損失を防ぐために使用する仕組みは？**
   - A) Redis
   - B) Write-Ahead Logging (WAL)
   - C) PostgreSQL
   - D) SQLite

3. **システムヘルスチェックに使用するコマンドは？**
   - A) `openclaw check`
   - B) `openclaw health`
   - C) `openclaw doctor`
   - D) `openclaw verify`

4. **Docker ではなく Podman を推奨する理由は？**
   - A) Podman の方が高速
   - B) Podman はデーモン不要で root 権限も不要なため、セキュリティが高い
   - C) Docker は OpenClaw をサポートしていない
   - D) Podman の方が機能が豊富

5. **SOUL.md の用途は？**
   - A) スキルの動作を定義する
   - B) システムパラメータを設定する
   - C) エージェントのパーソナリティ特性と行動規範を定義する
   - D) システムログを記録する

<details>
<summary>回答を見る</summary>

1. **C** — OpenClaw Gateway はデフォルトでポート 18789 で WebSocket 接続をリッスンします。
2. **B** — Write-Ahead Logging (WAL) はすべての記憶変更を先にログに書き込み、システムがクラッシュしてもデータが失われないことを保証します。
3. **C** — `openclaw doctor` はすべてのシステムコンポーネントのヘルス状態をチェックします。
4. **B** — Podman はデーモンレスのコンテナ実行環境で、root 権限を必要とせず、攻撃面を削減します。これもセキュリティベストプラクティスの一部です。
5. **C** — SOUL.md はエージェントの名前、役割、言語設定、行動規範などのパーソナリティ特性を定義します。

</details>

---

## 次のステップ

OpenClaw の4層アーキテクチャと基本設定について理解できました。次は第1層 Gateway の動作の詳細について深く探っていきましょう。

**[モジュール 2: Gateway 詳細解析へ進む →](./module-02-gateway)**
