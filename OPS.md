# Polaris Studio 部署运维手册

## 目录

1. [项目概述](#1-项目概述)
2. [环境要求](#2-环境要求)
3. [基础设施部署](#3-基础设施部署)
4. [后端部署](#4-后端部署)
5. [前端部署](#5-前端部署)
6. [生产配置](#6-生产配置)
7. [启动与停止](#7-启动与停止)
8. [日志与排障](#8-日志与排障)

---

## 1. 项目概述

| 组件 | 技术栈 | 默认端口 |
|------|--------|---------|
| 后端 | Java 17 + Spring Boot 3.4.4 | 8080 |
| 前端 | Nuxt 4 + Vue 3 | 3000 |
| 数据库 | MySQL 8.0 | 3306 |
| 缓存 | Redis 7 | 6379 |
| 对象存储 | MinIO | 9000 |
| 消息队列 | RabbitMQ 3 | 5672 |
| 网关 | Spring Cloud Gateway（可选） | — |

**项目结构：**

```
E:\hb\
├── polaris-server/        # 后端多模块项目
│   ├── polaris-app/       # Spring Boot 启动入口
│   ├── polaris-common/    # 公共组件
│   ├── polaris-auth/      # 认证授权
│   ├── polaris-user/      # 用户模块
│   ├── polaris-project/   # 项目管理
│   ├── polaris-workflow/  # 工作流引擎
│   ├── polaris-asset/     # 素材管理
│   ├── polaris-ai/        # AI 生成
│   ├── polaris-credit/    # 积分系统
│   ├── polaris-admin/     # 管理后台
│   └── polaris-notification/  # 通知
├── polaris-web/           # 前端 Nuxt 项目
└── tmp_docs/              # 临时文档
```

---

## 2. 环境要求

### 2.1 基础软件

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| JDK | 17 (Temurin 推荐) | 后端运行环境 |
| Maven | 3.9.x | 后端构建 |
| Node.js | >= 22 | 前端构建与运行 |
| npm | 随 Node.js | 前端依赖管理 |
| Docker + Docker Compose | 最新稳定版 | 基础设施容器化 |

### 2.2 环境变量

**后端：**
- `JAVA_HOME` — JDK 17 安装路径

**前端（运行时）：**
- `NUXT_PUBLIC_API_BASE` — 后端 API 地址，默认 `http://localhost:8080`

> 前后端均不使用 `.env` 文件，配置通过 `application.yml` / `nuxt.config.ts` / 环境变量管理。

---

## 3. 基础设施部署

所有基础设施通过 Docker Compose 管理，位于 `E:\hb\polaris-server\docker-compose.yml`。

### 3.1 启动服务

```bash
cd E:\hb\polaris-server
docker-compose up -d
```

启动后验证：

```bash
docker ps
# 应看到 4 个容器：polaris-mysql, polaris-redis, polaris-minio, polaris-rabbitmq
```

### 3.2 服务详情

| 服务 | 内部端口 | 映射端口 | 默认凭据 |
|------|---------|---------|---------|
| MySQL | 3306 | 3306 | `polaris` / `polaris123` |
| Redis | 6379 | 6379 | 无需认证 |
| MinIO | 9000 (API), 9001 (控制台) | 9000, 9001 | `minioadmin` / `minioadmin123` |
| RabbitMQ | 5672 (AMQP), 15672 (管理) | 5672, 15672 | `polaris` / `polaris123` |

### 3.3 数据库初始化

Docker Compose 启动时自动执行 `E:\hb\polaris-server\init.sql`，完成建库建表和种子数据（默认管理员账号、角色、积分）。

### 3.4 停止服务

```bash
cd E:\hb\polaris-server
docker-compose down
# 加 -v 会删除数据卷（数据丢失！）
docker-compose down -v
```

### 3.5 数据持久化

数据卷在 `docker-compose.yml` 中定义：
- `mysql_data` — MySQL 数据文件
- `minio_data` — MinIO 对象存储文件

---

## 4. 后端部署

### 4.1 构建

```bash
cd E:\hb\polaris-server
mvn clean install -pl polaris-app -am -DskipTests
```

构建产物：
- 可执行 JAR：`polaris-app/target/polaris-app-1.0.0.jar`（约 90 MB）
- 原始 JAR：`polaris-app/target/polaris-app-1.0.0.jar.original`

> **注意**：`mvn install` 必须带 `-am`（also make），确保所有依赖模块先安装到本地 `.m2` 仓库。仅 `mvn compile` 或 `mvn package` 会导致运行时类找不到。

### 4.2 配置

主配置：`polaris-app/src/main/resources/application.yml`

需要根据生产环境修改的配置项：

```yaml
spring:
  datasource:
    url: jdbc:mysql://<DB_HOST>:3306/polaris?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: <DB_USER>
    password: <DB_PASS>
  data:
    redis:
      host: <REDIS_HOST>
      port: 6379
    rabbitmq:
      host: <MQ_HOST>
      port: 5672
      username: <MQ_USER>
      password: <MQ_PASS>

minio:
  endpoint: http://<MINIO_HOST>:9000
  access-key: <MINIO_ACCESS_KEY>
  secret-key: <MINIO_SECRET_KEY>

polaris:
  jwt:
    secret: <BASE64_ENCODED_SECRET>   # 生产环境务必修改！
```

有两种配置方式：

**方式 A（推荐）：直接修改 application.yml 后重新构建 JAR。**

**方式 B（外置配置）：** Spring Boot 支持外置配置文件优先级高于内置，在 JAR 同目录下创建 `config/application.yml` 或通过 `--spring.config.additional-location` 指定：

```bash
java -jar polaris-app-1.0.0.jar \
  --spring.config.additional-location=file:./config/application.yml
```

### 4.3 运行

```bash
java -jar polaris-app-1.0.0.jar
```

带参数运行：

```bash
java -jar polaris-app-1.0.0.jar \
  --server.port=8080 \
  --spring.profiles.active=prod
```

> **注意**：当前项目没有 `application-prod.yml`，如需生产配置请创建，或直接修改 `application.yml`。

### 4.4 自启动（Windows）

创建 `start-backend.bat`：

```batch
@echo off
cd /d E:\hb\polaris-server
java -jar polaris-app\target\polaris-app-1.0.0.jar > backend.log 2>&1
```

可使用 Windows 任务计划程序或 `nssm` 注册为 Windows 服务。

---

## 5. 前端部署

### 5.1 安装依赖

```bash
cd E:\hb\polaris-web
npm install
```

### 5.2 构建

```bash
npx nuxi build
```

构建产物在 `.output/` 目录：

```
.output/
├── public/          # 静态资源
├── server/          # Node.js SSR 服务端代码
└── server/index.mjs # 入口文件
```

### 5.3 配置 API 地址

通过环境变量 `NUXT_PUBLIC_API_BASE` 指定后端地址：

**Windows CMD：**
```cmd
set NUXT_PUBLIC_API_BASE=http://your-server-ip:8080
node .output/server/index.mjs
```

**PowerShell：**
```powershell
$env:NUXT_PUBLIC_API_BASE="http://your-server-ip:8080"
node .output/server/index.mjs
```

**Linux/macOS：**
```bash
NUXT_PUBLIC_API_BASE=http://your-server-ip:8080 node .output/server/index.mjs
```

或构建时传入（会编译到产物中）：

```bash
NUXT_PUBLIC_API_BASE=http://your-server-ip:8080 npx nuxi build
```

### 5.4 运行

```bash
cd E:\hb\polaris-web
set NUXT_PUBLIC_API_BASE=http://localhost:8080
node .output/server/index.mjs
```

服务默认监听 `0.0.0.0:3000`。

### 5.5 自启动（Windows）

创建 `start-frontend.bat`：

```batch
@echo off
cd /d E:\hb\polaris-web
set NUXT_PUBLIC_API_BASE=http://localhost:8080
node .output/server/index.mjs > frontend.log 2>&1
```

### 5.6 自启动（Linux systemd）

创建 `/etc/systemd/system/polaris-web.service`：

```ini
[Unit]
Description=Polaris Web Frontend
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/polaris-web
Environment=NUXT_PUBLIC_API_BASE=http://localhost:8080
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## 6. 生产配置

### 6.1 JWT 密钥

`polaris.jwt.secret` 是一个 Base64 编码的密钥（至少 256 位），生产环境务必替换。生成新密钥：

```bash
# Linux/macOS
openssl rand -base64 32

# 或使用 Java
java -e "import java.util.Base64; import java.security.SecureRandom; byte[] key = new byte[32]; new SecureRandom().nextBytes(key); System.out.println(Base64.getEncoder().encodeToString(key));"
```

### 6.2 文件存储

当前支持两种存储方式：

| 模式 | 配置 `polaris.oss.type` | 说明 |
|------|------------------------|------|
| MinIO 对象存储 | `minio`（默认） | 需要 MinIO 服务，文件存对象存储桶 |
| 本地文件存储 | `local` | 文件存服务器本地，适用于小规模部署 |

切换到本地存储（dev 环境默认）：

```yaml
polaris:
  oss:
    type: local
```

### 6.3 API 文档

后端启动后访问：
- Swagger UI：`http://localhost:8080/swagger-ui.html`
- OpenAPI JSON：`http://localhost:8080/api-docs`

### 6.4 安全建议

1. **修改默认密码**：admin 用户默认密码的 bcrypt hash 在 `init.sql` 中，首次部署后立即通过管理后台修改
2. **修改 JWT 密钥**
3. **MinIO 生产部署**：使用独立 Access Key/Secret Key，配置 Bucket 访问策略
4. **HTTPS 代理**：前端建议通过 Nginx / Caddy 反向代理 + HTTPS
5. **RabbitMQ 认证**：生产环境修改默认凭据
6. **MySQL 安全**：限制数据库用户权限，仅授权应用所需的最小权限
7. **数据库密码加密**：使用 Jasypt 或 Vault 加密 `application.yml` 中的数据库密码

### 6.5 Nginx 反向代理示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 文件上传大小限制（与后端 multipart 配置一致）
        client_max_body_size 20M;
    }

    # 静态资源（用户上传文件）
    location /uploads/ {
        proxy_pass http://127.0.0.1:8080/uploads/;
        proxy_cache_valid 200 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # 后端 Swagger 文档
    location /swagger-ui.html {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

---

## 7. 启动与停止

### 7.1 完整启动顺序

1. 启动基础设施（Docker）
2. 启动后端
3. 构建并启动前端

```bash
# 步骤 1：基础设施
cd E:\hb\polaris-server
docker-compose up -d

# 步骤 2：构建后端
mvn clean install -pl polaris-app -am -DskipTests

# 步骤 3：启动后端
java -jar polaris-app\target\polaris-app-1.0.0.jar &

# 步骤 4：构建前端
cd E:\hb\polaris-web
npx nuxi build

# 步骤 5：启动前端
set NUXT_PUBLIC_API_BASE=http://localhost:8080
node .output/server/index.mjs &
```

### 7.2 快速启动（已有构建产物）

```bash
# 确保 Docker 服务已启动
docker ps

# 后端
java -jar E:\hb\polaris-server\polaris-app\target\polaris-app-1.0.0.jar

# 前端（另一个终端）
set NUXT_PUBLIC_API_BASE=http://localhost:8080
node E:\hb\polaris-web\.output\server\index.mjs
```

### 7.3 停止

```bash
# 停前端
pkill -f "node .output/server/index.mjs"    # Linux
taskkill /F /IM node.exe                     # Windows（慎用，会杀掉所有 node 进程）

# 停后端
pkill -f "polaris-app-1.0.0.jar"            # Linux
taskkill /F /IM java.exe                     # Windows（慎用）

# 停基础设施
cd E:\hb\polaris-server
docker-compose down
```

---

## 8. 日志与排障

### 8.1 日志文件

| 组件 | 日志位置 |
|------|---------|
| 后端 | `polaris-server/polaris-server.log`（应用日志） |
| 后端 Maven | `polaris-server/backend-out.log`, `backend-err.log` |
| 前端 | 控制台 stdout |

后端日志滚动策略：最多保留 3 个历史文件，每个最大 10 MB。

### 8.2 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 后端 401 错误 | 未登录或 token 过期 | 重新登录获取新 token |
| 前端页面白屏/路由不匹配 | 前后端路由未同步 | 检查 nginx 配置或 `baseURL` |
| MinIO 上传失败 | MinIO 未启动或配置错误 | `docker ps` 确认 MinIO 运行；检查 `minio.*` 配置 |
| AI 生成失败：402 Insufficient Balance | DeepSeek API 余额不足 | 前往 https://platform.deepseek.com 充值 |
| 启动报错 `UnsatisfiedDependency` | 依赖模块未安装到 `.m2` | 执行 `mvn install -pl polaris-app -am -DskipTests` |
| 前端连接后端失败 | API 地址配置错误 | 检查 `NUXT_PUBLIC_API_BASE` 环境变量 |
| H2 数据库（dev 模式）数据丢失 | H2 文件损坏或删除 | 删除 `./data/` 目录后重启可重建 |

### 8.3 健康检查

```bash
# 后端健康
curl http://localhost:8080/actuator/health

# 前端可达性
curl http://localhost:3000

# Docker 服务状态
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## 附录

### A. 开发环境构建命令速查

```bash
# 后端构建（增量）
mvn install -pl polaris-app -am -DskipTests

# 后端构建（全量清理）
mvn clean install -pl polaris-app -am -DskipTests

# 后端运行（开发方式，实时编译）
mvn spring-boot:run -pl polaris-app

# 前端构建
npx nuxi build

# 前端开发服务器（不用于生产）
npm run dev
```

### B. 默认管理员账号

| 用户名 | 密码（hash） | 角色 |
|--------|-------------|------|
| admin | bcrypt hash（init.sql 中） | SUPER_ADMIN |

首次部署后请立即通过管理后台修改密码。
