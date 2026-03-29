---
title: 語音系統 (TTS/STT)
description: OpenClaw 的完整語音系統——Text-to-Speech、Speech-to-Text、視訊通話與語音 Agent 設定
sidebar_position: 8
keywords: [OpenClaw, TTS, STT, 語音, ElevenLabs, Whisper, Deepgram, 語音助手]
---

# 語音系統 (TTS/STT)

OpenClaw 提供完整的語音互動能力，讓你的 AI Agent 不只能「讀」和「寫」，還能「聽」和「說」。

---

## 架構概覽

```
┌──────────────────────────────────────────────┐
│              OpenClaw 語音架構                 │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────┐    ┌─────────┐    ┌──────────┐  │
│  │ 麥克風  │──→│  STT    │──→│          │  │
│  └────────┘    │ 引擎    │    │  OpenClaw│  │
│                └─────────┘    │  推理層   │  │
│                               │          │  │
│  ┌────────┐    ┌─────────┐    │          │  │
│  │ 喇叭   │←──│  TTS    │←──│          │  │
│  └────────┘    │ 引擎    │    └──────────┘  │
│                └─────────┘                   │
│                                              │
│  ┌────────┐    ┌─────────┐                   │
│  │ 攝影機  │──→│  視覺   │──→ 視訊通話模式   │
│  └────────┘    │ 模型    │                   │
│                └─────────┘                   │
└──────────────────────────────────────────────┘
```

---

## Text-to-Speech (TTS)

### ElevenLabs 整合

ElevenLabs 提供目前最自然的 AI 語音合成，OpenClaw 完整整合其 API：

```toml
[voice.tts]
provider = "elevenlabs"
api_key = "${ELEVENLABS_API_KEY}"

# 語音選擇
voice_id = "pNInz6obpgDQGcFmaJgB"  # Adam
model = "eleven_turbo_v2"            # 低延遲模型

# 微調參數
stability = 0.5              # 穩定性（0-1）
similarity_boost = 0.75       # 相似度增強（0-1）
style = 0.3                   # 風格表現力

# EU 資料駐留（GDPR 合規）
use_eu_endpoint = false        # 設為 true 使用 EU 端點
```

:::info EU 資料駐留
如果你的使用者位於歐盟，可以啟用 `use_eu_endpoint = true` 確保語音數據不離開歐盟地區。
:::

### Azure Speech Services

適合需要企業級 SLA 的場景：

```toml
[voice.tts]
provider = "azure"
subscription_key = "${AZURE_SPEECH_KEY}"
region = "eastasia"             # 東亞區域
voice_name = "zh-TW-HsiaoChenNeural"  # 繁體中文女聲

# 可用的中文語音
# zh-TW-HsiaoChenNeural（女聲，自然）
# zh-TW-YunJheNeural（男聲，自然）
# zh-CN-XiaoxiaoNeural（簡體中文女聲）
```

### SpeechT5 本地 TTS（實驗性）

完全本地運行，不需要任何 API key：

```toml
[voice.tts]
provider = "speecht5"
model_path = "~/.openclaw/models/speecht5"

# 首次使用時自動下載模型
auto_download = true
```

:::warning 實驗性功能
SpeechT5 的中文語音品質目前不如 ElevenLabs 或 Azure。建議僅用於開發測試或完全離線的場景。
:::

---

## Speech-to-Text (STT)

### Whisper 本地模式

使用 OpenAI Whisper 模型在本地進行語音辨識：

```toml
[voice.stt]
provider = "whisper-local"
model = "large-v3"          # tiny, base, small, medium, large-v3
language = "zh"             # 指定語言可提高準確率
device = "cuda"             # 或 "cpu", "mps" (Apple Silicon)

# GPU 加速設定
compute_type = "float16"    # float32 較準確但較慢
beam_size = 5               # 搜尋寬度
```

**模型選擇指南：**

| 模型 | 大小 | 速度 | 準確率 | 推薦場景 |
|------|------|------|--------|---------|
| tiny | 39M | 最快 | 低 | 快速原型 |
| base | 74M | 快 | 中 | 一般對話 |
| small | 244M | 中等 | 中高 | 日常使用 |
| medium | 769M | 慢 | 高 | 專業轉錄 |
| large-v3 | 1.5G | 最慢 | 最高 | 高品質需求 |

### Deepgram

最低延遲的雲端 STT 方案：

```toml
[voice.stt]
provider = "deepgram"
api_key = "${DEEPGRAM_API_KEY}"
model = "nova-2"
language = "zh-TW"

# 進階設定
smart_format = true          # 智慧標點符號
diarize = true               # 說話者辨識
punctuate = true             # 自動標點
profanity_filter = false     # 髒話過濾
```

---

## 視訊通話

OpenClaw 支援即時視訊通話，讓 AI 可以「看到」你的環境：

```toml
[voice.video_call]
enabled = true
camera_resolution = "720p"   # 480p, 720p, 1080p
frame_rate = 1               # 每秒傳送的畫面數（降低以節省 token）

# 支援的視覺模型
supported_models = [
    "claude-opus-4-6",
    "gpt-5.2-vision",
    "gemini-2.5-pro-vision",
    "llava-1.6-34b"
]
```

### 使用場景

1. **遠端技術支援**：展示故障設備，AI 診斷問題
2. **烹飪助手**：展示食材，AI 提供食譜建議
3. **運動教練**：展示動作，AI 提供姿勢修正建議
4. **居家裝潢**：展示空間，AI 提供佈置建議

---

## 語音 Agent 建構

### 完整設定範例

```toml
# 語音 Agent 完整設定
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

[voice.behavior]
# 語音回應長度控制
max_response_words = 100     # 語音回應最多 100 字
long_response_mode = "split" # 長回應分段播放

# 等待行為
silence_timeout = 5          # 5 秒靜默後結束聆聽
interrupt_enabled = true     # 允許使用者打斷 AI 語音

# 喚醒詞
wake_word = "嘿 OpenClaw"
wake_word_sensitivity = 0.7
```

### SOUL.md 語音人格

```markdown
# 語音助手人格

## 回應風格
- 語音回應保持簡短（30 秒內）
- 使用口語化的繁體中文
- 數字、清單用 Canvas 顯示，語音只說摘要
- 語氣友善但專業

## 特殊指令
- 「安靜」→ 切換到純文字模式
- 「大聲一點」→ 調高 TTS 音量
- 「慢一點」→ 降低 TTS 語速
- 「重複」→ 重新播放上一則回應
```

---

## 延遲優化策略

### 端到端延遲分解

```
使用者說話完畢
    │ 語音傳輸 + 偵測結尾    ~200ms
    ▼
STT 語音轉文字
    │ Deepgram nova-2        ~300ms
    ▼
LLM 推理（首 token）
    │ 串流模式               ~500ms
    ▼
TTS 語音合成（首音節）
    │ ElevenLabs Turbo       ~500ms
    ▼
使用者聽到回應
────────────────────────────
總計                        ~1500ms
```

### 優化建議

| 策略 | 效果 | 實施難度 |
|------|------|---------|
| 使用串流 TTS | 減少 ~300ms | 低 |
| 預載入 STT 模型 | 減少首次延遲 | 低 |
| 使用 Groq LPU 推理 | LLM 部分減少 ~300ms | 中 |
| 邊緣部署 STT | 減少網路延遲 | 高 |
| 自訂喚醒詞模型 | 減少誤觸發 | 高 |

---

## 練習題

1. **基礎語音設定**：設定 ElevenLabs TTS + Deepgram STT，建立一個能聽和說的 Agent。

2. **多語言語音**：設定一個能在繁體中文和英文之間自動切換的語音 Agent。

3. **視訊互動**：啟用視訊通話，讓 AI 看到你桌面上的物品並描述它們。

4. **延遲測量**：測量你的語音 Agent 的端到端延遲，並嘗試優化到 2 秒以內。

---

## 隨堂測驗

1. **哪個 TTS 提供者支援 EU 資料駐留？**
   - A) Azure Speech
   - B) SpeechT5
   - C) ElevenLabs
   - D) Deepgram

2. **Whisper large-v3 模型的大小約為？**
   - A) 74MB
   - B) 244MB
   - C) 769MB
   - D) 1.5GB

3. **視訊通話中，`frame_rate = 1` 代表什麼？**
   - A) 每分鐘傳送 1 幀
   - B) 每秒傳送 1 幀
   - C) 解析度為 1x
   - D) 只傳送 1 幀

<details>
<summary>查看答案</summary>

1. **C** — ElevenLabs 提供 EU 端點，啟用 `use_eu_endpoint = true` 即可。
2. **D** — Whisper large-v3 模型約 1.5GB。
3. **B** — `frame_rate = 1` 表示每秒傳送 1 個畫面到視覺模型，以節省 API token。

</details>
