---
title: "모듈 7: 브라우저 자동화와 웹 크롤링"
sidebar_position: 8
description: "OpenClaw의 Headless Chromium과 Puppeteer 통합을 마스터하여 강력한 웹 크롤링 및 브라우저 자동화 에이전트 구축"
---

# 模組 7: 브라우저自動化與網頁크롤링

## 학습 목표

이 모듈을 완료하면 다음을 할 수 있습니다:

- 理解 OpenClaw 的 Headless Chromium 架構
- 설정並使用 Puppeteer 整合進行브라우저自動化
- 撰寫安全且高效的網頁크롤링 Agent
- 建構一個完整的「價格모니터링 Agent」
- 處理動態渲染頁面（SPA）的데이터擷取
- 了解크롤링的法律與倫理注意事項

## 핵심 개념

### 브라우저自動化架構

OpenClaw 透過內建的 Headless Chromium 引擎與 Puppeteer API，讓 Agent 能夠像人類一樣操作브라우저：

```
Agent
  │
  ├─→ Puppeteer API
  │     ├─→ Headless Chromium Instance
  │     │     ├─→ 頁面導航
  │     │     ├─→ DOM 操作
  │     │     ├─→ 截圖
  │     │     └─→ PDF 生成
  │     └─→ Browser Context（隔離的瀏覽環境）
  │
  └─→ 結果回傳給사용자或下游 Skill
```

### Headless vs Headed 模式

| 模式 | 說明 | 適用情境 |
|------|------|---------|
| **Headless** | 無 GUI，背景실행 | 서버環境、스케줄링크롤링、CI/CD |
| **Headed** | 有 GUI 顯示 | 開發디버깅、需要人工介入的流程 |
| **Headless (New)** | Chrome 113+ 新 Headless 模式 | 需要更完整브라우저行為模擬 |

### 為什麼選擇 Puppeteer？

OpenClaw 選擇 Puppeteer 而非 Playwright 的原因：

- 與 Chromium 的原生整合更緊密
- OpenClaw 核心團隊的歷史技術選型
- Skill 生態系中大多數브라우저 Skill 基於 Puppeteer
- 較低的記憶體佔用（僅需 Chromium，不需多브라우저引擎）

## 실습 튜토리얼

### 步驟一：설치 및 설정

確認 OpenClaw 的브라우저模組已啟用：

```bash
# 檢查 Chromium 是否已설치
openclaw browser check

# 如果未설치，手動설치 Chromium
openclaw browser install

# 確認版本
openclaw browser version
```

在 `settings.json` 中설정브라우저參數：

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
`--no-sandbox` 參數會停用 Chromium 的沙箱保護。在正式環境中，強烈建議使用 Podman 컨테이너來提供外層隔離，而非停用沙箱。詳見 [模組 9: 安全性](./module-09-security)。
:::

### 步驟二：基本브라우저操作

透過 Agent 的自然語言指令操作브라우저：

```
사용자: 幫我打開 https://example.com 並截圖
Agent:  [啟動 Headless Chromium]
        [導航至 example.com]
        [截圖完成，已저장至 /tmp/screenshot-2026-03-20.png]
```

如果要撰寫程式化的 Skill：

```javascript
// skills/browser-tools/screenshot.js
module.exports = {
  name: "webpage-screenshot",
  description: "擷取網頁截圖",

  async execute(context) {
    const { params, browser } = context;
    const page = await browser.newPage();

    try {
      // 설정 User-Agent 避免被偵測為爬蟲
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/121.0.0.0 Safari/537.36'
      );

      await page.goto(params.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 等待特定元素載入（如果指定）
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

### 步驟三：建構價格모니터링 Agent

這是一個完整的實戰專案 — 모니터링電商平台的商品價格，價格低於門檻時自動通知。

**1. 생성 Skill 結構：**

```bash
mkdir -p skills/price-monitor
touch skills/price-monitor/index.js
touch skills/price-monitor/parsers.js
touch skills/price-monitor/storage.js
```

**2. 主要邏輯：**

```javascript
// skills/price-monitor/index.js
const { parsePrice } = require('./parsers');
const { loadProducts, saveHistory, getLastPrice } = require('./storage');

module.exports = {
  name: "price-monitor",
  description: "모니터링商品價格變動並通知",

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

        // 根據不同電商平台使用不同的選擇器
        const priceText = await page.$eval(
          product.price_selector,
          el => el.textContent
        );

        const currentPrice = parsePrice(priceText);
        const lastPrice = getLastPrice(product.id);

        // 저장價格歷史
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

        // 價格低於門檻，發送通知
        if (currentPrice <= product.alert_below) {
          await channel.send(
            `🔔 **價格警報！**\n` +
            `商品: ${product.name}\n` +
            `目前價格: NT$${currentPrice.toLocaleString()}\n` +
            `目標價格: NT$${product.alert_below.toLocaleString()}\n` +
            `連結: ${product.url}`
          );
        }

        // 價格大幅下降（超過 10%）
        if (lastPrice && currentPrice < lastPrice * 0.9) {
          await channel.send(
            `📉 **大幅降價！**\n` +
            `商品: ${product.name}\n` +
            `原價: NT$${lastPrice.toLocaleString()} → ` +
            `現價: NT$${currentPrice.toLocaleString()}\n` +
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

**3. 價格解析器：**

```javascript
// skills/price-monitor/parsers.js
function parsePrice(priceText) {
  // 移除貨幣符號、逗號、空白
  const cleaned = priceText
    .replace(/[NT$＄\s,，]/g, '')
    .trim();

  const price = parseFloat(cleaned);

  if (isNaN(price)) {
    throw new Error(`無法解析價格: "${priceText}"`);
  }

  return price;
}

module.exports = { parsePrice };
```

**4. 搭配 Cron Job 自動실행：**

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

:::tip 結合模組 6 스케줄링
價格모니터링最佳實踐是結合[模組 6: Cron Jobs](./module-06-automation) 中的스케줄링機制，每隔數小時自動檢查一次。避免頻率過高（每分鐘），以免被電商平台封鎖 IP。
:::

### 步驟四：處理動態渲染頁面

許多現代網站使用 SPA（Single Page Application），需要等待 JavaScript 完成渲染：

```javascript
// 等待 AJAX 請求完成
await page.goto(url, { waitUntil: 'networkidle0' });

// 等待特定元素出現
await page.waitForSelector('.dynamic-content', {
  visible: true,
  timeout: 15000
});

// 模擬捲動以트리거懶載入
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

// 等待捲動트리거的內容載入
await page.waitForTimeout(2000);
```

### 步驟五：處理需要登入的網站

```javascript
async function loginAndScrape(browser, credentials, targetUrl) {
  const page = await browser.newPage();

  // 載入先前的 cookies（如果有）
  const cookies = await loadCookies(credentials.site);
  if (cookies) {
    await page.setCookie(...cookies);
  }

  await page.goto(targetUrl);

  // 檢查是否需要登入
  const needsLogin = await page.$('.login-form');
  if (needsLogin) {
    await page.type('#username', credentials.username);
    await page.type('#password', credentials.password);
    await page.click('#login-button');
    await page.waitForNavigation();

    // 저장 cookies 供下次使用
    const newCookies = await page.cookies();
    await saveCookies(credentials.site, newCookies);
  }

  return page;
}
```

:::caution 자격 증명 보안
永遠不要將계정비밀번호寫死在 Skill 程式碼中。使用 OpenClaw 的環境變數或 Secret Manager：
```bash
openclaw config set SHOP_USERNAME "your_username" --secret
openclaw config set SHOP_PASSWORD "your_password" --secret
```
:::

## 자주 발생하는 오류

| 錯誤메시지 | 原因 | 解決方案 |
|----------|------|---------|
| `Navigation timeout exceeded` | 頁面載入超時 | 增加 `timeout`，或使用 `waitUntil: 'domcontentloaded'` |
| `net::ERR_ABORTED` | 頁面重新導向被阻擋 | 檢查是否需要處理 cookie 同意或 CAPTCHA |
| `Protocol error: Target closed` | 頁面在操作中被關閉 | 確認沒有同時在多處操作同一個 page 物件 |
| `Execution context was destroyed` | SPA 路由跳轉造成 context 失效 | 在路由跳轉後重新取得 element reference |
| `Browser is not connected` | Chromium 程序意外終止 | 檢查記憶體用量，增加 `--disable-dev-shm-usage` |

:::danger 메모리 오버플로
Headless Chromium 非常消耗記憶體。每個分頁約佔用 50-150MB RAM。請務必：
1. 用完的 page 立即 `page.close()`
2. 설정 `max_concurrent_pages` 上限
3. 在 Docker/Podman 中설정記憶體限制
4. 定期重啟 Browser instance（建議每 100 次操作後）

```javascript
// 防止記憶體洩漏的最佳實踐
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

## 문제 해결

### Chromium 無法啟動

```bash
# 檢查相依套件（Linux）
ldd $(which chromium) | grep "not found"

# Docker 環境中常見的缺少套件
apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 \
  libasound2

# macOS 上可能需要
xattr -cr /path/to/chromium
```

### 被網站偵測為爬蟲

```javascript
// 使用 puppeteer-extra-plugin-stealth
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// 或手動설정
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => false,
  });
});
```

## 연습 문제

### 연습 1：基礎截圖
생성一個 Skill，接受 URL 清單，為每個頁面擷取完整截圖，並組成 PDF 報告。

### 연습 2：新聞彙整
撰寫一個每日新聞크롤링 Agent，從 3 個科技新聞網站擷取今日頭條，並整理成 Markdown 格式的요약。

### 연습 3：完整價格모니터링
擴展本模組的價格모니터링예시，加入：
- 價格歷史차트生成
- 每週價格趨勢報告
- 支援多個電商平台的通用解析器

## 퀴즈

1. **`waitUntil: 'networkidle2'` 代表什麼意思？**
   - A) 完全沒有網路請求
   - B) 500ms 內不超過 2 個網路請求
   - C) 等待 2 秒
   - D) 最多重試 2 次

   <details><summary>정답 확인</summary>B) `networkidle2` 表示在 500 毫秒內不超過 2 個進行中的網路連線，適用於大多數頁面載入情境。</details>

2. **為什麼 Headless Chromium 需要 `--no-sandbox` 參數？**
   - A) 提升성능
   - B) 在 Docker 컨테이너或非 root 環境中，Linux 的 user namespace sandbox 可能無法使用
   - C) 啟用更多功能
   - D) 減少記憶體使用

   <details><summary>정답 확인</summary>B) 在컨테이너化環境中，Linux 的 sandbox 機制可能與컨테이너的隔離層衝突。但這會降低安全性，建議搭配 Podman 컨테이너使用。</details>

3. **價格모니터링 Agent 的最佳檢查頻率是？**
   - A) 每分鐘
   - B) 每 2-4 小時
   - C) 每天一次
   - D) 即時모니터링

   <details><summary>정답 확인</summary>B) 每 2-4 小時是較佳的平衡點。太頻繁容易被封鎖 IP，太少則可能錯過限時優惠。可根據商品特性調整。</details>

4. **處理 SPA 動態內容時，應該使用哪個方法？**
   - A) `page.content()` 直接取得 HTML
   - B) `page.waitForSelector()` 等待目標元素出現
   - C) 重新整理頁面
   - D) 停用 JavaScript

   <details><summary>정답 확인</summary>B) SPA 的內容是由 JavaScript 動態渲染的，必須等待目標元素實際出現在 DOM 中後才擷取。</details>

## 다음 단계

- [模組 6: Cron Jobs / Heartbeat](./module-06-automation) — 將爬蟲스케줄링為自動化任務
- [模組 8: 多 Agent 架構](./module-08-multi-agent) — 讓多個 Agent 分工크롤링不同網站
- [模組 9: 安全性](./module-09-security) — 了解브라우저自動化的安全最佳實踐
