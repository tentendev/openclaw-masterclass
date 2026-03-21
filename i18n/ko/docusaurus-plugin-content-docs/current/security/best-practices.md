---
title: 보안 모범 사례
description: OpenClaw 완전 보안 가이드 — Gateway 설정, 스킬 심사, 컨테이너 격리, API Key 관리까지 전방위 보안 전략.
sidebar_position: 1
---

# 보안 모범 사례

OpenClaw는 강력한 AI Agent 플랫폼이지만, 강력한 기능은 큰 보안 위험도 의미합니다. 이 문서는 기초 설정부터 고급 방어까지 모든 계층을 아우르는 완전한 보안 가이드입니다.

:::danger 보안은 선택 사항이 아닙니다
2026년 3월 기준으로 **30,000개 이상의 OpenClaw 인스턴스**가 잘못된 보안 설정으로 침해당했습니다. Bitdefender 보안 감사에서 **135,000개의 노출된 인스턴스**가 발견되었습니다. **ClawHavoc 사건**에서 2,400개 이상의 악성 스킬이 ClawHub에 심어졌습니다. 이것은 모두 실제로 발생한 보안 사건입니다.
:::

---

## 보안 사건 회고

모범 사례를 자세히 살펴보기 전에, 왜 각 권고 사항이 중요한지 이해하기 위해 실제 발생한 보안 사건을 먼저 되돌아봅시다:

| 사건 | 시기 | 영향 | 상태 |
|------|------|------|------|
| **CVE-2026-25253** | 2026년 초 | Gateway 원격 코드 실행(RCE), v3.x 이전 버전 영향 | 패치 완료 |
| **ClawHavoc** | 2025년 말 | 2,400+ 악성 스킬이 ClawHub에 심어져 API key 및 개인 데이터 탈취 | 제거 완료 |
| **18789 포트 대규모 침해** | 진행 중 | 30,000+ 인스턴스가 Gateway 포트 노출로 해킹 | 지속 발생 |
| **Bitdefender 감사** | 2026년 초 | 공용 네트워크에서 접근 가능한 135,000개 OpenClaw 인스턴스 발견 | 보고서 공개 |

---

## 1차 방어선: Gateway 보안

Gateway(port 18789)는 OpenClaw의 가장 큰 공격 표면입니다. 가장 먼저 처리해야 할 보안 설정입니다.

### 1. localhost에 바인딩

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"  # 로컬 연결만 허용
```

:::danger 치명적 오류
절대로 `bind: "0.0.0.0"`으로 설정하지 마세요. 이렇게 하면 Gateway가 전체 네트워크에 노출되어 누구나 Agent에 명령을 보낼 수 있습니다. CVE-2026-25253은 바로 노출된 Gateway를 통한 원격 코드 실행을 이용한 것입니다.
:::

### 2. Gateway 인증 활성화

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"
  auth:
    enabled: true
    token: "your-secure-random-token-here"
    # openssl rand -hex 32로 생성
```

안전한 토큰 생성:

```bash
# 64자 무작위 토큰 생성
openssl rand -hex 32

# 또는 Python 사용
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. 방화벽 규칙

localhost에 올바르게 바인딩했더라도 추가 보호 계층은 항상 유용합니다:

```bash
# Linux (ufw)
sudo ufw deny 18789/tcp
sudo ufw reload

# Linux (iptables)
sudo iptables -A INPUT -p tcp --dport 18789 -s 127.0.0.1 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP

# macOS (pf)
echo "block in proto tcp from any to any port 18789" | sudo pfctl -ef -
```

### 4. 안전한 원격 접근

다른 기기에서 OpenClaw에 접근해야 하는 경우, **항상 암호화된 채널을 사용**하세요:

```bash
# 방법 1: SSH 터널 (권장)
ssh -L 18789:127.0.0.1:18789 user@your-server

# 방법 2: WireGuard VPN
# 서버에서 VPN 서브넷만 18789에 접근 허용

# 방법 3: 리버스 프록시 + TLS (고급)
# Caddy 또는 nginx에 mTLS 상호 인증 추가
```

:::warning 다음 방법은 사용하지 마세요
- **ngrok / Cloudflare Tunnel**: 추가 인증 계층 없이 Gateway를 직접 노출
- **포트 포워딩**: 라우터 포트 포워딩은 공용 네트워크 노출과 동일
- **HTTP (TLS 없음)**: 중간자 공격으로 토큰과 메시지를 가로챌 수 있음
:::

---

## 2차 방어선: 컨테이너 및 샌드박스 보안

### Podman Rootless 사용 (강력 권장)

```bash
# Podman이 rootless 모드로 실행 중인지 확인
podman info | grep rootless
# rootless: true

# OpenClaw가 Podman을 사용하도록 설정
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
```

### Docker vs Podman 보안 비교

| 측면 | Docker (기본) | Podman Rootless |
|------|--------------|-----------------|
| Daemon 권한 | root | 사용자 수준 |
| 샌드박스 탈출 위험 | root 획득 가능 | 사용자 권한만 |
| 공격 표면 | Docker daemon socket | daemon 없음 |
| 네트워크 격리 | 추가 설정 필요 | 기본적으로 엄격함 |
| 권장도 | 사용 가능하나 비권장 | **강력 권장** |

### 컨테이너 보안 설정

```yaml
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
  sandbox:
    # 메모리 제한
    memory_limit: "512m"
    # CPU 제한
    cpu_limit: "1.0"
    # 네트워크 접근
    network: "restricted"  # none / restricted / full
    # 파일 시스템 접근
    filesystem:
      read_only: true
      allowed_paths:
        - "/tmp/openclaw-work"
    # 불필요한 Linux capabilities 제거
    drop_capabilities:
      - "ALL"
    add_capabilities:
      - "NET_RAW"  # 네트워크 필요 시에만
```

---

## 3차 방어선: 스킬(Skill) 보안

ClawHavoc 사건은 스킬이 OpenClaw의 가장 큰 공급망 공격 벡터임을 입증했습니다.

### 스킬 설치 전 심사 프로세스

```bash
# 1단계: 스킬 상세 정보 확인
openclaw skill info skill-name

# 2단계: 스킬 소스 코드 확인
openclaw skill inspect skill-name

# 3단계: VirusTotal 스캔 결과 확인 (ClawHavoc 이후 추가)
openclaw skill virustotal skill-name

# 4단계: 커뮤니티 평가 및 설치 수 확인
openclaw skill reviews skill-name
```

### 스킬 보안 등급

| 위험 수준 | 설명 | 예시 |
|---------|------|------|
| **낮음** | 읽기 전용, 네트워크 또는 파일 접근 없음 | 텍스트 처리, 계산, 형식 변환 |
| **중간** | 네트워크 접근하지만 파일 시스템 접근 없음 | 웹 검색, API 조회, 날씨 |
| **높음** | 파일 시스템 또는 시스템 명령 접근 | 파일 관리, shell 실행, 시스템 모니터링 |
| **매우 높음** | 네트워크와 파일 시스템 동시 접근 | browser-use, 자동화 스크립트 |

### 스킬 권한 최소화

```yaml
# ~/.openclaw/skills/skill-name/permissions.yaml
permissions:
  network:
    enabled: true
    allowed_domains:
      - "api.example.com"
      - "*.googleapis.com"
    denied_domains:
      - "*"  # 기본적으로 모두 거부
  filesystem:
    enabled: false
  shell:
    enabled: false
  environment_variables:
    allowed:
      - "HOME"
      - "PATH"
    denied:
      - "OPENAI_API_KEY"  # 스킬이 API key 읽기 방지
      - "ANTHROPIC_API_KEY"
```

:::tip 스킬 감사 체크리스트
스킬 설치 전 완전한 심사 단계는 [스킬 감사 체크리스트](/docs/security/skill-audit-checklist)를 참조하세요.
:::

---

## 4차 방어선: API Key 및 시크릿 관리

### 하지 말아야 할 것

```yaml
# ❌ gateway.yaml에 API key를 하드코딩하지 마세요
providers:
  openai:
    api_key: "sk-aBcDeFgHiJkLmNoPqRsTuVwXyZ"

# ❌ SOUL.md에 API key를 포함하지 마세요
# ❌ Reddit / Discord에 전체 설정을 공유하지 마세요
# ❌ ~/.openclaw/를 공개 Git 저장소에 추가하지 마세요
```

### 올바른 방법

```bash
# 방법 1: 환경 변수 (기본)
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."

# 방법 2: dotenv 파일 (권장)
# ~/.openclaw/.env (이 파일이 Git에 추적되지 않도록 확인)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# 방법 3: 패스워드 매니저 (최선)
# 1Password CLI 사용
eval $(op signin)
export OPENAI_API_KEY=$(op item get "OpenAI" --fields api_key)

# 방법 4: 시스템 Keychain (macOS)
security add-generic-password -s "openclaw-openai" -a "api_key" -w "sk-..."
```

```yaml
# ~/.openclaw/gateway.yaml — 환경 변수 참조
providers:
  openai:
    api_key: "${OPENAI_API_KEY}"
  anthropic:
    api_key: "${ANTHROPIC_API_KEY}"
```

### API Key 교체 전략

| 주기 | 적용 상황 |
|------|---------|
| 90일마다 | 일반 사용 |
| 즉시 | 유출 의심 시 |
| 30일마다 | 고보안 환경 |
| 새 스킬 설치 후 | 새 스킬에 네트워크 및 환경 변수 접근 권한이 있는 경우 |

---

## 5차 방어선: 메모리 시스템 보안

메모리 시스템에는 Agent와의 모든 대화 기록과 개인 데이터가 포함됩니다.

### 메모리 파일 암호화

```bash
# 방법 1: 디스크 수준 암호화
# macOS: FileVault (시스템 설정 → 개인 정보 보호 및 보안 → FileVault)
# Linux: LUKS
sudo cryptsetup luksFormat /dev/sdX
sudo cryptsetup luksOpen /dev/sdX openclaw-memory

# 방법 2: 디렉토리 수준 암호화 (Linux)
# gocryptfs 사용
gocryptfs -init ~/.openclaw/memory-encrypted
gocryptfs ~/.openclaw/memory-encrypted ~/.openclaw/memory
```

:::warning 메모리에 있는 민감 정보
Agent가 대화 중에 은행 계좌 번호, 주소, 비밀번호 등 민감한 정보를 수집하여 메모리 시스템에 저장할 수 있습니다. 정기적으로 메모리 내용을 검토하여 보존하지 말아야 할 민감 데이터가 없는지 확인하세요.
:::

---

## 보안 설정 체크리스트

다음 체크리스트로 OpenClaw 설치가 안전한지 확인하세요:

### 반드시 완료 (Critical)

- [ ] Gateway가 `127.0.0.1`에 바인딩 (`0.0.0.0` 아님)
- [ ] Gateway 인증 활성화
- [ ] Podman rootless 사용 (Docker 아님)
- [ ] API key는 환경 변수 사용 (하드코딩 아님)
- [ ] 최신 버전으로 업데이트 (CVE-2026-25253 패치)
- [ ] 메신저 플랫폼에 화이트리스트 사용자 설정

### 강력 권장 (High)

- [ ] 방화벽으로 18789 포트의 외부 접근 차단
- [ ] 디스크 암호화 활성화
- [ ] 스킬 설치 전 보안 심사 완료
- [ ] 원격 접근은 SSH 터널 또는 VPN 사용
- [ ] API key 정기 교체

### 권장 (Medium)

- [ ] seccomp profile 활성화
- [ ] 메모리 정리 전략 설정
- [ ] 네트워크 활동 모니터링
- [ ] 메모리 시스템 암호화
- [ ] 설치된 스킬의 업데이트 정기 검토

---

## 보안 사고 대응 프로세스

OpenClaw 인스턴스가 침해되었다고 의심되는 경우:

### 즉시 조치

```bash
# 1. OpenClaw 중지
openclaw stop --force

# 2. 증거 보전 (백업 후 정리)
cp -r ~/.openclaw/ ~/openclaw-incident-backup-$(date +%Y%m%d)

# 3. 의심스러운 활동 확인
grep -i "error\|unauthorized\|unknown\|suspicious" ~/.openclaw/logs/*.log

# 4. 설치된 스킬 확인
ls -la ~/.openclaw/skills/

# 5. 네트워크 연결 확인
netstat -an | grep 18789
```

### 복구 단계

```bash
# 1. 모든 API key 교체 (즉시!)
# - OpenAI, Anthropic, Google 등 모든 LLM 제공자
# - Telegram, Discord 등 모든 메신저 플랫폼 token

# 2. OpenClaw 재설치 (클린 설치)
npm uninstall -g @openclaw/cli
rm -rf ~/.openclaw/
npm install -g @openclaw/cli
openclaw init

# 3. 검증된 스킬만 재설치

# 4. 메모리 데이터 복원 (변조되지 않았다고 확인된 경우)

# 5. 보안 설정 강화 (이 문서의 모든 권장 사항 참조)
```

---

## 추가 읽을거리

- [위협 모델 분석](/docs/security/threat-model) — 모든 공격 벡터와 공격 표면 이해
- [스킬 감사 체크리스트](/docs/security/skill-audit-checklist) — 스킬 설치 전 완전한 심사 단계
- [문제 해결](/docs/troubleshooting/common-issues) — 보안 관련 일반적인 문제
