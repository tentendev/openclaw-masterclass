---
title: 架构概览
description: OpenClaw 四层式架构深度解析——Gateway、Reasoning Layer、Memory System、Skills Execution Layer 的设计原理与实现细节。
sidebar_position: 1
---

# 架构概览

OpenClaw 采用清晰的四层式架构设计，每一层各司其职、松耦合。本篇将深入分析每一层的设计原理、内部运作机制、以及各层之间的交互方式。

---

## 总体架构图

```
                    用户
                      │
          ┌───────────┼───────────┐
          │     通信平台 Channels   │
          │  Telegram│Discord│LINE │
          │  WhatsApp│Slack│Signal │
          └───────────┼───────────┘
                      │
    ╔═════════════════╪═════════════════╗
    ║  第一层：Gateway（闸道层）        ║
    ║  Port 18789                       ║
    ║  ┌────────────────────────────┐   ║
    ║  │ Channel Adapters           │   ║
    ║  │ Message Queue              │   ║
    ║  │ Auth & Rate Limiting       │   ║
    ║  │ REST API (internal)        │   ║
    ║  └────────────────────────────┘   ║
    ╠═══════════════════════════════════╣
    ║  第二层：Reasoning Layer（推理层）║
    ║  ┌────────────────────────────┐   ║
    ║  │ Intent Recognition         │   ║
    ║  │ LLM Router                 │   ║
    ║  │ Tool Selection             │   ║
    ║  │ Response Generation        │   ║
    ║  │ SOUL.md Personality        │   ║
    ║  └────────────────────────────┘   ║
    ╠═══════════════════════════════════╣
    ║  第三层：Memory System（记忆系统）║
    ║  ┌────────────────────────────┐   ║
    ║  │ WAL (Write-Ahead Log)      │   ║
    ║  │ Markdown Compaction        │   ║
    ║  │ Context Window Manager     │   ║
    ║  │ Long-term Memory Index     │   ║
    ║  └────────────────────────────┘   ║
    ╠═══════════════════════════════════╣
    ║  第四层：Skills / Execution      ║
    ║  ┌────────────────────────────┐   ║
    ║  │ Skill Registry             │   ║
    ║  │ Sandbox (Podman/Docker)    │   ║
    ║  │ Permission Enforcer        │   ║
    ║  │ Result Processor           │   ║
    ║  └────────────────────────────┘   ║
    ╚═══════════════════════════════════╝
```

---

## 第一层：Gateway（闸道层）

Gateway 是 OpenClaw 与外部世界沟通的唯一入口，默认监听 **port 18789**。

### 核心职责

1. **统一消息接收** — 接收来自 20+ 通信平台的消息
2. **格式标准化** — 将不同平台的消息格式转换为内部标准格式
3. **认证与授权** — 验证连入的请求是否合法
4. **速率限制** — 防止过量请求影响系统稳定性
5. **消息队列** — 管理消息的排队与优先顺序

### Channel Adapter 架构

每个通信平台都有一个对应的 **Channel Adapter**，负责处理该平台特有的协议：

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Telegram    │  │  Discord     │  │  WhatsApp    │
│  Adapter     │  │  Adapter     │  │  Adapter     │
│  (Bot API)   │  │  (WebSocket) │  │  (Baileys)   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────┬───────┘─────────────────┘
                 │
         ┌───────▼───────┐
         │  Unified      │
         │  Message      │
         │  Format       │
         └───────┬───────┘
                 │
         ┌───────▼───────┐
         │  Message      │
         │  Queue        │
         └───────────────┘
```

### 统一消息格式

```json
{
  "id": "msg_abc123",
  "timestamp": "2026-03-20T10:30:00Z",
  "channel": {
    "type": "telegram",
    "id": "chat_456",
    "name": "My Chat"
  },
  "sender": {
    "id": "user_789",
    "name": "用户名称",
    "role": "user"
  },
  "content": {
    "type": "text",
    "text": "帮我查一下明天的天气",
    "attachments": []
  },
  "metadata": {
    "reply_to": null,
    "thread_id": null,
    "platform_specific": {}
  }
}
```

### Gateway 配置

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"
  auth:
    enabled: true
    token: "${GATEWAY_AUTH_TOKEN}"
  rate_limit:
    requests_per_minute: 60
    burst: 10
  queue:
    max_size: 1000
    timeout_ms: 30000
  logging:
    level: "info"  # debug | info | warn | error
    file: "~/.openclaw/logs/gateway.log"
```

:::danger 安全提醒
Gateway 是 OpenClaw 最大的攻击面。已有超过 30,000 个实例因暴露 18789 埠而被入侵。**永远绑定到 `127.0.0.1`**。详见 [安全性最佳实践](/docs/security/best-practices)。
:::

### 支援的通信平台

| 平台 | 协议 | Adapter 状态 |
|------|------|-------------|
| Telegram | Bot API (HTTP) | 稳定 |
| Discord | WebSocket + REST | 稳定 |
| WhatsApp | Baileys (WebSocket) | 稳定 |
| Slack | Events API + WebSocket | 稳定 |
| LINE | Messaging API | 稳定 |
| Signal | signal-cli (DBus) | 稳定 |
| iMessage | AppleScript bridge | Beta |
| Matrix | Matrix Client-Server API | 稳定 |
| Microsoft Teams | Graph API | 稳定 |
| Messenger | Graph API | Beta |
| WeChat | WeChatFerry | 社区维护 |
| Email (IMAP/SMTP) | 标准协议 | 稳定 |
| Web UI | WebSocket | 稳定 |
| REST API | HTTP | 稳定 |

---

## 第二层：Reasoning Layer（推理层）

推理层是 OpenClaw 的「大脑」，负责理解用户意图、决定行动策略、并生成响应。

### 处理流程

```
收到消息
    │
    ▼
┌─────────────┐
│ 加载上下文   │ ← 从 Memory System 获取相关记忆
│ (Context)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 意图识别     │ ← 判断用户想做什么
│ (Intent)     │
└──────┬──────┘
       │
       ├── 直接回答 ──→ 生成响应 ──→ 传回 Gateway
       │
       ├── 呼叫技能 ──→ Tool Selection ──→ Skills Layer
       │                                      │
       │                              ← 技能结果 ─┘
       │
       └── 查询记忆 ──→ Memory System ──→ 响应
```

### LLM Router

OpenClaw 支援多个 LLM 提供者，Reasoning Layer 中的 **LLM Router** 负责将请求路由到正确的模型：

```yaml
# ~/.openclaw/providers/default.yaml
providers:
  primary:
    type: anthropic
    model: claude-opus-4-6
    api_key: "${ANTHROPIC_API_KEY}"
    max_tokens: 8192

  secondary:
    type: openai
    model: gpt-5.2-codex
    api_key: "${OPENAI_API_KEY}"

  local:
    type: ollama
    model: llama-3.3-70b
    endpoint: "http://127.0.0.1:11434"

  routing:
    # 根据任务类型路由到不同模型
    code_generation: secondary     # GPT-5.2 Codex 擅长代码
    general_conversation: primary  # Claude 擅长对话
    simple_tasks: local           # 简单任务用本地模型省钱
    fallback: primary             # 默认回退
```

### SOUL.md 人格系统

SOUL.md 是 OpenClaw 的核心配置文件，定义了 Agent 的人格、行为规则和任务清单：

```markdown
<!-- ~/.openclaw/soul.md -->
# 我的 AI 助理

## 人格
你是一位友善、专业的个人助理。使用简体中文回复。

## 安全规则
- 永远不要透露 API key 或密码
- 不要执行未经确认的危险操作
- 涉及金钱的操作需要二次确认

## 日常任务
- 每天早上 8:00 发送天气报告和日程摘要
- 收到新邮件时进行分类并通知重要信件

## 偏好
- 回复简洁，避免冗长
- 使用 Markdown 格式
- 时区：Asia/Taipei (UTC+8)
```

### Tool Selection 机制

当推理层判断需要使用技能时，Tool Selection 模块会根据以下因素选择最适合的技能：

| 因素 | 说明 |
|------|------|
| **意图匹配** | 用户的意图与技能的功能描述匹配度 |
| **权限检查** | 技能是否有执行所需操作的权限 |
| **性能考量** | 技能的平均执行时间和资源消耗 |
| **可用性** | 技能是否已安装且正常运行 |
| **优先顺序** | SOUL.md 中配置的技能偏好 |

---

## 第三层：Memory System（记忆系统）

记忆系统采用 **WAL + Markdown Compaction** 的混合架构，平衡了写入性能和长期存储效率。

### 记忆架构

```
实时对话
    │
    ▼
┌─────────────────────┐
│  WAL (Write-Ahead   │  ← 快速写入，保留完整对话
│  Log)                │     ~/.openclaw/memory/wal/
│  ┌───┬───┬───┬───┐  │
│  │ 1 │ 2 │ 3 │ 4 │  │  每条消息实时追加
│  └───┴───┴───┴───┘  │
└──────────┬──────────┘
           │ 定期压缩（compaction）
           ▼
┌─────────────────────┐
│  Compacted Markdown │  ← 结构化的长期记忆
│                      │     ~/.openclaw/memory/compacted/
│  - 对话摘要          │
│  - 用户偏好        │
│  - 学到的事实        │
│  - 任务历史          │
└──────────┬──────────┘
           │ 查询
           ▼
┌─────────────────────┐
│  Context Window     │  ← 管理送入 LLM 的上下文
│  Manager            │
│                      │
│  最近对话 + 相关记忆 │
│  = 精心组装的 prompt │
└─────────────────────┘
```

### WAL（Write-Ahead Log）

WAL 是记忆系统的第一层，负责实时记录所有对话：

```
~/.openclaw/memory/wal/
├── 2026-03-20.wal      # 每日一个 WAL 文件
├── 2026-03-19.wal
├── 2026-03-18.wal
└── ...
```

**WAL 条目格式：**

```json
{
  "seq": 12345,
  "timestamp": "2026-03-20T10:30:00Z",
  "type": "message",
  "channel": "telegram",
  "role": "user",
  "content": "帮我查一下明天的天气",
  "metadata": {
    "tokens": 15,
    "conversation_id": "conv_abc"
  }
}
```

### Markdown Compaction（压缩）

WAL 中的原始对话会定期压缩为结构化的 Markdown 文件：

```markdown
<!-- ~/.openclaw/memory/compacted/user-preferences.md -->
# 用户偏好

## 饮食
- 不吃辣
- 喜欢日本料理
- 对花生过敏

## 工作
- 软件工程师
- 使用 TypeScript 和 Python
- 偏好 VS Code

## 时区与习惯
- 时区：Asia/Taipei (UTC+8)
- 通常在 9:00-18:00 工作
- 周末较晚起床
```

```markdown
<!-- ~/.openclaw/memory/compacted/conversation-summaries/2026-03.md -->
# 2026 年 3 月对话摘要

## 3/18 — 购车研究
用户正在考虑购买 Toyota RAV4。Agent 搜索了市场行情，
建议在月底促销期购买，预估可省 $4,000-5,000。

## 3/19 — 博客迁移
协助用户将 Notion 上的 18 篇文章迁移到 Astro。
已完成格式转换和 Cloudflare DNS 配置。

## 3/20 — 天气与日程
早上发送了天气报告。用户询问了明天的天气。
```

### Context Window Manager

Context Window Manager 负责在 LLM 的 token 限制内，组装最有价值的上下文：

```
上下文组装优先顺序：
1. System Prompt（SOUL.md）        — 最高优先
2. 最近 N 轮对话                   — 短期记忆
3. 相关的压缩记忆                  — 长期记忆
4. 可用技能列表                    — Tool definitions
5. 当前任务的补充信息              — 最低优先
```

**Token 分配策略：**

| 组件 | 默认分配 | 说明 |
|------|---------|------|
| System Prompt | 15% | SOUL.md 和安全命令 |
| 最近对话 | 40% | 最近的对话记录 |
| 长期记忆 | 20% | 相关的压缩记忆 |
| Tool 定义 | 15% | 可用技能的描述 |
| 保留空间 | 10% | 留给模型的响应空间 |

---

## 第四层：Skills / Execution Layer（技能 / 执行层）

技能层负责在安全的沙盒环境中执行各种操作。

### 技能生命周期

```
ClawHub                 本机
  │                       │
  │  openclaw skill       │
  │  install xxx          │
  ├───────────────────────►│
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 下载 &    │
  │                 │ VirusTotal│
  │                 │ 验证      │
  │                 └─────┬─────┘
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 安装到    │
  │                 │ Skills 目录│
  │                 └─────┬─────┘
  │                       │
  │     用户请求呼叫技能  │
  │                       │
  │                 ┌─────▼─────┐
  │                 │ Permission│
  │                 │ Check     │
  │                 └─────┬─────┘
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 创建沙盒  │
  │                 │ Container │
  │                 └─────┬─────┘
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 执行技能  │
  │                 └─────┬─────┘
  │                       │
  │                 ┌─────▼─────┐
  │                 │ 返回结果  │
  │                 └───────────┘
```

### 沙盒架构

```
┌─────────────────────────────────────┐
│  主机系统                           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Podman Rootless Container  │   │
│  │                             │   │
│  │  ┌───────────────────────┐  │   │
│  │  │  Skill Runtime        │  │   │
│  │  │  (Node.js / Python)   │  │   │
│  │  └───────────────────────┘  │   │
│  │                             │   │
│  │  限制：                     │   │
│  │  - 内存：512MB            │   │
│  │  - CPU：1 core              │   │
│  │  - 网络：受限域名           │   │
│  │  - 文件：只读 + /tmp       │   │
│  │  - 无 root 权限             │   │
│  │  - seccomp profile          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Skill Registry

Skill Registry 管理所有已安装的技能，并提供给 Reasoning Layer 的 Tool Selection 使用：

```
~/.openclaw/skills/
├── web-search/
│   ├── manifest.yaml    # 技能声明
│   ├── index.js         # 主进程
│   ├── package.json     # 依赖
│   └── permissions.override.yaml  # 权限覆盖
├── email-manager/
│   ├── manifest.yaml
│   ├── main.py
│   └── requirements.txt
├── browser-use/
│   └── ...
└── .cache/              # 技能缓存
```

### 技能与 LLM 的交互

技能以 **Tool Use / Function Calling** 的方式与 LLM 交互：

```json
// LLM 收到的技能定义（自动从 manifest.yaml 生成）
{
  "type": "function",
  "function": {
    "name": "web_search",
    "description": "搜索网络上的信息",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "搜索关键字"
        },
        "num_results": {
          "type": "integer",
          "description": "返回结果数量",
          "default": 5
        }
      },
      "required": ["query"]
    }
  }
}
```

---

## 各层之间的通信

### 内部通信协议

各层之间透过 **内部事件汇流排（Event Bus）** 沟通：

| 事件 | 来源 | 目标 | 说明 |
|------|------|------|------|
| `message.received` | Gateway | Reasoning | 收到新消息 |
| `message.send` | Reasoning | Gateway | 发送响应到通信平台 |
| `memory.read` | Reasoning | Memory | 查询记忆 |
| `memory.write` | Reasoning | Memory | 写入新记忆 |
| `skill.invoke` | Reasoning | Skills | 呼叫技能 |
| `skill.result` | Skills | Reasoning | 技能执行结果 |
| `skill.error` | Skills | Reasoning | 技能执行失败 |

### 请求-响应流程示例

以「帮我查一下明天台北的天气」为例：

```
1. 用户在 Telegram 发送消息
2. Telegram Adapter 接收 → 转换为统一格式
3. Gateway 将消息推入队列
4. Reasoning Layer 取出消息
5. Context Window Manager 组装上下文
   - SOUL.md
   - 最近 5 轮对话
   - 用户偏好（记得在台北）
6. LLM Router → 送交 Claude
7. Claude 判断需要呼叫 weather skill
8. Tool Selection → weather skill
9. Permission Enforcer 检查权限 ✅
10. 创建 Podman container
11. weather skill 呼叫天气 API
12. 返回天气数据
13. Claude 根据天气数据生成响应
14. Memory 写入本次对话
15. Gateway 透过 Telegram Adapter 发送响应
```

---

## 性能考量

### 延迟分析

| 阶段 | 典型延迟 | 瓶颈因素 |
|------|---------|---------|
| Gateway 接收 | < 10ms | 网络延迟 |
| 上下文组装 | 50-200ms | 记忆查询 |
| LLM 推理 | 1-10s | 模型大小、API 延迟 |
| 技能执行 | 100ms-30s | 外部 API、容器启动 |
| Gateway 返回 | < 10ms | 网络延迟 |
| **总计** | **1.5-40s** | 主要取决于 LLM |

### 容器启动优化

```yaml
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  optimization:
    # 预热容器池——避免冷启动延迟
    warm_pool_size: 3
    # 容器重复使用
    reuse_containers: true
    reuse_timeout_seconds: 300
```

---

## 延伸阅读

- [API 参考](/docs/architecture/api-reference) — Gateway REST API 完整文件
- [安全性最佳实践](/docs/security/best-practices) — 各层的安全配置
- [威胁模型分析](/docs/security/threat-model) — 各层的安全威胁分析
