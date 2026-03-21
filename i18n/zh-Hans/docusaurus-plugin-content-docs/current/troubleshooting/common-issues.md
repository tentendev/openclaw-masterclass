---
title: 常见问题排解
description: OpenClaw 常见问题的诊断与解决方案——安装、Gateway、通信平台连接、技能、记忆系统等各类问题的排解指南。
sidebar_position: 1
---

# 常见问题排解

本页收集了 OpenClaw 用户最常遇到的问题及其解决方案。问题按类别组织，方便快速查找。

:::tip 排解前先执行健康检查
大多数问题可以透过 `openclaw doctor` 快速定位：
```bash
openclaw doctor
```
这个命令会检查 Node.js 版本、容器引擎、Gateway 状态、记忆系统等所有核心组件。
:::

---

## 安装问题

### 问题：`npm install -g @openclaw/cli` 权限不足

**错误消息：**
```
EACCES: permission denied, mkdir '/usr/local/lib/node_modules/@openclaw'
```

**原因：** 系统的 Node.js 安装在需要 root 权限的目录。

**解决方案：**

```bash
# 方法一（推荐）：使用 nvm 管理 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc  # 或 source ~/.zshrc
nvm install 24
nvm use 24
npm install -g @openclaw/cli

# 方法二：修改 npm 全域目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @openclaw/cli
```

:::danger 不要使用 sudo
```bash
# ❌ 不要这样做
sudo npm install -g @openclaw/cli
```
使用 sudo 安装 npm 包会造成后续的权限问题，也有安全隐患。
:::

### 问题：Node.js 版本不符

**错误消息：**
```
Error: OpenClaw requires Node.js >= 22.16.0. Current version: 18.19.0
```

**解决方案：**
```bash
# 使用 nvm 升级
nvm install 24
nvm use 24
nvm alias default 24

# 验证
node --version  # 应显示 v24.x.x
```

### 问题：macOS 上 Homebrew 安装失败

**错误消息：**
```
Error: No available formula or cask with the name "openclaw"
```

**解决方案：**
```bash
# 先添加 tap
brew tap openclaw/tap

# 更新 Homebrew
brew update

# 再安装
brew install openclaw
```

---

## Gateway 问题

### 问题：Gateway 启动失败 — 埠被占用

**错误消息：**
```
Error: EADDRINUSE: address already in use :::18789
```

**诊断：**
```bash
# 查看是什么进程占用了 18789
# macOS
lsof -i :18789

# Linux
ss -tlnp | grep 18789
```

**解决方案：**
```bash
# 方法一：停止占用埠的进程
kill $(lsof -t -i :18789)

# 方法二：使用其他埠
# ~/.openclaw/gateway.yaml
# gateway:
#   port: 18790
```

### 问题：Gateway 无法连接

**现象：** `curl http://127.0.0.1:18789/api/v1/health` 返回 `Connection refused`

**诊断步骤：**

```bash
# 1. 确认 OpenClaw 是否在运行
openclaw status

# 2. 确认 Gateway 绑定位址
grep -A 3 "gateway:" ~/.openclaw/gateway.yaml

# 3. 确认埠是否在监听
# macOS
lsof -i :18789
# Linux
ss -tlnp | grep 18789

# 4. 查看 Gateway 日志
tail -50 ~/.openclaw/logs/gateway.log
```

### 问题：Gateway 认证失败 (401)

**错误消息：**
```json
{"error": "unauthorized", "message": "Missing or invalid authentication token"}
```

**解决方案：**
```bash
# 1. 确认 token 配置
grep -A 3 "auth:" ~/.openclaw/gateway.yaml

# 2. 确认请求中的 token
curl -v -H "Authorization: Bearer YOUR_TOKEN" \
  http://127.0.0.1:18789/api/v1/health

# 3. 如果 token 遗失，重新生成
openssl rand -hex 32
# 将新 token 更新到 gateway.yaml 并重启 OpenClaw
openclaw restart
```

---

## 通信平台连接问题

### 问题：Telegram Bot 无响应

**诊断步骤：**

```bash
# 1. 确认 Bot Token 有效
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# 2. 确认 channel 配置
cat ~/.openclaw/channels/telegram.yaml

# 3. 查看 Telegram adapter 日志
grep "telegram" ~/.openclaw/logs/gateway.log | tail -20

# 4. 确认 Bot 是否配置了 webhook（会与 polling 冲突）
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
```

**常见原因与解决方案：**

| 原因 | 解决方案 |
|------|---------|
| Bot Token 无效 | 重新从 @BotFather 获取 Token |
| Webhook 冲突 | 清除 webhook：`/deleteWebhook` |
| 用户不在白名单 | 将你的 user ID 加入 `allowed_users` |
| Bot 未启动 | 确认 OpenClaw 正在运行 |

### 问题：Discord Bot 离线

**诊断步骤：**
```bash
# 1. 确认 Bot Token
grep "token" ~/.openclaw/channels/discord.yaml

# 2. 确认 Bot 在 Discord Developer Portal 中的配置
# - 确认已启用 Message Content Intent
# - 确认 Bot 已邀请到你的服务器

# 3. 查看日志
grep "discord" ~/.openclaw/logs/gateway.log | tail -20
```

**常见原因：**
- 未启用 **Message Content Intent**（2024 年后 Discord 要求）
- Bot Token 过期或被重置
- Bot 未被邀请到目标服务器
- 缺少必要的权限（Read Messages、Send Messages）

### 问题：WhatsApp 连接掉线

**现象：** WhatsApp 连接在运行数小时后断开。

**解决方案：**
```bash
# 1. 重新连接
openclaw channel reconnect whatsapp

# 2. 如果频繁断线，清除 session 重新登入
rm -rf ~/.openclaw/channels/whatsapp/session/
openclaw channel setup whatsapp
# 扫描新的 QR Code

# 3. 确认手机上的 WhatsApp 仍在运行
# WhatsApp Web/API 需要手机端保持登入状态
```

:::warning WhatsApp 使用政策
WhatsApp 禁止自动化消息。过于频繁的自动回复可能导致账号被封禁。建议使用 WhatsApp Business API（正式版）或限制回复频率。
:::

---

## LLM 提供者问题

### 问题：API Key 无效或额度用尽

**错误消息：**
```
Error: 401 Unauthorized - Invalid API key
Error: 429 Rate limit exceeded
Error: 402 Payment required - Insufficient credits
```

**解决方案：**
```bash
# 1. 确认环境变量已配置
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY

# 2. 测试 API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 3. 检查额度
# OpenAI: https://platform.openai.com/usage
# Anthropic: https://console.anthropic.com/settings/billing

# 4. 配置 fallback 模型
# ~/.openclaw/providers/default.yaml
# providers:
#   fallback: local  # 使用本地模型作为备用
```

### 问题：LLM 响应速度过慢

**诊断：**
```bash
# 查看平均延迟
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/status | jq '.reasoning.avg_latency_ms'
```

**解决方案：**

| 原因 | 解决方案 |
|------|---------|
| 模型太大 | 改用较小的模型（如 Claude Sonnet） |
| 上下文太长 | 清理记忆，减少上下文 |
| API 延迟高 | 使用本地模型（Ollama） |
| 网络问题 | 检查网络连接和 DNS |

---

## 技能问题

### 问题：技能安装失败

**错误消息：**
```
Error: Failed to install skill 'xxx': Container build failed
```

**解决方案：**
```bash
# 1. 确认容器引擎运行中
podman info  # 或 docker info

# 2. macOS Podman：确认 machine 已启动
podman machine start

# 3. 清除缓存重新安装
openclaw skill cache clear
openclaw skill install <skill-name>

# 4. 查看详细错误
openclaw skill install <skill-name> --verbose
```

### 问题：技能执行时超时

**错误消息：**
```
Error: Skill 'xxx' execution timed out after 30000ms
```

**解决方案：**
```yaml
# 增加超时时间
# ~/.openclaw/gateway.yaml
execution:
  timeout_ms: 60000  # 增加到 60 秒
```

```bash
# 或者针对特定技能调整
openclaw skill config <skill-name> --timeout 60000
```

### 问题：browser-use 技能无法正常运作

**常见原因与解决方案：**

```bash
# 1. 确认 Chromium 已安装在容器中
openclaw skill exec browser-use -- which chromium

# 2. 增加内存限制（browser-use 需要较多内存）
# ~/.openclaw/gateway.yaml
# execution:
#   sandbox:
#     memory_limit: "2g"  # browser-use 建议至少 1.5GB

# 3. 确认网络权限
# browser-use 需要 network: "full"
```

---

## 记忆系统问题

### 问题：记忆系统占用过多磁碟空间

**诊断：**
```bash
# 查看记忆使用量
du -sh ~/.openclaw/memory/
du -sh ~/.openclaw/memory/wal/
du -sh ~/.openclaw/memory/compacted/

# 或透过 API
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/memory/stats
```

**解决方案：**
```bash
# 1. 清理旧的 WAL
openclaw memory prune --before "2025-06-01" --type wal

# 2. 强制压缩
openclaw memory compact --force

# 3. 配置自动清理
# ~/.openclaw/gateway.yaml
# memory:
#   wal:
#     max_age_days: 90
#     auto_prune: true
#   compaction:
#     schedule: "0 3 * * 0"  # 每周日凌晨 3 点
```

### 问题：Agent 忘记之前的对话内容

**原因：** 上下文窗口限制，较旧的对话可能不在当前上下文中。

**解决方案：**
```yaml
# ~/.openclaw/gateway.yaml
memory:
  context:
    # 增加包含在上下文中的对话轮数
    recent_turns: 20    # 默认 10
    # 增加长期记忆的 token 分配
    long_term_ratio: 0.3  # 默认 0.2
```

```bash
# 或者手动提示 Agent 查询记忆
> 你记得我上周说过关于旅行的事吗？搜索你的记忆。
```

---

## 容器引擎问题

### 问题：Podman machine 无法启动（macOS）

**错误消息：**
```
Error: unable to start host networking: could not find podman machine
```

**解决方案：**
```bash
# 重设 Podman machine
podman machine rm -f
podman machine init --cpus 2 --memory 4096
podman machine start

# 验证
podman info | grep rootless
```

### 问题：Docker daemon 未运行

**错误消息：**
```
Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**解决方案：**
```bash
# macOS：启动 Docker Desktop 应用进程

# Linux：启动 Docker daemon
sudo systemctl start docker
sudo systemctl enable docker

# 确认你在 docker 群组中
sudo usermod -aG docker $USER
# 登出再登入
```

:::tip 考虑改用 Podman
如果你经常遇到 Docker daemon 的问题，建议改用 Podman。Podman 无需 daemon，安全性也更高。详见 [安装指南](/docs/getting-started/installation)。
:::

---

## 性能问题

### 问题：OpenClaw 占用过多 CPU / 内存

**诊断：**
```bash
# 查看 OpenClaw 进程的资源使用
# macOS / Linux
top -p $(pgrep -f openclaw)

# 查看容器的资源使用
podman stats  # 或 docker stats
```

**解决方案：**

```yaml
# 限制容器资源
# ~/.openclaw/gateway.yaml
execution:
  sandbox:
    memory_limit: "512m"
    cpu_limit: "1.0"
  optimization:
    warm_pool_size: 1  # 减少预热容器数量
```

### 问题：响应延迟过高

**诊断步骤：**

```bash
# 1. 识别瓶颈
openclaw benchmark

# 2. 查看各阶段延迟
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:18789/api/v1/status | jq '.reasoning'
```

**优化策略：**

| 瓶颈 | 解决方案 |
|------|---------|
| LLM API 延迟 | 使用本地模型或较小的模型 |
| 容器启动慢 | 启用容器预热池和重复使用 |
| 记忆查询慢 | 减少记忆大小、执行压缩 |
| 网络延迟 | 使用地理位置较近的 API 端点 |

---

## 升级问题

### 问题：升级后配置不相容

**解决方案：**
```bash
# 1. 备份现有配置
cp -r ~/.openclaw/ ~/openclaw-backup-$(date +%Y%m%d)

# 2. 升级
npm install -g @openclaw/cli@latest

# 3. 执行配置迁移
openclaw migrate

# 4. 验证
openclaw doctor
```

### 问题：升级后技能无法使用

```bash
# 重建技能容器
openclaw skill rebuild --all

# 如果仍然失败，重新安装
openclaw skill reinstall <skill-name>
```

---

## 日志与诊断工具

### 查看日志

```bash
# 实时查看日志
openclaw logs --follow

# 查看特定组件的日志
openclaw logs --component gateway
openclaw logs --component reasoning
openclaw logs --component memory
openclaw logs --component skills

# 查看特定时间段
openclaw logs --since "2026-03-20T10:00:00"

# 只看错误
openclaw logs --level error
```

### 调试模式

```bash
# 以调试模式启动（输出更多细节）
openclaw start --debug

# 或配置环境变量
export OPENCLAW_LOG_LEVEL=debug
openclaw start
```

### 回报问题

如果以上方法都无法解决你的问题：

1. **搜索 GitHub Issues** — [github.com/openclaw/openclaw/issues](https://github.com/openclaw/openclaw/issues)
2. **搜索 Reddit** — `site:reddit.com/r/openclaw <你的问题关键字>`
3. **提交新 Issue** — 附上 `openclaw doctor` 的输出和相关日志
4. **加入 Discord** — 在 #help 频道提问

---

## 延伸阅读

- [安装指南](/docs/getting-started/installation) — 完整的安装步骤
- [架构概览](/docs/architecture/overview) — 了解系统架构有助于排解问题
- [安全性最佳实践](/docs/security/best-practices) — 安全相关问题的防护
