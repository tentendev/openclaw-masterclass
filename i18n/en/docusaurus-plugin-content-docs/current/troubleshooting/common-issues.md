---
title: Common Issues
description: Diagnostic and resolution guide for common OpenClaw problems — installation, Gateway, messaging platform connections, skills, memory system, and more.
sidebar_position: 1
---

# Common Issues

This page collects the most frequently encountered OpenClaw problems and their solutions, organized by category for quick reference.

:::tip Run a Health Check First
Most issues can be quickly identified with `openclaw doctor`:
```bash
openclaw doctor
```
This command checks Node.js version, container engine, Gateway status, memory system, and all core components.
:::

---

## Installation Issues

### Problem: `npm install -g @openclaw/cli` permission denied

```bash
# Solution (recommended): Use nvm to manage Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 24
npm install -g @openclaw/cli
```

:::danger Do not use sudo
```bash
# Do NOT do this
sudo npm install -g @openclaw/cli
```
Using sudo for npm packages causes permission issues and security concerns.
:::

### Problem: Node.js version mismatch

```bash
nvm install 24
nvm use 24
nvm alias default 24
node --version  # Should show v24.x.x
```

---

## Gateway Issues

### Problem: Gateway startup failed — port in use

```bash
# Diagnose: find what is using port 18789
lsof -i :18789      # macOS
ss -tlnp | grep 18789  # Linux

# Solution: Kill the process or use a different port
kill $(lsof -t -i :18789)
```

### Problem: Gateway connection refused

```bash
# 1. Check if OpenClaw is running
openclaw status

# 2. Check Gateway bind address
grep -A 3 "gateway:" ~/.openclaw/gateway.yaml

# 3. Check if port is listening
lsof -i :18789

# 4. Check Gateway logs
tail -50 ~/.openclaw/logs/gateway.log
```

### Problem: Gateway authentication failed (401)

```bash
# 1. Verify token configuration
grep -A 3 "auth:" ~/.openclaw/gateway.yaml

# 2. If token is lost, regenerate
openssl rand -hex 32
# Update token in gateway.yaml and restart
openclaw restart
```

---

## Messaging Platform Issues

### Problem: Telegram Bot not responding

```bash
# 1. Verify Bot Token
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# 2. Check for webhook conflict
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo

# 3. Check logs
grep "telegram" ~/.openclaw/logs/gateway.log | tail -20
```

### Problem: WhatsApp connection drops

```bash
# Reconnect
openclaw channel reconnect whatsapp

# If frequent, clear session and re-login
rm -rf ~/.openclaw/channels/whatsapp/session/
openclaw channel setup whatsapp
```

---

## LLM Provider Issues

### Problem: API Key invalid or credits exhausted

```bash
# 1. Verify environment variables
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY

# 2. Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 3. Check credits at provider dashboard
```

### Problem: LLM response too slow

| Cause | Solution |
|-------|---------|
| Model too large | Switch to a smaller model (e.g., Claude Sonnet) |
| Context too long | Clean memory, reduce context |
| API latency high | Use local model (Ollama) |
| Network issues | Check connectivity and DNS |

---

## Skill Issues

### Problem: Skill installation failed

```bash
# 1. Verify container engine is running
podman info  # or docker info

# 2. macOS Podman: ensure machine is started
podman machine start

# 3. Clear cache and reinstall
openclaw skill cache clear
openclaw skill install <skill-name> --verbose
```

### Problem: Skill execution timeout

```yaml
# Increase timeout
# ~/.openclaw/gateway.yaml
execution:
  timeout_ms: 60000  # Increase to 60 seconds
```

---

## Memory System Issues

### Problem: Memory using too much disk space

```bash
# Diagnose
du -sh ~/.openclaw/memory/
du -sh ~/.openclaw/memory/wal/

# Clean old WAL
openclaw memory prune --before "2025-06-01" --type wal

# Force compaction
openclaw memory compact --force
```

### Problem: Agent forgets previous conversations

```yaml
# Increase context settings
# ~/.openclaw/gateway.yaml
memory:
  context:
    recent_turns: 20      # Default 10
    long_term_ratio: 0.3  # Default 0.2
```

---

## Container Engine Issues

### Problem: Podman machine won't start (macOS)

```bash
podman machine rm -f
podman machine init --cpus 2 --memory 4096
podman machine start
```

:::tip Consider Podman
If you frequently encounter Docker daemon issues, consider switching to Podman. Podman requires no daemon and offers better security.
:::

---

## Logging & Diagnostics

```bash
# Real-time logs
openclaw logs --follow

# Component-specific logs
openclaw logs --component gateway
openclaw logs --component reasoning
openclaw logs --component memory

# Errors only
openclaw logs --level error

# Debug mode
openclaw start --debug
```

### Reporting Issues

If none of the above solves your problem:

1. **Search GitHub Issues** — [github.com/openclaw/openclaw/issues](https://github.com/openclaw/openclaw/issues)
2. **Search Reddit** — `site:reddit.com/r/openclaw <your keywords>`
3. **Submit a new Issue** — Attach `openclaw doctor` output and relevant logs
4. **Join Discord** — Ask in the #help channel

---

## Further Reading

- [Installation Guide](/docs/getting-started/installation) — Complete installation steps
- [Architecture Overview](/docs/architecture/overview) — Understanding architecture helps troubleshooting
- [Security Best Practices](/docs/security/best-practices) — Security-related issue prevention
