---
sidebar_position: 6
title: "自動化 Skills"
description: "OpenClaw 自動化類 Skills 完整評測：n8n、Browser Automation、Home Assistant、IFTTT、Webhook Relay"
keywords: [OpenClaw, Skills, Automation, n8n, Browser Automation, Home Assistant, IFTTT]
---

# 自動化 Skills (Automation)

自動化 Skills 將 OpenClaw Agent 從「被動回應」提升為「主動執行」。讓 Agent 可以建立自動化工作流、控制瀏覽器執行重複操作、串接不同服務，甚至管理你的智慧家庭裝置。

---

## #8 — n8n

| 屬性 | 內容 |
|------|------|
| **排名** | #8 / 50 |
| **類別** | Automation / Development |
| **總分** | 63 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/n8n-openclaw` |
| **目標使用者** | 自動化工程師、No-code/Low-code 使用者 |

### 功能說明

n8n 是開源的 workflow automation 平台，這個 Skill 讓 OpenClaw Agent 能操控 n8n：

- **建立工作流**：透過自然語言描述建立 n8n workflow
- **執行工作流**：觸發已建立的工作流
- **監控狀態**：查看工作流執行記錄和錯誤
- **節點管理**：新增、修改、刪除 workflow 中的節點
- **500+ 整合**：透過 n8n 連接 500+ 第三方服務

### 為什麼重要

n8n 本身就能連接數百個服務，但需要手動設計 workflow。加入 OpenClaw Agent 後，你只需用自然語言描述想要的自動化流程，Agent 就能幫你建立和維護 n8n workflow。這是「AI + 自動化」的最佳組合。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 8 | 9 | 8 | 8 | 7 | 8 | **63** |

### 安裝與設定

```bash
clawhub install community/n8n-openclaw

# 需要先有 n8n instance 運行
# 方法 1：Docker（推薦）
docker run -d --name n8n -p 5678:5678 n8nio/n8n

# 方法 2：npm
npm install -g n8n && n8n start

# 設定 Skill 連接
openclaw skill configure n8n-openclaw \
  --url http://localhost:5678 \
  --api-key your_n8n_api_key
```

### 依賴與安全

- **依賴**：n8n instance（Docker 或本機安裝）
- **權限需求**：n8n API 完整存取
- **安全性**：SEC 7/10 — n8n workflow 可執行任意操作，需審慎管理

:::warning n8n 安全設定
- 為 n8n 設定強密碼和 API Key
- 限制 n8n 的網路存取範圍
- 審核 Agent 建立的 workflow 再啟用
- 建議使用 `--dry-run` 模式先預覽 workflow
:::

- **替代方案**：IFTTT（#37）更簡單但功能有限；Zapier 整合尚在開發中

---

## #16 — Browser Automation

| 屬性 | 內容 |
|------|------|
| **排名** | #16 / 50 |
| **類別** | Automation |
| **總分** | 58 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/browser-auto` |
| **目標使用者** | 需要自動化瀏覽器操作的使用者 |

### 功能說明

比 Web Browsing Skill 更進階的瀏覽器自動化工具：

- **表單填寫**：自動填寫網頁表單
- **點擊操作**：模擬使用者點擊、捲動、拖拉
- **登入自動化**：管理登入 session
- **資料擷取**：從 SPA 中擷取動態載入的資料
- **流程錄製**：錄製瀏覽器操作後自動重播
- **Playwright 底層**：基於 Playwright 框架

### 為什麼重要

Web Browsing 擅長「看網頁」，Browser Automation 擅長「操作網頁」。對於那些沒有 API 的服務（如某些政府網站、傳統企業系統），Browser Automation 是唯一的自動化方式。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 8 | 7 | 7 | 8 | 7 | 7 | 6 | 8 | **58** |

### 安裝與設定

```bash
clawhub install community/browser-auto

# 安裝 Playwright 瀏覽器
npx playwright install chromium

# 設定
openclaw skill configure browser-auto \
  --browser chromium \
  --headless true \
  --timeout 30000
```

:::warning 安全與合規
Browser Automation 可以模擬使用者行為，可能違反某些網站的服務條款。請確認你的使用方式符合目標網站的 Terms of Service。不要用於繞過驗證碼或存取限制。
:::

### 依賴與安全

- **依賴**：Playwright + Chromium
- **權限需求**：網路存取、本機瀏覽器執行
- **安全性**：SEC 6/10 — 可執行任意瀏覽器操作，攻擊面較大
- **替代方案**：Web Browsing（#2）for 簡單瀏覽；Apify（#21）for 大規模爬取

---

## #10 — Home Assistant（自動化面向）

Home Assistant 的完整介紹請見[智慧家庭 Skills](./smart-home#10--home-assistant)。在自動化工作流中，它扮演的角色如下：

### 自動化場景

```bash
# 結合 Calendar Skill 的情境自動化
openclaw run "
  每天早上 8 點上班前：
  1. 查看今天的行事曆
  2. 如果有視訊會議，開啟辦公室燈光到『工作模式』
  3. 播放 Focus 音樂到客廳喇叭
  4. 設定勿擾模式到第一場會議結束
"
```

Home Assistant Skill 讓 Agent 能控制智慧家庭裝置，結合 Calendar、Gmail 等 Skill 可以實現真正的「情境感知自動化」。

---

## #37 — IFTTT

| 屬性 | 內容 |
|------|------|
| **排名** | #37 / 50 |
| **類別** | Automation |
| **總分** | 51 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/ifttt-claw` |
| **目標使用者** | IFTTT 使用者、簡易自動化需求 |

### 功能說明

透過 IFTTT Webhooks 觸發自動化：

- 觸發 IFTTT Applets
- 接收 IFTTT 事件通知
- 管理 Webhook 端點
- 串接 IFTTT 支援的 700+ 服務

### 為什麼重要

IFTTT 是最容易上手的自動化平台。對於不想架設 n8n 的使用者，IFTTT 提供了「零基礎設施」的自動化方案。雖然功能不如 n8n 強大，但勝在簡單。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 5 | 6 | 7 | 6 | 7 | 7 | 6 | **51** |

### 安裝與設定

```bash
clawhub install community/ifttt-claw

# 設定 Webhooks Key（從 IFTTT 取得）
openclaw skill configure ifttt-claw \
  --webhooks-key your_ifttt_webhooks_key
```

### 依賴與安全

- **依賴**：IFTTT 帳號、Webhooks 服務啟用
- **權限需求**：IFTTT Webhooks API
- **安全性**：SEC 7/10 — 僅透過 Webhooks 觸發，權限有限
- **替代方案**：n8n（#8）更強大且開源

---

## #48 — Webhook Relay

| 屬性 | 內容 |
|------|------|
| **排名** | #48 / 50 |
| **類別** | Automation |
| **總分** | 44 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社群** | 社群 (Community) |
| **安裝方式** | `clawhub install community/webhook-relay` |
| **目標使用者** | 進階自動化開發者 |

### 功能說明

讓 OpenClaw Agent 接收外部 Webhook 呼叫並做出反應：

- 建立 Webhook 端點
- 解析 incoming payload
- 觸發 Agent 動作
- 支援 retry 和 dead-letter queue

### 為什麼重要

Webhook Relay 讓 Agent 變成「被呼叫端」— 外部服務（如 GitHub、Stripe、Shopify）可以在事件發生時通知 Agent。這開啟了「事件驅動」的 Agent 模式。

### 評分明細

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 總分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 5 | 6 | 3 | 6 | 5 | 6 | 7 | 6 | **44** |

### 安裝與設定

```bash
clawhub install community/webhook-relay

# 建立端點
openclaw skill configure webhook-relay \
  --port 9876 \
  --secret your_webhook_secret

# 設定轉發規則
openclaw run "當收到 GitHub push event 時，執行安全掃描"
```

### 依賴與安全

- **依賴**：公開可存取的網路端點（或使用 ngrok）
- **權限需求**：網路 port 監聽
- **安全性**：SEC 7/10 — 暴露端點需要做好認證
- **替代方案**：n8n（#8）內建 Webhook 觸發器

---

## 自動化 Skills 組合推薦

### 全能自動化

```bash
clawhub install community/n8n-openclaw
clawhub install community/browser-auto
clawhub install openclaw/homeassistant
# n8n 處理服務間串接，Browser Auto 處理無 API 服務，Home Assistant 處理實體裝置
```

### 輕量自動化

```bash
clawhub install community/ifttt-claw
# 搭配內建 Gmail + Calendar
# 適合不想架設基礎設施的使用者
```

### 事件驅動架構

```bash
clawhub install community/n8n-openclaw
clawhub install community/webhook-relay
clawhub install openclaw/github
# Agent 被動接收事件並主動處理
```
