---
title: "模块 11: 语音交互 & Live Canvas"
sidebar_position: 12
description: "学习 OpenClaw 的语音交互（Vapi 集成）、Live Canvas 视觉回馈系统，以及 Companion App Beta (macOS)"
keywords: [OpenClaw, voice, Vapi, Live Canvas, Companion App, 语音, 语音助手, macOS]
---

# 模块 11: 语音交互 & Live Canvas

## 学习目标

完成本模块后，你将能够：

- 理解 OpenClaw 语音交互的架构与 Vapi 集成原理
- 配置语音输入与输出功能
- 使用 Live Canvas 提供视觉回馈
- 安装并使用 Companion App Beta（macOS menubar 应用进程）
- 构建一个完整的语音控制 Agent
- 结合语音、视觉、文字多模态交互

## 核心概念

### 语音交互架构

OpenClaw 的语音功能透过 Vapi（Voice API）平台集成，实现低延迟的语音对话：

```
用户语音
    │
    ▼
┌──────────┐    WebSocket     ┌──────────┐
│ 麦克风   │ ──────────────→  │   Vapi   │
│ (STT)    │                  │  平台    │
└──────────┘                  └────┬─────┘
                                   │ 文字转换
                                   ▼
                            ┌──────────────┐
                            │   OpenClaw    │
                            │   Agent      │
                            │   (LLM 处理) │
                            └──────┬───────┘
                                   │ 响应文字
                                   ▼
┌──────────┐    Audio Stream  ┌──────────┐
│ 喇叭     │ ←────────────── │   Vapi   │
│ (TTS)    │                  │  (语音合成)│
└──────────┘                  └──────────┘
```

### 关键组件

| 组件 | 功能 | 技术 |
|------|------|------|
| **Vapi** | 语音对话平台 | WebSocket, WebRTC |
| **STT (Speech-to-Text)** | 语音转文字 | Deepgram / Whisper |
| **TTS (Text-to-Speech)** | 文字转语音 | ElevenLabs / Azure |
| **Live Canvas** | 实时视觉回馈 | HTML5 Canvas / WebSocket |
| **Companion App** | macOS 系统列应用 | Electron / Swift |

### Live Canvas 概念

Live Canvas 是 OpenClaw 的实时视觉回馈系统，让 Agent 可以「画」出响应而非只用文字。典型应用场景：

- 实时绘制图表和数据可视化
- 显示搜索结果的预览卡片
- 呈现代码执行的实时输出
- 交互式 UI 组件（按钮、表单）
- 地图标记与导航路线

```
Agent 响应
    │
    ├─→ 文字频道（Discord/Matrix）：文字响应
    │
    ├─→ 语音频道（Vapi）：语音响应
    │
    └─→ Live Canvas：视觉回馈
         ├── 图表
         ├── 代码
         ├── 图片
         └── 交互组件
```

### Companion App Beta

Companion App 是 OpenClaw 的 macOS menubar 应用进程（Beta 阶段），提供：

- 系统列快速存取 Agent
- 全局快捷键呼出对话框
- Live Canvas 桌面端渲染
- 语音交互集成
- 通知中心集成

## 实现教程

### 步骤一：Vapi 账号配置

```bash
# 1. 前往 https://vapi.ai 注册账号
# 2. 获取 API Key
# 3. 创建 Assistant（对应到 OpenClaw Agent）
```

在 Vapi Dashboard 中创建 Assistant 配置：

```json
{
  "name": "OpenClaw Voice Assistant",
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "zh-TW"
  },
  "voice": {
    "provider": "elevenlabs",
    "voiceId": "your-voice-id",
    "stability": 0.5,
    "similarityBoost": 0.75
  },
  "model": {
    "provider": "custom-llm",
    "url": "https://your-server/api/vapi/webhook",
    "model": "openclaw-agent"
  },
  "silenceTimeoutSeconds": 30,
  "maxDurationSeconds": 600,
  "firstMessage": "你好！我是你的 OpenClaw 语音助手，有什么我可以帮忙的吗？"
}
```

### 步骤二：OpenClaw 语音配置

在 `settings.json` 中加入 Vapi 集成：

```json
{
  "voice": {
    "enabled": true,
    "provider": "vapi",
    "vapi": {
      "api_key": "${VAPI_API_KEY}",
      "assistant_id": "${VAPI_ASSISTANT_ID}",
      "webhook_path": "/api/vapi/webhook",
      "language": "zh-TW",
      "voice_settings": {
        "speed": 1.0,
        "pitch": 1.0
      }
    },
    "wake_word": {
      "enabled": true,
      "phrase": "嘿 OpenClaw",
      "sensitivity": 0.7
    },
    "auto_listen": {
      "enabled": false,
      "timeout_seconds": 30
    }
  }
}
```

### 步骤三：创建 Vapi Webhook 处理器

OpenClaw 需要一个 webhook endpoint 来接收 Vapi 的语音转文字结果：

```javascript
// skills/vapi-handler/index.js
module.exports = {
  name: "vapi-handler",
  description: "处理 Vapi 语音 webhook",

  // Vapi 会发送 POST 请求到这个 endpoint
  async handleWebhook(request, context) {
    const { type, message } = request.body;

    switch (type) {
      case 'assistant-request':
        // Vapi 正在请求 Agent 的响应
        return {
          assistant: {
            firstMessage: "你好！有什么可以帮忙的吗？",
            model: {
              provider: "custom-llm",
              messages: context.agent.getConversationHistory()
            }
          }
        };

      case 'function-call':
        // 语音中触发了 Skill 呼叫
        const { functionName, parameters } = message;
        const result = await context.agent.callSkill(
          functionName,
          parameters
        );
        return { result: JSON.stringify(result) };

      case 'end-of-call-report':
        // 通话结束报告
        const { duration, transcript } = message;
        await context.agent.saveToMemory({
          type: 'voice_conversation',
          duration,
          transcript,
          timestamp: new Date().toISOString()
        });
        return { received: true };

      default:
        return { received: true };
    }
  }
};
```

### 步骤四：配置 Live Canvas

启用 Live Canvas 视觉回馈：

```json
{
  "canvas": {
    "enabled": true,
    "port": 3001,
    "host": "127.0.0.1",
    "features": {
      "charts": true,
      "code_preview": true,
      "image_display": true,
      "interactive_widgets": true,
      "markdown_render": true
    },
    "theme": {
      "mode": "auto",
      "primary_color": "#6366f1"
    }
  }
}
```

在 Skill 中使用 Live Canvas：

```javascript
// 在 Skill 中向 Canvas 推送视觉内容
module.exports = {
  name: "weather-visual",
  description: "显示天气可视化信息",

  async execute(context) {
    const { canvas, params } = context;
    const weatherData = await fetchWeather(params.city);

    // 推送图表到 Canvas
    await canvas.render({
      type: 'chart',
      chart: {
        type: 'line',
        data: {
          labels: weatherData.hourly.map(h => h.time),
          datasets: [{
            label: '温度 (°C)',
            data: weatherData.hourly.map(h => h.temp),
            borderColor: '#ef4444',
            tension: 0.4
          }, {
            label: '降雨机率 (%)',
            data: weatherData.hourly.map(h => h.rain_prob),
            borderColor: '#3b82f6',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `${params.city} — 今日天气预报`
            }
          }
        }
      }
    });

    // 同时推送摘要卡片
    await canvas.render({
      type: 'card',
      card: {
        title: `${params.city} 天气`,
        subtitle: weatherData.summary,
        icon: weatherData.icon,
        fields: [
          { label: '目前温度', value: `${weatherData.current.temp}°C` },
          { label: '体感温度', value: `${weatherData.current.feels_like}°C` },
          { label: '湿度', value: `${weatherData.current.humidity}%` },
          { label: '风速', value: `${weatherData.current.wind_speed} m/s` }
        ]
      }
    });

    return {
      text: `${params.city}目前气温 ${weatherData.current.temp}°C，${weatherData.summary}`,
      canvas_rendered: true
    };
  }
};
```

### 步骤五：安装 Companion App Beta

```bash
# 下载 Companion App（macOS）
curl -L -o OpenClaw-Companion.dmg \
  https://github.com/openclaw/companion-app/releases/latest/download/OpenClaw-Companion-macOS.dmg

# 安装
hdiutil attach OpenClaw-Companion.dmg
cp -R "/Volumes/OpenClaw Companion/OpenClaw Companion.app" /Applications/
hdiutil detach "/Volumes/OpenClaw Companion"

# 启动
open "/Applications/OpenClaw Companion.app"
```

Companion App 配置：

```json
{
  "openclaw_url": "http://127.0.0.1:18789",
  "api_key": "${OPENCLAW_API_KEY}",
  "hotkey": "Cmd+Shift+Space",
  "voice": {
    "enabled": true,
    "push_to_talk_key": "Cmd+Shift+V"
  },
  "canvas": {
    "enabled": true,
    "position": "right",
    "width": 400
  },
  "notifications": {
    "enabled": true,
    "heartbeat_messages": true,
    "alert_messages": true,
    "sound": true
  },
  "appearance": {
    "theme": "auto",
    "menubar_icon": "default",
    "show_in_dock": false
  }
}
```

:::caution Companion App Beta 限制
Companion App 目前处于 Beta 阶段，已知限制：
- 仅支援 macOS 12.0 (Monterey) 以上
- 语音功能需要授予麦克风权限
- Live Canvas 的复杂图表可能有渲染延迟
- 不支援多 Agent 切换（计划中）
- 偶尔的内存泄漏问题（建议每天重启一次）
:::

### 步骤六：构建语音控制 Agent

集成语音、Canvas、Skills 的完整示例：

在 `soul.md` 中配置语音交互规则：

```markdown
# 语音交互助手

你是一个支援语音对话的 AI 助手。

## 语音响应规则
- 响应保持简洁，语音不超过 30 秒
- 使用口语化的简体中文
- 数字和清单用 Live Canvas 呈现，语音只说摘要
- 如果用户说「显示给我看」，使用 Canvas 呈现详细内容
- 如果用户说「重复一次」，重新语音播报上一个响应

## 语音命令
- 「查天气」→ 显示天气 + Canvas 图表
- 「念新闻」→ 语音播报今日头条
- 「记一下」→ 将后续内容存入记忆
- 「开始计时」→ 启动计时器
- 「静音」→ 暂停语音输出，只用文字和 Canvas
```

### 步骤七：多模态交互示例

```javascript
// skills/multimodal-assistant/index.js
module.exports = {
  name: "multimodal-assistant",
  description: "多模态交互助手",

  async execute(context) {
    const { agent, canvas, voice, channel, params } = context;
    const query = params.query;

    // 根据查询类型决定最佳响应模态
    const queryType = await agent.classify(query, [
      'data_visualization',   // 用 Canvas
      'short_answer',         // 用语音
      'long_content',         // 用文字
      'interactive'           // 用 Canvas 交互组件
    ]);

    switch (queryType) {
      case 'data_visualization':
        // 语音说摘要，Canvas 显示图表
        const data = await agent.callSkill('data-fetcher', params);
        await voice.speak(`数据已获取，正在为你绘制图表。`);
        await canvas.render({
          type: 'chart',
          chart: data.visualization
        });
        break;

      case 'short_answer':
        // 纯语音响应
        const answer = await agent.think(query);
        await voice.speak(answer);
        break;

      case 'long_content':
        // 语音说摘要，Canvas 显示完整内容
        const content = await agent.think(query);
        const summary = await agent.summarize(content, { maxWords: 50 });
        await voice.speak(summary);
        await canvas.render({
          type: 'markdown',
          content: content
        });
        break;

      case 'interactive':
        // Canvas 显示交互组件
        await voice.speak(`好的，我已经准备好交互接口了。`);
        await canvas.render({
          type: 'form',
          fields: params.form_fields,
          onSubmit: 'handle_form_submission'
        });
        break;
    }

    return { mode: queryType };
  }
};
```

## 常见错误

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 语音延迟超过 3 秒 | Vapi STT/TTS 处理时间 | 选择较快的 STT 模型（如 Deepgram nova-2） |
| 中文语音辨识错误率高 | 模型不支援或语言配置错误 | 确认 `language` 为 `zh-TW` |
| Canvas 内容不显示 | WebSocket 连接失败 | 确认 Canvas port 正确且未被防火墙阻挡 |
| Companion App 无法连接 | API URL 或 Key 错误 | 检查 `openclaw_url` 和 API Key |
| Wake word 误触发 | 灵敏度设太高 | 降低 `sensitivity` 至 0.5 |

:::tip 降低语音延迟
语音交互的体验取决于端到端延迟。优化建议：
1. STT 使用 Deepgram（延迟最低，约 300ms）
2. LLM 使用流式模式（streaming response）
3. TTS 使用 ElevenLabs Turbo（延迟约 500ms）
4. 整体目标延迟：< 2 秒
:::

## 故障排除

```bash
# 检查 Vapi 连接状态
curl -s http://127.0.0.1:18789/api/voice/status

# 检查 Canvas WebSocket
curl -s http://127.0.0.1:3001/health

# 测试语音 webhook
curl -X POST http://127.0.0.1:18789/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "assistant-request"}'

# Companion App 日志
tail -f ~/Library/Logs/OpenClaw\ Companion/main.log
```

## 练习题

### 练习 1：语音天气助手
配置一个语音控制的天气助手，说「查天气」时语音回报天气摘要，并在 Canvas 显示温度趋势图。

### 练习 2：语音备忘录
构建一个语音备忘录 Agent：
- 说「记一下：[内容]」存入记忆
- 说「今天记了什么」列出所有备忘
- 用 Canvas 显示备忘清单，用语音播报数量

### 练习 3：会议助手
构建一个会议语音助手：
- 实时语音转录（STT）
- Canvas 显示实时逐字稿
- 会议结束后自动生成摘要
- 辨识并标记 action items

## 随堂测验

1. **Vapi 在 OpenClaw 语音架构中的角色是什么？**
   - A) 直接运行 LLM
   - B) 提供 STT/TTS 服务并桥接语音与 Agent
   - C) 存储语音记录
   - D) 管理 Agent 调度

   <details><summary>查看答案</summary>B) Vapi 负责将语音转为文字（STT）、将 Agent 的文字响应转为语音（TTS），并透过 WebSocket 管理实时语音流式。</details>

2. **Live Canvas 最适合用来呈现什么内容？**
   - A) 短句回答
   - B) 图表、数据可视化、交互组件等视觉内容
   - C) 纯文字对话
   - D) 系统配置

   <details><summary>查看答案</summary>B) Live Canvas 的优势在于实时渲染视觉内容，适合图表、预览卡片、交互表单等纯文字或语音无法有效传达的信息。</details>

3. **Companion App Beta 目前支援哪个平台？**
   - A) Windows 和 macOS
   - B) 仅 macOS
   - C) 仅 Linux
   - D) 全平台

   <details><summary>查看答案</summary>B) Companion App Beta 目前仅支援 macOS 12.0 (Monterey) 以上版本。Windows 和 Linux 版本尚在开发中。</details>

4. **如何降低语音交互的端到端延迟？**
   - A) 使用较大的 LLM 模型
   - B) 使用 Deepgram (STT) + 流式响应 (LLM) + ElevenLabs Turbo (TTS)
   - C) 增加 Vapi 的 timeout 配置
   - D) 关闭 Canvas

   <details><summary>查看答案</summary>B) 选择低延迟的 STT（Deepgram nova-2, ~300ms）、启用 LLM streaming、使用快速 TTS（ElevenLabs Turbo, ~500ms）可将整体延迟控制在 2 秒内。</details>

## 建议下一步

- [模块 5: 记忆系统](./module-05-memory) — 让语音对话的记忆持久化
- [模块 6: Cron Jobs / Heartbeat](./module-06-automation) — 配置语音 Agent 的主动语音提醒
- [模块 12: 企业级应用](./module-12-enterprise) — 企业环境中的语音助手部署
