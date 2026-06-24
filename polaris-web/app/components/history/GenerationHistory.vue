<template>
  <Teleport to="body">
    <div v-if="settingsStore.showHistory" class="fixed inset-0 z-[90] flex justify-start" @click="closeAllMenus">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="settingsStore.toggleHistory()" />
      <div class="relative w-[380px] bg-[#050811]/95 p-4 shadow-lg backdrop-blur-xl" @click.stop>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-white">Generation History</h2>
          <button class="rounded-lg p-1.5 text-white/38 transition hover:bg-white/8 hover:text-white/72" @click="settingsStore.toggleHistory()">
            <X class="size-4" />
          </button>
        </div>

        <div v-if="assetStore.history.length === 0" class="py-8 text-center text-sm text-white/38">
          No history yet
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="item in assetStore.history"
            :key="item.id"
            class="rounded-lg border border-white/10 bg-white/6 p-3"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm text-white/72">{{ item.title }}</span>
              <div class="flex items-center gap-1">
                <StatusBadge :status="item.status" />
                <div class="relative">
                  <button ref="menuBtnRefs" class="rounded p-1 text-white/38 transition hover:bg-white/8 hover:text-white/72" :data-id="item.id" @click.stop="toggleMenu(item.id)">
                    <Ellipsis class="size-4" />
                  </button>
                  <div v-if="openMenuId === item.id" class="absolute right-0 top-full z-[100] mt-1 w-44 rounded-xl border border-white/10 bg-[#11131a]/95 py-1 shadow-glass backdrop-blur-xl" @click.stop>
                    <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" @click="applyCanvas(item.id)">
                      <File class="size-4" /> {{ t('应用该画布', 'Apply canvas') }}
                    </button>
                    <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" @click="previewCanvas(item.id)">
                      <ExternalLink class="size-4" /> {{ t('新建窗口预览', 'Preview') }}
                    </button>
                    <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-300/80 transition hover:bg-white/8" @click="deleteCanvas(item.id)">
                      <Trash2 class="size-4" /> {{ t('删除', 'Delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                class="h-full rounded-full bg-studio-cyan transition-all"
                :style="{ width: item.progress + '%' }"
              />
            </div>
            <p class="mt-1 text-[11px] text-white/38">{{ item.createdAt }}</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Ellipsis, ExternalLink, File, Trash2, X } from 'lucide-vue-next'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import { useSettingsStore } from '~/stores/settingsStore'
import { useAssetStore } from '~/stores/assetStore'
import { projectService } from '~/services/projectService'

const settingsStore = useSettingsStore()
const assetStore = useAssetStore()
const openMenuId = ref<string | null>(null)
const t = (zh: string, en: string) => settingsStore.t(zh, en)

if (import.meta.client) {
  settingsStore.$subscribe((mutation, state) => {
    if (state.showHistory && assetStore.history.length === 0) {
      loadProjectHistory()
    }
  })
}

function closeAllMenus() {
  openMenuId.value = null
}

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function applyCanvas(id: string) {
  openMenuId.value = null
  settingsStore.toggleHistory()
  if (import.meta.client) {
    localStorage.setItem('polaris.activeProject', id)
  }
  canvasStore.loadProject(Number(id))
}

function previewCanvas(id: string) {
  openMenuId.value = null
  window.open(`/studio?pid=${id}`, '_blank')
}

async function deleteCanvas(id: string) {
  openMenuId.value = null
  const msg = t('确定删除该项目？此操作不可撤销。', 'Delete this project? This cannot be undone.')
  if (!window.confirm(msg)) return
  try {
    await projectService.delete(Number(id))
    assetStore.removeHistory(id)
  } catch {}
}

async function loadProjectHistory() {
  try {
    const res: any = await projectService.list({})
    const projects = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || []
    for (const p of projects) {
      assetStore.addHistory({
        id: String(p.id),
        title: p.name || 'Canvas Project',
        type: 'project',
        status: 'completed',
        progress: 100,
        createdAt: p.createdAt ? new Date(p.createdAt).toLocaleString() : ''
      })
    }
  } catch {}
}
</script>
