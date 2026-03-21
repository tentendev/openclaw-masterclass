---
title: 설치 가이드
description: macOS, Linux, Windows WSL2에서 OpenClaw를 설치하는 완전한 단계별 가이드. 시스템 요구 사항, 보안 설정, Podman 권장 사항 포함.
sidebar_position: 1
---

# 설치 가이드

이 문서에서는 OpenClaw를 처음부터 설치하는 방법을 안내합니다. 전체 과정은 약 10-15분 소요됩니다.

---

## 시스템 요구 사항

설치 전 시스템이 다음 최소 요구 사항을 충족하는지 확인하세요:

| 항목 | 최소 요구 사항 | 권장 사양 |
|------|-------------|---------|
| **운영 체제** | macOS 13+, Ubuntu 22.04+, Windows 11 (WSL2) | macOS 14+ 또는 Ubuntu 24.04 |
| **Node.js** | 22.16+ | **24.x (권장)** |
| **메모리** | 4 GB | 8 GB 이상 |
| **디스크 공간** | 2 GB | 5 GB (스킬 캐시 포함) |
| **컨테이너 엔진** | Docker 24+ 또는 Podman 5+ | **Podman 5+ (권장)** |

:::warning Node.js 버전이 중요합니다
OpenClaw는 Node.js 22.16에 도입된 새로운 기능을 광범위하게 사용합니다. 이전 버전을 사용하면 예상치 못한 오류가 발생합니다. Node.js 24.x 사용을 강력히 권장합니다.
:::

---

## Node.js 설치

적합한 버전의 Node.js가 아직 설치되지 않았다면 **nvm**(Node Version Manager) 사용을 권장합니다:

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 셸 설정 다시 로드
source ~/.bashrc  # 또는 source ~/.zshrc

# Node.js 24 설치
nvm install 24
nvm use 24

# 버전 확인
node --version
# v24.x.x가 표시되어야 합니다
```

---

## macOS 설치 방법

### 방법 1: Homebrew 사용 (권장)

```bash
# OpenClaw 설치
brew tap openclaw/tap
brew install openclaw

# 설치 확인
openclaw --version
```

### 방법 2: npm 사용

```bash
# 전역 설치
npm install -g @openclaw/cli

# 설치 확인
openclaw --version
```

### 방법 3: 소스 코드에서 빌드

```bash
# 저장소 복제
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 의존성 설치
npm install

# 빌드
npm run build

# 전역으로 링크
npm link

# 확인
openclaw --version
```

---

## Linux 설치 방법 (Ubuntu / Debian)

```bash
# 패키지 목록 업데이트
sudo apt update && sudo apt upgrade -y

# Node.js 24가 설치되어 있는지 확인 (위의 nvm 안내 참조)

# npm으로 설치
npm install -g @openclaw/cli

# 설치 확인
openclaw --version
```

### Arch Linux

```bash
# AUR에서 설치
yay -S openclaw
```

### Fedora / RHEL

```bash
# npm으로 설치
npm install -g @openclaw/cli
```

---

## Windows 설치 방법 (WSL2)

:::info Windows 사용자 주의사항
OpenClaw는 네이티브 Windows 환경을 **지원하지 않습니다**. WSL2(Windows Subsystem for Linux 2)를 사용하여 실행해야 합니다.
:::

```bash
# 1단계: WSL2 활성화 (PowerShell에서 관리자 권한으로 실행)
wsl --install -d Ubuntu-24.04

# 2단계: WSL2 환경 진입
wsl

# 3단계: Node.js 설치 (WSL2 Ubuntu 내에서)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 24

# 4단계: OpenClaw 설치
npm install -g @openclaw/cli

# 5단계: 확인
openclaw --version
```

---

## 컨테이너 엔진 설치

OpenClaw의 스킬 실행 계층은 샌드박스 환경을 제공하기 위해 컨테이너 엔진에 의존합니다. Docker 대신 **Podman 사용을 강력히 권장**합니다.

### 왜 Podman인가?

| 비교 항목 | Docker | Podman |
|---------|--------|--------|
| 루트 권한 | 기본적으로 root 필요 (daemon 모드) | **Rootless (root 불필요)** |
| 백그라운드 서비스 | dockerd daemon 필요 | daemon 없음 |
| 보안성 | 공격 표면이 넓음 | **공격 표면이 좁음** |
| 호환성 | Docker CLI | Docker CLI와 완전 호환 |

:::danger 보안 고려 사항
Docker daemon은 root 권한으로 실행됩니다. OpenClaw의 스킬 샌드박스가 돌파되면 공격자가 호스트의 root 권한을 획득할 수 있습니다. Podman의 rootless 모드는 이 위험을 크게 줄여줍니다.
:::

### Podman 설치

```bash
# macOS
brew install podman
podman machine init
podman machine start

# Ubuntu / Debian
sudo apt install -y podman

# Fedora
sudo dnf install -y podman
```

### Docker 설치 (여전히 Docker를 선택하는 경우)

```bash
# macOS
brew install --cask docker

# Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# 그룹 변경 적용을 위해 로그아웃 후 재로그인
```

---

## 첫 실행 및 확인

설치 완료 후 다음 명령어로 초기화합니다:

```bash
# OpenClaw 초기화 (설정 디렉토리 생성)
openclaw init

# 다음과 비슷한 출력을 볼 수 있습니다:
# 🦞 OpenClaw initialized!
# Config directory: ~/.openclaw/
# Gateway port: 18789
# Container engine: podman
```

모든 구성 요소가 정상인지 확인합니다:

```bash
# 헬스 체크 실행
openclaw doctor

# 예상 출력:
# ✓ Node.js v24.x.x
# ✓ Podman 5.x.x (rootless)
# ✓ Gateway port 18789 available
# ✓ Config directory ~/.openclaw/ exists
# ✓ Memory system initialized
# All checks passed!
```

---

## 보안 설정: 바인드 주소

이것은 설치 과정에서 **가장 중요한 보안 단계**입니다.

OpenClaw Gateway는 기본적으로 port 18789에서 수신합니다. 반드시 `127.0.0.1`(로컬)에만 바인딩하고, `0.0.0.0`(모든 네트워크 인터페이스)에는 **절대** 바인딩하지 마세요.

설정 파일을 확인하세요:

```bash
# Gateway 설정 확인
cat ~/.openclaw/gateway.yaml
```

`bind` 필드 값을 확인하세요:

```yaml
# ~/.openclaw/gateway.yaml

gateway:
  port: 18789
  # ✅ 올바름: 로컬만 바인딩
  bind: "127.0.0.1"

  # ❌ 잘못됨: Gateway가 전체 네트워크에 노출됩니다!
  # bind: "0.0.0.0"
```

:::danger 30,000+ 인스턴스가 해킹당한 교훈
CVE-2026-25253은 공격자가 노출된 18789 포트를 통해 원격 코드를 실행할 수 있게 합니다. `0.0.0.0`에 바인딩하여 30,000개 이상의 OpenClaw 인스턴스가 침해당했습니다. Gateway 포트를 공용 네트워크에 **절대** 노출하지 마세요.

원격 접근이 필요한 경우 SSH 터널 또는 VPN을 사용하세요:

```bash
# SSH 터널을 통해 원격 OpenClaw에 안전하게 접근
ssh -L 18789:127.0.0.1:18789 user@your-server
```
:::

---

## 방화벽 권장 사항

`127.0.0.1`에 올바르게 바인딩했더라도 추가 보호 계층은 항상 좋습니다:

```bash
# macOS — pf 사용
echo "block in proto tcp from any to any port 18789" | sudo pfctl -ef -

# Linux — ufw 사용
sudo ufw deny 18789/tcp

# Linux — iptables 사용
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP
sudo iptables -A INPUT -p tcp -s 127.0.0.1 --dport 18789 -j ACCEPT
```

---

## 디렉토리 구조

설치 후 OpenClaw는 다음과 같은 디렉토리 구조를 생성합니다:

```
~/.openclaw/
├── gateway.yaml          # Gateway 설정
├── soul.md               # AI 성격 설정 파일
├── providers/            # LLM 제공자 설정
│   └── default.yaml
├── channels/             # 메신저 플랫폼 연결 설정
├── skills/               # 설치된 스킬
│   └── .cache/           # 스킬 캐시
├── memory/               # 메모리 시스템 데이터
│   ├── wal/              # Write-Ahead Log
│   └── compacted/        # 압축된 장기 기억
└── logs/                 # 실행 로그
```

---

## 일반적인 설치 문제

### `npm install -g` 권한 부족

```bash
# sudo npm install -g를 사용하지 마세요!
# nvm으로 Node.js를 관리하면 권한 문제가 없습니다

# 또는 npm 전역 디렉토리를 변경
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Podman machine 시작 실패 (macOS)

```bash
# Podman machine 리셋
podman machine rm
podman machine init --cpus 2 --memory 4096
podman machine start
```

### WSL2 메모리 부족

Windows 사용자 디렉토리에 `.wslconfig`를 생성하세요:

```ini
# C:\Users\사용자이름\.wslconfig
[wsl2]
memory=8GB
swap=4GB
```

---

## 다음 단계

설치가 완료되었습니다! 다음은 [초기 설정](./first-setup.md)으로 이동하여 초기 구성을 완료하세요.
