---
title: "자주 발생하는 문제 해결"
sidebar_position: 1
description: "OpenClaw 자주 발생하는 문제의 진단 및 해결 방안 — 설치, Gateway, 통신 플랫폼 연결, 스킬, 메모리 시스템 등 각종 문제 해결 가이드"
---

# 常見問題排解

이 페이지에는 수집된 OpenClaw 사용자最常遇到的問題及其解決方案。問題按類別組織，方便快速查找。

:::tip 排解前先실행健康檢查
大多數問題可以透過 `openclaw doctor` 快速定位：
```bash
openclaw doctor
```
這個指令會檢查 Node.js 版本、컨테이너引擎、Gateway 狀態、記憶系統等所有핵심 컴포넌트。
:::

---

## 설치問題

### 問題：`npm install -g @openclaw/cli` 권한不足

**錯誤메시지：**
```
EACCES: permission denied, mkdir '/usr/local/lib/node_modules/@openclaw'
```

**原因：** 系統的 Node.js 설치在需要 root 권한的目錄。

**解決方案：**

```bash
# 方法一（推薦）：使用 nvm 管理 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc  # 或 source ~/.zshrc
nvm install 24
nvm use 24
npm install -g @openclaw/cli

# 方法二：수정 npm 全域目錄
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @openclaw/cli
```

:::danger 不要使用 sudo
```bash
# ❌ 不要這樣做
sudo npm install -g @openclaw/cli
```
使用 sudo 설치 npm 套件會造成後續的권한問題，也有安全隱患。
:::

### 問題：Node.js 版本不符

**錯誤메시지：**
```
Error: OpenClaw requires Node.js >= 22.16.0. Current version: 18.19.0
```

**解決方案：**
```bash
# 使用 nvm 升級
nvm install 24
nvm use 24
nvm alias default 24

# 검증
node --version  # 應顯示 v24.x.x
```

### 問題：macOS 上 Homebrew 설치失敗

**錯誤메시지：**
```
Error: No available formula or cask with the name "openclaw"
```

**解決方案：**
```bash
# 先添加 tap
brew tap openclaw/tap

# 업데이트 Homebrew
brew update

# 再설치
brew install openclaw
```

---

## Gateway 問題

### 問題：Gateway 啟動失敗 — 埠被占用

**錯誤메시지：**
```
Error: EADDRINUSE: address already in use :::18789
```

**診斷：**
```bash
# 조회是什麼程式占用了 18789
# macOS
lsof -i :18789

# Linux
ss -tlnp | grep 18789
```

**解決方案：**
```bash
# 方法一：停止占用埠的程式
kill $(lsof -t -i :18789)

# 方法二：使用其他埠
# ~/.openclaw/gateway.yaml
# gateway:
#   port: 18790
```

### 問題：Gateway 無法連線

**現象：** `curl http://127.0.0.1:18789/api/v1/health` 回傳 `Connection refused`

**診斷步驟：**

```bash
# 1. 確認 OpenClaw 是否在運行
openclaw status

# 2. 確認 Gateway 綁定位址
grep -A 3 "gateway:" ~/.openclaw/gateway.yaml

# 3. 確認埠是否在監聽
# macOS
lsof -i :18789
# Linux
ss -tlnp | grep 18789

# 4. 조회 Gateway 로그
tail -50 ~/.openclaw/logs/gateway.log
```

### 問題：Gateway 인증失敗 (401)

**錯誤메시지：**
```json
{"error": "unauthorized", "message": "Missing or invalid authentication token"}
```

**解決方案：**
```bash
# 1. 確認 token 설정
grep -A 3 "auth:" ~/.openclaw/gateway.yaml

# 2. 確認請求中的 token
curl -v -H "Authorization: Bearer YOUR_TOKEN" \
  http://127.0.0.1:18789/api/v1/health

# 3. 如果 token 遺失，重新生成
openssl rand -hex 32
# 將新 token 업데이트到 gateway.yaml 並重啟 OpenClaw
openclaw restart
```

---

## 커뮤니케이션平台連線問題

### 問題：Telegram Bot 無回應

**診斷步驟：**

```bash
# 1. 確認 Bot Token 有效
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# 2. 確認 channel 설정
cat ~/.openclaw/channels/telegram.yaml

# 3. 조회 Telegram adapter 로그
grep "telegram" ~/.openclaw/logs/gateway.log | tail -20

# 4. 確認 Bot 是否설정了 webhook（會與 polling 衝突）
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
```

**常見原因與解決方案：**

| 原因 | 解決方案 |
|------|---------|
| Bot Token 無效 | 重新從 @BotFather 取得 Token |
| Webhook 衝突 | 清除 webhook：`/deleteWebhook` |
| 사용자不在白名單 | 將你的 user ID 加入 `allowed_users` |
| Bot 未啟動 | 確認 OpenClaw 正在運行 |

### 問題：Discord Bot 離線

**診斷步驟：**
```bash
# 1. 確認 Bot Token
grep "token" ~/.openclaw/channels/discord.yaml

# 2. 確認 Bot 在 Discord Developer Portal 中的설정
# - 確認已啟用 Message Content Intent
# - 確認 Bot 已邀請到你的서버

# 3. 조회로그
grep "discord" ~/.openclaw/logs/gateway.log | tail -20
```

**常見原因：**
- 未啟用 **Message Content Intent**（2024 年後 Discord 要求）
- Bot Token 過期或被重置
- Bot 未被邀請到目標서버
- 缺少必要的권한（Read Messages、Send Messages）

### 問題：WhatsApp 連線掉線

**現象：** WhatsApp 連線在運行數小時後斷開。

**解決方案：**
```bash
# 1. 重新連線
openclaw channel reconnect whatsapp

# 2. 如果頻繁斷線，清除 session 重新登入
rm -rf ~/.openclaw/channels/whatsapp/session/
openclaw channel setup whatsapp
# 掃描新的 QR Code

# 3. 確認手機上的 WhatsApp 仍在運行
# WhatsApp Web/API 需要手機端保持登入狀態
```

:::warning WhatsApp 使用政策
WhatsApp 禁止自動化메시지。過於頻繁的自動답변可能導致계정被封禁。建議使用 WhatsApp Business API（正式版）或限制답변頻率。
:::

---

## LLM 提供者問題

### 問題：API Key 無效或額度用盡

**錯誤메시지：**
```
Error: 401 Unauthorized - Invalid API key
Error: 429 Rate limit exceeded
Error: 402 Payment required - Insufficient credits
```

**解決方案：**
```bash
# 1. 確認環境變數已설정
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY

# 2. 테스트 API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 3. 檢查額度
# OpenAI: https://platform.openai.com/usage
# Anthropic: https://console.anthropic.com/settings/billing

# 4. 설정 fallback 模型
# ~/.openclaw/providers/default.yaml
# providers:
#   fallback: local  # 使用本地模型作為備用
```

### 問題：LLM 回應速度過慢

**診斷：**
```bash
# 조회平均지연
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/status | jq '.reasoning.avg_latency_ms'
```

**解決方案：**

| 原因 | 解決方案 |
|------|---------|
| 模型太大 | 改用較小的模型（如 Claude Sonnet） |
| 上下文太長 | 清理記憶，減少上下文 |
| API 지연高 | 使用本地模型（Ollama） |
| 網路問題 | 檢查網路連線和 DNS |

---

## 스킬問題

### 問題：스킬설치失敗

**錯誤메시지：**
```
Error: Failed to install skill 'xxx': Container build failed
```

**解決方案：**
```bash
# 1. 確認컨테이너引擎運行中
podman info  # 或 docker info

# 2. macOS Podman：確認 machine 已啟動
podman machine start

# 3. 清除캐시重新설치
openclaw skill cache clear
openclaw skill install <skill-name>

# 4. 조회詳細錯誤
openclaw skill install <skill-name> --verbose
```

### 問題：스킬실행時逾時

**錯誤메시지：**
```
Error: Skill 'xxx' execution timed out after 30000ms
```

**解決方案：**
```yaml
# 增加逾時時間
# ~/.openclaw/gateway.yaml
execution:
  timeout_ms: 60000  # 增加到 60 秒
```

```bash
# 或者針對特定스킬調整
openclaw skill config <skill-name> --timeout 60000
```

### 問題：browser-use 스킬無法正常運作

**常見原因與解決方案：**

```bash
# 1. 確認 Chromium 已설치在컨테이너中
openclaw skill exec browser-use -- which chromium

# 2. 增加記憶體限制（browser-use 需要較多記憶體）
# ~/.openclaw/gateway.yaml
# execution:
#   sandbox:
#     memory_limit: "2g"  # browser-use 建議至少 1.5GB

# 3. 確認網路권한
# browser-use 需要 network: "full"
```

---

## 記憶系統問題

### 問題：記憶系統佔用過多磁碟空間

**診斷：**
```bash
# 조회記憶使用量
du -sh ~/.openclaw/memory/
du -sh ~/.openclaw/memory/wal/
du -sh ~/.openclaw/memory/compacted/

# 或透過 API
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/memory/stats
```

**解決方案：**
```bash
# 1. 清理舊的 WAL
openclaw memory prune --before "2025-06-01" --type wal

# 2. 強制壓縮
openclaw memory compact --force

# 3. 설정自動清理
# ~/.openclaw/gateway.yaml
# memory:
#   wal:
#     max_age_days: 90
#     auto_prune: true
#   compaction:
#     schedule: "0 3 * * 0"  # 每週日凌晨 3 點
```

### 問題：Agent 忘記之前的對話內容

**原因：** 上下文窗口限制，較舊的對話可能不在當前上下文中。

**解決方案：**
```yaml
# ~/.openclaw/gateway.yaml
memory:
  context:
    # 增加包含在上下文中的對話輪數
    recent_turns: 20    # 預設 10
    # 增加長期記憶的 token 分配
    long_term_ratio: 0.3  # 預設 0.2
```

```bash
# 或者手動提示 Agent 查詢記憶
> 你記得我上週說過關於旅行的事嗎？검색你的記憶。
```

---

## 컨테이너引擎問題

### 問題：Podman machine 無法啟動（macOS）

**錯誤메시지：**
```
Error: unable to start host networking: could not find podman machine
```

**解決方案：**
```bash
# 重設 Podman machine
podman machine rm -f
podman machine init --cpus 2 --memory 4096
podman machine start

# 검증
podman info | grep rootless
```

### 問題：Docker daemon 未運行

**錯誤메시지：**
```
Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**解決方案：**
```bash
# macOS：啟動 Docker Desktop 應用程式

# Linux：啟動 Docker daemon
sudo systemctl start docker
sudo systemctl enable docker

# 確認你在 docker 群組中
sudo usermod -aG docker $USER
# 登出再登入
```

:::tip 考慮改用 Podman
如果你經常遇到 Docker daemon 的問題，建議改用 Podman。Podman 無需 daemon，安全性也更高。詳見 [설치가이드](/docs/getting-started/installation)。
:::

---

## 성능問題

### 問題：OpenClaw 占用過多 CPU / 記憶體

**診斷：**
```bash
# 조회 OpenClaw 程序的資源使用
# macOS / Linux
top -p $(pgrep -f openclaw)

# 조회컨테이너的資源使用
podman stats  # 或 docker stats
```

**解決方案：**

```yaml
# 限制컨테이너資源
# ~/.openclaw/gateway.yaml
execution:
  sandbox:
    memory_limit: "512m"
    cpu_limit: "1.0"
  optimization:
    warm_pool_size: 1  # 減少預熱컨테이너數量
```

### 問題：回應지연過高

**診斷步驟：**

```bash
# 1. 識別瓶頸
openclaw benchmark

# 2. 조회各階段지연
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/status | jq '.reasoning'
```

**最佳化策略：**

| 瓶頸 | 解決方案 |
|------|---------|
| LLM API 지연 | 使用本地模型或較小的模型 |
| 컨테이너啟動慢 | 啟用컨테이너預熱池和重複使用 |
| 記憶查詢慢 | 減少記憶大小、실행壓縮 |
| 網路지연 | 使用地理位置較近的 API 端點 |

---

## 升級問題

### 問題：升級後설정不相容

**解決方案：**
```bash
# 1. 백업現有설정
cp -r ~/.openclaw/ ~/openclaw-backup-$(date +%Y%m%d)

# 2. 升級
npm install -g @openclaw/cli@latest

# 3. 실행설정遷移
openclaw migrate

# 4. 검증
openclaw doctor
```

### 問題：升級後스킬無法使用

```bash
# 重建스킬컨테이너
openclaw skill rebuild --all

# 如果仍然失敗，重新설치
openclaw skill reinstall <skill-name>
```

---

## 로그與診斷工具

### 조회로그

```bash
# 即時조회로그
openclaw logs --follow

# 조회特定元件的로그
openclaw logs --component gateway
openclaw logs --component reasoning
openclaw logs --component memory
openclaw logs --component skills

# 조회特定時間段
openclaw logs --since "2026-03-20T10:00:00"

# 只看錯誤
openclaw logs --level error
```

### 디버깅模式

```bash
# 以디버깅模式啟動（輸出更多細節）
openclaw start --debug

# 或설정環境變數
export OPENCLAW_LOG_LEVEL=debug
openclaw start
```

### 回報問題

如果以上方法都無法解決你的問題：

1. **검색 GitHub Issues** — [github.com/openclaw/openclaw/issues](https://github.com/openclaw/openclaw/issues)
2. **검색 Reddit** — `site:reddit.com/r/openclaw <你的問題關鍵字>`
3. **제출新 Issue** — 附上 `openclaw doctor` 的輸出和相關로그
4. **加入 Discord** — 在 #help 채널提問

---

## 추가 참고자료

- [설치가이드](/docs/getting-started/installation) — 完整的설치步驟
- [架構개요](/docs/architecture/overview) — 了解系統架構有助於排解問題
- [安全性最佳實踐](/docs/security/best-practices) — 安全相關問題的防護
