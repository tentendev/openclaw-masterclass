---
title: Security Best Practices
description: The complete OpenClaw security guide — covering Gateway configuration, skill auditing, container isolation, API key management, and comprehensive defense strategies.
sidebar_position: 1
---

# Security Best Practices

OpenClaw is a powerful AI Agent platform, but powerful capabilities also mean significant security risks. This guide provides a comprehensive security defense strategy, from basic configuration to advanced hardening.

:::danger Security Is Not Optional
As of March 2026, over **30,000 OpenClaw instances** have been compromised due to improper security settings. A Bitdefender audit found **135,000 exposed instances**. The **ClawHavoc incident** saw 2,400+ malicious skills planted in ClawHub. These are real security events that have already happened.
:::

---

## Security Incident Review

Before diving into best practices, let's review the incidents that have already occurred to understand why every recommendation here matters:

| Incident | Timeframe | Impact | Status |
|----------|-----------|--------|--------|
| **CVE-2026-25253** | Early 2026 | Gateway remote code execution (RCE), affects versions prior to v3.x | Patched |
| **ClawHavoc** | Late 2025 | 2,400+ malicious skills planted in ClawHub, stealing API keys and personal data | Cleaned up |
| **Mass Port 18789 Compromise** | Ongoing | 30,000+ instances hacked through exposed Gateway ports | Still occurring |
| **Bitdefender Audit** | Early 2026 | Found 135,000 publicly accessible OpenClaw instances | Report published |

---

## First Line of Defense: Gateway Security

The Gateway (port 18789) is OpenClaw's largest attack surface. This is the first thing you must secure.

### 1. Bind to Localhost

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"  # Accept local connections only
```

:::danger Fatal Mistake
Never set `bind: "0.0.0.0"`. This exposes your Gateway to the entire network, allowing anyone to send commands to your agent. CVE-2026-25253 exploits exactly this misconfiguration to achieve remote code execution.
:::

### 2. Enable Gateway Authentication

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"
  auth:
    enabled: true
    token: "your-secure-random-token-here"
    # Generate with: openssl rand -hex 32
```

Generate a secure token:

```bash
# Generate a 64-character random token
openssl rand -hex 32

# Or use Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Firewall Rules

Even when bound to localhost, defense in depth is never wasted:

```bash
# Linux (ufw)
sudo ufw deny 18789/tcp
sudo ufw reload

# Linux (iptables)
sudo iptables -A INPUT -p tcp --dport 18789 -s 127.0.0.1 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP

# macOS (pf)
echo "block in proto tcp from any to any port 18789" | sudo pfctl -ef -
```

### 4. Secure Remote Access

If you need to access OpenClaw from another device, **always use an encrypted channel**:

```bash
# Method 1: SSH Tunnel (recommended)
ssh -L 18789:127.0.0.1:18789 user@your-server

# Method 2: WireGuard VPN
# On the server, only allow VPN subnet to reach 18789
# /etc/wireguard/wg0.conf
[Interface]
Address = 10.0.0.1/24
PostUp = iptables -A INPUT -p tcp -s 10.0.0.0/24 --dport 18789 -j ACCEPT

# Method 3: Reverse Proxy + TLS (advanced)
# Use Caddy or nginx with mTLS mutual authentication
```

:::warning Do Not Use These Methods
- **ngrok / Cloudflare Tunnel**: Directly exposes the Gateway unless you add an extra auth layer
- **Port forwarding**: Router port forwarding is equivalent to public exposure
- **HTTP (without TLS)**: Man-in-the-middle attacks can intercept your token and messages
:::

---

## Second Line of Defense: Container and Sandbox Security

### Use Podman Rootless (Strongly Recommended)

```bash
# Verify Podman runs in rootless mode
podman info | grep rootless
# rootless: true

# Configure OpenClaw to use Podman
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
```

### Docker vs. Podman Security Comparison

| Aspect | Docker (default) | Podman Rootless |
|--------|-----------------|-----------------|
| Daemon Privileges | root | User-level |
| Sandbox Escape Risk | Can gain root | User privileges only |
| Attack Surface | Docker daemon socket | No daemon |
| Network Isolation | Requires extra config | Stricter by default |
| Recommendation | Usable but not advised | **Strongly recommended** |

### Container Security Configuration

```yaml
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
  sandbox:
    # Memory limit
    memory_limit: "512m"
    # CPU limit
    cpu_limit: "1.0"
    # Network access
    network: "restricted"  # none / restricted / full
    # Filesystem access
    filesystem:
      read_only: true
      allowed_paths:
        - "/tmp/openclaw-work"
    # Drop unnecessary Linux capabilities
    drop_capabilities:
      - "ALL"
    add_capabilities:
      - "NET_RAW"  # Only when network access is needed
```

### Sandbox Escape Prevention

:::danger Advanced Threat
Malicious skills may attempt to escape the sandbox. The following measures significantly reduce the risk:
:::

```bash
# 1. Enable seccomp profile
# ~/.openclaw/seccomp-profile.json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "syscalls": [
    {
      "names": ["read", "write", "open", "close", "stat", "fstat"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}

# 2. Enable SELinux or AppArmor
# Ubuntu: Confirm AppArmor is active
sudo aa-status

# 3. Restrict /proc and /sys access
# Podman restricts these by default; Docker requires additional configuration
```

---

## Third Line of Defense: Skill Security

The ClawHavoc incident proved that skills are OpenClaw's largest supply-chain attack vector.

### Pre-Installation Review Process

```bash
# Step 1: View skill details
openclaw skill info skill-name

# Step 2: Inspect skill source code
openclaw skill inspect skill-name

# Step 3: Check VirusTotal scan results (added post-ClawHavoc)
openclaw skill virustotal skill-name

# Step 4: Check community reviews and install count
openclaw skill reviews skill-name
```

### Skill Risk Classification

| Risk Level | Description | Examples |
|------------|-------------|----------|
| **Low** | Read-only operations, no network or filesystem access | Text processing, calculations, format conversion |
| **Medium** | Network access but no filesystem access | Web search, API queries, weather |
| **High** | Filesystem or system command access | File management, shell execution, system monitoring |
| **Critical** | Both network and filesystem access | browser-use, automation scripts |

### Skill Permission Minimization

```yaml
# ~/.openclaw/skills/skill-name/permissions.yaml
permissions:
  network:
    enabled: true
    allowed_domains:
      - "api.example.com"
      - "*.googleapis.com"
    denied_domains:
      - "*"  # Deny all by default
  filesystem:
    enabled: false
  shell:
    enabled: false
  environment_variables:
    allowed:
      - "HOME"
      - "PATH"
    denied:
      - "OPENAI_API_KEY"  # Prevent skills from reading API keys
      - "ANTHROPIC_API_KEY"
```

:::tip Skill Audit Checklist
For the complete pre-installation review process, see the [Skill Audit Checklist](/docs/security/skill-audit-checklist).
:::

---

## Fourth Line of Defense: API Key and Secrets Management

### What NOT to Do

```yaml
# ❌ Do not hardcode API keys in gateway.yaml
providers:
  openai:
    api_key: "sk-aBcDeFgHiJkLmNoPqRsTuVwXyZ"

# ❌ Do not include API keys in SOUL.md
# ❌ Do not share full configs on Reddit / Discord
# ❌ Do not add ~/.openclaw/ to a public Git repo
```

### The Right Way

```bash
# Method 1: Environment variables (basic)
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."

# Method 2: dotenv file (recommended)
# ~/.openclaw/.env (make sure this file is not tracked by Git)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Method 3: Password manager (best)
# Using 1Password CLI
eval $(op signin)
export OPENAI_API_KEY=$(op item get "OpenAI" --fields api_key)

# Method 4: System keychain (macOS)
security add-generic-password -s "openclaw-openai" -a "api_key" -w "sk-..."
```

```yaml
# ~/.openclaw/gateway.yaml — reference environment variables
providers:
  openai:
    api_key: "${OPENAI_API_KEY}"
  anthropic:
    api_key: "${ANTHROPIC_API_KEY}"
```

### API Key Rotation Schedule

| Frequency | Scenario |
|-----------|----------|
| Every 90 days | General usage |
| Immediately | Suspected compromise |
| Every 30 days | High-security environments |
| After installing a new skill | If the skill has network and environment variable access |

---

## Fifth Line of Defense: Memory System Security

The memory system contains all your conversation history and personal data.

### Memory File Encryption

```bash
# Method 1: Disk-level encryption
# macOS: FileVault (System Settings → Privacy & Security → FileVault)
# Linux: LUKS
sudo cryptsetup luksFormat /dev/sdX
sudo cryptsetup luksOpen /dev/sdX openclaw-memory

# Method 2: Directory-level encryption (Linux)
# Using gocryptfs
gocryptfs -init ~/.openclaw/memory-encrypted
gocryptfs ~/.openclaw/memory-encrypted ~/.openclaw/memory
```

### Memory Cleanup Policies

```bash
# Check memory usage
openclaw memory stats

# Prune memory older than a specific date
openclaw memory prune --before "2025-01-01"

# Delete memory for a specific conversation
openclaw memory delete --conversation-id "abc123"

# Full memory reset (irreversible)
openclaw memory reset --confirm
```

:::warning Sensitive Information in Memory
Your agent may collect sensitive information during conversations — bank account numbers, addresses, passwords — and store it in the memory system. Periodically review memory contents to ensure nothing sensitive is being retained unnecessarily.
:::

---

## Sixth Line of Defense: Messaging Platform Security

### Platform Token Management

| Platform | Token Type | Rotation Recommendation |
|----------|-----------|------------------------|
| Telegram | Bot Token | Every 180 days, or immediately if compromised |
| Discord | Bot Token | Every 90 days |
| Slack | OAuth Token | Every 90 days |
| WhatsApp | Session Token | Automatically managed |
| LINE | Channel Access Token | Every 30 days (LINE recommendation) |

### Restrict Platform Permissions

```yaml
# ~/.openclaw/channels/telegram.yaml
telegram:
  bot_token: "${TELEGRAM_BOT_TOKEN}"
  security:
    # Only allow specific users
    allowed_users:
      - 123456789  # Your Telegram user ID
    # Or only allow specific groups
    allowed_groups:
      - -100123456789
    # Block unknown users
    block_unknown: true
    # Disable dangerous commands
    disabled_commands:
      - "/exec"
      - "/shell"
```

---

## Seventh Line of Defense: Network Security

### DNS Protection

```bash
# Use Pi-hole or AdGuard Home to block malicious domains
# Add an OpenClaw-specific blocklist

# Or configure directly on the host
# /etc/hosts
127.0.0.1 known-malicious-c2-server.com
```

### Network Monitoring

```bash
# Monitor OpenClaw network activity
# Linux
ss -tnp | grep openclaw

# macOS
lsof -i -P | grep openclaw

# Use tcpdump to monitor for anomalous connections
sudo tcpdump -i any port 18789 -w openclaw-traffic.pcap
```

---

## Security Configuration Checklist

Use this checklist to ensure your OpenClaw installation is secure:

### Must Complete (Critical)

- [ ] Gateway bound to `127.0.0.1` (not `0.0.0.0`)
- [ ] Gateway authentication enabled
- [ ] Using Podman rootless (not Docker)
- [ ] API keys stored in environment variables (not hardcoded)
- [ ] Updated to the latest version (patching CVE-2026-25253)
- [ ] Messaging platform allowlists configured

### Strongly Recommended (High)

- [ ] Firewall blocking external access to port 18789
- [ ] Disk encryption enabled
- [ ] Skills reviewed before installation
- [ ] Remote access via SSH tunnel or VPN
- [ ] API keys rotated on a regular schedule

### Recommended (Medium)

- [ ] seccomp profile enabled
- [ ] Memory cleanup policy configured
- [ ] Network activity monitoring in place
- [ ] Memory system encrypted
- [ ] Installed skills regularly audited for updates

### Optional (Low)

- [ ] Pi-hole / AdGuard DNS protection configured
- [ ] OpenClaw running under a dedicated user account
- [ ] Centralized log management
- [ ] Automated security scanning configured

---

## Incident Response Procedure

If you suspect your OpenClaw instance has been compromised:

### Immediate Actions

```bash
# 1. Stop OpenClaw
openclaw stop --force

# 2. Preserve evidence (backup before cleanup)
cp -r ~/.openclaw/ ~/openclaw-incident-backup-$(date +%Y%m%d)

# 3. Check for suspicious activity
# Look for anomalies in the logs
grep -i "error\|unauthorized\|unknown\|suspicious" ~/.openclaw/logs/*.log

# 4. Check installed skills
ls -la ~/.openclaw/skills/

# 5. Check network connections
netstat -an | grep 18789
```

### Recovery Steps

```bash
# 1. Rotate ALL API keys immediately
# - All LLM providers (OpenAI, Anthropic, Google, etc.)
# - All messaging platform tokens (Telegram, Discord, etc.)

# 2. Clean reinstall OpenClaw
npm uninstall -g @openclaw/cli
rm -rf ~/.openclaw/
npm install -g @openclaw/cli
openclaw init

# 3. Only reinstall verified skills

# 4. Restore memory data (only if confirmed untampered)

# 5. Harden security settings (follow all recommendations in this guide)
```

---

## Ongoing Security Maintenance

Security is not a one-time setup — it is a continuous process.

### Daily

- Check OpenClaw logs for anomalies
- Confirm the Gateway is only accepting expected connections

### Weekly

- Check for OpenClaw security updates
- Review skill update changelogs

### Monthly

- Rotate API keys
- Audit memory system for sensitive data
- Verify firewall rules are still in effect

### Quarterly

- Re-evaluate whether all installed skills are still needed
- Update container images
- Test backup and recovery procedures

---

## Further Reading

- [Threat Model Analysis](/docs/security/threat-model) — All attack vectors and surfaces
- [Skill Audit Checklist](/docs/security/skill-audit-checklist) — Complete pre-installation review steps
- [Troubleshooting](/docs/troubleshooting/common-issues) — Security-related common issues
