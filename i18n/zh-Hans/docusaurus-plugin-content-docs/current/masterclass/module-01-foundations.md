---
title: "模块 1: OpenClaw 基础架构"
sidebar_position: 2
description: "深入理解 OpenClaw 的四层架构、组件通信方式、目录结构与系统健康检查"
---

# 模块 1: OpenClaw 基础架构

## 学习目标

完成本模块后，你将能够：

- 描述 OpenClaw 的四层架构及各层职责
- 说明各层之间的通信方式与数据流向
- 识别 OpenClaw 的关键目录结构与配置文件
- 使用 `openclaw doctor` 执行系统健康检查并解读结果
- 配置 SOUL.md 来定义 Agent 的基本人格

:::info 前置条件
请确认你已完成 [课程总览](./overview) 中的先备知识检查，并已成功安装 OpenClaw。
:::

---

## 四层架构全览

OpenClaw 采用精心设计的四层架构，每一层各司其职，通过明确的接口彼此通信。这个设计让系统具备高度的模块化与可扩展性。

```
┌─────────────────────────────────────────────┐
│             用户 / 外部系统                    │
└──────────────────────┬──────────────────────┘
                       │ WebSocket (port 18789)
                       ▼
┌─────────────────────────────────────────────┐
│          第一层：Gateway Layer               │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │WebSocket│  │ Message  │  │ Channel   │  │
│  │ Server  │  │ Router   │  │ Manager   │  │
│  └─────────┘  └──────────┘  └───────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Internal RPC
                       ▼
┌─────────────────────────────────────────────┐
│        第二层：Reasoning Layer               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   LLM    │  │  Mega-   │  │  SOUL.md │  │
│  │ Provider │  │ Prompting│  │  Parser  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Read/Write
                       ▼
┌─────────────────────────────────────────────┐
│         第三层：Memory System                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   WAL    │  │ Markdown │  │ Context  │  │
│  │  Engine  │  │Compaction│  │ Window   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Execute
                       ▼
┌─────────────────────────────────────────────┐
│     第四层：Skills / Execution Layer         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Sandboxed│  │ SKILL.md │  │ ClawHub  │  │
│  │Container │  │  Runner  │  │ Registry │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

### 第一层：Gateway Layer

Gateway 是 OpenClaw 的入口，负责管理所有外部连接。它在 **port 18789** 上运行 WebSocket 服务器，处理消息的接收与路由。

**核心职责：**
- 建立与管理 WebSocket 连接
- 消息格式验证与路由
- Channel 抽象（支持多个同时对话）
- Rate limiting 与基本安全过滤

:::warning 安全关键
Gateway 默认绑定 `127.0.0.1:18789`。**绝对不要**将其改为 `0.0.0.0`，否则将暴露在网络上。这是 CVE-2026-25253 的根本原因。详见模块 9 的安全章节。
:::

> 深入了解：[模块 2: Gateway 深入解析](./module-02-gateway)

### 第二层：Reasoning Layer

Reasoning Layer 是 OpenClaw 的"大脑"。它使用 **Mega-prompting** 策略与 LLM 交互，将用户的意图转化为可执行的行动计划。

**核心职责：**
- 解析 SOUL.md 定义 Agent 人格
- 构建 Mega-prompt（结合上下文、记忆、技能列表）
- 管理 LLM Provider 连接（支持 OpenAI、Anthropic、本地模型等）
- 决策：判断该调用哪个 Skill 来响应用户

**Mega-prompting 流程：**

```
用户输入 → 加载 SOUL.md 人格 → 注入相关记忆 →
列出可用 Skills → 组合 Mega-prompt → 调用 LLM →
解析响应 → 决定执行动作
```

### 第三层：Memory System

Memory System 提供持久化的记忆能力，让 Agent 能够跨对话维持上下文。

**核心组件：**
- **Write-Ahead Logging (WAL)**：所有记忆变更先写入 WAL，确保数据不会丢失
- **Markdown Compaction**：定期将零散的记忆片段压缩为结构化的 Markdown 摘要
- **Context Window Manager**：动态管理注入 LLM 的上下文大小

> 深入了解：[模块 5: 持久记忆与个性化](./module-05-memory)

### 第四层：Skills / Execution Layer

Skills Layer 是 OpenClaw 的"手"。每个 Skill 在**沙盒化容器**中执行，确保系统安全。

**核心职责：**
- 解析 SKILL.md 定义文件，加载 Skill 能力
- 在沙盒容器中执行 Skill（Podman / Docker）
- 管理 Skill 的安装、更新、移除
- 与 ClawHub Registry 同步

> 深入了解：[模块 3: Skills 系统与 SKILL.md 规范](./module-03-skills-system)

---

## 各层通信方式

各层之间通过明确定义的接口通信：

| 源层 | 目标层 | 通信方式 | 数据格式 |
|--------|--------|----------|----------|
| 外部 → Gateway | Gateway | WebSocket | JSON-RPC 2.0 |
| Gateway → Reasoning | Reasoning | Internal RPC | Protocol Buffers |
| Reasoning → Memory | Memory | Direct Call | Structured Objects |
| Reasoning → Skills | Skills | Container API | JSON + Streams |
| Memory → 磁盘 | 持久化存储 | File I/O | WAL + Markdown |

```json
// 典型的 WebSocket 消息格式
{
  "jsonrpc": "2.0",
  "method": "chat.send",
  "params": {
    "channel": "default",
    "message": "请帮我搜索今天的天气",
    "context": {
      "location": "北京"
    }
  },
  "id": "msg-001"
}
```

---

## 目录结构

安装 OpenClaw 后，关键文件与目录的布局如下：

```
~/.openclaw/
├── config.toml              # 主配置文件
├── SOUL.md                  # Agent 人格定义
├── skills/                  # 已安装的 Skills
│   ├── official/            # 官方 Skills
│   └── community/           # 社区 Skills
├── memory/                  # 记忆系统数据
│   ├── wal/                 # Write-Ahead Log 文件
│   ├── compacted/           # 压缩后的记忆摘要
│   └── index.json           # 记忆索引
├── logs/                    # 系统日志
│   ├── gateway.log
│   ├── reasoning.log
│   └── execution.log
├── containers/              # 沙盒容器配置
│   └── podman-compose.yml
└── cache/                   # 缓存文件
    ├── models/              # LLM 模型缓存
    └── hub/                 # ClawHub 缓存
```

### 主配置文件：config.toml

```toml
# ~/.openclaw/config.toml

[gateway]
host = "127.0.0.1"          # 永远使用 127.0.0.1
port = 18789
max_connections = 10
heartbeat_interval = 30      # 秒

[reasoning]
provider = "anthropic"       # 或 "openai", "local"
model = "claude-sonnet-4-20250514"
max_tokens = 8192
temperature = 0.7

[memory]
wal_enabled = true
compaction_interval = 3600   # 每小时压缩一次
max_context_tokens = 4096
retention_days = 90          # 记忆保留天数

[execution]
runtime = "podman"           # 建议用 podman，而非 docker
sandbox_memory = "512m"
sandbox_cpu = "1.0"
timeout = 30                 # Skill 执行超时（秒）

[security]
bind_localhost_only = true
verify_skills = true
virustotal_scan = true       # ClawHavoc 后的新配置
```

---

## 实操：系统健康检查

### 步骤 1：执行 `openclaw doctor`

```bash
openclaw doctor
```

预期输出：

```
OpenClaw Doctor v0.9.4
======================

[✓] Runtime: Podman 4.9.3 detected
[✓] Gateway: listening on 127.0.0.1:18789
[✓] Memory: WAL engine healthy (23 entries)
[✓] Skills: 47 skills installed, 47 verified
[✓] Config: config.toml valid
[✓] SOUL.md: loaded (personality: "helpful-assistant")
[✓] LLM Provider: Anthropic API reachable
[✓] Security: localhost-only binding confirmed

All checks passed! OpenClaw is healthy.
```

### 步骤 2：检查各层状态

```bash
# 查看 Gateway 状态
openclaw status gateway

# 查看 Memory 统计
openclaw status memory

# 列出已安装的 Skills
openclaw skills list

# 查看系统日志
openclaw logs --tail 50
```

### 步骤 3：创建你的第一个 SOUL.md

SOUL.md 定义了你的 Agent 人格特质。创建一个简单的人格定义：

```bash
cat > ~/.openclaw/SOUL.md << 'EOF'
# Agent 人格定义

## 名称
小龙（Xiao Long）

## 角色
你是一位友善的技术助理，专精于软件开发与系统管理。

## 语言偏好
- 主要语言：简体中文
- 技术术语保留英文

## 行为准则
- 回答简洁但完整
- 主动提供相关的背景知识
- 不确定的事情直接说明，不要猜测
- 提供代码时一律附上说明

## 限制
- 不执行任何可能损害系统的操作
- 不访问敏感数据（除非用户明确授权）
EOF
```

验证 SOUL.md 是否正确加载：

```bash
openclaw soul show
```

---

## 常见错误与疑难排解

### 错误 1：Gateway 无法启动

```
Error: Address already in use (127.0.0.1:18789)
```

**解法：**
```bash
# 找到占用端口的进程
lsof -i :18789

# 停止旧的 OpenClaw 进程
openclaw stop
# 或强制终止
kill -9 <PID>

# 重新启动
openclaw start
```

### 错误 2：LLM Provider 连接失败

```
Error: Failed to connect to reasoning provider
```

**解法：**
```bash
# 确认 API Key 已配置
openclaw config get reasoning.api_key

# 重新配置 API Key
openclaw config set reasoning.api_key "sk-your-key-here"

# 测试连接
openclaw test provider
```

### 错误 3：Podman 未安装

```
Error: No container runtime found
```

**解法：**
```bash
# macOS
brew install podman
podman machine init
podman machine start

# Ubuntu
sudo apt install podman

# 验证
podman --version
openclaw doctor
```

### 错误 4：config.toml 语法错误

```
Error: Failed to parse config.toml at line 15
```

**解法：**
```bash
# 验证配置文件语法
openclaw config validate

# 重置为默认配置
openclaw config reset --backup
```

---

## 练习题

1. **架构探索**：使用 `openclaw status` 命令组，分别查看四层架构的状态，并记录每层的关键指标（如连接数、记忆条目数、已安装 Skill 数量）。

2. **自定义 SOUL.md**：创建一个自定义的 SOUL.md，定义一个专门用于代码审查的 Agent 人格。试试看不同的人格配置如何影响响应风格。

3. **配置调优**：修改 `config.toml` 中的 `[memory]` 区段，将 `compaction_interval` 改为 1800 秒（30 分钟），然后观察记忆压缩的行为变化。

4. **日志分析**：启动 OpenClaw 后执行一次对话，然后查看 `gateway.log` 和 `reasoning.log`，追踪一条消息从接收到响应的完整流程。

---

## 随堂测验

1. **OpenClaw Gateway 默认监听的端口是？**
   - A) 8080
   - B) 3000
   - C) 18789
   - D) 443

2. **Memory System 使用什么机制确保数据不会丢失？**
   - A) Redis
   - B) Write-Ahead Logging (WAL)
   - C) PostgreSQL
   - D) SQLite

3. **以下哪个命令用于系统健康检查？**
   - A) `openclaw check`
   - B) `openclaw health`
   - C) `openclaw doctor`
   - D) `openclaw verify`

4. **为什么建议使用 Podman 而非 Docker？**
   - A) Podman 速度更快
   - B) Podman 不需要 daemon，且不要求 root 权限，安全性更高
   - C) Docker 不支持 OpenClaw
   - D) Podman 功能更丰富

5. **SOUL.md 的用途是什么？**
   - A) 定义 Skill 的行为
   - B) 配置系统参数
   - C) 定义 Agent 的人格特质与行为准则
   - D) 记录系统日志

<details>
<summary>查看答案</summary>

1. **C** — OpenClaw Gateway 默认在 port 18789 上监听 WebSocket 连接。
2. **B** — Write-Ahead Logging (WAL) 确保所有记忆变更先写入日志，即使系统崩溃也不会丢失数据。
3. **C** — `openclaw doctor` 会检查所有系统组件的健康状态。
4. **B** — Podman 是 daemonless 的容器执行环境，不需要 root 权限，降低攻击面。这也是安全最佳实践的一部分。
5. **C** — SOUL.md 定义了 Agent 的名称、角色、语言偏好、行为准则等人格特质。

</details>

---

## 建议下一步

你已经了解了 OpenClaw 的四层架构与基本配置。接下来，让我们深入探索第一层 Gateway 的运作细节。

**[前往模块 2: Gateway 深入解析 →](./module-02-gateway)**
