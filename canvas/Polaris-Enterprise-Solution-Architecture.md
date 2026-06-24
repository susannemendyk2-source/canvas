# Polaris Studio — 企业级前后端分离方案

> 基于 Polaris Studio (AI 图像/视频/节点工作流创作系统) 的完整企业级架构方案

---

## 一、项目现状摘要

当前项目为 Next.js 全栈单体应用 (App Router)：
- **前端（现）**：Next.js 15 + React 19 + TypeScript + TailwindCSS + Radix UI + Zustand + React Query + XYFlow
- **前端（目标）**：Nuxt 3 + Vue 3 + TypeScript + TailwindCSS + Naive UI + Pinia + Vue Query + Vue Flow
- **后端**：Next.js API Routes (单一 `/api/deepseek/chat` 接口) → 目标为 Spring Boot
- **状态管理**：Zustand → 目标为 Pinia (客户端状态 + 本地持久化)
- **数据层**：无数据库，所有数据存于 localStorage → 目标为 MySQL + Redis
- **AI 供应商对接层**：`lib/ai/providers/` 下有 8 个 Provider 抽象 (OpenAI, FAL, Replicate, ComfyUI, Kling, Veo, MiniMax, Mock)
- **身份认证**：无，完全无权限体系 → 目标为 JWT + Spring Security RBAC

---

## 二、目标架构总览

```
┌─────────────────────────────────────┐
│             Frontend                 │
│  (Nuxt 3 SPA / Universal)           │
│                                     │
│  Vue 3 + TypeScript + Vite          │
│  TailwindCSS + Naive UI + Motion    │
│  Vue Flow (工作流画布)              │
│  Pinia (客户端状态)                 │
│  Vue Query + Axios (服务端通信)     │
└──────────────┬──────────────────────┘
               │ HTTP (RESTful API)
               │ JWT Token
               ▼
┌──────────────────────────────────────┐
│         Backend (Spring Boot)         │
│                                      │
│  Spring Boot 3.x + JDK 17/21         │
│  Spring Security + JWT               │
│  Spring Data JPA + MyBatis-Plus      │
│  MySQL + Redis + MinIO (对象存储)    │
│  RabbitMQ / Kafka (异步任务)         │
└──────────────────────────────────────┘
```

---

## 三、后端技术栈 (Spring Boot)

### 3.1 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.4.x | 微服务基础框架 |
| JDK | 17/21 | Java 运行时 |
| Spring Security | 6.x | 认证与授权 |
| Spring Data JPA | 3.x | ORM |
| MyBatis-Plus | 3.5.x | 增强 ORM |
| **MySQL** | **8.0+** | **主关系数据库 (推荐)** |
| Redis | 7.x | 缓存 / Session / 令牌 |
| MinIO | 最新 | 对象存储 (资产文件) |
| RabbitMQ | 最新 | 异步 AI 任务队列 |
| SpringDoc OpenAPI | 2.x | API 文档 (Swagger) |
| MapStruct | 1.6.x | DTO 映射 |
| Redisson | 最新 | 分布式锁 |
| xxl-job / Quartz | 最新 | 定时任务 |

### 3.2 项目模块结构

```
polaris-server/
├── polaris-common/           # 公共模块
│   ├── src/main/java/.../
│   │   ├── constant/         # 常量定义
│   │   ├── enums/            # 枚举
│   │   ├── exception/        # 全局异常
│   │   ├── response/         # 统一响应体
│   │   ├── utils/            # 工具类
│   │   └── config/           # 公共配置
│   └── pom.xml
│
├── polaris-auth/             # 认证授权模块
│   ├── src/main/java/.../
│   │   ├── controller/       # AuthController
│   │   ├── service/          # JWT 服务
│   │   ├── security/         # Spring Security 配置
│   │   ├── dto/              # LoginDTO, RegisterDTO
│   │   └── filter/           # JwtFilter
│   └── pom.xml
│
├── polaris-user/             # 用户模块
│   ├── src/main/java/.../
│   │   ├── controller/       # UserController, AdminController
│   │   ├── entity/           # User, Role, Permission
│   │   ├── service/          # 用户服务
│   │   ├── dto/              # UserDTO
│   │   └── mapper/           # MyBatis Mapper
│   └── pom.xml
│
├── polaris-project/          # 项目模块
│   ├── controller/           # 星图/项目 CRUD
│   ├── entity/               # Project, CanvasObject
│   ├── service/
│   └── mapper/
│
├── polaris-asset/            # 资产素材模块
│   ├── controller/           # 文件上传/下载/管理
│   ├── entity/               # Asset
│   ├── service/              # MinIO 集成
│   └── mapper/
│
├── polaris-workflow/         # 工作流引擎模块
│   ├── controller/           # 工作流 CRUD + 执行
│   ├── entity/               # Workflow, WorkflowNode, WorkflowEdge
│   ├── service/              # 工作流解析/执行引擎
│   └── mapper/
│
├── polaris-ai/               # AI 供应商网关模块
│   ├── controller/           # AI 生成接口
│   ├── provider/             # 各供应商适配器
│   ├── strategy/             # 路由策略 (根据模型/余额)
│   ├── task/                 # 异步任务 (RabbitMQ)
│   └── service/
│
├── polaris-credit/           # 点数/计费模块
│   ├── controller/           # 点数管理
│   ├── entity/               # Credit, CreditLog
│   ├── service/
│   └── mapper/
│
├── polaris-template/         # 模板市场模块
│   ├── controller/           # 模板 CRUD
│   ├── entity/               # Template
│   └── service/
│
├── polaris-admin/            # 管理员后台模块
│   ├── controller/           # 管理后台接口
│   ├── service/              # 运营/统计/审核
│   └── config/
│
├── polaris-gateway/          # API 网关 (可选微服务)
│   └── src/main/java/.../
│       └── config/           # 路由/限流/鉴权
│
├── polaris-notification/     # 通知模块
│   └── ...
│
└── pom.xml                   # 父 POM
```

---

## 四、数据库设计

### 4.1 核心表结构

```sql
-- ============================================
-- 权限体系
-- ============================================

CREATE TABLE `sys_user` (
    `id`            BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `username`      VARCHAR(50)  NOT NULL UNIQUE,
    `password`      VARCHAR(255) NOT NULL,
    `nickname`      VARCHAR(50),
    `email`         VARCHAR(100) UNIQUE,
    `avatar`        VARCHAR(255),
    `phone`         VARCHAR(20),
    `status`        TINYINT      DEFAULT 1 COMMENT '1=启用 0=禁用',
    `type`          TINYINT      DEFAULT 0 COMMENT '0=普通用户 1=管理员 2=超级管理员',
    `credits`       INT          DEFAULT 0 COMMENT '星尘点数',
    `last_login_at` DATETIME,
    `created_at`    DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (`email`),
    INDEX idx_username (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sys_role` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `name`        VARCHAR(50)  NOT NULL UNIQUE COMMENT '角色名 (ADMIN/USER)',
    `code`        VARCHAR(50)  NOT NULL UNIQUE COMMENT '角色编码',
    `description` VARCHAR(255),
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sys_permission` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `name`        VARCHAR(50)  NOT NULL,
    `code`        VARCHAR(100) NOT NULL UNIQUE COMMENT '权限编码 (e.g. project:create)',
    `type`        TINYINT      DEFAULT 1 COMMENT '1=菜单 2=按钮 3=API',
    `parent_id`   BIGINT       DEFAULT 0,
    `path`        VARCHAR(255) COMMENT '前端路由',
    `api_path`    VARCHAR(255) COMMENT '后端接口路径',
    `method`      VARCHAR(10)  COMMENT '请求方法 GET/POST/PUT/DELETE',
    `sort`        INT          DEFAULT 0,
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sys_user_role` (
    `id`       BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id`  BIGINT NOT NULL,
    `role_id`  BIGINT NOT NULL,
    UNIQUE KEY uk_user_role (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sys_role_permission` (
    `id`            BIGINT PRIMARY KEY AUTO_INCREMENT,
    `role_id`       BIGINT NOT NULL,
    `permission_id` BIGINT NOT NULL,
    UNIQUE KEY uk_role_perm (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 业务表
-- ============================================

CREATE TABLE `project` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `user_id`     BIGINT       NOT NULL COMMENT '所属用户',
    `name`        VARCHAR(100) NOT NULL,
    `description` VARCHAR(500),
    `mode`        VARCHAR(20)  DEFAULT 'magic-canvas' COMMENT '模式',
    `cover`       VARCHAR(255) COMMENT '封面图',
    `is_template` TINYINT      DEFAULT 0 COMMENT '是否为模板',
    `is_public`   TINYINT      DEFAULT 0 COMMENT '是否公开',
    `status`      TINYINT      DEFAULT 1 COMMENT '1=草稿 2=进行中 3=已完成',
    `tags`        VARCHAR(255) COMMENT '标签 (JSON 数组)',
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (`user_id`),
    INDEX idx_is_public (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `canvas_object` (
    `id`         BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `project_id` BIGINT       NOT NULL,
    `type`       VARCHAR(20)  NOT NULL COMMENT 'prompt/image/video/text...',
    `title`      VARCHAR(200),
    `content`    TEXT,
    `position_x` DOUBLE       DEFAULT 0,
    `position_y` DOUBLE       DEFAULT 0,
    `width`      DOUBLE       DEFAULT 320,
    `height`     DOUBLE       DEFAULT 220,
    `meta`       JSON,
    `sort`       INT          DEFAULT 0,
    `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_project_id (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `workflow` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `project_id`  BIGINT       NOT NULL,
    `name`        VARCHAR(100) NOT NULL,
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_project_id (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `workflow_node` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `workflow_id` BIGINT       NOT NULL,
    `node_type`   VARCHAR(30)  NOT NULL COMMENT 'prompt/image-generate/image-to-video/output...',
    `label`       VARCHAR(100),
    `position_x`  DOUBLE       DEFAULT 0,
    `position_y`  DOUBLE       DEFAULT 0,
    `config`      JSON         COMMENT '节点配置(模型/参数)',
    `status`      VARCHAR(20)  DEFAULT 'idle',
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `workflow_edge` (
    `id`              BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `workflow_id`     BIGINT       NOT NULL,
    `source_node_id`  BIGINT       NOT NULL,
    `target_node_id`  BIGINT       NOT NULL,
    `source_handle`   VARCHAR(50),
    `target_handle`   VARCHAR(50),
    INDEX idx_workflow_id (`workflow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `asset` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `user_id`     BIGINT       NOT NULL,
    `project_id`  BIGINT       DEFAULT NULL,
    `type`        VARCHAR(20)  NOT NULL COMMENT 'image/video/audio',
    `title`       VARCHAR(200),
    `file_key`    VARCHAR(255) NOT NULL COMMENT 'MinIO 对象键',
    `url`         VARCHAR(500) NOT NULL COMMENT '访问 URL',
    `size`        BIGINT       DEFAULT 0 COMMENT '文件大小 (bytes)',
    `mime_type`   VARCHAR(50),
    `favorite`    TINYINT      DEFAULT 0,
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (`user_id`),
    INDEX idx_project_id (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `generation_task` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `user_id`     BIGINT       NOT NULL,
    `project_id`  BIGINT       DEFAULT NULL,
    `type`        VARCHAR(20)  NOT NULL COMMENT 'image/video/audio',
    `status`      VARCHAR(20)  DEFAULT 'queued' COMMENT 'queued/running/success/failed',
    `progress`    INT          DEFAULT 0,
    `prompt`      TEXT,
    `provider`    VARCHAR(50)  COMMENT 'AI 供应商',
    `model`       VARCHAR(100),
    `cost`        INT          DEFAULT 0 COMMENT '消耗点数',
    `result_url`  VARCHAR(500),
    `error_msg`   TEXT,
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (`user_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `credit_log` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `user_id`     BIGINT       NOT NULL,
    `amount`      INT          NOT NULL COMMENT '变动数量 (正=增加/负=消耗)',
    `balance`     INT          NOT NULL COMMENT '变动后余额',
    `type`        VARCHAR(30)  NOT NULL COMMENT 'consume/recharge/admin_grant',
    `ref_id`      BIGINT       DEFAULT NULL COMMENT '关联业务 ID',
    `remark`      VARCHAR(255),
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ai_provider_config` (
    `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    `user_id`     BIGINT       NOT NULL COMMENT '用户 ID (0=系统全局)',
    `provider`    VARCHAR(50)  NOT NULL COMMENT 'deepseek/runninghub/volcano...',
    `base_url`    VARCHAR(255),
    `api_key_enc` VARCHAR(500) NOT NULL COMMENT '加密后的 API Key',
    `model`       VARCHAR(100),
    `is_active`   TINYINT      DEFAULT 1,
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_provider (`user_id`, `provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 4.2 数据库选型建议

| 数据库 | 用途 | 推荐理由 |
|--------|------|----------|
| **MySQL 8.0+** ⭐ | **主业务数据库** | **首选。** 成熟稳定、生态丰富、JSON 字段支持良好（画布对象 meta、工作流节点 config 等半结构化数据可直接存 JSON），配合 MyBatis-Plus 开发效率高。适用于用户、项目、工作流、资产、计费等全部核心业务表。 |
| PostgreSQL 16+ | 备选主库 | 如果团队更熟悉 PG 或需要更高级的全文检索、GIS 或更强大的 JSON 查询能力，可替代 MySQL。 |
| Redis 7.x | 缓存 / 令牌 / 队列 | 必选。JWT 黑名单、SSE 连接管理、分布式锁 (Redisson)、热点数据缓存、接口限流计数器。 |
| 是否分库分表 | — | 初期单库即可。预估用户量 > 50 万或单表 > 500 万行时引入 ShardingSphere。 |

**最终结论：推荐 MySQL 8.0+ 作为主数据库**，原因是本项目的表结构以强关联关系为主（用户-项目-对象-工作流），MySQL 的 InnoDB 事务和外键约束配合 JPA/MyBatis-Plus 最为成熟，且国内云服务（阿里云 RDS、腾讯云 CDB）对 MySQL 支持最好，运维成本最低。

### 4.3 E-R 关系图

```
User ──1:N──> Project ──1:N──> CanvasObject
 │              │
 │              └──1:1──> Workflow ──1:N──> WorkflowNode
 │                                       └──1:N──> WorkflowEdge
 │
 ├──1:N──> Asset
 ├──1:N──> GenerationTask
 ├──1:N──> CreditLog
 ├──1:N──> AiProviderConfig
 ├──M:N──> Role ──M:N──> Permission
 └──1:N──> Notification
```

---

## 五、RESTful API 设计

### 5.1 认证模块 (`/api/auth`)

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | 公开 |
| POST | `/api/auth/login` | 用户登录 (返回 JWT) | 公开 |
| POST | `/api/auth/refresh` | 刷新 Token | 已认证 |
| POST | `/api/auth/logout` | 登出 | 已认证 |
| GET  | `/api/auth/me` | 获取当前用户信息 | 已认证 |

### 5.2 用户模块 (`/api/users`)

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET    | `/api/users/{id}` | 获取用户信息 | 本人/管理员 |
| PUT    | `/api/users/{id}` | 更新个人资料 | 本人/管理员 |
| PUT    | `/api/users/{id}/password` | 修改密码 | 本人 |
| POST   | `/api/users/{id}/avatar` | 上传头像 | 本人 |
| GET    | `/api/users/{id}/credits` | 获取点数明细 | 本人 |

### 5.3 项目模块 (`/api/projects`)

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET    | `/api/projects` | 获取项目列表 (分页) | 已认证 |
| POST   | `/api/projects` | 创建项目 | 已认证 |
| GET    | `/api/projects/{id}` | 获取项目详情 | 所有者/管理员 |
| PUT    | `/api/projects/{id}` | 更新项目 | 所有者/管理员 |
| DELETE | `/api/projects/{id}` | 删除项目 | 所有者/管理员 |
| POST   | `/api/projects/{id}/duplicate` | 复制项目 | 已认证 |
| GET    | `/api/projects/public` | 获取公开项目 | 公开 |

### 5.4 画布对象 (`/api/projects/{id}/objects`)

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET    | `/api/projects/{id}/objects` | 获取项目所有画布对象 | 所有者/管理员 |
| POST   | `/api/projects/{id}/objects` | 添加画布对象 | 所有者 |
| PUT    | `/api/projects/{id}/objects/{oid}` | 更新画布对象 | 所有者 |
| DELETE | `/api/projects/{id}/objects/{oid}` | 删除画布对象 | 所有者 |
| PUT    | `/api/projects/{id}/objects/batch` | 批量更新位置/排序 | 所有者 |

### 5.5 工作流 (`/api/projects/{id}/workflow`)

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET    | `/api/projects/{id}/workflow` | 获取工作流 | 所有者/管理员 |
| PUT    | `/api/projects/{id}/workflow` | 保存工作流 (全量) | 所有者 |
| POST   | `/api/projects/{id}/workflow/run` | 执行工作流 | 所有者 |
| GET    | `/api/projects/{id}/workflow/status` | 查询执行状态 (SSE) | 所有者 |

### 5.6 AI 生成 (`/api/ai`)

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| POST | `/api/ai/chat` | AI 对话 (DeepSeek) | 已认证 |
| POST | `/api/ai/image/generate` | 图像生成 | 已认证 |
| POST | `/api/ai/video/generate` | 视频生成 | 已认证 |
| POST | `/api/ai/image-to-video` | 图生视频 | 已认证 |
| POST | `/api/ai/prompt/enhance` | 提示词增强 | 已认证 |
| GET  | `/api/ai/tasks/{id}` | 查询异步任务状态 | 已认证 |

### 5.7 素材资产 (`/api/assets`)

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET    | `/api/assets` | 素材列表 (分页) | 已认证 |
| POST   | `/api/assets/upload` | 上传素材 (MinIO) | 已认证 |
| DELETE | `/api/assets/{id}` | 删除素材 | 所有者/管理员 |
| PUT    | `/api/assets/{id}/favorite` | 收藏/取消收藏 | 所有者 |

### 5.8 管理后台 (`/api/admin`)

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET    | `/api/admin/users` | 用户列表 (分页) | 管理员 |
| PUT    | `/api/admin/users/{id}/status` | 启用/禁用用户 | 管理员 |
| PUT    | `/api/admin/users/{id}/credits` | 调整用户点数 | 管理员/超级管理员 |
| PUT    | `/api/admin/users/{id}/role` | 分配角色 | 超级管理员 |
| GET    | `/api/admin/projects` | 全平台项目列表 | 管理员 |
| PUT    | `/api/admin/projects/{id}/status` | 审核/下架项目 | 管理员 |
| GET    | `/api/admin/stats/dashboard` | 运营仪表盘数据 | 管理员 |
| GET    | `/api/admin/stats/credits` | 点数消耗统计 | 管理员 |
| GET    | `/api/admin/assets` | 全平台素材审核 | 管理员 |
| POST   | `/api/admin/templates` | 发布官方模板 | 管理员 |
| PUT    | `/api/admin/ai-providers/global` | 配置全局 AI 供应商 | 超级管理员 |
| GET    | `/api/admin/logs` | 操作日志 | 管理员 |

---

## 六、权限体系设计 (RBAC)

### 6.1 角色定义

| 角色 | 编码 | 说明 |
|------|------|------|
| 超级管理员 | `SUPER_ADMIN` | 系统配置、全局供应商管理、所有权限 |
| 管理员 | `ADMIN` | 用户管理、内容审核、运营统计、模板发布 |
| 普通用户 | `USER` | 创作功能、个人项目管理、个人素材管理 |

### 6.2 权限粒度 (Perm Code)

```yaml
用户管理:
  - user:create      # 创建用户
  - user:read        # 查看用户
  - user:update      # 修改用户
  - user:delete      # 删除用户
  - user:credits     # 调整点数

项目管理:
  - project:create   # 创建项目
  - project:read     # 查看项目
  - project:update   # 修改项目
  - project:delete   # 删除项目
  - project:publish  # 发布为公开

AI 生成:
  - ai:chat          # AI 对话
  - ai:image         # 图像生成
  - ai:video         # 视频生成
  - ai:audio         # 音频生成

素材管理:
  - asset:upload     # 上传素材
  - asset:delete     # 删除素材

管理后台:
  - admin:dashboard  # 查看仪表盘
  - admin:users      # 管理用户
  - admin:projects   # 管理项目
  - admin:templates  # 管理模板
  - admin:providers  # 管理 AI 供应商
  - admin:stats      # 查看统计
  - admin:logs       # 查看日志
  - admin:settings   # 系统设置
```

### 6.3 数据权限

- **普通用户**: 只能操作自己的数据 (project, asset, credit 等)
- **管理员**: 可查看/管理所有用户数据，但不可删除
- **超级管理员**: 全权限，包括删除和系统配置

### 6.4 认证流程

```
Client                     Server
  │                          │
  ├── POST /api/auth/login ──┤
  │                          ├── 验证用户名密码
  │                          ├── 查询角色 + 权限
  │                          ├── 生成 JWT (含 user_id, roles)
  │                          ├── 存入 Redis (黑名单控制)
  │                          └── 返回 { access_token, refresh_token }
  │                          │
  ├── (后续请求) Authorization: Bearer <token> ──┤
  │                          ├── JwtFilter 解析 Token
  │                          ├── 从 Redis 验证有效性
  │                          ├── 设置 SecurityContext
  │                          ├── @PreAuthorize 校验权限
  │                          └── 处理业务
```

### 6.5 Spring Security 核心配置

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/projects/public").permitAll()
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) ->
                    res.sendError(401, "未授权"))
                .accessDeniedHandler((req, res, e) ->
                    res.sendError(403, "无权限"))
            );
        return http.build();
    }
}
```

---

## 七、前端技术栈与重构方案

### 7.1 推荐技术栈

| 技术 | 用途 | 替代自 |
|------|------|--------|
| **Nuxt 3** | 应用框架 (SSR/SPA 双模式) | Next.js 15 |
| **Vue 3 + Composition API** | UI 框架 | React 19 |
| **TypeScript 5.x** | 类型安全 | TypeScript 5.x |
| **Vite** | 构建工具 (Nuxt 内置) | Webpack / Turbopack |
| **TailwindCSS 4.x** | 样式框架 | TailwindCSS 3.x |
| **Naive UI** | 组件库 (高质量 Vue 3 组件) | Radix UI Themes |
| **Pinia** | 客户端状态管理 | Zustand |
| **TanStack Vue Query** | 服务端状态 + 缓存 | React Query |
| **Axios** | HTTP 客户端 | fetch |
| **Vue Flow** | 工作流画布 (@vue-flow/core) | XYFlow (React Flow) |
| **Vueuse Motion / Motion One** | 动画 | Framer Motion |
| **Lucide Vue** | 图标 | Lucide React |
| **Vue Router** | 路由 (Nuxt 内置文件路由) | Next.js App Router |
| **VeeValidate + Zod** | 表单验证 | React Hook Form |
| **VueUse** | 组合式工具库 (useDebounce, useWebSocket 等) | 自定义 Hooks |
| **vue-dropzone / vueup** | 文件上传 | React Dropzone |
| **Nuxt Auth Utils** | 认证中间件 | NextAuth / 自定义 |

### 7.2 项目结构重构

```
polaris-web/
├── .env                          # 环境变量 (API 地址等)
├── nuxt.config.ts                # Nuxt 配置 (替代 next.config.ts)
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── app.vue                      # 根组件 (替代 layout.tsx)
├── pages/                        # Nuxt 文件路由 (替代 app/ 目录)
│   ├── index.vue                 # 首页 (Landing)
│   ├── login.vue                 # 登录页
│   ├── register.vue              # 注册页
│   ├── studio/
│   │   └── index.vue             # Studio 主页面
│   ├── projects/
│   │   ├── index.vue             # 项目列表
│   │   └── [id]/
│   │       └── index.vue         # 单个项目详情
│   ├── assets/
│   │   └── index.vue             # 素材库
│   ├── settings/
│   │   └── index.vue             # 个人设置
│   └── admin/                    # 管理后台
│       ├── dashboard.vue
│       ├── users.vue
│       ├── projects.vue
│       ├── templates.vue
│       └── settings.vue
│
├── layouts/                      # Nuxt 布局层
│   ├── default.vue               # 默认布局 (公开页)
│   ├── studio.vue                # Studio 工作区布局 (需认证)
│   └── admin.vue                 # 管理后台布局 (需管理员认证)
│
├── middleware/                   # Nuxt 路由中间件
│   └── auth.ts                   # 认证守卫 (替代 middleware.ts)
│
├── components/                   # 共享组件
│   ├── ui/                       # 通用 UI (Button, Input, Modal...)
│   │   ├── FloatingButton.vue
│   │   ├── GlassPanel.vue
│   │   ├── ModelSelector.vue
│   │   ├── StatusBadge.vue
│   │   └── EmptyState.vue
│   ├── layout/                   # 布局组件
│   │   ├── AppShell.vue
│   │   ├── TopBar.vue
│   │   ├── LeftToolbar.vue
│   │   └── BottomToolbar.vue
│   ├── canvas/                   # 画布相关
│   │   ├── MagicCanvas.vue
│   │   ├── CanvasCard.vue
│   │   ├── PromptCard.vue
│   │   ├── ImageCard.vue
│   │   └── VideoCard.vue
│   ├── workflow/                 # 工作流相关
│   │   ├── WorkflowCanvas.vue
│   │   ├── NodeMenu.vue
│   │   └── nodes/
│   │       ├── BaseWorkflowNode.vue
│   │       ├── PromptNode.vue
│   │       ├── ImageGenerateNode.vue
│   │       ├── ImageToVideoNode.vue
│   │       └── OutputNode.vue
│   ├── agent/                    # AI Copilot 交互
│   │   ├── AgentPanel.vue
│   │   └── SkillChips.vue
│   ├── assets/                   # 素材管理
│   │   └── AssetLibrary.vue
│   ├── history/                  # 生成历史
│   │   └── GenerationHistory.vue
│   ├── settings/                 # 设置
│   │   └── ApiSettingsDialog.vue
│   ├── home/                     # 首页组件
│   │   └── GoalComposer.vue
│   └── admin/                    # 管理后台组件
│       └── ...
│
├── composables/                  # Vue 组合式函数 (替代 hooks/)
│   ├── useAuth.ts                # 认证相关
│   ├── useProjects.ts            # 项目查询
│   └── useWebSocket.ts           # SSE/WebSocket
│
├── services/                     # API 调用层
│   ├── api.ts                    # Axios 实例 + 拦截器
│   ├── authService.ts            # 认证 API
│   ├── projectService.ts         # 项目 API
│   ├── assetService.ts           # 素材 API
│   ├── workflowService.ts        # 工作流 API
│   ├── aiService.ts              # AI 生成 API
│   └── adminService.ts           # 管理后台 API
│
├── stores/                       # Pinia 状态 (替代 Zustand)
│   ├── authStore.ts              # 认证状态 + Token
│   ├── canvasStore.ts            # 画布交互状态
│   ├── workflowStore.ts          # 工作流本地编辑状态
│   ├── settingsStore.ts          # 本地设置 (持久化)
│   └── workspaceStore.ts         # 工作区 UI 状态
│
├── types/                        # TypeScript 类型
│   └── index.ts
│
├── utils/                        # 工具函数 (替代 lib/)
│   ├── index.ts
│   └── constants.ts
│
└── public/                       # 静态资源
    └── images/
```

### 7.3 关键前端组件清单

| 组件 | 职责 | 状态来源 | 替代自 |
|------|------|----------|--------|
| `<AppShell />` | 主工作区外壳布局 | Pinia | `<AppShell />` (React) |
| `<TopBar />` | 顶部导航栏 + 模式切换 | Pinia | `<TopBar />` |
| `<LeftToolbar />` | 左侧工具条 | Pinia | `<LeftToolbar />` |
| `<BottomToolbar />` | 底部缩放/撤销工具栏 | Pinia | `<BottomToolbar />` |
| `<AgentPanel />` | AI Copilot 对话面板 | Pinia + Vue Query | `<AgentPanel />` |
| `<MagicCanvas />` | 星图画布 (自由放置卡片) | Vue Query + Pinia | `<MagicCanvas />` |
| `<WorkflowCanvas />` | 节点工作流画布 (Vue Flow) | Vue Query + Pinia | `<WorkflowCanvas />` |
| `<AssetLibrary />` | 素材库面板 | Vue Query | `<AssetLibrary />` |
| `<GenerationHistory />` | 生成历史面板 | Vue Query | `<GenerationHistory />` |
| `<ApiSettingsDialog />` | API 供应商配置弹窗 | Pinia (本地持久化) | `<ApiSettingsDialog />` |
| `<LoginForm />` | 登录表单 | VeeValidate | `<LoginForm />` |
| `<ProjectList />` | 项目列表页 | Vue Query | `<ProjectList />` |
| `<AdminDashboard />` | 管理后台仪表盘 | Vue Query | `<AdminDashboard />` |

### 7.4 状态管理策略

```
┌──────────────────────────────────────────────────┐
│                   状态分层                          │
├──────────────────────────────────────────────────┤
│                                                    │
│ 1. 服务端状态 (Server State)                        │
│    ├─ 项目列表 / 项目详情                           │
│    ├─ 画布对象 / 工作流节点                          │
│    ├─ 素材列表 / 生成历史                           │
│    ├─ 用户信息 / 权限                               │
│    └─ 管理后台数据                                  │
│    └─ 管理工具: TanStack Vue Query                  │
│       ├─ useQuery / useMutation                     │
│       ├─ 自动缓存 + 失效 + 重新获取                  │
│       └─ 乐观更新 (Optimistic Update)               │
│                                                    │
│ 2. 客户端状态 (Client State)                        │
│    ├─ 画布交互状态 (选中/拖拽)                       │
│    ├─ UI 状态 (弹窗开关/主题/面板折叠)               │
│    ├─ 工作流本地编辑状态 (未保存)                    │
│    └─ 本地设置 (API Key 等)                         │
│    └─ 管理工具: Pinia (轻量/持久化插件)              │
│       ├─ defineStore + setup 语法                   │
│       ├─ pinia-plugin-persistedstate 持久化         │
│       └─ $subscribe / $patch 响应式更新             │
│                                                    │
│ 3. URL 状态 (URL State)                             │
│    ├─ 当前路由 / 项目 ID                             │
│    └─ 管理工具: Nuxt Router / useRoute / useRouter  │
│                                                    │
└──────────────────────────────────────────────────┘
```

---

## 八、关键业务流程

### 8.1 AI 生成异步流程

```
Client                    Server                          AI Provider
  │                         │                                │
  ├── POST /api/ai/image ──┤                                │
  │                         ├── 校验用户点数                   │
  │                         ├── 扣除点数                      │
  │                         ├── 创建 GenerationTask          │
  │                         ├── 发送 RabbitMQ 消息            │
  │                         └── 返回 { taskId, status }      │
  │                         │                                │
  │                         ├── (Consumer 消费) ─────────────┤
  │                         │   ├── 调用 AI API               │
  │                         │   ├── 上传结果到 MinIO          │
  │                         │   ├── 更新任务状态 + result_url │
  │                         │   └── 发送 SSE 通知             │
  │                         │                                │
  ├── GET /api/ai/tasks/1 ──┤                                │
  │                         └── 返回 { status, result_url }  │
  │                         │                                │
  ├── SSE: /api/ai/events ──┤                                │
  │                         └── 实时推送进度                  │
```

### 8.2 工作流自动执行

```
1. 用户编辑节点连接关系 → 前端保存到 React Query (暂存)
2. 用户点击 "执行" → POST /api/workflow/run
3. 服务端解析 DAG (有向无环图) → 拓扑排序
4. 按序执行每个节点:
   a. Prompt Node → 直接输出文本
   b. Image Generate Node → 调用 AI provider (异步)
   c. Image to Video Node → 等待上游完成 → 调用 AI provider
   d. Output Node → 打包结果
5. 每个节点完成后通过 SSE 推送进度
6. 全部完成后更新项目状态
```

### 8.3 点数计费体系

```
┌────────────────────────────────────────────┐
│              点数 (Credits) 体系              │
├────────────────────────────────────────────┤
│                                            │
│  获取途径:                                  │
│  ├─ 注册赠送: 100 星尘                      │
│  ├─ 每日签到: 10 星尘                       │
│  ├─ 充值 (微信/支付宝): ¥1 = 10 星尘        │
│  └─ 管理员手动发放                          │
│                                            │
│  消耗定价:                                  │
│  ├─ AI 对话 (DeepSeek): 1 星尘/次          │
│  ├─ 图像生成 (SD/FLUX): 10 星尘/张         │
│  ├─ 视频生成 (Kling): 50 星尘/个           │
│  ├─ 图生视频: 30 星尘/个                   │
│  └─ 提示词增强: 2 星尘/次                  │
│                                            │
│  安全策略:                                  │
│  ├─ 每次操作前校验余额                       │
│  ├─ 悲观锁/Redisson 分布式锁防重复扣减       │
│  ├─ 扣减记录持久化到 credit_log 表           │
│  └─ 定时任务对账 (T+1)                      │
│                                            │
└────────────────────────────────────────────┘
```

---

## 九、文件存储方案 (MinIO)

### 9.1 Bucket 结构

```
polaris-assets/
├── users/
│   └── {userId}/
│       └── avatar.jpg
├── projects/
│   └── {projectId}/
│       ├── canvas-objects/
│       ├── workflow-outputs/
│       └── assets/
├── generations/
│   └── {taskId}/
│       └── result.png
├── templates/
│   └── {templateId}/
│       └── cover.jpg
└── temp/
    └── {sessionId}/
```

### 9.2 Pre-signed URL 策略

- 上传: 前端直接请求后端获取预签名 URL → 直传 MinIO
- 下载: 对象存储访问路径 → Nginx 反向代理 / MinIO 网关
- 私有资源: 需带 Token 查询参数, 后端验证身份后返回临时访问链接 (有效期 1 小时)

---

## 十、部署架构

```
                           ┌──────────────┐
                           │   DNS/CDN     │
                           └──────┬───────┘
                                  │
                          ┌───────▼────────┐
                          │  Nginx / LB    │
                          │  (SSL 终结)    │
                          └───┬───────┬────┘
                              │       │
                    ┌─────────▼─┐  ┌──▼──────────┐
                    │ Frontend  │  │  Backend     │
                    │ (Next.js  │  │ (Spring Boot)│
                    │  SPA)     │  │  Cluster     │
                    └───────────┘  └──┬───────────┘
                                      │
                    ┌─────────────────┼──────────────────┐
                    │                 │                   │
              ┌─────▼────┐   ┌───────▼──────┐   ┌───────▼──────┐
              │  MySQL   │   │    Redis     │   │   MinIO      │
              │ (主从)   │   │  (Cluster)   │   │ (分布式存储) │
              └──────────┘   └──────────────┘   └──────────────┘
                                    │
                            ┌───────▼───────┐
                            │   RabbitMQ    │
                            │ (AI 任务队列)  │
                            └───────────────┘
```

---

## 十一、安全方案

| 维度 | 方案 |
|------|------|
| **认证** | JWT (access 15min + refresh 7d), Redis 黑名单 |
| **密码** | BCrypt 加密 |
| **API Key 存储** | AES-256 加密存储 (数据库) + 前端不落盘 |
| **防重放** | 接口幂等性 (Token/Idempotent-Key) |
| **限流** | Spring Cloud Gateway + Redis (令牌桶) |
| **SQL 注入** | MyBatis-Plus 参数绑定 + SQL 审计 |
| **XSS** | Spring HTML 转义 + Content-Security-Policy |
| **CSRF** | JWT + SameSite Cookie (非浏览器场景可关) |
| **文件安全** | MinIO 预签名 URL + 文件类型校验 + 杀毒扫描 |
| **日志审计** | AOP 记录所有管理员操作 |
| **数据加密** | 敏感字段 AES-256 + 传输 HTTPS/TLS 1.3 |

---

## 十二、开发路线图 (建议)

### Phase 1 — 基础架构 (2-3 周)
- [ ] Spring Boot 项目初始化 + 多模块构建
- [ ] 数据库表创建 + 初始化脚本
- [ ] Spring Security + JWT 认证
- [ ] 基础 CRUD: 用户注册/登录/个人中心
- [ ] RBAC 权限体系 (角色+权限+数据权限)
- [ ] 前端 Axios 封装 + 请求拦截 + 路由守卫
- [ ] 登录/注册页面 UI

### Phase 2 — 核心业务迁移 (3-4 周)
- [ ] Project / CanvasObject CRUD API
- [ ] Workflow / WorkflowNode / WorkflowEdge CRUD API
- [ ] 画布数据从前端 localStorage 迁移到后端
- [ ] 工作流数据从前端 mock 迁移到后端
- [ ] React Query 替换 Zustand 中服务端状态
- [ ] XYFlow 集成后端数据

### Phase 3 — AI 能力集成 (2-3 周)
- [ ] AI Provider 配置管理 API + 加密存储
- [ ] DeepSeek 对话 API 迁移到 Spring Boot
- [ ] 异步任务引擎 (RabbitMQ + SSE)
- [ ] AI 供应商路由策略 (按余额/模型)
- [ ] 管理员全局供应商配置

### Phase 4 — 文件与资产管理 (1-2 周)
- [ ] MinIO 部署 + 集成
- [ ] 文件上传/下载 API (预签名 URL)
- [ ] Asset 管理 API
- [ ] 前端上传组件 + 素材库

### Phase 5 — 点数计费系统 (1-2 周)
- [ ] 点数 CRUD + 安全扣减
- [ ] 充值接口 (微信/支付宝)
- [ ] 前端点数展示 + 充值页面

### Phase 6 — 管理后台 (2-3 周)
- [ ] 用户管理 (列表/搜索/禁封/调点数)
- [ ] 项目审核 (上架/下架/公开控制)
- [ ] 模板管理 (发布/编辑官方模板)
- [ ] 数据统计仪表盘 (ECharts)
- [ ] 操作日志查看
- [ ] AI 供应商全局配置
- [ ] 系统设置

### Phase 7 — 优化与运维 (持续)
- [ ] API 性能优化 (缓存/索引/慢查询优化)
- [ ] 前端性能 (代码分割/Lazy Loading/SSR)
- [ ] Docker Compose / Kubernetes 部署
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] 监控 (Prometheus + Grafana)
- [ ] 告警体系

---

## 十三、工作量估算

| 阶段 | 前端 (人天) | 后端 (人天) | 总计 |
|------|------------|------------|------|
| Phase 1: 基础架构 | 5 | 10 | 15 |
| Phase 2: 核心业务 | 10 | 8 | 18 |
| Phase 3: AI 集成 | 3 | 10 | 13 |
| Phase 4: 文件存储 | 3 | 4 | 7 |
| Phase 5: 点数计费 | 2 | 5 | 7 |
| Phase 6: 管理后台 | 8 | 8 | 16 |
| Phase 7: 优化运维 | 5 | 5 | 10 |
| **合计** | **36** | **50** | **86 人天** |

> 注: 以上按 2 名前端 + 2 名后端开发估算，约 3-4 个月完成核心交付。

---

## 十四、项目收益与商业价值

| 维度 | 价值 |
|------|------|
| **权限安全** | RBAC 粒度控制，满足企业级数据安全合规 |
| **能力扩展** | Spring Boot 微服务架构，可水平扩展至百万用户 |
| **前后端分离** | 前端可独立迭代，后端可复用至多端 (Web/iOS/Android) |
| **AI 网关** | 统一管理 8+ AI 供应商，支持动态路由和灾备 |
| **数据资产** | 用户数据云端持久化，支持跨设备同步 |
| **管理后台** | 运营体系完善 (用户/内容/计费/统计) |
| **计费闭环** | 点数经济体系，支持商业化变现 |
| **异步架构** | RabbitMQ + SSE 保障高并发 AI 请求不阻塞 |
