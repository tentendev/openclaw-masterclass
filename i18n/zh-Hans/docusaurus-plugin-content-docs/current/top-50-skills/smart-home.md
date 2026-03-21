---
sidebar_position: 8
title: "智慧家庭 Skills"
description: "OpenClaw 智慧家庭类 Skills 完整评测：Home Assistant、Philips Hue、Elgato、BambuLab 3D Printer"
keywords: [OpenClaw, Skills, Smart Home, Home Assistant, Philips Hue, Elgato, BambuLab]
---

# 智慧家庭 Skills (Smart Home)

智慧家庭 Skills 让 OpenClaw Agent 走出屏幕，控制你的实体装置。从灯光、气氛到 3D 列印，Agent 可以成为你的智慧家庭管家。

---

## #10 — Home Assistant

| 属性 | 内容 |
|------|------|
| **排名** | #10 / 50 |
| **类别** | Smart Home |
| **总分** | 61 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 官方 (Official) |
| **安装方式** | `clawhub install openclaw/homeassistant` |
| **目标用户** | Home Assistant 用户、智慧家庭爱好者 |

### 功能说明

Home Assistant 是最受欢迎的开源智慧家庭平台，此 Skill 提供完整集成：

- **装置控制**：开关灯光、调整温度、锁门等
- **场景管理**：启动默认场景（如「离家模式」、「电影之夜」）
- **自动化规则**：创建和管理 Home Assistant Automation
- **感测器读取**：温度、湿度、动作检测等感测器数据
- **能源监控**：查看用电量和能源统计
- **语音命令桥接**：透过 OpenClaw 下达自然语言命令

### 为什么重要

Home Assistant 已集成超过 2000+ 种装置品牌。透过这一个 Skill，OpenClaw Agent 就能控制几乎所有主流智慧家庭装置。相较于各品牌的独立 Skill（如 Philips Hue、Elgato），Home Assistant Skill 提供了统一的控制接口。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 8 | 7 | 9 | 8 | 8 | 7 | 7 | **61** |

### 安装与配置

```bash
clawhub install openclaw/homeassistant

# 配置 Home Assistant 连接
openclaw skill configure homeassistant \
  --url http://homeassistant.local:8123 \
  --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 列出可用装置
openclaw run homeassistant --list-entities

# 使用示例
openclaw run "把客厅的灯调到暖色 50% 亮度"
openclaw run "启动离家模式"
```

### 依赖与安全

- **依赖**：Home Assistant instance（已配置并运行）
- **权限需求**：Home Assistant Long-Lived Access Token
- **安全性**：SEC 7/10 — 可控制实体装置（如门锁），需严格管理存取权

:::warning 实体安全
Home Assistant 可以控制门锁、监视器、警报系统等安全装置。建议：
- 为 OpenClaw 创建一个**权限受限**的 Home Assistant 用户
- 排除安全敏感装置（门锁、监视器）的存取权限
- 启用 Home Assistant 的操作日志
:::

- **替代方案**：直接使用品牌专属 Skill（Philips Hue、Elgato）；Apple HomeKit 集成尚在开发中

---

## #30 — Philips Hue

| 属性 | 内容 |
|------|------|
| **排名** | #30 / 50 |
| **类别** | Smart Home |
| **总分** | 54 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/philips-hue` |
| **目标用户** | Philips Hue 用户 |

### 功能说明

直接透过 Hue Bridge API 控制 Philips Hue 灯光系统：

- 开关单一/群组灯光
- 调整亮度、色温、颜色
- 场景切换
- 调度控制
- 动态光效

### 为什么重要

Philips Hue 是全球最普及的智慧灯光系统。如果你只有 Hue 灯泡不需要完整的 Home Assistant，这个轻量级 Skill 是更简单的选择。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 6 | 7 | 7 | 8 | 7 | 6 | **54** |

### 安装与配置

```bash
clawhub install community/philips-hue

# 自动检测 Hue Bridge
openclaw skill configure philips-hue --discover

# 手动配置
openclaw skill configure philips-hue \
  --bridge-ip 192.168.1.100 \
  --username your_hue_api_username

# 使用示例
openclaw run "把书房的灯调成阅读模式"
```

### 依赖与安全

- **依赖**：Philips Hue Bridge（本地网络）
- **权限需求**：Hue Bridge API 存取（需按下 Bridge 按钮配对）
- **安全性**：SEC 7/10 — 本地网络操作，风险较低
- **替代方案**：Home Assistant（#10）提供更完整的智慧家庭控制

---

## #36 — Elgato

| 属性 | 内容 |
|------|------|
| **排名** | #36 / 50 |
| **类别** | Smart Home |
| **总分** | 52 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/elgato-claw` |
| **目标用户** | 直播主、内容创作者、远端工作者 |

### 功能说明

控制 Elgato 系列产品：

- **Key Light / Key Light Air**：亮度和色温调整
- **Light Strip**：颜色和场景控制
- **Stream Deck**（唯读）：查看按钮配置

### 为什么重要

Elgato 是直播和内容创作者的标配灯光。对于经常进行视频会议或直播的用户，Agent 可以根据场景自动调整灯光 — 例如开始会议时自动打开 Key Light。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 5 | 7 | 5 | 7 | 7 | 8 | 8 | 5 | **52** |

### 安装与配置

```bash
clawhub install community/elgato-claw

# 自动检测本地网络上的 Elgato 装置
openclaw skill configure elgato-claw --discover

# 使用示例
openclaw run "打开 Key Light，亮度 70%，色温 4500K"
```

### 依赖与安全

- **依赖**：Elgato 装置（本地网络）
- **权限需求**：本地网络 mDNS 存取
- **安全性**：SEC 8/10 — 本地网络操作，仅控制灯光
- **替代方案**：Home Assistant（#10）可透过 Elgato 集成达到同样效果

---

## #42 — BambuLab 3D Printer

| 属性 | 内容 |
|------|------|
| **排名** | #42 / 50 |
| **类别** | Smart Home / Hardware |
| **总分** | 49 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/bambulab-claw` |
| **目标用户** | BambuLab 3D 列印机拥有者 |

### 功能说明

监控和控制 BambuLab 3D 列印机：

- 查看列印进度和状态
- 启动/暂停/取消列印
- 监控温度（喷头、热床）
- 接收列印完成/错误通知
- 上传 G-code 文件

### 为什么重要

BambuLab 是近年最受欢迎的消费级 3D 列印机品牌。这个 Skill 让你可以透过 Agent 远端监控列印进度，不需要一直盯著印表机。结合 Telegram Bot Skill，还能在手机上收到列印状态通知。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 4 | 6 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |

### 安装与配置

```bash
clawhub install community/bambulab-claw

# 配置印表机连接
openclaw skill configure bambulab-claw \
  --printer-ip 192.168.1.200 \
  --access-code your_access_code \
  --serial-number your_serial

# 查看列印状态
openclaw run "BambuLab 的列印进度如何？"
```

:::warning 硬件控制风险
3D 列印机涉及高温操作。确保：
- 不要让 Agent 在无人时启动列印
- 配置温度上限保护
- 人在现场时才允许启动列印任务
:::

### 依赖与安全

- **依赖**：BambuLab 3D 列印机（本地网络或云端）
- **权限需求**：列印机 Access Code
- **安全性**：SEC 7/10 — 控制实体硬件需谨慎
- **替代方案**：OctoPrint 社区集成（适用其他品牌 3D 列印机）

---

## 智慧家庭 Skills 架构图

```
┌─────────────────────────────────────┐
│          OpenClaw Agent             │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐   │
│  │    Home Assistant Skill      │   │  ← 统一控制接口
│  │    (#10, 官方, 2000+ 品牌)   │   │
│  └──────────┬───────────────────┘   │
│             │                       │
│  ┌──────────┼───────────────────┐   │
│  │          │   直接控制 Skills  │   │  ← 品牌专属控制
│  │  ┌───────┴──────┐            │   │
│  │  │ Philips Hue  │  Elgato   │   │
│  │  │ (#30)        │  (#36)    │   │
│  │  └──────────────┘            │   │
│  │  ┌──────────────┐            │   │
│  │  │ BambuLab 3D  │            │   │
│  │  │ (#42)        │            │   │
│  │  └──────────────┘            │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 如何选择？

| 场景 | 推荐方案 |
|------|---------|
| 已有 Home Assistant | 只安装 Home Assistant Skill |
| 只有 Hue 灯泡 | Philips Hue Skill（更轻量） |
| 直播/创作者 | Elgato Skill |
| 3D 列印监控 | BambuLab Skill |
| 完整智慧家庭 | Home Assistant Skill + 品牌 Skills 为备援 |

### 智慧家庭组合推荐

```bash
# 完整智慧家庭
clawhub install openclaw/homeassistant
# Home Assistant 已集成大部分品牌，通常这一个就够了

# 创作者工作室
clawhub install community/elgato-claw
clawhub install community/philips-hue
# 搭配 Calendar Skill 实现会议自动灯光

# Maker 工作室
clawhub install openclaw/homeassistant
clawhub install community/bambulab-claw
clawhub install community/telegram-claw
# 远端监控列印进度，完成后 Telegram 通知
```
