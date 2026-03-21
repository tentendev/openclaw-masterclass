---
title: Skill Audit Checklist
description: Complete security review checklist before installing OpenClaw skills — from source code inspection and permission analysis to VirusTotal scanning.
sidebar_position: 3
---

# Skill Audit Checklist

During the ClawHavoc incident, 2,400+ malicious skills were distributed to thousands of OpenClaw instances via ClawHub. This checklist helps you systematically evaluate the security of any skill before installation.

:::danger Do Not Skip Security Review
Skills on ClawHub are submitted by community developers. Even though ClawHub now integrates VirusTotal scanning, automated scanning cannot detect all malicious behavior. **Manual review is still necessary**.
:::

---

## Quick Risk Assessment

| Question | Yes = Higher Risk | No = Lower Risk |
|----------|-------------------|-----------------|
| Does the skill need network access? | Could exfiltrate data | Offline operation is safer |
| Does the skill need filesystem access? | Could read sensitive files | Cannot access local data |
| Does the skill need shell execution? | Could run arbitrary commands | Restricted to sandbox |
| Is the skill newly published (< 30 days)? | Untested by time | Community has used it |
| Does the skill have < 100 installs? | Not broadly tested | More people have used it |
| Is the developer a new account? | Could be a malicious account | Has history |

**If 3 or more answers are "Yes," perform a full deep review.**

---

## Phase 1: Basic Information Check

```bash
openclaw skill info <skill-name>
openclaw skill virustotal <skill-name>
openclaw skill reviews <skill-name>
```

---

## Phase 2: Source Code Review

```bash
# Download without installing
openclaw skill inspect <skill-name> --download-only

# Search for suspicious patterns
grep -rn "fetch\|axios\|http\.request\|requests\.post" .
grep -rn "process\.env\|os\.environ\|getenv" .
grep -rn "exec\|spawn\|system\|subprocess" .
grep -rn "eval\|Function(\|new Function" .
grep -rn "base64\|Buffer\.from" .
```

### Review manifest.yaml

Every `enabled: true` in permissions needs a reasonable justification. Watch for:
- `"*"` wildcard network domains
- `"~/"` home directory filesystem access
- Shell execution permissions

---

## Phase 3: Behavioral Analysis

```bash
# Test in an isolated environment
openclaw sandbox create test-env
openclaw sandbox exec test-env -- openclaw skill install <skill-name>
openclaw sandbox monitor test-env
```

---

## Phase 4: Post-Installation Monitoring

### Permission Override

```yaml
# ~/.openclaw/skills/<skill-name>/permissions.override.yaml
permissions:
  network:
    enabled: true
    domains:
      - "api.example.com"  # Only allow necessary domains
  filesystem:
    enabled: false
  shell:
    enabled: false
```

### Abnormal Indicators

| Indicator | Possible Cause |
|-----------|----------------|
| Sudden API usage increase | Skill leaked API key to third party |
| Unknown outbound connections | Skill is exfiltrating data |
| Sustained high CPU load | Cryptomining |
| New unknown files | Skill downloaded additional payload |

---

## Printable Checklist

### Before Installation
- [ ] Check skill metadata (developer, version, installs)
- [ ] Check VirusTotal scan results
- [ ] Check community reviews
- [ ] Download source code (don't install)
- [ ] Inspect file structure
- [ ] Search for suspicious code patterns
- [ ] Review manifest.yaml permissions
- [ ] Audit dependencies
- [ ] Confirm every permission has a reasonable purpose

### After Installation
- [ ] Monitor API usage changes
- [ ] Monitor network connections
- [ ] Monitor CPU / memory usage
- [ ] Lock skill version
- [ ] Check changelog before updates

---

## Found a Suspicious Skill?

```bash
openclaw skill report <skill-name> --reason "suspicious network behavior"
```

Also consider sharing your findings on r/openclaw to help other users avoid malicious skills.

---

## Further Reading

- [Security Best Practices](/docs/security/best-practices) — Complete security guide
- [Threat Model](/docs/security/threat-model) — Understanding all attack vectors
- [Top 50 Must-Install Skills](/docs/top-50-skills/overview) — Reviewed and recommended skills
