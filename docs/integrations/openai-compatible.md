---
title: OpenAI 相容 API 整合
description: 連接 OpenAI、Anthropic、Google、Groq 等 LLM 提供者到 OpenClaw 的完整指南
sidebar_position: 2
keywords: [OpenClaw, OpenAI, Anthropic, Claude, Gemini, Groq, API]
---

# OpenAI 相容 API 整合

OpenClaw 採用 OpenAI 相容的統一介面，讓您透過單一 API 格式連接數十家 LLM 提供者。本指南涵蓋各主流提供者的設定方式、模型路由策略與成本最佳化方案。

## 架構概覽

```
使用者請求 → OpenClaw Gateway → 路由引擎 → 提供者 A / 提供者 B / 提供者 C
                                    ↑
                              路由規則 + 備援邏輯
```

所有提供者統一使用 `/v1/chat/completions` 端點，OpenClaw 在背後處理格式轉換與認證。

## 支援的提供者一覽

| 提供者 | 相容性 | 串流支援 | 函式呼叫 | 視覺能力 |
|--------|--------|---------|---------|---------|
| OpenAI | 原生 | 是 | 是 | 是 |
| Anthropic Claude | 轉換層 | 是 | 是 | 是 |
| Google Gemini | 轉換層 | 是 | 是 | 是 |
| Groq Cloud | 原生相容 | 是 | 是 | 否 |
| OpenRouter | 原生相容 | 是 | 是 | 部分 |
| LM Studio | 原生相容 | 是 | 否 | 否 |
| Mistral AI | 原生相容 | 是 | 是 | 是 |
| Together AI | 原生相容 | 是 | 是 | 部分 |

## OpenAI 直連

```yaml title="openclaw-config.yaml"
providers:
  openai:
    enabled: true
    api_key: "${OPENAI_API_KEY}"
    organization: "${OPENAI_ORG_ID}"     # 選填
    base_url: "https://api.openai.com/v1"
    models:
      - name: gpt-4o
        display_name: "GPT-4o"
        default: true
        max_tokens: 16384
      - name: gpt-4o-mini
        display_name: "GPT-4o Mini"
        max_tokens: 16384
      - name: o3-mini
        display_name: "o3-mini (推理模型)"
        max_tokens: 65536
```

```python title="使用範例"
from openclaw import Client

client = Client(base_url="http://localhost:3000")

response = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[
        {"role": "user", "content": "用三句話解釋深度學習的核心概念。"}
    ],
    temperature=0.5
)

print(response.choices[0].message.content)
```

## Anthropic Claude

OpenClaw 自動將 OpenAI 格式轉換為 Anthropic Messages API 格式。

```yaml title="openclaw-config.yaml"
providers:
  anthropic:
    enabled: true
    api_key: "${ANTHROPIC_API_KEY}"
    base_url: "https://api.anthropic.com"
    models:
      - name: claude-sonnet-4-20250514
        display_name: "Claude Sonnet 4"
        default: true
        max_tokens: 8192
      - name: claude-opus-4-20250514
        display_name: "Claude Opus 4"
        max_tokens: 8192
```

:::info 格式轉換細節
Anthropic 的 API 格式與 OpenAI 有以下差異，OpenClaw 會自動處理：
- `system` 訊息從 `messages` 陣列中抽取，放入獨立的 `system` 參數
- `max_tokens` 為必填參數（OpenAI 為選填）
- 回應格式中 `stop_reason` 對應 `finish_reason`
:::

## Google Gemini

```yaml title="openclaw-config.yaml"
providers:
  google:
    enabled: true
    api_key: "${GOOGLE_API_KEY}"
    base_url: "https://generativelanguage.googleapis.com/v1beta"
    models:
      - name: gemini-2.0-flash
        display_name: "Gemini 2.0 Flash"
        default: true
      - name: gemini-2.5-pro
        display_name: "Gemini 2.5 Pro"
```

## Groq Cloud

Groq 提供極低延遲的推理服務，特別適合即時互動場景。

```yaml title="openclaw-config.yaml"
providers:
  groq:
    enabled: true
    api_key: "${GROQ_API_KEY}"
    base_url: "https://api.groq.com/openai/v1"
    models:
      - name: llama-3.3-70b-versatile
        display_name: "Llama 3.3 70B (Groq)"
        default: true
      - name: mixtral-8x7b-32768
        display_name: "Mixtral 8x7B"
```

:::tip Groq 的延遲優勢
Groq 使用自研的 LPU (Language Processing Unit) 晶片，推理速度可達傳統 GPU 的數十倍。適合需要極快回應的場景，例如即時翻譯或對話機器人。
:::

## OpenRouter

OpenRouter 作為模型聚合平台，提供數百種模型的統一存取介面。

```yaml title="openclaw-config.yaml"
providers:
  openrouter:
    enabled: true
    api_key: "${OPENROUTER_API_KEY}"
    base_url: "https://openrouter.ai/api/v1"
    default_headers:
      HTTP-Referer: "https://your-app.com"
      X-Title: "Your App Name"
    models:
      - name: anthropic/claude-sonnet-4
        display_name: "Claude Sonnet 4 (via OpenRouter)"
      - name: google/gemini-2.5-pro
        display_name: "Gemini 2.5 Pro (via OpenRouter)"
```

## LM Studio

LM Studio 提供本地模型的 OpenAI 相容端點，設定極為簡單。

```yaml title="openclaw-config.yaml"
providers:
  lmstudio:
    enabled: true
    api_key: "lm-studio"               # LM Studio 不驗證金鑰
    base_url: "http://localhost:1234/v1"
    models:
      - name: local-model
        display_name: "LM Studio 本地模型"
```

## Mistral AI

```yaml title="openclaw-config.yaml"
providers:
  mistral:
    enabled: true
    api_key: "${MISTRAL_API_KEY}"
    base_url: "https://api.mistral.ai/v1"
    models:
      - name: mistral-large-latest
        display_name: "Mistral Large"
        default: true
      - name: mistral-small-latest
        display_name: "Mistral Small"
```

## Together AI

```yaml title="openclaw-config.yaml"
providers:
  together:
    enabled: true
    api_key: "${TOGETHER_API_KEY}"
    base_url: "https://api.together.xyz/v1"
    models:
      - name: meta-llama/Llama-3.3-70B-Instruct-Turbo
        display_name: "Llama 3.3 70B Turbo"
      - name: Qwen/Qwen2.5-72B-Instruct-Turbo
        display_name: "Qwen 2.5 72B Turbo"
```

## 自訂 OpenAI 相容端點

任何提供 OpenAI 相容 API 的服務都可以直接接入。

```yaml title="openclaw-config.yaml"
providers:
  custom_provider:
    enabled: true
    api_key: "${CUSTOM_API_KEY}"
    base_url: "https://your-custom-endpoint.com/v1"
    models:
      - name: your-model-name
        display_name: "自訂模型"
```

## API 金鑰管理

### 環境變數設定

```bash title=".env"
# 主要提供者
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
GOOGLE_API_KEY=AIzaxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxx

# 備選提供者
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx
MISTRAL_API_KEY=xxxxxxxxxxxx
TOGETHER_API_KEY=xxxxxxxxxxxx
```

### 金鑰輪替

```yaml title="openclaw-config.yaml"
api_key_rotation:
  enabled: true
  providers:
    openai:
      keys:
        - "${OPENAI_API_KEY_1}"
        - "${OPENAI_API_KEY_2}"
        - "${OPENAI_API_KEY_3}"
      strategy: "round_robin"    # round_robin | random | failover
```

:::caution 安全提醒
- 絕對不要將 API 金鑰直接寫入設定檔或提交到版本控制
- 使用環境變數或密鑰管理服務（如 HashiCorp Vault）
- 定期輪替金鑰並監控使用量
:::

## 模型路由與備援

### 基本路由規則

```yaml title="openclaw-config.yaml"
routing:
  default_provider: "openai"
  rules:
    # 依據模型名稱路由
    - match:
        model: "claude-*"
      provider: "anthropic"

    # 依據用戶標籤路由
    - match:
        user_tag: "premium"
      provider: "openai"
      model: "gpt-4o"

    # 依據請求特徵路由
    - match:
        has_images: true
      provider: "openai"
      model: "gpt-4o"
```

### 自動備援

```yaml title="openclaw-config.yaml"
fallback:
  enabled: true
  chain:
    - provider: "openai"
      model: "gpt-4o"
    - provider: "anthropic"
      model: "claude-sonnet-4-20250514"
    - provider: "groq"
      model: "llama-3.3-70b-versatile"
  triggers:
    - error_code: 429          # 速率限制
    - error_code: 503          # 服務不可用
    - timeout: 30              # 超時（秒）
```

:::tip 備援策略建議
將最具成本效益的提供者放在備援鏈的前端，最可靠（但可能較貴）的提供者放在末端。這樣在正常情況下節省成本，異常時仍能保證服務可用。
:::

## 成本最佳化策略

### 模型成本對照表（每百萬 token 估算）

| 提供者/模型 | 輸入成本 | 輸出成本 | 適用場景 |
|-------------|---------|---------|---------|
| GPT-4o | $2.50 | $10.00 | 高品質通用任務 |
| GPT-4o Mini | $0.15 | $0.60 | 日常任務、大量處理 |
| Claude Sonnet 4 | $3.00 | $15.00 | 長文分析、程式碼 |
| Gemini 2.0 Flash | $0.10 | $0.40 | 快速處理、低成本 |
| Groq Llama 3.3 70B | $0.59 | $0.79 | 低延遲、中等品質 |
| Ollama (本地) | $0.00 | $0.00 | 無限使用、資安優先 |

### 成本控制設定

```yaml title="openclaw-config.yaml"
cost_control:
  # 每日預算上限（美元）
  daily_budget: 50.00

  # 每次請求最大 token 數
  max_tokens_per_request: 4096

  # 自動降級規則
  auto_downgrade:
    enabled: true
    threshold: 0.8              # 預算使用 80% 時觸發
    rules:
      - from: "gpt-4o"
        to: "gpt-4o-mini"
      - from: "claude-sonnet-4-20250514"
        to: "groq/llama-3.3-70b-versatile"

  # 快取設定（相同請求不重複計費）
  caching:
    enabled: true
    ttl: 3600                   # 快取存活時間（秒）
    max_size: "1GB"
```

## 速率限制設定

```yaml title="openclaw-config.yaml"
rate_limiting:
  global:
    requests_per_minute: 500
    tokens_per_minute: 200000

  per_provider:
    openai:
      requests_per_minute: 100
      tokens_per_minute: 80000
    anthropic:
      requests_per_minute: 50
      tokens_per_minute: 40000

  per_user:
    default:
      requests_per_minute: 20
      tokens_per_minute: 10000
    premium:
      requests_per_minute: 60
      tokens_per_minute: 50000
```

### 速率限制回應處理

```python title="rate_limit_handling.py"
from openclaw import Client, RateLimitError
import time

client = Client(base_url="http://localhost:3000")

def call_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="openai/gpt-4o",
                messages=messages
            )
        except RateLimitError as e:
            wait_time = e.retry_after or (2 ** attempt)
            print(f"速率限制，等待 {wait_time} 秒後重試...")
            time.sleep(wait_time)
    raise Exception("已達最大重試次數")
```

## 監控與觀測

```yaml title="openclaw-config.yaml"
monitoring:
  metrics:
    enabled: true
    export: "prometheus"         # prometheus | datadog | custom
    port: 9090
  logging:
    level: "info"
    format: "json"
    include_tokens: true         # 記錄 token 使用量
    include_latency: true        # 記錄回應延遲
```

### 關鍵指標

| 指標名稱 | 說明 | 告警閾值建議 |
|----------|------|-------------|
| `openclaw_request_duration_seconds` | 請求延遲 | P95 > 10s |
| `openclaw_tokens_total` | token 使用量 | 日用量 > 預算 80% |
| `openclaw_errors_total` | 錯誤計數 | 5 分鐘內 > 50 |
| `openclaw_provider_health` | 提供者健康狀態 | 任何提供者 = 0 |
| `openclaw_fallback_triggered_total` | 備援觸發次數 | 1 小時內 > 20 |

## 下一步

- [Ollama 整合指南](./ollama.md)：搭配本地模型使用
- [MCP 連接器](./mcp-connectors.md)：為所有模型添加外部工具能力
