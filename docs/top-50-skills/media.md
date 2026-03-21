---
sidebar_position: 9
title: "媒體 Skills"
description: "OpenClaw 媒體類 Skills 完整評測：Felo Slides、Spotify、YouTube Digest、Image Generation、TweetClaw、Voice/Vapi"
keywords: [OpenClaw, Skills, Media, Felo Slides, Spotify, YouTube, Image Generation, TweetClaw, Voice]
---

# 媒體 Skills (Media)

媒體類 Skills 讓 OpenClaw Agent 具備多媒體處理能力 — 從產生簡報、管理音樂到摘要 YouTube 影片。這些 Skills 擴展了 Agent 從純文字到多模態的能力範圍。

---

## #25 — Felo Slides

| 屬性 | 內容 |
|------|------|
| **排名** | #25 / 50 |
| **類別** | Media |
| **總分** | 55 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install felo-slides` |
| **目標使用者** | 需要快速製作簡報的使用者 |

### 功能說明

使用自然語言描述產生專業簡報（PPT/PDF）：

- **自然語言 → 簡報**：描述主題和大綱即可產生
- **模板系統**：多種專業設計模板
- **圖表產生**：自動產生圖表和資訊圖表
- **多語言支援**：繁體中文、英文、日文等
- **匯出格式**：PPTX、PDF、Google Slides
- **內容填充**：結合搜尋 Skill 自動填充最新資料

### 為什麼重要

製作簡報是許多知識工作者最耗時的任務之一。Felo Slides 讓 Agent 在幾分鐘內產生一份結構完整、設計專業的簡報，你只需要審核和微調。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 7 | 8 | 7 | 6 | 7 | 6 | **55** |

### 安裝與設定

```bash
clawhub install felo-slides

# 設定 API Key
openclaw skill configure felo-slides \
  --api-key your_felo_slides_key

# 使用範例
openclaw run "用 Felo Slides 製作一份 10 頁簡報，主題是 AI Agent 在企業的應用趨勢"

# 指定模板和語言
openclaw run felo-slides \
  --template business-modern \
  --language zh-Hant \
  --topic "Q1 營運報告"
```

### 依賴與安全

- **依賴**：Felo Slides API Key
- **權限需求**：網路存取（API 呼叫）、本機檔案寫入（匯出簡報）
- **安全性**：SEC 7/10 — 簡報內容會傳送到 Felo 伺服器處理
- **替代方案**：Google Slides API 直接操作；Markdown → PPTX 轉換工具

---

## #27 — Spotify

| 屬性 | 內容 |
|------|------|
| **排名** | #27 / 50 |
| **類別** | Media |
| **總分** | 55 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/spotify-claw` |
| **目標使用者** | Spotify Premium 使用者 |

### 功能說明

控制 Spotify 播放和管理音樂：

- 播放/暫停/跳過曲目
- 搜尋歌曲、專輯、藝人
- 管理播放清單
- 根據情境推薦音樂（如「幫我播適合寫程式的音樂」）
- 查看最近播放記錄

### 為什麼重要

音樂是許多人工作流程的一部分。讓 Agent 根據你的行事曆和任務自動調整背景音樂 — 例如專注工作時播放 Lo-fi、會議前播放輕鬆音樂、運動時播放高能量歌單。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 7 | 7 | 7 | 7 | 8 | 6 | **55** |

### 安裝與設定

```bash
clawhub install community/spotify-claw

# OAuth 授權
openclaw auth spotify

# 使用範例
openclaw run "播放一些適合工作的 Lo-fi 音樂"
openclaw run "把目前這首歌加到『我的最愛』播放清單"
```

### 依賴與安全

- **依賴**：Spotify Premium 帳號、Spotify OAuth
- **權限需求**：`user-modify-playback-state`, `playlist-modify-private`
- **安全性**：SEC 8/10 — Spotify 權限範圍有限，不涉及敏感資料
- **替代方案**：Apple Music 整合尚在社群開發中

---

## #32 — YouTube Digest

| 屬性 | 內容 |
|------|------|
| **排名** | #32 / 50 |
| **類別** | Media |
| **總分** | 53 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/youtube-digest` |
| **目標使用者** | YouTube 重度使用者、學習者 |

### 功能說明

從 YouTube 影片擷取知識：

- **字幕擷取**：取得影片的自動/手動字幕
- **內容摘要**：產生影片重點摘要
- **時間戳筆記**：標記重要時間點
- **頻道追蹤**：追蹤特定頻道的新影片
- **播放清單分析**：彙整整個播放清單的知識

### 為什麼重要

YouTube 是世界上最大的知識庫之一，但看完一部 1 小時的教學影片需要很多時間。YouTube Digest 讓 Agent 在幾秒內產生影片摘要，你可以快速決定是否值得完整觀看。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 6 | 7 | 6 | 7 | 8 | 6 | **53** |

### 安裝與設定

```bash
clawhub install community/youtube-digest

# 設定（選用：YouTube API Key 可提升效率）
openclaw skill configure youtube-digest \
  --youtube-api-key your_api_key  # 選用

# 使用範例
openclaw run "幫我摘要這部影片：https://youtube.com/watch?v=xxxxx"
openclaw run "追蹤 Fireship 頻道，每週給我新影片摘要"
```

### 依賴與安全

- **依賴**：YouTube API Key（選用，無 Key 也能用但速度較慢）
- **權限需求**：YouTube Data API（唯讀）
- **安全性**：SEC 8/10 — 唯讀存取，不修改任何資料
- **替代方案**：Web Browsing Skill 直接瀏覽 YouTube 並手動摘要

---

## #35 — Image Generation

| 屬性 | 內容 |
|------|------|
| **排名** | #35 / 50 |
| **類別** | Media |
| **總分** | 52 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/image-gen` |
| **目標使用者** | 需要快速產生圖片的使用者 |

### 功能說明

透過多種 AI 圖片產生服務建立圖片：

- **文字轉圖片**：自然語言描述產生圖片
- **多模型支援**：DALL-E 3、Stable Diffusion、Midjourney API
- **圖片編輯**：修改現有圖片
- **批次產生**：一次產生多個變體
- **風格控制**：指定藝術風格、比例、解析度

### 為什麼重要

需要社群貼文配圖、簡報插圖、概念視覺化時，Image Generation Skill 讓你不需要離開 OpenClaw 就能產生所需圖片。搭配 Felo Slides 使用效果尤佳。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 6 | 7 | 6 | 6 | 7 | 7 | **52** |

### 安裝與設定

```bash
clawhub install community/image-gen

# 設定圖片產生服務（擇一）
openclaw skill configure image-gen \
  --provider openai \
  --api-key sk-xxxxxxxxxxxx

# 使用範例
openclaw run "產生一張賽博龐克風格的台北 101 插圖"
```

### 依賴與安全

- **依賴**：圖片產生 API Key（OpenAI、Stability AI 等）
- **權限需求**：API 呼叫 + 本機檔案寫入
- **安全性**：SEC 7/10 — 圖片描述會傳送到第三方服務
- **替代方案**：直接使用 DALL-E 或 Midjourney 官方介面

---

## #39 — TweetClaw

| 屬性 | 內容 |
|------|------|
| **排名** | #39 / 50 |
| **類別** | Media / Social |
| **總分** | 50 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/tweetclaw` |
| **目標使用者** | 社群媒體經營者、X/Twitter 使用者 |

### 功能說明

X（前 Twitter）內容管理：

- 讀取特定帳號的最新推文
- 搜尋特定主題的推文
- 草擬推文（需手動確認後發布）
- 追蹤特定話題趨勢
- 分析推文互動數據

### 為什麼重要

對於需要經營社群媒體的使用者，TweetClaw 讓 Agent 能追蹤產業趨勢、草擬推文、分析互動表現。搭配 Summarize Skill 可以產生每日 Twitter 摘要。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | **50** |

### 安裝與設定

```bash
clawhub install community/tweetclaw

# 設定 X API（需要 Basic 或 Pro 方案）
openclaw skill configure tweetclaw \
  --api-key your_x_api_key \
  --api-secret your_x_api_secret \
  --access-token your_access_token \
  --access-secret your_access_secret
```

:::warning X API 費用
X API 已改為付費制。Basic 方案 $100/月，功能有限。TweetClaw 的唯讀功能可搭配免費的 Web Browsing Skill 替代。
:::

### 依賴與安全

- **依賴**：X API Key（付費）
- **權限需求**：Tweet 讀取/寫入
- **安全性**：SEC 7/10 — 建議限制為唯讀模式，手動發布推文
- **替代方案**：Web Browsing Skill 搭配 X 搜尋（免費但功能有限）

---

## #40 — Voice / Vapi

| 屬性 | 內容 |
|------|------|
| **排名** | #40 / 50 |
| **類別** | Media |
| **總分** | 50 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/voice-vapi` |
| **目標使用者** | 語音互動需求使用者 |

### 功能說明

為 OpenClaw Agent 加入語音能力：

- **語音輸入**：語音轉文字（STT）
- **語音輸出**：文字轉語音（TTS）
- **語音對話**：即時語音互動模式
- **多語言**：支援中英日韓等語言
- **自訂聲音**：選擇不同的 TTS 聲音

### 為什麼重要

語音是最自然的人機互動方式。Voice/Vapi Skill 讓你可以用說的方式操控 Agent，適合開車、做家事等雙手不方便打字的場景。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 6 | 5 | 7 | 6 | 6 | 7 | 7 | **50** |

### 安裝與設定

```bash
clawhub install community/voice-vapi

# 設定語音服務（Vapi）
openclaw skill configure voice-vapi \
  --provider vapi \
  --api-key your_vapi_key \
  --voice-id alloy \
  --language zh-TW

# 啟動語音模式
openclaw voice
```

### 依賴與安全

- **依賴**：Vapi API Key 或其他 TTS/STT 服務
- **權限需求**：麥克風存取、網路存取
- **安全性**：SEC 7/10 — 語音資料會傳送到第三方服務處理
- **替代方案**：OpenClaw 未來版本可能內建語音功能（參考 Module 11）

---

## 媒體 Skills 組合推薦

### 內容創作者

```bash
clawhub install felo-slides
clawhub install community/image-gen
clawhub install community/tweetclaw
clawhub install community/spotify-claw
```

### 學習者

```bash
clawhub install community/youtube-digest
clawhub install community/summarize
clawhub install community/obsidian-claw
```

### 多模態 Agent

```bash
clawhub install community/voice-vapi
clawhub install community/image-gen
clawhub install community/youtube-digest
# 看、聽、說、畫 — 全方位 Agent
```
