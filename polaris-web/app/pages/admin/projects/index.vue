<template>
  <main class="mx-auto max-w-7xl px-6 py-8">
    <PageHead :title="t('项目审核', 'Project Review')" :desc="t('审核公开项目，并将优秀项目发布为模板。', 'Review public projects and publish strong examples as templates.')" />
    <div class="mb-4 flex flex-wrap gap-2">
      <button v-for="item in filters" :key="item.value" class="rounded-full border px-3 py-1.5 text-xs transition" :class="activeStatus === item.value ? 'border-cyan-300/30 bg-cyan-100/10 text-white' : 'border-white/10 bg-white/6 text-white/60 hover:text-white'" @click="activeStatus = item.value">
        {{ item.label }}
      </button>
    </div>
    <div class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <table class="w-full min-w-[860px] text-sm">
        <thead><tr class="border-b border-white/8 text-left text-xs text-white/45"><th class="px-4 py-3">ID</th><th class="px-4 py-3">{{ t('项目', 'Project') }}</th><th class="px-4 py-3">{{ t('创建者', 'Owner') }}</th><th class="px-4 py-3">{{ t('模式', 'Mode') }}</th><th class="px-4 py-3">{{ t('状态', 'Status') }}</th><th class="px-4 py-3">{{ t('时间', 'Time') }}</th><th class="px-4 py-3">{{ t('操作', 'Actions') }}</th></tr></thead>
        <tbody>
          <tr v-if="projects.length === 0"><td colspan="7" class="px-4 py-10 text-center text-white/35">{{ t('暂无项目', 'No projects') }}</td></tr>
          <tr v-for="project in filteredProjects" :key="project.id" class="border-b border-white/5 hover:bg-white/5">
            <td class="px-4 py-3 text-white/55">{{ project.id }}</td>
            <td class="px-4 py-3 font-medium text-white">{{ project.name || project.title || t('未命名项目', 'Untitled Project') }}</td>
            <td class="px-4 py-3 text-white/60">{{ project.owner || project.username || '-' }}</td>
            <td class="px-4 py-3 text-xs uppercase text-white/45">{{ project.mode || project.type || 'magic' }}</td>
            <td class="px-4 py-3"><span :class="['rounded-full px-2 py-0.5 text-[11px]', statusClass(project.status)]">{{ statusLabel(project.status) }}</span></td>
            <td class="px-4 py-3 text-xs text-white/40">{{ project.createdAt || '-' }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/62 hover:text-white" @click="updateStatus(project, 1)">{{ t('通过', 'Approve') }}</button>
                <button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-amber-300/70 hover:text-amber-300" @click="updateStatus(project, 2)">{{ t('驳回', 'Reject') }}</button>
                <button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-cyan-300/70 hover:text-cyan-200" @click="publishAsTemplate(project)">{{ t('发布模板', 'Template') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import { adminService } from '~/services/adminService'
import { useSettingsStore } from '~/stores/settingsStore'
import PageHead from '~/components/admin/PageHead.vue'

interface AdminProject { id: number; name?: string; title?: string; owner?: string; username?: string; mode?: string; type?: string; status?: number; createdAt?: string }
const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const activeStatus = ref('all')
const projects = ref<AdminProject[]>([])
const filters = computed(() => [{ value: 'all', label: t('全部', 'All') }, { value: '0', label: t('待审核', 'Pending') }, { value: '1', label: t('已通过', 'Approved') }, { value: '2', label: t('已驳回', 'Rejected') }])
const filteredProjects = computed(() => activeStatus.value === 'all' ? projects.value : projects.value.filter((p) => String(p.status ?? 0) === activeStatus.value))

onMounted(loadProjects)
async function loadProjects() {
  settingsStore.init()
  try { const res: any = await adminService.listProjects({}); projects.value = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || [] } catch { projects.value = [] }
}
function statusClass(status?: number) { return status === 1 ? 'bg-emerald-500/12 text-emerald-300' : status === 2 ? 'bg-white/8 text-white/45' : 'bg-amber-500/12 text-amber-300' }
function statusLabel(status?: number) { return status === 1 ? t('已通过', 'Approved') : status === 2 ? t('已驳回', 'Rejected') : t('待审核', 'Pending') }
async function updateStatus(project: AdminProject, status: number) { try { await adminService.reviewProject(project.id, status) } catch {}; project.status = status }
async function publishAsTemplate(project: AdminProject) { try { await adminService.publishTemplate(project.id) } catch {}; project.status = 3 }
</script>
