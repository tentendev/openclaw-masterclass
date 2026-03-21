---
title: "Module 11: Voice Interaction & Live Canvas"
sidebar_position: 12
description: "Learn about OpenClaw's voice interaction (Vapi integration), the Live Canvas visual feedback system, and the Companion App Beta (macOS)"
keywords: [OpenClaw, voice, Vapi, Live Canvas, Companion App, voice assistant, macOS]
---

# Module 11: Voice Interaction & Live Canvas

## Learning Objectives

By the end of this module, you will be able to:

- Understand OpenClaw's voice interaction architecture and Vapi integration
- Configure voice input and output capabilities
- Use Live Canvas for visual feedback
- Install and use the Companion App Beta (macOS menubar application)
- Build a complete voice-controlled Agent
- Combine voice, visual, and text for multimodal interaction

## Core Concepts

### Voice Interaction Architecture

OpenClaw's voice capabilities are integrated through the Vapi (Voice API) platform, delivering low-latency voice conversations:

```
User's Voice
    │
    ▼
┌──────────┐    WebSocket     ┌──────────┐
│ Micro-   │ ──────────────→  │   Vapi   │
│ phone    │                  │ Platform │
│ (STT)    │                  └────┬─────┘
└──────────┘                       │ Text conversion
                                   ▼
                            ┌──────────────┐
                            │   OpenClaw    │
                            │   Agent      │
                            │   (LLM)     │
                            └──────┬───────┘
                                   │ Response text
                                   ▼
┌──────────┐    Audio Stream  ┌──────────┐
│ Speaker  │ ←────────────── │   Vapi   │
│ (TTS)    │                  │  (Speech │
└──────────┘                  │ synthesis)│
                              └──────────┘
```

### Key Components

| Component | Function | Technology |
|---|---|---|
| **Vapi** | Voice conversation platform | WebSocket, WebRTC |
| **STT (Speech-to-Text)** | Converts speech to text | Deepgram / Whisper |
| **TTS (Text-to-Speech)** | Converts text to speech | ElevenLabs / Azure |
| **Live Canvas** | Real-time visual feedback | HTML5 Canvas / WebSocket |
| **Companion App** | macOS menubar application | Electron / Swift |

### Live Canvas Concept

Live Canvas is OpenClaw's real-time visual feedback system, allowing the Agent to "draw" responses rather than relying on text alone. Typical use cases:

- Real-time chart and data visualization rendering
- Search result preview cards
- Live code execution output
- Interactive UI components (buttons, forms)
- Map markers and navigation routes

```
Agent Response
    │
    ├─→ Text channel (Discord/Matrix): Text response
    │
    ├─→ Voice channel (Vapi): Voice response
    │
    └─→ Live Canvas: Visual feedback
         ├── Charts
         ├── Code
         ├── Images
         └── Interactive widgets
```

### Companion App Beta

The Companion App is an OpenClaw macOS menubar application (Beta stage) that provides:

- Quick Agent access from the system tray
- Global hotkey to invoke the conversation window
- Desktop-side Live Canvas rendering
- Voice interaction integration
- Notification center integration

## Implementation Guide

### Step 1: Vapi Account Setup

```bash
# 1. Go to https://vapi.ai and create an account
# 2. Obtain your API Key
# 3. Create an Assistant (corresponding to your OpenClaw Agent)
```

Create the Assistant configuration in the Vapi Dashboard:

```json
{
  "name": "OpenClaw Voice Assistant",
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en"
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
  "firstMessage": "Hello! I'm your OpenClaw voice assistant. How can I help you?"
}
```

### Step 2: OpenClaw Voice Configuration

Add Vapi integration to `settings.json`:

```json
{
  "voice": {
    "enabled": true,
    "provider": "vapi",
    "vapi": {
      "api_key": "${VAPI_API_KEY}",
      "assistant_id": "${VAPI_ASSISTANT_ID}",
      "webhook_path": "/api/vapi/webhook",
      "language": "en",
      "voice_settings": {
        "speed": 1.0,
        "pitch": 1.0
      }
    },
    "wake_word": {
      "enabled": true,
      "phrase": "Hey OpenClaw",
      "sensitivity": 0.7
    },
    "auto_listen": {
      "enabled": false,
      "timeout_seconds": 30
    }
  }
}
```

### Step 3: Build the Vapi Webhook Handler

OpenClaw needs a webhook endpoint to receive Vapi's speech-to-text results:

```javascript
// skills/vapi-handler/index.js
module.exports = {
  name: "vapi-handler",
  description: "Handle Vapi voice webhooks",

  // Vapi sends POST requests to this endpoint
  async handleWebhook(request, context) {
    const { type, message } = request.body;

    switch (type) {
      case 'assistant-request':
        // Vapi is requesting the Agent's response
        return {
          assistant: {
            firstMessage: "Hello! How can I help?",
            model: {
              provider: "custom-llm",
              messages: context.agent.getConversationHistory()
            }
          }
        };

      case 'function-call':
        // A Skill call was triggered via voice
        const { functionName, parameters } = message;
        const result = await context.agent.callSkill(
          functionName,
          parameters
        );
        return { result: JSON.stringify(result) };

      case 'end-of-call-report':
        // Call ended report
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

### Step 4: Configure Live Canvas

Enable Live Canvas visual feedback:

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

Using Live Canvas from within a Skill:

```javascript
// Push visual content to the Canvas from within a Skill
module.exports = {
  name: "weather-visual",
  description: "Display weather visualization",

  async execute(context) {
    const { canvas, params } = context;
    const weatherData = await fetchWeather(params.city);

    // Push a chart to Canvas
    await canvas.render({
      type: 'chart',
      chart: {
        type: 'line',
        data: {
          labels: weatherData.hourly.map(h => h.time),
          datasets: [{
            label: 'Temperature (°C)',
            data: weatherData.hourly.map(h => h.temp),
            borderColor: '#ef4444',
            tension: 0.4
          }, {
            label: 'Rain Probability (%)',
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
              text: `${params.city} — Today's Weather Forecast`
            }
          }
        }
      }
    });

    // Also push a summary card
    await canvas.render({
      type: 'card',
      card: {
        title: `${params.city} Weather`,
        subtitle: weatherData.summary,
        icon: weatherData.icon,
        fields: [
          { label: 'Current Temp', value: `${weatherData.current.temp}°C` },
          { label: 'Feels Like', value: `${weatherData.current.feels_like}°C` },
          { label: 'Humidity', value: `${weatherData.current.humidity}%` },
          { label: 'Wind Speed', value: `${weatherData.current.wind_speed} m/s` }
        ]
      }
    });

    return {
      text: `Current temperature in ${params.city} is ${weatherData.current.temp}°C. ${weatherData.summary}`,
      canvas_rendered: true
    };
  }
};
```

### Step 5: Install the Companion App Beta

```bash
# Download the Companion App (macOS)
curl -L -o OpenClaw-Companion.dmg \
  https://github.com/openclaw/companion-app/releases/latest/download/OpenClaw-Companion-macOS.dmg

# Install
hdiutil attach OpenClaw-Companion.dmg
cp -R "/Volumes/OpenClaw Companion/OpenClaw Companion.app" /Applications/
hdiutil detach "/Volumes/OpenClaw Companion"

# Launch
open "/Applications/OpenClaw Companion.app"
```

Companion App configuration:

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

:::caution Companion App Beta Limitations
The Companion App is currently in Beta with the following known limitations:
- Only supports macOS 12.0 (Monterey) and above
- Voice features require microphone permission
- Complex charts on Live Canvas may have rendering delays
- Multi-Agent switching is not yet supported (planned)
- Occasional memory leak issues (recommended to restart daily)
:::

### Step 6: Build a Voice-Controlled Agent

Integrate voice, Canvas, and Skills into a complete example.

Set voice interaction rules in `soul.md`:

```markdown
# Voice Interaction Assistant

You are an AI assistant that supports voice conversations.

## Voice Response Rules
- Keep responses concise; voice should not exceed 30 seconds
- Use conversational English
- Present numbers and lists on Live Canvas; voice only provides the summary
- If the user says "show me," use Canvas to present detailed content
- If the user says "repeat that," replay the previous response via voice

## Voice Commands
- "Check the weather" → Display weather + Canvas chart
- "Read the news" → Voice-read today's headlines
- "Make a note" → Save subsequent content to memory
- "Start a timer" → Start a timer
- "Mute" → Pause voice output; use only text and Canvas
```

### Step 7: Multimodal Interaction Example

```javascript
// skills/multimodal-assistant/index.js
module.exports = {
  name: "multimodal-assistant",
  description: "Multimodal interaction assistant",

  async execute(context) {
    const { agent, canvas, voice, channel, params } = context;
    const query = params.query;

    // Determine the best response modality based on query type
    const queryType = await agent.classify(query, [
      'data_visualization',   // Use Canvas
      'short_answer',         // Use voice
      'long_content',         // Use text
      'interactive'           // Use Canvas interactive widgets
    ]);

    switch (queryType) {
      case 'data_visualization':
        // Voice provides the summary, Canvas displays the chart
        const data = await agent.callSkill('data-fetcher', params);
        await voice.speak(`Data retrieved. Generating your chart now.`);
        await canvas.render({
          type: 'chart',
          chart: data.visualization
        });
        break;

      case 'short_answer':
        // Voice-only response
        const answer = await agent.think(query);
        await voice.speak(answer);
        break;

      case 'long_content':
        // Voice provides summary, Canvas displays full content
        const content = await agent.think(query);
        const summary = await agent.summarize(content, { maxWords: 50 });
        await voice.speak(summary);
        await canvas.render({
          type: 'markdown',
          content: content
        });
        break;

      case 'interactive':
        // Canvas displays interactive widgets
        await voice.speak(`Got it. I've prepared the interactive form for you.`);
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

## Common Errors

| Issue | Cause | Solution |
|---|---|---|
| Voice latency exceeds 3 seconds | Vapi STT/TTS processing time | Choose a faster STT model (e.g., Deepgram nova-2) |
| High speech recognition error rate | Model doesn't support the language or wrong language setting | Confirm `language` is set correctly (e.g., `en`) |
| Canvas content not displaying | WebSocket connection failed | Verify the Canvas port is correct and not blocked by a firewall |
| Companion App can't connect | Wrong API URL or Key | Check `openclaw_url` and API Key |
| Wake word false triggers | Sensitivity set too high | Lower `sensitivity` to 0.5 |

:::tip Reducing Voice Latency
Voice interaction experience depends on end-to-end latency. Optimization tips:
1. Use Deepgram for STT (lowest latency, ~300ms)
2. Enable streaming mode for LLM responses
3. Use ElevenLabs Turbo for TTS (~500ms latency)
4. Target overall latency: < 2 seconds
:::

## Troubleshooting

```bash
# Check Vapi connection status
curl -s http://127.0.0.1:18789/api/voice/status

# Check Canvas WebSocket
curl -s http://127.0.0.1:3001/health

# Test the voice webhook
curl -X POST http://127.0.0.1:18789/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "assistant-request"}'

# Companion App logs
tail -f ~/Library/Logs/OpenClaw\ Companion/main.log
```

## Exercises

### Exercise 1: Voice Weather Assistant
Set up a voice-controlled weather assistant. When you say "check the weather," the Agent provides a voice summary and displays a temperature trend chart on Canvas.

### Exercise 2: Voice Memo
Build a voice memo Agent:
- Say "make a note: [content]" to save to memory
- Say "what did I note today" to list all memos
- Use Canvas to display the memo list, voice to report the count

### Exercise 3: Meeting Assistant
Build a meeting voice assistant:
- Real-time speech-to-text (STT)
- Canvas displays a live transcript
- Auto-generate a summary when the meeting ends
- Identify and tag action items

## Quiz

1. **What role does Vapi play in OpenClaw's voice architecture?**
   - A) Directly runs the LLM
   - B) Provides STT/TTS services and bridges voice with the Agent
   - C) Stores voice recordings
   - D) Manages Agent scheduling

   <details><summary>View Answer</summary>B) Vapi handles converting speech to text (STT), converting the Agent's text responses to speech (TTS), and managing real-time voice streaming via WebSocket.</details>

2. **What type of content is Live Canvas best suited for?**
   - A) Short text answers
   - B) Charts, data visualizations, and interactive widgets
   - C) Plain text conversations
   - D) System settings

   <details><summary>View Answer</summary>B) Live Canvas excels at real-time rendering of visual content, ideal for charts, preview cards, interactive forms, and other information that pure text or voice cannot effectively convey.</details>

3. **Which platform does the Companion App Beta currently support?**
   - A) Windows and macOS
   - B) macOS only
   - C) Linux only
   - D) All platforms

   <details><summary>View Answer</summary>B) The Companion App Beta currently only supports macOS 12.0 (Monterey) and above. Windows and Linux versions are still in development.</details>

4. **How do you reduce end-to-end voice interaction latency?**
   - A) Use a larger LLM model
   - B) Use Deepgram (STT) + streaming responses (LLM) + ElevenLabs Turbo (TTS)
   - C) Increase Vapi's timeout setting
   - D) Disable Canvas

   <details><summary>View Answer</summary>B) Choosing low-latency STT (Deepgram nova-2, ~300ms), enabling LLM streaming, and using fast TTS (ElevenLabs Turbo, ~500ms) can keep overall latency under 2 seconds.</details>

## Next Steps

- [Module 5: Memory System](./module-05-memory) -- Persist voice conversation memories
- [Module 6: Cron Jobs / Heartbeat](./module-06-automation) -- Set up proactive voice reminders for your Agent
- [Module 12: Enterprise Applications](./module-12-enterprise) -- Deploy voice assistants in enterprise environments
