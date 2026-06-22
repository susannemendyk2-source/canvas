<template>
  <div class="mx-auto max-w-7xl p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">我的项目 / My Projects</h1>
        <p class="mt-1 text-sm text-white/45">管理你的星图项目 / Manage your star map projects</p>
      </div>
      <NuxtLink to="/studio" class="flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white">
        <Plus class="size-4" />
        新建项目 / New Project
      </NuxtLink>
    </div>

    <div class="mb-5 flex items-center gap-3">
      <label class="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">
        <Search class="size-4" />
        <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" placeholder="搜索项目 / Search projects" />
      </label>
    </div>

    <div class="mb-5 flex flex-wrap gap-2">
      <button v-for="tag in filterTags" :key="tag" @click="activeFilter = tag" :class="['rounded-full border px-3 py-1.5 text-xs transition', activeFilter === tag ? 'border-cyan-300/30 bg-cyan-100/10 text-white' : 'border-white/10 bg-white/6 text-white/66 hover:border-cyan-300/30 hover:text-white']">
        {{ tag }}
      </button>
    </div>

    <div v-if="projects.length === 0" class="flex flex-col items-center justify-center py-20 text-white/35">
      <FolderKanban class="mb-3 size-12" />
      <p class="text-sm">暂无项目 / No projects yet</p>
    </div>

    <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      <NuxtLink
        v-for="project in filteredProjects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-cyan-100/25"
      >
        <div class="mb-3 flex items-start justify-between">
          <h3 class="font-semibold">{{ project.name }}</h3>
          <span class="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] uppercase text-white/50">{{ project.mode }}</span>
        </div>
        <p v-if="project.description" class="mb-4 line-clamp-2 text-xs text-white/45">{{ project.description }}</p>
        <p class="text-[11px] text-white/35">{{ project.savedAt || project.createdAt }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search, FolderKanban } from 'lucide-vue-next'

const searchQuery = ref('')
const activeFilter = ref('全部 / All')

const filterTags = ['全部 / All', '星图画布 / Star Map', '视频生成 / Video', '图片生成 / Image', '工作流 / Workflow']

interface ProjectItem {
  id: string
  name: string
  description?: string
  mode: string
  savedAt?: string
  createdAt?: string
}

const projects = ref<ProjectItem[]>([])

const filteredProjects = computed(() => {
  let result = projects.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)))
  }
  return result
})

onMounted(async () => {
  try {
    const { projectService } = await import('~/services/projectService')
    const res: any = await projectService.list({})
    projects.value = res.data || res || []
  } catch {
    projects.value = []
  }
})
</script>
