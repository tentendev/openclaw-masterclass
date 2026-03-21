---
sidebar_position: 5
title: "研究 Skills"
description: "OpenClaw 研究类 Skills 完整评测：Web Browsing、Tavily、Felo Search、Summarize"
keywords: [OpenClaw, Skills, Research, Web Browsing, Tavily, Felo Search, Summarize]
---

# 研究 Skills (Research)

研究类 Skills 赋予 OpenClaw Agent 「上网查数据」的能力。从基础的网页浏览到 AI 驱动的智慧搜索，这些 Skills 让 Agent 能实时获取最新信息，而非仅依赖训练数据。

---

## #2 — Web Browsing

| 属性 | 内容 |
|------|------|
| **排名** | #2 / 50 |
| **类别** | Research |
| **总分** | 70 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社区** | 官方（内建） |
| **安装方式** | 内建（bundled），无需安装 |
| **ClawHub 统计** | 180K+ 使用次数 |
| **目标用户** | 所有用户 |

### 功能说明

Web Browsing 是 OpenClaw 最核心的 Skill 之一，直接内建于系统中：

- **网页导览**：前往任意 URL，解析 HTML 内容
- **内容提取**：智慧提取文章正文、表格、代码区块
- **搜索集成**：透过搜索引擎查询（默认 Google）
- **JavaScript 渲染**：处理 SPA 和动态加载内容
- **截图能力**：提取网页视觉快照
- **多标签管理**：同时浏览多个页面

### 为什么重要

Web Browsing 是让 Agent 从「封闭系统」变为「开放系统」的关键 Skill。没有它，Agent 只能依赖训练数据；有了它，Agent 能存取实时的网络信息。180K+ 的安装使用量说明了它的不可或缺性。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 10 | 10 | 10 | 9 | 8 | 7 | 7 | 9 | **70** |

**排名理由**：相关性、相容性、社区热度三项满分。可靠度稍低（某些网站会封锁自动化存取），安全性需注意（Agent 可能被诱导存取恶意网站）。

### 配置方式

```bash
# Web Browsing 为内建 Skill，直接可用
openclaw skill status web-browsing

# 自定义配置
openclaw config set web-browsing.default_search google
openclaw config set web-browsing.timeout 30000
openclaw config set web-browsing.javascript true

# 配置 Proxy（企业网络常需要）
openclaw config set web-browsing.proxy http://proxy.corp.com:8080
```

### 依赖与安全

- **依赖**：Chromium runtime（随 OpenClaw 安装）
- **权限需求**：网络存取
- **安全性**：SEC 7/10 — Agent 可能被 prompt injection 诱导至恶意网站

:::warning 网页注入风险
恶意网站可能嵌入针对 AI Agent 的 prompt injection 攻击。建议：
- 配置 URL 白名单：`openclaw config set web-browsing.allowed_domains "*.github.com,*.stackoverflow.com"`
- 启用沙盒模式：`openclaw config set web-browsing.sandbox true`
- 避免让 Agent 自动点击不明链接
:::

- **替代方案**：Tavily（#4）提供更结构化的搜索结果；Firecrawl（#18）适合大量爬取

---

## #4 — Tavily

| 属性 | 内容 |
|------|------|
| **排名** | #4 / 50 |
| **类别** | Research |
| **总分** | 67 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社区** | 社区（framix-team） |
| **安装方式** | `clawhub install framix-team/openclaw-tavily` |
| **目标用户** | 研究者、需要高品质搜索的用户 |

### 功能说明

Tavily 是专为 AI Agent 设计的搜索引擎，提供：

- **AI 搜索**：语义理解查询意图，返回结构化结果
- **网页爬取**：深度爬取指定 URL，提取结构化内容
- **实时回答**：直接回答事实性问题（附来源引用）
- **搜索深度控制**：`basic`（快速）vs `advanced`（深度）
- **来源可信度评分**：每个搜索结果附带可信度分数

### 为什么重要

相较于 Web Browsing 的通用浏览能力，Tavily 专注于「搜索」场景并做到极致。它的结果已经过 AI 预处理，Agent 可以直接使用，不需要再自行解析 HTML。对于研究密集型工作流来说，Tavily 比 Web Browsing 更有效率。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 9 | 8 | 9 | 8 | 8 | 8 | 8 | **67** |

### 安装与配置

```bash
clawhub install framix-team/openclaw-tavily

# 配置 Tavily API Key（免费方案每月 1000 次查询）
openclaw skill configure tavily \
  --api-key tvly-xxxxxxxxxxxx

# 使用示例
openclaw run "用 Tavily 搜索 OpenClaw 最新版本的功能"
```

### 依赖与安全

- **依赖**：Tavily API Key（免费方案可用）
- **权限需求**：网络存取（仅连接 Tavily API）
- **安全性**：SEC 8/10 — 只存取 Tavily API，不直接浏览网页，降低注入风险
- **替代方案**：Felo Search（#15）提供中文搜索优化；Web Browsing（#2）更通用

---

## #15 — Felo Search

| 属性 | 内容 |
|------|------|
| **排名** | #15 / 50 |
| **类别** | Research |
| **总分** | 59 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install felo-search` |
| **目标用户** | 需要多语言搜索的用户、中文用户 |

### 功能说明

Felo Search 是另一个 AI 驱动的搜索工具，特色在于：

- **多语言优化**：中文、日文搜索品质优于 Tavily
- **引用标注**：每句回答都附带来源链接
- **实时回答模式**：直接生成摘要而非链接清单
- **主题追踪**：持续追踪特定主题的最新信息

### 为什么重要

对于简体中文用户来说，Felo Search 在中文内容的搜索品质上通常优于 Tavily。如果你的主要研究语言是中文或日文，Felo Search 是更好的选择。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 7 | 7 | 8 | 7 | **59** |

### 安装与配置

```bash
clawhub install felo-search

# 配置 API Key
openclaw skill configure felo-search \
  --api-key your_felo_api_key

# 使用示例（中文搜索）
openclaw run "用 Felo 搜索台湾 AI 新创最新动态"
```

### 依赖与安全

- **依赖**：Felo Search API Key
- **权限需求**：网络存取（仅连接 Felo API）
- **安全性**：SEC 8/10 — 与 Tavily 类似的安全模型
- **替代方案**：Tavily（#4）英文搜索品质更好；Web Browsing（#2）最通用

---

## #19 — Summarize（研究面向）

Summarize Skill 的完整介绍请见[生产力 Skills](./productivity#19--summarize)。在研究工作流中，Summarize 扮演的角色如下：

### 研究工作流中的 Summarize

```bash
# 搜索 → 摘要的 pipeline
openclaw run "
  1. 用 Tavily 搜索 'transformer architecture 2026 improvements'
  2. 对前 5 个结果进行摘要
  3. 集成为一份研究笔记存入 Obsidian
"
```

Summarize Skill 最适合搭配 Tavily 或 Web Browsing 使用，把搜索到的大量信息压缩为可行动的洞察。

---

## 研究 Skills 比较表

| 特性 | Web Browsing | Tavily | Felo Search | Summarize |
|------|:----------:|:------:|:-----------:|:---------:|
| 搜索能力 | ✅ | ✅ | ✅ | ❌ |
| 网页浏览 | ✅ | ❌ | ❌ | ❌ |
| 爬取能力 | ✅ | ✅ | ❌ | ❌ |
| 结构化输出 | ❌ | ✅ | ✅ | ✅ |
| 中文优化 | ❌ | 一般 | ✅ | ✅ |
| 引用标注 | ❌ | ✅ | ✅ | ❌ |
| 需要 API Key | ❌ | ✅ | ✅ | ❌ |
| 离线可用 | ❌ | ❌ | ❌ | ✅ |

### 研究者推荐组合

```bash
# 深度研究流程
clawhub install framix-team/openclaw-tavily
clawhub install community/summarize
clawhub install community/obsidian-claw
# 搭配内建 Web Browsing

# 中文研究流程
clawhub install felo-search
clawhub install community/summarize
clawhub install community/notion-claw

# 极简研究流程（零成本）
# 只用内建 Web Browsing + Summarize
clawhub install community/summarize
```
