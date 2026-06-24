# Polaris Studio — 分阶段实现计划

> 从 Next.js/React 全栈单体 → Nuxt 3/Vue 前端 + Spring Boot 后端
> 确保现有项目始终可运行，逐步替换而非一次性重写

---

## 一、总体策略

### 核心原则

1. **现有项目永不破坏** — 每一步修改都确保 `npm run dev` 正常启动、页面正常渲染
2. **并行开发** — 新旧代码共存，新项目建在独立目录
3. **增量替换** — 先从无侵入的后端开始，再逐步替换前端
4. **每个阶段可验证** — 每完成一小步都有可运行的交付物

### 目录规划

```
E:\hb\canvas\                  ← 现有 Next.js 项目 (保持运行)
├── app/                       ← 当前代码 (不动)
├── components/                ← 当前代码 (不动)
├── stores/                    ← 当前代码 (不动)
├── ...
│
E:\hb\polaris-server\          ← 新建: Spring Boot 后端
│   ├── polaris-common/
│   ├── polaris-auth/
│   ├── polaris-user/
│   └── ...
│
E:\hb\polaris-web\             ← 新建: Nuxt 3 + Vue 3 前端
│   ├── pages/
│   ├── components/
│   ├── stores/
│   └── ...
```

---

## 二、阶段规划 (共 7 个阶段，约 12-16 周)

---

### Phase 0: 环境准备 (1 天)

| 任务 | 说明 | 不影响现有项目 |
|------|------|:---:|
| 确认 JDK 17+ 安装 | 如需安装 Adoptium JDK 17 | ✅ |
| 确认 Maven 3.9+ 安装 | 或使用 Gradle | ✅ |
| 确认 MySQL 8.0+ 安装运行 | 初始化数据库 `polaris` | ✅ |
| 确认 Redis 7+ 安装运行 | 缓存/令牌存储 | ✅ |
| 确认 MinIO 安装运行 | 对象存储服务 | ✅ |
| 确认 RabbitMQ 安装运行 | AI 异步任务队列 | ✅ |
| IDE 配置 | VS Code + Java 插件 / IntelliJ IDEA | ✅ |

**验证标准**: MySQL 能连接、Redis ping 通、MinIO 能创建 bucket

---

### Phase 1: Spring Boot 后端 — 基础架构 (2 周)

**目标**: 搭建多模块 Spring Boot 项目，实现认证 + 用户基础 CRUD，现有前端通过代理调用

#### 1.1 项目骨架搭建

```
E:\hb\polaris-server\
├── pom.xml                     # 父 POM (Spring Boot 3.4.x)
├── polaris-common/             # 公共: 统一响应体、异常处理、工具类
├── polaris-auth/               # 认证: 注册/登录/JWT
├── polaris-user/               # 用户: 个人信息 CRUD
├── polaris-project/            # 项目: 星图项目 CRUD (后续实现)
├── polaris-workflow/           # 工作流 CRUD (后续实现)
├── polaris-asset/              # 资产/文件 (后续实现)
├── polaris-ai/                 # AI 供应商网关 (后续实现)
├── polaris-credit/             # 点数计费 (后续实现)
├── polaris-admin/              # 管理后台 (后续实现)
└── polaris-gateway/            # API 网关 (可选)
```

#### 1.2 核心配置清单

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/polaris?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: ${MYSQL_PASSWORD}
  redis:
    host: localhost
    port: 6379
  rabbitmq:
    host: localhost
    port: 5672

minio:
  endpoint: http://localhost:9000
  access-key: ${MINIO_ACCESS_KEY}
  secret-key: ${MINIO_SECRET_KEY}
  bucket: polaris-assets

jwt:
  secret: ${JWT_SECRET}
  access-token-expire: 900       # 15 分钟
  refresh-token-expire: 604800   # 7 天
```

#### 1.3 数据库初始化

```sql
-- 执行 Phase 1 必需的表
CREATE DATABASE IF NOT EXISTS polaris DEFAULT CHARSET utf8mb4;

-- sys_user, sys_role, sys_permission, sys_user_role, sys_role_permission
-- 详见架构文档 §4.1
```

#### 1.4 API 清单 (Phase 1)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 (返回 JWT) |
| POST | `/api/auth/refresh` | 刷新 Token |
| GET | `/api/auth/me` | 当前用户信息 |
| PUT | `/api/users/{id}` | 更新个人资料 |
| PUT | `/api/users/{id}/password` | 修改密码 |

#### 1.5 现有前端对接 (无侵入)

```typescript
// 在现有 Next.js 项目中新增文件
// next.config.ts - 添加代理
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "http://localhost:8080/api/:path*"
      }
    ];
  }
};
```

**验证标准**: 
- [ ] `curl POST /api/auth/register` 返回 JWT
- [ ] `curl POST /api/auth/login` 返回 JWT
- [ ] 现有 `npm run dev` 仍然正常

---

### Phase 2: Spring Boot 后端 — 核心业务 (2 周)

**目标**: 实现项目、画布对象、工作流的 CRUD API，将现有前端 localStorage 数据同步到后端

#### 2.1 新增表

```sql
-- project, canvas_object, workflow, workflow_node, workflow_edge
-- 详见架构文档 §4.1
```

#### 2.2 API 清单

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/projects` | 项目列表 (分页) |
| POST | `/api/projects` | 创建项目 |
| GET | `/api/projects/{id}` | 项目详情 |
| PUT | `/api/projects/{id}` | 更新项目 |
| DELETE | `/api/projects/{id}` | 删除项目 |
| GET | `/api/projects/{id}/objects` | 画布对象列表 |
| POST | `/api/projects/{id}/objects` | 添加画布对象 |
| PUT | `/api/projects/{id}/objects/{oid}` | 更新画布对象 |
| DELETE | `/api/projects/{id}/objects/{oid}` | 删除画布对象 |
| GET | `/api/projects/{id}/workflow` | 获取工作流 |
| PUT | `/api/projects/{id}/workflow` | 保存工作流 |
| POST | `/api/projects/{id}/workflow/run` | 执行工作流 (mock) |

#### 2.3 同步策略

现有 Next.js 前端保持使用 Zustand + localStorage，通过新增的 sync 按钮手动触发数据同步到后端：

```
Zustand (localStorage)  ←── 读取 ── 现有 UI
    │
    └── 点击"同步到云端" ──→ POST /api/projects
                              POST /api/projects/{id}/objects
```

**验证标准**:
- [ ] 通过 Spring Boot API 创建/查询/修改/删除项目
- [ ] 画布对象 CRUD 正常
- [ ] 现有前端完全不受影响

---

### Phase 3: AI 能力后端迁移 (2 周)

**目标**: 将 `/api/deepseek/chat` 从 Next.js API Route 迁移到 Spring Boot

#### 3.1 新增表

```sql
-- ai_provider_config, generation_task
-- 详见架构文档 §4.1
```

#### 3.2 API 清单

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/ai/chat` | AI 对话 (替代现有 Next.js API) |
| POST | `/api/ai/prompt/enhance` | 提示词增强 |
| GET | `/api/ai/tasks/{id}` | 查询异步任务 |
| GET | `/api/ai/providers` | 获取供应商列表 |
| PUT | `/api/ai/providers` | 保存用户供应商配置 |

#### 3.3 迁移步骤

1. Spring Boot 实现 `POST /api/ai/chat` (调用 DeepSeek API)
2. 修改现有前端 `GoalComposer.tsx` 和 `AgentPanel.tsx` 中的 API 地址

```typescript
// 修改前: fetch("/api/deepseek/chat", ...)
// 修改后: fetch("/api/backend/ai/chat", ...)
// 通过 next.config.ts 的 rewrites 代理到 Spring Boot
```

#### 3.4 回退方案

如果 Spring Boot 的 AI 接口出问题，只需将前端 API 地址改回 `/api/deepseek/chat` 即可瞬间回退，不影响其他功能。

**验证标准**:
- [ ] 首页 GoalComposer 提交后正常跳转到 Studio
- [ ] AgentPanel 对话正常
- [ ] 现有 `npm run dev` 正常

---

### Phase 4: 文件与资产管理 (1 周)

**目标**: 实现 MinIO 文件上传，素材库从本地 mock 变为真实数据

#### 4.1 新增表

```sql
-- asset 表
-- 详见架构文档 §4.1
```

#### 4.2 API 清单

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/assets/upload` | 上传文件 (预签名 URL) |
| GET | `/api/assets` | 素材列表 |
| DELETE | `/api/assets/{id}` | 删除素材 |
| PUT | `/api/assets/{id}/favorite` | 收藏/取消收藏 |

#### 4.3 前端改动

在现有 `AssetLibrary.tsx` 中，将 `useAssetStore` 的数据源从 mock 改为 React Query 调用 Spring Boot API

**验证标准**:
- [ ] 文件上传到 MinIO 并可访问
- [ ] 素材列表展示真实数据
- [ ] 现有项目正常运行

---

### Phase 5: Nuxt 3 前端搭建 (3-4 周)

**目标**: 在独立目录创建 Nuxt 3 项目，逐步将现有页面迁移到 Vue

**这是唯一对现有代码有侵入的阶段，但新旧项目完全独立目录，互不影响。**

#### 5.1 项目初始化

```bash
# 新目录，完全独立
cd E:\hb
npx nuxi@latest init polaris-web
cd polaris-web
npm install
npm install @vue-flow/core @vue-flow/background @vue-flow/controls
npm install pinia @pinia-plugin-persistedstate
npm install @vueuse/core @tanstack/vue-query
npm install lucide-vue-next naive-ui
npm install axios vee-validate zod
npm install @vueuse/motion
npm install tailwindcss @tailwindcss/vite
```

#### 5.2 迁移顺序

| 步骤 | 页面/组件 | 说明 |
|------|----------|------|
| 1 | 首页 Landing (`pages/index.vue`) | 纯展示，无复杂逻辑 |
| 2 | 登录/注册页 | 表单验证 |
| 3 | UI 基础组件 | FloatingButton, GlassPanel, StatusBadge 等 |
| 4 | 布局框架 | AppShell, TopBar, LeftToolbar, BottomToolbar |
| 5 | Studio 页面 | 框架搭建 |
| 6 | AgentPanel + GoalComposer | AI 对话交互 |
| 7 | MagicCanvas + CanvasCard | 星图画布 |
| 8 | WorkflowCanvas + Vue Flow Nodes | 节点工作流 |
| 9 | 项目列表/详情页 | 数据展示 |
| 10 | 素材库 + 设置 | 文件管理 |
| 11 | 管理后台 | 全部 Admin 页面 |

#### 5.3 关键文件对照

| 现有 (React) | 新建 (Vue) |
|-------------|------------|
| `app/page.tsx` | `pages/index.vue` |
| `app/layout.tsx` | `layouts/default.vue` |
| `app/studio/layout.tsx` | `layouts/studio.vue` |
| `app/studio/page.tsx` | `pages/studio/index.vue` |
| `components/layout/AppShell.tsx` | `components/layout/AppShell.vue` |
| `components/canvas/MagicCanvas.tsx` | `components/canvas/MagicCanvas.vue` |
| `components/workflow/WorkflowCanvas.tsx` | `components/workflow/WorkflowCanvas.vue` |
| `stores/useCanvasStore.ts` | `stores/canvasStore.ts` |
| `lib/ai/providers/*.ts` | `services/ai/providers/*.ts` |

#### 5.4 并行运行策略

```bash
# 终端 1: 现有项目
cd E:\hb\canvas
npm run dev   # localhost:3000

# 终端 2: Nuxt 新项目
cd E:\hb\polaris-web
npm run dev   # localhost:3001
```

两个项目可同时运行、同时开发。现有项目始终保持可用。

**验证标准**:
- [ ] `localhost:3000` 现有项目正常
- [ ] `localhost:3001` Nuxt 首页可访问
- [ ] 迁移后的每个页面在 Nuxt 中渲染正确

---

### Phase 6: 数据迁移与切换 (1 周)

**目标**: 将用户数据从 localStorage 迁移到后端，前端正式切换到 Nuxt 3

#### 6.1 数据迁移脚本

```typescript
// 在浏览器控制台执行的数据导出脚本
// 从现有 Next.js 项目 localStorage 读取数据
const exportData = () => {
  const keys = [
    "polaris.canvas",      // 画布对象
    "polaris.settings",    // API 配置
    "polaris.workspace",   // 工作区状态
    "polaris.agent",       // 对话历史
    "polaris.assets",      // 素材
    "polaris.pendingGoal"  // 待处理目标
  ];
  const data: Record<string, unknown> = {};
  keys.forEach(key => {
    const raw = localStorage.getItem(key);
    if (raw) data[key] = JSON.parse(raw);
  });
  return data;
};
```

#### 6.2 切换域名

当 Nuxt 3 前端完全验证通过后，通过反向代理切换流量：

```
Nginx 配置:
  / → polaris-web (Nuxt 3)
  /api/* → polaris-server (Spring Boot)
```

旧项目目录保留作为回退。

**验证标准**:
- [ ] 用户数据从 localStorage 成功导入后端
- [ ] Nuxt 3 前端所有页面功能完整
- [ ] 旧项目可随时切回

---

### Phase 7: 管理后台与收尾 (2 周)

**目标**: 实现管理后台全部页面，系统优化收尾

#### 7.1 管理后台 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/users` | 用户列表 |
| PUT | `/api/admin/users/{id}/status` | 禁封/解封 |
| PUT | `/api/admin/users/{id}/credits` | 调点数 |
| GET | `/api/admin/projects` | 全平台项目 |
| PUT | `/api/admin/projects/{id}/status` | 项目审核 |
| GET | `/api/admin/stats/dashboard` | 仪表盘 |
| POST | `/api/admin/templates` | 发布模板 |
| GET | `/api/admin/logs` | 操作日志 |

#### 7.2 管理后台前端

所有管理页面在 Nuxt 3 的 `pages/admin/` 下实现，复用现有组件规范。

#### 7.3 收尾清单

- [ ] 旧项目 README 添加归档说明
- [ ] 数据库备份脚本
- [ ] Docker Compose 一键部署
- [ ] 性能测试与优化
- [ ] 文档归档

---

## 三、甘特图

```
周次       1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16
Phase 0    ██
Phase 1       ██  ██
Phase 2              ██  ██
Phase 3                    ██  ██
Phase 4                          ██
Phase 5                             ██  ██  ██  ██
Phase 6                                       ██
Phase 7                                            ██  ██
                                        ↑
                                   旧项目仍可运行
```

---

## 四、并行开发说明

### 任何时候都可以运行的项目

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ 现有项目      │    │ Spring Boot  │    │ Nuxt 3 前端  │
│ localhost:3000│    │ localhost:8080│    │ localhost:3001│
│ (Next.js)    │    │ (建设中)     │    │ (建设中)     │
└──────────────┘    └──────────────┘    └──────────────┘
      ✓ 一直运行         Phase 1起可用      Phase 5起可用
```

### 依赖关系

| 阶段 | 依赖 | 可独立运行？ |
|------|------|:---:|
| Phase 0 | 无 | ✅ |
| Phase 1 | Phase 0 | ✅ (独立后端) |
| Phase 2 | Phase 1 | ✅ (独立后端) |
| Phase 3 | Phase 1 | ✅ (独立后端) |
| Phase 4 | Phase 1 | ✅ (独立后端) |
| Phase 5 | Phase 1-4 API 就绪 | ✅ (可用 mock 数据先行开发) |
| Phase 6 | Phase 5 完成 | 切换操作 |
| Phase 7 | Phase 2 + 5 | ✅ (独立模块) |

---

## 五、风险与应对

| 风险 | 概率 | 影响 | 应对方案 |
|------|:---:|:---:|----------|
| Java 环境搭建困难 | 低 | 高 | 使用 Docker 容器化开发环境 |
| 前端迁移页面不匹配 | 中 | 中 | 逐个页面比对验收，对比截图 |
| 用户数据丢失 | 低 | 高 | 迁移前导出 JSON 备份，可回滚 |
| AI 接口中断 | 低 | 中 | 前端保留 `/api/deepseek/chat` 旧路由为 fallback |
| 项目周期过长 | 中 | 中 | 核心功能优先 (Phase 1-3)，管理后台可延期 |
| 团队成员不熟悉 Vue | 中 | 中 | Phase 5 从简单页面开始，逐步上手 |

---

## 六、开发协作建议

### Git 分支策略

```
main          ← 现有项目代码 (永远稳定)
├── develop   ← 日常开发
├── backend   ← Spring Boot 后端开发
├── frontend  ← Nuxt 3 前端开发
└── docs      ← 文档
```

### 每日验证

```bash
# 每天开始工作时确认
cd E:\hb\canvas && npm run dev    # 现有项目正常
cd E:\hb\polaris-server && mvn spring-boot:run  # 后端正常
cd E:\hb\polaris-web && npm run dev  # 前端正常
```

### 验收标准

每个 Phase 完成后，必须跑通：

1. `npm run dev` 现有项目无报错
2. 新后端 API 通过 `curl` 测试
3. 新前端页面正确渲染
4. 核心流程 (登录→创建项目→添加画布→AI 对话) 走通

---

## 七、立即开始 (Phase 0)

```bash
# 1. 环境检查
java --version          # 需要 JDK 17+
mvn --version           # 需要 Maven 3.9+
mysql --version         # 需要 MySQL 8.0+
redis-cli ping          # 需要 Redis 7+
node --version          # 已有 v22.16.0

# 2. 创建后端项目目录
mkdir -p E:\hb\polaris-server

# 3. 创建前端项目目录
mkdir -p E:\hb\polaris-web

# 4. 确认现有项目正常运行
cd E:\hb\canvas
npm run dev
# 访问 http://localhost:3000 确认
```
