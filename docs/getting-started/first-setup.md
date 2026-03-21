---
title: 首次設定
description: OpenClaw 安裝後的首次設定流程——從初始化設定檔、建立 SOUL.md、連接 LLM 到測試第一個指令。
sidebar_position: 2
---

# 首次設定

恭喜你完成了 [安裝](./installation.md)！本篇將帶你走過首次設定流程，讓 OpenClaw 真正動起來。

---

## 設定總覽

首次設定需要完成以下四個步驟：

1. 執行互動式設定精靈
2. 建立 SOUL.md 人格檔案
3. 連接第一個 LLM 提供者
4. 測試基本指令

整個流程約需 5-10 分鐘。

---

## 步驟一：執行設定精靈

OpenClaw 提供互動式設定精靈，能快速完成基本配置：

```bash
openclaw setup
```

精靈會依序詢問以下問題：

```
🦞 Welcome to OpenClaw Setup!

? Choose your preferred language: 繁體中文
? Select container engine: Podman (recommended)
? Gateway bind address: 127.0.0.1 (localhost only)
? Gateway port: 18789
? Choose your primary LLM provider: (Use arrow keys)
  ❯ Anthropic (Claude)
    OpenAI (GPT)
    Google (Gemini)
    DeepSeek
    Ollama (Local)
    Skip for now
? Enter your API key: sk-ant-•••••••••
? Create a default SOUL.md personality? Yes

✅ Setup complete! Config saved to ~/.openclaw/
```

:::tip 不確定選哪個 LLM？
如果你還沒決定要用哪個 LLM 提供者，可以先選「Skip for now」。稍後可以透過 [選擇 AI 模型](./choose-llm.md) 頁面了解各模型的比較，再回來設定。
:::

---

## 步驟二：建立 SOUL.md 人格檔案

SOUL.md 是 OpenClaw 最獨特的設計之一——它定義了你的 AI 代理的「靈魂」。設定精靈會為你建立一份基本範本：

```bash
# 查看預設的 SOUL.md
cat ~/.openclaw/soul.md
```

預設內容如下：

```markdown
# SOUL.md

## 基本資訊
- 名稱：小龍
- 語言：繁體中文（台灣用語）
- 風格：友善、專業、適度幽默

## 行為規範
- 回覆時保持簡潔，除非使用者要求詳細說明
- 使用台灣慣用語，避免中國大陸用語
- 遇到不確定的問題時，誠實告知而非猜測

## 專長領域
- 一般知識問答
- 日常任務協助
- 技術問題排解
```

你可以稍後再深入調整 SOUL.md。詳細的人格設定指南請見 [SOUL.md 人格設定](./soul-md-config.md)。

---

## 步驟三：連接 LLM 提供者

如果你在設定精靈中已經輸入了 API Key，可以直接驗證連線：

```bash
# 測試 LLM 連線
openclaw provider test
```

預期輸出：

```
Testing connection to Anthropic (Claude)...
✓ API key valid
✓ Model claude-opus-4-6 available
✓ Response time: 342ms
✓ Connection successful!
```

### 手動設定 LLM 提供者

如果你跳過了設定精靈中的 LLM 步驟，可以手動編輯設定檔：

```bash
# 編輯 LLM 提供者設定
nano ~/.openclaw/providers/default.yaml
```

```yaml
# ~/.openclaw/providers/default.yaml

provider:
  name: anthropic
  model: claude-opus-4-6
  api_key: "${ANTHROPIC_API_KEY}"  # 建議使用環境變數
  max_tokens: 4096
  temperature: 0.7

# 備用提供者（當主要提供者不可用時自動切換）
fallback:
  name: ollama
  model: llama3.3:70b
  endpoint: "http://127.0.0.1:11434"
```

:::warning API Key 安全
**永遠不要**將 API Key 直接寫死在設定檔中。請使用環境變數：

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中加入
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
export OPENAI_API_KEY="sk-your-key-here"
```

設定檔中使用 `${VARIABLE_NAME}` 語法引用環境變數。
:::

---

## 步驟四：啟動 OpenClaw 並測試

### 啟動 Gateway

```bash
# 前景模式啟動（適合測試，按 Ctrl+C 停止）
openclaw start

# 或以背景模式啟動
openclaw start --daemon
```

啟動後你會看到：

```
🦞 OpenClaw v4.2.1 starting...
├─ Gateway listening on 127.0.0.1:18789
├─ Memory system: WAL initialized
├─ Container engine: Podman 5.4.0 (rootless)
├─ LLM provider: Anthropic (claude-opus-4-6)
└─ Skills loaded: 0 (install skills from ClawHub!)

Ready! Use 'openclaw chat' to start a conversation.
```

### 使用 CLI 進行對話

```bash
# 開啟互動式聊天
openclaw chat
```

```
🦞 OpenClaw Chat (type 'exit' to quit)

You: 你好！你是誰？
小龍: 你好！我是小龍，你的 AI 助理 🦞 有什麼我可以幫忙的嗎？

You: 今天天氣如何？
小龍: 我目前還沒有安裝天氣查詢的技能。你可以透過以下指令安裝：
      openclaw skill install weather-tw
      安裝後我就能幫你查天氣囉！

You: exit
Goodbye! 🦞
```

### 測試 Gateway API

你也可以直接透過 HTTP API 測試：

```bash
# 發送測試訊息到 Gateway
curl -X POST http://127.0.0.1:18789/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, OpenClaw!",
    "channel": "api",
    "user_id": "test-user"
  }'
```

預期回應：

```json
{
  "status": "ok",
  "response": "你好！我是小龍，有什麼可以幫忙的嗎？",
  "metadata": {
    "model": "claude-opus-4-6",
    "tokens_used": 42,
    "response_time_ms": 387
  }
}
```

---

## 安裝你的第一個技能

OpenClaw 剛安裝時沒有任何技能。讓我們安裝幾個實用的基礎技能：

```bash
# 搜尋技能
openclaw skill search "翻譯"

# 安裝翻譯技能
openclaw skill install translator-pro

# 安裝網頁搜尋技能
openclaw skill install web-search

# 查看已安裝的技能
openclaw skill list
```

:::info ClawHub 技能安全
在安裝任何技能之前，建議查看其安全評等與社群評價。ClawHavoc 事件中曾有 2,400+ 個惡意技能被植入 ClawHub。安裝前請確認：
- 技能作者的驗證狀態
- 社群評分與下載數
- 權限要求是否合理

詳見 [技能稽核清單](/docs/security/skill-audit-checklist)。
:::

---

## 常用管理指令

| 指令 | 說明 |
|------|------|
| `openclaw start` | 啟動 Gateway |
| `openclaw start --daemon` | 以背景模式啟動 |
| `openclaw stop` | 停止 Gateway |
| `openclaw restart` | 重新啟動 |
| `openclaw status` | 查看執行狀態 |
| `openclaw chat` | 開啟互動式聊天 |
| `openclaw doctor` | 執行健康檢查 |
| `openclaw logs` | 查看即時日誌 |
| `openclaw logs --tail 50` | 查看最後 50 行日誌 |
| `openclaw config edit` | 編輯設定檔 |
| `openclaw skill list` | 列出已安裝的技能 |

---

## 下一步

你的 OpenClaw 已經可以運作了！接下來你可以：

- [連接通訊平台](./connect-channels.md) — 讓 AI 進駐你的 WhatsApp、Telegram、LINE 等
- [選擇 AI 模型](./choose-llm.md) — 深入了解各 LLM 模型的特色與比較
- [SOUL.md 人格設定](./soul-md-config.md) — 打造獨一無二的 AI 人格
