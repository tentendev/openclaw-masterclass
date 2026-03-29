---
title: "Arena 模式完全攻略：用盲測找到最好的 AI 模型"
description: "OpenClaw Arena 模式讓你透過 A/B 盲測對比不同 AI 模型，找出最適合你需求的模型"
authors: [team]
tags: [arena, 模型對比, AI, openclaw, 教學]
date: 2026-03-28
---

# Arena 模式完全攻略：用盲測找到最好的 AI 模型

你是否曾經猶豫：Claude 還是 GPT？Llama 還是 Qwen？OpenClaw 的 Arena 模式讓你用科學的方式找到答案。

<!-- truncate -->

## 什麼是 Arena 模式？

Arena 模式是 OpenClaw 內建的**模型盲測對決系統**。當你啟用 Arena 模式後，每次提問都會同時發送給兩個隨機選中的模型，而你不會知道哪個回答來自哪個模型。

你只需要投票選出你覺得更好的回答，系統就會自動計算 ELO 評分。

## 為什麼需要盲測？

人類有強烈的**品牌偏見**。如果你知道回答來自 GPT-5，你可能會不自覺地給它更高的評價。Arena 模式消除了這種偏見，讓你純粹根據回答品質來評判。

## 快速設定

```yaml
# config.toml 中啟用 Arena
[arena]
enabled = true
models = [
  "claude-opus-4-6",
  "gpt-5.2-codex",
  "gemini-2.5-pro",
  "llama-3.3-70b",
  "qwen-2.5-72b",
  "deepseek-v3"
]
rounds_before_reveal = 20  # 至少 20 輪後才顯示排名
```

## 實戰結果分享

在我們的內部測試中，經過 100 輪盲測後的排名令人驚訝：

| 排名 | 模型 | ELO | 勝率 |
|------|------|-----|------|
| 1 | Claude Opus 4.6 | 1285 | 72% |
| 2 | GPT-5.2 Codex | 1248 | 65% |
| 3 | DeepSeek V3 | 1195 | 58% |
| 4 | Gemini 2.5 Pro | 1180 | 55% |
| 5 | Qwen 2.5 72B | 1120 | 48% |
| 6 | Llama 3.3 70B | 1072 | 42% |

:::tip 結果因人而異
每個人的使用場景不同，你的排名可能完全不同。這正是 Arena 模式的價值——找到**你的**最佳模型。
:::

## 進階技巧

### 1. 分類盲測

不要混合所有類型的問題。分別測試：
- 程式碼生成
- 中文寫作
- 邏輯推理
- 創意發想

### 2. 設定最低輪數

至少需要 30 輪才能得到統計上有意義的結果：

```yaml
[arena]
min_rounds_for_stats = 30
confidence_threshold = 0.95
```

### 3. 匯出數據

```bash
# 匯出 Arena 結果
openclaw arena export --format csv > arena-results.csv

# 查看排行榜
openclaw arena leaderboard
```

## 延伸閱讀

- [Arena 模式完整文件](/docs/features/arena-mode) — 詳細設定與使用指南
- [選擇 AI 模型](/docs/getting-started/choose-llm) — LLM 選擇的基礎指南
- [OpenAI 相容 API 整合](/docs/integrations/openai-compatible) — 連接更多模型

用數據說話，讓 Arena 模式幫你做出最明智的模型選擇！
