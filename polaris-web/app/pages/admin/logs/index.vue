<template>
  <main class="mx-auto max-w-7xl px-6 py-8">
    <PageHead :title="t('操作日志', 'Operation Logs')" :desc="t('查看登录、项目、积分和管理操作记录。', 'View login, project, credit and admin operation records.')" />
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <label class="flex h-10 w-full max-w-sm items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">
        <Search class="size-4" />
        <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" :placeholder="t('搜索日志', 'Search logs')" />
      </label>
      <input v-model="dateFrom" type="date" class="h-10 rounded-lg border border-white/10 bg-white/6 px-3 text-xs text-white/72" />
      <input v-model="dateTo" type="date" class="h-10 rounded-lg border border-white/10 bg-white/6 px-3 text-xs text-white/72" />
    </div>
    <div class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <table class="w-full min-w-[820px] text-sm">
        <thead><tr class="border-b border-white/8 text-left text-xs text-white/45"><th class="px-4 py-3">ID</th><th class="px-4 py-3">{{ t('用户', 'User') }}</th><th class="px-4 py-3">{{ t('操作', 'Action') }}</th><th class="px-4 py-3">{{ t('详情', 'Detail') }}</th><th class="px-4 py-3">IP</th><th class="px-4 py-3">{{ t('时间', 'Time') }}</th></tr></thead>
        <tbody>
          <tr v-if="filteredLogs.length === 0"><td colspan="6" class="px-4 py-10 text-center text-white/35">{{ t('暂无日志', 'No logs') }}</td></tr>
          <tr v-for="log in filteredLogs" :key="log.id" class="border-b border-white/5 hover:bg-white/5">
            <td class="px-4 py-3 text-white/55">{{ log.id }}</td>
            <td class="px-4 py-3 text-white">{{ log.username || log.user || '-' }}</td>
            <td class="px-4 py-3"><span class="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-white/65">{{ log.action }}</span></td>
            <td class="max-w-xs truncate px-4 py-3 text-xs text-white/60">{{ log.detail || log.remark || '-' }}</td>
            <td class="px-4 py-3 text-xs text-white/40">{{ log.ip || '-' }}</td>
            <td class="px-4 py-3 text-xs text-white/40">{{ log.createdAt || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import PageHead from '~/components/admin/PageHead.vue'
import { adminService } from '~/services/adminService'
import { useSettingsStore } from '~/stores/settingsStore'

interface LogEntry { id: number; username?: string; user?: string; action?: string; detail?: string; remark?: string; ip?: string; createdAt?: string }
const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const logs = ref<LogEntry[]>([])
const filteredLogs = computed(() => logs.value.filter((log) => {
  const q = searchQuery.value.trim().toLowerCase()
  const text = `${log.username || ''} ${log.user || ''} ${log.action || ''} ${log.detail || ''} ${log.remark || ''}`.toLowerCase()
  const date = log.createdAt || ''
  return (!q || text.includes(q)) && (!dateFrom.value || date >= dateFrom.value) && (!dateTo.value || date <= `${dateTo.value} 23:59:59`)
}))
onMounted(async () => {
  settingsStore.init()
  try { const res: any = await adminService.logs({}); logs.value = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || [] } catch { logs.value = [] }
})
</script>
