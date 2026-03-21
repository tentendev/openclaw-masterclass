---
title: "Module 8: Multi-Agent Architecture"
sidebar_position: 9
description: "Learn OpenClaw's multi-Agent collaboration architecture, cross-machine Agent communication via Discord/Matrix, and how to build Agent teams"
keywords: [OpenClaw, multi-agent, orchestration, Discord, Matrix, collaboration]
---

# Module 8: Multi-Agent Architecture

## Learning Objectives

By the end of this module, you will be able to:

- Understand the design philosophy behind OpenClaw's multi-Agent architecture
- Configure cross-machine Agent communication (via Discord / Matrix)
- Design and implement Agent role assignments
- Build a 3-Agent collaboration team (Researcher, Writer, Reviewer)
- Manage message flow and task coordination between Agents
- Handle conflicts and errors in multi-Agent environments

## Core Concepts

### Multi-Agent Design Philosophy

OpenClaw's multi-Agent architecture has a unique philosophy: **Agents communicate with each other through the same channels humans use (Discord, Matrix), not through dedicated APIs**. This design provides several advantages:

1. **Human-observable** -- All Agent conversations are visible in Discord channels
2. **Human-intervenable** -- Humans can join the conversation and correct course at any time
3. **Zero additional infrastructure** -- No dedicated message queue or RPC framework needed
4. **Natural language protocol** -- Agents communicate in natural language, not fixed API formats

```
┌─────────────────────────────────────────┐
│         Discord / Matrix Server          │
│                                         │
│  #research-channel                      │
│    ├── Agent-Researcher                 │
│    └── Human Observer                   │
│                                         │
│  #writing-channel                       │
│    ├── Agent-Writer                     │
│    └── Agent-Reviewer                   │
│                                         │
│  #coordination-channel                  │
│    ├── Agent-Researcher                 │
│    ├── Agent-Writer                     │
│    ├── Agent-Reviewer                   │
│    └── Human Manager                    │
└─────────────────────────────────────────┘

Machine A: Agent-Researcher (OpenClaw Instance 1)
Machine B: Agent-Writer     (OpenClaw Instance 2)
Machine C: Agent-Reviewer   (OpenClaw Instance 3)
```

### Agent Role Model

| Role | Responsibility | Required Skills | Typical LLM |
|---|---|---|---|
| **Coordinator** | Task assignment, progress oversight | task-manager, scheduler | GPT-4o / Claude |
| **Researcher** | Information gathering, web scraping | web-search, browser, summarizer | GPT-4o |
| **Writer** | Content creation, document writing | text-generator, markdown-tools | Claude |
| **Reviewer** | Quality review, fact-checking | fact-checker, grammar-check | GPT-4o |
| **Coder** | Software development, debugging | code-runner, git-tools | Claude / Codex |

### Communication Patterns

OpenClaw supports three multi-Agent communication patterns:

**1. Direct Mention**
```
Agent-Researcher: @Agent-Writer Research complete. Here are 5 key trends in the AI industry...
```

**2. Channel Broadcast**
```
Agent-Coordinator: Team, here are this week's task assignments:
- @Agent-Researcher: Research the latest NemoClaw developments
- @Agent-Writer: Write the technical documentation
- @Agent-Reviewer: Review the drafts
```

**3. DM Relay**
```
Agent-A → DM → Agent-B: [Confidential data, not shared in public channels]
```

## Implementation Guide

### Step 1: Prepare the Discord Environment

First, create a dedicated Discord server as the multi-Agent communication platform:

```bash
# Create 3 Discord Bots (one per Agent)
# Go to https://discord.com/developers/applications
# Create an Application for each Bot and obtain the Token
```

Recommended channel structure:

```
Agent Team
  ├── #coordination    (All Agents + humans)
  ├── #research        (Researcher's workspace)
  ├── #writing         (Writer's workspace)
  ├── #review          (Reviewer's workspace)
  └── #results         (Final output publishing)
```

### Step 2: Configure Agent Instances

**Agent 1 -- Researcher:**

```json
// machine-a/settings.json
{
  "name": "Agent-Researcher",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_RESEARCHER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "research"],
      "respond_to_mentions": true,
      "respond_to_channels": ["research"]
    }
  },
  "skills": [
    "web-search",
    "browser-tools",
    "summarizer",
    "note-taker"
  ],
  "llm": {
    "provider": "openai",
    "model": "gpt-4o"
  }
}
```

Researcher's `soul.md`:

```markdown
# Agent-Researcher

You are a professional researcher Agent. Your responsibilities are:

1. Receive research tasks from @Agent-Coordinator or humans
2. Use web search and browser tools to collect information
3. Organize research findings into structured summaries
4. Publish results to the #research channel
5. Notify @Agent-Writer when research is complete

## Workflow
- Upon receiving a task, confirm understanding by replying "Acknowledged, starting research: [topic]"
- Post progress updates to #research every 10 minutes during research
- When complete, @ notify relevant team members in #coordination
- If you encounter difficulties or need more information, ask proactively

## Constraints
- Do not create content yourself; only collect and organize facts
- All citations must include source links
- Report if research takes more than 30 minutes
```

**Agent 2 -- Writer:**

```json
// machine-b/settings.json
{
  "name": "Agent-Writer",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_WRITER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "writing", "research"],
      "respond_to_mentions": true,
      "respond_to_channels": ["writing"]
    }
  },
  "skills": [
    "text-generator",
    "markdown-tools",
    "grammar-check"
  ],
  "llm": {
    "provider": "anthropic",
    "model": "claude-sonnet-4-20250514"
  }
}
```

Writer's `soul.md`:

```markdown
# Agent-Writer

You are a professional technical writer Agent. Your responsibilities are:

1. Monitor the #research channel for @Agent-Researcher's findings
2. Write technical documents or blog posts based on the research
3. Publish drafts to the #writing channel
4. Revise based on @Agent-Reviewer's feedback
5. Publish final versions to the #results channel

## Writing Style
- Use clear, professional English
- Organize with headings, lists, and code blocks
- Each article should be 800-1500 words
- Include references and sources

## Collaboration Rules
- After receiving research results, reply "Received, estimated [X] minutes to first draft"
- When first draft is complete, @ notify @Agent-Reviewer
- After revisions, include a change summary
```

**Agent 3 -- Reviewer:**

```json
// machine-c/settings.json
{
  "name": "Agent-Reviewer",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_REVIEWER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "writing", "review"],
      "respond_to_mentions": true,
      "respond_to_channels": ["review", "writing"]
    }
  },
  "skills": [
    "fact-checker",
    "grammar-check",
    "readability-scorer"
  ],
  "llm": {
    "provider": "openai",
    "model": "gpt-4o"
  }
}
```

### Step 3: Launch the Multi-Agent Environment

Start each on its respective machine:

```bash
# Machine A
cd /opt/openclaw-researcher
openclaw start --config settings.json

# Machine B
cd /opt/openclaw-writer
openclaw start --config settings.json

# Machine C
cd /opt/openclaw-reviewer
openclaw start --config settings.json
```

Or run on a single machine using different ports:

```bash
# Same machine, different ports
openclaw start --config researcher/settings.json --port 18789
openclaw start --config writer/settings.json --port 18790
openclaw start --config reviewer/settings.json --port 18791
```

:::caution Single-Machine Deployment
When running multiple Agents on the same machine, ensure each instance uses a different:
- HTTP API port (`--port`)
- Data directory (`--data-dir`)
- Discord Bot Token (each Agent must be a different Bot)
:::

### Step 4: Trigger the Collaboration Workflow

Issue a command in the Discord #coordination channel:

```
Human: @Agent-Researcher Please research NemoClaw's latest technical architecture
       and use cases. Once complete, hand off to @Agent-Writer for a technical
       introduction article.

Agent-Researcher: Acknowledged, starting research: NemoClaw technical architecture
                  and use cases. Estimated 15 minutes.

[15 minutes later, in #research]

Agent-Researcher: Research complete! Here are the key findings about NemoClaw:
                  1. NemoClaw = Nemotron + OpenClaw + OpenShell
                  2. Announced by NVIDIA at GTC 2026
                  3. Jensen Huang called it "probably the single most important
                     software release ever"
                  ...
                  @Agent-Writer Research results have been posted. Please begin writing.

Agent-Writer: Received research results. Estimated 20 minutes to first draft.

[20 minutes later, in #writing]

Agent-Writer: First draft complete! @Agent-Reviewer please review.
              [Article content...]

Agent-Reviewer: Review complete. Here are my suggestions:
               1. Paragraph 3 is missing source citations
               2. Recommend adding a performance comparison table
               3. The conclusion could be more specific
               @Agent-Writer Please revise.

Agent-Writer: Revisions complete. Published to #results.
```

### Step 5: Advanced -- Coordinator Agent

Build a Coordinator Agent to automate task assignment:

```javascript
// skills/task-coordinator/index.js
module.exports = {
  name: "task-coordinator",
  description: "Coordinate multi-Agent task assignment",

  async execute(context) {
    const { params, channel } = context;
    const { task, deadline } = params;

    // Decompose the task
    const subtasks = await context.agent.think(
      `Break down the following task into research, writing, and review subtasks:\n${task}`
    );

    // Assign tasks
    await channel.send(
      `**New Task Assignment**\n\n` +
      `Topic: ${task}\n` +
      `Deadline: ${deadline}\n\n` +
      `1. @Agent-Researcher ${subtasks.research}\n` +
      `2. @Agent-Writer Start after research is complete\n` +
      `3. @Agent-Reviewer Review after first draft is complete\n\n` +
      `Please confirm receipt.`
    );

    return { distributed: true, subtasks };
  }
};
```

## Common Errors

:::danger Agent Conversation Loop
The most dangerous issue is two Agents triggering each other in an infinite loop, rapidly consuming LLM API credits.

Prevention measures:
1. Explicitly state in `soul.md` "do not reply to messages not directed at you"
2. Set `rate_limit` to cap messages per minute
3. Add `cooldown_seconds` between messages
4. Monitor API usage and set spending caps

```json
{
  "safety": {
    "max_messages_per_minute": 5,
    "cooldown_seconds": 10,
    "max_consecutive_self_replies": 2,
    "api_budget_daily_usd": 10.00
  }
}
```
:::

| Issue | Cause | Solution |
|---|---|---|
| Agent cannot see other Agents' messages | Bot lacks channel read permissions | Check Discord Bot Permissions |
| Agent replies to its own messages | Bot messages not filtered | Set `ignore_bot_messages: false` but add an ID whitelist |
| Task order is confused | No clear workflow definition | Define clear prerequisites in `soul.md` |
| Message delay exceeds 30 seconds | LLM API latency or queuing | Use a faster model or increase timeout |
| Agent misinterprets another Agent's output | Inconsistent output format | Define a unified output format |

## Troubleshooting

### Check Agent Connection Status

```bash
# Check if each Agent is online
curl http://127.0.0.1:18789/api/status  # Researcher
curl http://127.0.0.1:18790/api/status  # Writer
curl http://127.0.0.1:18791/api/status  # Reviewer

# Check Discord connection
curl http://127.0.0.1:18789/api/channels/discord/status
```

### Agent Communication Debugging

```bash
# Enable verbose logging
openclaw start --config settings.json --log-level debug

# Monitor inter-Agent message flow
tail -f logs/openclaw.log | grep -E "(send|receive|mention)"
```

### Force-Stop a Runaway Agent

```bash
# Pause an Agent via API
curl -X POST http://127.0.0.1:18789/api/pause

# Or stop the process directly
openclaw stop --config settings.json
```

## Exercises

### Exercise 1: Two-Agent Dialogue
Set up two Agents (Teacher and Student). Have Teacher ask a math question, Student answer, and Teacher grade the response. Limit to a maximum of 5 rounds.

### Exercise 2: Three-Person Research Team
Follow this module's guide to build a Researcher / Writer / Reviewer team and produce an article about "2026 AI Agent Trends."

### Exercise 3: Fault Tolerance
Modify the three-person team setup to add:
- Notify a human to intervene when the Reviewer rejects more than 2 times
- Auto-reminder when any Agent hasn't responded for 10 minutes
- Daily API spending cap of $5 USD

## Quiz

1. **Why does OpenClaw's multi-Agent system use Discord/Matrix instead of a dedicated API?**
   - A) Technical limitation
   - B) So humans can observe and intervene in Agent conversations
   - C) Discord is faster
   - D) To reduce API costs

   <details><summary>View Answer</summary>B) By communicating through public channels like Discord/Matrix, humans can observe Agent conversations at any time and intervene when necessary. This is the core design principle of OpenClaw's multi-Agent architecture.</details>

2. **How do you prevent two Agents from entering an infinite conversation loop?**
   - A) Don't use multi-Agent
   - B) Set rate limits, cooldowns, and maximum consecutive reply counts
   - C) Use different LLMs
   - D) Reduce the number of Agents

   <details><summary>View Answer</summary>B) Using `max_messages_per_minute`, `cooldown_seconds`, and `max_consecutive_self_replies` parameters to limit message frequency effectively prevents loops.</details>

3. **When running multiple Agents on the same machine, what must you ensure?**
   - A) Use the same configuration file
   - B) Use different ports, data directories, and Bot Tokens
   - C) Use the same LLM provider
   - D) Share a single Discord Bot

   <details><summary>View Answer</summary>B) Each Agent instance needs its own HTTP port, data directory, and Discord Bot Token to avoid conflicts.</details>

4. **What is the Coordinator Agent's primary function?**
   - A) Replace the human manager
   - B) Decompose tasks, assign work, and oversee progress
   - C) Run all Skills
   - D) Manage API Keys

   <details><summary>View Answer</summary>B) The Coordinator breaks large tasks into subtasks, assigns them to specialized Agents, and tracks overall progress.</details>

## Next Steps

- [Module 9: Security](./module-09-security) -- Security risks and protections in multi-Agent environments
- [Module 10: Production Deployment](./module-10-production) -- Running multi-Agent systems reliably on VPS
- [Module 12: Enterprise Applications](./module-12-enterprise) -- Large-scale multi-Agent deployments in enterprise environments
