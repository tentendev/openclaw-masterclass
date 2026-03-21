---
title: "What's New in March 2026"
description: Major OpenClaw updates for March 2026 — official changes, ecosystem developments, security advisories, and community-reported changes.
sidebar_position: 1
---

# What's New in March 2026

This page covers the most significant updates and changes in the OpenClaw ecosystem as of March 20, 2026.

:::info Data Sources
This article integrates information from official announcements, GitHub releases, Reddit community discussions, and security research reports. Items marked "community-reported" have not been officially confirmed.
:::

---

## Executive Summary

Q1 2026 has been a security awakening quarter for OpenClaw. The disclosure of CVE-2026-25253, the Bitdefender security audit report, and the aftermath of the ClawHavoc incident have pushed both the community and the core team to make security a top priority. At the same time, tech giants like Nvidia and Tencent have begun investing in the OpenClaw ecosystem, bringing fresh momentum to the platform.

### Key Numbers This Month

| Metric | Value |
|--------|-------|
| GitHub Stars | 250,000+ |
| ClawHub Skills | 13,000+ |
| Known Exposed Instances (Bitdefender) | 135,000 |
| Confirmed Compromised Instances | 30,000+ |
| ClawHavoc Malicious Skills (Removed) | 2,400+ |

---

## Official Changes

### 1. CVE-2026-25253 Patch

**Severity: Critical (CVSS 9.8)**

The Gateway remote code execution vulnerability has been patched in the latest release. This vulnerability affected all versions prior to v3.x, allowing attackers to execute arbitrary code through an exposed port 18789.

```bash
# Check your version
openclaw --version

# Upgrade to the latest version
npm install -g @openclaw/cli@latest

# Verify patch status
openclaw doctor --security
```

:::danger Take Action Now
If your OpenClaw version is older than the latest patched release, **upgrade immediately**. This vulnerability is actively being exploited in the wild.
:::

### 2. ClawHub VirusTotal Integration

Following the ClawHavoc incident, ClawHub now includes VirusTotal scan integration. All newly uploaded skills are automatically scanned by VirusTotal, with results displayed on the skill page.

**New CLI commands:**
```bash
# View a skill's VirusTotal scan results
openclaw skill virustotal <skill-name>

# Report a suspicious skill
openclaw skill report <skill-name> --reason "Describe suspicious behavior"
```

### 3. Hardened Gateway Defaults

New OpenClaw installations via `openclaw init` now ship with more secure default settings:

| Setting | Old Default | New Default |
|---------|-------------|-------------|
| `gateway.bind` | `0.0.0.0` | **`127.0.0.1`** |
| `gateway.auth.enabled` | `false` | **`true`** |
| `gateway.auth.token` | None | **Auto-generated** |
| `execution.engine` | `docker` | **`podman`** (if installed) |

### 4. Skill Signature Verification (Beta)

The core team has launched a beta version of skill signature verification. Verified skill developers can digitally sign their skills, and signatures are automatically verified at install time.

```bash
# Only install signed skills
openclaw skill install --signed-only <skill-name>

# Check a skill's signature status
openclaw skill info <skill-name> | grep signature
```

### 5. Memory System v2 Preview

A major overhaul of the memory system is underway. The v2 release is expected to introduce:
- Vectorized memory search (replacing plain text matching)
- Memory tiering (public / private / sensitive)
- Automatic PII redaction
- Cross-agent shared memory (opt-in)

You can enable the preview via a feature flag:
```bash
openclaw start --experimental-memory-v2
```

---

## Ecosystem Developments

### 6. Nvidia GPU Acceleration for OpenClaw

Nvidia announced GPU acceleration support for OpenClaw, primarily targeting:
- Local LLM inference acceleration (with Ollama + CUDA)
- GPU rendering for browser-use skills
- Speech recognition (Whisper) acceleration
- Future vectorized memory search

```bash
# Enable Nvidia GPU support
openclaw config set execution.gpu.enabled true
openclaw config set execution.gpu.runtime nvidia
```

### 7. Tencent Open-Sources Chinese Ecosystem Packages

Tencent has open-sourced a suite of OpenClaw tools tailored for Chinese-language users:
- **Official WeChat Adapter** — Replacing the community-maintained WeChatFerry
- **Chinese speech recognition model** — More accurate Chinese STT than Whisper
- **Chinese SOUL.md templates** — Personality configs optimized for Chinese-language contexts
- **Lark (Feishu) Adapter** — Enterprise messaging platform support

### 8. Composio MCP Major Update

The Composio platform added 50+ new MCP connectors, including:
- Reddit OAuth (read/write)
- Notion Database API
- Linear (project management)
- Figma (design file access)
- Airtable (database)

---

## Security Advisories

### 9. Bitdefender Audit Report

Bitdefender published an OpenClaw security audit in early 2026 with the following key findings:

| Finding | Severity | Status |
|---------|----------|--------|
| 135,000 publicly accessible instances | Critical | Under ongoing monitoring |
| Gateway API unauthenticated rate > 60% | Critical | Improved in new release |
| Docker root daemon usage rate > 70% | High | Podman adoption campaign ongoing |
| Unpatched versions (known vulnerabilities) > 40% | High | Push-notification updates deployed |
| Pre-install skill review rate < 10% | Medium | VirusTotal integration added |

### 10. ClawHavoc Aftermath

Progress on ClawHavoc incident remediation:

- **Malicious skill removal**: All 2,400+ malicious skills have been purged from ClawHub
- **Affected user notifications**: All users who installed malicious skills have been notified
- **API key exfiltration**: An estimated thousands of API keys were stolen — all users are advised to rotate their keys
- **Remediation measures**: VirusTotal scanning, skill signatures, and strengthened review processes

:::warning If You Installed Unfamiliar Skills Between October 2025 and January 2026
Take these steps immediately:
1. Run `openclaw skill list` to review installed skills
2. Remove any suspicious skills
3. Rotate all API keys
4. Check your LLM provider billing for anomalies
:::

### 11. Port 18789 Scanning Continues to Rise

Security researchers report a significant increase in network scanning activity targeting port 18789 following the CVE-2026-25253 disclosure. Shodan data shows:

- December 2025: 80,000 exposed instances
- January 2026: 120,000 exposed instances
- February 2026: 135,000 exposed instances
- Trend: Still increasing

---

## Breaking Changes

### 12. gateway.yaml Format Change

Starting with v3.2.0, the `gateway.yaml` format has changed:

```yaml
# Old format (v3.1.x and earlier)
gateway:
  host: "0.0.0.0"
  port: 18789

# New format (v3.2.0+)
gateway:
  bind: "127.0.0.1"    # "host" renamed to "bind"
  port: 18789
  auth:                  # New authentication block
    enabled: true
    token: "..."
```

```bash
# Auto-migrate your config
openclaw migrate
```

### 13. Skill Manifest Format v2

The skill `manifest.yaml` format has been updated with a new permissions declaration block:

```yaml
# New format requirements
name: my-skill
version: 2.0.0
manifest_version: 2       # New: must be 2
permissions:               # New: permissions must be explicitly declared
  network:
    enabled: true
    domains: ["api.example.com"]
  filesystem:
    enabled: false
  shell:
    enabled: false
  environment:
    enabled: false
```

Skills using the old format will display a deprecation warning and will stop being supported in a future release.

---

## Community-Reported Changes

The following changes have been reported by community members and have not been officially confirmed.

### 14. Multi-Agent Collaboration Improvements

Community members report that multi-agent collaboration (via Discord or Matrix) stability has improved significantly in the latest release:
- 40% reduction in inter-agent message latency
- More reliable memory sharing mechanism
- Smarter handling of task assignment conflicts

### 15. Local LLM Performance Gains

Users running Ollama with local models report noticeable performance improvements in v3.2.0 thanks to LLM Router optimizations:
- 25% reduction in time-to-first-token
- More efficient context window management
- Better support for Llama 3.3 and Qwen 2.5 model families

---

## Timeline

| Date | Event |
|------|-------|
| October 2025 | ClawHavoc incident begins (malicious skills planted in ClawHub) |
| December 2025 | ClawHavoc discovered and cleanup begins |
| Early January 2026 | CVE-2026-25253 disclosed |
| Mid January 2026 | CVE-2026-25253 patch released |
| Late January 2026 | ClawHub VirusTotal integration goes live |
| Early February 2026 | Bitdefender security audit published |
| Mid February 2026 | Gateway default security hardened |
| Late February 2026 | Nvidia GPU acceleration released |
| Early March 2026 | Tencent Chinese ecosystem packages open-sourced |
| Mid March 2026 | Skill signature verification beta launched |
| Mid March 2026 | Memory System v2 preview available |

---

## Recommended Actions

Based on this month's updates, we recommend the following for all OpenClaw users:

### Do Today

1. **Upgrade to the latest version** — Patch CVE-2026-25253
2. **Confirm Gateway is bound to `127.0.0.1`** — Not `0.0.0.0`
3. **Enable Gateway authentication** — Set an auth token
4. **Rotate all API keys** — Especially those used during the ClawHavoc period

### Complete This Week

5. **Audit installed skills** — Remove unnecessary or suspicious skills
6. **Switch to Podman rootless** — If still using Docker
7. **Configure firewall rules** — Block external access to port 18789

### Complete This Month

8. **Read the Security Best Practices** — [Full guide](/docs/security/best-practices)
9. **Establish a skill review process** — [Skill Audit Checklist](/docs/security/skill-audit-checklist)
10. **Try the new features** — Memory System v2 preview, skill signature verification

---

## Further Reading

- [Security Best Practices](/docs/security/best-practices) — Complete security guide
- [Threat Model Analysis](/docs/security/threat-model) — All attack vectors and surfaces
- [Architecture Overview](/docs/architecture/overview) — Latest architecture changes
- [FAQ](/docs/faq) — Frequently asked questions
