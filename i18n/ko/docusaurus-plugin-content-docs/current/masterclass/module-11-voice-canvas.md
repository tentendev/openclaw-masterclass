---
title: "모듈 11: 음성 인터랙션 & Live Canvas"
sidebar_position: 12
description: "OpenClaw의 음성 인터랙션(Vapi 통합), Live Canvas 시각적 피드백 시스템 및 Companion App Beta(macOS) 학습"
---

# 模組 11: 語音互動 & Live Canvas

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- 理解 OpenClaw 語音互動的架構與 Vapi 整合原理
- 설정語音輸入與輸出功能
- 使用 Live Canvas 提供視覺回饋
- 설치並使用 Companion App Beta（macOS menubar 應用程式）
- 建構一個完整的語音控制 Agent
- 結合語音、視覺、文字多模態互動

## 핵심 개념

### 語音互動架構

OpenClaw 的語音功能透過 Vapi（Voice API）平台整合，實現低지연的語音對話：

```
사용자語音
    │
    ▼
┌──────────┐    WebSocket     ┌──────────┐
│ 麥克風   │ ──────────────→  │   Vapi   │
│ (STT)    │                  │  平台    │
└──────────┘                  └────┬─────┘
                                   │ 文字轉換
                                   ▼
                            ┌──────────────┐
                            │   OpenClaw    │
                            │   Agent      │
                            │   (LLM 處理) │
                            └──────┬───────┘
                                   │ 回應文字
                                   ▼
┌──────────┐    Audio Stream  ┌──────────┐
│ 喇叭     │ ←────────────── │   Vapi   │
│ (TTS)    │                  │  (語音合成)│
└──────────┘                  └──────────┘
```

### 關鍵元件

| 元件 | 功能 | 技術 |
|------|------|------|
| **Vapi** | 語音對話平台 | WebSocket, WebRTC |
| **STT (Speech-to-Text)** | 語音轉文字 | Deepgram / Whisper |
| **TTS (Text-to-Speech)** | 文字轉語音 | ElevenLabs / Azure |
| **Live Canvas** | 即時視覺回饋 | HTML5 Canvas / WebSocket |
| **Companion App** | macOS 系統列應用 | Electron / Swift |

### Live Canvas 概念

Live Canvas 是 OpenClaw 的即時視覺回饋系統，讓 Agent 可以「畫」出回應而非只用文字。典型應用場景：

- 即時繪製차트和데이터視覺化
- 顯示검색結果的預覽卡片
- 呈現程式碼실행的即時輸出
- 互動式 UI 元件（按鈕、表單）
- 地圖標記與導航路線

```
Agent 回應
    │
    ├─→ 文字채널（Discord/Matrix）：文字回應
    │
    ├─→ 語音채널（Vapi）：語音回應
    │
    └─→ Live Canvas：視覺回饋
         ├── 차트
         ├── 程式碼
         ├── 圖片
         └── 互動元件
```

### Companion App Beta

Companion App 是 OpenClaw 的 macOS menubar 應用程式（Beta 階段），提供：

- 系統列快速存取 Agent
- 全局快捷鍵呼出對話框
- Live Canvas 桌面端渲染
- 語音互動整合
- 通知中心整合

## 실습 튜토리얼

### 步驟一：Vapi 계정설정

```bash
# 1. 前往 https://vapi.ai 註冊계정
# 2. 取得 API Key
# 3. 생성 Assistant（對應到 OpenClaw Agent）
```

在 Vapi Dashboard 中생성 Assistant 설정：

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
  "firstMessage": "你好！我是你的 OpenClaw 語音助手，有什麼我可以幫忙的嗎？"
}
```

### 步驟二：OpenClaw 語音설정

在 `settings.json` 中加入 Vapi 整合：

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

### 步驟三：생성 Vapi Webhook 處理器

OpenClaw 需要一個 webhook endpoint 來接收 Vapi 的語音轉文字結果：

```javascript
// skills/vapi-handler/index.js
module.exports = {
  name: "vapi-handler",
  description: "處理 Vapi 語音 webhook",

  // Vapi 會發送 POST 請求到這個 endpoint
  async handleWebhook(request, context) {
    const { type, message } = request.body;

    switch (type) {
      case 'assistant-request':
        // Vapi 正在請求 Agent 的回應
        return {
          assistant: {
            firstMessage: "你好！有什麼可以幫忙的嗎？",
            model: {
              provider: "custom-llm",
              messages: context.agent.getConversationHistory()
            }
          }
        };

      case 'function-call':
        // 語音中트리거了 Skill 呼叫
        const { functionName, parameters } = message;
        const result = await context.agent.callSkill(
          functionName,
          parameters
        );
        return { result: JSON.stringify(result) };

      case 'end-of-call-report':
        // 通話結束報告
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

### 步驟四：설정 Live Canvas

啟用 Live Canvas 視覺回饋：

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
// 在 Skill 中向 Canvas 推送視覺內容
module.exports = {
  name: "weather-visual",
  description: "顯示天氣視覺化資訊",

  async execute(context) {
    const { canvas, params } = context;
    const weatherData = await fetchWeather(params.city);

    // 推送차트到 Canvas
    await canvas.render({
      type: 'chart',
      chart: {
        type: 'line',
        data: {
          labels: weatherData.hourly.map(h => h.time),
          datasets: [{
            label: '溫度 (°C)',
            data: weatherData.hourly.map(h => h.temp),
            borderColor: '#ef4444',
            tension: 0.4
          }, {
            label: '降雨機率 (%)',
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
              text: `${params.city} — 今日天氣預報`
            }
          }
        }
      }
    });

    // 同時推送요약卡片
    await canvas.render({
      type: 'card',
      card: {
        title: `${params.city} 天氣`,
        subtitle: weatherData.summary,
        icon: weatherData.icon,
        fields: [
          { label: '目前溫度', value: `${weatherData.current.temp}°C` },
          { label: '體感溫度', value: `${weatherData.current.feels_like}°C` },
          { label: '濕度', value: `${weatherData.current.humidity}%` },
          { label: '風速', value: `${weatherData.current.wind_speed} m/s` }
        ]
      }
    });

    return {
      text: `${params.city}目前氣溫 ${weatherData.current.temp}°C，${weatherData.summary}`,
      canvas_rendered: true
    };
  }
};
```

### 步驟五：설치 Companion App Beta

```bash
# 다운로드 Companion App（macOS）
curl -L -o OpenClaw-Companion.dmg \
  https://github.com/openclaw/companion-app/releases/latest/download/OpenClaw-Companion-macOS.dmg

# 설치
hdiutil attach OpenClaw-Companion.dmg
cp -R "/Volumes/OpenClaw Companion/OpenClaw Companion.app" /Applications/
hdiutil detach "/Volumes/OpenClaw Companion"

# 啟動
open "/Applications/OpenClaw Companion.app"
```

Companion App 설정：

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

:::caution Companion App Beta 제한
Companion App 目前處於 Beta 階段，已知限制：
- 僅支援 macOS 12.0 (Monterey) 以上
- 語音功能需要授予麥克風권한
- Live Canvas 的複雜차트可能有渲染지연
- 不支援多 Agent 切換（計劃中）
- 偶爾的記憶體洩漏問題（建議每天重啟一次）
:::

### 步驟六：建構語音控制 Agent

整合語音、Canvas、Skills 的完整예시：

在 `soul.md` 中설정語音互動規則：

```markdown
# 語音互動助手

你是一個支援語音對話的 AI 助手。

## 語音回應規則
- 回應保持簡潔，語音不超過 30 秒
- 使用口語化的한국어
- 數字和清單用 Live Canvas 呈現，語音只說요약
- 如果사용자說「顯示給我看」，使用 Canvas 呈現詳細內容
- 如果사용자說「重複一次」，重新語音播報上一個回應

## 語音指令
- 「查天氣」→ 顯示天氣 + Canvas 차트
- 「念新聞」→ 語音播報今日頭條
- 「記一下」→ 將後續內容存入記憶
- 「開始計時」→ 啟動計時器
- 「靜音」→ 暫停語音輸出，只用文字和 Canvas
```

### 步驟七：多模態互動예시

```javascript
// skills/multimodal-assistant/index.js
module.exports = {
  name: "multimodal-assistant",
  description: "多模態互動助手",

  async execute(context) {
    const { agent, canvas, voice, channel, params } = context;
    const query = params.query;

    // 根據查詢類型決定最佳回應模態
    const queryType = await agent.classify(query, [
      'data_visualization',   // 用 Canvas
      'short_answer',         // 用語音
      'long_content',         // 用文字
      'interactive'           // 用 Canvas 互動元件
    ]);

    switch (queryType) {
      case 'data_visualization':
        // 語音說요약，Canvas 顯示차트
        const data = await agent.callSkill('data-fetcher', params);
        await voice.speak(`데이터已取得，正在為你繪製차트。`);
        await canvas.render({
          type: 'chart',
          chart: data.visualization
        });
        break;

      case 'short_answer':
        // 純語音回應
        const answer = await agent.think(query);
        await voice.speak(answer);
        break;

      case 'long_content':
        // 語音說요약，Canvas 顯示完整內容
        const content = await agent.think(query);
        const summary = await agent.summarize(content, { maxWords: 50 });
        await voice.speak(summary);
        await canvas.render({
          type: 'markdown',
          content: content
        });
        break;

      case 'interactive':
        // Canvas 顯示互動元件
        await voice.speak(`好的，我已經準備好互動介面了。`);
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

## 자주 발생하는 오류

| 問題 | 原因 | 解決方案 |
|------|------|---------|
| 語音지연超過 3 秒 | Vapi STT/TTS 處理時間 | 選擇較快的 STT 模型（如 Deepgram nova-2） |
| 中文語音辨識錯誤率高 | 模型不支援或語言설정錯誤 | 確認 `language` 為 `zh-TW` |
| Canvas 內容不顯示 | WebSocket 連線失敗 | 確認 Canvas port 正確且未被防火牆阻擋 |
| Companion App 無法連線 | API URL 或 Key 錯誤 | 檢查 `openclaw_url` 和 API Key |
| Wake word 誤트리거 | 靈敏度設太高 | 降低 `sensitivity` 至 0.5 |

:::tip 降低語音지연
語音互動的體驗取決於端到端지연。最佳化建議：
1. STT 使用 Deepgram（지연最低，約 300ms）
2. LLM 使用串流模式（streaming response）
3. TTS 使用 ElevenLabs Turbo（지연約 500ms）
4. 整體目標지연：< 2 秒
:::

## 문제 해결

```bash
# 檢查 Vapi 連線狀態
curl -s http://127.0.0.1:18789/api/voice/status

# 檢查 Canvas WebSocket
curl -s http://127.0.0.1:3001/health

# 테스트語音 webhook
curl -X POST http://127.0.0.1:18789/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "assistant-request"}'

# Companion App 로그
tail -f ~/Library/Logs/OpenClaw\ Companion/main.log
```

## 연습 문제

### 연습 1：語音天氣助手
설정一個語音控制的天氣助手，說「查天氣」時語音回報天氣요약，並在 Canvas 顯示溫度趨勢圖。

### 연습 2：語音備忘錄
建構一個語音備忘錄 Agent：
- 說「記一下：[內容]」存入記憶
- 說「今天記了什麼」列出所有備忘
- 用 Canvas 顯示備忘清單，用語音播報數量

### 연습 3：會議助手
建構一個會議語音助手：
- 即時語音轉錄（STT）
- Canvas 顯示即時逐字稿
- 會議結束後自動產生요약
- 辨識並標記 action items

## 퀴즈

1. **Vapi 在 OpenClaw 語音架構中的角色是什麼？**
   - A) 直接運行 LLM
   - B) 提供 STT/TTS 服務並橋接語音與 Agent
   - C) 저장語音記錄
   - D) 管理 Agent 스케줄링

   <details><summary>정답 확인</summary>B) Vapi 負責將語音轉為文字（STT）、將 Agent 的文字回應轉為語音（TTS），並透過 WebSocket 管理即時語音串流。</details>

2. **Live Canvas 最適合用來呈現什麼內容？**
   - A) 短句回答
   - B) 차트、데이터視覺化、互動元件等視覺內容
   - C) 純文字對話
   - D) 系統설정

   <details><summary>정답 확인</summary>B) Live Canvas 的優勢在於即時渲染視覺內容，適合차트、預覽卡片、互動表單等純文字或語音無法有效傳達的資訊。</details>

3. **Companion App Beta 目前支援哪個平台？**
   - A) Windows 和 macOS
   - B) 僅 macOS
   - C) 僅 Linux
   - D) 全平台

   <details><summary>정답 확인</summary>B) Companion App Beta 目前僅支援 macOS 12.0 (Monterey) 以上版本。Windows 和 Linux 版本尚在開發中。</details>

4. **如何降低語音互動的端到端지연？**
   - A) 使用較大的 LLM 模型
   - B) 使用 Deepgram (STT) + 串流回應 (LLM) + ElevenLabs Turbo (TTS)
   - C) 增加 Vapi 的 timeout 설정
   - D) 關閉 Canvas

   <details><summary>정답 확인</summary>B) 選擇低지연的 STT（Deepgram nova-2, ~300ms）、啟用 LLM streaming、使用快速 TTS（ElevenLabs Turbo, ~500ms）可將整體지연控制在 2 秒內。</details>

## 다음 단계

- [模組 5: 記憶系統](./module-05-memory) — 讓語音對話的記憶持久化
- [模組 6: Cron Jobs / Heartbeat](./module-06-automation) — 설정語音 Agent 的主動語音提醒
- [模組 12: 엔터프라이즈級應用](./module-12-enterprise) — 엔터프라이즈環境中的語音助手배포
