---
title: "Module 4: ClawHub Marketplace"
sidebar_position: 5
description: "Master the ClawHub marketplace — installation, publishing, review mechanisms, and security scanning workflows"
keywords: [OpenClaw, ClawHub, marketplace, Skill publishing, VirusTotal, ClawHavoc, security]
---

# Module 4: ClawHub Marketplace

## Learning Objectives

By the end of this module, you will be able to:

- Use the `clawhub` CLI to search, install, and manage Skills
- Understand ClawHub's review mechanisms and trust model
- Publish your own Skills to ClawHub
- Explain the ClawHavoc incident and the resulting security enhancements
- Evaluate Skill security and identify potential risks

:::info Prerequisites
Please complete [Module 3: Skills System & SKILL.md Specification](./module-03-skills-system) first, ensuring you understand Skill structure and development.
:::

---

## ClawHub Overview

**ClawHub** is the official OpenClaw Skill marketplace, similar to npm, PyPI, or Docker Hub, but purpose-built for AI Agent Skills. As of March 2026, ClawHub hosts over **13,000 Skills** spanning productivity, developer tools, data analysis, automation, and more.

### ClawHub Ecosystem

```
Developers                ClawHub                     Users
┌──────────┐           ┌──────────────────┐        ┌──────────┐
│ Develop  │           │                  │        │ Search   │
│ Skill ──▶│── push ──▶│  Skill Registry  │◀─ search─│ ────────▶│
│          │           │  ┌────────────┐  │        │          │
│ SKILL.md │           │  │ 13,000+    │  │        │ Install  │
│ Code     │           │  │  Skills    │  │        │ ────────▶│
│ Tests    │           │  └────────────┘  │        │          │
└──────────┘           │                  │        │ Rate     │
                       │  ┌────────────┐  │        │ ────────▶│
                       │  │ Review     │  │        └──────────┘
                       │  │ Pipeline   │  │
                       │  │ VirusTotal │  │
                       │  │ Static     │  │
                       │  │ Analysis   │  │
                       │  │ Signature  │  │
                       │  └────────────┘  │
                       └──────────────────┘
```

### Key Metrics

| Metric | Value |
|---|---|
| Total Skills | 13,000+ |
| Verified Developers | 2,800+ |
| Official Skills | 150+ |
| Daily Installs | 45,000+ |
| Average Review Time | 24 hours |
| VirusTotal Scan Rate | 100% (mandatory) |

---

## Using the ClawHub CLI

### Searching for Skills

```bash
# Basic search
clawhub search weather

# Filter by tag
clawhub search --tag productivity

# Filter by author
clawhub search --author openclaw-official

# Show only verified Skills
clawhub search weather --verified

# Sort by download count
clawhub search --sort downloads --limit 20
```

Example search results:

```
NAME                          AUTHOR              DOWNLOADS  RATING  VERIFIED
─────────────────────────────────────────────────────────────────────────────
weather-lookup                openclaw-official    124,500    4.9     ✓
weather-forecast-pro          weather-dev          45,200     4.7     ✓
weather-alerts                community-tools      12,300     4.5     ✓
weather-radar                 wx-enthusiast         8,700     4.3
weather-historical            data-archive          3,200     4.1
```

### Installing Skills

```bash
# Standard install
clawhub install openclaw-official/weather-lookup

# Install a specific version
clawhub install openclaw-official/weather-lookup@1.2.0

# Install without interactive confirmation (CI/CD scenarios)
clawhub install openclaw-official/weather-lookup --yes

# View the security report before installing
clawhub inspect openclaw-official/weather-lookup
```

Installation flow:

```
clawhub install openclaw-official/weather-lookup
╭─────────────────────────────────────────────╮
│  Installing weather-lookup v1.2.0           │
│  Author: openclaw-official (verified ✓)     │
│                                             │
│  Permissions requested:                     │
│    ✓ network:api.openweathermap.org         │
│    ✓ network:api.weatherapi.com             │
│                                             │
│  Security scan:                             │
│    ✓ VirusTotal: 0/72 detections            │
│    ✓ Static analysis: passed                │
│    ✓ Signature: valid (SHA-256)             │
│                                             │
│  Accept? [Y/n]                              │
╰─────────────────────────────────────────────╯
```

### Managing Installed Skills

```bash
# List all installed Skills
clawhub list

# View details for a specific Skill
clawhub info weather-lookup

# Update a single Skill
clawhub update weather-lookup

# Update all Skills
clawhub update --all

# Remove a Skill
clawhub remove weather-lookup

# View a Skill's changelog
clawhub changelog weather-lookup
```

---

## ClawHub Trust Model

ClawHub uses a multi-tiered trust model to help users evaluate Skill reliability:

### Trust Levels

| Level | Badge | Description | Review Process |
|---|---|---|---|
| **Official** | :classical_building: | Developed and maintained by the OpenClaw team | Internal review |
| **Verified** | ✓ | Verified developer, passed full review | Automated + manual review |
| **Community** | -- | Community contribution, passed basic scanning | Automated scanning |
| **Unverified** | :warning: | Newly published, review not yet complete | Queued |
| **Flagged** | :triangular_flag: | Reported by the community as problematic | Under investigation |

:::warning Security Advice
- Prefer installing **Official** or **Verified** Skills
- Before installing a **Community** Skill, always check its permission declarations
- **Never** install a **Flagged** Skill
- Use `clawhub inspect` to view the full security report before installation
:::

### Security Scanning Pipeline

Every Skill uploaded to ClawHub goes through the following scans:

```
Upload → SHA-256 signature verification → VirusTotal scan (72 engines) →
Static code analysis → Permission audit → Dependency check → Sandbox test run →
[Manual review (Verified and above)] → Publish
```

1. **Signature verification**: Confirms file integrity and that it hasn't been tampered with
2. **VirusTotal scan**: Scans with 72 antivirus engines
3. **Static analysis**: Checks for suspicious code patterns (e.g., `eval()`, obfuscated code, suspicious network requests)
4. **Permission audit**: Confirms declared permissions match actual code behavior
5. **Dependency check**: Scans npm/pip dependencies for known vulnerabilities
6. **Sandbox test**: Runs in an isolated environment to verify expected behavior

---

## ClawHavoc Incident Retrospective

:::danger Major Security Incident
**ClawHavoc** (January 2026) was the most serious supply chain attack in OpenClaw's history. Attackers uploaded **2,400 malicious Skills** to ClawHub disguised as legitimate tools, which secretly exfiltrated users' API keys, environment variables, and files.
:::

### Event Timeline

| Date | Event |
|---|---|
| 2026-01-08 | Attackers begin mass-uploading malicious Skills |
| 2026-01-15 | Community members report anomalous behavior |
| 2026-01-16 | OpenClaw team confirms the attack and begins investigation |
| 2026-01-17 | Emergency takedown of 2,400 malicious Skills |
| 2026-01-20 | Security update released, mandatory VirusTotal scanning enforced |
| 2026-01-25 | New trust model and review pipeline rolled out |
| 2026-02-01 | All existing Skills complete re-scanning |

### Improvements After ClawHavoc

1. **Mandatory VirusTotal scanning**: All Skills must pass 72-engine scanning before upload
2. **Permission transparency**: All requested permissions are clearly displayed during installation
3. **Enhanced static analysis**: New suspicious pattern detection (obfuscated code, hidden network requests)
4. **Developer identity verification**: Verified Developer program introduced
5. **Community reporting mechanism**: One-click reporting for suspicious Skills
6. **Automatic revocation**: Skills with VirusTotal detection rate > 0 are automatically delisted

### Self-Check

If you installed any Skills during the ClawHavoc period, run the following immediately:

```bash
# Check for known malicious Skills
clawhub audit

# Example output:
# Auditing installed skills...
# ✓ 45/47 skills passed security check
# ⚠ 2 skills require attention:
#   - suspicious-tool v1.0.0 (REMOVED from ClawHub)
#   - fake-helper v0.3.2 (FLAGGED: potential data exfiltration)
#
# Run 'clawhub remove <skill>' to uninstall flagged skills
# Run 'clawhub audit --rotate-keys' to rotate compromised API keys

# Remove suspicious Skills and rotate API Keys
clawhub remove suspicious-tool fake-helper
clawhub audit --rotate-keys
```

---

## Hands-On: Publishing Your Skill to ClawHub

Let's publish the Pomodoro Timer Skill created in [Module 3](./module-03-skills-system) to ClawHub.

### Step 1: Create a ClawHub Account

```bash
# Register an account
clawhub register

# Or log in to an existing account
clawhub login
```

### Step 2: Prepare for Publishing

```bash
cd ~/.openclaw/skills/local/pomodoro-timer

# Validate the Skill structure
clawhub validate .

# Output:
# Validating pomodoro-timer...
# ✓ SKILL.md: valid
# ✓ index.js: found
# ✓ Permissions: none requested (safe)
# ✓ Runtime: node:20-slim (supported)
# ✓ Version: 0.1.0 (valid semver)
# Ready to publish!
```

### Step 3: Write a README.md (for the ClawHub page)

```bash
cat > README.md << 'EOF'
# Pomodoro Timer Skill

A simple yet effective Pomodoro timer for OpenClaw.

## Features

- Start, pause, and reset Pomodoro sessions
- Customizable work and break durations
- Session tracking and statistics
- Multi-language support (zh-TW, en, ja)

## Usage

Just tell your OpenClaw agent:

- "Start a pomodoro"
- "Pomodoro status"
- "Pause the pomodoro"
- "Reset the pomodoro"

## Installation

```bash
clawhub install your-username/pomodoro-timer
```

## License

MIT
EOF
```

### Step 4: Publish

```bash
# Publish to ClawHub
clawhub publish .

# Output:
# Publishing pomodoro-timer v0.1.0...
# ✓ Package created (12.3 KB)
# ✓ SHA-256 signature generated
# ✓ Uploaded to ClawHub
# ✓ VirusTotal scan queued
#
# Your skill is now available at:
# https://clawhub.dev/your-username/pomodoro-timer
#
# Note: Full security scan takes ~24 hours.
# Status: Unverified → Community (after scan passes)
```

### Step 5: Manage Published Skills

```bash
# View all your published Skills
clawhub my-skills

# View download statistics
clawhub stats pomodoro-timer

# Publish an updated version
# 1. Update the version in SKILL.md
# 2. Re-publish
clawhub publish . --bump patch  # 0.1.0 → 0.1.1

# Unpublish a specific version
clawhub unpublish pomodoro-timer@0.1.0

# Transfer ownership
clawhub transfer pomodoro-timer --to new-owner
```

---

## Skill Ratings & Feedback

### Rating System

ClawHub uses a five-star rating system with text reviews:

```bash
# Rate a Skill
clawhub rate weather-lookup --stars 5 --comment "Works great, fast responses!"

# View reviews
clawhub reviews weather-lookup

# Report an issue
clawhub report weather-lookup --reason "suspicious-behavior" \
  --details "Skill attempts to access undeclared network endpoints"
```

### Skill Selection Checklist

Before installing a community Skill, evaluate it using this checklist:

- [ ] Is the trust level Verified or higher?
- [ ] Are the permission declarations reasonable? (A search Skill shouldn't need filesystem:write)
- [ ] Is the rating 4.0 or above?
- [ ] Has the last update been within 6 months?
- [ ] Does it have sufficient downloads and reviews?
- [ ] Is the source code open for review?
- [ ] Does `clawhub inspect` show a clean report?

---

## Common Errors & Troubleshooting

### Error 1: Publish Failed -- Name Already Taken

```
Error: Skill name 'weather-lookup' is already taken
```

**Fix**: Choose a different name, or add your namespace prefix (e.g., `your-username/my-weather-lookup`).

### Error 2: VirusTotal Scan Failed

```
Error: VirusTotal detected 2/72 positives
```

**Fix**:
```bash
# View the detailed report
clawhub scan-report pomodoro-timer

# If it's a false positive, file an appeal
clawhub appeal pomodoro-timer --reason "False positive: detected pattern is standard API call"
```

### Error 3: Install Failed -- Version Conflict

```
Error: Dependency conflict: skill-a requires node:18 but skill-b requires node:20
```

**Fix**: Each Skill runs in an independent container, so runtime conflicts typically don't occur. If you encounter one, update to the latest version.

### Error 4: Permission Audit Failed

```
Error: Permission audit failed: code accesses 'api.hidden-endpoint.com' but only declares 'api.example.com'
```

**Fix**: Correctly declare all network access targets in SKILL.md.

---

## Exercises

1. **Skill Discovery**: Use `clawhub search` to find the top 10 Skills by downloads. Analyze their common characteristics (permission requirements, feature types, author distribution).

2. **Security Audit**: Run `clawhub audit` on all your installed Skills, record the results, and address any warnings.

3. **Publishing Practice**: Publish the Pomodoro Timer you developed in Module 3 to ClawHub (a test environment is fine), completing the full develop-to-publish workflow.

4. **Evaluation Exercise**: Select 5 Community-level Skills. Use this module's checklist to evaluate their security and record your findings.

---

## Quiz

1. **How many Skills are currently on ClawHub?**
   - A) 5,000+
   - B) 8,000+
   - C) 13,000+
   - D) 20,000+

2. **What is the correct command to install a Skill?**
   - A) `openclaw install weather-lookup`
   - B) `clawhub install openclaw-official/weather-lookup`
   - C) `npm install weather-lookup`
   - D) `pip install weather-lookup`

3. **How many malicious Skills were uploaded during the ClawHavoc incident?**
   - A) 100
   - B) 500
   - C) 2,400
   - D) 10,000

4. **Which trust level indicates a Skill has passed full review?**
   - A) Community
   - B) Unverified
   - C) Verified
   - D) Flagged

5. **Which security measure became mandatory after ClawHavoc?**
   - A) Manual review
   - B) Two-factor authentication
   - C) VirusTotal scanning
   - D) Blockchain signatures

<details>
<summary>View Answers</summary>

1. **C** -- As of March 2026, ClawHub hosts over 13,000 Skills.
2. **B** -- Use the `clawhub install <author>/<skill>` format to install Skills.
3. **C** -- 2,400 malicious Skills were uploaded during the ClawHavoc incident.
4. **C** -- Verified indicates the Skill was published by a verified developer and has passed both automated and manual review.
5. **C** -- After ClawHavoc, VirusTotal scanning (72 engines) became a mandatory requirement for all Skill uploads.

</details>

---

## Next Steps

You now have a solid grasp of the ClawHub marketplace and its security concepts. Next, let's explore OpenClaw's memory system and learn how the Agent maintains context across conversations.

**[Go to Module 5: Persistent Memory & Personalization →](./module-05-memory)**
