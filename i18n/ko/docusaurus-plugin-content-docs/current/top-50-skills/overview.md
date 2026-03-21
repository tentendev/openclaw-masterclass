---
sidebar_position: 1
title: "Top 50 Skills 개요"
description: "OpenClaw 커뮤니티 추천 Top 50 Skills 완전 랭킹, 평가 방법 및 설치 가이드"
keywords: [OpenClaw, Skills, ClawHub, Top 50, 랭킹, 평가]
---

# Top 50 Skills 개요

> 최종 업데이트: 2026-03-20 | OpenClaw v0.9.x 기준 | 데이터 출처: ClawHub 통계 + 커뮤니티 투표 + 편집팀 실제 테스트

이 가이드는 OpenClaw 생태계에서 가장 가치 있는 50개 Skills를 수록하며, **8차원 정량 평가**를 기반으로 랭킹하여 자신의 워크플로에 적합한 Skills 조합을 빠르게 찾을 수 있도록 도와줍니다.

---

## 평가 방법론 (Scoring Methodology)

각 Skill은 다음 8개 차원에서 1-10점으로 평가하며, 만점은 **80점**입니다:

| 차원 | 코드 | 설명 |
|------|------|------|
| **관련성** (Relevance) | REL | 일반 OpenClaw 사용자에 대한 실용도 |
| **호환성** (Compatibility) | COM | OpenClaw 핵심 아키텍처와의 통합 수준 |
| **커뮤니티 인기도** (Traction) | TRC | ClawHub 다운로드 수, GitHub Stars, Discord 토론량 |
| **가치** (Value) | VAL | 효율성 향상 또는 기능 확장 폭 |
| **유지보수** (Maintenance) | MNT | 업데이트 빈도, Issue 응답 속도, 문서 품질 |
| **안정성** (Reliability) | RLB | 안정성, 오류율, 엣지 케이스 처리 |
| **보안성** (Security) | SEC | 역순 점수: 10 = 가장 안전, 1 = 고위험 |
| **학습 가치** (Learning Value) | LRN | OpenClaw 아키텍처 또는 AI Agent 패턴 이해에 대한 교육적 의미 |

**총점 = REL + COM + TRC + VAL + MNT + RLB + SEC + LRN (만점 80)**

### 성숙도 등급

| 등급 | 라벨 | 설명 |
|------|------|------|
| 🟢 | **Stable** | 광범위한 테스트를 거쳐 프로덕션에서 사용 가능 |
| 🟡 | **Beta** | 기능 완성이지만 알려진 이슈 있음 |
| 🟠 | **Alpha** | 실험적, API 변경 가능 |
| 🔴 | **Experimental** | 개념 증명 단계, 중요 워크플로에 사용 금지 |

---

## Top 10 빠른 개요

| 순위 | Skill 이름 | 카테고리 | 총점 | 설치 방법 | 성숙도 |
|:----:|-----------|---------|:----:|---------|:------:|
| 1 | **GitHub** | 개발 | 72 | `clawhub install openclaw/github` | 🟢 |
| 2 | **Web Browsing** | 리서치 | 70 | 기본 제공 (bundled) | 🟢 |
| 3 | **GOG** | 생산성 | 68 | `clawhub install openclaw/gog` | 🟢 |
| 4 | **Tavily** | 리서치 | 67 | `clawhub install framix-team/openclaw-tavily` | 🟢 |
| 5 | **Gmail** | 생산성 | 66 | 기본 제공 (bundled) | 🟢 |
| 6 | **Calendar** | 생산성 | 65 | 기본 제공 (bundled) | 🟢 |
| 7 | **Slack** | 커뮤니케이션 | 64 | `clawhub install steipete/slack` | 🟡 |
| 8 | **n8n** | 자동화 | 63 | `clawhub install community/n8n-openclaw` | 🟡 |
| 9 | **Obsidian** | 생산성 | 62 | `clawhub install community/obsidian-claw` | 🟡 |
| 10 | **Home Assistant** | 스마트홈 | 61 | `clawhub install openclaw/homeassistant` | 🟡 |

---

## 전체 랭킹 (Top 50)

| # | Skill | 카테고리 | REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 총점 |
|:-:|-------|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 1 | GitHub | 개발 | 10 | 10 | 9 | 9 | 9 | 9 | 8 | 8 | **72** |
| 2 | Web Browsing | 리서치 | 10 | 10 | 10 | 9 | 8 | 7 | 7 | 9 | **70** |
| 3 | GOG | 생산성 | 9 | 9 | 10 | 8 | 8 | 8 | 8 | 8 | **68** |
| 4 | Tavily | 리서치 | 9 | 9 | 8 | 9 | 8 | 8 | 8 | 8 | **67** |
| 5 | Gmail | 생산성 | 9 | 10 | 8 | 8 | 8 | 8 | 7 | 8 | **66** |
| 6 | Calendar | 생산성 | 9 | 10 | 7 | 8 | 8 | 8 | 8 | 7 | **65** |
| 7 | Slack | 커뮤니케이션 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | **64** |
| 8 | n8n | 자동화 | 8 | 7 | 8 | 9 | 8 | 8 | 7 | 8 | **63** |
| 9 | Obsidian | 생산성 | 8 | 8 | 7 | 8 | 8 | 8 | 8 | 7 | **62** |
| 10 | Home Assistant | 스마트홈 | 7 | 8 | 7 | 9 | 8 | 8 | 7 | 7 | **61** |
| 11 | Capability Evolver | AI/ML | 7 | 8 | 7 | 8 | 7 | 7 | 7 | 9 | **60** |
| 12 | Security-check | 개발 | 8 | 8 | 6 | 8 | 7 | 7 | 9 | 7 | **60** |
| 13 | Notion | 생산성 | 8 | 7 | 7 | 8 | 7 | 8 | 8 | 6 | **59** |
| 14 | Linear | 개발 | 8 | 7 | 7 | 8 | 8 | 8 | 8 | 5 | **59** |
| 15 | Felo Search | 리서치 | 8 | 7 | 7 | 8 | 7 | 7 | 8 | 7 | **59** |
| 16-50 | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | **43-58** |

---

## 이 가이드 활용법

### 역할별 추천

| 역할 | 필수 설치 Skills | 추천 조합 |
|------|----------------|---------|
| **소프트웨어 엔지니어** | GitHub, Security-check, Linear | Codex Orchestration, n8n |
| **마케터** | Gmail, Slack, Web Browsing | Felo Search, TweetClaw, Summarize |
| **연구자** | Tavily, Web Browsing, Summarize | Obsidian, Ontology, Reddit Readonly |
| **프로젝트 매니저** | Calendar, Notion, Linear | Todoist, Slack, n8n |
| **크리에이터** | Image Generation, Felo Slides, Spotify | YouTube Digest, Voice/Vapi |
| **IoT 매니아** | Home Assistant, Philips Hue | Elgato, BambuLab 3D |

### 첫 번째 Skills 세트 빠른 설치

```bash
# 개발자 스타터 팩
clawhub install openclaw/github
clawhub install community/security-check
clawhub install community/n8n-openclaw

# 연구자 스타터 팩
clawhub install framix-team/openclaw-tavily
clawhub install community/obsidian-claw
clawhub install community/summarize

# 생산성 스타터 팩
clawhub install openclaw/gog
clawhub install community/notion-claw
clawhub install community/todoist-claw
```

:::warning 보안 알림
서드파티 Skill을 설치하기 전에 반드시 이 가이드의 [보안 가이드](./safety-guide) 페이지를 읽으세요. 커뮤니티 Skills는 OpenClaw 팀의 심사를 거치지 않았으며, 데이터 유출 위험이 있을 수 있습니다.
:::

---

## 카테고리 디렉토리

- [생산성 Skills](./productivity) — Gmail, Calendar, Obsidian, Notion, Todoist, GOG, Things 3, Summarize
- [개발 도구 Skills](./development) — GitHub, Security-check, Cron-backup, Linear, n8n, Codex Orchestration
- [커뮤니케이션 Skills](./communication) — Slack, WhatsApp CLI, Telegram Bot, AgentMail
- [리서치 Skills](./research) — Tavily, Web Browsing, Felo Search, Summarize
- [자동화 Skills](./automation) — Browser Automation, Home Assistant, n8n, IFTTT
- [AI/ML Skills](./ai-ml) — Capability Evolver, Ontology, RAG Pipeline
- [스마트홈 Skills](./smart-home) — Philips Hue, Elgato, Home Assistant, BambuLab 3D
- [미디어 Skills](./media) — Spotify, YouTube Digest, Image Generation, Felo Slides, TweetClaw
- [데이터 Skills](./data) — Apify, Firecrawl, DuckDB CRM, Reddit Readonly
- [보안 가이드](./safety-guide) — ClawHavoc 사례, VirusTotal 통합, 최소 권한 원칙
