---
title: 效能優化指南
description: OpenClaw 效能調校完整指南——從資料庫優化到 GPU 加速，打造極速 AI 體驗
sidebar_position: 9
keywords: [OpenClaw, 效能, 優化, GPU, 快取, 資料庫]
---

# 效能優化指南

OpenClaw 在 v3.2.0 中引入了多項效能改進，包括批次資料庫查詢、KV 快取和 GPU 加速。本指南幫你榨取系統的每一分效能。

---

## 效能基準

| 指標 | 優化前 | 優化後 | 改善幅度 |
|------|--------|--------|---------|
| 筆記載入 | 20-30 秒 | 2-3 秒 | **10x** |
| 請求處理 | 標準 | 2-3x 更快 | **2-3x** |
| RAG 後續回應 | 2-3 秒 | ~200ms | **10-15x** |
| 首次回應時間（本地 LLM） | 4-5 秒 | 3 秒 | **25%** |

---

## 資料庫優化

### 批次查詢

v3.2.0 引入了批次查詢優化，大幅減少資料庫負載：

```toml
[database]
# 批次查詢設定
batch_size = 100              # 每次批次查詢的筆數
connection_pool_size = 10     # 連線池大小
query_timeout = 30            # 查詢逾時（秒）

# SQLite 效能設定
journal_mode = "wal"          # Write-Ahead Logging
synchronous = "normal"        # 降低 fsync 頻率
cache_size = -64000           # 64MB 快取（負值代表 KB）
```

### 分頁 API

檔案列表 API 現在支援分頁，避免大量資料一次載入：

```bash
# 分頁查詢範例
curl "http://127.0.0.1:18789/api/files?page=1&limit=50"

# 回應包含總數
# { "data": [...], "total": 1234, "page": 1, "limit": 50 }
```

---

## LLM 推理加速

### 本地模型（Ollama）

```toml
[reasoning.ollama]
# 多實例負載均衡
urls = [
    "http://localhost:11434",
    "http://gpu-server:11434"
]
load_balance = "random"       # random 或 round-robin

# 模型效能設定
num_ctx = 8192                # 上下文窗口大小
num_batch = 512               # 批次大小
num_gpu = -1                  # GPU 層數（-1 = 全部）
num_thread = 8                # CPU 線程數
```

### GPU 加速（Nvidia）

```toml
[execution.gpu]
enabled = true
runtime = "nvidia"
cuda_version = "12.4"

# GPU 記憶體管理
gpu_memory_utilization = 0.85  # 使用 85% GPU 記憶體
max_model_len = 32768          # 最大序列長度

# 多 GPU 設定
devices = [0, 1]               # 使用 GPU 0 和 1
tensor_parallel_size = 2       # 張量並行
```

### Apple Silicon (Metal)

```toml
[execution.gpu]
enabled = true
runtime = "metal"

# Metal Performance Shaders
use_mps = true
mps_memory_fraction = 0.75
```

---

## RAG 效能優化

### KV 前綴快取

這是 v3.2.0 最重要的效能改進之一。透過將 RAG 上下文放在系統訊息中，可以利用 KV 前綴快取實現幾乎即時的後續回應：

```toml
[rag]
# 上下文注入位置（關鍵設定）
context_position = "system_message"  # 啟用 KV 快取
# 而非 "user_message"（無法利用快取）

# 快取設定
cache_enabled = true
cache_ttl = 3600               # 快取存活時間（秒）
cache_max_entries = 1000       # 最大快取條目數
```

:::tip 為什麼 KV 快取這麼快？
當 RAG 上下文放在系統訊息中時，LLM 可以快取這段內容的 Key-Value 對。後續的問題只需要處理新的使用者訊息部分，大幅減少推理時間。
:::

### 向量搜尋優化

```toml
[rag.vector]
# 索引設定
index_type = "hnsw"           # 階層式可導航小世界圖
ef_construction = 200          # 建構時的精確度
ef_search = 100                # 搜尋時的精確度
m = 16                         # 最大連結數

# 搜尋設定
top_k = 5                     # 返回最相關的 5 個結果
score_threshold = 0.7          # 最低相關性門檻
```

---

## 記憶系統優化

```toml
[memory]
# WAL 優化
wal_batch_write = true         # 批次寫入 WAL
wal_sync_interval = 1000       # 每 1 秒同步一次（ms）

# 壓縮優化
compaction_interval = 1800     # 每 30 分鐘壓縮
compaction_threshold = 100     # 超過 100 條記憶才觸發壓縮
compaction_workers = 2         # 壓縮工作線程數

# 上下文窗口
max_context_tokens = 8192      # 注入 LLM 的最大 token 數
context_relevance_threshold = 0.6  # 記憶相關性門檻
```

---

## 網路與 Web 優化

### Web Fetch 設定

```toml
[web]
# 內容抓取限制
fetch_max_content_length = 100000  # 100KB（可調整）
# 舊版硬編碼為 50KB，現可透過環境變數設定

# 並行設定
max_concurrent_fetches = 5
fetch_timeout = 30
```

### 反向代理快取

```nginx
# Nginx 快取設定
proxy_cache_path /var/cache/openclaw levels=1:2
    keys_zone=openclaw:10m max_size=1g inactive=60m;

location /api/ {
    proxy_pass http://127.0.0.1:18789;
    proxy_cache openclaw;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout;
}
```

---

## 監控與診斷

### 內建健康檢查

```bash
# 完整健康檢查
openclaw doctor --verbose

# 效能報告
openclaw perf report

# 即時指標
openclaw status --metrics

# 記憶體使用量
openclaw status memory --detail
```

### 關鍵指標

| 指標 | 健康閾值 | 警告閾值 |
|------|---------|---------|
| Gateway 回應時間 | < 100ms | > 500ms |
| LLM 首 token 時間 | < 2s | > 5s |
| RAG 搜尋時間 | < 500ms | > 2s |
| 記憶體使用量 | < 2GB | > 4GB |
| WAL 待寫入條目 | < 50 | > 200 |

---

## 練習題

1. **基準測試**：使用 `openclaw perf report` 取得當前效能基準，然後調整 `num_ctx` 和 `num_batch` 觀察對本地模型推理速度的影響。

2. **RAG 快取**：設定 KV 前綴快取，測量開啟和關閉時的 RAG 回應延遲差異。

3. **GPU 加速**：如果你有 Nvidia GPU，設定 CUDA 加速並比較 CPU vs GPU 的推理速度。

---

## 隨堂測驗

1. **KV 前綴快取需要將 RAG 上下文放在哪裡？**
   - A) user_message
   - B) system_message
   - C) assistant_message
   - D) 無所謂

2. **批次資料庫查詢帶來了多少倍的筆記載入改善？**
   - A) 2x
   - B) 5x
   - C) 10x
   - D) 20x

<details>
<summary>查看答案</summary>

1. **B** — 只有放在 system_message 中的上下文才能被 KV 前綴快取重用。
2. **C** — 批次查詢將筆記載入從 20-30 秒降至 2-3 秒，約 10 倍改善。

</details>
