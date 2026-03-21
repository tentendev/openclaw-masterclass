---
title: "Module 10: Production Deployment"
sidebar_position: 11
description: "Learn how to deploy OpenClaw to production, including VPS setup, Docker/Podman containerization, Nix reproducible builds, and systemd service management"
keywords: [OpenClaw, production, deployment, VPS, Docker, Podman, Nix, systemd]
---

# Module 10: Production Deployment

## Learning Objectives

By the end of this module, you will be able to:

- Select and configure a VPS host suitable for OpenClaw
- Deploy using Docker or Podman containerization
- Use Nix for reproducible build environments
- Set up a systemd service to keep your Agent running
- Configure comprehensive monitoring, logging, and backup strategies
- Complete a full development-to-production deployment workflow

## Core Concepts

### Deployment Method Comparison

| Method | Pros | Cons | Best For |
|---|---|---|---|
| **Direct install** | Simple, low overhead | Environment pollution, hard to reproduce | Dev/test |
| **Docker** | Mature ecosystem, rich images | Requires root daemon | General deployment |
| **Podman** | Rootless, no daemon, secure | Smaller ecosystem | Security-sensitive environments |
| **Nix** | Fully reproducible, declarative | Steep learning curve | Advanced deployment, CI/CD |
| **systemd** | Native Linux service management | Linux only | Complement to any of the above |

### Hardware Requirements

| Scale | CPU | RAM | Storage | Notes |
|---|---|---|---|---|
| Minimum | 2 vCPU | 4 GB | 20 GB SSD | Single Agent, no browser |
| Recommended | 4 vCPU | 8 GB | 50 GB SSD | Single Agent with browser |
| Multi-Agent | 8 vCPU | 16 GB | 100 GB SSD | 2-3 Agents with browser |
| Enterprise | 16+ vCPU | 32+ GB | 200+ GB NVMe | Multi-Agent + monitoring + logging |

### Recommended VPS Providers

| Provider | Entry Plan | Monthly Cost (approx.) | Notes |
|---|---|---|---|
| Hetzner | CX22 (2vCPU/4GB) | ~$4.5 | European DCs, best value |
| DigitalOcean | Basic (2vCPU/4GB) | ~$24 | Simple and user-friendly |
| Linode/Akamai | Nanode (1vCPU/2GB) | ~$5 | Lowest entry point |
| Vultr | Cloud Compute | ~$6 | Many global locations |
| AWS EC2 | t3.medium | ~$30 | Enterprise needs |

## Implementation: VPS + Podman Deployment

### Step 1: VPS Initial Setup

```bash
# Example using Hetzner CX22, connect to VPS
ssh root@YOUR_VPS_IP

# Create a non-root user
adduser openclaw
usermod -aG sudo openclaw

# Set up SSH key login (more secure)
mkdir -p /home/openclaw/.ssh
cp ~/.ssh/authorized_keys /home/openclaw/.ssh/
chown -R openclaw:openclaw /home/openclaw/.ssh
chmod 700 /home/openclaw/.ssh
chmod 600 /home/openclaw/.ssh/authorized_keys

# Disable password login
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw enable

# DO NOT open port 18789!
# Use an SSH tunnel for remote access instead
```

:::danger Never Expose Port 18789
Recall the lesson from [Module 9: Security](./module-09-security): over 135,000 OpenClaw instances worldwide were compromised because port 18789 was exposed. Always use an SSH tunnel for remote access.

```bash
# Create an SSH tunnel from your local machine
ssh -L 18789:127.0.0.1:18789 openclaw@YOUR_VPS_IP
# Then access http://127.0.0.1:18789 locally
```
:::

### Step 2: Install Podman

```bash
# Switch to the openclaw user
su - openclaw

# Install Podman (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y podman slirp4netns fuse-overlayfs

# Confirm Podman version
podman --version

# Confirm rootless mode is available
podman info | grep -i rootless

# Configure subuid/subgid (required for rootless)
sudo usermod --add-subuids 100000-165535 openclaw
sudo usermod --add-subgids 100000-165535 openclaw
```

### Step 3: Prepare Configuration Files

```bash
# Create directory structure
mkdir -p ~/openclaw/{config,data,logs,skills,tls}
```

Create `settings.json`:

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

Create an environment variables file:

```bash
# ~/openclaw/.env (ensure permissions are 600)
cat > ~/openclaw/.env << 'EOF'
OPENCLAW_API_KEY=your_api_key_here
OPENAI_API_KEY=sk-your-openai-key
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_GUILD_ID=your-guild-id
EOF

chmod 600 ~/openclaw/.env
```

### Step 4: Launch with Podman

```bash
# Pull the OpenClaw image
podman pull ghcr.io/openclaw/openclaw:latest

# Start the container
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

# Confirm container status
podman ps

# View logs
podman logs -f openclaw
```

:::tip SYS_ADMIN Capability
`--cap-add=SYS_ADMIN` is required for Headless Chromium to run inside a container. If you don't need browser capabilities, you can remove this capability for stronger security.
:::

### Step 5: systemd User Service

Create a systemd service so the Podman container starts automatically on boot:

```bash
# Create systemd user service directory
mkdir -p ~/.config/systemd/user/

# Auto-generate a systemd service from the Podman container
podman generate systemd --name openclaw --new --files
mv container-openclaw.service ~/.config/systemd/user/

# Or manually create the service file
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

# Enable and start the service
systemctl --user daemon-reload
systemctl --user enable openclaw.service
systemctl --user start openclaw.service

# Ensure the user's systemd services run even when not logged in
loginctl enable-linger openclaw

# Check status
systemctl --user status openclaw.service
```

### Step 6: Nix Reproducible Deployment (Advanced)

If you prefer Nix's declarative deployment:

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

          # Firewall
          networking.firewall = {
            enable = true;
            allowedTCPPorts = [ 22 ];
            # Do NOT open 18789
          };

          # Auto-update
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

Deploy:

```bash
# Build and deploy
nixos-rebuild switch --flake .#openclaw-server

# Or deploy remotely
nixos-rebuild switch --flake .#openclaw-server \
  --target-host openclaw@YOUR_VPS_IP
```

### Step 7: Monitoring & Logging

**Log aggregation:**

```bash
# View systemd service logs with journalctl
journalctl --user -u openclaw.service -f

# Use Loki + Grafana for log aggregation
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

**Health check script:**

```bash
#!/bin/bash
# ~/openclaw/scripts/health-check.sh

OPENCLAW_URL="http://127.0.0.1:18789/api/health"
ALERT_WEBHOOK="${DISCORD_WEBHOOK_URL}"

response=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${OPENCLAW_API_KEY}" \
  "$OPENCLAW_URL")

if [ "$response" != "200" ]; then
  # Attempt restart
  systemctl --user restart openclaw.service

  # Send Discord notification
  curl -X POST "$ALERT_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "{
      \"content\": \"OpenClaw health check failed (HTTP $response). Restart attempted.\"
    }"
fi
```

```bash
# Add to crontab
chmod +x ~/openclaw/scripts/health-check.sh
crontab -e
# Add:
# */5 * * * * /home/openclaw/openclaw/scripts/health-check.sh
```

### Step 8: Backup Strategy

```bash
#!/bin/bash
# ~/openclaw/scripts/backup.sh

BACKUP_DIR="/home/openclaw/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# Backup data (excluding temp files)
tar -czf "$BACKUP_DIR/openclaw-data-$DATE.tar.gz" \
  -C /home/openclaw/openclaw \
  --exclude='*.tmp' \
  --exclude='logs/*.log.*' \
  data/ config/ skills/

# Backup soul.md
cp ~/openclaw/config/soul.md "$BACKUP_DIR/soul-$DATE.md"

# Clean old backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.md" -mtime +$RETENTION_DAYS -delete

# Optional: upload to remote storage
# rclone copy "$BACKUP_DIR/openclaw-data-$DATE.tar.gz" remote:openclaw-backups/

echo "Backup complete: openclaw-data-$DATE.tar.gz"
```

```bash
# Daily automatic backup
crontab -e
# Add:
# 0 3 * * * /home/openclaw/openclaw/scripts/backup.sh >> /home/openclaw/openclaw/logs/backup.log 2>&1
```

## Common Errors

| Issue | Cause | Solution |
|---|---|---|
| Container exits immediately after start | Environment variables not set | Verify `.env` file contents and path |
| Chromium won't start | Missing `SYS_ADMIN` capability | Add `--cap-add=SYS_ADMIN` |
| systemd service doesn't start on boot | Linger not enabled | Run `loginctl enable-linger` |
| Disk space exhausted | Logs not rotated | Configure `max_size_mb` and `max_files` |
| DNS resolution fails inside container | Podman network configuration issue | Add `--dns=8.8.8.8` |
| SELinux blocks volume mounts | SELinux label mismatch | Use the `:Z` flag when mounting volumes |

## Troubleshooting

```bash
# Container won't start -- view detailed logs
podman logs openclaw 2>&1 | tail -50

# Network issues
podman exec openclaw curl -s http://127.0.0.1:18789/api/health

# File permission issues
podman exec openclaw ls -la /data/
podman unshare ls -la ~/openclaw/data/

# systemd service failure
systemctl --user status openclaw.service
journalctl --user -u openclaw.service --no-pager -n 50

# Resource usage
podman stats openclaw --no-stream
```

## Exercises

### Exercise 1: Basic VPS Deployment
Deploy OpenClaw on a VPS using Podman, ensuring:
- Listens only on 127.0.0.1
- Managed by systemd
- Health check script configured

### Exercise 2: Full Monitoring
Add Prometheus + Grafana monitoring to your Exercise 1 deployment. Build dashboards for:
- Agent response time
- LLM API usage
- Memory / CPU utilization
- Error rate

### Exercise 3: Disaster Recovery
Simulate the following scenarios and develop recovery plans:
- VPS hard disk failure
- LLM API Key leak
- Agent injected with a malicious prompt

## Quiz

1. **Why is `loginctl enable-linger` recommended?**
   - A) Performance improvement
   - B) Keeps the user's systemd services running even when the user is not logged in
   - C) Enables root privileges
   - D) Auto-updates the system

   <details><summary>View Answer</summary>B) By default, user systemd services stop when the user logs out. `enable-linger` ensures services keep running even when the user is not logged in.</details>

2. **What is the purpose of Podman's `--read-only` combined with `--tmpfs`?**
   - A) Improve disk performance
   - B) The read-only filesystem prevents malicious file writes, while tmpfs provides necessary temporary storage
   - C) Save disk space
   - D) Encrypt the filesystem

   <details><summary>View Answer</summary>B) `--read-only` ensures attackers cannot write backdoors or malicious programs inside the container. `--tmpfs` provides in-memory temporary storage for directories like /tmp that need write access.</details>

3. **What does `max_files: 10` combined with `max_size_mb: 100` mean for log rotation?**
   - A) A maximum of 10 files, each up to 100MB, totaling approximately 1GB of logs
   - B) 10MB of total logs
   - C) All logs kept forever
   - D) A new file every 10 minutes

   <details><summary>View Answer</summary>A) When a log file reaches 100MB it automatically rotates, with a maximum of 10 historical files retained, so logs occupy approximately 1GB of disk space at most.</details>

4. **Which of the following is NOT an essential backup item?**
   - A) `data/` directory (Agent memory and data)
   - B) `settings.json`
   - C) `soul.md`
   - D) Podman image cache

   <details><summary>View Answer</summary>D) Podman images can be re-pulled from the registry at any time and don't need to be backed up. What matters is the Agent's data, configuration, and soul.md.</details>

## Next Steps

- [Module 9: Security](./module-09-security) -- Ensure your deployment meets security requirements
- [Module 6: Cron Jobs / Heartbeat](./module-06-automation) -- Set up scheduled tasks in production
- [Module 8: Multi-Agent Architecture](./module-08-multi-agent) -- Deploy multi-Agent environments on VPS
- [Module 12: Enterprise Applications](./module-12-enterprise) -- Larger-scale enterprise deployment strategies
