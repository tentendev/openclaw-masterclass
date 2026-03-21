---
title: "模块 7: 浏览器自动化与网页爬取"
sidebar_position: 8
description: "掌握 OpenClaw 的 Headless Chromium 与 Puppeteer 集成，构建强大的网页爬取与浏览器自动化 Agent"
keywords: [OpenClaw, browser, Puppeteer, Chromium, headless, web scraping, 浏览器自动化, 爬虫]
---

# 模块 7: 浏览器自动化与网页爬取

## 学习目标

完成本模块后，你将能够：

- 理解 OpenClaw 的 Headless Chromium 架构
- 配置并使用 Puppeteer 集成进行浏览器自动化
- 撰写安全且高效的网页爬取 Agent
- 构建一个完整的「价格监控 Agent」
- 处理动态渲染页面（SPA）的数据提取
- 了解爬取的法律与伦理注意事项

## 核心概念

### 浏览器自动化架构

OpenClaw 透过内建的 Headless Chromium 引擎与 Puppeteer API，让 Agent 能够像人类一样操作浏览器：

```
Agent
  │
  ├─→ Puppeteer API
  │     ├─→ Headless Chromium Instance
  │     │     ├─→ 页面导航
  │     │     ├─→ DOM 操作
  │     │     ├─→ 截图
  │     │     └─→ PDF 生成
  │     └─→ Browser Context（隔离的浏览环境）
  │
  └─→ 结果返回给用户或下游 Skill
```

### Headless vs Headed 模式

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| **Headless** | 无 GUI，背景执行 | 服务器环境、调度爬取、CI/CD |
| **Headed** | 有 GUI 显示 | 开发调试、需要人工介入的流程 |
| **Headless (New)** | Chrome 113+ 新 Headless 模式 | 需要更完整浏览器行为模拟 |

### 为什么选择 Puppeteer？

OpenClaw 选择 Puppeteer 而非 Playwright 的原因：

- 与 Chromium 的原生集成更紧密
- OpenClaw 核心团队的历史技术选型
- Skill 生态系统中大多数浏览器 Skill 基于 Puppeteer
- 较低的内存占用（仅需 Chromium，不需多浏览器引擎）

## 实现教程

### 步骤一：安装与配置

确认 OpenClaw 的浏览器模块已启用：

```bash
# 检查 Chromium 是否已安装
openclaw browser check

# 如果未安装，手动安装 Chromium
openclaw browser install

# 确认版本
openclaw browser version
```

在 `settings.json` 中配置浏览器参数：

```json
{
  "browser": {
    "enabled": true,
    "engine": "chromium",
    "headless": true,
    "launch_options": {
      "args": [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ],
      "timeout": 30000
    },
    "default_viewport": {
      "width": 1920,
      "height": 1080
    },
    "max_concurrent_pages": 5,
    "page_timeout_ms": 30000
  }
}
```

:::danger 安全性警告
`--no-sandbox` 参数会禁用 Chromium 的沙盒保护。在正式环境中，强烈建议使用 Podman 容器来提供外层隔离，而非禁用沙盒。详见 [模块 9: 安全性](./module-09-security)。
:::

### 步骤二：基本浏览器操作

透过 Agent 的自然语言命令操作浏览器：

```
用户: 帮我打开 https://example.com 并截图
Agent:  [启动 Headless Chromium]
        [导航至 example.com]
        [截图完成，已存储至 /tmp/screenshot-2026-03-20.png]
```

如果要撰写进程化的 Skill：

```javascript
// skills/browser-tools/screenshot.js
module.exports = {
  name: "webpage-screenshot",
  description: "提取网页截图",

  async execute(context) {
    const { params, browser } = context;
    const page = await browser.newPage();

    try {
      // 配置 User-Agent 避免被检测为爬虫
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/121.0.0.0 Safari/537.36'
      );

      await page.goto(params.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 等待特定元素加载（如果指定）
      if (params.wait_for_selector) {
        await page.waitForSelector(params.wait_for_selector, {
          timeout: 10000
        });
      }

      const screenshotPath = `/tmp/screenshot-${Date.now()}.png`;
      await page.screenshot({
        path: screenshotPath,
        fullPage: params.full_page || false
      });

      return {
        success: true,
        path: screenshotPath,
        title: await page.title()
      };
    } finally {
      await page.close();
    }
  }
};
```

### 步骤三：构建价格监控 Agent

这是一个完整的实战项目 — 监控电商平台的商品价格，价格低于门槛时自动通知。

**1. 创建 Skill 结构：**

```bash
mkdir -p skills/price-monitor
touch skills/price-monitor/index.js
touch skills/price-monitor/parsers.js
touch skills/price-monitor/storage.js
```

**2. 主要逻辑：**

```javascript
// skills/price-monitor/index.js
const { parsePrice } = require('./parsers');
const { loadProducts, saveHistory, getLastPrice } = require('./storage');

module.exports = {
  name: "price-monitor",
  description: "监控商品价格变动并通知",

  async execute(context) {
    const { browser, channel, params } = context;
    const products = params.products || loadProducts();
    const results = [];

    for (const product of products) {
      const page = await browser.newPage();

      try {
        await page.goto(product.url, {
          waitUntil: 'networkidle2',
          timeout: 20000
        });

        // 根据不同电商平台使用不同的选择器
        const priceText = await page.$eval(
          product.price_selector,
          el => el.textContent
        );

        const currentPrice = parsePrice(priceText);
        const lastPrice = getLastPrice(product.id);

        // 存储价格历史
        saveHistory(product.id, {
          price: currentPrice,
          timestamp: new Date().toISOString()
        });

        const result = {
          name: product.name,
          url: product.url,
          currentPrice,
          lastPrice,
          change: lastPrice
            ? ((currentPrice - lastPrice) / lastPrice * 100).toFixed(2)
            : null
        };

        results.push(result);

        // 价格低于门槛，发送通知
        if (currentPrice <= product.alert_below) {
          await channel.send(
            `🔔 **价格警报！**\n` +
            `商品: ${product.name}\n` +
            `目前价格: NT$${currentPrice.toLocaleString()}\n` +
            `目标价格: NT$${product.alert_below.toLocaleString()}\n` +
            `链接: ${product.url}`
          );
        }

        // 价格大幅下降（超过 10%）
        if (lastPrice && currentPrice < lastPrice * 0.9) {
          await channel.send(
            `📉 **大幅降价！**\n` +
            `商品: ${product.name}\n` +
            `原价: NT$${lastPrice.toLocaleString()} → ` +
            `现价: NT$${currentPrice.toLocaleString()}\n` +
            `降幅: ${result.change}%`
          );
        }
      } catch (error) {
        results.push({
          name: product.name,
          error: error.message
        });
      } finally {
        await page.close();
      }
    }

    return { results };
  }
};
```

**3. 价格解析器：**

```javascript
// skills/price-monitor/parsers.js
function parsePrice(priceText) {
  // 移除货币符号、逗号、空白
  const cleaned = priceText
    .replace(/[NT$＄\s,，]/g, '')
    .trim();

  const price = parseFloat(cleaned);

  if (isNaN(price)) {
    throw new Error(`无法解析价格: "${priceText}"`);
  }

  return price;
}

module.exports = { parsePrice };
```

**4. 搭配 Cron Job 自动执行：**

```json
{
  "cron": {
    "jobs": [
      {
        "name": "price-monitor",
        "schedule": "0 */4 * * *",
        "action": "run_skill",
        "skill": "price-monitor",
        "params": {
          "products": [
            {
              "id": "macbook-air-m4",
              "name": "MacBook Air M4 15 吋",
              "url": "https://shop.example.com/macbook-air-m4",
              "price_selector": ".product-price .current",
              "alert_below": 38900
            },
            {
              "id": "airpods-pro-3",
              "name": "AirPods Pro 3",
              "url": "https://shop.example.com/airpods-pro-3",
              "price_selector": ".price-value",
              "alert_below": 6900
            }
          ]
        }
      }
    ]
  }
}
```

:::tip 结合模块 6 调度
价格监控最佳实践是结合[模块 6: Cron Jobs](./module-06-automation) 中的调度机制，每隔数小时自动检查一次。避免频率过高（每分钟），以免被电商平台封锁 IP。
:::

### 步骤四：处理动态渲染页面

许多现代网站使用 SPA（Single Page Application），需要等待 JavaScript 完成渲染：

```javascript
// 等待 AJAX 请求完成
await page.goto(url, { waitUntil: 'networkidle0' });

// 等待特定元素出现
await page.waitForSelector('.dynamic-content', {
  visible: true,
  timeout: 15000
});

// 模拟卷动以触发懒加载
await page.evaluate(async () => {
  await new Promise(resolve => {
    let totalHeight = 0;
    const distance = 300;
    const timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
      if (totalHeight >= document.body.scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
});

// 等待卷动触发的内容加载
await page.waitForTimeout(2000);
```

### 步骤五：处理需要登入的网站

```javascript
async function loginAndScrape(browser, credentials, targetUrl) {
  const page = await browser.newPage();

  // 加载先前的 cookies（如果有）
  const cookies = await loadCookies(credentials.site);
  if (cookies) {
    await page.setCookie(...cookies);
  }

  await page.goto(targetUrl);

  // 检查是否需要登入
  const needsLogin = await page.$('.login-form');
  if (needsLogin) {
    await page.type('#username', credentials.username);
    await page.type('#password', credentials.password);
    await page.click('#login-button');
    await page.waitForNavigation();

    // 存储 cookies 供下次使用
    const newCookies = await page.cookies();
    await saveCookies(credentials.site, newCookies);
  }

  return page;
}
```

:::caution 凭证安全
永远不要将账号密码写死在 Skill 代码中。使用 OpenClaw 的环境变量或 Secret Manager：
```bash
openclaw config set SHOP_USERNAME "your_username" --secret
openclaw config set SHOP_PASSWORD "your_password" --secret
```
:::

## 常见错误

| 错误消息 | 原因 | 解决方案 |
|----------|------|---------|
| `Navigation timeout exceeded` | 页面加载超时 | 增加 `timeout`，或使用 `waitUntil: 'domcontentloaded'` |
| `net::ERR_ABORTED` | 页面重新导向被阻挡 | 检查是否需要处理 cookie 同意或 CAPTCHA |
| `Protocol error: Target closed` | 页面在操作中被关闭 | 确认没有同时在多处操作同一个 page 对象 |
| `Execution context was destroyed` | SPA 路由跳转造成 context 失效 | 在路由跳转后重新获取 element reference |
| `Browser is not connected` | Chromium 进程意外终止 | 检查内存用量，增加 `--disable-dev-shm-usage` |

:::danger 内存溢出
Headless Chromium 非常消耗内存。每个分页约占用 50-150MB RAM。请务必：
1. 用完的 page 立即 `page.close()`
2. 配置 `max_concurrent_pages` 上限
3. 在 Docker/Podman 中配置内存限制
4. 定期重启 Browser instance（建议每 100 次操作后）

```javascript
// 防止内存泄漏的最佳实践
let operationCount = 0;

async function getPage(browser) {
  operationCount++;
  if (operationCount > 100) {
    await browser.close();
    browser = await puppeteer.launch(launchOptions);
    operationCount = 0;
  }
  return await browser.newPage();
}
```
:::

## 故障排除

### Chromium 无法启动

```bash
# 检查依赖包（Linux）
ldd $(which chromium) | grep "not found"

# Docker 环境中常见的缺少包
apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 \
  libasound2

# macOS 上可能需要
xattr -cr /path/to/chromium
```

### 被网站检测为爬虫

```javascript
// 使用 puppeteer-extra-plugin-stealth
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// 或手动配置
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => false,
  });
});
```

## 练习题

### 练习 1：基础截图
创建一个 Skill，接受 URL 清单，为每个页面提取完整截图，并组成 PDF 报告。

### 练习 2：新闻汇总
撰写一个每日新闻爬取 Agent，从 3 个科技新闻网站提取今日头条，并整理成 Markdown 格式的摘要。

### 练习 3：完整价格监控
扩展本模块的价格监控示例，加入：
- 价格历史图表生成
- 每周价格趋势报告
- 支援多个电商平台的通用解析器

## 随堂测验

1. **`waitUntil: 'networkidle2'` 代表什么意思？**
   - A) 完全没有网络请求
   - B) 500ms 内不超过 2 个网络请求
   - C) 等待 2 秒
   - D) 最多重试 2 次

   <details><summary>查看答案</summary>B) `networkidle2` 表示在 500 毫秒内不超过 2 个进行中的网络连接，适用于大多数页面加载场景。</details>

2. **为什么 Headless Chromium 需要 `--no-sandbox` 参数？**
   - A) 提升性能
   - B) 在 Docker 容器或非 root 环境中，Linux 的 user namespace sandbox 可能无法使用
   - C) 启用更多功能
   - D) 减少内存使用

   <details><summary>查看答案</summary>B) 在容器化环境中，Linux 的 sandbox 机制可能与容器的隔离层冲突。但这会降低安全性，建议搭配 Podman 容器使用。</details>

3. **价格监控 Agent 的最佳检查频率是？**
   - A) 每分钟
   - B) 每 2-4 小时
   - C) 每天一次
   - D) 实时监控

   <details><summary>查看答案</summary>B) 每 2-4 小时是较佳的平衡点。太频繁容易被封锁 IP，太少则可能错过限时优惠。可根据商品特性调整。</details>

4. **处理 SPA 动态内容时，应该使用哪个方法？**
   - A) `page.content()` 直接获取 HTML
   - B) `page.waitForSelector()` 等待目标元素出现
   - C) 重新整理页面
   - D) 禁用 JavaScript

   <details><summary>查看答案</summary>B) SPA 的内容是由 JavaScript 动态渲染的，必须等待目标元素实际出现在 DOM 中后才提取。</details>

## 建议下一步

- [模块 6: Cron Jobs / Heartbeat](./module-06-automation) — 将爬虫调度为自动化任务
- [模块 8: 多 Agent 架构](./module-08-multi-agent) — 让多个 Agent 分工爬取不同网站
- [模块 9: 安全性](./module-09-security) — 了解浏览器自动化的安全最佳实践
