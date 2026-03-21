---
title: "모듈 10: 프로덕션 환경 배포"
sidebar_position: 11
description: "OpenClaw를 프로덕션 환경에 배포하는 방법 학습 — VPS 설정, Docker/Podman 컨테이너화, Nix 재현 가능한 빌드, systemd 서비스 관리"
---

# 模組 10: 正式環境배포

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- 選擇並설정適合 OpenClaw 的 VPS 主機
- 使用 Docker 或 Podman 進行컨테이너化배포
- 使用 Nix 實現可重現的建構環境
- 생성 systemd 服務確保 Agent 持續運行
- 설정完善的모니터링、로그與백업策略
- 完成從開發到正式環境的完整배포流程

## 핵심 개념

### 배포方式比較

| 배포方式 | 優點 | 缺點 | 適用場景 |
|----------|------|------|---------|
| **直接설치** | 簡單、低開銷 | 環境污染、難以重現 | 開發테스트 |
| **Docker** | 生態系成熟、映像豐富 | 需要 root daemon | 一般배포 |
| **Podman** | Rootless、無 daemon、安全 | 生態系較小 | 安全敏感環境 |
| **Nix** | 完全可重現、宣告式 | 學習曲線高 | 進階배포、CI/CD |
| **systemd** | 原生 Linux 服務管理 | Linux 限定 | 搭配上述任一方案 |

### 硬體需求

| 規模 | CPU | RAM | 저장 | 說明 |
|------|-----|-----|------|------|
| 最小可用 | 2 vCPU | 4 GB | 20 GB SSD | 單 Agent、無브라우저 |
| 建議 | 4 vCPU | 8 GB | 50 GB SSD | 單 Agent、含브라우저 |
| 多 Agent | 8 vCPU | 16 GB | 100 GB SSD | 2-3 Agent、含브라우저 |
| 엔터프라이즈級 | 16+ vCPU | 32+ GB | 200+ GB NVMe | 多 Agent + 모니터링 + 로그 |

### 推薦 VPS 服務商

| 服務商 | 最低方案 | 月費（約） | 備註 |
|--------|---------|-----------|------|
| Hetzner | CX22 (2vCPU/4GB) | ~$4.5 | 歐洲機房，CP 值最高 |
| DigitalOcean | Basic (2vCPU/4GB) | ~$24 | 簡單易用 |
| Linode/Akamai | Nanode (1vCPU/2GB) | ~$5 | 最低入門 |
| Vultr | Cloud Compute | ~$6 | 全球節點多 |
| AWS EC2 | t3.medium | ~$30 | 엔터프라이즈級需求 |

## 실습 튜토리얼：VPS + Podman 배포

### 步驟一：VPS 初始설정

```bash
# 以 Hetzner CX22 為例，連線至 VPS
ssh root@YOUR_VPS_IP

# 생성非 root 사용자
adduser openclaw
usermod -aG sudo openclaw

# 설정 SSH Key 登入（更安全）
mkdir -p /home/openclaw/.ssh
cp ~/.ssh/authorized_keys /home/openclaw/.ssh/
chown -R openclaw:openclaw /home/openclaw/.ssh
chmod 700 /home/openclaw/.ssh
chmod 600 /home/openclaw/.ssh/authorized_keys

# 停用비밀번호登入
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# 설정防火牆
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw enable

# ⚠️ 不要開放 18789 port！
# 如需遠端存取，使用 SSH tunnel
```

:::danger 절대 port 18789를 개방하지 마세요
重溫 [模組 9: 安全性](./module-09-security) 的教訓：全球有超過 135,000 個 OpenClaw 實例因為暴露 port 18789 而被入侵。永遠使用 SSH tunnel 來遠端存取。

```bash
# 從本機생성 SSH tunnel
ssh -L 18789:127.0.0.1:18789 openclaw@YOUR_VPS_IP
# 然後在本機使用 http://127.0.0.1:18789 存取
```
:::

### 步驟二：설치 Podman

```bash
# 切換至 openclaw 사용자
su - openclaw

# 설치 Podman（Ubuntu/Debian）
sudo apt-get update
sudo apt-get install -y podman slirp4netns fuse-overlayfs

# 確認 Podman 版本
podman --version

# 確認 rootless 模式可用
podman info | grep -i rootless

# 설정 subuid/subgid（rootless 需要）
sudo usermod --add-subuids 100000-165535 openclaw
sudo usermod --add-subgids 100000-165535 openclaw
```

### 步驟三：準備설정 파일

```bash
# 생성目錄結構
mkdir -p ~/openclaw/{config,data,logs,skills,tls}
```

생성 `settings.json`：

```json
{
  "server": {
    "host": "127.0.0.1",
    "port": 18789,
    "auth": {
      "enabled": true,
      "api_key": "${OPENCLAW_API_KEY}"
    }
  },
  "llm": {
    "provider": "openai",
    "model": "gpt-4o",
    "api_key": "${OPENAI_API_KEY}",
    "max_tokens": 4096,
    "temperature": 0.7
  },
  "channels": {
    "discord": {
      "enabled": true,
      "token": "${DISCORD_BOT_TOKEN}",
      "guild_id": "${DISCORD_GUILD_ID}"
    }
  },
  "browser": {
    "enabled": true,
    "headless": true,
    "launch_options": {
      "args": ["--no-sandbox", "--disable-dev-shm-usage"]
    }
  },
  "logging": {
    "level": "info",
    "file": "/data/logs/openclaw.log",
    "max_size_mb": 100,
    "max_files": 10,
    "rotation": "daily"
  },
  "data_dir": "/data"
}
```

생성環境變數檔案：

```bash
# ~/openclaw/.env（確保권한為 600）
cat > ~/openclaw/.env << 'EOF'
OPENCLAW_API_KEY=your_api_key_here
OPENAI_API_KEY=sk-your-openai-key
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_GUILD_ID=your-guild-id
EOF

chmod 600 ~/openclaw/.env
```

### 步驟四：使用 Podman 啟動

```bash
# 拉取 OpenClaw 映像
podman pull ghcr.io/openclaw/openclaw:latest

# 啟動컨테이너
podman run -d \
  --name openclaw \
  --userns=keep-id \
  --security-opt=no-new-privileges \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  --cap-add=SYS_ADMIN \
  --read-only \
  --tmpfs /tmp:rw,size=200m \
  --tmpfs /run:rw,size=50m \
  -p 127.0.0.1:18789:18789 \
  -v ~/openclaw/config/settings.json:/app/settings.json:ro,Z \
  -v ~/openclaw/config/soul.md:/app/soul.md:ro,Z \
  -v ~/openclaw/data:/data:Z \
  -v ~/openclaw/skills:/app/skills:ro,Z \
  --env-file ~/openclaw/.env \
  --memory=4g \
  --cpus=2 \
  --restart=unless-stopped \
  ghcr.io/openclaw/openclaw:latest

# 確認컨테이너狀態
podman ps

# 조회로그
podman logs -f openclaw
```

:::tip SYS_ADMIN capability
`--cap-add=SYS_ADMIN` 是 Headless Chromium 在컨테이너中運行所需的。如果不需要브라우저功能，可以移除此 capability 以增強安全性。
:::

### 步驟五：systemd 사용자服務

생성 systemd 服務讓 Podman 컨테이너在開機時自動啟動：

```bash
# 생성 systemd 사용자服務目錄
mkdir -p ~/.config/systemd/user/

# 從 Podman 컨테이너自動產生 systemd 服務
podman generate systemd --name openclaw --new --files
mv container-openclaw.service ~/.config/systemd/user/

# 或手動생성服務檔案
cat > ~/.config/systemd/user/openclaw.service << 'EOF'
[Unit]
Description=OpenClaw AI Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
Restart=always
RestartSec=10
TimeoutStartSec=60
TimeoutStopSec=30

ExecStartPre=-/usr/bin/podman rm -f openclaw
ExecStart=/usr/bin/podman run \
  --name openclaw \
  --userns=keep-id \
  --security-opt=no-new-privileges \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  --cap-add=SYS_ADMIN \
  --read-only \
  --tmpfs /tmp:rw,size=200m \
  --tmpfs /run:rw,size=50m \
  -p 127.0.0.1:18789:18789 \
  -v %h/openclaw/config/settings.json:/app/settings.json:ro,Z \
  -v %h/openclaw/config/soul.md:/app/soul.md:ro,Z \
  -v %h/openclaw/data:/data:Z \
  -v %h/openclaw/skills:/app/skills:ro,Z \
  --env-file %h/openclaw/.env \
  --memory=4g \
  --cpus=2 \
  ghcr.io/openclaw/openclaw:latest

ExecStop=/usr/bin/podman stop -t 30 openclaw
ExecStopPost=-/usr/bin/podman rm -f openclaw

[Install]
WantedBy=default.target
EOF

# 啟用並啟動服務
systemctl --user daemon-reload
systemctl --user enable openclaw.service
systemctl --user start openclaw.service

# 確保사용자 systemd 在未登入時仍運行
loginctl enable-linger openclaw

# 檢查狀態
systemctl --user status openclaw.service
```

### 步驟六：Nix 可重現배포（進階）

如果你偏好 Nix 的宣告式배포：

```nix
# flake.nix
{
  description = "OpenClaw production deployment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openclaw.url = "github:openclaw/openclaw";
  };

  outputs = { self, nixpkgs, openclaw }: {
    nixosConfigurations.openclaw-server = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        ./hardware-configuration.nix
        openclaw.nixosModules.default
        ({ config, pkgs, ... }: {
          services.openclaw = {
            enable = true;
            settings = {
              server.host = "127.0.0.1";
              server.port = 18789;
              llm.provider = "openai";
              llm.model = "gpt-4o";
              browser.enabled = true;
              browser.headless = true;
            };
            environmentFile = "/run/secrets/openclaw.env";
          };

          # 防火牆
          networking.firewall = {
            enable = true;
            allowedTCPPorts = [ 22 ];
            # 不開放 18789
          };

          # 自動업데이트
          system.autoUpgrade = {
            enable = true;
            flake = "github:openclaw/openclaw";
            dates = "04:00";
          };
        })
      ];
    };
  };
}
```

배포：

```bash
# 建構並배포
nixos-rebuild switch --flake .#openclaw-server

# 或遠端배포
nixos-rebuild switch --flake .#openclaw-server \
  --target-host openclaw@YOUR_VPS_IP
```

### 步驟七：모니터링與로그

**로그聚合：**

```bash
# 使用 journalctl 조회 systemd 服務로그
journalctl --user -u openclaw.service -f

# 搭配 loki + grafana 進行로그聚合
# docker-compose.monitoring.yml
```

```yaml
# monitoring/docker-compose.yml
version: '3'
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "127.0.0.1:9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: "${GRAFANA_PASSWORD}"
```

**健康檢查腳本：**

```bash
#!/bin/bash
# ~/openclaw/scripts/health-check.sh

OPENCLAW_URL="http://127.0.0.1:18789/api/health"
ALERT_WEBHOOK="${DISCORD_WEBHOOK_URL}"

response=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${OPENCLAW_API_KEY}" \
  "$OPENCLAW_URL")

if [ "$response" != "200" ]; then
  # 嘗試重啟
  systemctl --user restart openclaw.service

  # 發送 Discord 通知
  curl -X POST "$ALERT_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "{
      \"content\": \"⚠️ OpenClaw 健康檢查失敗 (HTTP $response)，已嘗試重啟。\"
    }"
fi
```

```bash
# 加入 crontab
chmod +x ~/openclaw/scripts/health-check.sh
crontab -e
# 加入：
# */5 * * * * /home/openclaw/openclaw/scripts/health-check.sh
```

### 步驟八：백업策略

```bash
#!/bin/bash
# ~/openclaw/scripts/backup.sh

BACKUP_DIR="/home/openclaw/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# 백업데이터（排除임시 저장檔）
tar -czf "$BACKUP_DIR/openclaw-data-$DATE.tar.gz" \
  -C /home/openclaw/openclaw \
  --exclude='*.tmp' \
  --exclude='logs/*.log.*' \
  data/ config/ skills/

# 백업 soul.md
cp ~/openclaw/config/soul.md "$BACKUP_DIR/soul-$DATE.md"

# 清理舊백업
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.md" -mtime +$RETENTION_DAYS -delete

# 可選：업로드至遠端저장
# rclone copy "$BACKUP_DIR/openclaw-data-$DATE.tar.gz" remote:openclaw-backups/

echo "백업完成: openclaw-data-$DATE.tar.gz"
```

```bash
# 每日自動백업
crontab -e
# 加入：
# 0 3 * * * /home/openclaw/openclaw/scripts/backup.sh >> /home/openclaw/openclaw/logs/backup.log 2>&1
```

## 자주 발생하는 오류

| 問題 | 原因 | 解決方案 |
|------|------|---------|
| 컨테이너啟動後立即退出 | 環境變數未설정 | 確認 `.env` 檔案內容和路徑 |
| Chromium 無法啟動 | 缺少 `SYS_ADMIN` capability | 加入 `--cap-add=SYS_ADMIN` |
| systemd 服務開機不啟動 | 未啟用 linger | 실행 `loginctl enable-linger` |
| 磁碟空間不足 | 로그未輪替 | 설정 `max_size_mb` 和 `max_files` |
| 컨테이너內無法解析 DNS | Podman 網路설정問題 | 加入 `--dns=8.8.8.8` |
| SELinux 阻擋 volume 掛載 | SELinux 標籤不符 | 使用 `:Z` 標記掛載 volume |

## 문제 해결

```bash
# 컨테이너無法啟動 — 조회詳細로그
podman logs openclaw 2>&1 | tail -50

# 網路問題
podman exec openclaw curl -s http://127.0.0.1:18789/api/health

# 檔案권한問題
podman exec openclaw ls -la /data/
podman unshare ls -la ~/openclaw/data/

# systemd 服務失敗
systemctl --user status openclaw.service
journalctl --user -u openclaw.service --no-pager -n 50

# 資源使用狀況
podman stats openclaw --no-stream
```

## 연습 문제

### 연습 1：基礎 VPS 배포
在一台 VPS 上使用 Podman 배포 OpenClaw，確保：
- 只監聽 127.0.0.1
- 使用 systemd 管理
- 설정健康檢查腳本

### 연습 2：完整모니터링
為練習 1 的배포加入 Prometheus + Grafana 모니터링，생성以下 Dashboard：
- Agent 回應時間
- LLM API 使用量
- 記憶體 / CPU 使用率
- 錯誤率

### 연습 3：災難復原
模擬以下場景並制定復原計畫：
- VPS 硬碟故障
- LLM API Key 外洩
- Agent 被注入惡意 Prompt

## 퀴즈

1. **為什麼建議使用 `loginctl enable-linger`？**
   - A) 提升성능
   - B) 讓사용자的 systemd 服務在未登入時仍持續運行
   - C) 啟用 root 권한
   - D) 自動업데이트系統

   <details><summary>정답 확인</summary>B) 預設情況下，사용자的 systemd 服務會在사용자登出後停止。`enable-linger` 確保服務在사용자未登入時仍然運行。</details>

2. **Podman 的 `--read-only` 參數搭配 `--tmpfs` 的目的是什麼？**
   - A) 提升磁碟성능
   - B) 唯讀檔案系統防止被寫入惡意檔案，tmpfs 提供必要的임시 저장空間
   - C) 節省磁碟空間
   - D) 암호화檔案系統

   <details><summary>정답 확인</summary>B) `--read-only` 確保공격자無法在컨테이너中寫入後門或惡意程式。`--tmpfs` 為需要寫入的 /tmp 等目錄提供記憶體임시 저장空間。</details>

3. **로그輪替中 `max_files: 10` 搭配 `max_size_mb: 100` 代表什麼？**
   - A) 最多保留 10 個檔案，每個最大 100MB，即最多約 1GB 로그
   - B) 總共 10MB 的로그
   - C) 永遠保留所有로그
   - D) 每 10 分鐘產生新檔案

   <details><summary>정답 확인</summary>A) 當로그檔案達到 100MB 時會自動輪替，最多保留 10 個歷史檔案，因此로그最多佔用約 1GB 磁碟空間。</details>

4. **以下哪項不是必要的백업項目？**
   - A) `data/` 目錄（Agent 記憶與데이터）
   - B) `settings.json`
   - C) `soul.md`
   - D) Podman 映像캐시

   <details><summary>정답 확인</summary>D) Podman 映像可以隨時從 registry 重新拉取，不需要백업。重要的是 Agent 的데이터、설정和 soul.md。</details>

## 다음 단계

- [模組 9: 安全性](./module-09-security) — 確保배포符合安全要求
- [模組 6: Cron Jobs / Heartbeat](./module-06-automation) — 在正式環境中설정스케줄링任務
- [模組 8: 多 Agent 架構](./module-08-multi-agent) — 在 VPS 上배포多 Agent 環境
- [模組 12: 엔터프라이즈級應用](./module-12-enterprise) — 更大規模的엔터프라이즈배포策略
