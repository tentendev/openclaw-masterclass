---
slug: security-guide
title: OpenClawセキュリティ完全ガイド
authors: [openclaw-masterclass]
tags: [openclaw, security]
image: /img/docusaurus-social-card.jpg
description: OpenClaw セキュリティ完全ガイド — ClawHavoc 事件、CVE-2026-25253 脆弱性、0.0.0.0 バインディングリスク、そして個人・企業向けセキュリティベストプラクティスを詳しく解説。
---

# OpenClaw セキュリティ完全ガイド

セキュリティは、AI Agent フレームワークをデプロイする際に最も重要な考慮事項の一つです。本記事では、OpenClaw のセキュリティに関するトピックを深掘りし、既知の脆弱性、過去のインシデント、そして個人・企業ユーザー向けのベストプラクティスを解説します。

<!-- truncate -->

## ClawHavoc：重大なセキュリティインシデント

2026 年 2 月、セキュリティリサーチチーム **Lobster Security Labs** が **ClawHavoc** と呼ばれる一連のセキュリティ脆弱性を発見しました。これらの脆弱性は OpenClaw Gateway のコア通信メカニズムに影響を与えるもので、悪用された場合、攻撃者は以下のことが可能でした：

1. **Agent コントロールインターフェースへの不正アクセス**：認証メカニズムを回避して Agent に直接コマンドを送信
2. **Skills インジェクション攻撃**：対象インスタンスに悪意のある Skill をロード
3. **会話データの漏洩**：Agent とユーザー間の通信内容を傍受

### 影響範囲

- **影響を受けるバージョン**：OpenClaw v3.8.0 から v4.1.2
- **深刻度**：Critical（CVSS 9.1）
- **修正バージョン**：OpenClaw v4.1.3 以降

OpenClaw セキュリティチームは報告を受けてから 48 時間以内にパッチをリリースし、Gateway の自動更新メカニズムを通じて、自動更新が有効なすべてのインスタンスに配信しました。

### 教訓

ClawHavoc 事件から、コミュニティは重要な教訓を学びました：

- AI Agent フレームワークは従来の Web アプリケーションよりも広い攻撃対象領域を持つ
- Skill の動的ロードメカニズムにはより厳格な検証が必要
- リアルタイムメッセージングの暗号化はトランスポート層のみに依存すべきではない

## CVE-2026-25253：WebSocket 認証バイパス

**CVE-2026-25253** は ClawHavoc の中で最も深刻な個別の脆弱性であり、OpenClaw Gateway の WebSocket 接続認証メカニズムに影響を与えます。

### 脆弱性の詳細

OpenClaw Gateway はデフォルトで **ポート 18789** で WebSocket 接続を待ち受けます。影響を受けるバージョンでは、WebSocket ハンドシェイク段階に競合状態（Race Condition）が存在していました：

```
攻撃者 → 細工された WebSocket アップグレードリクエストを送信
       → 認証トークンの検証が完了する前に悪意のあるフレームを注入
       → Gateway が悪意のあるフレームを認証済みコマンドとして処理
```

### 技術的な詳細

問題は Gateway の接続ステートマシンにありました：

1. クライアントが WebSocket 接続を開始
2. Gateway が接続を受け入れ、Bearer Token の検証を開始
3. **脆弱性**：検証が完了する前に、Gateway のメッセージキューがすでにフレームの受信を開始
4. 攻撃者がこのタイミングウィンドウを利用してコマンドフレームを注入

### 修正方法

修正では「接続ステージング」（Connection Staging）メカニズムが導入されました：

- WebSocket 接続が確立された後、Staging 状態に入る
- Staging 状態で受信されたすべてのフレームは、処理されずにバッファリングされる
- 認証が完了した後にのみ、接続が Active 状態に移行する
- タイムアウト（デフォルト 5 秒）以内に認証が完了しない接続は自動的に切断される

## 0.0.0.0 バインディングリスク

これは見落とされがちですが、非常に危険な設定上の問題です。

### 0.0.0.0 バインディングとは？

OpenClaw Gateway のデフォルト設定では、WebSocket サービスを `0.0.0.0:18789` にバインドします。これは Gateway が**すべてのネットワークインターフェース**で接続リクエストを待ち受けることを意味します。

### なぜ危険なのか？

以下のシナリオでは、0.0.0.0 バインディングが深刻なセキュリティリスクをもたらします：

| シナリオ | リスク |
|---------|--------|
| 公共 Wi-Fi に接続した開発環境 | Gateway がローカルネットワークに露出 |
| ファイアウォール未設定のクラウド VM | Gateway がパブリックインターネットに露出 |
| ホストネットワークモードの Docker コンテナ | Gateway がホストのすべてのインターフェースに露出 |
| マルチテナント環境 | 他のテナントが Gateway にアクセス可能 |

### 正しいバインディング設定

**個人開発環境：**

```yaml
# openclaw.config.yaml
gateway:
  host: "127.0.0.1"  # ループバックのみで待ち受け
  port: 18789
```

**本番環境（リバースプロキシ使用）：**

```yaml
# openclaw.config.yaml
gateway:
  host: "127.0.0.1"  # Gateway はリバースプロキシからの接続のみ受け付ける
  port: 18789

# Nginx/Caddy が TLS 終端と外部接続を担当
```

**Docker 環境：**

```yaml
# docker-compose.yml
services:
  openclaw-gateway:
    ports:
      - "127.0.0.1:18789:18789"  # "18789:18789" は使わないこと
```

## 個人ユーザー向けセキュリティベストプラクティス

### 1. 常に最新版を維持する

```bash
# 現在のバージョンを確認
openclaw version

# 最新バージョンに更新
openclaw update

# 自動セキュリティ更新を有効化
openclaw config set auto-security-update true
```

### 2. 強力な認証を使用する

```yaml
# openclaw.config.yaml
auth:
  type: "bearer"
  token_rotation: true
  token_ttl: "24h"
  # デフォルトトークンは使わないこと！
  # 強力なトークンを生成: openclaw auth generate-token
```

### 3. Skill の権限を制限する

```yaml
# 各 Skill に最小権限を設定
skills:
  weather-skill:
    permissions:
      - network:read  # ネットワーク読み取りのみ許可
    deny:
      - filesystem:*  # ファイルシステムアクセスを禁止
      - process:*     # システムコマンド実行を禁止
```

### 4. サードパーティ Skill を審査する

サードパーティの Skill をインストールする前に：

- Skill のソースコードをレビューする
- Skill 作者の信頼性を確認する
- コミュニティのレビューとダウンロード数を確認する
- まずサンドボックス環境でテストする

```bash
# サンドボックスモードで Skill をテスト
openclaw skill install --sandbox suspicious-skill
openclaw skill test suspicious-skill --verbose
```

### 5. ローカルデータを暗号化する

```yaml
# openclaw.config.yaml
storage:
  encryption: true
  encryption_key_source: "keychain"  # macOS Keychain / Windows Credential Store
```

## エンタープライズセキュリティベストプラクティス

### 1. ネットワーク分離

```
[Internet] → [WAF/CDN] → [Reverse Proxy] → [OpenClaw Gateway] → [Internal Network]
                                                    ↓
                                             [Agent Cluster]
                                                    ↓
                                             [Skill Sandbox]
```

- Gateway を DMZ または専用サブネットにデプロイ
- Agent と Skill を隔離された内部ネットワークで実行
- すべてのセグメント間通信はファイアウォールルールを通過させる

### 2. RBAC 設定

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

### 3. 監査ログ

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

### 4. Skill ホワイトリスト

エンタープライズ環境では、審査済みの Skill のみを許可すべきです：

```yaml
# openclaw.config.yaml
skills:
  marketplace:
    enabled: false  # 公開 Marketplace を無効化
  whitelist:
    enabled: true
    approved_skills:
      - "official/web-search"
      - "official/calendar"
      - "official/email"
      - "internal/company-kb"
      - "internal/ticket-system"
```

### 5. TLS 設定

```yaml
# openclaw.config.yaml
tls:
  enabled: true
  cert_file: "/etc/openclaw/tls/cert.pem"
  key_file: "/etc/openclaw/tls/key.pem"
  min_version: "1.3"
  client_auth: "require"  # Agent 接続用の mTLS
  client_ca_file: "/etc/openclaw/tls/ca.pem"
```

### 6. シークレット管理

```yaml
# openclaw.config.yaml
secrets:
  provider: "vault"  # HashiCorp Vault
  vault:
    address: "https://vault.company.com"
    auth_method: "kubernetes"
    secret_path: "secret/data/openclaw"
```

## セキュリティチェックリスト

OpenClaw を本番環境にデプロイする前に、以下の項目を確認してください：

- [ ] Gateway が 0.0.0.0 にバインドされていないこと
- [ ] 最新バージョン（>= v4.1.3）に更新済み
- [ ] デフォルト認証トークンを変更済み
- [ ] TLS 暗号化が有効
- [ ] RBAC が設定済み
- [ ] 監査ログが有効
- [ ] Skill ホワイトリストが設定済み（エンタープライズ環境）
- [ ] ネットワークファイアウォールルールが設定済み
- [ ] 自動セキュリティ更新が有効
- [ ] セキュリティインシデント対応計画が策定済み

## セキュリティ脆弱性の報告

OpenClaw のセキュリティ脆弱性を発見した場合は、以下のチャネルを通じて報告してください：

- **セキュリティメール**：security@openclaw.dev
- **HackerOne**：hackerone.com/openclaw
- **PGP Key**：公式ウェブサイトの /.well-known/security.txt で入手可能

公開の GitHub Issues でセキュリティ脆弱性を開示しないでください。OpenClaw セキュリティチームは、すべてのセキュリティ報告に 48 時間以内に対応することをお約束します。

---

*OpenClaw MasterClass チーム*
