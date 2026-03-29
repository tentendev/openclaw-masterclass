---
title: Canvas 畫布與 Artifacts
description: OpenClaw 內建的 Canvas 畫布功能與 Artifacts 系統——視覺化創作與程式碼展示
sidebar_position: 5
keywords: [OpenClaw, Canvas, 畫布, Artifacts, 視覺化]
---

# Canvas 畫布與 Artifacts

OpenClaw 內建了一套完整的 Canvas 畫布系統與 Artifacts 呈現引擎，讓使用者能夠在對話過程中進行視覺化創作、程式碼展示，以及文件標註。本章節將深入介紹這些功能的架構、使用方式與設定選項。

## 系統架構概覽

```
┌─────────────────────────────────────────────────┐
│                  OpenClaw UI                     │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │   Chat Interface │  │   Canvas / Artifacts │ │
│  │                  │  │                      │ │
│  │  ┌────────────┐  │  │  ┌────────────────┐  │ │
│  │  │ 訊息串列   │  │  │  │ Paint Canvas   │  │ │
│  │  │            │  │  │  │ (全螢幕畫布)    │  │ │
│  │  └────────────┘  │  │  └────────────────┘  │ │
│  │  ┌────────────┐  │  │  ┌────────────────┐  │ │
│  │  │ 輸入框     │  │  │  │ Writing Blocks │  │ │
│  │  │            │  │  │  │ (格式化容器)    │  │ │
│  │  └────────────┘  │  │  └────────────────┘  │ │
│  │                  │  │  ┌────────────────┐  │ │
│  │                  │  │  │ Code Artifacts │  │ │
│  │                  │  │  │ (程式碼區塊)    │  │ │
│  │                  │  │  └────────────────┘  │ │
│  └──────────────────┘  └──────────────────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │          Citations & PDF Viewer              ││
│  └──────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

## 全螢幕 Paint Canvas

Paint Canvas 提供了一個完整的繪圖環境，內建於 OpenClaw 的對話介面中，無需額外安裝任何外掛。

### 核心工具

| 工具 | 快捷鍵 | 說明 |
|------|--------|------|
| 畫筆 (Pen) | `P` | 自由繪製線條 |
| 橡皮擦 (Eraser) | `E` | 擦除已繪製的內容 |
| 色彩選取器 | `C` | 開啟調色盤 |
| 筆刷大小 | `[` / `]` | 縮小 / 放大筆刷 |
| 復原 (Undo) | `Ctrl+Z` | 復原上一步操作 |
| 重做 (Redo) | `Ctrl+Shift+Z` | 重做已復原的操作 |
| 清除畫布 | `Ctrl+Del` | 清除所有內容 |

### 調色盤與自訂色彩

OpenClaw 內建了一組預設調色盤，同時也支援自訂色彩選取器：

```yaml
# config.yaml — Canvas 色彩設定
canvas:
  palette:
    preset_colors:
      - "#FF0000"  # 紅色
      - "#FF8C00"  # 橙色
      - "#FFD700"  # 金色
      - "#00AA00"  # 綠色
      - "#0066FF"  # 藍色
      - "#8B00FF"  # 紫色
      - "#000000"  # 黑色
      - "#FFFFFF"  # 白色
    custom_picker: true
    recent_colors_count: 8
```

### 筆刷大小調整

筆刷大小支援 1px 到 100px 的範圍，可透過快捷鍵或滑桿調整：

```typescript
// Canvas 筆刷設定介面
interface BrushSettings {
  size: number;        // 1 - 100 (px)
  opacity: number;     // 0.0 - 1.0
  smoothing: boolean;  // 啟用筆跡平滑化
  pressureSensitive: boolean; // 支援壓力感應（觸控板/繪圖板）
}
```

:::tip 小技巧
在使用觸控板或繪圖板時，開啟 `pressureSensitive` 可以根據按壓力度自動調整筆刷粗細，讓繪圖體驗更自然。
:::

### 復原 / 重做機制

Canvas 使用堆疊式的歷史記錄管理復原與重做：

```typescript
class CanvasHistory {
  private undoStack: CanvasState[] = [];
  private redoStack: CanvasState[] = [];
  private maxHistory: number = 50;

  pushState(state: CanvasState): void {
    this.undoStack.push(state);
    this.redoStack = []; // 新操作清除重做歷史
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }

  undo(): CanvasState | null {
    const state = this.undoStack.pop();
    if (state) this.redoStack.push(state);
    return this.undoStack[this.undoStack.length - 1] ?? null;
  }

  redo(): CanvasState | null {
    const state = this.redoStack.pop();
    if (state) this.undoStack.push(state);
    return state;
  }
}
```

---

## 使用情境

Canvas 畫布適用於多種互動場景：

### 1. 草圖繪製 (Sketching)

在對話中快速繪製草圖，與 AI 分享你的視覺構想。例如：繪製一個 UI 佈局草圖，讓 AI 根據草圖產生程式碼。

### 2. 標註說明 (Annotations)

在截圖或圖片上加入標註，指出需要修改或關注的區域。

### 3. 視覺化腦力激盪 (Visual Brainstorming)

繪製心智圖、流程圖或概念圖，與 AI 協作整理想法。

:::note 應用範例
教學場景中，教師可以使用 Canvas 畫布即時繪製說明圖，AI 再將圖中的概念整理成文字摘要。
:::

---

## Writing Blocks（格式化容器）

OpenClaw 支援 OpenAI 風格的 Writing Blocks，將 AI 的文字輸出渲染為具備格式化樣式的獨立容器，並附帶複製按鈕。

```
┌─────────────────────────────────────┐
│ 📄 Writing Block                    │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │  格式化的文字內容               │ │
│ │  支援 Markdown 渲染            │ │
│ │  包含標題、列表、表格等        │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                        [📋 複製]    │
└─────────────────────────────────────┘
```

### 設定 Writing Blocks

```yaml
# config.yaml — Writing Blocks 設定
artifacts:
  writing_blocks:
    enabled: true
    render_markdown: true
    copy_button: true
    theme: "auto"  # auto | light | dark
    max_height: "600px"
    collapsible: true
```

:::tip
Writing Blocks 的複製按鈕會將格式化內容轉換為純 Markdown 文字複製到剪貼簿，方便貼到其他編輯器使用。
:::

---

## Code Artifacts（程式碼區塊）

當 AI 回應中包含多段 HTML 區塊時，OpenClaw 會將它們渲染為獨立的 Code Artifacts，每個區塊可獨立預覽、編輯與複製。

### 多區段 HTML 渲染

```html
<!-- Artifact 1: Header 區段 -->
<header>
  <nav class="navbar">
    <a href="/" class="logo">OpenClaw</a>
    <ul class="nav-links">
      <li><a href="/features">功能</a></li>
      <li><a href="/docs">文件</a></li>
    </ul>
  </nav>
</header>

<!-- Artifact 2: Main Content 區段 -->
<main class="content">
  <h1>歡迎使用 OpenClaw</h1>
  <p>開源 AI 平台，為你的工作流程加速。</p>
</main>

<!-- Artifact 3: Footer 區段 -->
<footer class="footer">
  <p>&copy; 2026 OpenClaw Project</p>
</footer>
```

每段 HTML 都會作為獨立的 Artifact 呈現，擁有各自的預覽視窗與操作按鈕。

### Artifact 渲染流程

```
AI 回應 (Markdown + HTML)
        │
        ▼
  ┌──────────────┐
  │ 解析器 Parser │
  │ 辨識程式碼區塊 │
  └──────┬───────┘
         │
    ┌────┴────┐
    ▼         ▼
 HTML 區塊  其他語言
    │         │
    ▼         ▼
 沙盒渲染   語法高亮
 (iframe)   (highlight.js)
    │         │
    ▼         ▼
 Artifact   Code Block
 (可互動)   (唯讀顯示)
```

:::warning 安全注意事項
HTML Artifacts 在沙盒化的 iframe 中執行，預設禁止存取父頁面的 DOM 與 Cookie。若需允許特定 API，請在設定中明確啟用。
:::

---

## 內建引用與 PDF 支援

OpenClaw 的引用系統可以自動連結到原始文件，當引用來源為 PDF 時，點擊引用標記將直接跳轉到對應頁面。

### 引用標記格式

```markdown
根據研究報告指出，AI 輔助程式開發可提升 40% 的生產力 [1]。

---
引用:
[1] Smith et al., "AI-Assisted Development", 2025, p.23 (report.pdf#page=23)
```

### PDF 檢視器設定

```yaml
# config.yaml — PDF 引用設定
citations:
  enabled: true
  pdf_viewer:
    inline: true           # 內嵌顯示 PDF
    open_at_page: true     # 跳轉到引用頁面
    highlight_text: true   # 高亮引用文字
    sidebar_position: "right"
    default_zoom: 1.0
```

### 引用系統架構

```typescript
interface Citation {
  id: number;
  source: string;         // 文件名稱
  page?: number;          // PDF 頁碼
  text: string;           // 引用文字
  type: "pdf" | "web" | "document";
}

function openCitation(citation: Citation): void {
  if (citation.type === "pdf" && citation.page) {
    pdfViewer.open(citation.source, { page: citation.page });
  } else if (citation.type === "web") {
    window.open(citation.source, "_blank");
  }
}
```

---

## 與對話介面的整合

Canvas 與 Artifacts 並非獨立模組，而是深度整合在 OpenClaw 的對話流程中。

### 整合方式

```yaml
# config.yaml — Canvas 與對話整合設定
chat_integration:
  canvas:
    auto_attach: true       # 畫布內容自動附加到下一則訊息
    image_format: "png"     # 匯出格式：png | svg | webp
    compression: 0.85       # 圖片壓縮品質
  artifacts:
    inline_preview: true    # 在對話中內嵌預覽
    separate_panel: true    # 在側邊面板中展開
    auto_run_html: false    # 是否自動執行 HTML artifacts
```

:::danger 重要提醒
將 `auto_run_html` 設為 `true` 可能帶來安全風險。建議僅在受信任的環境中啟用此選項。
:::

### 資料流示意

```
使用者繪製畫布
       │
       ▼
  Canvas → Base64 PNG
       │
       ▼
  附加至對話訊息
       │
       ▼
  AI 分析圖片內容
       │
       ▼
  回應 (文字 + Artifacts)
       │
       ▼
  渲染 Writing Blocks / Code Artifacts
```

---

## 完整設定範例

以下是一份完整的 Canvas 與 Artifacts 設定檔：

```yaml
# config.yaml — 完整 Canvas & Artifacts 設定
canvas:
  enabled: true
  fullscreen: true
  tools:
    pen: true
    eraser: true
    color_picker: true
    brush_size: true
  palette:
    preset_colors:
      - "#FF0000"
      - "#FF8C00"
      - "#FFD700"
      - "#00AA00"
      - "#0066FF"
      - "#8B00FF"
      - "#000000"
      - "#FFFFFF"
    custom_picker: true
  history:
    max_undo_steps: 50
    auto_save: true
    auto_save_interval: 30  # 秒

artifacts:
  writing_blocks:
    enabled: true
    render_markdown: true
    copy_button: true
    theme: "auto"
    collapsible: true
  code_artifacts:
    enabled: true
    sandbox: true
    allowed_apis: []
    syntax_highlight: true
    line_numbers: true

citations:
  enabled: true
  pdf_viewer:
    inline: true
    open_at_page: true
    highlight_text: true

chat_integration:
  canvas:
    auto_attach: true
    image_format: "png"
  artifacts:
    inline_preview: true
    separate_panel: true
    auto_run_html: false
```

---

## 練習題

### 練習 1：基礎 Canvas 設定

請修改設定檔，將預設調色盤擴充為 12 種顏色，並將歷史記錄上限設為 100 步。

<details>
<summary>參考答案</summary>

```yaml
canvas:
  palette:
    preset_colors:
      - "#FF0000"
      - "#FF4500"
      - "#FF8C00"
      - "#FFD700"
      - "#ADFF2F"
      - "#00AA00"
      - "#00CED1"
      - "#0066FF"
      - "#4169E1"
      - "#8B00FF"
      - "#000000"
      - "#FFFFFF"
  history:
    max_undo_steps: 100
```

</details>

### 練習 2：安全的 Artifact 渲染

請撰寫一段 TypeScript 函式，在渲染 HTML Artifact 之前檢查是否包含 `<script>` 標籤，若包含則顯示警告並要求使用者確認。

<details>
<summary>參考答案</summary>

```typescript
async function safeRenderArtifact(html: string): Promise<boolean> {
  const hasScript = /<script[\s>]/i.test(html);

  if (hasScript) {
    const confirmed = await showConfirmDialog(
      "此 Artifact 包含 JavaScript 程式碼。是否允許執行？"
    );
    if (!confirmed) return false;
  }

  renderInSandbox(html);
  return true;
}
```

</details>

### 練習 3：引用系統擴充

請設計一個引用系統，除了 PDF 之外，還能支援跳轉到特定 Markdown 檔案的指定標題段落。描述你的資料結構與跳轉邏輯。

<details>
<summary>參考答案</summary>

```typescript
interface MarkdownCitation extends Citation {
  type: "markdown";
  heading: string;  // 目標標題文字
  filePath: string; // Markdown 檔案路徑
}

function openMarkdownCitation(citation: MarkdownCitation): void {
  const slug = citation.heading
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  navigateTo(`${citation.filePath}#${slug}`);
}
```

</details>
