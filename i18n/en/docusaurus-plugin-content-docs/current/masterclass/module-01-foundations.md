---
title: "Module 1: OpenClaw Foundations"
sidebar_position: 2
description: "Deep dive into OpenClaw's four-layer architecture, inter-component communication, directory structure, and system health checks"
keywords: [OpenClaw, architecture, Gateway, Reasoning, Memory, Skills, foundations]
---

# Module 1: OpenClaw Foundations

## Learning Objectives

By the end of this module, you will be able to:

- Describe OpenClaw's four-layer architecture and the responsibilities of each layer
- Explain the communication methods and data flow between layers
- Identify OpenClaw's key directory structure and configuration files
- Run `openclaw doctor` to perform system health checks and interpret the results
- Configure SOUL.md to define your Agent's base personality

:::info Prerequisites
Make sure you have completed the prerequisite check in the [Course Overview](./overview) and have successfully installed OpenClaw.
:::

---

## Four-Layer Architecture Overview

OpenClaw uses a carefully designed four-layer architecture where each layer has a distinct responsibility and communicates with the others through well-defined interfaces. This design provides a high degree of modularity and extensibility.

```
┌─────────────────────────────────────────────┐
│           User / External Systems            │
└──────────────────────┬──────────────────────┘
                       │ WebSocket (port 18789)
                       ▼
┌─────────────────────────────────────────────┐
│          Layer 1: Gateway Layer              │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │WebSocket│  │ Message  │  │ Channel   │  │
│  │ Server  │  │ Router   │  │ Manager   │  │
│  └─────────┘  └──────────┘  └───────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Internal RPC
                       ▼
┌─────────────────────────────────────────────┐
│        Layer 2: Reasoning Layer              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   LLM    │  │  Mega-   │  │  SOUL.md │  │
│  │ Provider │  │ Prompting│  │  Parser  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Read/Write
                       ▼
┌─────────────────────────────────────────────┐
│         Layer 3: Memory System               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   WAL    │  │ Markdown │  │ Context  │  │
│  │  Engine  │  │Compaction│  │ Window   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Execute
                       ▼
┌─────────────────────────────────────────────┐
│     Layer 4: Skills / Execution Layer        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Sandboxed│  │ SKILL.md │  │ ClawHub  │  │
│  │Container │  │  Runner  │  │ Registry │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

### Layer 1: Gateway Layer

The Gateway is OpenClaw's entry point, responsible for managing all external connections. It runs a WebSocket server on **port 18789** and handles message reception and routing.

**Core Responsibilities:**
- Establishing and managing WebSocket connections
- Message format validation and routing
- Channel abstraction (supporting multiple concurrent conversations)
- Rate limiting and basic security filtering

:::warning Security Critical
The Gateway binds to `127.0.0.1:18789` by default. **Never** change this to `0.0.0.0`, or it will be exposed to the network. This is the root cause of CVE-2026-25253. See Module 9 for security details.
:::

> Deep dive: [Module 2: Gateway Deep Dive](./module-02-gateway)

### Layer 2: Reasoning Layer

The Reasoning Layer is OpenClaw's "brain." It uses a **Mega-prompting** strategy to interact with LLMs, translating user intent into executable action plans.

**Core Responsibilities:**
- Parsing SOUL.md to define Agent personality
- Constructing Mega-prompts (combining context, memory, and skill lists)
- Managing LLM Provider connections (supporting OpenAI, Anthropic, local models, etc.)
- Decision-making: determining which Skill to invoke in response to the user

**Mega-prompting Flow:**

```
User input → Load SOUL.md personality → Inject relevant memories →
List available Skills → Assemble Mega-prompt → Call LLM →
Parse response → Decide execution action
```

### Layer 3: Memory System

The Memory System provides persistent memory capabilities, allowing the Agent to maintain context across conversations.

**Core Components:**
- **Write-Ahead Logging (WAL)**: All memory changes are written to the WAL first, ensuring data is never lost
- **Markdown Compaction**: Periodically compresses fragmented memory entries into structured Markdown summaries
- **Context Window Manager**: Dynamically manages the context size injected into the LLM

> Deep dive: [Module 5: Persistent Memory & Personalization](./module-05-memory)

### Layer 4: Skills / Execution Layer

The Skills Layer is OpenClaw's "hands." Each Skill executes inside a **sandboxed container**, ensuring system security.

**Core Responsibilities:**
- Parsing SKILL.md definition files and loading Skill capabilities
- Executing Skills within sandbox containers (Podman / Docker)
- Managing Skill installation, updates, and removal
- Syncing with the ClawHub Registry

> Deep dive: [Module 3: Skills System & SKILL.md Specification](./module-03-skills-system)

---

## Inter-Layer Communication

Each layer communicates through well-defined interfaces:

| Source Layer | Target Layer | Protocol | Data Format |
|---|---|---|---|
| External → Gateway | Gateway | WebSocket | JSON-RPC 2.0 |
| Gateway → Reasoning | Reasoning | Internal RPC | Protocol Buffers |
| Reasoning → Memory | Memory | Direct Call | Structured Objects |
| Reasoning → Skills | Skills | Container API | JSON + Streams |
| Memory → Disk | Persistent Storage | File I/O | WAL + Markdown |

```json
// Typical WebSocket message format
{
  "jsonrpc": "2.0",
  "method": "chat.send",
  "params": {
    "channel": "default",
    "message": "Search for today's weather please",
    "context": {
      "location": "Taipei"
    }
  },
  "id": "msg-001"
}
```

---

## Directory Structure

After installing OpenClaw, the key files and directories are laid out as follows:

```
~/.openclaw/
├── config.toml              # Main configuration file
├── SOUL.md                  # Agent personality definition
├── skills/                  # Installed Skills
│   ├── official/            # Official Skills
│   └── community/           # Community Skills
├── memory/                  # Memory system data
│   ├── wal/                 # Write-Ahead Log files
│   ├── compacted/           # Compacted memory summaries
│   └── index.json           # Memory index
├── logs/                    # System logs
│   ├── gateway.log
│   ├── reasoning.log
│   └── execution.log
├── containers/              # Sandbox container configuration
│   └── podman-compose.yml
└── cache/                   # Cache files
    ├── models/              # LLM model cache
    └── hub/                 # ClawHub cache
```

### Main Configuration File: config.toml

```toml
# ~/.openclaw/config.toml

[gateway]
host = "127.0.0.1"          # Always use 127.0.0.1
port = 18789
max_connections = 10
heartbeat_interval = 30      # seconds

[reasoning]
provider = "anthropic"       # or "openai", "local"
model = "claude-sonnet-4-20250514"
max_tokens = 8192
temperature = 0.7

[memory]
wal_enabled = true
compaction_interval = 3600   # Compact once per hour
max_context_tokens = 4096
retention_days = 90          # Memory retention in days

[execution]
runtime = "podman"           # podman recommended over docker
sandbox_memory = "512m"
sandbox_cpu = "1.0"
timeout = 30                 # Skill execution timeout (seconds)

[security]
bind_localhost_only = true
verify_skills = true
virustotal_scan = true       # New setting added after ClawHavoc
```

---

## Hands-On: System Health Check

### Step 1: Run `openclaw doctor`

```bash
openclaw doctor
```

Expected output:

```
OpenClaw Doctor v0.9.4
======================

[✓] Runtime: Podman 4.9.3 detected
[✓] Gateway: listening on 127.0.0.1:18789
[✓] Memory: WAL engine healthy (23 entries)
[✓] Skills: 47 skills installed, 47 verified
[✓] Config: config.toml valid
[✓] SOUL.md: loaded (personality: "helpful-assistant")
[✓] LLM Provider: Anthropic API reachable
[✓] Security: localhost-only binding confirmed

All checks passed! OpenClaw is healthy.
```

### Step 2: Check Individual Layer Status

```bash
# Check Gateway status
openclaw status gateway

# Check Memory statistics
openclaw status memory

# List installed Skills
openclaw skills list

# View system logs
openclaw logs --tail 50
```

### Step 3: Create Your First SOUL.md

SOUL.md defines your Agent's personality traits. Create a simple personality definition:

```bash
cat > ~/.openclaw/SOUL.md << 'EOF'
# Agent Personality Definition

## Name
Atlas

## Role
You are a friendly technical assistant specializing in software development and system administration.

## Language Preferences
- Primary language: English
- Preserve technical terms as-is

## Behavior Guidelines
- Keep responses concise but thorough
- Proactively provide relevant background information
- When uncertain, say so directly rather than guessing
- Always include explanations alongside code samples

## Restrictions
- Do not perform any operations that could harm the system
- Do not access sensitive data (unless the user explicitly authorizes it)
EOF
```

Verify that SOUL.md loaded correctly:

```bash
openclaw soul show
```

---

## Common Errors & Troubleshooting

### Error 1: Gateway Fails to Start

```
Error: Address already in use (127.0.0.1:18789)
```

**Fix:**
```bash
# Find the process occupying the port
lsof -i :18789

# Stop the old OpenClaw process
openclaw stop
# Or force kill
kill -9 <PID>

# Restart
openclaw start
```

### Error 2: LLM Provider Connection Failure

```
Error: Failed to connect to reasoning provider
```

**Fix:**
```bash
# Verify the API Key is set
openclaw config get reasoning.api_key

# Reset the API Key
openclaw config set reasoning.api_key "sk-your-key-here"

# Test the connection
openclaw test provider
```

### Error 3: Podman Not Installed

```
Error: No container runtime found
```

**Fix:**
```bash
# macOS
brew install podman
podman machine init
podman machine start

# Ubuntu
sudo apt install podman

# Verify
podman --version
openclaw doctor
```

### Error 4: config.toml Syntax Error

```
Error: Failed to parse config.toml at line 15
```

**Fix:**
```bash
# Validate config file syntax
openclaw config validate

# Reset to default settings
openclaw config reset --backup
```

---

## Exercises

1. **Architecture Exploration**: Use the `openclaw status` command group to check the status of each of the four layers. Record key metrics for each layer (e.g., connection count, memory entry count, installed Skill count).

2. **Custom SOUL.md**: Create a custom SOUL.md defining an Agent personality specifically designed for code review. Experiment with different personality settings to see how they affect response style.

3. **Configuration Tuning**: Modify the `[memory]` section in `config.toml` to change `compaction_interval` to 1800 seconds (30 minutes), then observe the change in memory compaction behavior.

4. **Log Analysis**: After starting OpenClaw and running a conversation, examine `gateway.log` and `reasoning.log` to trace the complete flow of a message from receipt to response.

---

## Quiz

1. **What is the default port that the OpenClaw Gateway listens on?**
   - A) 8080
   - B) 3000
   - C) 18789
   - D) 443

2. **What mechanism does the Memory System use to ensure data is never lost?**
   - A) Redis
   - B) Write-Ahead Logging (WAL)
   - C) PostgreSQL
   - D) SQLite

3. **Which command is used for system health checks?**
   - A) `openclaw check`
   - B) `openclaw health`
   - C) `openclaw doctor`
   - D) `openclaw verify`

4. **Why is Podman recommended over Docker?**
   - A) Podman is faster
   - B) Podman is daemonless and does not require root privileges, making it more secure
   - C) Docker does not support OpenClaw
   - D) Podman has more features

5. **What is the purpose of SOUL.md?**
   - A) Define Skill behavior
   - B) Configure system parameters
   - C) Define the Agent's personality traits and behavior guidelines
   - D) Record system logs

<details>
<summary>View Answers</summary>

1. **C** -- The OpenClaw Gateway listens for WebSocket connections on port 18789 by default.
2. **B** -- Write-Ahead Logging (WAL) ensures all memory changes are written to the log first, so data is never lost even if the system crashes.
3. **C** -- `openclaw doctor` checks the health status of all system components.
4. **B** -- Podman is a daemonless container runtime that does not require root privileges, reducing the attack surface. This is also part of security best practices.
5. **C** -- SOUL.md defines the Agent's name, role, language preferences, behavior guidelines, and other personality traits.

</details>

---

## Next Steps

You now understand OpenClaw's four-layer architecture and basic configuration. Next, let's take a deeper look at how the Gateway layer operates.

**[Go to Module 2: Gateway Deep Dive →](./module-02-gateway)**
