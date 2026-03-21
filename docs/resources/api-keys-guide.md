---
title: API Keys 取得指南
description: 如何取得 OpenAI、Anthropic、Google Gemini、DeepSeek 等 LLM 提供者的 API Key，並在 OpenClaw 中設定使用。
sidebar_position: 3
---

# API Keys 取得指南

OpenClaw 需要至少一個 LLM 提供者的 API Key 才能運作。本指南將逐步教你如何取得各大 LLM 提供者的 API Key，以及在 OpenClaw 中的設定方式。

:::info 費用提醒
使用 LLM API 會產生費用。每個提供者的計費方式不同，請在申請前確認價格。大部分提供者都有免費額度供初始測試使用。
:::

---

## 快速比較表

| 提供者 | 推薦模型 | 免費額度 | 每百萬 Token 價格（約） | 適合場景 |
|--------|---------|---------|----------------------|---------|
| **OpenAI** | GPT-5.2 Codex | 有限額 | $2-15 | 通用對話、程式碼生成 |
| **Anthropic** | Claude Opus 4.6 | 有限額 | $3-15 | 長文分析、複雜推理 |
| **Google** | Gemini 2.5 Pro | 免費額度較高 | $1-7 | 多模態、性價比高 |
| **DeepSeek** | DeepSeek-V3 | 價格極低 | $0.1-0.5 | 預算導向、中文優化 |
| **Ollama (本機)** | 各種開源模型 | 完全免費 | $0（僅硬體成本） | 離線使用、隱私優先 |

---

## OpenAI API Key

### 申請步驟

1. 前往 [platform.openai.com](https://platform.openai.com)
2. 註冊帳號或登入現有帳號
3. 點選左側選單的 **API Keys**
4. 點選 **Create new secret key**
5. 為 Key 命名（例如 `openclaw-production`）
6. 複製並安全儲存 Key（只會顯示一次）

### 在 OpenClaw 中設定

在 OpenClaw 的設定檔中加入：

```yaml
llm:
  provider: openai
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: gpt-5.2-codex
```

或使用環境變數：

```bash
export OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 費用控管建議

- 設定每月用量上限（Monthly Budget）
- 使用 Usage Dashboard 監控消耗
- 開發測試時使用較便宜的模型（如 GPT-4o-mini）

:::caution API Key 安全
絕對不要將 API Key 提交到 Git repository 或分享給他人。建議使用環境變數或專門的 secrets manager 來管理。
:::

---

## Anthropic API Key

### 申請步驟

1. 前往 [console.anthropic.com](https://console.anthropic.com)
2. 註冊帳號（需要電話號碼驗證）
3. 進入 **Settings** → **API Keys**
4. 點選 **Create Key**
5. 複製並安全儲存

### 在 OpenClaw 中設定

```yaml
llm:
  provider: anthropic
  api_key: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: claude-opus-4-6
```

或環境變數：

```bash
export ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 推薦用法

Claude 模型特別擅長：
- **長文脈絡理解**：最高支援 1M token context window
- **複雜推理任務**：多步驟邏輯分析
- **程式碼審查**：精確的程式碼分析與建議

---

## Google Gemini API Key

### 申請步驟

1. 前往 [aistudio.google.com](https://aistudio.google.com)
2. 使用 Google 帳號登入
3. 點選 **Get API Key**
4. 選擇或建立 Google Cloud Project
5. 複製生成的 API Key

### 在 OpenClaw 中設定

```yaml
llm:
  provider: google
  api_key: AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: gemini-2.5-pro
```

### 特色功能

- 多模態支援（圖片、影片、音訊）
- 免費額度相對充裕
- 與 Google Workspace 整合良好

---

## DeepSeek API Key

### 申請步驟

1. 前往 [platform.deepseek.com](https://platform.deepseek.com)
2. 註冊帳號（支援中國大陸手機號碼）
3. 進入控制台，找到 **API Keys** 區域
4. 建立新的 Key 並複製

### 在 OpenClaw 中設定

```yaml
llm:
  provider: deepseek
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: deepseek-v3
```

### 適用場景

- **預算有限**：價格僅為 OpenAI 的 1/10 到 1/30
- **中文場景**：針對中文做過特別優化
- **中國大陸使用者**：無需翻牆即可使用

:::note 中國大陸特殊說明
DeepSeek 是中國大陸使用者的首選 LLM 提供者，因為無需翻牆且價格極低。但請注意，國有企業使用 AI 服務可能有額外合規要求。詳見 [中國生態系統](/docs/resources/chinese-ecosystem)。
:::

---

## Ollama（本機模型）

### 安裝步驟

Ollama 不需要 API Key，因為它在你的本機電腦上運行開源模型。

1. 前往 [ollama.com](https://ollama.com) 下載安裝
2. 安裝完成後，拉取模型：

```bash
ollama pull llama3.3
ollama pull deepseek-r1:32b
```

3. 在 OpenClaw 中設定：

```yaml
llm:
  provider: ollama
  base_url: http://localhost:11434
  model: llama3.3
```

### 優缺點

| 優點 | 缺點 |
|------|------|
| 完全免費 | 需要較強的硬體（GPU） |
| 資料不離開本機 | 模型能力通常不如雲端 |
| 無需網路連線 | 大模型啟動較慢 |
| 無 API 限流 | 需自行管理模型更新 |

---

## 多模型設定策略

OpenClaw 支援同時設定多個 LLM 提供者，並根據任務類型自動選擇最適合的模型：

```yaml
llm:
  default_provider: anthropic
  default_model: claude-opus-4-6

  routing:
    - task: code_generation
      provider: openai
      model: gpt-5.2-codex
    - task: casual_chat
      provider: deepseek
      model: deepseek-v3
    - task: image_analysis
      provider: google
      model: gemini-2.5-pro
    - task: offline_fallback
      provider: ollama
      model: llama3.3
```

:::tip 省錢策略
將日常閒聊交給 DeepSeek 或 Ollama 處理，僅在需要高品質推理時才使用 Claude 或 GPT。這樣可以大幅降低每月的 API 費用。
:::

---

## API Key 安全最佳實踐

1. **使用環境變數**：不要將 Key 直接寫在設定檔中
2. **定期輪換**：每 90 天更換一次 API Key
3. **設定用量上限**：在每個提供者的控制台設定月度預算
4. **最小權限原則**：如果提供者支援，為 Key 設定最小必要權限
5. **監控異常用量**：定期檢查 API 使用量儀表板

:::danger 外洩處理
如果你的 API Key 不小心外洩（例如提交到 GitHub），請立即：
1. 在提供者控制台撤銷該 Key
2. 建立新的 Key
3. 檢查帳單確認是否有異常消費
4. 審查 Git 歷史並清理敏感資料
:::

---

## 相關頁面

- [選擇 AI 模型](/docs/getting-started/choose-llm) — 各模型的詳細比較
- [首次設定](/docs/getting-started/first-setup) — 完成初始設定
- [中國生態系統](/docs/resources/chinese-ecosystem) — DeepSeek 與中國大陸特殊考量
- [安全性最佳實踐](/docs/security/best-practices) — 完整安全設定指南
