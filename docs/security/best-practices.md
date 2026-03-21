---
title: 安全性最佳實踐
description: OpenClaw 完整安全指南——從 Gateway 設定、技能審查、容器隔離到 API Key 管理的全方位防護策略。
sidebar_position: 1
---

# 安全性最佳實踐

OpenClaw 是一個功能強大的 AI Agent 平台，但強大的能力也意味著巨大的安全風險。本篇提供完整的安全防護指南，涵蓋從基礎設定到進階防禦的所有層面。

:::danger 安全性不是可選的
截至 2026 年 3 月，已有超過 **30,000 個 OpenClaw 實例**因安全設定不當而遭到入侵。Bitdefender 安全審計發現 **135,000 個暴露的實例**。**ClawHavoc 事件**中有 2,400+ 個惡意技能被植入 ClawHub。這些都是真實發生的安全事件。
:::

---

## 安全事件回顧

在深入最佳實踐之前，讓我們先回顧已經發生的安全事件，理解為什麼每一條建議都如此重要：

| 事件 | 時間 | 影響 | 狀態 |
|------|------|------|------|
| **CVE-2026-25253** | 2026 年初 | Gateway 遠端程式碼執行（RCE），影響 v3.x 之前版本 | 已修補 |
| **ClawHavoc** | 2025 年底 | 2,400+ 個惡意技能植入 ClawHub，竊取 API key 和個人資料 | 已清除 |
| **18789 埠大規模入侵** | 持續中 | 30,000+ 個實例因暴露 Gateway 埠而被駭 | 持續發生 |
| **Bitdefender 審計** | 2026 年初 | 發現 135,000 個可從公網存取的 OpenClaw 實例 | 報告已公開 |

---

## 第一防線：Gateway 安全

Gateway（port 18789）是 OpenClaw 最大的攻擊面。這是你必須優先處理的安全設定。

### 1. 綁定到 localhost

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"  # 只接受本機連線
```

:::danger 致命錯誤
永遠不要設定 `bind: "0.0.0.0"`。這會將你的 Gateway 暴露給整個網路，任何人都可以發送指令給你的 Agent。CVE-2026-25253 正是利用暴露的 Gateway 實現遠端程式碼執行。
:::

### 2. 啟用 Gateway 認證

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"
  auth:
    enabled: true
    token: "your-secure-random-token-here"
    # 使用 openssl rand -hex 32 生成
```

產生安全的 token：

```bash
# 生成 64 字元的隨機 token
openssl rand -hex 32

# 或使用 Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. 防火牆規則

即使已綁定到 localhost，多一層防護永遠不會多餘：

```bash
# Linux (ufw)
sudo ufw deny 18789/tcp
sudo ufw reload

# Linux (iptables)
sudo iptables -A INPUT -p tcp --dport 18789 -s 127.0.0.1 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP

# macOS (pf)
echo "block in proto tcp from any to any port 18789" | sudo pfctl -ef -
```

### 4. 安全的遠端存取

如果你需要從其他裝置存取 OpenClaw，**永遠使用加密通道**：

```bash
# 方法一：SSH Tunnel（推薦）
ssh -L 18789:127.0.0.1:18789 user@your-server

# 方法二：WireGuard VPN
# 在伺服器上只允許 VPN 子網存取 18789
# /etc/wireguard/wg0.conf
[Interface]
Address = 10.0.0.1/24
PostUp = iptables -A INPUT -p tcp -s 10.0.0.0/24 --dport 18789 -j ACCEPT

# 方法三：Reverse Proxy + TLS（進階）
# 使用 Caddy 或 nginx 加上 mTLS 雙向認證
```

:::warning 不要使用以下方法
- **ngrok / Cloudflare Tunnel**：直接暴露 Gateway，除非你加上了額外的認證層
- **Port forwarding**：路由器上的 port forwarding 等同於暴露到公網
- **HTTP（無 TLS）**：中間人攻擊可以攔截你的 token 和訊息
:::

---

## 第二防線：容器與沙箱安全

### 使用 Podman Rootless（強烈建議）

```bash
# 確認 Podman 以 rootless 模式運行
podman info | grep rootless
# rootless: true

# 設定 OpenClaw 使用 Podman
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
```

### Docker vs Podman 安全比較

| 面向 | Docker（預設） | Podman Rootless |
|------|----------------|-----------------|
| Daemon 權限 | root | 使用者層級 |
| 沙箱逃脫風險 | 可獲得 root | 只有使用者權限 |
| 攻擊面 | Docker daemon socket | 無 daemon |
| 網路隔離 | 需要額外設定 | 預設較嚴格 |
| 推薦程度 | 可用但不建議 | **強烈建議** |

### 容器安全設定

```yaml
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
  sandbox:
    # 記憶體限制
    memory_limit: "512m"
    # CPU 限制
    cpu_limit: "1.0"
    # 網路存取
    network: "restricted"  # none / restricted / full
    # 檔案系統存取
    filesystem:
      read_only: true
      allowed_paths:
        - "/tmp/openclaw-work"
    # 停用不必要的 Linux capabilities
    drop_capabilities:
      - "ALL"
    add_capabilities:
      - "NET_RAW"  # 只在需要網路時
```

### 沙箱逃脫防護

:::danger 進階威脅
惡意技能可能嘗試逃脫沙箱環境。以下措施能大幅降低風險：
:::

```bash
# 1. 啟用 seccomp profile
# ~/.openclaw/seccomp-profile.json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "syscalls": [
    {
      "names": ["read", "write", "open", "close", "stat", "fstat"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}

# 2. 啟用 SELinux 或 AppArmor
# Ubuntu: 確認 AppArmor 已啟用
sudo aa-status

# 3. 限制 /proc 和 /sys 存取
# Podman 預設已限制，Docker 需要額外設定
```

---

## 第三防線：技能（Skill）安全

ClawHavoc 事件證明，技能是 OpenClaw 最大的供應鏈攻擊向量。

### 技能安裝前的審查流程

```bash
# 步驟 1：查看技能詳細資訊
openclaw skill info skill-name

# 步驟 2：查看技能原始碼
openclaw skill inspect skill-name

# 步驟 3：檢查 VirusTotal 掃描結果（ClawHavoc 後新增）
openclaw skill virustotal skill-name

# 步驟 4：查看社群評價與安裝數
openclaw skill reviews skill-name
```

### 技能安全分級

| 風險等級 | 說明 | 範例 |
|---------|------|------|
| **低** | 只讀操作，不存取網路或檔案 | 文字處理、計算、格式轉換 |
| **中** | 存取網路但不存取檔案系統 | Web 搜尋、API 查詢、天氣 |
| **高** | 存取檔案系統或系統指令 | 檔案管理、shell 執行、系統監控 |
| **極高** | 同時存取網路和檔案系統 | browser-use、自動化腳本 |

### 技能權限最小化

```yaml
# ~/.openclaw/skills/skill-name/permissions.yaml
permissions:
  network:
    enabled: true
    allowed_domains:
      - "api.example.com"
      - "*.googleapis.com"
    denied_domains:
      - "*"  # 預設拒絕所有
  filesystem:
    enabled: false
  shell:
    enabled: false
  environment_variables:
    allowed:
      - "HOME"
      - "PATH"
    denied:
      - "OPENAI_API_KEY"  # 防止技能讀取 API key
      - "ANTHROPIC_API_KEY"
```

:::tip 技能稽核清單
完整的技能安裝前審查步驟，請參考 [技能稽核清單](/docs/security/skill-audit-checklist)。
:::

---

## 第四防線：API Key 與 Secrets 管理

### 不要做的事

```yaml
# ❌ 不要在 gateway.yaml 中硬編碼 API key
providers:
  openai:
    api_key: "sk-aBcDeFgHiJkLmNoPqRsTuVwXyZ"

# ❌ 不要在 SOUL.md 中包含 API key
# ❌ 不要在 Reddit / Discord 上分享完整設定
# ❌ 不要將 ~/.openclaw/ 加入公開的 Git repo
```

### 正確的做法

```bash
# 方法一：環境變數（基本）
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."

# 方法二：dotenv 檔案（建議）
# ~/.openclaw/.env（確保此檔案不被 Git 追蹤）
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# 方法三：密碼管理器（最佳）
# 使用 1Password CLI
eval $(op signin)
export OPENAI_API_KEY=$(op item get "OpenAI" --fields api_key)

# 方法四：系統 Keychain（macOS）
security add-generic-password -s "openclaw-openai" -a "api_key" -w "sk-..."
```

```yaml
# ~/.openclaw/gateway.yaml — 引用環境變數
providers:
  openai:
    api_key: "${OPENAI_API_KEY}"
  anthropic:
    api_key: "${ANTHROPIC_API_KEY}"
```

### API Key 輪換策略

| 頻率 | 適用情境 |
|------|---------|
| 每 90 天 | 一般使用 |
| 立即 | 懷疑洩露時 |
| 每 30 天 | 高安全需求環境 |
| 安裝新技能後 | 如果新技能有網路和環境變數存取權 |

---

## 第五防線：記憶系統安全

記憶系統包含你與 Agent 的所有對話紀錄和個人資料。

### 記憶檔案加密

```bash
# 方法一：磁碟級加密
# macOS：FileVault（系統設定 → 安全性與隱私 → FileVault）
# Linux：LUKS
sudo cryptsetup luksFormat /dev/sdX
sudo cryptsetup luksOpen /dev/sdX openclaw-memory

# 方法二：目錄級加密（Linux）
# 使用 gocryptfs
gocryptfs -init ~/.openclaw/memory-encrypted
gocryptfs ~/.openclaw/memory-encrypted ~/.openclaw/memory
```

### 記憶清理策略

```bash
# 查看記憶使用量
openclaw memory stats

# 清除特定時間段的記憶
openclaw memory prune --before "2025-01-01"

# 清除特定對話的記憶
openclaw memory delete --conversation-id "abc123"

# 完全重置記憶（不可復原）
openclaw memory reset --confirm
```

:::warning 記憶中的敏感資訊
Agent 可能在對話中收集到你的銀行帳號、地址、密碼等敏感資訊，並儲存在記憶系統中。定期審查記憶內容，確保沒有不該保存的敏感資料。
:::

---

## 第六防線：通訊平台安全

### 各平台 Token 管理

| 平台 | Token 類型 | 輪換建議 |
|------|-----------|---------|
| Telegram | Bot Token | 每 180 天，或洩露時立即 |
| Discord | Bot Token | 每 90 天 |
| Slack | OAuth Token | 每 90 天 |
| WhatsApp | Session Token | 自動管理 |
| LINE | Channel Access Token | 每 30 天（LINE 建議） |

### 限制通訊平台權限

```yaml
# ~/.openclaw/channels/telegram.yaml
telegram:
  bot_token: "${TELEGRAM_BOT_TOKEN}"
  security:
    # 只允許特定使用者
    allowed_users:
      - 123456789  # 你的 Telegram user ID
    # 或只允許特定群組
    allowed_groups:
      - -100123456789
    # 封鎖未知使用者
    block_unknown: true
    # 限制指令
    disabled_commands:
      - "/exec"  # 停用危險指令
      - "/shell"
```

---

## 第七防線：網路安全

### DNS 防護

```bash
# 使用 Pi-hole 或 AdGuard Home 阻擋惡意域名
# 添加 OpenClaw 專用的阻擋清單

# 或在主機上直接設定
# /etc/hosts
127.0.0.1 known-malicious-c2-server.com
```

### 網路監控

```bash
# 監控 OpenClaw 的網路活動
# Linux
ss -tnp | grep openclaw

# macOS
lsof -i -P | grep openclaw

# 使用 tcpdump 監控異常連線
sudo tcpdump -i any port 18789 -w openclaw-traffic.pcap
```

---

## 安全設定檢查清單

使用以下檢查清單確保你的 OpenClaw 安裝是安全的：

### 必須完成（Critical）

- [ ] Gateway 綁定到 `127.0.0.1`（而非 `0.0.0.0`）
- [ ] Gateway 認證已啟用
- [ ] 使用 Podman rootless（而非 Docker）
- [ ] API key 使用環境變數（而非硬編碼）
- [ ] 已更新到最新版本（修補 CVE-2026-25253）
- [ ] 通訊平台已設定白名單使用者

### 強烈建議（High）

- [ ] 防火牆封鎖 18789 埠的外部存取
- [ ] 已啟用磁碟加密
- [ ] 技能安裝前已完成安全審查
- [ ] 遠端存取使用 SSH tunnel 或 VPN
- [ ] API key 定期輪換

### 建議完成（Medium）

- [ ] 啟用 seccomp profile
- [ ] 設定記憶清理策略
- [ ] 監控網路活動
- [ ] 記憶系統加密
- [ ] 定期審查已安裝技能的更新

### 可選（Low）

- [ ] 設定 Pi-hole / AdGuard 等 DNS 防護
- [ ] 使用獨立的使用者帳號運行 OpenClaw
- [ ] 日誌集中管理
- [ ] 設定自動化安全掃描

---

## 安全事件應變流程

如果你懷疑你的 OpenClaw 實例已被入侵：

### 立即行動

```bash
# 1. 停止 OpenClaw
openclaw stop --force

# 2. 保留證據（先備份再清理）
cp -r ~/.openclaw/ ~/openclaw-incident-backup-$(date +%Y%m%d)

# 3. 檢查可疑活動
# 查看日誌中的異常
grep -i "error\|unauthorized\|unknown\|suspicious" ~/.openclaw/logs/*.log

# 4. 檢查已安裝的技能
ls -la ~/.openclaw/skills/

# 5. 檢查網路連線
netstat -an | grep 18789
```

### 復原步驟

```bash
# 1. 輪換所有 API key（立即！）
# - OpenAI、Anthropic、Google 等所有 LLM 提供者
# - Telegram、Discord 等所有通訊平台 token

# 2. 重新安裝 OpenClaw（乾淨安裝）
npm uninstall -g @openclaw/cli
rm -rf ~/.openclaw/
npm install -g @openclaw/cli
openclaw init

# 3. 只重新安裝已驗證的技能

# 4. 恢復記憶資料（如果確認未被竄改）

# 5. 強化安全設定（參考本文件的所有建議）
```

---

## 持續安全維護

安全不是一次性的設定，而是持續的過程。

### 每日

- 檢查 OpenClaw 日誌中的異常
- 確認 Gateway 只接受預期的連線

### 每週

- 檢查 OpenClaw 是否有安全更新
- 審查技能的新版本

### 每月

- 輪換 API key
- 審查記憶系統中的敏感資料
- 檢查防火牆規則是否仍然有效

### 每季

- 重新評估已安裝的技能是否仍然需要
- 更新容器映像
- 測試備份復原流程

---

## 延伸閱讀

- [威脅模型分析](/docs/security/threat-model) — 了解所有攻擊向量和攻擊面
- [技能稽核清單](/docs/security/skill-audit-checklist) — 安裝技能前的完整審查步驟
- [疑難排解](/docs/troubleshooting/common-issues) — 安全相關的常見問題
