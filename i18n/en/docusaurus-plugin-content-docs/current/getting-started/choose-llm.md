---
title: Choose an AI Model
description: Compare LLM models supported by OpenClaw — Claude, GPT, Gemini, DeepSeek, Ollama, GLM-5, KIMI K2.5 — balancing cost, speed, quality, and privacy.
sidebar_position: 4
---

# Choose an AI Model

OpenClaw supports multiple LLM providers. You can use different models for different scenarios and even set up automatic switching. This guide helps you make the best choice.

---

## Model Comparison Overview

| Model | Provider | Cost | Speed | Quality | Privacy | Best For |
|-------|----------|------|-------|---------|---------|----------|
| **Claude Opus 4.6** | Anthropic | $$$ | Medium | 5/5 | Cloud | Complex reasoning, long-form writing |
| **Claude Sonnet 4.5** | Anthropic | $$ | Fast | 4/5 | Cloud | Daily conversation, general tasks |
| **GPT-5.2 Codex** | OpenAI | $$$ | Medium | 5/5 | Cloud | Software development, technical tasks |
| **GPT-5.2 Mini** | OpenAI | $ | Very fast | 3/5 | Cloud | Simple chat, quick responses |
| **Gemini 3 Pro** | Google | $$ | Fast | 4/5 | Cloud | Multimodal, search integration |
| **DeepSeek V3** | DeepSeek | $ | Fast | 4/5 | Cloud* | Chinese tasks, high cost-effectiveness |
| **Ollama (Local)** | You | Free | Hardware-dependent | 2-4/5 | 5/5 | Fully offline, maximum privacy |
| **GLM-5** | Zhipu AI | $ | Fast | 4/5 | Cloud | Chinese tasks |
| **KIMI K2.5** | Moonshot | $$ | Medium | 4/5 | Cloud | Long context, Chinese tasks |

> *DeepSeek is a Chinese company; data processing is subject to Chinese law. Evaluate carefully if you have privacy concerns.

---

## Detailed Introductions

### Claude (Anthropic)

Claude is one of the most popular models in the OpenClaw community, especially strong in nuanced reasoning and safety scenarios.

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
  routing:
    enabled: true
    complexity_threshold: 0.6
```

**Strengths**: Exceptional reasoning quality, natural responses, comprehensive safety guardrails, ultra-long context (1M tokens)
**Weaknesses**: Opus pricing is high, higher latency in some regions

### GPT (OpenAI)

The GPT-5.2 series still leads in code generation and technical tasks.

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

### DeepSeek

DeepSeek V3 delivers near-top-tier quality at a fraction of the cost, especially for Chinese-language scenarios.

```yaml
provider:
  name: deepseek
  api_key: "${DEEPSEEK_API_KEY}"
  endpoint: "https://api.deepseek.com"
  models:
    primary:
      id: deepseek-v3
      max_tokens: 8192
      temperature: 0.7
```

:::warning DeepSeek Privacy Notice
DeepSeek is a Chinese company and its API service data processing is subject to Chinese regulations. If you handle sensitive personal data or trade secrets, evaluate carefully. You can run DeepSeek open-source models locally via Ollama instead.
:::

### Ollama (Local Models)

Run open-source LLMs on your own machine. **Fully offline, zero cost, maximum privacy**.

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.3:70b
ollama pull deepseek-v3:distill-32b
```

```yaml
provider:
  name: ollama
  endpoint: "http://127.0.0.1:11434"
  models:
    primary:
      id: llama3.3:70b
      max_tokens: 4096
      temperature: 0.7
```

**Hardware recommendations:**

| Model Size | Minimum RAM | Recommended GPU |
|-----------|-------------|-----------------|
| 7B params | 8 GB RAM | Not required (CPU works) |
| 13B params | 16 GB RAM | 6 GB VRAM |
| 27-32B params | 32 GB RAM | 12 GB VRAM |
| 70B params | 64 GB RAM | 24 GB VRAM |

:::tip Apple Silicon Users
M1 Pro/Max and newer Macs run Ollama well thanks to unified memory architecture. M4 Max 64GB can smoothly run 70B models with near-cloud-API response speeds.
:::

---

## Local vs Cloud Trade-offs

| Factor | Local (Ollama) | Cloud API |
|--------|---------------|-----------|
| **Privacy** | Data never leaves your machine | Sent to third-party servers |
| **Cost** | Only electricity | Pay per usage |
| **Speed** | Hardware-dependent | Usually faster |
| **Quality** | Open-source models slightly lag | Top-tier closed models |
| **Availability** | Always available | Depends on network and API status |

:::info Hybrid Mode Recommended
Best practice is hybrid mode: use local models for daily chat (zero cost, high privacy), auto-switch to cloud API when high-quality reasoning is needed.

```yaml
routing:
  strategy: hybrid
  default: ollama
  escalation:
    provider: anthropic
    model: claude-opus-4-6
    trigger:
      - complexity_score: 0.7
      - explicit_request: true
```
:::

---

## Cost Estimates

Based on 100 conversations per day (average 500 input + 1000 output tokens each):

| Model | Daily Cost (USD) | Monthly Cost (USD) |
|-------|------------------|-------------------|
| Claude Opus 4.6 | ~$2.25 | ~$67.50 |
| Claude Sonnet 4.5 | ~$0.45 | ~$13.50 |
| GPT-5.2 Codex | ~$2.10 | ~$63.00 |
| GPT-5.2 Mini | ~$0.15 | ~$4.50 |
| Gemini 3 Pro | ~$0.53 | ~$15.75 |
| DeepSeek V3 | ~$0.08 | ~$2.40 |
| Ollama (local) | $0 | $0 |

---

## Next Steps

After choosing your AI model, it is time to give it a unique personality:

- [SOUL.md Personality Config](./soul-md-config.md) — Design your AI agent's character and behavior
- [Connect Channels](./connect-channels.md) — If you haven't connected a platform yet
- [MasterClass Courses](/docs/masterclass/overview) — Deep-dive into advanced features
