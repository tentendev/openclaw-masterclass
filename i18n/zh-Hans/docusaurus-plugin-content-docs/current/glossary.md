---
title: 术语表
description: OpenClaw 术语表——核心概念、技术名词与多语言对照。涵盖简体中文、繁体中文、英文、日文、韩文五种语言。
sidebar_position: 98
---

# 术语表

本术语表收录了 OpenClaw 生态系统中的核心概念与技术名词，提供五种语言的对照翻译，方便国际社区交流。

:::tip 使用方式
按 `Ctrl+F`（或 `Cmd+F`）搜索你要查找的术语。术语按英文字母顺序排列。
:::

---

## 核心术语

### A

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Agent | 代理 / Agent | 代理 / Agent | エージェント | 에이전트 | 能自主移动的 AI 实体 |
| API Key | API 密钥 | API 金钥 | APIキー | API 키 | 访问 LLM 服务的认证密钥 |
| Attack Surface | 攻击面 | 攻击面 | 攻撃面 | 공격 표면 | 系统暴露给攻击者的范围 |
| Auth Token | 认证 Token | 认证 Token | 认证トークン | 인증 토큰 | Gateway API 的认证凭证 |
| Autonomous Agent | 自主代理 | 自主代理 | 自律型エージェント | 자율 에이전트 | 能独立决策并移动的 AI |

### B

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Bind Address | 绑定地址 | 绑定位址 | バインドアドレス | 바인드 주소 | Gateway 监听的网络地址 |
| Browser Use | 浏览器操控 | 浏览器操控 | ブラウザ操作 | 브라우저 사용 | 让 Agent 操控网页浏览器的技能 |

### C

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Channel | 频道 / 通讯平台 | 频道 / 通讯平台 | チャンネル | 채널 | Agent 连接的通讯平台（Telegram 等） |
| Channel Adapter | 频道适配器 | 频道转接器 | チャンネルアダプター | 채널 어댑터 | 处理特定平台协议的组件 |
| ClawHavoc | ClawHavoc 事件 | ClawHavoc 事件 | ClawHavoc事件 | ClawHavoc 사건 | 2025 年底的恶意技能供应链攻击 |
| ClawHub | ClawHub 技能市场 | ClawHub 技能市集 | ClawHubスキルマーケット | ClawHub 스킬 마켓 | OpenClaw 的技能分享平台 |
| Compaction | 压缩 | 压缩 | コンパクション | 압축 | 将 WAL 压缩为结构化 Markdown 的过程 |
| Container | 容器 | 容器 | コンテナ | 컨테이너 | 技能执行的隔离环境（Podman/Docker） |
| Context Window | 上下文窗口 | 上下文窗口 | コンテキストウィンドウ | 컨텍스트 윈도우 | LLM 能处理的最大 token 数量 |
| CVE | CVE（通用漏洞披露） | CVE（通用漏洞揭露） | CVE（共通脆弱性识别子） | CVE | 公开的安全漏洞识别码 |

### D-E

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Docker | Docker | Docker | Docker | Docker | 容器化平台（不建议用于 OpenClaw） |
| Event Bus | 事件总线 | 事件汇流排 | イベントバス | 이벤트 버스 | 各层之间的内部通信机制 |
| Execution Layer | 执行层 | 执行层 | 実行レイヤー | 실행 레이어 | 第四层：技能在沙箱中执行 |

### F-G

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Fallback | 回退 / 备用 | 回退 / 备用 | フォールバック | 폴백 | 主要 LLM 不可用时的替代方案 |
| Function Calling | 函数调用 | 函式呼叫 | ファンクションコーリング | 함수 호출 | LLM 调用外部工具的机制 |
| Gateway | 网关 / Gateway | 闸道 / Gateway | ゲートウェイ | 게이트웨이 | 第一层：统一接收消息的入口（port 18789） |

### I-L

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Intent Recognition | 意图识别 | 意图识别 | 意図认识 | 의도 인식 | 推理层判断用户意图的过程 |
| LLM | 大型语言模型 | 大型语言模型 | 大规模言语モデル | 대규모 언어 모델 | AI 的核心推理引擎 |
| LLM Router | LLM 路由器 | LLM 路由器 | LLMルーター | LLM 라우터 | 将请求分配到不同模型的机制 |
| Long-term Memory | 长期记忆 | 长期记忆 | 长期メモリ | 장기 기억 | 压缩后的结构化记忆 |

### M

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Manifest | 技能清单文件 | 技能宣告档 | マニフェスト | 매니페스트 | 技能的元数据和权限声明 |
| MCP | MCP（模型上下文协议） | MCP（模型上下文协定） | MCP | MCP | Model Context Protocol，连接 Agent 与外部工具的协议 |
| Memory System | 记忆系统 | 记忆系统 | メモリシステム | 메모리 시스템 | 第三层：管理对话历史和用户偏好 |
| Molty | Molty（吉祥物） | Molty（吉祥物） | Molty（マスコット） | Molty (마스코트) | OpenClaw 的龙虾吉祥物 |
| Multi-Agent | 多 Agent | 多 Agent | マルチエージェント | 멀티 에이전트 | 多个 Agent 协作的架构 |

### O-P

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| OpenClaw | OpenClaw（养龙虾） | OpenClaw（养龙虾） | OpenClaw | OpenClaw | 开源自主 AI Agent 平台 |
| Permission | 权限 | 权限 | パーミッション | 권한 | 技能被允许访问的资源范围 |
| Podman | Podman | Podman | Podman | Podman | 无 daemon 的容器引擎（推荐） |
| Prompt Injection | Prompt 注入 | Prompt 注入 | プロンプトインジェクション | 프롬프트 인젝션 | 通过恶意指令操纵 Agent 行为的攻击 |

### R

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Rate Limiting | 速率限制 | 速率限制 | レートリミット | 속도 제한 | 限制 API 请求频率的机制 |
| Reasoning Layer | 推理层 | 推理层 | 推论レイヤー | 추론 레이어 | 第二层：处理意图识别与响应生成 |
| Rootless | 无根 / Rootless | 无根 / Rootless | ルートレス | 루트리스 | 不需 root 权限的容器执行模式 |

### S

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Sandbox | 沙箱 | 沙箱 | サンドボックス | 샌드박스 | 技能的隔离执行环境 |
| Sandbox Escape | 沙箱逃逸 | 沙箱逃脱 | サンドボックスエスケープ | 샌드박스 탈출 | 突破容器隔离的攻击手法 |
| Skill | 技能 | 技能 | スキル | 스킬 | Agent 可执行的扩展功能模块 |
| SOUL.md | SOUL.md（人格配置文件） | SOUL.md（人格设定档） | SOUL.md（パーソナリティ设定） | SOUL.md (성격 설정) | 定义 Agent 人格与行为的 Markdown 文件 |
| SSH Tunnel | SSH 隧道 | SSH 通道 | SSHトンネル | SSH 터널 | 通过 SSH 建立安全的加密连接 |
| Supply Chain Attack | 供应链攻击 | 供应链攻击 | サプライチェーン攻撃 | 공급망 공격 | 通过第三方组件植入恶意代码 |

### T

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| Token | Token（令牌 / 单元） | Token（令牌 / 单元） | トークン | 토큰 | LLM 处理的最小文本单位 |
| Tool Selection | 工具选择 | 工具选择 | ツール选択 | 도구 선택 | 推理层选择要调用的技能的过程 |
| Tool Use | 工具使用 | 工具使用 | ツール使用 | 도구 사용 | LLM 调用外部功能的机制 |

### V-W

| 英文 | 简体中文 | 繁体中文 | 日本语 | 한국어 | 说明 |
|------|---------|---------|--------|--------|------|
| VirusTotal | VirusTotal | VirusTotal | VirusTotal | VirusTotal | 多引擎恶意软件扫描平台 |
| WAL | WAL（预写日志） | WAL（预写日志） | WAL（先行书き込みログ） | WAL (선행 기록 로그) | Write-Ahead Log，即时记录对话的机制 |
| Warm Pool | 预热池 | 预热池 | ウォームプール | 워밍 풀 | 预先创建的容器，减少冷启动延迟 |

---

## 社区用语

| 用语 | 说明 |
|------|------|
| **养龙虾** | OpenClaw 在亚洲社区的昵称，取自"Claw"（螯） |
| **蜕壳** | 指 OpenClaw 的重大版本升级（来自 Molty 的蜕壳意象） |
| **Showcase** | 在 Reddit 上分享的 OpenClaw 项目展示 |
| **Day 1** | 安装 OpenClaw 的第一天就完成的成果 |
| **nuke** | 完全重置 OpenClaw（删除所有配置和记忆） |
| **skill shopping** | 在 ClawHub 上浏览和挑选技能的过程 |

---

## 缩写对照

| 缩写 | 全称 | 简体中文 |
|------|------|---------|
| API | Application Programming Interface | 应用程序接口 |
| CLI | Command Line Interface | 命令行接口 |
| CVE | Common Vulnerabilities and Exposures | 通用漏洞披露 |
| CVSS | Common Vulnerability Scoring System | 通用漏洞评分系统 |
| DNS | Domain Name System | 域名系统 |
| LLM | Large Language Model | 大型语言模型 |
| MCP | Model Context Protocol | 模型上下文协议 |
| OAuth | Open Authorization | 开放授权 |
| OCI | Open Container Initiative | 开放容器倡议 |
| RCE | Remote Code Execution | 远程代码执行 |
| REST | Representational State Transfer | 表述性状态传递 |
| SSH | Secure Shell | 安全外壳协议 |
| STT | Speech to Text | 语音转文本 |
| TLS | Transport Layer Security | 传输层安全 |
| TTS | Text to Speech | 文本转语音 |
| VPN | Virtual Private Network | 虚拟专用网络 |
| WAL | Write-Ahead Log | 预写日志 |
| WSL | Windows Subsystem for Linux | Windows 上的 Linux 子系统 |

---

## 版本命名惯例

OpenClaw 遵循 [Semantic Versioning](https://semver.org/) 规范：

```
v3.2.1
│ │ │
│ │ └── Patch：修复 bug，安全更新
│ └──── Minor：新增功能，向下兼容
└────── Major：破坏性变更
```

---

## 延伸阅读

- [FAQ](/docs/faq) — 常见问题解答
- [架构概览](/docs/architecture/overview) — 了解术语在架构中的位置
- [安全性最佳实践](/docs/security/best-practices) — 安全相关术语的实际应用
