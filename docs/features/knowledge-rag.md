---
title: Knowledge Base 與 RAG 系統
description: 掌握 OpenClaw 的知識庫管理與檢索增強生成（RAG）系統——從基礎設定到企業級部署
sidebar_position: 2
keywords: [OpenClaw, Knowledge Base, RAG, 知識庫, 向量搜尋, 語意搜尋]
---

# Knowledge Base 與 RAG 系統

## 學習目標

完成本篇後，你將能夠：

- 建立並管理 OpenClaw 的知識庫（Knowledge Base）
- 理解 Agentic RAG 如何讓模型自主決定搜尋時機與策略
- 配置 Hybrid Search（混合搜尋）並調校 Re-ranker
- 運用 RAG Context Injection 最佳化 KV Prefix Caching
- 根據文件類型選擇最佳的 Chunking 策略
- 使用 Markdown Header Splitter 處理結構化文件
- 設定 Multi-source RAG 整合多個知識來源
- 上傳與管理 PDF 文件，並啟用引文標註
- 配置向量資料庫並進行效能調校
- 部署企業級知識庫系統

:::info 前置條件
請先完成 [架構概覽](/docs/architecture/overview)，理解 Memory System 與 Reasoning Layer 的互動方式。Knowledge Base 是 Memory System 的延伸模組。
:::

---

## Knowledge Base 系統架構

Knowledge Base 建構在 OpenClaw Memory System 之上，提供結構化的文件儲存、向量索引與語意檢索能力。它讓 Agent 不僅能記住對話，更能存取你的專屬知識文件。

```
                     使用者查詢
                         │
              ┌──────────▼──────────┐
              │   Reasoning Layer   │
              │   (Agentic RAG)     │
              │                     │
              │  模型自主判斷：       │
              │  1. 是否需要搜尋？   │
              │  2. 搜尋哪個知識庫？ │
              │  3. 如何組合關鍵字？ │
              └──────────┬──────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ Knowledge  │ │ Knowledge  │ │ Knowledge  │
   │ Base A     │ │ Base B     │ │ Base C     │
   │ (公司文件) │ │ (技術文件) │ │ (FAQ)      │
   └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
         │              │              │
         └──────────────┼──────────────┘
                        ▼
              ┌───────────────────┐
              │   Hybrid Search   │
              │                   │
              │  Dense  + Sparse  │
              │  向量搜尋  全文搜尋│
              └────────┬──────────┘
                       ▼
              ┌───────────────────┐
              │    Re-ranker      │
              │  交叉編碼器重排序  │
              └────────┬──────────┘
                       ▼
              ┌───────────────────┐
              │  Context Injection│
              │  注入 System Msg  │
              └───────────────────┘
```

---

## 基礎設定：建立你的第一個知識庫

### 建立知識庫

```bash
# 建立一個新的知識庫
openclaw kb create \
  --name "company-docs" \
  --description "公司內部文件與政策" \
  --embedding-model "text-embedding-3-large" \
  --chunk-strategy "auto"

# 輸出：
# Knowledge Base created successfully!
# ─────────────────────────────────
# Name:            company-docs
# ID:              kb-a1b2c3d4
# Embedding Model: text-embedding-3-large
# Chunk Strategy:  auto
# Vector DB:       built-in (SQLite-VSS)
# Status:          active
```

### 知識庫設定檔

```toml
# ~/.openclaw/knowledge/company-docs/config.toml

[knowledge_base]
name = "company-docs"
id = "kb-a1b2c3d4"
description = "公司內部文件與政策"
enabled = true

[embedding]
model = "text-embedding-3-large"
dimensions = 3072
provider = "openai"
batch_size = 100

[chunking]
strategy = "auto"                     # auto / fixed / semantic / markdown
default_chunk_size = 512              # 預設 chunk 大小（tokens）
default_chunk_overlap = 50            # chunk 重疊（tokens）

[search]
type = "hybrid"                       # dense / sparse / hybrid
dense_weight = 0.7                    # Dense search 權重
sparse_weight = 0.3                   # Sparse search 權重
top_k = 10                            # 初始檢索數量
rerank_top_k = 5                      # Re-rank 後保留數量
reranker_model = "cross-encoder"      # Re-ranker 模型

[storage]
vector_db = "sqlite-vss"              # sqlite-vss / pgvector / qdrant / weaviate
path = "~/.openclaw/knowledge/company-docs/vectors.db"
```

### 目錄結構

```
~/.openclaw/knowledge/
├── company-docs/
│   ├── config.toml           # 知識庫設定
│   ├── vectors.db            # 向量資料庫
│   ├── documents/            # 原始文件
│   │   ├── employee-handbook.pdf
│   │   ├── tech-stack.md
│   │   └── onboarding-guide.md
│   ├── chunks/               # 切割後的文件片段
│   │   └── index.json
│   └── metadata.json         # 文件元資料
├── tech-wiki/
│   └── ...
└── registry.json             # 知識庫註冊表
```

---

## Agentic RAG：模型自主檢索

傳統 RAG 在每次查詢時都會觸發搜尋，造成不必要的延遲與成本。OpenClaw 的 **Agentic RAG** 讓模型自主決定**何時搜尋**、**搜尋什麼**，以及在結果不佳時**自動重試**。

### 運作機制

```
使用者: "公司的年假政策是什麼？"

Reasoning Layer 思考過程：
┌─────────────────────────────────────────────┐
│ Step 1: 判斷是否需要搜尋                     │
│   → "年假政策" 是公司特定資訊                │
│   → 我的訓練資料中沒有這項知識               │
│   → 決定：需要搜尋知識庫 ✓                   │
│                                             │
│ Step 2: 選擇知識庫                           │
│   → company-docs: 描述匹配 "公司內部文件"   │
│   → tech-wiki: 不相關                       │
│   → 決定：搜尋 company-docs ✓               │
│                                             │
│ Step 3: 組合搜尋查詢                         │
│   → 原始查詢: "年假政策"                     │
│   → 擴展查詢: "年假 特休 休假 政策 天數"     │
│                                             │
│ Step 4: 評估搜尋結果                         │
│   → 結果 1: 相關性 0.92 ✓                   │
│   → 結果 2: 相關性 0.85 ✓                   │
│   → 結果 3: 相關性 0.41 ✗ (低於門檻)        │
│   → 決定：使用前 2 筆結果生成回應            │
│                                             │
│ Step 5 (如果結果不佳): 智慧重試              │
│   → 改寫查詢: "員工休假規定 特休假計算"     │
│   → 重新搜尋 → 獲得更好的結果               │
└─────────────────────────────────────────────┘
```

### Agentic RAG 設定

```toml
# ~/.openclaw/config.toml

[rag.agentic]
enabled = true
auto_search_threshold = 0.6        # 模型信心低於此值時自動觸發搜尋
max_retries = 2                    # 搜尋結果不佳時的最大重試次數
retry_query_rewrite = true         # 重試時自動改寫查詢
min_relevance_score = 0.5          # 搜尋結果的最低相關性門檻
fallback_to_general = true         # 知識庫無結果時回退到一般回答
```

:::tip Agentic RAG 的優勢
相比傳統「每次都搜尋」的 RAG，Agentic RAG 平均減少 **40-60%** 的不必要搜尋呼叫，同時因為智慧重試機制，答案品質反而提升了 **15-25%**。
:::

---

## Hybrid Search：混合搜尋

OpenClaw 結合 **Dense Search（向量搜尋）** 與 **Sparse Search（稀疏搜尋 / BM25）**，取兩者之長：

```
查詢: "OpenClaw 如何處理 WebSocket 斷線重連？"

Dense Search (語意搜尋)                Sparse Search (BM25 全文搜尋)
┌─────────────────────────┐           ┌─────────────────────────┐
│ 將查詢轉為向量           │           │ 關鍵字匹配               │
│ [0.12, -0.34, 0.78...]  │           │ "WebSocket" "斷線" "重連"│
│                         │           │                         │
│ 優勢：                   │           │ 優勢：                   │
│ - 理解語意相似度         │           │ - 精確匹配專有名詞       │
│ - 能找到同義詞表達       │           │ - 不受 embedding 品質影響│
│ - 跨語言搜尋             │           │ - 對罕見詞彙效果好       │
│                         │           │                         │
│ 結果:                    │           │ 結果:                    │
│ 1. Gateway 連線管理 0.89 │           │ 1. WebSocket 協定設定 0.95│
│ 2. 通訊協定概覽     0.82 │           │ 2. 斷線處理邏輯     0.88│
│ 3. 事件重試機制     0.76 │           │ 3. Channel Adapter   0.72│
└────────────┬────────────┘           └────────────┬────────────┘
             │                                     │
             └──────────────┬──────────────────────┘
                            ▼
                  ┌───────────────────┐
                  │  Reciprocal Rank  │
                  │  Fusion (RRF)     │
                  │                   │
                  │  score = sum(     │
                  │    1/(k + rank_i) │
                  │  )                │
                  │  k = 60 (常數)    │
                  └────────┬──────────┘
                           ▼
                  ┌───────────────────┐
                  │  Cross-Encoder    │
                  │  Re-ranker        │
                  │                   │
                  │  逐對比較查詢與    │
                  │  每個候選結果的     │
                  │  真實相關性        │
                  └────────┬──────────┘
                           ▼
                  最終排序結果 (top-5)
```

### 搜尋權重調校

```toml
# ~/.openclaw/knowledge/company-docs/config.toml

[search]
type = "hybrid"

# 權重調整——根據知識庫特性調整
# 技術文件（專有名詞多）：提高 sparse 權重
# 一般文件（自然語言多）：提高 dense 權重
dense_weight = 0.7
sparse_weight = 0.3

# Re-ranker 設定
reranker_enabled = true
reranker_model = "cross-encoder"       # cross-encoder / cohere-rerank / bge-reranker
reranker_top_k = 5                     # Re-rank 後保留的文件數
reranker_score_threshold = 0.3         # 低於此分數的結果將被丟棄

# BM25 參數（稀疏搜尋微調）
[search.sparse]
k1 = 1.2                              # 詞頻飽和參數
b = 0.75                               # 文件長度正規化參數
language = "zh-tw"                     # 分詞器語言
custom_stopwords = ["的", "是", "在", "了", "和"]
```

:::warning Hybrid Search 權重建議
不同類型的知識庫適合不同的權重配置：

| 知識庫類型 | Dense 權重 | Sparse 權重 | 原因 |
|-----------|-----------|------------|------|
| 一般文件 / FAQ | 0.7 | 0.3 | 語意理解更重要 |
| API 文件 / 程式碼 | 0.4 | 0.6 | 精確匹配函式名稱更重要 |
| 法律 / 政策文件 | 0.5 | 0.5 | 兩者同等重要 |
| 多語言知識庫 | 0.8 | 0.2 | 向量搜尋擅長跨語言 |
:::

---

## RAG Context Injection：KV Prefix Caching 最佳化

OpenClaw 將 RAG 檢索到的上下文注入到 **System Message 的固定位置**，這個設計不是隨意的——它讓 LLM 能利用 **KV Prefix Caching** 大幅降低重複推理的成本。

### 注入位置策略

```
┌─────────────────────────────────────────┐
│              System Message              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  SOUL.md（人格與規則）           │    │  ← 固定前綴
│  │  - 每次呼叫都一樣               │    │     可被 KV Cache
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  RAG Context（知識庫檢索結果）   │    │  ← 半固定區域
│  │  - 相同查詢 = 相同內容          │    │     高命中率
│  │  - 放在 SOUL.md 之後            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Memory Context（記憶片段）      │    │  ← 動態區域
│  │  - 每次對話可能不同              │    │     低命中率
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘

KV Prefix Cache 命中分析：
─────────────────────────────────────────
SOUL.md 部分    ████████████████  99% 命中
RAG Context     ██████████░░░░░░  65% 命中
Memory Context  ████░░░░░░░░░░░░  25% 命中
對話歷史        ██░░░░░░░░░░░░░░  10% 命中
─────────────────────────────────────────
```

### Context Injection 設定

```toml
# ~/.openclaw/config.toml

[rag.context_injection]
position = "after_system"              # after_system / before_history / inline
max_tokens = 3072                      # RAG 上下文最大 Token 數
format = "structured"                  # structured / plain / xml_tags

# 結構化格式模板
template = """
<knowledge_context>
以下是從知識庫中檢索到的相關資訊，請根據這些資訊回答使用者的問題。
如果資訊不足以完整回答，請明確說明。

{retrieved_chunks}
</knowledge_context>
"""

# KV Cache 最佳化
[rag.context_injection.cache]
enabled = true
sort_chunks_by = "document_id"         # 穩定排序以提高 cache 命中率
deduplicate = true                     # 去除重複 chunk
normalize_whitespace = true            # 正規化空白以提高 cache 命中率
```

:::tip KV Prefix Caching 效益
將 RAG 上下文放在 System Message 中（SOUL.md 之後），相比放在使用者訊息中，KV Cache 命中率提升約 **40-65%**。對於高頻查詢場景，這可以節省 **30-50%** 的 LLM API 成本。
:::

---

## Chunking 策略：最佳化文件切割

文件切割的品質直接決定 RAG 的效果。OpenClaw 提供多種 Chunking 策略，針對不同內容類型進行最佳化。

### 策略選擇指南

```
文件類型判斷流程：

                    文件進入
                       │
               ┌───────▼───────┐
               │ 是 Markdown   │
               │ 或有標題結構？│
               └───┬───────┬───┘
                 是│       │否
                   ▼       ▼
         ┌─────────────┐  ┌──────────────┐
         │  Markdown   │  │ 內容是事實性 │
         │  Header     │  │ 還是論述性？ │
         │  Splitter   │  └──┬───────┬───┘
         └─────────────┘   事實│     │論述
                             ▼       ▼
                    ┌──────────┐ ┌──────────┐
                    │ Small    │ │ Large    │
                    │ Chunks   │ │ Chunks   │
                    │ 200-300  │ │ 800-1000 │
                    │ tokens   │ │ tokens   │
                    └──────────┘ └──────────┘
```

### Small Chunks（200-300 tokens）——適合事實性內容

```toml
# 適用場景：FAQ、產品規格、政策條款、API 參數說明

[chunking]
strategy = "fixed"
chunk_size = 250                       # 200-300 tokens
chunk_overlap = 30                     # 少量重疊確保不截斷語句
```

**為什麼選擇小 Chunk？**

- 事實性內容（如「年假天數是 14 天」）資訊密度高
- 小 Chunk 讓向量更精確地代表單一事實
- 減少不相關內容混入搜尋結果的機率
- 節省注入 Context Window 的 Token 額度

### Large Chunks（800-1000 tokens）——適合複雜論述

```toml
# 適用場景：技術教學、架構說明、流程文件、分析報告

[chunking]
strategy = "fixed"
chunk_size = 900                       # 800-1000 tokens
chunk_overlap = 100                    # 較多重疊保持上下文連貫
```

**為什麼選擇大 Chunk？**

- 複雜論述需要完整的推理鏈才能理解
- 程式碼範例若被截斷就失去意義
- 「因為 A 所以 B」的因果關係不能拆開
- 大 Chunk 保留了足夠的上下文供模型推理

### Semantic Chunking——智慧語意切割

```toml
# 根據語意邊界自動切割，而非固定長度

[chunking]
strategy = "semantic"
min_chunk_size = 100                   # 最小 Chunk 大小
max_chunk_size = 1000                  # 最大 Chunk 大小
similarity_threshold = 0.75            # 語意相似度門檻（低於此值則切割）
embedding_model = "text-embedding-3-large"
```

---

## Markdown Header Splitter：結構化文件處理

當你的知識庫文件是 Markdown 格式時，**Markdown Header Splitter** 能根據標題層級智慧切割，保留文件結構。

### 運作範例

```markdown
# 原始文件：employee-handbook.md

# 員工手冊

## 第一章：休假規定

### 1.1 年假
新進員工第一年享有 7 天年假。
工作滿一年後，每年增加 1 天，上限 30 天。

### 1.2 病假
每年享有 30 天帶薪病假。
連續請假超過 3 天需附醫師證明。

## 第二章：薪資福利

### 2.1 薪資結構
薪資由基本薪資 + 績效獎金 + 津貼組成...
```

切割結果：

```
Chunk 1:
  metadata: { source: "employee-handbook.md", headers: ["員工手冊", "第一章：休假規定", "1.1 年假"] }
  content: "新進員工第一年享有 7 天年假。工作滿一年後，每年增加 1 天，上限 30 天。"

Chunk 2:
  metadata: { source: "employee-handbook.md", headers: ["員工手冊", "第一章：休假規定", "1.2 病假"] }
  content: "每年享有 30 天帶薪病假。連續請假超過 3 天需附醫師證明。"

Chunk 3:
  metadata: { source: "employee-handbook.md", headers: ["員工手冊", "第二章：薪資福利", "2.1 薪資結構"] }
  content: "薪資由基本薪資 + 績效獎金 + 津貼組成..."
```

### Markdown Header Splitter 設定

```toml
[chunking]
strategy = "markdown"

[chunking.markdown]
split_level = 3                        # 切割到第幾層標題（h1=1, h2=2, h3=3）
include_header_chain = true            # 每個 Chunk 包含完整的標題鏈
min_chunk_size = 50                    # 太短的段落合併到上一個 Chunk
max_chunk_size = 1500                  # 超過此大小的段落進一步切割
code_block_as_unit = true              # 程式碼區塊視為不可分割單位
```

:::info Markdown Header Splitter 的優勢
相比固定長度切割，Markdown Header Splitter 的搜尋精確度平均提升 **20-35%**，因為每個 Chunk 的語意邊界更清晰，且 metadata 中的標題鏈為 Re-ranker 提供了額外的上下文線索。
:::

---

## Multi-source RAG：整合多個知識來源

企業環境中，知識分散在不同的系統和格式中。OpenClaw 的 Multi-source RAG 支援同時查詢多個知識庫，並使用語意搜尋統一排序結果。

### 架構概覽

```
使用者查詢: "新員工入職流程中的 IT 設備申請步驟"
                         │
              ┌──────────▼──────────┐
              │    Query Router     │
              │  分析查詢，決定搜尋  │
              │  哪些知識庫          │
              └──────────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  HR 知識庫   │ │  IT 知識庫   │ │  Admin 知識庫│
│              │ │              │ │              │
│ 入職流程.md  │ │ 設備清單.md  │ │ 採購流程.md  │
│ 員工手冊.pdf │ │ VPN 設定.md  │ │ 表單範本.md  │
│ 福利說明.md  │ │ 帳號申請.md  │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │ top-5          │ top-5          │ top-5
       └────────────────┼────────────────┘
                        ▼
              ┌───────────────────┐
              │  Unified Reranker │
              │  跨知識庫統一排序  │
              │                   │
              │  考量因素：         │
              │  - 語意相關性      │
              │  - 知識庫可信度    │
              │  - 文件新鮮度      │
              └────────┬──────────┘
                       ▼
              最終 top-5 結果
              (可能來自不同知識庫)
```

### Multi-source 設定

```toml
# ~/.openclaw/config.toml

[rag.multi_source]
enabled = true
query_routing = "semantic"             # semantic / keyword / all
max_knowledge_bases = 5                # 單次查詢最多搜尋的知識庫數

# 每個知識庫的權重與優先級
[[rag.multi_source.sources]]
name = "hr-docs"
weight = 1.0
priority = "high"
freshness_decay = 0.01                 # 每天降低 1% 的新鮮度分數

[[rag.multi_source.sources]]
name = "tech-wiki"
weight = 0.9
priority = "medium"
freshness_decay = 0.005

[[rag.multi_source.sources]]
name = "admin-docs"
weight = 0.7
priority = "low"
freshness_decay = 0.02
```

---

## 文件上傳與管理

### 上傳文件

```bash
# 上傳單一文件
openclaw kb upload \
  --kb "company-docs" \
  --file "./employee-handbook.pdf" \
  --metadata '{"department": "HR", "version": "2026-Q1"}'

# 批量上傳整個目錄
openclaw kb upload \
  --kb "tech-wiki" \
  --directory "./docs/" \
  --pattern "*.md,*.pdf,*.txt" \
  --recursive

# 從 URL 匯入
openclaw kb import \
  --kb "tech-wiki" \
  --url "https://wiki.company.com/api/export" \
  --format "markdown"
```

### PDF 支援與引文標註

OpenClaw 的 PDF 處理器能提取文字、表格，並在回答中附加精確的引文標註：

```toml
# ~/.openclaw/knowledge/company-docs/config.toml

[pdf]
extractor = "advanced"                 # basic / advanced
ocr_enabled = true                     # 啟用 OCR（掃描文件）
ocr_language = "chi_tra+eng"           # 繁體中文 + 英文
table_extraction = true                # 提取表格
preserve_formatting = true             # 保留格式（粗體、列表等）

[citation]
enabled = true
format = "inline"                      # inline / footnote / endnote
include_page_number = true
include_section_title = true
template = "[{source}, p.{page}]"
```

Agent 回答範例：

```
使用者: 新員工的年假天數是幾天？

Agent: 根據公司員工手冊，新進員工第一年享有 **7 天**年假。
工作滿一年後，每年增加 1 天，上限為 30 天。
[員工手冊 v2026-Q1, p.12]
```

### 文件管理指令

```bash
# 列出知識庫中的所有文件
openclaw kb list --kb "company-docs"

# 查看文件詳細資訊
openclaw kb info --kb "company-docs" --doc "employee-handbook.pdf"

# 輸出範例：
# Document Information
# ────────────────────
# Name:          employee-handbook.pdf
# Size:          2.4 MB
# Pages:         45
# Chunks:        128
# Uploaded:      2026-03-15T09:00:00Z
# Last Updated:  2026-03-20T14:30:00Z
# Metadata:      {"department": "HR", "version": "2026-Q1"}

# 更新文件（自動重新切割和索引）
openclaw kb update \
  --kb "company-docs" \
  --doc "employee-handbook.pdf" \
  --file "./employee-handbook-v2.pdf"

# 刪除文件
openclaw kb delete --kb "company-docs" --doc "employee-handbook.pdf"

# 重建索引
openclaw kb reindex --kb "company-docs"
```

---

## 向量資料庫配置

OpenClaw 支援多種向量資料庫，從單機到分散式部署皆有對應方案。

### 支援的向量資料庫

| 資料庫 | 適用場景 | 文件規模 | 設定複雜度 |
|--------|---------|---------|-----------|
| **SQLite-VSS** | 個人使用、開發測試 | < 10 萬 chunks | 低（內建） |
| **pgvector** | 中小型企業 | < 100 萬 chunks | 中 |
| **Qdrant** | 大型企業、高效能需求 | < 1000 萬 chunks | 中 |
| **Weaviate** | 多模態搜尋、GraphQL | < 1000 萬 chunks | 高 |
| **Milvus** | 超大規模、分散式 | 10 億+ chunks | 高 |

### pgvector 設定範例

```toml
# ~/.openclaw/knowledge/company-docs/config.toml

[storage]
vector_db = "pgvector"

[storage.pgvector]
host = "localhost"
port = 5432
database = "openclaw_kb"
user = "openclaw"
password = "${PG_PASSWORD}"
schema = "knowledge"
table_prefix = "kb_"

# 索引設定
index_type = "ivfflat"                 # ivfflat / hnsw
ivfflat_lists = 100                    # IVFFlat 的 list 數量
hnsw_m = 16                            # HNSW 的 M 參數
hnsw_ef_construction = 200             # HNSW 建構時的 ef 參數
hnsw_ef_search = 100                   # HNSW 搜尋時的 ef 參數
```

### Qdrant 設定範例

```toml
[storage]
vector_db = "qdrant"

[storage.qdrant]
url = "http://localhost:6333"
api_key = "${QDRANT_API_KEY}"
collection_prefix = "openclaw_"

# 效能設定
prefer_grpc = true                     # 使用 gRPC 提升效能
timeout_seconds = 30

# HNSW 索引參數
hnsw_m = 16
hnsw_ef_construct = 128
hnsw_full_scan_threshold = 10000       # 低於此數量時使用全量掃描
```

---

## 效能調校與最佳化

### 關鍵效能指標

```bash
# 查看 RAG 系統效能指標
openclaw kb benchmark --kb "company-docs"

# 輸出範例：
# RAG Performance Benchmark
# ─────────────────────────
# Embedding Latency:     45ms avg (100 queries)
# Search Latency:        120ms avg (dense + sparse)
# Reranking Latency:     85ms avg (cross-encoder)
# Total RAG Latency:     250ms avg
#
# Search Quality:
# Precision@5:           0.82
# Recall@10:             0.91
# NDCG@5:                0.87
# MRR:                   0.79
```

### 效能最佳化清單

```toml
# ~/.openclaw/config.toml

[rag.performance]
# 1. Embedding 快取——避免重複計算
embedding_cache_enabled = true
embedding_cache_size = 10000           # 快取最多 10,000 個向量
embedding_cache_ttl = 86400            # 快取保留 24 小時

# 2. 搜尋結果快取
search_cache_enabled = true
search_cache_size = 5000
search_cache_ttl = 3600                # 搜尋結果快取 1 小時

# 3. 批量處理
batch_embedding_size = 100             # 批量 embedding 大小
batch_indexing = true                  # 批量索引模式

# 4. 預載入
preload_collections = true             # 啟動時預載入向量索引
preload_reranker = true                # 啟動時預載入 Re-ranker 模型
```

:::warning 記憶體使用注意
啟用向量索引預載入（`preload_collections`）會增加記憶體使用。每 100 萬個 3072 維向量約佔 **12 GB** 記憶體。請根據伺服器資源合理設定。
:::

---

## 企業級知識庫部署

### 高可用架構

```
                    Load Balancer
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
     ┌────────────┐┌────────────┐┌────────────┐
     │ OpenClaw   ││ OpenClaw   ││ OpenClaw   │
     │ Instance 1 ││ Instance 2 ││ Instance 3 │
     └─────┬──────┘└─────┬──────┘└─────┬──────┘
           │             │             │
           └─────────────┼─────────────┘
                         ▼
              ┌───────────────────┐
              │  Qdrant Cluster   │
              │                   │
              │  Node1  Node2     │
              │  Node3  Node4     │
              │                   │
              │  Replication: 2   │
              │  Shards: 4        │
              └────────┬──────────┘
                       │
              ┌────────▼──────────┐
              │  Shared Storage   │
              │  (S3 / MinIO)     │
              │  原始文件備份      │
              └───────────────────┘
```

### 企業級設定

```toml
# ~/.openclaw/config.toml (Enterprise)

[rag.enterprise]
# 多租戶支援
multi_tenant = true
tenant_isolation = "collection"        # collection / namespace / database

# 存取控制
[rag.enterprise.access_control]
enabled = true
rbac_enabled = true                    # 角色型存取控制
document_level_acl = true              # 文件級別的存取控制
audit_log = true                       # 記錄所有存取操作

# 數據治理
[rag.enterprise.governance]
data_retention_days = 365              # 資料保留天數
encryption_at_rest = true              # 靜態加密
encryption_in_transit = true           # 傳輸加密
pii_detection = true                   # 個資偵測
pii_action = "redact"                  # mask / redact / alert

# 監控與告警
[rag.enterprise.monitoring]
metrics_enabled = true
metrics_endpoint = "http://prometheus:9090"
alert_on_search_latency_ms = 500       # 搜尋延遲超過 500ms 時告警
alert_on_indexing_error = true
dashboard_url = "http://grafana:3000/d/rag"
```

### 容量規劃參考

| 規模 | 文件數 | Chunk 數 | 向量資料庫 | 記憶體需求 | 推薦配置 |
|------|--------|---------|-----------|-----------|---------|
| **小型** | < 1,000 | < 50K | SQLite-VSS | 2 GB | 單機 |
| **中型** | 1,000-10,000 | 50K-500K | pgvector | 8 GB | 單機 + 外部 DB |
| **大型** | 10,000-100,000 | 500K-5M | Qdrant | 32 GB | 3 節點叢集 |
| **超大型** | 100,000+ | 5M+ | Milvus | 128 GB+ | 分散式叢集 |

---

## 常見錯誤與疑難排解

### 問題 1：搜尋結果不相關

```
Agent 的回答似乎跟知識庫內容無關
```

**排查步驟：**

```bash
# 1. 確認知識庫已啟用
openclaw kb status --kb "company-docs"

# 2. 手動測試搜尋
openclaw kb search --kb "company-docs" --query "年假政策" --top-k 5

# 3. 檢查 Chunk 品質
openclaw kb chunks --kb "company-docs" --doc "employee-handbook.pdf" --show 5

# 4. 可能原因與解法：
# - Chunk 太大 → 降低 chunk_size
# - Embedding 模型不適合 → 換用 multilingual 模型
# - 搜尋權重不對 → 調整 dense_weight / sparse_weight
```

### 問題 2：搜尋延遲過高

```bash
# 檢查各階段延遲
openclaw kb benchmark --kb "company-docs" --verbose

# 常見瓶頸：
# 1. Embedding 計算慢 → 啟用 embedding_cache
# 2. 向量搜尋慢 → 調整 HNSW 參數或升級向量資料庫
# 3. Re-ranker 慢 → 降低 reranker_top_k 或使用更輕量的模型
```

### 問題 3：PDF 提取品質差

```bash
# 測試 PDF 提取品質
openclaw kb extract-test --file "./document.pdf" --pages 1-5

# 解法：
# 1. 啟用 OCR：ocr_enabled = true
# 2. 調整 OCR 語言：ocr_language = "chi_tra+eng"
# 3. 使用 advanced extractor：extractor = "advanced"
```

---

## 練習題

### 練習 1：建立個人知識庫

建立一個包含至少 5 份文件的知識庫，嘗試不同格式（Markdown、PDF、TXT）。測試搜尋效果，並調整 Chunking 策略直到搜尋結果滿意。

```bash
# 提示
openclaw kb create --name "my-notes" --chunk-strategy "auto"
openclaw kb upload --kb "my-notes" --directory "./my-documents/" --recursive
openclaw kb search --kb "my-notes" --query "你的測試查詢"
```

### 練習 2：Hybrid Search 權重調校

使用同一組測試查詢，分別測試以下三種搜尋配置，記錄每種配置的 Precision@5 和搜尋延遲：

1. 純 Dense Search（`dense_weight=1.0, sparse_weight=0.0`）
2. 純 Sparse Search（`dense_weight=0.0, sparse_weight=1.0`）
3. Hybrid Search（`dense_weight=0.7, sparse_weight=0.3`）

分析哪種配置最適合你的知識庫，並說明原因。

### 練習 3：Chunking 策略比較

選擇一份超過 5 頁的 Markdown 文件，分別使用以下三種 Chunking 策略進行索引：

1. Fixed Chunks（250 tokens）
2. Fixed Chunks（900 tokens）
3. Markdown Header Splitter

對每種策略執行 10 個測試查詢，比較搜尋品質（相關性分數）和回答品質。

### 練習 4：企業級模擬部署

在本機使用 Docker Compose 部署 Qdrant + OpenClaw 的組合，設定 Multi-source RAG 整合至少 2 個知識庫，並測試跨知識庫查詢的效果。

```bash
# 提示：使用 docker-compose.yml 快速部署
openclaw enterprise init --template "qdrant-multi-kb"
docker compose up -d
openclaw kb create --name "kb-1" --storage qdrant
openclaw kb create --name "kb-2" --storage qdrant
```

---

## 隨堂測驗

1. **Agentic RAG 與傳統 RAG 的主要差異是？**
   - A) 使用更大的 Embedding 模型
   - B) 模型自主判斷是否需要搜尋，而非每次都搜尋
   - C) 只使用 Dense Search
   - D) 不需要向量資料庫

2. **Hybrid Search 中，哪種搜尋方式更擅長匹配專有名詞（如函式名稱）？**
   - A) Dense Search（向量搜尋）
   - B) Sparse Search（BM25）
   - C) Re-ranker
   - D) Semantic Chunking

3. **RAG Context Injection 為什麼要將檢索結果放在 System Message 中？**
   - A) 因為 System Message 的 Token 限制更大
   - B) 為了利用 KV Prefix Caching 降低重複推理成本
   - C) 因為模型只能讀取 System Message
   - D) 為了繞過安全限制

4. **對於 FAQ 類型的知識庫，建議的 Chunk 大小是？**
   - A) 50-100 tokens
   - B) 200-300 tokens
   - C) 800-1000 tokens
   - D) 2000+ tokens

5. **Markdown Header Splitter 的主要優勢是什麼？**
   - A) 處理速度最快
   - B) 根據標題結構切割，每個 Chunk 有清晰的語意邊界和標題鏈 metadata
   - C) 不需要 Embedding 模型
   - D) 只適用於英文文件

<details>
<summary>查看答案</summary>

1. **B** — Agentic RAG 的核心特點是模型自主判斷搜尋時機，避免不必要的搜尋呼叫，並在結果不佳時自動重試。
2. **B** — Sparse Search（BM25）基於精確的關鍵字匹配，對專有名詞、函式名稱等特定字串的匹配效果優於語意搜尋。
3. **B** — 將 RAG 上下文放在 System Message 的固定位置，相同的前綴可以被 KV Cache 重複使用，減少 LLM 的重複計算。
4. **B** — FAQ 屬於事實性內容，200-300 tokens 的小 Chunk 讓每個向量精確代表單一事實，提高搜尋精確度。
5. **B** — Markdown Header Splitter 利用文件的標題結構進行切割，每個 Chunk 不僅有清晰的語意邊界，還帶有完整的標題鏈作為 metadata，幫助 Re-ranker 更好地判斷相關性。

</details>

---

## 建議下一步

你已經掌握了 OpenClaw Knowledge Base 與 RAG 系統的完整知識。接下來，你可以：

- 深入學習 [模組 5: 持久記憶與個人化](/docs/masterclass/module-05-memory)，了解 RAG 與 Memory System 如何協同運作
- 探索 [架構概覽](/docs/architecture/overview)，理解 Knowledge Base 在整體架構中的位置
- 參考 [安全性最佳實踐](/docs/security/best-practices)，確保知識庫的資料安全
