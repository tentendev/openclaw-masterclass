---
title: よくある問題のトラブルシューティング
description: OpenClaw のよくある問題の診断と解決策 — インストール、Gateway、通信プラットフォーム接続、スキル、記憶システムなど各種問題の解決ガイド。
sidebar_position: 1
---

# よくある問題のトラブルシューティング

このページでは OpenClaw ユーザーが最もよく遭遇する問題とその解決策を収集しています。問題はカテゴリ別に整理され、迅速に検索できます。

:::tip トラブルシューティング前にまずヘルスチェック
ほとんどの問題は `openclaw doctor` で迅速に特定できます：
```bash
openclaw doctor
```
このコマンドは Node.js バージョン、コンテナエンジン、Gateway の状態、記憶システムなど、すべてのコアコンポーネントをチェックします。
:::

---

## インストール問題

### 問題：`npm install -g @openclaw/cli` 権限不足

**エラーメッセージ：**
```
EACCES: permission denied, mkdir '/usr/local/lib/node_modules/@openclaw'
```

**解決策：**
```bash
# 方法 1：nvm を使用（推奨）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
npm install -g @openclaw/cli

# 方法 2：npm のデフォルトディレクトリを変更
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g @openclaw/cli
```

---

## Gateway 問題

### 問題：Gateway が起動しない — ポート使用中

**エラーメッセージ：**
```
Error: listen EADDRINUSE: address already in use 127.0.0.1:18789
```

**解決策：**
```bash
# ポートを使用しているプロセスを特定
lsof -i :18789

# OpenClaw を停止して再起動
openclaw stop
openclaw start
```

### 問題：Gateway が `0.0.0.0` にバインドされている

:::danger 緊急セキュリティ問題
Gateway が `0.0.0.0:18789` にバインドされている場合、あなたのエージェントはインターネット上の誰でもアクセスできます。**直ちに修正してください。**
:::

```bash
# 設定を確認
grep -r "bind\|host" ~/.openclaw/config.*

# 127.0.0.1 に変更
openclaw config set gateway.host 127.0.0.1
openclaw restart
```

---

## スキル問題

### 問題：スキルのインストール失敗

```bash
# ClawHub の接続を確認
clawhub ping

# キャッシュをクリア
clawhub cache clear

# 再試行
clawhub install <skill-name>
```

---

## 記憶システム問題

### 問題：エージェントが以前伝えた情報を忘れる

**考えられる原因：**
1. WAL が無効になっている
2. 記憶は存在するが Context Window に選択されていない
3. 圧縮時に低重要度として破棄された

```bash
# WAL が有効か確認
openclaw config get memory.wal_enabled

# 記憶を検索
openclaw memory search "キーワード"

# Context Window の使用状況を確認
openclaw memory stats
```
