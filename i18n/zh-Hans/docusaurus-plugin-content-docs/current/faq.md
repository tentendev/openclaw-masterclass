---
title: 常见问题 FAQ
description: OpenClaw 最常见的问题解答——从基本概念、安全性、费用到高级使用的完整 FAQ。
sidebar_position: 99
---

# 常见问题 FAQ

本页收录了 OpenClaw 新手和高级用户最常提出的问题。

---

## 基本概念

### Q：OpenClaw 是什么？跟 ChatGPT 有什么不同？

**A：** OpenClaw 是一个开源的**自主 AI Agent 平台**，运行在你自己的计算机上。与 ChatGPT 的主要差异：

| 比较项目 | ChatGPT | OpenClaw |
|---------|---------|---------|
| 运行位置 | OpenAI 云端 | 你的本地计算机 |
| 数据控制 | OpenAI 拥有 | 你自己掌控 |
| 自主移动 | 只能对话 | 能自主执行任务（发邮件、控制家电等） |
| 多平台整合 | 只有 ChatGPT 界面 | 20+ 通讯平台（Telegram、Discord 等） |
| 可扩展性 | 有限的 GPTs | 13,000+ ClawHub 技能 |
| 费用 | 月费制 | 开源免费（需自付 LLM API 费用） |

### Q：OpenClaw 是免费的吗？

**A：** OpenClaw 本身是**开源免费**的（MIT 许可证）。但你需要自行承担以下费用：

- **LLM API 费用** — 使用 Claude、GPT 等云端模型需要付费。使用 Ollama 搭配本地模型则免费。
- **通讯平台** — 大部分免费（Telegram Bot、Discord Bot 等），少数可能有费用。
- **硬件** — 你自己的计算机或服务器。

典型的月费用：

| 使用程度 | 预估月费 |
|---------|---------|
| 轻度（每天几次对话） | $5-15 |
| 中度（日常助手） | $15-50 |
| 重度（多 Agent + 自动化） | $50-200+ |
| 全本地（Ollama） | $0（电费除外） |

### Q："养龙虾"是什么意思？

**A：** 这是 OpenClaw 在亚洲社区的昵称。"Claw"（螯）是龙虾的爪子，OpenClaw 的吉祥物 **Molty** 是一只龙虾。用户把设置和训练 OpenClaw Agent 的过程比喻为"养龙虾"——需要喂食（SOUL.md 配置）、训练（记忆积累）和照顾（维护更新）。

### Q：我需要会写程序才能使用 OpenClaw 吗？

**A：** 基本使用不需要编程能力。安装和配置可以跟着教程步骤完成。日常使用就是通过通讯软件（如 Telegram）与 Agent 对话。

高级使用（自定义技能、API 整合、多 Agent 部署）则需要一定的编程基础。

---

## 安全性

### Q：OpenClaw 安全吗？

**A：** OpenClaw 本身的设计是安全的，但**配置不当**会造成严重的安全风险。已知的安全问题包括：

- **CVE-2026-25253**：Gateway 远程代码执行漏洞（已修补）
- **ClawHavoc**：2,400+ 个恶意技能被植入 ClawHub（已清除）
- **30,000+ 个实例**因暴露 Gateway 端口而被入侵

**只要正确配置**（绑定 localhost、启用认证、使用 Podman rootless），OpenClaw 是安全的。详见 [安全性最佳实践](/docs/security/best-practices)。

### Q：我的对话数据会被上传吗？

**A：** OpenClaw 本身**不会上传**你的数据。但你使用的 LLM 提供商会接收你的对话内容：

- **云端 LLM**（Claude、GPT 等）：你的对话会发送到提供商的服务器进行处理
- **本地 LLM**（Ollama）：所有数据都留在你的计算机上，完全离线

如果你极度重视隐私，建议使用 Ollama 搭配本地模型。

### Q：ClawHub 上的技能安全吗？

**A：** ClawHub 上的技能由社区开发者提交，**不保证安全**。ClawHavoc 事件后，ClawHub 新增了 VirusTotal 扫描，但自动扫描无法检测所有恶意行为。

安装任何技能前，请先完成 [技能审计清单](/docs/security/skill-audit-checklist) 的检查。

### Q：为什么推荐 Podman 而不是 Docker？

**A：** Docker daemon 以 root 权限运行。如果技能沙箱被突破，攻击者可能获得主机的 root 权限。Podman 的 rootless 模式不需要 root，即使沙箱被突破也只能获取普通用户权限，大幅降低风险。

---

## 安装与配置

### Q：OpenClaw 支持哪些操作系统？

**A：**

| 操作系统 | 支持状态 |
|---------|---------|
| macOS 13+ | 完全支持 |
| Ubuntu 22.04+ | 完全支持 |
| Debian 12+ | 完全支持 |
| Fedora 38+ | 完全支持 |
| Arch Linux | 社区支持（AUR） |
| Windows 11 (WSL2) | 支持（需 WSL2） |
| Windows（原生） | 不支持 |
| ChromeOS | 不支持 |

### Q：最低硬件需求是什么？

**A：**

| 项目 | 最低 | 建议 | 重度使用 |
|------|------|------|---------|
| CPU | 2 核心 | 4 核心 | 8+ 核心 |
| RAM | 4 GB | 8 GB | 16+ GB |
| 磁盘 | 2 GB | 5 GB | 20+ GB |
| GPU | 不需要 | 不需要 | Nvidia（本地 LLM 加速） |

### Q：如何更新 OpenClaw？

**A：**
```bash
# npm 安装
npm install -g @openclaw/cli@latest

# Homebrew 安装
brew upgrade openclaw

# 更新后执行迁移
openclaw migrate

# 验证
openclaw doctor
```

---

## LLM 与模型

### Q：OpenClaw 支持哪些 LLM？

**A：** 支持所有主流 LLM 提供商：

| 提供商 | 模型 | 适合用途 |
|--------|------|---------|
| Anthropic | Claude Opus 4.6、Sonnet 4.5 | 通用对话、复杂推理 |
| OpenAI | GPT-5.2 Codex、GPT-4.1 | 代码生成、通用对话 |
| Google | Gemini 2.5 Pro | 多模态、长上下文 |
| DeepSeek | DeepSeek-V3 | 性价比高 |
| Ollama（本地） | Llama 3.3、Qwen 2.5、Mistral | 离线使用、隐私优先 |
| Groq | 各种开源模型 | 超低延迟 |

### Q：用哪个模型最好？

**A：** 取决于你的需求：

- **最佳通用对话**：Claude Opus 4.6
- **最佳代码生成**：GPT-5.2 Codex
- **最佳性价比**：DeepSeek-V3 或 Claude Sonnet 4.5
- **最佳隐私**：Ollama + Llama 3.3（完全本地）
- **最低延迟**：Groq

建议配置多个模型并使用 LLM Router 根据任务类型自动路由。

### Q：可以同时使用多个 LLM 吗？

**A：** 可以。OpenClaw 的 LLM Router 支持根据任务类型路由到不同模型。例如：代码用 GPT-5.2，对话用 Claude，简单任务用本地模型。

---

## 技能与 ClawHub

### Q：有哪些推荐的技能？

**A：** 请参考 [Top 50 必装 Skills](/docs/top-50-skills/overview)，包含各类别的推荐技能和安全评级。

### Q：如何自己开发技能？

**A：** 技能本质上是一个符合 OpenClaw manifest 格式的 Node.js 或 Python 程序。基本步骤：

1. 创建 `manifest.yaml` 声明技能元数据和权限
2. 编写主要逻辑（`index.js` 或 `main.py`）
3. 本地测试
4. 发布到 ClawHub

详见 [MasterClass 模块 3: Skills 系统](/docs/masterclass/module-03-skills-system)。

### Q：技能可以访问我的计算机吗？

**A：** 技能在容器沙箱中执行，**默认不能**访问你的计算机。技能需要在 `manifest.yaml` 中声明所需的权限（网络、文件系统、shell 等），你可以通过 `permissions.override.yaml` 进一步限制。

---

## 通讯平台

### Q：可以同时连接多个通讯平台吗？

**A：** 可以。这是 OpenClaw 的核心功能之一。你可以同时连接 Telegram、Discord、WhatsApp、Slack、LINE 等多个平台，所有消息都由同一个 Agent 处理。

### Q：Agent 在不同平台间会共享记忆吗？

**A：** 是的。记忆系统是统一的，不论用户从哪个平台发消息，Agent 都能访问完整的记忆。

### Q：可以设置不同平台有不同的回复风格吗？

**A：** 可以。在 SOUL.md 中可以针对不同平台设置不同的行为：

```markdown
## 平台特定行为
- Telegram：回复简洁，使用 emoji
- Slack：回复专业，使用 Markdown 格式
- Discord：口语化，可以开玩笑
```

---

## 记忆与 SOUL.md

### Q：SOUL.md 是什么？

**A：** SOUL.md 是一个 Markdown 文件，定义了你的 Agent 的人格、行为规则、安全边界和日常任务。它是 Agent 的"灵魂"——决定了 Agent 如何思考和移动。

### Q：Agent 能记住多长时间的对话？

**A：** 理论上无限。OpenClaw 的记忆系统会将所有对话存入 WAL，并定期压缩为长期记忆。但每次互动中，Agent 只能在 LLM 的上下文窗口限制内访问最近的对话和相关的长期记忆。

### Q：如何让 Agent 忘记某些事情？

**A：**
```bash
# 删除特定对话
openclaw memory delete --conversation-id "conv_abc123"

# 清理特定时间段
openclaw memory prune --before "2025-01-01"

# 完全重置
openclaw memory reset --confirm
```

---

## 社区与学习

### Q：遇到问题去哪里求助？

**A：**

1. [本站疑难排解](/docs/troubleshooting/common-issues) — 常见问题的即时解答
2. [GitHub Issues](https://github.com/openclaw/openclaw/issues) — 正式的 bug 上报
3. [Discord #help](https://discord.gg/openclaw) — 即时社区支持
4. [Reddit r/openclaw](https://reddit.com/r/openclaw) — 讨论与搜索历史问题

### Q：有官方的学习课程吗？

**A：** 本站的 [MasterClass 课程](/docs/masterclass/overview) 是目前最完整的学习资源，涵盖从基础到高级的 12 个模块。

---

## 延伸阅读

- [OpenClaw 是什么？](/docs/intro) — 完整介绍
- [安装指南](/docs/getting-started/installation) — 开始使用
- [MasterClass 课程](/docs/masterclass/overview) — 系统化学习
- [术语表](/docs/glossary) — 名词解释
