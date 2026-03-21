---
sidebar_position: 7
title: "AI/ML Skills"
description: "Complete review of OpenClaw AI/ML Skills: Capability Evolver, Ontology, RAG Pipeline, Prompt Library"
keywords: [OpenClaw, Skills, AI, ML, Capability Evolver, Ontology, RAG, Prompt Library]
---

# AI/ML Skills

AI/ML Skills give the OpenClaw Agent the ability to "self-evolve" and "structure knowledge." These Skills offer extremely high learning value for understanding AI Agent architecture, and are ideal for advanced users who want to understand OpenClaw's internal workings.

---

## #11 — Capability Evolver

| Property | Details |
|----------|---------|
| **Rank** | #11 / 50 |
| **Category** | AI/ML |
| **Total Score** | 60 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/capability-evolver` |
| **ClawHub Downloads** | 35K+ |
| **Target Users** | Advanced users, AI Agent researchers |

### Feature Overview

Capability Evolver is one of the most forward-looking Skills in the OpenClaw ecosystem. It lets the Agent automatically evolve its own capabilities:

- **Capability detection**: Analyze what the Agent can and cannot currently do
- **Auto-learning**: Extract patterns from successful interactions and reinforce them
- **Skill suggestions**: Recommend new Skills based on usage patterns
- **Prompt optimization**: Automatically tune the system prompt to improve performance on specific tasks
- **Capability map**: Visualize the Agent's capability distribution

### Why It Matters

Traditional AI Agents have fixed capabilities — whatever Skills you install are all they can do. Capability Evolver breaks this limitation, letting the Agent observe its own behavior patterns and continuously evolve. The 35K download count shows high community interest in the "self-evolving Agent" concept.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** |

**Ranking rationale**: Learning value of 9/10 is the highest across all Skills. For those who want to understand meta-learning and self-improving agent concepts, this Skill is the best learning resource.

### Installation & Setup

```bash
clawhub install community/capability-evolver

# Basic setup
openclaw skill configure capability-evolver \
  --learning-rate conservative \
  --auto-evolve false  # Start in manual mode recommended

# Run capability analysis
openclaw run capability-evolver --analyze

# View evolution suggestions (without auto-applying)
openclaw run capability-evolver --suggest
```

:::warning Auto-Evolution Risk
`--auto-evolve true` lets the Agent automatically modify its own behavior patterns. Recommendations:
- Initially use `--auto-evolve false` and manually review each evolution suggestion
- Pair with the Cron-backup Skill for regular Agent configuration backups
- Set `--evolve-scope limited` to restrict the scope of evolution
:::

### Dependencies & Security

- **Dependencies**: OpenClaw Core v0.9+, memory system recommended
- **Permissions Required**: Read/write Agent configuration and memory data
- **Security**: SEC 7/10 — can modify Agent behavior; use with caution
- **Alternatives**: Manual system prompt adjustment + Prompt Library (#44)

---

## #22 — Ontology

| Property | Details |
|----------|---------|
| **Rank** | #22 / 50 |
| **Category** | AI/ML |
| **Total Score** | 56 / 80 |
| **Maturity** | 🟠 Alpha |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/ontology-claw` |
| **Target Users** | Knowledge engineers, researchers |

### Feature Overview

Lets the Agent build and query a Knowledge Graph:

- **Entity extraction**: Automatically extract entities and relationships from conversations and documents
- **Knowledge graph construction**: Organize extracted knowledge into graph structures
- **Reasoning queries**: Multi-hop reasoning through the graph (e.g., "What city is A's boss's company in?")
- **Visualization**: Generate interactive visualizations of the knowledge graph
- **Export formats**: Supports RDF, OWL, JSON-LD

### Why It Matters

A Knowledge Graph upgrades the Agent's knowledge from "flat text" to "structured graphs." This not only improves the Agent's reasoning ability but also makes knowledge persistently storable across conversations. Combined with the memory system, the Agent can build an increasingly complete personal knowledge graph.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 7 | 5 | 8 | 6 | 7 | 8 | 9 | **56** |

### Installation & Setup

```bash
clawhub install community/ontology-claw

# Basic setup (using the built-in lightweight graph database)
openclaw skill configure ontology-claw \
  --backend embedded

# Advanced setup (using Neo4j)
openclaw skill configure ontology-claw \
  --backend neo4j \
  --neo4j-url bolt://localhost:7687 \
  --neo4j-user neo4j \
  --neo4j-password your_password
```

### Dependencies & Security

- **Dependencies**: None (embedded mode) or Neo4j (advanced mode)
- **Permissions Required**: Graph database read/write
- **Security**: SEC 8/10 — local data processing, nothing transmitted externally
- **Alternatives**: Obsidian Skill (#9) backlinks provide lightweight relationship tracking

---

## #38 — RAG Pipeline

| Property | Details |
|----------|---------|
| **Rank** | #38 / 50 |
| **Category** | AI/ML |
| **Total Score** | 51 / 80 |
| **Maturity** | 🟠 Alpha |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/rag-pipeline` |
| **Target Users** | Advanced users needing custom knowledge bases |

### Feature Overview

Build a Retrieval-Augmented Generation (RAG) pipeline so the Agent can query custom knowledge bases:

- **Document ingestion**: Import PDF, Markdown, HTML, and code files
- **Vectorization**: Convert documents to vectors using an Embedding Model
- **Semantic search**: Retrieve the most relevant document segments based on query intent
- **Answer generation**: Generate grounded answers by combining retrieval results
- **Source citation**: Each answer cites its source documents

### Why It Matters

RAG is the key technology for making an Agent work on a "closed knowledge base." You can import internal company documents, technical documentation, and regulatory materials, turning the Agent into a domain expert while ensuring answers are well-grounded.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 6 | 5 | 8 | 5 | 6 | 7 | 8 | **51** |

### Installation & Setup

```bash
clawhub install community/rag-pipeline

# Configure the Embedding Model
openclaw skill configure rag-pipeline \
  --embedding-model text-embedding-3-small \
  --vector-store chroma \
  --chunk-size 512

# Ingest documents
openclaw run rag-pipeline --ingest ~/Documents/company-docs/

# Query
openclaw run "According to company documents, what is the expense reimbursement process?"
```

### Dependencies & Security

- **Dependencies**: Embedding Model API (OpenAI or local model), ChromaDB or Qdrant
- **Permissions Required**: Filesystem read, vector database read/write
- **Security**: SEC 7/10 — ingested documents may contain sensitive information; pay attention to data security

:::warning Data Security
If ingested documents contain confidential information, consider:
- Using a local Embedding Model (no data transmitted externally)
- Encrypting the vector database
- Setting access controls
:::

- **Alternatives**: Obsidian Skill (#9) provides lightweight document retrieval; OpenClaw's built-in memory system

---

## #44 — Prompt Library

| Property | Details |
|----------|---------|
| **Rank** | #44 / 50 |
| **Category** | AI/ML |
| **Total Score** | 49 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/prompt-library` |
| **Target Users** | Prompt Engineering learners |

### Feature Overview

A tool for managing and reusing Prompt templates:

- Store commonly used Prompt templates
- Variable substitution (Template Engine)
- Prompt version control
- Community Prompt sharing
- A/B test different Prompts for effectiveness

### Why It Matters

Good Prompts are the foundation of AI Agent performance. Prompt Library lets you systematically manage and improve Prompts instead of rewriting them every time.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 7 | 4 | 6 | 5 | 7 | 9 | 5 | **49** |

### Installation & Setup

```bash
clawhub install community/prompt-library

# Add a Prompt template
openclaw run prompt-library --save \
  --name "code-review" \
  --template "Review this {{language}} code for {{focus_area}}: {{code}}"

# Use a template
openclaw run prompt-library --use code-review \
  --language python \
  --focus_area "security vulnerabilities" \
  --code "$(cat main.py)"
```

### Dependencies & Security

- **Dependencies**: None
- **Permissions Required**: Local filesystem (for storing templates)
- **Security**: SEC 9/10 — purely local text processing
- **Alternatives**: Manage the system prompt directly in OpenClaw settings

---

## AI/ML Skills Learning Path

```
Beginner → Prompt Library (#44)
           Understand Prompt Engineering fundamentals
           ↓
Intermediate → RAG Pipeline (#38)
               Learn Retrieval-Augmented Generation
               ↓
Intermediate → Ontology (#22)
               Master Knowledge Graph concepts
               ↓
Advanced → Capability Evolver (#11)
           Explore Self-improving Agents
```

### Recommended Researcher Combinations

```bash
# AI Agent architecture learning
clawhub install community/capability-evolver
clawhub install community/ontology-claw
clawhub install community/rag-pipeline

# Practical AI toolkit
clawhub install community/prompt-library
clawhub install community/rag-pipeline
clawhub install community/summarize
```
