---
title: "모듈 5: 영구 메모리와 개인화"
sidebar_position: 6
description: "OpenClaw Memory System 심층 이해 — Write-Ahead Logging, Markdown Compaction, Context Window 관리 및 메모리 개인화"
---

# 模組 5: 持久記憶與個人化

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- 說明 OpenClaw Memory System 的三大핵심 컴포넌트
- 理解 Write-Ahead Logging (WAL) 的運作機制與데이터安全保證
- 說明 Markdown Compaction 如何將碎片記憶壓縮為結構化요약
- 설정 Context Window 管理策略
- 配置記憶保留策略，實現 Agent 個人化
- 排除常見的記憶系統問題

:::info 선행 조건
먼저 완료해 주세요: [模組 1: 基礎架構](./module-01-foundations)，理解 Memory System 在四層架構中的位置。
:::

---

## Memory System 架構

OpenClaw 的 Memory System 讓 Agent 能夠跨對話、跨 Session 記住重要資訊。它不是簡單的對話歷史紀錄，而是一套具有**寫入保護**、**自動壓縮**與**智慧檢索**能力的記憶管理系統。

```
              Reasoning Layer
                    │
          ┌─────────┼─────────┐
          │  recall  │  store  │
          ▼         │         ▼
┌─────────────────────────────────────┐
│            Memory System            │
│                                     │
│  ┌───────────┐   ┌───────────────┐  │
│  │           │   │               │  │
│  │    WAL    │──▶│   Markdown    │  │
│  │   Engine  │   │  Compaction   │  │
│  │           │   │               │  │
│  └─────┬─────┘   └───────┬───────┘  │
│        │                 │          │
│        ▼                 ▼          │
│  ┌───────────┐   ┌───────────────┐  │
│  │  wal/     │   │  compacted/   │  │
│  │  (原始)   │   │  (壓縮요약)   │  │
│  └───────────┘   └───────────────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │     Context Window Manager      ││
│  │  動態選擇最相關的記憶注入 LLM    ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 三大핵심 컴포넌트

| 元件 | 職責 | 類比 |
|------|------|------|
| **WAL Engine** | 所有記憶變更先寫入 WAL，確保데이터不遺失 | 데이터庫的 Transaction Log |
| **Markdown Compaction** | 定期將 WAL 中的碎片記憶壓縮為結構化요약 | 데이터庫的 Compaction / Vacuum |
| **Context Window Manager** | 智慧選擇相關記憶，注入 LLM 的 Context Window | 검색引擎的 Ranking |

---

## Write-Ahead Logging (WAL)

WAL 是記憶系統的基礎安全機制。所有記憶操作（新增、수정、삭제）都必須先寫入 WAL 檔案，確保即使系統意外當機，記憶데이터也不會遺失。

### WAL 運作流程

```
記憶操作                WAL                     實際記憶
(store)               (預寫로그)                (compacted)
   │                     │                        │
   │  1. 寫入 WAL        │                        │
   ├────────────────────▶│                        │
   │                     │                        │
   │  2. 確認寫入成功     │                        │
   │◀────────────────────│                        │
   │                     │                        │
   │  3. 回應成功         │  4. 背景壓縮           │
   │                     ├───────────────────────▶│
   │                     │                        │
   │                     │  5. 清理已壓縮的 WAL    │
   │                     │◀───────────────────────│
```

### WAL 檔案格式

WAL 檔案저장在 `~/.openclaw/memory/wal/` 目錄下：

```
~/.openclaw/memory/wal/
├── 2026-03-20T10-15-23.wal
├── 2026-03-20T10-22-45.wal
├── 2026-03-20T11-03-12.wal
└── checkpoint.json
```

每個 WAL 條目的結構：

```json
{
  "id": "mem-a1b2c3d4",
  "timestamp": "2026-03-20T10:15:23Z",
  "operation": "store",
  "channel": "default",
  "type": "conversation",
  "content": "사용자偏好使用한국어回應，技術術語保留英文",
  "importance": 0.85,
  "tags": ["preference", "language"],
  "ttl": null,
  "checksum": "sha256:e3b0c44298fc..."
}
```

### WAL 欄位說明

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | string | 記憶條目的唯一識別碼 |
| `timestamp` | ISO 8601 | 記錄時間 |
| `operation` | string | 操作類型：`store`、`update`、`delete` |
| `channel` | string | 所屬 Channel |
| `type` | string | 記憶類型：`conversation`、`fact`、`preference`、`task` |
| `content` | string | 記憶內容 |
| `importance` | float | 重要性評分（0.0 - 1.0），由 Reasoning Layer 判定 |
| `tags` | array | 標籤，用於檢索 |
| `ttl` | number/null | 存活時間（秒），null 表示永久 |
| `checksum` | string | 內容校驗碼，用於完整性검증 |

### WAL 的安全保證

- **持久性（Durability）**：WAL 寫入後使用 `fsync` 確保落盤
- **原子性（Atomicity）**：每個 WAL 條目要麼完整寫入，要麼不寫入
- **順序性（Ordering）**：WAL 條目嚴格按時間順序排列
- **可恢復性（Recoverability）**：系統重啟時自動從 WAL 恢復未壓縮的記憶

---

## Markdown Compaction

WAL 中的記憶條目是碎片化的 — 每次對話可能產生數十條記憶片段。**Markdown Compaction** 定期將這些碎片壓縮為結構化的 Markdown 문서，減少저장空間並提升檢索效率。

### Compaction 流程

```
WAL 碎片記憶                          壓縮後的 Markdown
┌────────────────┐                 ┌────────────────────────┐
│ mem-001: 사용자 │                 │ # 사용자偏好            │
│ 喜歡深色主題    │                 │                        │
│                │                 │ ## 介面                 │
│ mem-002: 사용자 │   Compaction   │ - 偏好深色主題          │
│ 偏好 VS Code   │ ──────────────▶│ - 編輯器：VS Code       │
│                │                 │                        │
│ mem-003: 사용자 │                 │ ## 語言                 │
│ 精通 TypeScript│                 │ - 精通 TypeScript       │
│                │                 │ - 慣用한국어          │
│ mem-004: 사용자 │                 │                        │
│ 用한국어     │                 │ ## 技術背景             │
│                │                 │ - 前端開發為主          │
│ mem-005: 사용자 │                 │ - 3 年工作經驗          │
│ 做前端 3 年    │                 │                        │
└────────────────┘                 │ 最後업데이트: 2026-03-20   │
                                   └────────────────────────┘
```

### 壓縮後的문서格式

壓縮後的記憶저장在 `~/.openclaw/memory/compacted/` 目錄下：

```
~/.openclaw/memory/compacted/
├── user-profile.md           # 사용자個人데이터與偏好
├── project-context.md        # 專案相關上下文
├── conversation-summaries/   # 對話요약
│   ├── 2026-03-18.md
│   ├── 2026-03-19.md
│   └── 2026-03-20.md
└── facts.md                  # 已知事實庫
```

`user-profile.md` 예시：

```markdown
# 사용자個人데이터

## 基本資訊
- 職業：前端工程師
- 經驗：3 年
- 地點：서울

## 技術偏好
- 主要語言：TypeScript, JavaScript
- 框架：React, Next.js
- 編輯器：VS Code (Vim 模式)
- 終端機：iTerm2 + zsh
- 主題偏好：深色主題

## 溝通偏好
- 語言：한국어，技術術語保留英文
- 回應風格：簡潔，附帶程式碼예시
- 避免：過度冗長的解釋

## 近期專案
- **Project X**: Next.js 14 電商平台（進行中）
- **Side Project**: OpenClaw Skill 開發

---
*由 OpenClaw Memory Compaction 自動產生*
*最後업데이트: 2026-03-20T14:30:00Z*
*來源 WAL 條目: 47 筆*
```

### Compaction 策略

```toml
# ~/.openclaw/config.toml

[memory.compaction]
interval = 3600                  # 壓縮間隔（秒），預設 1 小時
min_wal_entries = 20             # WAL 條目少於此數不트리거壓縮
importance_threshold = 0.3       # 低於此重要性的記憶在壓縮時可能被丟棄
max_compacted_size = "10MB"      # 壓縮後문서的最大大小
summarization_model = "fast"     # 壓縮時使用的 LLM 模型（fast/balanced/thorough）
```

---

## Context Window 管理

Context Window Manager 負責在每次 LLM 呼叫時，從記憶庫中智慧選擇最相關的記憶片段注入 Prompt。

### 選擇策略

Context Window Manager 使用加權評分來選擇最相關的記憶：

```
最終分數 = (相關性 × 0.4) + (重要性 × 0.3) + (新鮮度 × 0.2) + (頻率 × 0.1)
```

| 因素 | 權重 | 說明 |
|------|------|------|
| **相關性（Relevance）** | 0.4 | 記憶內容與當前對話的語意相似度 |
| **重要性（Importance）** | 0.3 | WAL 中記錄的重要性分數 |
| **新鮮度（Recency）** | 0.2 | 越近期的記憶分數越高 |
| **頻率（Frequency）** | 0.1 | 被引用次數越多的記憶分數越高 |

### Context Window 大小管理

```toml
# ~/.openclaw/config.toml

[memory.context]
max_tokens = 4096                # Context Window 中記憶佔用的最大 Token 數
strategy = "adaptive"            # adaptive / fixed / manual
reserved_for_system = 1024       # 保留給系統 Prompt（SOUL.md 等）的 Token
reserved_for_skills = 512        # 保留給 Skill 描述的 Token
reserved_for_response = 2048     # 保留給回應的 Token
```

**策略說明：**

- **`adaptive`（自適應）**：根據對話複雜度動態調整記憶注入量
- **`fixed`（固定）**：始終注入 `max_tokens` 的記憶
- **`manual`（手動）**：由사용자手動控制注入哪些記憶

### 注入流程視覺化

```
사용자메시지: "繼續昨天的 Project X 前端開發"

Context Window Manager 실행：
┌─────────────────────────────────────────────┐
│ 1. 語意검색 "Project X 前端開發"             │
│    → 找到 12 筆相關記憶                      │
│                                             │
│ 2. 加權評分排序                              │
│    → [user-profile: 0.92]                   │
│    → [project-x-context: 0.89]              │
│    → [yesterday-summary: 0.85]              │
│    → [react-preferences: 0.71]              │
│    → ... (8 筆較低分)                        │
│                                             │
│ 3. Token 預算分配（4096 tokens）             │
│    → user-profile: 450 tokens ✓             │
│    → project-x-context: 820 tokens ✓        │
│    → yesterday-summary: 1200 tokens ✓       │
│    → react-preferences: 380 tokens ✓        │
│    → 剩餘: 1246 tokens（未使用）             │
│                                             │
│ 4. 組合注入 Reasoning Layer                  │
└─────────────────────────────────────────────┘
```

---

## 실습: 설정記憶保留與테스트持久性

### 步驟 1：檢視當前記憶狀態

```bash
# 조회記憶統計
openclaw memory stats

# 輸出예시：
# Memory System Statistics
# ────────────────────────
# WAL Entries:          147
# Compacted Files:      5
# Total Memory Size:    2.3 MB
# Oldest Memory:        2026-03-01
# Last Compaction:      2026-03-20T09:00:00Z
# Context Window Usage: 2,847 / 4,096 tokens
```

### 步驟 2：手動管理記憶

```bash
# 列出所有記憶條目
openclaw memory list

# 검색特定記憶
openclaw memory search "TypeScript"

# 조회特定記憶的詳細內容
openclaw memory show mem-a1b2c3d4

# 手動新增記憶
openclaw memory store \
  --type fact \
  --content "公司使用 GitLab 而非 GitHub" \
  --importance 0.8 \
  --tags "company,tools"

# 삭제特定記憶
openclaw memory delete mem-a1b2c3d4

# 手動트리거 Compaction
openclaw memory compact --now
```

### 步驟 3：테스트記憶持久性

```bash
# 1. 開始一個新對話，告訴 Agent 一些個人資訊
openclaw chat
> 我叫小明，是一個後端工程師，主要用 Go 語言開發

# 2. 確認記憶已저장
openclaw memory search "小明"

# 3. 完全停止 OpenClaw
openclaw stop

# 4. 重新啟動
openclaw start

# 5. 開始新對話，테스트 Agent 是否記得你
openclaw chat
> 你還記得我的名字和專長嗎？

# 預期回應：Agent 應該能回想起你是「小明」，是後端工程師，使用 Go 語言
```

### 步驟 4：설정記憶保留策略

```bash
# 설정記憶保留天數
openclaw config set memory.retention_days 180

# 설정自動壓縮間隔（30 分鐘）
openclaw config set memory.compaction.interval 1800

# 설정最低重要性門檻
openclaw config set memory.compaction.importance_threshold 0.2

# 啟用記憶암호화（敏感環境）
openclaw config set memory.encryption true
openclaw config set memory.encryption_key_path "/path/to/key"
```

### 步驟 5：檢視 Compaction 結果

```bash
# 조회壓縮後的記憶문서
openclaw memory compacted list

# 조회特定壓縮문서內容
openclaw memory compacted show user-profile

# 조회壓縮歷史
openclaw memory compaction-history

# 輸出예시：
# Compaction History
# ──────────────────
# 2026-03-20T14:00:00Z  WAL: 32 entries → user-profile.md (updated)
# 2026-03-20T13:00:00Z  WAL: 28 entries → conversation-summaries/2026-03-20.md
# 2026-03-20T12:00:00Z  WAL: 15 entries → project-context.md (updated)
```

---

## 記憶類型與最佳實踐

### 記憶類型

| 類型 | 用途 | 保留策略 | 예시 |
|------|------|----------|------|
| `preference` | 사용자偏好 | 永久 | 語言偏好、介面설정 |
| `fact` | 已知事實 | 永久 | 公司名稱、技術堆疊 |
| `conversation` | 對話요약 | 依설정 | 昨天討論了什麼 |
| `task` | 任務記錄 | 完成後 30 天 | 待辦事項、進度 |
| `ephemeral` | 臨時記憶 | Session 結束 | 當前操作的임시 저장資訊 |

### 最佳實踐

:::tip 記憶管理最佳實踐

1. **定期審視記憶**：每週使用 `openclaw memory list` 檢查記憶內容，삭제過時或不正確的記憶。

2. **善用標籤**：為重要記憶加上有意義的標籤，幫助 Context Window Manager 更精準地檢索。

3. **설정合理的保留期限**：不要永久保留所有記憶。`conversation` 類型建議保留 90 天，`task` 類型保留 30 天。

4. **注意隱私**：敏感資訊（如비밀번호、API Key）不應存入記憶。如果不小心存入，立即使用 `openclaw memory delete` 移除。

5. **모니터링記憶大小**：記憶過多會影響 Compaction 성능。使用 `openclaw memory stats` 定期모니터링。
:::

---

## 자주 발생하는 오류 및 문제 해결

### 問題 1：記憶遺失

```
Agent 似乎忘記了之前告訴它的資訊
```

**排查步驟**：
```bash
# 1. 確認 WAL 是否啟用
openclaw config get memory.wal_enabled
# 應該回傳 true

# 2. 검색特定記憶
openclaw memory search "關鍵字"

# 3. 檢查 Context Window 是否飽和
openclaw memory stats | grep "Context Window"

# 4. 可能原因：記憶存在但未被選入 Context Window
# 解法：提高相關記憶的重要性
openclaw memory update mem-xxx --importance 0.9
```

### 問題 2：Compaction 失敗

```
Error: Memory compaction failed: LLM provider unavailable
```

**解法**：Compaction 需要呼叫 LLM 來產生요약。確認 LLM Provider 連線正常。
```bash
# 테스트 LLM 連線
openclaw test provider

# 使用離線 Compaction（不產生요약，只合併）
openclaw memory compact --offline
```

### 問題 3：記憶佔用過多磁碟空間

```bash
# 조회記憶佔用空間
du -sh ~/.openclaw/memory/

# 清理過期的 WAL 檔案
openclaw memory gc

# 설정更積極的保留策略
openclaw config set memory.retention_days 30
openclaw memory gc --apply-retention
```

### 問題 4：Context Window 溢出

```
Warning: Context window exceeded, truncating oldest memories
```

**解法**：
```bash
# 增加 Context Window 大小（需要 LLM 支援）
openclaw config set memory.context.max_tokens 8192

# 或使用更積極的記憶選擇策略
openclaw config set memory.context.strategy "adaptive"
```

---

## 연습 문제

1. **記憶持久性테스트**：在 OpenClaw 中進行一段包含多個主題的長對話（至少 20 則메시지），然後重啟系統，검증 Agent 在新 Session 中能回想起多少資訊。記錄哪些記憶被保留、哪些被遺忘，分析原因。

2. **Compaction 觀察**：將 `compaction_interval` 設為 300 秒（5 分鐘），連續與 Agent 對話 30 分鐘，然後檢查 `compacted/` 目錄下產生的 Markdown 문서。分析壓縮的品質。

3. **Context Window 最佳化**：嘗試三種不同的 Context Window 策略（`adaptive`、`fixed`、`manual`），在相同的對話場景下比較 Agent 的回應品質。

4. **記憶清理**：使用 `openclaw memory list` 和 `openclaw memory search` 找出所有過時或不正確的記憶，실행清理，然後검증 Agent 不再引用這些已삭제的記憶。

---

## 퀴즈

1. **WAL 的全名是什麼？**
   - A) Web Application Layer
   - B) Write-Ahead Logging
   - C) Wide Area Link
   - D) Write-After Loading

2. **Markdown Compaction 的主要目的是？**
   - A) 壓縮檔案以節省頻寬
   - B) 將碎片化的記憶壓縮為結構化的 Markdown 요약
   - C) 암호화記憶內容
   - D) 將記憶同步到雲端

3. **Context Window Manager 在選擇記憶時，權重最高的因素是？**
   - A) 新鮮度（Recency）
   - B) 頻率（Frequency）
   - C) 相關性（Relevance）
   - D) 重要性（Importance）

4. **以下哪種記憶類型的預設保留策略是「永久」？**
   - A) `conversation`
   - B) `ephemeral`
   - C) `preference`
   - D) `task`

5. **如果 Agent 似乎忘記了之前告訴它的資訊，最可能的原因是？**
   - A) WAL 被損壞
   - B) 記憶存在但未被 Context Window Manager 選入當前 Prompt
   - C) LLM 模型有 Bug
   - D) Gateway 連線中斷

<details>
<summary>정답 확인</summary>

1. **B** — WAL 是 Write-Ahead Logging 的縮寫，是一種先將變更寫入로그、再實際수정데이터的技術。
2. **B** — Markdown Compaction 將散亂的 WAL 記憶片段壓縮為結構化的 Markdown 문서，提升저장效率與檢索品質。
3. **C** — 相關性（Relevance）的權重為 0.4，是四個因素中最高的。
4. **C** — `preference`（사용자偏好）和 `fact`（已知事實）的預設保留策略都是永久。
5. **B** — 最常見的原因是記憶確實存在於系統中，但 Context Window Manager 基於評分策略未將其選入當前 LLM 呼叫的 Prompt 中。

</details>

---

## 다음 단계

你已經深入了解了 OpenClaw 的記憶系統。至此，你已完成 **階段一：核心基礎** 的全部五個模組！你現在具備了理解與操作 OpenClaw 所有핵심 컴포넌트的知識。

接下來，進入 **階段二：進階應用**，學習如何利用 Heartbeat 和 Cron 建構自動化워크플로。

**[返回課程總覽 →](./overview)**
