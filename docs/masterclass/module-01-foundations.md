---
title: "模組 1: OpenClaw 基礎架構"
sidebar_position: 2
description: "深入理解 OpenClaw 的四層架構、元件通訊方式、目錄結構與系統健康檢查"
keywords: [OpenClaw, 架構, Gateway, Reasoning, Memory, Skills, 基礎]
---

# 模組 1: OpenClaw 基礎架構

## 學習目標

完成本模組後，你將能夠：

- 描述 OpenClaw 的四層架構及各層職責
- 說明各層之間的通訊方式與資料流向
- 識別 OpenClaw 的關鍵目錄結構與設定檔
- 使用 `openclaw doctor` 執行系統健康檢查並解讀結果
- 設定 SOUL.md 來定義 Agent 的基本人格

:::info 前置條件
請確認你已完成 [課程總覽](./overview) 中的先備知識檢查，並已成功安裝 OpenClaw。
:::

---

## 四層架構全覽

OpenClaw 採用精心設計的四層架構，每一層各司其職，透過明確的介面彼此溝通。這個設計讓系統具備高度的模組化與可擴展性。

```
┌─────────────────────────────────────────────┐
│             使用者 / 外部系統                  │
└──────────────────────┬──────────────────────┘
                       │ WebSocket (port 18789)
                       ▼
┌─────────────────────────────────────────────┐
│          第一層：Gateway Layer               │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │WebSocket│  │ Message  │  │ Channel   │  │
│  │ Server  │  │ Router   │  │ Manager   │  │
│  └─────────┘  └──────────┘  └───────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Internal RPC
                       ▼
┌─────────────────────────────────────────────┐
│        第二層：Reasoning Layer               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   LLM    │  │  Mega-   │  │  SOUL.md │  │
│  │ Provider │  │ Prompting│  │  Parser  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Read/Write
                       ▼
┌─────────────────────────────────────────────┐
│         第三層：Memory System                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   WAL    │  │ Markdown │  │ Context  │  │
│  │  Engine  │  │Compaction│  │ Window   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Execute
                       ▼
┌─────────────────────────────────────────────┐
│     第四層：Skills / Execution Layer         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Sandboxed│  │ SKILL.md │  │ ClawHub  │  │
│  │Container │  │  Runner  │  │ Registry │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

### 第一層：Gateway Layer

Gateway 是 OpenClaw 的入口，負責管理所有外部連線。它在 **port 18789** 上運行 WebSocket 伺服器，處理訊息的接收與路由。

**核心職責：**
- 建立與管理 WebSocket 連線
- 訊息格式驗證與路由
- Channel 抽象（支援多個同時對話）
- Rate limiting 與基本安全過濾

:::warning 安全關鍵
Gateway 預設綁定 `127.0.0.1:18789`。**絕對不要**將其改為 `0.0.0.0`，否則將暴露在網路上。這是 CVE-2026-25253 的根本原因。詳見模組 9 的安全章節。
:::

> 深入了解：[模組 2: Gateway 深入解析](./module-02-gateway)

### 第二層：Reasoning Layer

Reasoning Layer 是 OpenClaw 的「大腦」。它使用 **Mega-prompting** 策略與 LLM 互動，將使用者的意圖轉化為可執行的行動計畫。

**核心職責：**
- 解析 SOUL.md 定義 Agent 人格
- 建構 Mega-prompt（結合上下文、記憶、技能列表）
- 管理 LLM Provider 連線（支援 OpenAI、Anthropic、本地模型等）
- 決策：判斷該呼叫哪個 Skill 來回應使用者

**Mega-prompting 流程：**

```
使用者輸入 → 載入 SOUL.md 人格 → 注入相關記憶 →
列出可用 Skills → 組合 Mega-prompt → 呼叫 LLM →
解析回應 → 決定執行動作
```

### 第三層：Memory System

Memory System 提供持久化的記憶能力，讓 Agent 能夠跨對話維持上下文。

**核心元件：**
- **Write-Ahead Logging (WAL)**：所有記憶變更先寫入 WAL，確保資料不會遺失
- **Markdown Compaction**：定期將散亂的記憶片段壓縮為結構化的 Markdown 摘要
- **Context Window Manager**：動態管理注入 LLM 的上下文大小

> 深入了解：[模組 5: 持久記憶與個人化](./module-05-memory)

### 第四層：Skills / Execution Layer

Skills Layer 是 OpenClaw 的「手」。每個 Skill 在**沙盒化容器**中執行，確保系統安全。

**核心職責：**
- 解析 SKILL.md 定義檔，載入 Skill 能力
- 在沙盒容器中執行 Skill（Podman / Docker）
- 管理 Skill 的安裝、更新、移除
- 與 ClawHub Registry 同步

> 深入了解：[模組 3: Skills 系統與 SKILL.md 規格](./module-03-skills-system)

---

## 各層通訊方式

各層之間透過明確定義的介面通訊：

| 來源層 | 目標層 | 通訊方式 | 資料格式 |
|--------|--------|----------|----------|
| 外部 → Gateway | Gateway | WebSocket | JSON-RPC 2.0 |
| Gateway → Reasoning | Reasoning | Internal RPC | Protocol Buffers |
| Reasoning → Memory | Memory | Direct Call | Structured Objects |
| Reasoning → Skills | Skills | Container API | JSON + Streams |
| Memory → 磁碟 | 持久化儲存 | File I/O | WAL + Markdown |

```json
// 典型的 WebSocket 訊息格式
{
  "jsonrpc": "2.0",
  "method": "chat.send",
  "params": {
    "channel": "default",
    "message": "請幫我搜尋今天的天氣",
    "context": {
      "location": "台北"
    }
  },
  "id": "msg-001"
}
```

---

## 目錄結構

安裝 OpenClaw 後，關鍵檔案與目錄的佈局如下：

```
~/.openclaw/
├── config.toml              # 主要設定檔
├── SOUL.md                  # Agent 人格定義
├── skills/                  # 已安裝的 Skills
│   ├── official/            # 官方 Skills
│   └── community/           # 社群 Skills
├── memory/                  # 記憶系統資料
│   ├── wal/                 # Write-Ahead Log 檔案
│   ├── compacted/           # 壓縮後的記憶摘要
│   └── index.json           # 記憶索引
├── logs/                    # 系統日誌
│   ├── gateway.log
│   ├── reasoning.log
│   └── execution.log
├── containers/              # 沙盒容器設定
│   └── podman-compose.yml
└── cache/                   # 快取檔案
    ├── models/              # LLM 模型快取
    └── hub/                 # ClawHub 快取
```

### 主要設定檔：config.toml

```toml
# ~/.openclaw/config.toml

[gateway]
host = "127.0.0.1"          # 永遠使用 127.0.0.1
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
compaction_interval = 3600   # 每小時壓縮一次
max_context_tokens = 4096
retention_days = 90          # 記憶保留天數

[execution]
runtime = "podman"           # 建議用 podman，非 docker
sandbox_memory = "512m"
sandbox_cpu = "1.0"
timeout = 30                 # Skill 執行逾時（秒）

[security]
bind_localhost_only = true
verify_skills = true
virustotal_scan = true       # ClawHavoc 後的新設定
```

---

## 實作：系統健康檢查

### 步驟 1：執行 `openclaw doctor`

```bash
openclaw doctor
```

預期輸出：

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

### 步驟 2：檢查各層狀態

```bash
# 查看 Gateway 狀態
openclaw status gateway

# 查看 Memory 統計
openclaw status memory

# 列出已安裝的 Skills
openclaw skills list

# 查看系統日誌
openclaw logs --tail 50
```

### 步驟 3：建立你的第一個 SOUL.md

SOUL.md 定義了你的 Agent 人格特質。建立一個簡單的人格定義：

```bash
cat > ~/.openclaw/SOUL.md << 'EOF'
# Agent 人格定義

## 名稱
小龍（Xiao Long）

## 角色
你是一位友善的技術助理，專精於軟體開發與系統管理。

## 語言偏好
- 主要語言：繁體中文
- 技術術語保留英文

## 行為準則
- 回答簡潔但完整
- 主動提供相關的背景知識
- 不確定的事情直接說明，不要猜測
- 提供程式碼時一律附上說明

## 限制
- 不執行任何可能損害系統的操作
- 不存取敏感資料（除非使用者明確授權）
EOF
```

驗證 SOUL.md 是否正確載入：

```bash
openclaw soul show
```

---

## 常見錯誤與疑難排解

### 錯誤 1：Gateway 無法啟動

```
Error: Address already in use (127.0.0.1:18789)
```

**解法：**
```bash
# 找到佔用 port 的程序
lsof -i :18789

# 停止舊的 OpenClaw 程序
openclaw stop
# 或強制終止
kill -9 <PID>

# 重新啟動
openclaw start
```

### 錯誤 2：LLM Provider 連線失敗

```
Error: Failed to connect to reasoning provider
```

**解法：**
```bash
# 確認 API Key 已設定
openclaw config get reasoning.api_key

# 重新設定 API Key
openclaw config set reasoning.api_key "sk-your-key-here"

# 測試連線
openclaw test provider
```

### 錯誤 3：Podman 未安裝

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

# 驗證
podman --version
openclaw doctor
```

### 錯誤 4：config.toml 語法錯誤

```
Error: Failed to parse config.toml at line 15
```

**解法：**
```bash
# 驗證設定檔語法
openclaw config validate

# 重置為預設設定
openclaw config reset --backup
```

---

## 練習題

1. **架構探索**：使用 `openclaw status` 指令群組，分別查看四層架構的狀態，並記錄每層的關鍵指標（如連線數、記憶條目數、已安裝 Skill 數量）。

2. **自訂 SOUL.md**：建立一個自訂的 SOUL.md，定義一個專門用於程式碼審查的 Agent 人格。試試看不同的人格設定如何影響回應風格。

3. **設定調校**：修改 `config.toml` 中的 `[memory]` 區段，將 `compaction_interval` 改為 1800 秒（30 分鐘），然後觀察記憶壓縮的行為變化。

4. **日誌分析**：啟動 OpenClaw 後執行一次對話，然後查看 `gateway.log` 和 `reasoning.log`，追蹤一則訊息從接收到回應的完整流程。

---

## 隨堂測驗

1. **OpenClaw Gateway 預設監聽的 port 是？**
   - A) 8080
   - B) 3000
   - C) 18789
   - D) 443

2. **Memory System 使用什麼機制確保資料不會遺失？**
   - A) Redis
   - B) Write-Ahead Logging (WAL)
   - C) PostgreSQL
   - D) SQLite

3. **以下哪個指令用於系統健康檢查？**
   - A) `openclaw check`
   - B) `openclaw health`
   - C) `openclaw doctor`
   - D) `openclaw verify`

4. **為什麼建議使用 Podman 而非 Docker？**
   - A) Podman 速度較快
   - B) Podman 不需要 daemon，且不要求 root 權限，安全性更高
   - C) Docker 不支援 OpenClaw
   - D) Podman 功能更豐富

5. **SOUL.md 的用途是什麼？**
   - A) 定義 Skill 的行為
   - B) 設定系統參數
   - C) 定義 Agent 的人格特質與行為準則
   - D) 記錄系統日誌

<details>
<summary>查看答案</summary>

1. **C** — OpenClaw Gateway 預設在 port 18789 上監聽 WebSocket 連線。
2. **B** — Write-Ahead Logging (WAL) 確保所有記憶變更先寫入日誌，即使系統崩潰也不會遺失資料。
3. **C** — `openclaw doctor` 會檢查所有系統元件的健康狀態。
4. **B** — Podman 是 daemonless 的容器執行環境，不需要 root 權限，降低攻擊面。這也是安全最佳實踐的一部分。
5. **C** — SOUL.md 定義了 Agent 的名稱、角色、語言偏好、行為準則等人格特質。

</details>

---

## 建議下一步

你已經了解了 OpenClaw 的四層架構與基本設定。接下來，讓我們深入探索第一層 Gateway 的運作細節。

**[前往模組 2: Gateway 深入解析 →](./module-02-gateway)**
