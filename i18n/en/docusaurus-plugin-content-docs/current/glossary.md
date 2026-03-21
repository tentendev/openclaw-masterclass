---
title: Glossary
description: OpenClaw glossary — core concepts, technical terms, and multilingual reference table covering English, Traditional Chinese, Simplified Chinese, Japanese, and Korean.
sidebar_position: 98
---

# Glossary

This glossary covers the core concepts and technical terms used throughout the OpenClaw ecosystem, with translations in five languages to support the international community.

:::tip How to Use
Press `Ctrl+F` (or `Cmd+F`) to search for the term you need. Terms are sorted alphabetically by their English name.
:::

---

## Core Terms

### A

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Agent | 代理 / Agent | 代理 / Agent | エージェント | 에이전트 | An AI entity capable of autonomous action |
| API Key | API 金鑰 | API 密钥 | APIキー | API 키 | Authentication key for accessing LLM services |
| Attack Surface | 攻擊面 | 攻击面 | 攻撃面 | 공격 표면 | The range of a system exposed to attackers |
| Auth Token | 認證 Token | 认证 Token | 認証トークン | 인증 토큰 | Authentication credential for the Gateway API |
| Autonomous Agent | 自主代理 | 自主代理 | 自律型エージェント | 자율 에이전트 | An AI that can make decisions and act independently |

### B

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Bind Address | 綁定位址 | 绑定地址 | バインドアドレス | 바인드 주소 | The network address the Gateway listens on |
| Browser Use | 瀏覽器操控 | 浏览器操控 | ブラウザ操作 | 브라우저 사용 | A skill that lets an agent control a web browser |

### C

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Channel | 頻道 / 通訊平台 | 频道 / 通讯平台 | チャンネル | 채널 | A messaging platform the agent connects to (e.g., Telegram) |
| Channel Adapter | 頻道轉接器 | 频道适配器 | チャンネルアダプター | 채널 어댑터 | Component handling a specific platform's protocol |
| ClawHavoc | ClawHavoc 事件 | ClawHavoc 事件 | ClawHavoc事件 | ClawHavoc 사건 | The late-2025 malicious skill supply-chain attack |
| ClawHub | ClawHub 技能市集 | ClawHub 技能市场 | ClawHubスキルマーケット | ClawHub 스킬 마켓 | OpenClaw's skill-sharing marketplace |
| Compaction | 壓縮 | 压缩 | コンパクション | 압축 | The process of compressing WAL entries into structured Markdown |
| Container | 容器 | 容器 | コンテナ | 컨테이너 | Isolated environment for skill execution (Podman/Docker) |
| Context Window | 上下文窗口 | 上下文窗口 | コンテキストウィンドウ | 컨텍스트 윈도우 | Maximum number of tokens an LLM can process at once |
| CVE | CVE | CVE | CVE | CVE | Publicly disclosed security vulnerability identifier |

### D-E

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Docker | Docker | Docker | Docker | Docker | Container platform (not recommended for OpenClaw) |
| Event Bus | 事件匯流排 | 事件总线 | イベントバス | 이벤트 버스 | Internal communication mechanism between layers |
| Execution Layer | 執行層 | 执行层 | 実行レイヤー | 실행 레이어 | Layer 4: skills run in sandboxed containers |

### F-G

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Fallback | 回退 / 備用 | 回退 / 备用 | フォールバック | 폴백 | Alternative when the primary LLM is unavailable |
| Function Calling | 函式呼叫 | 函数调用 | ファンクションコーリング | 함수 호출 | Mechanism for an LLM to invoke external tools |
| Gateway | 閘道 / Gateway | 网关 / Gateway | ゲートウェイ | 게이트웨이 | Layer 1: unified message ingestion entry point (port 18789) |

### I-L

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Intent Recognition | 意圖識別 | 意图识别 | 意図認識 | 의도 인식 | The Reasoning Layer's process of determining user intent |
| LLM | 大型語言模型 | 大型语言模型 | 大規模言語モデル | 대규모 언어 모델 | The core reasoning engine of the AI |
| LLM Router | LLM 路由器 | LLM 路由器 | LLMルーター | LLM 라우터 | Mechanism that routes requests to different models |
| Long-term Memory | 長期記憶 | 长期记忆 | 長期メモリ | 장기 기억 | Compacted, structured memory |

### M

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Manifest | 技能宣告檔 | 技能清单文件 | マニフェスト | 매니페스트 | A skill's metadata and permission declarations |
| MCP | MCP | MCP | MCP | MCP | Model Context Protocol — connects agents to external tools |
| Memory System | 記憶系統 | 记忆系统 | メモリシステム | 메모리 시스템 | Layer 3: manages conversation history and user preferences |
| Molty | Molty (mascot) | Molty (吉祥物) | Molty (マスコット) | Molty (마스코트) | OpenClaw's lobster mascot |
| Multi-Agent | 多 Agent | 多 Agent | マルチエージェント | 멀티 에이전트 | Architecture with multiple agents collaborating |

### O-P

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| OpenClaw | OpenClaw (養龍蝦) | OpenClaw (养龙虾) | OpenClaw | OpenClaw | Open-source autonomous AI agent platform |
| Permission | 權限 | 权限 | パーミッション | 권한 | Resources a skill is allowed to access |
| Podman | Podman | Podman | Podman | Podman | Daemonless container engine (recommended) |
| Prompt Injection | Prompt 注入 | Prompt 注入 | プロンプトインジェクション | 프롬프트 인젝션 | Attack that manipulates agent behavior via malicious instructions |

### R

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Rate Limiting | 速率限制 | 速率限制 | レートリミット | 속도 제한 | Mechanism limiting the frequency of API requests |
| Reasoning Layer | 推理層 | 推理层 | 推論レイヤー | 추론 레이어 | Layer 2: handles intent recognition and response generation |
| Rootless | Rootless | Rootless | ルートレス | 루트리스 | Container execution mode that does not require root privileges |

### S

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Sandbox | 沙箱 | 沙箱 | サンドボックス | 샌드박스 | Isolated execution environment for skills |
| Sandbox Escape | 沙箱逃脫 | 沙箱逃逸 | サンドボックスエスケープ | 샌드박스 탈출 | Attack technique that breaches container isolation |
| Skill | 技能 | 技能 | スキル | 스킬 | An extensible function module the agent can execute |
| SOUL.md | SOUL.md | SOUL.md | SOUL.md | SOUL.md | Markdown file defining agent personality and behavior |
| SSH Tunnel | SSH 通道 | SSH 隧道 | SSHトンネル | SSH 터널 | Encrypted connection established via SSH |
| Supply Chain Attack | 供應鏈攻擊 | 供应链攻击 | サプライチェーン攻撃 | 공급망 공격 | Planting malicious code through third-party components |

### T

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| Token | Token | Token | トークン | 토큰 | The smallest text unit processed by an LLM |
| Tool Selection | 工具選擇 | 工具选择 | ツール選択 | 도구 선택 | The Reasoning Layer's process of choosing which skill to invoke |
| Tool Use | 工具使用 | 工具使用 | ツール使用 | 도구 사용 | Mechanism for an LLM to invoke external capabilities |

### V-W

| English | Traditional Chinese | Simplified Chinese | Japanese | Korean | Description |
|---------|--------------------|--------------------|----------|--------|-------------|
| VirusTotal | VirusTotal | VirusTotal | VirusTotal | VirusTotal | Multi-engine malware scanning platform |
| WAL | WAL (預寫日誌) | WAL (预写日志) | WAL (先行書き込みログ) | WAL (선행 기록 로그) | Write-Ahead Log — mechanism for real-time conversation recording |
| Warm Pool | 預熱池 | 预热池 | ウォームプール | 워밍 풀 | Pre-created containers that reduce cold-start latency |

---

## Community Slang

| Term | Description |
|------|-------------|
| **Raising Lobsters** | OpenClaw's nickname in Asian communities, from "Claw" (lobster claw) |
| **Molting** | A major OpenClaw version upgrade (from the Molty mascot's molting imagery) |
| **Showcase** | A project demo shared on Reddit |
| **Day 1** | An achievement completed on the first day of installing OpenClaw |
| **nuke** | Completely resetting OpenClaw (deleting all configs and memory) |
| **skill shopping** | Browsing and selecting skills on ClawHub |

---

## Abbreviations Reference

| Abbreviation | Full Form | Description |
|-------------|-----------|-------------|
| API | Application Programming Interface | Interface for software-to-software communication |
| CLI | Command Line Interface | Text-based interface for interacting with software |
| CVE | Common Vulnerabilities and Exposures | Public vulnerability identification system |
| CVSS | Common Vulnerability Scoring System | Standardized vulnerability severity scoring |
| DNS | Domain Name System | Translates domain names to IP addresses |
| LLM | Large Language Model | AI model trained on large text datasets |
| MCP | Model Context Protocol | Protocol connecting agents to external tools |
| NVR | Network Video Recorder | Device for recording video streams |
| OAuth | Open Authorization | Open standard for token-based authorization |
| OCI | Open Container Initiative | Standards for container formats and runtimes |
| RCE | Remote Code Execution | Ability to run code on a remote machine |
| REST | Representational State Transfer | Architectural style for web APIs |
| RSS | Really Simple Syndication | Web feed format for content distribution |
| SSE | Server-Sent Events | One-way server-to-client push mechanism |
| SSH | Secure Shell | Encrypted protocol for remote access |
| STT | Speech to Text | Converting audio to written text |
| TLS | Transport Layer Security | Encryption protocol for network communication |
| TTS | Text to Speech | Converting written text to audio |
| VPN | Virtual Private Network | Encrypted network tunnel |
| WAL | Write-Ahead Log | Logging mechanism that writes before committing |
| WSL | Windows Subsystem for Linux | Linux compatibility layer on Windows |

---

## Version Naming Convention

OpenClaw follows [Semantic Versioning](https://semver.org/):

```
v3.2.1
│ │ │
│ │ └── Patch: Bug fixes, security updates
│ └──── Minor: New features, backward-compatible
└────── Major: Breaking changes
```

---

## Further Reading

- [FAQ](/docs/faq) — Frequently asked questions
- [Architecture Overview](/docs/architecture/overview) — See where these terms fit in the architecture
- [Security Best Practices](/docs/security/best-practices) — Security terms in practical context
