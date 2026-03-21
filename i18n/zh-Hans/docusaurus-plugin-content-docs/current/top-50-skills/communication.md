---
sidebar_position: 4
title: "通信 Skills"
description: "OpenClaw 通信类 Skills 完整评测：Slack、WhatsApp CLI、Telegram Bot、AgentMail、Matrix Chat"
keywords: [OpenClaw, Skills, Communication, Slack, WhatsApp, Telegram, AgentMail, Matrix]
---

# 通信 Skills (Communication)

通信类 Skills 让 OpenClaw Agent 跨越不同消息平台，成为你的统一通信助手。从企业级 Slack 到个人 WhatsApp，Agent 都能帮你读取、回复和管理消息。

---

## #7 — Slack

| 属性 | 内容 |
|------|------|
| **排名** | #7 / 50 |
| **类别** | Communication |
| **总分** | 64 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区（steipete） |
| **安装方式** | `clawhub install steipete/slack` |
| **目标用户** | Slack 用户、团队协作 |

### 功能说明

由知名开发者 steipete 维护的 Slack 集成 Skill：

- 读取和搜索频道消息
- 发送消息和回复 thread
- 管理 Direct Messages
- 配置和触发 Slack 通知
- 频道摘要生成
- 支援 Slack Blocks 格式化消息

### 为什么重要

Slack 是知识工作者每天花最多时间的工具之一。让 Agent 帮你追踪重要频道、摘要长 thread、自动回复常见问题，可以大幅降低「Context switching」的成本。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | **64** |

### 安装与配置

```bash
clawhub install steipete/slack

# 使用 Slack Bot Token 授权
openclaw skill configure slack \
  --bot-token xoxb-xxxxxxxxxxxx \
  --app-token xapp-xxxxxxxxxxxx

# 配置要监听的频道
openclaw skill configure slack \
  --watch-channels general,engineering,random
```

:::warning Slack Workspace 管理员权限
安装 Slack Skill 需要 Workspace 管理员批准 Bot 应用进程。建议先在测试用的 Workspace 中验证功能。
:::

### 依赖与安全

- **依赖**：Slack Bot Token + App Token
- **权限需求**：`channels:read`, `channels:history`, `chat:write`, `users:read`
- **安全性**：SEC 8/10 — Slack Bot 权限模型成熟，可精细控制频道存取
- **替代方案**：Microsoft Teams 用户可关注社区开发中的 `community/teams-claw`

---

## #24 — AgentMail

| 属性 | 内容 |
|------|------|
| **排名** | #24 / 50 |
| **类别** | Communication |
| **总分** | 56 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/agentmail` |
| **目标用户** | 需要 Agent 专用邮箱的用户 |

### 功能说明

为 Agent 创建独立的受管理 Email 身份：

- 创建 Agent 专用邮箱（`your-agent@agentmail.dev`）
- 收发邮件不影响你的个人邮箱
- 自动回复规则配置
- 多个 Agent 身份管理
- 与 Gmail Skill 隔离的安全邮箱

### 为什么重要

直接让 Agent 存取你的个人 Gmail 有安全风险。AgentMail 提供一个「Agent 专用邮箱」概念 — Agent 只能存取这个隔离的邮箱，即使出错也不会影响你的主要邮箱。这是比 Gmail Skill 的 draft-only mode 更彻底的隔离方案。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 6 | 7 | 7 | 7 | 7 | 8 | **56** |

### 安装与配置

```bash
clawhub install community/agentmail

# 注册 Agent 邮箱
openclaw skill configure agentmail \
  --create-identity my-agent \
  --domain agentmail.dev

# 配置自动转寄规则（将特定邮件从个人邮箱转到 Agent 邮箱）
openclaw skill configure agentmail \
  --forward-from your@gmail.com \
  --filter "subject:invoice OR subject:receipt"
```

### 依赖与安全

- **依赖**：AgentMail 服务账号
- **权限需求**：AgentMail API（仅限 Agent 邮箱）
- **安全性**：SEC 7/10 — 设计上比直接存取个人邮箱安全，但依赖第三方服务
- **替代方案**：Gmail Skill + draft-only mode

---

## #26 — Telegram Bot

| 属性 | 内容 |
|------|------|
| **排名** | #26 / 50 |
| **类别** | Communication |
| **总分** | 55 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/telegram-claw` |
| **目标用户** | Telegram 用户、需要移动端 Agent 交互 |

### 功能说明

将 OpenClaw Agent 包装为 Telegram Bot：

- 透过 Telegram 与 Agent 对话
- 接收 Agent 的主动通知
- 分享文件和图片给 Agent 处理
- 支援群组模式（Agent 作为群组成员）
- 语音消息转文字处理

### 为什么重要

Telegram Bot 让你随时随地透过手机与 Agent 交互。不需要坐在电脑前，出门在外也能请 Agent 帮忙处理任务。这是最简单的「移动端 Agent」方案。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 6 | 7 | 7 | 7 | 7 | 7 | **55** |

### 安装与配置

```bash
clawhub install community/telegram-claw

# 1. 先从 @BotFather 获取 Bot Token
# 2. 配置 Skill
openclaw skill configure telegram-claw \
  --bot-token 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 \
  --allowed-users your_telegram_id
```

:::warning 公开存取风险
务必配置 `--allowed-users`，限制只有你的 Telegram 账号可以与 Bot 交互。否则任何人找到你的 Bot 都能操控你的 Agent。
:::

### 依赖与安全

- **依赖**：Telegram Bot Token（从 @BotFather 获取）
- **权限需求**：Telegram Bot API
- **安全性**：SEC 7/10 — 需要严格配置存取控制
- **替代方案**：WhatsApp CLI（#33）, Discord Bot（社区开发中）

---

## #33 — WhatsApp CLI

| 属性 | 内容 |
|------|------|
| **排名** | #33 / 50 |
| **类别** | Communication |
| **总分** | 52 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区（第三方） |
| **安装方式** | `clawhub install community/whatsapp-claw` |
| **目标用户** | WhatsApp 重度用户 |

### 功能说明

透过 wacli（WhatsApp CLI）工具与 WhatsApp 交互：

- 读取和发送消息
- 群组消息管理
- 媒体文件收发
- 联络人搜索

### 为什么重要

在亚洲和欧洲市场，WhatsApp 是主要的实时通信工具。这个 Skill 填补了 OpenClaw 在 WhatsApp 集成上的缺口。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 6 | 7 | 5 | 6 | 7 | 8 | **52** |

### 安装与配置

```bash
clawhub install community/whatsapp-claw

# 需要先安装 wacli
brew install wacli  # macOS
# 或
pip install wacli   # 跨平台

# 扫描 QR Code 登入
wacli login

# 配置 Skill
openclaw skill configure whatsapp-claw
```

:::warning 非官方 API
WhatsApp CLI 使用非官方的 WhatsApp Web API，有被封锁账号的风险。Meta 可能随时变更 API 导致功能失效。建议用于个人实验，不要用于重要的商业通信。
:::

### 依赖与安全

- **依赖**：wacli 工具、WhatsApp 账号
- **权限需求**：WhatsApp Web Session
- **安全性**：SEC 7/10 — 非官方 API 有账号风险，但不传输数据到第三方
- **替代方案**：Telegram Bot（#26）较稳定且使用官方 API

---

## #50 — Matrix Chat

| 属性 | 内容 |
|------|------|
| **排名** | #50 / 50 |
| **类别** | Communication |
| **总分** | 43 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/matrix-claw` |
| **目标用户** | Matrix/Element 用户、隐私优先者 |

### 功能说明

与 Matrix 去中心化通信协议集成：

- 收发加密消息
- 房间管理
- 基本的 Bot 功能

### 为什么重要

Matrix 是开源、去中心化的通信协议，特别受到重视隐私和开源精神的用户欢迎。虽然目前功能有限，但对于 Matrix 社区的用户来说是唯一选择。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 5 | 5 | 3 | 5 | 5 | 6 | 8 | 6 | **43** |

### 安装与配置

```bash
clawhub install community/matrix-claw

openclaw skill configure matrix-claw \
  --homeserver https://matrix.org \
  --username @your-bot:matrix.org \
  --password your_password
```

### 依赖与安全

- **依赖**：Matrix Homeserver 账号
- **权限需求**：Matrix Client API
- **安全性**：SEC 8/10 — 支援端对端加密，隐私性最佳
- **替代方案**：Slack（#7）for 企业、Telegram（#26）for 个人

---

## 通信 Skills 比较表

| 特性 | Slack | Telegram | WhatsApp | AgentMail | Matrix |
|------|:-----:|:--------:|:--------:|:---------:|:------:|
| 企业适用 | ✅ | ❌ | ❌ | ✅ | ✅ |
| 移动端交互 | ✅ | ✅ | ✅ | ❌ | ✅ |
| 官方 API | ✅ | ✅ | ❌ | ✅ | ✅ |
| 端对端加密 | ❌ | ✅ | ✅ | ❌ | ✅ |
| 配置难度 | 中等 | 简单 | 复杂 | 简单 | 复杂 |
| 成熟度 | 🟡 | 🟡 | 🟠 | 🟡 | 🟠 |

### 通信组合推荐

```bash
# 企业团队
clawhub install steipete/slack
clawhub install community/agentmail

# 个人使用
clawhub install community/telegram-claw
# 搭配内建 Gmail

# 隐私优先
clawhub install community/matrix-claw
clawhub install community/agentmail
```
