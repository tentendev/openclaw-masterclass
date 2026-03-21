---
title: "모듈 8: 멀티 에이전트 아키텍처"
sidebar_position: 9
description: "OpenClaw의 멀티 에이전트 협업 아키텍처 학습, Discord/Matrix를 통한 크로스 머신 에이전트 통신으로 에이전트 팀 구축"
---

# 模組 8: 多 Agent 架構

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- 理解 OpenClaw 多 Agent 架構的設計哲學
- 설정跨機器的 Agent 커뮤니케이션（透過 Discord / Matrix）
- 設計並實作 Agent 角色分工
- 建構一個 3 Agent 協作團隊（리서치員、寫手、審稿者）
- 管理 Agent 之間的메시지流與任務協調
- 處理多 Agent 環境中的衝突與錯誤

## 핵심 개념

### 多 Agent 的設計哲學

OpenClaw 的多 Agent 架構有一個獨特的理念：**Agent 之間不是透過專用的 API 커뮤니케이션，而是透過與人類相同的커뮤니케이션管道（Discord、Matrix）進行對話**。這個設計帶來幾個優勢：

1. **人類可觀察** — 所有 Agent 對話都在 Discord 채널中可見
2. **人類可介入** — 隨時可以加入對話、修正方向
3. **零額外基礎設施** — 不需要專用的 message queue 或 RPC 框架
4. **自然語言協議** — Agent 用自然語言溝通，而非固定格式的 API

```
┌─────────────────────────────────────────┐
│           Discord / Matrix 서버        │
│                                         │
│  #research-channel                      │
│    ├── 🤖 Agent-Researcher              │
│    └── 👤 Human Observer                │
│                                         │
│  #writing-channel                       │
│    ├── 🤖 Agent-Writer                  │
│    └── 🤖 Agent-Reviewer                │
│                                         │
│  #coordination-channel                  │
│    ├── 🤖 Agent-Researcher              │
│    ├── 🤖 Agent-Writer                  │
│    ├── 🤖 Agent-Reviewer                │
│    └── 👤 Human Manager                 │
└─────────────────────────────────────────┘

Machine A: Agent-Researcher (OpenClaw Instance 1)
Machine B: Agent-Writer     (OpenClaw Instance 2)
Machine C: Agent-Reviewer   (OpenClaw Instance 3)
```

### Agent 角色模型

| 角色 | 職責 | 所需 Skills | 典型 LLM |
|------|------|-------------|----------|
| **Coordinator** | 分配任務、監督進度 | task-manager, scheduler | GPT-4o / Claude |
| **Researcher** | 資訊收集、網頁크롤링 | web-search, browser, summarizer | GPT-4o |
| **Writer** | 內容創作、문서撰寫 | text-generator, markdown-tools | Claude |
| **Reviewer** | 品質審查、事實查核 | fact-checker, grammar-check | GPT-4o |
| **Coder** | 程式開發、디버깅 | code-runner, git-tools | Claude / Codex |

### 커뮤니케이션模式

OpenClaw 支援三種多 Agent 커뮤니케이션模式：

**1. 直接提及（Direct Mention）**
```
Agent-Researcher: @Agent-Writer 리서치已完成，以下是 AI 產業的 5 個關鍵趨勢...
```

**2. 채널廣播（Channel Broadcast）**
```
Agent-Coordinator: 各位，本週任務分配如下：
- @Agent-Researcher 負責調研 NemoClaw 最新進展
- @Agent-Writer 負責撰寫技術문서
- @Agent-Reviewer 負責審稿
```

**3. 私訊轉發（DM Relay）**
```
Agent-A → DM → Agent-B: [機密데이터，不在公開채널發送]
```

## 실습 튜토리얼

### 步驟一：準備 Discord 環境

首先생성一個專用的 Discord 서버作為多 Agent 的커뮤니케이션平台：

```bash
# 생성 3 個 Discord Bot（每個 Agent 一個）
# 前往 https://discord.com/developers/applications
# 為每個 Bot 생성 Application 並取得 Token
```

建議的채널結構：

```
📂 Agent Team
  ├── 📝 #coordination    (所有 Agent + 人類)
  ├── 🔬 #research        (Researcher 的工作區)
  ├── ✍️  #writing          (Writer 的工作區)
  ├── 📋 #review          (Reviewer 的工作區)
  └── 📊 #results         (最終成果배포)
```

### 步驟二：설정 Agent 實例

**Agent 1 — Researcher（리서치員）：**

```json
// machine-a/settings.json
{
  "name": "Agent-Researcher",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_RESEARCHER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "research"],
      "respond_to_mentions": true,
      "respond_to_channels": ["research"]
    }
  },
  "skills": [
    "web-search",
    "browser-tools",
    "summarizer",
    "note-taker"
  ],
  "llm": {
    "provider": "openai",
    "model": "gpt-4o"
  }
}
```

Researcher 的 `soul.md`：

```markdown
# Agent-Researcher

你是一個專業的리서치員 Agent。你的職責是：

1. 接收來自 @Agent-Coordinator 或人類的리서치任務
2. 使用網頁검색和브라우저工具收集資訊
3. 整理리서치結果為結構化요약
4. 將結果배포到 #research 채널
5. 通知 @Agent-Writer 리서치已完成

## 워크플로
- 收到任務後先確認理解，답변「收到，開始리서치：[主題]」
- 리서치過程中每 10 分鐘在 #research 배포進度
- 完成後在 #coordination 채널 @ 通知相關人員
- 如果遇到困難或需要更多資訊，主動詢問

## 限制
- 不要自行創作內容，只收集和整理事實
- 引用必須附上來源連結
- 리서치時間超過 30 分鐘需要回報
```

**Agent 2 — Writer（寫手）：**

```json
// machine-b/settings.json
{
  "name": "Agent-Writer",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_WRITER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "writing", "research"],
      "respond_to_mentions": true,
      "respond_to_channels": ["writing"]
    }
  },
  "skills": [
    "text-generator",
    "markdown-tools",
    "grammar-check"
  ],
  "llm": {
    "provider": "anthropic",
    "model": "claude-sonnet-4-20250514"
  }
}
```

Writer 的 `soul.md`：

```markdown
# Agent-Writer

你是一個專業的技術寫手 Agent。你的職責是：

1. 監聽 #research 채널，接收 @Agent-Researcher 的리서치結果
2. 根據리서치結果撰寫技術문서或部落格文章
3. 將草稿배포到 #writing 채널
4. 收到 @Agent-Reviewer 的수정建議後進行修訂
5. 最終版本배포到 #results 채널

## 寫作風格
- 使用한국어，技術術語保留英文
- 段落清晰，善用標題、列表、程式碼區塊
- 每篇文章 800-1500 字
- 附上參考데이터來源

## 協作規則
- 收到리서치結果後답변「收到，預計 [X] 分鐘完成初稿」
- 初稿完成後 @ 通知 @Agent-Reviewer
- 修訂後附上變更說明
```

**Agent 3 — Reviewer（審稿者）：**

```json
// machine-c/settings.json
{
  "name": "Agent-Reviewer",
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN_REVIEWER}",
      "guild_id": "YOUR_GUILD_ID",
      "listen_channels": ["coordination", "writing", "review"],
      "respond_to_mentions": true,
      "respond_to_channels": ["review", "writing"]
    }
  },
  "skills": [
    "fact-checker",
    "grammar-check",
    "readability-scorer"
  ],
  "llm": {
    "provider": "openai",
    "model": "gpt-4o"
  }
}
```

### 步驟三：啟動多 Agent 環境

在各台機器上分別啟動：

```bash
# Machine A
cd /opt/openclaw-researcher
openclaw start --config settings.json

# Machine B
cd /opt/openclaw-writer
openclaw start --config settings.json

# Machine C
cd /opt/openclaw-reviewer
openclaw start --config settings.json
```

或在同一台機器使用不同 port：

```bash
# 同一台機器，不同 port
openclaw start --config researcher/settings.json --port 18789
openclaw start --config writer/settings.json --port 18790
openclaw start --config reviewer/settings.json --port 18791
```

:::caution 동일 머신 배포 주의
在同一台機器上運行多個 Agent 時，確保每個實例使用不同的：
- HTTP API port（`--port`）
- 데이터目錄（`--data-dir`）
- Discord Bot Token（每個 Agent 必須是不同的 Bot）
:::

### 步驟四：트리거協作流程

在 Discord 的 #coordination 채널中發出指令：

```
人類: @Agent-Researcher 請리서치 NemoClaw 的最新技術架構與應用場景，
      完成後交給 @Agent-Writer 撰寫一篇技術介紹文章。

Agent-Researcher: 收到，開始리서치：NemoClaw 技術架構與應用場景。
                  預計 15 分鐘完成。

[15 分鐘後，在 #research 채널]

Agent-Researcher: 리서치完成！以下是 NemoClaw 的關鍵發現：
                  1. NemoClaw = Nemotron + OpenClaw + OpenShell
                  2. 由 NVIDIA 於 GTC 2026 發表
                  3. Jensen Huang 稱之為「可能是史上最重要的軟體배포」
                  ...
                  @Agent-Writer 리서치結果已배포，請開始撰寫。

Agent-Writer: 收到리서치結果，預計 20 分鐘完成初稿。

[20 分鐘後，在 #writing 채널]

Agent-Writer: 初稿完成！請 @Agent-Reviewer 審閱。
              [文章內容...]

Agent-Reviewer: 審閱完成，以下是수정建議：
               1. 第 3 段缺少來源引用
               2. 建議加入성능比較表格
               3. 結論段落可以更加具體
               @Agent-Writer 請修訂。

Agent-Writer: 修訂完成，已업데이트至 #results。
```

### 步驟五：進階 — Coordinator Agent

생성一個 Coordinator Agent 來自動化任務分配：

```javascript
// skills/task-coordinator/index.js
module.exports = {
  name: "task-coordinator",
  description: "協調多 Agent 任務分配",

  async execute(context) {
    const { params, channel } = context;
    const { task, deadline } = params;

    // 分解任務
    const subtasks = await context.agent.think(
      `將以下任務分解為리서치、撰寫、審稿三個子任務：\n${task}`
    );

    // 分配任務
    await channel.send(
      `📋 **新任務分配**\n\n` +
      `主題: ${task}\n` +
      `截止時間: ${deadline}\n\n` +
      `1️⃣ @Agent-Researcher ${subtasks.research}\n` +
      `2️⃣ @Agent-Writer 等待리서치完成後開始\n` +
      `3️⃣ @Agent-Reviewer 等待初稿完成後審閱\n\n` +
      `請各 Agent 確認收到。`
    );

    return { distributed: true, subtasks };
  }
};
```

## 자주 발생하는 오류

:::danger 에이전트 순환 대화
最危險的問題是兩個 Agent 互相트리거、無限對話，快速消耗 LLM API 額度。

預防措施：
1. 在 `soul.md` 中明確規定「不要답변非指定對象的메시지」
2. 설정 `rate_limit` 限制每分鐘메시지數量
3. 加入 `cooldown_seconds` 冷卻時間
4. 모니터링 API 使用量並설정上限

```json
{
  "safety": {
    "max_messages_per_minute": 5,
    "cooldown_seconds": 10,
    "max_consecutive_self_replies": 2,
    "api_budget_daily_usd": 10.00
  }
}
```
:::

| 問題 | 原因 | 解決方案 |
|------|------|---------|
| Agent 無法看到其他 Agent 메시지 | Bot 缺少채널讀取권한 | 檢查 Discord Bot 的 Permissions |
| Agent 답변自己的메시지 | 未過濾 Bot 메시지 | 설정 `ignore_bot_messages: false` 但加入 ID 白名單 |
| 任務順序混亂 | 缺少明確的워크플로定義 | 在 `soul.md` 中定義清楚的前置條件 |
| 메시지지연超過 30 秒 | LLM API 지연或排隊 | 使用較快的模型或增加 timeout |
| Agent 誤解其他 Agent 的輸出 | 輸出格式不一致 | 定義統一的 output format |

## 문제 해결

### 檢查 Agent 連線狀態

```bash
# 檢查各 Agent 是否在線
curl http://127.0.0.1:18789/api/status  # Researcher
curl http://127.0.0.1:18790/api/status  # Writer
curl http://127.0.0.1:18791/api/status  # Reviewer

# 檢查 Discord 連線
curl http://127.0.0.1:18789/api/channels/discord/status
```

### Agent 커뮤니케이션디버깅

```bash
# 啟用詳細로그
openclaw start --config settings.json --log-level debug

# 모니터링 Agent 間的메시지流
tail -f logs/openclaw.log | grep -E "(send|receive|mention)"
```

### 強制停止失控的 Agent

```bash
# 透過 API 暫停 Agent
curl -X POST http://127.0.0.1:18789/api/pause

# 或直接停止程序
openclaw stop --config settings.json
```

## 연습 문제

### 연습 1：雙 Agent 對話
설정兩個 Agent（Teacher 和 Student），讓 Teacher 出一道數學題，Student 回答，Teacher 批改。限制最多 5 輪對話。

### 연습 2：三人리서치團隊
按照本模組튜토리얼，建構 Researcher / Writer / Reviewer 三人團隊，完成一篇關於「2026 AI Agent 趨勢」的文章。

### 연습 3：容錯機制
수정三人團隊的설정，加入：
- Reviewer 退回超過 2 次時，通知人類介入
- 任何 Agent 超過 10 分鐘沒有回應時自動提醒
- 每日 API 費用上限為 $5 USD

## 퀴즈

1. **OpenClaw 的多 Agent 커뮤니케이션為什麼選擇 Discord/Matrix 而非專用 API？**
   - A) 技術限制
   - B) 讓人類可以觀察和介入 Agent 對話
   - C) Discord 比較快
   - D) 降低 API 費用

   <details><summary>정답 확인</summary>B) 透過 Discord/Matrix 等公開채널커뮤니케이션，人類可以隨時觀察 Agent 之間的對話，並在必要時介入修正，這是 OpenClaw 多 Agent 設計的核心理念。</details>

2. **如何防止兩個 Agent 陷入無限對話迴圈？**
   - A) 不使用多 Agent
   - B) 설정 rate limit、cooldown、最大連續답변數
   - C) 使用不同的 LLM
   - D) 減少 Agent 數量

   <details><summary>정답 확인</summary>B) 透過 `max_messages_per_minute`、`cooldown_seconds` 和 `max_consecutive_self_replies` 等參數限制메시지頻率，可以有效防止迴圈。</details>

3. **在同一台機器上運行多個 Agent 時，必須確保什麼？**
   - A) 使用相同的설정 파일
   - B) 使用不同的 port、데이터目錄和 Bot Token
   - C) 使用相同的 LLM provider
   - D) 共用同一個 Discord Bot

   <details><summary>정답 확인</summary>B) 每個 Agent 實例需要獨立的 HTTP port、데이터目錄和 Discord Bot Token，避免衝突。</details>

4. **Coordinator Agent 的主要功能是什麼？**
   - A) 取代人類管理者
   - B) 分解任務、分配工作、監督進度
   - C) 運行所有 Skill
   - D) 管理 API Key

   <details><summary>정답 확인</summary>B) Coordinator 負責將大任務拆解為子任務，分配給專責 Agent，並追蹤整體進度。</details>

## 다음 단계

- [模組 9: 安全性](./module-09-security) — 多 Agent 環境的安全風險與防護
- [模組 10: 正式環境배포](./module-10-production) — 在 VPS 上穩定運行多 Agent 系統
- [模組 12: 엔터프라이즈級應用](./module-12-enterprise) — 엔터프라이즈環境中的大規模多 Agent 배포
