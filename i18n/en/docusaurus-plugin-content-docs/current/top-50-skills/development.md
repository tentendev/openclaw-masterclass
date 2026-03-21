---
sidebar_position: 3
title: "Development Skills"
description: "Complete review of OpenClaw development Skills: GitHub, Security-check, Cron-backup, Linear, n8n, Codex Orchestration"
keywords: [OpenClaw, Skills, Development, GitHub, Security, Linear, n8n, Codex]
---

# Development Skills

Development Skills let the OpenClaw Agent deeply integrate into your software development workflow — from version control and issue management to CI/CD automation. The Agent becomes your pair programmer and DevOps assistant.

---

## #1 — GitHub

| Property | Details |
|----------|---------|
| **Rank** | #1 / 50 |
| **Category** | Development |
| **Total Score** | 72 / 80 |
| **Maturity** | 🟢 Stable |
| **Official/Community** | Official |
| **Installation** | `clawhub install openclaw/github` |
| **Target Users** | All software developers |

### Feature Overview

The GitHub Skill is the highest-scoring Skill in OpenClaw, providing complete Git workflow integration:

- **Repository management**: Create, clone, and search repos
- **Branch & PR workflow**: Create branches, commit, open Pull Requests, conduct Code Review
- **Issue management**: Create, search, categorize, and assign Issues
- **CI/CD integration**: Trigger GitHub Actions, view workflow status
- **Code Search**: Search code across repositories
- **Release management**: Create tags, publish release notes

### Why It Matters

GitHub is the world's largest code hosting platform. This Skill makes the Agent a true development partner — not just writing code, but managing the entire development lifecycle. A single Skill covers the complete cycle from Issue to Branch to Code to PR to Review to Merge.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** |

**Ranking rationale**: Perfect relevance and compatibility scores, plus official OpenClaw team maintenance for consistent quality. The only deductions are in security (requires a GitHub Token with broad permissions) and learning value (Git concepts are already widely known).

### Installation & Setup

```bash
clawhub install openclaw/github

# Method 1: Authorize via GitHub CLI (recommended)
gh auth login
openclaw skill configure github --auth-method gh-cli

# Method 2: Use a Personal Access Token
openclaw skill configure github \
  --token ghp_xxxxxxxxxxxx \
  --default-org your-org
```

### Dependencies & Security

- **Dependencies**: GitHub Account, Personal Access Token or GitHub CLI
- **Permissions Required**: `repo`, `workflow`, `read:org` (can be narrowed based on features used)
- **Security**: SEC 8/10 — officially maintained and open-source, but GitHub Token scope is broad; use Fine-grained PATs

:::warning Token Security
- Use **Fine-grained Personal Access Tokens** and grant access only to the repositories you need
- Never use a Classic PAT with global `repo` scope
- Consider pairing with the 1Password Skill (#23) for Token management
:::

- **Alternatives**: GitLab users can switch to the community `community/gitlab-claw`

---

## #12 — Security-check

| Property | Details |
|----------|---------|
| **Rank** | #12 / 50 |
| **Category** | Development |
| **Total Score** | 60 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/security-check` |
| **Target Users** | Security-conscious users, Skill developers |

### Feature Overview

A meta-skill designed specifically to audit the security of other Skills:

- Static analysis of Skill source code to detect suspicious API calls
- Checks whether permission declarations are excessive
- Detects hardcoded secrets and tokens
- Analyzes network request destinations
- Generates security assessment reports

### Why It Matters

The OpenClaw ecosystem contains a large number of community Skills of varying quality. Security-check acts as your "gatekeeper" before installing any third-party Skill. See the [Safety Guide](./safety-guide) for details on the ClawHavoc incident.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** |

### Installation & Usage

```bash
clawhub install community/security-check

# Scan a specific Skill
openclaw run security-check --target community/some-skill

# Scan all installed Skills
openclaw run security-check --all

# Scan before installing (recommended workflow)
clawhub inspect community/new-skill | openclaw run security-check --stdin
```

### Dependencies & Security

- **Dependencies**: None
- **Permissions Required**: Read access to other Skills' installation directories
- **Security**: SEC 9/10 — it is itself a security tool
- **Alternatives**: Manual code review + VirusTotal API

---

## #14 — Linear

| Property | Details |
|----------|---------|
| **Rank** | #14 / 50 |
| **Category** | Development |
| **Total Score** | 59 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/linear-claw` |
| **Target Users** | Linear users, development teams |

### Feature Overview

Deep integration with the Linear project management tool:

- Create, update, and search Issues
- Manage Cycles and Projects
- Automate status transitions
- Auto-create Issues from conversation context
- Link with the GitHub Skill: auto-close Issues on PR merge

### Why It Matters

Linear has become the project management tool of choice for many startups and dev teams. The GitHub Skill handles the code layer while the Linear Skill handles the project management layer — together they cover the complete development workflow.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** |

### Installation & Setup

```bash
clawhub install community/linear-claw

# Set your Linear API Key
openclaw skill configure linear-claw \
  --api-key lin_api_xxxxxxxxxxxx \
  --default-team your-team-key
```

### Dependencies & Security

- **Dependencies**: Linear API Key
- **Permissions Required**: Issue read/write
- **Security**: SEC 8/10 — Linear API permission granularity is reasonable
- **Alternatives**: Jira Bridge (#46) for Jira users, Trello (#41)

---

## #20 — Cron-backup

| Property | Details |
|----------|---------|
| **Rank** | #20 / 50 |
| **Category** | Development |
| **Total Score** | 57 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/cron-backup` |
| **Target Users** | Users who prioritize data safety |

### Feature Overview

Provides scheduled backups for OpenClaw configuration, memory, and Skill data:

- Scheduled backup of Agent memory data
- Backup of Skill configuration files
- Backup of conversation history
- Supports local and cloud storage (S3, Google Drive)
- Incremental backups with version control

### Why It Matters

OpenClaw's memory system stores all your interaction context with the Agent. Losing it means spending significant time rebuilding. Cron-backup ensures you never lose this valuable data due to system failure.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 8 | 5 | 8 | 7 | 8 | 8 | 6 | **57** |

### Installation & Setup

```bash
clawhub install community/cron-backup

# Set up local backup
openclaw skill configure cron-backup \
  --destination ~/openclaw-backups \
  --schedule "0 2 * * *"  # Every day at 2 AM

# Set up S3 backup
openclaw skill configure cron-backup \
  --destination s3://my-bucket/openclaw-backups \
  --schedule "0 */6 * * *"  # Every 6 hours
```

### Dependencies & Security

- **Dependencies**: cron daemon (local) or S3 credentials (cloud)
- **Permissions Required**: Read access to OpenClaw data directory, write access to backup destination
- **Security**: SEC 8/10 — backup contents may include sensitive data; encryption recommended
- **Alternatives**: Manual `cp -r ~/.openclaw/data ~/backup/`

---

## #29 — Codex Orchestration

| Property | Details |
|----------|---------|
| **Rank** | #29 / 50 |
| **Category** | Development |
| **Total Score** | 54 / 80 |
| **Maturity** | 🟠 Alpha |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/codex-orch` |
| **Target Users** | Advanced developers, multi-agent architecture experimenters |

### Feature Overview

Lets the OpenClaw Agent coordinate multiple Codex-style subtasks:

- Break large development tasks into subtasks
- Execute multiple code generation tasks in parallel
- Merge results and resolve conflicts
- Track progress with failure retry
- Links with the GitHub Skill to auto-create feature branches

### Why It Matters

This is an experimental Skill pushing OpenClaw toward a multi-agent architecture. It lets a single Agent "fork" itself to handle complex development projects — conceptually similar to OpenAI Codex's task dispatch model, but built on top of OpenClaw's Skill system.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 6 | 5 | 8 | 6 | 7 | 7 | 8 | **54** |

### Installation & Setup

```bash
clawhub install community/codex-orch

# Set parallelism limit
openclaw skill configure codex-orch \
  --max-parallel 3 \
  --timeout 600
```

:::warning Experimental Skill
Codex Orchestration is currently in Alpha. Its API may change significantly in future versions. Not recommended for production workflows. Best suited for learning multi-agent architecture patterns.
:::

### Dependencies & Security

- **Dependencies**: OpenClaw Core v0.9+, GitHub Skill (optional)
- **Permissions Required**: High — requires permissions to execute arbitrary code
- **Security**: SEC 7/10 — parallel execution increases the attack surface
- **Alternatives**: Manually use OpenClaw's `--fork` mode

---

## #46 — Jira Bridge

| Property | Details |
|----------|---------|
| **Rank** | #46 / 50 |
| **Category** | Development |
| **Total Score** | 46 / 80 |
| **Maturity** | 🟠 Alpha |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/jira-bridge` |
| **Target Users** | Enterprise teams using Jira |

### Feature Overview

Basic integration with Atlassian Jira:

- Search and view Issues
- Create and update Issues
- Transition Issue status
- Add comments

### Why It Matters

Jira remains the most prevalent project management tool in enterprise environments. While the Linear Skill is higher quality, Jira Bridge is currently the only option for teams committed to Jira.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 5 | 4 | 6 | 5 | 6 | 7 | 6 | **46** |

### Installation & Setup

```bash
clawhub install community/jira-bridge

openclaw skill configure jira-bridge \
  --url https://yourcompany.atlassian.net \
  --email you@company.com \
  --api-token your_jira_api_token
```

### Dependencies & Security

- **Dependencies**: Jira Cloud API Token
- **Permissions Required**: Issue read/write
- **Security**: SEC 7/10 — Jira API Token permissions are coarse-grained
- **Alternatives**: Linear (#14) is higher quality but requires team migration

---

## Recommended Developer Skill Combinations

### Full-Stack Developer

```bash
clawhub install openclaw/github
clawhub install community/linear-claw
clawhub install community/security-check
clawhub install community/cron-backup
```

### Open-Source Contributor

```bash
clawhub install openclaw/github
clawhub install community/security-check
# Pair with Web Browsing for documentation lookup
```

### Advanced Experimenter

```bash
clawhub install openclaw/github
clawhub install community/codex-orch
clawhub install community/n8n-openclaw
# Multi-agent development workflow experiments
```
