---
slug: openclaw-history
title: "OpenClaw 이야기: Clawdbot에서 25만 스타까지"
authors: [openclaw-masterclass]
tags: [openclaw, history, community]
image: /img/docusaurus-social-card.jpg
description: OpenClaw의 완전한 발전사 — Peter Steinberger의 개인 프로젝트 Clawdbot에서 OpenClaw로의 리브랜딩을 거쳐 250K GitHub Stars에 이르는 전설적인 여정.
---

# OpenClaw 이야기: Clawdbot에서 25만 스타까지

모든 위대한 오픈소스 프로젝트 뒤에는 매력적인 이야기가 있습니다. OpenClaw의 여정 — 개인 사이드 프로젝트에서 250,000개 이상의 GitHub Stars를 보유한 현상급 프로젝트로 — 은 오픈소스 정신을 가장 잘 보여주는 사례입니다.

<!-- truncate -->

## 시작: Clawdbot (2024년 중반)

이야기는 **Peter Steinberger**에서 시작됩니다. Steinberger는 iOS 개발 커뮤니티의 저명한 인물로, PSPDFKit(이후 Nutrient)의 창업자이며 연쇄 창업가이자 오픈소스 옹호자입니다.

2024년 중반, Steinberger는 개인 실험 프로젝트인 **Clawdbot**를 시작했습니다. 처음 구상은 단순했습니다: 여러 메시징 플랫폼에 연결할 수 있는 AI 챗봇 프레임워크를 구축하는 것이었습니다. 그의 목표는 다음과 같았습니다:

- 하나의 통합 인터페이스로 여러 메시징 플랫폼을 관리
- 플러그인 방식의 기능 확장 지원
- 비기술 인력도 쉽게 AI 어시스턴트를 배포할 수 있도록 하기

Clawdbot이라는 이름은 "Claw"(발톱)와 "Bot"의 결합에서 왔으며, 랍스터 이미지는 여기서 탄생했습니다.

## 진화: Moltbot (2024년 말)

프로젝트가 성장하면서 Steinberger는 원래 설계를 대폭 개편해야 한다는 것을 깨달았습니다. 랍스터가 성장하기 위해 탈피(Molt)해야 하는 것처럼, 프로젝트도 자체적인 "탈피"를 경험했습니다.

2024년 말, Clawdbot는 **Moltbot**으로 재구축되며 완전히 새로운 아키텍처를 도입했습니다:

- **3계층 아키텍처 설계**: Gateway(연결 계층) → Agent(프록시 계층) → Skill(기능 계층)
- **WebSocket 실시간 통신**: 기존 REST polling 방식을 대체
- **Skill Marketplace 프로토타입**: 개발자가 자신의 Skill을 공유할 수 있도록 지원

Moltbot은 소규모 개발자 커뮤니티에서 주목을 받았고, GitHub Stars는 불과 몇 주 만에 10,000을 돌파했습니다.

## 전환점: OpenClaw로 리브랜딩 (2026년 1월)

2026년 1월, 프로젝트는 가장 중요한 이정표 중 하나에 도달했습니다 — **OpenClaw**로의 공식 리브랜딩입니다.

이것은 단순한 이름 변경이 아니었습니다. 프로젝트 방향의 근본적인 전환을 의미했습니다:

1. **완전한 오픈소스 거버넌스**: OpenClaw Foundation을 설립하고 커뮤니티 주도 거버넌스를 도입
2. **엔터프라이즈 기능**: RBAC(역할 기반 접근 제어), 감사 로그, SSO 통합 추가
3. **다국어 지원**: 기존 TypeScript/JavaScript 외에 Python, Go, Rust, Java SDK 추가
4. **공식 Skill Marketplace**: 13,000개 이상의 커뮤니티 기여 Skill

리브랜딩 이후 프로젝트의 성장 속도는 놀라웠습니다. 불과 2개월 만에 GitHub Stars가 50,000에서 150,000으로 급상승했습니다.

## Peter Steinberger, OpenAI 합류 (2026년 2월)

2026년 2월, 오픈소스 커뮤니티를 뒤흔든 소식이 전해졌습니다 — **Peter Steinberger가 OpenAI에 합류**한 것입니다.

Steinberger는 OpenAI에서 "AI Agent 인프라"에 집중하는 새 팀을 이끌게 되었습니다. 이 결정은 커뮤니티에서 광범위한 논의를 불러일으켰습니다:

> "이것이 OpenClaw에 무엇을 의미하는가?"

Steinberger는 발표에서 다음 사항을 분명히 했습니다:

- OpenClaw는 독립적인 오픈소스 프로젝트로 계속 운영될 것
- OpenClaw Foundation은 이미 견고한 커뮤니티 거버넌스 체계를 구축했음
- 그는 고문 자격으로 OpenClaw의 방향성에 계속 참여할 것

결과적으로, 이 결정은 오히려 OpenClaw에 더 많은 관심과 리소스를 가져왔습니다. OpenAI도 OpenClaw Foundation의 기업 스폰서 중 하나가 되었습니다.

## 25만 스타 이정표 (2026년 3월)

2026년 3월, OpenClaw는 공식적으로 **250,000 GitHub Stars**를 돌파하여 GitHub에서 가장 빠르게 성장하는 오픈소스 프로젝트 중 하나가 되었습니다.

이 숫자 뒤에는 다음이 있습니다:

- **활발한 기여자**: 전 세계에서 2,000명 이상의 기여자
- **Skill 생태계**: 생산성, 개발 도구, 커뮤니티 관리 등 다양한 분야를 아우르는 13,000개 이상의 커뮤니티 Skill
- **플랫폼 통합**: 20개 이상의 메시징 플랫폼 지원(Slack, Discord, Teams, LINE, Telegram, WhatsApp 등)
- **엔터프라이즈 채택**: 수백 개의 기업이 프로덕션 환경에서 OpenClaw 사용
- **언어 지원**: 5개 프로그래밍 언어의 공식 SDK

## 타임라인 개요

| 시기 | 이벤트 |
|------|--------|
| 2024년 중반 | Peter Steinberger가 Clawdbot 프로젝트 시작 |
| 2024년 말 | 3계층 아키텍처를 도입하여 Moltbot으로 재구축 |
| 2025년 | Moltbot 지속적 성장, 커뮤니티 확대 |
| 2026년 1월 | OpenClaw로 공식 리브랜딩, Foundation 설립 |
| 2026년 2월 | Steinberger OpenAI 합류 |
| 2026년 3월 | 250K GitHub Stars 돌파 |

## 미래 전망

OpenClaw의 이야기는 아직 끝나지 않았습니다. 커뮤니티가 적극적으로 개발 중인 기능은 다음과 같습니다:

- **OpenClaw Cloud**: 원클릭 배포를 위한 공식 호스팅 서비스
- **Skill Studio**: 비주얼 Skill 개발 도구
- **Agent Orchestration**: 멀티 Agent 협업 프레임워크
- **Edge Deployment**: 엣지 디바이스에서의 OpenClaw 실행 지원

한 사람의 사이드 프로젝트에서 글로벌 오픈소스 현상으로. OpenClaw의 여정은 한 가지를 증명합니다: **훌륭한 아이디어와 열린 커뮤니티가 만나면 세상을 바꿀 수 있다.**

🦞

---

*OpenClaw MasterClass 팀*
