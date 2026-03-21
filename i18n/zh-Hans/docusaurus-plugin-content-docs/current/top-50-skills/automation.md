---
sidebar_position: 6
title: "自动化 Skills"
description: "OpenClaw 自动化类 Skills 完整评测：n8n、Browser Automation、Home Assistant、IFTTT、Webhook Relay"
keywords: [OpenClaw, Skills, Automation, n8n, Browser Automation, Home Assistant, IFTTT]
---

# 自动化 Skills (Automation)

自动化 Skills 将 OpenClaw Agent 从「被动响应」提升为「主动执行」。让 Agent 可以创建自动化工作流、控制浏览器执行重复操作、串接不同服务，甚至管理你的智慧家庭装置。

---

## #8 — n8n

| 属性 | 内容 |
|------|------|
| **排名** | #8 / 50 |
| **类别** | Automation / Development |
| **总分** | 63 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/n8n-openclaw` |
| **目标用户** | 自动化工程师、No-code/Low-code 用户 |

### 功能说明

n8n 是开源的 workflow automation 平台，这个 Skill 让 OpenClaw Agent 能操控 n8n：

- **创建工作流**：透过自然语言描述创建 n8n workflow
- **执行工作流**：触发已创建的工作流
- **监控状态**：查看工作流执行记录和错误
- **节点管理**：新增、修改、删除 workflow 中的节点
- **500+ 集成**：透过 n8n 连接 500+ 第三方服务

### 为什么重要

n8n 本身就能连接数百个服务，但需要手动设计 workflow。加入 OpenClaw Agent 后，你只需用自然语言描述想要的自动化流程，Agent 就能帮你创建和维护 n8n workflow。这是「AI + 自动化」的最佳组合。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 8 | 9 | 8 | 8 | 7 | 8 | **63** |

### 安装与配置

```bash
clawhub install community/n8n-openclaw

# 需要先有 n8n instance 运行
# 方法 1：Docker（推荐）
docker run -d --name n8n -p 5678:5678 n8nio/n8n

# 方法 2：npm
npm install -g n8n && n8n start

# 配置 Skill 连接
openclaw skill configure n8n-openclaw \
  --url http://localhost:5678 \
  --api-key your_n8n_api_key
```

### 依赖与安全

- **依赖**：n8n instance（Docker 或本机安装）
- **权限需求**：n8n API 完整存取
- **安全性**：SEC 7/10 — n8n workflow 可执行任意操作，需审慎管理

:::warning n8n 安全配置
- 为 n8n 配置强密码和 API Key
- 限制 n8n 的网络存取范围
- 审核 Agent 创建的 workflow 再启用
- 建议使用 `--dry-run` 模式先预览 workflow
:::

- **替代方案**：IFTTT（#37）更简单但功能有限；Zapier 集成尚在开发中

---

## #16 — Browser Automation

| 属性 | 内容 |
|------|------|
| **排名** | #16 / 50 |
| **类别** | Automation |
| **总分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/browser-auto` |
| **目标用户** | 需要自动化浏览器操作的用户 |

### 功能说明

比 Web Browsing Skill 更进阶的浏览器自动化工具：

- **表单填写**：自动填写网页表单
- **点击操作**：模拟用户点击、卷动、拖拉
- **登入自动化**：管理登入 session
- **数据提取**：从 SPA 中提取动态加载的数据
- **流程录制**：录制浏览器操作后自动重播
- **Playwright 底层**：基于 Playwright 框架

### 为什么重要

Web Browsing 擅长「看网页」，Browser Automation 擅长「操作网页」。对于那些没有 API 的服务（如某些政府网站、传统企业系统），Browser Automation 是唯一的自动化方式。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 7 | 7 | 6 | 8 | **58** |

### 安装与配置

```bash
clawhub install community/browser-auto

# 安装 Playwright 浏览器
npx playwright install chromium

# 配置
openclaw skill configure browser-auto \
  --browser chromium \
  --headless true \
  --timeout 30000
```

:::warning 安全与合规
Browser Automation 可以模拟用户行为，可能违反某些网站的服务条款。请确认你的使用方式符合目标网站的 Terms of Service。不要用于绕过验证码或存取限制。
:::

### 依赖与安全

- **依赖**：Playwright + Chromium
- **权限需求**：网络存取、本机浏览器执行
- **安全性**：SEC 6/10 — 可执行任意浏览器操作，攻击面较大
- **替代方案**：Web Browsing（#2）for 简单浏览；Apify（#21）for 大规模爬取

---

## #10 — Home Assistant（自动化面向）

Home Assistant 的完整介绍请见[智慧家庭 Skills](./smart-home#10--home-assistant)。在自动化工作流中，它扮演的角色如下：

### 自动化场景

```bash
# 结合 Calendar Skill 的场景自动化
openclaw run "
  每天早上 8 点上班前：
  1. 查看今天的日历
  2. 如果有视频会议，开启办公室灯光到『工作模式』
  3. 播放 Focus 音乐到客厅喇叭
  4. 配置勿扰模式到第一场会议结束
"
```

Home Assistant Skill 让 Agent 能控制智慧家庭装置，结合 Calendar、Gmail 等 Skill 可以实现真正的「场景感知自动化」。

---

## #37 — IFTTT

| 属性 | 内容 |
|------|------|
| **排名** | #37 / 50 |
| **类别** | Automation |
| **总分** | 51 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/ifttt-claw` |
| **目标用户** | IFTTT 用户、简易自动化需求 |

### 功能说明

透过 IFTTT Webhooks 触发自动化：

- 触发 IFTTT Applets
- 接收 IFTTT 事件通知
- 管理 Webhook 端点
- 串接 IFTTT 支援的 700+ 服务

### 为什么重要

IFTTT 是最容易上手的自动化平台。对于不想架设 n8n 的用户，IFTTT 提供了「零基础设施」的自动化方案。虽然功能不如 n8n 强大，但胜在简单。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 5 | 6 | 7 | 6 | 7 | 7 | 6 | **51** |

### 安装与配置

```bash
clawhub install community/ifttt-claw

# 配置 Webhooks Key（从 IFTTT 获取）
openclaw skill configure ifttt-claw \
  --webhooks-key your_ifttt_webhooks_key
```

### 依赖与安全

- **依赖**：IFTTT 账号、Webhooks 服务启用
- **权限需求**：IFTTT Webhooks API
- **安全性**：SEC 7/10 — 仅透过 Webhooks 触发，权限有限
- **替代方案**：n8n（#8）更强大且开源

---

## #48 — Webhook Relay

| 属性 | 内容 |
|------|------|
| **排名** | #48 / 50 |
| **类别** | Automation |
| **总分** | 44 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/webhook-relay` |
| **目标用户** | 进阶自动化开发者 |

### 功能说明

让 OpenClaw Agent 接收外部 Webhook 呼叫并做出反应：

- 创建 Webhook 端点
- 解析 incoming payload
- 触发 Agent 动作
- 支援 retry 和 dead-letter queue

### 为什么重要

Webhook Relay 让 Agent 变成「被呼叫端」— 外部服务（如 GitHub、Stripe、Shopify）可以在事件发生时通知 Agent。这开启了「事件驱动」的 Agent 模式。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 5 | 6 | 3 | 6 | 5 | 6 | 7 | 6 | **44** |

### 安装与配置

```bash
clawhub install community/webhook-relay

# 创建端点
openclaw skill configure webhook-relay \
  --port 9876 \
  --secret your_webhook_secret

# 配置转发规则
openclaw run "当收到 GitHub push event 时，执行安全扫描"
```

### 依赖与安全

- **依赖**：公开可存取的网络端点（或使用 ngrok）
- **权限需求**：网络 port 监听
- **安全性**：SEC 7/10 — 暴露端点需要做好认证
- **替代方案**：n8n（#8）内建 Webhook 触发器

---

## 自动化 Skills 组合推荐

### 全能自动化

```bash
clawhub install community/n8n-openclaw
clawhub install community/browser-auto
clawhub install openclaw/homeassistant
# n8n 处理服务间串接，Browser Auto 处理无 API 服务，Home Assistant 处理实体装置
```

### 轻量自动化

```bash
clawhub install community/ifttt-claw
# 搭配内建 Gmail + Calendar
# 适合不想架设基础设施的用户
```

### 事件驱动架构

```bash
clawhub install community/n8n-openclaw
clawhub install community/webhook-relay
clawhub install openclaw/github
# Agent 被动接收事件并主动处理
```
