---
title: "モジュール 7: ブラウザ自動化とウェブスクレイピング"
sidebar_position: 8
description: "OpenClaw の Headless Chromium と Puppeteer 統合を習得し、強力なウェブスクレイピングとブラウザ自動化エージェントを構築する"
keywords: [OpenClaw, browser, Puppeteer, Chromium, headless, web scraping, ブラウザ自動化, スクレイピング]
---

# モジュール 7: ブラウザ自動化とウェブスクレイピング

## 学習目標

本モジュールを修了すると、以下のことが可能になります：

- OpenClaw の Headless Chromium アーキテクチャを理解する
- Puppeteer 統合を設定・使用してブラウザ自動化を行う
- 安全かつ効率的なウェブスクレイピングエージェントを作成する
- 完全な「価格監視エージェント」を構築する
- 動的レンダリングページ（SPA）のデータ抽出を処理する
- スクレイピングの法的・倫理的注意事項を理解する

## コアコンセプト

### ブラウザ自動化アーキテクチャ

OpenClaw は組み込みの Headless Chromium エンジンと Puppeteer API を通じて、エージェントが人間のようにブラウザを操作できます：

```
Agent
  │
  ├─→ Puppeteer API
  │     ├─→ Headless Chromium Instance
  │     │     ├─→ ページナビゲーション
  │     │     ├─→ DOM 操作
  │     │     ├─→ スクリーンショット
  │     │     └─→ PDF 生成
  │     └─→ Browser Context（分離されたブラウジング環境）
  │
  └─→ 結果をユーザーまたは下流スキルに返却
```

:::danger メモリ溢れ
Headless Chromium は非常にメモリを消費します。各タブは約 50-150MB RAM を使用します。必ず：
1. 使用済みの page は即座に `page.close()`
2. `max_concurrent_pages` の上限を設定
3. Docker/Podman でメモリ制限を設定
4. 定期的に Browser インスタンスを再起動（100回の操作ごとを推奨）
:::

---

## 次のステップ

- [モジュール 6: Cron Jobs / Heartbeat](./module-06-automation)
- [モジュール 8: マルチエージェントアーキテクチャ](./module-08-multi-agent)
