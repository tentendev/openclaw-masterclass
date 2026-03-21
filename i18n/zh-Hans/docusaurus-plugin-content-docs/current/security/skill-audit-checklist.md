---
title: 技能审计清单
description: OpenClaw 技能安装前的完整安全审查清单——从原始码检查、权限分析到 VirusTotal 扫描的逐步指南。
sidebar_position: 3
---

# 技能审计清单

在 ClawHavoc 事件中，2,400+ 个恶意技能透过 ClawHub 被分发到数千个 OpenClaw 实例。这份清单帮助你在安装任何技能之前，系统性地评估其安全性。

:::danger 不要跳过安全审查
ClawHub 上的技能由社区开发者提交。即使 ClawHub 现在集成了 VirusTotal 扫描，自动化扫描无法检测所有恶意行为。**人工审查仍然是必要的**。
:::

---

## 快速风险评估

在进行完整审查之前，先用以下问题快速评估风险等级：

| 问题 | 是 → 风险较高 | 否 → 风险较低 |
|------|-------------|-------------|
| 技能需要网络存取？ | 可能外传数据 | 离线操作较安全 |
| 技能需要文件系统存取？ | 可能读取敏感文件 | 无法存取本机数据 |
| 技能需要 shell 执行权限？ | 可能执行任意命令 | 受限于沙盒 |
| 技能是新发布的（< 30 天）？ | 未经时间考验 | 社区已使用一段时间 |
| 技能的安装数 < 100？ | 未经广泛测试 | 较多人使用过 |
| 技能开发者是新账号？ | 可能是恶意账号 | 有历史记录 |
| 技能需要环境变量存取？ | 可能读取 API key | 无法获取 secrets |

**如果有 3 个以上的「是」，请进行完整的深度审查。**

---

## 第一阶段：基本信息检查

### 1.1 查看技能元数据

```bash
openclaw skill info <skill-name>
```

需要确认的项目：

| 检查项目 | 安全的 | 可疑的 |
|---------|--------|--------|
| **开发者** | 已验证账号、有其他技能作品 | 新账号、无其他作品 |
| **版本** | 有多个稳定版本（1.x+） | 只有 0.0.1 或频繁大版本变更 |
| **安装数** | 1,000+ | < 50 |
| **最后更新** | 近期有维护 | 超过 6 个月未更新 |
| **授权** | MIT、Apache 2.0 等标准授权 | 无授权或自定义授权 |
| **原始码** | 公开可见 | 闭源或混淆 |

### 1.2 查看 VirusTotal 扫描结果

```bash
openclaw skill virustotal <skill-name>
```

**解读结果：**
- **0 检测**：通过所有引擎扫描（但不代表 100% 安全）
- **1-2 检测**：可能是误报，需要进一步调查
- **3+ 检测**：高度可疑，不建议安装

:::warning VirusTotal 的限制
VirusTotal 无法检测所有恶意行为，尤其是：
- 利用合法 API 窃取数据的行为
- 延迟执行的恶意代码（安装后数天才启动）
- 条件触发的恶意行为（特定环境下才执行）
:::

### 1.3 查看社区评价

```bash
openclaw skill reviews <skill-name>
```

需要注意的红旗讯号：
- 评论中提到「安装后 API 用量暴增」
- 评论中提到「异常的网络活动」
- 只有正面评论（可能是刷评）
- 评论账号都是新账号

---

## 第二阶段：原始码审查

### 2.1 下载原始码（不安装）

```bash
# 只下载，不安装
openclaw skill inspect <skill-name> --download-only

# 原始码会下载到临时目录
# ~/.openclaw/tmp/skill-inspect/<skill-name>/
```

### 2.2 检查文件结构

```bash
# 列出所有文件
ls -laR ~/.openclaw/tmp/skill-inspect/<skill-name>/

# 一个正常的技能结构应该像这样：
# ├── manifest.yaml        # 技能声明
# ├── index.js / main.py   # 主要逻辑
# ├── README.md            # 文件
# ├── package.json         # 依赖包
# └── tests/               # 测试
```

**可疑的文件：**
- 二进位文件（.so、.dll、.exe）
- 混淆的代码（base64 编码的大字符串）
- 隐藏文件（以 `.` 开头的非标准文件）
- 安装后脚本（postinstall scripts）

### 2.3 关键代码模式搜索

以下是需要特别关注的代码模式：

```bash
# 搜索网络外传行为
grep -rn "fetch\|axios\|http\.request\|urllib\|requests\.post" .

# 搜索环境变量读取（可能窃取 API key）
grep -rn "process\.env\|os\.environ\|getenv" .

# 搜索文件系统操作
grep -rn "readFile\|writeFile\|fs\.\|open(" .

# 搜索 shell 执行
grep -rn "exec\|spawn\|system\|subprocess\|child_process" .

# 搜索 base64（可能隐藏恶意 payload）
grep -rn "atob\|btoa\|base64\|Buffer\.from" .

# 搜索动态代码执行
grep -rn "eval\|Function(\|new Function" .

# 搜索混淆的字符串
grep -rn "\\\\x[0-9a-f]\{2\}" .

# 搜索对外连接（硬编码的 URL）
grep -rn "https\?://[^\"' ]*" .
```

### 2.4 审查 manifest.yaml

```yaml
# manifest.yaml — 技能声明档
name: example-skill
version: 1.0.0
permissions:
  network:
    enabled: true          # ← 为什么需要网络？
    domains:
      - "api.example.com"  # ← 只存取必要的域名？
      - "*"                # ← ❌ 警告：万用字元 = 可存取任何网站
  filesystem:
    enabled: true          # ← 为什么需要文件存取？
    paths:
      - "/tmp"             # ← 限制在暂存目录 ✅
      - "~/"               # ← ❌ 警告：存取整个家目录
  environment:
    enabled: true          # ← 为什么需要环境变量？
    variables:
      - "HOME"             # ← 合理
      - "*"                # ← ❌ 警告：可读取所有环境变量
  shell:
    enabled: true          # ← ❌ 极高风险！为什么需要 shell？
```

**原则：每一个 `enabled: true` 都需要合理的解释。**

### 2.5 审查依赖包

```bash
# Node.js 技能
cd ~/.openclaw/tmp/skill-inspect/<skill-name>/
cat package.json | grep -A 50 "dependencies"

# 检查依赖包的安全性
npm audit

# Python 技能
cat requirements.txt
pip audit -r requirements.txt
```

**可疑的依赖包：**
- 名称拼写与知名包相似（typosquatting）
- 版本范围过宽（`"*"` 或 `">=0.0.0"`）
- 来自非标准 registry 的包
- 安装脚本中包含 curl 或 wget

---

## 第三阶段：行为分析

### 3.1 在隔离环境中测试

```bash
# 创建隔离的测试环境
openclaw sandbox create test-env

# 在测试环境中安装技能
openclaw sandbox exec test-env -- openclaw skill install <skill-name>

# 监控技能的行为
openclaw sandbox monitor test-env
```

### 3.2 网络行为监控

```bash
# 监控技能的网络连接
# Linux
sudo tcpdump -i any -w skill-traffic.pcap &
openclaw skill test <skill-name>
# 分析 pcap 文件

# 或使用 wireshark
# 筛选器：tcp.port == 18789

# 简易方法：检查 DNS 查询
# Linux
sudo tcpdump -i any port 53 | grep -v "127.0.0.1"
```

### 3.3 文件系统行为监控

```bash
# Linux — 使用 inotifywait
inotifywait -rm ~/.openclaw/ -e create,modify,delete,access &
openclaw skill test <skill-name>

# macOS — 使用 fswatch
fswatch -r ~/.openclaw/ &
openclaw skill test <skill-name>
```

---

## 第四阶段：安装后监控

即使通过了上述所有检查，安装后仍需持续监控。

### 4.1 配置技能权限覆盖

```yaml
# ~/.openclaw/skills/<skill-name>/permissions.override.yaml
# 覆盖 manifest.yaml 中的权限
permissions:
  network:
    enabled: true
    domains:
      - "api.example.com"  # 只允许必要的域名
  filesystem:
    enabled: false          # 覆盖为不允许
  environment:
    enabled: false          # 覆盖为不允许
  shell:
    enabled: false          # 覆盖为不允许
```

### 4.2 持续监控清单

| 监控项目 | 频率 | 工具 |
|---------|------|------|
| API 用量 | 每日 | LLM 提供者的控制台 |
| 网络连接 | 每周 | tcpdump / netstat |
| 文件存取 | 每周 | inotifywait / fswatch |
| 技能版本 | 每次更新前 | `openclaw skill check-updates` |
| CPU / 内存 | 每日 | top / htop |

### 4.3 异常指标

以下情况表示技能可能有问题：

| 异常指标 | 可能原因 |
|---------|---------|
| API 用量突然增加 | 技能泄漏 API key 给第三方 |
| 未知的对外连接 | 技能正在外传数据 |
| CPU 持续高负载 | 挖矿进程 |
| 新增未知文件 | 技能下载了额外的 payload |
| Gateway 日志异常 | 技能尝试存取未授权的资源 |

---

## 技能安全分级表

根据权限需求，将技能分为四个安全等级：

### 第一级：低风险（Green）

```
权限需求：无网络、无文件系统、无 shell、无环境变量
示例：文字格式化、数学计算、时间转换
安装建议：基本检查即可
```

### 第二级：中风险（Yellow）

```
权限需求：网络存取（限定域名）或唯读文件存取
示例：Web 搜索、天气查询、RSS 读取
安装建议：检查原始码 + 确认域名清单
```

### 第三级：高风险（Orange）

```
权限需求：网络 + 文件系统，或环境变量存取
示例：Email 管理、Notion 集成、GitHub 操作
安装建议：完整四阶段审查
```

### 第四级：极高风险（Red）

```
权限需求：Shell 执行、万用字元网络/文件存取
示例：browser-use、shell-executor、系统管理
安装建议：完整审查 + 隔离测试 + 持续监控
```

---

## 可列印版检查清单

以下是一份可列印的快速参考清单：

### 安装前

- [ ] 查看技能元数据（开发者、版本、安装数）
- [ ] 查看 VirusTotal 扫描结果
- [ ] 查看社区评价
- [ ] 下载原始码（不安装）
- [ ] 检查文件结构是否正常
- [ ] 搜索可疑的代码模式
- [ ] 审查 manifest.yaml 权限声明
- [ ] 审查依赖包
- [ ] 确认每个权限都有合理用途

### 安装时

- [ ] 配置权限覆盖（限制不必要的权限）
- [ ] 在隔离环境中先测试

### 安装后

- [ ] 监控 API 用量变化
- [ ] 监控网络连接
- [ ] 监控 CPU / 内存使用
- [ ] 锁定技能版本
- [ ] 更新前检查 changelog

---

## 遇到可疑技能？

如果你发现了可疑的技能，请立即回报：

```bash
# 透过 OpenClaw CLI 回报
openclaw skill report <skill-name> --reason "可疑的网络行为"

# 或在 GitHub 上提交 security issue
# https://github.com/openclaw/openclaw/security/advisories/new
```

同时建议在 r/openclaw 上分享你的发现，帮助其他用户避免安装恶意技能。

---

## 延伸阅读

- [安全性最佳实践](/docs/security/best-practices) — 完整的安全防护指南
- [威胁模型分析](/docs/security/threat-model) — 了解所有攻击向量
- [Top 50 必装 Skills](/docs/top-50-skills/overview) — 经过审查的推荐技能
