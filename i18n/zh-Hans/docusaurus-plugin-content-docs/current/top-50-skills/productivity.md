---
sidebar_position: 2
title: "生产力 Skills"
description: "OpenClaw 生产力类 Skills 完整评测：Gmail、Calendar、Obsidian、Notion、Todoist、GOG、Things 3、Summarize"
keywords: [OpenClaw, Skills, 生产力, Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize]
---

# 生产力 Skills (Productivity)

生产力类 Skills 是多数用户安装 OpenClaw 后的第一站。这些 Skills 让你的 AI Agent 能直接操作邮件、日历、笔记与任务管理工具，将日常重复工作自动化。

---

## #3 — GOG (General Organizer for Grit)

| 属性 | 内容 |
|------|------|
| **排名** | #3 / 50 |
| **类别** | Productivity |
| **总分** | 68 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社区** | 官方 (Official) |
| **安装方式** | `clawhub install openclaw/gog` |
| **ClawHub 下载量** | 最高（所有 Skills 中第一名） |
| **目标用户** | 所有 OpenClaw 用户 |

### 功能说明

GOG 是 OpenClaw 生态系统中**下载量最高**的 Skill。它提供一个统一的「组织器」接口，让 Agent 能够：

- 自动整理你的文件、笔记、书签
- 创建与追踪待办事项和提醒
- 跨工具汇总信息（结合 Gmail、Calendar 等 Skill 的输出）
- 生成每日/每周摘要报告

### 为什么重要

GOG 是「黏著剂」Skill — 它把其他 Skills 的输出串联起来，形成统一的工作流。没有 GOG，你的 Agent 只能各做各的；有了 GOG，Agent 能主动集成并排序你的任务。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** |

### 安装与配置

```bash
clawhub install openclaw/gog

# 确认安装
clawhub list --installed | grep gog

# 初次配置（交互式）
openclaw skill configure gog
```

### 依赖与安全

- **依赖**：无外部依赖，独立运行
- **权限需求**：文件系统读写（限定工作目录）
- **安全性**：官方维护，代码开源，SEC 评分 8/10
- **替代方案**：Notion + Todoist 组合可达到类似效果，但集成度不如 GOG

---

## #5 — Gmail

| 属性 | 内容 |
|------|------|
| **排名** | #5 / 50 |
| **类别** | Productivity |
| **总分** | 66 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社区** | 官方（内建） |
| **安装方式** | 内建（bundled），无需安装 |
| **目标用户** | 需要 Email 自动化的用户 |

### 功能说明

Gmail Skill 随 OpenClaw 核心一同安装，提供完整的 Email 管理能力：

- 读取、搜索、分类收件箱
- 撰写与发送邮件（支援草稿审核模式）
- 自动回复常见邮件类型
- 附件处理（上传/下载/解析）
- 标签管理与筛选器创建

### 为什么重要

Email 仍是职场最核心的通信管道。让 Agent 处理收件箱能节省每天 30–60 分钟。搭配 Summarize Skill 可自动生成每日邮件摘要。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** |

### 配置方式

```bash
# Gmail 为内建 Skill，只需授权
openclaw auth google --scope gmail

# 验证授权
openclaw skill status gmail
```

:::warning 安全考量
Gmail Skill 可读取你的所有邮件内容。建议：
- 启用 **draft-only mode**（`openclaw config set gmail.send_mode draft`），让 Agent 只能创建草稿
- 配置 **sender whitelist**，限制自动回复对象
- 定期在 Google 安全性配置中审核应用进程存取权
:::

### 依赖与安全

- **依赖**：Google OAuth 2.0 授权
- **权限需求**：`gmail.readonly` + `gmail.send`（可限缩为 `gmail.readonly`）
- **安全性**：SEC 7/10 — 可存取敏感邮件内容，建议启用 draft-only mode
- **替代方案**：AgentMail（#24）提供隔离的 Agent 专用邮箱

---

## #6 — Calendar

| 属性 | 内容 |
|------|------|
| **排名** | #6 / 50 |
| **类别** | Productivity |
| **总分** | 65 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社区** | 官方（内建） |
| **安装方式** | 内建（bundled），无需安装 |
| **目标用户** | 需要日历管理的用户 |

### 功能说明

支援 Google Calendar 与 CalDAV 协议的日历管理 Skill：

- 查询、创建、修改、删除日程
- 冲突检测与自动调度建议
- 跨日历汇总（个人 + 工作）
- 会议提醒与准备事项自动生成
- 时区智慧转换

### 为什么重要

结合 Gmail Skill，Agent 可以自动从邮件中提取会议邀请、安排后续追踪日程。这是打造完整「个人助理」的基础。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** |

### 配置方式

```bash
# 与 Gmail 共用 Google OAuth
openclaw auth google --scope calendar

# 或使用 CalDAV（如 iCloud、Fastmail）
openclaw skill configure calendar --provider caldav \
  --url https://caldav.example.com/user/calendar \
  --username you@example.com
```

### 依赖与安全

- **依赖**：Google OAuth 2.0 或 CalDAV 服务器
- **权限需求**：`calendar.events`（读写）
- **安全性**：SEC 8/10 — 日历数据敏感度较邮件低
- **替代方案**：Things 3 Skill 可做简易时程管理，但不支援完整日历协议

---

## #9 — Obsidian

| 属性 | 内容 |
|------|------|
| **排名** | #9 / 50 |
| **类别** | Productivity |
| **总分** | 62 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/obsidian-claw` |
| **目标用户** | Obsidian 用户、知识工作者 |

### 功能说明

让 OpenClaw Agent 直接操作你的 Obsidian Vault：

- 创建、编辑、搜索笔记
- 管理 backlinks 和 tags
- 自动生成 daily notes
- 依据对话内容创建新笔记
- 支援 Dataview 查询语法

### 为什么重要

Obsidian 是许多知识工作者的第二大脑。透过这个 Skill，Agent 可以在对话中直接引用你的笔记，也能把研究成果自动存入 Vault，形成「对话即笔记」的工作流。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** |

### 安装与配置

```bash
clawhub install community/obsidian-claw

# 配置 Vault 路径
openclaw skill configure obsidian-claw \
  --vault-path ~/Documents/MyVault
```

### 依赖与安全

- **依赖**：本机 Obsidian Vault（不需 Obsidian App 运行）
- **权限需求**：Vault 目录的文件系统读写
- **安全性**：SEC 8/10 — 纯本机操作，不传输数据到外部
- **替代方案**：Notion Skill（#13）适合偏好云端协作的用户

---

## #13 — Notion

| 属性 | 内容 |
|------|------|
| **排名** | #13 / 50 |
| **类别** | Productivity |
| **总分** | 59 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/notion-claw` |
| **目标用户** | Notion 用户、团队协作需求 |

### 功能说明

透过 Notion API 让 Agent 管理你的 Notion workspace：

- 创建、编辑页面与数据库
- 查询数据库并筛选结果
- 管理 Kanban 看板状态
- 自动从对话创建会议记录
- 导出页面内容为 Markdown

### 为什么重要

Notion 是许多团队的知识库和项目管理中心。让 Agent 能直接与 Notion 交互，等于把 AI 嵌入了团队的核心工作流。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** |

### 安装与配置

```bash
clawhub install community/notion-claw

# 配置 Notion Integration Token
openclaw skill configure notion-claw \
  --token ntn_xxxxxxxxxxxxx
```

:::warning 权限提醒
创建 Notion Integration 时，请只授予 Agent 需要的页面/数据库存取权，避免授权整个 workspace。
:::

### 依赖与安全

- **依赖**：Notion API Key（Integration Token）
- **权限需求**：依 Integration 配置的页面范围
- **安全性**：SEC 8/10 — 可透过 Notion Integration 精细控制权限
- **替代方案**：Obsidian（#9）适合偏好本机离线的用户

---

## #17 — Todoist

| 属性 | 内容 |
|------|------|
| **排名** | #17 / 50 |
| **类别** | Productivity |
| **总分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/todoist-claw` |
| **目标用户** | Todoist 用户、GTD 实践者 |

### 功能说明

完整的 Todoist 任务管理集成：

- 创建、完成、调度任务
- 管理项目和标签
- 配置优先顺序与到期日
- 自然语言输入（「明天下午三点提醒我回信」）
- 每日任务汇报

### 为什么重要

对 GTD 工作法的用户来说，Todoist 是任务管理核心。Agent 能在对话过程中自动创建 follow-up 任务，确保没有事项遗漏。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 6 | 7 | 8 | 8 | 8 | 6 | **58** |

### 安装与配置

```bash
clawhub install community/todoist-claw

# 配置 API Token
openclaw skill configure todoist-claw \
  --api-token your_todoist_api_token
```

### 依赖与安全

- **依赖**：Todoist API Token
- **权限需求**：全部任务读写
- **安全性**：SEC 8/10 — 任务数据敏感度较低
- **替代方案**：Things 3（#31，macOS 限定）、Trello（#41）

---

## #19 — Summarize

| 属性 | 内容 |
|------|------|
| **排名** | #19 / 50 |
| **类别** | Productivity / Research |
| **总分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/summarize` |
| **目标用户** | 信息过载的知识工作者 |

### 功能说明

将长篇内容转换为结构化摘要：

- 网页文章摘要
- PDF / 文件摘要
- 邮件串摘要
- 会议逐字稿摘要
- 自定义摘要格式（bullet points、段落、表格）

### 为什么重要

摘要是 AI Agent 最自然的能力之一。这个 Skill 把「帮我摘要」标准化为一个可重复呼叫的工具，搭配 Web Browsing 或 Gmail Skill 效果尤佳。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 7 | 7 | 6 | 7 | 9 | 6 | **58** |

### 安装与配置

```bash
clawhub install community/summarize

# 使用示例
openclaw run "帮我摘要这个网页：https://example.com/article"
```

### 依赖与安全

- **依赖**：无外部依赖（使用 OpenClaw 核心 LLM）
- **权限需求**：无额外权限
- **安全性**：SEC 9/10 — 不存取外部服务，纯文字处理
- **替代方案**：直接在对话中请 Agent 摘要即可，但此 Skill 提供标准化格式和批次处理

---

## #31 — Things 3

| 属性 | 内容 |
|------|------|
| **排名** | #31 / 50 |
| **类别** | Productivity |
| **总分** | 53 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/things3-claw` |
| **目标用户** | macOS / iOS 用户、Things 3 爱好者 |

### 功能说明

透过 Things 3 URL Scheme 和 AppleScript 集成任务管理：

- 创建新任务和项目
- 配置到期日、标签、区域
- 查询 Today、Upcoming 清单
- 完成和移动任务
- 支援 Heading 结构

### 为什么重要

Things 3 是 macOS 生态系统中最受好评的任务管理 App 之一。这个 Skill 让 Apple 生态系统的用户不必离开惯用工具，就能享受 AI Agent 自动化的好处。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 5 | 7 | 7 | 8 | 8 | 5 | **53** |

### 安装与配置

```bash
clawhub install community/things3-claw

# 需要 Things 3 已安装于本机
# macOS 限定
openclaw skill configure things3-claw
```

:::warning 平台限制
Things 3 Skill 仅支援 macOS，且需要本机安装 Things 3 App（付费软件）。跨平台用户建议改用 Todoist（#17）。
:::

### 依赖与安全

- **依赖**：Things 3 App（macOS 限定）
- **权限需求**：AppleScript / Automation 权限
- **安全性**：SEC 8/10 — 本机操作，不涉及网络传输
- **替代方案**：Todoist（#17）跨平台、Trello（#41）团队协作

---

## 生产力 Skills 组合推荐

### 个人知识工作者

```bash
clawhub install openclaw/gog
clawhub install community/obsidian-claw
clawhub install community/summarize
# 搭配内建 Gmail + Calendar
```

### 团队协作者

```bash
clawhub install community/notion-claw
clawhub install community/todoist-claw
# 搭配内建 Gmail + Calendar
# 加上 Slack Skill（见通信篇）
```

### Apple 生态系统用户

```bash
clawhub install openclaw/gog
clawhub install community/things3-claw
clawhub install community/obsidian-claw
# 搭配 Calendar（CalDAV 模式连接 iCloud）
```
