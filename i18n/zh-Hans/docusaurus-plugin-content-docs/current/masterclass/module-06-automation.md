---
title: "模块 6: Cron Jobs / Heartbeat / 主动通知"
sidebar_position: 7
description: "学习如何配置 OpenClaw 调度任务、Heartbeat 主动消息推送，以及构建自动化监控系统"
keywords: [OpenClaw, cron, heartbeat, automation, 调度, 自动化, 通知]
---

# 模块 6: Cron Jobs / Heartbeat / 主动通知

## 学习目标

完成本模块后，你将能够：

- 理解 OpenClaw 调度系统的架构与运作原理
- 配置 Cron Jobs 执行周期性任务
- 启用 Heartbeat 机制让 Agent 主动发送消息
- 构建每日摘要（Daily Digest）自动化流程
- 设计实时监控与告警系统
- 排除调度任务常见问题

## 核心概念

### 调度架构总览

OpenClaw 的自动化架构创建在两个核心机制之上：

| 机制 | 说明 | 适用场景 |
|------|------|---------|
| **Cron Jobs** | 基于 cron 表达式的定时任务 | 定期报告、数据备份、调度清理 |
| **Heartbeat** | Agent 主动触发的周期性行为 | 主动问候、状态检查、实时提醒 |
| **Event Triggers** | 基于事件的被动触发 | Webhook 响应、消息监听、状态变更 |

### Cron Jobs 运作原理

OpenClaw 内建的 Cron 调度器基于 Node.js 的 `node-cron` 包，支援标准的 cron 表达式：

```
┌────────── 秒 (可选, 0-59)
│ ┌──────── 分 (0-59)
│ │ ┌────── 时 (0-23)
│ │ │ ┌──── 日 (1-31)
│ │ │ │ ┌── 月 (1-12)
│ │ │ │ │ ┌ 星期 (0-7, 0 和 7 都是周日)
│ │ │ │ │ │
* * * * * *
```

### Heartbeat 机制

Heartbeat 是 OpenClaw 独有的「心跳」功能，让 Agent 能在没有用户触发的情况下，主动送出消息。这是让 Agent 从被动响应转变为主动助理的关键功能。

```
用户 ←── Heartbeat 主动消息 ←── Agent
                                    ↑
                               调度触发器
                               事件触发器
                               状态触发器
```

## 实现教程

### 步骤一：配置基本 Cron Job

在你的 `settings.json` 中启用调度功能：

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

:::tip 时区配置
务必配置 `timezone` 字段，否则 OpenClaw 默认使用 UTC 时区。台湾用户应设为 `Asia/Taipei`。
:::

### 步骤二：启用 Heartbeat

在 `soul.md` 中加入 Heartbeat 配置：

```markdown
## Heartbeat 配置

你具有主动发送消息的能力。请根据以下规则行事：

- 每天早上 9:00 发送今日日程摘要
- 当监控的网站发生异常时，立即通知
- 每周一早上发送周报
- 不要在晚上 10 点到早上 7 点之间发送非紧急消息
```

对应的 `settings.json` Heartbeat 区块：

```json
{
  "heartbeat": {
    "enabled": true,
    "interval_minutes": 15,
    "idle_triggers": {
      "morning_greeting": {
        "time": "09:00",
        "timezone": "Asia/Taipei",
        "prompt": "检查今日日历并发送摘要"
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

### 步骤三：构建每日摘要系统

创建一个完整的 Daily Digest Skill：

```javascript
// skills/daily-digest/index.js
module.exports = {
  name: "daily-digest",
  description: "生成每日摘要报告",

  async execute(context) {
    const { agent, channel } = context;

    // 收集各来源数据
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

    // 组合摘要
    const digest = `
📅 **今日摘要 — ${new Date().toLocaleDateString('zh-TW')}**

🌤️ **天气**
${weather.summary}

📋 **今日日程**
${calendar.events.map(e => `- ${e.time} ${e.title}`).join('\n')}

✅ **待办事项**
${tasks.items.map(t => `- [ ] ${t.title}`).join('\n')}

📰 **科技新闻**
${news.articles.map(a => `- [${a.title}](${a.url})`).join('\n')}
    `;

    await channel.send(digest);

    return { success: true, itemCount: news.articles.length };
  }
};
```

### 步骤四：自动化监控系统

创建网站健康检查的自动化监控：

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

创建对应的监控 Skill：

```javascript
// skills/website-monitor/index.js
const https = require('https');

module.exports = {
  name: "website-monitor",
  description: "监控网站可用性",

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
            `🚨 **警报：网站异常**\n` +
            `URL: ${url}\n` +
            `错误: ${error.message}\n` +
            `连续失败: ${this.state.failureCounts[url]} 次`
          );
        }
      }
    }

    return { results };
  }
};
```

### 步骤五：进阶调度 — 链式任务

你可以将多个任务串联成工作流程：

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
              "subject": "本周报告"
            },
            "depends_on_previous": true
          }
        ]
      }
    ]
  }
}
```

## 常见错误

:::danger 调度执行但无消息送出
最常见的原因是 Agent 的 channel 连接已中断。请确认：
1. Discord/Matrix Bot 的 token 是否过期
2. channel ID 是否正确
3. Bot 是否仍在目标频道中

使用以下命令检查连接状态：
```bash
curl http://127.0.0.1:18789/api/channels
```
:::

:::caution Heartbeat 过于频繁
如果 `interval_minutes` 设得太低（例如 1 分钟），可能会：
- 造成 API rate limit
- 生成过多不必要的消息
- 增加 LLM API 费用

建议最低设为 5 分钟，一般场景设为 15-30 分钟。
:::

| 错误场景 | 原因 | 解决方案 |
|----------|------|---------|
| Cron job 没有执行 | 时区配置错误 | 确认 `timezone` 是否为 IANA 格式 |
| Heartbeat 消息重复 | 多个 Agent 实例同时运行 | 确保只有一个实例启用 Heartbeat |
| 调度延迟超过 1 分钟 | 系统负载过高或 event loop 阻塞 | 检查是否有同步阻塞的 Skill |
| Pipeline 中途失败 | 前置任务超时 | 为每个步骤配置 `timeout_ms` |

## 故障排除

### 检查调度状态

```bash
# 查看所有调度任务
curl http://127.0.0.1:18789/api/cron/jobs

# 查看特定任务的执行历史
curl http://127.0.0.1:18789/api/cron/jobs/daily-digest/history

# 手动触发调度任务（测试用）
curl -X POST http://127.0.0.1:18789/api/cron/jobs/daily-digest/trigger

# 查看 Heartbeat 状态
curl http://127.0.0.1:18789/api/heartbeat/status
```

### 调试日志

在 `settings.json` 中启用调度调试日志：

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

然后查看日志：

```bash
# 过滤调度相关日志
tail -f logs/openclaw.log | grep -E "(cron|heartbeat)"
```

## 练习题

### 练习 1：基础调度
配置一个 Cron Job，每天下午 5:00 (台湾时间) 发送今日工作总结。

### 练习 2：智慧提醒
利用 Heartbeat 机制，让 Agent 在检测到你的 Google Calendar 中有即将开始的会议（15 分钟前）时，主动提醒你。

### 练习 3：监控警报系统
构建一个完整的监控系统，监控 3 个 URL，每 5 分钟检查一次。当连续失败 3 次时发送 Discord 警报，恢复正常时也要发送通知。

## 随堂测验

1. **Cron 表达式 `0 */2 * * *` 代表什么意思？**
   - A) 每 2 秒执行
   - B) 每 2 分钟执行
   - C) 每 2 小时执行
   - D) 每 2 天执行

   <details><summary>查看答案</summary>C) 每 2 小时执行（在每小时的第 0 分钟，每隔 2 小时）</details>

2. **Heartbeat 和 Cron Job 的主要差异是什么？**
   - A) Heartbeat 更精确
   - B) Heartbeat 让 Agent 具有「主动意识」，可根据上下文决定是否移动
   - C) Cron Job 不能发送消息
   - D) 两者没有差异

   <details><summary>查看答案</summary>B) Heartbeat 机制允许 Agent 在调度触发时，根据当前场景自主判断是否需要移动，而非盲目执行。</details>

3. **为什么 Heartbeat 的 `interval_minutes` 不建议设为 1 分钟？**
   - A) 技术上不支援
   - B) 会导致 API rate limit、高费用和过量消息
   - C) 只支援 5 的倍数
   - D) 会造成安全问题

   <details><summary>查看答案</summary>B) 过于频繁的 Heartbeat 会触发 LLM API 的速率限制、大幅增加费用，并生成过多不必要的通知。</details>

4. **在 Pipeline 中，`depends_on_previous: true` 的作用是什么？**
   - A) 共用相同的调度时间
   - B) 前一步骤的输出作为下一步骤的输入，且前置失败时会中断
   - C) 强制在同一个 thread 中执行
   - D) 使用相同的 API key

   <details><summary>查看答案</summary>B) 这个配置确保任务按序执行，前一步骤的返回值可被下一步骤使用，且任何步骤失败会终止整个 pipeline。</details>

## 建议下一步

- [模块 7: 浏览器自动化与网页爬取](./module-07-browser) — 学习如何结合调度与网页爬取，构建价格监控等进阶自动化
- [模块 8: 多 Agent 架构](./module-08-multi-agent) — 了解如何在多 Agent 环境中协调调度任务
- [模块 10: 正式环境部署](./module-10-production) — 学习如何在 systemd 中管理调度服务的稳定性
