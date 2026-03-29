---
title: 多模態互動
description: OpenClaw 的多模態能力——圖像分析、語音互動、視覺回饋與跨模態 AI 體驗
sidebar_position: 7
keywords: [OpenClaw, 多模態, multimodal, 圖像, 語音, TTS, STT]
---

# 多模態互動

OpenClaw 不只是一個文字聊天介面——它是一個**全方位的多模態 AI 平台**，支援圖像分析、語音互動、視覺回饋等多種互動模式。

---

## 多模態能力總覽

```
┌────────────────────────────────────────────────┐
│                  OpenClaw 多模態架構              │
├────────────────────────────────────────────────┤
│                                                │
│  輸入模態          處理核心         輸出模態      │
│  ┌──────┐                        ┌──────┐     │
│  │ 文字  │─┐    ┌──────────┐  ┌─→│ 文字  │     │
│  └──────┘  │    │          │  │  └──────┘     │
│  ┌──────┐  ├──→│  LLM     │──┤  ┌──────┐     │
│  │ 圖像  │─┤    │  推理引擎 │  ├─→│ 語音  │     │
│  └──────┘  │    │          │  │  └──────┘     │
│  ┌──────┐  │    └──────────┘  │  ┌──────┐     │
│  │ 語音  │─┤                  ├─→│ 圖表  │     │
│  └──────┘  │                  │  └──────┘     │
│  ┌──────┐  │                  │  ┌──────┐     │
│  │ 檔案  │─┘                  └─→│Canvas │     │
│  └──────┘                       └──────┘     │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 圖像分析

### 支援的視覺模型

| 模型 | 提供者 | 能力 |
|------|--------|------|
| Claude Opus 4.6 / Sonnet 4.6 | Anthropic | 圖像理解、OCR、圖表分析 |
| GPT-5.2 Vision | OpenAI | 圖像描述、物件偵測 |
| Gemini 2.5 Pro Vision | Google | 超長圖片序列、影片理解 |
| LLaVA 1.6+ | 本地 (Ollama) | 開源視覺語言模型 |

### 使用方式

```python
# 透過 API 傳送圖片
import requests

response = requests.post("http://127.0.0.1:18789/api/chat", json={
    "model": "claude-opus-4-6",
    "messages": [{
        "role": "user",
        "content": [
            {"type": "text", "text": "這張圖片裡有什麼？"},
            {
                "type": "image_url",
                "image_url": {"url": "data:image/png;base64,..."}
            }
        ]
    }]
})
```

### 實用場景

1. **文件 OCR**：上傳手寫筆記或掃描文件，AI 自動識別文字
2. **程式碼截圖**：貼上程式碼截圖，AI 提取並分析程式碼
3. **圖表分析**：上傳數據圖表，AI 解讀趨勢和洞察
4. **UI/UX 審查**：上傳介面截圖，AI 提供設計建議
5. **數學公式**：拍照數學題目，AI 逐步解題

---

## 語音互動

### Text-to-Speech (TTS) 提供者

| 提供者 | 特色 | 延遲 |
|--------|------|------|
| **ElevenLabs** | 最自然的語音，支援中文 | ~500ms |
| **ElevenLabs EU** | 歐盟資料駐留端點 | ~600ms |
| **Azure Speech** | 企業級穩定性 | ~400ms |
| **SpeechT5** | 本地 TTS（實驗性） | ~300ms |

### Speech-to-Text (STT) 提供者

| 提供者 | 特色 | 支援語言 |
|--------|------|---------|
| **Whisper (本地)** | 隱私優先，離線可用 | 99+ 語言 |
| **Deepgram** | 最低延遲，高準確率 | 36+ 語言 |
| **Azure Speech** | 企業級，高可用 | 100+ 語言 |
| **OpenAI Whisper API** | 雲端 Whisper | 99+ 語言 |

### 語音設定

```toml
# config.toml
[voice]
enabled = true

[voice.tts]
provider = "elevenlabs"
api_key = "${ELEVENLABS_API_KEY}"
voice_id = "your-voice-id"
model = "eleven_turbo_v2"

[voice.stt]
provider = "deepgram"
api_key = "${DEEPGRAM_API_KEY}"
model = "nova-2"
language = "zh-TW"

[voice.video_call]
enabled = true
supported_models = ["claude-opus-4-6", "gpt-5.2-vision"]
```

:::tip 視訊通話
OpenClaw 支援視訊通話功能——當你使用支援視覺的模型時，AI 可以看到你的攝影機畫面並即時回應。這在需要展示實物或環境時特別有用。
:::

---

## 檔案處理

OpenClaw 支援多種檔案格式的上傳與分析：

| 檔案類型 | 支援格式 | 處理方式 |
|---------|---------|---------|
| **文件** | PDF, DOCX, TXT, MD | 文字提取 + RAG |
| **圖片** | PNG, JPG, WEBP, GIF | 視覺模型分析 |
| **音訊** | MP3, WAV, M4A, FLAC | STT 轉錄 |
| **程式碼** | 所有程式語言 | 語法高亮 + 分析 |
| **資料** | CSV, JSON, XLSX | 數據分析 + 視覺化 |

### 音訊檔案支援

```python
# 上傳音訊檔案進行轉錄
response = requests.post("http://127.0.0.1:18789/api/transcribe",
    files={"file": open("meeting.m4a", "rb")},
    data={"language": "zh-TW"}
)
transcript = response.json()["text"]
```

:::info 新增格式支援
v3.2.0 新增了 `audio/x-m4a` 格式支援，讓你可以直接上傳 iPhone 錄音。
:::

---

## 跨模態工作流範例

### 範例 1：會議記錄工作流

```
錄音檔案 (.m4a)
    │ STT 轉錄
    ▼
文字逐字稿
    │ LLM 摘要
    ▼
會議摘要 + Action Items
    │ Canvas 渲染
    ▼
視覺化任務看板
```

### 範例 2：學習助手工作流

```
教科書照片
    │ 視覺模型 OCR
    ▼
文字內容提取
    │ RAG + 知識庫
    ▼
重點整理 + 補充說明
    │ TTS
    ▼
語音摘要播報
```

### 範例 3：數據分析工作流

```
CSV 檔案上傳
    │ 數據解析
    ▼
LLM 分析 + 洞察
    │ Canvas 繪圖
    ▼
互動式圖表
    │ TTS 摘要
    ▼
語音播報關鍵發現
```

---

## 效能最佳化

### 圖像處理

```toml
[multimodal]
# 自動壓縮上傳圖片以節省 token
image_auto_resize = true
image_max_resolution = 2048  # 最大邊長（像素）
image_quality = 85           # JPEG 品質
```

### 語音延遲優化

最佳實踐組合（端到端延遲 < 2 秒）：

```
STT: Deepgram nova-2      (~300ms)
LLM: 串流模式              (~500ms)
TTS: ElevenLabs Turbo v2   (~500ms)
網路開銷                    (~200ms)
──────────────────────────
總計                       ~1500ms
```

---

## 練習題

1. **圖像分析實作**：上傳一張包含中英文的文件照片，測試不同視覺模型的 OCR 準確率。

2. **語音助手建構**：設定一個支援語音的 Agent，能夠接收語音指令並用語音回答。

3. **跨模態工作流**：設計一個工作流：接收圖片 → 分析內容 → 產生文字報告 → 語音播報摘要。

---

## 隨堂測驗

1. **以下哪個 STT 提供者延遲最低？**
   - A) Whisper (本地)
   - B) Deepgram
   - C) Azure Speech
   - D) OpenAI Whisper API

2. **OpenClaw 的視訊通話功能需要什麼類型的模型？**
   - A) 任何 LLM
   - B) 支援視覺的模型
   - C) 本地模型
   - D) 專用語音模型

<details>
<summary>查看答案</summary>

1. **B** — Deepgram nova-2 的延遲約為 300ms，是目前延遲最低的選擇。
2. **B** — 視訊通話需要支援視覺輸入的模型，如 Claude Opus 4.6、GPT-5.2 Vision 或 LLaVA。

</details>
