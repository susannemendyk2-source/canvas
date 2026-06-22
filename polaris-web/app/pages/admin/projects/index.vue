<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">项目审核 / Project Review</h1>
      <p class="mt-1 text-sm text-white/45">审核和管理平台项目 / Review and manage projects</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <button v-for="s in statusFilters" :key="s" @click="activeStatus = s" :class="['rounded-full border px-3 py-1.5 text-xs transition', activeStatus === s ? 'border-cyan-300/30 bg-cyan-100/10 text-white' : 'border-white/10 bg-white/6 text-white/66 hover:border-cyan-300/30 hover:text-white']">
        {{ s }}
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/8 text-left text-xs text-white/45">
            <th class="px-4 py-3 font-medium">ID</th>
            <th class="px-4 py-3 font-medium">项目名称 / Name</th>
            <th class="px-4 py-3 font-medium">创建者 / Owner</th>
            <th class="px-4 py-3 font-medium">模式 / Mode</th>
            <th class="px-4 py-3 font-medium">状态 / Status</th>
            <th class="px-4 py-3 font-medium">创建时间 / Created</th>
            <th class="px-4 py-3 font-medium">操作 / Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in filteredProjects" :key="project.id" class="border-b border-white/5 transition hover:bg-white/5">
            <td class="px-4 py-3 text-white/60">{{ project.id }}</td>
            <td class="px-4 py-3 font-medium">{{ project.name }}</td>
            <td class="px-4 py-3 text-white/60">{{ project.owner || project.username }}</td>
            <td class="px-4 py-3 text-xs text-white/45 uppercase">{{ project.mode }}</td>
            <td class="px-4 py-3">
              <span :class="['rounded-full px-2 py-0.5 text-[11px]', statusClass(project.status)]">
                {{ statusLabel(project.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-white/45 text-xs">{{ project.createdAt }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button v-if="project.status === 0" @click="updateStatus(project, 1)" class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/60 hover:text-white">审批 / Approve</button>
                <button v-if="project.status === 1 || project.status === 0" @click="updateStatus(project, 2)" class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-amber-300/60 hover:text-amber-300">驳回 / Reject</button>
                <button @click="publishAsTemplate(project)" class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-cyan-300/60 hover:text-cyan-300">模板 / Template</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeStatus = ref('全部 / All')
const statusFilters = ['全部 / All', '待审核 / Pending', '已通过 / Approved', '已驳回 / Rejected']

interface AdminProject {
  id: number
  name: string
  owner?: string
  username?: string
  mode: string
  status: number
  createdAt: string
}

const projects = ref<AdminProject[]>([])

const filteredProjects = computed(() => {
  if (activeStatus.value === '全部 / All') return projects.value
  const idx = statusFilters.indexOf(activeStatus.value)
  return projects.value.filter((p) => p.status === idx - 1)
})

function statusClass(status: number) {
  if (status === 0) return 'bg-amber-500/12 text-amber-300'
  if (status === 1) return 'bg-emerald-500/12 text-emerald-300'
  return 'bg-white/8 text-white/45'
}

function statusLabel(status: number) {
  if (status === 0) return '待审核 / Pending'
  if (status === 1) return '已通过 / Approved'
  return '已驳回 / Rejected'
}

function updateStatus(project: AdminProject, status: number) {
  project.status = status
}

function publishAsTemplate(project: AdminProject) {
  alert(`项目 "${project.name}" 已发布为模板`)
}

onMounted(async () => {
  try {
    const { adminService } = await import('~/services/adminService')
    const res: any = await adminService.listProjects({})
    projects.value = res.data || res || []
  } catch {
    projects.value = []
  }
})
</script>
