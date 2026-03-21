---
title: 安裝指南
description: 在 macOS、Linux 與 Windows WSL2 上安裝 OpenClaw 的完整步驟，包含系統需求、安全設定與 Podman 建議。
sidebar_position: 1
---

# 安裝指南

本篇將帶你從零開始安裝 OpenClaw。整個流程約需 10-15 分鐘。

---

## 系統需求

在安裝之前，請確認你的系統符合以下最低需求：

| 項目 | 最低需求 | 建議配置 |
|------|---------|---------|
| **作業系統** | macOS 13+、Ubuntu 22.04+、Windows 11 (WSL2) | macOS 14+ 或 Ubuntu 24.04 |
| **Node.js** | 22.16+ | **24.x（建議）** |
| **記憶體** | 4 GB | 8 GB 以上 |
| **磁碟空間** | 2 GB | 5 GB（含技能快取） |
| **容器引擎** | Docker 24+ 或 Podman 5+ | **Podman 5+（建議）** |

:::warning Node.js 版本很重要
OpenClaw 大量使用 Node.js 22.16 引入的新特性。使用較舊版本會導致無法預期的錯誤。強烈建議使用 Node.js 24.x 以獲得最佳效能與相容性。
:::

---

## 安裝 Node.js

如果你尚未安裝合適版本的 Node.js，建議使用 **nvm**（Node Version Manager）：

```bash
# 安裝 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 重新載入 shell 設定
source ~/.bashrc  # 或 source ~/.zshrc

# 安裝 Node.js 24
nvm install 24
nvm use 24

# 驗證版本
node --version
# 應顯示 v24.x.x
```

---

## macOS 安裝步驟

### 方法一：使用 Homebrew（推薦）

```bash
# 安裝 OpenClaw
brew tap openclaw/tap
brew install openclaw

# 驗證安裝
openclaw --version
```

### 方法二：使用 npm

```bash
# 全域安裝
npm install -g @openclaw/cli

# 驗證安裝
openclaw --version
```

### 方法三：從原始碼編譯

```bash
# 複製儲存庫
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 安裝相依套件
npm install

# 編譯
npm run build

# 連結到全域
npm link

# 驗證
openclaw --version
```

---

## Linux 安裝步驟（Ubuntu / Debian）

```bash
# 更新套件清單
sudo apt update && sudo apt upgrade -y

# 確保 Node.js 24 已安裝（見上方 nvm 指示）

# 使用 npm 安裝
npm install -g @openclaw/cli

# 驗證安裝
openclaw --version
```

### Arch Linux

```bash
# AUR 安裝
yay -S openclaw
```

### Fedora / RHEL

```bash
# 使用 npm 安裝
npm install -g @openclaw/cli
```

---

## Windows 安裝步驟（WSL2）

:::info Windows 使用者請注意
OpenClaw **不支援**原生 Windows 環境。你必須使用 WSL2（Windows Subsystem for Linux 2）來執行。
:::

```bash
# 步驟 1：啟用 WSL2（在 PowerShell 中以系統管理員身分執行）
wsl --install -d Ubuntu-24.04

# 步驟 2：進入 WSL2 環境
wsl

# 步驟 3：安裝 Node.js（在 WSL2 Ubuntu 中）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 24

# 步驟 4：安裝 OpenClaw
npm install -g @openclaw/cli

# 步驟 5：驗證
openclaw --version
```

---

## 安裝容器引擎

OpenClaw 的技能執行層依賴容器引擎來提供沙箱環境。我們**強烈建議使用 Podman** 而非 Docker。

### 為什麼選擇 Podman？

| 比較項目 | Docker | Podman |
|---------|--------|--------|
| 根權限 | 預設需要 root（daemon 模式） | **Rootless（無需 root）** |
| 背景服務 | 需要 dockerd daemon | 無 daemon |
| 安全性 | 較高攻擊面 | **較低攻擊面** |
| 相容性 | Docker CLI | 完全相容 Docker CLI |

:::danger 安全考量
Docker daemon 以 root 權限運行，如果 OpenClaw 的技能沙箱被突破，攻擊者可能取得主機的 root 權限。Podman 的 rootless 模式大幅降低了這個風險。
:::

### 安裝 Podman

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

### 安裝 Docker（如果你仍然選擇 Docker）

```bash
# macOS
brew install --cask docker

# Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# 登出再登入以套用群組變更
```

---

## 首次執行與驗證

安裝完成後，執行以下指令進行初始化：

```bash
# 初始化 OpenClaw（會建立設定目錄）
openclaw init

# 你會看到類似以下輸出：
# 🦞 OpenClaw initialized!
# Config directory: ~/.openclaw/
# Gateway port: 18789
# Container engine: podman
```

驗證所有元件是否正常：

```bash
# 執行健康檢查
openclaw doctor

# 預期輸出：
# ✓ Node.js v24.x.x
# ✓ Podman 5.x.x (rootless)
# ✓ Gateway port 18789 available
# ✓ Config directory ~/.openclaw/ exists
# ✓ Memory system initialized
# All checks passed!
```

---

## 安全設定：綁定位址

這是安裝過程中**最重要的安全步驟**。

OpenClaw Gateway 預設監聽 port 18789。你**必須**確保它只綁定到 `127.0.0.1`（本機），而**不是** `0.0.0.0`（所有網路介面）。

檢查設定檔：

```bash
# 查看 Gateway 設定
cat ~/.openclaw/gateway.yaml
```

確認 `bind` 欄位的值：

```yaml
# ~/.openclaw/gateway.yaml

gateway:
  port: 18789
  # ✅ 正確：只綁定本機
  bind: "127.0.0.1"

  # ❌ 錯誤：這會將 Gateway 暴露給整個網路！
  # bind: "0.0.0.0"
```

:::danger 30,000+ 實例被駭的教訓
CVE-2026-25253 允許攻擊者透過暴露的 18789 埠執行遠端程式碼。已有超過 30,000 個 OpenClaw 實例因為綁定 `0.0.0.0` 而遭到入侵。**絕對不要**將 Gateway 埠暴露在公開網路上。

如果你需要遠端存取，請使用 SSH tunnel 或 VPN：

```bash
# 透過 SSH tunnel 安全地存取遠端 OpenClaw
ssh -L 18789:127.0.0.1:18789 user@your-server
```
:::

---

## 防火牆建議

即使你已正確綁定到 `127.0.0.1`，多一層防護總是好的：

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

## 目錄結構

安裝完成後，OpenClaw 會建立以下目錄結構：

```
~/.openclaw/
├── gateway.yaml          # Gateway 設定
├── soul.md               # AI 人格設定檔
├── providers/            # LLM 提供者設定
│   └── default.yaml
├── channels/             # 通訊平台連線設定
├── skills/               # 已安裝的技能
│   └── .cache/           # 技能快取
├── memory/               # 記憶系統資料
│   ├── wal/              # Write-Ahead Log
│   └── compacted/        # 壓縮後的長期記憶
└── logs/                 # 執行日誌
```

---

## 常見安裝問題

### `npm install -g` 權限不足

```bash
# 不要使用 sudo npm install -g！
# 改用 nvm 管理 Node.js，就不會有權限問題

# 或者修改 npm 全域目錄
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Podman machine 無法啟動（macOS）

```bash
# 重設 Podman machine
podman machine rm
podman machine init --cpus 2 --memory 4096
podman machine start
```

### WSL2 記憶體不足

在 Windows 使用者目錄下建立 `.wslconfig`：

```ini
# C:\Users\你的使用者名稱\.wslconfig
[wsl2]
memory=8GB
swap=4GB
```

---

## 下一步

安裝完成了！接下來請前往 [首次設定](./first-setup.md) 來完成初始化配置。
