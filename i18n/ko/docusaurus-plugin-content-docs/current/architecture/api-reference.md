---
title: "API 레퍼런스"
sidebar_position: 2
description: "OpenClaw Gateway REST API 완전 레퍼런스 — 엔드포인트, 인증, 요청 형식, 응답 형식 및 오류 처리"
---

# API 參考

OpenClaw Gateway 提供 REST API，允許外部程式與 Agent 互動。API 預設監聽在 `http://127.0.0.1:18789`。

:::danger 보안 경고
Gateway API 只應在本機使用。**絕對不要**將 18789 埠暴露到公開網路。如需遠端存取，請使用 SSH tunnel 或 VPN。詳見 [安全性最佳實踐](/docs/security/best-practices)。
:::

---

## 인증

所有 API 請求都需要在 Header 中附帶인증 token：

```bash
curl -H "Authorization: Bearer YOUR_GATEWAY_TOKEN" \
  http://127.0.0.1:18789/api/v1/health
```

Token 在 `~/.openclaw/gateway.yaml` 中설정：

```yaml
gateway:
  auth:
    enabled: true
    token: "${GATEWAY_AUTH_TOKEN}"
```

**錯誤回應（未인증）：**

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

所有端點都以 `/api/v1` 為前綴。

---

## 端點總覽

| 方法 | 端點 | 說明 |
|------|------|------|
| `GET` | `/health` | 健康檢查 |
| `GET` | `/status` | 系統狀態 |
| `POST` | `/message` | 發送메시지給 Agent |
| `GET` | `/conversations` | 列出對話 |
| `GET` | `/conversations/:id` | 取得特定對話 |
| `DELETE` | `/conversations/:id` | 삭제對話 |
| `GET` | `/memory/stats` | 記憶系統統計 |
| `POST` | `/memory/search` | 검색記憶 |
| `DELETE` | `/memory/prune` | 清理記憶 |
| `GET` | `/skills` | 列出已설치스킬 |
| `POST` | `/skills/install` | 설치스킬 |
| `DELETE` | `/skills/:name` | 移除스킬 |
| `GET` | `/channels` | 列出連線中的커뮤니케이션平台 |
| `GET` | `/channels/:type/status` | 特定平台狀態 |
| `GET` | `/config` | 取得설정（已脫敏） |
| `PUT` | `/config` | 업데이트설정 |
| `GET` | `/logs` | 取得로그 |

---

## 健康與狀態

### GET /health

簡單的健康檢查端點，用於모니터링和 load balancer。

**請求：**

```bash
curl http://127.0.0.1:18789/api/v1/health
```

**回應：**

```json
{
  "status": "ok",
  "version": "3.2.1",
  "uptime_seconds": 86400
}
```

### GET /status

詳細的系統狀態資訊。

**請求：**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/status
```

**回應：**

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

## 메시지

### POST /message

發送메시지給 Agent 並取得回應。這是最常用的端點。

**請求：**

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "api",
    "message": "明天서울的天氣如何？",
    "conversation_id": "conv_abc123",
    "metadata": {
      "user_id": "user_001",
      "user_name": "사용자"
    }
  }' \
  http://127.0.0.1:18789/api/v1/message
```

**參數：**

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `channel` | string | 是 | 來源채널（`api`、`telegram`、`internal` 等） |
| `message` | string | 是 | 메시지內容 |
| `conversation_id` | string | 否 | 對話 ID（省略則생성新對話） |
| `metadata` | object | 否 | 附加資訊 |
| `metadata.user_id` | string | 否 | 사용자 ID |
| `metadata.user_name` | string | 否 | 사용자名稱 |
| `metadata.attachments` | array | 否 | 附件列表 |
| `wait_for_response` | boolean | 否 | 是否等待回應（預設 `true`） |
| `timeout_ms` | integer | 否 | 逾時時間（預設 30000） |

**回應（同步）：**

```json
{
  "id": "msg_resp_xyz789",
  "conversation_id": "conv_abc123",
  "role": "assistant",
  "content": "明天서울的天氣預報...",
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

**回應（非同步，`wait_for_response: false`）：**

```json
{
  "id": "msg_pending_xyz789",
  "status": "processing",
  "conversation_id": "conv_abc123",
  "poll_url": "/api/v1/message/msg_pending_xyz789/status"
}
```

### Streaming 回應

支援 Server-Sent Events (SSE) 的串流回應：

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"channel": "api", "message": "寫一首詩"}' \
  http://127.0.0.1:18789/api/v1/message
```

**SSE 回應格式：**

```
data: {"type": "start", "conversation_id": "conv_abc123"}

data: {"type": "token", "content": "春"}
data: {"type": "token", "content": "風"}
data: {"type": "token", "content": "拂"}
data: {"type": "token", "content": "面"}

data: {"type": "skill_call", "skill": "weather", "status": "invoking"}
data: {"type": "skill_result", "skill": "weather", "status": "completed"}

data: {"type": "end", "tokens": {"input": 50, "output": 100}}
```

---

## 對話管理

### GET /conversations

列出所有對話。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:18789/api/v1/conversations?limit=20&offset=0"
```

**查詢參數：**

| 參數 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `limit` | integer | 20 | 回傳數量 |
| `offset` | integer | 0 | 偏移量 |
| `channel` | string | - | 篩選特定채널 |
| `since` | string | - | 起始時間（ISO 8601） |
| `until` | string | - | 結束時間（ISO 8601） |

**回應：**

```json
{
  "conversations": [
    {
      "id": "conv_abc123",
      "channel": "telegram",
      "created_at": "2026-03-20T10:00:00Z",
      "last_message_at": "2026-03-20T15:30:00Z",
      "message_count": 24,
      "summary": "天氣查詢與旅行規劃"
    }
  ],
  "total": 156,
  "limit": 20,
  "offset": 0
}
```

### GET /conversations/:id

取得特定對話的完整메시지。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/conversations/conv_abc123
```

### DELETE /conversations/:id

삭제特定對話及其記憶。

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/conversations/conv_abc123
```

---

## 記憶系統

### GET /memory/stats

取得記憶系統的統計資訊。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/memory/stats
```

**回應：**

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

검색記憶內容。

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "사용자的飲食偏好",
    "limit": 10,
    "type": "all"
  }' \
  http://127.0.0.1:18789/api/v1/memory/search
```

**參數：**

| 參數 | 類型 | 說明 |
|------|------|------|
| `query` | string | 검색關鍵字 |
| `limit` | integer | 回傳數量（預設 10） |
| `type` | string | `all`、`wal`、`compacted` |
| `since` | string | 起始時間 |
| `until` | string | 結束時間 |

### DELETE /memory/prune

清理指定條件的記憶。

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

## 스킬管理

### GET /skills

列出所有已설치的스킬。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/skills
```

**回應：**

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

설치新스킬。

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

移除已설치的스킬。

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/skills/weather
```

---

## 커뮤니케이션平台

### GET /channels

列出所有已설정的커뮤니케이션平台連線。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/channels
```

**回應：**

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

## 설정管理

### GET /config

取得目前的설정（敏感資訊已脫敏）。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/config
```

**回應中的敏感欄位會被替換：**

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

업데이트설정（部分업데이트）。

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

:::warning 설정업데이트限制
部分설정變更需要重啟 OpenClaw 才能生效（如 port、bind）。API 會在回應中說明是否需要重啟。
:::

---

## 로그

### GET /logs

取得系統로그。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:18789/api/v1/logs?lines=100&level=warn"
```

**查詢參數：**

| 參數 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `lines` | integer | 50 | 回傳行數 |
| `level` | string | `info` | 最低로그等級（debug/info/warn/error） |
| `since` | string | - | 起始時間 |
| `component` | string | - | 篩選元件（gateway/reasoning/memory/skills） |

---

## 錯誤處理

所有錯誤回應遵循統一格式：

```json
{
  "error": "error_code",
  "message": "人類可讀的錯誤說明",
  "status": 400,
  "details": {}
}
```

### 자주 발생하는 오류碼

| HTTP 狀態碼 | 錯誤碼 | 說明 |
|------------|--------|------|
| 400 | `bad_request` | 請求格式錯誤 |
| 401 | `unauthorized` | 인증失敗 |
| 403 | `forbidden` | 권한不足 |
| 404 | `not_found` | 資源不存在 |
| 408 | `timeout` | 請求逾時 |
| 429 | `rate_limited` | 超過速率限制 |
| 500 | `internal_error` | 內部錯誤 |
| 503 | `service_unavailable` | 服務不可用 |

### 速率限制回應

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

回應 Header 中也包含速率限制資訊：

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1710945060
```

---

## SDK 與客戶端程式庫

### Node.js

```javascript
import { OpenClawClient } from '@openclaw/sdk';

const client = new OpenClawClient({
  baseUrl: 'http://127.0.0.1:18789',
  token: process.env.GATEWAY_AUTH_TOKEN,
});

// 發送메시지
const response = await client.message('明天的天氣如何？');
console.log(response.content);

// 串流回應
for await (const chunk of client.messageStream('寫一首詩')) {
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

# 發送메시지
response = client.message("明天的天氣如何？")
print(response.content)

# 串流回應
for chunk in client.message_stream("寫一首詩"):
    print(chunk.content, end="", flush=True)
```

### cURL

```bash
# 설정別名簡化操作
alias oclaw='curl -s -H "Authorization: Bearer $GATEWAY_AUTH_TOKEN" -H "Content-Type: application/json"'

# 使用
oclaw http://127.0.0.1:18789/api/v1/health
oclaw -X POST -d '{"channel":"api","message":"你好"}' http://127.0.0.1:18789/api/v1/message
```

---

## WebSocket API

除了 REST API，Gateway 也提供 WebSocket 連線用於即時커뮤니케이션：

```javascript
const ws = new WebSocket('ws://127.0.0.1:18789/ws');

ws.onopen = () => {
  // 인증
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'YOUR_TOKEN'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'auth_success':
      // 인증成功，可以開始互動
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

## 추가 참고자료

- [架構개요](/docs/architecture/overview) — 了解 API 背後的系統架構
- [安全性最佳實踐](/docs/security/best-practices) — API 使用的安全注意事項
- [문제 해결](/docs/troubleshooting/common-issues) — API 相關問題的解決方案
