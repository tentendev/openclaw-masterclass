---
title: "Module 5: Persistent Memory & Personalization"
sidebar_position: 6
description: "Deep dive into OpenClaw's Memory System — Write-Ahead Logging, Markdown Compaction, Context Window management, and memory-based personalization"
keywords: [OpenClaw, Memory, WAL, Markdown Compaction, memory, Context Window, personalization]
---

# Module 5: Persistent Memory & Personalization

## Learning Objectives

By the end of this module, you will be able to:

- Explain the three core components of the OpenClaw Memory System
- Understand how Write-Ahead Logging (WAL) works and its data safety guarantees
- Explain how Markdown Compaction compresses fragmented memories into structured summaries
- Configure Context Window management strategies
- Set up memory retention policies for Agent personalization
- Troubleshoot common memory system issues

:::info Prerequisites
Please complete [Module 1: Foundations](./module-01-foundations) first to understand where the Memory System sits within the four-layer architecture.
:::

---

## Memory System Architecture

OpenClaw's Memory System allows the Agent to remember important information across conversations and sessions. It is not a simple conversation history log, but rather a full-featured memory management system with **write protection**, **automatic compaction**, and **intelligent retrieval** capabilities.

```
              Reasoning Layer
                    │
          ┌─────────┼─────────┐
          │  recall  │  store  │
          ▼         │         ▼
┌─────────────────────────────────────┐
│            Memory System            │
│                                     │
│  ┌───────────┐   ┌───────────────┐  │
│  │           │   │               │  │
│  │    WAL    │──▶│   Markdown    │  │
│  │   Engine  │   │  Compaction   │  │
│  │           │   │               │  │
│  └─────┬─────┘   └───────┬───────┘  │
│        │                 │          │
│        ▼                 ▼          │
│  ┌───────────┐   ┌───────────────┐  │
│  │  wal/     │   │  compacted/   │  │
│  │  (raw)    │   │  (summaries)  │  │
│  └───────────┘   └───────────────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │     Context Window Manager      ││
│  │  Dynamically selects the most   ││
│  │  relevant memories for the LLM  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Three Core Components

| Component | Responsibility | Analogy |
|---|---|---|
| **WAL Engine** | All memory changes are written to the WAL first, ensuring no data loss | Database Transaction Log |
| **Markdown Compaction** | Periodically compresses fragmented WAL entries into structured Markdown summaries | Database Compaction / Vacuum |
| **Context Window Manager** | Intelligently selects relevant memories to inject into the LLM's Context Window | Search Engine Ranking |

---

## Write-Ahead Logging (WAL)

WAL is the foundational safety mechanism of the memory system. All memory operations (create, update, delete) must first be written to a WAL file, ensuring that memory data is never lost even if the system crashes unexpectedly.

### WAL Operation Flow

```
Memory Operation            WAL                     Actual Memory
(store)                   (write-ahead log)         (compacted)
   │                         │                        │
   │  1. Write to WAL        │                        │
   ├────────────────────────▶│                        │
   │                         │                        │
   │  2. Confirm write OK    │                        │
   │◀────────────────────────│                        │
   │                         │                        │
   │  3. Return success      │  4. Background compact │
   │                         ├───────────────────────▶│
   │                         │                        │
   │                         │  5. Clean compacted WAL│
   │                         │◀───────────────────────│
```

### WAL File Format

WAL files are stored in the `~/.openclaw/memory/wal/` directory:

```
~/.openclaw/memory/wal/
├── 2026-03-20T10-15-23.wal
├── 2026-03-20T10-22-45.wal
├── 2026-03-20T11-03-12.wal
└── checkpoint.json
```

Each WAL entry structure:

```json
{
  "id": "mem-a1b2c3d4",
  "timestamp": "2026-03-20T10:15:23Z",
  "operation": "store",
  "channel": "default",
  "type": "conversation",
  "content": "User prefers responses in English with technical terms kept as-is",
  "importance": 0.85,
  "tags": ["preference", "language"],
  "ttl": null,
  "checksum": "sha256:e3b0c44298fc..."
}
```

### WAL Field Reference

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier for the memory entry |
| `timestamp` | ISO 8601 | Recording time |
| `operation` | string | Operation type: `store`, `update`, `delete` |
| `channel` | string | Associated Channel |
| `type` | string | Memory type: `conversation`, `fact`, `preference`, `task` |
| `content` | string | Memory content |
| `importance` | float | Importance score (0.0 - 1.0), determined by the Reasoning Layer |
| `tags` | array | Tags for retrieval |
| `ttl` | number/null | Time to live (seconds), null means permanent |
| `checksum` | string | Content checksum for integrity verification |

### WAL Safety Guarantees

- **Durability**: WAL writes use `fsync` to ensure data reaches disk
- **Atomicity**: Each WAL entry is either fully written or not written at all
- **Ordering**: WAL entries are strictly ordered by timestamp
- **Recoverability**: The system automatically recovers uncompacted memories from the WAL on restart

---

## Markdown Compaction

Memory entries in the WAL are fragmented -- a single conversation can produce dozens of memory fragments. **Markdown Compaction** periodically compresses these fragments into structured Markdown files, reducing storage space and improving retrieval efficiency.

### Compaction Flow

```
WAL Memory Fragments                  Compacted Markdown
┌────────────────┐                 ┌────────────────────────┐
│ mem-001: User  │                 │ # User Preferences     │
│ likes dark mode│                 │                        │
│                │                 │ ## Interface            │
│ mem-002: User  │   Compaction   │ - Prefers dark theme    │
│ prefers VS Code│ ──────────────▶│ - Editor: VS Code       │
│                │                 │                        │
│ mem-003: User  │                 │ ## Languages            │
│ expert in TS   │                 │ - Expert in TypeScript  │
│                │                 │ - Prefers English       │
│ mem-004: User  │                 │                        │
│ uses English   │                 │ ## Technical Background │
│                │                 │ - Frontend dev focus    │
│ mem-005: User  │                 │ - 3 years experience    │
│ 3 yrs frontend │                 │                        │
└────────────────┘                 │ Last updated: 2026-03-20│
                                   └────────────────────────┘
```

### Compacted File Format

Compacted memories are stored in the `~/.openclaw/memory/compacted/` directory:

```
~/.openclaw/memory/compacted/
├── user-profile.md           # User profile and preferences
├── project-context.md        # Project-related context
├── conversation-summaries/   # Conversation summaries
│   ├── 2026-03-18.md
│   ├── 2026-03-19.md
│   └── 2026-03-20.md
└── facts.md                  # Known facts database
```

`user-profile.md` example:

```markdown
# User Profile

## Basic Information
- Occupation: Frontend Engineer
- Experience: 3 years
- Location: Taipei

## Technical Preferences
- Primary languages: TypeScript, JavaScript
- Frameworks: React, Next.js
- Editor: VS Code (Vim mode)
- Terminal: iTerm2 + zsh
- Theme preference: Dark mode

## Communication Preferences
- Language: English, technical terms kept as-is
- Response style: Concise, with code examples
- Avoid: Overly verbose explanations

## Recent Projects
- **Project X**: Next.js 14 e-commerce platform (in progress)
- **Side Project**: OpenClaw Skill development

---
*Auto-generated by OpenClaw Memory Compaction*
*Last updated: 2026-03-20T14:30:00Z*
*Source WAL entries: 47*
```

### Compaction Strategy

```toml
# ~/.openclaw/config.toml

[memory.compaction]
interval = 3600                  # Compaction interval (seconds), default 1 hour
min_wal_entries = 20             # Don't trigger compaction if WAL has fewer entries
importance_threshold = 0.3       # Memories below this importance may be discarded during compaction
max_compacted_size = "10MB"      # Max size of compacted files
summarization_model = "fast"     # LLM model used for compaction (fast/balanced/thorough)
```

---

## Context Window Management

The Context Window Manager is responsible for intelligently selecting the most relevant memory fragments to inject into the prompt for each LLM call.

### Selection Strategy

The Context Window Manager uses weighted scoring to select the most relevant memories:

```
Final Score = (Relevance x 0.4) + (Importance x 0.3) + (Recency x 0.2) + (Frequency x 0.1)
```

| Factor | Weight | Description |
|---|---|---|
| **Relevance** | 0.4 | Semantic similarity between memory content and the current conversation |
| **Importance** | 0.3 | Importance score recorded in the WAL |
| **Recency** | 0.2 | More recent memories score higher |
| **Frequency** | 0.1 | More frequently referenced memories score higher |

### Context Window Size Management

```toml
# ~/.openclaw/config.toml

[memory.context]
max_tokens = 4096                # Max tokens for memories in the Context Window
strategy = "adaptive"            # adaptive / fixed / manual
reserved_for_system = 1024       # Tokens reserved for system prompt (SOUL.md, etc.)
reserved_for_skills = 512        # Tokens reserved for Skill descriptions
reserved_for_response = 2048     # Tokens reserved for the response
```

**Strategy descriptions:**

- **`adaptive`**: Dynamically adjusts memory injection based on conversation complexity
- **`fixed`**: Always injects `max_tokens` worth of memories
- **`manual`**: User manually controls which memories to inject

### Injection Flow Visualization

```
User message: "Continue the Project X frontend work from yesterday"

Context Window Manager executes:
┌─────────────────────────────────────────────┐
│ 1. Semantic search "Project X frontend"     │
│    → Found 12 relevant memories             │
│                                             │
│ 2. Weighted scoring and ranking             │
│    → [user-profile: 0.92]                   │
│    → [project-x-context: 0.89]              │
│    → [yesterday-summary: 0.85]              │
│    → [react-preferences: 0.71]              │
│    → ... (8 lower-scoring entries)           │
│                                             │
│ 3. Token budget allocation (4096 tokens)    │
│    → user-profile: 450 tokens ✓             │
│    → project-x-context: 820 tokens ✓        │
│    → yesterday-summary: 1200 tokens ✓       │
│    → react-preferences: 380 tokens ✓        │
│    → remaining: 1246 tokens (unused)        │
│                                             │
│ 4. Inject into Reasoning Layer              │
└─────────────────────────────────────────────┘
```

---

## Hands-On: Configuring Memory Retention & Testing Persistence

### Step 1: Check Current Memory Status

```bash
# View memory statistics
openclaw memory stats

# Example output:
# Memory System Statistics
# ────────────────────────
# WAL Entries:          147
# Compacted Files:      5
# Total Memory Size:    2.3 MB
# Oldest Memory:        2026-03-01
# Last Compaction:      2026-03-20T09:00:00Z
# Context Window Usage: 2,847 / 4,096 tokens
```

### Step 2: Manually Manage Memories

```bash
# List all memory entries
openclaw memory list

# Search for specific memories
openclaw memory search "TypeScript"

# View details for a specific memory
openclaw memory show mem-a1b2c3d4

# Manually add a memory
openclaw memory store \
  --type fact \
  --content "The company uses GitLab instead of GitHub" \
  --importance 0.8 \
  --tags "company,tools"

# Delete a specific memory
openclaw memory delete mem-a1b2c3d4

# Manually trigger Compaction
openclaw memory compact --now
```

### Step 3: Test Memory Persistence

```bash
# 1. Start a new conversation and tell the Agent some personal information
openclaw chat
> My name is Alex, I'm a backend engineer, primarily working with Go

# 2. Confirm the memory was saved
openclaw memory search "Alex"

# 3. Completely stop OpenClaw
openclaw stop

# 4. Restart
openclaw start

# 5. Start a new conversation and test whether the Agent remembers you
openclaw chat
> Do you remember my name and specialization?

# Expected: The Agent should recall that you're "Alex", a backend engineer working with Go
```

### Step 4: Configure Memory Retention Policy

```bash
# Set memory retention period
openclaw config set memory.retention_days 180

# Set auto-compaction interval (30 minutes)
openclaw config set memory.compaction.interval 1800

# Set minimum importance threshold
openclaw config set memory.compaction.importance_threshold 0.2

# Enable memory encryption (for sensitive environments)
openclaw config set memory.encryption true
openclaw config set memory.encryption_key_path "/path/to/key"
```

### Step 5: Review Compaction Results

```bash
# List compacted memory files
openclaw memory compacted list

# View a specific compacted file
openclaw memory compacted show user-profile

# View compaction history
openclaw memory compaction-history

# Example output:
# Compaction History
# ──────────────────
# 2026-03-20T14:00:00Z  WAL: 32 entries → user-profile.md (updated)
# 2026-03-20T13:00:00Z  WAL: 28 entries → conversation-summaries/2026-03-20.md
# 2026-03-20T12:00:00Z  WAL: 15 entries → project-context.md (updated)
```

---

## Memory Types & Best Practices

### Memory Types

| Type | Purpose | Retention Policy | Example |
|---|---|---|---|
| `preference` | User preferences | Permanent | Language preference, UI settings |
| `fact` | Known facts | Permanent | Company name, tech stack |
| `conversation` | Conversation summaries | Configurable | What was discussed yesterday |
| `task` | Task records | 30 days after completion | To-do items, progress |
| `ephemeral` | Temporary memory | End of session | Temp data for current operation |

### Best Practices

:::tip Memory Management Best Practices

1. **Review memories regularly**: Use `openclaw memory list` weekly to check memory contents. Delete outdated or incorrect memories.

2. **Use tags effectively**: Add meaningful tags to important memories to help the Context Window Manager retrieve them more accurately.

3. **Set reasonable retention periods**: Don't keep all memories forever. `conversation` types are best retained for 90 days, `task` types for 30 days.

4. **Watch for privacy issues**: Sensitive information (passwords, API keys) should never be stored in memory. If accidentally stored, immediately remove it with `openclaw memory delete`.

5. **Monitor memory size**: Excessive memory can impact Compaction performance. Use `openclaw memory stats` to monitor regularly.
:::

---

## Common Errors & Troubleshooting

### Issue 1: Memory Loss

```
The Agent seems to have forgotten information previously told to it
```

**Troubleshooting steps**:
```bash
# 1. Verify WAL is enabled
openclaw config get memory.wal_enabled
# Should return true

# 2. Search for the specific memory
openclaw memory search "keyword"

# 3. Check if the Context Window is saturated
openclaw memory stats | grep "Context Window"

# 4. Likely cause: memory exists but wasn't selected for the Context Window
# Fix: increase the importance of the relevant memory
openclaw memory update mem-xxx --importance 0.9
```

### Issue 2: Compaction Failure

```
Error: Memory compaction failed: LLM provider unavailable
```

**Fix**: Compaction requires calling the LLM to generate summaries. Ensure the LLM Provider connection is working.
```bash
# Test the LLM connection
openclaw test provider

# Use offline Compaction (no summaries, just merging)
openclaw memory compact --offline
```

### Issue 3: Memory Using Too Much Disk Space

```bash
# Check memory disk usage
du -sh ~/.openclaw/memory/

# Clean up expired WAL files
openclaw memory gc

# Set a more aggressive retention policy
openclaw config set memory.retention_days 30
openclaw memory gc --apply-retention
```

### Issue 4: Context Window Overflow

```
Warning: Context window exceeded, truncating oldest memories
```

**Fix**:
```bash
# Increase Context Window size (requires LLM support)
openclaw config set memory.context.max_tokens 8192

# Or use a more aggressive memory selection strategy
openclaw config set memory.context.strategy "adaptive"
```

---

## Exercises

1. **Memory Persistence Test**: Have a long conversation with OpenClaw covering multiple topics (at least 20 messages), then restart the system and verify how much the Agent remembers in a new session. Record which memories were retained vs. forgotten and analyze why.

2. **Compaction Observation**: Set `compaction_interval` to 300 seconds (5 minutes), chat with the Agent for 30 minutes, then examine the Markdown files generated in the `compacted/` directory. Evaluate the quality of the compaction.

3. **Context Window Optimization**: Try three different Context Window strategies (`adaptive`, `fixed`, `manual`) and compare the Agent's response quality in identical conversation scenarios.

4. **Memory Cleanup**: Use `openclaw memory list` and `openclaw memory search` to find all outdated or incorrect memories, clean them up, and verify the Agent no longer references the deleted memories.

---

## Quiz

1. **What does WAL stand for?**
   - A) Web Application Layer
   - B) Write-Ahead Logging
   - C) Wide Area Link
   - D) Write-After Loading

2. **What is the primary purpose of Markdown Compaction?**
   - A) Compress files to save bandwidth
   - B) Compress fragmented memories into structured Markdown summaries
   - C) Encrypt memory content
   - D) Sync memories to the cloud

3. **When the Context Window Manager selects memories, which factor has the highest weight?**
   - A) Recency
   - B) Frequency
   - C) Relevance
   - D) Importance

4. **Which memory type has a default retention policy of "permanent"?**
   - A) `conversation`
   - B) `ephemeral`
   - C) `preference`
   - D) `task`

5. **If the Agent seems to have forgotten information you previously told it, the most likely cause is?**
   - A) The WAL was corrupted
   - B) The memory exists but wasn't selected by the Context Window Manager for the current prompt
   - C) The LLM has a bug
   - D) The Gateway connection dropped

<details>
<summary>View Answers</summary>

1. **B** -- WAL stands for Write-Ahead Logging, a technique where changes are written to a log before modifying the actual data.
2. **B** -- Markdown Compaction compresses scattered WAL memory fragments into structured Markdown files, improving storage efficiency and retrieval quality.
3. **C** -- Relevance has a weight of 0.4, the highest among the four factors.
4. **C** -- Both `preference` (user preferences) and `fact` (known facts) have a default permanent retention policy.
5. **B** -- The most common cause is that the memory does exist in the system, but the Context Window Manager did not select it for the current LLM prompt based on its scoring strategy.

</details>

---

## Next Steps

You now have a deep understanding of OpenClaw's memory system. With this, you have completed all five modules of **Stage One: Core Foundations**! You now have the knowledge to understand and operate all of OpenClaw's core components.

Next, enter **Stage Two: Advanced Applications** to learn how to build automated workflows using Heartbeat and Cron.

**[Return to Course Overview →](./overview)**
