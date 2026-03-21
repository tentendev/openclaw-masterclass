---
title: "模块 8: 多 Agent 架构"
sidebar_position: 9
description: "学习 OpenClaw 的多 Agent 协作架构，透过 Discord/Matrix 实现跨机器 Agent 通信，构建 Agent 团队"
keywords: [OpenClaw, multi-agent, 多 Agent, orchestration, Discord, Matrix, 协作]
---

# 模块 8: 多 Agent 架构

## 学习目标

完成本模块后，你将能够：

- 理解 OpenClaw 多 Agent 架构的设计哲学
- 配置跨机器的 Agent 通信（透过 Discord / Matrix）
- 设计并实现 Agent 角色分工
- 构建一个 3 Agent 协作团队（研究员、写手、审稿者）
- 管理 Agent 之间的消息流与任务协调
- 处理多 Agent 环境中的冲突与错误

## 核心概念

### 多 Agent 的设计哲学

OpenClaw 的多 Agent 架构有一个独特的理念：**Agent 之间不是透过专用的 API 通信，而是透过与人类相同的通信管道（Discord、Matrix）进行对话**。这个设计带来几个优势：

1. **人类可观察** — 所有 Agent 对话都在 Discord 频道中可见
2. **人类可介入** — 随时可以加入对话、修正方向
3. **零额外基础设施** — 不需要专用的 message queue 或 RPC 框架
4. **自然语言协议** — Agent 用自然语言沟通，而非固定格式的 API

```
┌─────────────────────────────────────────┐
│           Discord / Matrix 服务器        │
│                                         │
│  #research-channel                      │
│    ├── 🤖 Agent-Researcher              │
│    └── 👤 Human Observer                │
│                                         │
│  #writing-channel                       │
│    ├── 🤖 Agent-Writer                  │
│    └── 🤖 Agent-Reviewer                │
│                                         │
│  #coordination-channel                  │
│    ├── 🤖 Agent-Researcher              │
│    ├── 🤖 Agent-Writer                  │
│    ├── 🤖 Agent-Reviewer                │
│    └── 👤 Human Manager                 │
└─────────────────────────────────────────┘

Machine A: Agent-Researcher (OpenClaw Instance 1)
Machine B: Agent-Writer     (OpenClaw Instance 2)
Machine C: Agent-Reviewer   (OpenClaw Instance 3)
```

### Agent 角色模型

| 角色 | 职责 | 所需 Skills | 典型 LLM |
|------|------|-------------|----------|
| **Coordinator** | 分配任务、监督进度 | task-manager, scheduler | GPT-4o / Claude |
| **Researcher** | 信息收集、网页爬取 | web-search, browser, summarizer | GPT-4o |
| **Writer** | 内容创作、文件撰写 | text-generator, markdown-tools | Claude |
| **Reviewer** | 品质审查、事实查核 | fact-checker, grammar-check | GPT-4o |
| **Coder** | 进程开发、调试 | code-runner, git-tools | Claude / Codex |

### 通信模式

OpenClaw 支援三种多 Agent 通信模式：

**1. 直接提及（Direct Mention）**
```
Agent-Researcher: @Agent-Writer 研究已完成，以下是 AI 产业的 5 个关键趋势...
```

**2. 频道广播（Channel Broadcast）**
```
Agent-Coordinator: 各位，本周任务分配如下：
- @Agent-Researcher 负责调研 NemoClaw 最新进展
- @Agent-Writer 负责撰写技术文件
- @Agent-Reviewer 负责审稿
```

**3. 私讯转发（DM Relay）**
```
Agent-A → DM → Agent-B: [机密数据，不在公开频道发送]
```

## 实现教程

### 步骤一：准备 Discord 环境

首先创建一个专用的 Discord 服务器作为多 Agent 的通信平台：

```bash
# 创建 3 个 Discord Bot（每个 Agent 一个）
# 前往 https://discord.com/developers/applications
# 为每个 Bot 创建 Application 并获取 Token
```

建议的频道结构：

```
📂 Agent Team
  ├── 📝 #coordination    (所有 Agent + 人类)
  ├── 🔬 #research        (Researcher 的工作区)
  ├── ✍️  #writing          (Writer 的工作区)
  ├── 📋 #review          (Reviewer 的工作区)
  └── 📊 #results         (最终成果发布)
```

### 步骤二：配置 Agent 实例

**Agent 1 — Researcher（研究员）：**

```json
// machine-a/settings.json
{
  "name": "Agent-Researcher",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_RESEARCHER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "research"],
      "respond_to_mentions": true,
      "respond_to_channels": ["research"]
    }
  },
  "skills": [
    "web-search",
    "browser-tools",
    "summarizer",
    "note-taker"
  ],
  "llm": {
    "provider": "openai",
    "model": "gpt-4o"
  }
}
```

Researcher 的 `soul.md`：

```markdown
# Agent-Researcher

你是一个专业的研究员 Agent。你的职责是：

1. 接收来自 @Agent-Coordinator 或人类的研究任务
2. 使用网页搜索和浏览器工具收集信息
3. 整理研究结果为结构化摘要
4. 将结果发布到 #research 频道
5. 通知 @Agent-Writer 研究已完成

## 工作流程
- 收到任务后先确认理解，回复「收到，开始研究：[主题]」
- 研究过程中每 10 分钟在 #research 发布进度
- 完成后在 #coordination 频道 @ 通知相关人员
- 如果遇到困难或需要更多信息，主动询问

## 限制
- 不要自行创作内容，只收集和整理事实
- 引用必须附上来源链接
- 研究时间超过 30 分钟需要回报
```

**Agent 2 — Writer（写手）：**

```json
// machine-b/settings.json
{
  "name": "Agent-Writer",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_WRITER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "writing", "research"],
      "respond_to_mentions": true,
      "respond_to_channels": ["writing"]
    }
  },
  "skills": [
    "text-generator",
    "markdown-tools",
    "grammar-check"
  ],
  "llm": {
    "provider": "anthropic",
    "model": "claude-sonnet-4-20250514"
  }
}
```

Writer 的 `soul.md`：

```markdown
# Agent-Writer

你是一个专业的技术写手 Agent。你的职责是：

1. 监听 #research 频道，接收 @Agent-Researcher 的研究结果
2. 根据研究结果撰写技术文件或博客文章
3. 将草稿发布到 #writing 频道
4. 收到 @Agent-Reviewer 的修改建议后进行修订
5. 最终版本发布到 #results 频道

## 写作风格
- 使用简体中文，技术术语保留英文
- 段落清晰，善用标题、列表、代码区块
- 每篇文章 800-1500 字
- 附上参考数据来源

## 协作规则
- 收到研究结果后回复「收到，预计 [X] 分钟完成初稿」
- 初稿完成后 @ 通知 @Agent-Reviewer
- 修订后附上变更说明
```

**Agent 3 — Reviewer（审稿者）：**

```json
// machine-c/settings.json
{
  "name": "Agent-Reviewer",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_REVIEWER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "writing", "review"],
      "respond_to_mentions": true,
      "respond_to_channels": ["review", "writing"]
    }
  },
  "skills": [
    "fact-checker",
    "grammar-check",
    "readability-scorer"
  ],
  "llm": {
    "provider": "openai",
    "model": "gpt-4o"
  }
}
```

### 步骤三：启动多 Agent 环境

在各台机器上分别启动：

```bash
# Machine A
cd /opt/openclaw-researcher
openclaw start --config settings.json

# Machine B
cd /opt/openclaw-writer
openclaw start --config settings.json

# Machine C
cd /opt/openclaw-reviewer
openclaw start --config settings.json
```

或在同一台机器使用不同 port：

```bash
# 同一台机器，不同 port
openclaw start --config researcher/settings.json --port 18789
openclaw start --config writer/settings.json --port 18790
openclaw start --config reviewer/settings.json --port 18791
```

:::caution 同机部署注意
在同一台机器上运行多个 Agent 时，确保每个实例使用不同的：
- HTTP API port（`--port`）
- 数据目录（`--data-dir`）
- Discord Bot Token（每个 Agent 必须是不同的 Bot）
:::

### 步骤四：触发协作流程

在 Discord 的 #coordination 频道中发出命令：

```
人类: @Agent-Researcher 请研究 NemoClaw 的最新技术架构与应用场景，
      完成后交给 @Agent-Writer 撰写一篇技术介绍文章。

Agent-Researcher: 收到，开始研究：NemoClaw 技术架构与应用场景。
                  预计 15 分钟完成。

[15 分钟后，在 #research 频道]

Agent-Researcher: 研究完成！以下是 NemoClaw 的关键发现：
                  1. NemoClaw = Nemotron + OpenClaw + OpenShell
                  2. 由 NVIDIA 于 GTC 2026 发表
                  3. Jensen Huang 称之为「可能是史上最重要的软件发布」
                  ...
                  @Agent-Writer 研究结果已发布，请开始撰写。

Agent-Writer: 收到研究结果，预计 20 分钟完成初稿。

[20 分钟后，在 #writing 频道]

Agent-Writer: 初稿完成！请 @Agent-Reviewer 审阅。
              [文章内容...]

Agent-Reviewer: 审阅完成，以下是修改建议：
               1. 第 3 段缺少来源引用
               2. 建议加入性能比较表格
               3. 结论段落可以更加具体
               @Agent-Writer 请修订。

Agent-Writer: 修订完成，已更新至 #results。
```

### 步骤五：进阶 — Coordinator Agent

创建一个 Coordinator Agent 来自动化任务分配：

```javascript
// skills/task-coordinator/index.js
module.exports = {
  name: "task-coordinator",
  description: "协调多 Agent 任务分配",

  async execute(context) {
    const { params, channel } = context;
    const { task, deadline } = params;

    // 分解任务
    const subtasks = await context.agent.think(
      `将以下任务分解为研究、撰写、审稿三个子任务：\n${task}`
    );

    // 分配任务
    await channel.send(
      `📋 **新任务分配**\n\n` +
      `主题: ${task}\n` +
      `截止时间: ${deadline}\n\n` +
      `1️⃣ @Agent-Researcher ${subtasks.research}\n` +
      `2️⃣ @Agent-Writer 等待研究完成后开始\n` +
      `3️⃣ @Agent-Reviewer 等待初稿完成后审阅\n\n` +
      `请各 Agent 确认收到。`
    );

    return { distributed: true, subtasks };
  }
};
```

## 常见错误

:::danger Agent 循环对话
最危险的问题是两个 Agent 互相触发、无限对话，快速消耗 LLM API 额度。

预防措施：
1. 在 `soul.md` 中明确规定「不要回复非指定对象的消息」
2. 配置 `rate_limit` 限制每分钟消息数量
3. 加入 `cooldown_seconds` 冷却时间
4. 监控 API 使用量并配置上限

```json
{
  "safety": {
    "max_messages_per_minute": 5,
    "cooldown_seconds": 10,
    "max_consecutive_self_replies": 2,
    "api_budget_daily_usd": 10.00
  }
}
```
:::

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| Agent 无法看到其他 Agent 消息 | Bot 缺少频道读取权限 | 检查 Discord Bot 的 Permissions |
| Agent 回复自己的消息 | 未过滤 Bot 消息 | 配置 `ignore_bot_messages: false` 但加入 ID 白名单 |
| 任务顺序混乱 | 缺少明确的工作流程定义 | 在 `soul.md` 中定义清楚的前置条件 |
| 消息延迟超过 30 秒 | LLM API 延迟或排队 | 使用较快的模型或增加 timeout |
| Agent 误解其他 Agent 的输出 | 输出格式不一致 | 定义统一的 output format |

## 故障排除

### 检查 Agent 连接状态

```bash
# 检查各 Agent 是否在线
curl http://127.0.0.1:18789/api/status  # Researcher
curl http://127.0.0.1:18790/api/status  # Writer
curl http://127.0.0.1:18791/api/status  # Reviewer

# 检查 Discord 连接
curl http://127.0.0.1:18789/api/channels/discord/status
```

### Agent 通信调试

```bash
# 启用详细日志
openclaw start --config settings.json --log-level debug

# 监控 Agent 间的消息流
tail -f logs/openclaw.log | grep -E "(send|receive|mention)"
```

### 强制停止失控的 Agent

```bash
# 透过 API 暂停 Agent
curl -X POST http://127.0.0.1:18789/api/pause

# 或直接停止进程
openclaw stop --config settings.json
```

## 练习题

### 练习 1：双 Agent 对话
配置两个 Agent（Teacher 和 Student），让 Teacher 出一道数学题，Student 回答，Teacher 批改。限制最多 5 轮对话。

### 练习 2：三人研究团队
按照本模块教程，构建 Researcher / Writer / Reviewer 三人团队，完成一篇关于「2026 AI Agent 趋势」的文章。

### 练习 3：容错机制
修改三人团队的配置，加入：
- Reviewer 退回超过 2 次时，通知人类介入
- 任何 Agent 超过 10 分钟没有响应时自动提醒
- 每日 API 费用上限为 $5 USD

## 随堂测验

1. **OpenClaw 的多 Agent 通信为什么选择 Discord/Matrix 而非专用 API？**
   - A) 技术限制
   - B) 让人类可以观察和介入 Agent 对话
   - C) Discord 比较快
   - D) 降低 API 费用

   <details><summary>查看答案</summary>B) 透过 Discord/Matrix 等公开频道通信，人类可以随时观察 Agent 之间的对话，并在必要时介入修正，这是 OpenClaw 多 Agent 设计的核心理念。</details>

2. **如何防止两个 Agent 陷入无限对话循环？**
   - A) 不使用多 Agent
   - B) 配置 rate limit、cooldown、最大连续回复数
   - C) 使用不同的 LLM
   - D) 减少 Agent 数量

   <details><summary>查看答案</summary>B) 透过 `max_messages_per_minute`、`cooldown_seconds` 和 `max_consecutive_self_replies` 等参数限制消息频率，可以有效防止循环。</details>

3. **在同一台机器上运行多个 Agent 时，必须确保什么？**
   - A) 使用相同的配置文件
   - B) 使用不同的 port、数据目录和 Bot Token
   - C) 使用相同的 LLM provider
   - D) 共用同一个 Discord Bot

   <details><summary>查看答案</summary>B) 每个 Agent 实例需要独立的 HTTP port、数据目录和 Discord Bot Token，避免冲突。</details>

4. **Coordinator Agent 的主要功能是什么？**
   - A) 取代人类管理者
   - B) 分解任务、分配工作、监督进度
   - C) 运行所有 Skill
   - D) 管理 API Key

   <details><summary>查看答案</summary>B) Coordinator 负责将大任务拆解为子任务，分配给专责 Agent，并追踪整体进度。</details>

## 建议下一步

- [模块 9: 安全性](./module-09-security) — 多 Agent 环境的安全风险与防护
- [模块 10: 正式环境部署](./module-10-production) — 在 VPS 上稳定运行多 Agent 系统
- [模块 12: 企业级应用](./module-12-enterprise) — 企业环境中的大规模多 Agent 部署
