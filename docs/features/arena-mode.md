---
title: Arena 模式：模型盲測對決
description: 使用 Arena 模式進行 AI 模型盲測，透過 A/B 對比找出最適合你的模型
sidebar_position: 3
keywords: [OpenClaw, Arena, 模型對比, A/B 測試, ELO]
---

# Arena 模式：模型盲測對決

你怎麼知道哪個 LLM 最適合你的使用場景？行銷文案、官方基準測試、甚至 Reddit 上的討論都帶有偏見。Arena 模式讓你用自己的問題、自己的標準，進行真正的盲測對決。

---

## 什麼是 Arena 模式

Arena 模式是 OpenClaw 內建的 **A/B 盲測系統**。當你啟用 Arena 後，每次提問都會同時送給兩個（或多個）模型，而你不會知道哪個回應來自哪個模型。你根據回應品質投票後，系統會自動計算 ELO 評分，逐漸揭示各模型在不同任務上的真實表現。

```
                     使用者提問
                         │
                ┌────────┼────────┐
                │                  │
          ┌─────▼─────┐    ┌─────▼─────┐
          │  模型 A    │    │  模型 B    │
          │  (隱藏)    │    │  (隱藏)    │
          └─────┬─────┘    └─────┬─────┘
                │                  │
          ┌─────▼─────┐    ┌─────▼─────┐
          │  回應 A    │    │  回應 B    │
          │  (匿名)    │    │  (匿名)    │
          └─────┬─────┘    └─────┬─────┘
                │                  │
                └────────┬────────┘
                         │
                    使用者投票
                    A 勝 / B 勝 / 平手
                         │
                    ┌────▼────┐
                    │ ELO 更新│
                    │ 揭示身份│
                    └─────────┘
```

:::tip 為什麼需要盲測？
研究顯示，當使用者知道回應來自哪個模型時，品牌偏見會顯著影響判斷。Arena 的盲測設計消除了這種偏見，讓你的評估結果更加客觀。
:::

---

## Arena 模式的運作原理

### 盲測流程

1. **提問** — 使用者透過任何通訊平台發送問題
2. **分發** — Arena 引擎隨機選擇兩個模型，將問題同時送出
3. **匿名回應** — 兩個回應以「回應 A」和「回應 B」的形式呈現，不揭示模型身份
4. **投票** — 使用者選擇較佳的回應，或判定為平手
5. **ELO 計算** — 根據投票結果更新兩個模型的 ELO 分數
6. **揭示** — 投票後揭示各回應對應的模型名稱

### 匿名化機制

Arena 引擎會在回應中移除可能洩露模型身份的線索：

```
匿名化處理：
├── 移除模型自我介紹（如「我是 Claude」、「作為 GPT」）
├── 統一回應格式（Markdown 標準化）
├── 隨機化 A/B 順序（每次不同）
└── 遮蔽特定用語模式（各模型的慣用句式）
```

---

## 設定 Arena 模式

### 基本設定

```yaml
# ~/.openclaw/arena.yaml
arena:
  enabled: true
  mode: "blind"  # blind | semi-blind | open

  # 參與對決的模型
  models:
    - provider: anthropic
      model: claude-opus-4-6
      api_key: "${ANTHROPIC_API_KEY}"
      label: "model-alpha"  # 內部標籤，不對使用者顯示

    - provider: openai
      model: gpt-5.2-codex
      api_key: "${OPENAI_API_KEY}"
      label: "model-beta"

    - provider: google
      model: gemini-2.5-pro
      api_key: "${GOOGLE_API_KEY}"
      label: "model-gamma"

    - provider: ollama
      model: llama-3.3-70b
      endpoint: "http://127.0.0.1:11434"
      label: "model-delta"

  # 對決規則
  matchmaking:
    strategy: "random"       # random | round-robin | elo-balanced
    models_per_match: 2      # 每場對決的模型數量（2-4）
    min_matches: 30          # 最少對決場次才顯示排行
```

### 進階匹配策略

```yaml
# ~/.openclaw/arena.yaml（進階設定）
arena:
  matchmaking:
    strategy: "elo-balanced"
    # ELO 平衡模式：讓分數相近的模型更常對決
    elo_range: 100           # 優先匹配 ELO 差距在此範圍內的模型

  # 匿名化設定
  anonymization:
    remove_self_references: true   # 移除「我是 XXX」等自我介紹
    normalize_formatting: true     # 統一格式
    randomize_order: true          # 隨機化 A/B 順序
    strip_model_signatures: true   # 移除模型特徵用語

  # 超時設定
  timeouts:
    response_timeout_ms: 60000     # 單個模型回應超時
    vote_timeout_ms: 300000        # 投票超時（5 分鐘）
    vote_timeout_action: "skip"    # skip | auto-tie
```

:::warning 注意 API 費用
Arena 模式會同時呼叫多個模型，費用會相應增加。如果設定了 4 個付費模型且 `models_per_match: 2`，每次提問的 API 費用約為平常的 2 倍。建議搭配本地模型（Ollama）以降低成本。
:::

---

## 投票與評分系統

### 投票方式

透過 Telegram 等通訊平台使用 Arena 時，投票介面如下：

```
使用者：請幫我寫一封商務英文信，拒絕合作邀約但保持禮貌

📩 回應 A：
Dear [Name],
Thank you for reaching out regarding the potential collaboration.
After careful consideration, we have decided not to proceed at
this time. We truly appreciate your interest and hope to explore
opportunities together in the future...

📩 回應 B：
Hi [Name],
Thanks so much for thinking of us for this project! While it
sounds like a fantastic opportunity, our current commitments
prevent us from taking on new partnerships right now. We'd love
to stay in touch and revisit this down the road...

投票選項：
  [A 勝] [B 勝] [平手] [都不好]
```

### 投票指令

```bash
# 在通訊平台中的指令
/arena start          # 進入 Arena 模式
/arena stop           # 退出 Arena 模式
/arena vote a         # 投 A 勝
/arena vote b         # 投 B 勝
/arena vote tie       # 平手
/arena vote neither   # 兩個都不好
/arena reveal         # 提前揭示模型身份（不計入 ELO）
/arena stats          # 查看目前排行
```

### ELO 評分系統

Arena 採用改良的 ELO 評分演算法，與西洋棋 ELO 原理相同：

```
ELO 計算公式：

新分數 = 舊分數 + K × (實際結果 - 預期結果)

其中：
- K = 32（預設 K-factor）
- 實際結果：勝 = 1.0，平 = 0.5，敗 = 0.0
- 預期結果 = 1 / (1 + 10^((對手分數 - 自身分數) / 400))
```

**ELO 設定：**

```yaml
# ~/.openclaw/arena.yaml
arena:
  elo:
    initial_rating: 1200       # 新模型的初始 ELO
    k_factor: 32               # K-factor（越大波動越大）
    k_factor_new_model: 64     # 新模型前 20 場使用較高 K-factor
    new_model_threshold: 20    # 前 N 場視為新模型
    decay:
      enabled: true
      rate: 0.995              # 舊的對決紀錄權重衰減
      interval_days: 7         # 每 7 天衰減一次
```

### ELO 排行榜範例

```
┌──────────────────────────────────────────────────────────────┐
│                   OpenClaw Arena 排行榜                       │
│                   最後更新：2026-03-30                        │
├──────┬─────────────────────┬──────┬──────┬──────┬───────────┤
│ 排名 │ 模型                │ ELO  │ 勝   │ 敗   │ 勝率      │
├──────┼─────────────────────┼──────┼──────┼──────┼───────────┤
│  1   │ Claude Opus 4.6     │ 1387 │  42  │  18  │ 70.0%     │
│  2   │ GPT-5.2 Codex       │ 1342 │  38  │  22  │ 63.3%     │
│  3   │ Gemini 2.5 Pro      │ 1291 │  31  │  29  │ 51.7%     │
│  4   │ Llama 3.3 70B       │ 1180 │  19  │  41  │ 31.7%     │
└──────┴─────────────────────┴──────┴──────┴──────┴───────────┘

總對決場次：120 | 平手：10 | 無效票：2
```

---

## 分類對決：按任務類型評分

Arena 支援按照任務類型分類統計，讓你了解每個模型在不同領域的強項：

### 設定任務分類

```yaml
# ~/.openclaw/arena.yaml
arena:
  categories:
    enabled: true
    auto_classify: true          # 自動偵測問題類型
    classifier_model: "local"    # 用本地模型做分類（省錢）

    types:
      - name: "程式碼"
        keywords: ["code", "程式", "function", "debug", "API"]
      - name: "創意寫作"
        keywords: ["寫", "故事", "文案", "翻譯", "信"]
      - name: "邏輯推理"
        keywords: ["分析", "為什麼", "比較", "推論", "數學"]
      - name: "知識問答"
        keywords: ["什麼是", "解釋", "歷史", "科學"]
      - name: "日常對話"
        keywords: ["聊天", "建議", "推薦", "怎麼辦"]
```

### 分類排行榜

```
┌─────────────────────────────────────────────────────────┐
│              分類 ELO 排行（程式碼）                      │
├──────┬─────────────────────┬──────┬──────────────────────┤
│ 排名 │ 模型                │ ELO  │ 勝率                 │
├──────┼─────────────────────┼──────┼──────────────────────┤
│  1   │ GPT-5.2 Codex       │ 1425 │ 75.0%  ████████████ │
│  2   │ Claude Opus 4.6     │ 1356 │ 62.5%  █████████    │
│  3   │ Gemini 2.5 Pro      │ 1270 │ 45.0%  ██████       │
│  4   │ Llama 3.3 70B       │ 1149 │ 25.0%  ███          │
└──────┴─────────────────────┴──────┴──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              分類 ELO 排行（創意寫作）                    │
├──────┬─────────────────────┬──────┬──────────────────────┤
│ 排名 │ 模型                │ ELO  │ 勝率                 │
├──────┼─────────────────────┼──────┼──────────────────────┤
│  1   │ Claude Opus 4.6     │ 1432 │ 80.0%  █████████████│
│  2   │ Gemini 2.5 Pro      │ 1318 │ 55.0%  ████████     │
│  3   │ GPT-5.2 Codex       │ 1274 │ 42.5%  ██████       │
│  4   │ Llama 3.3 70B       │ 1176 │ 30.0%  ████         │
└──────┴─────────────────────┴──────┴──────────────────────┘
```

:::info 發現
很多使用者透過 Arena 模式發現：最貴的模型不一定在所有任務上都最好。例如本地的 Llama 3.3 70B 在簡單知識問答上可能跟付費模型表現相當，省下大量 API 費用。
:::

---

## 統計與分析

### 查看統計資料

```bash
# CLI 指令
openclaw arena stats                    # 總覽
openclaw arena stats --category "程式碼" # 按分類查看
openclaw arena stats --model claude-opus # 查看特定模型
openclaw arena stats --export csv        # 匯出為 CSV
openclaw arena stats --period 7d         # 最近 7 天
```

### 統計 API

```bash
# REST API 查詢
curl -H "Authorization: Bearer ${GATEWAY_AUTH_TOKEN}" \
  http://127.0.0.1:18789/api/arena/stats

# 回應範例
{
  "total_matches": 120,
  "total_votes": 118,
  "tie_count": 10,
  "invalid_count": 2,
  "models": [
    {
      "label": "Claude Opus 4.6",
      "elo": 1387,
      "wins": 42,
      "losses": 18,
      "ties": 5,
      "win_rate": 0.70,
      "categories": {
        "程式碼": { "elo": 1356, "win_rate": 0.625 },
        "創意寫作": { "elo": 1432, "win_rate": 0.80 }
      }
    }
  ],
  "recent_matches": [
    {
      "id": "match_001",
      "timestamp": "2026-03-30T14:22:00Z",
      "category": "創意寫作",
      "model_a": "claude-opus-4-6",
      "model_b": "gpt-5.2-codex",
      "winner": "model_a",
      "prompt_preview": "請幫我寫一封商務英文信..."
    }
  ]
}
```

### 分析儀表板

Arena 提供內建的 Web 儀表板：

```yaml
# ~/.openclaw/arena.yaml
arena:
  dashboard:
    enabled: true
    port: 18790
    bind: "127.0.0.1"      # 同樣只綁定 localhost
    auth:
      enabled: true
      username: "admin"
      password: "${ARENA_DASHBOARD_PASSWORD}"
```

```bash
# 啟動儀表板
openclaw arena dashboard

# 或透過 SSH tunnel 遠端存取
ssh -L 18790:127.0.0.1:18790 user@your-server
# 然後在瀏覽器開啟 http://localhost:18790
```

:::danger 安全提醒
Arena 儀表板包含所有對決紀錄和使用者提問。務必綁定到 `127.0.0.1` 並啟用認證。詳見 [安全性最佳實踐](/docs/security/best-practices)。
:::

---

## 使用情境

### 情境一：為團隊選擇最佳模型

你的團隊正在評估三個 LLM 提供者。與其依賴官方基準，不如用你們自己的工作場景測試：

```yaml
# 設定團隊 Arena
arena:
  enabled: true
  matchmaking:
    strategy: "round-robin"    # 確保每個模型被公平測試
    models_per_match: 2
    min_matches: 50            # 至少 50 場才有統計意義
```

### 情境二：本地模型 vs 雲端模型

想知道自架的開源模型能否替代付費 API？

```yaml
arena:
  models:
    - provider: anthropic
      model: claude-opus-4-6
      api_key: "${ANTHROPIC_API_KEY}"
      label: "cloud-claude"

    - provider: ollama
      model: llama-3.3-70b
      endpoint: "http://127.0.0.1:11434"
      label: "local-llama"

    - provider: ollama
      model: qwen-2.5-72b
      endpoint: "http://127.0.0.1:11434"
      label: "local-qwen"
```

### 情境三：同模型不同參數

測試同一模型在不同溫度和 system prompt 下的表現差異：

```yaml
arena:
  models:
    - provider: anthropic
      model: claude-opus-4-6
      api_key: "${ANTHROPIC_API_KEY}"
      label: "claude-creative"
      overrides:
        temperature: 0.9
        system_prompt: "你是一位富有創造力的助手。"

    - provider: anthropic
      model: claude-opus-4-6
      api_key: "${ANTHROPIC_API_KEY}"
      label: "claude-precise"
      overrides:
        temperature: 0.2
        system_prompt: "你是一位嚴謹精確的助手。"
```

---

## 多人 Arena

Arena 支援多個使用者同時投票，匯聚團隊的集體智慧：

```yaml
# ~/.openclaw/arena.yaml
arena:
  multi_user:
    enabled: true
    min_votes_per_match: 3     # 至少 3 人投票才計入 ELO
    consensus_threshold: 0.6   # 60% 以上一致才記為有效
    voters:
      - user_id: "user_001"
        weight: 1.0            # 投票權重
      - user_id: "user_002"
        weight: 1.0
      - user_id: "user_003"
        weight: 1.5            # 領域專家，權重較高
```

---

## 練習題

:::note 練習 1：啟動你的第一場 Arena
1. 在 `~/.openclaw/arena.yaml` 設定至少兩個模型（建議一個雲端、一個本地）
2. 用 `/arena start` 進入 Arena 模式
3. 提出 10 個不同領域的問題並投票
4. 用 `/arena stats` 查看結果
:::

:::note 練習 2：分類分析
1. 啟用任務分類功能
2. 針對「程式碼」和「創意寫作」各進行 15 場對決
3. 比較各模型在不同類別的 ELO 差異
4. 將結果匯出為 CSV 並製作圖表
:::

:::note 練習 3：成本效益分析
1. 設定一個付費模型和一個本地模型
2. 進行 30 場盲測
3. 計算本地模型的勝率
4. 估算如果將簡單任務切換到本地模型，每月可節省多少 API 費用
:::

---

## 延伸閱讀

- [架構概覽](/docs/architecture/overview) — 了解 LLM Router 如何在 Arena 外路由模型
- [API 參考](/docs/architecture/api-reference) — Arena 相關 REST API 端點
- [安全性最佳實踐](/docs/security/best-practices) — Arena 儀表板的安全設定
