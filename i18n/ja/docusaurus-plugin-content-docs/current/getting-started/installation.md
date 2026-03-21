---
title: インストールガイド
description: macOS、Linux、Windows WSL2 への OpenClaw インストール手順を完全解説。システム要件、セキュリティ設定、Podman の推奨事項も含みます。
sidebar_position: 1
---

# インストールガイド

本ページでは、OpenClaw をゼロからインストールする手順を解説します。所要時間は約 10〜15 分です。

---

## システム要件

インストール前に、以下の最低要件を満たしていることを確認してください。

| 項目 | 最低要件 | 推奨構成 |
|------|---------|---------|
| **OS** | macOS 13+、Ubuntu 22.04+、Windows 11 (WSL2) | macOS 14+ または Ubuntu 24.04 |
| **Node.js** | 22.16+ | **24.x（推奨）** |
| **メモリ** | 4 GB | 8 GB 以上 |
| **ディスク容量** | 2 GB | 5 GB（スキルキャッシュ含む） |
| **コンテナエンジン** | Docker 24+ または Podman 5+ | **Podman 5+（推奨）** |

:::warning Node.js のバージョンは重要です
OpenClaw は Node.js 22.16 で導入された新機能を多用しています。古いバージョンでは予期しないエラーが発生します。最高のパフォーマンスと互換性のために、Node.js 24.x の使用を強く推奨します。
:::

---

## Node.js のインストール

適切なバージョンの Node.js がまだインストールされていない場合は、**nvm**（Node Version Manager）の利用を推奨します。

```bash
# nvm のインストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# シェル設定の再読み込み
source ~/.bashrc  # または source ~/.zshrc

# Node.js 24 のインストール
nvm install 24
nvm use 24

# バージョンの確認
node --version
# v24.x.x と表示されるはずです
```

---

## macOS でのインストール

### 方法 1：Homebrew を使用（推奨）

```bash
# OpenClaw のインストール
brew tap openclaw/tap
brew install openclaw

# インストールの確認
openclaw --version
```

### 方法 2：npm を使用

```bash
# グローバルインストール
npm install -g @openclaw/cli

# インストールの確認
openclaw --version
```

### 方法 3：ソースコードからビルド

```bash
# リポジトリのクローン
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 依存パッケージのインストール
npm install

# ビルド
npm run build

# グローバルにリンク
npm link

# 確認
openclaw --version
```

---

## Linux でのインストール（Ubuntu / Debian）

```bash
# パッケージリストの更新
sudo apt update && sudo apt upgrade -y

# Node.js 24 がインストール済みであることを確認（上記の nvm 手順を参照）

# npm でインストール
npm install -g @openclaw/cli

# インストールの確認
openclaw --version
```

### Arch Linux

```bash
# AUR からインストール
yay -S openclaw
```

### Fedora / RHEL

```bash
# npm でインストール
npm install -g @openclaw/cli
```

---

## Windows でのインストール（WSL2）

:::info Windows ユーザーへの注意
OpenClaw はネイティブ Windows 環境を**サポートしていません**。WSL2（Windows Subsystem for Linux 2）を使用して実行する必要があります。
:::

```bash
# ステップ 1：WSL2 の有効化（PowerShell を管理者として実行）
wsl --install -d Ubuntu-24.04

# ステップ 2：WSL2 環境に入る
wsl

# ステップ 3：Node.js のインストール（WSL2 Ubuntu 内）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 24

# ステップ 4：OpenClaw のインストール
npm install -g @openclaw/cli

# ステップ 5：確認
openclaw --version
```

---

## コンテナエンジンのインストール

OpenClaw のスキル実行層は、サンドボックス環境を提供するためにコンテナエンジンに依存しています。**Podman の使用を強く推奨します**。

### なぜ Podman を選ぶのか？

| 比較項目 | Docker | Podman |
|---------|--------|--------|
| root 権限 | デフォルトで root 必要（daemon モード） | **Rootless（root 不要）** |
| バックグラウンドサービス | dockerd daemon が必要 | daemon なし |
| セキュリティ | 攻撃面が大きい | **攻撃面が小さい** |
| 互換性 | Docker CLI | Docker CLI と完全互換 |

:::danger セキュリティ上の考慮
Docker daemon は root 権限で動作します。OpenClaw のスキルサンドボックスが突破された場合、攻撃者がホストの root 権限を取得する可能性があります。Podman の rootless モードはこのリスクを大幅に軽減します。
:::

### Podman のインストール

```bash
# macOS
brew install podman
podman machine init
podman machine start

# Ubuntu / Debian
sudo apt install -y podman

# Fedora
sudo dnf install -y podman
```

### Docker のインストール（それでも Docker を選択する場合）

```bash
# macOS
brew install --cask docker

# Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# グループ変更を適用するためにログアウトして再ログイン
```

---

## 初回実行と検証

インストール完了後、以下のコマンドで初期化を行います。

```bash
# OpenClaw の初期化（設定ディレクトリが作成されます）
openclaw init

# 以下のような出力が表示されます：
# 🦞 OpenClaw initialized!
# Config directory: ~/.openclaw/
# Gateway port: 18789
# Container engine: podman
```

すべてのコンポーネントが正常かどうかを確認します。

```bash
# ヘルスチェックの実行
openclaw doctor

# 期待される出力：
# ✓ Node.js v24.x.x
# ✓ Podman 5.x.x (rootless)
# ✓ Gateway port 18789 available
# ✓ Config directory ~/.openclaw/ exists
# ✓ Memory system initialized
# All checks passed!
```

---

## セキュリティ設定：バインドアドレス

これはインストールプロセスにおける**最も重要なセキュリティステップ**です。

OpenClaw Gateway はデフォルトで port 18789 をリッスンします。これが `127.0.0.1`（ローカルホスト）にのみバインドされていることを**必ず確認**してください。`0.0.0.0`（すべてのネットワークインターフェース）には**絶対にバインドしないでください**。

設定ファイルの確認：

```bash
# Gateway 設定の確認
cat ~/.openclaw/gateway.yaml
```

`bind` フィールドの値を確認します。

```yaml
# ~/.openclaw/gateway.yaml

gateway:
  port: 18789
  # ✅ 正しい：ローカルホストのみにバインド
  bind: "127.0.0.1"

  # ❌ 間違い：Gateway がネットワーク全体に公開されます！
  # bind: "0.0.0.0"
```

:::danger 30,000 以上のインスタンスが侵害された教訓
CVE-2026-25253 は、露出した 18789 ポートを通じて攻撃者がリモートコードを実行することを可能にしました。30,000 以上の OpenClaw インスタンスが `0.0.0.0` にバインドしたことで侵害されています。**絶対に** Gateway ポートを公開ネットワークに露出させないでください。

リモートアクセスが必要な場合は、SSH トンネルまたは VPN を使用してください：

```bash
# SSH トンネルを使用してリモートの OpenClaw に安全にアクセス
ssh -L 18789:127.0.0.1:18789 user@your-server
```
:::

---

## ファイアウォールの推奨設定

`127.0.0.1` に正しくバインドしている場合でも、多層防御は常に有効です。

```bash
# macOS — pf を使用
echo "block in proto tcp from any to any port 18789" | sudo pfctl -ef -

# Linux — ufw を使用
sudo ufw deny 18789/tcp

# Linux — iptables を使用
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP
sudo iptables -A INPUT -p tcp -s 127.0.0.1 --dport 18789 -j ACCEPT
```

---

## ディレクトリ構造

インストール完了後、OpenClaw は以下のディレクトリ構造を作成します。

```
~/.openclaw/
├── gateway.yaml          # Gateway 設定
├── soul.md               # AI パーソナリティ設定ファイル
├── providers/            # LLM プロバイダー設定
│   └── default.yaml
├── channels/             # メッセージングプラットフォーム接続設定
├── skills/               # インストール済みスキル
│   └── .cache/           # スキルキャッシュ
├── memory/               # メモリシステムデータ
│   ├── wal/              # Write-Ahead Log
│   └── compacted/        # 圧縮済み長期メモリ
└── logs/                 # 実行ログ
```

---

## よくあるインストールの問題

### `npm install -g` の権限エラー

```bash
# sudo npm install -g は使用しないでください！
# nvm で Node.js を管理すれば権限問題は発生しません

# または npm グローバルディレクトリを変更
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Podman machine が起動しない（macOS）

```bash
# Podman machine のリセット
podman machine rm
podman machine init --cpus 2 --memory 4096
podman machine start
```

### WSL2 のメモリ不足

Windows のユーザーディレクトリに `.wslconfig` を作成します。

```ini
# C:\Users\ユーザー名\.wslconfig
[wsl2]
memory=8GB
swap=4GB
```

---

## 次のステップ

インストールが完了しました。次は [初期設定](./first-setup.md) に進んで初期設定を完了しましょう。
