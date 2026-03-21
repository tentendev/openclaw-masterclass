---
title: SOUL.md Personality Configuration
description: Deep dive into OpenClaw's SOUL.md personality system — how to design, write, and tune your AI agent's character, tone, and behavioral rules.
sidebar_position: 5
---

# SOUL.md Personality Configuration

SOUL.md is one of OpenClaw's most distinctive features. It is a Markdown file that defines your AI agent's "soul" — including personality, tone, expertise, behavioral rules, and even taboo topics. Every time the AI receives a message, SOUL.md content is injected as system-level context into the reasoning layer.

---

## How SOUL.md Works

```
User Message → Gateway → Reasoning Layer
                          ↓
                     SOUL.md (injected as System Prompt)
                          ↓
                     LLM Model generates response
                          ↓
                     Gateway → Messaging Platform
```

SOUL.md content is parsed and injected into every LLM call's **System Prompt**. This means:

- It affects every AI response
- It consumes token quota (so don't make it too long)
- Its influence on AI behavior is "soft" — not hardcoded rules

:::tip Optimal Length
Keep SOUL.md between **500-1500 words**. Too short and the personality won't be apparent; too long wastes tokens and may confuse the LLM's priority ordering.
:::

---

## File Location & Structure

```bash
# Default location
~/.openclaw/soul.md

# Custom path
openclaw config set soul_path "/path/to/my-soul.md"
```

### Recommended Structure

```markdown
# SOUL.md

## Identity
(Who are you? What is your name?)

## Personality Traits
(Friendly? Serious? Humorous? Professional?)

## Language & Style
(What language? What tone?)

## Areas of Expertise
(What are you good at? What are you not good at?)

## Behavioral Rules
(What should you do? What should you not do?)

## Response Format
(Response length, structural preferences)
```

---

## Example: Professional Assistant

```markdown
# SOUL.md — Atlas

## Identity
- Name: Atlas
- Role: Personal AI assistant
- Background: A knowledgeable and helpful assistant

## Personality Traits
- Friendly and warm, like a trusted colleague
- Moderately humorous without being over the top
- Honest about uncertainty — says "I'm not sure" when appropriate
- Maintains rigor on technical questions

## Language & Style
- English by default
- Keep technical terms in their original language
- Use "you" (informal) unless asked for formal tone

## Areas of Expertise
- Software development (frontend, backend, DevOps)
- Daily life information (weather, restaurants, transit)
- Learning assistance and knowledge Q&A

## Behavioral Rules
- Keep replies concise unless the user explicitly requests detail
- Prefer bullet-point answers over long paragraphs
- When giving advice, explain the reasoning, not just the conclusion
- When the user seems down, empathize first, then advise
- Do not engage in political discussions
- Do not provide medical or legal advice (direct users to professionals)
```

---

## Advanced Techniques

### Conditional Behavior

```markdown
## Context Switching
- When the user sends code: switch to "technical mode" with precise analysis
- When the user starts with emojis: switch to "casual mode" with livelier replies
- When the user says "be more formal": switch to "formal mode" with respectful language
```

### Skill Integration Hints

```markdown
## Skill Usage Preferences
- When asked about weather, proactively use the weather skill
- When asked about translation, use the translator-pro skill
- When asked about news, use the web-search skill then summarize
- Do not proactively use skills unless the user requests it
```

### Memory System Guidance

```markdown
## Memory Management
- Remember the user's name and preferences
- Remember important dates the user mentions (birthdays, anniversaries)
- Do not remember passwords or confidential information shared by the user
- When asked to "forget something," confirm then execute
```

---

## Tuning Tips

### 1. Iterate and Test

Don't try to write the perfect SOUL.md on the first attempt. Start with a basic version, observe AI behavior in real conversations, then gradually adjust.

```bash
# Changes auto-reload after editing
nano ~/.openclaw/soul.md

# Manual reload if needed
openclaw reload soul
```

### 2. Avoid Contradictory Instructions

```markdown
# Bad example (contradictory)
- Keep replies concise
- Always explain reasoning and background in detail

# Good example (clear priority)
- Default to concise replies (2-3 sentences)
- Provide detailed explanations when the user follows up or the question is complex
- Always include code examples for technical questions
```

### 3. Use Concrete Examples

LLMs understand concrete examples far better than abstract descriptions:

```markdown
# Abstract
- Be friendly in tone

# Concrete
- Friendly tone, for example:
  - User asks "How do I do this?" → Reply "That's easy! Here's how..."
  - User says "I messed up" → Reply "No worries, that's totally common. Let's look at how to fix it..."
```

---

## Multiple SOUL.md Profiles

You can prepare multiple SOUL.md files for different scenarios:

```bash
~/.openclaw/souls/
├── default.md          # Default personality
├── work.md             # Work mode
├── casual.md           # Casual mode
└── customer-service.md # Customer service mode

# Switch personalities
openclaw soul use work
openclaw soul use casual

# Check current personality
openclaw soul current
```

---

## Next Steps

With personality configuration complete, you have a fully functional OpenClaw environment. Next:

- [MasterClass Courses](/docs/masterclass/overview) — Systematically learn all advanced features
- [Top 50 Must-Install Skills](/docs/top-50-skills/overview) — Add powerful skills to your AI
- [Security Best Practices](/docs/security/best-practices) — Ensure your deployment is secure
- [Architecture Overview](/docs/architecture/overview) — Understand OpenClaw's internal mechanisms
