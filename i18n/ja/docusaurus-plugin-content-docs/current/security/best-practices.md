---
title: セキュリティベストプラクティス
description: OpenClaw の完全セキュリティガイド。Gateway 設定、スキル監査、コンテナ隔離、API Key 管理まで、包括的な防御戦略を解説します。
sidebar_position: 1
---

# セキュリティベストプラクティス

OpenClaw は強力な AI エージェントプラットフォームですが、強力な機能は大きなセキュリティリスクも伴います。本ページでは、基本設定から高度な防御までのすべてのレイヤーをカバーする完全なセキュリティ防御ガイドを提供します。

:::danger セキュリティはオプションではありません
2026 年 3 月時点で、**30,000 以上の OpenClaw インスタンス** がセキュリティ設定の不備により侵害されています。Bitdefender のセキュリティ監査では **135,000 件の露出インスタンス** が発見されました。**ClawHavoc 事件** では 2,400 以上の悪意あるスキルが ClawHub に埋め込まれました。これらはすべて実際に起きたセキュリティインシデントです。
:::

---

## セキュリティインシデントの振り返り

ベストプラクティスに入る前に、過去に発生したセキュリティインシデントを振り返り、各推奨事項がなぜ重要なのかを理解しましょう。

| インシデント | 時期 | 影響 | ステータス |
|------------|------|------|---------|
| **CVE-2026-25253** | 2026 年初頭 | Gateway リモートコード実行（RCE）、v3.x 以前に影響 | 修正済み |
| **ClawHavoc** | 2025 年末 | 2,400 以上の悪意あるスキルが ClawHub に埋め込み、API Key と個人データを窃取 | 除去済み |
| **18789 ポート大規模侵害** | 継続中 | 30,000 以上のインスタンスが Gateway ポートの露出により侵害 | 継続的に発生 |
| **Bitdefender 監査** | 2026 年初頭 | 公開ネットワークからアクセス可能な 135,000 件の OpenClaw インスタンスを発見 | レポート公開済み |

---

## 第 1 防御線：Gateway セキュリティ

Gateway（port 18789）は OpenClaw 最大の攻撃面です。最優先で対処すべきセキュリティ設定です。

### 1. localhost にバインド

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"  # ローカル接続のみ受け付ける
```

:::danger 致命的なミス
`bind: "0.0.0.0"` は絶対に設定しないでください。これにより Gateway がネットワーク全体に公開され、誰でもエージェントにコマンドを送信できるようになります。CVE-2026-25253 は、まさに露出した Gateway を通じてリモートコード実行を実現した脆弱性です。
:::

### 2. Gateway 認証の有効化

```yaml
# ~/.openclaw/gateway.yaml
gateway:
  port: 18789
  bind: "127.0.0.1"
  auth:
    enabled: true
    token: "your-secure-random-token-here"
    # openssl rand -hex 32 で生成
```

安全なトークンの生成：

```bash
# 64 文字のランダムトークンを生成
openssl rand -hex 32

# または Python を使用
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. ファイアウォールルール

localhost にバインド済みでも、多層防御は常に有効です。

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

### 4. 安全なリモートアクセス

他のデバイスから OpenClaw にアクセスする必要がある場合は、**必ず暗号化されたチャンネル**を使用してください。

```bash
# 方法 1：SSH トンネル（推奨）
ssh -L 18789:127.0.0.1:18789 user@your-server

# 方法 2：WireGuard VPN
# サーバー上で VPN サブネットからのみ 18789 へのアクセスを許可
# /etc/wireguard/wg0.conf
[Interface]
Address = 10.0.0.1/24
PostUp = iptables -A INPUT -p tcp -s 10.0.0.0/24 --dport 18789 -j ACCEPT

# 方法 3：リバースプロキシ + TLS（上級者向け）
# Caddy または nginx + mTLS 双方向認証
```

:::warning 以下の方法は使用しないでください
- **ngrok / Cloudflare Tunnel**：追加の認証レイヤーなしでは Gateway が直接露出します
- **ポートフォワーディング**：ルーターでのポートフォワーディングは公開ネットワークへの露出と同等です
- **HTTP（TLS なし）**：中間者攻撃でトークンとメッセージが傍受される可能性があります
:::

---

## 第 2 防御線：コンテナとサンドボックスのセキュリティ

### Podman Rootless の使用（強く推奨）

```bash
# Podman が rootless モードで動作していることを確認
podman info | grep rootless
# rootless: true

# OpenClaw で Podman を使用するよう設定
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
```

### Docker vs Podman のセキュリティ比較

| 観点 | Docker（デフォルト） | Podman Rootless |
|------|-------------------|-----------------|
| Daemon 権限 | root | ユーザーレベル |
| サンドボックスエスケープ時のリスク | root 権限の取得が可能 | ユーザー権限のみ |
| 攻撃面 | Docker daemon ソケット | daemon なし |
| ネットワーク隔離 | 追加設定が必要 | デフォルトでより厳格 |
| 推奨度 | 使用可能だが非推奨 | **強く推奨** |

### コンテナセキュリティ設定

```yaml
# ~/.openclaw/gateway.yaml
execution:
  engine: podman
  rootless: true
  sandbox:
    # メモリ制限
    memory_limit: "512m"
    # CPU 制限
    cpu_limit: "1.0"
    # ネットワークアクセス
    network: "restricted"  # none / restricted / full
    # ファイルシステムアクセス
    filesystem:
      read_only: true
      allowed_paths:
        - "/tmp/openclaw-work"
    # 不要な Linux capabilities を無効化
    drop_capabilities:
      - "ALL"
    add_capabilities:
      - "NET_RAW"  # ネットワーク必要時のみ
```

### サンドボックスエスケープ防御

:::danger 高度な脅威
悪意あるスキルがサンドボックス環境からのエスケープを試みる可能性があります。以下の対策でリスクを大幅に軽減できます。
:::

```bash
# 1. seccomp プロファイルの有効化
# ~/.openclaw/seccomp-profile.json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "syscalls": [
    {
      "names": ["read", "write", "open", "close", "stat", "fstat"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}

# 2. SELinux または AppArmor の有効化
# Ubuntu: AppArmor が有効であることを確認
sudo aa-status

# 3. /proc と /sys へのアクセスを制限
# Podman はデフォルトで制限済み、Docker は追加設定が必要
```

---

## 第 3 防御線：スキル（Skill）のセキュリティ

ClawHavoc 事件は、スキルが OpenClaw 最大のサプライチェーン攻撃ベクトルであることを証明しました。

### スキルインストール前の審査フロー

```bash
# ステップ 1：スキルの詳細情報を確認
openclaw skill info skill-name

# ステップ 2：スキルのソースコードを確認
openclaw skill inspect skill-name

# ステップ 3：VirusTotal スキャン結果を確認（ClawHavoc 後に追加）
openclaw skill virustotal skill-name

# ステップ 4：コミュニティの評価とインストール数を確認
openclaw skill reviews skill-name
```

### スキルのセキュリティ分類

| リスクレベル | 説明 | 例 |
|------------|------|-----|
| **低** | 読み取り専用操作、ネットワークやファイルへのアクセスなし | テキスト処理、計算、フォーマット変換 |
| **中** | ネットワークアクセスあり、ファイルシステムアクセスなし | Web 検索、API クエリ、天気 |
| **高** | ファイルシステムまたはシステムコマンドへのアクセス | ファイル管理、シェル実行、システム監視 |
| **極高** | ネットワークとファイルシステムの両方にアクセス | browser-use、自動化スクリプト |

### スキル権限の最小化

```yaml
# ~/.openclaw/skills/skill-name/permissions.yaml
permissions:
  network:
    enabled: true
    allowed_domains:
      - "api.example.com"
      - "*.googleapis.com"
    denied_domains:
      - "*"  # デフォルトですべて拒否
  filesystem:
    enabled: false
  shell:
    enabled: false
  environment_variables:
    allowed:
      - "HOME"
      - "PATH"
    denied:
      - "OPENAI_API_KEY"  # スキルが API Key を読み取るのを防止
      - "ANTHROPIC_API_KEY"
```

:::tip スキル監査チェックリスト
スキルインストール前の完全な審査手順については [スキル監査チェックリスト](/docs/security/skill-audit-checklist) を参照してください。
:::

---

## 第 4 防御線：API Key とシークレットの管理

### やってはいけないこと

```yaml
# ❌ gateway.yaml に API Key をハードコードしない
providers:
  openai:
    api_key: "sk-aBcDeFgHiJkLmNoPqRsTuVwXyZ"

# ❌ SOUL.md に API Key を含めない
# ❌ Reddit / Discord で完全な設定を共有しない
# ❌ ~/.openclaw/ を公開 Git リポジトリに含めない
```

### 正しい方法

```bash
# 方法 1：環境変数（基本）
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."

# 方法 2：dotenv ファイル（推奨）
# ~/.openclaw/.env（このファイルが Git で追跡されないことを確認）
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# 方法 3：パスワードマネージャー（最良）
# 1Password CLI を使用
eval $(op signin)
export OPENAI_API_KEY=$(op item get "OpenAI" --fields api_key)

# 方法 4：システムキーチェーン（macOS）
security add-generic-password -s "openclaw-openai" -a "api_key" -w "sk-..."
```

```yaml
# ~/.openclaw/gateway.yaml — 環境変数を参照
providers:
  openai:
    api_key: "${OPENAI_API_KEY}"
  anthropic:
    api_key: "${ANTHROPIC_API_KEY}"
```

### API Key のローテーション戦略

| 頻度 | 適用場面 |
|------|---------|
| 90 日ごと | 一般的な使用 |
| 即座に | 漏洩の疑いがある場合 |
| 30 日ごと | 高セキュリティ要件の環境 |
| 新スキルのインストール後 | 新スキルがネットワークと環境変数へのアクセス権を持つ場合 |

---

## 第 5 防御線：メモリシステムのセキュリティ

メモリシステムにはエージェントとのすべての会話履歴と個人データが含まれています。

### メモリファイルの暗号化

```bash
# 方法 1：ディスクレベルの暗号化
# macOS：FileVault（システム設定 → セキュリティとプライバシー → FileVault）
# Linux：LUKS
sudo cryptsetup luksFormat /dev/sdX
sudo cryptsetup luksOpen /dev/sdX openclaw-memory

# 方法 2：ディレクトリレベルの暗号化（Linux）
# gocryptfs を使用
gocryptfs -init ~/.openclaw/memory-encrypted
gocryptfs ~/.openclaw/memory-encrypted ~/.openclaw/memory
```

### メモリクリーンアップ戦略

```bash
# メモリ使用量の確認
openclaw memory stats

# 特定期間のメモリを削除
openclaw memory prune --before "2025-01-01"

# 特定の会話のメモリを削除
openclaw memory delete --conversation-id "abc123"

# 完全リセット（復元不可）
openclaw memory reset --confirm
```

:::warning メモリ内の機密情報
エージェントは会話中に銀行口座番号、住所、パスワードなどの機密情報を収集し、メモリシステムに保存する可能性があります。定期的にメモリの内容を確認し、保存すべきでない機密データがないことを確認してください。
:::

---

## セキュリティ設定チェックリスト

以下のチェックリストを使用して、OpenClaw インストールのセキュリティを確認してください。

### 必須完了（Critical）

- [ ] Gateway が `127.0.0.1` にバインド（`0.0.0.0` ではない）
- [ ] Gateway 認証が有効
- [ ] Podman rootless を使用（Docker ではない）
- [ ] API Key は環境変数を使用（ハードコードではない）
- [ ] 最新バージョンに更新済み（CVE-2026-25253 を修正）
- [ ] メッセージングプラットフォームにユーザーホワイトリストを設定

### 強く推奨（High）

- [ ] ファイアウォールで 18789 ポートの外部アクセスをブロック
- [ ] ディスク暗号化を有効化
- [ ] スキルインストール前にセキュリティ審査を完了
- [ ] リモートアクセスには SSH トンネルまたは VPN を使用
- [ ] API Key を定期的にローテーション

### 推奨完了（Medium）

- [ ] seccomp プロファイルの有効化
- [ ] メモリクリーンアップ戦略の設定
- [ ] ネットワークアクティビティの監視
- [ ] メモリシステムの暗号化
- [ ] インストール済みスキルの更新を定期的に確認

### オプション（Low）

- [ ] Pi-hole / AdGuard 等の DNS 防御の設定
- [ ] OpenClaw 実行用の専用ユーザーアカウント
- [ ] ログの集中管理
- [ ] 自動セキュリティスキャンの設定

---

## セキュリティインシデント対応フロー

OpenClaw インスタンスが侵害された疑いがある場合：

### 即座のアクション

```bash
# 1. OpenClaw を停止
openclaw stop --force

# 2. 証拠を保全（クリーンアップ前にバックアップ）
cp -r ~/.openclaw/ ~/openclaw-incident-backup-$(date +%Y%m%d)

# 3. 不審なアクティビティを確認
# ログ内の異常を検索
grep -i "error\|unauthorized\|unknown\|suspicious" ~/.openclaw/logs/*.log

# 4. インストール済みスキルを確認
ls -la ~/.openclaw/skills/

# 5. ネットワーク接続を確認
netstat -an | grep 18789
```

### 復旧手順

```bash
# 1. すべての API Key をローテーション（即座に！）
# - OpenAI、Anthropic、Google 等すべての LLM プロバイダー
# - Telegram、Discord 等すべてのメッセージングプラットフォームトークン

# 2. OpenClaw をクリーンインストール
npm uninstall -g @openclaw/cli
rm -rf ~/.openclaw/
npm install -g @openclaw/cli
openclaw init

# 3. 検証済みのスキルのみ再インストール

# 4. メモリデータを復元（改ざんされていないことを確認）

# 5. セキュリティ設定を強化（本ドキュメントのすべての推奨事項を参照）
```

---

## 継続的なセキュリティメンテナンス

セキュリティは一度きりの設定ではなく、継続的なプロセスです。

### 毎日

- OpenClaw ログの異常を確認
- Gateway が想定された接続のみを受け付けていることを確認

### 毎週

- OpenClaw のセキュリティアップデートの有無を確認
- スキルの新バージョンを確認

### 毎月

- API Key のローテーション
- メモリシステム内の機密データを監査
- ファイアウォールルールが有効であることを確認

### 四半期ごと

- インストール済みスキルがまだ必要かどうかを再評価
- コンテナイメージの更新
- バックアップ復元プロセスのテスト

---

## 関連リンク

- [脅威モデル分析](/docs/security/threat-model) — すべての攻撃ベクトルと攻撃面の理解
- [スキル監査チェックリスト](/docs/security/skill-audit-checklist) — スキルインストール前の完全な審査手順
- [トラブルシューティング](/docs/troubleshooting/common-issues) — セキュリティ関連のよくある問題
