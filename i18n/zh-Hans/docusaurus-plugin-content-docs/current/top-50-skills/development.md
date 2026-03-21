---
sidebar_position: 3
title: "开发工具 Skills"
description: "OpenClaw 开发工具类 Skills 完整评测：GitHub、Security-check、Cron-backup、Linear、n8n、Codex Orchestration"
keywords: [OpenClaw, Skills, Development, GitHub, Security, Linear, n8n, Codex]
---

# 开发工具 Skills (Development)

开发工具类 Skills 让 OpenClaw Agent 深度融入软件开发流程 — 从版本控制、Issue 管理到 CI/CD 自动化，Agent 可以成为你的 pair programmer 和 DevOps 助手。

---

## #1 — GitHub

| 属性 | 内容 |
|------|------|
| **排名** | #1 / 50 |
| **类别** | Development |
| **总分** | 72 / 80 |
| **成熟度** | 🟢 Stable |
| **官方/社区** | 官方 (Official) |
| **安装方式** | `clawhub install openclaw/github` |
| **目标用户** | 所有软件开发者 |

### 功能说明

GitHub Skill 是 OpenClaw 评分最高的 Skill，提供完整的 Git workflow 集成：

- **Repository 管理**：创建、Clone、搜索 repos
- **Branch & PR workflow**：创建分支、提交 commit、开 Pull Request、Code Review
- **Issue 管理**：创建、搜索、分类、指派 Issues
- **CI/CD 集成**：触发 GitHub Actions、查看 workflow 状态
- **Code Search**：跨 repo 搜索代码
- **Release 管理**：创建 tag、发布 release notes

### 为什么重要

GitHub 是全球最大的代码托管平台。这个 Skill 让 Agent 成为真正的开发伙伴 — 不只是写代码，还能管理整个开发流程。单一 Skill 就能覆盖 Issue → Branch → Code → PR → Review → Merge 的完整 cycle。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** |

**排名理由**：满分的相关性与相容性，加上 OpenClaw 官方团队维护，品质稳定。唯一扣分点在安全性（需要 GitHub Token，具有较高权限）和学习价值（Git 概念已广为人知）。

### 安装与配置

```bash
clawhub install openclaw/github

# 方法 1：使用 GitHub CLI 授权（推荐）
gh auth login
openclaw skill configure github --auth-method gh-cli

# 方法 2：使用 Personal Access Token
openclaw skill configure github \
  --token ghp_xxxxxxxxxxxx \
  --default-org your-org
```

### 依赖与安全

- **依赖**：GitHub Account、Personal Access Token 或 GitHub CLI
- **权限需求**：`repo`, `workflow`, `read:org`（依功能可限缩）
- **安全性**：SEC 8/10 — 官方维护且开源，但 GitHub Token 权限范围大，建议使用 Fine-grained PAT

:::warning Token 安全
- 使用 **Fine-grained Personal Access Token**，只授予需要的 repository 存取权
- 切勿使用 Classic PAT 的 `repo` 全域权限
- 建议搭配 1Password Skill（#23）管理 Token
:::

- **替代方案**：GitLab 用户可改用社区的 `community/gitlab-claw`

---

## #12 — Security-check

| 属性 | 内容 |
|------|------|
| **排名** | #12 / 50 |
| **类别** | Development |
| **总分** | 60 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/security-check` |
| **目标用户** | 安全意识用户、Skill 开发者 |

### 功能说明

专门用来审核其他 Skills 安全性的 meta-skill：

- 静态分析 Skill 原始码，检测可疑 API 呼叫
- 检查权限声明是否过度
- 检测硬编码的 secrets 和 tokens
- 分析网络请求目的地
- 生成安全评估报告

### 为什么重要

OpenClaw 生态系统中有大量社区 Skills，品质参差不齐。Security-check 是你安装任何第三方 Skill 前的「守门员」。详见 [安全守则](./safety-guide) 中的 ClawHavoc 事件。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** |

### 安装与使用

```bash
clawhub install community/security-check

# 扫描特定 Skill
openclaw run security-check --target community/some-skill

# 扫描所有已安装 Skills
openclaw run security-check --all

# 在安装前扫描（推荐流程）
clawhub inspect community/new-skill | openclaw run security-check --stdin
```

### 依赖与安全

- **依赖**：无外部依赖
- **权限需求**：读取其他 Skills 的安装目录
- **安全性**：SEC 9/10 — 本身就是安全工具
- **替代方案**：手动审核代码 + VirusTotal API

---

## #14 — Linear

| 属性 | 内容 |
|------|------|
| **排名** | #14 / 50 |
| **类别** | Development |
| **总分** | 59 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/linear-claw` |
| **目标用户** | Linear 用户、开发团队 |

### 功能说明

与 Linear 项目管理工具深度集成：

- 创建、更新、搜索 Issues
- 管理 Cycles 和 Projects
- 状态转换自动化
- 从对话中自动创建 Issue
- 与 GitHub Skill 联动：PR merge 自动关闭 Issue

### 为什么重要

Linear 已成为许多新创和开发团队的首选项目管理工具。GitHub Skill 处理代码层面，Linear Skill 则处理项目管理层面，两者搭配覆盖完整开发流程。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** |

### 安装与配置

```bash
clawhub install community/linear-claw

# 配置 Linear API Key
openclaw skill configure linear-claw \
  --api-key lin_api_xxxxxxxxxxxx \
  --default-team your-team-key
```

### 依赖与安全

- **依赖**：Linear API Key
- **权限需求**：Issues 读写
- **安全性**：SEC 8/10 — Linear API 权限粒度合理
- **替代方案**：Jira Bridge（#46）for Jira 用户、Trello（#41）

---

## #20 — Cron-backup

| 属性 | 内容 |
|------|------|
| **排名** | #20 / 50 |
| **类别** | Development |
| **总分** | 57 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/cron-backup` |
| **目标用户** | 重视数据安全的用户 |

### 功能说明

为 OpenClaw 的配置、记忆和 Skill 数据提供调度备份：

- 定时备份 Agent 记忆数据
- 备份 Skill 配置文件
- 备份对话历史
- 支援本机和云端存储（S3、Google Drive）
- 增量备份与版本控制

### 为什么重要

OpenClaw 的记忆系统存储了你与 Agent 的所有交互脉络。一旦遗失，需要大量时间重建。Cron-backup 确保你不会因为系统故障而失去这些宝贵数据。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 8 | 5 | 8 | 7 | 8 | 8 | 6 | **57** |

### 安装与配置

```bash
clawhub install community/cron-backup

# 配置本机备份
openclaw skill configure cron-backup \
  --destination ~/openclaw-backups \
  --schedule "0 2 * * *"  # 每天凌晨 2 点

# 配置 S3 备份
openclaw skill configure cron-backup \
  --destination s3://my-bucket/openclaw-backups \
  --schedule "0 */6 * * *"  # 每 6 小时
```

### 依赖与安全

- **依赖**：cron daemon（本机）或 S3 credentials（云端）
- **权限需求**：OpenClaw 数据目录读取、备份目的地写入
- **安全性**：SEC 8/10 — 备份内容可能包含敏感数据，建议加密
- **替代方案**：手动 `cp -r ~/.openclaw/data ~/backup/`

---

## #29 — Codex Orchestration

| 属性 | 内容 |
|------|------|
| **排名** | #29 / 50 |
| **类别** | Development |
| **总分** | 54 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/codex-orch` |
| **目标用户** | 进阶开发者、multi-agent 架构实验者 |

### 功能说明

让 OpenClaw Agent 协调多个 Codex-style 子任务：

- 将大型开发任务拆分为子任务
- 平行执行多个 code generation 任务
- 结果合并与冲突解决
- 进度追踪与失败重试
- 与 GitHub Skill 联动，自动创建 feature branch

### 为什么重要

这是 OpenClaw 朝向 multi-agent 架构的实验性 Skill。它让单一 Agent 能「分身」处理复杂的开发项目，概念上类似 OpenAI Codex 的任务分派模式，但构建在 OpenClaw 的 Skill 系统上。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 5 | 8 | 6 | 7 | 7 | 8 | **54** |

### 安装与配置

```bash
clawhub install community/codex-orch

# 配置并行上限
openclaw skill configure codex-orch \
  --max-parallel 3 \
  --timeout 600
```

:::warning 实验性 Skill
Codex Orchestration 目前为 Alpha 状态，API 可能在未来版本大幅变动。不建议用于 production 工作流。适合学习 multi-agent 架构模式。
:::

### 依赖与安全

- **依赖**：OpenClaw Core v0.9+, GitHub Skill（选用）
- **权限需求**：高 — 需要执行任意代码的权限
- **安全性**：SEC 7/10 — 并行执行增加攻击面
- **替代方案**：手动使用 OpenClaw 的 `--fork` 模式

---

## #46 — Jira Bridge

| 属性 | 内容 |
|------|------|
| **排名** | #46 / 50 |
| **类别** | Development |
| **总分** | 46 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/jira-bridge` |
| **目标用户** | 使用 Jira 的企业团队 |

### 功能说明

Atlassian Jira 的基础集成：

- 搜索和查看 Issues
- 创建和更新 Issues
- 转换 Issue 状态
- 新增留言

### 为什么重要

Jira 仍是企业环境中最普遍的项目管理工具。虽然 Linear Skill 品质更好，但对于使用 Jira 的团队来说，这是目前唯一的选择。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **46** |

### 安装与配置

```bash
clawhub install community/jira-bridge

openclaw skill configure jira-bridge \
  --url https://yourcompany.atlassian.net \
  --email you@company.com \
  --api-token your_jira_api_token
```

### 依赖与安全

- **依赖**：Jira Cloud API Token
- **权限需求**：Issue 读写
- **安全性**：SEC 7/10 — Jira API Token 权限较粗
- **替代方案**：Linear（#14）品质更好，但需要团队迁移

---

## 开发者 Skills 组合推荐

### 全端开发者

```bash
clawhub install openclaw/github
clawhub install community/linear-claw
clawhub install community/security-check
clawhub install community/cron-backup
```

### 开源贡献者

```bash
clawhub install openclaw/github
clawhub install community/security-check
# 搭配 Web Browsing 查阅文件
```

### 进阶实验者

```bash
clawhub install openclaw/github
clawhub install community/codex-orch
clawhub install community/n8n-openclaw
# 多 Agent 开发流程实验
```
