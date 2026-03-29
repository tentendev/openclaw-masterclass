---
title: 環境變數參考
description: OpenClaw 所有環境變數的完整參考——從基礎設定到進階調校
sidebar_position: 3
keywords: [OpenClaw, 環境變數, 設定, Docker, 部署]
---

# 環境變數參考

本頁列出 OpenClaw 所有可用的環境變數，方便在 Docker 部署和 CI/CD 中使用。

---

## 核心設定

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `OPENCLAW_HOST` | `127.0.0.1` | Gateway 綁定位址 |
| `OPENCLAW_PORT` | `18789` | Gateway 埠號 |
| `OPENCLAW_DATA_DIR` | `~/.openclaw` | 資料目錄 |
| `OPENCLAW_LOG_LEVEL` | `info` | 日誌等級 (debug/info/warn/error) |
| `OPENCLAW_SECRET_KEY` | 自動生成 | API 認證金鑰 |
| `OPENCLAW_ENV` | `production` | 運行環境 (development/production) |

---

## 認證設定

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `WEBUI_AUTH` | `true` | 啟用認證 |
| `WEBUI_AUTH_TRUSTED_ROLE_HEADER` | - | 信任的角色 Header（SSO 用） |
| `OAUTH_CLIENT_ID` | - | OAuth Client ID |
| `OAUTH_CLIENT_SECRET` | - | OAuth Client Secret |
| `OAUTH_PROVIDER_URL` | - | OIDC Provider URL |
| `OAUTH_AUTHORIZE_PARAMS` | - | OIDC 授權參數（JSON） |
| `LDAP_URL` | - | LDAP 伺服器 URL |
| `LDAP_BIND_DN` | - | LDAP 綁定 DN |
| `LDAP_BIND_PASSWORD` | - | LDAP 綁定密碼 |
| `LDAP_SEARCH_BASE` | - | LDAP 搜尋基底 |

---

## LLM 提供者

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `OPENAI_API_KEY` | - | OpenAI API Key |
| `OPENAI_API_BASE_URL` | `https://api.openai.com/v1` | OpenAI API 端點 |
| `ANTHROPIC_API_KEY` | - | Anthropic API Key |
| `GOOGLE_API_KEY` | - | Google AI API Key |
| `GROQ_API_KEY` | - | Groq API Key |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama 端點 |
| `OLLAMA_BASE_URLS` | - | 多 Ollama 實例（逗號分隔） |

---

## RAG / 知識庫

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `RAG_EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | 嵌入模型 |
| `RAG_CHUNK_SIZE` | `500` | 文件分塊大小（token） |
| `RAG_CHUNK_OVERLAP` | `50` | 分塊重疊大小 |
| `RAG_TOP_K` | `5` | 搜尋返回結果數 |
| `RAG_RELEVANCE_THRESHOLD` | `0.7` | 最低相關性門檻 |
| `CHROMA_DATA_PATH` | `~/.openclaw/chroma` | ChromaDB 資料路徑 |

---

## 語音設定

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `TTS_PROVIDER` | - | TTS 提供者 (elevenlabs/azure/speecht5) |
| `TTS_API_KEY` | - | TTS API Key |
| `STT_PROVIDER` | - | STT 提供者 (whisper/deepgram/azure) |
| `STT_API_KEY` | - | STT API Key |
| `WHISPER_MODEL` | `base` | 本地 Whisper 模型 |
| `ELEVENLABS_API_KEY` | - | ElevenLabs API Key |
| `DEEPGRAM_API_KEY` | - | Deepgram API Key |

---

## Web & 網路

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `WEB_FETCH_MAX_CONTENT_LENGTH` | `50000` | 網頁抓取最大內容長度 |
| `ENABLE_COMMUNITY_SHARING` | `true` | 啟用社群分享 |
| `CORS_ALLOW_ORIGINS` | `*` | CORS 允許的來源 |

---

## GPU & 效能

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `NVIDIA_VISIBLE_DEVICES` | `all` | 可見的 GPU |
| `CUDA_VISIBLE_DEVICES` | - | CUDA GPU 選擇 |
| `GPU_MEMORY_UTILIZATION` | `0.85` | GPU 記憶體使用率 |

---

## Docker Compose 範例

```yaml
version: '3.8'
services:
  openclaw:
    image: openclaw/openclaw:latest
    environment:
      - OPENCLAW_HOST=0.0.0.0        # 在容器內綁定所有介面
      - OPENCLAW_PORT=18789
      - OPENCLAW_SECRET_KEY=${SECRET_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OLLAMA_BASE_URL=http://ollama:11434
      - RAG_EMBEDDING_MODEL=all-MiniLM-L6-v2
      - WEBUI_AUTH=true
    ports:
      - "127.0.0.1:18789:18789"      # 只暴露到 localhost
    volumes:
      - openclaw-data:/app/data
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama-data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

volumes:
  openclaw-data:
  ollama-data:
```

:::danger 安全提醒
在 Docker 中使用 `OPENCLAW_HOST=0.0.0.0` 是正確的（因為容器網路隔離），但請確保 `ports` 映射只綁定到 `127.0.0.1`。
:::
