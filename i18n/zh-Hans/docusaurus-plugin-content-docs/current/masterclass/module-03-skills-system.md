---
title: "模块 3: Skills 系统与 SKILL.md 规范"
sidebar_position: 4
description: "掌握 OpenClaw Skills 系统、SKILL.md 规范定义、Skill 生命周期，并从零打造你的第一个 Skill"
keywords: [OpenClaw, Skills, SKILL.md, ClawHub, Skill 开发, 沙盒]
---

# 模块 3: Skills 系统与 SKILL.md 规范

## 学习目标

完成本模块后，你将能够：

- 说明 OpenClaw Skills 系统的架构与执行模型
- 撰写完整的 SKILL.md 定义档
- 理解 Skill 的完整生命周期（安装 → 加载 → 执行 → 卸载）
- 从零开始构建一个可运作的 Skill
- 在沙盒容器中测试与调试 Skill

:::info 前置条件
请先完成 [模块 1: 基础架构](./module-01-foundations) 和 [模块 2: Gateway 深入解析](./module-02-gateway)。
:::

---

## Skills 系统架构

Skills 是 OpenClaw 的「能力」。每个 Skill 封装了一个特定的功能（例如搜索网页、操作文件、查询 API），并在**沙盒化容器**中安全执行。

```
Reasoning Layer
      │
      │ "我需要搜索天气信息"
      ▼
┌─────────────────────────────────┐
│         Skills Manager          │
│  ┌───────────────────────────┐  │
│  │    Skill Registry         │  │
│  │  ┌───────┐ ┌───────┐     │  │
│  │  │weather│ │ file  │ ... │  │
│  │  └───┬───┘ └───────┘     │  │
│  └──────┼────────────────────┘  │
│         │                       │
│  ┌──────▼────────────────────┐  │
│  │    SKILL.md Parser        │  │
│  │  解析能力、参数、权限       │  │
│  └──────┬────────────────────┘  │
│         │                       │
│  ┌──────▼────────────────────┐  │
│  │    Sandbox Executor       │  │
│  │  ┌──────────────────┐    │  │
│  │  │  Podman Container │    │  │
│  │  │  ┌──────────────┐│    │  │
│  │  │  │ Skill Runner ││    │  │
│  │  │  └──────────────┘│    │  │
│  │  └──────────────────┘    │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 执行模型

1. **Reasoning Layer 决策**：LLM 根据用户意图，从已加载的 Skills 中选择合适的 Skill
2. **参数组装**：根据 SKILL.md 定义的 `parameters`，组装执行参数
3. **沙盒启动**：在独立的容器中启动 Skill Runner
4. **执行与返回**：Skill 执行完成后，结果经由 Gateway 流式回客户端
5. **资源清理**：容器在 timeout 后自动销毁

---

## SKILL.md 规范

SKILL.md 是每个 Skill 的定义档，使用 Markdown + YAML Frontmatter 格式。它告诉 OpenClaw 这个 Skill 能做什么、需要什么参数、有什么限制。

### 完整规范

```markdown
---
name: "weather-lookup"
version: "1.2.0"
author: "openclaw-official"
description: "查询全球城市的实时天气信息"
license: "MIT"
runtime: "node:20-slim"
timeout: 15
permissions:
  - network:api.openweathermap.org
  - network:api.weatherapi.com
tags:
  - weather
  - utility
  - api
triggers:
  - "天气"
  - "weather"
  - "气温"
  - "下雨"
---

# Weather Lookup Skill

## 能力描述

此 Skill 能够查询全球任何城市的实时天气信息，
包含温度、湿度、风速、降雨机率等。

## 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | 是 | 城市名称 |
| unit | string | 否 | 温度单位（celsius/fahrenheit），默认 celsius |
| lang | string | 否 | 响应语言，默认 zh-TW |

## 返回格式

返回 JSON 对象，包含以下字段：

```json
{
  "city": "台北",
  "temperature": 28,
  "unit": "celsius",
  "humidity": 75,
  "wind_speed": 12,
  "description": "多云",
  "forecast": [...]
}
```

## 示例

用户：「台北今天天气如何？」
→ 呼叫 weather-lookup，city="台北"

## 限制

- 需要 OpenWeatherMap API Key（配置于环境变量 `WEATHER_API_KEY`）
- Rate Limit：每分钟最多 60 次查询
- 不支援历史天气查询
```

### Frontmatter 字段详解

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | Skill 唯一识别名称（kebab-case） |
| `version` | string | 是 | 语意版号（Semantic Versioning） |
| `author` | string | 是 | 作者名称（对应 ClawHub 账号） |
| `description` | string | 是 | 一行描述（最多 120 字元） |
| `license` | string | 是 | 授权方式（MIT、Apache-2.0 等） |
| `runtime` | string | 是 | 容器基础镜像文件 |
| `timeout` | number | 否 | 最大执行时间（秒），默认 30 |
| `permissions` | array | 否 | 所需权限列表 |
| `tags` | array | 否 | 标签，用于搜索与分类 |
| `triggers` | array | 否 | 触发关键字，帮助 LLM 选择此 Skill |

### 权限模型

OpenClaw 使用最小权限原则。每个 Skill 必须明确声明所需的权限：

```yaml
permissions:
  - network:api.example.com      # 允许存取特定域名
  - network:*.github.com         # 允许存取 GitHub 子域名
  - filesystem:read:/tmp         # 允许读取 /tmp
  - filesystem:write:/tmp/output # 允许写入特定目录
  - env:API_KEY                  # 允许读取环境变量
  - env:DATABASE_URL
```

:::danger 安全重点
Skill 只能存取 `permissions` 中明确列出的资源。任何未授权的存取尝试都会被沙盒拦截并记录到安全日志中。这是 ClawHavoc 事件后强化的安全机制。
:::

---

## Skill 生命周期

```
  安装 (Install)          加载 (Load)
  ┌──────────┐         ┌──────────┐
  │ clawhub  │         │ 解析     │
  │ install  │────────▶│ SKILL.md │
  │ 下载验证  │         │ 注册能力  │
  └──────────┘         └────┬─────┘
                            │
                            ▼
                     ┌──────────┐
                     │ 就绪     │◀─────────┐
                     │ (Ready)  │          │
                     └────┬─────┘          │
                          │ 触发           │ 完成/超时
                          ▼                │
                     ┌──────────┐          │
                     │ 执行     │──────────┘
                     │(Execute) │
                     └──────────┘

  更新 (Update)          卸载 (Uninstall)
  ┌──────────┐         ┌──────────┐
  │ clawhub  │         │ clawhub  │
  │ update   │         │ remove   │
  └──────────┘         └──────────┘
```

### 各阶段详解

**安装（Install）**
```bash
# 从 ClawHub 安装
clawhub install openclaw-official/weather-lookup

# 安装特定版本
clawhub install openclaw-official/weather-lookup@1.2.0

# 安装时触发的动作：
# 1. 从 ClawHub Registry 下载
# 2. 验证签名（SHA-256）
# 3. VirusTotal 扫描（ClawHavoc 后的新机制）
# 4. 解压到 ~/.openclaw/skills/community/
# 5. 拉取容器镜像文件
```

**加载（Load）**
```bash
# OpenClaw 启动时自动加载所有已安装的 Skills
# 也可以手动重新加载
openclaw skills reload

# 加载过程：
# 1. 解析 SKILL.md frontmatter
# 2. 验证权限声明
# 3. 注册到 Skill Registry
# 4. 将 triggers 加入 Reasoning Layer 的 Skill 选择器
```

**执行（Execute）**
```bash
# Skill 被触发时：
# 1. Skills Manager 创建沙盒容器
# 2. 挂载 Skill 代码（唯读）
# 3. 注入授权的环境变量
# 4. 执行 Skill Runner
# 5. 收集 stdout/stderr
# 6. 销毁容器

# 手动测试 Skill
openclaw skill run weather-lookup --params '{"city": "台北"}'
```

---

## 实现：打造你的第一个 Skill

让我们从零开始构建一个 **Pomodoro Timer Skill** — 一个番茄钟计时器。

### 步骤 1：创建 Skill 目录结构

```bash
mkdir -p ~/.openclaw/skills/local/pomodoro-timer
cd ~/.openclaw/skills/local/pomodoro-timer
```

### 步骤 2：撰写 SKILL.md

```bash
cat > SKILL.md << 'SKILLEOF'
---
name: "pomodoro-timer"
version: "0.1.0"
author: "your-username"
description: "番茄钟计时器，支援自定义工作与休息时间"
license: "MIT"
runtime: "node:20-slim"
timeout: 30
permissions: []
tags:
  - productivity
  - timer
  - pomodoro
triggers:
  - "番茄钟"
  - "pomodoro"
  - "计时"
  - "专注"
---

# Pomodoro Timer Skill

## 能力描述

管理番茄钟计时，支援开始、暂停、查看状态。
默认工作时间 25 分钟，休息时间 5 分钟。

## 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| action | string | 是 | 动作：start / pause / status / reset |
| work_minutes | number | 否 | 工作时间（分钟），默认 25 |
| break_minutes | number | 否 | 休息时间（分钟），默认 5 |
| label | string | 否 | 本次任务的标签 |

## 返回格式

```json
{
  "status": "running",
  "remaining_minutes": 18,
  "label": "撰写文件",
  "sessions_completed": 3
}
```

## 示例

用户：「开始一个 30 分钟的番茄钟，主题是写进程」
→ 呼叫 pomodoro-timer，action="start"，work_minutes=30，label="写进程"
SKILLEOF
```

### 步骤 3：撰写 Skill 代码

```bash
cat > index.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 状态档路径（容器内的暂存空间）
const STATE_FILE = '/tmp/pomodoro-state.json';

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {
      status: 'idle',
      sessions_completed: 0,
      start_time: null,
      work_minutes: 25,
      break_minutes: 5,
      label: null
    };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function handleAction(params) {
  const state = loadState();
  const { action, work_minutes, break_minutes, label } = params;

  switch (action) {
    case 'start':
      state.status = 'running';
      state.start_time = Date.now();
      state.work_minutes = work_minutes || 25;
      state.break_minutes = break_minutes || 5;
      state.label = label || null;
      saveState(state);
      return {
        status: 'running',
        remaining_minutes: state.work_minutes,
        label: state.label,
        sessions_completed: state.sessions_completed,
        message: `番茄钟已开始！${state.work_minutes} 分钟后提醒你休息。`
      };

    case 'pause':
      if (state.status !== 'running') {
        return { error: '目前没有进行中的番茄钟。' };
      }
      state.status = 'paused';
      const elapsed = Math.floor((Date.now() - state.start_time) / 60000);
      state.remaining = state.work_minutes - elapsed;
      saveState(state);
      return {
        status: 'paused',
        remaining_minutes: state.remaining,
        label: state.label,
        sessions_completed: state.sessions_completed,
        message: `番茄钟已暂停，剩余 ${state.remaining} 分钟。`
      };

    case 'status':
      if (state.status === 'idle') {
        return {
          status: 'idle',
          sessions_completed: state.sessions_completed,
          message: '目前没有进行中的番茄钟。'
        };
      }
      const mins = state.status === 'running'
        ? state.work_minutes - Math.floor((Date.now() - state.start_time) / 60000)
        : state.remaining;
      return {
        status: state.status,
        remaining_minutes: Math.max(0, mins),
        label: state.label,
        sessions_completed: state.sessions_completed
      };

    case 'reset':
      const completed = state.status === 'running' ? state.sessions_completed + 1 : state.sessions_completed;
      saveState({
        status: 'idle',
        sessions_completed: completed,
        start_time: null,
        work_minutes: 25,
        break_minutes: 5,
        label: null
      });
      return {
        status: 'idle',
        sessions_completed: completed,
        message: `番茄钟已重置。今日完成 ${completed} 个番茄钟。`
      };

    default:
      return { error: `未知的动作：${action}。支援的动作：start, pause, status, reset` };
  }
}

// 从 stdin 读取参数（OpenClaw Skill Runner 协议）
let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const params = JSON.parse(input);
    const result = handleAction(params);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    process.stdout.write(JSON.stringify({ error: err.message }));
  }
});
EOF
```

### 步骤 4：测试 Skill

```bash
# 使用 OpenClaw 内建的 Skill 测试工具
openclaw skill test ./

# 测试特定动作
echo '{"action":"start","work_minutes":25,"label":"写进程"}' | \
  openclaw skill run pomodoro-timer --local

# 查看状态
echo '{"action":"status"}' | \
  openclaw skill run pomodoro-timer --local

# 验证 SKILL.md 语法
openclaw skill validate ./SKILL.md
```

预期输出：

```json
{
  "status": "running",
  "remaining_minutes": 25,
  "label": "写进程",
  "sessions_completed": 0,
  "message": "番茄钟已开始！25 分钟后提醒你休息。"
}
```

### 步骤 5：在沙盒中验证

```bash
# 在完整的沙盒容器中测试（模拟真实执行环境）
openclaw skill sandbox-test pomodoro-timer --params '{"action":"start","label":"测试"}'

# 检查权限是否正确（这个 Skill 不需要任何权限）
openclaw skill check-permissions pomodoro-timer
```

---

## Skill 开发最佳实践

### 1. 输入验证

```javascript
// 永远验证输入参数
function validateParams(params) {
  if (!params.action) {
    throw new Error('缺少必填参数：action');
  }
  const validActions = ['start', 'pause', 'status', 'reset'];
  if (!validActions.includes(params.action)) {
    throw new Error(`无效的 action：${params.action}`);
  }
  if (params.work_minutes && (params.work_minutes < 1 || params.work_minutes > 120)) {
    throw new Error('work_minutes 必须在 1-120 之间');
  }
}
```

### 2. 最小权限

```yaml
# 只请求真正需要的权限
permissions:
  - network:api.specific-service.com  # 具体的域名，非万用字元
  - filesystem:read:/tmp/myskill      # 具体的路径，非根目录
```

### 3. 优雅的错误处理

```javascript
// 返回结构化的错误消息
function handleError(error) {
  return {
    error: true,
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message,
    suggestion: '请检查参数后重试，或联系 Skill 作者。'
  };
}
```

### 4. 性能考量

```javascript
// 配置合理的 timeout
// 长时间操作使用流式回报进度
function longRunningTask(params) {
  // 每 5 秒回报进度
  const interval = setInterval(() => {
    process.stderr.write(JSON.stringify({
      progress: currentProgress,
      message: `处理中... ${currentProgress}%`
    }) + '\n');
  }, 5000);
}
```

---

## 常见错误与故障排除

### 错误 1：SKILL.md 解析失败

```
Error: Invalid SKILL.md: missing required field 'runtime'
```

**解法**：确认 frontmatter 包含所有必填字段（`name`、`version`、`author`、`description`、`license`、`runtime`）。

### 错误 2：沙盒权限被拒

```
Error: Permission denied: network access to api.example.com not declared
```

**解法**：在 SKILL.md 的 `permissions` 中加入 `network:api.example.com`。

### 错误 3：容器镜像文件拉取失败

```
Error: Failed to pull image node:20-slim
```

**解法**：
```bash
# 手动拉取镜像文件
podman pull node:20-slim

# 或使用 OpenClaw 缓存
openclaw skill pull-runtime node:20-slim
```

### 错误 4：Skill 执行超时

```
Error: Skill execution timed out after 30 seconds
```

**解法**：在 SKILL.md 中增加 `timeout` 值，或优化 Skill 代码。注意系统最大 timeout 为 300 秒。

---

## 练习题

1. **扩展 Pomodoro Skill**：为 Pomodoro Timer 加入「统计」功能（`action: "stats"`），回报今日、本周的完成数量与总专注时间。

2. **构建 URL 缩短 Skill**：创建一个 Skill，接收长 URL 并返回缩短后的链接。使用 TinyURL 或类似的 API。别忘了声明 `network` 权限。

3. **多语言 Skill**：修改你的 Skill，支援 `lang` 参数，让返回消息能根据用户语言偏好自动切换（zh-TW、en、ja）。

4. **权限审计**：检查你已安装的所有 Skills 的权限声明，找出权限范围最广的 Skill，思考是否有缩减权限的空间。

---

## 随堂测验

1. **SKILL.md 使用什么格式？**
   - A) 纯 JSON
   - B) YAML
   - C) Markdown + YAML Frontmatter
   - D) TOML

2. **OpenClaw Skills 在什么环境中执行？**
   - A) 主机系统的 Shell
   - B) 沙盒化容器（Podman/Docker）
   - C) 虚拟机器
   - D) WebAssembly

3. **以下哪个不是 SKILL.md 的必填字段？**
   - A) `name`
   - B) `runtime`
   - C) `triggers`
   - D) `version`

4. **Skill 的默认最大执行时间是？**
   - A) 10 秒
   - B) 30 秒
   - C) 60 秒
   - D) 120 秒

5. **ClawHavoc 事件后，Skill 安装时增加了什么安全措施？**
   - A) 两步验证
   - B) VirusTotal 扫描
   - C) 人工审核
   - D) 区块链验证

<details>
<summary>查看答案</summary>

1. **C** — SKILL.md 使用 Markdown 格式搭配 YAML Frontmatter，让人类可读的同时也能被进程解析。
2. **B** — 每个 Skill 在独立的沙盒化容器中执行（建议使用 Podman），确保系统安全。
3. **C** — `triggers` 是选填字段。必填字段包括 `name`、`version`、`author`、`description`、`license`、`runtime`。
4. **B** — 默认 timeout 为 30 秒，可在 SKILL.md 中自定义，系统上限为 300 秒。
5. **B** — ClawHavoc 事件揭露了 2,400 个恶意 Skills，此后 OpenClaw 在安装 Skill 时加入 VirusTotal 扫描机制。

</details>

---

## 建议下一步

你已经学会了如何开发 OpenClaw Skills。下一步，让我们了解如何透过 ClawHub 市场与社区分享你的 Skills。

**[前往模块 4: ClawHub 市场 →](./module-04-clawhub)**
