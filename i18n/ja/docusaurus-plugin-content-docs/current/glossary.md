---
title: 用語集
description: OpenClaw 用語集。コア概念、技術用語の日本語・英語・中国語対照表。国際コミュニティでのコミュニケーションに役立つ多言語リファレンスです。
sidebar_position: 98
---

# 用語集

本用語集では、OpenClaw エコシステムにおけるコア概念と技術用語を収録し、多言語の対照翻訳を提供しています。国際コミュニティでの円滑なコミュニケーションにお役立てください。

:::tip 使い方
`Ctrl+F`（または `Cmd+F`）で検索したい用語を探してください。用語は英語のアルファベット順に並べています。
:::

---

## コア用語

### A

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Agent | エージェント | 代理 | 代理 | 에이전트 | 自律的に行動できる AI エンティティ |
| API Key | API キー | API 金鑰 | API 密钥 | API 키 | LLM サービスにアクセスするための認証キー |
| Attack Surface | 攻撃面 | 攻擊面 | 攻击面 | 공격 표면 | システムが攻撃者に露出する範囲 |
| Auth Token | 認証トークン | 認證 Token | 认证 Token | 인증 토큰 | Gateway API の認証クレデンシャル |
| Autonomous Agent | 自律型エージェント | 自主代理 | 自主代理 | 자율 에이전트 | 独立して意思決定と行動が可能な AI |

### B

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Bind Address | バインドアドレス | 綁定位址 | 绑定地址 | 바인드 주소 | Gateway がリッスンするネットワークアドレス |
| Browser Use | ブラウザ操作 | 瀏覽器操控 | 浏览器操控 | 브라우저 사용 | エージェントに Web ブラウザを操作させるスキル |

### C

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Channel | チャンネル | 頻道 | 频道 | 채널 | エージェントが接続するメッセージングプラットフォーム |
| Channel Adapter | チャンネルアダプター | 頻道轉接器 | 频道适配器 | 채널 어댑터 | 特定プラットフォームのプロトコルを処理するコンポーネント |
| ClawHavoc | ClawHavoc 事件 | ClawHavoc 事件 | ClawHavoc 事件 | ClawHavoc 사건 | 2025 年末の悪意あるスキルによるサプライチェーン攻撃 |
| ClawHub | ClawHub スキルマーケット | ClawHub 技能市集 | ClawHub 技能市场 | ClawHub 스킬 마켓 | OpenClaw のスキル共有プラットフォーム |
| Compaction | コンパクション | 壓縮 | 压缩 | 압축 | WAL を構造化 Markdown に圧縮するプロセス |
| Container | コンテナ | 容器 | 容器 | 컨테이너 | スキルを実行する隔離環境（Podman/Docker） |
| Context Window | コンテキストウィンドウ | 上下文窗口 | 上下文窗口 | 컨텍스트 윈도우 | LLM が処理できる最大トークン数 |
| CVE | CVE（共通脆弱性識別子） | CVE | CVE | CVE | 公開されたセキュリティ脆弱性の識別コード |

### D-E

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Docker | Docker | Docker | Docker | Docker | コンテナ化プラットフォーム（OpenClaw には非推奨） |
| Event Bus | イベントバス | 事件匯流排 | 事件总线 | 이벤트 버스 | 各層間の内部通信メカニズム |
| Execution Layer | 実行レイヤー | 執行層 | 执行层 | 실행 레이어 | 第 4 層：スキルをサンドボックス内で実行 |

### F-G

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Fallback | フォールバック | 回退 | 回退 | 폴백 | メイン LLM が利用不可の場合の代替手段 |
| Function Calling | ファンクションコーリング | 函式呼叫 | 函数调用 | 함수 호출 | LLM が外部ツールを呼び出すメカニズム |
| Gateway | ゲートウェイ | 閘道 | 网关 | 게이트웨이 | 第 1 層：メッセージを統一的に受信するエントリーポイント（port 18789） |

### I-L

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Intent Recognition | 意図認識 | 意圖識別 | 意图识别 | 의도 인식 | 推論層がユーザーの意図を判断するプロセス |
| LLM | 大規模言語モデル | 大型語言模型 | 大型语言模型 | 대규모 언어 모델 | AI のコア推論エンジン |
| LLM Router | LLM ルーター | LLM 路由器 | LLM 路由器 | LLM 라우터 | リクエストを異なるモデルに振り分けるメカニズム |
| Long-term Memory | 長期メモリ | 長期記憶 | 长期记忆 | 장기 기억 | 圧縮後の構造化メモリ |

### M

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Manifest | マニフェスト | 技能宣告檔 | 技能清单文件 | 매니페스트 | スキルのメタデータと権限宣言 |
| MCP | MCP（Model Context Protocol） | MCP | MCP | MCP | エージェントと外部ツールを接続するプロトコル |
| Memory System | メモリシステム | 記憶系統 | 记忆系统 | 메모리 시스템 | 第 3 層：会話履歴とユーザー設定の管理 |
| Molty | Molty（マスコット） | Molty（吉祥物） | Molty（吉祥物） | Molty (마스코트) | OpenClaw のロブスターマスコット |
| Multi-Agent | マルチエージェント | 多 Agent | 多 Agent | 멀티 에이전트 | 複数のエージェントが協調するアーキテクチャ |

### N-P

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| NemoClaw | NemoClaw | NemoClaw | NemoClaw | NemoClaw | Nvidia GTC 2026 で発表された OpenClaw GPU アクセラレーション |
| OpenClaw | OpenClaw | OpenClaw | OpenClaw | OpenClaw | オープンソース自律型 AI エージェントプラットフォーム |
| Permission | パーミッション | 權限 | 权限 | 권한 | スキルがアクセスを許可されるリソースの範囲 |
| Podman | Podman | Podman | Podman | Podman | daemon レスのコンテナエンジン（推奨） |
| Prompt Injection | プロンプトインジェクション | Prompt 注入 | Prompt 注入 | 프롬프트 인젝션 | 悪意ある指示でエージェントの動作を操作する攻撃 |

### R

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Rate Limiting | レートリミット | 速率限制 | 速率限制 | 속도 제한 | API リクエスト頻度を制限するメカニズム |
| Reasoning Layer | 推論レイヤー | 推理層 | 推理层 | 추론 레이어 | 第 2 層：意図認識と応答生成を処理 |
| Rootless | ルートレス | Rootless | Rootless | 루트리스 | root 権限不要のコンテナ実行モード |

### S

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Sandbox | サンドボックス | 沙箱 | 沙箱 | 샌드박스 | スキルの隔離実行環境 |
| Sandbox Escape | サンドボックスエスケープ | 沙箱逃脫 | 沙箱逃逸 | 샌드박스 탈출 | コンテナ隔離を突破する攻撃手法 |
| Skill | スキル | 技能 | 技能 | 스킬 | エージェントが実行可能な拡張機能モジュール |
| SOUL.md | SOUL.md（パーソナリティ設定） | SOUL.md | SOUL.md | SOUL.md (성격 설정) | エージェントのパーソナリティと動作を定義する Markdown ファイル |
| SSH Tunnel | SSH トンネル | SSH 通道 | SSH 隧道 | SSH 터널 | SSH を通じて確立する安全な暗号化接続 |
| Supply Chain Attack | サプライチェーン攻撃 | 供應鏈攻擊 | 供应链攻击 | 공급망 공격 | サードパーティコンポーネントを通じて悪意あるコードを埋め込む攻撃 |

### T

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| Token | トークン | Token | Token | 토큰 | LLM が処理する最小テキスト単位 |
| Tool Selection | ツール選択 | 工具選擇 | 工具选择 | 도구 선택 | 推論層が呼び出すスキルを選択するプロセス |
| Tool Use | ツール使用 | 工具使用 | 工具使用 | 도구 사용 | LLM が外部機能を呼び出すメカニズム |

### V-W

| 英語 | 日本語 | 繁體中文 | 簡体中文 | 한국어 | 説明 |
|------|--------|---------|---------|--------|------|
| VirusTotal | VirusTotal | VirusTotal | VirusTotal | VirusTotal | マルチエンジンマルウェアスキャンプラットフォーム |
| WAL | WAL（先行書き込みログ） | WAL（預寫日誌） | WAL（预写日志） | WAL (선행 기록 로그) | Write-Ahead Log、会話をリアルタイムで記録するメカニズム |
| Warm Pool | ウォームプール | 預熱池 | 预热池 | 워밍 풀 | コールドスタートの遅延を軽減する事前作成済みコンテナ |

---

## コミュニティ用語

| 用語 | 説明 |
|------|------|
| **養龍蝦（ロブスターを育てる）** | OpenClaw のアジアコミュニティでの愛称。「Claw（ハサミ）」に由来 |
| **脱皮** | OpenClaw のメジャーバージョンアップグレードを指す（Molty の脱皮イメージに由来） |
| **Showcase** | Reddit で共有される OpenClaw プロジェクトの展示 |
| **Day 1** | OpenClaw をインストールした初日に達成した成果 |
| **nuke** | OpenClaw の完全リセット（すべての設定とメモリを削除） |
| **skill shopping** | ClawHub でスキルを閲覧・選択するプロセス |

---

## 略語対照表

| 略語 | 正式名称 | 日本語 |
|------|---------|--------|
| API | Application Programming Interface | アプリケーションプログラミングインターフェース |
| CLI | Command Line Interface | コマンドラインインターフェース |
| CVE | Common Vulnerabilities and Exposures | 共通脆弱性識別子 |
| CVSS | Common Vulnerability Scoring System | 共通脆弱性評価システム |
| DNS | Domain Name System | ドメインネームシステム |
| LLM | Large Language Model | 大規模言語モデル |
| MCP | Model Context Protocol | モデルコンテキストプロトコル |
| NVR | Network Video Recorder | ネットワークビデオレコーダー |
| OAuth | Open Authorization | オープン認可 |
| OCI | Open Container Initiative | オープンコンテナイニシアティブ |
| RCE | Remote Code Execution | リモートコード実行 |
| REST | Representational State Transfer | Representational State Transfer |
| RSS | Really Simple Syndication | RSS フィード |
| SSE | Server-Sent Events | サーバー送信イベント |
| SSH | Secure Shell | セキュアシェル |
| STT | Speech to Text | 音声テキスト変換 |
| TLS | Transport Layer Security | トランスポート層セキュリティ |
| TTS | Text to Speech | テキスト音声変換 |
| VPN | Virtual Private Network | 仮想プライベートネットワーク |
| WAL | Write-Ahead Log | 先行書き込みログ |
| WSL | Windows Subsystem for Linux | Windows Subsystem for Linux |

---

## バージョン命名規則

OpenClaw は [Semantic Versioning](https://semver.org/) に準拠しています。

```
v3.2.1
│ │ │
│ │ └── Patch：バグ修正、セキュリティアップデート
│ └──── Minor：新機能追加、下位互換性あり
└────── Major：破壊的変更
```

---

## 関連リンク

- [FAQ](/docs/faq) — よくある質問
- [アーキテクチャ概要](/docs/architecture/overview) — 用語がアーキテクチャ内でどこに位置するかを理解
- [セキュリティベストプラクティス](/docs/security/best-practices) — セキュリティ関連用語の実践的な適用
