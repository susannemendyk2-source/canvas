# Polaris Studio 部署运维手册

目标服务器：`47.107.147.186`  
推荐规格：阿里云 ECS 2 核 2G 40G  
推荐方案：`Nginx 静态前端 + Spring Boot JAR 后端 + Docker MySQL/Redis/MinIO`

## 1. 架构说明

| 组件 | 技术 | 生产端口 | 对外开放 |
| --- | --- | --- | --- |
| Web | Nuxt 4 静态构建 + Nginx | 80 | 是 |
| API | Spring Boot 3 / Java 17 | 8080 | 否，仅 Nginx 反代 |
| MySQL | Docker MySQL 8.0 | 3306 | 否，仅 127.0.0.1 |
| Redis | Docker Redis 7 | 6379 | 否，仅 127.0.0.1 |
| MinIO | Docker MinIO | 9000 / 9001 | 否，仅 127.0.0.1 |
| RabbitMQ | 暂不启用 | - | 否 |

2G 内存机器不建议再常驻 Nuxt Node SSR 和 RabbitMQ。当前前端改为静态构建，后端生产配置已禁用 RabbitMQ 自动配置。

## 2. 本地开发

### 2.1 启动基础服务

```bash
cd E:/hb/polaris-server
docker compose up -d
```

启动后应看到：

```bash
docker ps
# polaris-mysql, polaris-redis, polaris-minio
```

### 2.2 启动后端

```bash
cd E:/hb/polaris-server
mvn spring-boot:run -pl polaris-app
```

本地后端地址：`http://localhost:8080`

### 2.3 启动前端

```bash
cd E:/hb/polaris-web
npm run dev
```

前端默认逻辑：

- 本地访问 `localhost` 或 `127.0.0.1` 时，自动请求 `http://localhost:8080`。
- 服务器访问 `http://47.107.147.186` 时，自动走同域 `/api/`，由 Nginx 反代到后端。
- 如需覆盖，可设置 `NUXT_PUBLIC_API_BASE`。

## 3. 本地构建产物

### 3.1 后端构建

```bash
cd E:/hb/polaris-server
mvn clean install -pl polaris-app -am -DskipTests
```

产物：

```text
E:/hb/polaris-server/polaris-app/target/polaris-app-1.0.0.jar
```

### 3.2 前端静态构建

```bash
cd E:/hb/polaris-web
npm run generate
```

产物：

```text
E:/hb/polaris-web/.output/public
```

## 4. 服务器目录规划

```bash
/opt/polaris/
  backend/
    polaris-app-1.0.0.jar
    logs/
  frontend/
    index.html
    _nuxt/
  infra/
    docker-compose.yml
    init.sql
  logs/
```

## 5. 服务器首次准备

Ubuntu/Debian 示例：

```bash
sudo apt update
sudo apt install -y openjdk-17-jre nginx docker.io docker-compose-plugin
sudo systemctl enable --now docker nginx
sudo mkdir -p /opt/polaris/backend /opt/polaris/frontend /opt/polaris/infra /opt/polaris/logs
```

阿里云安全组只开放：

- `22` SSH
- `80` HTTP
- 后续有域名和证书后开放 `443`

不要开放 `8080`、`3306`、`6379`、`9000`、`9001`。

## 6. 上传文件

上传以下文件到服务器：

```text
polaris-server/polaris-app/target/polaris-app-1.0.0.jar -> /opt/polaris/backend/
polaris-web/.output/public/*                           -> /opt/polaris/frontend/
polaris-server/docker-compose.yml                      -> /opt/polaris/infra/
polaris-server/init.sql                                -> /opt/polaris/infra/
polaris-server/polaris-app/src/main/resources/nginx-polaris.conf -> /etc/nginx/sites-available/polaris
```

如果服务器是 CentOS/RHEL，Nginx 站点目录可能是 `/etc/nginx/conf.d/polaris.conf`。

## 7. 启动基础服务

```bash
cd /opt/polaris/infra
docker compose up -d
docker ps
```

当前 `docker-compose.yml` 已针对 2G 服务器做了轻量配置：

- MySQL buffer pool: `256M`
- MySQL max connections: `50`
- Redis maxmemory: `128mb`
- RabbitMQ 已移除

## 8. 后端 systemd

创建 `/etc/systemd/system/polaris-backend.service`：

```ini
[Unit]
Description=Polaris Studio Backend
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/polaris/backend
ExecStart=/usr/bin/java -Xms256m -Xmx700m -jar /opt/polaris/backend/polaris-app-1.0.0.jar --spring.profiles.active=prod
Restart=always
RestartSec=10
StandardOutput=append:/opt/polaris/logs/backend.log
StandardError=append:/opt/polaris/logs/backend.err

[Install]
WantedBy=multi-user.target
```

启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable polaris-backend
sudo systemctl restart polaris-backend
sudo systemctl status polaris-backend
```

## 9. Nginx

启用站点：

```bash
sudo ln -sf /etc/nginx/sites-available/polaris /etc/nginx/sites-enabled/polaris
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

访问：

```text
http://47.107.147.186
```

Nginx 配置说明：

- `/` 托管 `/opt/polaris/frontend` 静态文件。
- `/_nuxt/` 使用长期缓存。
- `/api/` 反代到 `127.0.0.1:8080`。
- `/api/auth/`、`/api/ai/` 有独立限流。
- `/minio/` 反代到 `127.0.0.1:9000`，用于公网访问上传素材。
- `/actuator/`、`/h2-console/` 禁止访问。

## 10. 生产配置检查

后端生产配置文件：

```text
polaris-server/polaris-app/src/main/resources/application-prod.yml
```

已调整：

- Hikari 连接池：`maximum-pool-size: 5`，适配 2G 内存。
- 禁用 RabbitMQ 自动配置。
- MinIO 内部地址使用 `http://localhost:9000`，公网素材地址使用 `http://47.107.147.186/minio`。
- 日志总量限制为 `100MB`。

必须在正式上线前处理：

1. 修改 MySQL、MinIO 默认密码。
2. 修改 `polaris.jwt.secret`，使用至少 32 字节随机 Base64。
3. 首次登录后修改默认管理员密码。
4. 有域名后配置 HTTPS。

生成 JWT secret：

```bash
openssl rand -base64 32
```

## 11. 常用命令

```bash
# 查看服务
sudo systemctl status polaris-backend
sudo systemctl status nginx
docker ps

# 查看日志
tail -f /opt/polaris/logs/backend.log
tail -f /opt/polaris/logs/backend.err
sudo journalctl -u polaris-backend -f

# 重启
sudo systemctl restart polaris-backend
sudo systemctl reload nginx

# 停止基础服务
cd /opt/polaris/infra
docker compose down
```

## 12. 健康检查

```bash
curl http://127.0.0.1:8080/api/credit/health
curl http://47.107.147.186
```

登录接口：

```bash
curl -X POST http://47.107.147.186/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 13. 常见问题

| 问题 | 原因 | 处理 |
| --- | --- | --- |
| 前端能打开但登录失败 | 后端未启动或 `/api/` 反代失败 | 看 `systemctl status polaris-backend` 和 `nginx -t` |
| 本地前端请求了服务器 | 设置过 `NUXT_PUBLIC_API_BASE` | 清掉环境变量或改回 `http://localhost:8080` |
| 服务器内存不足 | 运行了 Node SSR/RabbitMQ 或 JVM 太大 | 使用静态前端，确认 JVM `-Xmx700m` |
| 上传失败 | MinIO 未启动或账号不匹配 | `docker logs polaris-minio`，检查 `application-prod.yml` |
| 数据库连不上 | MySQL 容器未启动或初始化失败 | `docker logs polaris-mysql` |
