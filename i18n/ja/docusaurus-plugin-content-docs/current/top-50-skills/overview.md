---
sidebar_position: 1
title: "必須スキル Top 50"
description: "OpenClaw コミュニティで最も推奨される 50 スキルの完全ランキング、評価方法、インストールガイド"
keywords: [OpenClaw, スキル, ClawHub, Top 50, ランキング, 評価]
---

# 必須スキル Top 50

> 最終更新：2026-03-20 ｜ OpenClaw v0.9.x 準拠 ｜ データソース：ClawHub 統計 + コミュニティ投票 + 編集部テスト

本ガイドでは、OpenClaw エコシステムで最も価値のある 50 のスキルを収録しています。**8 次元定量評価** に基づくランキングにより、あなたのワークフローに最適なスキルの組み合わせを素早く見つけることができます。

---

## 評価方法論（Scoring Methodology）

各スキルは以下の 8 つの次元で 1〜10 点の評価を行い、満点は **80 点** です。

| 次元 | コード | 説明 |
|------|--------|------|
| **関連性**（Relevance） | REL | 一般的な OpenClaw ユーザーにとっての実用度 |
| **互換性**（Compatibility） | COM | OpenClaw コアアーキテクチャとの統合深度 |
| **コミュニティ人気度**（Traction） | TRC | ClawHub ダウンロード数、GitHub Stars、Discord 議論量 |
| **価値**（Value） | VAL | 効率向上または機能拡張の幅 |
| **メンテナンス度**（Maintenance） | MNT | 更新頻度、Issue 対応速度、ドキュメント品質 |
| **信頼性**（Reliability） | RLB | 安定性、エラー率、エッジケース処理 |
| **セキュリティ**（Security） | SEC | 逆スコア：10 = 最も安全、1 = 高リスク |
| **学習価値**（Learning Value） | LRN | OpenClaw アーキテクチャや AI エージェントパターンの理解に対する教育的意義 |

**合計 = REL + COM + TRC + VAL + MNT + RLB + SEC + LRN（満点 80）**

### 成熟度レベル

| レベル | ラベル | 説明 |
|--------|--------|------|
| 🟢 | **Stable** | 広範にテスト済み、プロダクション利用可能 |
| 🟡 | **Beta** | 機能は完成しているが既知の問題あり |
| 🟠 | **Alpha** | 実験的、API が変更される可能性あり |
| 🔴 | **Experimental** | 概念実証段階、重要なワークフローには非推奨 |

---

## Top 10 クイックサマリー

| 順位 | スキル名 | カテゴリ | 合計 | インストール方法 | 成熟度 |
|:----:|---------|---------|:----:|----------------|:------:|
| 1 | **GitHub** | 開発 | 72 | `clawhub install openclaw/github` | 🟢 |
| 2 | **Web Browsing** | リサーチ | 70 | 内蔵（bundled） | 🟢 |
| 3 | **GOG** | 生産性 | 68 | `clawhub install openclaw/gog` | 🟢 |
| 4 | **Tavily** | リサーチ | 67 | `clawhub install framix-team/openclaw-tavily` | 🟢 |
| 5 | **Gmail** | 生産性 | 66 | 内蔵（bundled） | 🟢 |
| 6 | **Calendar** | 生産性 | 65 | 内蔵（bundled） | 🟢 |
| 7 | **Slack** | コミュニケーション | 64 | `clawhub install steipete/slack` | 🟡 |
| 8 | **n8n** | 自動化 | 63 | `clawhub install community/n8n-openclaw` | 🟡 |
| 9 | **Obsidian** | 生産性 | 62 | `clawhub install community/obsidian-claw` | 🟡 |
| 10 | **Home Assistant** | スマートホーム | 61 | `clawhub install openclaw/homeassistant` | 🟡 |

---

## 完全ランキング表（Top 50）

| # | スキル | カテゴリ | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 合計 |
|:-:|--------|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 1 | GitHub | 開発 | 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** |
| 2 | Web Browsing | リサーチ | 10 | 10 | 10 | 9 | 8 | 7 | 7 | 9 | **70** |
| 3 | GOG | 生産性 | 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** |
| 4 | Tavily | リサーチ | 9 | 9 | 8 | 9 | 8 | 8 | 8 | 8 | **67** |
| 5 | Gmail | 生産性 | 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** |
| 6 | Calendar | 生産性 | 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** |
| 7 | Slack | コミュニケーション | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | **64** |
| 8 | n8n | 自動化 | 8 | 7 | 8 | 9 | 8 | 8 | 7 | 8 | **63** |
| 9 | Obsidian | 生産性 | 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** |
| 10 | Home Assistant | スマートホーム | 7 | 8 | 7 | 9 | 8 | 8 | 7 | 7 | **61** |
| 11 | Capability Evolver | AI/ML | 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** |
| 12 | Security-check | 開発 | 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** |
| 13 | Notion | 生産性 | 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** |
| 14 | Linear | 開発 | 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** |
| 15 | Felo Search | リサーチ | 8 | 7 | 7 | 8 | 7 | 7 | 8 | 7 | **59** |
| 16 | Browser Automation | 自動化 | 8 | 7 | 7 | 8 | 7 | 7 | 6 | 8 | **58** |
| 17 | Todoist | 生産性 | 8 | 7 | 6 | 7 | 8 | 8 | 8 | 6 | **58** |
| 18 | Firecrawl | データ | 7 | 7 | 7 | 8 | 8 | 7 | 7 | 7 | **58** |
| 19 | Summarize | 生産性 | 8 | 8 | 7 | 7 | 6 | 7 | 9 | 6 | **58** |
| 20 | Cron-backup | 開発 | 7 | 8 | 5 | 8 | 7 | 8 | 8 | 6 | **57** |
| 21 | Apify | データ | 7 | 7 | 7 | 8 | 7 | 7 | 6 | 7 | **56** |
| 22 | Ontology | AI/ML | 6 | 7 | 5 | 8 | 6 | 7 | 8 | 9 | **56** |
| 23 | 1Password | セキュリティ | 7 | 7 | 6 | 7 | 8 | 8 | 9 | 4 | **56** |
| 24 | AgentMail | コミュニケーション | 7 | 7 | 6 | 7 | 7 | 7 | 7 | 8 | **56** |
| 25 | Felo Slides | メディア | 7 | 7 | 7 | 8 | 7 | 6 | 7 | 6 | **55** |
| 26 | Telegram Bot | コミュニケーション | 7 | 7 | 6 | 7 | 7 | 7 | 7 | 7 | **55** |
| 27 | Spotify | メディア | 6 | 7 | 7 | 7 | 7 | 7 | 8 | 6 | **55** |
| 28 | DuckDB CRM | データ | 6 | 7 | 5 | 8 | 7 | 8 | 8 | 6 | **55** |
| 29 | Codex Orchestration | 開発 | 7 | 6 | 5 | 8 | 6 | 7 | 7 | 8 | **54** |
| 30 | Philips Hue | スマートホーム | 6 | 7 | 6 | 7 | 7 | 8 | 7 | 6 | **54** |
| 31 | Things 3 | 生産性 | 7 | 6 | 5 | 7 | 7 | 8 | 8 | 5 | **53** |
| 32 | YouTube Digest | メディア | 7 | 6 | 6 | 7 | 6 | 7 | 8 | 6 | **53** |
| 33 | WhatsApp CLI | コミュニケーション | 7 | 6 | 6 | 7 | 5 | 6 | 7 | 8 | **52** |
| 34 | Reddit Readonly | データ | 6 | 7 | 6 | 6 | 7 | 7 | 8 | 5 | **52** |
| 35 | Image Generation | メディア | 7 | 6 | 6 | 7 | 6 | 6 | 7 | 7 | **52** |
| 36 | Elgato | スマートホーム | 5 | 7 | 5 | 7 | 7 | 8 | 8 | 5 | **52** |
| 37 | IFTTT | 自動化 | 7 | 5 | 6 | 7 | 6 | 7 | 7 | 6 | **51** |
| 38 | RAG Pipeline | AI/ML | 6 | 6 | 5 | 8 | 5 | 6 | 7 | 8 | **51** |
| 39 | TweetClaw | メディア | 6 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | **50** |
| 40 | Voice / Vapi | メディア | 6 | 6 | 5 | 7 | 6 | 6 | 7 | 7 | **50** |
| 41 | Trello | 生産性 | 7 | 6 | 5 | 6 | 6 | 7 | 8 | 5 | **50** |
| 42 | BambuLab 3D | スマートホーム | 4 | 6 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |
| 43 | WHOOP Health | ヘルス | 5 | 5 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |
| 44 | Prompt Library | AI/ML | 6 | 7 | 4 | 6 | 5 | 7 | 9 | 5 | **49** |
| 45 | CSV Analyzer | データ | 6 | 7 | 4 | 6 | 6 | 7 | 8 | 5 | **49** |
| 46 | Jira Bridge | 開発 | 7 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **46** |
| 47 | Airtable | データ | 6 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **45** |
| 48 | Webhook Relay | 自動化 | 5 | 6 | 3 | 6 | 5 | 6 | 7 | 6 | **44** |
| 49 | PDF Parser | 生産性 | 6 | 6 | 3 | 5 | 5 | 6 | 8 | 5 | **44** |
| 50 | Matrix Chat | コミュニケーション | 5 | 5 | 3 | 5 | 5 | 6 | 8 | 6 | **43** |

---

## このガイドの使い方

### 役割別の推奨スキル

| 役割 | 必須スキル | 推奨組み合わせ |
|------|----------|--------------|
| **ソフトウェアエンジニア** | GitHub, Security-check, Linear | Codex Orchestration, n8n |
| **マーケティング担当** | Gmail, Slack, Web Browsing | Felo Search, TweetClaw, Summarize |
| **研究者** | Tavily, Web Browsing, Summarize | Obsidian, Ontology, Reddit Readonly |
| **プロジェクトマネージャー** | Calendar, Notion, Linear | Todoist, Slack, n8n |
| **クリエイター** | Image Generation, Felo Slides, Spotify | YouTube Digest, Voice/Vapi |
| **IoT 愛好家** | Home Assistant, Philips Hue | Elgato, BambuLab 3D |

### 最初のスキルセットをクイックインストール

```bash
# 開発者向けスターターセット
clawhub install openclaw/github
clawhub install community/security-check
clawhub install community/n8n-openclaw

# 研究者向けスターターセット
clawhub install framix-team/openclaw-tavily
clawhub install community/obsidian-claw
clawhub install community/summarize

# 生産性向けスターターセット
clawhub install openclaw/gog
clawhub install community/notion-claw
clawhub install community/todoist-claw
```

:::warning セキュリティ注意
サードパーティスキルをインストールする前に、必ず本ガイドの [セキュリティガイドライン](./safety-guide) ページをお読みください。コミュニティスキルは OpenClaw チームによる審査を受けておらず、データ漏洩のリスクがある可能性があります。
:::

---

## カテゴリ別目次

- [生産性スキル](./productivity) — Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize
- [開発ツールスキル](./development) — GitHub, Security-check, Cron-backup, Linear, n8n, Codex Orchestration
- [コミュニケーションスキル](./communication) — Slack, WhatsApp CLI, Telegram Bot, AgentMail
- [リサーチスキル](./research) — Tavily, Web Browsing, Felo Search, Summarize
- [自動化スキル](./automation) — Browser Automation, Home Assistant, n8n, IFTTT
- [AI/ML スキル](./ai-ml) — Capability Evolver, Ontology, RAG Pipeline
- [スマートホームスキル](./smart-home) — Philips Hue, Elgato, Home Assistant, BambuLab 3D
- [メディアスキル](./media) — Spotify, YouTube Digest, Image Generation, Felo Slides, TweetClaw
- [データスキル](./data) — Apify, Firecrawl, DuckDB CRM, Reddit Readonly
- [セキュリティガイドライン](./safety-guide) — ClawHavoc 事例、VirusTotal 統合、最小権限の原則
