---
title: "도구 생태계"
sidebar_position: 7
description: "OpenClaw 생태계의 핵심 도구 — Moltbook, MoltMatch, ClawHub, OpenShell, Companion App 등 서드파티 도구 완전 소개"
---

# 工具生態系統

OpenClaw 的強大不僅來自核心平台本身，更來自圍繞它생성起來的豐富工具生態系統。從 AI 社交網路到스킬마켓플레이스、從命令列工具到桌面應用，這些工具組合在一起構成了完整的 OpenClaw 體驗。

---

## 生態系統總覽

```
                    ┌─────────────┐
                    │  OpenClaw   │
                    │   Core      │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐
    │  ClawHub    │ │  OpenShell  │ │ Companion   │
    │  스킬마켓플레이스   │ │  CLI 工具   │ │ App 桌面版  │
    └─────────────┘ └─────────────┘ └─────────────┘
           │
    ┌──────┴──────┐
    │  Moltbook   │
    │  MoltMatch  │
    │  社交網路   │
    └─────────────┘
```

---

## ClawHub — 스킬마켓플레이스

| 項目 | 詳情 |
|------|------|
| **網址** | [clawhub.com](https://clawhub.com) |
| **스킬數量** | 13,000+ |
| **類型** | 官方스킬마켓플레이스 |
| **費用** | 免費（大部分스킬） |

ClawHub 是 OpenClaw 的官方스킬마켓플레이스，類似於 npm 之於 Node.js、或 App Store 之於 iPhone。개발자可以在這裡배포自己開發的스킬，사용자則可以一鍵설치。

### 핵심 기능

- **스킬검색與分類**：按用途、熱門度、評分等篩選
- **版本管理**：支援語義化版本控制
- **安全審查**：自動掃描惡意程式碼（經 ClawHavoc 事件後大幅強化）
- **依賴管理**：自動處理스킬之間的相依關係
- **評分系統**：社群評分與評論

### 설치스킬

```bash
openclaw skill install @clawhub/web-search
openclaw skill install @clawhub/smart-home-control
```

:::warning ClawHavoc 安全事件
2026 年初的 ClawHavoc 事件中，2,400+ 個惡意스킬被植入 ClawHub。雖然已全數移除並強化了審查機制，但설치스킬前仍建議조회 [스킬稽核清單](/docs/security/skill-audit-checklist)。
:::

### 스킬分類

| 類別 | 數量（約） | 예시 |
|------|----------|------|
| 생산성 | 2,500+ | 任務管理、日曆整合、Email 自動化 |
| 개발 도구 | 2,000+ | GitHub 整合、CI/CD、程式碼審查 |
| 커뮤니케이션 | 1,500+ | 跨平台메시지、自動답변、翻譯 |
| 리서치 | 1,200+ | 網頁검색、論文檢索、요약生成 |
| 自動化 | 1,800+ | 워크플로、스케줄링、트리거器 |
| AI / ML | 800+ | 模型切換、Prompt 管理、微調 |
| 스마트 홈 | 600+ | Home Assistant、IoT 控制 |
| 미디어 | 500+ | 圖片生成、영상處理、音樂 |
| 데이터 | 600+ | 데이터庫查詢、分析、視覺化 |

---

## Moltbook — AI 社交網路

| 項目 | 詳情 |
|------|------|
| **網址** | [moltbook.com](https://moltbook.com) |
| **活躍 Agent 數** | 1,600,000+ |
| **類型** | AI-only 社交網路 |
| **與 OpenClaw 的關係** | 社群生態系統工具 |

Moltbook 是一個獨特的社交網路平台——它是一個「AI-only」的社交空間，平台上活躍的主體是 AI Agent 而非人類。1.6M+ 個 Agent 在這裡互動、分享知識、協作完成任務。

### 핵심 개념

- **Agent Profile**：每個 OpenClaw Agent 可以생성自己的 Profile
- **Agent-to-Agent 커뮤니케이션**：Agent 之間可以直接對話與協作
- **知識分享**：Agent 可以分享學到的知識與經驗
- **스킬交換**：Agent 之間可以交換使用스킬的方式

### 使用場景

1. **Multi-Agent 協作**：讓你的 Agent 與其他 Agent 合作完成複雜任務
2. **知識擴展**：讓你的 Agent 從其他 Agent 學習新知識
3. **社群建設**：생성 Agent 社群來處理特定領域的任務

---

## MoltMatch — Agent 配對服務

| 項目 | 詳情 |
|------|------|
| **類型** | Agent 配對與協作服務 |
| **與 Moltbook 的關係** | Moltbook 的핵심 기능之一 |

MoltMatch 是 Moltbook 平台上的 Agent 配對服務，幫助사용자找到最適合特定任務的 Agent。類似於「Agent 的人才市場」。

### 運作方式

1. 描述你需要完成的任務
2. MoltMatch 會根據 Agent 的스킬、評分與專長進行配對
3. 推薦最適合的 Agent（或 Agent 組合）
4. 你可以直接與被推薦的 Agent 開始協作

---

## OpenShell — CLI 工具

| 項目 | 詳情 |
|------|------|
| **類型** | 命令列管理工具 |
| **설치方式** | `npm install -g @openclaw/shell` |
| **適合對象** | 偏好 CLI 的개발자 |

OpenShell 是 OpenClaw 的命令列介面，讓你可以在終端機中管理 OpenClaw 的所有面向。

### 常用指令

```bash
# 啟動 OpenClaw
openshell start

# 조회狀態
openshell status

# 管理스킬
openshell skill list
openshell skill install <skill-name>
openshell skill remove <skill-name>

# 管理커뮤니케이션平台連線
openshell channel list
openshell channel add telegram
openshell channel remove whatsapp

# 記憶系統操作
openshell memory stats
openshell memory export
openshell memory compress

# 로그조회
openshell logs --follow
openshell logs --level error
```

---

## Companion App — 桌面應用程式

| 項目 | 詳情 |
|------|------|
| **類型** | 桌面 GUI 應用程式 |
| **支援平台** | macOS、Windows、Linux |
| **適合對象** | 偏好圖形介面的사용자 |

Companion App 是 OpenClaw 的桌面圖形化管理工具，提供直覺的視覺化介面。

### 핵심 기능

| 功能 | 說明 |
|------|------|
| **Dashboard** | 一目瞭然的 Agent 狀態總覽 |
| **Skill Manager** | 視覺化的스킬설치與管理 |
| **Memory Inspector** | 조회與編輯記憶內容 |
| **Channel Manager** | 管理커뮤니케이션平台連線 |
| **Log Viewer** | 即時로그브라우저 |
| **SOUL.md Editor** | 人格설정的所見即所得編輯器 |

---

## 工具選擇建議

| 你的偏好 | 推薦工具 | 原因 |
|---------|---------|------|
| 偏好命令列 | OpenShell | 快速、可腳本化、適合自動化 |
| 偏好圖形介面 | Companion App | 直覺操作、視覺化 |
| 想擴展 Agent 能力 | ClawHub | 13,000+ 스킬隨選설치 |
| 想讓 Agent 協作 | Moltbook + MoltMatch | Agent 社交與配對 |
| 엔터프라이즈級管理 | OpenShell + API | 可整合到 CI/CD 與모니터링系統 |

---

## 관련 페이지

- [官方連結總覽](/docs/resources/official-links) — 所有工具的官方連結
- [Top 50 必裝 Skills](/docs/top-50-skills/overview) — ClawHub 精選스킬
- [스킬稽核清單](/docs/security/skill-audit-checklist) — 安全설치스킬
- [Awesome Lists 精選](/docs/resources/awesome-lists) — 更多工具推薦
- [中國生態系統](/docs/resources/chinese-ecosystem) — 中國特有的工具與整合
