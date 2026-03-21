---
title: Installation Guide
description: Step-by-step instructions for installing OpenClaw on macOS, Linux, and Windows WSL2, including system requirements, security configuration, and Podman recommendations.
sidebar_position: 1
---

# Installation Guide

This guide walks you through installing OpenClaw from scratch. The entire process takes roughly 10-15 minutes.

---

## System Requirements

Before installing, verify that your system meets the following minimum requirements:

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Operating System** | macOS 13+, Ubuntu 22.04+, Windows 11 (WSL2) | macOS 14+ or Ubuntu 24.04 |
| **Node.js** | 22.16+ | **24.x (recommended)** |
| **RAM** | 4 GB | 8 GB or more |
| **Disk Space** | 2 GB | 5 GB (including skill cache) |
| **Container Engine** | Docker 24+ or Podman 5+ | **Podman 5+ (recommended)** |

:::warning Node.js Version Matters
OpenClaw makes heavy use of features introduced in Node.js 22.16. Using an older version will cause unpredictable errors. Node.js 24.x is strongly recommended for the best performance and compatibility.
:::

---

## Installing Node.js

If you do not yet have a suitable version of Node.js, we recommend using **nvm** (Node Version Manager):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Reload your shell config
source ~/.bashrc  # or source ~/.zshrc

# Install Node.js 24
nvm install 24
nvm use 24

# Verify the version
node --version
# Should display v24.x.x
```

---

## macOS Installation

### Option 1: Homebrew (Recommended)

```bash
# Install OpenClaw
brew tap openclaw/tap
brew install openclaw

# Verify installation
openclaw --version
```

### Option 2: npm

```bash
# Global install
npm install -g @openclaw/cli

# Verify installation
openclaw --version
```

### Option 3: Build from Source

```bash
# Clone the repository
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# Install dependencies
npm install

# Build
npm run build

# Link globally
npm link

# Verify
openclaw --version
```

---

## Linux Installation (Ubuntu / Debian)

```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Make sure Node.js 24 is installed (see nvm instructions above)

# Install via npm
npm install -g @openclaw/cli

# Verify installation
openclaw --version
```

### Arch Linux

```bash
# AUR install
yay -S openclaw
```

### Fedora / RHEL

```bash
# Install via npm
npm install -g @openclaw/cli
```

---

## Windows Installation (WSL2)

:::info Windows Users
OpenClaw **does not support** native Windows. You must use WSL2 (Windows Subsystem for Linux 2) to run it.
:::

```bash
# Step 1: Enable WSL2 (run in PowerShell as Administrator)
wsl --install -d Ubuntu-24.04

# Step 2: Enter the WSL2 environment
wsl

# Step 3: Install Node.js (inside WSL2 Ubuntu)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 24

# Step 4: Install OpenClaw
npm install -g @openclaw/cli

# Step 5: Verify
openclaw --version
```

---

## Installing a Container Engine

OpenClaw's Skill Execution Layer relies on a container engine for sandboxing. We **strongly recommend Podman** over Docker.

### Why Podman?

| Feature | Docker | Podman |
|---------|--------|--------|
| Root Privileges | Requires root by default (daemon mode) | **Rootless (no root needed)** |
| Background Service | Requires dockerd daemon | No daemon |
| Security | Larger attack surface | **Smaller attack surface** |
| Compatibility | Docker CLI | Fully Docker CLI-compatible |

:::danger Security Consideration
The Docker daemon runs with root privileges. If an OpenClaw skill sandbox is breached, an attacker could gain root access to the host. Podman's rootless mode dramatically reduces this risk.
:::

### Installing Podman

```bash
# macOS
brew install podman
podman machine init
podman machine start

# Ubuntu / Debian
sudo apt install -y podman

# Fedora
sudo dnf install -y podman
```

### Installing Docker (If You Still Prefer Docker)

```bash
# macOS
brew install --cask docker

# Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in for the group change to take effect
```

---

## First Run and Verification

After installation, run the following command to initialize OpenClaw:

```bash
# Initialize OpenClaw (creates the config directory)
openclaw init

# You should see output similar to:
# 🦞 OpenClaw initialized!
# Config directory: ~/.openclaw/
# Gateway port: 18789
# Container engine: podman
```

Verify that all components are working correctly:

```bash
# Run the health check
openclaw doctor

# Expected output:
# ✓ Node.js v24.x.x
# ✓ Podman 5.x.x (rootless)
# ✓ Gateway port 18789 available
# ✓ Config directory ~/.openclaw/ exists
# ✓ Memory system initialized
# All checks passed!
```

---

## Security Configuration: Bind Address

This is the **single most important security step** in the installation process.

The OpenClaw Gateway listens on port 18789 by default. You **must** ensure it is bound only to `127.0.0.1` (localhost) and **not** to `0.0.0.0` (all network interfaces).

Check your configuration file:

```bash
# View the Gateway config
cat ~/.openclaw/gateway.yaml
```

Confirm the `bind` field value:

```yaml
# ~/.openclaw/gateway.yaml

gateway:
  port: 18789
  # ✅ Correct: bound to localhost only
  bind: "127.0.0.1"

  # ❌ Wrong: this exposes the Gateway to the entire network!
  # bind: "0.0.0.0"
```

:::danger 30,000+ Hacked Instances — Learn from Their Mistake
CVE-2026-25253 allows attackers to execute remote code through an exposed port 18789. Over 30,000 OpenClaw instances have been compromised because they were bound to `0.0.0.0`. **Never** expose the Gateway port to the public network.

If you need remote access, use an SSH tunnel or VPN:

```bash
# Securely access a remote OpenClaw instance via SSH tunnel
ssh -L 18789:127.0.0.1:18789 user@your-server
```
:::

---

## Firewall Recommendations

Even after correctly binding to `127.0.0.1`, an extra layer of defense is always worthwhile:

```bash
# macOS — using pf
echo "block in proto tcp from any to any port 18789" | sudo pfctl -ef -

# Linux — using ufw
sudo ufw deny 18789/tcp

# Linux — using iptables
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP
sudo iptables -A INPUT -p tcp -s 127.0.0.1 --dport 18789 -j ACCEPT
```

---

## Directory Structure

After initialization, OpenClaw creates the following directory layout:

```
~/.openclaw/
├── gateway.yaml          # Gateway configuration
├── soul.md               # AI personality definition
├── providers/            # LLM provider configuration
│   └── default.yaml
├── channels/             # Messaging platform connections
├── skills/               # Installed skills
│   └── .cache/           # Skill cache
├── memory/               # Memory system data
│   ├── wal/              # Write-Ahead Log
│   └── compacted/        # Compacted long-term memory
└── logs/                 # Runtime logs
```

---

## Common Installation Issues

### `npm install -g` Permission Denied

```bash
# Do NOT use sudo npm install -g!
# Use nvm to manage Node.js and you won't have permission issues

# Alternatively, change the npm global directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Podman Machine Won't Start (macOS)

```bash
# Reset the Podman machine
podman machine rm
podman machine init --cpus 2 --memory 4096
podman machine start
```

### WSL2 Out of Memory

Create a `.wslconfig` file in your Windows user directory:

```ini
# C:\Users\YourUsername\.wslconfig
[wsl2]
memory=8GB
swap=4GB
```

---

## Next Steps

Installation complete! Head over to [First Setup](./first-setup.md) to finish the initial configuration.
