---
title: 자주 묻는 질문 FAQ
description: OpenClaw에 대해 가장 많이 묻는 질문들 — 기본 개념, 보안, 비용부터 고급 사용까지 완전한 FAQ.
sidebar_position: 99
---

# 자주 묻는 질문 FAQ

이 페이지에는 OpenClaw 초보자와 고급 사용자가 가장 많이 제기하는 질문들을 모았습니다.

---

## 기본 개념

### Q: OpenClaw는 무엇인가요? ChatGPT와 어떻게 다른가요?

**A:** OpenClaw는 사용자의 컴퓨터에서 실행되는 오픈소스 **자율 AI Agent 플랫폼**입니다. ChatGPT와의 주요 차이점:

| 비교 항목 | ChatGPT | OpenClaw |
|---------|---------|---------|
| 실행 위치 | OpenAI 클라우드 | 로컬 컴퓨터 |
| 데이터 관리 | OpenAI가 소유 | 사용자가 직접 관리 |
| 자율 행동 | 대화만 가능 | 자율적 작업 수행 (이메일 발송, 가전 제어 등) |
| 멀티 플랫폼 | ChatGPT 인터페이스만 | 20+ 메신저 플랫폼 (Telegram, Discord 등) |
| 확장성 | 제한적인 GPTs | 13,000+ ClawHub 스킬 |
| 비용 | 월정액 | 오픈소스 무료 (LLM API 비용 별도) |

### Q: OpenClaw는 무료인가요?

**A:** OpenClaw 자체는 **오픈소스 무료**(MIT 라이선스)입니다. 하지만 다음 비용은 직접 부담해야 합니다:

- **LLM API 비용** — Claude, GPT 등 클라우드 모델 사용 시 유료. Ollama와 로컬 모델 사용 시 무료.
- **메신저 플랫폼** — 대부분 무료 (Telegram Bot, Discord Bot 등), 일부 유료 가능.
- **하드웨어** — 본인의 컴퓨터 또는 서버.

일반적인 월 비용:

| 사용 정도 | 예상 월 비용 |
|---------|---------|
| 경도 (하루 몇 번 대화) | $5-15 |
| 중도 (일상 어시스턴트) | $15-50 |
| 고도 (멀티 Agent + 자동화) | $50-200+ |
| 완전 로컬 (Ollama) | $0 (전기세 제외) |

### Q: "랍스터 키우기"는 무슨 뜻인가요?

**A:** OpenClaw의 아시아 커뮤니티 별명입니다. "Claw"(집게발)는 랍스터의 발이며, OpenClaw의 마스코트 **Molty**는 랍스터입니다. 사용자들이 OpenClaw Agent를 설정하고 훈련하는 과정을 "랍스터 키우기"에 비유합니다 — 먹이 주기(SOUL.md 설정), 훈련(기억 축적), 돌보기(유지보수 및 업데이트)가 필요합니다.

### Q: 프로그래밍을 할 줄 알아야 OpenClaw를 사용할 수 있나요?

**A:** 기본 사용에는 프로그래밍 능력이 필요 없습니다. 설치와 설정은 튜토리얼 단계를 따라하면 됩니다. 일상적인 사용은 메신저(예: Telegram)를 통해 Agent와 대화하는 것입니다.

고급 사용(커스텀 스킬 개발, API 통합, 멀티 Agent 배포)에는 프로그래밍 기초가 필요합니다.

---

## 보안

### Q: OpenClaw는 안전한가요?

**A:** OpenClaw 자체의 설계는 안전하지만, **잘못된 설정**은 심각한 보안 위험을 초래합니다. 알려진 보안 문제:

- **CVE-2026-25253**: Gateway 원격 코드 실행 취약점 (패치 완료)
- **ClawHavoc**: 2,400+ 악성 스킬이 ClawHub에 심어짐 (제거 완료)
- **30,000+ 인스턴스**가 Gateway 포트 노출로 침해당함

**올바르게 설정**(localhost 바인딩, 인증 활성화, Podman rootless 사용)하면 OpenClaw는 안전합니다. [보안 모범 사례](/docs/security/best-practices)를 참조하세요.

### Q: 대화 데이터가 업로드되나요?

**A:** OpenClaw 자체는 데이터를 **업로드하지 않습니다**. 하지만 사용하는 LLM 제공자가 대화 내용을 수신합니다:

- **클라우드 LLM** (Claude, GPT 등): 대화가 제공자의 서버로 전송되어 처리됨
- **로컬 LLM** (Ollama): 모든 데이터가 컴퓨터에 남으며 완전 오프라인

프라이버시를 극도로 중시한다면 Ollama와 로컬 모델 사용을 권장합니다.

### Q: ClawHub의 스킬은 안전한가요?

**A:** ClawHub의 스킬은 커뮤니티 개발자가 제출한 것으로 **안전을 보장하지 않습니다**. ClawHavoc 사건 이후 VirusTotal 스캔이 추가되었지만, 자동 스캔으로 모든 악성 동작을 감지할 수는 없습니다.

스킬 설치 전 [스킬 감사 체크리스트](/docs/security/skill-audit-checklist) 검사를 완료하세요.

### Q: 왜 Docker 대신 Podman을 권장하나요?

**A:** Docker daemon은 root 권한으로 실행됩니다. 스킬 샌드박스가 돌파되면 공격자가 호스트의 root 권한을 획득할 수 있습니다. Podman의 rootless 모드는 root가 필요 없어 샌드박스가 돌파되어도 일반 사용자 권한만 획득할 수 있어 위험을 크게 줄여줍니다.

---

## 설치 및 설정

### Q: OpenClaw는 어떤 운영 체제를 지원하나요?

**A:**

| 운영 체제 | 지원 상태 |
|---------|---------|
| macOS 13+ | 완전 지원 |
| Ubuntu 22.04+ | 완전 지원 |
| Debian 12+ | 완전 지원 |
| Fedora 38+ | 완전 지원 |
| Arch Linux | 커뮤니티 지원 (AUR) |
| Windows 11 (WSL2) | 지원 (WSL2 필요) |
| Windows (네이티브) | 미지원 |
| ChromeOS | 미지원 |

### Q: 최소 하드웨어 요구 사항은?

**A:**

| 항목 | 최소 | 권장 | 고사용 |
|------|------|------|-------|
| CPU | 2코어 | 4코어 | 8+코어 |
| RAM | 4 GB | 8 GB | 16+ GB |
| 디스크 | 2 GB | 5 GB | 20+ GB |
| GPU | 불필요 | 불필요 | Nvidia (로컬 LLM 가속) |

### Q: OpenClaw를 어떻게 업데이트하나요?

**A:**
```bash
# npm 설치
npm install -g @openclaw/cli@latest

# Homebrew 설치
brew upgrade openclaw

# 업데이트 후 마이그레이션 실행
openclaw migrate

# 확인
openclaw doctor
```

---

## LLM 및 모델

### Q: OpenClaw는 어떤 LLM을 지원하나요?

**A:** 모든 주요 LLM 제공자를 지원합니다:

| 제공자 | 모델 | 적합한 용도 |
|--------|------|---------|
| Anthropic | Claude Opus 4.6, Sonnet 4.5 | 범용 대화, 복잡한 추론 |
| OpenAI | GPT-5.2 Codex, GPT-4.1 | 코드 생성, 범용 대화 |
| Google | Gemini 2.5 Pro | 멀티모달, 긴 컨텍스트 |
| DeepSeek | DeepSeek-V3 | 가성비 우수 |
| Ollama (로컬) | Llama 3.3, Qwen 2.5, Mistral | 오프라인 사용, 프라이버시 우선 |
| Groq | 다양한 오픈소스 모델 | 초저지연 |

### Q: 어떤 모델이 가장 좋나요?

**A:** 필요에 따라 다릅니다:

- **최고의 범용 대화**: Claude Opus 4.6
- **최고의 코드 생성**: GPT-5.2 Codex
- **최고의 가성비**: DeepSeek-V3 또는 Claude Sonnet 4.5
- **최고의 프라이버시**: Ollama + Llama 3.3 (완전 로컬)
- **최저 지연**: Groq

여러 모델을 설정하고 LLM Router를 사용하여 작업 유형에 따라 자동 라우팅하는 것을 권장합니다.

---

## 스킬 및 ClawHub

### Q: 추천 스킬은 무엇인가요?

**A:** [Top 50 필수 설치 Skills](/docs/top-50-skills/overview)를 참조하세요. 카테고리별 추천 스킬과 보안 등급이 포함되어 있습니다.

### Q: 스킬을 직접 개발할 수 있나요?

**A:** 스킬은 본질적으로 OpenClaw manifest 형식을 따르는 Node.js 또는 Python 프로그램입니다. 기본 단계:

1. `manifest.yaml`에 스킬 메타데이터와 권한 선언
2. 주요 로직 작성 (`index.js` 또는 `main.py`)
3. 로컬 테스트
4. ClawHub에 배포

자세한 내용은 [MasterClass 모듈 3: Skills 시스템](/docs/masterclass/module-03-skills-system)을 참조하세요.

---

## 메신저 플랫폼

### Q: 여러 메신저 플랫폼에 동시에 연결할 수 있나요?

**A:** 네. OpenClaw의 핵심 기능 중 하나입니다. Telegram, Discord, WhatsApp, Slack, LINE 등 여러 플랫폼에 동시 연결할 수 있으며, 모든 메시지가 동일한 Agent에 의해 처리됩니다.

### Q: Agent가 다른 플랫폼 간에 기억을 공유하나요?

**A:** 네. 메모리 시스템은 통합되어 있으며, 사용자가 어떤 플랫폼에서 메시지를 보내든 Agent는 전체 기억에 접근할 수 있습니다.

### Q: 플랫폼별로 다른 응답 스타일을 설정할 수 있나요?

**A:** 네. SOUL.md에서 플랫폼별로 다른 동작을 설정할 수 있습니다:

```markdown
## 플랫폼별 동작
- Telegram: 간결한 응답, 이모지 사용
- Slack: 전문적 응답, Markdown 형식 사용
- Discord: 구어체, 유머 허용
```

---

## 메모리 및 SOUL.md

### Q: SOUL.md란 무엇인가요?

**A:** SOUL.md는 Agent의 성격, 행동 규칙, 보안 경계, 일상 작업을 정의하는 Markdown 파일입니다. Agent의 "영혼"으로서, Agent가 어떻게 생각하고 행동할지를 결정합니다.

### Q: Agent가 얼마나 오래된 대화를 기억할 수 있나요?

**A:** 이론적으로 무한합니다. OpenClaw의 메모리 시스템은 모든 대화를 WAL에 저장하고 주기적으로 장기 기억으로 압축합니다. 하지만 각 상호작용에서 Agent는 LLM의 컨텍스트 윈도우 제한 내에서 최근 대화와 관련 장기 기억에만 접근할 수 있습니다.

### Q: Agent가 특정 내용을 잊게 하려면 어떻게 하나요?

**A:**
```bash
# 특정 대화 삭제
openclaw memory delete --conversation-id "conv_abc123"

# 특정 기간 정리
openclaw memory prune --before "2025-01-01"

# 완전 초기화
openclaw memory reset --confirm
```

---

## 커뮤니티 및 학습

### Q: 문제가 생기면 어디서 도움을 받나요?

**A:**

1. [이 사이트의 문제 해결](/docs/troubleshooting/common-issues) — 일반적인 문제의 즉시 해답
2. [GitHub Issues](https://github.com/openclaw/openclaw/issues) — 공식 버그 리포트
3. [Discord #help](https://discord.gg/openclaw) — 실시간 커뮤니티 지원
4. [Reddit r/openclaw](https://reddit.com/r/openclaw) — 토론 및 과거 문제 검색

### Q: 공식 학습 과정이 있나요?

**A:** 이 사이트의 [MasterClass 과정](/docs/masterclass/overview)이 현재 가장 완전한 학습 자료이며, 기초부터 고급까지 12개 모듈을 다룹니다.

---

## 추가 읽을거리

- [OpenClaw란 무엇인가?](/docs/intro) — 완전 소개
- [설치 가이드](/docs/getting-started/installation) — 시작하기
- [MasterClass 과정](/docs/masterclass/overview) — 체계적 학습
- [용어집](/docs/glossary) — 용어 설명
