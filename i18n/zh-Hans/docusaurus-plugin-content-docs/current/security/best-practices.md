---
title: 安全性最佳实践
description: OpenClaw 完整安全指南——从 Gateway 配置、技能审查、容器隔离到 API Key 管理的全方位防护策略。
sidebar_position: 1
---

# 安全性最佳实践

OpenClaw 是一个功能强大的 AI Agent 平台，但强大的能力也意味着巨大的安全风险。本篇提供完整的安全防护指南，涵盖从基础配置到高级防御的所有层面。

:::danger 安全性不是可选的
截至 2026 年 3 月，已有超过 **30,000 个 OpenClaw 实例**因安全配置不当而遭到入侵。Bitdefender 安全审计发现 **135,000 个暴露的实例**。**ClawHavoc 事件**中有 2,400+ 个恶意技能被植入 ClawHub。这些都是真实发生的安全事件。
:::

---

## 安全事件回顾

在深入最佳实践之前，让我们先回顾已经发生的安全事件，理解为什么每一条建议都如此重要：

| 事件 | 时间 | 影响 | 状态 |
|------|------|------|------|
| **CVE-2026-25253** | 2026 年初 | Gateway 远程代码执行（RCE），影响 v3.x 之前版本 | 已修补 |
| **ClawHavoc** | 2025 年底 | 2,400+ 个恶意技能植入 ClawHub，窃取 API key 和个人数据 | 已清除 |
| **18789 端口大规模入侵** | 持续中 | 30,000+ 个实例因暴露 Gateway 端口而被黑 | 持续发生 |
| **Bitdefender 审计** | 2026 年初 | 发现 135,000 个可从公网访问的 OpenClaw 实例 | 报告已公开 |

---

## 第一防线：Gateway 安全

Gateway（port 18789）是 OpenClaw 最大的攻击面。这是你必须优先处理的安全配置。

### 1. 绑定到 localhost

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"  # 只接受本机连接
```

:::danger 致命错误
永远不要设置 `bind: "0.0.0.0"`。这会将你的 Gateway 暴露给整个网络，任何人都可以发送指令给你的 Agent。CVE-2026-25253 正是利用暴露的 Gateway 实现远程代码执行。
:::

### 2. 启用 Gateway 认证

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

生成安全的 token：

```bash
# 生成 64 字符的随机 token
openssl rand -hex 32

# 或使用 Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. 防火墙规则

即使已绑定到 localhost，多一层防护永远不会多余：

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

### 4. 安全的远程访问

如果你需要从其他设备访问 OpenClaw，**永远使用加密通道**：

```bash
# 方法一：SSH 隧道（推荐）
ssh -L 18789:127.0.0.1:18789 user@your-server

# 方法二：WireGuard VPN
# 在服务器上只允许 VPN 子网访问 18789

# 方法三：反向代理 + TLS（高级）
# 使用 Caddy 或 nginx 加上 mTLS 双向认证
```

:::warning 不要使用以下方法
- **ngrok / Cloudflare Tunnel**：直接暴露 Gateway，除非你加上了额外的认证层
- **端口转发**：路由器上的端口转发等同于暴露到公网
- **HTTP（无 TLS）**：中间人攻击可以拦截你的 token 和消息
:::

---

## 第二防线：容器与沙箱安全

### 使用 Podman Rootless（强烈建议）

```bash
# 确认 Podman 以 rootless 模式运行
podman info | grep rootless
# rootless: true

# 配置 OpenClaw 使用 Podman
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
```

### Docker vs Podman 安全比较

| 方面 | Docker（默认） | Podman Rootless |
|------|----------------|-----------------|
| Daemon 权限 | root | 用户级别 |
| 沙箱逃逸风险 | 可获得 root | 只有用户权限 |
| 攻击面 | Docker daemon socket | 无 daemon |
| 网络隔离 | 需要额外配置 | 默认较严格 |
| 推荐程度 | 可用但不建议 | **强烈建议** |

### 容器安全配置

```yaml
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
  sandbox:
    # 内存限制
    memory_limit: "512m"
    # CPU 限制
    cpu_limit: "1.0"
    # 网络访问
    network: "restricted"  # none / restricted / full
    # 文件系统访问
    filesystem:
      read_only: true
      allowed_paths:
        - "/tmp/openclaw-work"
    # 停用不必要的 Linux capabilities
    drop_capabilities:
      - "ALL"
    add_capabilities:
      - "NET_RAW"  # 只在需要网络时
```

---

## 第三防线：技能（Skill）安全

ClawHavoc 事件证明，技能是 OpenClaw 最大的供应链攻击向量。

### 技能安装前的审查流程

```bash
# 步骤 1：查看技能详细信息
openclaw skill info skill-name

# 步骤 2：查看技能源代码
openclaw skill inspect skill-name

# 步骤 3：检查 VirusTotal 扫描结果（ClawHavoc 后新增）
openclaw skill virustotal skill-name

# 步骤 4：查看社区评价与安装数
openclaw skill reviews skill-name
```

### 技能安全分级

| 风险等级 | 说明 | 示例 |
|---------|------|------|
| **低** | 只读操作，不访问网络或文件 | 文本处理、计算、格式转换 |
| **中** | 访问网络但不访问文件系统 | Web 搜索、API 查询、天气 |
| **高** | 访问文件系统或系统命令 | 文件管理、shell 执行、系统监控 |
| **极高** | 同时访问网络和文件系统 | browser-use、自动化脚本 |

### 技能权限最小化

```yaml
# ~/.openclaw/skills/skill-name/permissions.yaml
permissions:
  network:
    enabled: true
    allowed_domains:
      - "api.example.com"
      - "*.googleapis.com"
    denied_domains:
      - "*"  # 默认拒绝所有
  filesystem:
    enabled: false
  shell:
    enabled: false
  environment_variables:
    allowed:
      - "HOME"
      - "PATH"
    denied:
      - "OPENAI_API_KEY"  # 防止技能读取 API key
      - "ANTHROPIC_API_KEY"
```

:::tip 技能审计清单
完整的技能安装前审查步骤，请参考 [技能审计清单](/docs/security/skill-audit-checklist)。
:::

---

## 第四防线：API Key 与 Secrets 管理

### 不要做的事

```yaml
# ❌ 不要在 gateway.yaml 中硬编码 API key
providers:
  openai:
    api_key: "sk-aBcDeFgHiJkLmNoPqRsTuVwXyZ"

# ❌ 不要在 SOUL.md 中包含 API key
# ❌ 不要在 Reddit / Discord 上分享完整配置
# ❌ 不要将 ~/.openclaw/ 加入公开的 Git 仓库
```

### 正确的做法

```bash
# 方法一：环境变量（基本）
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."

# 方法二：dotenv 文件（建议）
# ~/.openclaw/.env（确保此文件不被 Git 追踪）
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# 方法三：密码管理器（最佳）
# 使用 1Password CLI
eval $(op signin)
export OPENAI_API_KEY=$(op item get "OpenAI" --fields api_key)

# 方法四：系统 Keychain（macOS）
security add-generic-password -s "openclaw-openai" -a "api_key" -w "sk-..."
```

```yaml
# ~/.openclaw/gateway.yaml — 引用环境变量
providers:
  openai:
    api_key: "${OPENAI_API_KEY}"
  anthropic:
    api_key: "${ANTHROPIC_API_KEY}"
```

### API Key 轮换策略

| 频率 | 适用场景 |
|------|---------|
| 每 90 天 | 一般使用 |
| 立即 | 怀疑泄露时 |
| 每 30 天 | 高安全需求环境 |
| 安装新技能后 | 如果新技能有网络和环境变量访问权 |

---

## 第五防线：记忆系统安全

记忆系统包含你与 Agent 的所有对话记录和个人数据。

### 记忆文件加密

```bash
# 方法一：磁盘级加密
# macOS：FileVault（系统设置 → 隐私与安全 → FileVault）
# Linux：LUKS
sudo cryptsetup luksFormat /dev/sdX
sudo cryptsetup luksOpen /dev/sdX openclaw-memory

# 方法二：目录级加密（Linux）
# 使用 gocryptfs
gocryptfs -init ~/.openclaw/memory-encrypted
gocryptfs ~/.openclaw/memory-encrypted ~/.openclaw/memory
```

:::warning 记忆中的敏感信息
Agent 可能在对话中收集到你的银行账号、地址、密码等敏感信息，并存储在记忆系统中。定期审查记忆内容，确保没有不该保存的敏感数据。
:::

---

## 安全配置检查清单

使用以下检查清单确保你的 OpenClaw 安装是安全的：

### 必须完成（Critical）

- [ ] Gateway 绑定到 `127.0.0.1`（而非 `0.0.0.0`）
- [ ] Gateway 认证已启用
- [ ] 使用 Podman rootless（而非 Docker）
- [ ] API key 使用环境变量（而非硬编码）
- [ ] 已更新到最新版本（修补 CVE-2026-25253）
- [ ] 通讯平台已设置白名单用户

### 强烈建议（High）

- [ ] 防火墙封堵 18789 端口的外部访问
- [ ] 已启用磁盘加密
- [ ] 技能安装前已完成安全审查
- [ ] 远程访问使用 SSH 隧道或 VPN
- [ ] API key 定期轮换

### 建议完成（Medium）

- [ ] 启用 seccomp profile
- [ ] 配置记忆清理策略
- [ ] 监控网络活动
- [ ] 记忆系统加密
- [ ] 定期审查已安装技能的更新

---

## 安全事件应急流程

如果你怀疑你的 OpenClaw 实例已被入侵：

### 立即行动

```bash
# 1. 停止 OpenClaw
openclaw stop --force

# 2. 保留证据（先备份再清理）
cp -r ~/.openclaw/ ~/openclaw-incident-backup-$(date +%Y%m%d)

# 3. 检查可疑活动
grep -i "error\|unauthorized\|unknown\|suspicious" ~/.openclaw/logs/*.log

# 4. 检查已安装的技能
ls -la ~/.openclaw/skills/

# 5. 检查网络连接
netstat -an | grep 18789
```

### 恢复步骤

```bash
# 1. 轮换所有 API key（立即！）
# - OpenAI、Anthropic、Google 等所有 LLM 提供商
# - Telegram、Discord 等所有通讯平台 token

# 2. 重新安装 OpenClaw（干净安装）
npm uninstall -g @openclaw/cli
rm -rf ~/.openclaw/
npm install -g @openclaw/cli
openclaw init

# 3. 只重新安装已验证的技能

# 4. 恢复记忆数据（如果确认未被篡改）

# 5. 强化安全配置（参考本文档的所有建议）
```

---

## 延伸阅读

- [威胁模型分析](/docs/security/threat-model) — 了解所有攻击向量和攻击面
- [技能审计清单](/docs/security/skill-audit-checklist) — 安装技能前的完整审查步骤
- [疑难排解](/docs/troubleshooting/common-issues) — 安全相关的常见问题
