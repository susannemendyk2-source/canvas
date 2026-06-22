<template>
  <main class="flex h-screen flex-col overflow-hidden bg-studio-black text-white">
    <TopBar />

    <div class="relative flex min-h-0 flex-1 pt-14">
      <LeftToolbar />

      <section class="relative min-w-0 flex-1 overflow-hidden bg-[#050608]">
        <MagicCanvas v-if="workspaceStore.mode === 'magic'" />
        <WorkflowCanvas v-else />
        <BottomToolbar />
      </section>

      <div v-if="settingsStore.showPanel" class="w-[340px] shrink-0 border-l border-white/8 bg-[#111722]/88">
        <AgentPanel />
      </div>
    </div>

    <AssetLibrary v-if="settingsStore.showAssets" />
    <GenerationHistory v-if="settingsStore.showHistory" />
    <ApiSettingsDialog v-if="settingsStore.showSettings" />
  </main>
</template>

<script setup lang="ts">
import TopBar from '~/components/layout/TopBar.vue'
import LeftToolbar from '~/components/layout/LeftToolbar.vue'
import MagicCanvas from '~/components/canvas/MagicCanvas.vue'
import WorkflowCanvas from '~/components/workflow/WorkflowCanvas.vue'
import BottomToolbar from '~/components/layout/BottomToolbar.vue'
import AgentPanel from '~/components/agent/AgentPanel.vue'
import AssetLibrary from '~/components/assets/AssetLibrary.vue'
import GenerationHistory from '~/components/history/GenerationHistory.vue'
import ApiSettingsDialog from '~/components/settings/ApiSettingsDialog.vue'
import { useWorkspaceStore } from '~/stores/workspaceStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useCanvasStore } from '~/stores/canvasStore'

const workspaceStore = useWorkspaceStore()
const settingsStore = useSettingsStore()
const canvasStore = useCanvasStore()

onMounted(() => {
  if (import.meta.client) {
    const pending = localStorage.getItem('polaris.pendingGoal')
    if (pending) {
      try {
        const data = JSON.parse(pending)
        canvasStore.addObject({
          id: crypto.randomUUID(),
          type: 'prompt',
          title: 'AI Prompt',
          content: data.prompt || data.content || '',
          x: 200,
          y: 200,
          width: 320,
          height: 220
        })
        localStorage.removeItem('polaris.pendingGoal')
      } catch {
        localStorage.removeItem('polaris.pendingGoal')
      }
    }
  }
})
</script>
