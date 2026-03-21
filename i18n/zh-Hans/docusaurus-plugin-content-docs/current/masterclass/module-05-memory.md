---
title: "模块 5: 持久记忆与个人化"
sidebar_position: 6
description: "深入理解 OpenClaw 的 Memory System — Write-Ahead Logging、Markdown Compaction、Context Window 管理与记忆个人化"
keywords: [OpenClaw, Memory, WAL, Markdown Compaction, 记忆, Context Window, 个人化]
---

# 模块 5: 持久记忆与个人化

## 学习目标

完成本模块后，你将能够：

- 说明 OpenClaw Memory System 的三大核心组件
- 理解 Write-Ahead Logging (WAL) 的运作机制与数据安全保证
- 说明 Markdown Compaction 如何将碎片记忆压缩为结构化摘要
- 配置 Context Window 管理策略
- 配置记忆保留策略，实现 Agent 个人化
- 排除常见的记忆系统问题

:::info 前置条件
请先完成 [模块 1: 基础架构](./module-01-foundations)，理解 Memory System 在四层架构中的位置。
:::

---

## Memory System 架构

OpenClaw 的 Memory System 让 Agent 能够跨对话、跨 Session 记住重要信息。它不是简单的对话历史记录，而是一套具有**写入保护**、**自动压缩**与**智慧检索**能力的记忆管理系统。

```
              Reasoning Layer
                    │
          ┌─────────┼─────────┐
          │  recall  │  store  │
          ▼         │         ▼
┌─────────────────────────────────────┐
│            Memory System            │
│                                     │
│  ┌───────────┐   ┌───────────────┐  │
│  │           │   │               │  │
│  │    WAL    │──▶│   Markdown    │  │
│  │   Engine  │   │  Compaction   │  │
│  │           │   │               │  │
│  └─────┬─────┘   └───────┬───────┘  │
│        │                 │          │
│        ▼                 ▼          │
│  ┌───────────┐   ┌───────────────┐  │
│  │  wal/     │   │  compacted/   │  │
│  │  (原始)   │   │  (压缩摘要)   │  │
│  └───────────┘   └───────────────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │     Context Window Manager      ││
│  │  动态选择最相关的记忆注入 LLM    ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 三大核心组件

| 组件 | 职责 | 类比 |
|------|------|------|
| **WAL Engine** | 所有记忆变更先写入 WAL，确保数据不遗失 | 数据库的 Transaction Log |
| **Markdown Compaction** | 定期将 WAL 中的碎片记忆压缩为结构化摘要 | 数据库的 Compaction / Vacuum |
| **Context Window Manager** | 智慧选择相关记忆，注入 LLM 的 Context Window | 搜索引擎的 Ranking |

---

## Write-Ahead Logging (WAL)

WAL 是记忆系统的基础安全机制。所有记忆操作（新增、修改、删除）都必须先写入 WAL 文件，确保即使系统意外当机，记忆数据也不会遗失。

### WAL 运作流程

```
记忆操作                WAL                     实际记忆
(store)               (预写日志)                (compacted)
   │                     │                        │
   │  1. 写入 WAL        │                        │
   ├────────────────────▶│                        │
   │                     │                        │
   │  2. 确认写入成功     │                        │
   │◀────────────────────│                        │
   │                     │                        │
   │  3. 响应成功         │  4. 背景压缩           │
   │                     ├───────────────────────▶│
   │                     │                        │
   │                     │  5. 清理已压缩的 WAL    │
   │                     │◀───────────────────────│
```

### WAL 文件格式

WAL 文件存储在 `~/.openclaw/memory/wal/` 目录下：

```
~/.openclaw/memory/wal/
├── 2026-03-20T10-15-23.wal
├── 2026-03-20T10-22-45.wal
├── 2026-03-20T11-03-12.wal
└── checkpoint.json
```

每个 WAL 条目的结构：

```json
{
  "id": "mem-a1b2c3d4",
  "timestamp": "2026-03-20T10:15:23Z",
  "operation": "store",
  "channel": "default",
  "type": "conversation",
  "content": "用户偏好使用简体中文响应，技术术语保留英文",
  "importance": 0.85,
  "tags": ["preference", "language"],
  "ttl": null,
  "checksum": "sha256:e3b0c44298fc..."
}
```

### WAL 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 记忆条目的唯一识别码 |
| `timestamp` | ISO 8601 | 记录时间 |
| `operation` | string | 操作类型：`store`、`update`、`delete` |
| `channel` | string | 所属 Channel |
| `type` | string | 记忆类型：`conversation`、`fact`、`preference`、`task` |
| `content` | string | 记忆内容 |
| `importance` | float | 重要性评分（0.0 - 1.0），由 Reasoning Layer 判定 |
| `tags` | array | 标签，用于检索 |
| `ttl` | number/null | 存活时间（秒），null 表示永久 |
| `checksum` | string | 内容校验码，用于完整性验证 |

### WAL 的安全保证

- **持久性（Durability）**：WAL 写入后使用 `fsync` 确保落盘
- **原子性（Atomicity）**：每个 WAL 条目要么完整写入，要么不写入
- **顺序性（Ordering）**：WAL 条目严格按时间顺序排列
- **可恢复性（Recoverability）**：系统重启时自动从 WAL 恢复未压缩的记忆

---

## Markdown Compaction

WAL 中的记忆条目是碎片化的 — 每次对话可能生成数十条记忆片段。**Markdown Compaction** 定期将这些碎片压缩为结构化的 Markdown 文件，减少存储空间并提升检索效率。

### Compaction 流程

```
WAL 碎片记忆                          压缩后的 Markdown
┌────────────────┐                 ┌────────────────────────┐
│ mem-001: 用户 │                 │ # 用户偏好            │
│ 喜欢深色主题    │                 │                        │
│                │                 │ ## 接口                 │
│ mem-002: 用户 │   Compaction   │ - 偏好深色主题          │
│ 偏好 VS Code   │ ──────────────▶│ - 编辑器：VS Code       │
│                │                 │                        │
│ mem-003: 用户 │                 │ ## 语言                 │
│ 精通 TypeScript│                 │ - 精通 TypeScript       │
│                │                 │ - 惯用简体中文          │
│ mem-004: 用户 │                 │                        │
│ 用简体中文     │                 │ ## 技术背景             │
│                │                 │ - 前端开发为主          │
│ mem-005: 用户 │                 │ - 3 年工作经验          │
│ 做前端 3 年    │                 │                        │
└────────────────┘                 │ 最后更新: 2026-03-20   │
                                   └────────────────────────┘
```

### 压缩后的文件格式

压缩后的记忆存储在 `~/.openclaw/memory/compacted/` 目录下：

```
~/.openclaw/memory/compacted/
├── user-profile.md           # 用户个人数据与偏好
├── project-context.md        # 项目相关上下文
├── conversation-summaries/   # 对话摘要
│   ├── 2026-03-18.md
│   ├── 2026-03-19.md
│   └── 2026-03-20.md
└── facts.md                  # 已知事实库
```

`user-profile.md` 示例：

```markdown
# 用户个人数据

## 基本信息
- 职业：前端工程师
- 经验：3 年
- 地点：台北

## 技术偏好
- 主要语言：TypeScript, JavaScript
- 框架：React, Next.js
- 编辑器：VS Code (Vim 模式)
- 终端：iTerm2 + zsh
- 主题偏好：深色主题

## 沟通偏好
- 语言：简体中文，技术术语保留英文
- 响应风格：简洁，附带代码示例
- 避免：过度冗长的解释

## 近期项目
- **Project X**: Next.js 14 电商平台（进行中）
- **Side Project**: OpenClaw Skill 开发

---
*由 OpenClaw Memory Compaction 自动生成*
*最后更新: 2026-03-20T14:30:00Z*
*来源 WAL 条目: 47 笔*
```

### Compaction 策略

```toml
# ~/.openclaw/config.toml

[memory.compaction]
interval = 3600                  # 压缩间隔（秒），默认 1 小时
min_wal_entries = 20             # WAL 条目少于此数不触发压缩
importance_threshold = 0.3       # 低于此重要性的记忆在压缩时可能被丢弃
max_compacted_size = "10MB"      # 压缩后文件的最大大小
summarization_model = "fast"     # 压缩时使用的 LLM 模型（fast/balanced/thorough）
```

---

## Context Window 管理

Context Window Manager 负责在每次 LLM 呼叫时，从记忆库中智慧选择最相关的记忆片段注入 Prompt。

### 选择策略

Context Window Manager 使用加权评分来选择最相关的记忆：

```
最终分数 = (相关性 × 0.4) + (重要性 × 0.3) + (新鲜度 × 0.2) + (频率 × 0.1)
```

| 因素 | 权重 | 说明 |
|------|------|------|
| **相关性（Relevance）** | 0.4 | 记忆内容与当前对话的语意相似度 |
| **重要性（Importance）** | 0.3 | WAL 中记录的重要性分数 |
| **新鲜度（Recency）** | 0.2 | 越近期的记忆分数越高 |
| **频率（Frequency）** | 0.1 | 被引用次数越多的记忆分数越高 |

### Context Window 大小管理

```toml
# ~/.openclaw/config.toml

[memory.context]
max_tokens = 4096                # Context Window 中记忆占用的最大 Token 数
strategy = "adaptive"            # adaptive / fixed / manual
reserved_for_system = 1024       # 保留给系统 Prompt（SOUL.md 等）的 Token
reserved_for_skills = 512        # 保留给 Skill 描述的 Token
reserved_for_response = 2048     # 保留给响应的 Token
```

**策略说明：**

- **`adaptive`（自适应）**：根据对话复杂度动态调整记忆注入量
- **`fixed`（固定）**：始终注入 `max_tokens` 的记忆
- **`manual`（手动）**：由用户手动控制注入哪些记忆

### 注入流程可视化

```
用户消息: "继续昨天的 Project X 前端开发"

Context Window Manager 执行：
┌─────────────────────────────────────────────┐
│ 1. 语意搜索 "Project X 前端开发"             │
│    → 找到 12 笔相关记忆                      │
│                                             │
│ 2. 加权评分排序                              │
│    → [user-profile: 0.92]                   │
│    → [project-x-context: 0.89]              │
│    → [yesterday-summary: 0.85]              │
│    → [react-preferences: 0.71]              │
│    → ... (8 笔较低分)                        │
│                                             │
│ 3. Token 预算分配（4096 tokens）             │
│    → user-profile: 450 tokens ✓             │
│    → project-x-context: 820 tokens ✓        │
│    → yesterday-summary: 1200 tokens ✓       │
│    → react-preferences: 380 tokens ✓        │
│    → 剩余: 1246 tokens（未使用）             │
│                                             │
│ 4. 组合注入 Reasoning Layer                  │
└─────────────────────────────────────────────┘
```

---

## 实现：配置记忆保留与测试持久性

### 步骤 1：检视当前记忆状态

```bash
# 查看记忆统计
openclaw memory stats

# 输出示例：
# Memory System Statistics
# ────────────────────────
# WAL Entries:          147
# Compacted Files:      5
# Total Memory Size:    2.3 MB
# Oldest Memory:        2026-03-01
# Last Compaction:      2026-03-20T09:00:00Z
# Context Window Usage: 2,847 / 4,096 tokens
```

### 步骤 2：手动管理记忆

```bash
# 列出所有记忆条目
openclaw memory list

# 搜索特定记忆
openclaw memory search "TypeScript"

# 查看特定记忆的详细内容
openclaw memory show mem-a1b2c3d4

# 手动新增记忆
openclaw memory store \
  --type fact \
  --content "公司使用 GitLab 而非 GitHub" \
  --importance 0.8 \
  --tags "company,tools"

# 删除特定记忆
openclaw memory delete mem-a1b2c3d4

# 手动触发 Compaction
openclaw memory compact --now
```

### 步骤 3：测试记忆持久性

```bash
# 1. 开始一个新对话，告诉 Agent 一些个人信息
openclaw chat
> 我叫小明，是一个后端工程师，主要用 Go 语言开发

# 2. 确认记忆已存储
openclaw memory search "小明"

# 3. 完全停止 OpenClaw
openclaw stop

# 4. 重启
openclaw start

# 5. 开始新对话，测试 Agent 是否记得你
openclaw chat
> 你还记得我的名字和专长吗？

# 预期响应：Agent 应该能回想起你是「小明」，是后端工程师，使用 Go 语言
```

### 步骤 4：配置记忆保留策略

```bash
# 配置记忆保留天数
openclaw config set memory.retention_days 180

# 配置自动压缩间隔（30 分钟）
openclaw config set memory.compaction.interval 1800

# 配置最低重要性门槛
openclaw config set memory.compaction.importance_threshold 0.2

# 启用记忆加密（敏感环境）
openclaw config set memory.encryption true
openclaw config set memory.encryption_key_path "/path/to/key"
```

### 步骤 5：检视 Compaction 结果

```bash
# 查看压缩后的记忆文件
openclaw memory compacted list

# 查看特定压缩文件内容
openclaw memory compacted show user-profile

# 查看压缩历史
openclaw memory compaction-history

# 输出示例：
# Compaction History
# ──────────────────
# 2026-03-20T14:00:00Z  WAL: 32 entries → user-profile.md (updated)
# 2026-03-20T13:00:00Z  WAL: 28 entries → conversation-summaries/2026-03-20.md
# 2026-03-20T12:00:00Z  WAL: 15 entries → project-context.md (updated)
```

---

## 记忆类型与最佳实践

### 记忆类型

| 类型 | 用途 | 保留策略 | 示例 |
|------|------|----------|------|
| `preference` | 用户偏好 | 永久 | 语言偏好、接口配置 |
| `fact` | 已知事实 | 永久 | 公司名称、技术堆栈 |
| `conversation` | 对话摘要 | 依配置 | 昨天讨论了什么 |
| `task` | 任务记录 | 完成后 30 天 | 待办事项、进度 |
| `ephemeral` | 临时记忆 | Session 结束 | 当前操作的暂存信息 |

### 最佳实践

:::tip 记忆管理最佳实践

1. **定期审视记忆**：每周使用 `openclaw memory list` 检查记忆内容，删除过时或不正确的记忆。

2. **善用标签**：为重要记忆加上有意义的标签，帮助 Context Window Manager 更精准地检索。

3. **配置合理的保留期限**：不要永久保留所有记忆。`conversation` 类型建议保留 90 天，`task` 类型保留 30 天。

4. **注意隐私**：敏感信息（如密码、API Key）不应存入记忆。如果不小心存入，立即使用 `openclaw memory delete` 移除。

5. **监控记忆大小**：记忆过多会影响 Compaction 性能。使用 `openclaw memory stats` 定期监控。
:::

---

## 常见错误与故障排除

### 问题 1：记忆遗失

```
Agent 似乎忘记了之前告诉它的信息
```

**排查步骤**：
```bash
# 1. 确认 WAL 是否启用
openclaw config get memory.wal_enabled
# 应该返回 true

# 2. 搜索特定记忆
openclaw memory search "关键字"

# 3. 检查 Context Window 是否饱和
openclaw memory stats | grep "Context Window"

# 4. 可能原因：记忆存在但未被选入 Context Window
# 解法：提高相关记忆的重要性
openclaw memory update mem-xxx --importance 0.9
```

### 问题 2：Compaction 失败

```
Error: Memory compaction failed: LLM provider unavailable
```

**解法**：Compaction 需要呼叫 LLM 来生成摘要。确认 LLM Provider 连接正常。
```bash
# 测试 LLM 连接
openclaw test provider

# 使用离线 Compaction（不生成摘要，只合并）
openclaw memory compact --offline
```

### 问题 3：记忆占用过多磁碟空间

```bash
# 查看记忆占用空间
du -sh ~/.openclaw/memory/

# 清理过期的 WAL 文件
openclaw memory gc

# 配置更积极的保留策略
openclaw config set memory.retention_days 30
openclaw memory gc --apply-retention
```

### 问题 4：Context Window 溢出

```
Warning: Context window exceeded, truncating oldest memories
```

**解法**：
```bash
# 增加 Context Window 大小（需要 LLM 支援）
openclaw config set memory.context.max_tokens 8192

# 或使用更积极的记忆选择策略
openclaw config set memory.context.strategy "adaptive"
```

---

## 练习题

1. **记忆持久性测试**：在 OpenClaw 中进行一段包含多个主题的长对话（至少 20 则消息），然后重启系统，验证 Agent 在新 Session 中能回想起多少信息。记录哪些记忆被保留、哪些被遗忘，分析原因。

2. **Compaction 观察**：将 `compaction_interval` 设为 300 秒（5 分钟），连续与 Agent 对话 30 分钟，然后检查 `compacted/` 目录下生成的 Markdown 文件。分析压缩的品质。

3. **Context Window 优化**：尝试三种不同的 Context Window 策略（`adaptive`、`fixed`、`manual`），在相同的对话场景下比较 Agent 的响应品质。

4. **记忆清理**：使用 `openclaw memory list` 和 `openclaw memory search` 找出所有过时或不正确的记忆，执行清理，然后验证 Agent 不再引用这些已删除的记忆。

---

## 随堂测验

1. **WAL 的全名是什么？**
   - A) Web Application Layer
   - B) Write-Ahead Logging
   - C) Wide Area Link
   - D) Write-After Loading

2. **Markdown Compaction 的主要目的是？**
   - A) 压缩文件以节省带宽
   - B) 将碎片化的记忆压缩为结构化的 Markdown 摘要
   - C) 加密记忆内容
   - D) 将记忆同步到云端

3. **Context Window Manager 在选择记忆时，权重最高的因素是？**
   - A) 新鲜度（Recency）
   - B) 频率（Frequency）
   - C) 相关性（Relevance）
   - D) 重要性（Importance）

4. **以下哪种记忆类型的默认保留策略是「永久」？**
   - A) `conversation`
   - B) `ephemeral`
   - C) `preference`
   - D) `task`

5. **如果 Agent 似乎忘记了之前告诉它的信息，最可能的原因是？**
   - A) WAL 被损坏
   - B) 记忆存在但未被 Context Window Manager 选入当前 Prompt
   - C) LLM 模型有 Bug
   - D) Gateway 连接中断

<details>
<summary>查看答案</summary>

1. **B** — WAL 是 Write-Ahead Logging 的缩写，是一种先将变更写入日志、再实际修改数据的技术。
2. **B** — Markdown Compaction 将散乱的 WAL 记忆片段压缩为结构化的 Markdown 文件，提升存储效率与检索品质。
3. **C** — 相关性（Relevance）的权重为 0.4，是四个因素中最高的。
4. **C** — `preference`（用户偏好）和 `fact`（已知事实）的默认保留策略都是永久。
5. **B** — 最常见的原因是记忆确实存在于系统中，但 Context Window Manager 基于评分策略未将其选入当前 LLM 呼叫的 Prompt 中。

</details>

---

## 建议下一步

你已经深入了解了 OpenClaw 的记忆系统。至此，你已完成 **阶段一：核心基础** 的全部五个模块！你现在具备了理解与操作 OpenClaw 所有核心组件的知识。

接下来，进入 **阶段二：进阶应用**，学习如何利用 Heartbeat 和 Cron 构建自动化工作流程。

**[返回课程总览 →](./overview)**
