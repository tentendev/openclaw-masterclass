---
slug: security-guide
title: OpenClaw 安全性完整指南
authors: [openclaw-masterclass]
tags: [openclaw, security]
image: /img/docusaurus-social-card.jpg
description: OpenClaw 安全性完整指南——深入了解 ClawHavoc 事件、CVE-2026-25253 漏洞、0.0.0.0 绑定风险，以及个人与企业的安全最佳实践。
---

# OpenClaw 安全性完整指南

安全性是部署任何 AI Agent 框架时最重要的考量之一。本文将深入探讨 OpenClaw 的安全性议题，包括已知漏洞、历史事件，以及个人和企业用户的最佳实践。

<!-- truncate -->

## ClawHavoc：一次重要的安全事件

2026 年 2 月，安全研究团队 **Lobster Security Labs** 发现了一组被称为 **ClawHavoc** 的安全漏洞。这组漏洞影响了 OpenClaw Gateway 的核心通讯机制，如果被利用，攻击者可以：

1. **未授权访问 Agent 控制界面**：绕过认证机制直接向 Agent 发送指令
2. **Skills 注入攻击**：在目标实例上加载恶意 Skills
3. **对话数据泄露**：拦截 Agent 与用户之间的通讯内容

### ClawHavoc 的影响范围

- **受影响版本**：OpenClaw v3.8.0 至 v4.1.2
- **严重程度**：Critical（CVSS 9.1）
- **修复版本**：OpenClaw v4.1.3+

OpenClaw 安全团队在接获通报后 48 小时内发布了修复补丁，并通过 Gateway 的自动更新机制推送给所有已启用自动更新的实例。

### 教训

ClawHavoc 事件让社区深刻认识到：

- AI Agent 框架的攻击面比传统 Web 应用更广
- Skill 的动态加载机制需要更严格的验证
- 实时通讯的加密不能仅依赖传输层

## CVE-2026-25253：WebSocket 认证绕过

**CVE-2026-25253** 是 ClawHavoc 中最严重的单一漏洞，影响 OpenClaw Gateway 的 WebSocket 连接认证机制。

### 漏洞详情

OpenClaw Gateway 默认在 **port 18789** 上监听 WebSocket 连接。在受影响的版本中，WebSocket 的握手阶段存在一个竞态条件（Race Condition）：

```
攻击者 → 发送特制的 WebSocket 升级请求
       → 在认证 Token 验证完成前注入恶意 Frame
       → Gateway 将恶意 Frame 当作已认证的指令处理
```

### 技术细节

问题出在 Gateway 的连接状态机：

1. 客户端发起 WebSocket 连接
2. Gateway 接收连接并开始验证 Bearer Token
3. **漏洞**：在验证完成前，Gateway 的消息队列已经开始接收 Frame
4. 攻击者利用这个时间窗口注入指令 Frame

### 修复方式

修复方案引入了"连接待命区"（Connection Staging）机制：

- WebSocket 连接建立后进入 Staging 状态
- 所有在 Staging 状态接收的 Frame 会被缓冲而非处理
- 只有在认证完成后，连接才会进入 Active 状态
- Staging 超时（默认 5 秒）后未完成认证的连接会被自动断开

## 0.0.0.0 绑定风险

这是一个常被忽略但非常危险的配置问题。

### 什么是 0.0.0.0 绑定？

OpenClaw Gateway 的默认配置会将 WebSocket 服务绑定到 `0.0.0.0:18789`，这意味着 Gateway 会监听**所有网络接口**上的连接请求。

### 为什么这很危险？

在以下场景中，0.0.0.0 绑定会造成严重的安全风险：

| 场景 | 风险 |
|------|------|
| 开发环境连接公共 Wi-Fi | Gateway 暴露在局域网中 |
| 云端 VM 未设置防火墙 | Gateway 暴露在公网 |
| Docker 容器使用 host 网络模式 | Gateway 暴露在主机所有接口 |
| 多租户环境 | 其他租户可访问你的 Gateway |

### 正确的绑定配置

**个人开发环境：**

```yaml
# openclaw.config.yaml
gateway:
  host: "127.0.0.1"  # 只监听本地回环
  port: 18789
```

**生产环境（搭配反向代理）：**

```yaml
# openclaw.config.yaml
gateway:
  host: "127.0.0.1"  # Gateway 只接受来自反向代理的连接
  port: 18789

# Nginx/Caddy 负责 TLS 终止和外部连接
```

**Docker 环境：**

```yaml
# docker-compose.yml
services:
  openclaw-gateway:
    ports:
      - "127.0.0.1:18789:18789"  # 不要用 "18789:18789"
```

## 个人用户安全最佳实践

### 1. 保持更新

```bash
# 检查当前版本
openclaw version

# 更新到最新版本
openclaw update

# 启用自动安全更新
openclaw config set auto-security-update true
```

### 2. 使用强认证

```yaml
# openclaw.config.yaml
auth:
  type: "bearer"
  token_rotation: true
  token_ttl: "24h"
  # 不要使用默认 Token！
  # 生成强 Token: openclaw auth generate-token
```

### 3. 限制 Skill 权限

```yaml
# 为每个 Skill 设置最小权限
skills:
  weather-skill:
    permissions:
      - network:read  # 只允许读取网络
    deny:
      - filesystem:*  # 禁止访问文件系统
      - process:*     # 禁止执行系统指令
```

### 4. 审查第三方 Skills

在安装任何第三方 Skill 之前：

- 检查 Skill 的源代码
- 确认 Skill 作者的信誉
- 查看社区评价和下载量
- 在沙盒环境中先测试

```bash
# 在沙盒模式下测试 Skill
openclaw skill install --sandbox suspicious-skill
openclaw skill test suspicious-skill --verbose
```

### 5. 加密本地数据

```yaml
# openclaw.config.yaml
storage:
  encryption: true
  encryption_key_source: "keychain"  # macOS Keychain / Windows Credential Store
```

## 企业安全最佳实践

### 1. 网络隔离

```
[Internet] → [WAF/CDN] → [Reverse Proxy] → [OpenClaw Gateway] → [Internal Network]
                                                    ↓
                                             [Agent Cluster]
                                                    ↓
                                             [Skill Sandbox]
```

- Gateway 部署在 DMZ 或专用子网
- Agent 和 Skill 在隔离的内部网络中运行
- 所有跨网段通讯必须通过防火墙规则

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

### 3. 审计日志

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

### 4. Skill 白名单

企业环境中应该只允许经过审核的 Skills：

```yaml
# openclaw.config.yaml
skills:
  marketplace:
    enabled: false  # 禁用公开 Marketplace
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

### 6. 密钥管理

```yaml
# openclaw.config.yaml
secrets:
  provider: "vault"  # HashiCorp Vault
  vault:
    address: "https://vault.company.com"
    auth_method: "kubernetes"
    secret_path: "secret/data/openclaw"
```

## 安全检查清单

在部署 OpenClaw 到生产环境前，请确认以下项目：

- [ ] Gateway 未绑定到 0.0.0.0
- [ ] 已更新到最新版本（>= v4.1.3）
- [ ] 已更换默认认证 Token
- [ ] 已启用 TLS 加密
- [ ] 已配置 RBAC
- [ ] 已启用审计日志
- [ ] 已设置 Skill 白名单（企业环境）
- [ ] 已配置网络防火墙规则
- [ ] 已设置自动安全更新
- [ ] 已建立安全事件响应计划

## 报告安全漏洞

如果你发现 OpenClaw 的安全漏洞，请通过以下方式报告：

- **安全邮箱**：security@openclaw.dev
- **HackerOne**：hackerone.com/openclaw
- **PGP Key**：可在官方网站的 /.well-known/security.txt 中找到

请勿在公开的 GitHub Issues 中披露安全漏洞。OpenClaw 安全团队承诺在 48 小时内回复所有安全报告。

---

*OpenClaw MasterClass 团队*
