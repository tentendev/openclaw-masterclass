---
sidebar_position: 11
title: "Safety Guide"
description: "OpenClaw Skills safety guide: ClawHavoc incident analysis, VirusTotal integration, principle of least privilege, pre-installation audit checklist"
keywords: [OpenClaw, Skills, Security, Safety, ClawHavoc, VirusTotal, Least Privilege]
---

# Skills Safety Guide

OpenClaw's Skill system is an open architecture — anyone can publish a Skill to ClawHub. This brings a rich ecosystem, but also security risks. This section provides a comprehensive safety guide to help you securely use and audit Skills.

:::danger Important Warning
Community-published Skills are **not security-reviewed by the OpenClaw official team**. Installing a third-party Skill is equivalent to running untrusted code on your system. Always follow the security principles in this guide.
:::

---

## ClawHavoc Incident — Case Study

### Incident Overview

In November 2025, a Skill named `productivity-boost-pro` was listed on ClawHub and gained over 8,000 installations within two weeks. The Skill claimed to "dramatically boost Agent task completion efficiency," but actually performed the following malicious actions in the background:

1. **Data exfiltration**: Transmitted user conversation logs, API Keys, and environment variables to an external server
2. **Memory injection**: Modified the Agent's memory system, planting recommendations biased toward specific products
3. **Credential theft**: Captured user OAuth Tokens and forwarded them

### Timeline

```
2025-11-02  productivity-boost-pro listed on ClawHub
2025-11-03  Received multiple five-star reviews from fake accounts
2025-11-07  Installation count exceeded 2,000
2025-11-14  Community user @sec_researcher noticed abnormal network traffic
2025-11-15  Installation count reached 8,000+
2025-11-15  OpenClaw team confirmed malicious behavior, emergency removal
2025-11-16  ClawHub issued security advisory, affected users notified
2025-11-20  OpenClaw introduced Skill signature mechanism (v0.8.5)
2025-12-01  ClawHub added automated static analysis scanning
```

### Lessons Learned

| Lesson | Specific Action |
|--------|----------------|
| **Downloads do not equal safety** | Malicious Skills can have high download counts (via social engineering or fake accounts) |
| **Review the reviews** | Check reviewer account history — new accounts with positive reviews may be fake |
| **Monitor network traffic** | Use the `security-check` Skill or manually monitor for abnormal connections |
| **Least privilege** | Do not grant Skills permissions beyond their functional needs |
| **Regular audits** | Periodically audit installed Skills and their permissions |

---

## Principle of Least Privilege

### Core Concept

Every Skill should only be granted the **minimum permissions necessary** to fulfill its function.

### Permission Levels

```
Level 0 — No permissions (pure computation)
  Examples: Summarize, Prompt Library

Level 1 — Read-only (local)
  Examples: Reddit Readonly, YouTube Digest

Level 2 — Read/write (local)
  Examples: Obsidian, DuckDB CRM, Cron-backup

Level 3 — Read-only (network)
  Examples: Tavily, Felo Search, Web Browsing

Level 4 — Read/write (network)
  Examples: Gmail, GitHub, Slack, n8n

Level 5 — System control
  Examples: Home Assistant, Browser Automation, Codex Orchestration
```

### Practical Implementation

```bash
# View a Skill's permission declarations
clawhub inspect community/some-skill --permissions

# Restrict Skill permissions
openclaw skill restrict some-skill \
  --deny network \
  --deny filesystem-write

# Set up Skill sandbox
openclaw skill sandbox some-skill \
  --network-whitelist "api.tavily.com" \
  --filesystem-whitelist "~/Documents/MyVault"
```

---

## Pre-Installation Audit Checklist

Before installing any third-party Skill, check each item:

### 1. Publisher Reputation

- [ ] Review the publisher's other Skills on ClawHub
- [ ] Confirm the publisher's GitHub account exists and is active
- [ ] Check if they are a known community contributor

```bash
# View publisher information
clawhub publisher info community/some-skill
```

### 2. Source Code Review

- [ ] Is the Skill open-source? Can you view the source code?
- [ ] Are there hardcoded URLs or IP addresses?
- [ ] Is there encrypted or obfuscated code?
- [ ] Are there unnecessary `eval()` or dynamic code execution calls?

```bash
# Download without installing, for review only
clawhub download community/some-skill --inspect-only

# Use the security-check Skill for automated scanning
openclaw run security-check --target community/some-skill
```

### 3. Permission Reasonableness

- [ ] Are the declared permissions reasonable? (e.g., a to-do Skill should not need network access)
- [ ] Does it request excessive filesystem permissions?
- [ ] Does it request Admin / Root permissions?

### 4. Community Feedback

- [ ] Are the ClawHub reviews authentic? (check reviewer accounts)
- [ ] Are there discussions about this Skill on Discord / Reddit?
- [ ] Have any security issues been reported?

### 5. Network Behavior

- [ ] Are the external services the Skill connects to reasonable?
- [ ] Is there unknown telemetry or analytics reporting?

```bash
# Test in sandbox and monitor network behavior
openclaw skill test community/some-skill \
  --sandbox \
  --monitor-network \
  --timeout 60
```

---

## VirusTotal Integration

OpenClaw supports scanning Skill executables via the VirusTotal API:

```bash
# Set VirusTotal API Key (free plan available)
openclaw config set security.virustotal_key your_vt_api_key

# Scan a specific Skill
openclaw security scan community/some-skill

# Scan all installed Skills
openclaw security scan --all

# Auto-scan (runs automatically during clawhub install)
openclaw config set security.auto_scan true
```

### Interpreting VirusTotal Results

```
0/72 detections — Safe
1-3/72 detections — Possibly false positive, but further review recommended
4+/72 detections — High risk, installation not recommended
```

---

## Security-check Skill Detailed Usage

Security-check ([#12](./development#12--security-check)) is a meta-skill specifically for auditing other Skills:

```bash
# Full scan report
openclaw run security-check --target community/some-skill --verbose

# Example report output:
# ┌──────────────────────────────────────────────┐
# │ Security Report: community/some-skill v1.2.3 │
# ├──────────────────────────────────────────────┤
# │ Source Code Analysis                          │
# │   ✅ No hardcoded secrets found               │
# │   ✅ No obfuscated code detected              │
# │   ⚠️  Uses eval() in line 142                 │
# │   ✅ No known vulnerability patterns          │
# │                                               │
# │ Permission Analysis                           │
# │   ✅ Requested: filesystem-read               │
# │   ⚠️  Requested: network-outbound             │
# │   ✅ No system-level permissions              │
# │                                               │
# │ Network Analysis                              │
# │   ✅ Connects to: api.service.com (known)     │
# │   ❌ Connects to: unknown-server.xyz (!)      │
# │                                               │
# │ Overall Risk: MEDIUM                          │
# │ Recommendation: Review network connections    │
# └──────────────────────────────────────────────┘
```

---

## 1Password Skill Security Integration

The 1Password Skill ([#23](./overview)) can securely manage API Keys and Tokens required by Skills:

```bash
clawhub install community/1password-claw

# Configure 1Password CLI connection
openclaw skill configure 1password-claw \
  --account your.1password.com

# Let other Skills retrieve credentials from 1Password
openclaw config set github.token "op://Vault/GitHub/token"
openclaw config set tavily.api_key "op://Vault/Tavily/api_key"

# This way API Keys are not stored in plaintext in config files
```

---

## Incident Response Procedure

If you suspect an installed Skill has malicious behavior:

### Step 1: Disable Immediately

```bash
# Disable the suspicious Skill
openclaw skill disable suspicious-skill

# If unable to disable, remove directly
clawhub uninstall suspicious-skill --force
```

### Step 2: Assess Impact

```bash
# View the Skill's access logs
openclaw skill audit suspicious-skill --last 30d

# Check for abnormal network connections
openclaw security network-log --skill suspicious-skill

# Check if the memory system was modified
openclaw memory diff --since "2026-03-01"
```

### Step 3: Rotate Credentials

```bash
# List potentially affected credentials
openclaw security credentials --exposed-by suspicious-skill

# Rotate all related API Keys and Tokens
# (This requires visiting each service's management interface)
```

### Step 4: Report

```bash
# Report the malicious Skill to ClawHub
clawhub report suspicious-skill --reason malware

# Notify the community in the Discord #security channel
```

---

## Security Best Practices

### Global Security Settings

```bash
# Enable Skill signature verification (reject unsigned Skills)
openclaw config set security.require_signature true

# Enable automatic VirusTotal scanning
openclaw config set security.auto_scan true

# Enable network monitoring
openclaw config set security.network_monitor true

# Restrict default Skill permissions
openclaw config set security.default_permissions "filesystem-read,network-none"

# Require confirmation for Skill installation
openclaw config set security.confirm_install true
```

### Scheduled Security Audits

```bash
# Pair with Cron-backup Skill for regular security scans
openclaw run security-check --all --schedule "0 9 * * 1"
# Scans all installed Skills every Monday at 9 AM
```

---

## Security Level Quick Reference

| Security Level | Description | Applicable Scenario |
|---------------|-------------|---------------------|
| **Strict** | Install only official Skills, enable all security mechanisms | Enterprise environments, handling confidential data |
| **Standard** | Install high-rated community Skills, enable VirusTotal scanning | General users |
| **Relaxed** | Install any Skills, manual review | Developers / experimental environments |

### Strict Mode Configuration

```bash
openclaw config set security.require_signature true
openclaw config set security.auto_scan true
openclaw config set security.network_monitor true
openclaw config set security.allow_community_skills false
openclaw config set security.sandbox_all true
```

### Standard Mode Configuration (Recommended)

```bash
openclaw config set security.require_signature false
openclaw config set security.auto_scan true
openclaw config set security.network_monitor true
openclaw config set security.allow_community_skills true
openclaw config set security.confirm_install true
```

---

## Official vs Community Skills Security Comparison

| Item | Official Skills | Community Skills |
|------|:--------------:|:---------------:|
| Code review | OpenClaw team reviewed | No official review |
| Digital signature | Officially signed | Usually unsigned |
| Update frequency | Stable (follows main releases) | Varies (depends on maintainer) |
| Security incident response | Fast (within 24 hours) | Not guaranteed |
| Source code transparency | Open-source | Not always |
| Support channel | Official GitHub Issues | Individual maintainers |

:::warning Limitations of This Guide
This safety guide provides best-practice recommendations and cannot guarantee 100% security. Even following all recommendations, using third-party Skills carries inherent risk. Make judgments based on your risk tolerance.
:::
