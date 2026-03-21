---
title: 初期設定
description: OpenClaw インストール後の初期設定フロー。設定ウィザードの実行、SOUL.md の作成、LLM 接続、最初のテストまでを解説します。
sidebar_position: 2
---

# 初期設定

[インストール](./installation.md) が完了しました。おめでとうございます！本ページでは、OpenClaw を実際に動かすための初期設定フローを案内します。

---

## 設定の概要

初期設定では以下の 4 つのステップを完了する必要があります。

1. インタラクティブ設定ウィザードの実行
2. SOUL.md パーソナリティファイルの作成
3. 最初の LLM プロバイダーへの接続
4. 基本コマンドのテスト

所要時間は約 5〜10 分です。

---

## ステップ 1：設定ウィザードの実行

OpenClaw にはインタラクティブな設定ウィザードが用意されており、基本的な設定を素早く完了できます。

```bash
openclaw setup
```

ウィザードは以下の質問を順に尋ねます。

```
🦞 Welcome to OpenClaw Setup!

? Choose your preferred language: 日本語
? Select container engine: Podman (recommended)
? Gateway bind address: 127.0.0.1 (localhost only)
? Gateway port: 18789
? Choose your primary LLM provider: (Use arrow keys)
  ❯ Anthropic (Claude)
    OpenAI (GPT)
    Google (Gemini)
    DeepSeek
    Ollama (Local)
    Skip for now
? Enter your API key: sk-ant-•••••••••
? Create a default SOUL.md personality? Yes

✅ Setup complete! Config saved to ~/.openclaw/
```

:::tip どの LLM を選べばよいか分からない場合
LLM プロバイダーをまだ決めていない場合は「Skip for now」を選択してください。後から [AI モデルの選択](./choose-llm.md) ページで各モデルの比較を確認し、設定を行えます。
:::

---

## ステップ 2：SOUL.md パーソナリティファイルの作成

SOUL.md は OpenClaw の最もユニークな設計の一つです。AI エージェントの「魂」を定義するファイルで、パーソナリティ、行動ルール、セキュリティ境界、日常タスクを決定します。設定ウィザードが基本的なテンプレートを作成します。

```bash
# デフォルトの SOUL.md を確認
cat ~/.openclaw/soul.md
```

デフォルトの内容は以下の通りです。

```markdown
# SOUL.md

## 基本情報
- 名前：アシスタント
- 言語：日本語
- スタイル：丁寧、専門的、適度にフレンドリー

## 行動規範
- 回答は簡潔に。ユーザーが詳細を求めた場合のみ詳しく説明する
- 自然な日本語を使用し、IT 用語はカタカナ表記を基本とする
- 不確かな質問には正直に伝え、推測しない

## 専門分野
- 一般知識の質問応答
- 日常タスクのサポート
- 技術的な問題の解決
```

SOUL.md の詳細なカスタマイズについては [SOUL.md パーソナリティ設定](./soul-md-config.md) を参照してください。

---

## ステップ 3：LLM プロバイダーへの接続

設定ウィザードで API Key を入力済みの場合は、接続を直接検証できます。

```bash
# LLM 接続のテスト
openclaw provider test
```

期待される出力：

```
Testing connection to Anthropic (Claude)...
✓ API key valid
✓ Model claude-opus-4-6 available
✓ Response time: 342ms
✓ Connection successful!
```

### LLM プロバイダーの手動設定

設定ウィザードで LLM ステップをスキップした場合は、設定ファイルを手動で編集できます。

```bash
# LLM プロバイダー設定の編集
nano ~/.openclaw/providers/default.yaml
```

```yaml
# ~/.openclaw/providers/default.yaml

provider:
  name: anthropic
  model: claude-opus-4-6
  api_key: "${ANTHROPIC_API_KEY}"  # 環境変数の使用を推奨
  max_tokens: 4096
  temperature: 0.7

# フォールバックプロバイダー（メインが利用不可の場合に自動切替）
fallback:
  name: ollama
  model: llama3.3:70b
  endpoint: "http://127.0.0.1:11434"
```

:::warning API Key のセキュリティ
API Key を設定ファイルに直接ハードコードすることは**絶対に避けてください**。環境変数を使用しましょう。

```bash
# ~/.bashrc または ~/.zshrc に追加
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
export OPENAI_API_KEY="sk-your-key-here"
```

設定ファイル内では `${VARIABLE_NAME}` 構文で環境変数を参照します。
:::

---

## ステップ 4：OpenClaw の起動とテスト

### Gateway の起動

```bash
# フォアグラウンドモードで起動（テスト向け、Ctrl+C で停止）
openclaw start

# またはバックグラウンドモードで起動
openclaw start --daemon
```

起動後、以下のような表示が出ます。

```
🦞 OpenClaw v4.2.1 starting...
├─ Gateway listening on 127.0.0.1:18789
├─ Memory system: WAL initialized
├─ Container engine: Podman 5.4.0 (rootless)
├─ LLM provider: Anthropic (claude-opus-4-6)
└─ Skills loaded: 0 (install skills from ClawHub!)

Ready! Use 'openclaw chat' to start a conversation.
```

### CLI で会話を開始

```bash
# インタラクティブチャットを開始
openclaw chat
```

```
🦞 OpenClaw Chat (type 'exit' to quit)

You: こんにちは！あなたは誰ですか？
アシスタント: こんにちは！私はあなたの AI アシスタントです 🦞 何かお手伝いできることはありますか？

You: 今日の天気は？
アシスタント: 現在、天気予報のスキルがまだインストールされていません。
          以下のコマンドでインストールできます：
          openclaw skill install weather-jp
          インストール後に天気を調べられるようになります！

You: exit
Goodbye! 🦞
```

### Gateway API のテスト

HTTP API を通じて直接テストすることも可能です。

```bash
# Gateway にテストメッセージを送信
curl -X POST http://127.0.0.1:18789/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, OpenClaw!",
    "channel": "api",
    "user_id": "test-user"
  }'
```

期待されるレスポンス：

```json
{
  "status": "ok",
  "response": "こんにちは！私はあなたのアシスタントです。何かお手伝いできますか？",
  "metadata": {
    "model": "claude-opus-4-6",
    "tokens_used": 42,
    "response_time_ms": 387
  }
}
```

---

## 最初のスキルのインストール

OpenClaw はインストール直後にはスキルが入っていません。基本的なスキルをいくつかインストールしましょう。

```bash
# スキルの検索
openclaw skill search "翻訳"

# 翻訳スキルのインストール
openclaw skill install translator-pro

# Web 検索スキルのインストール
openclaw skill install web-search

# インストール済みスキルの確認
openclaw skill list
```

:::info ClawHub スキルのセキュリティ
スキルをインストールする前に、セキュリティ評価とコミュニティの評判を確認することを推奨します。ClawHavoc 事件では 2,400 以上の悪意あるスキルが ClawHub に埋め込まれました。インストール前に以下を確認してください：
- スキル作者の認証ステータス
- コミュニティ評価とダウンロード数
- 権限要求の妥当性

詳細は [スキル監査チェックリスト](/docs/security/skill-audit-checklist) を参照してください。
:::

---

## よく使う管理コマンド

| コマンド | 説明 |
|---------|------|
| `openclaw start` | Gateway の起動 |
| `openclaw start --daemon` | バックグラウンドモードで起動 |
| `openclaw stop` | Gateway の停止 |
| `openclaw restart` | 再起動 |
| `openclaw status` | 実行状態の確認 |
| `openclaw chat` | インタラクティブチャットを開始 |
| `openclaw doctor` | ヘルスチェックの実行 |
| `openclaw logs` | リアルタイムログの確認 |
| `openclaw logs --tail 50` | 直近 50 行のログを確認 |
| `openclaw config edit` | 設定ファイルの編集 |
| `openclaw skill list` | インストール済みスキルの一覧 |

---

## 次のステップ

OpenClaw が動作するようになりました。次のステップに進みましょう。

- [メッセージングプラットフォームの接続](./connect-channels.md) — WhatsApp、Telegram、LINE などに AI を配置
- [AI モデルの選択](./choose-llm.md) — 各 LLM モデルの特徴と比較を確認
- [SOUL.md パーソナリティ設定](./soul-md-config.md) — オリジナルの AI パーソナリティを構築
