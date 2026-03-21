---
title: API Keys 获取指南
description: 如何获取 OpenAI、Anthropic、Google Gemini、DeepSeek 等 LLM 提供者的 API Key，并在 OpenClaw 中配置使用。
sidebar_position: 3
---

# API Keys 获取指南

OpenClaw 需要至少一个 LLM 提供者的 API Key 才能运作。本指南将逐步教你如何获取各大 LLM 提供者的 API Key，以及在 OpenClaw 中的配置方式。

:::info 费用提醒
使用 LLM API 会生成费用。每个提供者的计费方式不同，请在申请前确认价格。大部分提供者都有免费额度供初始测试使用。
:::

---

## 快速比较表

| 提供者 | 推荐模型 | 免费额度 | 每百万 Token 价格（约） | 适合场景 |
|--------|---------|---------|----------------------|---------|
| **OpenAI** | GPT-5.2 Codex | 有限额 | $2-15 | 通用对话、代码生成 |
| **Anthropic** | Claude Opus 4.6 | 有限额 | $3-15 | 长文分析、复杂推理 |
| **Google** | Gemini 2.5 Pro | 免费额度较高 | $1-7 | 多模态、性价比高 |
| **DeepSeek** | DeepSeek-V3 | 价格极低 | $0.1-0.5 | 预算导向、中文优化 |
| **Ollama (本机)** | 各种开源模型 | 完全免费 | $0（仅硬件成本） | 离线使用、隐私优先 |

---

## OpenAI API Key

### 申请步骤

1. 前往 [platform.openai.com](https://platform.openai.com)
2. 注册账号或登入现有账号
3. 点选左侧菜单的 **API Keys**
4. 点选 **Create new secret key**
5. 为 Key 命名（例如 `openclaw-production`）
6. 复制并安全存储 Key（只会显示一次）

### 在 OpenClaw 中配置

在 OpenClaw 的配置文件中加入：

```yaml
llm:
  provider: openai
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: gpt-5.2-codex
```

或使用环境变量：

```bash
export OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 费用控管建议

- 配置每月用量上限（Monthly Budget）
- 使用 Usage Dashboard 监控消耗
- 开发测试时使用较便宜的模型（如 GPT-4o-mini）

:::caution API Key 安全
绝对不要将 API Key 提交到 Git repository 或分享给他人。建议使用环境变量或专门的 secrets manager 来管理。
:::

---

## Anthropic API Key

### 申请步骤

1. 前往 [console.anthropic.com](https://console.anthropic.com)
2. 注册账号（需要电话号码验证）
3. 进入 **Settings** → **API Keys**
4. 点选 **Create Key**
5. 复制并安全存储

### 在 OpenClaw 中配置

```yaml
llm:
  provider: anthropic
  api_key: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: claude-opus-4-6
```

或环境变量：

```bash
export ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 推荐用法

Claude 模型特别擅长：
- **长文脉络理解**：最高支援 1M token context window
- **复杂推理任务**：多步骤逻辑分析
- **代码审查**：精确的代码分析与建议

---

## Google Gemini API Key

### 申请步骤

1. 前往 [aistudio.google.com](https://aistudio.google.com)
2. 使用 Google 账号登入
3. 点选 **Get API Key**
4. 选择或创建 Google Cloud Project
5. 复制生成的 API Key

### 在 OpenClaw 中配置

```yaml
llm:
  provider: google
  api_key: AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: gemini-2.5-pro
```

### 特色功能

- 多模态支援（图片、视频、音讯）
- 免费额度相对充裕
- 与 Google Workspace 集成良好

---

## DeepSeek API Key

### 申请步骤

1. 前往 [platform.deepseek.com](https://platform.deepseek.com)
2. 注册账号（支援中国大陆手机号码）
3. 进入控制台，找到 **API Keys** 区域
4. 创建新的 Key 并复制

### 在 OpenClaw 中配置

```yaml
llm:
  provider: deepseek
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: deepseek-v3
```

### 适用场景

- **预算有限**：价格仅为 OpenAI 的 1/10 到 1/30
- **中文场景**：针对中文做过特别优化
- **中国大陆用户**：无需翻墙即可使用

:::note 中国大陆特殊说明
DeepSeek 是中国大陆用户的首选 LLM 提供者，因为无需翻墙且价格极低。但请注意，国有企业使用 AI 服务可能有额外合规要求。详见 [中国生态系统](/docs/resources/chinese-ecosystem)。
:::

---

## Ollama（本机模型）

### 安装步骤

Ollama 不需要 API Key，因为它在你的本机电脑上运行开源模型。

1. 前往 [ollama.com](https://ollama.com) 下载安装
2. 安装完成后，拉取模型：

```bash
ollama pull llama3.3
ollama pull deepseek-r1:32b
```

3. 在 OpenClaw 中配置：

```yaml
llm:
  provider: ollama
  base_url: http://localhost:11434
  model: llama3.3
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 完全免费 | 需要较强的硬件（GPU） |
| 数据不离开本机 | 模型能力通常不如云端 |
| 无需网络连接 | 大模型启动较慢 |
| 无 API 限流 | 需自行管理模型更新 |

---

## 多模型配置策略

OpenClaw 支援同时配置多个 LLM 提供者，并根据任务类型自动选择最适合的模型：

```yaml
llm:
  default_provider: anthropic
  default_model: claude-opus-4-6

  routing:
    - task: code_generation
      provider: openai
      model: gpt-5.2-codex
    - task: casual_chat
      provider: deepseek
      model: deepseek-v3
    - task: image_analysis
      provider: google
      model: gemini-2.5-pro
    - task: offline_fallback
      provider: ollama
      model: llama3.3
```

:::tip 省钱策略
将日常闲聊交给 DeepSeek 或 Ollama 处理，仅在需要高品质推理时才使用 Claude 或 GPT。这样可以大幅降低每月的 API 费用。
:::

---

## API Key 安全最佳实践

1. **使用环境变量**：不要将 Key 直接写在配置文件中
2. **定期轮换**：每 90 天更换一次 API Key
3. **配置用量上限**：在每个提供者的控制台配置月度预算
4. **最小权限原则**：如果提供者支援，为 Key 配置最小必要权限
5. **监控异常用量**：定期检查 API 使用量仪表板

:::danger 外泄处理
如果你的 API Key 不小心外泄（例如提交到 GitHub），请立即：
1. 在提供者控制台撤销该 Key
2. 创建新的 Key
3. 检查帐单确认是否有异常消费
4. 审查 Git 历史并清理敏感数据
:::

---

## 相关页面

- [选择 AI 模型](/docs/getting-started/choose-llm) — 各模型的详细比较
- [首次配置](/docs/getting-started/first-setup) — 完成初始配置
- [中国生态系统](/docs/resources/chinese-ecosystem) — DeepSeek 与中国大陆特殊考量
- [安全性最佳实践](/docs/security/best-practices) — 完整安全配置指南
