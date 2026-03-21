---
title: 选择 AI 模型
description: 比较 OpenClaw 支援的各大 LLM 模型——Claude、GPT、Gemini、DeepSeek、Ollama、GLM-5、KIMI K2.5——的成本、速度、品质与隐私权衡。
sidebar_position: 4
---

# 选择 AI 模型

OpenClaw 支援多家 LLM 提供者，你可以根据需求在不同场景中使用不同模型，甚至配置自动切换机制。本篇将帮助你做出最佳选择。

---

## 模型比较总览

| 模型 | 提供者 | 成本 | 响应速度 | 品质 | 隐私 | 适合场景 |
|------|--------|------|---------|------|------|---------|
| **Claude Opus 4.6** | Anthropic | $$$ | 中等 | ★★★★★ | 云端 | 复杂推理、长文撰写 |
| **Claude Sonnet 4.5** | Anthropic | $$ | 快 | ★★★★ | 云端 | 日常对话、一般任务 |
| **GPT-5.2 Codex** | OpenAI | $$$ | 中等 | ★★★★★ | 云端 | 进程开发、技术任务 |
| **GPT-5.2 Mini** | OpenAI | $ | 很快 | ★★★ | 云端 | 简单对话、快速回复 |
| **Gemini 3 Pro** | Google | $$ | 快 | ★★★★ | 云端 | 多模态、搜索集成 |
| **DeepSeek V3** | DeepSeek | $ | 快 | ★★★★ | 云端* | 中文任务、高性价比 |
| **Ollama (本机)** | 你自己 | 免费 | 视硬件 | ★★~★★★★ | ★★★★★ | 完全离线、最大隐私 |
| **GLM-5** | 智谱 AI | $ | 快 | ★★★★ | 云端 | 中文任务 |
| **KIMI K2.5** | Moonshot | $$ | 中等 | ★★★★ | 云端 | 长上下文、中文任务 |

> *DeepSeek 为中国公司，数据处理受中国法律管辖。如有隐私顾虑请斟酌使用。

---

## 详细介绍

### Claude（Anthropic）

Claude 是目前 OpenClaw 社区中最受欢迎的模型之一，尤其在需要细腻推理与安全性的场景中表现优异。

```yaml
# ~/.openclaw/providers/anthropic.yaml

provider:
  name: anthropic
  api_key: "${ANTHROPIC_API_KEY}"

  models:
    primary:
      id: claude-opus-4-6
      max_tokens: 8192
      temperature: 0.7
    fast:
      id: claude-sonnet-4-5
      max_tokens: 4096
      temperature: 0.5

  # 智慧路由：简单问题用 Sonnet，复杂问题用 Opus
  routing:
    enabled: true
    complexity_threshold: 0.6
```

**优势**：推理品质极高、回复自然、安全护栏完善、超长上下文（1M tokens）
**劣势**：Opus 价格较高、部分地区延迟较高

### GPT（OpenAI）

GPT-5.2 系列在代码生成与技术任务上仍具领先地位。

```yaml
# ~/.openclaw/providers/openai.yaml

provider:
  name: openai
  api_key: "${OPENAI_API_KEY}"

  models:
    primary:
      id: gpt-5.2-codex
      max_tokens: 8192
      temperature: 0.7
    fast:
      id: gpt-5.2-mini
      max_tokens: 2048
      temperature: 0.5
```

**优势**：代码生成能力强、生态系统成熟、工具呼叫稳定
**劣势**：成本较高、API 偶有限流

### Gemini（Google）

Gemini 3 Pro 的多模态能力（图片、视频理解）在 OpenClaw 中特别有用。

```yaml
# ~/.openclaw/providers/google.yaml

provider:
  name: google
  api_key: "${GOOGLE_AI_API_KEY}"

  models:
    primary:
      id: gemini-3-pro
      max_tokens: 8192
      temperature: 0.7
    fast:
      id: gemini-3-flash
      max_tokens: 4096
      temperature: 0.5
```

**优势**：多模态能力强、与 Google 服务集成良好、Flash 模型极快
**劣势**：偶有过度安全过滤的问题

### DeepSeek

DeepSeek V3 以极低的成本提供接近顶级模型的品质，特别适合中文场景。

```yaml
# ~/.openclaw/providers/deepseek.yaml

provider:
  name: deepseek
  api_key: "${DEEPSEEK_API_KEY}"
  endpoint: "https://api.deepseek.com"

  models:
    primary:
      id: deepseek-v3
      max_tokens: 8192
      temperature: 0.7
    reasoning:
      id: deepseek-r2
      max_tokens: 16384
      temperature: 0.3
```

:::warning DeepSeek 隐私注意事项
DeepSeek 是中国公司，其 API 服务的数据处理受中国法规管辖。如果你处理敏感个资或企业机密，请审慎评估是否使用。可改用 Ollama 在本机运行 DeepSeek 开源模型版本。
:::

**优势**：性价比极高、中文品质优秀、推理模型 R2 表现亮眼
**劣势**：隐私顾虑、部分地区连接不稳

### Ollama（本机模型）

Ollama 让你在自己的电脑上运行开源 LLM 模型。**完全离线、零成本、最大隐私**。

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 下载模型
ollama pull llama3.3:70b
ollama pull deepseek-v3:distill-32b
ollama pull gemma3:27b
```

```yaml
# ~/.openclaw/providers/ollama.yaml

provider:
  name: ollama
  endpoint: "http://127.0.0.1:11434"

  models:
    primary:
      id: llama3.3:70b
      max_tokens: 4096
      temperature: 0.7
    fast:
      id: gemma3:27b
      max_tokens: 2048
      temperature: 0.5
    code:
      id: deepseek-v3:distill-32b
      max_tokens: 4096
      temperature: 0.3
```

**适用硬件建议**：

| 模型大小 | 最低内存 | 建议 GPU |
|---------|-----------|---------|
| 7B 参数 | 8 GB RAM | 不需要（CPU 可跑） |
| 13B 参数 | 16 GB RAM | 6 GB VRAM |
| 27-32B 参数 | 32 GB RAM | 12 GB VRAM |
| 70B 参数 | 64 GB RAM | 24 GB VRAM |

:::tip Apple Silicon 用户
如果你使用 M1 Pro/Max 以上的 Mac，Ollama 能充分利用统一内存架构。M4 Max 64GB 可以流畅运行 70B 模型，响应速度接近云端 API。
:::

### GLM-5（智谱 AI）

```yaml
# ~/.openclaw/providers/zhipu.yaml

provider:
  name: zhipu
  api_key: "${ZHIPU_API_KEY}"
  endpoint: "https://open.bigmodel.cn/api/paas/v4"

  models:
    primary:
      id: glm-5
      max_tokens: 8192
      temperature: 0.7
```

**优势**：中文理解能力优秀、价格合理
**劣势**：英文能力相对较弱、国际可用性有限

### KIMI K2.5（Moonshot）

```yaml
# ~/.openclaw/providers/moonshot.yaml

provider:
  name: moonshot
  api_key: "${MOONSHOT_API_KEY}"
  endpoint: "https://api.moonshot.cn/v1"

  models:
    primary:
      id: kimi-k2.5
      max_tokens: 8192
      temperature: 0.7
```

**优势**：超长上下文能力突出、中文品质好
**劣势**：速度偏慢、海外延迟高

---

## 本机 vs 云端的取舍

| 考量因素 | 本机（Ollama） | 云端 API |
|---------|---------------|---------|
| **隐私** | 数据不离开电脑 | 送至第三方服务器 |
| **成本** | 仅电费 | 按用量计费 |
| **速度** | 视硬件而定 | 通常较快 |
| **品质** | 开源模型略逊 | 顶级闭源模型 |
| **可用性** | 永远可用 | 依赖网络与 API 状态 |
| **维护** | 需自行更新模型 | 提供者自动更新 |

:::info 混合模式推荐
最佳实践是配置混合模式：日常对话使用本机模型（零成本、高隐私），需要高品质推理时自动切换到云端 API。

```yaml
# ~/.openclaw/providers/default.yaml

routing:
  strategy: hybrid

  # 默认使用本机模型
  default: ollama

  # 当任务复杂度超过阈值时切换到云端
  escalation:
    provider: anthropic
    model: claude-opus-4-6
    trigger:
      - complexity_score: 0.7
      - explicit_request: true  # 用户明确要求时
      - skill_requirement: true # 技能要求云端模型时
```
:::

---

## 配置 API Key

### 使用环境变量（推荐）

```bash
# 在 ~/.zshrc 或 ~/.bashrc 中加入
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
export OPENAI_API_KEY="sk-xxxxx"
export GOOGLE_AI_API_KEY="AIzaSy-xxxxx"
export DEEPSEEK_API_KEY="sk-xxxxx"
export ZHIPU_API_KEY="xxxxx"
export MOONSHOT_API_KEY="sk-xxxxx"
```

### 使用 OpenClaw CLI

```bash
# 交互式配置 API Key（会安全存储在 keychain）
openclaw provider add anthropic
openclaw provider add openai

# 测试连接
openclaw provider test anthropic
openclaw provider test openai
```

### 验证所有提供者

```bash
openclaw provider list

# 输出示例：
# PROVIDER     MODEL              STATUS    LATENCY
# anthropic    claude-opus-4-6    ✓ ok      342ms
# openai       gpt-5.2-codex     ✓ ok      289ms
# ollama       llama3.3:70b       ✓ ok      1.2s
# deepseek     deepseek-v3        ✗ error   API key invalid
```

---

## 费用估算

以每天 100 则对话（平均每则 500 tokens 输入 + 1000 tokens 输出）估算：

| 模型 | 每日成本（USD） | 每月成本（USD） |
|------|----------------|----------------|
| Claude Opus 4.6 | ~$2.25 | ~$67.50 |
| Claude Sonnet 4.5 | ~$0.45 | ~$13.50 |
| GPT-5.2 Codex | ~$2.10 | ~$63.00 |
| GPT-5.2 Mini | ~$0.15 | ~$4.50 |
| Gemini 3 Pro | ~$0.53 | ~$15.75 |
| DeepSeek V3 | ~$0.08 | ~$2.40 |
| Ollama（本机） | $0 | $0 |

> 以上为粗略估算，实际费用依各提供者的最新定价为准。

---

## 下一步

选好了你的 AI 模型之后，是时候赋予它独特的人格了：

- [SOUL.md 人格配置](./soul-md-config.md) — 设计你的 AI 代理的性格与行为
- [连接通信平台](./connect-channels.md) — 如果你还没连接任何平台
- [MasterClass 课程](/docs/masterclass/overview) — 深入学习进阶功能
