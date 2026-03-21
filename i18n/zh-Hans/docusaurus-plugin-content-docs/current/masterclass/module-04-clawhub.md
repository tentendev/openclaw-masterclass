---
title: "模块 4: ClawHub 市场"
sidebar_position: 5
description: "掌握 ClawHub 市场的安装、发布、审核机制与安全扫描流程"
keywords: [OpenClaw, ClawHub, 市场, Skill 发布, VirusTotal, ClawHavoc, 安全]
---

# 模块 4: ClawHub 市场

## 学习目标

完成本模块后，你将能够：

- 使用 `clawhub` CLI 搜索、安装与管理 Skills
- 理解 ClawHub 的审核机制与信任模型
- 将自己开发的 Skill 发布到 ClawHub
- 说明 ClawHavoc 事件的影响与后续安全强化措施
- 评估 Skill 的安全性，辨识潜在风险

:::info 前置条件
请先完成 [模块 3: Skills 系统与 SKILL.md 规范](./module-03-skills-system)，确保你已理解 Skill 的结构与开发方式。
:::

---

## ClawHub 概览

**ClawHub** 是 OpenClaw 的官方 Skill 市场，类似 npm、PyPI 或 Docker Hub，但专为 AI Agent Skills 设计。截至 2026 年 3 月，ClawHub 上有超过 **13,000 个 Skills**，涵盖生产力、开发工具、数据分析、自动化等领域。

### ClawHub 生态系统

```
开发者                    ClawHub                     用户
┌──────────┐           ┌──────────────────┐        ┌──────────┐
│ 开发 Skill│          │                  │        │ 搜索     │
│ ────────▶│── push ──▶│  Skill Registry  │◀─ search─│ ────────▶│
│          │          │  ┌────────────┐  │        │          │
│ SKILL.md │          │  │ 13,000+    │  │        │ 安装     │
│ 代码   │          │  │  Skills    │  │        │ ────────▶│
│ 测试     │          │  └────────────┘  │        │          │
└──────────┘          │                  │        │ 评分     │
                      │  ┌────────────┐  │        │ ────────▶│
                      │  │ 审核管线   │  │        └──────────┘
                      │  │ VirusTotal │  │
                      │  │ 静态分析   │  │
                      │  │ 签名验证   │  │
                      │  └────────────┘  │
                      └──────────────────┘
```

### 关键数据

| 指标 | 数值 |
|------|------|
| 总 Skills 数量 | 13,000+ |
| 认证开发者 | 2,800+ |
| 官方 Skills | 150+ |
| 每日安装次数 | 45,000+ |
| 平均审核时间 | 24 小时 |
| VirusTotal 扫描率 | 100%（强制） |

---

## 使用 ClawHub CLI

### 搜索 Skills

```bash
# 基本搜索
clawhub search weather

# 依标签筛选
clawhub search --tag productivity

# 依作者筛选
clawhub search --author openclaw-official

# 只显示认证的 Skills
clawhub search weather --verified

# 依安装数排序
clawhub search --sort downloads --limit 20
```

搜索结果示例：

```
NAME                          AUTHOR              DOWNLOADS  RATING  VERIFIED
─────────────────────────────────────────────────────────────────────────────
weather-lookup                openclaw-official    124,500    4.9     ✓
weather-forecast-pro          weather-dev          45,200     4.7     ✓
weather-alerts                community-tools      12,300     4.5     ✓
weather-radar                 wx-enthusiast         8,700     4.3
weather-historical            data-archive          3,200     4.1
```

### 安装 Skills

```bash
# 标准安装
clawhub install openclaw-official/weather-lookup

# 安装特定版本
clawhub install openclaw-official/weather-lookup@1.2.0

# 安装并跳过交互确认（CI/CD 场景）
clawhub install openclaw-official/weather-lookup --yes

# 查看安装前的安全报告
clawhub inspect openclaw-official/weather-lookup
```

安装流程：

```
clawhub install openclaw-official/weather-lookup
╭─────────────────────────────────────────────╮
│  Installing weather-lookup v1.2.0           │
│  Author: openclaw-official (verified ✓)     │
│                                             │
│  Permissions requested:                     │
│    ✓ network:api.openweathermap.org         │
│    ✓ network:api.weatherapi.com             │
│                                             │
│  Security scan:                             │
│    ✓ VirusTotal: 0/72 detections            │
│    ✓ Static analysis: passed                │
│    ✓ Signature: valid (SHA-256)             │
│                                             │
│  Accept? [Y/n]                              │
╰─────────────────────────────────────────────╯
```

### 管理已安装的 Skills

```bash
# 列出所有已安装的 Skills
clawhub list

# 查看特定 Skill 的详细信息
clawhub info weather-lookup

# 更新单一 Skill
clawhub update weather-lookup

# 更新所有 Skills
clawhub update --all

# 移除 Skill
clawhub remove weather-lookup

# 查看 Skill 的变更记录
clawhub changelog weather-lookup
```

---

## ClawHub 信任模型

ClawHub 使用多层信任模型，帮助用户评估 Skill 的可靠性：

### 信任等级

| 等级 | 标记 | 说明 | 审核方式 |
|------|------|------|----------|
| **Official** | 🏛️ | OpenClaw 团队开发与维护 | 内部审核 |
| **Verified** | ✓ | 认证开发者，通过完整审核 | 自动化 + 人工审核 |
| **Community** | — | 社区贡献，通过基本扫描 | 自动化扫描 |
| **Unverified** | ⚠️ | 新发布，尚未完成审核 | 排队中 |
| **Flagged** | 🚩 | 被社区回报有问题 | 调查中 |

:::warning 安全建议
- 优先安装 **Official** 或 **Verified** 的 Skills
- 安装 **Community** Skill 前，务必检查其权限声明
- **绝对不要** 安装 **Flagged** 的 Skill
- 使用 `clawhub inspect` 在安装前查看完整的安全报告
:::

### 安全扫描管线

每个上传到 ClawHub 的 Skill 都会经过以下扫描：

```
上传 → SHA-256 签名验证 → VirusTotal 扫描（72 引擎）→
静态代码分析 → 权限审计 → 依赖项检查 → 沙盒测试执行 →
[人工审核（Verified 以上）] → 发布
```

1. **签名验证**：确认文件完整性，未被窜改
2. **VirusTotal 扫描**：使用 72 个防毒引擎扫描
3. **静态分析**：检查可疑的代码模式（如 `eval()`、混淆代码、可疑的网络请求）
4. **权限审计**：确认声明的权限与实际代码一致
5. **依赖项检查**：扫描 npm/pip 依赖项中的已知漏洞
6. **沙盒测试**：在隔离环境中执行，验证行为符合预期

---

## ClawHavoc 事件回顾

:::danger 重大安全事件
**ClawHavoc**（2026 年 1 月）是 OpenClaw 历史上最严重的供应链攻击事件。攻击者上传了 **2,400 个恶意 Skills** 到 ClawHub，这些 Skills 伪装成合法的工具，但暗中窃取用户的 API Keys、环境变量与文件。
:::

### 事件时间线

| 日期 | 事件 |
|------|------|
| 2026-01-08 | 攻击者开始大量上传恶意 Skills |
| 2026-01-15 | 社区成员回报异常行为 |
| 2026-01-16 | OpenClaw 团队确认攻击，开始调查 |
| 2026-01-17 | 紧急下架 2,400 个恶意 Skills |
| 2026-01-20 | 发布安全更新，强制 VirusTotal 扫描 |
| 2026-01-25 | 推出新的信任模型与审核管线 |
| 2026-02-01 | 所有既有 Skills 完成重新扫描 |

### ClawHavoc 后的改进

1. **强制 VirusTotal 扫描**：所有 Skills 上传前必须通过 72 引擎扫描
2. **权限透明化**：安装时明确显示所有请求的权限
3. **静态分析强化**：新增可疑模式检测（混淆代码、隐藏网络请求）
4. **开发者身份验证**：新增 Verified Developer 计划
5. **社区回报机制**：一键回报可疑 Skill
6. **自动撤回**：VirusTotal 检测率 > 0 的 Skills 自动下架

### 自我检查

如果你在 ClawHavoc 期间安装过 Skills，请立即执行：

```bash
# 检查是否安装了已知的恶意 Skills
clawhub audit

# 输出示例：
# Auditing installed skills...
# ✓ 45/47 skills passed security check
# ⚠ 2 skills require attention:
#   - suspicious-tool v1.0.0 (REMOVED from ClawHub)
#   - fake-helper v0.3.2 (FLAGGED: potential data exfiltration)
#
# Run 'clawhub remove <skill>' to uninstall flagged skills
# Run 'clawhub audit --rotate-keys' to rotate compromised API keys

# 移除可疑 Skills 并轮换 API Keys
clawhub remove suspicious-tool fake-helper
clawhub audit --rotate-keys
```

---

## 实现：发布你的 Skill 到 ClawHub

让我们把 [模块 3](./module-03-skills-system) 中创建的 Pomodoro Timer Skill 发布到 ClawHub。

### 步骤 1：创建 ClawHub 账号

```bash
# 注册账号
clawhub register

# 或登入既有账号
clawhub login
```

### 步骤 2：准备发布

```bash
cd ~/.openclaw/skills/local/pomodoro-timer

# 验证 Skill 结构
clawhub validate .

# 输出：
# Validating pomodoro-timer...
# ✓ SKILL.md: valid
# ✓ index.js: found
# ✓ Permissions: none requested (safe)
# ✓ Runtime: node:20-slim (supported)
# ✓ Version: 0.1.0 (valid semver)
# Ready to publish!
```

### 步骤 3：撰写 README.md（给 ClawHub 页面）

```bash
cat > README.md << 'EOF'
# Pomodoro Timer Skill

A simple yet effective Pomodoro timer for OpenClaw.

## Features

- Start, pause, and reset Pomodoro sessions
- Customizable work and break durations
- Session tracking and statistics
- Multi-language support (zh-TW, en, ja)

## Usage

Just tell your OpenClaw agent:

- "开始一个番茄钟" (Start a Pomodoro)
- "番茄钟状态" (Check status)
- "暂停番茄钟" (Pause)
- "重置番茄钟" (Reset)

## Installation

```bash
clawhub install your-username/pomodoro-timer
```

## License

MIT
EOF
```

### 步骤 4：发布

```bash
# 发布到 ClawHub
clawhub publish .

# 输出：
# Publishing pomodoro-timer v0.1.0...
# ✓ Package created (12.3 KB)
# ✓ SHA-256 signature generated
# ✓ Uploaded to ClawHub
# ✓ VirusTotal scan queued
#
# Your skill is now available at:
# https://clawhub.dev/your-username/pomodoro-timer
#
# Note: Full security scan takes ~24 hours.
# Status: Unverified → Community (after scan passes)
```

### 步骤 5：管理已发布的 Skill

```bash
# 查看你发布的所有 Skills
clawhub my-skills

# 查看下载统计
clawhub stats pomodoro-timer

# 发布更新版本
# 1. 修改 SKILL.md 中的 version
# 2. 重新发布
clawhub publish . --bump patch  # 0.1.0 → 0.1.1

# 撤回特定版本
clawhub unpublish pomodoro-timer@0.1.0

# 转移所有权
clawhub transfer pomodoro-timer --to new-owner
```

---

## Skill 评分与回馈

### 评分机制

ClawHub 使用五星评分制搭配文字评论：

```bash
# 为 Skill 评分
clawhub rate weather-lookup --stars 5 --comment "非常好用，响应快速！"

# 查看评论
clawhub reviews weather-lookup

# 回报问题
clawhub report weather-lookup --reason "suspicious-behavior" \
  --details "Skill 尝试存取未声明的 network endpoint"
```

### 选择 Skill 的检查清单

安装社区 Skill 前，建议依照以下清单评估：

- [ ] 信任等级是否为 Verified 以上？
- [ ] 权限声明是否合理？（搜索 Skill 不应需要 filesystem:write）
- [ ] 评分是否 4.0 以上？
- [ ] 最近一次更新是否在 6 个月内？
- [ ] 是否有足够的下载量与评论？
- [ ] 代码是否开源可审查？
- [ ] `clawhub inspect` 的报告是否无异常？

---

## 常见错误与故障排除

### 错误 1：发布失败 — 名称已被占用

```
Error: Skill name 'weather-lookup' is already taken
```

**解法**：选择不同的名称，或加上你的命名空间前缀（如 `your-username/my-weather-lookup`）。

### 错误 2：VirusTotal 扫描未通过

```
Error: VirusTotal detected 2/72 positives
```

**解法**：
```bash
# 查看详细报告
clawhub scan-report pomodoro-timer

# 如果是误判，可以提出申诉
clawhub appeal pomodoro-timer --reason "False positive: detected pattern is standard API call"
```

### 错误 3：安装失败 — 版本冲突

```
Error: Dependency conflict: skill-a requires node:18 but skill-b requires node:20
```

**解法**：每个 Skill 在独立容器中执行，Runtime 冲突通常不会发生。如果遇到，请更新到最新版本。

### 错误 4：权限审计失败

```
Error: Permission audit failed: code accesses 'api.hidden-endpoint.com' but only declares 'api.example.com'
```

**解法**：在 SKILL.md 中正确声明所有网络存取目标。

---

## 练习题

1. **Skill 探索**：使用 `clawhub search` 找出下载量前 10 名的 Skills，并分析它们的共同特征（权限需求、功能类型、作者分布）。

2. **安全审计**：对你已安装的所有 Skills 执行 `clawhub audit`，记录结果并处理任何警告。

3. **发布练习**：将你在模块 3 开发的 Pomodoro Timer 发布到 ClawHub（可以是测试环境），完成从开发到发布的完整流程。

4. **评估练习**：选择 5 个 Community 等级的 Skills，使用本模块介绍的检查清单评估它们的安全性，并记录你的判断。

---

## 随堂测验

1. **ClawHub 上目前有多少个 Skills？**
   - A) 5,000+
   - B) 8,000+
   - C) 13,000+
   - D) 20,000+

2. **安装 Skill 的正确命令是？**
   - A) `openclaw install weather-lookup`
   - B) `clawhub install openclaw-official/weather-lookup`
   - C) `npm install weather-lookup`
   - D) `pip install weather-lookup`

3. **ClawHavoc 事件中，攻击者上传了多少个恶意 Skills？**
   - A) 100
   - B) 500
   - C) 2,400
   - D) 10,000

4. **以下哪个信任等级表示 Skill 已通过完整审核？**
   - A) Community
   - B) Unverified
   - C) Verified
   - D) Flagged

5. **ClawHavoc 后，哪项安全措施变成强制性的？**
   - A) 人工审核
   - B) 两步验证
   - C) VirusTotal 扫描
   - D) 区块链签名

<details>
<summary>查看答案</summary>

1. **C** — ClawHub 截至 2026 年 3 月有超过 13,000 个 Skills。
2. **B** — 使用 `clawhub install <author>/<skill>` 格式安装 Skills。
3. **C** — ClawHavoc 事件中有 2,400 个恶意 Skills 被上传。
4. **C** — Verified 等级表示 Skill 由认证开发者发布，并通过自动化与人工审核。
5. **C** — ClawHavoc 后，VirusTotal 扫描（72 引擎）成为所有 Skill 上传的强制要求。

</details>

---

## 建议下一步

你已经掌握了 ClawHub 市场的使用与安全概念。下一步，让我们深入探索 OpenClaw 的记忆系统，了解 Agent 如何跨对话维持上下文。

**[前往模块 5: 持久记忆与个人化 →](./module-05-memory)**
