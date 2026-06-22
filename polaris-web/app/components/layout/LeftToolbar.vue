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
        class="grid size-10 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
        title="生成 / Generate"
        @click="handleGenerate"
      >
        <WandSparkles class="size-4" />
      </button>
      <BoxSelect class="size-4 text-white/25" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { MousePointer2, Move, ImagePlus, Layers3, PanelLeft, Clock3, CircleHelp, Settings, WandSparkles, BoxSelect } from 'lucide-vue-next'
import { useCanvasStore } from '~/stores/canvasStore'
import { useWorkflowStore } from '~/stores/workflowStore'
import { useWorkspaceStore } from '~/stores/workspaceStore'
import { useSettingsStore } from '~/stores/settingsStore'

const canvasStore = useCanvasStore()
const workspaceStore = useWorkspaceStore()
const settingsStore = useSettingsStore()
const workflowStore = useWorkflowStore()

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

function handleAction(key: string) {
  switch (key) {
    case 'add':
      if (workspaceStore.mode === 'magic') {
        canvasStore.addObject({ type: 'prompt', title: 'Prompt 提示词航点' })
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

function handleGenerate() {
  canvasStore.addObject({
    type: 'generated',
    title: '生成资产 / Generated asset',
    content: 'Polaris mock 结果已投放到当前星图附近。Polaris mock result added near your current route.'
  })
}
</script>
