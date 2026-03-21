---
title: "Module 3: Skills System & SKILL.md Specification"
sidebar_position: 4
description: "Master the OpenClaw Skills system, SKILL.md specification, Skill lifecycle, and build your first Skill from scratch"
keywords: [OpenClaw, Skills, SKILL.md, ClawHub, Skill development, sandbox]
---

# Module 3: Skills System & SKILL.md Specification

## Learning Objectives

By the end of this module, you will be able to:

- Explain the architecture and execution model of the OpenClaw Skills system
- Write a complete SKILL.md definition file
- Understand the full Skill lifecycle (Install → Load → Execute → Uninstall)
- Build a working Skill from scratch
- Test and debug Skills inside sandbox containers

:::info Prerequisites
Please complete [Module 1: Foundations](./module-01-foundations) and [Module 2: Gateway Deep Dive](./module-02-gateway) first.
:::

---

## Skills System Architecture

Skills are OpenClaw's "capabilities." Each Skill encapsulates a specific function (e.g., searching the web, manipulating files, querying APIs) and executes safely inside a **sandboxed container**.

```
Reasoning Layer
      │
      │ "I need to look up weather info"
      ▼
┌─────────────────────────────────┐
│         Skills Manager          │
│  ┌───────────────────────────┐  │
│  │    Skill Registry         │  │
│  │  ┌───────┐ ┌───────┐     │  │
│  │  │weather│ │ file  │ ... │  │
│  │  └───┬───┘ └───────┘     │  │
│  └──────┼────────────────────┘  │
│         │                       │
│  ┌──────▼────────────────────┐  │
│  │    SKILL.md Parser        │  │
│  │  Parse capabilities,      │  │
│  │  parameters, permissions  │  │
│  └──────┬────────────────────┘  │
│         │                       │
│  ┌──────▼────────────────────┐  │
│  │    Sandbox Executor       │  │
│  │  ┌──────────────────┐    │  │
│  │  │  Podman Container │    │  │
│  │  │  ┌──────────────┐│    │  │
│  │  │  │ Skill Runner ││    │  │
│  │  │  └──────────────┘│    │  │
│  │  └──────────────────┘    │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Execution Model

1. **Reasoning Layer decides**: The LLM selects the appropriate Skill from those loaded, based on user intent
2. **Parameter assembly**: Parameters are assembled according to the `parameters` defined in SKILL.md
3. **Sandbox launch**: The Skill Runner starts in an isolated container
4. **Execute and return**: After execution, results are streamed back to the client via the Gateway
5. **Resource cleanup**: The container is automatically destroyed after the timeout

---

## SKILL.md Specification

SKILL.md is the definition file for every Skill, using a Markdown + YAML Frontmatter format. It tells OpenClaw what the Skill can do, what parameters it needs, and what constraints it has.

### Full Specification

```markdown
---
name: "weather-lookup"
version: "1.2.0"
author: "openclaw-official"
description: "Look up real-time weather information for cities worldwide"
license: "MIT"
runtime: "node:20-slim"
timeout: 15
permissions:
  - network:api.openweathermap.org
  - network:api.weatherapi.com
tags:
  - weather
  - utility
  - api
triggers:
  - "weather"
  - "temperature"
  - "rain"
  - "forecast"
---

# Weather Lookup Skill

## Capability Description

This Skill looks up real-time weather information for any city worldwide,
including temperature, humidity, wind speed, precipitation probability, and more.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | string | Yes | City name |
| unit | string | No | Temperature unit (celsius/fahrenheit), default celsius |
| lang | string | No | Response language, default en |

## Response Format

Returns a JSON object with the following fields:

```json
{
  "city": "Taipei",
  "temperature": 28,
  "unit": "celsius",
  "humidity": 75,
  "wind_speed": 12,
  "description": "Partly cloudy",
  "forecast": [...]
}
```

## Examples

User: "What's the weather like in Taipei today?"
→ Calls weather-lookup, city="Taipei"

## Limitations

- Requires an OpenWeatherMap API Key (set via the `WEATHER_API_KEY` environment variable)
- Rate Limit: 60 queries per minute maximum
- Historical weather queries are not supported
```

### Frontmatter Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Unique Skill identifier (kebab-case) |
| `version` | string | Yes | Semantic version number |
| `author` | string | Yes | Author name (matches ClawHub account) |
| `description` | string | Yes | One-line description (120 characters max) |
| `license` | string | Yes | License type (MIT, Apache-2.0, etc.) |
| `runtime` | string | Yes | Container base image |
| `timeout` | number | No | Maximum execution time (seconds), default 30 |
| `permissions` | array | No | List of required permissions |
| `tags` | array | No | Tags for search and categorization |
| `triggers` | array | No | Trigger keywords to help the LLM select this Skill |

### Permission Model

OpenClaw uses the principle of least privilege. Every Skill must explicitly declare the permissions it requires:

```yaml
permissions:
  - network:api.example.com      # Allow access to a specific domain
  - network:*.github.com         # Allow access to GitHub subdomains
  - filesystem:read:/tmp         # Allow reading /tmp
  - filesystem:write:/tmp/output # Allow writing to a specific directory
  - env:API_KEY                  # Allow reading an environment variable
  - env:DATABASE_URL
```

:::danger Security Note
A Skill can only access resources explicitly listed in its `permissions`. Any unauthorized access attempt will be blocked by the sandbox and logged to the security log. This is a security mechanism strengthened after the ClawHavoc incident.
:::

---

## Skill Lifecycle

```
  Install                   Load
  ┌──────────┐         ┌──────────┐
  │ clawhub  │         │  Parse   │
  │ install  │────────▶│ SKILL.md │
  │ download │         │ Register │
  │ & verify │         │ caps     │
  └──────────┘         └────┬─────┘
                            │
                            ▼
                     ┌──────────┐
                     │  Ready   │◀─────────┐
                     │          │          │
                     └────┬─────┘          │
                          │ Trigger        │ Complete/Timeout
                          ▼                │
                     ┌──────────┐          │
                     │ Execute  │──────────┘
                     │          │
                     └──────────┘

  Update                    Uninstall
  ┌──────────┐         ┌──────────┐
  │ clawhub  │         │ clawhub  │
  │ update   │         │ remove   │
  └──────────┘         └──────────┘
```

### Stage Details

**Install**
```bash
# Install from ClawHub
clawhub install openclaw-official/weather-lookup

# Install a specific version
clawhub install openclaw-official/weather-lookup@1.2.0

# Actions triggered during installation:
# 1. Download from ClawHub Registry
# 2. Verify signature (SHA-256)
# 3. VirusTotal scan (new mechanism after ClawHavoc)
# 4. Extract to ~/.openclaw/skills/community/
# 5. Pull the container image
```

**Load**
```bash
# OpenClaw automatically loads all installed Skills on startup
# You can also manually reload
openclaw skills reload

# Load process:
# 1. Parse SKILL.md frontmatter
# 2. Validate permission declarations
# 3. Register with the Skill Registry
# 4. Add triggers to the Reasoning Layer's Skill selector
```

**Execute**
```bash
# When a Skill is triggered:
# 1. Skills Manager creates a sandbox container
# 2. Mounts Skill code (read-only)
# 3. Injects authorized environment variables
# 4. Runs the Skill Runner
# 5. Collects stdout/stderr
# 6. Destroys the container

# Manually test a Skill
openclaw skill run weather-lookup --params '{"city": "Taipei"}'
```

---

## Hands-On: Build Your First Skill

Let's build a **Pomodoro Timer Skill** from scratch -- a simple Pomodoro technique timer.

### Step 1: Create the Skill Directory Structure

```bash
mkdir -p ~/.openclaw/skills/local/pomodoro-timer
cd ~/.openclaw/skills/local/pomodoro-timer
```

### Step 2: Write the SKILL.md

```bash
cat > SKILL.md << 'SKILLEOF'
---
name: "pomodoro-timer"
version: "0.1.0"
author: "your-username"
description: "Pomodoro timer with customizable work and break durations"
license: "MIT"
runtime: "node:20-slim"
timeout: 30
permissions: []
tags:
  - productivity
  - timer
  - pomodoro
triggers:
  - "pomodoro"
  - "timer"
  - "focus"
---

# Pomodoro Timer Skill

## Capability Description

Manage Pomodoro timing sessions with start, pause, and status check support.
Default work duration is 25 minutes, break duration is 5 minutes.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| action | string | Yes | Action: start / pause / status / reset |
| work_minutes | number | No | Work duration (minutes), default 25 |
| break_minutes | number | No | Break duration (minutes), default 5 |
| label | string | No | Label for the current task |

## Response Format

```json
{
  "status": "running",
  "remaining_minutes": 18,
  "label": "Write documentation",
  "sessions_completed": 3
}
```

## Examples

User: "Start a 30-minute pomodoro for coding"
→ Calls pomodoro-timer, action="start", work_minutes=30, label="coding"
SKILLEOF
```

### Step 3: Write the Skill Code

```bash
cat > index.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// State file path (temp space inside the container)
const STATE_FILE = '/tmp/pomodoro-state.json';

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {
      status: 'idle',
      sessions_completed: 0,
      start_time: null,
      work_minutes: 25,
      break_minutes: 5,
      label: null
    };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function handleAction(params) {
  const state = loadState();
  const { action, work_minutes, break_minutes, label } = params;

  switch (action) {
    case 'start':
      state.status = 'running';
      state.start_time = Date.now();
      state.work_minutes = work_minutes || 25;
      state.break_minutes = break_minutes || 5;
      state.label = label || null;
      saveState(state);
      return {
        status: 'running',
        remaining_minutes: state.work_minutes,
        label: state.label,
        sessions_completed: state.sessions_completed,
        message: `Pomodoro started! You'll be reminded to take a break in ${state.work_minutes} minutes.`
      };

    case 'pause':
      if (state.status !== 'running') {
        return { error: 'No active Pomodoro session.' };
      }
      state.status = 'paused';
      const elapsed = Math.floor((Date.now() - state.start_time) / 60000);
      state.remaining = state.work_minutes - elapsed;
      saveState(state);
      return {
        status: 'paused',
        remaining_minutes: state.remaining,
        label: state.label,
        sessions_completed: state.sessions_completed,
        message: `Pomodoro paused. ${state.remaining} minutes remaining.`
      };

    case 'status':
      if (state.status === 'idle') {
        return {
          status: 'idle',
          sessions_completed: state.sessions_completed,
          message: 'No active Pomodoro session.'
        };
      }
      const mins = state.status === 'running'
        ? state.work_minutes - Math.floor((Date.now() - state.start_time) / 60000)
        : state.remaining;
      return {
        status: state.status,
        remaining_minutes: Math.max(0, mins),
        label: state.label,
        sessions_completed: state.sessions_completed
      };

    case 'reset':
      const completed = state.status === 'running' ? state.sessions_completed + 1 : state.sessions_completed;
      saveState({
        status: 'idle',
        sessions_completed: completed,
        start_time: null,
        work_minutes: 25,
        break_minutes: 5,
        label: null
      });
      return {
        status: 'idle',
        sessions_completed: completed,
        message: `Pomodoro reset. ${completed} sessions completed today.`
      };

    default:
      return { error: `Unknown action: ${action}. Supported actions: start, pause, status, reset` };
  }
}

// Read parameters from stdin (OpenClaw Skill Runner protocol)
let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const params = JSON.parse(input);
    const result = handleAction(params);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    process.stdout.write(JSON.stringify({ error: err.message }));
  }
});
EOF
```

### Step 4: Test the Skill

```bash
# Use OpenClaw's built-in Skill testing tool
openclaw skill test ./

# Test a specific action
echo '{"action":"start","work_minutes":25,"label":"coding"}' | \
  openclaw skill run pomodoro-timer --local

# Check status
echo '{"action":"status"}' | \
  openclaw skill run pomodoro-timer --local

# Validate SKILL.md syntax
openclaw skill validate ./SKILL.md
```

Expected output:

```json
{
  "status": "running",
  "remaining_minutes": 25,
  "label": "coding",
  "sessions_completed": 0,
  "message": "Pomodoro started! You'll be reminded to take a break in 25 minutes."
}
```

### Step 5: Validate in the Sandbox

```bash
# Test in a full sandbox container (simulating the real execution environment)
openclaw skill sandbox-test pomodoro-timer --params '{"action":"start","label":"test"}'

# Check that permissions are correct (this Skill requires no permissions)
openclaw skill check-permissions pomodoro-timer
```

---

## Skill Development Best Practices

### 1. Input Validation

```javascript
// Always validate input parameters
function validateParams(params) {
  if (!params.action) {
    throw new Error('Missing required parameter: action');
  }
  const validActions = ['start', 'pause', 'status', 'reset'];
  if (!validActions.includes(params.action)) {
    throw new Error(`Invalid action: ${params.action}`);
  }
  if (params.work_minutes && (params.work_minutes < 1 || params.work_minutes > 120)) {
    throw new Error('work_minutes must be between 1 and 120');
  }
}
```

### 2. Least Privilege

```yaml
# Only request permissions you actually need
permissions:
  - network:api.specific-service.com  # Specific domain, not wildcard
  - filesystem:read:/tmp/myskill      # Specific path, not root
```

### 3. Graceful Error Handling

```javascript
// Return structured error messages
function handleError(error) {
  return {
    error: true,
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message,
    suggestion: 'Please check your parameters and try again, or contact the Skill author.'
  };
}
```

### 4. Performance Considerations

```javascript
// Set a reasonable timeout
// For long-running operations, stream progress updates
function longRunningTask(params) {
  // Report progress every 5 seconds
  const interval = setInterval(() => {
    process.stderr.write(JSON.stringify({
      progress: currentProgress,
      message: `Processing... ${currentProgress}%`
    }) + '\n');
  }, 5000);
}
```

---

## Common Errors & Troubleshooting

### Error 1: SKILL.md Parsing Failure

```
Error: Invalid SKILL.md: missing required field 'runtime'
```

**Fix**: Ensure the frontmatter includes all required fields (`name`, `version`, `author`, `description`, `license`, `runtime`).

### Error 2: Sandbox Permission Denied

```
Error: Permission denied: network access to api.example.com not declared
```

**Fix**: Add `network:api.example.com` to the `permissions` in SKILL.md.

### Error 3: Container Image Pull Failure

```
Error: Failed to pull image node:20-slim
```

**Fix**:
```bash
# Manually pull the image
podman pull node:20-slim

# Or use the OpenClaw cache
openclaw skill pull-runtime node:20-slim
```

### Error 4: Skill Execution Timeout

```
Error: Skill execution timed out after 30 seconds
```

**Fix**: Increase the `timeout` value in SKILL.md, or optimize the Skill code. Note that the system maximum timeout is 300 seconds.

---

## Exercises

1. **Extend the Pomodoro Skill**: Add a "stats" feature (`action: "stats"`) to the Pomodoro Timer that reports the number of completed sessions today and this week, along with total focus time.

2. **Build a URL Shortener Skill**: Create a Skill that accepts a long URL and returns a shortened link. Use TinyURL or a similar API. Don't forget to declare `network` permissions.

3. **Multilingual Skill**: Modify your Skill to support a `lang` parameter so that response messages automatically switch based on the user's language preference (en, zh-TW, ja).

4. **Permission Audit**: Inspect the permission declarations of all your installed Skills, identify the Skill with the broadest permissions, and consider whether there is room to tighten them.

---

## Quiz

1. **What format does SKILL.md use?**
   - A) Pure JSON
   - B) YAML
   - C) Markdown + YAML Frontmatter
   - D) TOML

2. **In what environment do OpenClaw Skills execute?**
   - A) The host system's shell
   - B) Sandboxed containers (Podman/Docker)
   - C) Virtual machines
   - D) WebAssembly

3. **Which of the following is NOT a required SKILL.md field?**
   - A) `name`
   - B) `runtime`
   - C) `triggers`
   - D) `version`

4. **What is the default maximum execution time for a Skill?**
   - A) 10 seconds
   - B) 30 seconds
   - C) 60 seconds
   - D) 120 seconds

5. **What security measure was added to Skill installation after the ClawHavoc incident?**
   - A) Two-factor authentication
   - B) VirusTotal scanning
   - C) Manual review
   - D) Blockchain verification

<details>
<summary>View Answers</summary>

1. **C** -- SKILL.md uses Markdown format with YAML Frontmatter, making it human-readable while also machine-parsable.
2. **B** -- Each Skill executes in an isolated sandboxed container (Podman recommended), ensuring system security.
3. **C** -- `triggers` is an optional field. Required fields include `name`, `version`, `author`, `description`, `license`, and `runtime`.
4. **B** -- The default timeout is 30 seconds, customizable in SKILL.md with a system maximum of 300 seconds.
5. **B** -- The ClawHavoc incident exposed 2,400 malicious Skills. Afterward, OpenClaw added mandatory VirusTotal scanning during Skill installation.

</details>

---

## Next Steps

You now know how to develop OpenClaw Skills. Next, let's learn how to share your Skills with the community through the ClawHub marketplace.

**[Go to Module 4: ClawHub Marketplace →](./module-04-clawhub)**
