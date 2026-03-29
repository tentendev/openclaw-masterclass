---
title: 使用者群組與權限管理
description: OpenClaw 的使用者群組、RBAC 權限控制與 SSO 整合完整指南
sidebar_position: 4
keywords: [OpenClaw, RBAC, 權限, SSO, OAuth, LDAP, 群組管理]
---

# 使用者群組與權限管理

當 OpenClaw 從個人助理擴展到團隊或企業環境時，你需要精細的權限控制：誰可以使用哪些模型、誰可以存取知識庫、誰可以安裝技能。OpenClaw 的 RBAC（Role-Based Access Control）系統提供了從簡單到企業級的完整方案。

---

## 權限架構總覽

```
                    ┌─────────────────────┐
                    │   Admin Dashboard   │
                    │   (管理後台)         │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
     │  SSO Provider │ │   使用者群組  │ │   權限策略    │
     │  OAuth / LDAP │ │   Groups     │ │   Policies   │
     └────────┬──────┘ └──────┬───────┘ └──────┬───────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │    Permission       │
                    │    Enforcer         │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
    ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
    │  模型存取    │    │  知識庫存取  │    │  技能存取    │
    │  Models     │    │  Knowledge  │    │  Skills     │
    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 使用者群組管理

### 建立群組

```yaml
# ~/.openclaw/users/groups.yaml
groups:
  admins:
    display_name: "系統管理員"
    description: "擁有完整系統存取權限"
    members:
      - user_id: "admin_001"
        name: "王小明"
        email: "admin@example.com"

  developers:
    display_name: "開發團隊"
    description: "可使用程式碼相關模型與技能"
    members:
      - user_id: "dev_001"
        name: "李大華"
      - user_id: "dev_002"
        name: "張美麗"

  marketing:
    display_name: "行銷團隊"
    description: "可使用創意寫作相關功能"
    members:
      - user_id: "mkt_001"
        name: "陳志偉"

  guests:
    display_name: "訪客"
    description: "有限的唯讀存取"
    members: []
```

### CLI 群組管理

```bash
# 列出所有群組
openclaw users groups list

# 建立新群組
openclaw users groups create --name "qa-team" --display-name "QA 團隊"

# 新增成員到群組
openclaw users groups add-member --group developers --user-id "dev_003"

# 從群組移除成員
openclaw users groups remove-member --group developers --user-id "dev_002"

# 查看群組詳細資訊
openclaw users groups info developers

# 刪除群組
openclaw users groups delete --name "old-group" --confirm
```

---

## RBAC 角色與權限

### 內建角色

OpenClaw 提供四個內建角色，涵蓋最常見的權限需求：

| 角色 | 說明 | 模型 | 知識庫 | 技能 | 管理 |
|------|------|------|--------|------|------|
| **admin** | 系統管理員 | 全部 | 全部 | 全部（含安裝） | 全部 |
| **power_user** | 進階使用者 | 白名單內 | 讀寫 | 全部（不含安裝） | 部分 |
| **user** | 一般使用者 | 白名單內 | 唯讀 | 白名單內 | 無 |
| **guest** | 訪客 | 預設模型 | 無 | 無 | 無 |

### 自訂角色

```yaml
# ~/.openclaw/users/roles.yaml
roles:
  # 自訂角色：資料分析師
  data_analyst:
    display_name: "資料分析師"
    inherits: "user"              # 繼承 user 角色的基本權限
    permissions:
      models:
        allowed:
          - "claude-opus-4-6"
          - "gpt-5.2-codex"
        max_tokens_per_request: 8192
        daily_token_limit: 500000
      knowledge_bases:
        read: true
        write: true
        create: false
        delete: false
        allowed_bases:
          - "company-data"
          - "analytics-docs"
      skills:
        allowed:
          - "data-analysis"
          - "chart-generator"
          - "csv-processor"
          - "web-search"
        install: false
      prompts:
        read: true
        create: true
        share: true
        delete_own: true
        delete_others: false

  # 自訂角色：內容編輯
  content_editor:
    display_name: "內容編輯"
    inherits: "user"
    permissions:
      models:
        allowed:
          - "claude-opus-4-6"
          - "gemini-2.5-pro"
        daily_token_limit: 1000000    # 寫作需要較高額度
      knowledge_bases:
        read: true
        write: true
        allowed_bases:
          - "brand-guidelines"
          - "content-library"
      skills:
        allowed:
          - "web-search"
          - "image-generator"
          - "grammar-checker"
          - "translator"
```

### 將角色指派給群組

```yaml
# ~/.openclaw/users/group-roles.yaml
assignments:
  - group: "admins"
    role: "admin"

  - group: "developers"
    role: "power_user"
    overrides:                         # 可覆蓋角色的預設設定
      permissions:
        models:
          allowed:
            - "claude-opus-4-6"
            - "gpt-5.2-codex"
            - "llama-3.3-70b"         # 開發團隊可用本地模型
          daily_token_limit: 2000000

  - group: "marketing"
    role: "content_editor"

  - group: "guests"
    role: "guest"
```

---

## 模型白名單

模型白名單是 RBAC 中最常用的功能，精確控制每個群組可以使用的模型：

```yaml
# ~/.openclaw/users/model-whitelist.yaml
model_whitelist:
  # 全域設定
  global:
    default_model: "llama-3.3-70b"     # 預設使用本地模型（省錢）
    fallback_model: "llama-3.3-70b"

  # 按群組設定
  groups:
    admins:
      models: ["*"]                     # 管理員可用所有模型
      rate_limit: null                  # 無速率限制

    developers:
      models:
        - "claude-opus-4-6"
        - "gpt-5.2-codex"
        - "llama-3.3-70b"
        - "qwen-2.5-72b"
      rate_limit:
        requests_per_minute: 30
        tokens_per_day: 2000000

    marketing:
      models:
        - "claude-opus-4-6"
        - "gemini-2.5-pro"
      rate_limit:
        requests_per_minute: 20
        tokens_per_day: 1000000

    guests:
      models:
        - "llama-3.3-70b"              # 訪客只能用免費的本地模型
      rate_limit:
        requests_per_minute: 5
        tokens_per_day: 50000
```

:::tip 成本控制
搭配模型白名單和每日 token 限額，可以有效控制 API 支出。建議將本地模型設為預設，只允許需要的群組使用付費模型。
:::

---

## SSO 整合

### 支援的認證方式

| 方式 | 說明 | 適用場景 |
|------|------|---------|
| **OAuth 2.0** | Google、GitHub、Microsoft 等 | 小型團隊 |
| **OIDC** | OpenID Connect 標準協定 | 中型組織 |
| **LDAP** | Active Directory 等目錄服務 | 企業環境 |
| **Trusted Headers** | 反向代理傳遞認證標頭 | 已有 SSO 基礎設施 |
| **SAML 2.0** | 企業級聯合身份驗證 | 大型企業 |

### OAuth 2.0 設定（Google）

```yaml
# ~/.openclaw/auth/sso.yaml
auth:
  type: "oauth2"
  provider: "google"
  client_id: "${GOOGLE_CLIENT_ID}"
  client_secret: "${GOOGLE_CLIENT_SECRET}"
  redirect_uri: "http://127.0.0.1:18789/auth/callback"
  scopes:
    - "openid"
    - "email"
    - "profile"

  # 自動群組對應
  auto_group_mapping:
    enabled: true
    rules:
      - condition:
          email_domain: "example.com"
        assign_group: "developers"
      - condition:
          email_domain: "partner.com"
        assign_group: "guests"
```

### OIDC 設定

```yaml
# ~/.openclaw/auth/sso.yaml
auth:
  type: "oidc"
  issuer: "https://auth.example.com/realms/openclaw"
  client_id: "${OIDC_CLIENT_ID}"
  client_secret: "${OIDC_CLIENT_SECRET}"
  redirect_uri: "http://127.0.0.1:18789/auth/callback"
  scopes:
    - "openid"
    - "email"
    - "profile"
    - "groups"                  # 從 OIDC 取得群組資訊

  # OIDC Claims 到群組的對應
  claims_mapping:
    groups_claim: "groups"      # JWT 中的群組 claim 名稱
    mapping:
      "oidc-admins": "admins"
      "oidc-devs": "developers"
      "oidc-marketing": "marketing"
```

### LDAP 設定

```yaml
# ~/.openclaw/auth/sso.yaml
auth:
  type: "ldap"
  server:
    url: "ldaps://ldap.example.com:636"
    bind_dn: "cn=openclaw,ou=services,dc=example,dc=com"
    bind_password: "${LDAP_BIND_PASSWORD}"
    base_dn: "dc=example,dc=com"
    tls:
      verify: true
      ca_cert: "/etc/ssl/certs/ldap-ca.pem"

  user_search:
    base: "ou=users,dc=example,dc=com"
    filter: "(uid={{username}})"
    attributes:
      username: "uid"
      email: "mail"
      display_name: "cn"

  group_search:
    base: "ou=groups,dc=example,dc=com"
    filter: "(member={{dn}})"
    attribute: "cn"
    mapping:
      "ldap-admins": "admins"
      "ldap-engineers": "developers"
      "ldap-marketing": "marketing"
```

:::danger 安全提醒
LDAP bind 密碼必須使用環境變數，切勿寫在設定檔中。同時確保使用 `ldaps://`（TLS 加密）而非 `ldap://`。
:::

---

## JWT Token 會話管理

OpenClaw 使用 JWT（JSON Web Token）管理使用者會話：

```yaml
# ~/.openclaw/auth/jwt.yaml
jwt:
  secret: "${JWT_SECRET}"              # 使用 openssl rand -hex 64 生成
  algorithm: "HS256"
  expiry:
    access_token: "15m"                # 存取 token 15 分鐘過期
    refresh_token: "7d"                # 刷新 token 7 天過期
  issuer: "openclaw"
  audience: "openclaw-api"
```

### Token 結構

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_001",
    "name": "王小明",
    "email": "admin@example.com",
    "groups": ["admins"],
    "role": "admin",
    "permissions": {
      "models": ["*"],
      "knowledge_bases": ["*"],
      "skills": ["*"]
    },
    "iat": 1743321600,
    "exp": 1743322500,
    "iss": "openclaw",
    "aud": "openclaw-api"
  }
}
```

### API 認證

```bash
# 登入取得 token
curl -X POST http://127.0.0.1:18789/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'

# 回應
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "token_type": "Bearer"
}

# 使用 token 存取 API
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://127.0.0.1:18789/api/models

# 刷新 token
curl -X POST http://127.0.0.1:18789/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "eyJhbGciOiJIUzI1NiIs..."}'
```

---

## API Secret Key 管理

除了 JWT，OpenClaw 也支援 API Secret Key 用於程式化存取：

```bash
# 生成 API key
openclaw api-keys create --name "CI/CD Pipeline" --group developers
# Output: sk-oc-a1b2c3d4e5f6...

# 列出所有 API key
openclaw api-keys list

# 撤銷 API key
openclaw api-keys revoke --key-id "key_001"

# 設定 API key 權限
openclaw api-keys update --key-id "key_001" \
  --models "claude-opus-4-6,llama-3.3-70b" \
  --rate-limit 100
```

```yaml
# ~/.openclaw/auth/api-keys.yaml
api_keys:
  - id: "key_001"
    name: "CI/CD Pipeline"
    key_hash: "$2b$12$..."           # bcrypt hash，不儲存明文
    group: "developers"
    permissions:
      models:
        - "claude-opus-4-6"
        - "llama-3.3-70b"
      skills:
        - "code-review"
        - "test-generator"
    rate_limit:
      requests_per_minute: 100
    expires_at: "2026-06-30T23:59:59Z"
    created_at: "2026-03-30T10:00:00Z"
```

:::warning API Key 安全
- API key 只在建立時顯示一次，之後無法檢視
- 設定到期日，避免永久有效的 key 被遺忘
- 為每個用途建立獨立的 key，方便追蹤和撤銷
:::

---

## Admin Dashboard

### 管理後台功能

```yaml
# ~/.openclaw/admin/dashboard.yaml
admin:
  dashboard:
    enabled: true
    port: 18791
    bind: "127.0.0.1"
    auth:
      enabled: true
      admin_users:
        - "admin_001"

  features:
    user_management: true        # 使用者與群組管理
    model_management: true       # 模型設定與白名單
    usage_analytics: true        # 用量統計與分析
    audit_log: true              # 操作稽核日誌
    skill_management: true       # 技能安裝與權限
    knowledge_base: true         # 知識庫管理
    system_health: true          # 系統健康監控
```

### 稽核日誌

所有權限相關操作都會記錄在稽核日誌中：

```json
{
  "timestamp": "2026-03-30T14:30:00Z",
  "event": "permission.denied",
  "actor": {
    "user_id": "mkt_001",
    "name": "陳志偉",
    "group": "marketing"
  },
  "resource": {
    "type": "model",
    "id": "gpt-5.2-codex"
  },
  "action": "invoke",
  "result": "denied",
  "reason": "模型不在群組白名單中",
  "ip": "127.0.0.1"
}
```

```bash
# 查看稽核日誌
openclaw admin audit-log --last 100
openclaw admin audit-log --user "mkt_001" --since "2026-03-01"
openclaw admin audit-log --event "permission.denied" --export json
```

---

## 社群分享控制

控制使用者是否可以在 ClawHub 上分享 Prompt、技能和知識庫：

```yaml
# ~/.openclaw/users/sharing.yaml
sharing:
  # 全域開關
  enabled: true

  # 按資源類型設定
  prompts:
    share_to_clawhub: true       # 允許分享 Prompt 到 ClawHub
    share_within_org: true       # 允許組織內分享
    require_approval: false      # 是否需要管理員審核

  skills:
    share_to_clawhub: false      # 不允許分享自製技能到 ClawHub
    share_within_org: true
    require_approval: true       # 需要管理員審核

  knowledge_bases:
    share_to_clawhub: false      # 知識庫預設不允許外部分享
    share_within_org: true
    require_approval: true
    excluded_bases:               # 永不分享的知識庫
      - "confidential-data"
      - "internal-docs"
```

---

## 企業 SSO 設定範例

### Keycloak 整合

```yaml
# ~/.openclaw/auth/sso.yaml
auth:
  type: "oidc"
  issuer: "https://keycloak.example.com/realms/openclaw"
  client_id: "${KEYCLOAK_CLIENT_ID}"
  client_secret: "${KEYCLOAK_CLIENT_SECRET}"
  redirect_uri: "http://127.0.0.1:18789/auth/callback"
  scopes:
    - "openid"
    - "email"
    - "profile"
    - "roles"

  # Keycloak 特定設定
  keycloak:
    realm: "openclaw"
    admin_role: "openclaw-admin"
    role_claim: "realm_access.roles"

  claims_mapping:
    roles_claim: "realm_access.roles"
    mapping:
      "openclaw-admin": "admins"
      "openclaw-developer": "developers"
      "openclaw-user": "marketing"
```

### Trusted Headers（搭配 Authelia / Authentik）

```yaml
# ~/.openclaw/auth/sso.yaml
auth:
  type: "trusted_headers"
  headers:
    user: "X-Forwarded-User"
    email: "X-Forwarded-Email"
    groups: "X-Forwarded-Groups"
    name: "X-Forwarded-Name"

  # 信任來源限制
  trusted_proxies:
    - "127.0.0.1"
    - "10.0.0.0/24"

  # 自動建立使用者
  auto_provision:
    enabled: true
    default_group: "guests"
    default_role: "user"
```

```nginx
# Nginx 反向代理設定範例（搭配 Authelia）
server {
    listen 443 ssl;
    server_name openclaw.example.com;

    # Authelia 認證
    include /etc/nginx/snippets/authelia-location.conf;

    location / {
        include /etc/nginx/snippets/authelia-authrequest.conf;

        # 傳遞認證標頭給 OpenClaw
        proxy_set_header X-Forwarded-User $upstream_http_remote_user;
        proxy_set_header X-Forwarded-Email $upstream_http_remote_email;
        proxy_set_header X-Forwarded-Groups $upstream_http_remote_groups;

        proxy_pass http://127.0.0.1:18789;
    }
}
```

:::danger 安全提醒
使用 Trusted Headers 時，務必限制 `trusted_proxies` 清單。如果任何來源都能設定這些 Header，攻擊者可以偽造身份繞過認證。
:::

---

## Trusted Headers 與 CILogon 整合

CILogon 適用於學術和研究機構：

```yaml
# ~/.openclaw/auth/sso.yaml
auth:
  type: "oidc"
  issuer: "https://cilogon.org"
  client_id: "${CILOGON_CLIENT_ID}"
  client_secret: "${CILOGON_CLIENT_SECRET}"
  redirect_uri: "http://127.0.0.1:18789/auth/callback"
  scopes:
    - "openid"
    - "email"
    - "profile"
    - "org.cilogon.userinfo"

  claims_mapping:
    groups_claim: "isMemberOf"
    mapping:
      "CO:COU:openclaw-admins:members:active": "admins"
      "CO:COU:researchers:members:active": "developers"
      "CO:COU:students:members:active": "guests"
```

---

## 練習題

:::note 練習 1：建立基本 RBAC
1. 建立三個群組：admins、developers、viewers
2. 設定 admins 可存取所有模型，developers 限定 2 個模型，viewers 只能用本地模型
3. 測試各群組的權限是否正確生效
:::

:::note 練習 2：設定 OAuth SSO
1. 在 Google Cloud Console 建立 OAuth 應用程式
2. 設定 OpenClaw 使用 Google OAuth 登入
3. 配置自動群組對應規則
4. 測試登入流程
:::

:::note 練習 3：API Key 管理
1. 為 CI/CD pipeline 建立一組 API key
2. 限制該 key 只能使用特定模型和技能
3. 設定 90 天到期日
4. 用該 key 透過 REST API 呼叫模型
:::

:::note 練習 4：稽核日誌分析
1. 啟用稽核日誌功能
2. 以不同群組的使用者身份嘗試存取受限資源
3. 檢查稽核日誌中是否正確記錄了 permission.denied 事件
4. 匯出日誌並分析存取模式
:::

---

## 延伸閱讀

- [安全性最佳實踐](/docs/security/best-practices) — Gateway 認證與 API Key 安全
- [架構概覽](/docs/architecture/overview) — Permission Enforcer 在架構中的位置
- [API 參考](/docs/architecture/api-reference) — 認證相關 API 端點
