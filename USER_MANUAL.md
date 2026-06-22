# Polaris Studio 用户说明书

企业级 AI 创作平台 —— 集成项目管理、工作流引擎、AI 生成、资产管理、RBAC 权限控制。

---

## 快速启动

### 1. 启动基础设施（Docker）

```bash
cd E:\hb\polaris-server
docker compose up -d
```

### 2. 启动后端

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
& "$env:JAVA_HOME\bin\java.exe" -jar E:\hb\polaris-server\polaris-app\target\polaris-app-1.0.0.jar
```

后端运行于 `http://localhost:8080`

### 3. 启动前端

```bash
cd E:\hb\polaris-web
npx nuxi build
node .output\server\index.mjs
```

前端访问地址：`http://localhost:3000`

---

## 所有账号密码一览

### 平台账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| `admin` | `admin123` | SUPER_ADMIN（超级管理员） | 预置管理员，拥有所有权限 |

> 普通用户可访问 `/register` 自行注册，或由管理员在数据库 `user` 表创建。

### 基础设施账号

| 服务 | 访问地址 | 用户名 | 密码 | 说明 |
|------|----------|--------|------|------|
| **MySQL** | localhost:3306 | `polaris` | `polaris123` | 应用数据库（库名：polaris） |
| **MySQL (root)** | localhost:3306 | `root` | `root123` | 数据库超级管理员 |
| **Redis** | localhost:6379 | - | 无密码 | 缓存 / Session |
| **MinIO (API)** | localhost:9000 | `minioadmin` | `minioadmin123` | 文件存储（Bucket: polaris-assets） |
| **MinIO (控制台)** | http://localhost:9001 | `minioadmin` | `minioadmin123` | Web 管理界面 |
| **RabbitMQ (AMQP)** | localhost:5672 | `polaris` | `polaris123` | 消息队列 |
| **RabbitMQ (管理)** | http://localhost:15672 | `guest` | `guest` | Web 管理界面 |

---

## 功能模块与使用说明

### 1. 登录 / 注册

- **登录页**：`http://localhost:3000/login`
  - 输入用户名和密码，点击"登录"
  - 默认管理员：`admin` / `admin123`
- **注册页**：`http://localhost:3000/register`
  - 填写用户名、密码、邮箱即可注册新账号
  - 新注册用户默认为普通用户（USER）角色

### 2. 首页

`http://localhost:3000/`

- 展示平台概览、快捷入口
- 已登录用户显示当前项目动态

### 3. 工作区（Studio）

`http://localhost:3000/studio`

- 核心创作页面，基于 Canvas 的画布编辑器
- 支持拖拽式组件编排
- 需要先创建项目后进入

### 4. 项目管理

`http://localhost:3000/projects`

- **项目列表**：展示所有项目，支持搜索和筛选
- **创建项目**：点击"新建项目"，填写名称、描述、模式
- **项目详情**：`/projects/{id}` — 查看单个项目的画布内容、设置
- **复制 / 删除**：项目卡片上的操作按钮

### 5. 点数系统

`http://localhost:3000/credits`

- 查看当前点数余额
- 消耗记录日志
- 管理员可手动调整用户点数（管理后台）

### 6. 账号设置

`http://localhost:3000/settings`

- 修改密码（旧密码 → 新密码 → 确认新密码）
- 个人资料编辑（头像、昵称、邮箱）
- 通知偏好设置

### 7. 资产管理

`http://localhost:3000/assets`

- 上传和管理媒体文件（图片、视频、音频等）
- 文件存储在 MinIO 对象存储中
- 支持按类型筛选、收藏标记

### 8. 管理后台

`http://localhost:3000/admin/dashboard`

需要 SUPER_ADMIN 或 ADMIN 角色才能访问。

| 页面 | 路径 | 功能 |
|------|------|------|
| **仪表盘** | `/admin/dashboard` | 平台统计概览（用户数、项目数、存储用量） |
| **用户管理** | `/admin/users` | 用户列表、启用/禁用、角色分配 |
| **项目管理** | `/admin/projects` | 全局项目列表、删除、审核 |
| **模板管理** | `/admin/templates` | 公共模板发布与下架 |
| **供应商管理** | `/admin/providers` | AI 供应商配置（OpenAI、Stability AI 等） |
| **系统设置** | `/admin/settings` | 全局系统参数配置 |
| **操作日志** | `/admin/logs` | 系统操作日志审计 |

---

## API 接口

所有 API 基地址：`http://localhost:8080/api`

| 端点 | 方法 | 说明 | 需要认证 |
|------|------|------|----------|
| `/auth/login` | POST | 登录获取 Token | 否 |
| `/auth/register` | POST | 注册新用户 | 否 |
| `/auth/refresh` | POST | 刷新 Token | 否 |
| `/auth/me` | GET | 获取当前用户信息 | 是 |
| `/auth/logout` | POST | 登出 | 是 |
| `/projects` | GET | 我的项目列表 | 是 |
| `/projects` | POST | 创建项目 | 是 |
| `/projects/{id}` | GET | 项目详情 | 是 |
| `/projects/public` | GET | 公开项目 | 否 |
| `/admin/health` | GET | 健康检查 | 是 |

认证方式：请求头 `Authorization: Bearer <token>`

---

## 常见问题

### Q: 页面打开是空白或 500 错误？
A: 确保后端已启动：检查 `http://localhost:8080/api/auth/login` 是否能访问。

### Q: 登录提示"服务器内部错误"？
A: 后端可能未正确连接数据库。检查 Docker 容器是否运行：
```bash
docker ps
```

### Q: 端口被占用？
A: 如果 8080 或 3000 端口被占用：
```powershell
# 杀掉占用端口的进程
Get-NetTCPConnection -LocalPort 8080 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force
```

### Q: 数据库需要重置？
A: 重新导入初始化脚本（会清空数据）：
```bash
cd E:\hb\polaris-server
docker exec -i polaris-mysql mysql -upolaris -ppolaris123 polaris < init.sql
```

### Q: 中文显示乱码？
A: 确保 PowerShell 终端编码为 UTF-8：
```powershell
chcp 65001
```

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Nuxt 4 + Vue 3 Composition API |
| 样式 | Tailwind CSS v3 + 暗色主题 |
| 状态管理 | Pinia |
| 后端框架 | Spring Boot 3.4.4 |
| ORM | MyBatis-Plus |
| 安全 | Spring Security + JWT |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis 7 |
| 文件存储 | MinIO |
| 消息队列 | RabbitMQ 3 |
| AI 集成 | OpenAI / Stability AI / 自定义供应商 |
