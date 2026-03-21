---
title: "Module 6: Cron Jobs / Heartbeat / Proactive Notifications"
sidebar_position: 7
description: "Learn how to configure OpenClaw scheduled tasks, Heartbeat proactive messaging, and build automated monitoring systems"
keywords: [OpenClaw, cron, heartbeat, automation, scheduling, notifications]
---

# Module 6: Cron Jobs / Heartbeat / Proactive Notifications

## Learning Objectives

By the end of this module, you will be able to:

- Understand the architecture and operation of OpenClaw's scheduling system
- Configure Cron Jobs for periodic tasks
- Enable the Heartbeat mechanism so the Agent can proactively send messages
- Build a Daily Digest automation workflow
- Design real-time monitoring and alerting systems
- Troubleshoot common scheduling issues

## Core Concepts

### Scheduling Architecture Overview

OpenClaw's automation architecture is built on two core mechanisms:

| Mechanism | Description | Use Cases |
|---|---|---|
| **Cron Jobs** | Timed tasks based on cron expressions | Periodic reports, data backups, scheduled cleanup |
| **Heartbeat** | Agent-initiated periodic behavior | Proactive greetings, status checks, real-time reminders |
| **Event Triggers** | Event-driven passive triggers | Webhook responses, message listeners, state changes |

### How Cron Jobs Work

OpenClaw's built-in Cron scheduler is based on the Node.js `node-cron` package and supports standard cron expressions:

```
┌────────── second (optional, 0-59)
│ ┌──────── minute (0-59)
│ │ ┌────── hour (0-23)
│ │ │ ┌──── day of month (1-31)
│ │ │ │ ┌── month (1-12)
│ │ │ │ │ ┌ day of week (0-7, both 0 and 7 are Sunday)
│ │ │ │ │ │
* * * * * *
```

### Heartbeat Mechanism

Heartbeat is a unique OpenClaw feature that allows the Agent to proactively send messages without user input. This is the key capability that transforms the Agent from a passive responder into a proactive assistant.

```
User ←── Heartbeat proactive message ←── Agent
                                          ↑
                                     Schedule trigger
                                     Event trigger
                                     State trigger
```

## Implementation Guide

### Step 1: Configure a Basic Cron Job

Enable scheduling in your `settings.json`:

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
        "timezone": "America/New_York"
      }
    ]
  }
}
```

:::tip Timezone Configuration
Always set the `timezone` field, otherwise OpenClaw defaults to UTC. US Eastern users should set it to `America/New_York`, or use `Asia/Taipei` for Taiwan.
:::

### Step 2: Enable Heartbeat

Add Heartbeat configuration to your `soul.md`:

```markdown
## Heartbeat Configuration

You have the ability to proactively send messages. Follow these rules:

- Send a daily agenda summary every morning at 9:00 AM
- Immediately notify when a monitored website experiences an anomaly
- Send a weekly report every Monday morning
- Do not send non-urgent messages between 10 PM and 7 AM
```

The corresponding `settings.json` Heartbeat section:

```json
{
  "heartbeat": {
    "enabled": true,
    "interval_minutes": 15,
    "idle_triggers": {
      "morning_greeting": {
        "time": "09:00",
        "timezone": "America/New_York",
        "prompt": "Check today's calendar and send a summary"
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

### Step 3: Build a Daily Digest System

Create a complete Daily Digest Skill:

```javascript
// skills/daily-digest/index.js
module.exports = {
  name: "daily-digest",
  description: "Generate a daily summary report",

  async execute(context) {
    const { agent, channel } = context;

    // Collect data from various sources
    const weather = await agent.callSkill("weather", {
      city: "New York"
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

    // Compose the digest
    const digest = `
**Daily Digest — ${new Date().toLocaleDateString('en-US')}**

**Weather**
${weather.summary}

**Today's Schedule**
${calendar.events.map(e => `- ${e.time} ${e.title}`).join('\n')}

**To-Do Items**
${tasks.items.map(t => `- [ ] ${t.title}`).join('\n')}

**Tech News**
${news.articles.map(a => `- [${a.title}](${a.url})`).join('\n')}
    `;

    await channel.send(digest);

    return { success: true, itemCount: news.articles.length };
  }
};
```

### Step 4: Automated Monitoring System

Build an automated website health check monitor:

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

Create the corresponding monitoring Skill:

```javascript
// skills/website-monitor/index.js
const https = require('https');

module.exports = {
  name: "website-monitor",
  description: "Monitor website availability",

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
            `**ALERT: Website Down**\n` +
            `URL: ${url}\n` +
            `Error: ${error.message}\n` +
            `Consecutive failures: ${this.state.failureCounts[url]}`
          );
        }
      }
    }

    return { results };
  }
};
```

### Step 5: Advanced Scheduling -- Chained Tasks

You can chain multiple tasks into a pipeline workflow:

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
              "subject": "Weekly Report"
            },
            "depends_on_previous": true
          }
        ]
      }
    ]
  }
}
```

## Common Errors

:::danger Scheduled Job Runs But No Messages Are Sent
The most common cause is a disconnected Agent channel. Verify:
1. Whether your Discord/Matrix Bot token has expired
2. Whether the channel ID is correct
3. Whether the Bot is still present in the target channel

Use this command to check connection status:
```bash
curl http://127.0.0.1:18789/api/channels
```
:::

:::caution Heartbeat Too Frequent
If `interval_minutes` is set too low (e.g., 1 minute), it may:
- Cause API rate limits
- Generate excessive unnecessary messages
- Significantly increase LLM API costs

Recommended minimum is 5 minutes; 15-30 minutes is typical for most use cases.
:::

| Error Scenario | Cause | Solution |
|---|---|---|
| Cron job not executing | Timezone misconfigured | Confirm `timezone` uses IANA format |
| Duplicate Heartbeat messages | Multiple Agent instances running | Ensure only one instance has Heartbeat enabled |
| Schedule delayed by over 1 minute | High system load or event loop blocking | Check for synchronous blocking Skills |
| Pipeline fails midway | Preceding task timed out | Set `timeout_ms` for each step |

## Troubleshooting

### Check Schedule Status

```bash
# View all scheduled tasks
curl http://127.0.0.1:18789/api/cron/jobs

# View execution history for a specific task
curl http://127.0.0.1:18789/api/cron/jobs/daily-digest/history

# Manually trigger a scheduled task (for testing)
curl -X POST http://127.0.0.1:18789/api/cron/jobs/daily-digest/trigger

# Check Heartbeat status
curl http://127.0.0.1:18789/api/heartbeat/status
```

### Debug Logging

Enable scheduling debug logs in `settings.json`:

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

Then view the logs:

```bash
# Filter for scheduling-related logs
tail -f logs/openclaw.log | grep -E "(cron|heartbeat)"
```

## Exercises

### Exercise 1: Basic Scheduling
Set up a Cron Job that sends a daily work summary every day at 5:00 PM (your local time).

### Exercise 2: Smart Reminders
Use the Heartbeat mechanism to have the Agent proactively remind you when a Google Calendar event is about to start (15 minutes before).

### Exercise 3: Monitoring Alert System
Build a complete monitoring system that monitors 3 URLs every 5 minutes. Send a Discord alert when 3 consecutive failures occur, and also send a notification when service recovers.

## Quiz

1. **What does the cron expression `0 */2 * * *` mean?**
   - A) Run every 2 seconds
   - B) Run every 2 minutes
   - C) Run every 2 hours
   - D) Run every 2 days

   <details><summary>View Answer</summary>C) Runs every 2 hours (at minute 0, every 2 hours)</details>

2. **What is the key difference between Heartbeat and Cron Jobs?**
   - A) Heartbeat is more precise
   - B) Heartbeat gives the Agent "proactive awareness," allowing it to decide contextually whether to act
   - C) Cron Jobs cannot send messages
   - D) There is no difference

   <details><summary>View Answer</summary>B) The Heartbeat mechanism allows the Agent to autonomously judge whether action is needed based on the current context when triggered, rather than blindly executing.</details>

3. **Why is it not recommended to set Heartbeat `interval_minutes` to 1 minute?**
   - A) Not technically supported
   - B) Causes API rate limits, high costs, and excessive messages
   - C) Only multiples of 5 are supported
   - D) It would cause security issues

   <details><summary>View Answer</summary>B) An overly frequent Heartbeat will trigger LLM API rate limits, significantly increase costs, and generate too many unnecessary notifications.</details>

4. **What does `depends_on_previous: true` do in a Pipeline?**
   - A) Share the same schedule time
   - B) The previous step's output becomes the next step's input, and a failure in any preceding step aborts the pipeline
   - C) Force execution in the same thread
   - D) Use the same API key

   <details><summary>View Answer</summary>B) This setting ensures sequential execution where the return value of each step is available to the next, and any step failure terminates the entire pipeline.</details>

## Next Steps

- [Module 7: Browser Automation & Web Scraping](./module-07-browser) -- Learn how to combine scheduling with web scraping for advanced automation like price monitoring
- [Module 8: Multi-Agent Architecture](./module-08-multi-agent) -- Understand how to coordinate scheduled tasks in a multi-Agent environment
- [Module 10: Production Deployment](./module-10-production) -- Learn how to manage scheduling service reliability with systemd
