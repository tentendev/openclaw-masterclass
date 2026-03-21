---
title: "Module 7: Browser Automation & Web Scraping"
sidebar_position: 8
description: "Master OpenClaw's Headless Chromium and Puppeteer integration to build powerful web scraping and browser automation Agents"
keywords: [OpenClaw, browser, Puppeteer, Chromium, headless, web scraping, browser automation]
---

# Module 7: Browser Automation & Web Scraping

## Learning Objectives

By the end of this module, you will be able to:

- Understand OpenClaw's Headless Chromium architecture
- Configure and use the Puppeteer integration for browser automation
- Write secure and efficient web scraping Agents
- Build a complete "Price Monitoring Agent"
- Handle data extraction from dynamically rendered pages (SPAs)
- Understand the legal and ethical considerations of web scraping

## Core Concepts

### Browser Automation Architecture

OpenClaw uses a built-in Headless Chromium engine with a Puppeteer API, enabling the Agent to operate a browser just like a human:

```
Agent
  │
  ├─→ Puppeteer API
  │     ├─→ Headless Chromium Instance
  │     │     ├─→ Page navigation
  │     │     ├─→ DOM manipulation
  │     │     ├─→ Screenshots
  │     │     └─→ PDF generation
  │     └─→ Browser Context (isolated browsing environment)
  │
  └─→ Results returned to user or downstream Skill
```

### Headless vs Headed Mode

| Mode | Description | Use Cases |
|---|---|---|
| **Headless** | No GUI, runs in the background | Server environments, scheduled scraping, CI/CD |
| **Headed** | GUI displayed | Development debugging, flows requiring human intervention |
| **Headless (New)** | Chrome 113+ new Headless mode | When more complete browser behavior simulation is needed |

### Why Puppeteer?

OpenClaw chose Puppeteer over Playwright for these reasons:

- Tighter native integration with Chromium
- Historical technical choice by the OpenClaw core team
- Most browser Skills in the ecosystem are built on Puppeteer
- Lower memory footprint (only requires Chromium, not multiple browser engines)

## Implementation Guide

### Step 1: Installation & Configuration

Ensure OpenClaw's browser module is enabled:

```bash
# Check if Chromium is installed
openclaw browser check

# If not installed, manually install Chromium
openclaw browser install

# Confirm version
openclaw browser version
```

Configure browser parameters in `settings.json`:

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

:::danger Security Warning
The `--no-sandbox` argument disables Chromium's sandbox protection. In production environments, it is strongly recommended to use a Podman container for outer-layer isolation rather than disabling the sandbox. See [Module 9: Security](./module-09-security).
:::

### Step 2: Basic Browser Operations

Control the browser through the Agent's natural language commands:

```
User:  Open https://example.com and take a screenshot
Agent: [Launching Headless Chromium]
       [Navigating to example.com]
       [Screenshot complete, saved to /tmp/screenshot-2026-03-20.png]
```

For programmatic Skills:

```javascript
// skills/browser-tools/screenshot.js
module.exports = {
  name: "webpage-screenshot",
  description: "Capture a webpage screenshot",

  async execute(context) {
    const { params, browser } = context;
    const page = await browser.newPage();

    try {
      // Set User-Agent to avoid bot detection
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/121.0.0.0 Safari/537.36'
      );

      await page.goto(params.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for a specific element to load (if specified)
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

### Step 3: Build a Price Monitoring Agent

This is a complete real-world project -- monitoring product prices on e-commerce platforms and automatically notifying when a price drops below a threshold.

**1. Create the Skill structure:**

```bash
mkdir -p skills/price-monitor
touch skills/price-monitor/index.js
touch skills/price-monitor/parsers.js
touch skills/price-monitor/storage.js
```

**2. Main logic:**

```javascript
// skills/price-monitor/index.js
const { parsePrice } = require('./parsers');
const { loadProducts, saveHistory, getLastPrice } = require('./storage');

module.exports = {
  name: "price-monitor",
  description: "Monitor product price changes and notify",

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

        // Use different selectors based on the e-commerce platform
        const priceText = await page.$eval(
          product.price_selector,
          el => el.textContent
        );

        const currentPrice = parsePrice(priceText);
        const lastPrice = getLastPrice(product.id);

        // Save price history
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

        // Price below threshold -- send notification
        if (currentPrice <= product.alert_below) {
          await channel.send(
            `**Price Alert!**\n` +
            `Product: ${product.name}\n` +
            `Current price: $${currentPrice.toLocaleString()}\n` +
            `Target price: $${product.alert_below.toLocaleString()}\n` +
            `Link: ${product.url}`
          );
        }

        // Major price drop (more than 10%)
        if (lastPrice && currentPrice < lastPrice * 0.9) {
          await channel.send(
            `**Major Price Drop!**\n` +
            `Product: ${product.name}\n` +
            `Was: $${lastPrice.toLocaleString()} → ` +
            `Now: $${currentPrice.toLocaleString()}\n` +
            `Drop: ${result.change}%`
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

**3. Price parser:**

```javascript
// skills/price-monitor/parsers.js
function parsePrice(priceText) {
  // Remove currency symbols, commas, whitespace
  const cleaned = priceText
    .replace(/[$\s,]/g, '')
    .trim();

  const price = parseFloat(cleaned);

  if (isNaN(price)) {
    throw new Error(`Unable to parse price: "${priceText}"`);
  }

  return price;
}

module.exports = { parsePrice };
```

**4. Combine with Cron Job for automatic execution:**

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
              "name": "MacBook Air M4 15-inch",
              "url": "https://shop.example.com/macbook-air-m4",
              "price_selector": ".product-price .current",
              "alert_below": 1199
            },
            {
              "id": "airpods-pro-3",
              "name": "AirPods Pro 3",
              "url": "https://shop.example.com/airpods-pro-3",
              "price_selector": ".price-value",
              "alert_below": 229
            }
          ]
        }
      }
    ]
  }
}
```

:::tip Combine with Module 6 Scheduling
The best practice for price monitoring is to combine it with the scheduling mechanism from [Module 6: Cron Jobs](./module-06-automation), checking automatically every few hours. Avoid checking too frequently (every minute), as the e-commerce platform may block your IP.
:::

### Step 4: Handling Dynamically Rendered Pages

Many modern websites use SPAs (Single Page Applications) that require waiting for JavaScript to finish rendering:

```javascript
// Wait for AJAX requests to complete
await page.goto(url, { waitUntil: 'networkidle0' });

// Wait for a specific element to appear
await page.waitForSelector('.dynamic-content', {
  visible: true,
  timeout: 15000
});

// Simulate scrolling to trigger lazy loading
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

// Wait for scroll-triggered content to load
await page.waitForTimeout(2000);
```

### Step 5: Handling Sites That Require Login

```javascript
async function loginAndScrape(browser, credentials, targetUrl) {
  const page = await browser.newPage();

  // Load previously saved cookies (if available)
  const cookies = await loadCookies(credentials.site);
  if (cookies) {
    await page.setCookie(...cookies);
  }

  await page.goto(targetUrl);

  // Check if login is needed
  const needsLogin = await page.$('.login-form');
  if (needsLogin) {
    await page.type('#username', credentials.username);
    await page.type('#password', credentials.password);
    await page.click('#login-button');
    await page.waitForNavigation();

    // Save cookies for next time
    const newCookies = await page.cookies();
    await saveCookies(credentials.site, newCookies);
  }

  return page;
}
```

:::caution Credential Security
Never hardcode usernames and passwords in your Skill code. Use OpenClaw's environment variables or Secret Manager:
```bash
openclaw config set SHOP_USERNAME "your_username" --secret
openclaw config set SHOP_PASSWORD "your_password" --secret
```
:::

## Common Errors

| Error Message | Cause | Solution |
|---|---|---|
| `Navigation timeout exceeded` | Page load timed out | Increase `timeout`, or use `waitUntil: 'domcontentloaded'` |
| `net::ERR_ABORTED` | Page redirect was blocked | Check if cookie consent or CAPTCHA handling is needed |
| `Protocol error: Target closed` | Page was closed during an operation | Ensure you're not operating on the same page object from multiple places |
| `Execution context was destroyed` | SPA route change invalidated the context | Re-acquire element references after route changes |
| `Browser is not connected` | Chromium process unexpectedly terminated | Check memory usage, add `--disable-dev-shm-usage` |

:::danger Memory Leaks
Headless Chromium is very memory-intensive. Each tab uses approximately 50-150MB of RAM. Make sure to:
1. Close pages immediately with `page.close()` when done
2. Set a `max_concurrent_pages` limit
3. Set memory limits in Docker/Podman
4. Periodically restart the Browser instance (recommended every 100 operations)

```javascript
// Best practice for preventing memory leaks
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

## Troubleshooting

### Chromium Won't Start

```bash
# Check dependencies (Linux)
ldd $(which chromium) | grep "not found"

# Common missing packages in Docker environments
apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 \
  libasound2

# On macOS you may need
xattr -cr /path/to/chromium
```

### Being Detected as a Bot

```javascript
// Use puppeteer-extra-plugin-stealth
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Or manually configure
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => false,
  });
});
```

## Exercises

### Exercise 1: Basic Screenshot
Build a Skill that accepts a list of URLs, captures a full-page screenshot for each, and compiles them into a PDF report.

### Exercise 2: News Aggregation
Write a daily news scraping Agent that extracts today's headlines from 3 tech news websites and compiles them into a Markdown summary.

### Exercise 3: Full Price Monitor
Extend this module's price monitoring example by adding:
- Price history chart generation
- Weekly price trend reports
- A universal parser supporting multiple e-commerce platforms

## Quiz

1. **What does `waitUntil: 'networkidle2'` mean?**
   - A) Absolutely no network requests
   - B) No more than 2 network requests within 500ms
   - C) Wait for 2 seconds
   - D) Retry up to 2 times

   <details><summary>View Answer</summary>B) `networkidle2` means no more than 2 in-flight network connections within 500 milliseconds, suitable for most page loading scenarios.</details>

2. **Why does Headless Chromium need the `--no-sandbox` argument?**
   - A) Performance improvement
   - B) In Docker containers or non-root environments, Linux's user namespace sandbox may be unavailable
   - C) Enables more features
   - D) Reduces memory usage

   <details><summary>View Answer</summary>B) In containerized environments, Linux's sandbox mechanism may conflict with the container's isolation layer. However, this reduces security -- using a Podman container alongside is recommended.</details>

3. **What is the optimal check frequency for a price monitoring Agent?**
   - A) Every minute
   - B) Every 2-4 hours
   - C) Once daily
   - D) Real-time monitoring

   <details><summary>View Answer</summary>B) Every 2-4 hours strikes the best balance. Too frequent risks IP blocking; too infrequent may miss flash sales. Adjust based on product characteristics.</details>

4. **When dealing with dynamic SPA content, which method should you use?**
   - A) `page.content()` to directly get the HTML
   - B) `page.waitForSelector()` to wait for the target element to appear
   - C) Refresh the page
   - D) Disable JavaScript

   <details><summary>View Answer</summary>B) SPA content is dynamically rendered by JavaScript, so you must wait for the target element to actually appear in the DOM before extracting it.</details>

## Next Steps

- [Module 6: Cron Jobs / Heartbeat](./module-06-automation) -- Schedule your scrapers as automated tasks
- [Module 8: Multi-Agent Architecture](./module-08-multi-agent) -- Have multiple Agents divide and conquer different websites
- [Module 9: Security](./module-09-security) -- Learn security best practices for browser automation
