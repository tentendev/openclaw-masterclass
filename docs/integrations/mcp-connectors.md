---
title: MCP 連接器
description: 透過 Model Context Protocol (MCP) 擴展 OpenClaw 的外部整合能力
sidebar_position: 3
keywords: [OpenClaw, MCP, Composio, 連接器, 整合]
---

# MCP 連接器

Model Context Protocol (MCP) 是一套開放標準協定，讓 LLM 能夠安全地存取外部工具與資料來源。OpenClaw 內建 MCP 支援，並透過 [Composio](https://composio.dev/) 提供 50+ 預建連接器。

## 什麼是 MCP？

MCP 定義了 LLM 與外部系統之間的標準化通訊介面。傳統做法需要為每個工具撰寫客製化整合程式碼，而 MCP 將此流程標準化。

```
LLM 請求 → OpenClaw → MCP Client → MCP Server → 外部服務
                                         ↑
                                    標準化協定
                                  (工具 / 資源 / 提示)
```

### 核心概念

| 概念 | 說明 | 範例 |
|------|------|------|
| **Tools（工具）** | LLM 可主動呼叫的操作 | 建立 GitHub Issue、發送 Slack 訊息 |
| **Resources（資源）** | LLM 可讀取的結構化資料 | 資料庫查詢結果、檔案內容 |
| **Prompts（提示）** | 預定義的提示範本 | 程式碼審查範本、摘要範本 |
| **Sampling（取樣）** | MCP Server 向 LLM 發起請求 | 需要 AI 協助決策的流程 |

### 為什麼 MCP 重要？

- **標準化**：一次實作，處處可用——同一個 MCP Server 可供任何 MCP 相容的 AI 平台使用
- **安全性**：明確的權限模型，LLM 只能存取被授權的工具和資源
- **可組合性**：像積木一樣組合多個 MCP Server，建構複雜的 AI 工作流程
- **社群生態**：快速成長的開源 MCP Server 生態系統

## 快速開始

### 1. 啟用 MCP 支援

```yaml title="openclaw-config.yaml"
mcp:
  enabled: true
  servers: []      # 稍後加入 MCP Server
  security:
    require_user_approval: true   # 工具呼叫前需要使用者確認
    allowed_hosts: ["*"]          # 允許連線的主機
```

### 2. 新增 MCP Server

```yaml title="openclaw-config.yaml"
mcp:
  enabled: true
  servers:
    - name: "github"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-github"]
      env:
        GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_TOKEN}"

    - name: "slack"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-slack"]
      env:
        SLACK_BOT_TOKEN: "${SLACK_BOT_TOKEN}"
```

### 3. 測試連線

```bash
# 列出所有已註冊的 MCP 工具
openclaw mcp list-tools

# 測試特定工具
openclaw mcp test --server github --tool create_issue \
  --params '{"repo": "my-org/my-repo", "title": "測試", "body": "MCP 連接器測試"}'
```

## 可用的 MCP 連接器

### 透過 Composio 平台

OpenClaw 與 Composio 深度整合，提供 50+ 預建連接器，涵蓋主流 SaaS 服務。

```yaml title="openclaw-config.yaml"
mcp:
  composio:
    enabled: true
    api_key: "${COMPOSIO_API_KEY}"
    apps:
      - slack
      - github
      - notion
      - linear
      - gmail
      - google-calendar
```

### 連接器總覽

| 分類 | 連接器 | 主要功能 |
|------|--------|---------|
| **協作** | Slack | 發送訊息、建立頻道、搜尋對話 |
| | Notion | 建立/更新頁面、查詢資料庫 |
| | Airtable | CRUD 操作、檢視管理 |
| **開發** | GitHub | Issue、PR、程式碼搜尋、Actions |
| | Linear | 任務管理、專案追蹤、排程 |
| | GitLab | 合併請求、CI/CD 管線 |
| **設計** | Figma | 讀取設計稿、匯出素材 |
| **社群** | Reddit | 搜尋貼文、發布內容、監控 |
| | Twitter/X | 發布推文、搜尋趨勢 |
| **生產力** | Gmail | 搜尋/發送郵件、管理標籤 |
| | Google Calendar | 建立/查詢行程 |
| | Google Drive | 檔案搜尋、建立文件 |
| **資料** | PostgreSQL | SQL 查詢、schema 瀏覽 |
| | Elasticsearch | 全文搜尋、索引管理 |
| **監控** | PagerDuty | 事件管理、值班排程 |
| | Sentry | 錯誤追蹤、效能監控 |

## 熱門連接器詳細設定

### Slack 連接器

```yaml title="openclaw-config.yaml"
mcp:
  servers:
    - name: "slack"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-slack"]
      env:
        SLACK_BOT_TOKEN: "${SLACK_BOT_TOKEN}"
        SLACK_TEAM_ID: "${SLACK_TEAM_ID}"
      permissions:
        tools:
          - "slack_post_message"
          - "slack_search_messages"
          - "slack_list_channels"
        deny:
          - "slack_delete_message"       # 禁止刪除訊息
```

**可用工具：**

| 工具名稱 | 說明 |
|----------|------|
| `slack_post_message` | 發送訊息到指定頻道 |
| `slack_search_messages` | 搜尋工作區中的訊息 |
| `slack_list_channels` | 列出所有可見頻道 |
| `slack_get_channel_history` | 取得頻道歷史訊息 |
| `slack_add_reaction` | 對訊息加入表情回應 |

### GitHub 連接器

```yaml title="openclaw-config.yaml"
mcp:
  servers:
    - name: "github"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-github"]
      env:
        GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_TOKEN}"
      permissions:
        tools:
          - "create_issue"
          - "search_code"
          - "list_pull_requests"
          - "get_file_contents"
          - "create_pull_request"
```

### Notion 連接器

```yaml title="openclaw-config.yaml"
mcp:
  servers:
    - name: "notion"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-notion"]
      env:
        NOTION_API_KEY: "${NOTION_API_KEY}"
```

### Linear 連接器

```yaml title="openclaw-config.yaml"
mcp:
  servers:
    - name: "linear"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-linear"]
      env:
        LINEAR_API_KEY: "${LINEAR_API_KEY}"
```

## 使用 SSE 傳輸協定

除了 `stdio` 以外，MCP 也支援 Server-Sent Events (SSE) 傳輸方式，適用於遠端 MCP Server。

```yaml title="openclaw-config.yaml"
mcp:
  servers:
    - name: "remote-tools"
      transport: "sse"
      url: "https://mcp.your-company.com/sse"
      headers:
        Authorization: "Bearer ${MCP_REMOTE_TOKEN}"
      reconnect_interval: 5000    # 毫秒
      timeout: 30000
```

:::tip 傳輸協定選擇
- **stdio**：適用於本地 MCP Server，啟動快、延遲低
- **SSE**：適用於遠端或共享的 MCP Server，支援多客戶端連線
:::

## 建構自訂 MCP 連接器

### 基本架構

```typescript title="src/my-mcp-server.ts"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-custom-server",
  version: "1.0.0",
});

// 定義工具
server.tool(
  "get_weather",
  "取得指定城市的天氣資訊",
  {
    city: z.string().describe("城市名稱，例如：台北、東京"),
    unit: z.enum(["celsius", "fahrenheit"]).default("celsius"),
  },
  async ({ city, unit }) => {
    // 實作天氣 API 呼叫
    const weather = await fetchWeather(city, unit);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(weather, null, 2),
        },
      ],
    };
  }
);

// 定義資源
server.resource(
  "config://app",
  "應用程式設定資訊",
  async () => {
    return {
      contents: [
        {
          uri: "config://app",
          mimeType: "application/json",
          text: JSON.stringify({ version: "1.0", env: "production" }),
        },
      ],
    };
  }
);

// 啟動伺服器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("自訂 MCP Server 已啟動");
}

main().catch(console.error);
```

### 在 OpenClaw 中註冊

```yaml title="openclaw-config.yaml"
mcp:
  servers:
    - name: "my-custom-tools"
      transport: "stdio"
      command: "npx"
      args: ["tsx", "./src/my-mcp-server.ts"]
      env:
        WEATHER_API_KEY: "${WEATHER_API_KEY}"
```

### 測試自訂連接器

```bash
# 直接測試 MCP Server
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | \
  npx tsx ./src/my-mcp-server.ts

# 透過 OpenClaw 測試
openclaw mcp test --server my-custom-tools --tool get_weather \
  --params '{"city": "台北", "unit": "celsius"}'
```

## 安全性考量

### 權限模型

```yaml title="openclaw-config.yaml"
mcp:
  security:
    # 全域設定
    require_user_approval: true
    max_tool_calls_per_turn: 10
    timeout_per_tool_call: 30     # 秒

    # 按伺服器設定
    server_policies:
      github:
        allowed_tools:
          - "search_code"
          - "get_file_contents"
          - "list_pull_requests"
        denied_tools:
          - "delete_repository"
          - "create_deployment"
        rate_limit:
          calls_per_minute: 30

      slack:
        allowed_tools: ["*"]
        denied_tools:
          - "slack_delete_message"
        allowed_channels:
          - "#ai-bot"
          - "#general"
```

### 安全最佳實務

:::caution 重要安全原則

1. **最小權限原則**：只授予 MCP Server 必要的權限。GitHub Token 應使用 fine-grained PAT，僅開放必要的 repository 和 scope。

2. **使用者確認機制**：在生產環境中啟用 `require_user_approval`，讓使用者在每次工具呼叫前確認操作內容。

3. **網路隔離**：MCP Server 應運行在獨立的網路環境中，避免直接存取內部服務。

4. **日誌審計**：記錄所有 MCP 工具呼叫，包含呼叫者、工具名稱、參數和結果。

5. **密鑰管理**：使用環境變數或密鑰管理服務儲存 API 金鑰，不要寫入設定檔。
:::

### 審計日誌

```yaml title="openclaw-config.yaml"
mcp:
  audit:
    enabled: true
    log_level: "info"            # debug | info | warn | error
    include_params: true         # 記錄工具參數
    include_results: false       # 不記錄工具回傳值（可能包含敏感資料）
    output: "file"               # file | stdout | syslog
    file_path: "/var/log/openclaw/mcp-audit.log"
    retention_days: 90
```

審計日誌範例：

```json
{
  "timestamp": "2026-03-30T10:15:23Z",
  "event": "tool_call",
  "user": "user-123",
  "server": "github",
  "tool": "create_issue",
  "params": {"repo": "my-org/my-repo", "title": "Bug 修復"},
  "status": "success",
  "duration_ms": 452
}
```

## 進階工作流程

### 多 MCP Server 串聯

您可以在單一對話中組合多個 MCP Server，實現跨平台自動化。

```yaml title="openclaw-config.yaml"
mcp:
  servers:
    - name: "github"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-github"]
      env:
        GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_TOKEN}"

    - name: "slack"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-slack"]
      env:
        SLACK_BOT_TOKEN: "${SLACK_BOT_TOKEN}"

    - name: "linear"
      transport: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-linear"]
      env:
        LINEAR_API_KEY: "${LINEAR_API_KEY}"
```

**使用情境範例**：使用者對 AI 說「幫我把這個 GitHub Issue 轉成 Linear 任務，並在 Slack 通知團隊」——AI 會依序呼叫三個不同的 MCP Server 完成任務。

### 條件式工具存取

```yaml title="openclaw-config.yaml"
mcp:
  conditional_access:
    rules:
      # 只有管理員能存取部署工具
      - match:
          user_role: "admin"
        servers: ["github", "slack", "linear", "deployment"]
      # 一般使用者只能讀取
      - match:
          user_role: "viewer"
        servers: ["github"]
        allowed_tools: ["search_code", "get_file_contents"]
```

## 疑難排解

:::warning MCP Server 啟動失敗
**症狀**：`Error: MCP server failed to start`

**解決步驟**：
1. 確認 Node.js 版本 >= 18：`node --version`
2. 手動執行 MCP Server 命令，觀察錯誤輸出
3. 檢查環境變數是否正確設定
4. 確認 npm 套件已正確安裝：`npx -y @modelcontextprotocol/server-github --help`
:::

:::warning 工具呼叫逾時
**症狀**：`Error: Tool call timed out after 30s`

**解決步驟**：
1. 增加 `timeout_per_tool_call` 設定值
2. 檢查外部服務是否正常運作
3. 確認網路連線穩定
4. 查看 MCP Server 的 stderr 輸出以獲取更多資訊
:::

:::warning 權限不足
**症狀**：`Error: Tool "create_issue" is not allowed`

**解決步驟**：
1. 檢查 `server_policies` 中的 `allowed_tools` 設定
2. 確認 API 金鑰具有對應的權限 scope
3. 查看審計日誌了解被拒絕的具體原因
:::

### 除錯模式

```bash
# 啟用 MCP 除錯日誌
export OPENCLAW_MCP_DEBUG=true
openclaw serve

# 檢視特定 MCP Server 的通訊內容
openclaw mcp logs --server github --follow
```

## 下一步

- [Ollama 整合指南](./ollama.md)：為本地模型添加 MCP 工具能力
- [OpenAI 相容 API 整合](./openai-compatible.md)：結合雲端模型與 MCP 連接器
