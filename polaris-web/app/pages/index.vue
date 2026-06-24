<template>
  <main class="min-h-screen overflow-hidden bg-[#03050b] text-white">
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
          <NuxtLink v-for="item in navItems" :key="item.label" :to="item.to" class="transition hover:text-cyan-100">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 text-xs text-white/58">
          <NuxtLink to="/credits" class="hidden rounded-full border border-white/10 bg-white/6 px-3 py-1.5 md:inline-flex">
            <Crown class="mr-1 size-3.5 text-cyan-100" />
            {{ t('积分', 'Credits') }}
          </NuxtLink>
          <button class="inline-flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/6 px-3 text-xs text-white/72 transition hover:border-cyan-200/35 hover:text-cyan-50" @click="settingsStore.toggleLanguage()">
            <Globe class="size-3.5" />
            {{ settingsStore.language.toUpperCase() }}
          </button>
          <NuxtLink v-if="!authStore.isAuthenticated" to="/login" class="grid size-9 place-items-center rounded-full bg-cyan-100 font-semibold text-[#061018]">
            P
          </NuxtLink>
          <NuxtLink v-else to="/studio" class="grid size-9 place-items-center rounded-full bg-gradient-to-br from-studio-cyan to-studio-violet text-xs font-bold text-white">
            {{ userInitial }}
          </NuxtLink>
        </div>
      </header>

      <div class="relative z-10 mx-auto max-w-[1120px] pt-10">
        <div class="text-center">
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/8 px-4 py-2 text-xs text-cyan-100">
            <Compass class="size-4" />
            {{ t('Polaris 指挥中心', 'Polaris Command Center') }}
          </div>
          <h1 class="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {{ t('把 AI 创作工作流对齐到一个北极星目标', 'Align your AI creative workflow to a north star') }}
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/52 md:text-base">
            {{ t('把一个想法转化为 Prompt、素材、画布卡片、Workflow 节点和生成结果，并集中在一个高效创作空间中。', 'Turn one idea into prompts, assets, canvas cards, workflow nodes and generated results on one focused creative workspace.') }}
          </p>
        </div>

        <GoalComposer />

        <div class="mx-auto mt-5 grid max-w-3xl place-items-center">
          <NuxtLink to="/studio" class="group grid h-28 w-28 place-items-center rounded-2xl border border-cyan-100/16 bg-white/6 text-sm text-white/78 transition hover:border-cyan-200/45 hover:bg-cyan-100/10">
            <span class="grid gap-2 text-center">
              <Plus class="mx-auto size-5 transition group-hover:rotate-90" />
              {{ t('新建项目', 'New Project') }}
            </span>
          </NuxtLink>
        </div>

        <section class="mt-16">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">{{ t('推荐路线', 'Recommended Routes') }}</h2>
            <NuxtLink to="/projects" class="text-xs text-white/44 hover:text-cyan-100">{{ t('查看全部', 'View all') }}</NuxtLink>
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
              <h2 class="text-xl font-semibold">{{ t('探索 Polaris 星图', 'Explore Polaris Maps') }}</h2>
              <p class="mt-2 text-sm text-white/45">{{ t('查找公开项目、模板和 Workflow 星座，为下一条创作路线做准备。', 'Find public projects, templates and workflow constellations for your next route.') }}</p>
            </div>
            <label class="flex h-10 w-full items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42 md:w-72">
              <Search class="size-4" />
              <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" :placeholder="t('搜索路线', 'Search routes')" />
            </label>
          </div>
          <div class="mb-5 flex flex-wrap gap-2">
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="rounded-full border px-3 py-1.5 text-xs transition"
              :class="activeFilter === filter.value ? 'border-cyan-300/30 bg-cyan-100/10 text-white' : 'border-white/10 bg-white/6 text-white/66 hover:border-cyan-300/30 hover:text-white'"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
          <div class="grid gap-4 md:grid-cols-4">
            <NuxtLink
              v-for="(item, index) in filteredExplore"
              :key="item.title"
              to="/studio"
              class="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-100/25"
            >
              <div :class="`relative h-36 bg-gradient-to-br ${item.tone}`">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,.18),transparent_28%)]" />
              </div>
              <div class="p-3">
                <div class="flex items-center gap-2 text-[11px] text-white/40">
                  <span class="grid size-5 place-items-center rounded-full bg-white/10">{{ index + 1 }}</span>
                  {{ t('星座', 'constellation') }}
                </div>
                <h3 class="mt-2 text-sm font-semibold">{{ item.title }}</h3>
                <p class="mt-1 line-clamp-1 text-xs text-white/45">{{ item.subtitle }}</p>
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
import { computed, onMounted, ref } from 'vue'
import { Compass, Crown, Globe, Map, Navigation, Plus, Search } from 'lucide-vue-next'
import GoalComposer from '~/components/home/GoalComposer.vue'
import { useAuthStore } from '~/stores/authStore'
import { useSettingsStore } from '~/stores/settingsStore'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const searchQuery = ref('')
const activeFilter = ref('All')

const userInitial = computed(() => {
  const name = authStore.user?.nickname || authStore.user?.username || ''
  return name ? name.charAt(0).toUpperCase() : 'P'
})

const navItems = computed(() => [
  { label: t('产品', 'Product'), to: '/' },
  { label: t('画布', 'Canvas'), to: '/studio' },
  { label: 'Workflow', to: '/studio?mode=workflow' },
  { label: t('模板', 'Templates'), to: '/admin/templates' },
  { label: t('探索', 'Explore'), to: '/projects' }
])

const missionCards = computed(() => [
  { title: 'Polaris Brief', subtitle: t('把一个想法对齐成可生产的创作路线。', 'Align one idea into a production route.'), metric: '01', tone: 'from-cyan-400/24 via-blue-500/18 to-indigo-800/24' },
  { title: 'Constellation Workflow', subtitle: t('映射 Prompt、图像、视频和输出节点。', 'Map prompts, images, video and output nodes.'), metric: '02', tone: 'from-violet-400/24 via-sky-500/16 to-slate-900/30' },
  { title: 'North Star Render', subtitle: t('生成短片、海报和品牌资产。', 'Generate films, posters and brand assets.'), metric: '03', tone: 'from-emerald-300/18 via-cyan-400/18 to-blue-950/35' }
])

const explore = computed(() => [
  { title: t('极光产品短片', 'Aurora Product Film'), subtitle: t('产品发布', 'Product launch'), tag: 'Video', tone: 'from-cyan-400/30 to-blue-950/60' },
  { title: t('轨道分镜', 'Orbit Storyboard'), subtitle: t('分镜路线', 'Storyboard route'), tag: 'Storyboard', tone: 'from-indigo-400/30 to-violet-950/60' },
  { title: t('深空海报', 'Deep Space Poster'), subtitle: t('品牌海报实验室', 'Brand poster lab'), tag: 'Image', tone: 'from-fuchsia-400/24 to-slate-950/60' },
  { title: t('信号短切', 'Signal Cutdown'), subtitle: t('短视频裁切', 'Short-form cutdown'), tag: 'Video', tone: 'from-emerald-300/24 to-cyan-950/60' },
  { title: t('角色锁定', 'Character Lock'), subtitle: t('角色一致性', 'Character consistency'), tag: 'Image', tone: 'from-blue-300/24 to-indigo-950/60' },
  { title: t('工作室档案', 'Studio Archive'), subtitle: t('素材档案', 'Asset archive'), tag: 'Team', tone: 'from-amber-300/20 to-slate-950/60' }
])

const filters = computed(() => [
  { value: 'All', label: t('全部', 'All') },
  { value: 'Star Map', label: t('星图', 'Star Map') },
  { value: 'Video', label: t('视频', 'Video') },
  { value: 'Image', label: t('图像', 'Image') },
  { value: 'Storyboard', label: t('分镜', 'Storyboard') },
  { value: 'Brand', label: t('品牌', 'Brand') },
  { value: 'Team', label: t('团队', 'Team') }
])

const filteredExplore = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return explore.value.filter((item) => {
    const matchesFilter = activeFilter.value === 'All' || item.tag === activeFilter.value
    const matchesQuery = !query || `${item.title} ${item.subtitle}`.toLowerCase().includes(query)
    return matchesFilter && matchesQuery
  })
})

onMounted(() => {
  settingsStore.init()
})
</script>
