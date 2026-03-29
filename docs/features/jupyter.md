---
title: Jupyter Notebook 整合
description: 在 OpenClaw 中使用 Jupyter Notebook 進行互動式資料分析與程式碼執行
sidebar_position: 6
keywords: [OpenClaw, Jupyter, Notebook, 資料分析, 程式碼執行]
---

# Jupyter Notebook 整合

OpenClaw 深度整合了 Jupyter Notebook 環境，讓使用者能夠直接在平台內執行程式碼、探索資料、渲染視覺化圖表，並透過 Open Terminal 檔案導覽器管理 Notebook 檔案與 SQLite 資料庫。

## 系統架構

```
┌──────────────────────────────────────────────────────┐
│                    OpenClaw UI                        │
│                                                      │
│  ┌─────────────────┐    ┌─────────────────────────┐  │
│  │  Chat Interface │    │  Jupyter Notebook Panel  │  │
│  │                 │    │                          │  │
│  │  對話指令觸發   │───▶│  ┌──────────────────┐   │  │
│  │  Notebook 操作  │    │  │ Code Cell 編輯器 │   │  │
│  │                 │    │  └──────────────────┘   │  │
│  └─────────────────┘    │  ┌──────────────────┐   │  │
│                          │  │ Output 渲染區域  │   │  │
│  ┌─────────────────┐    │  └──────────────────┘   │  │
│  │ Open Terminal   │    │  ┌──────────────────┐   │  │
│  │ 檔案導覽器     │    │  │ 視覺化圖表      │   │  │
│  │                 │    │  └──────────────────┘   │  │
│  │ ├─ notebooks/   │    └─────────────────────────┘  │
│  │ ├─ data.sqlite  │                                 │
│  │ └─ outputs/     │    ┌─────────────────────────┐  │
│  └─────────────────┘    │  Jupyter Kernel Server   │  │
│                          │  (後端執行引擎)          │  │
│                          └─────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 環境設定與安裝

### 基礎設定

```yaml
# config.yaml — Jupyter 整合設定
jupyter:
  enabled: true
  kernel:
    default: "python3"
    available:
      - python3
      - javascript
      - r
    auto_start: true
    idle_timeout: 3600        # 閒置超時（秒）
    max_memory: "2G"          # 記憶體上限
  notebook:
    auto_save: true
    auto_save_interval: 60    # 自動儲存間隔（秒）
    max_output_size: "10MB"   # 單一輸出大小上限
```

### Docker 環境部署

若使用 Docker 部署 OpenClaw，需確保 Jupyter Kernel 服務一併啟動：

```dockerfile
# Dockerfile — OpenClaw with Jupyter
FROM openclaw/base:latest

# 安裝 Jupyter 核心套件
RUN pip install \
    jupyterlab==4.1.0 \
    ipykernel==6.29.0 \
    ipywidgets==8.1.0 \
    matplotlib==3.8.0 \
    pandas==2.2.0 \
    numpy==1.26.0 \
    seaborn==0.13.0

# 註冊 Python Kernel
RUN python -m ipykernel install --user --name python3

# 設定 Jupyter 組態
COPY jupyter_config.py /root/.jupyter/jupyter_notebook_config.py

EXPOSE 8080 8888
CMD ["openclaw", "serve", "--with-jupyter"]
```

```python
# jupyter_config.py — Jupyter 伺服器組態
c.ServerApp.ip = "0.0.0.0"
c.ServerApp.port = 8888
c.ServerApp.open_browser = False
c.ServerApp.token = ""  # OpenClaw 內部通訊，由平台管理認證
c.ServerApp.allow_origin = "*"
c.ServerApp.disable_check_xsrf = True

# 安全限制
c.ServerApp.max_buffer_size = 50 * 1024 * 1024  # 50MB
c.MappingKernelManager.cull_idle_timeout = 3600
c.MappingKernelManager.cull_interval = 300
```

:::warning 安全警告
上述 `token = ""` 設定僅適用於 OpenClaw 內部通訊。若將 Jupyter 服務暴露至公網，務必啟用 Token 或密碼認證。
:::

---

## Code Cell 執行

### 基本操作

在 Notebook 面板中，每個 Code Cell 支援以下操作：

| 操作 | 快捷鍵 | 說明 |
|------|--------|------|
| 執行目前 Cell | `Shift+Enter` | 執行並跳至下一個 Cell |
| 執行且不跳轉 | `Ctrl+Enter` | 執行但停留在當前 Cell |
| 插入新 Cell | `B` (命令模式) | 在下方插入新的 Cell |
| 刪除 Cell | `D, D` (命令模式) | 連按兩次 D 刪除 |
| 中斷執行 | `I, I` (命令模式) | 中斷正在執行的 Kernel |

### 程式碼執行範例

```python
# Cell 1: 載入資料
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("/workspace/data/sales_2025.csv")
print(f"資料筆數: {len(df)}")
print(f"欄位: {list(df.columns)}")
```

```python
# Cell 2: 資料分析
summary = df.groupby("region").agg(
    total_sales=("amount", "sum"),
    avg_sales=("amount", "mean"),
    order_count=("order_id", "count")
).round(2)

print(summary)
```

```python
# Cell 3: 視覺化
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 長條圖
summary["total_sales"].plot(kind="bar", ax=axes[0], color="steelblue")
axes[0].set_title("各區域總銷售額")
axes[0].set_ylabel("金額")

# 圓餅圖
summary["order_count"].plot(kind="pie", ax=axes[1], autopct="%1.1f%%")
axes[1].set_title("各區域訂單比例")

plt.tight_layout()
plt.show()
```

:::tip 小技巧
在 Cell 中使用 `display()` 函式可以在同一個 Cell 內輸出多個 DataFrame 或圖表，不需要拆分成多個 Cell。
:::

---

## 在 Open Terminal 檔案導覽器中操作

Open Terminal 是 OpenClaw 內建的檔案管理介面，除了基本的檔案瀏覽功能外，還針對 Notebook 與 SQLite 提供了特殊支援。

### 執行整本 Notebook

在檔案導覽器中，對 `.ipynb` 檔案按右鍵即可選擇「全部執行」：

```
Open Terminal — 檔案導覽器
─────────────────────────
📁 workspace/
  ├─ 📁 notebooks/
  │   ├─ 📓 analysis.ipynb     ← 右鍵 → [開啟] [全部執行] [匯出]
  │   ├─ 📓 training.ipynb
  │   └─ 📓 visualization.ipynb
  ├─ 📁 data/
  │   ├─ 📊 sales_2025.csv
  │   └─ 🗃️ app.sqlite          ← 右鍵 → [瀏覽資料庫]
  └─ 📁 outputs/
```

### 批次執行 Notebook 的 API

```python
# 使用 OpenClaw SDK 批次執行 Notebook
from openclaw.jupyter import NotebookRunner

runner = NotebookRunner(
    kernel_name="python3",
    timeout=600,  # 每個 Cell 的執行超時（秒）
)

# 執行單一 Notebook
result = runner.execute("/workspace/notebooks/analysis.ipynb")
print(f"執行狀態: {result.status}")
print(f"執行時間: {result.duration_seconds:.1f} 秒")
print(f"失敗的 Cell: {result.failed_cells}")

# 批次執行多個 Notebook
notebooks = [
    "/workspace/notebooks/etl_pipeline.ipynb",
    "/workspace/notebooks/model_training.ipynb",
    "/workspace/notebooks/evaluation.ipynb",
]

results = runner.execute_batch(notebooks, parallel=False)
for nb, res in zip(notebooks, results):
    print(f"{nb}: {res.status}")
```

:::note 執行順序
設定 `parallel=False` 會依序執行 Notebook，確保前一本的輸出可作為下一本的輸入。設定 `parallel=True` 則同時執行，適用於彼此獨立的分析任務。
:::

---

## SQLite 資料庫瀏覽

Open Terminal 檔案導覽器可直接瀏覽 `.sqlite` 與 `.db` 檔案，提供圖形化的資料庫檢視介面。

### 功能一覽

```
┌───────────────────────────────────────────┐
│  SQLite Browser — app.sqlite              │
│                                           │
│  Tables:              │  Query Editor:    │
│  ├─ users       (150) │  SELECT * FROM    │
│  ├─ orders     (2340) │  users            │
│  ├─ products    (87)  │  WHERE active = 1 │
│  └─ categories  (12)  │  LIMIT 50;        │
│                       │                   │
│  ─────────────────────┤  [▶ 執行]         │
│                       │                   │
│  Results (50 rows):                       │
│  ┌────┬──────────┬────────┬────────────┐  │
│  │ id │ name     │ email  │ created_at │  │
│  ├────┼──────────┼────────┼────────────┤  │
│  │ 1  │ 王小明   │ w@...  │ 2025-01-01 │  │
│  │ 2  │ 李小華   │ l@...  │ 2025-01-02 │  │
│  └────┴──────────┴────────┴────────────┘  │
└───────────────────────────────────────────┘
```

### SQLite 瀏覽器設定

```yaml
# config.yaml — SQLite 瀏覽器設定
file_navigator:
  sqlite_browser:
    enabled: true
    max_rows_preview: 100      # 預覽顯示的最大行數
    query_timeout: 30          # 查詢超時（秒）
    read_only: true            # 唯讀模式（安全考量）
    allowed_extensions:
      - ".sqlite"
      - ".db"
      - ".sqlite3"
```

:::warning 資料安全
建議在生產環境中保持 `read_only: true`，防止透過瀏覽器介面意外修改資料庫內容。
:::

---

## 互動式資料探索

OpenClaw 的 Jupyter 整合支援互動式 Widget，讓資料探索更加直覺化。

```python
# 使用 ipywidgets 建立互動式篩選器
import ipywidgets as widgets
from IPython.display import display

region_dropdown = widgets.Dropdown(
    options=df["region"].unique().tolist(),
    description="選擇區域:",
    style={"description_width": "80px"},
)

date_range = widgets.DatePicker(
    description="起始日期:",
    style={"description_width": "80px"},
)

output = widgets.Output()

def on_filter_change(change):
    with output:
        output.clear_output()
        filtered = df[df["region"] == region_dropdown.value]
        display(filtered.describe())

region_dropdown.observe(on_filter_change, names="value")
display(widgets.VBox([region_dropdown, date_range, output]))
```

---

## 視覺化渲染

Notebook 中的圖表會直接渲染在 OpenClaw 的 UI 中，支援多種視覺化函式庫：

| 函式庫 | 支援程度 | 互動性 |
|--------|---------|--------|
| Matplotlib | 完整支援 | 靜態圖片 |
| Seaborn | 完整支援 | 靜態圖片 |
| Plotly | 完整支援 | 互動式圖表 |
| Altair | 完整支援 | 互動式圖表 |
| Bokeh | 部分支援 | 互動式圖表 |

### Plotly 互動式圖表範例

```python
import plotly.express as px

fig = px.scatter(
    df,
    x="order_date",
    y="amount",
    color="region",
    size="quantity",
    title="訂單金額分佈",
    labels={
        "order_date": "訂單日期",
        "amount": "金額",
        "region": "區域",
        "quantity": "數量",
    },
)

fig.update_layout(
    template="plotly_white",
    font=dict(family="Noto Sans TC", size=12),
)

fig.show()
```

---

## 安全性考量

在平台中執行任意程式碼存在固有的安全風險，OpenClaw 透過多層防護機制來降低風險。

### 沙盒架構

```
┌────────────────────────────────────┐
│         OpenClaw 主程式            │
│  ┌──────────────────────────────┐  │
│  │    Container Sandbox         │  │
│  │  ┌────────────────────────┐  │  │
│  │  │   Jupyter Kernel       │  │  │
│  │  │                        │  │  │
│  │  │  - 限制網路存取        │  │  │
│  │  │  - 限制檔案系統存取    │  │  │
│  │  │  - 限制記憶體用量      │  │  │
│  │  │  - 限制 CPU 時間       │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

### 安全設定

```yaml
# config.yaml — Jupyter 安全設定
jupyter:
  security:
    sandbox:
      enabled: true
      runtime: "docker"          # docker | nsjail | bubblewrap
      network:
        enabled: false           # 預設禁止網路存取
        allowed_hosts:           # 若啟用，僅允許以下主機
          - "pypi.org"
          - "files.pythonhosted.org"
      filesystem:
        writable_paths:
          - "/workspace"
          - "/tmp"
        read_only_paths:
          - "/usr/lib"
          - "/usr/local/lib"
        blocked_paths:
          - "/etc/shadow"
          - "/root/.ssh"
      resources:
        max_memory: "2G"
        max_cpu_time: 300        # 秒
        max_file_size: "100MB"
        max_processes: 50
    audit:
      log_executions: true       # 記錄所有執行
      log_outputs: false         # 不記錄輸出（可能含敏感資料）
      retention_days: 90
```

:::danger 重要安全提醒
即使啟用了沙盒，仍不建議在未經審查的情況下執行來自不受信任來源的 Notebook。請務必在執行前檢閱 Notebook 內容。
:::

### 安全檢查流程

```typescript
interface SecurityCheck {
  notebook: string;
  checks: CheckResult[];
  approved: boolean;
}

interface CheckResult {
  rule: string;
  passed: boolean;
  details: string;
}

async function preExecutionScan(path: string): Promise<SecurityCheck> {
  const notebook = await readNotebook(path);
  const checks: CheckResult[] = [];

  // 檢查是否有可疑的系統呼叫
  checks.push(checkForSystemCalls(notebook));

  // 檢查是否嘗試讀取敏感檔案
  checks.push(checkForSensitiveFileAccess(notebook));

  // 檢查是否有外部網路請求
  checks.push(checkForNetworkRequests(notebook));

  // 檢查是否安裝未經許可的套件
  checks.push(checkForPackageInstalls(notebook));

  return {
    notebook: path,
    checks,
    approved: checks.every((c) => c.passed),
  };
}
```

---

## 完整設定範例

```yaml
# config.yaml — 完整 Jupyter 整合設定
jupyter:
  enabled: true
  kernel:
    default: "python3"
    available:
      - python3
      - javascript
    auto_start: true
    idle_timeout: 3600
    max_memory: "2G"
  notebook:
    auto_save: true
    auto_save_interval: 60
    max_output_size: "10MB"
  security:
    sandbox:
      enabled: true
      runtime: "docker"
      network:
        enabled: false
      resources:
        max_memory: "2G"
        max_cpu_time: 300
    audit:
      log_executions: true
      retention_days: 90

file_navigator:
  sqlite_browser:
    enabled: true
    max_rows_preview: 100
    read_only: true
  notebook_actions:
    run_all: true
    export_formats:
      - "html"
      - "pdf"
      - "py"
```

---

## 練習題

### 練習 1：Notebook 自動化執行

請撰寫一段 Python 腳本，使用 OpenClaw SDK 依序執行三個 Notebook，並在任一 Notebook 執行失敗時中止後續執行，同時發送通知。

<details>
<summary>參考答案</summary>

```python
from openclaw.jupyter import NotebookRunner
from openclaw.notifications import send_alert

runner = NotebookRunner(kernel_name="python3", timeout=600)

notebooks = [
    "/workspace/notebooks/data_ingestion.ipynb",
    "/workspace/notebooks/feature_engineering.ipynb",
    "/workspace/notebooks/model_training.ipynb",
]

for nb in notebooks:
    result = runner.execute(nb)
    if result.status == "failed":
        send_alert(
            channel="slack",
            message=f"Notebook 執行失敗: {nb}\n錯誤: {result.error}",
        )
        break
    print(f"完成: {nb} ({result.duration_seconds:.1f}s)")
else:
    send_alert(
        channel="slack",
        message="所有 Notebook 執行完成！",
    )
```

</details>

### 練習 2：安全策略設計

請為一個多人共用的 OpenClaw 環境設計安全策略：允許使用者安裝 `pandas`、`numpy`、`scikit-learn`，但禁止安裝其他套件，同時限制每個 Kernel 最多使用 1GB 記憶體。請寫出對應的設定檔。

<details>
<summary>參考答案</summary>

```yaml
jupyter:
  security:
    sandbox:
      enabled: true
      runtime: "docker"
      network:
        enabled: true
        allowed_hosts:
          - "pypi.org"
          - "files.pythonhosted.org"
      resources:
        max_memory: "1G"
        max_cpu_time: 300
        max_processes: 30
    package_policy:
      mode: "allowlist"
      allowed_packages:
        - "pandas"
        - "numpy"
        - "scikit-learn"
      block_pip_install: false
      audit_installs: true
```

</details>

### 練習 3：自訂 SQLite 查詢介面

請使用 ipywidgets 建立一個簡易的 SQLite 查詢介面，包含一個文字輸入框讓使用者輸入 SQL 查詢，以及一個按鈕觸發執行，結果以 DataFrame 顯示。

<details>
<summary>參考答案</summary>

```python
import sqlite3
import pandas as pd
import ipywidgets as widgets
from IPython.display import display

db_path = "/workspace/data/app.sqlite"

query_input = widgets.Textarea(
    value="SELECT * FROM users LIMIT 10;",
    description="SQL:",
    layout=widgets.Layout(width="100%", height="80px"),
)

run_button = widgets.Button(
    description="執行查詢",
    button_style="primary",
)

output = widgets.Output()

def on_run_click(btn):
    with output:
        output.clear_output()
        try:
            conn = sqlite3.connect(db_path)
            df = pd.read_sql_query(query_input.value, conn)
            conn.close()
            display(df)
            print(f"共 {len(df)} 筆結果")
        except Exception as e:
            print(f"查詢錯誤: {e}")

run_button.on_click(on_run_click)
display(widgets.VBox([query_input, run_button, output]))
```

</details>
