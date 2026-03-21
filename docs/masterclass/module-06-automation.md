---
title: "模組 6: Cron Jobs / Heartbeat / 主動通知"
sidebar_position: 7
description: "學習如何設定 OpenClaw 排程任務、Heartbeat 主動訊息推送，以及建構自動化監控系統"
keywords: [OpenClaw, cron, heartbeat, automation, 排程, 自動化, 通知]
---

# 模組 6: Cron Jobs / Heartbeat / 主動通知

## 學習目標

完成本模組後，你將能夠：

- 理解 OpenClaw 排程系統的架構與運作原理
- 設定 Cron Jobs 執行週期性任務
- 啟用 Heartbeat 機制讓 Agent 主動發送訊息
- 建構每日摘要（Daily Digest）自動化流程
- 設計即時監控與告警系統
- 排除排程任務常見問題

## 核心概念

### 排程架構總覽

OpenClaw 的自動化架構建立在兩個核心機制之上：

| 機制 | 說明 | 適用場景 |
|------|------|---------|
| **Cron Jobs** | 基於 cron 表達式的定時任務 | 定期報告、資料備份、排程清理 |
| **Heartbeat** | Agent 主動觸發的週期性行為 | 主動問候、狀態檢查、即時提醒 |
| **Event Triggers** | 基於事件的被動觸發 | Webhook 回應、訊息監聽、狀態變更 |

### Cron Jobs 運作原理

OpenClaw 內建的 Cron 排程器基於 Node.js 的 `node-cron` 套件，支援標準的 cron 表達式：

```
┌────────── 秒 (可選, 0-59)
│ ┌──────── 分 (0-59)
│ │ ┌────── 時 (0-23)
│ │ │ ┌──── 日 (1-31)
│ │ │ │ ┌── 月 (1-12)
│ │ │ │ │ ┌ 星期 (0-7, 0 和 7 都是週日)
│ │ │ │ │ │
* * * * * *
```

### Heartbeat 機制

Heartbeat 是 OpenClaw 獨有的「心跳」功能，讓 Agent 能在沒有使用者觸發的情況下，主動送出訊息。這是讓 Agent 從被動回應轉變為主動助理的關鍵功能。

```
使用者 ←── Heartbeat 主動訊息 ←── Agent
                                    ↑
                               排程觸發器
                               事件觸發器
                               狀態觸發器
```

## 實作教學

### 步驟一：設定基本 Cron Job

在你的 `settings.json` 中啟用排程功能：

```json
{
  "cron": {
    "enabled": true,
    "jobs": [
      {
        "name": "daily-digest",
        "schedule": "0 9 * * *",
        "action": "send_daily_digest",
        "channel": "discord",
        "timezone": "Asia/Taipei"
      }
    ]
  }
}
```

:::tip 時區設定
務必設定 `timezone` 欄位，否則 OpenClaw 預設使用 UTC 時區。台灣使用者應設為 `Asia/Taipei`。
:::

### 步驟二：啟用 Heartbeat

在 `soul.md` 中加入 Heartbeat 設定：

```markdown
## Heartbeat 設定

你具有主動發送訊息的能力。請根據以下規則行事：

- 每天早上 9:00 發送今日行程摘要
- 當監控的網站發生異常時，立即通知
- 每週一早上發送週報
- 不要在晚上 10 點到早上 7 點之間發送非緊急訊息
```

對應的 `settings.json` Heartbeat 區塊：

```json
{
  "heartbeat": {
    "enabled": true,
    "interval_minutes": 15,
    "idle_triggers": {
      "morning_greeting": {
        "time": "09:00",
        "timezone": "Asia/Taipei",
        "prompt": "檢查今日行事曆並發送摘要"
      }
    },
    "proactive_checks": [
      {
        "name": "website_monitor",
        "interval_minutes": 5,
        "action": "check_website_status"
      }
    ]
  }
}
```

### 步驟三：建構每日摘要系統

建立一個完整的 Daily Digest Skill：

```javascript
// skills/daily-digest/index.js
module.exports = {
  name: "daily-digest",
  description: "產生每日摘要報告",

  async execute(context) {
    const { agent, channel } = context;

    // 收集各來源資料
    const weather = await agent.callSkill("weather", {
      city: "Taipei"
    });
    const calendar = await agent.callSkill("google-calendar", {
      action: "today"
    });
    const news = await agent.callSkill("news-fetcher", {
      topics: ["AI", "tech"],
      limit: 5
    });
    const tasks = await agent.callSkill("todoist", {
      action: "due_today"
    });

    // 組合摘要
    const digest = `
📅 **今日摘要 — ${new Date().toLocaleDateString('zh-TW')}**

🌤️ **天氣**
${weather.summary}

📋 **今日行程**
${calendar.events.map(e => `- ${e.time} ${e.title}`).join('\n')}

✅ **待辦事項**
${tasks.items.map(t => `- [ ] ${t.title}`).join('\n')}

📰 **科技新聞**
${news.articles.map(a => `- [${a.title}](${a.url})`).join('\n')}
    `;

    await channel.send(digest);

    return { success: true, itemCount: news.articles.length };
  }
};
```

### 步驟四：自動化監控系統

建立網站健康檢查的自動化監控：

```json
{
  "cron": {
    "jobs": [
      {
        "name": "health-check",
        "schedule": "*/5 * * * *",
        "action": "run_skill",
        "skill": "website-monitor",
        "params": {
          "urls": [
            "https://api.example.com/health",
            "https://www.example.com"
          ],
          "timeout_ms": 5000,
          "alert_on_failure": true,
          "alert_channel": "discord",
          "consecutive_failures_threshold": 3
        }
      }
    ]
  }
}
```

建立對應的監控 Skill：

```javascript
// skills/website-monitor/index.js
const https = require('https');

module.exports = {
  name: "website-monitor",
  description: "監控網站可用性",

  state: {
    failureCounts: {}
  },

  async execute(context) {
    const { params, agent, channel } = context;
    const results = [];

    for (const url of params.urls) {
      try {
        const start = Date.now();
        const response = await fetch(url, {
          signal: AbortSignal.timeout(params.timeout_ms)
        });
        const latency = Date.now() - start;

        if (response.ok) {
          this.state.failureCounts[url] = 0;
          results.push({ url, status: "ok", latency });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        this.state.failureCounts[url] =
          (this.state.failureCounts[url] || 0) + 1;

        results.push({
          url,
          status: "error",
          error: error.message,
          consecutiveFailures: this.state.failureCounts[url]
        });

        if (this.state.failureCounts[url] >=
            params.consecutive_failures_threshold) {
          await channel.send(
            `🚨 **警報：網站異常**\n` +
            `URL: ${url}\n` +
            `錯誤: ${error.message}\n` +
            `連續失敗: ${this.state.failureCounts[url]} 次`
          );
        }
      }
    }

    return { results };
  }
};
```

### 步驟五：進階排程 — 鏈式任務

你可以將多個任務串聯成工作流程：

```json
{
  "cron": {
    "jobs": [
      {
        "name": "weekly-report-pipeline",
        "schedule": "0 8 * * 1",
        "action": "run_pipeline",
        "pipeline": [
          {
            "skill": "data-collector",
            "params": { "range": "last_week" }
          },
          {
            "skill": "report-generator",
            "params": { "template": "weekly" },
            "depends_on_previous": true
          },
          {
            "skill": "email-sender",
            "params": {
              "to": "team@example.com",
              "subject": "本週報告"
            },
            "depends_on_previous": true
          }
        ]
      }
    ]
  }
}
```

## 常見錯誤

:::danger 排程執行但無訊息送出
最常見的原因是 Agent 的 channel 連線已中斷。請確認：
1. Discord/Matrix Bot 的 token 是否過期
2. channel ID 是否正確
3. Bot 是否仍在目標頻道中

使用以下指令檢查連線狀態：
```bash
curl http://127.0.0.1:18789/api/channels
```
:::

:::caution Heartbeat 過於頻繁
如果 `interval_minutes` 設得太低（例如 1 分鐘），可能會：
- 造成 API rate limit
- 產生過多不必要的訊息
- 增加 LLM API 費用

建議最低設為 5 分鐘，一般場景設為 15-30 分鐘。
:::

| 錯誤情境 | 原因 | 解決方案 |
|----------|------|---------|
| Cron job 沒有執行 | 時區設定錯誤 | 確認 `timezone` 是否為 IANA 格式 |
| Heartbeat 訊息重複 | 多個 Agent 實例同時運行 | 確保只有一個實例啟用 Heartbeat |
| 排程延遲超過 1 分鐘 | 系統負載過高或 event loop 阻塞 | 檢查是否有同步阻塞的 Skill |
| Pipeline 中途失敗 | 前置任務超時 | 為每個步驟設定 `timeout_ms` |

## 疑難排解

### 檢查排程狀態

```bash
# 查看所有排程任務
curl http://127.0.0.1:18789/api/cron/jobs

# 查看特定任務的執行歷史
curl http://127.0.0.1:18789/api/cron/jobs/daily-digest/history

# 手動觸發排程任務（測試用）
curl -X POST http://127.0.0.1:18789/api/cron/jobs/daily-digest/trigger

# 查看 Heartbeat 狀態
curl http://127.0.0.1:18789/api/heartbeat/status
```

### 除錯日誌

在 `settings.json` 中啟用排程除錯日誌：

```json
{
  "logging": {
    "level": "debug",
    "modules": {
      "cron": "debug",
      "heartbeat": "debug"
    }
  }
}
```

然後查看日誌：

```bash
# 過濾排程相關日誌
tail -f logs/openclaw.log | grep -E "(cron|heartbeat)"
```

## 練習題

### 練習 1：基礎排程
設定一個 Cron Job，每天下午 5:00 (台灣時間) 發送今日工作總結。

### 練習 2：智慧提醒
利用 Heartbeat 機制，讓 Agent 在偵測到你的 Google Calendar 中有即將開始的會議（15 分鐘前）時，主動提醒你。

### 練習 3：監控警報系統
建構一個完整的監控系統，監控 3 個 URL，每 5 分鐘檢查一次。當連續失敗 3 次時發送 Discord 警報，恢復正常時也要發送通知。

## 隨堂測驗

1. **Cron 表達式 `0 */2 * * *` 代表什麼意思？**
   - A) 每 2 秒執行
   - B) 每 2 分鐘執行
   - C) 每 2 小時執行
   - D) 每 2 天執行

   <details><summary>查看答案</summary>C) 每 2 小時執行（在每小時的第 0 分鐘，每隔 2 小時）</details>

2. **Heartbeat 和 Cron Job 的主要差異是什麼？**
   - A) Heartbeat 更精確
   - B) Heartbeat 讓 Agent 具有「主動意識」，可根據上下文決定是否行動
   - C) Cron Job 不能發送訊息
   - D) 兩者沒有差異

   <details><summary>查看答案</summary>B) Heartbeat 機制允許 Agent 在排程觸發時，根據當前情境自主判斷是否需要行動，而非盲目執行。</details>

3. **為什麼 Heartbeat 的 `interval_minutes` 不建議設為 1 分鐘？**
   - A) 技術上不支援
   - B) 會導致 API rate limit、高費用和過量訊息
   - C) 只支援 5 的倍數
   - D) 會造成安全問題

   <details><summary>查看答案</summary>B) 過於頻繁的 Heartbeat 會觸發 LLM API 的速率限制、大幅增加費用，並產生過多不必要的通知。</details>

4. **在 Pipeline 中，`depends_on_previous: true` 的作用是什麼？**
   - A) 共用相同的排程時間
   - B) 前一步驟的輸出作為下一步驟的輸入，且前置失敗時會中斷
   - C) 強制在同一個 thread 中執行
   - D) 使用相同的 API key

   <details><summary>查看答案</summary>B) 這個設定確保任務按序執行，前一步驟的回傳值可被下一步驟使用，且任何步驟失敗會終止整個 pipeline。</details>

## 建議下一步

- [模組 7: 瀏覽器自動化與網頁爬取](./module-07-browser) — 學習如何結合排程與網頁爬取，建構價格監控等進階自動化
- [模組 8: 多 Agent 架構](./module-08-multi-agent) — 了解如何在多 Agent 環境中協調排程任務
- [模組 10: 正式環境部署](./module-10-production) — 學習如何在 systemd 中管理排程服務的穩定性
