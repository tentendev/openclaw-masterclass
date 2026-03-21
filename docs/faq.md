---
title: 常見問題 FAQ
description: OpenClaw 最常見的問題解答——從基本概念、安全性、費用到進階使用的完整 FAQ。
sidebar_position: 99
---

# 常見問題 FAQ

本頁收錄了 OpenClaw 新手和進階使用者最常提出的問題。

---

## 基本概念

### Q：OpenClaw 是什麼？跟 ChatGPT 有什麼不同？

**A：** OpenClaw 是一個開源的**自主 AI Agent 平台**，運行在你自己的電腦上。與 ChatGPT 的主要差異：

| 比較項目 | ChatGPT | OpenClaw |
|---------|---------|---------|
| 運行位置 | OpenAI 雲端 | 你的本機電腦 |
| 資料控制 | OpenAI 擁有 | 你自己掌控 |
| 自主行動 | 只能對話 | 能自主執行任務（發 email、控制家電等） |
| 多平台整合 | 只有 ChatGPT 介面 | 20+ 通訊平台（Telegram、Discord 等） |
| 擴充性 | 有限的 GPTs | 13,000+ ClawHub 技能 |
| 費用 | 月費制 | 開源免費（需自付 LLM API 費用） |

### Q：OpenClaw 是免費的嗎？

**A：** OpenClaw 本身是**開源免費**的（MIT 授權）。但你需要自行負擔以下費用：

- **LLM API 費用** — 使用 Claude、GPT 等雲端模型需要付費。使用 Ollama 搭配本地模型則免費。
- **通訊平台** — 大部分免費（Telegram Bot、Discord Bot 等），少數可能有費用。
- **硬體** — 你自己的電腦或伺服器。

典型的月費用：

| 使用程度 | 預估月費 |
|---------|---------|
| 輕度（每天幾次對話） | $5-15 |
| 中度（日常助理） | $15-50 |
| 重度（多 Agent + 自動化） | $50-200+ |
| 全本地（Ollama） | $0（電費除外） |

### Q：「養龍蝦」是什麼意思？

**A：** 這是 OpenClaw 在亞洲社群的暱稱。「Claw」（螯）是龍蝦的爪子，OpenClaw 的吉祥物 **Molty** 是一隻龍蝦。使用者把設定和訓練 OpenClaw Agent 的過程比喻為「養龍蝦」——需要餵食（SOUL.md 設定）、訓練（記憶累積）和照顧（維護更新）。

### Q：我需要會寫程式才能使用 OpenClaw 嗎？

**A：** 基本使用不需要程式能力。安裝和設定可以跟著教學步驟完成。日常使用就是透過通訊軟體（如 Telegram）與 Agent 對話。

進階使用（自訂技能、API 整合、多 Agent 部署）則需要一定的程式基礎。

---

## 安全性

### Q：OpenClaw 安全嗎？

**A：** OpenClaw 本身的設計是安全的，但**設定不當**會造成嚴重的安全風險。已知的安全問題包括：

- **CVE-2026-25253**：Gateway 遠端程式碼執行漏洞（已修補）
- **ClawHavoc**：2,400+ 個惡意技能被植入 ClawHub（已清除）
- **30,000+ 個實例**因暴露 Gateway 埠而被入侵

**只要正確設定**（綁定 localhost、啟用認證、使用 Podman rootless），OpenClaw 是安全的。詳見 [安全性最佳實踐](/docs/security/best-practices)。

### Q：我的對話資料會被上傳嗎？

**A：** OpenClaw 本身**不會上傳**你的資料。但你使用的 LLM 提供者會接收你的對話內容：

- **雲端 LLM**（Claude、GPT 等）：你的對話會傳送到提供者的伺服器進行處理
- **本地 LLM**（Ollama）：所有資料都留在你的電腦上，完全離線

如果你極度重視隱私，建議使用 Ollama 搭配本地模型。

### Q：ClawHub 上的技能安全嗎？

**A：** ClawHub 上的技能由社群開發者提交，**不保證安全**。ClawHavoc 事件後，ClawHub 新增了 VirusTotal 掃描，但自動掃描無法偵測所有惡意行為。

安裝任何技能前，請先完成 [技能稽核清單](/docs/security/skill-audit-checklist) 的檢查。

### Q：為什麼推薦 Podman 而不是 Docker？

**A：** Docker daemon 以 root 權限運行。如果技能沙箱被突破，攻擊者可能獲得主機的 root 權限。Podman 的 rootless 模式不需要 root，即使沙箱被突破也只能取得普通使用者權限，大幅降低風險。

---

## 安裝與設定

### Q：OpenClaw 支援哪些作業系統？

**A：**

| 作業系統 | 支援狀態 |
|---------|---------|
| macOS 13+ | 完全支援 |
| Ubuntu 22.04+ | 完全支援 |
| Debian 12+ | 完全支援 |
| Fedora 38+ | 完全支援 |
| Arch Linux | 社群支援（AUR） |
| Windows 11 (WSL2) | 支援（需 WSL2） |
| Windows（原生） | 不支援 |
| ChromeOS | 不支援 |

### Q：最低硬體需求是什麼？

**A：**

| 項目 | 最低 | 建議 | 重度使用 |
|------|------|------|---------|
| CPU | 2 核心 | 4 核心 | 8+ 核心 |
| RAM | 4 GB | 8 GB | 16+ GB |
| 磁碟 | 2 GB | 5 GB | 20+ GB |
| GPU | 不需要 | 不需要 | Nvidia（本地 LLM 加速） |

### Q：可以在 Raspberry Pi 上運行嗎？

**A：** 技術上可以在 Raspberry Pi 4/5（4GB+ RAM）上運行，但效能會受限。建議只用於輕量使用場景（如簡單的通知和自動化），不適合搭配大型 LLM。

### Q：如何更新 OpenClaw？

**A：**
```bash
# npm 安裝
npm install -g @openclaw/cli@latest

# Homebrew 安裝
brew upgrade openclaw

# 更新後執行遷移
openclaw migrate

# 驗證
openclaw doctor
```

---

## LLM 與模型

### Q：OpenClaw 支援哪些 LLM？

**A：** 支援所有主流 LLM 提供者：

| 提供者 | 模型 | 適合用途 |
|--------|------|---------|
| Anthropic | Claude Opus 4.6、Sonnet 4.5 | 通用對話、複雜推理 |
| OpenAI | GPT-5.2 Codex、GPT-4.1 | 程式碼生成、通用對話 |
| Google | Gemini 2.5 Pro | 多模態、長上下文 |
| DeepSeek | DeepSeek-V3 | 性價比高 |
| Ollama（本地） | Llama 3.3、Qwen 2.5、Mistral | 離線使用、隱私優先 |
| Groq | 各種開源模型 | 超低延遲 |

### Q：用哪個模型最好？

**A：** 取決於你的需求：

- **最佳通用對話**：Claude Opus 4.6
- **最佳程式碼生成**：GPT-5.2 Codex
- **最佳性價比**：DeepSeek-V3 或 Claude Sonnet 4.5
- **最佳隱私**：Ollama + Llama 3.3（完全本地）
- **最低延遲**：Groq

建議設定多個模型並使用 LLM Router 根據任務類型自動路由。

### Q：可以同時使用多個 LLM 嗎？

**A：** 可以。OpenClaw 的 LLM Router 支援根據任務類型路由到不同模型。例如：程式碼用 GPT-5.2，對話用 Claude，簡單任務用本地模型。

---

## 技能與 ClawHub

### Q：有哪些推薦的技能？

**A：** 請參考 [Top 50 必裝 Skills](/docs/top-50-skills/overview)，包含各類別的推薦技能和安全評級。

### Q：如何自己開發技能？

**A：** 技能本質上是一個符合 OpenClaw manifest 格式的 Node.js 或 Python 程式。基本步驟：

1. 建立 `manifest.yaml` 宣告技能元資料和權限
2. 撰寫主要邏輯（`index.js` 或 `main.py`）
3. 本地測試
4. 發布到 ClawHub

詳見 [MasterClass 模組 3: Skills 系統](/docs/masterclass/module-03-skills-system)。

### Q：技能可以存取我的電腦嗎？

**A：** 技能在容器沙箱中執行，**預設不能**存取你的電腦。技能需要在 `manifest.yaml` 中宣告所需的權限（網路、檔案系統、shell 等），你可以透過 `permissions.override.yaml` 進一步限制。

---

## 通訊平台

### Q：可以同時連接多個通訊平台嗎？

**A：** 可以。這是 OpenClaw 的核心功能之一。你可以同時連接 Telegram、Discord、WhatsApp、Slack、LINE 等多個平台，所有訊息都由同一個 Agent 處理。

### Q：Agent 在不同平台間會共享記憶嗎？

**A：** 是的。記憶系統是統一的，不論使用者從哪個平台發訊息，Agent 都能存取完整的記憶。

### Q：可以設定不同平台有不同的回應風格嗎？

**A：** 可以。在 SOUL.md 中可以針對不同平台設定不同的行為：

```markdown
## 平台特定行為
- Telegram：回覆簡潔，使用 emoji
- Slack：回覆專業，使用 Markdown 格式
- Discord：口語化，可以開玩笑
```

---

## 記憶與 SOUL.md

### Q：SOUL.md 是什麼？

**A：** SOUL.md 是一個 Markdown 檔案，定義了你的 Agent 的人格、行為規則、安全邊界和日常任務。它是 Agent 的「靈魂」——決定了 Agent 如何思考和行動。

### Q：Agent 能記住多長時間的對話？

**A：** 理論上無限。OpenClaw 的記憶系統會將所有對話存入 WAL，並定期壓縮為長期記憶。但每次互動中，Agent 只能在 LLM 的上下文窗口限制內存取最近的對話和相關的長期記憶。

### Q：如何讓 Agent 忘記某些事情？

**A：**
```bash
# 刪除特定對話
openclaw memory delete --conversation-id "conv_abc123"

# 清理特定時間段
openclaw memory prune --before "2025-01-01"

# 完全重置
openclaw memory reset --confirm
```

---

## 多 Agent

### Q：什麼是多 Agent？

**A：** 多 Agent 是指多個 OpenClaw 實例協作完成任務。每個 Agent 有不同的 SOUL.md 人格和專長，透過 Discord 或 Matrix 等平台溝通協調。

### Q：需要多台電腦嗎？

**A：** 不一定。你可以在同一台電腦上運行多個 OpenClaw 實例（使用不同的 port 和設定目錄）。但為了效能考量，大規模部署建議分散到多台機器。

---

## 費用與效能

### Q：如何降低 LLM API 費用？

**A：**

1. **使用 LLM Router** — 簡單任務路由到便宜的模型
2. **使用本地模型** — Ollama 免費（只需電費）
3. **最佳化上下文** — 減少記憶大小，降低 token 消耗
4. **設定使用量限制** — 在 LLM 提供者控制台設定每月上限
5. **使用 DeepSeek** — 與 Claude/GPT 品質相近但便宜數倍

### Q：OpenClaw 能跑多快？

**A：** 回應速度主要取決於 LLM：

| 場景 | 典型延遲 |
|------|---------|
| 雲端 LLM（簡單問題） | 1-3 秒 |
| 雲端 LLM（複雜任務 + 技能） | 3-15 秒 |
| 本地 LLM（Ollama + GPU） | 2-10 秒 |
| 本地 LLM（CPU only） | 10-60 秒 |

---

## 社群與學習

### Q：遇到問題去哪裡求助？

**A：**

1. [本站疑難排解](/docs/troubleshooting/common-issues) — 常見問題的即時解答
2. [GitHub Issues](https://github.com/openclaw/openclaw/issues) — 正式的 bug 回報
3. [Discord #help](https://discord.gg/openclaw) — 即時社群支援
4. [Reddit r/openclaw](https://reddit.com/r/openclaw) — 討論與搜尋歷史問題

### Q：如何貢獻到 OpenClaw？

**A：** 歡迎以任何形式貢獻：

- **回報 bug** — 在 GitHub Issues 中提交
- **開發技能** — 發布到 ClawHub
- **撰寫文件** — 改善官方文件
- **翻譯** — 協助本地化
- **回答問題** — 在 Reddit 和 Discord 幫助其他使用者
- **分享 Showcase** — 在 r/openclaw 分享你的專案

### Q：有官方的學習課程嗎？

**A：** 本站的 [MasterClass 課程](/docs/masterclass/overview) 是目前最完整的學習資源，涵蓋從基礎到進階的 12 個模組。

---

## 延伸閱讀

- [OpenClaw 是什麼？](/docs/intro) — 完整介紹
- [安裝指南](/docs/getting-started/installation) — 開始使用
- [MasterClass 課程](/docs/masterclass/overview) — 系統化學習
- [術語表](/docs/glossary) — 名詞解釋
