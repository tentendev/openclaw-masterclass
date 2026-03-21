---
title: "Module 2: Gateway Deep Dive"
sidebar_position: 3
description: "Deep dive into the OpenClaw Gateway's WebSocket orchestration, message routing, Channel abstraction, and debugging techniques"
keywords: [OpenClaw, Gateway, WebSocket, message routing, Channel, port 18789]
---

# Module 2: Gateway Deep Dive

## Learning Objectives

By the end of this module, you will be able to:

- Explain the Gateway's WebSocket orchestration and connection lifecycle
- Understand how message routing and Channel abstraction work
- Use tools to inspect and debug WebSocket traffic
- Configure advanced Gateway parameters (Rate Limiting, Heartbeat, etc.)
- Troubleshoot common Gateway connection issues

:::info Prerequisites
Please complete [Module 1: OpenClaw Foundations](./module-01-foundations) first, ensuring you understand the basic four-layer architecture concepts.
:::

---

## Gateway Architecture Overview

The Gateway is OpenClaw's sole interface with the outside world. It runs on **port 18789**, managing all WebSocket connections and routing messages to the correct internal components.

```
External Clients                     Gateway Internals
┌──────────┐                  ┌──────────────────────────────┐
│ CLI Client│──┐               │                              │
└──────────┘  │               │  ┌────────────────────┐      │
┌──────────┐  │  WebSocket    │  │  Connection Pool   │      │
│ Web UI   │──┼──────────────▶│  │  ┌──────┐┌──────┐ │      │
└──────────┘  │  :18789       │  │  │Conn 1││Conn 2│ │      │
┌──────────┐  │               │  │  └──────┘└──────┘ │      │
│ Third-   │──┘               │  └────────┬───────────┘      │
│ party    │                  │           │                   │
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

## WebSocket Connection Lifecycle

Every WebSocket connection goes through clearly defined lifecycle stages:

### 1. Handshake Phase

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
  │══════ WebSocket Established ═══│
```

### 2. Authentication Phase

After the connection is established, the client must send an authentication message within **5 seconds**:

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

Gateway response:

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

### 3. Active Phase

After authentication, the connection enters the active phase. During this phase, the Gateway maintains the following mechanisms:

- **Heartbeat**: Sends ping/pong every 30 seconds (configurable)
- **Message Routing**: Dispatches messages to the appropriate handler based on the `method` field
- **Channel Management**: Supports multiple concurrent conversation Channels

### 4. Termination Phase

A connection can terminate for the following reasons:

| Reason | Close Code | Description |
|---|---|---|
| Normal close | 1000 | Client-initiated disconnect |
| Auth timeout | 4001 | Authentication not completed within 5 seconds |
| Heartbeat timeout | 4002 | 3 consecutive heartbeats without a response |
| Rate Limit | 4003 | Message rate limit exceeded |
| Server shutdown | 1001 | Gateway is shutting down |
| Protocol error | 1002 | Invalid message format |

---

## Message Routing

The Gateway's Message Router uses **method-based routing**, determining the target based on the JSON-RPC message's `method` field:

```
method prefix          Target Handler
─────────────────────────────────
chat.*           →  Reasoning Layer
memory.*         →  Memory System
skill.*          →  Skills Manager
system.*         →  System Controller
channel.*        →  Channel Manager
heartbeat.*      →  Heartbeat Handler
```

### Common Methods

| Method | Direction | Description |
|---|---|---|
| `chat.send` | Client → Server | Send a chat message |
| `chat.stream` | Server → Client | Streaming response (token by token) |
| `chat.complete` | Server → Client | Response completion notification |
| `skill.invoke` | Server → Client | Notify client that a Skill is being executed |
| `skill.result` | Server → Client | Skill execution result |
| `memory.recall` | Internal | Recall relevant memories |
| `channel.create` | Client → Server | Create a new Channel |
| `channel.switch` | Client → Server | Switch Channel |
| `channel.list` | Client → Server | List all Channels |
| `heartbeat.ping` | Server → Client | Heartbeat check |
| `heartbeat.pong` | Client → Server | Heartbeat response |
| `system.status` | Client → Server | Query system status |

### Streaming Response Mechanism

When the Reasoning Layer generates a response via an LLM, the Gateway streams each token to the client in real time:

```json
// First chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"Hello","index":0,"channel":"default"}}

// Second chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"! How is","index":1,"channel":"default"}}

// Third chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":" the weather today?","index":2,"channel":"default"}}

// Completion notification
{"jsonrpc":"2.0","method":"chat.complete","params":{"total_tokens":156,"channel":"default","duration_ms":1230}}
```

---

## Channel Abstraction

A Channel is OpenClaw's abstraction for a "conversation context." Each Channel has its own independent conversation history and memory space.

### Channel Characteristics

- **Isolation**: Memories in different Channels do not affect each other
- **Persistence**: Channel memories are persisted to the Memory System
- **Concurrency**: A single connection can operate on multiple Channels simultaneously
- **Namespace**: Each Channel has a unique ID and an optional name

### Channel Operations

```json
// Create a new Channel
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

// Switch Channel
{
  "jsonrpc": "2.0",
  "method": "channel.switch",
  "params": {
    "channel_id": "ch-a1b2c3"
  },
  "id": "ch-002"
}

// List all Channels
{
  "jsonrpc": "2.0",
  "method": "channel.list",
  "params": {},
  "id": "ch-003"
}
```

---

## Heartbeat System

The Heartbeat is the Gateway's mechanism for detecting whether a connection is still alive. Beyond connection health checks, OpenClaw also leverages the Heartbeat to implement **Proactive Notifications**.

```
Gateway                        Client
  │                               │
  │── heartbeat.ping ───────────▶ │
  │   {"seq": 42,                 │
  │    "notifications": [         │
  │      {"type": "reminder",     │
  │       "msg": "Meeting at 3 PM"}│
  │    ]}                         │
  │                               │
  │◀── heartbeat.pong ─────────── │
  │   {"seq": 42,                 │
  │    "client_load": 0.45}       │
  │                               │
```

:::tip Heartbeat & Proactive Notifications
The Heartbeat is more than a simple ping/pong. The Gateway piggybacks notifications onto heartbeat messages, such as scheduled reminders, Skill completion notices, and system alerts. This mechanism allows the Agent to "proactively" reach out to the user. See Module 6 for automation details.
:::

### Heartbeat Configuration

```toml
# ~/.openclaw/config.toml

[gateway]
heartbeat_interval = 30          # Ping interval (seconds)
heartbeat_timeout = 90           # Timeout (seconds), = 3 x interval
heartbeat_max_missed = 3         # Max allowed missed heartbeats
proactive_notifications = true   # Enable proactive notifications
```

---

## Hands-On: Inspecting & Debugging WebSocket Traffic

### Step 1: Connect with `websocat`

[websocat](https://github.com/vi/websocat) is a powerful WebSocket command-line tool.

```bash
# Install
brew install websocat  # macOS
# or
cargo install websocat  # via Rust

# Connect to the Gateway
websocat ws://127.0.0.1:18789
```

After connecting, manually send the authentication message:

```json
{"jsonrpc":"2.0","method":"auth.handshake","params":{"client_id":"debug-client","client_version":"0.9.4","token":"oc_local_debug"},"id":"auth-001"}
```

### Step 2: Use OpenClaw's Built-in Debug Mode

```bash
# Start Gateway in debug mode
openclaw gateway --debug

# In another terminal, observe the live message stream
openclaw gateway trace --verbose
```

Debug mode outputs the full routing information for each message:

```
[DEBUG] 2026-03-20T10:15:23Z RECV  msg_id=msg-001 method=chat.send channel=default size=128B
[DEBUG] 2026-03-20T10:15:23Z ROUTE msg_id=msg-001 → ReasoningLayer latency=0.2ms
[DEBUG] 2026-03-20T10:15:24Z SEND  msg_id=msg-001 method=chat.stream chunk=0 size=32B
[DEBUG] 2026-03-20T10:15:24Z SEND  msg_id=msg-001 method=chat.stream chunk=1 size=28B
[DEBUG] 2026-03-20T10:15:25Z SEND  msg_id=msg-001 method=chat.complete tokens=156 duration=1230ms
```

### Step 3: Observe Using Browser DevTools

If you are using the OpenClaw Web UI, you can observe WebSocket traffic in the browser's DevTools:

1. Open Chrome DevTools (F12)
2. Switch to the **Network** tab
3. Filter by **WS** (WebSocket)
4. Click the WebSocket connection and switch to the **Messages** sub-tab
5. Observe real-time sent and received messages

### Step 4: Monitor Gateway Metrics

```bash
# View real-time Gateway status
openclaw status gateway --watch

# Example output:
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

## Advanced Gateway Configuration

### Rate Limiting

```toml
[gateway.rate_limit]
enabled = true
messages_per_second = 10         # Max messages per second
messages_per_minute = 200        # Max messages per minute
burst_size = 20                  # Burst allowance
cooldown_seconds = 60            # Cooldown after triggering
```

### TLS Configuration (Production)

```toml
[gateway.tls]
enabled = true
cert_path = "/etc/openclaw/tls/cert.pem"
key_path = "/etc/openclaw/tls/key.pem"
min_version = "1.2"
```

:::warning Required for Production
In production environments, always enable TLS. Unencrypted WebSocket connections (`ws://`) are insecure on public networks. Use `wss://` for encrypted connections. See Module 10 for production deployment details.
:::

---

## Common Errors & Troubleshooting

### Issue 1: WebSocket Connection Immediately Closed

```
Connection closed: code=4001, reason="Authentication timeout"
```

**Cause**: Authentication message was not sent within 5 seconds of connection establishment.
**Fix**: Ensure your client sends the `auth.handshake` message immediately after connecting.

### Issue 2: Message Routing Failure

```
{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found: chat.sendd"},"id":"msg-001"}
```

**Cause**: Typo in the `method` field (`sendd` has an extra `d`).
**Fix**: Double-check the method name. Use `openclaw gateway methods` to see all supported methods.

### Issue 3: Heartbeat Timeout Disconnect

```
Connection closed: code=4002, reason="Heartbeat timeout"
```

**Cause**: Client did not respond to heartbeat pings within the time limit.
**Fix**:
```bash
# Increase heartbeat timeout tolerance
openclaw config set gateway.heartbeat_timeout 120
openclaw config set gateway.heartbeat_max_missed 5
```

### Issue 4: Rate Limit Triggered

```
{"jsonrpc":"2.0","error":{"code":4003,"message":"Rate limit exceeded"},"id":"msg-042"}
```

**Cause**: Message sending rate exceeded the limit.
**Fix**: Implement exponential backoff on the client side, or adjust the Rate Limit settings.

---

## Exercises

1. **WebSocket Packet Analysis**: Use `websocat` to connect to the Gateway, complete authentication, then send a `chat.send` message. Observe and record the complete response flow (including all `chat.stream` and `chat.complete` messages).

2. **Channel Management**: Create three different Channels named `coding`, `writing`, and `research`. Send messages on different topics in each Channel, then switch between Channels to confirm conversation context isolation.

3. **Heartbeat Observation**: Set `heartbeat_interval` to 5 seconds and observe the Gateway's heartbeat behavior. Deliberately skip responding with pong and note when the connection gets terminated.

4. **Performance Testing**: Using `websocat` or a custom script, rapidly send 50 messages and observe when Rate Limiting triggers and how it behaves.

---

## Quiz

1. **What communication protocol does the OpenClaw Gateway use?**
   - A) HTTP REST API
   - B) gRPC
   - C) WebSocket
   - D) MQTT

2. **How many seconds does the client have to complete authentication after establishing a WebSocket connection?**
   - A) 1 second
   - B) 5 seconds
   - C) 10 seconds
   - D) 30 seconds

3. **Which of the following is NOT a Gateway Close Code?**
   - A) 4001 -- Authentication timeout
   - B) 4002 -- Heartbeat timeout
   - C) 4003 -- Rate Limit
   - D) 4004 -- Skill execution failure

4. **Besides detecting connection status, what other function does the Heartbeat system serve?**
   - A) Message compression
   - B) Proactive Notifications
   - C) Traffic encryption
   - D) Memory synchronization

5. **What is the purpose of the `chat.stream` message?**
   - A) Creating a new Channel
   - B) Streaming LLM responses token by token
   - C) Synchronizing memory data
   - D) Executing a Skill

<details>
<summary>View Answers</summary>

1. **C** -- The Gateway uses the WebSocket protocol on port 18789.
2. **B** -- The client must complete `auth.handshake` within 5 seconds, otherwise the connection is closed (close code 4001).
3. **D** -- 4004 is not a Gateway Close Code. Skill execution failures are reported via regular error responses and do not disconnect the connection.
4. **B** -- Heartbeat messages carry Proactive Notifications, allowing the Agent to proactively notify users about scheduled reminders, task completions, and other events.
5. **B** -- `chat.stream` is used to stream LLM responses, allowing users to see content as it is being generated.

</details>

---

## Next Steps

You now have a thorough understanding of how the Gateway operates. Next, let's explore one of OpenClaw's most powerful features -- the Skills system.

**[Go to Module 3: Skills System & SKILL.md Specification →](./module-03-skills-system)**
