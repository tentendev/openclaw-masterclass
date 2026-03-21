---
title: API 参考
description: OpenClaw Gateway REST API 完整参考文件——端点、认证、请求格式、响应格式与错误处理。
sidebar_position: 2
---

# API 参考

OpenClaw Gateway 提供 REST API，允许外部进程与 Agent 交互。API 默认监听在 `http://127.0.0.1:18789`。

:::danger 安全警告
Gateway API 只应在本机使用。**绝对不要**将 18789 埠暴露到公开网络。如需远端存取，请使用 SSH tunnel 或 VPN。详见 [安全性最佳实践](/docs/security/best-practices)。
:::

---

## 认证

所有 API 请求都需要在 Header 中附带认证 token：

```bash
curl -H "Authorization: Bearer YOUR_GATEWAY_TOKEN" \
  http://127.0.0.1:18789/api/v1/health
```

Token 在 `~/.openclaw/gateway.yaml` 中配置：

```yaml
gateway:
  auth:
    enabled: true
    token: "${GATEWAY_AUTH_TOKEN}"
```

**错误响应（未认证）：**

```json
{
  "error": "unauthorized",
  "message": "Missing or invalid authentication token",
  "status": 401
}
```

---

## 基本 URL

```
http://127.0.0.1:18789/api/v1
```

所有端点都以 `/api/v1` 为前缀。

---

## 端点总览

| 方法 | 端点 | 说明 |
|------|------|------|
| `GET` | `/health` | 健康检查 |
| `GET` | `/status` | 系统状态 |
| `POST` | `/message` | 发送消息给 Agent |
| `GET` | `/conversations` | 列出对话 |
| `GET` | `/conversations/:id` | 获取特定对话 |
| `DELETE` | `/conversations/:id` | 删除对话 |
| `GET` | `/memory/stats` | 记忆系统计 |
| `POST` | `/memory/search` | 搜索记忆 |
| `DELETE` | `/memory/prune` | 清理记忆 |
| `GET` | `/skills` | 列出已安装技能 |
| `POST` | `/skills/install` | 安装技能 |
| `DELETE` | `/skills/:name` | 移除技能 |
| `GET` | `/channels` | 列出连接中的通信平台 |
| `GET` | `/channels/:type/status` | 特定平台状态 |
| `GET` | `/config` | 获取配置（已脱敏） |
| `PUT` | `/config` | 更新配置 |
| `GET` | `/logs` | 获取日志 |

---

## 健康与状态

### GET /health

简单的健康检查端点，用于监控和 load balancer。

**请求：**

```bash
curl http://127.0.0.1:18789/api/v1/health
```

**响应：**

```json
{
  "status": "ok",
  "version": "3.2.1",
  "uptime_seconds": 86400
}
```

### GET /status

详细的系统状态信息。

**请求：**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/status
```

**响应：**

```json
{
  "status": "running",
  "version": "3.2.1",
  "uptime_seconds": 86400,
  "gateway": {
    "port": 18789,
    "bind": "127.0.0.1",
    "auth_enabled": true
  },
  "reasoning": {
    "primary_provider": "anthropic",
    "primary_model": "claude-opus-4-6",
    "total_requests": 1234,
    "avg_latency_ms": 2500
  },
  "memory": {
    "wal_entries": 5678,
    "compacted_files": 42,
    "total_size_mb": 128
  },
  "skills": {
    "installed": 15,
    "active": 12,
    "container_engine": "podman",
    "rootless": true
  },
  "channels": {
    "connected": ["telegram", "discord"],
    "disconnected": ["slack"]
  }
}
```

---

## 消息

### POST /message

发送消息给 Agent 并获取响应。这是最常用的端点。

**请求：**

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "api",
    "message": "明天台北的天气如何？",
    "conversation_id": "conv_abc123",
    "metadata": {
      "user_id": "user_001",
      "user_name": "用户"
    }
  }' \
  http://127.0.0.1:18789/api/v1/message
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `channel` | string | 是 | 来源频道（`api`、`telegram`、`internal` 等） |
| `message` | string | 是 | 消息内容 |
| `conversation_id` | string | 否 | 对话 ID（省略则创建新对话） |
| `metadata` | object | 否 | 附加信息 |
| `metadata.user_id` | string | 否 | 用户 ID |
| `metadata.user_name` | string | 否 | 用户名称 |
| `metadata.attachments` | array | 否 | 附件列表 |
| `wait_for_response` | boolean | 否 | 是否等待响应（默认 `true`） |
| `timeout_ms` | integer | 否 | 超时时间（默认 30000） |

**响应（同步）：**

```json
{
  "id": "msg_resp_xyz789",
  "conversation_id": "conv_abc123",
  "role": "assistant",
  "content": "明天台北的天气预报...",
  "skills_used": ["weather"],
  "tokens": {
    "input": 150,
    "output": 200,
    "total": 350
  },
  "latency_ms": 2300,
  "model": "claude-opus-4-6"
}
```

**响应（非同步，`wait_for_response: false`）：**

```json
{
  "id": "msg_pending_xyz789",
  "status": "processing",
  "conversation_id": "conv_abc123",
  "poll_url": "/api/v1/message/msg_pending_xyz789/status"
}
```

### Streaming 响应

支援 Server-Sent Events (SSE) 的流式响应：

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"channel": "api", "message": "写一首诗"}' \
  http://127.0.0.1:18789/api/v1/message
```

**SSE 响应格式：**

```
data: {"type": "start", "conversation_id": "conv_abc123"}

data: {"type": "token", "content": "春"}
data: {"type": "token", "content": "风"}
data: {"type": "token", "content": "拂"}
data: {"type": "token", "content": "面"}

data: {"type": "skill_call", "skill": "weather", "status": "invoking"}
data: {"type": "skill_result", "skill": "weather", "status": "completed"}

data: {"type": "end", "tokens": {"input": 50, "output": 100}}
```

---

## 对话管理

### GET /conversations

列出所有对话。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:18789/api/v1/conversations?limit=20&offset=0"
```

**查询参数：**

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `limit` | integer | 20 | 返回数量 |
| `offset` | integer | 0 | 偏移量 |
| `channel` | string | - | 筛选特定频道 |
| `since` | string | - | 起始时间（ISO 8601） |
| `until` | string | - | 结束时间（ISO 8601） |

**响应：**

```json
{
  "conversations": [
    {
      "id": "conv_abc123",
      "channel": "telegram",
      "created_at": "2026-03-20T10:00:00Z",
      "last_message_at": "2026-03-20T15:30:00Z",
      "message_count": 24,
      "summary": "天气查询与旅行规划"
    }
  ],
  "total": 156,
  "limit": 20,
  "offset": 0
}
```

### GET /conversations/:id

获取特定对话的完整消息。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/conversations/conv_abc123
```

### DELETE /conversations/:id

删除特定对话及其记忆。

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/conversations/conv_abc123
```

---

## 记忆系统

### GET /memory/stats

获取记忆系统的统计信息。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/memory/stats
```

**响应：**

```json
{
  "wal": {
    "entries": 5678,
    "size_mb": 45.2,
    "oldest_entry": "2026-01-15T00:00:00Z"
  },
  "compacted": {
    "files": 42,
    "size_mb": 82.8,
    "last_compaction": "2026-03-20T03:00:00Z"
  },
  "total_size_mb": 128.0
}
```

### POST /memory/search

搜索记忆内容。

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "用户的饮食偏好",
    "limit": 10,
    "type": "all"
  }' \
  http://127.0.0.1:18789/api/v1/memory/search
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `query` | string | 搜索关键字 |
| `limit` | integer | 返回数量（默认 10） |
| `type` | string | `all`、`wal`、`compacted` |
| `since` | string | 起始时间 |
| `until` | string | 结束时间 |

### DELETE /memory/prune

清理指定条件的记忆。

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "before": "2025-01-01T00:00:00Z",
    "type": "wal",
    "confirm": true
  }' \
  http://127.0.0.1:18789/api/v1/memory/prune
```

---

## 技能管理

### GET /skills

列出所有已安装的技能。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/skills
```

**响应：**

```json
{
  "skills": [
    {
      "name": "web-search",
      "version": "2.1.3",
      "status": "active",
      "permissions": {
        "network": true,
        "filesystem": false,
        "shell": false
      },
      "installed_at": "2026-03-01T00:00:00Z",
      "last_used": "2026-03-20T15:00:00Z",
      "invocations": 456
    }
  ],
  "total": 15
}
```

### POST /skills/install

安装新技能。

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "weather",
    "version": "1.2.0"
  }' \
  http://127.0.0.1:18789/api/v1/skills/install
```

### DELETE /skills/:name

移除已安装的技能。

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/skills/weather
```

---

## 通信平台

### GET /channels

列出所有已配置的通信平台连接。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/channels
```

**响应：**

```json
{
  "channels": [
    {
      "type": "telegram",
      "status": "connected",
      "connected_since": "2026-03-20T08:00:00Z",
      "messages_today": 42
    },
    {
      "type": "discord",
      "status": "connected",
      "connected_since": "2026-03-20T08:00:00Z",
      "messages_today": 18
    },
    {
      "type": "slack",
      "status": "disconnected",
      "last_error": "Token expired"
    }
  ]
}
```

---

## 配置管理

### GET /config

获取目前的配置（敏感信息已脱敏）。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/config
```

**响应中的敏感字段会被替换：**

```json
{
  "gateway": {
    "port": 18789,
    "bind": "127.0.0.1",
    "auth": {
      "enabled": true,
      "token": "***REDACTED***"
    }
  },
  "providers": {
    "primary": {
      "type": "anthropic",
      "model": "claude-opus-4-6",
      "api_key": "***REDACTED***"
    }
  }
}
```

### PUT /config

更新配置（部分更新）。

```bash
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gateway": {
      "rate_limit": {
        "requests_per_minute": 120
      }
    }
  }' \
  http://127.0.0.1:18789/api/v1/config
```

:::warning 配置更新限制
部分配置变更需要重启 OpenClaw 才能生效（如 port、bind）。API 会在响应中说明是否需要重启。
:::

---

## 日志

### GET /logs

获取系统日志。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:18789/api/v1/logs?lines=100&level=warn"
```

**查询参数：**

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `lines` | integer | 50 | 返回行数 |
| `level` | string | `info` | 最低日志等级（debug/info/warn/error） |
| `since` | string | - | 起始时间 |
| `component` | string | - | 筛选组件（gateway/reasoning/memory/skills） |

---

## 错误处理

所有错误响应遵循统一格式：

```json
{
  "error": "error_code",
  "message": "人类可读的错误说明",
  "status": 400,
  "details": {}
}
```

### 常见错误码

| HTTP 状态码 | 错误码 | 说明 |
|------------|--------|------|
| 400 | `bad_request` | 请求格式错误 |
| 401 | `unauthorized` | 认证失败 |
| 403 | `forbidden` | 权限不足 |
| 404 | `not_found` | 资源不存在 |
| 408 | `timeout` | 请求超时 |
| 429 | `rate_limited` | 超过速率限制 |
| 500 | `internal_error` | 内部错误 |
| 503 | `service_unavailable` | 服务不可用 |

### 速率限制响应

```json
{
  "error": "rate_limited",
  "message": "Rate limit exceeded. Try again in 30 seconds.",
  "status": 429,
  "details": {
    "limit": 60,
    "remaining": 0,
    "reset_at": "2026-03-20T15:31:00Z"
  }
}
```

响应 Header 中也包含速率限制信息：

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1710945060
```

---

## SDK 与客户端进程库

### Node.js

```javascript
import { OpenClawClient } from '@openclaw/sdk';

const client = new OpenClawClient({
  baseUrl: 'http://127.0.0.1:18789',
  token: process.env.GATEWAY_AUTH_TOKEN,
});

// 发送消息
const response = await client.message('明天的天气如何？');
console.log(response.content);

// 流式响应
for await (const chunk of client.messageStream('写一首诗')) {
  process.stdout.write(chunk.content || '');
}
```

### Python

```python
from openclaw import OpenClawClient

client = OpenClawClient(
    base_url="http://127.0.0.1:18789",
    token=os.environ["GATEWAY_AUTH_TOKEN"],
)

# 发送消息
response = client.message("明天的天气如何？")
print(response.content)

# 流式响应
for chunk in client.message_stream("写一首诗"):
    print(chunk.content, end="", flush=True)
```

### cURL

```bash
# 配置别名简化操作
alias oclaw='curl -s -H "Authorization: Bearer $GATEWAY_AUTH_TOKEN" -H "Content-Type: application/json"'

# 使用
oclaw http://127.0.0.1:18789/api/v1/health
oclaw -X POST -d '{"channel":"api","message":"你好"}' http://127.0.0.1:18789/api/v1/message
```

---

## WebSocket API

除了 REST API，Gateway 也提供 WebSocket 连接用于实时通信：

```javascript
const ws = new WebSocket('ws://127.0.0.1:18789/ws');

ws.onopen = () => {
  // 认证
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'YOUR_TOKEN'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'auth_success':
      // 认证成功，可以开始交互
      ws.send(JSON.stringify({
        type: 'message',
        channel: 'api',
        content: '你好'
      }));
      break;
    case 'response':
      console.log(data.content);
      break;
    case 'error':
      console.error(data.message);
      break;
  }
};
```

---

## 延伸阅读

- [架构概览](/docs/architecture/overview) — 了解 API 背后的系统架构
- [安全性最佳实践](/docs/security/best-practices) — API 使用的安全注意事项
- [故障排除](/docs/troubleshooting/common-issues) — API 相关问题的解决方案
