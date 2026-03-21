---
title: 安装指南
description: 在 macOS、Linux 与 Windows WSL2 上安装 OpenClaw 的完整步骤，包含系统需求、安全配置与 Podman 建议。
sidebar_position: 1
---

# 安装指南

本篇将带你从零开始安装 OpenClaw。整个流程约需 10-15 分钟。

---

## 系统需求

在安装之前，请确认你的系统符合以下最低需求：

| 项目 | 最低需求 | 建议配置 |
|------|---------|---------|
| **操作系统** | macOS 13+、Ubuntu 22.04+、Windows 11 (WSL2) | macOS 14+ 或 Ubuntu 24.04 |
| **Node.js** | 22.16+ | **24.x（建议）** |
| **内存** | 4 GB | 8 GB 以上 |
| **磁盘空间** | 2 GB | 5 GB（含技能缓存） |
| **容器引擎** | Docker 24+ 或 Podman 5+ | **Podman 5+（建议）** |

:::warning Node.js 版本很重要
OpenClaw 大量使用 Node.js 22.16 引入的新特性。使用较旧版本会导致不可预期的错误。强烈建议使用 Node.js 24.x 以获得最佳性能与兼容性。
:::

---

## 安装 Node.js

如果你尚未安装合适版本的 Node.js，建议使用 **nvm**（Node Version Manager）：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 重新加载 shell 配置
source ~/.bashrc  # 或 source ~/.zshrc

# 安装 Node.js 24
nvm install 24
nvm use 24

# 验证版本
node --version
# 应显示 v24.x.x
```

---

## macOS 安装步骤

### 方法一：使用 Homebrew（推荐）

```bash
# 安装 OpenClaw
brew tap openclaw/tap
brew install openclaw

# 验证安装
openclaw --version
```

### 方法二：使用 npm

```bash
# 全局安装
npm install -g @openclaw/cli

# 验证安装
openclaw --version
```

### 方法三：从源代码编译

```bash
# 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 安装依赖
npm install

# 编译
npm run build

# 链接到全局
npm link

# 验证
openclaw --version
```

---

## Linux 安装步骤（Ubuntu / Debian）

```bash
# 更新软件包列表
sudo apt update && sudo apt upgrade -y

# 确保 Node.js 24 已安装（见上方 nvm 指示）

# 使用 npm 安装
npm install -g @openclaw/cli

# 验证安装
openclaw --version
```

### Arch Linux

```bash
# AUR 安装
yay -S openclaw
```

### Fedora / RHEL

```bash
# 使用 npm 安装
npm install -g @openclaw/cli
```

---

## Windows 安装步骤（WSL2）

:::info Windows 用户请注意
OpenClaw **不支持**原生 Windows 环境。你必须使用 WSL2（Windows Subsystem for Linux 2）来运行。
:::

```bash
# 步骤 1：启用 WSL2（在 PowerShell 中以管理员身份运行）
wsl --install -d Ubuntu-24.04

# 步骤 2：进入 WSL2 环境
wsl

# 步骤 3：安装 Node.js（在 WSL2 Ubuntu 中）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 24

# 步骤 4：安装 OpenClaw
npm install -g @openclaw/cli

# 步骤 5：验证
openclaw --version
```

---

## 安装容器引擎

OpenClaw 的技能执行层依赖容器引擎来提供沙箱环境。我们**强烈建议使用 Podman** 而非 Docker。

### 为什么选择 Podman？

| 比较项目 | Docker | Podman |
|---------|--------|--------|
| 根权限 | 默认需要 root（daemon 模式） | **Rootless（无需 root）** |
| 后台服务 | 需要 dockerd daemon | 无 daemon |
| 安全性 | 较高攻击面 | **较低攻击面** |
| 兼容性 | Docker CLI | 完全兼容 Docker CLI |

:::danger 安全考量
Docker daemon 以 root 权限运行，如果 OpenClaw 的技能沙箱被突破，攻击者可能获取主机的 root 权限。Podman 的 rootless 模式大幅降低了这个风险。
:::

### 安装 Podman

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

### 安装 Docker（如果你仍然选择 Docker）

```bash
# macOS
brew install --cask docker

# Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# 注销再登录以应用组变更
```

---

## 首次运行与验证

安装完成后，运行以下命令进行初始化：

```bash
# 初始化 OpenClaw（会创建配置目录）
openclaw init

# 你会看到类似以下输出：
# 🦞 OpenClaw initialized!
# Config directory: ~/.openclaw/
# Gateway port: 18789
# Container engine: podman
```

验证所有组件是否正常：

```bash
# 运行健康检查
openclaw doctor

# 预期输出：
# ✓ Node.js v24.x.x
# ✓ Podman 5.x.x (rootless)
# ✓ Gateway port 18789 available
# ✓ Config directory ~/.openclaw/ exists
# ✓ Memory system initialized
# All checks passed!
```

---

## 安全配置：绑定地址

这是安装过程中**最重要的安全步骤**。

OpenClaw Gateway 默认监听 port 18789。你**必须**确保它只绑定到 `127.0.0.1`（本机），而**不是** `0.0.0.0`（所有网络接口）。

检查配置文件：

```bash
# 查看 Gateway 配置
cat ~/.openclaw/gateway.yaml
```

确认 `bind` 字段的值：

```yaml
# ~/.openclaw/gateway.yaml

gateway:
  port: 18789
  # ✅ 正确：只绑定本机
  bind: "127.0.0.1"

  # ❌ 错误：这会将 Gateway 暴露给整个网络！
  # bind: "0.0.0.0"
```

:::danger 30,000+ 实例被黑的教训
CVE-2026-25253 允许攻击者通过暴露的 18789 端口执行远程代码。已有超过 30,000 个 OpenClaw 实例因为绑定 `0.0.0.0` 而遭到入侵。**绝对不要**将 Gateway 端口暴露在公开网络上。

如果你需要远程访问，请使用 SSH 隧道或 VPN：

```bash
# 通过 SSH 隧道安全地访问远程 OpenClaw
ssh -L 18789:127.0.0.1:18789 user@your-server
```
:::

---

## 防火墙建议

即使你已正确绑定到 `127.0.0.1`，多一层防护总是好的：

```bash
# macOS — 使用 pf
echo "block in proto tcp from any to any port 18789" | sudo pfctl -ef -

# Linux — 使用 ufw
sudo ufw deny 18789/tcp

# Linux — 使用 iptables
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP
sudo iptables -A INPUT -p tcp -s 127.0.0.1 --dport 18789 -j ACCEPT
```

---

## 目录结构

安装完成后，OpenClaw 会创建以下目录结构：

```
~/.openclaw/
├── gateway.yaml          # Gateway 配置
├── soul.md               # AI 人格配置文件
├── providers/            # LLM 提供商配置
│   └── default.yaml
├── channels/             # 通讯平台连接配置
├── skills/               # 已安装的技能
│   └── .cache/           # 技能缓存
├── memory/               # 记忆系统数据
│   ├── wal/              # Write-Ahead Log
│   └── compacted/        # 压缩后的长期记忆
└── logs/                 # 运行日志
```

---

## 常见安装问题

### `npm install -g` 权限不足

```bash
# 不要使用 sudo npm install -g！
# 改用 nvm 管理 Node.js，就不会有权限问题

# 或者修改 npm 全局目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Podman machine 无法启动（macOS）

```bash
# 重置 Podman machine
podman machine rm
podman machine init --cpus 2 --memory 4096
podman machine start
```

### WSL2 内存不足

在 Windows 用户目录下创建 `.wslconfig`：

```ini
# C:\Users\你的用户名\.wslconfig
[wsl2]
memory=8GB
swap=4GB
```

---

## 下一步

安装完成了！接下来请前往 [首次设置](./first-setup.md) 来完成初始化配置。
