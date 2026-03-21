---
title: API Key 取得ガイド
description: OpenAI、Anthropic、Google Gemini、DeepSeek など各 LLM プロバイダーの API Key を取得し、OpenClaw で設定する方法。
sidebar_position: 3
---

# API Key 取得ガイド

OpenClaw が動作するには、少なくとも1つの LLM プロバイダーの API Key が必要です。本ガイドでは各主要 LLM プロバイダーの API Key 取得手順と OpenClaw での設定方法を説明します。

:::info 費用について
LLM API の使用には費用が発生します。ほとんどのプロバイダーは初期テスト用の無料クレジットを提供しています。
:::

---

## クイック比較表

| プロバイダー | 推奨モデル | 無料枠 | 100万トークンあたりの価格（約） | 適用シーン |
|--------|---------|---------|----------------------|---------|
| **OpenAI** | GPT-5.2 Codex | 限定あり | $2-15 | 汎用対話、コード生成 |
| **Anthropic** | Claude Opus 4.6 | 限定あり | $3-15 | 長文分析、複雑な推論 |
| **Google** | Gemini 2.5 Pro | 比較的多い | $1-7 | マルチモーダル、コスパ |
| **DeepSeek** | DeepSeek-V3 | 極めて低価格 | $0.1-0.5 | 予算重視、中国語最適化 |
| **Ollama (ローカル)** | 各種オープンソースモデル | 完全無料 | $0（ハードウェアコストのみ） | オフライン使用、プライバシー優先 |

---

## OpenAI API Key

### 取得手順

1. [platform.openai.com](https://platform.openai.com) にアクセス
2. アカウント登録またはログイン
3. 左メニューの **API Keys** をクリック
4. **Create new secret key** をクリック
5. Key に名前を付け（例：`openclaw-production`）、コピーして安全に保管

### OpenClaw での設定

```yaml
llm:
  provider: openai
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: gpt-5.2-codex
```

---

## Anthropic API Key

```yaml
llm:
  provider: anthropic
  api_key: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: claude-opus-4-6
```

---

## Ollama（ローカルモデル）

Ollama は API Key 不要で、自分のコンピュータ上でオープンソースモデルを実行します。

```bash
ollama pull llama3.3
ollama pull deepseek-r1:32b
```

```yaml
llm:
  provider: ollama
  base_url: http://localhost:11434
  model: llama3.3
```

---

## API Key セキュリティベストプラクティス

1. **環境変数を使用**：Key を設定ファイルに直接書かない
2. **定期的にローテーション**：90日ごとに API Key を更新
3. **使用量上限を設定**：各プロバイダーの管理画面で月次予算を設定
4. **最小権限の原則**：Key に最小限必要な権限のみを設定
5. **異常使用量を監視**：API 使用量ダッシュボードを定期的にチェック

:::danger 漏洩時の対応
API Key が漏洩した場合（例：GitHub にコミットしてしまった場合）、直ちに：
1. プロバイダーの管理画面で該当 Key を無効化
2. 新しい Key を作成
3. 請求書で異常な消費がないか確認
:::
