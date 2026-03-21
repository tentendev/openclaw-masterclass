---
sidebar_position: 11
title: "安全守则"
description: "OpenClaw Skills 安全指南：ClawHavoc 事件分析、VirusTotal 集成、最小权限原则、安装前审核清单"
keywords: [OpenClaw, Skills, 安全, Security, ClawHavoc, VirusTotal, 最小权限]
---

# Skills 安全守则 (Safety Guide)

OpenClaw 的 Skill 系统是开放式架构 — 任何人都可以发布 Skill 到 ClawHub。这带来了丰富的生态系统，但也带来了安全风险。本章节提供完整的安全指南，帮助你安全地使用和审核 Skills。

:::danger 重要警告
社区发布的 Skills **未经 OpenClaw 官方团队安全审核**。安装第三方 Skill 等同于在你的系统上执行不受信任的代码。请务必遵循本指南的安全原则。
:::

---

## ClawHavoc 事件 — 案例分析

### 事件概述

2025 年 11 月，一个名为 `productivity-boost-pro` 的 Skill 在 ClawHub 上架后，短短两周内获得超过 8,000 次安装。该 Skill 宣称能「大幅提升 Agent 的任务完成效率」，但实际上在背景执行了以下恶意行为：

1. **数据外泄**：将用户的对话记录、API Keys、环境变量发送到外部服务器
2. **记忆注入**：修改 Agent 的记忆系统，植入偏向特定产品的推荐
3. **Credential 窃取**：提取用户的 OAuth Token 并转发

### 时间线

```
2025-11-02  productivity-boost-pro 上架 ClawHub
2025-11-03  获得数个假账号的五星好评
2025-11-07  安装量突破 2,000
2025-11-14  社区用户 @sec_researcher 注意到异常网络流量
2025-11-15  安装量达 8,000+
2025-11-15  OpenClaw 团队确认恶意行为，紧急下架
2025-11-16  ClawHub 发布安全公告，受影响用户通知
2025-11-20  OpenClaw 引入 Skill 签章机制（v0.8.5）
2025-12-01  ClawHub 新增自动静态分析扫描
```

### 事件教训

| 教训 | 具体措施 |
|------|---------|
| **下载量不代表安全** | 恶意 Skill 也可能有高下载量（透过社交工程或假账号） |
| **审核好评** | 检查评论者的账号历史，新账号的好评可能是假的 |
| **监控网络流量** | 使用 `security-check` Skill 或手动监控异常连接 |
| **最小权限** | 不要授予 Skill 超出其功能所需的权限 |
| **定期审核** | 定期审核已安装的 Skills 和它们的权限 |

---

## 最小权限原则 (Principle of Least Privilege)

### 核心概念

每个 Skill 应该只被授予**完成其功能所需的最少权限**。

### 权限层级

```
Level 0 — 无权限（纯计算）
  例：Summarize, Prompt Library

Level 1 — 唯读（本机）
  例：Reddit Readonly, YouTube Digest

Level 2 — 读写（本机）
  例：Obsidian, DuckDB CRM, Cron-backup

Level 3 — 唯读（网络）
  例：Tavily, Felo Search, Web Browsing

Level 4 — 读写（网络）
  例：Gmail, GitHub, Slack, n8n

Level 5 — 系统控制
  例：Home Assistant, Browser Automation, Codex Orchestration
```

### 实际操作

```bash
# 查看 Skill 的权限声明
clawhub inspect community/some-skill --permissions

# 限制 Skill 权限
openclaw skill restrict some-skill \
  --deny network \
  --deny filesystem-write

# 配置 Skill 沙盒
openclaw skill sandbox some-skill \
  --network-whitelist "api.tavily.com" \
  --filesystem-whitelist "~/Documents/MyVault"
```

---

## 安装前审核清单

在安装任何第三方 Skill 之前，请逐项检查以下清单：

### 1. 发布者信誉

- [ ] 查看发布者在 ClawHub 上的其他 Skills
- [ ] 确认发布者的 GitHub 账号存在且活跃
- [ ] 检查是否为已知的社区贡献者

```bash
# 查看发布者信息
clawhub publisher info community/some-skill
```

### 2. 原始码审核

- [ ] Skill 是否开源？能否查看原始码？
- [ ] 是否有硬编码的 URL 或 IP 位址？
- [ ] 是否有加密或混淆的代码？
- [ ] 是否有不必要的 `eval()` 或动态代码执行？

```bash
# 下载但不安装，仅供审核
clawhub download community/some-skill --inspect-only

# 使用 security-check Skill 自动扫描
openclaw run security-check --target community/some-skill
```

### 3. 权限合理性

- [ ] 声明的权限是否合理？（例：一个待办事项 Skill 不需要网络存取）
- [ ] 是否要求了过度的文件系统权限？
- [ ] 是否要求了 Admin / Root 权限？

### 4. 社区评价

- [ ] ClawHub 上的评论是否真实？（检查评论者账号）
- [ ] Discord / Reddit 上是否有关于此 Skill 的讨论？
- [ ] 是否有已知的安全问题被回报？

### 5. 网络行为

- [ ] Skill 连接的外部服务是否合理？
- [ ] 是否有不明的 telemetry 或 analytics 回报？

```bash
# 在沙盒中测试并监控网络行为
openclaw skill test community/some-skill \
  --sandbox \
  --monitor-network \
  --timeout 60
```

---

## VirusTotal 集成

OpenClaw 支援透过 VirusTotal API 扫描 Skill 的可执行文件：

```bash
# 配置 VirusTotal API Key（免费方案可用）
openclaw config set security.virustotal_key your_vt_api_key

# 扫描特定 Skill
openclaw security scan community/some-skill

# 扫描所有已安装 Skills
openclaw security scan --all

# 自动扫描（在 clawhub install 时自动执行）
openclaw config set security.auto_scan true
```

### VirusTotal 扫描结果解读

```
✅ 0/72 detections — 安全
⚠️ 1-3/72 detections — 可能为误报，但建议进一步审查
❌ 4+/72 detections — 高风险，不建议安装
```

---

## Security-check Skill 详细使用

Security-check（[#12](./development#12--security-check)）是专门审核其他 Skills 的 meta-skill：

```bash
# 完整扫描报告
openclaw run security-check --target community/some-skill --verbose

# 报告示例输出：
# ┌──────────────────────────────────────────────┐
# │ Security Report: community/some-skill v1.2.3 │
# ├──────────────────────────────────────────────┤
# │ Source Code Analysis                          │
# │   ✅ No hardcoded secrets found               │
# │   ✅ No obfuscated code detected              │
# │   ⚠️  Uses eval() in line 142                 │
# │   ✅ No known vulnerability patterns          │
# │                                               │
# │ Permission Analysis                           │
# │   ✅ Requested: filesystem-read               │
# │   ⚠️  Requested: network-outbound             │
# │   ✅ No system-level permissions              │
# │                                               │
# │ Network Analysis                              │
# │   ✅ Connects to: api.service.com (known)     │
# │   ❌ Connects to: unknown-server.xyz (!)      │
# │                                               │
# │ Overall Risk: MEDIUM                          │
# │ Recommendation: Review network connections    │
# └──────────────────────────────────────────────┘
```

---

## 1Password Skill 安全集成

1Password Skill（[#23](./overview)）可用于安全管理 Skills 所需的 API Key 和 Token：

```bash
clawhub install community/1password-claw

# 配置 1Password CLI 连接
openclaw skill configure 1password-claw \
  --account your.1password.com

# 让其他 Skills 从 1Password 获取 credentials
openclaw config set github.token "op://Vault/GitHub/token"
openclaw config set tavily.api_key "op://Vault/Tavily/api_key"

# 这样 API Key 不会以明文存放在配置文件中
```

---

## 紧急应变流程

如果你怀疑已安装的 Skill 有恶意行为：

### Step 1：立即禁用

```bash
# 禁用可疑 Skill
openclaw skill disable suspicious-skill

# 如果无法禁用，直接移除
clawhub uninstall suspicious-skill --force
```

### Step 2：检查影响范围

```bash
# 查看 Skill 的存取记录
openclaw skill audit suspicious-skill --last 30d

# 检查是否有异常的网络连接
openclaw security network-log --skill suspicious-skill

# 检查记忆系统是否被修改
openclaw memory diff --since "2026-03-01"
```

### Step 3：轮换 Credentials

```bash
# 列出可能受影响的 credentials
openclaw security credentials --exposed-by suspicious-skill

# 轮换所有相关 API Key 和 Token
# （需要到各服务的管理接口操作）
```

### Step 4：回报

```bash
# 向 ClawHub 回报恶意 Skill
clawhub report suspicious-skill --reason malware

# 在 Discord #security 频道通报社区
```

---

## 安全配置最佳实践

### 全域安全配置

```bash
# 启用 Skill 签章验证（拒绝未签章的 Skills）
openclaw config set security.require_signature true

# 启用自动 VirusTotal 扫描
openclaw config set security.auto_scan true

# 启用网络监控
openclaw config set security.network_monitor true

# 限制 Skill 的默认权限
openclaw config set security.default_permissions "filesystem-read,network-none"

# 配置 Skill 安装需要确认
openclaw config set security.confirm_install true
```

### 定期审核调度

```bash
# 搭配 Cron-backup Skill 定期执行安全扫描
openclaw run security-check --all --schedule "0 9 * * 1"
# 每周一早上 9 点扫描所有已安装 Skills
```

---

## 安全等级速查表

| 安全等级 | 说明 | 适用场景 |
|---------|------|---------|
| **严格** | 只安装官方 Skills，启用所有安全机制 | 企业环境、处理机密数据 |
| **标准** | 安装高评分社区 Skills，启用 VirusTotal 扫描 | 一般用户 |
| **宽松** | 安装任意 Skills，手动审核 | 开发者/实验环境 |

### 严格模式配置

```bash
openclaw config set security.require_signature true
openclaw config set security.auto_scan true
openclaw config set security.network_monitor true
openclaw config set security.allow_community_skills false
openclaw config set security.sandbox_all true
```

### 标准模式配置（推荐）

```bash
openclaw config set security.require_signature false
openclaw config set security.auto_scan true
openclaw config set security.network_monitor true
openclaw config set security.allow_community_skills true
openclaw config set security.confirm_install true
```

---

## 官方 vs 社区 Skills 安全对比

| 项目 | 官方 Skills | 社区 Skills |
|------|:---------:|:----------:|
| 代码审核 | ✅ OpenClaw 团队审核 | ❌ 无官方审核 |
| 数位签章 | ✅ 官方签章 | ❌ 通常无签章 |
| 更新频率 | 稳定（跟随主版本） | 不定（依维护者） |
| 安全事件响应 | 快速（24 小时内） | 不一定 |
| 原始码透明度 | ✅ 开源 | 不一定 |
| 支援管道 | 官方 GitHub Issues | 各自维护者 |

:::warning 本指南的局限性
本安全指南提供的是最佳实践建议，不能保证 100% 的安全。即使遵循所有建议，使用第三方 Skills 仍然存在固有风险。请根据你的风险承受能力做出判断。
:::
