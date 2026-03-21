---
title: "模块 10: 正式环境部署"
sidebar_position: 11
description: "学习如何将 OpenClaw 部署到正式环境，包含 VPS 配置、Docker/Podman 容器化、Nix 可复现构建、systemd 服务管理"
keywords: [OpenClaw, production, deployment, VPS, Docker, Podman, Nix, systemd, 部署, 正式环境]
---

# 模块 10: 正式环境部署

## 学习目标

完成本模块后，你将能够：

- 选择并配置适合 OpenClaw 的 VPS 主机
- 使用 Docker 或 Podman 进行容器化部署
- 使用 Nix 实现可复现的构建环境
- 创建 systemd 服务确保 Agent 持续运行
- 配置完善的监控、日志与备份策略
- 完成从开发到正式环境的完整部署流程

## 核心概念

### 部署方式比较

| 部署方式 | 优点 | 缺点 | 适用场景 |
|----------|------|------|---------|
| **直接安装** | 简单、低开销 | 环境污染、难以重现 | 开发测试 |
| **Docker** | 生态系统成熟、镜像丰富 | 需要 root daemon | 一般部署 |
| **Podman** | Rootless、无 daemon、安全 | 生态系统较小 | 安全敏感环境 |
| **Nix** | 完全可复现、声明式 | 学习曲线高 | 进阶部署、CI/CD |
| **systemd** | 原生 Linux 服务管理 | Linux 限定 | 搭配上述任一方案 |

### 硬件需求

| 规模 | CPU | RAM | 存储 | 说明 |
|------|-----|-----|------|------|
| 最小可用 | 2 vCPU | 4 GB | 20 GB SSD | 单 Agent、无浏览器 |
| 建议 | 4 vCPU | 8 GB | 50 GB SSD | 单 Agent、含浏览器 |
| 多 Agent | 8 vCPU | 16 GB | 100 GB SSD | 2-3 Agent、含浏览器 |
| 企业级 | 16+ vCPU | 32+ GB | 200+ GB NVMe | 多 Agent + 监控 + 日志 |

### 推荐 VPS 服务商

| 服务商 | 最低方案 | 月费（约） | 备注 |
|--------|---------|-----------|------|
| Hetzner | CX22 (2vCPU/4GB) | ~$4.5 | 欧洲机房，CP 值最高 |
| DigitalOcean | Basic (2vCPU/4GB) | ~$24 | 简单易用 |
| Linode/Akamai | Nanode (1vCPU/2GB) | ~$5 | 最低入门 |
| Vultr | Cloud Compute | ~$6 | 全球节点多 |
| AWS EC2 | t3.medium | ~$30 | 企业级需求 |

## 实现教程：VPS + Podman 部署

### 步骤一：VPS 初始配置

```bash
# 以 Hetzner CX22 为例，连接至 VPS
ssh root@YOUR_VPS_IP

# 创建非 root 用户
adduser openclaw
usermod -aG sudo openclaw

# 配置 SSH Key 登入（更安全）
mkdir -p /home/openclaw/.ssh
cp ~/.ssh/authorized_keys /home/openclaw/.ssh/
chown -R openclaw:openclaw /home/openclaw/.ssh
chmod 700 /home/openclaw/.ssh
chmod 600 /home/openclaw/.ssh/authorized_keys

# 禁用密码登入
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# 配置防火墙
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw enable

# ⚠️ 不要开放 18789 port！
# 如需远端存取，使用 SSH tunnel
```

:::danger 绝对不要开放 port 18789
重温 [模块 9: 安全性](./module-09-security) 的教训：全球有超过 135,000 个 OpenClaw 实例因为暴露 port 18789 而被入侵。永远使用 SSH tunnel 来远端存取。

```bash
# 从本机创建 SSH tunnel
ssh -L 18789:127.0.0.1:18789 openclaw@YOUR_VPS_IP
# 然后在本机使用 http://127.0.0.1:18789 存取
```
:::

### 步骤二：安装 Podman

```bash
# 切换至 openclaw 用户
su - openclaw

# 安装 Podman（Ubuntu/Debian）
sudo apt-get update
sudo apt-get install -y podman slirp4netns fuse-overlayfs

# 确认 Podman 版本
podman --version

# 确认 rootless 模式可用
podman info | grep -i rootless

# 配置 subuid/subgid（rootless 需要）
sudo usermod --add-subuids 100000-165535 openclaw
sudo usermod --add-subgids 100000-165535 openclaw
```

### 步骤三：准备配置文件

```bash
# 创建目录结构
mkdir -p ~/openclaw/{config,data,logs,skills,tls}
```

创建 `settings.json`：

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

创建环境变量文件：

```bash
# ~/openclaw/.env（确保权限为 600）
cat > ~/openclaw/.env << 'EOF'
OPENCLAW_API_KEY=your_api_key_here
OPENAI_API_KEY=sk-your-openai-key
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_GUILD_ID=your-guild-id
EOF

chmod 600 ~/openclaw/.env
```

### 步骤四：使用 Podman 启动

```bash
# 拉取 OpenClaw 镜像
podman pull ghcr.io/openclaw/openclaw:latest

# 启动容器
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

# 确认容器状态
podman ps

# 查看日志
podman logs -f openclaw
```

:::tip SYS_ADMIN capability
`--cap-add=SYS_ADMIN` 是 Headless Chromium 在容器中运行所需的。如果不需要浏览器功能，可以移除此 capability 以增强安全性。
:::

### 步骤五：systemd 用户服务

创建 systemd 服务让 Podman 容器在开机时自动启动：

```bash
# 创建 systemd 用户服务目录
mkdir -p ~/.config/systemd/user/

# 从 Podman 容器自动生成 systemd 服务
podman generate systemd --name openclaw --new --files
mv container-openclaw.service ~/.config/systemd/user/

# 或手动创建服务文件
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

# 启用并启动服务
systemctl --user daemon-reload
systemctl --user enable openclaw.service
systemctl --user start openclaw.service

# 确保用户 systemd 在未登入时仍运行
loginctl enable-linger openclaw

# 检查状态
systemctl --user status openclaw.service
```

### 步骤六：Nix 可复现部署（进阶）

如果你偏好 Nix 的声明式部署：

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

          # 防火墙
          networking.firewall = {
            enable = true;
            allowedTCPPorts = [ 22 ];
            # 不开放 18789
          };

          # 自动更新
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

部署：

```bash
# 构建并部署
nixos-rebuild switch --flake .#openclaw-server

# 或远端部署
nixos-rebuild switch --flake .#openclaw-server \
  --target-host openclaw@YOUR_VPS_IP
```

### 步骤七：监控与日志

**日志聚合：**

```bash
# 使用 journalctl 查看 systemd 服务日志
journalctl --user -u openclaw.service -f

# 搭配 loki + grafana 进行日志聚合
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

**健康检查脚本：**

```bash
#!/bin/bash
# ~/openclaw/scripts/health-check.sh

OPENCLAW_URL="http://127.0.0.1:18789/api/health"
ALERT_WEBHOOK="${DISCORD_WEBHOOK_URL}"

response=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${OPENCLAW_API_KEY}" \
  "$OPENCLAW_URL")

if [ "$response" != "200" ]; then
  # 尝试重启
  systemctl --user restart openclaw.service

  # 发送 Discord 通知
  curl -X POST "$ALERT_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "{
      \"content\": \"⚠️ OpenClaw 健康检查失败 (HTTP $response)，已尝试重启。\"
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

### 步骤八：备份策略

```bash
#!/bin/bash
# ~/openclaw/scripts/backup.sh

BACKUP_DIR="/home/openclaw/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# 备份数据（排除暂存档）
tar -czf "$BACKUP_DIR/openclaw-data-$DATE.tar.gz" \
  -C /home/openclaw/openclaw \
  --exclude='*.tmp' \
  --exclude='logs/*.log.*' \
  data/ config/ skills/

# 备份 soul.md
cp ~/openclaw/config/soul.md "$BACKUP_DIR/soul-$DATE.md"

# 清理旧备份
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.md" -mtime +$RETENTION_DAYS -delete

# 可选：上传至远端存储
# rclone copy "$BACKUP_DIR/openclaw-data-$DATE.tar.gz" remote:openclaw-backups/

echo "备份完成: openclaw-data-$DATE.tar.gz"
```

```bash
# 每日自动备份
crontab -e
# 加入：
# 0 3 * * * /home/openclaw/openclaw/scripts/backup.sh >> /home/openclaw/openclaw/logs/backup.log 2>&1
```

## 常见错误

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 容器启动后立即退出 | 环境变量未配置 | 确认 `.env` 文件内容和路径 |
| Chromium 无法启动 | 缺少 `SYS_ADMIN` capability | 加入 `--cap-add=SYS_ADMIN` |
| systemd 服务开机不启动 | 未启用 linger | 执行 `loginctl enable-linger` |
| 磁碟空间不足 | 日志未轮替 | 配置 `max_size_mb` 和 `max_files` |
| 容器内无法解析 DNS | Podman 网络配置问题 | 加入 `--dns=8.8.8.8` |
| SELinux 阻挡 volume 挂载 | SELinux 标签不符 | 使用 `:Z` 标记挂载 volume |

## 故障排除

```bash
# 容器无法启动 — 查看详细日志
podman logs openclaw 2>&1 | tail -50

# 网络问题
podman exec openclaw curl -s http://127.0.0.1:18789/api/health

# 文件权限问题
podman exec openclaw ls -la /data/
podman unshare ls -la ~/openclaw/data/

# systemd 服务失败
systemctl --user status openclaw.service
journalctl --user -u openclaw.service --no-pager -n 50

# 资源使用状况
podman stats openclaw --no-stream
```

## 练习题

### 练习 1：基础 VPS 部署
在一台 VPS 上使用 Podman 部署 OpenClaw，确保：
- 只监听 127.0.0.1
- 使用 systemd 管理
- 配置健康检查脚本

### 练习 2：完整监控
为练习 1 的部署加入 Prometheus + Grafana 监控，创建以下 Dashboard：
- Agent 响应时间
- LLM API 使用量
- 内存 / CPU 使用率
- 错误率

### 练习 3：灾难复原
模拟以下场景并制定复原计划：
- VPS 硬碟故障
- LLM API Key 外泄
- Agent 被注入恶意 Prompt

## 随堂测验

1. **为什么建议使用 `loginctl enable-linger`？**
   - A) 提升性能
   - B) 让用户的 systemd 服务在未登入时仍持续运行
   - C) 启用 root 权限
   - D) 自动更新系统

   <details><summary>查看答案</summary>B) 默认情况下，用户的 systemd 服务会在用户登出后停止。`enable-linger` 确保服务在用户未登入时仍然运行。</details>

2. **Podman 的 `--read-only` 参数搭配 `--tmpfs` 的目的是什么？**
   - A) 提升磁碟性能
   - B) 唯读文件系统防止被写入恶意文件，tmpfs 提供必要的暂存空间
   - C) 节省磁碟空间
   - D) 加密文件系统

   <details><summary>查看答案</summary>B) `--read-only` 确保攻击者无法在容器中写入后门或恶意进程。`--tmpfs` 为需要写入的 /tmp 等目录提供内存暂存空间。</details>

3. **日志轮替中 `max_files: 10` 搭配 `max_size_mb: 100` 代表什么？**
   - A) 最多保留 10 个文件，每个最大 100MB，即最多约 1GB 日志
   - B) 总共 10MB 的日志
   - C) 永远保留所有日志
   - D) 每 10 分钟生成新文件

   <details><summary>查看答案</summary>A) 当日志文件达到 100MB 时会自动轮替，最多保留 10 个历史文件，因此日志最多占用约 1GB 磁碟空间。</details>

4. **以下哪项不是必要的备份项目？**
   - A) `data/` 目录（Agent 记忆与数据）
   - B) `settings.json`
   - C) `soul.md`
   - D) Podman 镜像缓存

   <details><summary>查看答案</summary>D) Podman 镜像可以随时从 registry 重新拉取，不需要备份。重要的是 Agent 的数据、配置和 soul.md。</details>

## 建议下一步

- [模块 9: 安全性](./module-09-security) — 确保部署符合安全要求
- [模块 6: Cron Jobs / Heartbeat](./module-06-automation) — 在正式环境中配置调度任务
- [模块 8: 多 Agent 架构](./module-08-multi-agent) — 在 VPS 上部署多 Agent 环境
- [模块 12: 企业级应用](./module-12-enterprise) — 更大规模的企业部署策略
