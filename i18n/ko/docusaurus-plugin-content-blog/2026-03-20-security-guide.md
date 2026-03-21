---
slug: security-guide
title: OpenClaw 보안 완전 가이드
authors: [openclaw-masterclass]
tags: [openclaw, security]
image: /img/docusaurus-social-card.jpg
description: OpenClaw 보안 완전 가이드 — ClawHavoc 사건, CVE-2026-25253 취약점, 0.0.0.0 바인딩 위험, 그리고 개인 및 기업의 보안 모범 사례를 상세히 알아봅니다.
---

# OpenClaw 보안 완전 가이드

보안은 AI Agent 프레임워크를 배포할 때 가장 중요한 고려 사항 중 하나입니다. 이 글에서는 OpenClaw의 보안 관련 주제를 심층적으로 다루며, 알려진 취약점, 과거 사건, 그리고 개인 및 기업 사용자를 위한 모범 사례를 살펴봅니다.

<!-- truncate -->

## ClawHavoc: 주요 보안 사건

2026년 2월, 보안 연구팀 **Lobster Security Labs**가 **ClawHavoc**라 불리는 일련의 보안 취약점을 발견했습니다. 이 취약점은 OpenClaw Gateway의 핵심 통신 메커니즘에 영향을 미치며, 악용될 경우 공격자가 다음을 수행할 수 있었습니다:

1. **Agent 제어 인터페이스에 무단 접근**: 인증 메커니즘을 우회하여 Agent에 직접 명령 전송
2. **Skills 인젝션 공격**: 대상 인스턴스에 악성 Skill 로드
3. **대화 데이터 유출**: Agent와 사용자 간의 통신 내용 가로채기

### ClawHavoc의 영향 범위

- **영향받는 버전**: OpenClaw v3.8.0 ~ v4.1.2
- **심각도**: Critical (CVSS 9.1)
- **수정 버전**: OpenClaw v4.1.3+

OpenClaw 보안팀은 보고를 접수한 후 48시간 이내에 패치를 배포했으며, Gateway의 자동 업데이트 메커니즘을 통해 자동 업데이트가 활성화된 모든 인스턴스에 전달했습니다.

### 교훈

ClawHavoc 사건은 커뮤니티에 중요한 교훈을 남겼습니다:

- AI Agent 프레임워크는 기존 웹 애플리케이션보다 더 넓은 공격 표면을 가짐
- Skill의 동적 로딩 메커니즘에는 더 엄격한 검증이 필요
- 실시간 메시징의 암호화는 전송 계층에만 의존해서는 안 됨

## CVE-2026-25253: WebSocket 인증 우회

**CVE-2026-25253**은 ClawHavoc 중 가장 심각한 개별 취약점으로, OpenClaw Gateway의 WebSocket 연결 인증 메커니즘에 영향을 미칩니다.

### 취약점 상세

OpenClaw Gateway는 기본적으로 **포트 18789**에서 WebSocket 연결을 수신합니다. 영향받는 버전에서는 WebSocket 핸드셰이크 단계에 경합 조건(Race Condition)이 존재했습니다:

```
공격자 → 조작된 WebSocket 업그레이드 요청 전송
       → 인증 토큰 검증이 완료되기 전에 악성 프레임 주입
       → Gateway가 악성 프레임을 인증된 명령으로 처리
```

### 기술적 세부 사항

문제는 Gateway의 연결 상태 머신에 있었습니다:

1. 클라이언트가 WebSocket 연결을 시작
2. Gateway가 연결을 수신하고 Bearer Token 검증을 시작
3. **취약점**: 검증이 완료되기 전에 Gateway의 메시지 큐가 이미 프레임 수신을 시작
4. 공격자가 이 타이밍 윈도우를 이용하여 명령 프레임을 주입

### 수정 방법

수정은 "Connection Staging" 메커니즘을 도입했습니다:

- WebSocket 연결이 수립된 후 Staging 상태로 진입
- Staging 상태에서 수신된 모든 프레임은 처리되지 않고 버퍼링
- 인증이 완료된 후에만 연결이 Active 상태로 전환
- 타임아웃(기본 5초) 내에 인증이 완료되지 않은 연결은 자동으로 종료

## 0.0.0.0 바인딩 위험

이것은 흔히 간과되지만 매우 위험한 설정 문제입니다.

### 0.0.0.0 바인딩이란?

OpenClaw Gateway의 기본 설정은 WebSocket 서비스를 `0.0.0.0:18789`에 바인딩합니다. 이는 Gateway가 **모든 네트워크 인터페이스**에서 연결 요청을 수신한다는 의미입니다.

### 왜 위험한가?

다음 시나리오에서 0.0.0.0 바인딩은 심각한 보안 위험을 초래합니다:

| 시나리오 | 위험 |
|---------|------|
| 공용 Wi-Fi에 연결된 개발 환경 | Gateway가 로컬 네트워크에 노출 |
| 방화벽 미설정 클라우드 VM | Gateway가 공용 인터넷에 노출 |
| 호스트 네트워크 모드의 Docker 컨테이너 | Gateway가 호스트의 모든 인터페이스에 노출 |
| 멀티 테넌트 환경 | 다른 테넌트가 Gateway에 접근 가능 |

### 올바른 바인딩 설정

**개인 개발 환경:**

```yaml
# openclaw.config.yaml
gateway:
  host: "127.0.0.1"  # 루프백에서만 수신
  port: 18789
```

**프로덕션 환경 (리버스 프록시 사용):**

```yaml
# openclaw.config.yaml
gateway:
  host: "127.0.0.1"  # Gateway는 리버스 프록시에서 오는 연결만 수락
  port: 18789

# Nginx/Caddy가 TLS 종단 및 외부 연결 담당
```

**Docker 환경:**

```yaml
# docker-compose.yml
services:
  openclaw-gateway:
    ports:
      - "127.0.0.1:18789:18789"  # "18789:18789"을 사용하지 마세요
```

## 개인 사용자 보안 모범 사례

### 1. 항상 최신 버전 유지

```bash
# 현재 버전 확인
openclaw version

# 최신 버전으로 업데이트
openclaw update

# 자동 보안 업데이트 활성화
openclaw config set auto-security-update true
```

### 2. 강력한 인증 사용

```yaml
# openclaw.config.yaml
auth:
  type: "bearer"
  token_rotation: true
  token_ttl: "24h"
  # 기본 토큰을 사용하지 마세요!
  # 강력한 토큰 생성: openclaw auth generate-token
```

### 3. Skill 권한 제한

```yaml
# 각 Skill에 최소 권한 설정
skills:
  weather-skill:
    permissions:
      - network:read  # 네트워크 읽기만 허용
    deny:
      - filesystem:*  # 파일 시스템 접근 금지
      - process:*     # 시스템 명령 실행 금지
```

### 4. 서드파티 Skill 감사

서드파티 Skill을 설치하기 전에:

- Skill의 소스 코드를 검토
- Skill 작성자의 신뢰성 확인
- 커뮤니티 리뷰와 다운로드 수 확인
- 샌드박스 환경에서 먼저 테스트

```bash
# 샌드박스 모드에서 Skill 테스트
openclaw skill install --sandbox suspicious-skill
openclaw skill test suspicious-skill --verbose
```

### 5. 로컬 데이터 암호화

```yaml
# openclaw.config.yaml
storage:
  encryption: true
  encryption_key_source: "keychain"  # macOS Keychain / Windows Credential Store
```

## 기업 보안 모범 사례

### 1. 네트워크 격리

```
[Internet] → [WAF/CDN] → [Reverse Proxy] → [OpenClaw Gateway] → [Internal Network]
                                                    ↓
                                             [Agent Cluster]
                                                    ↓
                                             [Skill Sandbox]
```

- Gateway를 DMZ 또는 전용 서브넷에 배포
- Agent와 Skill은 격리된 내부 네트워크에서 실행
- 모든 세그먼트 간 통신은 방화벽 규칙을 통과해야 함

### 2. RBAC 설정

```yaml
# openclaw.config.yaml
rbac:
  enabled: true
  roles:
    admin:
      permissions: ["*"]
    operator:
      permissions:
        - "agents:read"
        - "agents:restart"
        - "skills:read"
        - "tasks:read"
        - "tasks:create"
    viewer:
      permissions:
        - "agents:read"
        - "skills:read"
        - "tasks:read"
```

### 3. 감사 로그

```yaml
# openclaw.config.yaml
audit:
  enabled: true
  log_level: "detailed"
  destinations:
    - type: "file"
      path: "/var/log/openclaw/audit.log"
      rotation: "daily"
    - type: "siem"
      endpoint: "https://siem.company.com/api/events"
      format: "cef"
```

### 4. Skill 화이트리스트

기업 환경에서는 승인된 Skill만 허용해야 합니다:

```yaml
# openclaw.config.yaml
skills:
  marketplace:
    enabled: false  # 공개 Marketplace 비활성화
  whitelist:
    enabled: true
    approved_skills:
      - "official/web-search"
      - "official/calendar"
      - "official/email"
      - "internal/company-kb"
      - "internal/ticket-system"
```

### 5. TLS 설정

```yaml
# openclaw.config.yaml
tls:
  enabled: true
  cert_file: "/etc/openclaw/tls/cert.pem"
  key_file: "/etc/openclaw/tls/key.pem"
  min_version: "1.3"
  client_auth: "require"  # Agent 연결을 위한 mTLS
  client_ca_file: "/etc/openclaw/tls/ca.pem"
```

### 6. 시크릿 관리

```yaml
# openclaw.config.yaml
secrets:
  provider: "vault"  # HashiCorp Vault
  vault:
    address: "https://vault.company.com"
    auth_method: "kubernetes"
    secret_path: "secret/data/openclaw"
```

## 보안 체크리스트

OpenClaw를 프로덕션 환경에 배포하기 전에 다음 항목을 확인하세요:

- [ ] Gateway가 0.0.0.0에 바인딩되지 않음
- [ ] 최신 버전(>= v4.1.3)으로 업데이트 완료
- [ ] 기본 인증 토큰 변경 완료
- [ ] TLS 암호화 활성화
- [ ] RBAC 설정 완료
- [ ] 감사 로그 활성화
- [ ] Skill 화이트리스트 설정 완료(기업 환경)
- [ ] 네트워크 방화벽 규칙 설정 완료
- [ ] 자동 보안 업데이트 활성화
- [ ] 보안 사고 대응 계획 수립 완료

## 보안 취약점 보고

OpenClaw의 보안 취약점을 발견하셨다면 다음 채널을 통해 보고해 주세요:

- **보안 이메일**: security@openclaw.dev
- **HackerOne**: hackerone.com/openclaw
- **PGP Key**: 공식 웹사이트의 /.well-known/security.txt에서 확인 가능

공개 GitHub Issues에서 보안 취약점을 공개하지 마세요. OpenClaw 보안팀은 모든 보안 보고에 48시간 이내에 응답할 것을 약속합니다.

---

*OpenClaw MasterClass 팀*
