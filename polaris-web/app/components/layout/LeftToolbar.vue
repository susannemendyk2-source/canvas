<template>
  <aside class="flex w-16 flex-col items-center gap-1 border-r border-cyan-100/10 bg-[#050811]/82 py-3 backdrop-blur-xl">
    <button
      v-for="tool in tools"
      :key="tool.key"
      class="grid size-10 place-items-center rounded-lg text-white/58 transition hover:bg-cyan-100/10 hover:text-cyan-50"
      :title="tool.label"
      @click="handleAction(tool.key)"
    >
      <component :is="tool.icon" class="size-4" />
    </button>

    <div class="mt-auto flex flex-col items-center gap-1">
      <button
        class="grid size-10 place-items-center rounded-lg text-white/58 transition hover:bg-cyan-100/10 hover:text-cyan-50 disabled:opacity-40"
        title="保存 / Save"
        :disabled="canvasStore.saving"
        @click="handleSave"
      >
        <span v-if="canvasStore.saving" class="inline-block size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        <Save v-else class="size-4" />
      </button>
      <button
        class="grid size-10 place-items-center rounded-lg text-white/38 transition hover:bg-cyan-100/10 hover:text-cyan-50"
        title="新建画布 / New Canvas"
        @click="handleNewCanvas"
      >
        <Plus class="size-4" />
      </button>
      <button
        class="grid size-10 place-items-center rounded-lg text-white/38 transition hover:bg-red-500/15 hover:text-red-400"
        title="清空 / Clear"
        @click="handleClear"
      >
        <Trash2 class="size-4" />
      </button>
      <button
        class="grid size-10 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
        title="生成 / Generate"
        @click="handleGenerate"
      >
        <WandSparkles class="size-4" />
      </button>
      <BoxSelect class="size-4 text-white/25" />
    </div>

    <Teleport to="body">
      <div v-if="toastMsg" class="fixed bottom-6 left-20 z-[999] rounded-lg px-3 py-2 text-xs shadow-lg backdrop-blur" :class="toastError ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'">
        {{ toastMsg }}
      </div>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { BoxSelect, CircleHelp, Clock3, ImagePlus, Layers3, MousePointer2, Move, PanelLeft, Plus, Save, Settings, Trash2, WandSparkles } from 'lucide-vue-next'
import { useCanvasStore } from '~/stores/canvasStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useWorkflowStore } from '~/stores/workflowStore'
import { useWorkspaceStore } from '~/stores/workspaceStore'
import { projectService } from '~/services/projectService'

const canvasStore = useCanvasStore()
const settingsStore = useSettingsStore()
const workflowStore = useWorkflowStore()
const workspaceStore = useWorkspaceStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const tools = [
  { key: 'select', icon: MousePointer2, label: '选择 / Select' },
  { key: 'move', icon: Move, label: '移动 / Move' },
  { key: 'add', icon: ImagePlus, label: '添加 / Add' },
  { key: 'assets', icon: Layers3, label: '素材 / Assets' },
  { key: 'templates', icon: PanelLeft, label: '模板 / Templates' },
  { key: 'history', icon: Clock3, label: '历史 / History' },
  { key: 'help', icon: CircleHelp, label: '帮助 / Help' },
  { key: 'settings', icon: Settings, label: '设置 / Settings' }
]

function addVisiblePrompt() {
  canvasStore.addObject({
    type: 'prompt',
    title: 'Prompt 提示词节点',
    content: '从左侧工具栏添加的测试卡片。',
    x: 180,
    y: 160,
    width: 360,
    height: 220
  })
}

function handleAction(key: string) {
  switch (key) {
    case 'add':
      if (workspaceStore.mode === 'magic') {
        addVisiblePrompt()
      } else {
        workflowStore.addNode('prompt', 300, 300)
      }
      break
    case 'assets':
      settingsStore.toggleAssets()
      break
    case 'templates':
      workspaceStore.setMode('workflow')
      break
    case 'history':
      settingsStore.toggleHistory()
      break
    case 'help':
      settingsStore.toggleAssets()
      break
    case 'settings':
      settingsStore.toggleSettings()
      break
  }
}

function handleClear() {
  const msg = settingsStore.language === 'zh' ? '确定清空画布？所有卡片和连线将被删除。' : 'Clear canvas? All cards and connections will be deleted.'
  if (window.confirm(msg)) {
    canvasStore.clearAll()
  }
}

async function handleSave() {
  await canvasStore.saveAll()
  if (canvasStore.error) {
    showToast(t('保存失败', 'Save failed'), true)
  } else {
    showToast(t('已保存', 'Saved'), false)
  }
}

const toastMsg = ref('')
const toastError = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string, error: boolean) {
  toastMsg.value = msg
  toastError.value = error
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 2000)
}

async function handleNewCanvas() {
  canvasStore.clearAll()
  try {
    const project: any = await projectService.create({
      name: '新画布',
      mode: 'magic-canvas',
      description: ''
    })
    const id = project.id || project?.data?.id
    if (id) {
      if (import.meta.client) localStorage.setItem('polaris.activeProject', String(id))
      navigateTo(`/studio?pid=${id}`)
    }
  } catch {}
}

function handleGenerate() {
  canvasStore.addObject({
    type: 'generated',
    title: '生成资产 / Generated asset',
    content: 'Polaris mock result added near your current route.',
    x: 220,
    y: 200,
    width: 420,
    height: 260
  })
}
</script>
