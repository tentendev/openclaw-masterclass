---
sidebar_position: 7
title: "AI/ML Skills"
description: "OpenClaw AI/ML 類 Skills 完整評測：Capability Evolver、Ontology、RAG Pipeline、Prompt Library"
keywords: [OpenClaw, Skills, AI, ML, Capability Evolver, Ontology, RAG, Prompt Library]
---

# AI/ML Skills

AI/ML 類 Skills 讓 OpenClaw Agent 具備「自我進化」和「知識結構化」的能力。這些 Skills 對於理解 AI Agent 架構有極高的學習價值，適合想深入了解 OpenClaw 內部運作的進階使用者。

---

## #11 — Capability Evolver

| 屬性 | 內容 |
|------|------|
| **排名** | #11 / 50 |
| **類別** | AI/ML |
| **總分** | 60 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/capability-evolver` |
| **ClawHub 下載量** | 35K+ |
| **目標使用者** | 進階使用者、AI Agent 研究者 |

### 功能說明

Capability Evolver 是 OpenClaw 生態系中最具前瞻性的 Skill 之一。它讓 Agent 能自動進化自己的能力：

- **能力偵測**：分析 Agent 目前能做和不能做的事
- **自動學習**：從成功的互動中提取模式並強化
- **Skill 建議**：根據使用模式推薦新的 Skills
- **Prompt 最佳化**：自動調整 system prompt 以提升特定任務表現
- **能力地圖**：視覺化 Agent 的能力分布

### 為什麼重要

傳統 AI Agent 的能力是固定的 — 你安裝什麼 Skill，它就只能做什麼。Capability Evolver 打破了這個限制，讓 Agent 能觀察自己的行為模式並持續進化。35K 的下載量顯示社群對「自進化 Agent」概念的高度興趣。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** |

**排名理由**：學習價值 9/10 是所有 Skills 中最高的。對於想理解 meta-learning 和 self-improving agent 概念的人來說，這個 Skill 是最佳教材。

### 安裝與設定

```bash
clawhub install community/capability-evolver

# 基本設定
openclaw skill configure capability-evolver \
  --learning-rate conservative \
  --auto-evolve false  # 建議先設為手動模式

# 執行能力分析
openclaw run capability-evolver --analyze

# 查看進化建議（不自動套用）
openclaw run capability-evolver --suggest
```

:::warning 自動進化風險
`--auto-evolve true` 會讓 Agent 自動修改自己的行為模式。建議：
- 初期使用 `--auto-evolve false`，手動審核每個進化建議
- 搭配 Cron-backup Skill 定期備份 Agent 設定
- 設定 `--evolve-scope limited`，限制可進化的範圍
:::

### 依賴與安全

- **依賴**：OpenClaw Core v0.9+、建議搭配記憶系統
- **權限需求**：讀寫 Agent 設定和記憶資料
- **安全性**：SEC 7/10 — 可修改 Agent 行為，需謹慎使用
- **替代方案**：手動調整 system prompt + Prompt Library（#44）

---

## #22 — Ontology

| 屬性 | 內容 |
|------|------|
| **排名** | #22 / 50 |
| **類別** | AI/ML |
| **總分** | 56 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/ontology-claw` |
| **目標使用者** | 知識工程師、研究者 |

### 功能說明

讓 Agent 建立和查詢 Knowledge Graph（知識圖譜）：

- **Entity 擷取**：從對話和文件中自動擷取實體和關係
- **知識圖譜建構**：將擷取的知識組織為圖形結構
- **推理查詢**：透過圖譜進行多跳推理（如「A 的老闆的公司在哪個城市？」）
- **視覺化**：產生知識圖譜的互動式視覺化
- **匯出格式**：支援 RDF、OWL、JSON-LD

### 為什麼重要

Knowledge Graph 讓 Agent 的知識從「扁平的文字」升級為「結構化的圖形」。這不僅提升了 Agent 的推理能力，也讓知識可以跨對話持久保存。結合記憶系統使用，Agent 就能建立越來越完整的個人知識圖譜。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 5 | 8 | 6 | 7 | 8 | 9 | **56** |

### 安裝與設定

```bash
clawhub install community/ontology-claw

# 基本設定（使用內建的輕量圖資料庫）
openclaw skill configure ontology-claw \
  --backend embedded

# 進階設定（使用 Neo4j）
openclaw skill configure ontology-claw \
  --backend neo4j \
  --neo4j-url bolt://localhost:7687 \
  --neo4j-user neo4j \
  --neo4j-password your_password
```

### 依賴與安全

- **依賴**：無（embedded mode）或 Neo4j（advanced mode）
- **權限需求**：圖資料庫讀寫
- **安全性**：SEC 8/10 — 本機資料處理，不外傳
- **替代方案**：Obsidian Skill（#9）的 backlinks 提供輕量級的關係追蹤

---

## #38 — RAG Pipeline

| 屬性 | 內容 |
|------|------|
| **排名** | #38 / 50 |
| **類別** | AI/ML |
| **總分** | 51 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/rag-pipeline` |
| **目標使用者** | 需要自訂知識庫的進階使用者 |

### 功能說明

建立 Retrieval-Augmented Generation (RAG) 管線，讓 Agent 能查詢自訂知識庫：

- **文件 Ingestion**：匯入 PDF、Markdown、HTML、程式碼
- **向量化**：使用 Embedding Model 將文件轉為向量
- **語義搜尋**：根據查詢意圖檢索最相關的文件片段
- **回答產生**：結合檢索結果產生有根據的回答
- **來源標註**：每個回答標註來源文件

### 為什麼重要

RAG 是讓 Agent 在「封閉知識庫」上工作的關鍵技術。你可以匯入公司內部文件、技術文件、法規資料，讓 Agent 成為這些領域的專家，同時確保回答有憑有據。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 6 | 5 | 8 | 5 | 6 | 7 | 8 | **51** |

### 安裝與設定

```bash
clawhub install community/rag-pipeline

# 設定 Embedding Model
openclaw skill configure rag-pipeline \
  --embedding-model text-embedding-3-small \
  --vector-store chroma \
  --chunk-size 512

# 匯入文件
openclaw run rag-pipeline --ingest ~/Documents/company-docs/

# 查詢
openclaw run "根據公司文件，出差報銷的流程是什麼？"
```

### 依賴與安全

- **依賴**：Embedding Model API（OpenAI 或本機模型）、ChromaDB 或 Qdrant
- **權限需求**：文件系統讀取、向量資料庫讀寫
- **安全性**：SEC 7/10 — 匯入的文件可能包含敏感資訊，需注意資料安全

:::warning 資料安全
如果匯入的文件包含機密資訊，建議：
- 使用本機 Embedding Model（不外傳資料）
- 加密向量資料庫
- 設定存取控制
:::

- **替代方案**：Obsidian Skill（#9）提供輕量級的文件檢索；OpenClaw 內建記憶系統

---

## #44 — Prompt Library

| 屬性 | 內容 |
|------|------|
| **排名** | #44 / 50 |
| **類別** | AI/ML |
| **總分** | 49 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/prompt-library` |
| **目標使用者** | Prompt Engineering 學習者 |

### 功能說明

管理和重用 Prompt 模板的工具：

- 儲存常用 Prompt 模板
- 變數替換（Template Engine）
- Prompt 版本控制
- 社群 Prompt 分享
- A/B 測試不同 Prompt 的效果

### 為什麼重要

好的 Prompt 是 AI Agent 效能的基礎。Prompt Library 讓你能系統化地管理和改進 Prompt，避免每次都重新撰寫。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 4 | 6 | 5 | 7 | 9 | 5 | **49** |

### 安裝與設定

```bash
clawhub install community/prompt-library

# 新增 Prompt 模板
openclaw run prompt-library --save \
  --name "code-review" \
  --template "Review this {{language}} code for {{focus_area}}: {{code}}"

# 使用模板
openclaw run prompt-library --use code-review \
  --language python \
  --focus_area "security vulnerabilities" \
  --code "$(cat main.py)"
```

### 依賴與安全

- **依賴**：無外部依賴
- **權限需求**：本機檔案系統（存放模板）
- **安全性**：SEC 9/10 — 純本機文字處理
- **替代方案**：直接在 OpenClaw 設定中管理 system prompt

---

## AI/ML Skills 學習路徑

```
入門 → Prompt Library (#44)
       理解 Prompt Engineering 基礎
       ↓
進階 → RAG Pipeline (#38)
       學習 Retrieval-Augmented Generation
       ↓
進階 → Ontology (#22)
       掌握 Knowledge Graph 概念
       ↓
高階 → Capability Evolver (#11)
       探索 Self-improving Agent
```

### 研究者組合推薦

```bash
# AI Agent 架構學習
clawhub install community/capability-evolver
clawhub install community/ontology-claw
clawhub install community/rag-pipeline

# 實用 AI 工具組
clawhub install community/prompt-library
clawhub install community/rag-pipeline
clawhub install community/summarize
```
