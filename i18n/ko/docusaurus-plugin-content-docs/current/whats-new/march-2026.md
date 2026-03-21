---
title: 2026년 3월 최신 소식
description: OpenClaw 2026년 3월 주요 업데이트 총정리 — 공식 변경 사항, 생태계 동향, 보안 공지, 커뮤니티 보고 변화.
sidebar_position: 1
---

# 2026년 3월 최신 소식

이 문서는 2026년 3월 20일 기준으로 OpenClaw 생태계의 주요 업데이트와 변화를 정리한 것입니다.

:::info 정보 출처
이 문서는 공식 공지, GitHub releases, Reddit 커뮤니티 토론, 보안 연구 보고서 등 다양한 출처를 종합한 것입니다. "커뮤니티 보고"로 표시된 내용은 아직 공식 확인되지 않았습니다.
:::

---

## 요약

2026년 1분기는 OpenClaw에 있어 보안 의식이 각성한 분기였습니다. CVE-2026-25253의 공개, Bitdefender의 보안 감사 보고서, ClawHavoc 사건의 여파가 커뮤니티와 코어 팀으로 하여금 보안을 최우선 과제로 격상시켰습니다. 동시에 Nvidia와 Tencent 같은 테크 대기업이 OpenClaw 생태계에 투입되면서 플랫폼에 새로운 성장 동력이 생겼습니다.

### 이번 달 핵심 수치

| 지표 | 수치 |
|------|------|
| GitHub Stars | 250,000+ |
| ClawHub 스킬 수 | 13,000+ |
| 알려진 노출 인스턴스 (Bitdefender) | 135,000 |
| 확인된 해킹 인스턴스 | 30,000+ |
| ClawHavoc 악성 스킬 (제거됨) | 2,400+ |

---

## 공식 변경 사항

### 1. CVE-2026-25253 패치

**영향 수준: Critical (CVSS 9.8)**

Gateway 원격 코드 실행 취약점이 최신 버전에서 패치되었습니다. 이 취약점은 v3.x 이전의 모든 버전에 영향을 미치며, 공격자가 노출된 18789 포트를 통해 임의 코드를 실행할 수 있었습니다.

```bash
# 버전 확인
openclaw --version

# 최신 버전으로 업그레이드
npm install -g @openclaw/cli@latest

# 패치 상태 확인
openclaw doctor --security
```

:::danger 즉시 조치 필요
OpenClaw 버전이 최신 패치 버전보다 낮으면 **즉시 업그레이드**하세요. 이 취약점은 현재 활발히 악용되고 있습니다.
:::

### 2. ClawHub VirusTotal 통합

ClawHavoc 사건 이후, ClawHub 플랫폼에 VirusTotal 스캔 통합이 추가되었습니다. 새로 업로드되는 모든 스킬은 자동으로 VirusTotal 스캔을 거치며, 스킬 페이지에 스캔 결과가 표시됩니다.

**새로운 CLI 명령어:**
```bash
# 스킬의 VirusTotal 스캔 결과 확인
openclaw skill virustotal <skill-name>

# 의심스러운 스킬 신고
openclaw skill report <skill-name> --reason "의심스러운 동작 설명"
```

### 3. Gateway 기본 보안 강화

새 버전의 OpenClaw에서 `openclaw init` 시 기본 설정이 더 안전하게 변경되었습니다:

| 설정 항목 | 이전 기본값 | 새 기본값 |
|--------|--------|--------|
| `gateway.bind` | `0.0.0.0` | **`127.0.0.1`** |
| `gateway.auth.enabled` | `false` | **`true`** |
| `gateway.auth.token` | 없음 | **자동 생성** |
| `execution.engine` | `docker` | **`podman`** (설치 시) |

### 4. 스킬 서명 검증 메커니즘 (Beta)

코어 팀이 스킬 서명 검증의 Beta 버전을 출시했습니다. 인증된 스킬 개발자가 자신의 스킬에 디지털 서명을 할 수 있으며, 사용자 설치 시 자동으로 서명을 검증합니다.

```bash
# 서명된 스킬만 설치
openclaw skill install --signed-only <skill-name>

# 스킬 서명 상태 확인
openclaw skill info <skill-name> | grep signature
```

### 5. 메모리 시스템 v2 프리뷰

메모리 시스템의 대규모 리팩토링이 진행 중입니다. v2에서 도입 예정인 기능:
- 벡터화 메모리 검색 (순수 텍스트 매칭 대체)
- 메모리 계층화 (공개 / 비공개 / 민감)
- 자동 비식별화 기능
- 크로스 Agent 메모리 공유 (opt-in)

현재 플래그로 프리뷰를 활성화할 수 있습니다:
```bash
openclaw start --experimental-memory-v2
```

---

## 생태계 동향

### 6. Nvidia OpenClaw 가속 솔루션 발표

Nvidia가 GTC 2026에서 OpenClaw용 GPU 가속 지원(NemoClaw 프로젝트)을 발표했습니다. 주요 용도:
- 로컬 LLM 추론 가속 (Ollama + CUDA 연동)
- browser-use 스킬의 GPU 렌더링
- 음성 인식 (Whisper) 가속
- 향후 벡터 메모리 검색

```bash
# Nvidia GPU 지원 활성화
openclaw config set execution.gpu.enabled true
openclaw config set execution.gpu.runtime nvidia
```

### 7. Tencent OpenClaw 중국어 생태계 패키지 오픈소스 공개

Tencent가 중국어 사용자를 위한 일련의 OpenClaw 도구를 오픈소스로 공개했습니다:
- **WeChat 공식 Adapter** — 커뮤니티 유지보수 WeChatFerry 불필요
- **중국어 음성 인식 모델** — Whisper보다 정확한 중국어 STT
- **중국어 SOUL.md 템플릿** — 중국어 맥락에 최적화된 성격 설정
- **Feishu(Lark) Adapter** — 엔터프라이즈급 메신저 플랫폼 지원

:::tip 중국 국영 기업 제한 사항
중국 국영 기업(SOE)의 컴플라이언스 요구 사항으로 인해 일부 국영 기업에서는 OpenClaw 사용에 제한이 있습니다. 배포 전 소속 조직의 AI 도구 사용 정책을 확인하세요.
:::

### 8. Composio MCP 대규모 업데이트

Composio 플랫폼에 50개 이상의 새로운 MCP connector가 추가되었습니다:
- Reddit OAuth (읽기/쓰기)
- Notion Database API
- Linear (프로젝트 관리)
- Figma (디자인 파일 읽기)
- Airtable (데이터베이스)

---

## 보안 공지

### 9. Bitdefender 감사 보고서

Bitdefender가 2026년 초 OpenClaw 보안 감사 보고서를 발표했습니다. 주요 발견:

| 발견 사항 | 심각도 | 상태 |
|---------|--------|------|
| 135,000개 공개 접근 가능 인스턴스 | Critical | 지속 모니터링 |
| Gateway API 미인증 비율 > 60% | Critical | 새 버전에서 개선 |
| Docker root daemon 사용 비율 > 70% | High | Podman 지속 권장 |
| 미업데이트 버전(알려진 취약점 포함) > 40% | High | 업데이트 알림 푸시 |
| 스킬 설치 전 검토 비율 < 10% | Medium | VirusTotal 추가 |

### 10. ClawHavoc 사건 후속 조치

ClawHavoc 사건의 후속 처리 현황:

- **악성 스킬 제거**: 2,400개 이상의 악성 스킬이 ClawHub에서 모두 제거됨
- **영향받은 사용자 통지**: 악성 스킬을 설치한 모든 사용자에게 통지 완료
- **API Key 유출**: 수천 개의 API key가 탈취된 것으로 추정, 모든 사용자에게 교체 권고
- **개선 조치**: VirusTotal 스캔, 스킬 서명, 강화된 심사 프로세스

:::warning 2025년 10월~2026년 1월 사이에 잘 모르는 스킬을 설치한 경우
즉시 다음을 수행하세요:
1. `openclaw skill list`를 실행하여 설치된 스킬 확인
2. 의심스러운 스킬 제거
3. 모든 API key 교체
4. LLM 제공자 청구서에 이상이 없는지 확인
:::

### 11. 18789 포트 스캔 지속 증가

보안 연구자들의 보고에 따르면, CVE-2026-25253 공개 이후 18789 포트에 대한 네트워크 스캔 활동이 크게 증가했습니다. Shodan 스캔 결과:

- 2025년 12월: 80,000개 노출 인스턴스
- 2026년 1월: 120,000개 노출 인스턴스
- 2026년 2월: 135,000개 노출 인스턴스
- 추세: 지속 증가 중

---

## 호환성 변경 사항 (Breaking Changes)

### 12. gateway.yaml 형식 변경

v3.2.0부터 `gateway.yaml` 형식이 다음과 같이 변경되었습니다:

```yaml
# 이전 형식 (v3.1.x 이하)
gateway:
  host: "0.0.0.0"
  port: 18789

# 새 형식 (v3.2.0+)
gateway:
  bind: "127.0.0.1"    # "host"가 "bind"로 변경
  port: 18789
  auth:                  # 인증 블록 추가
    enabled: true
    token: "..."
```

```bash
# 자동 마이그레이션
openclaw migrate
```

### 13. Skill manifest 형식 v2

스킬의 `manifest.yaml` 형식이 업데이트되어 권한 선언 블록이 추가되었습니다:

```yaml
# 새 형식 요구 사항
name: my-skill
version: 2.0.0
manifest_version: 2       # 추가: 반드시 2여야 함
permissions:               # 추가: 반드시 권한을 명시적으로 선언
  network:
    enabled: true
    domains: ["api.example.com"]
  filesystem:
    enabled: false
  shell:
    enabled: false
  environment:
    enabled: false
```

이전 형식의 스킬은 경고를 받으며, 향후 버전에서 지원이 중단됩니다.

---

## 타임라인

| 날짜 | 이벤트 |
|------|------|
| 2025년 10월 | ClawHavoc 사건 시작 (악성 스킬 ClawHub에 심어짐) |
| 2025년 12월 | ClawHavoc 발견 및 제거 시작 |
| 2026년 1월 초 | CVE-2026-25253 공개 |
| 2026년 1월 중순 | CVE-2026-25253 패치 버전 릴리스 |
| 2026년 1월 말 | ClawHub VirusTotal 통합 출시 |
| 2026년 2월 초 | Bitdefender 보안 감사 보고서 발표 |
| 2026년 2월 중순 | Gateway 기본 보안 강화; Peter Steinberger OpenAI 합류 |
| 2026년 2월 말 | Nvidia GTC 2026에서 NemoClaw GPU 가속 솔루션 발표 |
| 2026년 3월 초 | Tencent 중국어 생태계 패키지 오픈소스 공개; WeChat 통합 릴리스 |
| 2026년 3월 중순 | 스킬 서명 검증 Beta 출시 |
| 2026년 3월 중순 | 메모리 시스템 v2 프리뷰 공개 |

---

## 권장 조치

이번 달 업데이트를 바탕으로 모든 OpenClaw 사용자에게 권장하는 사항:

### 즉시 (오늘)

1. **최신 버전으로 업그레이드** — CVE-2026-25253 패치
2. **Gateway가 `127.0.0.1`에 바인딩되어 있는지 확인** — `0.0.0.0`이 아닌지 확인
3. **Gateway 인증 활성화** — auth token 설정
4. **모든 API key 교체** — 특히 ClawHavoc 기간에 사용한 것

### 이번 주 내

5. **설치된 스킬 검토** — 불필요하거나 의심스러운 스킬 제거
6. **Podman rootless로 전환** — 아직 Docker를 사용 중이라면
7. **방화벽 규칙 설정** — 18789의 외부 접근 차단

### 이번 달 내

8. **보안 모범 사례 읽기** — [전체 가이드](/docs/security/best-practices)
9. **스킬 심사 프로세스 수립** — [스킬 감사 체크리스트](/docs/security/skill-audit-checklist)
10. **새 기능 시험** — 메모리 시스템 v2 프리뷰, 스킬 서명 검증

---

## 추가 읽을거리

- [보안 모범 사례](/docs/security/best-practices) — 전체 보안 가이드
- [위협 모델 분석](/docs/security/threat-model) — 모든 공격 벡터 이해
- [아키텍처 개요](/docs/architecture/overview) — 최신 아키텍처 변경 사항
- [FAQ](/docs/faq) — 자주 묻는 질문
