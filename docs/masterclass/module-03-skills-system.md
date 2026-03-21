---
title: "模組 3: Skills 系統與 SKILL.md 規格"
sidebar_position: 4
description: "掌握 OpenClaw Skills 系統、SKILL.md 規格定義、Skill 生命週期，並從零打造你的第一個 Skill"
keywords: [OpenClaw, Skills, SKILL.md, ClawHub, Skill 開發, 沙盒]
---

# 模組 3: Skills 系統與 SKILL.md 規格

## 學習目標

完成本模組後，你將能夠：

- 說明 OpenClaw Skills 系統的架構與執行模型
- 撰寫完整的 SKILL.md 定義檔
- 理解 Skill 的完整生命週期（安裝 → 載入 → 執行 → 卸載）
- 從零開始建構一個可運作的 Skill
- 在沙盒容器中測試與除錯 Skill

:::info 前置條件
請先完成 [模組 1: 基礎架構](./module-01-foundations) 和 [模組 2: Gateway 深入解析](./module-02-gateway)。
:::

---

## Skills 系統架構

Skills 是 OpenClaw 的「能力」。每個 Skill 封裝了一個特定的功能（例如搜尋網頁、操作檔案、查詢 API），並在**沙盒化容器**中安全執行。

```
Reasoning Layer
      │
      │ "我需要搜尋天氣資訊"
      ▼
┌─────────────────────────────────┐
│         Skills Manager          │
│  ┌───────────────────────────┐  │
│  │    Skill Registry         │  │
│  │  ┌───────┐ ┌───────┐     │  │
│  │  │weather│ │ file  │ ... │  │
│  │  └───┬───┘ └───────┘     │  │
│  └──────┼────────────────────┘  │
│         │                       │
│  ┌──────▼────────────────────┐  │
│  │    SKILL.md Parser        │  │
│  │  解析能力、參數、權限       │  │
│  └──────┬────────────────────┘  │
│         │                       │
│  ┌──────▼────────────────────┐  │
│  │    Sandbox Executor       │  │
│  │  ┌──────────────────┐    │  │
│  │  │  Podman Container │    │  │
│  │  │  ┌──────────────┐│    │  │
│  │  │  │ Skill Runner ││    │  │
│  │  │  └──────────────┘│    │  │
│  │  └──────────────────┘    │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 執行模型

1. **Reasoning Layer 決策**：LLM 根據使用者意圖，從已載入的 Skills 中選擇合適的 Skill
2. **參數組裝**：根據 SKILL.md 定義的 `parameters`，組裝執行參數
3. **沙盒啟動**：在獨立的容器中啟動 Skill Runner
4. **執行與回傳**：Skill 執行完成後，結果經由 Gateway 串流回客戶端
5. **資源清理**：容器在 timeout 後自動銷毀

---

## SKILL.md 規格

SKILL.md 是每個 Skill 的定義檔，使用 Markdown + YAML Frontmatter 格式。它告訴 OpenClaw 這個 Skill 能做什麼、需要什麼參數、有什麼限制。

### 完整規格

```markdown
---
name: "weather-lookup"
version: "1.2.0"
author: "openclaw-official"
description: "查詢全球城市的即時天氣資訊"
license: "MIT"
runtime: "node:20-slim"
timeout: 15
permissions:
  - network:api.openweathermap.org
  - network:api.weatherapi.com
tags:
  - weather
  - utility
  - api
triggers:
  - "天氣"
  - "weather"
  - "氣溫"
  - "下雨"
---

# Weather Lookup Skill

## 能力描述

此 Skill 能夠查詢全球任何城市的即時天氣資訊，
包含溫度、濕度、風速、降雨機率等。

## 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| city | string | 是 | 城市名稱 |
| unit | string | 否 | 溫度單位（celsius/fahrenheit），預設 celsius |
| lang | string | 否 | 回應語言，預設 zh-TW |

## 回傳格式

返回 JSON 物件，包含以下欄位：

```json
{
  "city": "台北",
  "temperature": 28,
  "unit": "celsius",
  "humidity": 75,
  "wind_speed": 12,
  "description": "多雲",
  "forecast": [...]
}
```

## 範例

用戶：「台北今天天氣如何？」
→ 呼叫 weather-lookup，city="台北"

## 限制

- 需要 OpenWeatherMap API Key（設定於環境變數 `WEATHER_API_KEY`）
- Rate Limit：每分鐘最多 60 次查詢
- 不支援歷史天氣查詢
```

### Frontmatter 欄位詳解

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `name` | string | 是 | Skill 唯一識別名稱（kebab-case） |
| `version` | string | 是 | 語意版號（Semantic Versioning） |
| `author` | string | 是 | 作者名稱（對應 ClawHub 帳號） |
| `description` | string | 是 | 一行描述（最多 120 字元） |
| `license` | string | 是 | 授權方式（MIT、Apache-2.0 等） |
| `runtime` | string | 是 | 容器基礎映像檔 |
| `timeout` | number | 否 | 最大執行時間（秒），預設 30 |
| `permissions` | array | 否 | 所需權限列表 |
| `tags` | array | 否 | 標籤，用於搜尋與分類 |
| `triggers` | array | 否 | 觸發關鍵字，幫助 LLM 選擇此 Skill |

### 權限模型

OpenClaw 使用最小權限原則。每個 Skill 必須明確聲明所需的權限：

```yaml
permissions:
  - network:api.example.com      # 允許存取特定域名
  - network:*.github.com         # 允許存取 GitHub 子域名
  - filesystem:read:/tmp         # 允許讀取 /tmp
  - filesystem:write:/tmp/output # 允許寫入特定目錄
  - env:API_KEY                  # 允許讀取環境變數
  - env:DATABASE_URL
```

:::danger 安全重點
Skill 只能存取 `permissions` 中明確列出的資源。任何未授權的存取嘗試都會被沙盒攔截並記錄到安全日誌中。這是 ClawHavoc 事件後強化的安全機制。
:::

---

## Skill 生命週期

```
  安裝 (Install)          載入 (Load)
  ┌──────────┐         ┌──────────┐
  │ clawhub  │         │ 解析     │
  │ install  │────────▶│ SKILL.md │
  │ 下載驗證  │         │ 註冊能力  │
  └──────────┘         └────┬─────┘
                            │
                            ▼
                     ┌──────────┐
                     │ 就緒     │◀─────────┐
                     │ (Ready)  │          │
                     └────┬─────┘          │
                          │ 觸發           │ 完成/逾時
                          ▼                │
                     ┌──────────┐          │
                     │ 執行     │──────────┘
                     │(Execute) │
                     └──────────┘

  更新 (Update)          卸載 (Uninstall)
  ┌──────────┐         ┌──────────┐
  │ clawhub  │         │ clawhub  │
  │ update   │         │ remove   │
  └──────────┘         └──────────┘
```

### 各階段詳解

**安裝（Install）**
```bash
# 從 ClawHub 安裝
clawhub install openclaw-official/weather-lookup

# 安裝特定版本
clawhub install openclaw-official/weather-lookup@1.2.0

# 安裝時觸發的動作：
# 1. 從 ClawHub Registry 下載
# 2. 驗證簽名（SHA-256）
# 3. VirusTotal 掃描（ClawHavoc 後的新機制）
# 4. 解壓到 ~/.openclaw/skills/community/
# 5. 拉取容器映像檔
```

**載入（Load）**
```bash
# OpenClaw 啟動時自動載入所有已安裝的 Skills
# 也可以手動重新載入
openclaw skills reload

# 載入過程：
# 1. 解析 SKILL.md frontmatter
# 2. 驗證權限宣告
# 3. 註冊到 Skill Registry
# 4. 將 triggers 加入 Reasoning Layer 的 Skill 選擇器
```

**執行（Execute）**
```bash
# Skill 被觸發時：
# 1. Skills Manager 建立沙盒容器
# 2. 掛載 Skill 程式碼（唯讀）
# 3. 注入授權的環境變數
# 4. 執行 Skill Runner
# 5. 收集 stdout/stderr
# 6. 銷毀容器

# 手動測試 Skill
openclaw skill run weather-lookup --params '{"city": "台北"}'
```

---

## 實作：打造你的第一個 Skill

讓我們從零開始建構一個 **Pomodoro Timer Skill** — 一個番茄鐘計時器。

### 步驟 1：建立 Skill 目錄結構

```bash
mkdir -p ~/.openclaw/skills/local/pomodoro-timer
cd ~/.openclaw/skills/local/pomodoro-timer
```

### 步驟 2：撰寫 SKILL.md

```bash
cat > SKILL.md << 'SKILLEOF'
---
name: "pomodoro-timer"
version: "0.1.0"
author: "your-username"
description: "番茄鐘計時器，支援自訂工作與休息時間"
license: "MIT"
runtime: "node:20-slim"
timeout: 30
permissions: []
tags:
  - productivity
  - timer
  - pomodoro
triggers:
  - "番茄鐘"
  - "pomodoro"
  - "計時"
  - "專注"
---

# Pomodoro Timer Skill

## 能力描述

管理番茄鐘計時，支援開始、暫停、查看狀態。
預設工作時間 25 分鐘，休息時間 5 分鐘。

## 參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| action | string | 是 | 動作：start / pause / status / reset |
| work_minutes | number | 否 | 工作時間（分鐘），預設 25 |
| break_minutes | number | 否 | 休息時間（分鐘），預設 5 |
| label | string | 否 | 本次任務的標籤 |

## 回傳格式

```json
{
  "status": "running",
  "remaining_minutes": 18,
  "label": "撰寫文件",
  "sessions_completed": 3
}
```

## 範例

用戶：「開始一個 30 分鐘的番茄鐘，主題是寫程式」
→ 呼叫 pomodoro-timer，action="start"，work_minutes=30，label="寫程式"
SKILLEOF
```

### 步驟 3：撰寫 Skill 程式碼

```bash
cat > index.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 狀態檔路徑（容器內的暫存空間）
const STATE_FILE = '/tmp/pomodoro-state.json';

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {
      status: 'idle',
      sessions_completed: 0,
      start_time: null,
      work_minutes: 25,
      break_minutes: 5,
      label: null
    };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function handleAction(params) {
  const state = loadState();
  const { action, work_minutes, break_minutes, label } = params;

  switch (action) {
    case 'start':
      state.status = 'running';
      state.start_time = Date.now();
      state.work_minutes = work_minutes || 25;
      state.break_minutes = break_minutes || 5;
      state.label = label || null;
      saveState(state);
      return {
        status: 'running',
        remaining_minutes: state.work_minutes,
        label: state.label,
        sessions_completed: state.sessions_completed,
        message: `番茄鐘已開始！${state.work_minutes} 分鐘後提醒你休息。`
      };

    case 'pause':
      if (state.status !== 'running') {
        return { error: '目前沒有進行中的番茄鐘。' };
      }
      state.status = 'paused';
      const elapsed = Math.floor((Date.now() - state.start_time) / 60000);
      state.remaining = state.work_minutes - elapsed;
      saveState(state);
      return {
        status: 'paused',
        remaining_minutes: state.remaining,
        label: state.label,
        sessions_completed: state.sessions_completed,
        message: `番茄鐘已暫停，剩餘 ${state.remaining} 分鐘。`
      };

    case 'status':
      if (state.status === 'idle') {
        return {
          status: 'idle',
          sessions_completed: state.sessions_completed,
          message: '目前沒有進行中的番茄鐘。'
        };
      }
      const mins = state.status === 'running'
        ? state.work_minutes - Math.floor((Date.now() - state.start_time) / 60000)
        : state.remaining;
      return {
        status: state.status,
        remaining_minutes: Math.max(0, mins),
        label: state.label,
        sessions_completed: state.sessions_completed
      };

    case 'reset':
      const completed = state.status === 'running' ? state.sessions_completed + 1 : state.sessions_completed;
      saveState({
        status: 'idle',
        sessions_completed: completed,
        start_time: null,
        work_minutes: 25,
        break_minutes: 5,
        label: null
      });
      return {
        status: 'idle',
        sessions_completed: completed,
        message: `番茄鐘已重置。今日完成 ${completed} 個番茄鐘。`
      };

    default:
      return { error: `未知的動作：${action}。支援的動作：start, pause, status, reset` };
  }
}

// 從 stdin 讀取參數（OpenClaw Skill Runner 協定）
let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const params = JSON.parse(input);
    const result = handleAction(params);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    process.stdout.write(JSON.stringify({ error: err.message }));
  }
});
EOF
```

### 步驟 4：測試 Skill

```bash
# 使用 OpenClaw 內建的 Skill 測試工具
openclaw skill test ./

# 測試特定動作
echo '{"action":"start","work_minutes":25,"label":"寫程式"}' | \
  openclaw skill run pomodoro-timer --local

# 查看狀態
echo '{"action":"status"}' | \
  openclaw skill run pomodoro-timer --local

# 驗證 SKILL.md 語法
openclaw skill validate ./SKILL.md
```

預期輸出：

```json
{
  "status": "running",
  "remaining_minutes": 25,
  "label": "寫程式",
  "sessions_completed": 0,
  "message": "番茄鐘已開始！25 分鐘後提醒你休息。"
}
```

### 步驟 5：在沙盒中驗證

```bash
# 在完整的沙盒容器中測試（模擬真實執行環境）
openclaw skill sandbox-test pomodoro-timer --params '{"action":"start","label":"測試"}'

# 檢查權限是否正確（這個 Skill 不需要任何權限）
openclaw skill check-permissions pomodoro-timer
```

---

## Skill 開發最佳實踐

### 1. 輸入驗證

```javascript
// 永遠驗證輸入參數
function validateParams(params) {
  if (!params.action) {
    throw new Error('缺少必填參數：action');
  }
  const validActions = ['start', 'pause', 'status', 'reset'];
  if (!validActions.includes(params.action)) {
    throw new Error(`無效的 action：${params.action}`);
  }
  if (params.work_minutes && (params.work_minutes < 1 || params.work_minutes > 120)) {
    throw new Error('work_minutes 必須在 1-120 之間');
  }
}
```

### 2. 最小權限

```yaml
# 只請求真正需要的權限
permissions:
  - network:api.specific-service.com  # 具體的域名，非萬用字元
  - filesystem:read:/tmp/myskill      # 具體的路徑，非根目錄
```

### 3. 優雅的錯誤處理

```javascript
// 回傳結構化的錯誤訊息
function handleError(error) {
  return {
    error: true,
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message,
    suggestion: '請檢查參數後重試，或聯繫 Skill 作者。'
  };
}
```

### 4. 效能考量

```javascript
// 設定合理的 timeout
// 長時間操作使用串流回報進度
function longRunningTask(params) {
  // 每 5 秒回報進度
  const interval = setInterval(() => {
    process.stderr.write(JSON.stringify({
      progress: currentProgress,
      message: `處理中... ${currentProgress}%`
    }) + '\n');
  }, 5000);
}
```

---

## 常見錯誤與疑難排解

### 錯誤 1：SKILL.md 解析失敗

```
Error: Invalid SKILL.md: missing required field 'runtime'
```

**解法**：確認 frontmatter 包含所有必填欄位（`name`、`version`、`author`、`description`、`license`、`runtime`）。

### 錯誤 2：沙盒權限被拒

```
Error: Permission denied: network access to api.example.com not declared
```

**解法**：在 SKILL.md 的 `permissions` 中加入 `network:api.example.com`。

### 錯誤 3：容器映像檔拉取失敗

```
Error: Failed to pull image node:20-slim
```

**解法**：
```bash
# 手動拉取映像檔
podman pull node:20-slim

# 或使用 OpenClaw 快取
openclaw skill pull-runtime node:20-slim
```

### 錯誤 4：Skill 執行逾時

```
Error: Skill execution timed out after 30 seconds
```

**解法**：在 SKILL.md 中增加 `timeout` 值，或最佳化 Skill 程式碼。注意系統最大 timeout 為 300 秒。

---

## 練習題

1. **擴展 Pomodoro Skill**：為 Pomodoro Timer 加入「統計」功能（`action: "stats"`），回報今日、本週的完成數量與總專注時間。

2. **建構 URL 縮短 Skill**：建立一個 Skill，接收長 URL 並回傳縮短後的連結。使用 TinyURL 或類似的 API。別忘了宣告 `network` 權限。

3. **多語言 Skill**：修改你的 Skill，支援 `lang` 參數，讓回傳訊息能根據使用者語言偏好自動切換（zh-TW、en、ja）。

4. **權限審計**：檢查你已安裝的所有 Skills 的權限宣告，找出權限範圍最廣的 Skill，思考是否有縮減權限的空間。

---

## 隨堂測驗

1. **SKILL.md 使用什麼格式？**
   - A) 純 JSON
   - B) YAML
   - C) Markdown + YAML Frontmatter
   - D) TOML

2. **OpenClaw Skills 在什麼環境中執行？**
   - A) 主機系統的 Shell
   - B) 沙盒化容器（Podman/Docker）
   - C) 虛擬機器
   - D) WebAssembly

3. **以下哪個不是 SKILL.md 的必填欄位？**
   - A) `name`
   - B) `runtime`
   - C) `triggers`
   - D) `version`

4. **Skill 的預設最大執行時間是？**
   - A) 10 秒
   - B) 30 秒
   - C) 60 秒
   - D) 120 秒

5. **ClawHavoc 事件後，Skill 安裝時增加了什麼安全措施？**
   - A) 兩步驗證
   - B) VirusTotal 掃描
   - C) 人工審核
   - D) 區塊鏈驗證

<details>
<summary>查看答案</summary>

1. **C** — SKILL.md 使用 Markdown 格式搭配 YAML Frontmatter，讓人類可讀的同時也能被程式解析。
2. **B** — 每個 Skill 在獨立的沙盒化容器中執行（建議使用 Podman），確保系統安全。
3. **C** — `triggers` 是選填欄位。必填欄位包括 `name`、`version`、`author`、`description`、`license`、`runtime`。
4. **B** — 預設 timeout 為 30 秒，可在 SKILL.md 中自訂，系統上限為 300 秒。
5. **B** — ClawHavoc 事件揭露了 2,400 個惡意 Skills，此後 OpenClaw 在安裝 Skill 時加入 VirusTotal 掃描機制。

</details>

---

## 建議下一步

你已經學會了如何開發 OpenClaw Skills。下一步，讓我們了解如何透過 ClawHub 市集與社群分享你的 Skills。

**[前往模組 4: ClawHub 市集 →](./module-04-clawhub)**
