---
title: Threat Model Analysis
description: OpenClaw's complete threat model — attack surfaces, attack vectors, threat actor analysis, and security risk assessment for each architectural layer.
sidebar_position: 2
---

# Threat Model Analysis

This page systematically analyzes all security threats facing the OpenClaw platform from a security research perspective. Understanding the threat model is the foundation for effective defense strategies.

:::info Who This Is For
This page is intended for users with basic security knowledge. For quick protective setup, read [Security Best Practices](/docs/security/best-practices) first.
:::

---

## Attack Surface Overview

Each of OpenClaw's four architectural layers has unique attack surfaces:

```
Attacker → [Gateway 18789] → [Reasoning] → [Memory]
                |                   |            |
                ↓                   ↓            ↓
           Network attacks    Prompt Injection  Data theft
           Auth bypass        Model manipulation Memory poisoning
           RCE (CVE)         Context leakage   Conversation hijacking
                |
                ↓
           [Skills / Execution]
                |
                ↓
           Supply chain attacks (ClawHavoc)
           Sandbox escape
           Privilege escalation
           Data exfiltration
```

---

## Threat Actor Analysis

| Actor | Capability | Motivation | Typical Attack |
|-------|-----------|-----------|----------------|
| **Opportunistic attackers** | Low | Exploit exposed services | Shodan scanning port 18789 |
| **Malicious skill developers** | Medium | Steal API keys, cryptomining | Plant backdoor skills on ClawHub |
| **Targeted attackers** | High | Steal specific target's data | Social engineering + technical attack |
| **Nation-state actors** | Very high | Surveillance, espionage | Supply chain attacks, zero-days |
| **Insider threats** | Varies | Disgruntled employees, curiosity | Access memory files, modify SOUL.md |

---

## Key Attack Vectors

### Gateway: Port Exposure (CVSS 9.8)
135,000 publicly accessible instances found. 30,000+ already compromised. **Always bind to 127.0.0.1**.

### Gateway: CVE-2026-25253 — RCE
Remote code execution vulnerability in Gateway message processing. Affects all pre-v3.x versions. **Update immediately**.

### Reasoning: Prompt Injection
Attackers craft messages to override SOUL.md instructions. Includes direct injection, indirect injection (via web content), and multi-step injection.

### Memory: File Theft
Memory stored as files in `~/.openclaw/memory/`. Any process with directory access can read complete conversation history including personal data.

### Skills: Supply Chain Attacks (ClawHavoc)
2,400+ malicious skills planted on ClawHub. Common behaviors: API key theft, memory exfiltration, cryptomining, reverse shells.

### Skills: Sandbox Escape
Container escape vulnerabilities could allow skills to access the host system. Use Podman rootless to eliminate root daemon risk.

---

## Risk Matrix

| Attack Vector | Likelihood | Impact | Risk Level | Primary Mitigation |
|--------------|-----------|--------|-----------|-------------------|
| Port exposure | High | Critical | **Critical** | Bind localhost |
| CVE-2026-25253 | High | Critical | **Critical** | Update version |
| Supply chain | Medium | High | **High** | Skill review |
| Prompt injection | Medium | Medium | **Medium** | SOUL.md safety rules |
| Memory theft | Low | High | **Medium** | File permissions + encryption |
| Sandbox escape | Low | Critical | **Medium** | Podman rootless |
| Memory poisoning | Low | Medium | **Low** | Gateway security |

---

## Further Reading

- [Security Best Practices](/docs/security/best-practices) — Practical operation guide
- [Skill Audit Checklist](/docs/security/skill-audit-checklist) — Pre-installation review process
- [Architecture Overview](/docs/architecture/overview) — Detailed four-layer architecture design
