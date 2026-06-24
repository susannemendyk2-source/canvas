<template>
  <main class="mx-auto max-w-7xl px-6 py-8">
    <section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">{{ t('工作区', 'Workspace') }}</p>
        <h1 class="mt-2 text-2xl font-semibold text-white">{{ t('我的项目', 'My Projects') }}</h1>
        <p class="mt-1 text-sm text-white/45">{{ t('管理星图画布、节点工作流和生成任务。', 'Manage star maps, workflows and generation tasks.') }}</p>
      </div>
      <NuxtLink to="/studio" class="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white">
        <Plus class="size-4" />
        {{ t('新建项目', 'New Project') }}
      </NuxtLink>
    </section>

    <section class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <label class="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">
        <Search class="size-4" />
        <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" :placeholder="t('搜索项目', 'Search projects')" />
      </label>
      <div class="flex flex-wrap gap-2">
        <button v-for="tag in filterTags" :key="tag.value" class="rounded-full border px-3 py-1.5 text-xs transition" :class="activeFilter === tag.value ? 'border-cyan-300/30 bg-cyan-100/10 text-white' : 'border-white/10 bg-white/6 text-white/60 hover:text-white'" @click="activeFilter = tag.value">
          {{ tag.label }}
        </button>
      </div>
    </section>

    <section v-if="filteredProjects.length === 0" class="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] py-20 text-white/35">
      <FolderKanban class="mb-3 size-12" />
      <p class="text-sm">{{ t('暂无项目', 'No projects yet') }}</p>
    </section>

    <section v-else class="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
      <NuxtLink v-for="project in filteredProjects" :key="project.id" :to="`/projects/${project.id}`" class="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-cyan-100/25 hover:bg-white/[0.06]">
        <div class="mb-3 flex items-start justify-between gap-3">
          <h3 class="line-clamp-2 font-semibold text-white">{{ project.name || project.title || t('未命名项目', 'Untitled Project') }}</h3>
          <span class="shrink-0 rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] uppercase text-white/50">{{ modeLabel(project.mode || project.type) }}</span>
        </div>
        <p class="mb-4 line-clamp-2 min-h-8 text-xs text-white/45">{{ project.description || t('暂无描述', 'No description') }}</p>
        <div class="flex items-center justify-between text-[11px] text-white/35">
          <span>{{ project.savedAt || project.updatedAt || project.createdAt || '-' }}</span>
          <ChevronRight class="size-4" />
        </div>
      </NuxtLink>
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
  { value: 'image', label: t('图片', 'Image') },
  { value: 'video', label: t('视频', 'Video') },
])

const filteredProjects = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return projects.value.filter((project) => {
    const text = `${project.name || ''} ${project.title || ''} ${project.description || ''}`.toLowerCase()
    const mode = `${project.mode || project.type || ''}`.toLowerCase()
    const matchQuery = !q || text.includes(q)
    const matchFilter = activeFilter.value === 'all' || mode.includes(activeFilter.value)
    return matchQuery && matchFilter
  })
})

onMounted(async () => {
  settingsStore.init()
  try {
    const res: any = await projectService.list({})
    projects.value = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || []
  } catch {
    projects.value = []
  }
})

function modeLabel(mode?: string) {
  const value = (mode || 'magic').toLowerCase()
  if (value.includes('workflow')) return t('工作流', 'Workflow')
  if (value.includes('image')) return t('图片', 'Image')
  if (value.includes('video')) return t('视频', 'Video')
  return t('星图', 'Star')
}
</script>
