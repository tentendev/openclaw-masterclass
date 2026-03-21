---
sidebar_position: 7
title: "AI/ML Skills"
description: "OpenClaw AI/ML 类 Skills 完整评测：Capability Evolver、Ontology、RAG Pipeline、Prompt Library"
keywords: [OpenClaw, Skills, AI, ML, Capability Evolver, Ontology, RAG, Prompt Library]
---

# AI/ML Skills

AI/ML 类 Skills 让 OpenClaw Agent 具备「自我进化」和「知识结构化」的能力。这些 Skills 对于理解 AI Agent 架构有极高的学习价值，适合想深入了解 OpenClaw 内部运作的进阶用户。

---

## #11 — Capability Evolver

| 属性 | 内容 |
|------|------|
| **排名** | #11 / 50 |
| **类别** | AI/ML |
| **总分** | 60 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/capability-evolver` |
| **ClawHub 下载量** | 35K+ |
| **目标用户** | 进阶用户、AI Agent 研究者 |

### 功能说明

Capability Evolver 是 OpenClaw 生态系统中最具前瞻性的 Skill 之一。它让 Agent 能自动进化自己的能力：

- **能力检测**：分析 Agent 目前能做和不能做的事
- **自动学习**：从成功的交互中提取模式并强化
- **Skill 建议**：根据使用模式推荐新的 Skills
- **Prompt 优化**：自动调整 system prompt 以提升特定任务表现
- **能力地图**：可视化 Agent 的能力分布

### 为什么重要

传统 AI Agent 的能力是固定的 — 你安装什么 Skill，它就只能做什么。Capability Evolver 打破了这个限制，让 Agent 能观察自己的行为模式并持续进化。35K 的下载量显示社区对「自进化 Agent」概念的高度兴趣。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** |

**排名理由**：学习价值 9/10 是所有 Skills 中最高的。对于想理解 meta-learning 和 self-improving agent 概念的人来说，这个 Skill 是最佳教材。

### 安装与配置

```bash
clawhub install community/capability-evolver

# 基本配置
openclaw skill configure capability-evolver \
  --learning-rate conservative \
  --auto-evolve false  # 建议先设为手动模式

# 执行能力分析
openclaw run capability-evolver --analyze

# 查看进化建议（不自动套用）
openclaw run capability-evolver --suggest
```

:::warning 自动进化风险
`--auto-evolve true` 会让 Agent 自动修改自己的行为模式。建议：
- 初期使用 `--auto-evolve false`，手动审核每个进化建议
- 搭配 Cron-backup Skill 定期备份 Agent 配置
- 配置 `--evolve-scope limited`，限制可进化的范围
:::

### 依赖与安全

- **依赖**：OpenClaw Core v0.9+、建议搭配记忆系统
- **权限需求**：读写 Agent 配置和记忆数据
- **安全性**：SEC 7/10 — 可修改 Agent 行为，需谨慎使用
- **替代方案**：手动调整 system prompt + Prompt Library（#44）

---

## #22 — Ontology

| 属性 | 内容 |
|------|------|
| **排名** | #22 / 50 |
| **类别** | AI/ML |
| **总分** | 56 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/ontology-claw` |
| **目标用户** | 知识工程师、研究者 |

### 功能说明

让 Agent 创建和查询 Knowledge Graph（知识图谱）：

- **Entity 提取**：从对话和文件中自动提取实体和关系
- **知识图谱构建**：将提取的知识组织为图形结构
- **推理查询**：透过图谱进行多跳推理（如「A 的老板的公司在哪个城市？」）
- **可视化**：生成知识图谱的交互式可视化
- **导出格式**：支援 RDF、OWL、JSON-LD

### 为什么重要

Knowledge Graph 让 Agent 的知识从「扁平的文字」升级为「结构化的图形」。这不仅提升了 Agent 的推理能力，也让知识可以跨对话持久保存。结合记忆系统使用，Agent 就能创建越来越完整的个人知识图谱。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 5 | 8 | 6 | 7 | 8 | 9 | **56** |

### 安装与配置

```bash
clawhub install community/ontology-claw

# 基本配置（使用内建的轻量图数据库）
openclaw skill configure ontology-claw \
  --backend embedded

# 进阶配置（使用 Neo4j）
openclaw skill configure ontology-claw \
  --backend neo4j \
  --neo4j-url bolt://localhost:7687 \
  --neo4j-user neo4j \
  --neo4j-password your_password
```

### 依赖与安全

- **依赖**：无（embedded mode）或 Neo4j（advanced mode）
- **权限需求**：图数据库读写
- **安全性**：SEC 8/10 — 本机数据处理，不外传
- **替代方案**：Obsidian Skill（#9）的 backlinks 提供轻量级的关系追踪

---

## #38 — RAG Pipeline

| 属性 | 内容 |
|------|------|
| **排名** | #38 / 50 |
| **类别** | AI/ML |
| **总分** | 51 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/rag-pipeline` |
| **目标用户** | 需要自定义知识库的进阶用户 |

### 功能说明

创建 Retrieval-Augmented Generation (RAG) 管线，让 Agent 能查询自定义知识库：

- **文件 Ingestion**：导入 PDF、Markdown、HTML、代码
- **向量化**：使用 Embedding Model 将文件转为向量
- **语义搜索**：根据查询意图检索最相关的文件片段
- **回答生成**：结合检索结果生成有根据的回答
- **来源标注**：每个回答标注来源文件

### 为什么重要

RAG 是让 Agent 在「封闭知识库」上工作的关键技术。你可以导入公司内部文件、技术文件、法规数据，让 Agent 成为这些领域的专家，同时确保回答有凭有据。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 6 | 5 | 8 | 5 | 6 | 7 | 8 | **51** |

### 安装与配置

```bash
clawhub install community/rag-pipeline

# 配置 Embedding Model
openclaw skill configure rag-pipeline \
  --embedding-model text-embedding-3-small \
  --vector-store chroma \
  --chunk-size 512

# 导入文件
openclaw run rag-pipeline --ingest ~/Documents/company-docs/

# 查询
openclaw run "根据公司文件，出差报销的流程是什么？"
```

### 依赖与安全

- **依赖**：Embedding Model API（OpenAI 或本机模型）、ChromaDB 或 Qdrant
- **权限需求**：文件系统读取、向量数据库读写
- **安全性**：SEC 7/10 — 导入的文件可能包含敏感信息，需注意数据安全

:::warning 数据安全
如果导入的文件包含机密信息，建议：
- 使用本机 Embedding Model（不外传数据）
- 加密向量数据库
- 配置存取控制
:::

- **替代方案**：Obsidian Skill（#9）提供轻量级的文件检索；OpenClaw 内建记忆系统

---

## #44 — Prompt Library

| 属性 | 内容 |
|------|------|
| **排名** | #44 / 50 |
| **类别** | AI/ML |
| **总分** | 49 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/prompt-library` |
| **目标用户** | Prompt Engineering 学习者 |

### 功能说明

管理和重用 Prompt 模板的工具：

- 存储常用 Prompt 模板
- 变量替换（Template Engine）
- Prompt 版本控制
- 社区 Prompt 分享
- A/B 测试不同 Prompt 的效果

### 为什么重要

好的 Prompt 是 AI Agent 性能的基础。Prompt Library 让你能系统化地管理和改进 Prompt，避免每次都重新撰写。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 4 | 6 | 5 | 7 | 9 | 5 | **49** |

### 安装与配置

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

### 依赖与安全

- **依赖**：无外部依赖
- **权限需求**：本机文件系统（存放模板）
- **安全性**：SEC 9/10 — 纯本机文字处理
- **替代方案**：直接在 OpenClaw 配置中管理 system prompt

---

## AI/ML Skills 学习路径

```
入门 → Prompt Library (#44)
       理解 Prompt Engineering 基础
       ↓
进阶 → RAG Pipeline (#38)
       学习 Retrieval-Augmented Generation
       ↓
进阶 → Ontology (#22)
       掌握 Knowledge Graph 概念
       ↓
高阶 → Capability Evolver (#11)
       探索 Self-improving Agent
```

### 研究者组合推荐

```bash
# AI Agent 架构学习
clawhub install community/capability-evolver
clawhub install community/ontology-claw
clawhub install community/rag-pipeline

# 实用 AI 工具组
clawhub install community/prompt-library
clawhub install community/rag-pipeline
clawhub install community/summarize
```
