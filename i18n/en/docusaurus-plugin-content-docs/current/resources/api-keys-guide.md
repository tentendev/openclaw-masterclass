---
title: API Keys Guide
description: How to obtain API Keys from OpenAI, Anthropic, Google Gemini, DeepSeek, and other LLM providers, and configure them in OpenClaw.
sidebar_position: 3
---

# API Keys Guide

OpenClaw requires at least one LLM provider's API Key to function. This guide walks you through obtaining API Keys from major LLM providers and configuring them in OpenClaw.

:::info Cost Reminder
Using LLM APIs incurs costs. Each provider has different billing structures — check pricing before signing up. Most providers offer free credits for initial testing.
:::

---

## Quick Comparison

| Provider | Recommended Model | Free Tier | Cost per Million Tokens (approx.) | Best For |
|----------|-------------------|-----------|-----------------------------------|----------|
| **OpenAI** | GPT-5.2 Codex | Limited | $2-15 | General conversation, code generation |
| **Anthropic** | Claude Opus 4.6 | Limited | $3-15 | Long-form analysis, complex reasoning |
| **Google** | Gemini 2.5 Pro | Generous free tier | $1-7 | Multimodal, cost-effective |
| **DeepSeek** | DeepSeek-V3 | Very low cost | $0.1-0.5 | Budget-conscious, Chinese-optimized |
| **Ollama (Local)** | Various open-source models | Completely free | $0 (hardware cost only) | Offline use, privacy-first |

---

## OpenAI API Key

### Steps

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in to your existing account
3. Click **API Keys** in the left sidebar
4. Click **Create new secret key**
5. Name the key (e.g., `openclaw-production`)
6. Copy and securely store the key (shown only once)

### OpenClaw Configuration

```yaml
llm:
  provider: openai
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: gpt-5.2-codex
```

Or use environment variables:

```bash
export OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Cost Management Tips

- Set a monthly usage cap (Monthly Budget)
- Monitor consumption via the Usage Dashboard
- Use cheaper models (e.g., GPT-4o-mini) during development and testing

:::caution API Key Security
Never commit API Keys to a Git repository or share them with others. Use environment variables or a dedicated secrets manager.
:::

---

## Anthropic API Key

### Steps

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up (phone number verification required)
3. Navigate to **Settings** > **API Keys**
4. Click **Create Key**
5. Copy and securely store

### OpenClaw Configuration

```yaml
llm:
  provider: anthropic
  api_key: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: claude-opus-4-6
```

Or environment variable:

```bash
export ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Recommended Usage

Claude models excel at:
- **Long-context understanding**: Up to 1M token context window
- **Complex reasoning tasks**: Multi-step logical analysis
- **Code review**: Precise code analysis and suggestions

---

## Google Gemini API Key

### Steps

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key**
4. Select or create a Google Cloud Project
5. Copy the generated API Key

### OpenClaw Configuration

```yaml
llm:
  provider: google
  api_key: AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: gemini-2.5-pro
```

### Key Features

- Multimodal support (images, video, audio)
- Relatively generous free tier
- Good integration with Google Workspace

---

## DeepSeek API Key

### Steps

1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Register an account (supports mainland China phone numbers)
3. Enter the console and find the **API Keys** section
4. Create a new Key and copy it

### OpenClaw Configuration

```yaml
llm:
  provider: deepseek
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: deepseek-v3
```

### Best For

- **Budget-limited**: Pricing is 1/10 to 1/30 of OpenAI
- **Chinese-language scenarios**: Specifically optimized for Chinese
- **Mainland China users**: Accessible without a VPN

:::note Mainland China Note
DeepSeek is the preferred LLM provider for mainland China users due to direct access without a VPN and extremely low pricing. Note that state-owned enterprises may have additional compliance requirements for AI services. See [Chinese Ecosystem](/docs/resources/chinese-ecosystem) for details.
:::

---

## Ollama (Local Models)

### Installation

Ollama does not require an API Key — it runs open-source models on your local machine.

1. Go to [ollama.com](https://ollama.com) to download and install
2. After installation, pull models:

```bash
ollama pull llama3.3
ollama pull deepseek-r1:32b
```

3. Configure in OpenClaw:

```yaml
llm:
  provider: ollama
  base_url: http://localhost:11434
  model: llama3.3
```

### Pros & Cons

| Pros | Cons |
|------|------|
| Completely free | Requires capable hardware (GPU) |
| Data never leaves your machine | Model capabilities usually lag behind cloud |
| No internet connection needed | Large models are slow to start |
| No API rate limiting | You manage model updates |

---

## Multi-Model Routing Strategy

OpenClaw supports configuring multiple LLM providers simultaneously, automatically selecting the best model based on task type:

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

:::tip Cost-Saving Strategy
Route casual conversations to DeepSeek or Ollama, and only use Claude or GPT when high-quality reasoning is needed. This can significantly reduce your monthly API costs.
:::

---

## API Key Security Best Practices

1. **Use environment variables**: Do not write Keys directly in config files
2. **Rotate regularly**: Replace API Keys every 90 days
3. **Set usage caps**: Configure monthly budgets in each provider's console
4. **Least privilege**: If the provider supports it, set minimum necessary permissions for the Key
5. **Monitor abnormal usage**: Regularly check API usage dashboards

:::danger Leak Response
If your API Key is accidentally leaked (e.g., committed to GitHub):
1. Immediately revoke the Key in the provider's console
2. Create a new Key
3. Check your billing for abnormal charges
4. Review Git history and clean up sensitive data
:::

---

## Related Pages

- [Choose an AI Model](/docs/getting-started/choose-llm) — Detailed model comparisons
- [First Setup](/docs/getting-started/first-setup) — Complete initial configuration
- [Chinese Ecosystem](/docs/resources/chinese-ecosystem) — DeepSeek and mainland China considerations
- [Security Best Practices](/docs/security/best-practices) — Complete security setup guide
