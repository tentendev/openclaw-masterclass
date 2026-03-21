---
title: OpenClaw 是什么？完整介绍
description: 全面认识 OpenClaw — 开源自主 AI 代理平台的历史、架构、功能与生态系统。从零到精通的第一步。
sidebar_position: 1
---

# OpenClaw 是什么？完整介绍

**OpenClaw** 是一个开源的自主 AI 代理（Autonomous AI Agent）平台，能够在你的本地计算机上运行，并连接超过 20 个通讯平台。它让你拥有一个可以思考、记忆、行动的 AI 助手——而且所有数据都在你自己的掌控之中。

在亚洲社区中，OpenClaw 有个亲切的昵称叫做**"养龙虾"**，吉祥物是一只名为 **Molty** 的龙虾。这个名字来自 OpenClaw 的"Claw"（螯），象征着强大而灵活的抓取与操作能力。

:::info 关键数据
- GitHub Stars：**250,000+**
- ClawHub 技能市场：**13,000+ 技能**
- 支持通讯平台：**20+ 个**
- 支持 LLM 模型：**Claude、GPT、Gemini、DeepSeek、Ollama 等**
- 创始人：**Peter Steinberger**
:::

---

## 为什么选择 OpenClaw？

在 AI 工具遍地开花的 2026 年，OpenClaw 之所以脱颖而出，原因有三：

1. **完全本地运行**：你的对话记录、记忆数据、配置文件全部存储在本地，不会上传到任何第三方服务器。
2. **跨平台整合**：一个 AI 代理可以同时连接 WhatsApp、Telegram、Discord、Slack、LINE、Signal、iMessage、Matrix 等平台。
3. **技能生态系统**：通过 ClawHub 技能市场，你可以安装超过 13,000 个社区开发的技能，从自动回信到智能家居控制一应俱全。

---

## OpenClaw 的历史：从 Clawdbot 到今天

OpenClaw 的发展经历了三个主要阶段：

### 第一阶段：Clawdbot（2024 年初）

Peter Steinberger 最初开发了一个名为 **Clawdbot** 的个人项目，目的是让 AI 能够通过即时通讯软件进行对话。当时的功能非常基础——仅支持 Telegram，且只能调用单一 LLM。

### 第二阶段：Moltbot（2024 年中）

社区快速增长后，项目更名为 **Moltbot**（取自龙虾蜕壳 "molt" 的意象），加入了记忆系统与多平台支持。这个阶段奠定了四层式架构的基础。

### 第三阶段：OpenClaw（2025 年初至今）

正式更名为 **OpenClaw**，引入了 ClawHub 技能市场、沙箱执行环境、以及完整的安全架构。2025 年底突破 200K GitHub Stars，成为增长最快的开源 AI 项目之一。

:::tip 创始人动态
Peter Steinberger 于 2026 年 2 月加入 OpenAI，但 OpenClaw 作为开源项目将继续由社区驱动发展。
:::

---

## 四层式架构概览

OpenClaw 采用清晰的四层架构设计，每一层各司其职：

```
┌─────────────────────────────────────────┐
│  第一层：Gateway（网关层）               │
│  Port 18789 — 统一接收所有通讯平台消息   │
├─────────────────────────────────────────┤
│  第二层：Reasoning Layer（推理层）       │
│  连接 LLM 模型、处理意图识别与响应生成   │
├─────────────────────────────────────────┤
│  第三层：Memory System（记忆系统）       │
│  WAL + Markdown 压缩、长期记忆管理       │
├─────────────────────────────────────────┤
│  第四层：Skills / Execution Layer       │
│  （技能 / 执行层）沙箱环境中执行技能     │
└─────────────────────────────────────────┘
```

### 第一层：Gateway（网关层）

Gateway 是 OpenClaw 的入口，默认监听 **port 18789**。它负责统一接收来自各通讯平台的消息，将其转换为内部标准格式后交给推理层处理。

:::danger 安全警告
Gateway 的 18789 端口是 OpenClaw 最大的攻击面。截至 2026 年初，已有超过 **30,000 个实例**因为将此端口暴露于公开网络（绑定 `0.0.0.0`）而遭到入侵。请务必绑定到 `127.0.0.1`。详见 [安全性最佳实践](/docs/security/best-practices)。
:::

### 第二层：Reasoning Layer（推理层）

推理层是 OpenClaw 的大脑。它会将用户的消息发送给所配置的 LLM 模型（如 Claude Opus 4.6、GPT-5.2 Codex 等），获取响应后决定下一步行动——可能是直接回复、调用技能、或查询记忆。

### 第三层：Memory System（记忆系统）

记忆系统采用 **WAL（Write-Ahead Log）** 加上 **Markdown 压缩** 的混合方案。短期记忆使用 WAL 快速写入，长期记忆则会定期压缩为结构化的 Markdown 文件，实现高效的上下文管理。

### 第四层：Skills / Execution Layer（技能 / 执行层）

所有技能都在**沙箱环境**中执行，防止恶意代码影响系统。技能可以访问网络、文件系统（受限范围）、以及外部 API，但都受到严格的权限管控。

:::tip 深入学习
想了解架构的更多细节？请前往 [架构概览](/docs/architecture/overview) 页面。
:::

---

## 安全性概览

OpenClaw 的安全问题不容忽视。以下是几个重大安全事件：

| 事件 | 说明 |
|------|------|
| **CVE-2026-25253** | Gateway 远程代码执行漏洞，影响 v3.x 之前的版本 |
| **ClawHavoc 事件** | 2,400+ 个恶意技能被植入 ClawHub，后已全数移除 |
| **18789 端口暴露** | 30,000+ 个实例因错误配置而遭入侵 |

:::warning 使用 OpenClaw 前，请务必阅读
安全性不是可选的。每一位用户都应该在开始使用前阅读 [安全性最佳实践](/docs/security/best-practices) 与 [技能审计清单](/docs/security/skill-audit-checklist)。
:::

---

## 谁适合使用 OpenClaw？

| 用户类型 | 适合原因 |
|-----------|---------|
| **开发者** | 可自行开发技能、深度定制、整合到现有工作流程 |
| **重视隐私的用户** | 完全本地运行，数据不离开你的计算机 |
| **社区运营者** | 一个 AI 同时管理多个通讯平台的社区 |
| **自动化爱好者** | 通过技能组合实现复杂的自动化流程 |
| **企业 IT 团队** | 可在内网部署，支持企业级安全配置 |

如果你只是需要一个简单的聊天机器人，商用方案（如 ChatGPT 的现成应用）可能更适合你。OpenClaw 的强项在于**深度定制**与**多平台整合**——它更像是一个你可以"养成"的 AI 代理，而非一个即用即弃的工具。

---

## 下一步

准备好开始了吗？跟着这个顺序，你将在 30 分钟内启动你的第一个 OpenClaw 实例：

1. [安装指南](./getting-started/installation.md) — 安装 OpenClaw 到你的系统
2. [首次设置](./getting-started/first-setup.md) — 完成初始配置
3. [连接通讯平台](./getting-started/connect-channels.md) — 连接你的第一个通讯平台
4. [选择 AI 模型](./getting-started/choose-llm.md) — 配置 LLM 提供商
5. [SOUL.md 人格配置](./getting-started/soul-md-config.md) — 打造你的 AI 人格

欢迎加入超过 250,000 位开发者的行列，一起养龙虾！
