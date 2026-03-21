---
title: "MasterClass 课程总览"
sidebar_position: 1
description: "OpenClaw MasterClass 完整学习路线 — 从零到专家的 AI Agent 实战课程"
keywords: [OpenClaw, MasterClass, 课程, AI agent, 学习路线]
---

# MasterClass 课程总览

欢迎来到 **OpenClaw MasterClass** — 全球最完整的 OpenClaw 系统化学习课程。本课程涵盖从基础架构到企业级部署的所有方面，带你从初学者成为 OpenClaw 专家。

:::tip 课程设计理念
每个模块都遵循"概念 → 实践 → 验证"的学习循环。你不只是阅读文档，而是动手构建真实的 AI Agent 工作流程。
:::

---

## 适合对象

| 角色 | 你会学到什么 |
|------|-------------|
| **软件工程师** | OpenClaw 架构原理、Skill 开发、API 整合、安全最佳实践 |
| **DevOps / SRE** | 部署策略、容器化、监控、生产级安全配置 |
| **AI 研究者** | Mega-prompting 策略、Memory 系统、多 Agent 协作 |
| **技术主管** | 企业级导入策略、安全评估、团队协作模式 |
| **高级用户** | 自动化工作流、Skill 生态系、个性化配置 |

---

## 先备知识

开始本课程前，请确认你具备以下基础：

- **命令行操作**：熟悉 Terminal / Shell 基本命令
- **容器概念**：了解 Docker 或 Podman 的基本运作原理
- **编程基础**：至少熟悉一种编程语言（JavaScript、Python、Go 等）
- **网络基础**：了解 HTTP、WebSocket、REST API 的基本概念
- **OpenClaw 已安装**：请先完成 [安装指南](/docs/getting-started/installation)

:::info 硬件需求
- 至少 8 GB RAM（建议 16 GB）
- 10 GB 可用磁盘空间
- macOS 13+、Ubuntu 22.04+ 或 Windows 11（WSL2）
- 稳定的网络连接（下载 Skill 及 LLM Model 需要）
:::

---

## 课程架构

本 MasterClass 由 **12 个模块** 组成，分为三个阶段：

### 阶段一：核心基础（模块 1–5）

打下坚实的基础，理解 OpenClaw 的核心运作原理。

| 模块 | 主题 | 预估时间 |
|------|------|---------|
| [模块 1: 基础架构](./module-01-foundations) | 四层架构、系统健康检查、目录结构 | 2 小时 |
| [模块 2: Gateway 深入解析](./module-02-gateway) | WebSocket 协调、消息路由、Channel 抽象 | 2.5 小时 |
| [模块 3: Skills 系统](./module-03-skills-system) | SKILL.md 规范、Skill 生命周期、开发你的第一个 Skill | 3 小时 |
| [模块 4: ClawHub 市场](./module-04-clawhub) | 安装、发布、审核机制、安全扫描 | 2 小时 |
| [模块 5: 持久记忆](./module-05-memory) | Write-Ahead Logging、Markdown Compaction、记忆生命周期 | 2.5 小时 |

### 阶段二：高级应用（模块 6–9）

掌握高级功能，构建复杂的 AI Agent 工作流程。

| 模块 | 主题 | 预估时间 |
|------|------|---------|
| 模块 6: 自动化 | Heartbeat 系统、Cron 调度、事件驱动工作流 | 2.5 小时 |
| 模块 7: 浏览器整合 | 浏览器自动化、网页抓取、视觉反馈 | 2 小时 |
| 模块 8: 多 Agent 协作 | Agent 间通信、任务分配、协作模式 | 3 小时 |
| 模块 9: 安全性 | CVE-2026-25253、ClawHavoc 事件、安全加固 | 2.5 小时 |

### 阶段三：生产部署（模块 10–12）

将 OpenClaw 部署到生产环境，处理企业级需求。

| 模块 | 主题 | 预估时间 |
|------|------|---------|
| 模块 10: 生产部署 | Podman 部署、反向代理、TLS、监控 | 3 小时 |
| 模块 11: 语音 & Canvas | 语音交互、Canvas 可视化、多模态 | 2 小时 |
| 模块 12: 企业级应用 | 团队协作、权限管理、合规性、大规模部署 | 3 小时 |

---

## 学习路线图

```
阶段一（核心基础）              阶段二（高级应用）              阶段三（生产部署）
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  模块 1      │          │  模块 6      │          │  模块 10     │
│  基础架构    │──┐       │  自动化      │──┐       │  生产部署    │
└──────────────┘  │       └──────────────┘  │       └──────────────┘
┌──────────────┐  │       ┌──────────────┐  │       ┌──────────────┐
│  模块 2      │  ├──────▶│  模块 7      │  ├──────▶│  模块 11     │
│  Gateway     │  │       │  浏览器      │  │       │  语音/Canvas │
└──────────────┘  │       └──────────────┘  │       └──────────────┘
┌──────────────┐  │       ┌──────────────┐  │       ┌──────────────┐
│  模块 3      │  │       │  模块 8      │  │       │  模块 12     │
│  Skills 系统 │──┤       │  多 Agent    │──┘       │  企业级      │
└──────────────┘  │       └──────────────┘          └──────────────┘
┌──────────────┐  │       ┌──────────────┐
│  模块 4      │  │       │  模块 9      │
│  ClawHub     │──┤       │  安全性      │
└──────────────┘  │       └──────────────┘
┌──────────────┐  │
│  模块 5      │──┘
│  记忆系统    │
└──────────────┘
```

---

## 如何使用本课程

### 循序渐进

建议按照模块编号依序学习。每个模块都建立在前一个模块的概念之上。

### 动手实践

每个模块都包含实践练习（标记为 `实践` 区块）。请在你自己的 OpenClaw 环境中完成这些练习。

### 自我评估

每个模块结尾都有：
- **练习题**：开放式问题，鼓励深度探索
- **随堂测验**：选择题，快速验证理解程度

### 社区互动

遇到问题时：
1. 查看模块内的"常见错误"和"疑难排解"段落
2. 到 [OpenClaw Discord](https://discord.gg/openclaw) 的 `#masterclass` 频道提问
3. 在 [GitHub Discussions](https://github.com/openclaw/openclaw/discussions) 搜索或发起讨论

---

## 快速开始

准备好了吗？从第一个模块开始吧！

```bash
# 确认 OpenClaw 已正确安装
openclaw --version

# 运行系统健康检查
openclaw doctor

# 开始你的 MasterClass 之旅
openclaw start
```

:::caution 安全提醒
在学习过程中，请始终遵守安全最佳实践。特别注意：
- 永远绑定 `127.0.0.1`，不要使用 `0.0.0.0`
- 优先使用 Podman 而非 Docker
- 从 ClawHub 安装 Skill 前务必查看审核状态
:::

**[前往模块 1: OpenClaw 基础架构 →](./module-01-foundations)**

---

## 关于 OpenClaw

OpenClaw 是一个开源的 AI Agent 平台，由 Peter Steinberger 创建，在 GitHub 上拥有超过 **250,000 颗星**。它完全在本地运行，不依赖云端服务（LLM API 除外），让用户对自己的数据保有完整的控制权。

### 核心特色

- **四层架构**：Gateway、Reasoning Layer、Memory System、Skills/Execution Layer，各层职责明确、可独立扩展
- **ClawHub 市场**：超过 13,000 个社区贡献的 Skills，使用 `clawhub install <author>/<skill>` 即可安装
- **持久记忆**：通过 Write-Ahead Logging 和 Markdown Compaction，Agent 能跨对话记住重要信息
- **沙箱安全**：所有 Skills 在隔离的容器环境中执行（建议使用 Podman），确保系统安全
- **个性化**：使用 SOUL.md 定义 Agent 的人格特质，SKILL.md 定义技能行为
- **自动化**：Heartbeat 系统支持主动通知，Cron 调度支持定时任务

### 随堂测验：课程导览

1. **OpenClaw 的四层架构分别是什么？**
   - A) Frontend、Backend、Database、Cache
   - B) Gateway、Reasoning Layer、Memory System、Skills/Execution Layer
   - C) UI、API、Storage、Network
   - D) Client、Server、Queue、Worker

2. **开始 MasterClass 前，以下哪项不是必备条件？**
   - A) 命令行操作能力
   - B) 容器概念基础
   - C) 机器学习专业知识
   - D) 网络基础知识

3. **ClawHub 上有多少个 Skills 可供使用？**
   - A) 1,000+
   - B) 5,000+
   - C) 13,000+
   - D) 50,000+

<details>
<summary>查看答案</summary>

1. **B** — Gateway、Reasoning Layer、Memory System、Skills/Execution Layer 是 OpenClaw 的四层核心架构。
2. **C** — 机器学习专业知识不是必备条件。OpenClaw 将 LLM 的复杂性抽象化，让你专注于应用开发。
3. **C** — ClawHub 市场目前提供超过 13,000 个社区贡献的 Skills。

</details>
