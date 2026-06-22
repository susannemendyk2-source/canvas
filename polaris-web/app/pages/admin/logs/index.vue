<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">操作日志 / Operation Logs</h1>
      <p class="mt-1 text-sm text-white/45">查看系统操作记录 / View system operation records</p>
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <label class="flex h-10 w-full max-w-sm items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">
        <Search class="size-4" />
        <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" placeholder="搜索日志 / Search logs" />
      </label>
      <input v-model="dateFrom" type="date" class="h-10 rounded-lg border border-white/10 bg-white/6 px-3 text-xs text-white/72" />
      <span class="text-xs text-white/35">至 / to</span>
      <input v-model="dateTo" type="date" class="h-10 rounded-lg border border-white/10 bg-white/6 px-3 text-xs text-white/72" />
    </div>

    <div class="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/8 text-left text-xs text-white/45">
            <th class="px-4 py-3 font-medium">ID</th>
            <th class="px-4 py-3 font-medium">用户 / User</th>
            <th class="px-4 py-3 font-medium">操作 / Action</th>
            <th class="px-4 py-3 font-medium">详情 / Detail</th>
            <th class="px-4 py-3 font-medium">IP</th>
            <th class="px-4 py-3 font-medium">时间 / Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id" class="border-b border-white/5 transition hover:bg-white/5">
            <td class="px-4 py-3 text-white/60">{{ log.id }}</td>
            <td class="px-4 py-3">{{ log.username || log.user }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-white/60">{{ log.action }}</span>
            </td>
            <td class="px-4 py-3 text-white/60 text-xs max-w-xs truncate">{{ log.detail || log.remark }}</td>
            <td class="px-4 py-3 text-white/45 text-xs">{{ log.ip }}</td>
            <td class="px-4 py-3 text-white/45 text-xs">{{ log.createdAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')

interface LogEntry {
  id: number
  username?: string
  user?: string
  action: string
  detail?: string
  remark?: string
  ip: string
  createdAt: string
}

const logs = ref<LogEntry[]>([])

const filteredLogs = computed(() => {
  let result = logs.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((l) => l.action.toLowerCase().includes(q) || l.username?.toLowerCase().includes(q) || l.detail?.toLowerCase().includes(q))
  }
  return result
})

onMounted(async () => {
  try {
    const { adminService } = await import('~/services/adminService')
    const res: any = await adminService.logs({})
    logs.value = res.data || res || []
  } catch {
    logs.value = []
  }
})
</script>
