---
title: 術語表
description: OpenClaw 術語表——核心概念、技術名詞與多語言對照。涵蓋繁體中文、簡體中文、英文、日文、韓文五種語言。
sidebar_position: 98
---

# 術語表

本術語表收錄了 OpenClaw 生態系統中的核心概念與技術名詞，提供五種語言的對照翻譯，方便國際社群交流。

:::tip 使用方式
按 `Ctrl+F`（或 `Cmd+F`）搜尋你要查找的術語。術語按英文字母順序排列。
:::

---

## 核心術語

### A

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Agent | 代理 / Agent | 代理 / Agent | エージェント | 에이전트 | 能自主行動的 AI 實體 |
| API Key | API 金鑰 | API 密钥 | APIキー | API 키 | 存取 LLM 服務的認證金鑰 |
| Attack Surface | 攻擊面 | 攻击面 | 攻撃面 | 공격 표면 | 系統暴露給攻擊者的範圍 |
| Auth Token | 認證 Token | 认证 Token | 認証トークン | 인증 토큰 | Gateway API 的認證憑證 |
| Autonomous Agent | 自主代理 | 自主代理 | 自律型エージェント | 자율 에이전트 | 能獨立決策並行動的 AI |

### B

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Bind Address | 綁定位址 | 绑定地址 | バインドアドレス | 바인드 주소 | Gateway 監聽的網路位址 |
| Browser Use | 瀏覽器操控 | 浏览器操控 | ブラウザ操作 | 브라우저 사용 | 讓 Agent 操控網頁瀏覽器的技能 |

### C

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Channel | 頻道 / 通訊平台 | 频道 / 通讯平台 | チャンネル | 채널 | Agent 連接的通訊平台（Telegram 等） |
| Channel Adapter | 頻道轉接器 | 频道适配器 | チャンネルアダプター | 채널 어댑터 | 處理特定平台協定的元件 |
| ClawHavoc | ClawHavoc 事件 | ClawHavoc 事件 | ClawHavoc事件 | ClawHavoc 사건 | 2025 年底的惡意技能供應鏈攻擊 |
| ClawHub | ClawHub 技能市集 | ClawHub 技能市场 | ClawHubスキルマーケット | ClawHub 스킬 마켓 | OpenClaw 的技能分享平台 |
| Compaction | 壓縮 | 压缩 | コンパクション | 압축 | 將 WAL 壓縮為結構化 Markdown 的過程 |
| Container | 容器 | 容器 | コンテナ | 컨테이너 | 技能執行的隔離環境（Podman/Docker） |
| Context Window | 上下文窗口 | 上下文窗口 | コンテキストウィンドウ | 컨텍스트 윈도우 | LLM 能處理的最大 token 數量 |
| CVE | CVE（通用漏洞揭露） | CVE（通用漏洞披露） | CVE（共通脆弱性識別子） | CVE | 公開的安全漏洞識別碼 |

### D-E

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Docker | Docker | Docker | Docker | Docker | 容器化平台（不建議用於 OpenClaw） |
| Event Bus | 事件匯流排 | 事件总线 | イベントバス | 이벤트 버스 | 各層之間的內部通訊機制 |
| Execution Layer | 執行層 | 执行层 | 実行レイヤー | 실행 레이어 | 第四層：技能在沙箱中執行 |

### F-G

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Fallback | 回退 / 備用 | 回退 / 备用 | フォールバック | 폴백 | 主要 LLM 不可用時的替代方案 |
| Function Calling | 函式呼叫 | 函数调用 | ファンクションコーリング | 함수 호출 | LLM 呼叫外部工具的機制 |
| Gateway | 閘道 / Gateway | 网关 / Gateway | ゲートウェイ | 게이트웨이 | 第一層：統一接收訊息的入口（port 18789） |

### I-L

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Intent Recognition | 意圖識別 | 意图识别 | 意図認識 | 의도 인식 | 推理層判斷使用者意圖的過程 |
| LLM | 大型語言模型 | 大型语言模型 | 大規模言語モデル | 대규모 언어 모델 | AI 的核心推理引擎 |
| LLM Router | LLM 路由器 | LLM 路由器 | LLMルーター | LLM 라우터 | 將請求分配到不同模型的機制 |
| Long-term Memory | 長期記憶 | 长期记忆 | 長期メモリ | 장기 기억 | 壓縮後的結構化記憶 |

### M

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Manifest | 技能宣告檔 | 技能清单文件 | マニフェスト | 매니페스트 | 技能的元資料和權限宣告 |
| MCP | MCP（模型上下文協定） | MCP（模型上下文协议） | MCP | MCP | Model Context Protocol，連接 Agent 與外部工具的協定 |
| Memory System | 記憶系統 | 记忆系统 | メモリシステム | 메모리 시스템 | 第三層：管理對話歷史和使用者偏好 |
| Molty | Molty（吉祥物） | Molty（吉祥物） | Molty（マスコット） | Molty (마스코트) | OpenClaw 的龍蝦吉祥物 |
| Multi-Agent | 多 Agent | 多 Agent | マルチエージェント | 멀티 에이전트 | 多個 Agent 協作的架構 |

### O-P

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| OpenClaw | OpenClaw（養龍蝦） | OpenClaw（养龙虾） | OpenClaw | OpenClaw | 開源自主 AI Agent 平台 |
| Permission | 權限 | 权限 | パーミッション | 권한 | 技能被允許存取的資源範圍 |
| Podman | Podman | Podman | Podman | Podman | 無 daemon 的容器引擎（推薦） |
| Prompt Injection | Prompt 注入 | Prompt 注入 | プロンプトインジェクション | 프롬프트 인젝션 | 透過惡意指令操縱 Agent 行為的攻擊 |

### R

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Rate Limiting | 速率限制 | 速率限制 | レートリミット | 속도 제한 | 限制 API 請求頻率的機制 |
| Reasoning Layer | 推理層 | 推理层 | 推論レイヤー | 추론 레이어 | 第二層：處理意圖識別與回應生成 |
| Rootless | 無根 / Rootless | 无根 / Rootless | ルートレス | 루트리스 | 不需 root 權限的容器執行模式 |

### S

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Sandbox | 沙箱 | 沙箱 | サンドボックス | 샌드박스 | 技能的隔離執行環境 |
| Sandbox Escape | 沙箱逃脫 | 沙箱逃逸 | サンドボックスエスケープ | 샌드박스 탈출 | 突破容器隔離的攻擊手法 |
| Skill | 技能 | 技能 | スキル | 스킬 | Agent 可執行的擴充功能模組 |
| SOUL.md | SOUL.md（人格設定檔） | SOUL.md（人格配置文件） | SOUL.md（パーソナリティ設定） | SOUL.md (성격 설정) | 定義 Agent 人格與行為的 Markdown 檔案 |
| SSH Tunnel | SSH 通道 | SSH 隧道 | SSHトンネル | SSH 터널 | 透過 SSH 建立安全的加密連線 |
| Supply Chain Attack | 供應鏈攻擊 | 供应链攻击 | サプライチェーン攻撃 | 공급망 공격 | 透過第三方元件植入惡意程式碼 |

### T

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| Token | Token（令牌 / 單元） | Token（令牌 / 单元） | トークン | 토큰 | LLM 處理的最小文字單位 |
| Tool Selection | 工具選擇 | 工具选择 | ツール選択 | 도구 선택 | 推理層選擇要呼叫的技能的過程 |
| Tool Use | 工具使用 | 工具使用 | ツール使用 | 도구 사용 | LLM 呼叫外部功能的機制 |

### V-W

| 英文 | 繁體中文 | 簡體中文 | 日本語 | 한국어 | 說明 |
|------|---------|---------|--------|--------|------|
| VirusTotal | VirusTotal | VirusTotal | VirusTotal | VirusTotal | 多引擎惡意軟體掃描平台 |
| WAL | WAL（預寫日誌） | WAL（预写日志） | WAL（先行書き込みログ） | WAL (선행 기록 로그) | Write-Ahead Log，即時記錄對話的機制 |
| Warm Pool | 預熱池 | 预热池 | ウォームプール | 워밍 풀 | 預先建立的容器，減少冷啟動延遲 |

---

## 社群用語

| 用語 | 說明 |
|------|------|
| **養龍蝦** | OpenClaw 在亞洲社群的暱稱，取自「Claw」（螯） |
| **蛻殼** | 指 OpenClaw 的重大版本升級（來自 Molty 的蛻殼意象） |
| **Showcase** | 在 Reddit 上分享的 OpenClaw 專案展示 |
| **Day 1** | 安裝 OpenClaw 的第一天就完成的成果 |
| **nuke** | 完全重置 OpenClaw（刪除所有設定和記憶） |
| **skill shopping** | 在 ClawHub 上瀏覽和挑選技能的過程 |

---

## 縮寫對照

| 縮寫 | 全稱 | 繁體中文 |
|------|------|---------|
| API | Application Programming Interface | 應用程式介面 |
| CLI | Command Line Interface | 命令列介面 |
| CVE | Common Vulnerabilities and Exposures | 通用漏洞揭露 |
| CVSS | Common Vulnerability Scoring System | 通用漏洞評分系統 |
| DNS | Domain Name System | 網域名稱系統 |
| LLM | Large Language Model | 大型語言模型 |
| MCP | Model Context Protocol | 模型上下文協定 |
| NVR | Network Video Recorder | 網路錄影機 |
| OAuth | Open Authorization | 開放授權 |
| OCI | Open Container Initiative | 開放容器倡議 |
| RCE | Remote Code Execution | 遠端程式碼執行 |
| REST | Representational State Transfer | 表現層狀態轉換 |
| RSS | Really Simple Syndication | 簡易資訊聚合 |
| SSE | Server-Sent Events | 伺服器推送事件 |
| SSH | Secure Shell | 安全殼層 |
| STT | Speech to Text | 語音轉文字 |
| TLS | Transport Layer Security | 傳輸層安全性 |
| TTS | Text to Speech | 文字轉語音 |
| VPN | Virtual Private Network | 虛擬私人網路 |
| WAL | Write-Ahead Log | 預寫日誌 |
| WSL | Windows Subsystem for Linux | Windows 上的 Linux 子系統 |

---

## 版本命名慣例

OpenClaw 遵循 [Semantic Versioning](https://semver.org/) 規範：

```
v3.2.1
│ │ │
│ │ └── Patch：修復 bug，安全更新
│ └──── Minor：新增功能，向下相容
└────── Major：破壞性變更
```

---

## 延伸閱讀

- [FAQ](/docs/faq) — 常見問題解答
- [架構概覽](/docs/architecture/overview) — 了解術語在架構中的位置
- [安全性最佳實踐](/docs/security/best-practices) — 安全相關術語的實際應用
