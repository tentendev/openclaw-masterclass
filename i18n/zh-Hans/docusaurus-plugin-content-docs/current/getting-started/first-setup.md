---
title: 首次配置
description: OpenClaw 安装后的首次配置流程——从初始化配置文件、创建 SOUL.md、连接 LLM 到测试第一个命令。
sidebar_position: 2
---

# 首次配置

恭喜你完成了 [安装](./installation.md)！本篇将带你走过首次配置流程，让 OpenClaw 真正动起来。

---

## 配置总览

首次配置需要完成以下四个步骤：

1. 执行交互式配置精灵
2. 创建 SOUL.md 人格文件
3. 连接第一个 LLM 提供者
4. 测试基本命令

整个流程约需 5-10 分钟。

---

## 步骤一：执行配置精灵

OpenClaw 提供交互式配置精灵，能快速完成基本配置：

```bash
openclaw setup
```

精灵会依序询问以下问题：

```
🦞 Welcome to OpenClaw Setup!

? Choose your preferred language: 简体中文
? Select container engine: Podman (recommended)
? Gateway bind address: 127.0.0.1 (localhost only)
? Gateway port: 18789
? Choose your primary LLM provider: (Use arrow keys)
  ❯ Anthropic (Claude)
    OpenAI (GPT)
    Google (Gemini)
    DeepSeek
    Ollama (Local)
    Skip for now
? Enter your API key: sk-ant-•••••••••
? Create a default SOUL.md personality? Yes

✅ Setup complete! Config saved to ~/.openclaw/
```

:::tip 不确定选哪个 LLM？
如果你还没决定要用哪个 LLM 提供者，可以先选「Skip for now」。稍后可以透过 [选择 AI 模型](./choose-llm.md) 页面了解各模型的比较，再回来配置。
:::

---

## 步骤二：创建 SOUL.md 人格文件

SOUL.md 是 OpenClaw 最独特的设计之一——它定义了你的 AI 代理的「灵魂」。配置精灵会为你创建一份基本模板：

```bash
# 查看默认的 SOUL.md
cat ~/.openclaw/soul.md
```

默认内容如下：

```markdown
# SOUL.md

## 基本信息
- 名称：小龙
- 语言：简体中文（台湾用语）
- 风格：友善、专业、适度幽默

## 行为规范
- 回复时保持简洁，除非用户要求详细说明
- 使用台湾惯用语，避免中国大陆用语
- 遇到不确定的问题时，诚实告知而非猜测

## 专长领域
- 一般知识问答
- 日常任务协助
- 技术问题排解
```

你可以稍后再深入调整 SOUL.md。详细的人格配置指南请见 [SOUL.md 人格配置](./soul-md-config.md)。

---

## 步骤三：连接 LLM 提供者

如果你在配置精灵中已经输入了 API Key，可以直接验证连接：

```bash
# 测试 LLM 连接
openclaw provider test
```

预期输出：

```
Testing connection to Anthropic (Claude)...
✓ API key valid
✓ Model claude-opus-4-6 available
✓ Response time: 342ms
✓ Connection successful!
```

### 手动配置 LLM 提供者

如果你跳过了配置精灵中的 LLM 步骤，可以手动编辑配置文件：

```bash
# 编辑 LLM 提供者配置
nano ~/.openclaw/providers/default.yaml
```

```yaml
# ~/.openclaw/providers/default.yaml

provider:
  name: anthropic
  model: claude-opus-4-6
  api_key: "${ANTHROPIC_API_KEY}"  # 建议使用环境变量
  max_tokens: 4096
  temperature: 0.7

# 备用提供者（当主要提供者不可用时自动切换）
fallback:
  name: ollama
  model: llama3.3:70b
  endpoint: "http://127.0.0.1:11434"
```

:::warning API Key 安全
**永远不要**将 API Key 直接写死在配置文件中。请使用环境变量：

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中加入
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
export OPENAI_API_KEY="sk-your-key-here"
```

配置文件中使用 `${VARIABLE_NAME}` 语法引用环境变量。
:::

---

## 步骤四：启动 OpenClaw 并测试

### 启动 Gateway

```bash
# 前景模式启动（适合测试，按 Ctrl+C 停止）
openclaw start

# 或以背景模式启动
openclaw start --daemon
```

启动后你会看到：

```
🦞 OpenClaw v4.2.1 starting...
├─ Gateway listening on 127.0.0.1:18789
├─ Memory system: WAL initialized
├─ Container engine: Podman 5.4.0 (rootless)
├─ LLM provider: Anthropic (claude-opus-4-6)
└─ Skills loaded: 0 (install skills from ClawHub!)

Ready! Use 'openclaw chat' to start a conversation.
```

### 使用 CLI 进行对话

```bash
# 开启交互式聊天
openclaw chat
```

```
🦞 OpenClaw Chat (type 'exit' to quit)

You: 你好！你是谁？
小龙: 你好！我是小龙，你的 AI 助理 🦞 有什么我可以帮忙的吗？

You: 今天天气如何？
小龙: 我目前还没有安装天气查询的技能。你可以透过以下命令安装：
      openclaw skill install weather-tw
      安装后我就能帮你查天气啰！

You: exit
Goodbye! 🦞
```

### 测试 Gateway API

你也可以直接透过 HTTP API 测试：

```bash
# 发送测试消息到 Gateway
curl -X POST http://127.0.0.1:18789/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, OpenClaw!",
    "channel": "api",
    "user_id": "test-user"
  }'
```

预期响应：

```json
{
  "status": "ok",
  "response": "你好！我是小龙，有什么可以帮忙的吗？",
  "metadata": {
    "model": "claude-opus-4-6",
    "tokens_used": 42,
    "response_time_ms": 387
  }
}
```

---

## 安装你的第一个技能

OpenClaw 刚安装时没有任何技能。让我们安装几个实用的基础技能：

```bash
# 搜索技能
openclaw skill search "翻译"

# 安装翻译技能
openclaw skill install translator-pro

# 安装网页搜索技能
openclaw skill install web-search

# 查看已安装的技能
openclaw skill list
```

:::info ClawHub 技能安全
在安装任何技能之前，建议查看其安全评等与社区评价。ClawHavoc 事件中曾有 2,400+ 个恶意技能被植入 ClawHub。安装前请确认：
- 技能作者的验证状态
- 社区评分与下载数
- 权限要求是否合理

详见 [技能审计清单](/docs/security/skill-audit-checklist)。
:::

---

## 常用管理命令

| 命令 | 说明 |
|------|------|
| `openclaw start` | 启动 Gateway |
| `openclaw start --daemon` | 以背景模式启动 |
| `openclaw stop` | 停止 Gateway |
| `openclaw restart` | 重启 |
| `openclaw status` | 查看执行状态 |
| `openclaw chat` | 开启交互式聊天 |
| `openclaw doctor` | 执行健康检查 |
| `openclaw logs` | 查看实时日志 |
| `openclaw logs --tail 50` | 查看最后 50 行日志 |
| `openclaw config edit` | 编辑配置文件 |
| `openclaw skill list` | 列出已安装的技能 |

---

## 下一步

你的 OpenClaw 已经可以运作了！接下来你可以：

- [连接通信平台](./connect-channels.md) — 让 AI 进驻你的 WhatsApp、Telegram、LINE 等
- [选择 AI 模型](./choose-llm.md) — 深入了解各 LLM 模型的特色与比较
- [SOUL.md 人格配置](./soul-md-config.md) — 打造独一无二的 AI 人格
