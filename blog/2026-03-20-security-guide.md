---
slug: security-guide
title: OpenClaw 安全性完整指南
authors: [openclaw-masterclass]
tags: [openclaw, security]
image: /img/docusaurus-social-card.jpg
description: OpenClaw 安全性完整指南——深入了解 ClawHavoc 事件、CVE-2026-25253 漏洞、0.0.0.0 綁定風險，以及個人與企業的安全最佳實踐。
---

# OpenClaw 安全性完整指南

安全性是部署任何 AI Agent 框架時最重要的考量之一。本文將深入探討 OpenClaw 的安全性議題，包括已知漏洞、歷史事件，以及個人和企業用戶的最佳實踐。

<!-- truncate -->

## ClawHavoc：一次重要的安全事件

2026 年 2 月，安全研究團隊 **Lobster Security Labs** 發現了一組被稱為 **ClawHavoc** 的安全漏洞。這組漏洞影響了 OpenClaw Gateway 的核心通訊機制，如果被利用，攻擊者可以：

1. **未授權存取 Agent 控制介面**：繞過認證機制直接向 Agent 發送指令
2. **Skills 注入攻擊**：在目標實例上載入惡意 Skills
3. **對話資料外洩**：攔截 Agent 與使用者之間的通訊內容

### ClawHavoc 的影響範圍

- **受影響版本**：OpenClaw v3.8.0 至 v4.1.2
- **嚴重程度**：Critical（CVSS 9.1）
- **修復版本**：OpenClaw v4.1.3+

OpenClaw 安全團隊在接獲通報後 48 小時內發布了修復補丁，並透過 Gateway 的自動更新機制推送給所有已啟用自動更新的實例。

### 教訓

ClawHavoc 事件讓社群深刻認識到：

- AI Agent 框架的攻擊面比傳統 Web 應用更廣
- Skill 的動態載入機制需要更嚴格的驗證
- 即時通訊的加密不能僅依賴傳輸層

## CVE-2026-25253：WebSocket 認證繞過

**CVE-2026-25253** 是 ClawHavoc 中最嚴重的單一漏洞，影響 OpenClaw Gateway 的 WebSocket 連線認證機制。

### 漏洞詳情

OpenClaw Gateway 預設在 **port 18789** 上監聽 WebSocket 連線。在受影響的版本中，WebSocket 的握手階段存在一個競態條件（Race Condition）：

```
攻擊者 → 發送特製的 WebSocket 升級請求
       → 在認證 Token 驗證完成前注入惡意 Frame
       → Gateway 將惡意 Frame 當作已認證的指令處理
```

### 技術細節

問題出在 Gateway 的連線狀態機：

1. 客戶端發起 WebSocket 連線
2. Gateway 接收連線並開始驗證 Bearer Token
3. **漏洞**：在驗證完成前，Gateway 的訊息佇列已經開始接收 Frame
4. 攻擊者利用這個時間窗口注入指令 Frame

### 修復方式

修復方案引入了「連線待命區」（Connection Staging）機制：

- WebSocket 連線建立後進入 Staging 狀態
- 所有在 Staging 狀態接收的 Frame 會被緩衝而非處理
- 只有在認證完成後，連線才會進入 Active 狀態
- Staging 超時（預設 5 秒）後未完成認證的連線會被自動斷開

## 0.0.0.0 綁定風險

這是一個常被忽略但非常危險的配置問題。

### 什麼是 0.0.0.0 綁定？

OpenClaw Gateway 的預設配置會將 WebSocket 服務綁定到 `0.0.0.0:18789`，這意味著 Gateway 會監聽**所有網路介面**上的連線請求。

### 為什麼這很危險？

在以下場景中，0.0.0.0 綁定會造成嚴重的安全風險：

| 場景 | 風險 |
|------|------|
| 開發環境連接公共 Wi-Fi | Gateway 暴露在區域網路中 |
| 雲端 VM 未設定防火牆 | Gateway 暴露在公網 |
| Docker 容器使用 host 網路模式 | Gateway 暴露在主機所有介面 |
| 多租戶環境 | 其他租戶可存取你的 Gateway |

### 正確的綁定配置

**個人開發環境：**

```yaml
# openclaw.config.yaml
gateway:
  host: "127.0.0.1"  # 只監聽本地迴路
  port: 18789
```

**生產環境（搭配反向代理）：**

```yaml
# openclaw.config.yaml
gateway:
  host: "127.0.0.1"  # Gateway 只接受來自反向代理的連線
  port: 18789

# Nginx/Caddy 負責 TLS 終止和外部連線
```

**Docker 環境：**

```yaml
# docker-compose.yml
services:
  openclaw-gateway:
    ports:
      - "127.0.0.1:18789:18789"  # 不要用 "18789:18789"
```

## 個人用戶安全最佳實踐

### 1. 保持更新

```bash
# 檢查當前版本
openclaw version

# 更新到最新版本
openclaw update

# 啟用自動安全更新
openclaw config set auto-security-update true
```

### 2. 使用強認證

```yaml
# openclaw.config.yaml
auth:
  type: "bearer"
  token_rotation: true
  token_ttl: "24h"
  # 不要使用預設 Token！
  # 生成強 Token: openclaw auth generate-token
```

### 3. 限制 Skill 權限

```yaml
# 為每個 Skill 設定最小權限
skills:
  weather-skill:
    permissions:
      - network:read  # 只允許讀取網路
    deny:
      - filesystem:*  # 禁止存取檔案系統
      - process:*     # 禁止執行系統指令
```

### 4. 審查第三方 Skills

在安裝任何第三方 Skill 之前：

- 檢查 Skill 的原始碼
- 確認 Skill 作者的信譽
- 查看社群評價和下載量
- 在沙盒環境中先測試

```bash
# 在沙盒模式下測試 Skill
openclaw skill install --sandbox suspicious-skill
openclaw skill test suspicious-skill --verbose
```

### 5. 加密本地資料

```yaml
# openclaw.config.yaml
storage:
  encryption: true
  encryption_key_source: "keychain"  # macOS Keychain / Windows Credential Store
```

## 企業安全最佳實踐

### 1. 網路隔離

```
[Internet] → [WAF/CDN] → [Reverse Proxy] → [OpenClaw Gateway] → [Internal Network]
                                                    ↓
                                             [Agent Cluster]
                                                    ↓
                                             [Skill Sandbox]
```

- Gateway 部署在 DMZ 或專用子網路
- Agent 和 Skill 在隔離的內部網路中運行
- 所有跨網段通訊必須通過防火牆規則

### 2. RBAC 配置

```yaml
# openclaw.config.yaml
rbac:
  enabled: true
  roles:
    admin:
      permissions: ["*"]
    operator:
      permissions:
        - "agents:read"
        - "agents:restart"
        - "skills:read"
        - "tasks:read"
        - "tasks:create"
    viewer:
      permissions:
        - "agents:read"
        - "skills:read"
        - "tasks:read"
```

### 3. 審計日誌

```yaml
# openclaw.config.yaml
audit:
  enabled: true
  log_level: "detailed"
  destinations:
    - type: "file"
      path: "/var/log/openclaw/audit.log"
      rotation: "daily"
    - type: "siem"
      endpoint: "https://siem.company.com/api/events"
      format: "cef"
```

### 4. Skill 白名單

企業環境中應該只允許經過審核的 Skills：

```yaml
# openclaw.config.yaml
skills:
  marketplace:
    enabled: false  # 禁用公開 Marketplace
  whitelist:
    enabled: true
    approved_skills:
      - "official/web-search"
      - "official/calendar"
      - "official/email"
      - "internal/company-kb"
      - "internal/ticket-system"
```

### 5. TLS 配置

```yaml
# openclaw.config.yaml
tls:
  enabled: true
  cert_file: "/etc/openclaw/tls/cert.pem"
  key_file: "/etc/openclaw/tls/key.pem"
  min_version: "1.3"
  client_auth: "require"  # mTLS for agent connections
  client_ca_file: "/etc/openclaw/tls/ca.pem"
```

### 6. 密鑰管理

```yaml
# openclaw.config.yaml
secrets:
  provider: "vault"  # HashiCorp Vault
  vault:
    address: "https://vault.company.com"
    auth_method: "kubernetes"
    secret_path: "secret/data/openclaw"
```

## 安全檢查清單

在部署 OpenClaw 到生產環境前，請確認以下項目：

- [ ] Gateway 未綁定到 0.0.0.0
- [ ] 已更新到最新版本（>= v4.1.3）
- [ ] 已更換預設認證 Token
- [ ] 已啟用 TLS 加密
- [ ] 已配置 RBAC
- [ ] 已啟用審計日誌
- [ ] 已設定 Skill 白名單（企業環境）
- [ ] 已配置網路防火牆規則
- [ ] 已設定自動安全更新
- [ ] 已建立安全事件回應計畫

## 回報安全漏洞

如果你發現 OpenClaw 的安全漏洞，請透過以下方式回報：

- **安全信箱**：security@openclaw.dev
- **HackerOne**：hackerone.com/openclaw
- **PGP Key**：可在官方網站的 /.well-known/security.txt 中找到

請勿在公開的 GitHub Issues 中揭露安全漏洞。OpenClaw 安全團隊承諾在 48 小時內回覆所有安全回報。

---

*OpenClaw MasterClass 團隊*
