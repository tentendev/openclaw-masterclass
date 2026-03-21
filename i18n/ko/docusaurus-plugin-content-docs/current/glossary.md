---
title: 용어집
description: OpenClaw 용어집 — 핵심 개념, 기술 용어 및 다국어 대조. 한국어, 영어, 중국어(간체/번체), 일본어 5개 언어 수록.
sidebar_position: 98
---

# 용어집

이 용어집은 OpenClaw 생태계의 핵심 개념과 기술 용어를 수록하며, 5개 언어의 대조 번역을 제공하여 국제 커뮤니티 교류를 돕습니다.

:::tip 사용법
`Ctrl+F` (또는 `Cmd+F`)로 찾고 싶은 용어를 검색하세요. 용어는 영문 알파벳순으로 정렬되어 있습니다.
:::

---

## 핵심 용어

### A

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Agent | 에이전트 | 代理 / Agent | 代理 / Agent | エージェント | 자율적으로 행동하는 AI 개체 |
| API Key | API 키 | API 密钥 | API 金鑰 | APIキー | LLM 서비스 접근을 위한 인증 키 |
| Attack Surface | 공격 표면 | 攻击面 | 攻擊面 | 攻撃面 | 시스템이 공격자에게 노출된 범위 |
| Auth Token | 인증 토큰 | 认证 Token | 인증 Token | 認証トークン | Gateway API의 인증 자격 증명 |
| Autonomous Agent | 자율 에이전트 | 自主代理 | 自主代理 | 自律型エージェント | 독립적으로 의사결정하고 행동하는 AI |

### B

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Bind Address | 바인드 주소 | 绑定地址 | 綁定位址 | バインドアドレス | Gateway가 수신 대기하는 네트워크 주소 |
| Browser Use | 브라우저 사용 | 浏览器操控 | 브라우저操控 | ブラウザ操作 | Agent가 웹 브라우저를 조작하는 스킬 |

### C

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Channel | 채널 | 频道 / 通讯平台 | 채널 / 커뮤니케이션平台 | チャンネル | Agent가 연결하는 메신저 플랫폼 (Telegram 등) |
| Channel Adapter | 채널 어댑터 | 频道适配器 | 채널轉接器 | チャンネルアダプター | 특정 플랫폼 프로토콜을 처리하는 컴포넌트 |
| ClawHavoc | ClawHavoc 사건 | ClawHavoc 事件 | ClawHavoc 事件 | ClawHavoc事件 | 2025년 말 악성 스킬 공급망 공격 |
| ClawHub | ClawHub 스킬 마켓 | ClawHub 스킬市场 | ClawHub 스킬마켓플레이스 | ClawHubスキルマーケット | OpenClaw의 스킬 공유 플랫폼 |
| Compaction | 압축 | 压缩 | 壓縮 | コンパクション | WAL을 구조화된 Markdown으로 압축하는 과정 |
| Container | 컨테이너 | 컨테이너 | 컨테이너 | コンテナ | 스킬 실행을 위한 격리 환경 (Podman/Docker) |
| Context Window | 컨텍스트 윈도우 | 上下文窗口 | 上下文窗口 | コンテキストウィンドウ | LLM이 처리할 수 있는 최대 토큰 수 |
| CVE | CVE | CVE（通用취약점披露） | CVE（通用취약점揭露） | CVE（共通脆弱性識別子） | 공개된 보안 취약점 식별 코드 |

### D-E

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Docker | Docker | Docker | Docker | Docker | 컨테이너화 플랫폼 (OpenClaw에는 비권장) |
| Event Bus | 이벤트 버스 | 事件总线 | 事件匯流排 | イベントバス | 각 계층 간의 내부 통신 메커니즘 |
| Execution Layer | 실행 레이어 | 执行层 | 실행 계층 | 実行レイヤー | 4계층: 스킬이 샌드박스에서 실행 |

### F-G

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Fallback | 폴백 | 回退 / 备用 | 回退 / 備用 | フォールバック | 기본 LLM 불가 시 대체 방안 |
| Function Calling | 함수 호출 | 函数调用 | 函式呼叫 | ファンクションコーリング | LLM이 외부 도구를 호출하는 메커니즘 |
| Gateway | 게이트웨이 | 网关 / Gateway | 게이트웨이 / Gateway | ゲートウェイ | 1계층: 메시지 통합 수신 진입점 (port 18789) |

### I-L

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Intent Recognition | 의도 인식 | 意图识别 | 意圖識別 | 意図認識 | 추론 계층이 사용자 의도를 판단하는 과정 |
| LLM | 대규모 언어 모델 | 大型语言模型 | 大型語言模型 | 大規模言語モデル | AI의 핵심 추론 엔진 |
| LLM Router | LLM 라우터 | LLM 路由器 | LLM 路由器 | LLMルーター | 요청을 다른 모델에 배분하는 메커니즘 |
| Long-term Memory | 장기 기억 | 长期记忆 | 長期記憶 | 長期メモリ | 압축된 구조화 기억 |

### M

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Manifest | 매니페스트 | 스킬清单문서 | 스킬宣告檔 | マニフェスト | 스킬의 메타데이터와 권한 선언 |
| MCP | MCP | MCP（模型上下文协议） | MCP（模型上下文協定） | MCP | Model Context Protocol, Agent와 외부 도구를 연결하는 프로토콜 |
| Memory System | 메모리 시스템 | 记忆系统 | 記憶系統 | メモリシステム | 3계층: 대화 기록과 사용자 선호 관리 |
| Molty | Molty (마스코트) | Molty（吉祥物） | Molty（吉祥物） | Molty（マスコット） | OpenClaw의 랍스터 마스코트 |
| Multi-Agent | 멀티 에이전트 | 多 Agent | 多 Agent | マルチエージェント | 여러 Agent가 협업하는 아키텍처 |

### O-P

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| OpenClaw | OpenClaw | OpenClaw（养龙虾） | OpenClaw（養龍蝦） | OpenClaw | 오픈소스 자율 AI Agent 플랫폼 |
| Permission | 권한 | 权限 | 권한 | パーミッション | 스킬이 접근 허용된 리소스 범위 |
| Podman | Podman | Podman | Podman | Podman | daemon 없는 컨테이너 엔진 (권장) |
| Prompt Injection | 프롬프트 인젝션 | Prompt 注入 | Prompt 注入 | プロンプトインジェクション | 악성 지시로 Agent 동작을 조작하는 공격 |

### R

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Rate Limiting | 속도 제한 | 速率限制 | 速率限制 | レートリミット | API 요청 빈도를 제한하는 메커니즘 |
| Reasoning Layer | 추론 레이어 | 推理层 | 추론 계층 | 推論レイヤー | 2계층: 의도 인식과 응답 생성 처리 |
| Rootless | 루트리스 | 无根 / Rootless | 無根 / Rootless | ルートレス | root 권한 없이 컨테이너를 실행하는 모드 |

### S

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Sandbox | 샌드박스 | 沙箱 | 沙箱 | サンドボックス | 스킬의 격리된 실행 환경 |
| Sandbox Escape | 샌드박스 탈출 | 沙箱逃逸 | 沙箱逃脫 | サンドボックスエスケープ | 컨테이너 격리를 돌파하는 공격 기법 |
| Skill | 스킬 | 스킬 | 스킬 | スキル | Agent가 실행할 수 있는 확장 기능 모듈 |
| SOUL.md | SOUL.md (성격 설정) | SOUL.md（人格配置문서） | SOUL.md（人格설정 파일） | SOUL.md（パーソナリティ설정） | Agent 성격과 동작을 정의하는 Markdown 파일 |
| SSH Tunnel | SSH 터널 | SSH 隧道 | SSH 通道 | SSHトンネル | SSH를 통해 안전한 암호화 연결을 구축 |
| Supply Chain Attack | 공급망 공격 | 供应链攻击 | 供應鏈攻擊 | サプライチェーン攻撃 | 서드파티 컴포넌트를 통해 악성 코드를 심는 공격 |

### T

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| Token | 토큰 | Token（令牌 / 单元） | Token（令牌 / 單元） | トークン | LLM이 처리하는 최소 텍스트 단위 |
| Tool Selection | 도구 선택 | 工具选择 | 工具選擇 | ツール選択 | 추론 계층이 호출할 스킬을 선택하는 과정 |
| Tool Use | 도구 사용 | 工具使用 | 工具使用 | ツール使用 | LLM이 외부 기능을 호출하는 메커니즘 |

### V-W

| 영어 | 한국어 | 简体中文 | 한국어 | 日本語 | 설명 |
|------|--------|---------|---------|--------|------|
| VirusTotal | VirusTotal | VirusTotal | VirusTotal | VirusTotal | 다중 엔진 악성 소프트웨어 스캔 플랫폼 |
| WAL | WAL (선행 기록 로그) | WAL（预写日志） | WAL（預寫로그） | WAL（先行書き込みログ） | Write-Ahead Log, 대화를 실시간으로 기록하는 메커니즘 |
| Warm Pool | 워밍 풀 | 预热池 | 預熱池 | ウォームプール | 사전에 생성된 컨테이너, 콜드 스타트 지연 감소 |

---

## 커뮤니티 용어

| 용어 | 설명 |
|------|------|
| **랍스터 키우기** | OpenClaw의 아시아 커뮤니티 별명, "Claw"(집게발)에서 유래 |
| **탈피** | OpenClaw의 메이저 버전 업그레이드 (Molty의 탈피 이미지에서 유래) |
| **Showcase** | Reddit에서 공유하는 OpenClaw 프로젝트 전시 |
| **Day 1** | OpenClaw 설치 첫날에 완성한 결과물 |
| **nuke** | OpenClaw 완전 초기화 (모든 설정과 기억 삭제) |
| **skill shopping** | ClawHub에서 스킬을 둘러보고 고르는 과정 |

---

## 약어 대조

| 약어 | 전체 명칭 | 한국어 |
|------|---------|--------|
| API | Application Programming Interface | 애플리케이션 프로그래밍 인터페이스 |
| CLI | Command Line Interface | 커맨드라인 인터페이스 |
| CVE | Common Vulnerabilities and Exposures | 공통 취약점 및 노출 |
| CVSS | Common Vulnerability Scoring System | 공통 취약점 점수 시스템 |
| DNS | Domain Name System | 도메인 네임 시스템 |
| LLM | Large Language Model | 대규모 언어 모델 |
| MCP | Model Context Protocol | 모델 컨텍스트 프로토콜 |
| OAuth | Open Authorization | 오픈 인가 |
| OCI | Open Container Initiative | 오픈 컨테이너 이니셔티브 |
| RCE | Remote Code Execution | 원격 코드 실행 |
| REST | Representational State Transfer | REST |
| SSH | Secure Shell | 시큐어 셸 |
| STT | Speech to Text | 음성-텍스트 변환 |
| TLS | Transport Layer Security | 전송 계층 보안 |
| TTS | Text to Speech | 텍스트-음성 변환 |
| VPN | Virtual Private Network | 가상 사설 네트워크 |
| WAL | Write-Ahead Log | 선행 기록 로그 |
| WSL | Windows Subsystem for Linux | Windows Linux 하위 시스템 |

---

## 버전 네이밍 규칙

OpenClaw는 [Semantic Versioning](https://semver.org/) 규칙을 따릅니다:

```
v3.2.1
│ │ │
│ │ └── Patch: 버그 수정, 보안 업데이트
│ └──── Minor: 새 기능 추가, 하위 호환
└────── Major: 호환성 변경 사항
```

---

## 추가 읽을거리

- [FAQ](/docs/faq) — 자주 묻는 질문
- [아키텍처 개요](/docs/architecture/overview) — 아키텍처에서의 용어 위치 이해
- [보안 모범 사례](/docs/security/best-practices) — 보안 관련 용어의 실제 적용
