---
title: "模块 2: Gateway 深入解析"
sidebar_position: 3
description: "深入理解 OpenClaw Gateway 的 WebSocket 协调机制、消息路由、Channel 抽象与调试技巧"
keywords: [OpenClaw, Gateway, WebSocket, 消息路由, Channel, port 18789]
---

# 模块 2: Gateway 深入解析

## 学习目标

完成本模块后，你将能够：

- 说明 Gateway 的 WebSocket 协调机制与连接生命周期
- 理解消息路由与 Channel 抽象的运作原理
- 使用工具检查与调试 WebSocket 流量
- 配置 Gateway 的进阶参数（Rate Limiting、Heartbeat 等）
- 排除常见的 Gateway 连接问题

:::info 前置条件
请先完成 [模块 1: OpenClaw 基础架构](./module-01-foundations)，确保你理解四层架构的基本概念。
:::

---

## Gateway 架构概览

Gateway 是 OpenClaw 与外部世界的唯一接口。它运行在 **port 18789** 上，负责管理所有 WebSocket 连接，并将消息路由到正确的内部组件。

```
外部客户端                         Gateway 内部
┌──────────┐                  ┌──────────────────────────────┐
│ CLI 客户端│──┐               │                              │
└──────────┘  │               │  ┌────────────────────┐      │
┌──────────┐  │  WebSocket    │  │  Connection Pool   │      │
│ Web UI   │──┼──────────────▶│  │  ┌──────┐┌──────┐ │      │
└──────────┘  │  :18789       │  │  │Conn 1││Conn 2│ │      │
┌──────────┐  │               │  │  └──────┘└──────┘ │      │
│ 第三方   │──┘               │  └────────┬───────────┘      │
│ 集成     │                  │           │                   │
└──────────┘                  │  ┌────────▼───────────┐      │
                              │  │  Message Router     │      │
                              │  │  ┌───────────────┐ │      │
                              │  │  │ Route Table   │ │      │
                              │  │  └───────────────┘ │      │
                              │  └────────┬───────────┘      │
                              │           │                   │
                              │  ┌────────▼───────────┐      │
                              │  │  Channel Manager   │      │
                              │  │  ┌─────┐ ┌─────┐  │      │
                              │  │  │ CH-1│ │ CH-2│  │      │
                              │  │  └─────┘ └─────┘  │      │
                              │  └────────────────────┘      │
                              └──────────────────────────────┘
```

---

## WebSocket 连接生命周期

每个 WebSocket 连接都经历明确的生命周期阶段：

### 1. 握手阶段 (Handshake)

```
Client                          Gateway
  │                                │
  │── HTTP Upgrade Request ───────▶│
  │   GET / HTTP/1.1               │
  │   Upgrade: websocket           │
  │   Connection: Upgrade          │
  │   Sec-WebSocket-Key: xxx       │
  │                                │
  │◀── 101 Switching Protocols ────│
  │   Upgrade: websocket           │
  │   Sec-WebSocket-Accept: yyy    │
  │                                │
  │══════ WebSocket 连接创建 ══════│
```

### 2. 认证阶段 (Authentication)

连接创建后，客户端必须在 **5 秒内** 发送认证消息：

```json
{
  "jsonrpc": "2.0",
  "method": "auth.handshake",
  "params": {
    "client_id": "cli-macbook-pro",
    "client_version": "0.9.4",
    "token": "oc_local_xxxxxxxxxxxx"
  },
  "id": "auth-001"
}
```

Gateway 响应：

```json
{
  "jsonrpc": "2.0",
  "result": {
    "session_id": "sess-a1b2c3d4",
    "channels": ["default"],
    "heartbeat_interval": 30,
    "server_version": "0.9.4"
  },
  "id": "auth-001"
}
```

### 3. 活跃阶段 (Active)

认证后进入活跃阶段。此阶段中，Gateway 维持以下机制：

- **Heartbeat**：每 30 秒（可配置）发送 ping/pong
- **消息路由**：根据 `method` 字段将消息分派到对应的处理器
- **Channel 管理**：支援多个同时对话 Channel

### 4. 终止阶段 (Termination)

连接可因以下原因终止：

| 终止原因 | Close Code | 说明 |
|----------|-----------|------|
| 正常关闭 | 1000 | 客户端主动断线 |
| 认证超时 | 4001 | 5 秒内未完成认证 |
| Heartbeat 超时 | 4002 | 连续 3 次未响应 heartbeat |
| Rate Limit | 4003 | 超过消息频率上限 |
| 服务器关闭 | 1001 | Gateway 正在关闭 |
| 协议错误 | 1002 | 无效的消息格式 |

---

## 消息路由

Gateway 的 Message Router 使用 **method-based routing**，根据 JSON-RPC 消息的 `method` 字段决定目标：

```
method 前缀          目标处理器
─────────────────────────────────
chat.*           →  Reasoning Layer
memory.*         →  Memory System
skill.*          →  Skills Manager
system.*         →  System Controller
channel.*        →  Channel Manager
heartbeat.*      →  Heartbeat Handler
```

### 常见的 Method 列表

| Method | 方向 | 说明 |
|--------|------|------|
| `chat.send` | Client → Server | 发送对话消息 |
| `chat.stream` | Server → Client | 流式响应（逐 Token） |
| `chat.complete` | Server → Client | 响应完成通知 |
| `skill.invoke` | Server → Client | 通知客户端正在执行 Skill |
| `skill.result` | Server → Client | Skill 执行结果 |
| `memory.recall` | Internal | 回忆相关记忆 |
| `channel.create` | Client → Server | 创建新 Channel |
| `channel.switch` | Client → Server | 切换 Channel |
| `channel.list` | Client → Server | 列出所有 Channel |
| `heartbeat.ping` | Server → Client | 心跳检测 |
| `heartbeat.pong` | Client → Server | 心跳响应 |
| `system.status` | Client → Server | 查询系统状态 |

### 流式响应机制

当 Reasoning Layer 透过 LLM 生成响应时，Gateway 以流式方式实时发送每个 Token：

```json
// 第一个 chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"你好","index":0,"channel":"default"}}

// 第二个 chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"！今天","index":1,"channel":"default"}}

// 第三个 chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"天气如何？","index":2,"channel":"default"}}

// 完成通知
{"jsonrpc":"2.0","method":"chat.complete","params":{"total_tokens":156,"channel":"default","duration_ms":1230}}
```

---

## Channel 抽象

Channel 是 OpenClaw 对「对话上下文」的抽象。每个 Channel 拥有独立的对话历史和记忆空间。

### Channel 的特性

- **隔离性**：不同 Channel 的记忆互不影响
- **持久性**：Channel 记忆会被持久化到 Memory System
- **并行性**：同一连接可同时操作多个 Channel
- **命名空间**：每个 Channel 有唯一的 ID 与可选的名称

### Channel 操作

```json
// 创建新 Channel
{
  "jsonrpc": "2.0",
  "method": "channel.create",
  "params": {
    "name": "code-review-project-x",
    "metadata": {
      "project": "project-x",
      "purpose": "code-review"
    }
  },
  "id": "ch-001"
}

// 切换 Channel
{
  "jsonrpc": "2.0",
  "method": "channel.switch",
  "params": {
    "channel_id": "ch-a1b2c3"
  },
  "id": "ch-002"
}

// 列出所有 Channel
{
  "jsonrpc": "2.0",
  "method": "channel.list",
  "params": {},
  "id": "ch-003"
}
```

---

## Heartbeat 系统

Heartbeat 是 Gateway 用来检测连接是否仍然活跃的机制。除了连接健康检查外，OpenClaw 还利用 Heartbeat 实现**主动通知（Proactive Notifications）**功能。

```
Gateway                        Client
  │                               │
  │── heartbeat.ping ───────────▶ │
  │   {"seq": 42,                 │
  │    "notifications": [         │
  │      {"type": "reminder",     │
  │       "msg": "下午 3 点有会议"}│
  │    ]}                         │
  │                               │
  │◀── heartbeat.pong ─────────── │
  │   {"seq": 42,                 │
  │    "client_load": 0.45}       │
  │                               │
```

:::tip Heartbeat 与 Proactive Notifications
Heartbeat 不只是简单的 ping/pong。Gateway 会在 heartbeat 消息中夹带通知，例如调度提醒、Skill 完成通知、系统警告等。这个机制让 Agent 能够「主动」联系用户。详见模块 6 的自动化章节。
:::

### Heartbeat 配置

```toml
# ~/.openclaw/config.toml

[gateway]
heartbeat_interval = 30          # ping 间隔（秒）
heartbeat_timeout = 90           # 超时时间（秒），= 3 × interval
heartbeat_max_missed = 3         # 最大容许遗漏次数
proactive_notifications = true   # 启用主动通知
```

---

## 实现：检查与调试 WebSocket 流量

### 步骤 1：使用 `websocat` 连接

[websocat](https://github.com/vi/websocat) 是一个强大的 WebSocket 命令列工具。

```bash
# 安装
brew install websocat  # macOS
# 或
cargo install websocat  # 透过 Rust

# 连接到 Gateway
websocat ws://127.0.0.1:18789
```

连接后，手动发送认证消息：

```json
{"jsonrpc":"2.0","method":"auth.handshake","params":{"client_id":"debug-client","client_version":"0.9.4","token":"oc_local_debug"},"id":"auth-001"}
```

### 步骤 2：使用 OpenClaw 内建调试模式

```bash
# 启动 Gateway 调试模式
openclaw gateway --debug

# 在另一个终端观察实时消息流
openclaw gateway trace --verbose
```

调试模式会输出每个消息的完整路由信息：

```
[DEBUG] 2026-03-20T10:15:23Z RECV  msg_id=msg-001 method=chat.send channel=default size=128B
[DEBUG] 2026-03-20T10:15:23Z ROUTE msg_id=msg-001 → ReasoningLayer latency=0.2ms
[DEBUG] 2026-03-20T10:15:24Z SEND  msg_id=msg-001 method=chat.stream chunk=0 size=32B
[DEBUG] 2026-03-20T10:15:24Z SEND  msg_id=msg-001 method=chat.stream chunk=1 size=28B
[DEBUG] 2026-03-20T10:15:25Z SEND  msg_id=msg-001 method=chat.complete tokens=156 duration=1230ms
```

### 步骤 3：使用浏览器 DevTools 观察

如果你使用 OpenClaw Web UI，可以在浏览器的 DevTools 中观察 WebSocket 流量：

1. 开启 Chrome DevTools（F12）
2. 切换到 **Network** 选项卡
3. 筛选 **WS**（WebSocket）
4. 点击 WebSocket 连接，切换到 **Messages** 子选项卡
5. 观察实时的消息收发

### 步骤 4：监控 Gateway 指标

```bash
# 查看 Gateway 实时状态
openclaw status gateway --watch

# 输出示例：
# Gateway Status (refreshing every 2s)
# ─────────────────────────────────────
# Uptime:              4h 23m 15s
# Active Connections:  2
# Total Messages:      1,847
# Messages/sec:        0.12
# Active Channels:     3
# Memory Usage:        45 MB
# Heartbeat OK:        2/2
# Rate Limit Hits:     0
```

---

## Gateway 进阶配置

### Rate Limiting

```toml
[gateway.rate_limit]
enabled = true
messages_per_second = 10         # 每秒最大消息数
messages_per_minute = 200        # 每分钟最大消息数
burst_size = 20                  # 突发容许量
cooldown_seconds = 60            # 触发后冷却时间
```

### TLS 配置（生产环境）

```toml
[gateway.tls]
enabled = true
cert_path = "/etc/openclaw/tls/cert.pem"
key_path = "/etc/openclaw/tls/key.pem"
min_version = "1.2"
```

:::warning 生产环境必备
在生产环境中，务必启用 TLS。未加密的 WebSocket 连接（`ws://`）在公开网络上是不安全的。使用 `wss://` 加密连接。详见模块 10 的生产部署章节。
:::

---

## 常见错误与故障排除

### 问题 1：WebSocket 连接被立即关闭

```
Connection closed: code=4001, reason="Authentication timeout"
```

**原因**：连接创建后 5 秒内未发送认证消息。
**解法**：确认客户端在连接后立即发送 `auth.handshake` 消息。

### 问题 2：消息路由失败

```
{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found: chat.sendd"},"id":"msg-001"}
```

**原因**：`method` 字段拼写错误（`sendd` 多了一个 `d`）。
**解法**：核对 method 名称。使用 `openclaw gateway methods` 查看所有支援的 method。

### 问题 3：Heartbeat 超时断线

```
Connection closed: code=4002, reason="Heartbeat timeout"
```

**原因**：客户端未在时限内响应 heartbeat ping。
**解法**：
```bash
# 增加 heartbeat 超时容忍度
openclaw config set gateway.heartbeat_timeout 120
openclaw config set gateway.heartbeat_max_missed 5
```

### 问题 4：Rate Limit 触发

```
{"jsonrpc":"2.0","error":{"code":4003,"message":"Rate limit exceeded"},"id":"msg-042"}
```

**原因**：消息发送频率超过上限。
**解法**：在客户端实现 exponential backoff，或调整 Rate Limit 配置。

---

## 练习题

1. **WebSocket 抓包分析**：使用 `websocat` 连接到 Gateway，完成认证后发送一则 `chat.send` 消息，观察并记录完整的响应流程（包含所有 `chat.stream` 与 `chat.complete` 消息）。

2. **Channel 管理**：创建三个不同的 Channel，分别命名为 `coding`、`writing` 和 `research`。在每个 Channel 中发送不同主题的消息，然后切换 Channel 确认对话上下文的隔离性。

3. **Heartbeat 观察**：将 `heartbeat_interval` 配置为 5 秒，观察 Gateway 的 heartbeat 行为。故意不响应 pong，看连接何时被断开。

4. **性能测试**：使用 `websocat` 或自行撰写的脚本，快速发送 50 则消息，观察 Rate Limiting 的触发时机与行为。

---

## 随堂测验

1. **OpenClaw Gateway 使用的通信协议是？**
   - A) HTTP REST API
   - B) gRPC
   - C) WebSocket
   - D) MQTT

2. **客户端创建 WebSocket 连接后，必须在几秒内完成认证？**
   - A) 1 秒
   - B) 5 秒
   - C) 10 秒
   - D) 30 秒

3. **以下哪个不是 Gateway Close Code？**
   - A) 4001 — 认证超时
   - B) 4002 — Heartbeat 超时
   - C) 4003 — Rate Limit
   - D) 4004 — Skill 执行失败

4. **Heartbeat 系统除了检测连接状态外，还有什么功能？**
   - A) 压缩消息
   - B) 主动通知（Proactive Notifications）
   - C) 加密流量
   - D) 记忆同步

5. **`chat.stream` 消息的用途是？**
   - A) 创建新的 Channel
   - B) 以流式方式逐 Token 发送 LLM 响应
   - C) 同步记忆数据
   - D) 执行 Skill

<details>
<summary>查看答案</summary>

1. **C** — Gateway 使用 WebSocket 协议在 port 18789 上运行。
2. **B** — 客户端必须在 5 秒内完成 `auth.handshake`，否则连接会被关闭（close code 4001）。
3. **D** — 4004 不是 Gateway 的 Close Code。Skill 执行失败会透过一般的 error response 回报，不会断开连接。
4. **B** — Heartbeat 消息中会夹带 Proactive Notifications，让 Agent 能主动通知用户调度提醒、任务完成等事件。
5. **B** — `chat.stream` 用于流式发送 LLM 的响应，让用户能实时看到生成中的内容。

</details>

---

## 建议下一步

你已经深入了解了 Gateway 的运作机制。接下来，让我们进入 OpenClaw 最强大的功能之一 — Skills 系统。

**[前往模块 3: Skills 系统与 SKILL.md 规范 →](./module-03-skills-system)**
