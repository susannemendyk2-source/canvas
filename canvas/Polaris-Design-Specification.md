# Polaris Studio — 页面设计规范说明书

> 基于当前项目 UI 设计语言提取的完整设计规范，确保所有新增页面和模块风格统一。

---

## 一、设计语言总述

### 1.1 主题概念

**"星图 / Star Map"** — 暗色深空背景 + 青色星光点缀 + 透明玻璃质感图层

- 背景：深邃太空黑 (`#03050b` ~ `#050608`)
- 光源：放射性渐变模拟星云发光
- 质感：毛玻璃 (`backdrop-filter: blur`)、半透明面板叠加
- 点缀：青色 (`#66E4FF`) 作为交互主色，如同星光指引
- 语言：中英双语标签，斜杠 `/` 分隔

### 1.2 设计原则

| 原则 | 说明 |
|------|------|
| **暗色优先** | 全局 Dark Mode，无亮色模式 |
| **玻璃质感** | 面板使用半透明背景 + 模糊 + 细边框叠加 |
| **低对比度** | 文字多用白色半透明 (`white/72`, `white/55`, `white/38`)，不刺眼 |
| **青色焦点** | 青色 (`#66E4FF`) 为唯一交互主色，用于高亮、悬停、选中态 |
| **圆角统一** | 所有容器使用 `rounded-lg`(8px) / `rounded-xl`(12px) / `rounded-2xl`(16px)，无直角 |
| **中英双语** | 所有 UI 标签同时显示中文和英文，用 ` / ` 分隔 |

---

## 二、色彩体系

### 2.1 基础色板

```css
/* Tailwind 扩展色 (tailwind.config.ts) */
studio: {
  black:  "#050608",     /* 最深层背景 */
  ink:    "#090A0F",     /* 第二层背景 */
  panel:  "rgba(255,255,255,0.06)",  /* 面板底色 */
  line:   "rgba(255,255,255,0.10)",  /* 分隔线/边框 */
  cyan:   "#66E4FF",     /* 主色调 - 青色星光 */
  violet: "#9D7BFF",     /* 辅助色 - 紫色 */
  blue:   "#6CA8FF",     /* 辅助色 - 蓝色 */
  success:"#68E3A3",     /* 成功绿色 */
  warning:"#F8C66A",     /* 警告黄色 */
  danger: "#FF6B8B",     /* 危险红色 */
}
```

### 2.2 语义色

| 用途 | 色值 | 使用场景 |
|------|------|----------|
| 页面背景 | `#03050b` | `app/page.tsx` 主背景 |
| 画布背景 | `#03050b` | `MagicCanvas` 画布区 |
| 应用背景 | `#050608` | `AppShell`、`globals.css body` |
| 面板背景 | `#050811` / `#111722` | `LeftToolbar`、`AgentPanel` |
| 深色面板 | `#1b1c1f` | `ApiSettingsDialog` 侧栏 |
| 浮动面板 | `#111722` / `bkack/60` | `BottomToolbar`、右键菜单 |
| 毛玻璃面板 | `rgba(255,255,255,0.06)` | `glass` 类、`FloatingButton` |
| 输入框背景 | `#000` | `ApiSettingsDialog` 输入框 |

### 2.3 文字透明度层级

| 层级 | 透明度 | 示例类 | 用途 |
|------|--------|--------|------|
| 主要 | `white/92` | `text-white` | 正文、标题 |
| 次要 | `white/72` | `text-white/72` | 次要信息 |
| 辅助 | `white/55` | `text-white/55` | 描述文字 |
| 低调 | `white/45` | `text-white/45` | 辅助说明 |
| 微弱 | `white/38` | `text-white/38` | 标签、角标 |
| 极弱 | `white/25` | `text-white/25` | placeholder |

### 2.4 状态色

| 状态 | 色值 | 文字类 | 边框类 | 场景 |
|------|------|--------|--------|------|
| idle | — | `text-white/55` | `border-white/10` | 等待 |
| queued | `#F8C66A` | `text-studio-warning` | `border-studio-warning/30` | 排队中 |
| running | `#66E4FF` | `text-studio-cyan` | `border-studio-cyan/35` | 运行中 |
| success | `#68E3A3` | `text-studio-success` | `border-studio-success/35` | 成功 |
| failed | `#FF6B8B` | `text-studio-danger` | `border-studio-danger/35` | 失败 |

---

## 三、字体排版

### 3.1 字体栈

```css
font-family: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"];
```

### 3.2 字号层级

| 名称 | 大小 | 行高 | 字重 | 典型用途 |
|------|------|------|------|----------|
| overline | 11px / `text-[11px]` | normal | semibold | 徽标、角标、小标签 |
| caption | 12px / `text-xs` | normal | normal | 辅助文字、按钮说明 |
| body-small | 13px / `text-sm` | 5(20px) / 6(24px) | normal | 正文、描述 |
| body | 14px / `text-sm`(base=14) | 6 | normal | 常规文字 |
| body-large | 15px / `text-base` | 7 | normal | 大段正文 |
| subheading | 16px / `text-lg` | 7 | semibold | 小节标题 |
| heading | 20px / `text-xl` | 8 | semibold | 区域标题 |
| display | 24-36px / `text-3xl`~`text-4xl` | tight | semibold | 页面大标题 |
| hero | 48-60px / `text-5xl`~`text-6xl` | tight | semibold | 首页主标题 |

---

## 四、间距与尺寸

### 4.1 间距系统

遵循 Tailwind 默认间距，常用值：

```
gap-1: 4px   gap-2: 8px   gap-3: 12px   gap-4: 16px
gap-5: 20px  gap-6: 24px  gap-8: 32px   gap-10: 40px
```

面板内 padding 统一：`p-3`(12px) / `p-4`(16px) / `p-5`(20px) / `p-6`(24px)

### 4.2 圆角标准

| 类名 | 半径 | 用途 |
|------|------|------|
| `rounded` | 4px | 极少使用 |
| `rounded-lg` | 8px | 按钮、输入框、图标容器 |
| `rounded-xl` | 12px | 面板、对话框、卡片 |
| `rounded-2xl` | 16px | 大面板、首页卡片 |
| `rounded-full` | 9999px | 标签、徽标、头像、圆角按钮 |

### 4.3 图标尺寸

| 尺寸 | 类名 | 用途 |
|------|------|------|
| 14px | `size-3.5` | 内联小图标 |
| 16px | `size-4` | 标准图标 |
| 20px | `size-5` | 大图标、工具栏图标 |
| 24px | `size-6` | 标题图标 |

### 4.4 元素标准尺寸

| 元素 | 尺寸 | 类名 |
|------|------|------|
| 页面最大宽度 | 1120px | `max-w-[1120px]` |
| 顶部导航栏 | 56px 高 | `h-14` |
| 左侧工具栏 | 64px 宽 | `w-16` |
| AI 侧栏 | 340px 宽 | `w-[340px]` |
| 设置对话框 | 520px 宽 | `max-w-[520px]` |
| 按钮高度 | 36px | `h-9` |
| 输入框高度 | 44px | `h-11` |
| 图标按钮 | 32×32 / 36×36 / 40×40 | `size-8` / `size-9` / `size-10` |

---

## 五、阴影与效果

### 5.1 阴影定义

```css
/* tailwind.config.ts */
boxShadow: {
  glow:  "0 0 60px rgba(102, 228, 255, 0.16)",    /* 青色发光 */
  glass: "0 18px 60px rgba(0, 0, 0, 0.35)",         /* 玻璃投影 */
}

/* 内联大阴影 */
shadow-[0_30px_120px_rgba(30,130,255,.18)]  /* 首页 GoalComposer 容器 */
shadow-2xl                                     /* 设置对话框 */
```

### 5.2 毛玻璃效果

```css
/* CSS 类 .glass */
.glass {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.045));
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(22px);
}

/* Tailwind 等效: 用于面板/侧栏 */
bg-black/60 backdrop-blur-xl border border-cyan-100/12
bg-[#050811]/95 backdrop-blur-xl border-r border-cyan-100/10
bg-[#04070d]/95 backdrop-blur-xl border-b border-cyan-100/10
```

### 5.3 背景纹理

```css
/* 画布点阵 */
.dotted-grid {
  background-image:
    radial-gradient(circle at center, rgba(255,255,255,0.13) 1px, transparent 1px),
    radial-gradient(circle at 20% 10%, rgba(102,228,255,0.13), transparent 30%),
    radial-gradient(circle at 80% 20%, rgba(157,123,255,0.12), transparent 34%);
  background-size: 28px 28px, 100% 100%, 100% 100%;
}

/* 首页网格线 */
bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px]

/* 首页放射性光晕 */
radial-gradient(circle_at_50%_8%,rgba(83,142,255,.20),transparent_28%)
radial-gradient(circle_at_18%_22%,rgba(70,229,255,.12),transparent_24%)

/* 星云背景 */
.aurora {
  background:
    radial-gradient(circle at 18% 20%, rgba(102,228,255,0.18), transparent 32%),
    radial-gradient(circle at 72% 10%, rgba(157,123,255,0.18), transparent 30%),
    linear-gradient(135deg, #050608 0%, #090a0f 45%, #10131c 100%);
}
```

---

## 六、组件规范

### 6.1 基础组件

#### FloatingButton（浮动按钮）

```
当前实现: components/ui/FloatingButton.tsx
Vue 对应: components/ui/FloatingButton.vue

样式:
  inline-flex     → 行内弹性
  h-9             → 36px 高
  items-center justify-center gap-2
  rounded-md      → 8px 圆角
  border border-white/10      → 10% 白边框
  bg-white/8                  → 8% 白底
  px-3 text-sm text-white/88  → 12px 横向内边距，14px 字，88% 白字
  transition                  → 默认过渡
  hover:border-cyan-300/35 hover:bg-white/12
    → 悬停: 青色边框(35%透明度) + 12%白底

行为:
  按钮标准 (ButtonHTMLAttributes 全部透传)
```

#### GlassPanel（玻璃面板）

```
当前实现: components/ui/GlassPanel.tsx
Vue 对应: components/ui/GlassPanel.vue

样式:
  .glass (rounded-lg)
  = border border-white/10
  + bg gradient (8%→4.5% 白)
  + shadow-glass
  + backdrop-filter: blur(22px)
```

#### StatusBadge（状态徽标）

```
当前实现: components/ui/StatusBadge.tsx
Vue 对应: components/ui/StatusBadge.vue

样式:
  rounded-full border px-2 py-0.5 text-[11px]
  颜色根据 status 映射:
    idle:    border-white/10  text-white/55
    queued:  border-studio-warning/30  text-studio-warning
    running: border-studio-cyan/35     text-studio-cyan
    success: border-studio-success/35  text-studio-success
    failed:  border-studio-danger/35   text-studio-danger

标签双语:
    idle:    "待运行 / idle"
    queued:  "排队 / queued"
    running: "运行中 / running"
    success: "成功 / success"
    failed:  "失败 / failed"
```

#### EmptyState（空状态占位）

```
当前实现: components/ui/EmptyState.tsx
Vue 对应: components/ui/EmptyState.vue

布局:
  pointer-events-none absolute inset-0 grid place-items-center
  → 居中占满父容器，不阻挡交互

内容:
  icon → 12×12 图标容器 (border-white/10, bg-white/8, rounded-lg)
  title → text-lg font-medium text-white
  body  → text-sm leading-6 text-white/55
```

#### ModelSelector（模型选择器）

```
当前实现: components/ui/ModelSelector.tsx
Vue 对应: components/ui/ModelSelector.vue

样式:
  select 元素:
    h-9 w-full rounded-md
    border border-cyan-100/10
    bg-black/40 px-3 text-sm text-white/80
    outline-none
    focus:border-cyan-300/50
```

### 6.2 布局组件

#### AppShell（主工作区外壳）

```
当前实现: components/layout/AppShell.tsx
Vue 对应: components/layout/AppShell.vue

布局结构:
┌──────────────────────────────────────┐
│           TopBar (h-14)              │
├──────┬───────────────────────┬───────┤
│ Left │   Canvas Area         │ Agent │
│ Tool │   (flex-1)            │ Panel │
│ bar  │                      │ 340px │
│ 64px │                      │       │
│      │   ┌────BottomToolbar─┐│       │
│      │   │ centered fixed  ││       │
├──────┴───────────────────────┴───────┤

动画:
  AnimatePresence mode="wait"
  motion.div 切换:
    initial:  opacity 0, scale 0.99
    animate:  opacity 1, scale 1
    exit:     opacity 0, scale 1.01
    duration: 0.22s
```

#### TopBar（顶部导航栏）

```
当前实现: components/layout/TopBar.tsx
Vue 对应: components/layout/TopBar.vue

容器:
  h-14 shrink-0 grid grid-cols-[1fr_auto_1fr]
  items-center
  border-b border-cyan-100/10
  bg-[#04070d]/95 px-3
  backdrop-blur-xl

区域: 左(logo+项目名) / 中(模式切换) / 右(操作按钮)

模式切换按钮组:
  flex rounded-full border border-cyan-100/14 bg-white/6 p-1
  选中态: rounded-full bg-cyan-300/18 px-4 py-1.5 text-xs text-cyan-50 shadow-glow
  未选中: rounded-full px-4 py-1.5 text-xs text-white/48

点数徽标:
  rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs text-cyan-100
```

#### LeftToolbar（左侧工具栏）

```
当前实现: components/layout/LeftToolbar.tsx
Vue 对应: components/layout/LeftToolbar.vue

容器:
  w-16 shrink-0 flex flex-col items-center gap-2
  border-r border-cyan-100/10
  bg-[#050811]/82 py-4
  backdrop-blur-xl

工具按钮:
  grid size-10 place-items-center rounded-lg
  text-white/58
  transition
  hover:bg-cyan-100/10 hover:text-cyan-50

生成按钮(底部固定):
  mt-auto
  border border-cyan-300/20 bg-cyan-300/10 text-cyan-100
```

#### BottomToolbar（底部工具栏）

```
当前实现: components/layout/BottomToolbar.tsx
Vue 对应: components/layout/BottomToolbar.vue

容器:
  absolute bottom-5 left-1/2 z-30
  flex -translate-x-1/2 items-center gap-2
  rounded-xl border border-cyan-100/12 bg-black/60 p-2
  shadow-glass backdrop-blur-xl
```

#### AgentPanel（AI 侧栏）

```
当前实现: components/agent/AgentPanel.tsx
Vue 对应: components/agent/AgentPanel.vue

容器:
  w-[340px] shrink-0 flex flex-col
  border-l border-cyan-100/10
  bg-[#050811]/95 backdrop-blur-xl

对话气泡:
  用户: bg-cyan-100 px-3 py-2 text-sm text-[#061018] rounded-xl
  助手: border border-cyan-100/10 bg-white/6 px-3 py-2 text-sm leading-6 text-white/72 rounded-xl

输入区:
  form: rounded-2xl border border-cyan-100/12 bg-black/35 p-2
  textarea: h-20 w-full resize-none bg-transparent p-2 text-sm text-white
  发送按钮: grid size-9 place-items-center rounded-full bg-cyan-100 text-[#061018]
```

### 6.3 画布组件

#### MagicCanvas（星图画布）

```
当前实现: components/canvas/MagicCanvas.tsx
Vue 对应: components/canvas/MagicCanvas.vue

背景: dotted-grid, bg-[#03050b]
画布标识: absolute left-6 top-5, rounded-full border border-cyan-100/12 bg-black/45 px-3 py-1.5 text-xs

右键菜单:
  w-64 rounded-2xl border border-cyan-100/14 bg-[#111722]/95 p-3 shadow-glass
  backdrop-blur-xl
  菜单项: flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm

空状态提示:
  inline-flex items-center gap-2 rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs
  操作按钮: rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm
```

#### CanvasCard（画布卡片）

```
当前实现: components/canvas/CanvasCard.tsx
Vue 对应: components/canvas/CanvasCard.vue

容器:
  glass class (+ absolute positioning)
  rounded-lg p-3
  transition
  hover:border-cyan-300/30
  选中态: border-cyan-300/45 shadow-glow
  默认:   border-white/10

操作栏:
  opacity-0 group-hover:opacity-100
  按钮: grid size-7 place-items-center rounded hover:bg-white/10
```

#### BaseWorkflowNode（工作流节点）

```
当前实现: components/workflow/nodes/BaseWorkflowNode.tsx
Vue 对应: components/workflow/nodes/BaseWorkflowNode.vue

容器:
  w-[280px] rounded-lg border border-white/10 bg-[#11131a]/90 p-3
  shadow-glass backdrop-blur-xl

Handle (连接点) 颜色:
  text:   bg-cyan-300
  image:  bg-violet-300
  video:  bg-blue-300
  audio:  bg-emerald-300
  json:   bg-amber-300

参数区:
  rounded-md border border-white/10 bg-black/24 p-3
  进度条: h-1.5 rounded-full bg-white/8
          填充: h-full rounded-full bg-cyan-300 transition-all
```

### 6.4 对话框

#### ApiSettingsDialog（设置对话框）

```
当前实现: components/settings/ApiSettingsDialog.tsx
Vue 对应: components/settings/ApiSettingsDialog.vue

遮罩:
  fixed inset-0 z-50 flex justify-end
  bg-black/70 backdrop-blur-sm

面板:
  h-full w-full max-w-[520px]
  border-l border-white/10 bg-[#1b1c1f]
  shadow-2xl

头部:
  h-16 border-b border-white/8 px-6
  标题图标: size-9 rounded-lg bg-cyan-500/12 text-cyan-200
  关闭按钮: size-8 rounded-lg border border-white/8

标签页按钮:
  选中: bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30
  未选: text-white/48 hover:bg-white/6 hover:text-white

表单:
  label 文字: text-xs text-white/48
  input: h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm
         focus:border-cyan-400/60

提示框:
  rounded-xl border border-amber-400/20 bg-amber-400/8 p-4 text-xs text-amber-200

状态指示:
  size-2 rounded-full (emerald-400 = 已配置, white/28 = 未配置)

操作按钮:
  主要: h-11 rounded-lg bg-cyan-600 text-sm text-white hover:bg-cyan-500
  次要: h-11 rounded-lg border border-white/10 bg-white/6 text-sm hover:bg-white/10
```

---

## 七、页面布局模板

### 7.1 公开页面 (Landing/Login/Register)

```
┌──────────────────────────────────┐
│  放射性星云背景 + 网格线           │
│  bg-[#03050b]                    │
│                                  │
│  ┌──── Header (max-w-7xl) ────┐  │
│  │ Logo          Nav     按钮  │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌──── Content ──────────────┐   │
│  │                          │   │
│  │  居中，max-w-[1120px]     │   │
│  │  mx-auto                 │   │
│  │                          │   │
│  └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘

关键样式:
  背景: bg-[#03050b]
  容器: mx-auto max-w-[1120px] px-5
  头部: relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between
```

### 7.2 工作区页面 (Studio)

```
┌──────────────────────────────────────┐
│  TopBar: h-14, 3列网格                  │
│  bg-[#04070d]/95 + backdrop-blur-xl   │
├──────┬───────────────────────┬───────┤
│ Side │   Canvas/Workflow    │ Agent │
│ bar  │   flex-1             │ Panel │
│ 64px │                      │ 340px │
│      │   dotted-grid bg     │       │
│      │                      │       │
│      │   BottomToolbar      │       │
│      │   (浮动居中)         │       │
├──────┴───────────────────────┴───────┘

关键样式:
  AppShell: bg-studio-black (bg-[#050608])
  Sidebar:  bg-[#050811]/82 backdrop-blur-xl
  Agent:    bg-[#050811]/95 backdrop-blur-xl
```

### 7.3 列表页面 (Projects/Assets/Admin)

```
┌──────────────────────────────────────┐
│  TopBar (简化版, 含面包屑)            │
├──────────────────────────────────────┤
│                                      │
│  ┌── 筛选栏 ──────────────────┐      │
│  │  搜索框 + 标签按钮组         │      │
│  └────────────────────────────┘      │
│                                      │
│  ┌── 列表/网格 ────────────────┐     │
│  │  Card / Table Row           │     │
│  │  Card / Table Row           │     │
│  │  Card / Table Row           │     │
│  │  ...                        │     │
│  └────────────────────────────┘      │
│                                      │
│  分页 / 加载更多                      │
│                                      │
└──────────────────────────────────────┘

卡片样式:
  rounded-xl border border-white/10 bg-white/5
  hover:-translate-y-1 hover:border-cyan-100/25
  transition

表格样式(TODO: 新增):
  rounded-xl border border-white/10 bg-white/5
  行: border-b border-white/8
  表头: text-xs text-white/48 uppercase
```

---

## 八、交互规范

### 8.1 悬停态 (Hover)

| 元素 | 效果 |
|------|------|
| 导航链接 | `hover:text-cyan-100` |
| 工具栏按钮 | `hover:bg-cyan-100/10 hover:text-cyan-50` |
| FloatingButton | `hover:border-cyan-300/35 hover:bg-white/12` |
| 标签按钮 | `hover:border-cyan-300/30 hover:text-cyan-50` |
| 卡片 | `hover:-translate-y-1 hover:border-cyan-100/28` |
| 关闭按钮 | `hover:bg-white/8 hover:text-white` |
| 主要按钮 | `hover:bg-cyan-500` (从 `bg-cyan-600`) |

### 8.2 选中态 (Active/Selected)

| 元素 | 效果 |
|------|------|
| 模式切换按钮 | `bg-cyan-300/18 text-cyan-50 shadow-glow` |
| 对话框标签 | `bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30` |
| 画布卡片 | `border-cyan-300/45 shadow-glow` |
| 底部工具栏模式 | `border-cyan-300/35 bg-cyan-300/12` |

### 8.3 过渡动画

```css
/* 通用过渡 */
transition                    /* transition: all 0.15s ease */
transition-all                /* 所有属性过渡 */
.duration-200                /* 200ms 显式指定 */

/* 页面切换 (AppShell) */
duration-0.22s, opacity + scale

/* 图标旋转 */
group-hover:rotate-90        /* + 号图标 */

/* 组内渐显 */
opacity-0 group-hover:opacity-100   /* 卡片操作栏 */

/* 加载旋转 */
animate-spin                 /* Loader2 图标 */
```

### 8.4 键盘快捷键

| 按键 | 功能 |
|------|------|
| `C` | 打开 Copilot 面板 |
| `N` | 新建画布对象 |
| `Delete` | 删除选中对象 |
| `Ctrl/Cmd + S` | 保存项目 |

---

## 九、图标使用规范

所有图标来自 **Lucide Icons** (当前 `lucide-react`，Vue 迁移后使用 `lucide-vue-next`)。

| 场景 | 推荐图标 |
|------|----------|
| 应用 Logo | `Navigation` / `Compass` |
| AI / 智能 | `Sparkles` / `WandSparkles` / `Zap` |
| 图像 | `ImageIcon` / `ImagePlus` |
| 视频 | `Video` / `Clapperboard` / `FileVideo` |
| 文本 | `FileText` |
| 工作流 | `Workflow` / `Boxes` |
| 添加 | `Plus` |
| 设置 | `Settings` / `Sliders` |
| 搜索 | `Search` |
| 用户 | `User` / `Crown` |
| 语言 | `Globe2` |
| 通知 | `Bell` |
| 主题 | `Moon` / `Sun` |
| 分享 | `Share2` |
| 删除 | `Trash2` |
| 复制 | `Copy` |
| 关闭 | `X` |
| 发送 | `Send` |
| 加载 | `Loader2` (需配合 `animate-spin`) |
| 成功 | `CheckCircle2` |
| 返回 | `ArrowLeft` / `ArrowRight` |
| 历史 | `Clock3` |
| 层级 | `Layers3` |
| 帮助 | `CircleHelp` |
| 全屏 | `Maximize2` |
| 撤销 | `Undo2` |
| 重做 | `Redo2` |
| 链接 | `Link2` |
| 密钥 | `KeyRound` |
| 拖拽 | `Grip` |
| 移动 | `Move` |
| 选择 | `MousePointer2` |
| 火 (火山引擎) | `Flame` |
| 地图 | `Map` / `Compass` |

---

## 十、中英双语规范

### 10.1 格式

所有用户可见标签使用 **中文 / English** 格式，中间空格 + 斜杆 + 空格。

```
"设置 / Settings"
"保存 / Save"
"星图画布 / Star Map"
```

### 10.2 翻译对照表 (常用)

| 中文 | English |
|------|---------|
| 首页 | Home |
| 产品 | Product |
| 星图画布 | Star Map / Canvas |
| 工作流 | Workflow |
| 节点工作流 | Node Workflow |
| 模板 | Templates |
| 探索 | Explore |
| 设置 | Settings |
| 通知 | Notifications |
| 保存 | Save |
| 已保存 | Saved |
| 删除 | Delete |
| 复制 | Duplicate |
| 分享 | Share |
| 帮助 | Help |
| 搜索 | Search |
| 全部 | All |
| 添加 | Add |
| 新建 | New |
| 生成 | Generate |
| 运行 | Run |
| 成功 | Success |
| 失败 | Failed |
| 排队 | Queued |
| 运行中 | Running |
| 待运行 | Idle |
| 未配置 | Not configured |
| 已配置 | Configured |
| 中 | CN |
| EN | EN |

---

## 十一、Nuxt 3 模板参考

### 11.1 页面模板

```vue
<!-- pages/xxx/index.vue 新建页面模板 -->
<template>
  <main class="min-h-screen bg-[#03050b] text-white">
    <div class="mx-auto max-w-[1120px] px-5 py-8">
      <!-- 页面标题区 -->
      <div class="mb-8">
        <div class="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/8 px-4 py-2 text-xs text-cyan-100">
          <Icon name="..." class="size-4" />
          页面标识 / Page Label
        </div>
        <h1 class="mt-4 text-3xl font-semibold">页面标题 / Page Title</h1>
        <p class="mt-2 text-sm text-white/52">页面描述文字 / Page description</p>
      </div>

      <!-- 筛选栏 (如需要) -->
      <div class="mb-6 flex items-center gap-4">
        <label class="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">
          <Search class="size-4" />
          <input class="w-full bg-transparent outline-none placeholder:text-white/32" placeholder="搜索 / Search" />
        </label>
        <div class="flex flex-wrap gap-2">
          <button class="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white/66 transition hover:border-cyan-300/30 hover:text-white">
            全部 / All
          </button>
        </div>
      </div>

      <!-- 内容区: 列表/网格/表单 -->
      <div class="grid gap-4 md:grid-cols-3">
        <!-- 卡片内容 -->
      </div>
    </div>
  </main>
</template>
```

### 11.2 对话框模板

```vue
<!-- components/xxx/SomeDialog.vue 对话框模板 -->
<template>
  <div v-if="open" class="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
    <aside class="h-full w-full max-w-[520px] border-l border-white/10 bg-[#1b1c1f] text-white shadow-2xl">
      <!-- 头部 -->
      <div class="flex h-16 items-center justify-between border-b border-white/8 px-6">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-cyan-500/12 text-cyan-200">
            <Zap class="size-5" />
          </div>
          <div>
            <h2 class="text-lg font-semibold">标题 / Title</h2>
            <p class="text-xs text-white/40">副标题 / Subtitle</p>
          </div>
        </div>
        <button @click="close" class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white">
          <X class="size-4" />
        </button>
      </div>

      <!-- 内容 -->
      <div class="p-5">
        <div class="rounded-xl border border-white/8 bg-black/16 p-4">
          <!-- 表单内容 -->
        </div>
      </div>
    </aside>
  </div>
</template>
```

### 11.3 管理后台列表页模板

```vue
<!-- pages/admin/xxx.vue 管理后台列表模板 -->
<template>
  <main class="min-h-screen bg-[#03050b] text-white">
    <div class="mx-auto max-w-[1400px] px-6 py-8">
      <!-- 标题+操作 -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold">管理标题 / Admin Title</h1>
          <p class="mt-1 text-sm text-white/52">管理描述 / Admin description</p>
        </div>
        <button class="inline-flex h-9 items-center gap-2 rounded-lg bg-cyan-600 px-4 text-sm text-white hover:bg-cyan-500">
          <Plus class="size-4" />新建 / Create
        </button>
      </div>

      <!-- 表格 -->
      <div class="rounded-xl border border-white/10 bg-white/5">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/8 text-xs text-white/48 uppercase">
              <th class="px-4 py-3 text-left">列头 / Column</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-white/8 text-sm text-white/72 hover:bg-white/5">
              <td class="px-4 py-3">数据 / Data</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 (如需) -->
      <div class="mt-6 flex items-center justify-center gap-2 text-sm text-white/55">
        <FloatingButton>上一页 / Prev</FloatingButton>
        <span class="px-2">1 / 10</span>
        <FloatingButton>下一页 / Next</FloatingButton>
      </div>
    </div>
  </main>
</template>
```

---

## 十二、新增页面清单 (按模块)

以下列出企业级方案中所有新增页面，每个页面均应遵循上述规范：

### 12.1 公开页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 登录 | `/login` | 账号密码登录表单 |
| 注册 | `/register` | 用户注册表单 |

### 12.2 用户页面 (需认证)

| 页面 | 路由 | 说明 |
|------|------|------|
| 项目列表 | `/projects` | 用户所有项目网格列表 |
| 项目详情 | `/projects/[id]` | 单个项目预览与编辑入口 |
| 素材库 | `/assets` | 用户上传的所有素材 |
| 个人设置 | `/settings` | 个人资料修改 |
| 点数中心 | `/credits` | 点数明细与充值 |

### 12.3 管理后台 (Admin)

| 页面 | 路由 | 说明 |
|------|------|------|
| 仪表盘 | `/admin/dashboard` | 运营数据总览 |
| 用户管理 | `/admin/users` | 用户列表、搜索、禁封 |
| 项目管理 | `/admin/projects` | 全平台项目审核 |
| 模板管理 | `/admin/templates` | 官方模板发布/编辑 |
| AI 供应商 | `/admin/providers` | 全局 AI 供应商配置 |
| 系统设置 | `/admin/settings` | 系统参数配置 |
| 操作日志 | `/admin/logs` | 管理员操作审计日志 |

---

## 十三、设计检查清单

新增页面/组件开发完成后，按以下清单自检：

- [ ] 背景色使用 `bg-[#03050b]` 或 `bg-studio-black`
- [ ] 面板使用 `bg-white/6` + `backdrop-blur-xl` + `border border-white/10` 玻璃质感
- [ ] 交互色使用青色 `studio-cyan` / `#66E4FF`
- [ ] 文字透明度符合层级规范 (92 / 72 / 55 / 45 / 38 / 25)
- [ ] 圆角使用 `rounded-lg`(8px) / `rounded-xl`(12px) / `rounded-2xl`(16px)
- [ ] 所有标签中英双语，格式为 `"中文 / English"`
- [ ] 图标来自 Lucide，尺寸统一 `size-3.5`(14px) / `size-4`(16px) / `size-5`(20px)
- [ ] 悬停态有青色反馈 (`hover:text-cyan-100` / `hover:border-cyan-300/35`)
- [ ] 输入框 Focus 态有青色边框 (`focus:border-cyan-400/60`)
- [ ] 按钮高度统一 (h-9=36px / h-11=44px)
- [ ] 页面最大宽度 `max-w-[1120px]` / 管理后台 `max-w-[1400px]`
- [ ] 响应式：至少 md (768px) 断点适配
