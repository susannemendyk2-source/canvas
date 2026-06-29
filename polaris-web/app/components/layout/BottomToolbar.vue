<template>
  <div class="absolute bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-cyan-100/12 bg-black/60 p-2 shadow-glass backdrop-blur-xl">
    <div class="flex items-center gap-1">
      <FloatingButton title="撤销 / Undo" :disabled="!canUndo" @click="canvasStore.undo()">
        <Undo2 class="size-3.5" />
      </FloatingButton>
      <FloatingButton title="重做 / Redo" :disabled="!canRedo" @click="canvasStore.redo()">
        <Redo2 class="size-3.5" />
      </FloatingButton>

      <button
        class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/72 transition"
        :class="workspaceStore.mode === 'magic' ? 'border border-cyan-300/35 bg-cyan-300/12 text-cyan-50' : ''"
        @click="workspaceStore.setMode('magic')"
      >
        <Compass class="size-3.5" />
        星图画布 / Star Map
      </button>
      <button
        class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/72 transition"
        :class="workspaceStore.mode === 'workflow' ? 'border border-cyan-300/35 bg-cyan-300/12 text-cyan-50' : ''"
        @click="workspaceStore.setMode('workflow')"
      >
        <Workflow class="size-3.5" />
        节点工作流 / Workflow
      </button>

      <FloatingButton title="缩小 / Zoom Out" @click="zoomOut">
        <ZoomOut class="size-3.5" />
      </FloatingButton>
      <span class="w-10 text-center text-xs text-white/55">{{ canvasStore.zoom }}%</span>
      <FloatingButton title="放大 / Zoom In" @click="zoomIn">
        <ZoomIn class="size-3.5" />
      </FloatingButton>
      <FloatingButton title="适配屏幕 / Fit screen" @click="fitScreen">
        <Maximize2 class="size-3.5" />
      </FloatingButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Compass, Workflow } from 'lucide-vue-next'
import FloatingButton from '~/components/ui/FloatingButton.vue'
import { useWorkspaceStore } from '~/stores/workspaceStore'
import { useCanvasStore } from '~/stores/canvasStore'

const workspaceStore = useWorkspaceStore()
const canvasStore = useCanvasStore()

const canUndo = computed(() => canvasStore.historyIndex > 0)
const canRedo = computed(() => canvasStore.historyIndex < canvasStore.historyStack.length - 1)

function zoomIn() {
  canvasStore.setZoom(canvasStore.zoom + 10)
}

function zoomOut() {
  canvasStore.setZoom(canvasStore.zoom - 10)
}

function fitScreen() {
  canvasStore.setZoom(86)
}
</script>
