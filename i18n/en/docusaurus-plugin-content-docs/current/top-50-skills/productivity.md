---
sidebar_position: 2
title: "Productivity Skills"
description: "Complete review of OpenClaw productivity Skills: Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize"
keywords: [OpenClaw, Skills, Productivity, Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize]
---

# Productivity Skills

Productivity Skills are the first stop for most users after installing OpenClaw. These Skills let your AI Agent directly manage email, calendars, notes, and task management tools, automating repetitive daily work.

---

## #3 — GOG (General Organizer for Grit)

| Property | Details |
|----------|---------|
| **Rank** | #3 / 50 |
| **Category** | Productivity |
| **Total Score** | 68 / 80 |
| **Maturity** | 🟢 Stable |
| **Official/Community** | Official |
| **Installation** | `clawhub install openclaw/gog` |
| **ClawHub Downloads** | Highest (ranked #1 across all Skills) |
| **Target Users** | All OpenClaw users |

### Feature Overview

GOG is the **most downloaded** Skill in the OpenClaw ecosystem. It provides a unified "organizer" interface that lets the Agent:

- Automatically organize your files, notes, and bookmarks
- Create and track to-do items and reminders
- Aggregate information across tools (combining output from Gmail, Calendar, and other Skills)
- Generate daily/weekly summary reports

### Why It Matters

GOG is the "glue" Skill — it ties together the output from other Skills into a unified workflow. Without GOG, your Agent operates each tool in isolation; with GOG, the Agent proactively integrates and prioritizes your tasks.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** |

### Installation & Setup

```bash
clawhub install openclaw/gog

# Verify installation
clawhub list --installed | grep gog

# First-time setup (interactive)
openclaw skill configure gog
```

### Dependencies & Security

- **Dependencies**: None — runs standalone with no external dependencies
- **Permissions Required**: Filesystem read/write (restricted to working directory)
- **Security**: Officially maintained, open-source code, SEC score 8/10
- **Alternatives**: A Notion + Todoist combination can achieve similar results, but with less integration than GOG

---

## #5 — Gmail

| Property | Details |
|----------|---------|
| **Rank** | #5 / 50 |
| **Category** | Productivity |
| **Total Score** | 66 / 80 |
| **Maturity** | 🟢 Stable |
| **Official/Community** | Official (bundled) |
| **Installation** | Bundled — no installation needed |
| **Target Users** | Users who need email automation |

### Feature Overview

The Gmail Skill ships with OpenClaw core and provides full email management capabilities:

- Read, search, and categorize your inbox
- Compose and send emails (supports draft review mode)
- Auto-reply to common email types
- Attachment handling (upload/download/parse)
- Label management and filter creation

### Why It Matters

Email is still the most critical communication channel in the workplace. Letting the Agent handle your inbox can save 30–60 minutes per day. Pair it with the Summarize Skill to auto-generate daily email digests.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** |

### Configuration

```bash
# Gmail is a bundled Skill — just authorize it
openclaw auth google --scope gmail

# Verify authorization
openclaw skill status gmail
```

:::warning Security Considerations
The Gmail Skill can read all of your email content. Recommendations:
- Enable **draft-only mode** (`openclaw config set gmail.send_mode draft`) so the Agent can only create drafts
- Set a **sender whitelist** to limit auto-reply recipients
- Regularly review app access permissions in your Google security settings
:::

### Dependencies & Security

- **Dependencies**: Google OAuth 2.0 authorization
- **Permissions Required**: `gmail.readonly` + `gmail.send` (can be reduced to `gmail.readonly`)
- **Security**: SEC 7/10 — can access sensitive email content; enable draft-only mode recommended
- **Alternatives**: AgentMail (#24) provides an isolated Agent-specific mailbox

---

## #6 — Calendar

| Property | Details |
|----------|---------|
| **Rank** | #6 / 50 |
| **Category** | Productivity |
| **Total Score** | 65 / 80 |
| **Maturity** | 🟢 Stable |
| **Official/Community** | Official (bundled) |
| **Installation** | Bundled — no installation needed |
| **Target Users** | Users who need calendar management |

### Feature Overview

A calendar management Skill supporting Google Calendar and the CalDAV protocol:

- Query, create, modify, and delete events
- Conflict detection and automatic scheduling suggestions
- Cross-calendar aggregation (personal + work)
- Meeting reminders and auto-generated preparation notes
- Intelligent time zone conversion

### Why It Matters

Combined with the Gmail Skill, the Agent can automatically extract meeting invitations from emails and schedule follow-up events. This is the foundation for building a complete "personal assistant."

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** |

### Configuration

```bash
# Shares Google OAuth with Gmail
openclaw auth google --scope calendar

# Or use CalDAV (e.g., iCloud, Fastmail)
openclaw skill configure calendar --provider caldav \
  --url https://caldav.example.com/user/calendar \
  --username you@example.com
```

### Dependencies & Security

- **Dependencies**: Google OAuth 2.0 or a CalDAV server
- **Permissions Required**: `calendar.events` (read/write)
- **Security**: SEC 8/10 — calendar data is less sensitive than email
- **Alternatives**: Things 3 Skill (#31) can handle basic scheduling, but does not support full calendar protocols

---

## #9 — Obsidian

| Property | Details |
|----------|---------|
| **Rank** | #9 / 50 |
| **Category** | Productivity |
| **Total Score** | 62 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/obsidian-claw` |
| **Target Users** | Obsidian users, knowledge workers |

### Feature Overview

Lets the OpenClaw Agent operate directly on your Obsidian Vault:

- Create, edit, and search notes
- Manage backlinks and tags
- Auto-generate daily notes
- Create new notes from conversation context
- Supports Dataview query syntax

### Why It Matters

Obsidian is the "second brain" for many knowledge workers. With this Skill, the Agent can reference your notes during conversations and automatically save research findings into your Vault, creating a "conversation is note-taking" workflow.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** |

### Installation & Setup

```bash
clawhub install community/obsidian-claw

# Set the Vault path
openclaw skill configure obsidian-claw \
  --vault-path ~/Documents/MyVault
```

### Dependencies & Security

- **Dependencies**: A local Obsidian Vault (the Obsidian app does not need to be running)
- **Permissions Required**: Filesystem read/write for the Vault directory
- **Security**: SEC 8/10 — purely local operation, no data transmitted externally
- **Alternatives**: Notion Skill (#13) for users who prefer cloud-based collaboration

---

## #13 — Notion

| Property | Details |
|----------|---------|
| **Rank** | #13 / 50 |
| **Category** | Productivity |
| **Total Score** | 59 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/notion-claw` |
| **Target Users** | Notion users, teams needing collaboration |

### Feature Overview

Lets the Agent manage your Notion workspace via the Notion API:

- Create and edit pages and databases
- Query databases and filter results
- Manage Kanban board states
- Auto-create meeting notes from conversations
- Export page content as Markdown

### Why It Matters

Notion is the knowledge base and project management hub for many teams. Letting the Agent interact directly with Notion is like embedding AI into your team's core workflow.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** |

### Installation & Setup

```bash
clawhub install community/notion-claw

# Set your Notion Integration Token
openclaw skill configure notion-claw \
  --token ntn_xxxxxxxxxxxxx
```

:::warning Permissions Reminder
When creating a Notion Integration, only grant the Agent access to the specific pages/databases it needs. Avoid authorizing an entire workspace.
:::

### Dependencies & Security

- **Dependencies**: Notion API Key (Integration Token)
- **Permissions Required**: Scoped to the pages configured in the Integration
- **Security**: SEC 8/10 — Notion Integration allows fine-grained permission control
- **Alternatives**: Obsidian (#9) for users who prefer local, offline workflows

---

## #17 — Todoist

| Property | Details |
|----------|---------|
| **Rank** | #17 / 50 |
| **Category** | Productivity |
| **Total Score** | 58 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/todoist-claw` |
| **Target Users** | Todoist users, GTD practitioners |

### Feature Overview

Full Todoist task management integration:

- Create, complete, and schedule tasks
- Manage projects and labels
- Set priorities and due dates
- Natural language input ("Remind me to reply tomorrow at 3 PM")
- Daily task briefings

### Why It Matters

For GTD practitioners, Todoist is the task management backbone. The Agent can automatically create follow-up tasks during conversations, ensuring nothing falls through the cracks.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 7 | 6 | 7 | 8 | 8 | 8 | 6 | **58** |

### Installation & Setup

```bash
clawhub install community/todoist-claw

# Set the API Token
openclaw skill configure todoist-claw \
  --api-token your_todoist_api_token
```

### Dependencies & Security

- **Dependencies**: Todoist API Token
- **Permissions Required**: Full task read/write
- **Security**: SEC 8/10 — task data has relatively low sensitivity
- **Alternatives**: Things 3 (#31, macOS only), Trello (#41)

---

## #19 — Summarize

| Property | Details |
|----------|---------|
| **Rank** | #19 / 50 |
| **Category** | Productivity / Research |
| **Total Score** | 58 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/summarize` |
| **Target Users** | Knowledge workers facing information overload |

### Feature Overview

Converts long-form content into structured summaries:

- Web article summaries
- PDF / document summaries
- Email thread summaries
- Meeting transcript summaries
- Custom summary formats (bullet points, paragraphs, tables)

### Why It Matters

Summarization is one of the most natural capabilities for an AI Agent. This Skill standardizes the "summarize this for me" request into a reusable, callable tool that works especially well when paired with Web Browsing or Gmail Skills.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 8 | 8 | 7 | 7 | 6 | 7 | 9 | 6 | **58** |

### Installation & Setup

```bash
clawhub install community/summarize

# Usage example
openclaw run "Summarize this webpage: https://example.com/article"
```

### Dependencies & Security

- **Dependencies**: None (uses the OpenClaw core LLM)
- **Permissions Required**: No additional permissions
- **Security**: SEC 9/10 — does not access external services; pure text processing
- **Alternatives**: You can ask the Agent to summarize directly in conversation, but this Skill provides standardized formatting and batch processing

---

## #31 — Things 3

| Property | Details |
|----------|---------|
| **Rank** | #31 / 50 |
| **Category** | Productivity |
| **Total Score** | 53 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/things3-claw` |
| **Target Users** | macOS / iOS users, Things 3 enthusiasts |

### Feature Overview

Integrates task management via Things 3 URL Scheme and AppleScript:

- Create new tasks and projects
- Set due dates, tags, and areas
- Query Today and Upcoming lists
- Complete and move tasks
- Supports Heading structure

### Why It Matters

Things 3 is one of the most acclaimed task management apps in the macOS ecosystem. This Skill lets Apple ecosystem users enjoy AI Agent automation without leaving their preferred tool.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 6 | 5 | 7 | 7 | 8 | 8 | 5 | **53** |

### Installation & Setup

```bash
clawhub install community/things3-claw

# Requires Things 3 installed locally
# macOS only
openclaw skill configure things3-claw
```

:::warning Platform Limitation
The Things 3 Skill only supports macOS and requires the Things 3 app (paid software) installed locally. Cross-platform users should consider Todoist (#17) instead.
:::

### Dependencies & Security

- **Dependencies**: Things 3 App (macOS only)
- **Permissions Required**: AppleScript / Automation permissions
- **Security**: SEC 8/10 — local operation, no network transmission involved
- **Alternatives**: Todoist (#17) for cross-platform, Trello (#41) for team collaboration

---

## Recommended Productivity Skill Combinations

### Individual Knowledge Worker

```bash
clawhub install openclaw/gog
clawhub install community/obsidian-claw
clawhub install community/summarize
# Paired with bundled Gmail + Calendar
```

### Team Collaborator

```bash
clawhub install community/notion-claw
clawhub install community/todoist-claw
# Paired with bundled Gmail + Calendar
# Plus the Slack Skill (see Communication section)
```

### Apple Ecosystem User

```bash
clawhub install openclaw/gog
clawhub install community/things3-claw
clawhub install community/obsidian-claw
# Paired with Calendar (CalDAV mode connected to iCloud)
```
