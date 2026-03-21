---
sidebar_position: 9
title: "媒体 Skills"
description: "OpenClaw 媒体类 Skills 完整评测：Felo Slides、Spotify、YouTube Digest、Image Generation、TweetClaw、Voice/Vapi"
keywords: [OpenClaw, Skills, Media, Felo Slides, Spotify, YouTube, Image Generation, TweetClaw, Voice]
---

# 媒体 Skills (Media)

媒体类 Skills 让 OpenClaw Agent 具备多媒体处理能力 — 从生成简报、管理音乐到摘要 YouTube 视频。这些 Skills 扩展了 Agent 从纯文字到多模态的能力范围。

---

## #25 — Felo Slides

| 属性 | 内容 |
|------|------|
| **排名** | #25 / 50 |
| **类别** | Media |
| **总分** | 55 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install felo-slides` |
| **目标用户** | 需要快速制作简报的用户 |

### 功能说明

使用自然语言描述生成专业简报（PPT/PDF）：

- **自然语言 → 简报**：描述主题和大纲即可生成
- **模板系统**：多种专业设计模板
- **图表生成**：自动生成图表和信息图表
- **多语言支援**：简体中文、英文、日文等
- **导出格式**：PPTX、PDF、Google Slides
- **内容填充**：结合搜索 Skill 自动填充最新数据

### 为什么重要

制作简报是许多知识工作者最耗时的任务之一。Felo Slides 让 Agent 在几分钟内生成一份结构完整、设计专业的简报，你只需要审核和微调。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 7 | 7 | 8 | 7 | 6 | 7 | 6 | **55** |

### 安装与配置

```bash
clawhub install felo-slides

# 配置 API Key
openclaw skill configure felo-slides \
  --api-key your_felo_slides_key

# 使用示例
openclaw run "用 Felo Slides 制作一份 10 页简报，主题是 AI Agent 在企业的应用趋势"

# 指定模板和语言
openclaw run felo-slides \
  --template business-modern \
  --language zh-Hant \
  --topic "Q1 营运报告"
```

### 依赖与安全

- **依赖**：Felo Slides API Key
- **权限需求**：网络存取（API 呼叫）、本机文件写入（导出简报）
- **安全性**：SEC 7/10 — 简报内容会发送到 Felo 服务器处理
- **替代方案**：Google Slides API 直接操作；Markdown → PPTX 转换工具

---

## #27 — Spotify

| 属性 | 内容 |
|------|------|
| **排名** | #27 / 50 |
| **类别** | Media |
| **总分** | 55 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/spotify-claw` |
| **目标用户** | Spotify Premium 用户 |

### 功能说明

控制 Spotify 播放和管理音乐：

- 播放/暂停/跳过曲目
- 搜索歌曲、专辑、艺人
- 管理播放清单
- 根据场景推荐音乐（如「帮我播适合写进程的音乐」）
- 查看最近播放记录

### 为什么重要

音乐是许多人工作流程的一部分。让 Agent 根据你的日历和任务自动调整背景音乐 — 例如专注工作时播放 Lo-fi、会议前播放轻松音乐、运动时播放高能量歌单。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 7 | 7 | 7 | 7 | 7 | 8 | 6 | **55** |

### 安装与配置

```bash
clawhub install community/spotify-claw

# OAuth 授权
openclaw auth spotify

# 使用示例
openclaw run "播放一些适合工作的 Lo-fi 音乐"
openclaw run "把目前这首歌加到『我的最爱』播放清单"
```

### 依赖与安全

- **依赖**：Spotify Premium 账号、Spotify OAuth
- **权限需求**：`user-modify-playback-state`, `playlist-modify-private`
- **安全性**：SEC 8/10 — Spotify 权限范围有限，不涉及敏感数据
- **替代方案**：Apple Music 集成尚在社区开发中

---

## #32 — YouTube Digest

| 属性 | 内容 |
|------|------|
| **排名** | #32 / 50 |
| **类别** | Media |
| **总分** | 53 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/youtube-digest` |
| **目标用户** | YouTube 重度用户、学习者 |

### 功能说明

从 YouTube 视频提取知识：

- **字幕提取**：获取视频的自动/手动字幕
- **内容摘要**：生成视频重点摘要
- **时间戳笔记**：标记重要时间点
- **频道追踪**：追踪特定频道的新视频
- **播放清单分析**：汇总整个播放清单的知识

### 为什么重要

YouTube 是世界上最大的知识库之一，但看完一部 1 小时的教程视频需要很多时间。YouTube Digest 让 Agent 在几秒内生成视频摘要，你可以快速决定是否值得完整观看。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 6 | 7 | 6 | 7 | 8 | 6 | **53** |

### 安装与配置

```bash
clawhub install community/youtube-digest

# 配置（选用：YouTube API Key 可提升效率）
openclaw skill configure youtube-digest \
  --youtube-api-key your_api_key  # 选用

# 使用示例
openclaw run "帮我摘要这部视频：https://youtube.com/watch?v=xxxxx"
openclaw run "追踪 Fireship 频道，每周给我新视频摘要"
```

### 依赖与安全

- **依赖**：YouTube API Key（选用，无 Key 也能用但速度较慢）
- **权限需求**：YouTube Data API（唯读）
- **安全性**：SEC 8/10 — 唯读存取，不修改任何数据
- **替代方案**：Web Browsing Skill 直接浏览 YouTube 并手动摘要

---

## #35 — Image Generation

| 属性 | 内容 |
|------|------|
| **排名** | #35 / 50 |
| **类别** | Media |
| **总分** | 52 / 80 |
| **成熟度** | 🟡 Beta |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/image-gen` |
| **目标用户** | 需要快速生成图片的用户 |

### 功能说明

透过多种 AI 图片生成服务创建图片：

- **文字转图片**：自然语言描述生成图片
- **多模型支援**：DALL-E 3、Stable Diffusion、Midjourney API
- **图片编辑**：修改现有图片
- **批次生成**：一次生成多个变体
- **风格控制**：指定艺术风格、比例、解析度

### 为什么重要

需要社区贴文配图、简报插图、概念可视化时，Image Generation Skill 让你不需要离开 OpenClaw 就能生成所需图片。搭配 Felo Slides 使用效果尤佳。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 7 | 6 | 6 | 7 | 6 | 6 | 7 | 7 | **52** |

### 安装与配置

```bash
clawhub install community/image-gen

# 配置图片生成服务（择一）
openclaw skill configure image-gen \
  --provider openai \
  --api-key sk-xxxxxxxxxxxx

# 使用示例
openclaw run "生成一张赛博庞克风格的台北 101 插图"
```

### 依赖与安全

- **依赖**：图片生成 API Key（OpenAI、Stability AI 等）
- **权限需求**：API 呼叫 + 本机文件写入
- **安全性**：SEC 7/10 — 图片描述会发送到第三方服务
- **替代方案**：直接使用 DALL-E 或 Midjourney 官方接口

---

## #39 — TweetClaw

| 属性 | 内容 |
|------|------|
| **排名** | #39 / 50 |
| **类别** | Media / Social |
| **总分** | 50 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/tweetclaw` |
| **目标用户** | 社区媒体经营者、X/Twitter 用户 |

### 功能说明

X（前 Twitter）内容管理：

- 读取特定账号的最新推文
- 搜索特定主题的推文
- 草拟推文（需手动确认后发布）
- 追踪特定话题趋势
- 分析推文交互数据

### 为什么重要

对于需要经营社区媒体的用户，TweetClaw 让 Agent 能追踪产业趋势、草拟推文、分析交互表现。搭配 Summarize Skill 可以生成每日 Twitter 摘要。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | **50** |

### 安装与配置

```bash
clawhub install community/tweetclaw

# 配置 X API（需要 Basic 或 Pro 方案）
openclaw skill configure tweetclaw \
  --api-key your_x_api_key \
  --api-secret your_x_api_secret \
  --access-token your_access_token \
  --access-secret your_access_secret
```

:::warning X API 费用
X API 已改为付费制。Basic 方案 $100/月，功能有限。TweetClaw 的唯读功能可搭配免费的 Web Browsing Skill 替代。
:::

### 依赖与安全

- **依赖**：X API Key（付费）
- **权限需求**：Tweet 读取/写入
- **安全性**：SEC 7/10 — 建议限制为唯读模式，手动发布推文
- **替代方案**：Web Browsing Skill 搭配 X 搜索（免费但功能有限）

---

## #40 — Voice / Vapi

| 属性 | 内容 |
|------|------|
| **排名** | #40 / 50 |
| **类别** | Media |
| **总分** | 50 / 80 |
| **成熟度** | 🟠 Alpha |
| **官方/社区** | 社区 (Community) |
| **安装方式** | `clawhub install community/voice-vapi` |
| **目标用户** | 语音交互需求用户 |

### 功能说明

为 OpenClaw Agent 加入语音能力：

- **语音输入**：语音转文字（STT）
- **语音输出**：文字转语音（TTS）
- **语音对话**：实时语音交互模式
- **多语言**：支援中英日韩等语言
- **自定义声音**：选择不同的 TTS 声音

### 为什么重要

语音是最自然的人机交互方式。Voice/Vapi Skill 让你可以用说的方式操控 Agent，适合开车、做家事等双手不方便打字的场景。

### 评分明细

| REL | COM | TRC | VAL | MNT | RLB | SEC | LRN | 总分 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 6 | 6 | 5 | 7 | 6 | 6 | 7 | 7 | **50** |

### 安装与配置

```bash
clawhub install community/voice-vapi

# 配置语音服务（Vapi）
openclaw skill configure voice-vapi \
  --provider vapi \
  --api-key your_vapi_key \
  --voice-id alloy \
  --language zh-TW

# 启动语音模式
openclaw voice
```

### 依赖与安全

- **依赖**：Vapi API Key 或其他 TTS/STT 服务
- **权限需求**：麦克风存取、网络存取
- **安全性**：SEC 7/10 — 语音数据会发送到第三方服务处理
- **替代方案**：OpenClaw 未来版本可能内建语音功能（参考 Module 11）

---

## 媒体 Skills 组合推荐

### 内容创作者

```bash
clawhub install felo-slides
clawhub install community/image-gen
clawhub install community/tweetclaw
clawhub install community/spotify-claw
```

### 学习者

```bash
clawhub install community/youtube-digest
clawhub install community/summarize
clawhub install community/obsidian-claw
```

### 多模态 Agent

```bash
clawhub install community/voice-vapi
clawhub install community/image-gen
clawhub install community/youtube-digest
# 看、听、说、画 — 全方位 Agent
```
