---
sidebar_position: 8
title: "Smart Home Skills"
description: "Complete review of OpenClaw smart home Skills: Home Assistant, Philips Hue, Elgato, BambuLab 3D Printer"
keywords: [OpenClaw, Skills, Smart Home, Home Assistant, Philips Hue, Elgato, BambuLab]
---

# Smart Home Skills

Smart Home Skills let the OpenClaw Agent step beyond the screen and control your physical devices. From lighting and ambiance to 3D printing, the Agent can become your smart home butler.

---

## #10 — Home Assistant

| Property | Details |
|----------|---------|
| **Rank** | #10 / 50 |
| **Category** | Smart Home |
| **Total Score** | 61 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Official |
| **Installation** | `clawhub install openclaw/homeassistant` |
| **Target Users** | Home Assistant users, smart home enthusiasts |

### Feature Overview

Home Assistant is the most popular open-source smart home platform. This Skill provides full integration:

- **Device control**: Toggle lights, adjust temperature, lock doors, etc.
- **Scene management**: Activate preset scenes (e.g., "Away mode," "Movie night")
- **Automation rules**: Create and manage Home Assistant Automations
- **Sensor readings**: Temperature, humidity, motion detection, and other sensor data
- **Energy monitoring**: View power consumption and energy statistics
- **Voice command bridge**: Issue natural language commands through OpenClaw

### Why It Matters

Home Assistant integrates 2000+ device brands. Through this single Skill, the OpenClaw Agent can control virtually all mainstream smart home devices. Compared to brand-specific Skills (Philips Hue, Elgato), Home Assistant provides a unified control interface.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 7 | 8 | 7 | 9 | 8 | 8 | 7 | 7 | **61** |

### Installation & Setup

```bash
clawhub install openclaw/homeassistant

# Configure Home Assistant connection
openclaw skill configure homeassistant \
  --url http://homeassistant.local:8123 \
  --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# List available devices
openclaw run homeassistant --list-entities

# Usage examples
openclaw run "Set the living room lights to warm color at 50% brightness"
openclaw run "Activate Away mode"
```

### Dependencies & Security

- **Dependencies**: Home Assistant instance (configured and running)
- **Permissions Required**: Home Assistant Long-Lived Access Token
- **Security**: SEC 7/10 — can control physical devices (e.g., door locks); strictly manage access

:::warning Physical Security
Home Assistant can control door locks, security cameras, and alarm systems. Recommendations:
- Create a **restricted-permission** Home Assistant user for OpenClaw
- Exclude security-sensitive devices (door locks, cameras) from access
- Enable Home Assistant's operation logging
:::

- **Alternatives**: Use brand-specific Skills (Philips Hue, Elgato) directly; Apple HomeKit integration is in development

---

## #30 — Philips Hue

| Property | Details |
|----------|---------|
| **Rank** | #30 / 50 |
| **Category** | Smart Home |
| **Total Score** | 54 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/philips-hue` |
| **Target Users** | Philips Hue users |

### Feature Overview

Control Philips Hue lighting systems directly via the Hue Bridge API:

- Toggle individual/group lights on/off
- Adjust brightness, color temperature, and color
- Switch scenes
- Schedule controls
- Dynamic light effects

### Why It Matters

Philips Hue is the world's most popular smart lighting system. If you only have Hue bulbs and don't need a full Home Assistant setup, this lightweight Skill is the simpler option.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 6 | 7 | 6 | 7 | 7 | 8 | 7 | 6 | **54** |

### Installation & Setup

```bash
clawhub install community/philips-hue

# Auto-discover Hue Bridge
openclaw skill configure philips-hue --discover

# Manual setup
openclaw skill configure philips-hue \
  --bridge-ip 192.168.1.100 \
  --username your_hue_api_username

# Usage example
openclaw run "Set the study lights to reading mode"
```

### Dependencies & Security

- **Dependencies**: Philips Hue Bridge (local network)
- **Permissions Required**: Hue Bridge API access (requires pressing the Bridge button to pair)
- **Security**: SEC 7/10 — local network operation, lower risk
- **Alternatives**: Home Assistant (#10) provides more complete smart home control

---

## #36 — Elgato

| Property | Details |
|----------|---------|
| **Rank** | #36 / 50 |
| **Category** | Smart Home |
| **Total Score** | 52 / 80 |
| **Maturity** | 🟡 Beta |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/elgato-claw` |
| **Target Users** | Streamers, content creators, remote workers |

### Feature Overview

Control Elgato product lines:

- **Key Light / Key Light Air**: Brightness and color temperature adjustment
- **Light Strip**: Color and scene control
- **Stream Deck** (read-only): View button configuration

### Why It Matters

Elgato is standard lighting equipment for streamers and content creators. For users who frequently do video calls or stream, the Agent can automatically adjust lighting based on context — for example, turning on Key Light when a meeting starts.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 5 | 7 | 5 | 7 | 7 | 8 | 8 | 5 | **52** |

### Installation & Setup

```bash
clawhub install community/elgato-claw

# Auto-discover Elgato devices on local network
openclaw skill configure elgato-claw --discover

# Usage example
openclaw run "Turn on Key Light, brightness 70%, color temperature 4500K"
```

### Dependencies & Security

- **Dependencies**: Elgato devices (local network)
- **Permissions Required**: Local network mDNS access
- **Security**: SEC 8/10 — local network operation, controls only lighting
- **Alternatives**: Home Assistant (#10) can achieve the same through its Elgato integration

---

## #42 — BambuLab 3D Printer

| Property | Details |
|----------|---------|
| **Rank** | #42 / 50 |
| **Category** | Smart Home / Hardware |
| **Total Score** | 49 / 80 |
| **Maturity** | 🟠 Alpha |
| **Official/Community** | Community |
| **Installation** | `clawhub install community/bambulab-claw` |
| **Target Users** | BambuLab 3D printer owners |

### Feature Overview

Monitor and control BambuLab 3D printers:

- View print progress and status
- Start/pause/cancel prints
- Monitor temperatures (nozzle, heated bed)
- Receive print completion/error notifications
- Upload G-code files

### Why It Matters

BambuLab is one of the most popular consumer 3D printer brands in recent years. This Skill lets you remotely monitor print progress via the Agent without constantly watching the printer. Combined with the Telegram Bot Skill, you can receive print status notifications on your phone.

### Score Breakdown

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | Total |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| 4 | 6 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |

### Installation & Setup

```bash
clawhub install community/bambulab-claw

# Configure printer connection
openclaw skill configure bambulab-claw \
  --printer-ip 192.168.1.200 \
  --access-code your_access_code \
  --serial-number your_serial

# Check print status
openclaw run "What is the BambuLab print progress?"
```

:::warning Hardware Control Risk
3D printers involve high-temperature operation. Make sure:
- Do not let the Agent start prints when no one is present
- Set temperature upper-limit protection
- Only allow starting print jobs when someone is on-site
:::

### Dependencies & Security

- **Dependencies**: BambuLab 3D printer (local network or cloud)
- **Permissions Required**: Printer Access Code
- **Security**: SEC 7/10 — controlling physical hardware requires caution
- **Alternatives**: OctoPrint community integration (for other 3D printer brands)

---

## Smart Home Skills Architecture

```
┌─────────────────────────────────────┐
│          OpenClaw Agent             │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐   │
│  │    Home Assistant Skill      │   │  ← Unified control interface
│  │    (#10, Official, 2000+     │   │
│  │     brands)                  │   │
│  └──────────┬───────────────────┘   │
│             │                       │
│  ┌──────────┼───────────────────┐   │
│  │          │  Direct Control   │   │  ← Brand-specific control
│  │  ┌───────┴──────┐           │   │
│  │  │ Philips Hue  │  Elgato   │   │
│  │  │ (#30)        │  (#36)    │   │
│  │  └──────────────┘           │   │
│  │  ┌──────────────┐           │   │
│  │  │ BambuLab 3D  │           │   │
│  │  │ (#42)        │           │   │
│  │  └──────────────┘           │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### How to Choose?

| Scenario | Recommended Solution |
|----------|---------------------|
| Already have Home Assistant | Install only the Home Assistant Skill |
| Only have Hue bulbs | Philips Hue Skill (lighter weight) |
| Streamer/creator | Elgato Skill |
| 3D print monitoring | BambuLab Skill |
| Complete smart home | Home Assistant Skill + brand Skills as backup |

### Recommended Smart Home Combinations

```bash
# Complete smart home
clawhub install openclaw/homeassistant
# Home Assistant integrates most brands — this alone is usually enough

# Creator studio
clawhub install community/elgato-claw
clawhub install community/philips-hue
# Pair with Calendar Skill for automatic meeting lighting

# Maker workshop
clawhub install openclaw/homeassistant
clawhub install community/bambulab-claw
clawhub install community/telegram-claw
# Remote print monitoring, Telegram notification on completion
```
