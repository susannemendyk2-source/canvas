<template>
  <main @click="handleNavClick" class="min-h-screen overflow-hidden bg-[#03050b] text-white">
    <section class="relative min-h-screen overflow-hidden px-5 pb-16">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(83,142,255,.20),transparent_28%),radial-gradient(circle_at_18%_22%,rgba(70,229,255,.12),transparent_24%),linear-gradient(180deg,#05070d_0%,#060912_52%,#03050b_100%)]" />
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div class="absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-cyan-200/10" />
      <div class="absolute left-1/2 top-32 h-[360px] w-[360px] -translate-x-1/2 rounded-full border border-indigo-200/10" />

      <header class="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow">
            <Navigation class="size-5 text-cyan-100" />
          </div>
          <div>
            <div class="text-lg font-semibold tracking-wide">Polaris</div>
            <div class="text-[11px] uppercase tracking-[0.32em] text-cyan-100/45">AI Creation OS</div>
          </div>
        </NuxtLink>

        <nav class="hidden items-center gap-6 text-sm text-white/52 lg:flex">
          <NuxtLink v-for="(item, i) in navItems" :key="item" :to="navLinks[i]" class="transition hover:text-cyan-100">
            {{ item }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 text-xs text-white/58">
          <span class="hidden items-center gap-1 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 sm:flex">
            <Globe2 class="size-3.5" />
            中 / EN
          </span>
          <span class="hidden rounded-full border border-white/10 bg-white/6 px-3 py-1.5 md:inline-flex">
            <Crown class="mr-1 size-3.5 text-cyan-100" />
            会员中心 3,520
          </span>
          <button class="grid size-8 place-items-center rounded-full border border-white/10 bg-white/6">
            <Moon class="size-4" />
          </button>
          <button class="grid size-8 place-items-center rounded-full border border-white/10 bg-white/6">
            <Bell class="size-4" />
          </button>
          <NuxtLink to="/login" class="grid size-9 place-items-center rounded-full bg-cyan-100 font-semibold text-[#061018]">
            P
          </NuxtLink>
        </div>
      </header>

      <div class="relative z-10 mx-auto max-w-[1120px] pt-10">
        <div class="text-center">
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/8 px-4 py-2 text-xs text-cyan-100">
            <Compass class="size-4" />
            Polaris Command Center · 北极星创作中心          </div>
          <h1 class="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            向北极星校准你的 AI 创作流程
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/52 md:text-base">
            从一句灵感出发，Polaris 会把提示词、素材、节点工作流和生成结果组织成清晰的星图。Navigate prompts, assets, workflows and renders on one intelligent canvas.
          </p>
        </div>

        <GoalComposer />

        <div class="mx-auto mt-5 grid max-w-3xl place-items-center">
          <NuxtLink to="/studio" class="group grid h-28 w-28 place-items-center rounded-2xl border border-cyan-100/16 bg-white/6 text-sm text-white/78 transition hover:border-cyan-200/45 hover:bg-cyan-100/10">
            <span class="grid gap-2 text-center">
              <Plus class="mx-auto size-5 transition group-hover:rotate-90" />
              新建星图
              <span class="text-[11px] text-white/35">New Project</span>
            </span>
          </NuxtLink>
        </div>

        <section class="mt-16">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">推荐航线 / Recommended Routes</h2>
            <NuxtLink to="/studio" class="text-xs text-white/44 hover:text-cyan-100">
              查看全部 / View all
            </NuxtLink>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <NuxtLink
              v-for="item in missionCards"
              :key="item.title"
              to="/studio"
              :class="`group relative h-52 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-5 transition hover:-translate-y-1 hover:border-cyan-100/28`"
            >
              <div class="absolute right-5 top-5 text-5xl font-semibold text-white/8">{{ item.metric }}</div>
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_75%_36%,rgba(255,255,255,.18),transparent_25%)]" />
              <div class="relative flex h-full flex-col justify-end">
                <h3 class="text-base font-semibold">{{ item.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-white/58">{{ item.subtitle }}</p>
              </div>
            </NuxtLink>
          </div>
        </section>

        <section class="mt-12">
          <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 class="text-xl font-semibold">探索 Polaris 星图</h2>
              <p class="mt-2 text-sm text-white/45">从公开项目、模板和节点工作流里寻找下一条创作航线。Explore public projects, templates and workflow constellations.</p>
            </div>
            <label class="flex h-10 w-full items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42 md:w-72">
              <Search class="size-4" />
              <input class="w-full bg-transparent outline-none placeholder:text-white/32" placeholder="搜索星图 / Search routes" />
            </label>
          </div>
          <div class="mb-5 flex flex-wrap gap-2">
            <button v-for="filter in filters" :key="filter" class="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white/66 transition hover:border-cyan-300/30 hover:text-white">
              {{ filter }}
            </button>
          </div>
          <div class="grid gap-4 md:grid-cols-4">
            <NuxtLink
              v-for="(item, index) in explore"
              :key="item[0]"
              to="/studio"
              class="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-100/25"
            >
              <div :class="`relative h-36 bg-gradient-to-br ${item[2]}`">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,.18),transparent_28%)]" />
              </div>
              <div class="p-3">
                <div class="flex items-center gap-2 text-[11px] text-white/40">
                  <span class="grid size-5 place-items-center rounded-full bg-white/10">{{ index + 1 }}</span>
                  constellation
                </div>
                <h3 class="mt-2 text-sm font-semibold">{{ item[0] }}</h3>
                <p class="mt-1 line-clamp-1 text-xs text-white/45">{{ item[1] }}</p>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>

      <div class="pointer-events-none fixed bottom-5 left-5 grid size-9 place-items-center rounded-full border border-cyan-100/18 bg-black/50 text-sm">
        <Map class="size-4 text-cyan-100" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Navigation, Globe2, Crown, Moon, Bell, Compass, Plus, Search, Map } from 'lucide-vue-next'
import GoalComposer from '~/components/home/GoalComposer.vue'

function handleNavClick(e: MouseEvent) {
  const anchor = (e.target as HTMLElement).closest('a[href^="/"]')
  if (anchor) {
    const href = anchor.getAttribute('href')
    if (href && href.startsWith('/')) {
      e.preventDefault()
      navigateTo(href)
    }
  }
}

const navItems = ['产品 / Product', '星图画布 / Canvas', '工作流 / Workflow', '模板 / Templates', '探索 / Explore']
const navLinks = ['/', '/studio', '/studio?mode=workflow', '/admin/templates', '/projects']

const missionCards = [
  {
    title: 'Polaris Brief',
    subtitle: '把一句想法校准成完整创作航线 / Align one idea into a production route',
    metric: '01',
    tone: 'from-cyan-400/24 via-blue-500/18 to-indigo-800/24'
  },
  {
    title: 'Constellation Workflow',
    subtitle: '提示词、图像、视频与输出节点自动成图 / Map prompts, images, video and output nodes',
    metric: '02',
    tone: 'from-violet-400/24 via-sky-500/16 to-slate-900/30'
  },
  {
    title: 'North Star Render',
    subtitle: '稳定生成短片、海报和品牌素材 / Generate films, posters and brand assets',
    metric: '03',
    tone: 'from-emerald-300/18 via-cyan-400/18 to-blue-950/35'
  }
]

const explore = [
  ['Aurora Product Film', '电商新品发布 / Product launch', 'from-cyan-400/30 to-blue-950/60'],
  ['Orbit Storyboard', '分镜脚本生成 / Storyboard route', 'from-indigo-400/30 to-violet-950/60'],
  ['Deep Space Poster', '品牌海报实验 / Brand poster lab', 'from-fuchsia-400/24 to-slate-950/60'],
  ['Signal Cutdown', '短视频混剪 / Short-form cutdown', 'from-emerald-300/24 to-cyan-950/60'],
  ['Character Lock', '角色一致性 / Character consistency', 'from-blue-300/24 to-indigo-950/60'],
  ['Studio Archive', '素材库管理 / Asset archive', 'from-amber-300/20 to-slate-950/60']
]

const filters = ['全部 / All', '星图画布 / Star Map', '视频生成 / Video', '图片生成 / Image', '分镜 / Storyboard', '品牌 / Brand', '电商 / Commerce', '团队 / Team']
</script>
