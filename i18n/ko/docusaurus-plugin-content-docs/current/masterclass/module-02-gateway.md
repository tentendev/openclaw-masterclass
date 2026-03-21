---
title: "모듈 2: Gateway 심층 분석"
sidebar_position: 3
description: "OpenClaw Gateway의 WebSocket 조정 메커니즘, 메시지 라우팅, Channel 추상화 및 디버깅 기법에 대한 심층 이해"
---

# 模組 2: Gateway 深入解析

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- 說明 Gateway 的 WebSocket 協調機制與連線生命週期
- 理解메시지路由與 Channel 抽象的運作原理
- 使用工具檢查與디버깅 WebSocket 流量
- 설정 Gateway 的進階參數（Rate Limiting、Heartbeat 等）
- 排除常見的 Gateway 連線問題

:::info 선행 조건
먼저 완료해 주세요: [模組 1: OpenClaw 基礎架構](./module-01-foundations)，確保你理解四層架構的基本概念。
:::

---

## Gateway 架構개요

Gateway 是 OpenClaw 與外部世界的唯一接口。它運行在 **port 18789** 上，負責管理所有 WebSocket 連線，並將메시지路由到正確的內部元件。

```
外部客戶端                         Gateway 內部
┌──────────┐                  ┌──────────────────────────────┐
│ CLI 客戶端│──┐               │                              │
└──────────┘  │               │  ┌────────────────────┐      │
┌──────────┐  │  WebSocket    │  │  Connection Pool   │      │
│ Web UI   │──┼──────────────▶│  │  ┌──────┐┌──────┐ │      │
└──────────┘  │  :18789       │  │  │Conn 1││Conn 2│ │      │
┌──────────┐  │               │  │  └──────┘└──────┘ │      │
│ 第三方   │──┘               │  └────────┬───────────┘      │
│ 整合     │                  │           │                   │
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

## WebSocket 連線生命週期

每個 WebSocket 連線都經歷明確的生命週期階段：

### 1. 握手階段 (Handshake)

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
  │══════ WebSocket 連線생성 ══════│
```

### 2. 인증階段 (Authentication)

連線생성後，客戶端必須在 **5 秒內** 發送인증메시지：

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

Gateway 回應：

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

### 3. 活躍階段 (Active)

인증後進入活躍階段。此階段中，Gateway 維持以下機制：

- **Heartbeat**：每 30 秒（可설정）發送 ping/pong
- **메시지路由**：根據 `method` 欄位將메시지分派到對應的處理器
- **Channel 管理**：支援多個同時對話 Channel

### 4. 終止階段 (Termination)

連線可因以下原因終止：

| 終止原因 | Close Code | 說明 |
|----------|-----------|------|
| 正常關閉 | 1000 | 客戶端主動斷線 |
| 인증逾時 | 4001 | 5 秒內未完成인증 |
| Heartbeat 逾時 | 4002 | 連續 3 次未回應 heartbeat |
| Rate Limit | 4003 | 超過메시지頻率上限 |
| 서버關閉 | 1001 | Gateway 正在關閉 |
| 協定錯誤 | 1002 | 無效的메시지格式 |

---

## 메시지路由

Gateway 的 Message Router 使用 **method-based routing**，根據 JSON-RPC 메시지的 `method` 欄位決定目標：

```
method 前綴          目標處理器
─────────────────────────────────
chat.*           →  Reasoning Layer
memory.*         →  Memory System
skill.*          →  Skills Manager
system.*         →  System Controller
channel.*        →  Channel Manager
heartbeat.*      →  Heartbeat Handler
```

### 常見的 Method 列表

| Method | 方向 | 說明 |
|--------|------|------|
| `chat.send` | Client → Server | 發送對話메시지 |
| `chat.stream` | Server → Client | 串流回應（逐 Token） |
| `chat.complete` | Server → Client | 回應完成通知 |
| `skill.invoke` | Server → Client | 通知客戶端正在실행 Skill |
| `skill.result` | Server → Client | Skill 실행結果 |
| `memory.recall` | Internal | 回憶相關記憶 |
| `channel.create` | Client → Server | 생성新 Channel |
| `channel.switch` | Client → Server | 切換 Channel |
| `channel.list` | Client → Server | 列出所有 Channel |
| `heartbeat.ping` | Server → Client | 心跳檢測 |
| `heartbeat.pong` | Client → Server | 心跳回應 |
| `system.status` | Client → Server | 查詢系統狀態 |

### 串流回應機制

當 Reasoning Layer 透過 LLM 生成回應時，Gateway 以串流方式即時傳送每個 Token：

```json
// 第一個 chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"你好","index":0,"channel":"default"}}

// 第二個 chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"！今天","index":1,"channel":"default"}}

// 第三個 chunk
{"jsonrpc":"2.0","method":"chat.stream","params":{"chunk":"天氣如何？","index":2,"channel":"default"}}

// 完成通知
{"jsonrpc":"2.0","method":"chat.complete","params":{"total_tokens":156,"channel":"default","duration_ms":1230}}
```

---

## Channel 抽象

Channel 是 OpenClaw 對「對話上下文」的抽象。每個 Channel 擁有獨立的對話歷史和記憶空間。

### Channel 的特性

- **隔離性**：不同 Channel 的記憶互不影響
- **持久性**：Channel 記憶會被持久化到 Memory System
- **並行性**：同一連線可同時操作多個 Channel
- **命名空間**：每個 Channel 有唯一的 ID 與可選的名稱

### Channel 操作

```json
// 생성新 Channel
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

// 切換 Channel
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

## Heartbeat 系統

Heartbeat 是 Gateway 用來偵測連線是否仍然活躍的機制。除了連線健康檢查外，OpenClaw 還利用 Heartbeat 實現**主動通知（Proactive Notifications）**功能。

```
Gateway                        Client
  │                               │
  │── heartbeat.ping ───────────▶ │
  │   {"seq": 42,                 │
  │    "notifications": [         │
  │      {"type": "reminder",     │
  │       "msg": "下午 3 點有會議"}│
  │    ]}                         │
  │                               │
  │◀── heartbeat.pong ─────────── │
  │   {"seq": 42,                 │
  │    "client_load": 0.45}       │
  │                               │
```

:::tip Heartbeat 與 Proactive Notifications
Heartbeat 不只是簡單的 ping/pong。Gateway 會在 heartbeat 메시지中夾帶通知，例如스케줄링提醒、Skill 完成通知、系統警告等。這個機制讓 Agent 能夠「主動」聯繫사용자。詳見模組 6 的自動化章節。
:::

### Heartbeat 설정

```toml
# ~/.openclaw/config.toml

[gateway]
heartbeat_interval = 30          # ping 間隔（秒）
heartbeat_timeout = 90           # 逾時時間（秒），= 3 × interval
heartbeat_max_missed = 3         # 最大容許遺漏次數
proactive_notifications = true   # 啟用主動通知
```

---

## 실습: 檢查與디버깅 WebSocket 流量

### 步驟 1：使用 `websocat` 連線

[websocat](https://github.com/vi/websocat) 是一個強大的 WebSocket 命令列工具。

```bash
# 설치
brew install websocat  # macOS
# 或
cargo install websocat  # 透過 Rust

# 連線到 Gateway
websocat ws://127.0.0.1:18789
```

連線後，手動發送인증메시지：

```json
{"jsonrpc":"2.0","method":"auth.handshake","params":{"client_id":"debug-client","client_version":"0.9.4","token":"oc_local_debug"},"id":"auth-001"}
```

### 步驟 2：使用 OpenClaw 內建디버깅模式

```bash
# 啟動 Gateway 디버깅模式
openclaw gateway --debug

# 在另一個終端機觀察即時메시지流
openclaw gateway trace --verbose
```

디버깅模式會輸出每個메시지的完整路由資訊：

```
[DEBUG] 2026-03-20T10:15:23Z RECV  msg_id=msg-001 method=chat.send channel=default size=128B
[DEBUG] 2026-03-20T10:15:23Z ROUTE msg_id=msg-001 → ReasoningLayer latency=0.2ms
[DEBUG] 2026-03-20T10:15:24Z SEND  msg_id=msg-001 method=chat.stream chunk=0 size=32B
[DEBUG] 2026-03-20T10:15:24Z SEND  msg_id=msg-001 method=chat.stream chunk=1 size=28B
[DEBUG] 2026-03-20T10:15:25Z SEND  msg_id=msg-001 method=chat.complete tokens=156 duration=1230ms
```

### 步驟 3：使用브라우저 DevTools 觀察

如果你使用 OpenClaw Web UI，可以在브라우저的 DevTools 中觀察 WebSocket 流量：

1. 開啟 Chrome DevTools（F12）
2. 切換到 **Network** 頁籤
3. 篩選 **WS**（WebSocket）
4. 點擊 WebSocket 連線，切換到 **Messages** 子頁籤
5. 觀察即時的메시지收發

### 步驟 4：모니터링 Gateway 指標

```bash
# 조회 Gateway 即時狀態
openclaw status gateway --watch

# 輸出예시：
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

## Gateway 進階설정

### Rate Limiting

```toml
[gateway.rate_limit]
enabled = true
messages_per_second = 10         # 每秒最大메시지數
messages_per_minute = 200        # 每分鐘最大메시지數
burst_size = 20                  # 突發容許量
cooldown_seconds = 60            # 트리거後冷卻時間
```

### TLS 설정（生產環境）

```toml
[gateway.tls]
enabled = true
cert_path = "/etc/openclaw/tls/cert.pem"
key_path = "/etc/openclaw/tls/key.pem"
min_version = "1.2"
```

:::warning 프로덕션 환경 필수
在生產環境中，務必啟用 TLS。未암호화的 WebSocket 連線（`ws://`）在公開網路上是不安全的。使用 `wss://` 암호화連線。詳見模組 10 的生產배포章節。
:::

---

## 자주 발생하는 오류 및 문제 해결

### 問題 1：WebSocket 連線被立即關閉

```
Connection closed: code=4001, reason="Authentication timeout"
```

**原因**：連線생성後 5 秒內未發送인증메시지。
**解法**：確認客戶端在連線後立即發送 `auth.handshake` 메시지。

### 問題 2：메시지路由失敗

```
{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found: chat.sendd"},"id":"msg-001"}
```

**原因**：`method` 欄位拼寫錯誤（`sendd` 多了一個 `d`）。
**解法**：核對 method 名稱。使用 `openclaw gateway methods` 조회所有支援的 method。

### 問題 3：Heartbeat 逾時斷線

```
Connection closed: code=4002, reason="Heartbeat timeout"
```

**原因**：客戶端未在時限內回應 heartbeat ping。
**解法**：
```bash
# 增加 heartbeat 逾時容忍度
openclaw config set gateway.heartbeat_timeout 120
openclaw config set gateway.heartbeat_max_missed 5
```

### 問題 4：Rate Limit 트리거

```
{"jsonrpc":"2.0","error":{"code":4003,"message":"Rate limit exceeded"},"id":"msg-042"}
```

**原因**：메시지發送頻率超過上限。
**解法**：在客戶端實作 exponential backoff，或調整 Rate Limit 설정。

---

## 연습 문제

1. **WebSocket 抓包分析**：使用 `websocat` 連線到 Gateway，完成인증後發送一則 `chat.send` 메시지，觀察並記錄完整的回應流程（包含所有 `chat.stream` 與 `chat.complete` 메시지）。

2. **Channel 管理**：생성三個不同的 Channel，分別命名為 `coding`、`writing` 和 `research`。在每個 Channel 中發送不同主題的메시지，然後切換 Channel 確認對話上下文的隔離性。

3. **Heartbeat 觀察**：將 `heartbeat_interval` 설정為 5 秒，觀察 Gateway 的 heartbeat 行為。故意不回應 pong，看連線何時被斷開。

4. **성능테스트**：使用 `websocat` 或自行撰寫的腳本，快速發送 50 則메시지，觀察 Rate Limiting 的트리거時機與行為。

---

## 퀴즈

1. **OpenClaw Gateway 使用的커뮤니케이션協定是？**
   - A) HTTP REST API
   - B) gRPC
   - C) WebSocket
   - D) MQTT

2. **客戶端생성 WebSocket 連線後，必須在幾秒內完成인증？**
   - A) 1 秒
   - B) 5 秒
   - C) 10 秒
   - D) 30 秒

3. **以下哪個不是 Gateway Close Code？**
   - A) 4001 — 인증逾時
   - B) 4002 — Heartbeat 逾時
   - C) 4003 — Rate Limit
   - D) 4004 — Skill 실행失敗

4. **Heartbeat 系統除了偵測連線狀態外，還有什麼功能？**
   - A) 壓縮메시지
   - B) 主動通知（Proactive Notifications）
   - C) 암호화流量
   - D) 記憶同步

5. **`chat.stream` 메시지的用途是？**
   - A) 생성新的 Channel
   - B) 以串流方式逐 Token 傳送 LLM 回應
   - C) 同步記憶데이터
   - D) 실행 Skill

<details>
<summary>정답 확인</summary>

1. **C** — Gateway 使用 WebSocket 協定在 port 18789 上運行。
2. **B** — 客戶端必須在 5 秒內完成 `auth.handshake`，否則連線會被關閉（close code 4001）。
3. **D** — 4004 不是 Gateway 的 Close Code。Skill 실행失敗會透過一般的 error response 回報，不會斷開連線。
4. **B** — Heartbeat 메시지中會夾帶 Proactive Notifications，讓 Agent 能主動通知사용자스케줄링提醒、任務完成等事件。
5. **B** — `chat.stream` 用於串流傳送 LLM 的回應，讓사용자能即時看到生成中的內容。

</details>

---

## 다음 단계

你已經深入了解了 Gateway 的運作機制。接下來，讓我們進入 OpenClaw 最強大的功能之一 — Skills 系統。

**[前往模組 3: Skills 系統與 SKILL.md 規格 →](./module-03-skills-system)**
