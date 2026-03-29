---
title: Docker / Podman 部署指南
description: 使用 Docker 或 Podman 部署 OpenClaw 的完整指南——從單機到多容器架構
sidebar_position: 1
keywords: [OpenClaw, Docker, Podman, 部署, 容器化]
---

# Docker / Podman 部署指南

本指南涵蓋使用 Docker 或 Podman 部署 OpenClaw 的所有面向，從最基本的單容器啟動到完整的多服務生產架構。

## 架構概覽

```
┌─────────────────────────────────────────────────────┐
│                   反向代理 (Nginx / Caddy)            │
│                    :80 / :443                        │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
┌─────────▼─────────┐   ┌──────────▼──────────┐
│   OpenClaw Web     │   │   OpenClaw API       │
│   (前端容器)        │   │   (後端容器)          │
│   :3000            │   │   :8080              │
└─────────┬─────────┘   └──────┬───────────────┘
          │                     │
          │         ┌───────────┼───────────┐
          │         │           │           │
     ┌────▼────┐ ┌──▼───┐ ┌────▼────┐ ┌───▼────┐
     │ Ollama  │ │Redis │ │PostgreSQL│ │ChromaDB│
     │ :11434  │ │:6379 │ │ :5432   │ │ :8000  │
     └─────────┘ └──────┘ └─────────┘ └────────┘
```

## Docker 與 Podman 比較

在選擇容器引擎之前，請先了解兩者的核心差異：

| 特性 | Docker | Podman |
|------|--------|--------|
| 守護程序 | 需要 `dockerd` 守護程序 | 無守護程序（daemonless） |
| Root 權限 | 預設需要 root | 原生支援 rootless |
| 安全模型 | 單一守護程序攻擊面較大 | 每個容器獨立 fork |
| Compose 支援 | 原生 `docker compose` | `podman-compose` 或 `podman compose` |
| Systemd 整合 | 需要額外設定 | 原生 `podman generate systemd` |
| OCI 相容性 | 完全相容 | 完全相容 |
| Kubernetes YAML | 不直接支援 | `podman play kube` 直接支援 |
| 映像格式 | OCI / Docker | OCI / Docker |

:::tip 安全建議
在生產環境中，建議使用 **Podman** 的 rootless 模式以降低攻擊面。若使用 Docker，請務必啟用 User Namespace Remapping。
:::

### Docker 安裝（快速參考）

```bash
# Ubuntu / Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# macOS
brew install --cask docker

# 驗證安裝
docker --version
docker compose version
```

### Podman 安裝（快速參考）

```bash
# Ubuntu / Debian
sudo apt-get update && sudo apt-get install -y podman podman-compose

# Fedora / RHEL
sudo dnf install -y podman podman-compose

# macOS
brew install podman podman-compose
podman machine init
podman machine start

# 驗證安裝
podman --version
```

## 快速啟動（單容器）

最簡單的啟動方式只需一行指令：

```bash
# Docker
docker run -d \
  --name openclaw \
  -p 3000:3000 \
  -v openclaw-data:/app/data \
  ghcr.io/openclaw/openclaw:latest

# Podman（完全相同語法）
podman run -d \
  --name openclaw \
  -p 3000:3000 \
  -v openclaw-data:/app/data \
  ghcr.io/openclaw/openclaw:latest
```

啟動後，開啟瀏覽器前往 `http://localhost:3000` 即可使用。

## 環境變數參考

以下是 OpenClaw 支援的完整環境變數清單：

| 變數名稱 | 預設值 | 說明 |
|----------|--------|------|
| `OPENCLAW_PORT` | `3000` | Web 介面監聽埠 |
| `OPENCLAW_API_PORT` | `8080` | API 服務監聽埠 |
| `OPENCLAW_DATA_DIR` | `/app/data` | 資料儲存目錄 |
| `OPENCLAW_LOG_LEVEL` | `info` | 日誌等級：`debug`, `info`, `warn`, `error` |
| `OPENCLAW_DB_URL` | `sqlite:///app/data/openclaw.db` | 資料庫連線字串 |
| `OPENCLAW_REDIS_URL` | _(空)_ | Redis 連線字串，例如 `redis://redis:6379` |
| `OPENCLAW_OLLAMA_URL` | `http://localhost:11434` | Ollama API 端點 |
| `OPENCLAW_OPENAI_API_KEY` | _(空)_ | OpenAI API 金鑰 |
| `OPENCLAW_ANTHROPIC_API_KEY` | _(空)_ | Anthropic API 金鑰 |
| `OPENCLAW_GOOGLE_API_KEY` | _(空)_ | Google AI API 金鑰 |
| `OPENCLAW_AUTH_ENABLED` | `false` | 是否啟用使用者驗證 |
| `OPENCLAW_JWT_SECRET` | _(自動產生)_ | JWT 簽章密鑰 |
| `OPENCLAW_CORS_ORIGINS` | `*` | 允許的跨域來源 |
| `OPENCLAW_MAX_UPLOAD_SIZE` | `100MB` | 最大上傳檔案大小 |
| `OPENCLAW_CHROMA_URL` | _(空)_ | ChromaDB 連線字串 |
| `OPENCLAW_TLS_CERT` | _(空)_ | TLS 憑證路徑 |
| `OPENCLAW_TLS_KEY` | _(空)_ | TLS 私鑰路徑 |

:::warning 機密資訊管理
切勿將 API 金鑰直接寫入 `docker-compose.yml`。請使用 `.env` 檔案或 Docker Secrets 管理敏感資訊。
:::

### 使用 `.env` 檔案

建立 `.env` 檔案：

```bash
# .env
OPENCLAW_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
OPENCLAW_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
OPENCLAW_JWT_SECRET=your-super-secret-jwt-key-here
OPENCLAW_AUTH_ENABLED=true
OPENCLAW_LOG_LEVEL=info
```

```bash
# 啟動時載入
docker run -d --env-file .env -p 3000:3000 ghcr.io/openclaw/openclaw:latest
```

## 完整 Docker Compose 設定

### 基本版（單機）

```yaml
# docker-compose.yml
version: "3.9"

services:
  openclaw:
    image: ghcr.io/openclaw/openclaw:latest
    container_name: openclaw
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - openclaw-data:/app/data
    env_file:
      - .env
    environment:
      - OPENCLAW_OLLAMA_URL=http://ollama:11434
      - OPENCLAW_REDIS_URL=redis://redis:6379
    depends_on:
      ollama:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama-models:/root/.ollama
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  openclaw-data:
  ollama-models:
  redis-data:
```

### 進階版（含 PostgreSQL 與 ChromaDB）

```yaml
# docker-compose.production.yml
version: "3.9"

services:
  openclaw:
    image: ghcr.io/openclaw/openclaw:latest
    container_name: openclaw
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "8080:8080"
    volumes:
      - openclaw-data:/app/data
      - openclaw-uploads:/app/uploads
    env_file:
      - .env
    environment:
      - OPENCLAW_DB_URL=postgresql://openclaw:${DB_PASSWORD}@postgres:5432/openclaw
      - OPENCLAW_REDIS_URL=redis://redis:6379
      - OPENCLAW_OLLAMA_URL=http://ollama:11434
      - OPENCLAW_CHROMA_URL=http://chromadb:8000
      - OPENCLAW_AUTH_ENABLED=true
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      ollama:
        condition: service_healthy
      chromadb:
        condition: service_started
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 4G
        reservations:
          cpus: "1.0"
          memory: 2G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama-models:/root/.ollama
    deploy:
      resources:
        limits:
          cpus: "4.0"
          memory: 8G
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: openclaw
      POSTGRES_USER: openclaw
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U openclaw"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  chromadb:
    image: chromadb/chroma:latest
    container_name: chromadb
    restart: unless-stopped
    ports:
      - "8000:8000"
    volumes:
      - chroma-data:/chroma/chroma
    environment:
      - IS_PERSISTENT=TRUE

  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy-data:/data
      - caddy-config:/config
    depends_on:
      - openclaw

volumes:
  openclaw-data:
  openclaw-uploads:
  ollama-models:
  postgres-data:
  redis-data:
  chroma-data:
  caddy-data:
  caddy-config:
```

## Volume 掛載與資料持久化

### 關鍵路徑對照表

| 容器內路徑 | 用途 | 建議掛載方式 |
|-----------|------|-------------|
| `/app/data` | 主要資料（SQLite DB、設定檔） | Named Volume |
| `/app/uploads` | 使用者上傳檔案 | Named Volume 或 Bind Mount |
| `/app/logs` | 應用程式日誌 | Bind Mount |
| `/root/.ollama` | Ollama 模型檔案 | Named Volume（容量大） |
| `/var/lib/postgresql/data` | PostgreSQL 資料 | Named Volume |

### Bind Mount 範例

```bash
# 將資料掛載到主機特定目錄
docker run -d \
  --name openclaw \
  -p 3000:3000 \
  -v /opt/openclaw/data:/app/data \
  -v /opt/openclaw/uploads:/app/uploads \
  -v /opt/openclaw/logs:/app/logs \
  ghcr.io/openclaw/openclaw:latest
```

:::caution 權限問題
使用 Bind Mount 時，請確保主機目錄的權限正確：
```bash
sudo mkdir -p /opt/openclaw/{data,uploads,logs}
sudo chown -R 1000:1000 /opt/openclaw/
```
:::

## GPU 直通設定

### NVIDIA GPU

**前置需求：** 安裝 [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)。

```bash
# 安裝 NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \
  | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \
  | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \
  | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

```bash
# 啟動帶 GPU 的 Ollama
docker run -d \
  --name ollama \
  --gpus all \
  -p 11434:11434 \
  -v ollama-models:/root/.ollama \
  ollama/ollama:latest
```

Docker Compose 中的 GPU 設定：

```yaml
services:
  ollama:
    image: ollama/ollama:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all      # 或指定數量，例如 1
              capabilities: [gpu]
```

### AMD GPU (ROCm)

```bash
# 使用 ROCm 版本的 Ollama
docker run -d \
  --name ollama \
  --device /dev/kfd \
  --device /dev/dri \
  -p 11434:11434 \
  -v ollama-models:/root/.ollama \
  ollama/ollama:rocm
```

Docker Compose 設定：

```yaml
services:
  ollama:
    image: ollama/ollama:rocm
    devices:
      - /dev/kfd:/dev/kfd
      - /dev/dri:/dev/dri
    group_add:
      - video
      - render
```

:::info Podman GPU 直通
Podman 使用 CDI（Container Device Interface）規格。安裝 NVIDIA Container Toolkit 後：
```bash
sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml
podman run --device nvidia.com/gpu=all ollama/ollama:latest
```
:::

## 資源限制與優化

### Docker 資源限制

```yaml
services:
  openclaw:
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 4G
        reservations:
          cpus: "0.5"
          memory: 1G
    # 舊版語法（也有效）
    # mem_limit: 4g
    # cpus: 2.0
```

### 建議資源配置

| 部署規模 | CPU | 記憶體 | 磁碟空間 | GPU |
|----------|-----|--------|---------|-----|
| 開發/測試 | 2 核 | 4 GB | 20 GB | 選用 |
| 小型團隊（1-10 人） | 4 核 | 8 GB | 50 GB | 建議 |
| 中型團隊（10-50 人） | 8 核 | 16 GB | 100 GB | 必要 |
| 大型部署（50+ 人） | 16+ 核 | 32+ GB | 500+ GB | 多 GPU |

### 效能調校

```yaml
services:
  openclaw:
    environment:
      # Node.js 記憶體限制
      - NODE_OPTIONS=--max-old-space-size=3072
    # 開啟 tmpfs 加速暫存
    tmpfs:
      - /tmp:size=512M
    # 使用主機網路模式減少網路延遲（僅 Linux）
    # network_mode: host

  postgres:
    command: >
      postgres
        -c shared_buffers=256MB
        -c effective_cache_size=768MB
        -c work_mem=16MB
        -c maintenance_work_mem=128MB
        -c max_connections=100
    shm_size: 256mb
```

## 健康檢查設定

每個服務都應設定健康檢查，以確保容器正常運作：

```yaml
services:
  openclaw:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s      # 檢查間隔
      timeout: 10s       # 逾時時間
      retries: 3         # 重試次數
      start_period: 60s  # 啟動等待時間
```

也可透過指令確認狀態：

```bash
# 查看所有容器健康狀態
docker ps --format "table {{.Names}}\t{{.Status}}"

# 查看特定容器的健康檢查日誌
docker inspect --format='{{json .State.Health}}' openclaw | jq
```

## 日誌設定

### Docker 日誌驅動

```yaml
services:
  openclaw:
    logging:
      driver: json-file
      options:
        max-size: "50m"    # 單一日誌檔大小上限
        max-file: "5"      # 保留日誌檔數量
        compress: "true"   # 壓縮舊日誌

  # 使用 syslog 驅動（生產環境推薦）
  openclaw-prod:
    logging:
      driver: syslog
      options:
        syslog-address: "tcp://logserver:514"
        tag: "openclaw"
```

### 集中式日誌收集

```yaml
services:
  # 使用 Loki + Promtail 收集日誌
  loki:
    image: grafana/loki:2.9.0
    ports:
      - "3100:3100"
    volumes:
      - loki-data:/loki

  promtail:
    image: grafana/promtail:2.9.0
    volumes:
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
```

### 檢視日誌

```bash
# 即時檢視日誌
docker compose logs -f openclaw

# 只看最近 100 行
docker compose logs --tail=100 openclaw

# 查看特定時間範圍
docker compose logs --since="2026-03-30T00:00:00" openclaw

# 搜尋錯誤
docker compose logs openclaw 2>&1 | grep -i error
```

## 備份與還原

### 自動備份腳本

```bash
#!/bin/bash
# backup-openclaw.sh
set -euo pipefail

BACKUP_DIR="/opt/backups/openclaw"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"

mkdir -p "${BACKUP_PATH}"

echo "=== 開始備份 OpenClaw (${TIMESTAMP}) ==="

# 備份 Docker Volumes
echo ">> 備份資料目錄..."
docker run --rm \
  -v openclaw-data:/source:ro \
  -v "${BACKUP_PATH}":/backup \
  alpine tar czf /backup/openclaw-data.tar.gz -C /source .

# 備份 PostgreSQL
echo ">> 備份 PostgreSQL..."
docker exec postgres pg_dump -U openclaw -F c openclaw \
  > "${BACKUP_PATH}/openclaw-db.dump"

# 備份 Redis
echo ">> 備份 Redis..."
docker exec redis redis-cli BGSAVE
sleep 2
docker cp redis:/data/dump.rdb "${BACKUP_PATH}/redis-dump.rdb"

# 備份設定檔
echo ">> 備份設定檔..."
cp docker-compose.yml "${BACKUP_PATH}/"
cp .env "${BACKUP_PATH}/.env.backup"

# 清除 30 天前的備份
find "${BACKUP_DIR}" -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +

echo "=== 備份完成：${BACKUP_PATH} ==="
echo "備份大小：$(du -sh "${BACKUP_PATH}" | cut -f1)"
```

### 還原

```bash
#!/bin/bash
# restore-openclaw.sh
set -euo pipefail

BACKUP_PATH="${1:?用法：$0 <備份目錄路徑>}"

echo "=== 開始還原 OpenClaw ==="
echo "來源：${BACKUP_PATH}"

# 停止服務
docker compose down

# 還原資料目錄
echo ">> 還原資料目錄..."
docker run --rm \
  -v openclaw-data:/target \
  -v "${BACKUP_PATH}":/backup:ro \
  alpine sh -c "rm -rf /target/* && tar xzf /backup/openclaw-data.tar.gz -C /target"

# 啟動服務（僅資料庫）
docker compose up -d postgres redis
sleep 10

# 還原 PostgreSQL
echo ">> 還原 PostgreSQL..."
docker exec -i postgres pg_restore -U openclaw -d openclaw --clean --if-exists \
  < "${BACKUP_PATH}/openclaw-db.dump"

# 還原 Redis
echo ">> 還原 Redis..."
docker cp "${BACKUP_PATH}/redis-dump.rdb" redis:/data/dump.rdb
docker compose restart redis

# 啟動所有服務
docker compose up -d

echo "=== 還原完成 ==="
```

## DigitalOcean 部署

### 使用 DigitalOcean App Platform

```yaml
# .do/app.yaml
name: openclaw
region: sgp  # 新加坡（亞洲延遲最低）
services:
  - name: openclaw
    image:
      registry_type: GHCR
      registry: openclaw
      repository: openclaw
      tag: latest
    instance_count: 1
    instance_size_slug: professional-s
    http_port: 3000
    envs:
      - key: OPENCLAW_AUTH_ENABLED
        value: "true"
      - key: OPENCLAW_JWT_SECRET
        type: SECRET
        value: ${JWT_SECRET}
    health_check:
      http_path: /health
databases:
  - name: openclaw-db
    engine: PG
    version: "16"
    size: db-s-1vcpu-1gb
```

### 使用 Droplet（手動）

```bash
# 在 DigitalOcean Droplet 上部署
ssh root@your-droplet-ip

# 安裝 Docker
curl -fsSL https://get.docker.com | sh

# 下載設定檔
mkdir -p /opt/openclaw && cd /opt/openclaw
curl -O https://raw.githubusercontent.com/openclaw/openclaw/main/docker-compose.yml
curl -O https://raw.githubusercontent.com/openclaw/openclaw/main/.env.example
cp .env.example .env

# 編輯環境變數
nano .env

# 啟動
docker compose up -d
```

## Umbrel App Store 部署

OpenClaw 可直接從 Umbrel App Store 安裝：

1. 進入 Umbrel 儀表板
2. 點選 **App Store**
3. 搜尋 **OpenClaw**
4. 點選 **安裝**

手動新增至 Umbrel：

```bash
# 在 Umbrel 主機上
cd ~/umbrel
sudo ./scripts/app install openclaw
```

## Docker Desktop Model Runner 整合

Docker Desktop 4.40+ 內建 Model Runner，可直接在 Docker 中運行 AI 模型：

```bash
# 啟用 Model Runner（Docker Desktop 設定 > Features > Model Runner）

# 下載模型
docker model pull llama3.2

# 列出可用模型
docker model list

# OpenClaw 可透過 OpenAI 相容端點連線
# 在 .env 中設定：
OPENCLAW_OLLAMA_URL=http://model-runner.docker.internal:80/engines/llama.cpp/v1
```

Docker Compose 整合：

```yaml
services:
  openclaw:
    image: ghcr.io/openclaw/openclaw:latest
    environment:
      # Docker Model Runner 使用 OpenAI 相容 API
      - OPENCLAW_OPENAI_API_BASE=http://model-runner.docker.internal:80/engines/llama.cpp/v1
      - OPENCLAW_OPENAI_API_KEY=not-needed
    ports:
      - "3000:3000"
```

:::note Docker Model Runner 限制
Docker Model Runner 目前僅支援 Docker Desktop，不適用於 Linux 伺服器的 Docker Engine。生產環境請繼續使用 Ollama。
:::

## 多容器網路設定

### 自訂網路

```yaml
services:
  openclaw:
    networks:
      - frontend
      - backend

  ollama:
    networks:
      - backend

  postgres:
    networks:
      - backend

  caddy:
    networks:
      - frontend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # 禁止外部存取
```

### 跨主機通訊（Docker Swarm）

```bash
# 初始化 Swarm
docker swarm init

# 建立 overlay 網路
docker network create --driver overlay openclaw-net

# 部署服務
docker stack deploy -c docker-compose.production.yml openclaw
```

## 常見問題排除

### 容器無法啟動

```bash
# 檢查容器日誌
docker logs openclaw --tail=50

# 檢查資源使用
docker stats --no-stream

# 進入容器除錯
docker exec -it openclaw /bin/sh

# 檢查網路連通性
docker exec openclaw curl -s http://ollama:11434/api/tags
```

### 磁碟空間不足

```bash
# 清除未使用的映像和容器
docker system prune -a --volumes

# 查看各 volume 的大小
docker system df -v
```

:::danger 資料遺失風險
`docker system prune --volumes` 會刪除所有未使用的 volumes，包含您的資料。執行前請確認已備份重要資料。
:::

### Podman 特有問題

```bash
# Rootless 模式下埠號限制（需要 >= 1024）
# 解決方案 1：使用高位埠
podman run -p 8080:3000 ghcr.io/openclaw/openclaw:latest

# 解決方案 2：設定 sysctl
sudo sysctl net.ipv4.ip_unprivileged_port_start=80

# SELinux 權限問題
podman run -v /opt/openclaw:/app/data:Z ghcr.io/openclaw/openclaw:latest
# :Z 標記會自動設定 SELinux context
```

## 升級流程

```bash
# 1. 備份現有資料（非常重要！）
./backup-openclaw.sh

# 2. 拉取最新映像
docker compose pull

# 3. 重新啟動（自動使用新映像）
docker compose up -d

# 4. 驗證
docker compose ps
curl -s http://localhost:3000/health | jq

# 5. 如果有問題，回滾
docker compose down
docker compose up -d --force-recreate
```

## 下一步

部署完成後，建議繼續閱讀：

- [雲端部署指南](./cloud-deployment.md) — 在 AWS、GCP、Azure 等平台部署
- 管理員設定 — 使用者管理、權限設定
- 模型設定 — 連接各種 AI 模型供應商
