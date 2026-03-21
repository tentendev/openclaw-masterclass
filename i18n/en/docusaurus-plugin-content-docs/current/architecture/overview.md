---
title: Architecture Overview
description: Deep analysis of OpenClaw's four-layer architecture — Gateway, Reasoning Layer, Memory System, and Skills Execution Layer design principles and implementation details.
sidebar_position: 1
---

# Architecture Overview

OpenClaw uses a clear four-layer architecture where each layer has distinct responsibilities and is loosely coupled. This page provides an in-depth analysis of each layer's design principles, internal mechanisms, and inter-layer interactions.

---

## Overall Architecture

```
                    User
                      |
          ┌───────────┼───────────┐
          │    Communication      │
          │       Channels        │
          │  Telegram|Discord|LINE│
          │  WhatsApp|Slack|Signal│
          └───────────┼───────────┘
                      |
    ╔═════════════════╪═════════════════╗
    ║  Layer 1: Gateway                 ║
    ║  Port 18789                       ║
    ║  Channel Adapters | Message Queue ║
    ║  Auth & Rate Limiting | REST API  ║
    ╠═══════════════════════════════════╣
    ║  Layer 2: Reasoning Layer         ║
    ║  Intent Recognition | LLM Router ║
    ║  Tool Selection | SOUL.md        ║
    ╠═══════════════════════════════════╣
    ║  Layer 3: Memory System           ║
    ║  WAL (Write-Ahead Log)           ║
    ║  Markdown Compaction             ║
    ║  Context Window Manager          ║
    ╠═══════════════════════════════════╣
    ║  Layer 4: Skills / Execution      ║
    ║  Skill Registry | Sandbox        ║
    ║  Permission Enforcer             ║
    ╚═══════════════════════════════════╝
```

---

## Layer 1: Gateway

The Gateway is OpenClaw's sole entry point for external communication, listening on **port 18789** by default.

### Core Responsibilities

1. **Unified message reception** — Receive messages from 20+ platforms
2. **Format standardization** — Convert platform-specific formats to internal standard format
3. **Authentication & authorization** — Validate incoming requests
4. **Rate limiting** — Prevent excessive requests from destabilizing the system
5. **Message queue** — Manage message ordering and priority

:::danger Security Reminder
The Gateway is OpenClaw's largest attack surface. Over 30,000 instances have been compromised due to exposed port 18789. **Always bind to `127.0.0.1`**. See [Security Best Practices](/docs/security/best-practices).
:::

---

## Layer 2: Reasoning Layer

The Reasoning Layer is OpenClaw's "brain," responsible for understanding user intent, deciding action strategies, and generating responses.

### LLM Router

OpenClaw supports multiple LLM providers. The LLM Router routes requests to the appropriate model based on task type, complexity, and configuration.

### SOUL.md Personality System

SOUL.md defines the Agent's personality, behavioral rules, and task lists. It is injected as the system prompt for every LLM call.

---

## Layer 3: Memory System

The Memory System uses a **WAL + Markdown Compaction** hybrid architecture, balancing write performance with long-term storage efficiency.

### Architecture

- **WAL (Write-Ahead Log)**: Fast writes, retains complete conversations in `~/.openclaw/memory/wal/`
- **Compacted Markdown**: Periodically compressed structured long-term memory in `~/.openclaw/memory/compacted/`
- **Context Window Manager**: Assembles the most valuable context within the LLM's token limits

### Token Allocation Strategy

| Component | Default Allocation | Description |
|-----------|-------------------|-------------|
| System Prompt | 15% | SOUL.md and safety instructions |
| Recent conversation | 40% | Recent conversation history |
| Long-term memory | 20% | Relevant compacted memory |
| Tool definitions | 15% | Available skill descriptions |
| Reserved space | 10% | Space for model response |

---

## Layer 4: Skills / Execution Layer

The Skills Layer executes various operations in a secure sandbox environment.

### Sandbox Architecture

Skills run in **Podman rootless containers** with strict limits:
- Memory: 512MB
- CPU: 1 core
- Network: Restricted domains
- Filesystem: Read-only + /tmp
- No root privileges
- seccomp profile enabled

### Skill-LLM Interaction

Skills interact with the LLM via **Tool Use / Function Calling**, with definitions auto-generated from `manifest.yaml`.

---

## Performance Considerations

| Stage | Typical Latency | Bottleneck |
|-------|----------------|------------|
| Gateway receive | < 10ms | Network latency |
| Context assembly | 50-200ms | Memory queries |
| LLM reasoning | 1-10s | Model size, API latency |
| Skill execution | 100ms-30s | External APIs, container startup |
| Gateway respond | < 10ms | Network latency |
| **Total** | **1.5-40s** | Primarily LLM dependent |

---

## Further Reading

- [API Reference](/docs/architecture/api-reference) — Complete Gateway REST API docs
- [Security Best Practices](/docs/security/best-practices) — Layer-by-layer security configuration
- [Threat Model](/docs/security/threat-model) — Security threat analysis for each layer
