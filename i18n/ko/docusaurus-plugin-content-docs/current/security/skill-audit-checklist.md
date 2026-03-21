---
title: "스킬 감사 체크리스트"
sidebar_position: 3
description: "OpenClaw 스킬 설치 전 완전한 보안 심사 체크리스트 — 소스 코드 검사, 권한 분석부터 VirusTotal 스캔까지의 단계별 가이드"
---

# 스킬稽核清單

在 ClawHavoc 事件中，2,400+ 個惡意스킬透過 ClawHub 被分發到數千個 OpenClaw 實例。這份清單幫助你在설치任何스킬之前，系統性地評估其安全性。

:::danger 보안 심사를 건너뛰지 마세요
ClawHub 上的스킬由社群개발자제출。即使 ClawHub 現在整合了 VirusTotal 掃描，自動化掃描無法偵測所有惡意行為。**人工審查仍然是必要的**。
:::

---

## 快速風險評估

在進行完整審查之前，先用以下問題快速評估風險等級：

| 問題 | 是 → 風險較高 | 否 → 風險較低 |
|------|-------------|-------------|
| 스킬需要網路存取？ | 可能外傳데이터 | 離線操作較安全 |
| 스킬需要檔案系統存取？ | 可能讀取敏感檔案 | 無法存取本機데이터 |
| 스킬需要 shell 실행권한？ | 可能실행任意指令 | 受限於沙箱 |
| 스킬是新배포的（< 30 天）？ | 未經時間考驗 | 社群已使用一段時間 |
| 스킬的설치數 < 100？ | 未經廣泛테스트 | 較多人使用過 |
| 스킬개발자是新계정？ | 可能是惡意계정 | 有歷史紀錄 |
| 스킬需要環境變數存取？ | 可能讀取 API key | 無法取得 secrets |

**如果有 3 個以上的「是」，請進行完整的深度審查。**

---

## 第一階段：基本資訊檢查

### 1.1 조회스킬元데이터

```bash
openclaw skill info <skill-name>
```

需要確認的項目：

| 檢查項目 | 安全的 | 可疑的 |
|---------|--------|--------|
| **개발자** | 已검증계정、有其他스킬作品 | 新계정、無其他作品 |
| **版本** | 有多個穩定版本（1.x+） | 只有 0.0.1 或頻繁大版本變更 |
| **설치數** | 1,000+ | < 50 |
| **最後업데이트** | 近期有維護 | 超過 6 個月未업데이트 |
| **授權** | MIT、Apache 2.0 等標準授權 | 無授權或自訂授權 |
| **原始碼** | 公開可見 | 閉源或混淆 |

### 1.2 조회 VirusTotal 掃描結果

```bash
openclaw skill virustotal <skill-name>
```

**解讀結果：**
- **0 偵測**：通過所有引擎掃描（但不代表 100% 安全）
- **1-2 偵測**：可能是誤報，需要進一步調查
- **3+ 偵測**：高度可疑，不建議설치

:::warning VirusTotal 的限制
VirusTotal 無法偵測所有惡意行為，尤其是：
- 利用合法 API 竊取데이터的行為
- 지연실행的惡意程式碼（설치後數天才啟動）
- 條件트리거的惡意行為（特定環境下才실행）
:::

### 1.3 조회社群평가

```bash
openclaw skill reviews <skill-name>
```

需要注意的紅旗訊號：
- 評論中提到「설치後 API 用量暴增」
- 評論中提到「異常的網路活動」
- 只有正面評論（可能是刷評）
- 評論계정都是新계정

---

## 第二階段：原始碼審查

### 2.1 다운로드原始碼（不설치）

```bash
# 只다운로드，不설치
openclaw skill inspect <skill-name> --download-only

# 原始碼會다운로드到臨時目錄
# ~/.openclaw/tmp/skill-inspect/<skill-name>/
```

### 2.2 檢查檔案結構

```bash
# 列出所有檔案
ls -laR ~/.openclaw/tmp/skill-inspect/<skill-name>/

# 一個正常的스킬結構應該像這樣：
# ├── manifest.yaml        # 스킬宣告
# ├── index.js / main.py   # 主要邏輯
# ├── README.md            # 문서
# ├── package.json         # 相依套件
# └── tests/               # 테스트
```

**可疑的檔案：**
- 二進位檔案（.so、.dll、.exe）
- 混淆的程式碼（base64 編碼的大字串）
- 隱藏檔案（以 `.` 開頭的非標準檔案）
- 설치後腳本（postinstall scripts）

### 2.3 關鍵程式碼模式검색

以下是需要特別關注的程式碼模式：

```bash
# 검색網路外傳行為
grep -rn "fetch\|axios\|http\.request\|urllib\|requests\.post" .

# 검색環境變數讀取（可能竊取 API key）
grep -rn "process\.env\|os\.environ\|getenv" .

# 검색檔案系統操作
grep -rn "readFile\|writeFile\|fs\.\|open(" .

# 검색 shell 실행
grep -rn "exec\|spawn\|system\|subprocess\|child_process" .

# 검색 base64（可能隱藏惡意 payload）
grep -rn "atob\|btoa\|base64\|Buffer\.from" .

# 검색動態程式碼실행
grep -rn "eval\|Function(\|new Function" .

# 검색混淆的字串
grep -rn "\\\\x[0-9a-f]\{2\}" .

# 검색對外連線（硬編碼的 URL）
grep -rn "https\?://[^\"' ]*" .
```

### 2.4 審查 manifest.yaml

```yaml
# manifest.yaml — 스킬宣告檔
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
      - "/tmp"             # ← 限制在임시 저장目錄 ✅
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
# Node.js 스킬
cd ~/.openclaw/tmp/skill-inspect/<skill-name>/
cat package.json | grep -A 50 "dependencies"

# 檢查相依套件的安全性
npm audit

# Python 스킬
cat requirements.txt
pip audit -r requirements.txt
```

**可疑的相依套件：**
- 名稱拼寫與知名套件相似（typosquatting）
- 版本範圍過寬（`"*"` 或 `">=0.0.0"`）
- 來自非標準 registry 的套件
- 설치腳本中包含 curl 或 wget

---

## 第三階段：行為分析

### 3.1 在隔離環境中테스트

```bash
# 생성隔離的테스트環境
openclaw sandbox create test-env

# 在테스트環境中설치스킬
openclaw sandbox exec test-env -- openclaw skill install <skill-name>

# 모니터링스킬的行為
openclaw sandbox monitor test-env
```

### 3.2 網路行為모니터링

```bash
# 모니터링스킬的網路連線
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

### 3.3 檔案系統行為모니터링

```bash
# Linux — 使用 inotifywait
inotifywait -rm ~/.openclaw/ -e create,modify,delete,access &
openclaw skill test <skill-name>

# macOS — 使用 fswatch
fswatch -r ~/.openclaw/ &
openclaw skill test <skill-name>
```

---

## 第四階段：설치後모니터링

即使通過了上述所有檢查，설치後仍需持續모니터링。

### 4.1 설정스킬권한覆蓋

```yaml
# ~/.openclaw/skills/<skill-name>/permissions.override.yaml
# 覆蓋 manifest.yaml 中的권한
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

### 4.2 持續모니터링清單

| 모니터링項目 | 頻率 | 工具 |
|---------|------|------|
| API 用量 | 每日 | LLM 提供者的控制台 |
| 網路連線 | 每週 | tcpdump / netstat |
| 檔案存取 | 每週 | inotifywait / fswatch |
| 스킬版本 | 每次업데이트前 | `openclaw skill check-updates` |
| CPU / 記憶體 | 每日 | top / htop |

### 4.3 異常指標

以下情況表示스킬可能有問題：

| 異常指標 | 可能原因 |
|---------|---------|
| API 用量突然增加 | 스킬洩漏 API key 給第三方 |
| 未知的對外連線 | 스킬正在外傳데이터 |
| CPU 持續高부하 | 挖礦程式 |
| 新增未知檔案 | 스킬다운로드了額外的 payload |
| Gateway 로그異常 | 스킬嘗試存取未授權的資源 |

---

## 스킬安全分級表

根據권한需求，將스킬分為四個安全等級：

### 第一級：低風險（Green）

```
권한需求：無網路、無檔案系統、無 shell、無環境變數
예시：文字格式化、數學計算、時間轉換
설치建議：基本檢查即可
```

### 第二級：中風險（Yellow）

```
권한需求：網路存取（限定域名）或唯讀檔案存取
예시：Web 검색、天氣查詢、RSS 讀取
설치建議：檢查原始碼 + 確認域名清單
```

### 第三級：高風險（Orange）

```
권한需求：網路 + 檔案系統，或環境變數存取
예시：Email 管理、Notion 整合、GitHub 操作
설치建議：完整四階段審查
```

### 第四級：極高風險（Red）

```
권한需求：Shell 실행、萬用字元網路/檔案存取
예시：browser-use、shell-executor、系統管理
설치建議：完整審查 + 隔離테스트 + 持續모니터링
```

---

## 可列印版檢查清單

以下是一份可列印的快速參考清單：

### 설치前

- [ ] 조회스킬元데이터（개발자、版本、설치數）
- [ ] 조회 VirusTotal 掃描結果
- [ ] 조회社群평가
- [ ] 다운로드原始碼（不설치）
- [ ] 檢查檔案結構是否正常
- [ ] 검색可疑的程式碼模式
- [ ] 審查 manifest.yaml 권한宣告
- [ ] 審查相依套件
- [ ] 確認每個권한都有合理用途

### 설치時

- [ ] 설정권한覆蓋（限制不必要的권한）
- [ ] 在隔離環境中先테스트

### 설치後

- [ ] 모니터링 API 用量變化
- [ ] 모니터링網路連線
- [ ] 모니터링 CPU / 記憶體使用
- [ ] 鎖定스킬版本
- [ ] 업데이트前檢查 changelog

---

## 遇到可疑스킬？

如果你發現了可疑的스킬，請立即回報：

```bash
# 透過 OpenClaw CLI 回報
openclaw skill report <skill-name> --reason "可疑的網路行為"

# 或在 GitHub 上제출 security issue
# https://github.com/openclaw/openclaw/security/advisories/new
```

同時建議在 r/openclaw 上分享你的發現，幫助其他사용자避免설치惡意스킬。

---

## 추가 참고자료

- [安全性最佳實踐](/docs/security/best-practices) — 完整的安全防護가이드
- [威脅模型分析](/docs/security/threat-model) — 了解所有攻擊向量
- [Top 50 必裝 Skills](/docs/top-50-skills/overview) — 經過審查的推薦스킬
