---
title: "モジュール 11: 音声インタラクション & Live Canvas"
sidebar_position: 12
description: "OpenClaw の音声インタラクション（Vapi 統合）、Live Canvas ビジュアルフィードバックシステム、Companion App Beta (macOS) を学ぶ"
keywords: [OpenClaw, voice, Vapi, Live Canvas, Companion App, 音声, 音声アシスタント, macOS]
---

# モジュール 11: 音声インタラクション & Live Canvas

## 学習目標

本モジュールを修了すると、以下のことが可能になります：

- OpenClaw 音声インタラクションのアーキテクチャと Vapi 統合原理を理解する
- 音声入力と出力機能を設定する
- Live Canvas でビジュアルフィードバックを提供する
- Companion App Beta（macOS メニューバーアプリケーション）をインストール・使用する
- 完全な音声制御エージェントを構築する

## コアコンセプト

### 音声インタラクションアーキテクチャ

OpenClaw の音声機能は Vapi（Voice API）プラットフォームを通じて統合され、低遅延の音声対話を実現します。

### 主要コンポーネント

| コンポーネント | 機能 | 技術 |
|------|------|------|
| **Vapi** | 音声対話プラットフォーム | WebSocket, WebRTC |
| **STT (Speech-to-Text)** | 音声からテキスト | Deepgram / Whisper |
| **TTS (Text-to-Speech)** | テキストから音声 | ElevenLabs / Azure |
| **Live Canvas** | リアルタイムビジュアルフィードバック | HTML5 Canvas / WebSocket |
| **Companion App** | macOS システムトレイアプリ | Electron / Swift |

:::tip 音声遅延の低減
音声インタラクションの体験はエンドツーエンド遅延に依存します。最適化推奨：
1. STT は Deepgram を使用（遅延最小、約 300ms）
2. LLM はストリーミングモード（streaming response）を使用
3. TTS は ElevenLabs Turbo を使用（遅延約 500ms）
4. 全体目標遅延：2秒未満
:::

---

## 次のステップ

- [モジュール 5: 記憶システム](./module-05-memory)
- [モジュール 12: エンタープライズアプリケーション](./module-12-enterprise)
