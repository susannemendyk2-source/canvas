<template>
  <main class="polaris-shell min-h-screen px-6 py-8 text-white">
    <section class="mx-auto max-w-7xl">
      <div class="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/65">Project Command</p>
          <h1 class="mt-3 text-3xl font-semibold text-white md:text-4xl">{{ t('项目指挥舱', 'Project Command') }}</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            {{ t('管理星图画布、节点工作流、输出资产与协作进度，让每个 AI 视频项目都有清晰航线。', 'Manage star maps, node workflows, output assets and collaboration progress for every AI video project.') }}
          </p>
        </div>
        <NuxtLink to="/studio" class="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white hover:shadow-[0_0_28px_rgba(143,234,255,.35)]">
          <Plus class="size-4" />
          {{ t('新建星图项目', 'New Project') }}
        </NuxtLink>
      </div>

      <section class="mb-6 grid gap-3 md:grid-cols-4">
        <div v-for="metric in metrics" :key="metric.label" class="polaris-card p-4">
          <p class="text-xs text-white/38">{{ metric.label }}</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ metric.value }}</p>
          <p class="mt-1 text-xs text-cyan-100/55">{{ metric.hint }}</p>
        </div>
      </section>

      <section class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label class="flex h-11 w-full max-w-md items-center gap-2 rounded-full border border-cyan-100/14 bg-white/6 px-4 text-sm text-white/42 backdrop-blur">
          <Search class="size-4" />
          <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" :placeholder="t('搜索项目或创作目标', 'Search projects or creative goals')" />
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in filterTags"
            :key="tag.value"
            class="rounded-full border px-3 py-1.5 text-xs transition"
            :class="activeFilter === tag.value ? 'border-cyan-200/40 bg-cyan-100/12 text-cyan-50' : 'border-white/10 bg-white/6 text-white/60 hover:border-cyan-100/22 hover:text-white'"
            @click="activeFilter = tag.value"
          >
            {{ tag.label }}
          </button>
        </div>
      </section>

      <section v-if="filteredProjects.length === 0" class="polaris-card flex flex-col items-center justify-center py-20 text-white/40">
        <FolderKanban class="mb-3 size-12 text-cyan-100/55" />
        <p class="text-sm">{{ t('暂无项目', 'No projects yet') }}</p>
      </section>

      <section v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink v-for="project in filteredProjects" :key="project.id" :to="`/projects/${project.id}`" class="polaris-card group p-5 transition hover:-translate-y-0.5 hover:border-cyan-100/35">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="line-clamp-2 font-semibold text-white">{{ project.name || project.title || t('未命名项目', 'Untitled Project') }}</h3>
              <p class="mt-1 text-xs uppercase tracking-[0.12em] text-cyan-100/45">{{ modeLabel(project.mode || project.type) }}</p>
            </div>
            <ChevronRight class="size-4 shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-cyan-100" />
          </div>
          <p class="mb-5 line-clamp-2 min-h-10 text-xs leading-5 text-white/45">{{ project.description || t('项目 Brief、星图节点与输出资产将在这里统一管理。', 'Project brief, star-map nodes and output assets are managed here.') }}</p>
          <div class="mb-4 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div class="h-full rounded-full bg-gradient-to-r from-cyan-100 to-blue-400" :style="{ width: `${progressFor(project)}%` }" />
          </div>
          <div class="flex items-center justify-between text-[11px] text-white/35">
            <span>{{ project.savedAt || project.updatedAt || project.createdAt || t('最近更新', 'Recently updated') }}</span>
            <span class="text-cyan-100/55">{{ progressFor(project) }}%</span>
          </div>
        </NuxtLink>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ChevronRight, FolderKanban, Plus, Search } from 'lucide-vue-next'
import { projectService } from '~/services/projectService'
import { useSettingsStore } from '~/stores/settingsStore'

interface ProjectItem {
  id: string | number
  name?: string
  title?: string
  description?: string
  mode?: string
  type?: string
  savedAt?: string
  updatedAt?: string
  createdAt?: string
}

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const searchQuery = ref('')
const activeFilter = ref('all')
const projects = ref<ProjectItem[]>([])

const filterTags = computed(() => [
  { value: 'all', label: t('全部', 'All') },
  { value: 'magic', label: t('星图画布', 'Star Map') },
  { value: 'workflow', label: t('节点工作流', 'Workflow') },
  { value: 'image', label: t('图像', 'Image') },
  { value: 'video', label: t('视频', 'Video') },
])

const metrics = computed(() => [
  { label: t('星图项目', 'Star Maps'), value: projects.value.length || 4, hint: t('可执行创作航线', 'Executable routes') },
  { label: t('进行中', 'In Progress'), value: Math.max(1, Math.ceil((projects.value.length || 3) / 2)), hint: t('等待渲染或审核', 'Rendering or review') },
  { label: t('输出资产', 'Deliverables'), value: (projects.value.length || 4) * 6, hint: t('海报 / 短片 / 分镜', 'Poster / video / storyboard') },
  { label: t('团队协作', 'Collaboration'), value: '3', hint: t('活跃成员', 'Active members') },
])

const filteredProjects = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return projectRecords.value.filter((project) => {
    const text = `${project.name || ''} ${project.title || ''} ${project.description || ''}`.toLowerCase()
    const mode = `${project.mode || project.type || ''}`.toLowerCase()
    return (!q || text.includes(q)) && (activeFilter.value === 'all' || mode.includes(activeFilter.value))
  })
})

const projectRecords = computed(() => projects.value.length ? projects.value : seedProjects())

onMounted(async () => {
  settingsStore.init()
  try {
    const res: any = await projectService.list({})
    projects.value = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || []
  } catch {
    projects.value = []
  }
})

function seedProjects(): ProjectItem[] {
  return [
    { id: 'demo-video-route', name: t('15 秒新品发布短片', '15s Product Launch Film'), type: 'video workflow', description: t('从创意 Brief 到首帧、视频生成和输出审核的完整星图项目。', 'A complete route from creative brief to first frame, video generation and review.') },
    { id: 'demo-poster-map', name: t('品牌海报星图', 'Brand Poster Star Map'), type: 'image magic', description: t('用于品牌视觉、活动封面和社媒素材的一组图像生成节点。', 'Image nodes for brand visuals, campaign covers and social assets.') },
    { id: 'demo-storyboard', name: t('分镜脚本工作流', 'Storyboard Workflow'), type: 'workflow video', description: t('把故事目标拆成镜头，再连接图像和视频输出节点。', 'Break story goals into shots, then connect image and video outputs.') },
  ]
}

function modeLabel(mode?: string) {
  const value = (mode || 'magic').toLowerCase()
  if (value.includes('workflow')) return 'Workflow'
  if (value.includes('image')) return 'Image'
  if (value.includes('video')) return 'Video'
  return 'Star Map'
}

function progressFor(project: ProjectItem) {
  const id = String(project.id)
  return 48 + (id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 46)
}
</script>
