---
title: 2026 Q1 新功能總覽
description: OpenClaw 2026 年第一季所有新功能完整介紹——Pipelines、Arena 模式、Knowledge Base、使用者群組等
sidebar_position: 2
---

# 2026 Q1 新功能總覽

2026 年第一季，OpenClaw 迎來了史上最大規模的功能更新。本文整理所有新功能，幫你快速掌握最新能力。

---

## 功能地圖

```
┌─────────────────────────────────────────────────────┐
│              OpenClaw 2026 Q1 新功能                  │
├───────────────┬───────────────┬─────────────────────┤
│  AI 能力      │  管理功能      │  整合生態             │
├───────────────┼───────────────┼─────────────────────┤
│ Pipelines     │ User Groups   │ MCP 連接器 (50+)     │
│ Agentic RAG   │ RBAC          │ Ollama 多實例        │
│ Arena Mode    │ SSO 整合       │ Composio 整合        │
│ Canvas        │ Model 白名單   │ Docker Runner        │
│ Jupyter       │ API 分頁       │ Nvidia GPU 加速      │
│ Voice (TTS)   │ 效能優化       │ Tencent 中文套件     │
│ Multimodal    │ 安全強化       │ ElevenLabs EU        │
└───────────────┴───────────────┴─────────────────────┘
```

---

## 新功能詳覽

### 1. Pipelines 框架

**影響：** 平台核心能力大幅提升

Pipelines 是 OpenClaw 最重要的新功能之一。它提供了一個 UI 無關、OpenAI 相容的插件框架，讓你可以在訊息處理的任何環節插入自訂邏輯。

**三種 Pipeline 類型：**
- **Filter Pipeline** — 訊息過濾與修改（速率限制、有害內容過濾）
- **Function Pipeline** — 擴充模型能力（函式呼叫、RAG 注入）
- **Pipe Pipeline** — 完全自訂回應流程

**社群生態：** 541 個 Functions + 276 個 Tools

[完整文件 →](/docs/features/pipelines)

---

### 2. Knowledge Base 與 Agentic RAG

**影響：** RAG 準確度與速度大幅提升

| 功能 | 說明 |
|------|------|
| **Agentic RAG** | 模型自主決定何時搜尋知識庫，含智慧重試邏輯 |
| **混合搜尋** | 稠密 + 稀疏搜尋，加上重排序器評估 |
| **KV 前綴快取** | RAG 上下文快取，後續回應幾乎即時 |
| **Markdown 標題分割** | 按文件結構智慧分塊 |
| **PDF 引用** | 引用直接跳轉到 PDF 對應頁面 |

[完整文件 →](/docs/features/knowledge-rag)

---

### 3. Arena 模式

**影響：** 科學化的模型選擇

Arena 模式讓你透過盲測 A/B 對比找出最適合你的 AI 模型。系統隨機選擇兩個模型回答同一問題，你在不知道模型身份的情況下投票，系統計算 ELO 評分。

**關鍵特色：**
- 消除品牌偏見的盲測機制
- ELO 評分系統
- 分類測試（程式碼 / 寫作 / 推理）
- 數據匯出與分析

[完整文件 →](/docs/features/arena-mode)

---

### 4. 使用者群組與 RBAC

**影響：** 企業級權限管理

| 功能 | 說明 |
|------|------|
| **使用者群組** | 建立和管理使用者群組 |
| **RBAC** | 角色基底存取控制 |
| **模型白名單** | 每個群組可用的模型限制 |
| **知識庫存取控制** | 群組級別的知識庫權限 |
| **SSO 整合** | OAuth、OIDC、LDAP、信任 Header |
| **JWT 會話** | Token 基底的會話管理 |

[完整文件 →](/docs/features/user-groups)

---

### 5. Canvas 與 Artifacts

**影響：** 從純文字到視覺互動

- **畫布工具**：全螢幕畫布，支援畫筆、橡皮擦、色板、筆刷大小、撤銷/重做
- **Artifacts 系統**：程式碼區塊獨立渲染為可互動的容器
- **Writing Blocks**：格式化文字容器，附帶複製按鈕
- **PDF 引用**：直接在對應頁面開啟 PDF

[完整文件 →](/docs/features/canvas)

---

### 6. Jupyter Notebook 整合

**影響：** 資料科學與程式碼執行

- 在 OpenClaw 中直接執行 Jupyter Notebook
- 支援程式碼單元格執行
- SQLite 資料庫瀏覽器
- 互動式資料探索
- 視覺化輸出渲染

[完整文件 →](/docs/features/jupyter)

---

### 7. 語音系統升級

**影響：** 完整的語音互動能力

| 新增 | 說明 |
|------|------|
| **ElevenLabs EU 端點** | GDPR 合規的語音合成 |
| **Azure Speech** | 企業級 TTS/STT |
| **SpeechT5** | 實驗性本地 TTS |
| **視訊通話** | 支援視覺模型的即時視訊 |
| **audio/x-m4a 支援** | iPhone 錄音格式 |

[完整文件 →](/docs/features/voice-tts-stt)

---

### 8. 效能大幅提升

| 改善 | 幅度 |
|------|------|
| 批次資料庫查詢 | 載入速度 10x |
| 請求處理 | 2-3x 更快 |
| KV 前綴快取 | RAG 後續回應 10-15x |
| 本地 LLM 首回應 | 降低 25% |
| 檔案 API 分頁 | 支援大量檔案 |

[完整文件 →](/docs/features/performance)

---

### 9. 整合生態擴展

**新增 LLM 提供者：**
- 所有 OpenAI 相容端點
- Anthropic `/v1/messages` 端點（透過 Ollama 代理）
- Groq LPU 推理加速

**MCP 連接器（50+）：**
- GitHub、Slack、Notion、Linear、Reddit、Figma、Airtable 等

**其他整合：**
- Docker Desktop Model Runner
- DigitalOcean Marketplace
- Umbrel App Store

[Ollama 整合 →](/docs/integrations/ollama) | [OpenAI 相容 API →](/docs/integrations/openai-compatible) | [MCP 連接器 →](/docs/integrations/mcp-connectors)

---

## 遷移指南

### 從 v3.1.x 升級到 v3.2.0

```bash
# 1. 備份
cp -r ~/.openclaw ~/.openclaw-backup

# 2. 升級
npm install -g @openclaw/cli@latest

# 3. 自動遷移設定
openclaw migrate

# 4. 驗證
openclaw doctor
```

**注意事項：**
- `gateway.yaml` 格式已變更（`host` → `bind`）
- Skill manifest 需升級至 v2 格式
- Docker 使用者建議切換到 Podman

---

## 接下來學什麼？

| 你的角色 | 建議從這裡開始 |
|---------|-------------|
| 新使用者 | [安裝指南](/docs/getting-started/installation) |
| 開發者 | [Pipelines 文件](/docs/features/pipelines) |
| 資料科學家 | [Knowledge Base](/docs/features/knowledge-rag) |
| 企業管理者 | [使用者群組](/docs/features/user-groups) |
| 效能調校 | [效能優化指南](/docs/features/performance) |
