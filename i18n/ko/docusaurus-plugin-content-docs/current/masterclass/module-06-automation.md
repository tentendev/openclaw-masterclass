---
title: "모듈 6: Cron Jobs / Heartbeat / 능동 알림"
sidebar_position: 7
description: "OpenClaw 스케줄링 작업, Heartbeat 능동 메시지 푸시 설정 방법 학습, 자동화 모니터링 시스템 구축"
---

# 模組 6: Cron Jobs / Heartbeat / 主動通知

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- 理解 OpenClaw 스케줄링系統的架構與運作原理
- 설정 Cron Jobs 실행週期性任務
- 啟用 Heartbeat 機制讓 Agent 主動發送메시지
- 建構每日요약（Daily Digest）自動化流程
- 設計即時모니터링與告警系統
- 排除스케줄링任務常見問題

## 핵심 개념

### 스케줄링架構總覽

OpenClaw 的自動化架構생성在兩個核心機制之上：

| 機制 | 說明 | 適用場景 |
|------|------|---------|
| **Cron Jobs** | 基於 cron 表達式的定時任務 | 定期報告、데이터백업、스케줄링清理 |
| **Heartbeat** | Agent 主動트리거的週期性行為 | 主動問候、狀態檢查、即時提醒 |
| **Event Triggers** | 基於事件的被動트리거 | Webhook 回應、메시지監聽、狀態變更 |

### Cron Jobs 運作原理

OpenClaw 內建的 Cron 스케줄링器基於 Node.js 的 `node-cron` 套件，支援標準的 cron 表達式：

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

Heartbeat 是 OpenClaw 獨有的「心跳」功能，讓 Agent 能在沒有사용자트리거的情況下，主動送出메시지。這是讓 Agent 從被動回應轉變為主動助理的關鍵功能。

```
사용자 ←── Heartbeat 主動메시지 ←── Agent
                                    ↑
                               스케줄링트리거器
                               事件트리거器
                               狀態트리거器
```

## 실습 튜토리얼

### 步驟一：설정基本 Cron Job

在你的 `settings.json` 中啟用스케줄링功能：

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

:::tip 時區설정
務必설정 `timezone` 欄位，否則 OpenClaw 預設使用 UTC 時區。한국사용자應設為 `Asia/Taipei`。
:::

### 步驟二：啟用 Heartbeat

在 `soul.md` 中加入 Heartbeat 설정：

```markdown
## Heartbeat 설정

你具有主動發送메시지的能力。請根據以下規則行事：

- 每天早上 9:00 發送今日行程요약
- 當모니터링的網站發生異常時，立即通知
- 每週一早上發送週報
- 不要在晚上 10 點到早上 7 點之間發送非緊急메시지
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
        "prompt": "檢查今日行事曆並發送요약"
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

### 步驟三：建構每日요약系統

생성一個完整的 Daily Digest Skill：

```javascript
// skills/daily-digest/index.js
module.exports = {
  name: "daily-digest",
  description: "產生每日요약報告",

  async execute(context) {
    const { agent, channel } = context;

    // 收集各來源데이터
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

    // 組合요약
    const digest = `
📅 **今日요약 — ${new Date().toLocaleDateString('zh-TW')}**

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

### 步驟四：自動化모니터링系統

생성網站健康檢查的自動化모니터링：

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

생성對應的모니터링 Skill：

```javascript
// skills/website-monitor/index.js
const https = require('https');

module.exports = {
  name: "website-monitor",
  description: "모니터링網站가용성",

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

### 步驟五：進階스케줄링 — 鏈式任務

你可以將多個任務串聯成워크플로：

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

## 자주 발생하는 오류

:::danger 스케줄 실행되지만 메시지 미발송
最常見的原因是 Agent 的 channel 連線已中斷。請確認：
1. Discord/Matrix Bot 的 token 是否過期
2. channel ID 是否正確
3. Bot 是否仍在目標채널中

使用以下指令檢查連線狀態：
```bash
curl http://127.0.0.1:18789/api/channels
```
:::

:::caution Heartbeat 과도한 빈도
如果 `interval_minutes` 設得太低（例如 1 分鐘），可能會：
- 造成 API rate limit
- 產生過多不必要的메시지
- 增加 LLM API 費用

建議最低設為 5 分鐘，一般場景設為 15-30 分鐘。
:::

| 錯誤情境 | 原因 | 解決方案 |
|----------|------|---------|
| Cron job 沒有실행 | 時區설정錯誤 | 確認 `timezone` 是否為 IANA 格式 |
| Heartbeat 메시지重複 | 多個 Agent 實例同時運行 | 確保只有一個實例啟用 Heartbeat |
| 스케줄링지연超過 1 分鐘 | 系統부하過高或 event loop 阻塞 | 檢查是否有同步阻塞的 Skill |
| Pipeline 中途失敗 | 前置任務超時 | 為每個步驟설정 `timeout_ms` |

## 문제 해결

### 檢查스케줄링狀態

```bash
# 조회所有스케줄링任務
curl http://127.0.0.1:18789/api/cron/jobs

# 조회特定任務的실행歷史
curl http://127.0.0.1:18789/api/cron/jobs/daily-digest/history

# 手動트리거스케줄링任務（테스트用）
curl -X POST http://127.0.0.1:18789/api/cron/jobs/daily-digest/trigger

# 조회 Heartbeat 狀態
curl http://127.0.0.1:18789/api/heartbeat/status
```

### 디버깅로그

在 `settings.json` 中啟用스케줄링디버깅로그：

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

然後조회로그：

```bash
# 過濾스케줄링相關로그
tail -f logs/openclaw.log | grep -E "(cron|heartbeat)"
```

## 연습 문제

### 연습 1：基礎스케줄링
설정一個 Cron Job，每天下午 5:00 (한국時間) 發送今日工作總結。

### 연습 2：智慧提醒
利用 Heartbeat 機制，讓 Agent 在偵測到你的 Google Calendar 中有即將開始的會議（15 分鐘前）時，主動提醒你。

### 연습 3：모니터링警報系統
建構一個完整的모니터링系統，모니터링 3 個 URL，每 5 分鐘檢查一次。當連續失敗 3 次時發送 Discord 警報，恢復正常時也要發送通知。

## 퀴즈

1. **Cron 表達式 `0 */2 * * *` 代表什麼意思？**
   - A) 每 2 秒실행
   - B) 每 2 分鐘실행
   - C) 每 2 小時실행
   - D) 每 2 天실행

   <details><summary>정답 확인</summary>C) 每 2 小時실행（在每小時的第 0 分鐘，每隔 2 小時）</details>

2. **Heartbeat 和 Cron Job 的主要差異是什麼？**
   - A) Heartbeat 更精確
   - B) Heartbeat 讓 Agent 具有「主動意識」，可根據上下文決定是否行動
   - C) Cron Job 不能發送메시지
   - D) 兩者沒有差異

   <details><summary>정답 확인</summary>B) Heartbeat 機制允許 Agent 在스케줄링트리거時，根據當前情境自主判斷是否需要行動，而非盲目실행。</details>

3. **為什麼 Heartbeat 的 `interval_minutes` 不建議設為 1 分鐘？**
   - A) 技術上不支援
   - B) 會導致 API rate limit、高費用和過量메시지
   - C) 只支援 5 的倍數
   - D) 會造成安全問題

   <details><summary>정답 확인</summary>B) 過於頻繁的 Heartbeat 會트리거 LLM API 的速率限制、大幅增加費用，並產生過多不必要的通知。</details>

4. **在 Pipeline 中，`depends_on_previous: true` 的作用是什麼？**
   - A) 共用相同的스케줄링時間
   - B) 前一步驟的輸出作為下一步驟的輸入，且前置失敗時會中斷
   - C) 強制在同一個 thread 中실행
   - D) 使用相同的 API key

   <details><summary>정답 확인</summary>B) 這個설정確保任務按序실행，前一步驟的回傳值可被下一步驟使用，且任何步驟失敗會終止整個 pipeline。</details>

## 다음 단계

- [模組 7: 브라우저自動化與網頁크롤링](./module-07-browser) — 學習如何結合스케줄링與網頁크롤링，建構價格모니터링等進階自動化
- [模組 8: 多 Agent 架構](./module-08-multi-agent) — 了解如何在多 Agent 環境中協調스케줄링任務
- [模組 10: 正式環境배포](./module-10-production) — 學習如何在 systemd 中管理스케줄링服務的穩定性
