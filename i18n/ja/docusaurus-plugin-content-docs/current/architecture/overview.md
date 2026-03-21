---
title: アーキテクチャ概要
description: OpenClaw 4層アーキテクチャの深掘り解析 — Gateway、Reasoning Layer、Memory System、Skills Execution Layer の設計原理と実装詳細。
sidebar_position: 1
---

# アーキテクチャ概要

OpenClaw は明確な4層アーキテクチャ設計を採用しており、各層が独自の役割を持ち、疎結合で連携します。本篇では各層の設計原理、内部動作メカニズム、層間のインタラクション方式を深く分析します。

---

## 全体アーキテクチャ図

```
                    ユーザー
                      │
          ┌───────────┼───────────┐
          │     通信プラットフォーム  │
          │  Telegram│Discord│LINE │
          └───────────┼───────────┘
                      │
    ╔═════════════════╪═════════════════╗
    ║  第1層：Gateway（ゲートウェイ層）  ║
    ║  Port 18789                       ║
    ║  Channel Adapters / Message Queue ║
    ║  Auth & Rate Limiting / REST API  ║
    ╠═══════════════════════════════════╣
    ║  第2層：Reasoning Layer（推論層）  ║
    ║  Intent Recognition / LLM Router  ║
    ║  Tool Selection / SOUL.md         ║
    ╠═══════════════════════════════════╣
    ║  第3層：Memory System（記憶層）    ║
    ║  WAL / Markdown Compaction        ║
    ║  Context Window Manager           ║
    ╠═══════════════════════════════════╣
    ║  第4層：Skills Layer（実行層）     ║
    ║  Sandboxed Containers / ClawHub   ║
    ╚═══════════════════════════════════╝
```

各層の詳細については [MasterClass モジュール 1](/docs/masterclass/module-01-foundations) を参照してください。
