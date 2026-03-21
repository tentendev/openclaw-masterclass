---
sidebar_position: 8
title: "智慧家庭 Skills"
description: "OpenClaw 智慧家庭類 Skills 完整評測：Home Assistant、Philips Hue、Elgato、BambuLab 3D Printer"
keywords: [OpenClaw, Skills, Smart Home, Home Assistant, Philips Hue, Elgato, BambuLab]
---

# 智慧家庭 Skills (Smart Home)

智慧家庭 Skills 讓 OpenClaw Agent 走出螢幕，控制你的實體裝置。從燈光、氣氛到 3D 列印，Agent 可以成為你的智慧家庭管家。

---

## #10 — Home Assistant

| 屬性 | 內容 |
|------|------|
| **排名** | #10 / 50 |
| **類別** | Smart Home |
| **總分** | 61 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 官方 (Official) |
| **安裝方式** | `clawhub install openclaw/homeassistant` |
| **目標使用者** | Home Assistant 使用者、智慧家庭愛好者 |

### 功能說明

Home Assistant 是最受歡迎的開源智慧家庭平台，此 Skill 提供完整整合：

- **裝置控制**：開關燈光、調整溫度、鎖門等
- **場景管理**：啟動預設場景（如「離家模式」、「電影之夜」）
- **自動化規則**：建立和管理 Home Assistant Automation
- **感測器讀取**：溫度、濕度、動作偵測等感測器資料
- **能源監控**：查看用電量和能源統計
- **語音指令橋接**：透過 OpenClaw 下達自然語言指令

### 為什麼重要

Home Assistant 已整合超過 2000+ 種裝置品牌。透過這一個 Skill，OpenClaw Agent 就能控制幾乎所有主流智慧家庭裝置。相較於各品牌的獨立 Skill（如 Philips Hue、Elgato），Home Assistant Skill 提供了統一的控制介面。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 8 | 7 | 9 | 8 | 8 | 7 | 7 | **61** |

### 安裝與設定

```bash
clawhub install openclaw/homeassistant

# 設定 Home Assistant 連線
openclaw skill configure homeassistant \
  --url http://homeassistant.local:8123 \
  --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 列出可用裝置
openclaw run homeassistant --list-entities

# 使用範例
openclaw run "把客廳的燈調到暖色 50% 亮度"
openclaw run "啟動離家模式"
```

### 依賴與安全

- **依賴**：Home Assistant instance（已設定並運行）
- **權限需求**：Home Assistant Long-Lived Access Token
- **安全性**：SEC 7/10 — 可控制實體裝置（如門鎖），需嚴格管理存取權

:::warning 實體安全
Home Assistant 可以控制門鎖、監視器、警報系統等安全裝置。建議：
- 為 OpenClaw 建立一個**權限受限**的 Home Assistant 使用者
- 排除安全敏感裝置（門鎖、監視器）的存取權限
- 啟用 Home Assistant 的操作日誌
:::

- **替代方案**：直接使用品牌專屬 Skill（Philips Hue、Elgato）；Apple HomeKit 整合尚在開發中

---

## #30 — Philips Hue

| 屬性 | 內容 |
|------|------|
| **排名** | #30 / 50 |
| **類別** | Smart Home |
| **總分** | 54 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/philips-hue` |
| **目標使用者** | Philips Hue 使用者 |

### 功能說明

直接透過 Hue Bridge API 控制 Philips Hue 燈光系統：

- 開關單一/群組燈光
- 調整亮度、色溫、顏色
- 場景切換
- 排程控制
- 動態光效

### 為什麼重要

Philips Hue 是全球最普及的智慧燈光系統。如果你只有 Hue 燈泡不需要完整的 Home Assistant，這個輕量級 Skill 是更簡單的選擇。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 6 | 7 | 7 | 8 | 7 | 6 | **54** |

### 安裝與設定

```bash
clawhub install community/philips-hue

# 自動偵測 Hue Bridge
openclaw skill configure philips-hue --discover

# 手動設定
openclaw skill configure philips-hue \
  --bridge-ip 192.168.1.100 \
  --username your_hue_api_username

# 使用範例
openclaw run "把書房的燈調成閱讀模式"
```

### 依賴與安全

- **依賴**：Philips Hue Bridge（本地網路）
- **權限需求**：Hue Bridge API 存取（需按下 Bridge 按鈕配對）
- **安全性**：SEC 7/10 — 本地網路操作，風險較低
- **替代方案**：Home Assistant（#10）提供更完整的智慧家庭控制

---

## #36 — Elgato

| 屬性 | 內容 |
|------|------|
| **排名** | #36 / 50 |
| **類別** | Smart Home |
| **總分** | 52 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/elgato-claw` |
| **目標使用者** | 直播主、內容創作者、遠端工作者 |

### 功能說明

控制 Elgato 系列產品：

- **Key Light / Key Light Air**：亮度和色溫調整
- **Light Strip**：顏色和場景控制
- **Stream Deck**（唯讀）：查看按鈕配置

### 為什麼重要

Elgato 是直播和內容創作者的標配燈光。對於經常進行視訊會議或直播的使用者，Agent 可以根據情境自動調整燈光 — 例如開始會議時自動打開 Key Light。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 5 | 7 | 5 | 7 | 7 | 8 | 8 | 5 | **52** |

### 安裝與設定

```bash
clawhub install community/elgato-claw

# 自動偵測本地網路上的 Elgato 裝置
openclaw skill configure elgato-claw --discover

# 使用範例
openclaw run "打開 Key Light，亮度 70%，色溫 4500K"
```

### 依賴與安全

- **依賴**：Elgato 裝置（本地網路）
- **權限需求**：本地網路 mDNS 存取
- **安全性**：SEC 8/10 — 本地網路操作，僅控制燈光
- **替代方案**：Home Assistant（#10）可透過 Elgato 整合達到同樣效果

---

## #42 — BambuLab 3D Printer

| 屬性 | 內容 |
|------|------|
| **排名** | #42 / 50 |
| **類別** | Smart Home / Hardware |
| **總分** | 49 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/bambulab-claw` |
| **目標使用者** | BambuLab 3D 列印機擁有者 |

### 功能說明

監控和控制 BambuLab 3D 列印機：

- 查看列印進度和狀態
- 啟動/暫停/取消列印
- 監控溫度（噴頭、熱床）
- 接收列印完成/錯誤通知
- 上傳 G-code 檔案

### 為什麼重要

BambuLab 是近年最受歡迎的消費級 3D 列印機品牌。這個 Skill 讓你可以透過 Agent 遠端監控列印進度，不需要一直盯著印表機。結合 Telegram Bot Skill，還能在手機上收到列印狀態通知。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 4 | 6 | 5 | 7 | 6 | 7 | 7 | 7 | **49** |

### 安裝與設定

```bash
clawhub install community/bambulab-claw

# 設定印表機連線
openclaw skill configure bambulab-claw \
  --printer-ip 192.168.1.200 \
  --access-code your_access_code \
  --serial-number your_serial

# 查看列印狀態
openclaw run "BambuLab 的列印進度如何？"
```

:::warning 硬體控制風險
3D 列印機涉及高溫操作。確保：
- 不要讓 Agent 在無人時啟動列印
- 設定溫度上限保護
- 人在現場時才允許啟動列印任務
:::

### 依賴與安全

- **依賴**：BambuLab 3D 列印機（本地網路或雲端）
- **權限需求**：列印機 Access Code
- **安全性**：SEC 7/10 — 控制實體硬體需謹慎
- **替代方案**：OctoPrint 社群整合（適用其他品牌 3D 列印機）

---

## 智慧家庭 Skills 架構圖

```
┌─────────────────────────────────────┐
│          OpenClaw Agent             │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐   │
│  │    Home Assistant Skill      │   │  ← 統一控制介面
│  │    (#10, 官方, 2000+ 品牌)   │   │
│  └──────────┬───────────────────┘   │
│             │                       │
│  ┌──────────┼───────────────────┐   │
│  │          │   直接控制 Skills  │   │  ← 品牌專屬控制
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

### 如何選擇？

| 情境 | 推薦方案 |
|------|---------|
| 已有 Home Assistant | 只安裝 Home Assistant Skill |
| 只有 Hue 燈泡 | Philips Hue Skill（更輕量） |
| 直播/創作者 | Elgato Skill |
| 3D 列印監控 | BambuLab Skill |
| 完整智慧家庭 | Home Assistant Skill + 品牌 Skills 為備援 |

### 智慧家庭組合推薦

```bash
# 完整智慧家庭
clawhub install openclaw/homeassistant
# Home Assistant 已整合大部分品牌，通常這一個就夠了

# 創作者工作室
clawhub install community/elgato-claw
clawhub install community/philips-hue
# 搭配 Calendar Skill 實現會議自動燈光

# Maker 工作室
clawhub install openclaw/homeassistant
clawhub install community/bambulab-claw
clawhub install community/telegram-claw
# 遠端監控列印進度，完成後 Telegram 通知
```
