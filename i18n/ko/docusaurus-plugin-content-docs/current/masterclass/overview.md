---
title: "MasterClass 커리큘럼 개요"
sidebar_position: 1
description: "OpenClaw MasterClass 완전 학습 로드맵 — 입문부터 전문가까지의 AI Agent 실전 과정"
keywords: [OpenClaw, MasterClass, 과정, AI agent, 학습 로드맵]
---

# MasterClass 커리큘럼 개요

**OpenClaw MasterClass**에 오신 것을 환영합니다 — 전 세계에서 가장 체계적인 OpenClaw 학습 과정입니다. 이 과정은 기초 아키텍처부터 엔터프라이즈급 배포까지 모든 측면을 다루며, 초보자에서 OpenClaw 전문가로 이끌어 줍니다.

:::tip 과정 설계 철학
각 모듈은 "개념 → 실습 → 검증"의 학습 순환을 따릅니다. 단순히 문서를 읽는 것이 아니라, 실제 AI Agent 워크플로를 직접 구축합니다.
:::

---

## 대상 수강자

| 역할 | 배울 내용 |
|------|----------|
| **소프트웨어 엔지니어** | OpenClaw 아키텍처 원리, Skill 개발, API 통합, 보안 모범 사례 |
| **DevOps / SRE** | 배포 전략, 컨테이너화, 모니터링, 프로덕션급 보안 설정 |
| **AI 연구자** | 메가 프롬프팅 전략, Memory 시스템, 멀티 Agent 협업 |
| **기술 리더** | 엔터프라이즈급 도입 전략, 보안 평가, 팀 협업 모델 |
| **고급 사용자** | 자동화 워크플로, Skill 생태계, 개인화 설정 |

---

## 선행 지식

이 과정을 시작하기 전에 다음 기초를 갖추고 있는지 확인하세요:

- **커맨드라인 사용**: Terminal / Shell 기본 명령어에 익숙
- **컨테이너 개념**: Docker 또는 Podman의 기본 동작 원리 이해
- **프로그래밍 기초**: 최소 하나의 프로그래밍 언어에 익숙 (JavaScript, Python, Go 등)
- **네트워크 기초**: HTTP, WebSocket, REST API의 기본 개념 이해
- **OpenClaw 설치 완료**: [설치 가이드](/docs/getting-started/installation)를 먼저 완료하세요

:::info 하드웨어 요구 사항
- 최소 8 GB RAM (16 GB 권장)
- 10 GB 사용 가능한 디스크 공간
- macOS 13+, Ubuntu 22.04+ 또는 Windows 11 (WSL2)
- 안정적인 네트워크 연결 (스킬 및 LLM 모델 다운로드 필요)
:::

---

## 커리큘럼 구조

이 MasterClass는 **12개 모듈**로 구성되며, 세 단계로 나뉩니다:

### 1단계: 핵심 기초 (모듈 1-5)

탄탄한 기초를 다지고 OpenClaw의 핵심 동작 원리를 이해합니다.

| 모듈 | 주제 | 예상 시간 |
|------|------|---------|
| [모듈 1: 기초 아키텍처](./module-01-foundations) | 4계층 아키텍처, 시스템 헬스 체크, 디렉토리 구조 | 2시간 |
| [모듈 2: Gateway 심층 분석](./module-02-gateway) | WebSocket 조율, 메시지 라우팅, Channel 추상화 | 2.5시간 |
| [모듈 3: Skills 시스템](./module-03-skills-system) | SKILL.md 사양, Skill 라이프사이클, 첫 번째 Skill 개발 | 3시간 |
| [모듈 4: ClawHub 마켓](./module-04-clawhub) | 설치, 배포, 심사 메커니즘, 보안 스캔 | 2시간 |
| [모듈 5: 영속 메모리](./module-05-memory) | Write-Ahead Logging, Markdown Compaction, 메모리 라이프사이클 | 2.5시간 |

### 2단계: 고급 활용 (모듈 6-9)

고급 기능을 마스터하고 복잡한 AI Agent 워크플로를 구축합니다.

| 모듈 | 주제 | 예상 시간 |
|------|------|---------|
| 모듈 6: 자동화 | Heartbeat 시스템, Cron 스케줄링, 이벤트 기반 워크플로 | 2.5시간 |
| 모듈 7: 브라우저 통합 | 브라우저 자동화, 웹 스크레이핑, 시각적 피드백 | 2시간 |
| 모듈 8: 멀티 Agent 협업 | Agent 간 통신, 작업 배분, 협업 패턴 | 3시간 |
| 모듈 9: 보안 | CVE-2026-25253, ClawHavoc 사건, 보안 강화 | 2.5시간 |

### 3단계: 프로덕션 배포 (모듈 10-12)

OpenClaw를 프로덕션 환경에 배포하고 엔터프라이즈급 요구 사항을 처리합니다.

| 모듈 | 주제 | 예상 시간 |
|------|------|---------|
| 모듈 10: 프로덕션 배포 | Podman 배포, 리버스 프록시, TLS, 모니터링 | 3시간 |
| 모듈 11: 음성 & Canvas | 음성 인터페이스, Canvas 시각화, 멀티모달 | 2시간 |
| 모듈 12: 엔터프라이즈 활용 | 팀 협업, 권한 관리, 컴플라이언스, 대규모 배포 | 3시간 |

---

## 학습 로드맵

```
1단계 (핵심 기초)              2단계 (고급 활용)              3단계 (프로덕션 배포)
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  모듈 1      │          │  모듈 6      │          │  모듈 10     │
│  기초 아키텍처│──┐       │  자동화      │──┐       │  프로덕션    │
└──────────────┘  │       └──────────────┘  │       └──────────────┘
┌──────────────┐  │       ┌──────────────┐  │       ┌──────────────┐
│  모듈 2      │  ├──────▶│  모듈 7      │  ├──────▶│  모듈 11     │
│  Gateway     │  │       │  브라우저    │  │       │  음성/Canvas │
└──────────────┘  │       └──────────────┘  │       └──────────────┘
┌──────────────┐  │       ┌──────────────┐  │       ┌──────────────┐
│  모듈 3      │  │       │  모듈 8      │  │       │  모듈 12     │
│  Skills 시스템│──┤       │  멀티 Agent  │──┘       │  엔터프라이즈│
└──────────────┘  │       └──────────────┘          └──────────────┘
┌──────────────┐  │       ┌──────────────┐
│  모듈 4      │  │       │  모듈 9      │
│  ClawHub     │──┤       │  보안        │
└──────────────┘  │       └──────────────┘
┌──────────────┐  │
│  모듈 5      │──┘
│  메모리 시스템│
└──────────────┘
```

---

## 과정 활용 방법

### 순서대로 학습

모듈 번호 순서대로 학습하는 것을 권장합니다. 각 모듈은 이전 모듈의 개념 위에 구축됩니다.

### 직접 실습

각 모듈에는 실습 과제(`실습` 블록으로 표시)가 포함되어 있습니다. 직접 OpenClaw 환경에서 이 과제를 완료하세요.

### 자가 평가

각 모듈 끝에는 다음이 있습니다:
- **연습 문제**: 심층 탐구를 장려하는 개방형 질문
- **퀴즈**: 이해도를 빠르게 확인하는 객관식 문제

### 커뮤니티 소통

문제가 있을 때:
1. 모듈 내 "일반적인 오류"와 "문제 해결" 섹션을 확인
2. [OpenClaw Discord](https://discord.gg/openclaw)의 `#masterclass` 채널에서 질문
3. [GitHub Discussions](https://github.com/openclaw/openclaw/discussions)에서 검색 또는 토론 시작

---

## 빠른 시작

준비되셨나요? 첫 번째 모듈부터 시작하세요!

```bash
# OpenClaw가 올바르게 설치되었는지 확인
openclaw --version

# 시스템 헬스 체크 실행
openclaw doctor

# MasterClass 여정 시작
openclaw start
```

:::caution 보안 알림
학습 과정에서 항상 보안 모범 사례를 준수하세요. 특히:
- 항상 `127.0.0.1`에 바인딩, `0.0.0.0`은 절대 사용 금지
- Docker보다 Podman을 우선 사용
- ClawHub에서 Skill 설치 전 반드시 심사 상태 확인
:::

**[모듈 1: OpenClaw 기초 아키텍처로 이동 →](./module-01-foundations)**

---

## OpenClaw 소개

OpenClaw는 Peter Steinberger가 만든 오픈소스 AI Agent 플랫폼으로, GitHub에서 **250,000개 이상의 스타**를 보유하고 있습니다. LLM API를 제외하면 클라우드 서비스에 의존하지 않고 완전히 로컬에서 실행되어 사용자가 데이터에 대한 완전한 통제권을 유지합니다.

### 핵심 특징

- **4계층 아키텍처**: Gateway, Reasoning Layer, Memory System, Skills/Execution Layer로 각 계층의 책임이 명확하고 독립적으로 확장 가능
- **ClawHub 마켓**: 13,000개 이상의 커뮤니티 기여 Skills, `clawhub install <author>/<skill>` 명령어로 설치
- **영속 메모리**: Write-Ahead Logging과 Markdown Compaction을 통해 Agent가 대화 간 중요 정보를 기억
- **샌드박스 보안**: 모든 Skills가 격리된 컨테이너 환경에서 실행 (Podman 권장)
- **개인화**: SOUL.md로 Agent의 성격 특성 정의, SKILL.md로 스킬 동작 정의
- **자동화**: Heartbeat 시스템으로 능동적 알림 지원, Cron 스케줄링으로 예약 작업 지원

### 퀴즈: 과정 가이드

1. **OpenClaw의 4계층 아키텍처는 각각 무엇인가요?**
   - A) Frontend, Backend, Database, Cache
   - B) Gateway, Reasoning Layer, Memory System, Skills/Execution Layer
   - C) UI, API, Storage, Network
   - D) Client, Server, Queue, Worker

2. **MasterClass를 시작하기 전 다음 중 필수 조건이 아닌 것은?**
   - A) 커맨드라인 사용 능력
   - B) 컨테이너 개념 기초
   - C) 머신러닝 전문 지식
   - D) 네트워크 기초 지식

3. **ClawHub에는 몇 개의 Skills를 사용할 수 있나요?**
   - A) 1,000+
   - B) 5,000+
   - C) 13,000+
   - D) 50,000+

<details>
<summary>정답 보기</summary>

1. **B** — Gateway, Reasoning Layer, Memory System, Skills/Execution Layer가 OpenClaw의 4계층 핵심 아키텍처입니다.
2. **C** — 머신러닝 전문 지식은 필수 조건이 아닙니다. OpenClaw는 LLM의 복잡성을 추상화하여 애플리케이션 개발에 집중할 수 있게 합니다.
3. **C** — ClawHub 마켓은 현재 13,000개 이상의 커뮤니티 기여 Skills를 제공합니다.

</details>
