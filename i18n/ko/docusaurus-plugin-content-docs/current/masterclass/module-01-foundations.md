---
title: "모듈 1: OpenClaw 기초 아키텍처"
sidebar_position: 2
description: "OpenClaw의 4계층 아키텍처, 컴포넌트 통신 방식, 디렉터리 구조 및 시스템 헬스 체크에 대한 심층 이해"
---

# 모듈 1: OpenClaw 기초 아키텍처

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- OpenClaw의 4계층 아키텍처와 각 계층의 역할 설명
- 각 계층 간 통신 방식과 데이터 흐름 설명
- OpenClaw의 핵심 디렉터리 구조와 설정 파일 식별
- `openclaw doctor`로 시스템 헬스 체크를 실행하고 결과 해석
- SOUL.md를 설정하여 에이전트의 기본 성격 정의

:::info 선행 조건
[과정 개요](./overview)에서 선행 지식 체크를 완료하고, OpenClaw가 성공적으로 설치되어 있는지 확인하세요.
:::

---

## 4계층 아키텍처 전체 개요

OpenClaw는 정교하게 설계된 4계층 아키텍처를 채택하며, 각 계층은 고유한 역할을 수행하고 명확한 인터페이스를 통해 통신합니다. 이 설계로 시스템은 높은 모듈성과 확장성을 갖추게 됩니다.

```
┌─────────────────────────────────────────────┐
│             사용자 / 외부 시스템               │
└──────────────────────┬──────────────────────┘
                       │ WebSocket (port 18789)
                       ▼
┌─────────────────────────────────────────────┐
│          제1계층: Gateway Layer              │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │WebSocket│  │ Message  │  │ Channel   │  │
│  │ Server  │  │ Router   │  │ Manager   │  │
│  └─────────┘  └──────────┘  └───────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Internal RPC
                       ▼
┌─────────────────────────────────────────────┐
│        제2계층: Reasoning Layer              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   LLM    │  │  Mega-   │  │  SOUL.md │  │
│  │ Provider │  │ Prompting│  │  Parser  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Read/Write
                       ▼
┌─────────────────────────────────────────────┐
│         제3계층: Memory System               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   WAL    │  │ Markdown │  │ Context  │  │
│  │  Engine  │  │Compaction│  │ Window   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────┘
                       │ Execute
                       ▼
┌─────────────────────────────────────────────┐
│     제4계층: Skills / Execution Layer        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Sandboxed│  │ SKILL.md │  │ ClawHub  │  │
│  │Container │  │  Runner  │  │ Registry │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

### 제1계층: Gateway Layer

Gateway는 OpenClaw의 진입점으로, 모든 외부 연결을 관리합니다. **port 18789**에서 WebSocket 서버를 실행하여 메시지의 수신 및 라우팅을 처리합니다.

**핵심 역할:**
- WebSocket 연결 수립 및 관리
- 메시지 형식 검증 및 라우팅
- Channel 추상화 (다중 동시 대화 지원)
- Rate limiting 및 기본 보안 필터링

:::warning 보안 핵심
Gateway는 기본적으로 `127.0.0.1:18789`에 바인딩됩니다. **절대로** `0.0.0.0`으로 변경하지 마세요. 네트워크에 노출됩니다. 이것이 CVE-2026-25253의 근본 원인입니다. 자세한 내용은 모듈 9의 보안 챕터를 참조하세요.
:::

> 심화 학습: [모듈 2: Gateway 심층 분석](./module-02-gateway)

### 제2계층: Reasoning Layer

Reasoning Layer는 OpenClaw의 "두뇌"입니다. **Mega-prompting** 전략으로 LLM과 상호 작용하여, 사용자의 의도를 실행 가능한 행동 계획으로 변환합니다.

**핵심 역할:**
- SOUL.md를 파싱하여 에이전트 성격 정의
- Mega-prompt 구성 (컨텍스트, 메모리, 스킬 목록 결합)
- LLM Provider 연결 관리 (OpenAI, Anthropic, 로컬 모델 등 지원)
- 의사결정: 사용자 응답을 위해 어떤 Skill을 호출할지 판단

**Mega-prompting 흐름:**

```
사용자 입력 → SOUL.md 성격 로드 → 관련 메모리 주입 →
사용 가능한 Skills 나열 → Mega-prompt 조합 → LLM 호출 →
응답 파싱 → 실행 액션 결정
```

### 제3계층: Memory System

Memory System은 영구적인 기억 능력을 제공하여, 에이전트가 대화를 넘어 컨텍스트를 유지할 수 있게 합니다.

**핵심 컴포넌트:**
- **Write-Ahead Logging (WAL)**: 모든 메모리 변경사항을 WAL에 먼저 기록하여 데이터 유실 방지
- **Markdown Compaction**: 단편적인 메모리 조각을 주기적으로 구조화된 Markdown 요약으로 압축
- **Context Window Manager**: LLM에 주입되는 컨텍스트 크기를 동적으로 관리

> 심화 학습: [모듈 5: 영구 메모리와 개인화](./module-05-memory)

### 제4계층: Skills / Execution Layer

Skills Layer는 OpenClaw의 "손"입니다. 각 Skill은 **샌드박스 컨테이너** 내에서 실행되어 시스템 보안을 보장합니다.

**핵심 역할:**
- SKILL.md 정의 파일 파싱 및 Skill 기능 로드
- 샌드박스 컨테이너(Podman / Docker)에서 Skill 실행
- Skill 설치, 업데이트, 제거 관리
- ClawHub Registry와 동기화

> 심화 학습: [모듈 3: Skills 시스템과 SKILL.md 규격](./module-03-skills-system)

---

## 계층 간 통신 방식

각 계층은 명확하게 정의된 인터페이스를 통해 통신합니다:

| 소스 계층 | 대상 계층 | 통신 방식 | 데이터 형식 |
|--------|--------|----------|----------|
| 외부 → Gateway | Gateway | WebSocket | JSON-RPC 2.0 |
| Gateway → Reasoning | Reasoning | Internal RPC | Protocol Buffers |
| Reasoning → Memory | Memory | Direct Call | Structured Objects |
| Reasoning → Skills | Skills | Container API | JSON + Streams |
| Memory → 디스크 | 영구 저장소 | File I/O | WAL + Markdown |

```json
// 일반적인 WebSocket 메시지 형식
{
  "jsonrpc": "2.0",
  "method": "chat.send",
  "params": {
    "channel": "default",
    "message": "오늘 날씨를 검색해 주세요",
    "context": {
      "location": "서울"
    }
  },
  "id": "msg-001"
}
```

---

## 디렉터리 구조

OpenClaw 설치 후 핵심 파일과 디렉터리 레이아웃은 다음과 같습니다:

```
~/.openclaw/
├── config.toml              # 주요 설정 파일
├── SOUL.md                  # 에이전트 성격 정의
├── skills/                  # 설치된 Skills
│   ├── official/            # 공식 Skills
│   └── community/           # 커뮤니티 Skills
├── memory/                  # 메모리 시스템 데이터
│   ├── wal/                 # Write-Ahead Log 파일
│   ├── compacted/           # 압축된 메모리 요약
│   └── index.json           # 메모리 인덱스
├── logs/                    # 시스템 로그
│   ├── gateway.log
│   ├── reasoning.log
│   └── execution.log
├── containers/              # 샌드박스 컨테이너 설정
│   └── podman-compose.yml
└── cache/                   # 캐시 파일
    ├── models/              # LLM 모델 캐시
    └── hub/                 # ClawHub 캐시
```

### 주요 설정 파일: config.toml

```toml
# ~/.openclaw/config.toml

[gateway]
host = "127.0.0.1"          # 항상 127.0.0.1 사용
port = 18789
max_connections = 10
heartbeat_interval = 30      # 초

[reasoning]
provider = "anthropic"       # 또는 "openai", "local"
model = "claude-sonnet-4-20250514"
max_tokens = 8192
temperature = 0.7

[memory]
wal_enabled = true
compaction_interval = 3600   # 매시간 압축
max_context_tokens = 4096
retention_days = 90          # 메모리 보존 일수

[execution]
runtime = "podman"           # docker 대신 podman 권장
sandbox_memory = "512m"
sandbox_cpu = "1.0"
timeout = 30                 # Skill 실행 타임아웃(초)

[security]
bind_localhost_only = true
verify_skills = true
virustotal_scan = true       # ClawHavoc 이후 새 설정
```

---

## 실습: 시스템 헬스 체크

### 단계 1: `openclaw doctor` 실행

```bash
openclaw doctor
```

예상 출력:

```
OpenClaw Doctor v0.9.4
======================

[✓] Runtime: Podman 4.9.3 detected
[✓] Gateway: listening on 127.0.0.1:18789
[✓] Memory: WAL engine healthy (23 entries)
[✓] Skills: 47 skills installed, 47 verified
[✓] Config: config.toml valid
[✓] SOUL.md: loaded (personality: "helpful-assistant")
[✓] LLM Provider: Anthropic API reachable
[✓] Security: localhost-only binding confirmed

All checks passed! OpenClaw is healthy.
```

### 단계 2: 각 계층 상태 확인

```bash
# Gateway 상태 확인
openclaw status gateway

# Memory 통계 확인
openclaw status memory

# 설치된 Skills 목록
openclaw skills list

# 시스템 로그 확인
openclaw logs --tail 50
```

### 단계 3: 첫 번째 SOUL.md 생성

SOUL.md는 에이전트의 성격 특성을 정의합니다. 간단한 성격 정의를 만들어 보세요:

```bash
cat > ~/.openclaw/SOUL.md << 'EOF'
# 에이전트 성격 정의

## 이름
드래곤(Dragon)

## 역할
당신은 친절한 기술 어시스턴트로, 소프트웨어 개발 및 시스템 관리를 전문으로 합니다.

## 언어 선호
- 주요 언어: 한국어
- 기술 용어는 영어 유지

## 행동 원칙
- 답변은 간결하면서도 완전하게
- 관련 배경 지식을 적극적으로 제공
- 불확실한 사항은 직접 설명하며 추측하지 않음
- 코드를 제공할 때는 반드시 설명 첨부

## 제한 사항
- 시스템을 손상시킬 수 있는 작업은 실행하지 않음
- 민감한 데이터에 접근하지 않음 (사용자가 명시적으로 승인한 경우 제외)
EOF
```

SOUL.md가 올바르게 로드되었는지 확인:

```bash
openclaw soul show
```

---

## 자주 발생하는 오류 및 문제 해결

### 오류 1: Gateway 시작 실패

```
Error: Address already in use (127.0.0.1:18789)
```

**해결 방법:**
```bash
# 포트를 점유하는 프로세스 찾기
lsof -i :18789

# 이전 OpenClaw 프로세스 중지
openclaw stop
# 또는 강제 종료
kill -9 <PID>

# 다시 시작
openclaw start
```

### 오류 2: LLM Provider 연결 실패

```
Error: Failed to connect to reasoning provider
```

**해결 방법:**
```bash
# API Key 설정 확인
openclaw config get reasoning.api_key

# API Key 재설정
openclaw config set reasoning.api_key "sk-your-key-here"

# 연결 테스트
openclaw test provider
```

### 오류 3: Podman 미설치

```
Error: No container runtime found
```

**해결 방법:**
```bash
# macOS
brew install podman
podman machine init
podman machine start

# Ubuntu
sudo apt install podman

# 확인
podman --version
openclaw doctor
```

### 오류 4: config.toml 구문 오류

```
Error: Failed to parse config.toml at line 15
```

**해결 방법:**
```bash
# 설정 파일 구문 검증
openclaw config validate

# 기본 설정으로 초기화
openclaw config reset --backup
```

---

## 연습 문제

1. **아키텍처 탐색**: `openclaw status` 명령어 그룹을 사용하여 4계층 아키텍처의 상태를 각각 확인하고, 각 계층의 핵심 지표(연결 수, 메모리 항목 수, 설치된 Skill 수 등)를 기록하세요.

2. **SOUL.md 커스터마이징**: 코드 리뷰 전용 에이전트 성격을 정의하는 커스텀 SOUL.md를 만들어 보세요. 다른 성격 설정이 응답 스타일에 어떤 영향을 미치는지 시험해 보세요.

3. **설정 조정**: `config.toml`의 `[memory]` 섹션에서 `compaction_interval`을 1800초(30분)로 변경한 후, 메모리 압축 동작의 변화를 관찰하세요.

4. **로그 분석**: OpenClaw를 시작한 후 한 번 대화를 실행하고, `gateway.log`와 `reasoning.log`를 확인하여 메시지가 수신부터 응답까지의 전체 흐름을 추적하세요.

---

## 퀴즈

1. **OpenClaw Gateway가 기본적으로 리스닝하는 포트는?**
   - A) 8080
   - B) 3000
   - C) 18789
   - D) 443

2. **Memory System이 데이터 유실을 방지하기 위해 사용하는 메커니즘은?**
   - A) Redis
   - B) Write-Ahead Logging (WAL)
   - C) PostgreSQL
   - D) SQLite

3. **시스템 헬스 체크에 사용되는 명령어는?**
   - A) `openclaw check`
   - B) `openclaw health`
   - C) `openclaw doctor`
   - D) `openclaw verify`

4. **Docker 대신 Podman을 권장하는 이유는?**
   - A) Podman이 더 빠르기 때문
   - B) Podman은 daemon이 필요 없고, root 권한이 불필요하여 보안성이 더 높기 때문
   - C) Docker가 OpenClaw를 지원하지 않기 때문
   - D) Podman 기능이 더 풍부하기 때문

5. **SOUL.md의 용도는?**
   - A) Skill의 동작 정의
   - B) 시스템 파라미터 설정
   - C) 에이전트의 성격 특성과 행동 원칙 정의
   - D) 시스템 로그 기록

<details>
<summary>정답 확인</summary>

1. **C** — OpenClaw Gateway는 기본적으로 port 18789에서 WebSocket 연결을 리스닝합니다.
2. **B** — Write-Ahead Logging (WAL)은 모든 메모리 변경사항을 먼저 로그에 기록하여, 시스템 장애 시에도 데이터가 유실되지 않도록 보장합니다.
3. **C** — `openclaw doctor`는 모든 시스템 컴포넌트의 건강 상태를 검사합니다.
4. **B** — Podman은 daemonless 컨테이너 실행 환경으로, root 권한이 필요 없어 공격 면적을 줄입니다. 이는 보안 모범 사례의 일부입니다.
5. **C** — SOUL.md는 에이전트의 이름, 역할, 언어 선호, 행동 원칙 등 성격 특성을 정의합니다.

</details>

---

## 다음 단계

OpenClaw의 4계층 아키텍처와 기본 설정을 이해했습니다. 다음으로 첫 번째 계층인 Gateway의 작동 세부 사항을 심층 탐구하겠습니다.

**[모듈 2: Gateway 심층 분석으로 이동 →](./module-02-gateway)**
