---
title: "モジュール 3: Skills システムと SKILL.md 仕様"
sidebar_position: 4
description: "OpenClaw Skills システム、SKILL.md 仕様定義、スキルライフサイクルの理解、ゼロから初めてのスキルを構築する"
keywords: [OpenClaw, Skills, SKILL.md, ClawHub, スキル開発, サンドボックス]
---

# モジュール 3: Skills システムと SKILL.md 仕様

## 学習目標

本モジュールを修了すると、以下のことが可能になります：

- OpenClaw Skills システムのアーキテクチャと実行モデルを説明する
- 完全な SKILL.md 定義ファイルを作成する
- スキルの完全なライフサイクル（インストール → ロード → 実行 → アンインストール）を理解する
- ゼロから動作するスキルを構築する
- サンドボックスコンテナ内でスキルをテスト・デバッグする

:::info 前提条件
[モジュール 1: 基礎アーキテクチャ](./module-01-foundations) と [モジュール 2: Gateway 詳細解析](./module-02-gateway) を先に完了してください。
:::

---

## Skills システムアーキテクチャ

Skills は OpenClaw の「能力」です。各スキルは特定の機能（ウェブ検索、ファイル操作、API クエリなど）をカプセル化し、**サンドボックス化されたコンテナ**内で安全に実行されます。

```
Reasoning Layer
      │
      │ "天気情報を検索する必要がある"
      ▼
┌─────────────────────────────────┐
│         Skills Manager          │
│  ┌───────────────────────────┐  │
│  │    Skill Registry         │  │
│  │  ┌───────┐ ┌───────┐     │  │
│  │  │weather│ │ file  │ ... │  │
│  │  └───┬───┘ └───────┘     │  │
│  └──────┼────────────────────┘  │
│         │                       │
│  ┌──────▼────────────────────┐  │
│  │    SKILL.md Parser        │  │
│  │  能力、パラメータ、権限の解析│  │
│  └──────┬────────────────────┘  │
│         │                       │
│  ┌──────▼────────────────────┐  │
│  │    Sandbox Executor       │  │
│  │  ┌──────────────────┐    │  │
│  │  │  Podman Container │    │  │
│  │  │  ┌──────────────┐│    │  │
│  │  │  │ Skill Runner ││    │  │
│  │  │  └──────────────┘│    │  │
│  │  └──────────────────┘    │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 実行モデル

1. **Reasoning Layer の意思決定**：LLM がユーザーの意図に基づき、ロード済みスキルから適切なものを選択
2. **パラメータ組み立て**：SKILL.md で定義された `parameters` に基づき実行パラメータを組み立て
3. **サンドボックス起動**：独立したコンテナ内でスキルランナーを起動
4. **実行と返却**：スキル実行完了後、結果は Gateway を経由してクライアントにストリーミング
5. **リソースクリーンアップ**：コンテナはタイムアウト後に自動破棄

---

## SKILL.md 仕様

SKILL.md は各スキルの定義ファイルで、Markdown + YAML Frontmatter 形式を使用します。OpenClaw にこのスキルが何ができるか、どのパラメータが必要か、どのような制限があるかを伝えます。

### 完全な仕様

```markdown
---
name: "weather-lookup"
version: "1.2.0"
author: "openclaw-official"
description: "世界中の都市のリアルタイム天気情報を検索する"
license: "MIT"
runtime: "node:20-slim"
timeout: 15
permissions:
  - network:api.openweathermap.org
  - network:api.weatherapi.com
tags:
  - weather
  - utility
  - api
triggers:
  - "天気"
  - "weather"
  - "気温"
  - "雨"
---

# Weather Lookup Skill

## 能力説明

このスキルは世界中の任意の都市のリアルタイム天気情報を検索できます。
気温、湿度、風速、降水確率などを含みます。

## パラメータ

| パラメータ | 型 | 必須 | 説明 |
|------|------|------|------|
| city | string | はい | 都市名 |
| unit | string | いいえ | 温度単位（celsius/fahrenheit）、デフォルト celsius |
| lang | string | いいえ | 応答言語、デフォルト ja |

## 返却形式

JSON オブジェクトを返却します：

```json
{
  "city": "東京",
  "temperature": 22,
  "unit": "celsius",
  "humidity": 65,
  "wind_speed": 8,
  "description": "晴れ時々曇り",
  "forecast": [...]
}
```
```

### 権限モデル

OpenClaw は最小権限の原則を使用します。各スキルは必要な権限を明示的に宣言する必要があります：

```yaml
permissions:
  - network:api.example.com      # 特定ドメインへのアクセスを許可
  - network:*.github.com         # GitHub サブドメインへのアクセスを許可
  - filesystem:read:/tmp         # /tmp の読み取りを許可
  - filesystem:write:/tmp/output # 特定ディレクトリへの書き込みを許可
  - env:API_KEY                  # 環境変数の読み取りを許可
```

:::danger セキュリティ上の重要事項
スキルは `permissions` に明示的にリストされたリソースにのみアクセスできます。未承認のアクセス試行はサンドボックスによってブロックされ、セキュリティログに記録されます。これは ClawHavoc 事件後に強化されたセキュリティメカニズムです。
:::

---

## スキルライフサイクル

```
  インストール (Install)       ロード (Load)
  ┌──────────┐         ┌──────────┐
  │ clawhub  │         │ 解析     │
  │ install  │────────▶│ SKILL.md │
  │ DL・検証  │         │ 能力登録  │
  └──────────┘         └────┬─────┘
                            │
                            ▼
                     ┌──────────┐
                     │ 準備完了  │◀─────────┐
                     │ (Ready)  │          │
                     └────┬─────┘          │
                          │ トリガー       │ 完了/タイムアウト
                          ▼                │
                     ┌──────────┐          │
                     │ 実行     │──────────┘
                     │(Execute) │
                     └──────────┘
```

### 各段階の詳細

**インストール（Install）**
```bash
# ClawHub からインストール
clawhub install openclaw-official/weather-lookup

# 特定バージョンのインストール
clawhub install openclaw-official/weather-lookup@1.2.0
```

**実行（Execute）**
```bash
# スキルの手動テスト
openclaw skill run weather-lookup --params '{"city": "東京"}'
```

---

## 実習：初めてのスキルを構築する

ゼロから **Pomodoro Timer Skill**（ポモドーロタイマー）を構築しましょう。

### ステップ 1：スキルディレクトリ構造の作成

```bash
mkdir -p ~/.openclaw/skills/local/pomodoro-timer
cd ~/.openclaw/skills/local/pomodoro-timer
```

### ステップ 2：SKILL.md の作成

```bash
cat > SKILL.md << 'SKILLEOF'
---
name: "pomodoro-timer"
version: "0.1.0"
author: "your-username"
description: "ポモドーロタイマー、カスタム作業・休憩時間をサポート"
license: "MIT"
runtime: "node:20-slim"
timeout: 30
permissions: []
tags:
  - productivity
  - timer
  - pomodoro
triggers:
  - "ポモドーロ"
  - "pomodoro"
  - "タイマー"
  - "集中"
---

# Pomodoro Timer Skill

## 能力説明

ポモドーロタイマーの管理。開始、一時停止、状態確認をサポート。
デフォルト作業時間 25分、休憩時間 5分。

## パラメータ

| パラメータ | 型 | 必須 | 説明 |
|------|------|------|------|
| action | string | はい | アクション：start / pause / status / reset |
| work_minutes | number | いいえ | 作業時間（分）、デフォルト 25 |
| break_minutes | number | いいえ | 休憩時間（分）、デフォルト 5 |
| label | string | いいえ | 今回のタスクのラベル |
SKILLEOF
```

### ステップ 3：テスト

```bash
# OpenClaw 組み込みのスキルテストツールを使用
openclaw skill test ./

# SKILL.md 構文の検証
openclaw skill validate ./SKILL.md
```

---

## 確認テスト

1. **SKILL.md はどの形式を使用するか？** → C) Markdown + YAML Frontmatter
2. **OpenClaw Skills はどの環境で実行されるか？** → B) サンドボックス化されたコンテナ（Podman/Docker）
3. **SKILL.md の必須フィールドでないものは？** → C) `triggers`
4. **スキルのデフォルト最大実行時間は？** → B) 30秒
5. **ClawHavoc 事件後、スキルインストール時に追加されたセキュリティ対策は？** → B) VirusTotal スキャン

---

## 次のステップ

**[モジュール 4: ClawHub マーケットプレイスへ進む →](./module-04-clawhub)**
