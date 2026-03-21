---
title: API Reference
description: OpenClaw Gateway REST API complete reference — endpoints, authentication, request formats, response formats, and error handling.
sidebar_position: 2
---

# API Reference

The OpenClaw Gateway provides a REST API that allows external programs to interact with the Agent. The API listens on `http://127.0.0.1:18789` by default.

:::danger Security Warning
The Gateway API should only be used locally. **Never** expose port 18789 to the public internet. For remote access, use an SSH tunnel or VPN. See [Security Best Practices](/docs/security/best-practices).
:::

---

## Authentication

All API requests require an authentication token in the Header:

```bash
curl -H "Authorization: Bearer YOUR_GATEWAY_TOKEN" \
  http://127.0.0.1:18789/api/v1/health
```

Token is configured in `~/.openclaw/gateway.yaml`:

```yaml
gateway:
  auth:
    enabled: true
    token: "${GATEWAY_AUTH_TOKEN}"
```

---

## Base URL

```
http://127.0.0.1:18789/api/v1
```

All endpoints are prefixed with `/api/v1`.

---

## Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/status` | System status |
| `POST` | `/message` | Send a message to the Agent |
| `GET` | `/conversations` | List conversations |
| `GET` | `/conversations/:id` | Get a specific conversation |
| `DELETE` | `/conversations/:id` | Delete a conversation |
| `GET` | `/memory/stats` | Memory system statistics |
| `POST` | `/memory/search` | Search memory |
| `DELETE` | `/memory/prune` | Prune memory |
| `GET` | `/skills` | List installed skills |
| `POST` | `/skills/install` | Install a skill |
| `DELETE` | `/skills/:name` | Remove a skill |
| `GET` | `/channels` | List connected messaging platforms |
| `GET` | `/config` | Get configuration (redacted) |
| `PUT` | `/config` | Update configuration |
| `GET` | `/logs` | Get logs |

---

## Messages

### POST /message

Send a message to the Agent and get a response. This is the most commonly used endpoint.

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel": "api", "message": "What is the weather like tomorrow?"}' \
  http://127.0.0.1:18789/api/v1/message
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channel` | string | Yes | Source channel (`api`, `telegram`, `internal`, etc.) |
| `message` | string | Yes | Message content |
| `conversation_id` | string | No | Conversation ID (omit to create new) |
| `wait_for_response` | boolean | No | Wait for response (default `true`) |
| `timeout_ms` | integer | No | Timeout in ms (default 30000) |

### Streaming Response

Supports Server-Sent Events (SSE) for streaming responses:

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"channel": "api", "message": "Write a poem"}' \
  http://127.0.0.1:18789/api/v1/message
```

---

## Error Handling

All error responses follow a unified format:

```json
{
  "error": "error_code",
  "message": "Human-readable error description",
  "status": 400,
  "details": {}
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|-----------|-------------|
| 400 | `bad_request` | Malformed request |
| 401 | `unauthorized` | Authentication failed |
| 403 | `forbidden` | Insufficient permissions |
| 404 | `not_found` | Resource not found |
| 408 | `timeout` | Request timed out |
| 429 | `rate_limited` | Rate limit exceeded |
| 500 | `internal_error` | Internal error |
| 503 | `service_unavailable` | Service unavailable |

---

## SDKs & Client Libraries

### Node.js

```javascript
import { OpenClawClient } from '@openclaw/sdk';

const client = new OpenClawClient({
  baseUrl: 'http://127.0.0.1:18789',
  token: process.env.GATEWAY_AUTH_TOKEN,
});

const response = await client.message('What is the weather tomorrow?');
console.log(response.content);
```

### Python

```python
from openclaw import OpenClawClient

client = OpenClawClient(
    base_url="http://127.0.0.1:18789",
    token=os.environ["GATEWAY_AUTH_TOKEN"],
)

response = client.message("What is the weather tomorrow?")
print(response.content)
```

---

## WebSocket API

The Gateway also provides WebSocket connections for real-time communication:

```javascript
const ws = new WebSocket('ws://127.0.0.1:18789/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'auth', token: 'YOUR_TOKEN' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'response') console.log(data.content);
};
```

---

## Further Reading

- [Architecture Overview](/docs/architecture/overview) — Understand the system architecture behind the API
- [Security Best Practices](/docs/security/best-practices) — Security considerations for API usage
- [Troubleshooting](/docs/troubleshooting/common-issues) — Solutions for API-related issues
