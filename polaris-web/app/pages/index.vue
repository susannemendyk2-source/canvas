<template>
  <main class="polaris-shell relative min-h-screen overflow-hidden text-white">
    <div class="starfield pointer-events-none absolute inset-0 opacity-55" />
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(143,234,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(143,234,255,.035)_1px,transparent_1px)] bg-[size:72px_72px]" />

    <header class="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="grid size-10 place-items-center rounded-full border border-cyan-100/30 bg-cyan-100/10 shadow-[0_0_32px_rgba(143,234,255,.18)]">
          <Compass class="size-5 text-cyan-100" />
        </div>
        <div>
          <div class="text-base font-semibold tracking-wide">POLARIS</div>
          <div class="text-[10px] uppercase tracking-[0.34em] text-cyan-100/54">AI Creation OS</div>
        </div>
      </NuxtLink>

      <nav class="hidden items-center gap-7 text-sm text-white/54 lg:flex">
        <NuxtLink v-for="item in navItems" :key="item.label" :to="item.to" class="transition hover:text-cyan-100">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink to="/credits" class="hidden h-9 items-center gap-1.5 rounded-full border border-cyan-100/14 bg-white/6 px-3 text-xs text-white/66 transition hover:border-cyan-100/34 hover:text-cyan-50 md:inline-flex">
          <Crown class="size-3.5 text-[#c7a76b]" />
          {{ t('会员积分', 'Credits') }}
        </NuxtLink>
        <button class="grid h-9 min-w-11 place-items-center rounded-full border border-cyan-100/14 bg-white/6 px-3 text-xs text-white/66 transition hover:border-cyan-100/34 hover:text-cyan-50" @click="settingsStore.toggleLanguage()">
          {{ settingsStore.language.toUpperCase() }}
        </button>
        <button class="grid size-9 place-items-center rounded-full border border-cyan-100/14 bg-white/6 text-white/66 transition hover:border-cyan-100/34 hover:text-cyan-50" @click="handleThemeToggle">
          <Sun v-if="settingsStore.theme === 'light'" class="size-4" />
          <Moon v-else class="size-4" />
        </button>
        <NuxtLink :to="authStore.isAuthenticated ? '/profile' : '/login'" class="grid size-9 place-items-center rounded-full bg-cyan-100 text-xs font-bold text-[#030814]">
          {{ authStore.isAuthenticated ? userInitial : 'P' }}
        </NuxtLink>
      </div>
    </header>

    <section class="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-[1.04fr_.96fr]">
      <div class="max-w-3xl">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-100/18 bg-cyan-100/8 px-4 py-2 text-xs text-cyan-50/82">
          <Sparkles class="size-4 text-cyan-100" />
          {{ t('面向 AI 视频创作的星图式工作流系统', 'Star-map workflow system for AI video creation') }}
        </div>

        <h1 class="text-4xl font-semibold leading-tight tracking-normal text-[#e8eef5] md:text-6xl">
          {{ t('向北极星校准你的 AI 创作流程', 'Align your AI creative workflow with Polaris') }}
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-8 text-white/58">
          {{ t('从灵感、提示词、素材、图像、视频到成片，Polaris 将创作流程组织成一张可视化、可执行的星图。', 'From intent, prompts, assets, images and video to final output, Polaris organizes creation into an executable visual star map.') }}
        </p>

        <GoalComposer />

        <div class="mt-7 flex flex-wrap items-center gap-3">
          <button class="h-11 rounded-full bg-cyan-100 px-5 text-sm font-semibold text-[#030814] transition hover:bg-white" @click="handleNewProject">
            {{ t('进入 Polaris', 'Enter Polaris') }}
          </button>
          <NuxtLink to="/studio" class="h-11 rounded-full border border-cyan-100/18 bg-white/6 px-5 py-3 text-sm text-white/72 transition hover:border-cyan-100/38 hover:text-cyan-50">
            {{ t('打开星图画布', 'Open Star Map Canvas') }}
          </NuxtLink>
        </div>

        <div class="mt-12 grid gap-3 md:grid-cols-3">
          <NuxtLink
            v-for="entry in entryCards"
            :key="entry.title"
            to="/studio"
            class="polaris-card group relative min-h-40 overflow-hidden rounded-xl p-4 transition duration-300 hover:-translate-y-1"
          >
            <div class="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/45 to-transparent opacity-0 transition group-hover:opacity-100" />
            <component :is="entry.icon" class="mb-5 size-5 text-cyan-100" />
            <h3 class="text-sm font-semibold text-white/90">{{ entry.title }}</h3>
            <p class="mt-2 text-xs leading-5 text-white/50">{{ entry.subtitle }}</p>
          </NuxtLink>
        </div>
      </div>

      <div class="relative mx-auto grid w-full max-w-[520px] place-items-center">
        <div class="orbit-sphere w-full max-w-[440px]">
          <div class="absolute inset-[31%] rounded-full border border-cyan-100/18 bg-[#07111f]/80 shadow-[inset_0_0_50px_rgba(143,234,255,.12)]" />
          <div class="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-100/24 bg-cyan-100/10">
            <Compass class="size-9 text-cyan-100" />
          </div>
          <div class="absolute -right-5 top-20 rounded-full border border-[#c7a76b]/24 bg-[#c7a76b]/8 px-3 py-1.5 text-[11px] text-[#eadbb7]">North Star</div>
          <div class="absolute -left-7 bottom-24 rounded-full border border-cyan-100/18 bg-cyan-100/8 px-3 py-1.5 text-[11px] text-cyan-50/80">Route online</div>
        </div>

        <div class="polaris-card mt-8 w-full rounded-xl p-4">
          <div class="mb-3 flex items-center justify-between text-xs text-white/44">
            <span>{{ t('创作航线预览', 'Route Preview') }}</span>
            <span class="text-cyan-100">86%</span>
          </div>
          <div class="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
            <RoutePill label="Prompt" />
            <div class="h-px bg-cyan-100/24" />
            <RoutePill label="Image" />
            <div class="h-px bg-cyan-100/24" />
            <RoutePill label="Video" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { Clapperboard, Compass, Crown, FileText, GitBranch, Moon, Sparkles, Sun } from 'lucide-vue-next'
import GoalComposer from '~/components/home/GoalComposer.vue'
import { useAuthStore } from '~/stores/authStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { projectService } from '~/services/projectService'

const RoutePill = defineComponent({
  props: { label: { type: String, required: true } },
  template: '<div class="rounded-lg border border-cyan-100/14 bg-white/6 px-3 py-2 text-center text-xs text-white/72">{{ label }}</div>'
})

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const userInitial = computed(() => {
  const name = authStore.user?.nickname || authStore.user?.username || 'P'
  return name.charAt(0).toUpperCase()
})

const navItems = computed(() => [
  { label: t('产品', 'Product'), to: '/' },
  { label: t('星图画布', 'Star Map'), to: '/studio' },
  { label: t('工作流', 'Workflow'), to: '/studio?mode=workflow' },
  { label: t('模板', 'Templates'), to: '/admin/templates' },
  { label: t('探索', 'Explore'), to: '/projects' }
])

const entryCards = computed(() => [
  { title: 'Polaris Brief', subtitle: t('把一个想法整理成完整创作方案', 'Turn an idea into a complete creative brief'), icon: FileText },
  { title: t('星图工作流', 'Star Map Workflow'), subtitle: t('连接 Prompt、图像、视频与素材节点', 'Connect prompt, image, video and asset nodes'), icon: GitBranch },
  { title: 'North Star Render', subtitle: t('输出海报、短片与品牌视觉资产', 'Render posters, short films and brand assets'), icon: Clapperboard }
])

async function handleNewProject() {
  try {
    const project: any = await projectService.create({
      name: t('新星图项目', 'New Star Map'),
      mode: 'magic-canvas',
      description: ''
    })
    const id = project.id || project?.data?.id
    if (id) {
      if (import.meta.client) localStorage.setItem('polaris.activeProject', String(id))
      navigateTo(`/studio?pid=${id}`)
      return
    }
  } catch {}
  navigateTo('/studio')
}

function handleThemeToggle() {
  settingsStore.toggleTheme()
  document.documentElement.classList.toggle('light', settingsStore.theme === 'light')
}

onMounted(() => {
  settingsStore.init()
})
</script>
