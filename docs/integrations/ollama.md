---
title: Ollama 整合指南
description: OpenClaw 與 Ollama 的深度整合——本地 LLM 部署、多實例負載均衡與效能調校
sidebar_position: 1
keywords: [OpenClaw, Ollama, 本地 LLM, GPU, 模型管理]
---

# Ollama 整合指南

OpenClaw 原生支援 [Ollama](https://ollama.com/)，讓您在本地環境中部署並管理大型語言模型。本指南涵蓋從基礎安裝到進階多實例負載均衡的所有細節。

## 為什麼選擇 Ollama？

- **完全離線運作**：資料不離開您的伺服器，符合最嚴格的資安要求
- **零 API 費用**：一次部署、無限使用
- **低延遲**：消除網路往返，回應速度可達毫秒等級
- **模型自由**：支援數百種開源模型，隨時切換

## 先決條件

| 項目 | 最低需求 | 建議配置 |
|------|---------|---------|
| 作業系統 | Linux / macOS / Windows (WSL2) | Ubuntu 22.04 LTS |
| 記憶體 | 8 GB | 32 GB 以上 |
| GPU | 無（純 CPU 可用） | NVIDIA RTX 3090 / Apple M2 Pro 以上 |
| 磁碟空間 | 10 GB | 100 GB SSD |
| Ollama 版本 | v0.3.0+ | 最新穩定版 |

## 快速開始

### 1. 安裝 Ollama

```bash
# Linux / macOS
curl -fsSL https://ollama.com/install.sh | sh

# 驗證安裝
ollama --version
```

### 2. 拉取模型

```bash
# 拉取 Llama 3.3（推薦入門模型）
ollama pull llama3.3

# 拉取 Qwen 2.5（中文表現優異）
ollama pull qwen2.5:14b

# 拉取 DeepSeek Coder（程式碼生成）
ollama pull deepseek-coder-v2:16b
```

### 3. 在 OpenClaw 中設定連線

```yaml title="openclaw-config.yaml"
providers:
  ollama:
    enabled: true
    base_url: "http://localhost:11434"
    timeout: 120
    models:
      - name: llama3.3
        display_name: "Llama 3.3 (8B)"
        default: true
      - name: qwen2.5:14b
        display_name: "Qwen 2.5 (14B)"
      - name: deepseek-coder-v2:16b
        display_name: "DeepSeek Coder V2"
```

## 支援的端點

OpenClaw 同時支援 Ollama 的 **Generate** 與 **Chat** 端點。

### Generate 端點

```bash
# 直接呼叫 Generate API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.3",
  "prompt": "解釋量子計算的基本原理",
  "stream": false
}'
```

### Chat 端點

```bash
# 使用 Chat API（帶有對話歷史）
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.3",
  "messages": [
    {"role": "system", "content": "你是一位友善的中文助手。"},
    {"role": "user", "content": "什麼是機器學習？"}
  ],
  "stream": false
}'
```

:::tip 端點選擇建議
- **Generate**：適用於單次文字補全、摘要生成等無需對話脈絡的場景
- **Chat**：適用於多輪對話、聊天機器人、需要 system prompt 的場景
:::

## 雙向格式轉換（OpenAI <-> Ollama）

OpenClaw 內建格式轉換層，讓您以 OpenAI 相容格式呼叫 Ollama 模型。

```python title="format_conversion_example.py"
from openclaw import Client

client = Client(base_url="http://localhost:3000")

# 使用 OpenAI 格式呼叫 Ollama 模型
response = client.chat.completions.create(
    model="ollama/llama3.3",          # 前綴 "ollama/" 觸發路由
    messages=[
        {"role": "system", "content": "你是資深的軟體工程師。"},
        {"role": "user", "content": "請用 Python 寫一個快速排序。"}
    ],
    temperature=0.7,
    max_tokens=1024
)

print(response.choices[0].message.content)
```

### 格式對照表

| OpenAI 參數 | Ollama 對應參數 | 說明 |
|-------------|----------------|------|
| `model` | `model` | 移除 `ollama/` 前綴後直接傳遞 |
| `messages` | `messages` | 格式完全相容 |
| `temperature` | `options.temperature` | 範圍 0.0 - 2.0 |
| `max_tokens` | `options.num_predict` | 最大生成 token 數 |
| `top_p` | `options.top_p` | 核取樣機率 |
| `frequency_penalty` | `options.repeat_penalty` | 數值範圍不同，自動轉換 |
| `stop` | `options.stop` | 停止序列 |
| `stream` | `stream` | 串流模式 |

## 多實例負載均衡

在生產環境中，您可以部署多個 Ollama 實例並由 OpenClaw 自動分配流量。

```yaml title="openclaw-config.yaml"
providers:
  ollama:
    enabled: true
    load_balancing:
      strategy: "weighted_round_robin"  # round_robin | weighted_round_robin | least_connections
      health_check_interval: 30         # 秒
      health_check_timeout: 5
      max_retries: 3
    instances:
      - url: "http://gpu-node-1:11434"
        weight: 3
        tags: ["gpu", "primary"]
      - url: "http://gpu-node-2:11434"
        weight: 2
        tags: ["gpu", "secondary"]
      - url: "http://cpu-node-1:11434"
        weight: 1
        tags: ["cpu", "fallback"]
```

### 負載均衡策略

| 策略 | 說明 | 適用場景 |
|------|------|---------|
| `round_robin` | 依序輪流分配 | 所有節點效能相同 |
| `weighted_round_robin` | 按權重比例分配 | 節點效能不一致 |
| `least_connections` | 分配給當前連線數最少的節點 | 請求處理時間差異大 |

:::caution 注意事項
每個 Ollama 實例必須預先載入相同的模型。使用 `ollama pull` 在所有節點上同步模型。
:::

## 模型管理

### 列出已安裝模型

```bash
# 透過 CLI
ollama list

# 透過 OpenClaw API
curl http://localhost:3000/api/v1/providers/ollama/models
```

### 拉取新模型

```bash
# 拉取特定大小的模型
ollama pull llama3.3:70b

# 拉取量化版本（節省記憶體）
ollama pull mistral:7b-instruct-q4_K_M
```

### 移除模型

```bash
ollama rm llama3.3:70b
```

### 熱門模型推薦

| 模型 | 參數量 | VRAM 需求 | 推薦用途 |
|------|--------|----------|---------|
| Llama 3.3 | 8B | 6 GB | 通用對話、文字生成 |
| Llama 3.3 70B | 70B | 40 GB | 高品質推理、複雜任務 |
| Qwen 2.5 14B | 14B | 10 GB | 中文對話、翻譯 |
| DeepSeek Coder V2 | 16B | 12 GB | 程式碼生成、Debug |
| Mistral 7B | 7B | 5 GB | 快速回應、輕量任務 |
| Gemma 2 | 9B | 7 GB | 多語言、指令跟隨 |

## GPU 加速

### NVIDIA CUDA

```bash
# 確認 CUDA 驅動程式
nvidia-smi

# 設定環境變數（多 GPU 選擇）
export CUDA_VISIBLE_DEVICES=0,1

# 啟動 Ollama（自動偵測 GPU）
ollama serve
```

### Apple Metal (macOS)

```bash
# Apple Silicon 自動啟用 Metal 加速，無需額外設定
# 確認 GPU 使用狀態
sudo powermetrics --samplers gpu_power -i 1000 -n 1
```

:::info GPU 記憶體管理
Ollama 會根據模型大小自動分配 GPU 記憶體。若記憶體不足，會自動降級至 CPU + GPU 混合推理模式。您可以透過 `OLLAMA_MAX_LOADED_MODELS` 環境變數限制同時載入的模型數量。
:::

## 效能調校

### 核心參數

```yaml title="openclaw-config.yaml"
providers:
  ollama:
    performance:
      # 上下文視窗大小（token 數）
      num_ctx: 8192

      # 批次處理大小（影響吞吐量）
      num_batch: 512

      # 同時處理的並行請求數
      num_parallel: 4

      # 模型在記憶體中的保持時間
      keep_alive: "30m"

      # 執行緒數（0 = 自動偵測）
      num_thread: 0

      # GPU 層數（-1 = 全部使用 GPU）
      num_gpu: -1
```

### 參數調校指南

| 參數 | 預設值 | 調校建議 |
|------|--------|---------|
| `num_ctx` | 2048 | 長文對話設為 8192+；注意 VRAM 消耗隨之增加 |
| `num_batch` | 512 | GPU 記憶體充足時可增至 1024，提升吞吐量 |
| `num_parallel` | 1 | 多用戶場景設為 4-8；每個平行請求需額外記憶體 |
| `keep_alive` | 5m | 頻繁使用設為 30m+；閒置時設為 1m 釋放資源 |
| `num_thread` | 自動 | CPU 推理時可手動設為物理核心數 |
| `num_gpu` | 自動 | 設為 0 強制 CPU；設為 -1 使用全部 GPU 層 |

### 效能基準測試

```bash
# 使用 OpenClaw 內建基準測試工具
openclaw benchmark --provider ollama \
  --model llama3.3 \
  --concurrency 4 \
  --requests 100 \
  --prompt-tokens 256 \
  --max-tokens 512
```

預期輸出範例：

```
╔═══════════════════════════════════════════════════╗
║           OpenClaw Benchmark Results              ║
╠═══════════════════════════════════════════════════╣
║ Model:           llama3.3                         ║
║ Total Requests:  100                              ║
║ Concurrency:     4                                ║
║ Avg Latency:     1.23s                            ║
║ P95 Latency:     2.01s                            ║
║ Throughput:      45.2 tokens/sec                  ║
║ Errors:          0                                ║
╚═══════════════════════════════════════════════════╝
```

## 環境變數設定

```bash title=".env"
# Ollama 伺服器位址
OLLAMA_HOST=0.0.0.0:11434

# 模型存放路徑
OLLAMA_MODELS=/data/ollama/models

# 同時載入的最大模型數
OLLAMA_MAX_LOADED_MODELS=3

# 記錄層級
OLLAMA_DEBUG=false

# GPU 記憶體上限（百分比）
OLLAMA_GPU_OVERHEAD=0.1
```

## 疑難排解

### 常見問題

:::warning 連線失敗
**症狀**：OpenClaw 無法連線到 Ollama

**解決步驟**：
1. 確認 Ollama 正在執行：`systemctl status ollama` 或 `ollama serve`
2. 檢查防火牆設定：`curl http://localhost:11434/api/tags`
3. 若為遠端連線，確認 `OLLAMA_HOST` 設定為 `0.0.0.0:11434`（而非 `127.0.0.1`）
:::

:::warning 模型載入失敗
**症狀**：`error loading model: out of memory`

**解決步驟**：
1. 檢查可用記憶體：`nvidia-smi`（GPU）或 `free -h`（CPU）
2. 嘗試使用量化版本：`ollama pull llama3.3:q4_K_M`
3. 減少 `num_ctx` 大小
4. 設定 `OLLAMA_MAX_LOADED_MODELS=1` 避免多模型競爭資源
:::

:::warning 回應速度過慢
**症狀**：生成速度低於 10 tokens/sec

**解決步驟**：
1. 確認模型正在使用 GPU：觀察 `nvidia-smi` 的 GPU 使用率
2. 減少 `num_ctx` 以降低記憶體壓力
3. 增加 `num_batch` 提升批次效率
4. 考慮使用較小的模型或更高壓縮率的量化版本
:::

### 記錄檔位置

```bash
# Linux
journalctl -u ollama -f

# macOS
cat ~/.ollama/logs/server.log

# Docker
docker logs ollama -f
```

## 進階：Docker Compose 部署

```yaml title="docker-compose.yml"
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    restart: unless-stopped

  openclaw:
    image: openclaw/openclaw:latest
    ports:
      - "3000:3000"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on:
      - ollama
    restart: unless-stopped

volumes:
  ollama_data:
```

```bash
# 啟動服務
docker compose up -d

# 拉取模型（在容器內執行）
docker exec ollama ollama pull llama3.3
```

## 下一步

- [OpenAI 相容 API 整合](./openai-compatible.md)：將 Ollama 與雲端模型混合使用
- [MCP 連接器](./mcp-connectors.md)：為 Ollama 模型添加外部工具能力
