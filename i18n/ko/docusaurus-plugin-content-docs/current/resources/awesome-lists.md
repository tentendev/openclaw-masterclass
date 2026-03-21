---
title: "Awesome Lists 엄선"
sidebar_position: 4
description: "OpenClaw 관련 엄선된 Awesome Lists — 커뮤니티가 정리한 스킬, 도구, 튜토리얼, 예제 등 리소스 모음"
---

# Awesome Lists 精選

「Awesome List」是開源社群中一種流行的資源整理方式，由社群成員共同維護、持續업데이트。以下是與 OpenClaw 相關的精選 Awesome Lists。

:::tip Awesome List란?
Awesome List 起源於 GitHub 上的 [awesome](https://github.com/sindresorhus/awesome) 專案，是一種以主題分類的高品質資源清單。星數越高，代表社群認可度越高。
:::

---

## 核心 Awesome Lists

### awesome-openclaw

| 項目 | 詳情 |
|------|------|
| **GitHub** | [github.com/community/awesome-openclaw](https://github.com/community/awesome-openclaw) |
| **維護狀態** | 活躍（每週업데이트） |
| **Star 數** | 12,000+ |
| **涵蓋範圍** | 스킬、템플릿、튜토리얼、영상、工具、最佳實踐 |

這是最完整的 OpenClaw 資源清單，涵蓋以下分類：

- **Skills（스킬）**：按類別分類的精選스킬推薦
- **Templates（템플릿）**：SOUL.md 人格템플릿、自動化워크플로템플릿
- **Tutorials（튜토리얼）**：文章、영상、互動튜토리얼
- **Tools（工具）**：第三方工具與整合
- **Configurations（설정）**：社群分享的最佳설정 파일

---

### awesome-clawhub-skills

| 項目 | 詳情 |
|------|------|
| **GitHub** | [github.com/community/awesome-clawhub-skills](https://github.com/community/awesome-clawhub-skills) |
| **維護狀態** | 活躍 |
| **Star 數** | 5,500+ |
| **涵蓋範圍** | ClawHub 스킬深度評測與推薦 |

專注於 ClawHub 스킬的深度評測清單：

- 每個스킬都附有安全性評等
- 包含使用情境與설정예시
- 社群投票的「必裝스킬」排名
- 已知問題與替代方案

:::warning ClawHub 보안 주의
由於 ClawHavoc 事件中曾有 2,400+ 個惡意스킬被植入 ClawHub，설치任何스킬前請先조회 [스킬稽核清單](/docs/security/skill-audit-checklist)。Awesome List 中推薦的스킬通常已經過社群審查，但仍建議自行確認。
:::

---

### awesome-ai-agents

| 項目 | 詳情 |
|------|------|
| **GitHub** | [github.com/community/awesome-ai-agents](https://github.com/community/awesome-ai-agents) |
| **維護狀態** | 活躍 |
| **Star 數** | 25,000+ |
| **涵蓋範圍** | 所有 AI Agent 框架比較（包含 OpenClaw） |

這份清單不只涵蓋 OpenClaw，而是對比了整個 AI Agent 生態系統。對於想了解 OpenClaw 在生態系統中定位的사용자特別有用。

---

## 專題 Awesome Lists

### 按用途分類

| 清單名稱 | 焦點 | 適合對象 |
|---------|------|---------|
| **awesome-openclaw-automation** | 自動化워크플로예시 | 想생성自動化的사용자 |
| **awesome-openclaw-enterprise** | 엔터프라이즈배포案例與설정 | IT 團隊、DevOps 工程師 |
| **awesome-openclaw-china** | 중국使用가이드 | 중국사용자 |
| **awesome-openclaw-security** | 安全工具與稽核方法 | 安全工程師 |
| **awesome-soul-md** | SOUL.md 人格템플릿收藏 | 想客製化 AI 人格的사용자 |

### 按語言分類

| 清單名稱 | 語言 | 說明 |
|---------|------|------|
| **awesome-openclaw-zh** | 中文 | 中文社群維護的資源清單 |
| **awesome-openclaw-ja** | 日文 | 日本社群維護 |
| **awesome-openclaw-ko** | 韓文 | 韓國社群維護 |
| **awesome-openclaw-de** | 德文 | 德語區社群維護 |

---

## 如何貢獻 Awesome List

想要將你發現的好資源加入 Awesome List？以下是一般的貢獻流程：

1. **Fork** 該 Awesome List 的 GitHub repository
2. 在適當的分類下新增你推薦的資源
3. 確保格式一致（通常是 `- [名稱](連結) - 簡短說明`）
4. 제출 **Pull Request** 並說明推薦理由
5. 等待維護者審查與合併

### 제출品質標準

好的 Awesome List 項目通常具備以下特徵：

- 資源是**免費**或**開源**的（付費資源需特別標註）
- 內容是**最新**的（過時的資源不適合）
- 有一定的**社群認可度**（Stars、다운로드量等）
- 附帶清楚的**문서說明**

---

## 自行생성 Awesome List

如果你專精於某個 OpenClaw 相關領域，歡迎생성自己的 Awesome List：

```markdown
# Awesome OpenClaw [你的主題]

> 精選的 OpenClaw [主題] 資源清單

## 目錄
- [工具](#工具)
- [튜토리얼](#튜토리얼)
- [예시](#예시)

## 工具
- [工具名稱](連結) - 簡短說明

## 튜토리얼
- [튜토리얼標題](連結) - 簡短說明
```

---

## 관련 페이지

- [官方連結總覽](/docs/resources/official-links) — 官方資源一覽
- [工具生態系統](/docs/resources/tools-ecosystem) — 第三方工具詳細介紹
- [Top 50 必裝 Skills](/docs/top-50-skills/overview) — 精選스킬推薦
- [스킬稽核清單](/docs/security/skill-audit-checklist) — 安全설치스킬的檢查流程
