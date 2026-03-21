---
title: "AI/ML Skills"
sidebar_position: 7
description: "OpenClaw AI/ML Skills 완전 평가: Capability Evolver, Ontology, RAG Pipeline, Prompt Library"
---

# AI/ML Skills

AI/ML 類 Skills 讓 OpenClaw Agent 具備「自我進化」和「知識結構化」的能力。這些 Skills 對於理解 AI Agent 架構有極高的學習價值，適合想深入了解 OpenClaw 內部運作的進階사용자。

---

## #11 — Capability Evolver

| 屬性 | 內容 |
|------|------|
| **排名** | #11 / 50 |
| **類別** | AI/ML |
| **總分** | 60 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/capability-evolver` |
| **ClawHub 다운로드量** | 35K+ |
| **目標사용자** | 進階사용자、AI Agent 리서치者 |

### 기능 설명

Capability Evolver 是 OpenClaw 生態系中最具前瞻性的 Skill 之一。它讓 Agent 能自動進化自己的能力：

- **能力偵測**：分析 Agent 目前能做和不能做的事
- **自動學習**：從成功的互動中提取模式並強化
- **Skill 建議**：根據使用模式推薦新的 Skills
- **Prompt 最佳化**：自動調整 system prompt 以提升特定任務表現
- **能力地圖**：視覺化 Agent 的能力分布

### 중요한 이유

傳統 AI Agent 的能力是固定的 — 你설치什麼 Skill，它就只能做什麼。Capability Evolver 打破了這個限制，讓 Agent 能觀察自己的行為模式並持續進化。35K 的다운로드量顯示社群對「自進化 Agent」概念的高度興趣。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** |

**排名理由**：學習價值 9/10 是所有 Skills 中最高的。對於想理解 meta-learning 和 self-improving agent 概念的人來說，這個 Skill 是最佳教材。

### 설치 및 설정

```bash
clawhub install community/capability-evolver

# 基本설정
openclaw skill configure capability-evolver \
  --learning-rate conservative \
  --auto-evolve false  # 建議先設為手動模式

# 실행能力分析
openclaw run capability-evolver --analyze

# 조회進化建議（不自動套用）
openclaw run capability-evolver --suggest
```

:::warning 자동 진화 위험
`--auto-evolve true` 會讓 Agent 自動수정自己的行為模式。建議：
- 初期使用 `--auto-evolve false`，手動심사每個進化建議
- 搭配 Cron-backup Skill 定期백업 Agent 설정
- 설정 `--evolve-scope limited`，限制可進化的範圍
:::

### 의존성 및 보안

- **依賴**：OpenClaw Core v0.9+、建議搭配記憶系統
- **권한需求**：讀寫 Agent 설정和記憶데이터
- **安全性**：SEC 7/10 — 可수정 Agent 行為，需謹慎使用
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
| **설치方式** | `clawhub install community/ontology-claw` |
| **目標사용자** | 知識工程師、리서치者 |

### 기능 설명

讓 Agent 생성和查詢 Knowledge Graph（知識圖譜）：

- **Entity 擷取**：從對話和문서中自動擷取實體和關係
- **知識圖譜建構**：將擷取的知識組織為圖形結構
- **推理查詢**：透過圖譜進行多跳推理（如「A 的老闆的公司在哪個城市？」）
- **視覺化**：產生知識圖譜的互動式視覺化
- **엑스포트格式**：支援 RDF、OWL、JSON-LD

### 중요한 이유

Knowledge Graph 讓 Agent 的知識從「扁平的文字」升級為「結構化的圖形」。這不僅提升了 Agent 的推理能力，也讓知識可以跨對話持久保存。結合記憶系統使用，Agent 就能생성越來越完整的個人知識圖譜。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 5 | 8 | 6 | 7 | 8 | 9 | **56** |

### 설치 및 설정

```bash
clawhub install community/ontology-claw

# 基本설정（使用內建的輕量圖데이터庫）
openclaw skill configure ontology-claw \
  --backend embedded

# 進階설정（使用 Neo4j）
openclaw skill configure ontology-claw \
  --backend neo4j \
  --neo4j-url bolt://localhost:7687 \
  --neo4j-user neo4j \
  --neo4j-password your_password
```

### 의존성 및 보안

- **依賴**：無（embedded mode）或 Neo4j（advanced mode）
- **권한需求**：圖데이터庫讀寫
- **安全性**：SEC 8/10 — 本機데이터處理，不外傳
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
| **설치方式** | `clawhub install community/rag-pipeline` |
| **目標사용자** | 需要自訂知識庫的進階사용자 |

### 기능 설명

생성 Retrieval-Augmented Generation (RAG) 管線，讓 Agent 能查詢自訂知識庫：

- **문서 Ingestion**：임포트 PDF、Markdown、HTML、程式碼
- **向量化**：使用 Embedding Model 將문서轉為向量
- **語義검색**：根據查詢意圖檢索最相關的문서片段
- **回答產生**：結合檢索結果產生有根據的回答
- **來源標註**：每個回答標註來源문서

### 중요한 이유

RAG 是讓 Agent 在「封閉知識庫」上工作的關鍵技術。你可以임포트公司內部문서、技術문서、法規데이터，讓 Agent 成為這些領域的專家，同時確保回答有憑有據。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 6 | 5 | 8 | 5 | 6 | 7 | 8 | **51** |

### 설치 및 설정

```bash
clawhub install community/rag-pipeline

# 설정 Embedding Model
openclaw skill configure rag-pipeline \
  --embedding-model text-embedding-3-small \
  --vector-store chroma \
  --chunk-size 512

# 임포트문서
openclaw run rag-pipeline --ingest ~/Documents/company-docs/

# 查詢
openclaw run "根據公司문서，出差報銷的流程是什麼？"
```

### 의존성 및 보안

- **依賴**：Embedding Model API（OpenAI 或本機模型）、ChromaDB 或 Qdrant
- **권한需求**：문서系統讀取、向量데이터庫讀寫
- **安全性**：SEC 7/10 — 임포트的문서可能包含敏感資訊，需注意데이터安全

:::warning 데이터安全
如果임포트的문서包含機密資訊，建議：
- 使用本機 Embedding Model（不外傳데이터）
- 암호화向量데이터庫
- 설정存取控制
:::

- **替代方案**：Obsidian Skill（#9）提供輕量級的문서檢索；OpenClaw 內建記憶系統

---

## #44 — Prompt Library

| 屬性 | 內容 |
|------|------|
| **排名** | #44 / 50 |
| **類別** | AI/ML |
| **總分** | 49 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **설치方式** | `clawhub install community/prompt-library` |
| **目標사용자** | Prompt Engineering 學習者 |

### 기능 설명

管理和重用 Prompt 템플릿的工具：

- 저장常用 Prompt 템플릿
- 變數替換（Template Engine）
- Prompt 版本控制
- 社群 Prompt 分享
- A/B 테스트不同 Prompt 的效果

### 중요한 이유

好的 Prompt 是 AI Agent 성능的基礎。Prompt Library 讓你能系統化地管理和改進 Prompt，避免每次都重新撰寫。

### 평점 상세

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 4 | 6 | 5 | 7 | 9 | 5 | **49** |

### 설치 및 설정

```bash
clawhub install community/prompt-library

# 新增 Prompt 템플릿
openclaw run prompt-library --save \
  --name "code-review" \
  --template "Review this {{language}} code for {{focus_area}}: {{code}}"

# 使用템플릿
openclaw run prompt-library --use code-review \
  --language python \
  --focus_area "security vulnerabilities" \
  --code "$(cat main.py)"
```

### 의존성 및 보안

- **依賴**：無外部依賴
- **권한需求**：本機檔案系統（存放템플릿）
- **安全性**：SEC 9/10 — 純本機文字處理
- **替代方案**：直接在 OpenClaw 설정中管理 system prompt

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

### 리서치者組合推薦

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
