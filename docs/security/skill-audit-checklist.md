---
title: 技能稽核清單
description: OpenClaw 技能安裝前的完整安全審查清單——從原始碼檢查、權限分析到 VirusTotal 掃描的逐步指南。
sidebar_position: 3
---

# 技能稽核清單

在 ClawHavoc 事件中，2,400+ 個惡意技能透過 ClawHub 被分發到數千個 OpenClaw 實例。這份清單幫助你在安裝任何技能之前，系統性地評估其安全性。

:::danger 不要跳過安全審查
ClawHub 上的技能由社群開發者提交。即使 ClawHub 現在整合了 VirusTotal 掃描，自動化掃描無法偵測所有惡意行為。**人工審查仍然是必要的**。
:::

---

## 快速風險評估

在進行完整審查之前，先用以下問題快速評估風險等級：

| 問題 | 是 → 風險較高 | 否 → 風險較低 |
|------|-------------|-------------|
| 技能需要網路存取？ | 可能外傳資料 | 離線操作較安全 |
| 技能需要檔案系統存取？ | 可能讀取敏感檔案 | 無法存取本機資料 |
| 技能需要 shell 執行權限？ | 可能執行任意指令 | 受限於沙箱 |
| 技能是新發布的（< 30 天）？ | 未經時間考驗 | 社群已使用一段時間 |
| 技能的安裝數 < 100？ | 未經廣泛測試 | 較多人使用過 |
| 技能開發者是新帳號？ | 可能是惡意帳號 | 有歷史紀錄 |
| 技能需要環境變數存取？ | 可能讀取 API key | 無法取得 secrets |

**如果有 3 個以上的「是」，請進行完整的深度審查。**

---

## 第一階段：基本資訊檢查

### 1.1 查看技能元資料

```bash
openclaw skill info <skill-name>
```

需要確認的項目：

| 檢查項目 | 安全的 | 可疑的 |
|---------|--------|--------|
| **開發者** | 已驗證帳號、有其他技能作品 | 新帳號、無其他作品 |
| **版本** | 有多個穩定版本（1.x+） | 只有 0.0.1 或頻繁大版本變更 |
| **安裝數** | 1,000+ | < 50 |
| **最後更新** | 近期有維護 | 超過 6 個月未更新 |
| **授權** | MIT、Apache 2.0 等標準授權 | 無授權或自訂授權 |
| **原始碼** | 公開可見 | 閉源或混淆 |

### 1.2 查看 VirusTotal 掃描結果

```bash
openclaw skill virustotal <skill-name>
```

**解讀結果：**
- **0 偵測**：通過所有引擎掃描（但不代表 100% 安全）
- **1-2 偵測**：可能是誤報，需要進一步調查
- **3+ 偵測**：高度可疑，不建議安裝

:::warning VirusTotal 的限制
VirusTotal 無法偵測所有惡意行為，尤其是：
- 利用合法 API 竊取資料的行為
- 延遲執行的惡意程式碼（安裝後數天才啟動）
- 條件觸發的惡意行為（特定環境下才執行）
:::

### 1.3 查看社群評價

```bash
openclaw skill reviews <skill-name>
```

需要注意的紅旗訊號：
- 評論中提到「安裝後 API 用量暴增」
- 評論中提到「異常的網路活動」
- 只有正面評論（可能是刷評）
- 評論帳號都是新帳號

---

## 第二階段：原始碼審查

### 2.1 下載原始碼（不安裝）

```bash
# 只下載，不安裝
openclaw skill inspect <skill-name> --download-only

# 原始碼會下載到臨時目錄
# ~/.openclaw/tmp/skill-inspect/<skill-name>/
```

### 2.2 檢查檔案結構

```bash
# 列出所有檔案
ls -laR ~/.openclaw/tmp/skill-inspect/<skill-name>/

# 一個正常的技能結構應該像這樣：
# ├── manifest.yaml        # 技能宣告
# ├── index.js / main.py   # 主要邏輯
# ├── README.md            # 文件
# ├── package.json         # 相依套件
# └── tests/               # 測試
```

**可疑的檔案：**
- 二進位檔案（.so、.dll、.exe）
- 混淆的程式碼（base64 編碼的大字串）
- 隱藏檔案（以 `.` 開頭的非標準檔案）
- 安裝後腳本（postinstall scripts）

### 2.3 關鍵程式碼模式搜尋

以下是需要特別關注的程式碼模式：

```bash
# 搜尋網路外傳行為
grep -rn "fetch\|axios\|http\.request\|urllib\|requests\.post" .

# 搜尋環境變數讀取（可能竊取 API key）
grep -rn "process\.env\|os\.environ\|getenv" .

# 搜尋檔案系統操作
grep -rn "readFile\|writeFile\|fs\.\|open(" .

# 搜尋 shell 執行
grep -rn "exec\|spawn\|system\|subprocess\|child_process" .

# 搜尋 base64（可能隱藏惡意 payload）
grep -rn "atob\|btoa\|base64\|Buffer\.from" .

# 搜尋動態程式碼執行
grep -rn "eval\|Function(\|new Function" .

# 搜尋混淆的字串
grep -rn "\\\\x[0-9a-f]\{2\}" .

# 搜尋對外連線（硬編碼的 URL）
grep -rn "https\?://[^\"' ]*" .
```

### 2.4 審查 manifest.yaml

```yaml
# manifest.yaml — 技能宣告檔
name: example-skill
version: 1.0.0
permissions:
  network:
    enabled: true          # ← 為什麼需要網路？
    domains:
      - "api.example.com"  # ← 只存取必要的域名？
      - "*"                # ← ❌ 警告：萬用字元 = 可存取任何網站
  filesystem:
    enabled: true          # ← 為什麼需要檔案存取？
    paths:
      - "/tmp"             # ← 限制在暫存目錄 ✅
      - "~/"               # ← ❌ 警告：存取整個家目錄
  environment:
    enabled: true          # ← 為什麼需要環境變數？
    variables:
      - "HOME"             # ← 合理
      - "*"                # ← ❌ 警告：可讀取所有環境變數
  shell:
    enabled: true          # ← ❌ 極高風險！為什麼需要 shell？
```

**原則：每一個 `enabled: true` 都需要合理的解釋。**

### 2.5 審查相依套件

```bash
# Node.js 技能
cd ~/.openclaw/tmp/skill-inspect/<skill-name>/
cat package.json | grep -A 50 "dependencies"

# 檢查相依套件的安全性
npm audit

# Python 技能
cat requirements.txt
pip audit -r requirements.txt
```

**可疑的相依套件：**
- 名稱拼寫與知名套件相似（typosquatting）
- 版本範圍過寬（`"*"` 或 `">=0.0.0"`）
- 來自非標準 registry 的套件
- 安裝腳本中包含 curl 或 wget

---

## 第三階段：行為分析

### 3.1 在隔離環境中測試

```bash
# 建立隔離的測試環境
openclaw sandbox create test-env

# 在測試環境中安裝技能
openclaw sandbox exec test-env -- openclaw skill install <skill-name>

# 監控技能的行為
openclaw sandbox monitor test-env
```

### 3.2 網路行為監控

```bash
# 監控技能的網路連線
# Linux
sudo tcpdump -i any -w skill-traffic.pcap &
openclaw skill test <skill-name>
# 分析 pcap 檔案

# 或使用 wireshark
# 篩選器：tcp.port == 18789

# 簡易方法：檢查 DNS 查詢
# Linux
sudo tcpdump -i any port 53 | grep -v "127.0.0.1"
```

### 3.3 檔案系統行為監控

```bash
# Linux — 使用 inotifywait
inotifywait -rm ~/.openclaw/ -e create,modify,delete,access &
openclaw skill test <skill-name>

# macOS — 使用 fswatch
fswatch -r ~/.openclaw/ &
openclaw skill test <skill-name>
```

---

## 第四階段：安裝後監控

即使通過了上述所有檢查，安裝後仍需持續監控。

### 4.1 設定技能權限覆蓋

```yaml
# ~/.openclaw/skills/<skill-name>/permissions.override.yaml
# 覆蓋 manifest.yaml 中的權限
permissions:
  network:
    enabled: true
    domains:
      - "api.example.com"  # 只允許必要的域名
  filesystem:
    enabled: false          # 覆蓋為不允許
  environment:
    enabled: false          # 覆蓋為不允許
  shell:
    enabled: false          # 覆蓋為不允許
```

### 4.2 持續監控清單

| 監控項目 | 頻率 | 工具 |
|---------|------|------|
| API 用量 | 每日 | LLM 提供者的控制台 |
| 網路連線 | 每週 | tcpdump / netstat |
| 檔案存取 | 每週 | inotifywait / fswatch |
| 技能版本 | 每次更新前 | `openclaw skill check-updates` |
| CPU / 記憶體 | 每日 | top / htop |

### 4.3 異常指標

以下情況表示技能可能有問題：

| 異常指標 | 可能原因 |
|---------|---------|
| API 用量突然增加 | 技能洩漏 API key 給第三方 |
| 未知的對外連線 | 技能正在外傳資料 |
| CPU 持續高負載 | 挖礦程式 |
| 新增未知檔案 | 技能下載了額外的 payload |
| Gateway 日誌異常 | 技能嘗試存取未授權的資源 |

---

## 技能安全分級表

根據權限需求，將技能分為四個安全等級：

### 第一級：低風險（Green）

```
權限需求：無網路、無檔案系統、無 shell、無環境變數
範例：文字格式化、數學計算、時間轉換
安裝建議：基本檢查即可
```

### 第二級：中風險（Yellow）

```
權限需求：網路存取（限定域名）或唯讀檔案存取
範例：Web 搜尋、天氣查詢、RSS 讀取
安裝建議：檢查原始碼 + 確認域名清單
```

### 第三級：高風險（Orange）

```
權限需求：網路 + 檔案系統，或環境變數存取
範例：Email 管理、Notion 整合、GitHub 操作
安裝建議：完整四階段審查
```

### 第四級：極高風險（Red）

```
權限需求：Shell 執行、萬用字元網路/檔案存取
範例：browser-use、shell-executor、系統管理
安裝建議：完整審查 + 隔離測試 + 持續監控
```

---

## 可列印版檢查清單

以下是一份可列印的快速參考清單：

### 安裝前

- [ ] 查看技能元資料（開發者、版本、安裝數）
- [ ] 查看 VirusTotal 掃描結果
- [ ] 查看社群評價
- [ ] 下載原始碼（不安裝）
- [ ] 檢查檔案結構是否正常
- [ ] 搜尋可疑的程式碼模式
- [ ] 審查 manifest.yaml 權限宣告
- [ ] 審查相依套件
- [ ] 確認每個權限都有合理用途

### 安裝時

- [ ] 設定權限覆蓋（限制不必要的權限）
- [ ] 在隔離環境中先測試

### 安裝後

- [ ] 監控 API 用量變化
- [ ] 監控網路連線
- [ ] 監控 CPU / 記憶體使用
- [ ] 鎖定技能版本
- [ ] 更新前檢查 changelog

---

## 遇到可疑技能？

如果你發現了可疑的技能，請立即回報：

```bash
# 透過 OpenClaw CLI 回報
openclaw skill report <skill-name> --reason "可疑的網路行為"

# 或在 GitHub 上提交 security issue
# https://github.com/openclaw/openclaw/security/advisories/new
```

同時建議在 r/openclaw 上分享你的發現，幫助其他使用者避免安裝惡意技能。

---

## 延伸閱讀

- [安全性最佳實踐](/docs/security/best-practices) — 完整的安全防護指南
- [威脅模型分析](/docs/security/threat-model) — 了解所有攻擊向量
- [Top 50 必裝 Skills](/docs/top-50-skills/overview) — 經過審查的推薦技能
