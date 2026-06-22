# Polaris Studio - Enterprise Edition

基于 Nuxt 4 (Vue 3) + Spring Boot 3.4.4 的企业级 AI 创作平台，支持 RBAC 权限管理、项目协作、工作流引擎、资产管理、AI 供应商集成。

## 项目结构

```
E:\hb\
├── canvas/                    # 原 Next.js 项目（保持不动）
├── polaris-web/               # Nuxt 4 前端
│   ├── app/
│   │   ├── layouts/           # 布局（default, auth, workspace）
│   │   ├── pages/             # 19 个页面
│   │   ├── components/        # 24+ 组件
│   │   ├── stores/            # 5 个 Pinia store
│   │   ├── services/          # 7 个 API service
│   │   ├── composables/       # Vue composables
│   │   ├── utils/             # 工具函数
│   │   └── types/             # TypeScript 类型
│   ├── nuxt.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── polaris-server/            # Spring Boot 后端（12 个 Maven 模块）
│   ├── polaris-app/           # 启动入口模块（打包入口）
│   ├── polaris-common/        # 公共模块（R、ResultCode、异常处理）
│   ├── polaris-auth/          # 认证模块（JWT、Spring Security）
│   ├── polaris-user/          # 用户模块（User、Role、Permission）
│   ├── polaris-project/       # 项目模块
│   ├── polaris-workflow/      # 工作流引擎
│   ├── polaris-asset/         # 资产管理（MinIO）
│   ├── polaris-ai/            # AI 供应商集成
│   ├── polaris-credit/        # 点数系统
│   ├── polaris-admin/         # 管理后台
│   ├── polaris-notification/  # 通知系统
│   └── polaris-gateway/       # 预留网关
└── README.md
```

## 环境要求

| 工具 | 版本 | 安装位置 |
|------|------|----------|
| Node.js | v22+ | 系统 PATH |
| npm | 10+ | 随 Node.js |
| JDK | 17.0.19 (Temurin) | `C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot` |
| Maven | 3.9.16 | `C:\tools\maven` |
| Docker Desktop | 最新 | `C:\Program Files\Docker\Docker\Docker Desktop.exe` |
| PowerShell | 5.1+ | 系统自带 |

## 基础设施（Docker）

```bash
cd E:\hb\polaris-server
docker compose up -d
```

| 服务 | 端口 | 用户名 | 密码 |
|------|------|--------|------|
| MySQL 8.0 | 3306 | polaris | polaris123 |
| MySQL root | 3306 | root | root123 |
| Redis 7 | 6379 | - | - |
| MinIO | 9000 / 9001 | minioadmin | minioadmin123 |
| RabbitMQ | 5672 / 15672 | polaris | polaris123 |

数据库：`polaris`，自动通过 `init.sql` 初始化 16 张表 + 种子数据。

## 启动方式

### 后端
```bash
cd E:\hb\polaris-server
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
mvn spring-boot:run -pl polaris-app
# 或直接
& "$env:JAVA_HOME\bin\java.exe" -jar polaris-app\target\polaris-app-1.0.0.jar
```
启动后访问 `http://localhost:8080`

### 前端
```bash
cd E:\hb\polaris-web
npx nuxi dev --port 3090
```
启动后访问 `http://localhost:3090`

## 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 超级管理员（SUPER_ADMIN） |

## 配置说明

### application.yml 关键配置
```yaml
# 数据源
spring.datasource.url: jdbc:mysql://localhost:3306/polaris?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
spring.datasource.username: polaris
spring.datasource.password: polaris123

# MinIO
minio.endpoint: http://localhost:9000
minio.access-key: minioadmin
minio.secret-key: minioadmin123
minio.bucket: polaris-assets

# JWT
polaris.jwt.secret: YTkzN2JjZjE0YzU4ZTY3YjI5MDFjZDJjM2Y4YzE1YjY=   # Base64 编码的 256 位密钥
polaris.jwt.expiration: 86400000    # 24 小时（毫秒）
```

## 后端 API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 登录 |
| `/api/auth/register` | POST | 注册 |
| `/api/auth/refresh` | POST | 刷新 Token |
| `/api/auth/me` | GET | 当前用户信息 |
| `/api/auth/logout` | POST | 登出 |
| `/api/admin/health` | GET | 健康检查（需认证） |
| `/api/credit/health` | GET | 健康检查 |
| `/api/notification/health` | GET | 健康检查 |

## 编译

```bash
# 后端全量编译
cd E:\hb\polaris-server
mvn install -DskipTests

# 前端编译
cd E:\hb\polaris-web
npx nuxt build
```

## 当前已知问题

### 1. 登录返回 500 错误
- **现象**：`POST /api/auth/login` 返回 `{"code":500, "message":"服务器内部错误"}`
- **可能原因**：
  - `JwtUtils` 中 `@Value("${polaris.jwt.secret}")` 与 yaml 配置层级不匹配
  - `UserRoleMapper` 或 `RoleMapper` 未正确注入（MyBatis-Plus 代理创建失败）
  - `passwordEncoder.matches()` 调用时 `user.getPassword()` 返回 null
- **已尝试的修复**：
  - 在 `AuthService` 中移除了 `AuthenticationManager`，改为手动 `passwordEncoder.matches()` 验证
  - 添加了 `@Mapper` 注解到所有 Mapper 接口
  - 修复了所有 Entity 的 `@TableName`（`sys_*` → 无前缀）
  - 修改了 `JwtUtils` 的 `@Value` key 以匹配 yaml 配置

### 2. 中文编码问题
- 控制台输出的中文日志可能显示为乱码
- 需要确保 PowerShell 终端编码为 UTF-8

### 3. 前端需要配置 API 代理
- 需要在 `nuxt.config.ts` 中添加 `/api/` 代理到 `http://localhost:8080`

### 4. Spring Security 配置
- `SecurityConfig` 中的 `AuthenticationManager` 使用 `DaoAuthenticationProvider` 显式配置
- 前端请求需要带 `Authorization: Bearer <token>` 头访问受保护端点

### 5. Docker MySQL 初始化问题
- `read` 是 MySQL 保留字，在 `notification` 表中已改为 `is_read`
- `init.sql` 需要严格的 UTF-8 编码，否则中文注释会导致导入失败

### 6. 前端 CSS 缺失（页面纯文字排列）
- **原因**：`tailwind.config.ts` 中 `content` 路径未包含 `*.vue` 文件，导致 Tailwind 生产构建未扫描 Vue 模板中的工具类
- **修复**：`content: ["./app/**/*.{vue,ts,tsx}"]` 添加了 `.vue` 扩展名
- **解决方法**：删除 `.nuxt/` 缓存目录后重新 `npx nuxt build`（已修复）

### 7. 后端启动端口冲突
- 多次启动时旧进程未释放，报 `Web server failed to start. Port 8080 was already in use`
- **修复**：`Get-NetTCPConnection -LocalPort 8080 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force`

### 8. Entity 表名不匹配
- `Role`、`UserRole`、`Permission`、`RolePermission` 等 Entity 的 `@TableName` 使用了 `sys_*` 前缀，但数据库中表名无前缀
- **修复**：已全部改为无前缀（`role`、`user_role`、`permission`、`role_permission`）

## 数据库表结构（16 张表）

user, role, user_role, permission, role_permission, project, canvas_object,
workflow, workflow_node, workflow_edge, asset, credit_account, credit_log,
ai_provider_config, notification, system_log

## 常见操作

```bash
# 查看 Docker 容器状态
docker ps

# 查看 MySQL 日志
docker logs polaris-mysql

# 手动执行 SQL
docker exec -i polaris-mysql mysql -u polaris -ppolaris123 polaris < init.sql

# 查询数据
docker exec polaris-mysql mysql -u polaris -ppolaris123 polaris -e "SELECT * FROM user;"

# 后端日志跟踪
& "$env:JAVA_HOME\bin\java.exe" -jar polaris-app\target\polaris-app-1.0.0.jar

# 前端预览（生产构建后）
node .output/server/index.mjs
```
