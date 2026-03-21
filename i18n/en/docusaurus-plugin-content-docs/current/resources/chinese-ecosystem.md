---
title: Chinese Ecosystem
description: Guide to using OpenClaw in mainland China — Tencent WeChat integration, DeepSeek models, state-owned enterprise restrictions, compliance requirements, and special considerations.
sidebar_position: 8
---

# Chinese Ecosystem

Mainland China is one of OpenClaw's fastest-growing markets, but also its most regulatory-complex. From Tencent WeChat's official integration to state-owned enterprise usage restrictions, this page covers everything you need to know about using OpenClaw in mainland China.

:::danger Important Regulatory Notice
Mainland China has strict regulatory requirements for AI services, especially for state-owned enterprises. The information on this page is for reference only and does not constitute legal advice. Consult professional legal counsel before deployment.
:::

---

## China Market Overview

| Item | Status |
|------|--------|
| **OpenClaw availability in China** | Available (open-source software, self-deployable) |
| **ClawHub access** | Requires VPN or domestic mirror |
| **Official WeChat integration** | Complete (Tencent official partnership) |
| **Recommended LLM provider** | DeepSeek (no VPN needed) |
| **State-owned enterprise usage** | Restricted, compliance review required |
| **Personal usage** | No explicit restrictions |

---

## Tencent WeChat Integration

### Overview

Tencent's official partnership with OpenClaw makes WeChat one of OpenClaw's supported messaging platforms. This is significant for mainland China users since WeChat is China's most popular messaging tool with over 1.3 billion monthly active users.

### Integration Features

| Feature | Support Status | Notes |
|---------|---------------|-------|
| **Personal chat** | Full support | Agent can reply in one-on-one chats |
| **Group chat** | Full support | Agent can participate in group conversations |
| **Official Account integration** | Partial support | Can serve as intelligent reply backend for Official Accounts |
| **Mini Program interaction** | Planned | Expected in future versions |
| **WeChat Pay** | Not supported | Financial regulations; not planned |
| **Voice messages** | Partial support | Requires pairing with speech-to-text Skill |

### Configuration

```yaml
channels:
  wechat:
    enabled: true
    app_id: "your_wechat_app_id"
    app_secret: "your_wechat_app_secret"
    token: "your_verification_token"
    encoding_aes_key: "your_aes_key"
    mode: "personal"  # or "official_account"
```

:::caution WeChat Setup Notes
WeChat integration requires completing Tencent's developer verification process. Personal accounts and Official Accounts have different verification requirements. Official Account integration requires enterprise credentials.
:::

### WeChat-Specific Limitations

1. **Message rate limits**: WeChat has strict message sending frequency limits
2. **Content review**: All messages through WeChat pass through Tencent's content review system
3. **Data storage**: Chinese regulations require related data to be stored on servers within China
4. **Account risk**: Overly aggressive automation may result in WeChat account suspension

---

## DeepSeek — Recommended LLM for Mainland China

### Why DeepSeek?

| Advantage | Details |
|-----------|---------|
| **No VPN required** | API is directly accessible in mainland China |
| **Extremely low pricing** | Only 1/10 to 1/30 of OpenAI |
| **Chinese optimization** | Specifically optimized for Chinese-language scenarios |
| **Local compliance** | Meets mainland China data regulations |
| **Open-source models** | Can be deployed locally for full data control |

### OpenClaw Integration

```yaml
llm:
  provider: deepseek
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: deepseek-v3
  base_url: https://api.deepseek.com
```

### DeepSeek Model Comparison

| Model | Best For | Chinese Capability | Price Level |
|-------|---------|-------------------|-------------|
| **DeepSeek-V3** | General conversation, code | Excellent | Very low |
| **DeepSeek-R1** | Complex reasoning | Excellent | Low |
| **DeepSeek-Coder** | Code-specific | Good | Very low |

See [API Keys Guide](/docs/resources/api-keys-guide) for detailed API Key application steps.

---

## Mainland China Usage Restrictions

### State-Owned Enterprise Restrictions

:::danger Required reading for SOE users
Chinese state-owned enterprises (SOEs) have special restrictions when using AI Agent services. The following restrictions may change with policy updates — regularly confirm the latest regulations.
:::

| Restriction Category | Description | Scope |
|---------------------|-------------|-------|
| **Data access restrictions** | Agent must not access data related to national security | All SOEs |
| **Model provider restrictions** | In some cases, only domestic LLMs are permitted | Sensitive-industry SOEs |
| **Deployment location restrictions** | Must be deployed on servers within China | All SOEs |
| **Audit requirements** | Regular AI usage reports required | Specific-industry SOEs |
| **Skill whitelist** | Only audited skills are permitted | All SOEs |

### Compliance Requirements for General Enterprises

Even non-state enterprises must consider the following when using OpenClaw in mainland China:

1. **Interim Measures for the Management of Generative AI Services**
   - AI-generated content must align with core socialist values
   - Content review mechanisms must be established
   - Usage logs must be retained for at least six months

2. **Personal Information Protection Law (PIPL)**
   - User conversation logs constitute personal information
   - Users must be clearly informed about data collection and usage
   - Cross-border data transfer requires additional assessment

3. **Data Security Law**
   - Processed data must be classified by security level
   - Important data must be stored within China
   - Data security management systems must be established

---

## Network Considerations

### Services Requiring VPN

| Service | Alternative |
|---------|------------|
| GitHub | Gitee mirror, domestic CDN |
| ClawHub | Domestic mirror sites |
| OpenAI API | DeepSeek API |
| Google Gemini API | DeepSeek or Alibaba Tongyi Qianwen |
| Discord | WeChat groups, QQ groups |

### Services Not Requiring VPN

| Service | Notes |
|---------|-------|
| DeepSeek API | Directly accessible in mainland China |
| Ollama (local models) | Runs entirely locally, no internet needed |
| WeChat integration | Tencent domestic service |
| OpenClaw Core | Open-source software, downloadable from mirrors |

---

## Recommended Mainland China Deployment Architecture

```
┌─────────────────────────────────────────────┐
│  China Cloud Server (Alibaba Cloud / Tencent │
│  Cloud)                                      │
│                                             │
│  ┌──────────────┐   ┌──────────────┐       │
│  │  OpenClaw    │   │  DeepSeek    │       │
│  │  Core        │◄──│  API         │       │
│  └──────┬───────┘   └──────────────┘       │
│         │                                   │
│  ┌──────┴───────┐   ┌──────────────┐       │
│  │  Gateway     │◄──│  WeChat      │       │
│  │  (127.0.0.1) │   │  Integration │       │
│  └──────────────┘   └──────────────┘       │
│                                             │
│  ┌──────────────┐                           │
│  │  Log System  │  ← Retain 6+ months      │
│  └──────────────┘                           │
└─────────────────────────────────────────────┘
```

:::tip Deployment Recommendation
Use Alibaba Cloud or Tencent Cloud's mainland China regions for deployment to meet data localization requirements. Bind the Gateway to `127.0.0.1` and expose it through the cloud provider's load balancer.
:::

---

## Related Pages

- [API Keys Guide](/docs/resources/api-keys-guide) — DeepSeek API Key application
- [Security Best Practices](/docs/security/best-practices) — Gateway security configuration
- [MasterClass Module 12: Enterprise Deployment](/docs/masterclass/module-12-enterprise) — Enterprise deployment guide
- [Official Links Overview](/docs/resources/official-links) — Tencent partnership links
