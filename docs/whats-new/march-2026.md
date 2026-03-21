---
title: 2026 年 3 月最新消息
description: OpenClaw 2026 年 3 月重大更新總整理——官方變更、生態系統動態、安全公告、社群回報的變化。
sidebar_position: 1
---

# 2026 年 3 月最新消息

本篇整理了截至 2026 年 3 月 20 日，OpenClaw 生態系統中的重大更新與變化。

:::info 資訊來源
本文整合了官方公告、GitHub releases、Reddit 社群討論、以及安全研究報告等多方來源。標示為「社群回報」的內容尚未獲得官方正式確認。
:::

---

## 執行摘要

2026 年第一季對 OpenClaw 來說是安全意識覺醒的季度。CVE-2026-25253 的揭露、Bitdefender 的安全審計報告、以及 ClawHavoc 事件的餘波，促使社群和核心團隊將安全性提升為最高優先事項。同時，Nvidia 和 Tencent 等科技巨頭開始投入 OpenClaw 生態系統，為平台帶來了新的發展動力。

### 本月關鍵數字

| 指標 | 數值 |
|------|------|
| GitHub Stars | 250,000+ |
| ClawHub 技能數 | 13,000+ |
| 已知暴露實例（Bitdefender） | 135,000 |
| 已確認被駭實例 | 30,000+ |
| ClawHavoc 惡意技能（已移除） | 2,400+ |

---

## 官方變更

### 1. CVE-2026-25253 修補

**影響程度：Critical（CVSS 9.8）**

Gateway 遠端程式碼執行漏洞已在最新版本中修補。此漏洞影響 v3.x 之前的所有版本，允許攻擊者透過暴露的 18789 埠執行任意程式碼。

```bash
# 檢查你的版本
openclaw --version

# 升級到最新版本
npm install -g @openclaw/cli@latest

# 驗證修補狀態
openclaw doctor --security
```

:::danger 立即行動
如果你的 OpenClaw 版本低於最新修補版本，請**立即升級**。此漏洞正被積極利用中。
:::

### 2. ClawHub VirusTotal 整合

ClawHavoc 事件後，ClawHub 平台新增了 VirusTotal 掃描整合。所有新上傳的技能都會自動經過 VirusTotal 掃描，並在技能頁面顯示掃描結果。

**新增 CLI 指令：**
```bash
# 查看技能的 VirusTotal 掃描結果
openclaw skill virustotal <skill-name>

# 回報可疑技能
openclaw skill report <skill-name> --reason "描述可疑行為"
```

### 3. Gateway 預設安全強化

新版本的 OpenClaw 在 `openclaw init` 時，預設設定已改為更安全的配置：

| 設定項 | 舊預設 | 新預設 |
|--------|--------|--------|
| `gateway.bind` | `0.0.0.0` | **`127.0.0.1`** |
| `gateway.auth.enabled` | `false` | **`true`** |
| `gateway.auth.token` | 無 | **自動生成** |
| `execution.engine` | `docker` | **`podman`**（如已安裝） |

### 4. 技能簽名驗證機制（Beta）

核心團隊推出了技能簽名驗證的 Beta 版本。經過驗證的技能開發者可以對其技能進行數位簽名，使用者安裝時會自動驗證簽名。

```bash
# 只安裝已簽名的技能
openclaw skill install --signed-only <skill-name>

# 查看技能簽名狀態
openclaw skill info <skill-name> | grep signature
```

### 5. 記憶系統 v2 預覽

記憶系統的重大重構正在進行中。v2 版本預計將引入：
- 向量化記憶搜尋（取代純文字匹配）
- 記憶分層（公開 / 私密 / 敏感）
- 自動脫敏功能
- 跨 Agent 共享記憶（opt-in）

目前可透過 flag 啟用預覽：
```bash
openclaw start --experimental-memory-v2
```

---

## 生態系統動態

### 6. Nvidia 推出 OpenClaw 加速方案

Nvidia 宣布為 OpenClaw 提供 GPU 加速支援，主要用於：
- 本地 LLM 推理加速（搭配 Ollama + CUDA）
- browser-use 技能的 GPU 渲染
- 語音識別（Whisper）加速
- 未來的向量記憶搜尋

```bash
# 啟用 Nvidia GPU 支援
openclaw config set execution.gpu.enabled true
openclaw config set execution.gpu.runtime nvidia
```

### 7. Tencent 開源 OpenClaw 中文生態套件

Tencent 開源了一系列針對中文使用者的 OpenClaw 工具：
- **WeChat 官方 Adapter** — 不再需要社群維護的 WeChatFerry
- **中文語音識別模型** — 比 Whisper 更準確的中文 STT
- **中文 SOUL.md 模板** — 針對中文語境最佳化的人格設定
- **飛書（Lark）Adapter** — 企業級通訊平台支援

### 8. Composio MCP 大規模更新

Composio 平台新增了 50+ 個 MCP connector，包括：
- Reddit OAuth（讀寫）
- Notion Database API
- Linear（專案管理）
- Figma（設計檔案讀取）
- Airtable（資料庫）

---

## 安全公告

### 9. Bitdefender 審計報告

Bitdefender 於 2026 年初發布了 OpenClaw 安全審計報告，主要發現：

| 發現 | 嚴重性 | 狀態 |
|------|--------|------|
| 135,000 個公開可存取的實例 | Critical | 持續監控 |
| Gateway API 未認證比例 > 60% | Critical | 新版已改善 |
| Docker root daemon 使用比例 > 70% | High | 持續推廣 Podman |
| 未更新版本（含已知漏洞）> 40% | High | 推播更新通知 |
| 技能安裝前審查比例 < 10% | Medium | 新增 VirusTotal |

### 10. ClawHavoc 事件後續

ClawHavoc 事件的後續處理進度：

- **惡意技能清除**：2,400+ 個惡意技能已全數從 ClawHub 移除
- **受影響使用者通知**：已通知所有安裝過惡意技能的使用者
- **API Key 外洩**：估計數千個 API key 被竊取，建議所有使用者輪換
- **改進措施**：VirusTotal 掃描、技能簽名、加強審查流程

:::warning 如果你在 2025 年 10 月至 2026 年 1 月間安裝過不熟悉的技能
請立即：
1. 執行 `openclaw skill list` 檢查已安裝技能
2. 移除任何可疑技能
3. 輪換所有 API key
4. 檢查 LLM 提供者帳單是否有異常
:::

### 11. 18789 埠掃描持續增加

安全研究者報告，針對 18789 埠的網路掃描活動在 CVE-2026-25253 揭露後大幅增加。Shodan 上的掃描結果顯示：

- 2025 年 12 月：80,000 個暴露實例
- 2026 年 1 月：120,000 個暴露實例
- 2026 年 2 月：135,000 個暴露實例
- 趨勢：持續增加中

---

## 破壞性變更（Breaking Changes）

### 12. gateway.yaml 格式變更

v3.2.0 起，`gateway.yaml` 的格式有以下變更：

```yaml
# 舊格式（v3.1.x 及之前）
gateway:
  host: "0.0.0.0"
  port: 18789

# 新格式（v3.2.0+）
gateway:
  bind: "127.0.0.1"    # "host" 改為 "bind"
  port: 18789
  auth:                  # 新增認證區塊
    enabled: true
    token: "..."
```

```bash
# 自動遷移
openclaw migrate
```

### 13. Skill manifest 格式 v2

技能的 `manifest.yaml` 格式更新，新增了權限宣告區塊：

```yaml
# 新格式要求
name: my-skill
version: 2.0.0
manifest_version: 2       # 新增：必須為 2
permissions:               # 新增：必須明確宣告權限
  network:
    enabled: true
    domains: ["api.example.com"]
  filesystem:
    enabled: false
  shell:
    enabled: false
  environment:
    enabled: false
```

使用舊格式的技能會收到警告，並在未來版本中停止支援。

---

## 社群回報的變化

以下是由社群成員回報，尚未經過官方正式確認的變化。

### 14. 多 Agent 協作改進

社群回報在最新版本中，多 Agent 協作（透過 Discord 或 Matrix 通訊）的穩定性有顯著改善：
- Agent 之間的訊息延遲降低 40%
- 記憶共享機制更可靠
- 任務分配衝突的處理更智慧

### 15. 本地 LLM 效能提升

使用 Ollama 搭配本地模型的使用者回報，v3.2.0 中的 LLM Router 最佳化帶來了明顯的效能提升：
- 首次回應時間降低 25%
- 上下文窗口管理更高效
- 對 Llama 3.3 和 Qwen 2.5 系列模型的支援更好

---

## 時間線

| 日期 | 事件 |
|------|------|
| 2025 年 10 月 | ClawHavoc 事件開始（惡意技能植入 ClawHub） |
| 2025 年 12 月 | ClawHavoc 被發現並開始清除 |
| 2026 年 1 月初 | CVE-2026-25253 被揭露 |
| 2026 年 1 月中 | CVE-2026-25253 修補版本發布 |
| 2026 年 1 月底 | ClawHub VirusTotal 整合上線 |
| 2026 年 2 月初 | Bitdefender 安全審計報告發布 |
| 2026 年 2 月中 | Gateway 預設安全強化 |
| 2026 年 2 月底 | Nvidia GPU 加速方案發布 |
| 2026 年 3 月初 | Tencent 中文生態套件開源 |
| 2026 年 3 月中 | 技能簽名驗證 Beta 發布 |
| 2026 年 3 月中 | 記憶系統 v2 預覽開放 |

---

## 建議行動

根據本月的更新，我們建議所有 OpenClaw 使用者：

### 立即行動（今天）

1. **升級到最新版本** — 修補 CVE-2026-25253
2. **確認 Gateway 綁定到 `127.0.0.1`** — 不是 `0.0.0.0`
3. **啟用 Gateway 認證** — 設定 auth token
4. **輪換所有 API key** — 尤其是 ClawHavoc 期間使用過的

### 本週完成

5. **審查已安裝的技能** — 移除不需要或可疑的技能
6. **切換到 Podman rootless** — 如果仍在使用 Docker
7. **設定防火牆規則** — 封鎖 18789 的外部存取

### 本月完成

8. **閱讀安全性最佳實踐** — [完整指南](/docs/security/best-practices)
9. **建立技能審查流程** — [技能稽核清單](/docs/security/skill-audit-checklist)
10. **嘗試新功能** — 記憶系統 v2 預覽、技能簽名驗證

---

## 延伸閱讀

- [安全性最佳實踐](/docs/security/best-practices) — 完整安全指南
- [威脅模型分析](/docs/security/threat-model) — 了解所有攻擊向量
- [架構概覽](/docs/architecture/overview) — 了解最新的架構變更
- [FAQ](/docs/faq) — 常見問題解答
