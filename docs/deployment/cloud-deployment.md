---
title: 雲端部署指南
description: 在 AWS、GCP、Azure、DigitalOcean 等雲端平台部署 OpenClaw 的完整指南
sidebar_position: 2
keywords: [OpenClaw, 雲端, AWS, GCP, Azure, Kubernetes, 部署]
---

# 雲端部署指南

本指南詳細介紹如何在各大雲端平台上部署 OpenClaw，涵蓋從單機虛擬機到 Kubernetes 叢集的完整方案。

## 架構總覽

```
┌──────────────────────────────────────────────────────────────┐
│                        DNS (your-domain.com)                 │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│               負載平衡器 / CDN (CloudFlare / ALB)              │
│                    TLS 終止 (:443)                            │
└──────────────────────────┬───────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐
   │  OpenClaw   │  │  OpenClaw  │  │  OpenClaw   │
   │  Instance 1 │  │ Instance 2 │  │ Instance 3  │
   └──────┬──────┘  └─────┬──────┘  └──────┬──────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐
   │  PostgreSQL │  │   Redis    │  │   Ollama    │
   │  (RDS/Cloud │  │  (Elasti-  │  │  (GPU Node) │
   │    SQL)     │  │   Cache)   │  │             │
   └─────────────┘  └────────────┘  └─────────────┘
```

## 成本估算

在選擇雲端平台前，先了解各方案的月費估算：

| 部署方案 | vCPU | 記憶體 | 儲存空間 | GPU | 月費估算 (USD) |
|----------|------|--------|---------|-----|---------------|
| DigitalOcean Droplet (Basic) | 2 | 4 GB | 80 GB | 無 | ~$24 |
| DigitalOcean Droplet (GPU) | 8 | 32 GB | 320 GB | A100 40GB | ~$2,500 |
| AWS EC2 `t3.large` | 2 | 8 GB | 50 GB EBS | 無 | ~$60 |
| AWS EC2 `g5.xlarge` | 4 | 16 GB | 250 GB | A10G 24GB | ~$760 |
| GCP `e2-standard-2` | 2 | 8 GB | 50 GB | 無 | ~$49 |
| GCP `g2-standard-4` | 4 | 16 GB | 100 GB | L4 24GB | ~$560 |
| Azure `Standard_D2s_v5` | 2 | 8 GB | 64 GB | 無 | ~$70 |
| Azure `Standard_NC4as_T4_v3` | 4 | 28 GB | 176 GB | T4 16GB | ~$380 |
| Kubernetes (3 節點) | 6 | 24 GB | 150 GB | 選用 | ~$150-300 |

:::tip 省錢技巧
- 使用 **Spot/Preemptible 實例** 可節省 60-80% 費用（適合非關鍵工作負載）
- 使用 **Reserved Instances** 承諾 1-3 年可節省 30-60%
- 僅在需要時開啟 GPU 實例，使用外部 API（OpenAI、Anthropic）替代本機推論
:::

## DigitalOcean 一鍵部署

DigitalOcean 提供最簡單的部署方式：

### Marketplace 一鍵部署

```bash
# 使用 doctl CLI
doctl compute droplet create openclaw-server \
  --region sgp1 \
  --size s-2vcpu-4gb \
  --image openclaw-22-04 \
  --ssh-keys $(doctl compute ssh-key list --format ID --no-header | tr '\n' ',') \
  --tag-names openclaw,production \
  --user-data-file cloud-init.yml
```

### Cloud-Init 設定

```yaml
# cloud-init.yml
#cloud-config
package_update: true
package_upgrade: true

packages:
  - docker.io
  - docker-compose-plugin
  - curl
  - ufw

runcmd:
  # 設定防火牆
  - ufw allow 22/tcp
  - ufw allow 80/tcp
  - ufw allow 443/tcp
  - ufw --force enable

  # 設定 Docker
  - systemctl enable docker
  - systemctl start docker

  # 部署 OpenClaw
  - mkdir -p /opt/openclaw
  - |
    cat > /opt/openclaw/docker-compose.yml << 'COMPOSE'
    version: "3.9"
    services:
      openclaw:
        image: ghcr.io/openclaw/openclaw:latest
        restart: unless-stopped
        ports:
          - "80:3000"
        volumes:
          - openclaw-data:/app/data
        environment:
          - OPENCLAW_AUTH_ENABLED=true
    volumes:
      openclaw-data:
    COMPOSE
  - cd /opt/openclaw && docker compose up -d
```

## AWS 部署

### EC2 單機部署

```bash
# 使用 AWS CLI 建立實例
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxx \
  --subnet-id subnet-xxxxxxxx \
  --block-device-mappings '[{
    "DeviceName": "/dev/xvda",
    "Ebs": {
      "VolumeSize": 100,
      "VolumeType": "gp3",
      "Iops": 3000,
      "Throughput": 125
    }
  }]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=openclaw-server}]' \
  --user-data file://cloud-init.yml
```

### 安全群組設定

```bash
# 建立安全群組
aws ec2 create-security-group \
  --group-name openclaw-sg \
  --description "OpenClaw Security Group"

# 開放必要埠
aws ec2 authorize-security-group-ingress --group-name openclaw-sg \
  --protocol tcp --port 22 --cidr 0.0.0.0/0    # SSH
aws ec2 authorize-security-group-ingress --group-name openclaw-sg \
  --protocol tcp --port 80 --cidr 0.0.0.0/0    # HTTP
aws ec2 authorize-security-group-ingress --group-name openclaw-sg \
  --protocol tcp --port 443 --cidr 0.0.0.0/0   # HTTPS
```

### ECS (Elastic Container Service) 部署

```json
// ecs-task-definition.json
{
  "family": "openclaw",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "executionRoleArn": "arn:aws:iam::role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "openclaw",
      "image": "ghcr.io/openclaw/openclaw:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "OPENCLAW_AUTH_ENABLED", "value": "true"},
        {"name": "OPENCLAW_DB_URL", "value": "postgresql://user:pass@rds-endpoint:5432/openclaw"}
      ],
      "secrets": [
        {
          "name": "OPENCLAW_JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:openclaw/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/openclaw",
          "awslogs-region": "ap-northeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 10,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

```bash
# 註冊任務定義
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# 建立服務
aws ecs create-service \
  --cluster openclaw-cluster \
  --service-name openclaw \
  --task-definition openclaw \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration '{
    "awsvpcConfiguration": {
      "subnets": ["subnet-xxx", "subnet-yyy"],
      "securityGroups": ["sg-xxx"],
      "assignPublicIp": "ENABLED"
    }
  }'
```

## Google Cloud 部署

### Compute Engine

```bash
# 建立 VM 實例
gcloud compute instances create openclaw-server \
  --zone=asia-east1-b \
  --machine-type=e2-standard-2 \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=100GB \
  --boot-disk-type=pd-ssd \
  --tags=http-server,https-server \
  --metadata-from-file=startup-script=cloud-init.sh
```

### Cloud Run（Serverless）

```bash
# 直接從映像部署到 Cloud Run
gcloud run deploy openclaw \
  --image=ghcr.io/openclaw/openclaw:latest \
  --platform=managed \
  --region=asia-east1 \
  --port=3000 \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=0 \
  --max-instances=5 \
  --set-env-vars="OPENCLAW_AUTH_ENABLED=true" \
  --set-secrets="OPENCLAW_JWT_SECRET=openclaw-jwt:latest" \
  --allow-unauthenticated
```

:::caution Cloud Run 限制
Cloud Run 不支援本機 GPU，因此無法直接運行 Ollama。建議搭配外部 AI API 或在 GKE 中部署 Ollama 節點。
:::

### GKE (Google Kubernetes Engine)

```bash
# 建立 GKE 叢集
gcloud container clusters create openclaw-cluster \
  --zone=asia-east1-b \
  --num-nodes=3 \
  --machine-type=e2-standard-4 \
  --enable-autoscaling \
  --min-nodes=2 \
  --max-nodes=10

# 取得叢集認證
gcloud container clusters get-credentials openclaw-cluster --zone=asia-east1-b
```

## Azure 部署

### 虛擬機器

```bash
# 建立資源群組
az group create --name openclaw-rg --location eastasia

# 建立 VM
az vm create \
  --resource-group openclaw-rg \
  --name openclaw-server \
  --image Ubuntu2204 \
  --size Standard_D2s_v5 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --custom-data cloud-init.yml \
  --os-disk-size-gb 100

# 開放埠
az vm open-port --resource-group openclaw-rg --name openclaw-server --port 80,443
```

### Azure Container Apps

```bash
# 建立 Container Apps 環境
az containerapp env create \
  --name openclaw-env \
  --resource-group openclaw-rg \
  --location eastasia

# 部署 OpenClaw
az containerapp create \
  --name openclaw \
  --resource-group openclaw-rg \
  --environment openclaw-env \
  --image ghcr.io/openclaw/openclaw:latest \
  --target-port 3000 \
  --ingress external \
  --cpu 2.0 \
  --memory 4.0Gi \
  --min-replicas 1 \
  --max-replicas 5 \
  --env-vars \
    OPENCLAW_AUTH_ENABLED=true \
    OPENCLAW_DB_URL=secretref:db-url
```

## Kubernetes 部署

### Helm Chart 安裝

```bash
# 新增 OpenClaw Helm 倉庫
helm repo add openclaw https://charts.openclaw.dev
helm repo update

# 安裝（使用預設值）
helm install openclaw openclaw/openclaw \
  --namespace openclaw \
  --create-namespace

# 安裝（自訂設定）
helm install openclaw openclaw/openclaw \
  --namespace openclaw \
  --create-namespace \
  --values values.yaml
```

### Helm Values 設定

```yaml
# values.yaml
replicaCount: 3

image:
  repository: ghcr.io/openclaw/openclaw
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
  hosts:
    - host: openclaw.your-domain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: openclaw-tls
      hosts:
        - openclaw.your-domain.com

resources:
  limits:
    cpu: "2"
    memory: 4Gi
  requests:
    cpu: "500m"
    memory: 1Gi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

env:
  OPENCLAW_AUTH_ENABLED: "true"
  OPENCLAW_LOG_LEVEL: "info"

envSecrets:
  OPENCLAW_JWT_SECRET: openclaw-secrets
  OPENCLAW_OPENAI_API_KEY: openclaw-secrets

persistence:
  enabled: true
  storageClass: standard
  size: 50Gi

postgresql:
  enabled: true
  auth:
    database: openclaw
    username: openclaw
    existingSecret: openclaw-db-secret

redis:
  enabled: true
  architecture: standalone
  auth:
    existingSecret: openclaw-redis-secret

ollama:
  enabled: true
  resources:
    limits:
      nvidia.com/gpu: 1
```

### 原生 Kubernetes Manifests

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: openclaw

---
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openclaw
  namespace: openclaw
  labels:
    app: openclaw
spec:
  replicas: 3
  selector:
    matchLabels:
      app: openclaw
  template:
    metadata:
      labels:
        app: openclaw
    spec:
      containers:
        - name: openclaw
          image: ghcr.io/openclaw/openclaw:latest
          ports:
            - containerPort: 3000
          env:
            - name: OPENCLAW_AUTH_ENABLED
              value: "true"
            - name: OPENCLAW_JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: openclaw-secrets
                  key: jwt-secret
            - name: OPENCLAW_DB_URL
              valueFrom:
                secretKeyRef:
                  name: openclaw-secrets
                  key: db-url
          resources:
            requests:
              cpu: "500m"
              memory: 1Gi
            limits:
              cpu: "2"
              memory: 4Gi
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
          volumeMounts:
            - name: data
              mountPath: /app/data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: openclaw-data

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: openclaw
  namespace: openclaw
spec:
  selector:
    app: openclaw
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP

---
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: openclaw-data
  namespace: openclaw
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 50Gi
```

```bash
# 套用所有 manifests
kubectl apply -f namespace.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f pvc.yaml
```

## 反向代理設定

### Nginx

```nginx
# /etc/nginx/sites-available/openclaw
server {
    listen 80;
    server_name openclaw.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name openclaw.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/openclaw.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/openclaw.your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 安全標頭
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # API 路由（如果獨立）
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Caddy

```
# Caddyfile
openclaw.your-domain.com {
    # 自動 HTTPS（Let's Encrypt）
    reverse_proxy localhost:3000 {
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-Proto {scheme}

        # WebSocket 支援
        transport http {
            versions 1.1 2
        }
    }

    # API 路由
    handle_path /api/* {
        reverse_proxy localhost:8080
    }

    # 安全標頭
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        -Server
    }

    # 上傳大小限制
    request_body {
        max_size 100MB
    }
}
```

### Traefik

```yaml
# traefik-docker-compose.yml
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@your-domain.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt

  openclaw:
    image: ghcr.io/openclaw/openclaw:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.openclaw.rule=Host(`openclaw.your-domain.com`)"
      - "traefik.http.routers.openclaw.entrypoints=websecure"
      - "traefik.http.routers.openclaw.tls.certresolver=letsencrypt"
      - "traefik.http.services.openclaw.loadbalancer.server.port=3000"
      # HTTP -> HTTPS 重導向
      - "traefik.http.routers.openclaw-http.rule=Host(`openclaw.your-domain.com`)"
      - "traefik.http.routers.openclaw-http.entrypoints=web"
      - "traefik.http.routers.openclaw-http.middlewares=redirect-to-https"
      - "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https"

volumes:
  letsencrypt:
```

## TLS/SSL 設定

### Let's Encrypt（Certbot）

```bash
# 安裝 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 取得憑證
sudo certbot --nginx -d openclaw.your-domain.com --non-interactive --agree-tos -m admin@your-domain.com

# 自動續約（crontab）
echo "0 3 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'" | sudo crontab -
```

### 自簽憑證（開發環境）

```bash
# 使用 mkcert 產生本機可信任的憑證
brew install mkcert  # macOS
mkcert -install
mkcert openclaw.local "*.openclaw.local" localhost 127.0.0.1

# 產生的檔案：
# openclaw.local+3.pem（憑證）
# openclaw.local+3-key.pem（私鑰）
```

## 網域與 DNS 設定

### DNS 記錄設定範例

| 類型 | 名稱 | 值 | TTL |
|------|------|-----|-----|
| A | `openclaw` | `203.0.113.50` | 300 |
| AAAA | `openclaw` | `2001:db8::1` | 300 |
| CNAME | `www.openclaw` | `openclaw.your-domain.com` | 3600 |
| TXT | `_dmarc.openclaw` | `v=DMARC1; p=reject` | 3600 |

### CloudFlare 設定

```bash
# 使用 CloudFlare API 設定 DNS
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "openclaw",
    "content": "203.0.113.50",
    "ttl": 300,
    "proxied": true
  }'
```

:::info CloudFlare 代理模式
啟用 CloudFlare Proxy（橘色雲朵）可獲得 DDoS 防護和 CDN 加速。但請注意 WebSocket 連線需要在 CloudFlare 中啟用。
:::

## 自動擴展策略

### Kubernetes HPA

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: openclaw-hpa
  namespace: openclaw
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: openclaw
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 120
```

### AWS Auto Scaling Group

```bash
# 建立啟動範本
aws ec2 create-launch-template \
  --launch-template-name openclaw-lt \
  --launch-template-data '{
    "ImageId": "ami-xxxxxxxx",
    "InstanceType": "t3.large",
    "UserData": "'$(base64 -w0 cloud-init.yml)'"
  }'

# 建立 Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name openclaw-asg \
  --launch-template LaunchTemplateName=openclaw-lt,Version='$Latest' \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 3 \
  --vpc-zone-identifier "subnet-xxx,subnet-yyy" \
  --target-group-arns "arn:aws:elasticloadbalancing:..." \
  --health-check-type ELB \
  --health-check-grace-period 300
```

## 監控與告警

### Prometheus + Grafana

```yaml
# monitoring-docker-compose.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.retention.time=30d"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_INSTALL_PLUGINS=grafana-clock-panel

  node-exporter:
    image: prom/node-exporter:latest
    pid: host
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"

volumes:
  prometheus-data:
  grafana-data:
```

### Prometheus 設定

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  - job_name: "openclaw"
    static_configs:
      - targets: ["openclaw:3000"]
    metrics_path: /metrics

  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]

  - job_name: "postgres"
    static_configs:
      - targets: ["postgres-exporter:9187"]

  - job_name: "redis"
    static_configs:
      - targets: ["redis-exporter:9121"]
```

### 告警規則

```yaml
# alerts.yml
groups:
  - name: openclaw
    rules:
      - alert: OpenClawDown
        expr: up{job="openclaw"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "OpenClaw 服務已停止"
          description: "OpenClaw 在過去 2 分鐘無回應"

      - alert: HighCPUUsage
        expr: rate(process_cpu_seconds_total{job="openclaw"}[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "CPU 使用率過高"
          description: "OpenClaw CPU 使用率超過 80% 已持續 5 分鐘"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes{job="openclaw"} / 1024 / 1024 / 1024 > 3.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "記憶體使用量過高"
          description: "OpenClaw 記憶體使用量超過 3.5 GB"

      - alert: DiskSpaceLow
        expr: node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "磁碟空間不足"
          description: "根分割區剩餘空間低於 10%"
```

## CI/CD 持續部署

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy OpenClaw

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: 登入容器倉庫
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: 建置並推送映像
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: 部署至伺服器
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/openclaw
            docker compose pull
            docker compose up -d
            docker image prune -f

  deploy-k8s:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: 設定 kubectl
        uses: azure/setup-kubectl@v3

      - name: 設定 kubeconfig
        run: |
          mkdir -p $HOME/.kube
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config

      - name: 更新映像版本
        run: |
          kubectl set image deployment/openclaw \
            openclaw=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n openclaw

      - name: 等待部署完成
        run: |
          kubectl rollout status deployment/openclaw -n openclaw --timeout=300s
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

variables:
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG

deploy:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/openclaw openclaw=$IMAGE_TAG -n openclaw
    - kubectl rollout status deployment/openclaw -n openclaw
  only:
    - main
```

## 安全性最佳實踐

:::danger 生產環境安全檢查清單
部署至生產環境前，請確認以下項目：

1. **啟用身份驗證**：設定 `OPENCLAW_AUTH_ENABLED=true`
2. **使用 HTTPS**：永遠不要在公開網路上使用 HTTP
3. **限制 API 金鑰範圍**：使用最小權限原則
4. **設定防火牆**：僅開放必要的埠（80、443）
5. **定期更新**：保持映像和系統套件為最新版本
6. **監控異常**：設定告警通知
7. **備份策略**：每日自動備份，定期測試還原
8. **機密管理**：使用 Secrets Manager 管理敏感資訊
:::

## 下一步

- [Docker / Podman 部署指南](./docker-guide.md) — 本機和容器化部署的詳細設定
- 管理員手冊 — 使用者管理、權限控制、系統設定
- API 文件 — 整合與自動化
