---
title: 選擇 AI 模型
description: 比較 OpenClaw 支援的各大 LLM 模型——Claude、GPT、Gemini、DeepSeek、Ollama、GLM-5、KIMI K2.5——的成本、速度、品質與隱私權衡。
sidebar_position: 4
---

# 選擇 AI 模型

OpenClaw 支援多家 LLM 提供者，你可以根據需求在不同場景中使用不同模型，甚至設定自動切換機制。本篇將幫助你做出最佳選擇。

---

## 模型比較總覽

| 模型 | 提供者 | 成本 | 回應速度 | 品質 | 隱私 | 適合場景 |
|------|--------|------|---------|------|------|---------|
| **Claude Opus 4.6** | Anthropic | $$$ | 中等 | ★★★★★ | 雲端 | 複雜推理、長文撰寫 |
| **Claude Sonnet 4.5** | Anthropic | $$ | 快 | ★★★★ | 雲端 | 日常對話、一般任務 |
| **GPT-5.2 Codex** | OpenAI | $$$ | 中等 | ★★★★★ | 雲端 | 程式開發、技術任務 |
| **GPT-5.2 Mini** | OpenAI | $ | 很快 | ★★★ | 雲端 | 簡單對話、快速回覆 |
| **Gemini 3 Pro** | Google | $$ | 快 | ★★★★ | 雲端 | 多模態、搜尋整合 |
| **DeepSeek V3** | DeepSeek | $ | 快 | ★★★★ | 雲端* | 中文任務、高性價比 |
| **Ollama (本機)** | 你自己 | 免費 | 視硬體 | ★★~★★★★ | ★★★★★ | 完全離線、最大隱私 |
| **GLM-5** | 智譜 AI | $ | 快 | ★★★★ | 雲端 | 中文任務 |
| **KIMI K2.5** | Moonshot | $$ | 中等 | ★★★★ | 雲端 | 長上下文、中文任務 |

> *DeepSeek 為中國公司，資料處理受中國法律管轄。如有隱私顧慮請斟酌使用。

---

## 詳細介紹

### Claude（Anthropic）

Claude 是目前 OpenClaw 社群中最受歡迎的模型之一，尤其在需要細膩推理與安全性的場景中表現優異。

```yaml
# ~/.openclaw/providers/anthropic.yaml

provider:
  name: anthropic
  api_key: "${ANTHROPIC_API_KEY}"

  models:
    primary:
      id: claude-opus-4-6
      max_tokens: 8192
      temperature: 0.7
    fast:
      id: claude-sonnet-4-5
      max_tokens: 4096
      temperature: 0.5

  # 智慧路由：簡單問題用 Sonnet，複雜問題用 Opus
  routing:
    enabled: true
    complexity_threshold: 0.6
```

**優勢**：推理品質極高、回覆自然、安全護欄完善、超長上下文（1M tokens）
**劣勢**：Opus 價格較高、部分地區延遲較高

### GPT（OpenAI）

GPT-5.2 系列在程式碼生成與技術任務上仍具領先地位。

```yaml
# ~/.openclaw/providers/openai.yaml

provider:
  name: openai
  api_key: "${OPENAI_API_KEY}"

  models:
    primary:
      id: gpt-5.2-codex
      max_tokens: 8192
      temperature: 0.7
    fast:
      id: gpt-5.2-mini
      max_tokens: 2048
      temperature: 0.5
```

**優勢**：程式碼生成能力強、生態系成熟、工具呼叫穩定
**劣勢**：成本較高、API 偶有限流

### Gemini（Google）

Gemini 3 Pro 的多模態能力（圖片、影片理解）在 OpenClaw 中特別有用。

```yaml
# ~/.openclaw/providers/google.yaml

provider:
  name: google
  api_key: "${GOOGLE_AI_API_KEY}"

  models:
    primary:
      id: gemini-3-pro
      max_tokens: 8192
      temperature: 0.7
    fast:
      id: gemini-3-flash
      max_tokens: 4096
      temperature: 0.5
```

**優勢**：多模態能力強、與 Google 服務整合良好、Flash 模型極快
**劣勢**：偶有過度安全過濾的問題

### DeepSeek

DeepSeek V3 以極低的成本提供接近頂級模型的品質，特別適合中文場景。

```yaml
# ~/.openclaw/providers/deepseek.yaml

provider:
  name: deepseek
  api_key: "${DEEPSEEK_API_KEY}"
  endpoint: "https://api.deepseek.com"

  models:
    primary:
      id: deepseek-v3
      max_tokens: 8192
      temperature: 0.7
    reasoning:
      id: deepseek-r2
      max_tokens: 16384
      temperature: 0.3
```

:::warning DeepSeek 隱私注意事項
DeepSeek 是中國公司，其 API 服務的資料處理受中國法規管轄。如果你處理敏感個資或企業機密，請審慎評估是否使用。可改用 Ollama 在本機運行 DeepSeek 開源模型版本。
:::

**優勢**：性價比極高、中文品質優秀、推理模型 R2 表現亮眼
**劣勢**：隱私顧慮、部分地區連線不穩

### Ollama（本機模型）

Ollama 讓你在自己的電腦上運行開源 LLM 模型。**完全離線、零成本、最大隱私**。

```bash
# 安裝 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 下載模型
ollama pull llama3.3:70b
ollama pull deepseek-v3:distill-32b
ollama pull gemma3:27b
```

```yaml
# ~/.openclaw/providers/ollama.yaml

provider:
  name: ollama
  endpoint: "http://127.0.0.1:11434"

  models:
    primary:
      id: llama3.3:70b
      max_tokens: 4096
      temperature: 0.7
    fast:
      id: gemma3:27b
      max_tokens: 2048
      temperature: 0.5
    code:
      id: deepseek-v3:distill-32b
      max_tokens: 4096
      temperature: 0.3
```

**適用硬體建議**：

| 模型大小 | 最低記憶體 | 建議 GPU |
|---------|-----------|---------|
| 7B 參數 | 8 GB RAM | 不需要（CPU 可跑） |
| 13B 參數 | 16 GB RAM | 6 GB VRAM |
| 27-32B 參數 | 32 GB RAM | 12 GB VRAM |
| 70B 參數 | 64 GB RAM | 24 GB VRAM |

:::tip Apple Silicon 使用者
如果你使用 M1 Pro/Max 以上的 Mac，Ollama 能充分利用統一記憶體架構。M4 Max 64GB 可以流暢運行 70B 模型，回應速度接近雲端 API。
:::

### GLM-5（智譜 AI）

```yaml
# ~/.openclaw/providers/zhipu.yaml

provider:
  name: zhipu
  api_key: "${ZHIPU_API_KEY}"
  endpoint: "https://open.bigmodel.cn/api/paas/v4"

  models:
    primary:
      id: glm-5
      max_tokens: 8192
      temperature: 0.7
```

**優勢**：中文理解能力優秀、價格合理
**劣勢**：英文能力相對較弱、國際可用性有限

### KIMI K2.5（Moonshot）

```yaml
# ~/.openclaw/providers/moonshot.yaml

provider:
  name: moonshot
  api_key: "${MOONSHOT_API_KEY}"
  endpoint: "https://api.moonshot.cn/v1"

  models:
    primary:
      id: kimi-k2.5
      max_tokens: 8192
      temperature: 0.7
```

**優勢**：超長上下文能力突出、中文品質好
**劣勢**：速度偏慢、海外延遲高

---

## 本機 vs 雲端的取捨

| 考量因素 | 本機（Ollama） | 雲端 API |
|---------|---------------|---------|
| **隱私** | 資料不離開電腦 | 送至第三方伺服器 |
| **成本** | 僅電費 | 按用量計費 |
| **速度** | 視硬體而定 | 通常較快 |
| **品質** | 開源模型略遜 | 頂級閉源模型 |
| **可用性** | 永遠可用 | 依賴網路與 API 狀態 |
| **維護** | 需自行更新模型 | 提供者自動更新 |

:::info 混合模式推薦
最佳實踐是設定混合模式：日常對話使用本機模型（零成本、高隱私），需要高品質推理時自動切換到雲端 API。

```yaml
# ~/.openclaw/providers/default.yaml

routing:
  strategy: hybrid

  # 預設使用本機模型
  default: ollama

  # 當任務複雜度超過閾值時切換到雲端
  escalation:
    provider: anthropic
    model: claude-opus-4-6
    trigger:
      - complexity_score: 0.7
      - explicit_request: true  # 使用者明確要求時
      - skill_requirement: true # 技能要求雲端模型時
```
:::

---

## 設定 API Key

### 使用環境變數（推薦）

```bash
# 在 ~/.zshrc 或 ~/.bashrc 中加入
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
export OPENAI_API_KEY="sk-xxxxx"
export GOOGLE_AI_API_KEY="AIzaSy-xxxxx"
export DEEPSEEK_API_KEY="sk-xxxxx"
export ZHIPU_API_KEY="xxxxx"
export MOONSHOT_API_KEY="sk-xxxxx"
```

### 使用 OpenClaw CLI

```bash
# 互動式設定 API Key（會安全儲存在 keychain）
openclaw provider add anthropic
openclaw provider add openai

# 測試連線
openclaw provider test anthropic
openclaw provider test openai
```

### 驗證所有提供者

```bash
openclaw provider list

# 輸出範例：
# PROVIDER     MODEL              STATUS    LATENCY
# anthropic    claude-opus-4-6    ✓ ok      342ms
# openai       gpt-5.2-codex     ✓ ok      289ms
# ollama       llama3.3:70b       ✓ ok      1.2s
# deepseek     deepseek-v3        ✗ error   API key invalid
```

---

## 費用估算

以每天 100 則對話（平均每則 500 tokens 輸入 + 1000 tokens 輸出）估算：

| 模型 | 每日成本（USD） | 每月成本（USD） |
|------|----------------|----------------|
| Claude Opus 4.6 | ~$2.25 | ~$67.50 |
| Claude Sonnet 4.5 | ~$0.45 | ~$13.50 |
| GPT-5.2 Codex | ~$2.10 | ~$63.00 |
| GPT-5.2 Mini | ~$0.15 | ~$4.50 |
| Gemini 3 Pro | ~$0.53 | ~$15.75 |
| DeepSeek V3 | ~$0.08 | ~$2.40 |
| Ollama（本機） | $0 | $0 |

> 以上為粗略估算，實際費用依各提供者的最新定價為準。

---

## 下一步

選好了你的 AI 模型之後，是時候賦予它獨特的人格了：

- [SOUL.md 人格設定](./soul-md-config.md) — 設計你的 AI 代理的性格與行為
- [連接通訊平台](./connect-channels.md) — 如果你還沒連接任何平台
- [MasterClass 課程](/docs/masterclass/overview) — 深入學習進階功能
