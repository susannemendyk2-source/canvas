<template>
  <div
    ref="root"
    class="absolute inset-0 bg-[#03050b]"
    @dblclick.capture="openMenuFromEvent"
    @contextmenu.prevent="openMenuFromEvent"
  >
    <div class="absolute left-6 top-5 z-30 rounded-full border border-cyan-100/12 bg-black/45 px-3 py-1.5 text-xs text-white/45 backdrop-blur">
      Node Workflow Canvas
    </div>

    <div class="absolute right-6 top-7 z-30 flex items-center gap-2">
      <button class="rounded-lg border border-cyan-100/12 bg-black/45 px-4 py-2 text-sm text-white/84 backdrop-blur transition hover:border-cyan-200/35" @click.stop="openMenuAtCenter">
        <Plus class="mr-2 inline size-4" />
        Add Node
      </button>
      <button class="rounded-lg border border-cyan-100/12 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-50 backdrop-blur transition hover:border-cyan-200/35" :disabled="workflowStore.running" @click.stop="workflowStore.runWorkflow()">
        <Loader2 v-if="workflowStore.running" class="mr-2 inline size-4 animate-spin" />
        <Play v-else class="mr-2 inline size-4" />
        {{ workflowStore.running ? 'Running...' : 'Run Workflow' }}
      </button>
      <button class="rounded-lg border border-cyan-100/12 bg-black/45 px-3 py-2 text-sm text-white/64 backdrop-blur transition hover:border-red-200/35 hover:text-red-100" @click.stop="workflowStore.clear()">
        <Trash2 class="size-4" />
      </button>
    </div>

    <div v-if="workflowStore.nodes.length === 0" class="absolute inset-0 z-10 grid place-items-center px-8">
      <div class="max-w-2xl text-center">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs text-white/58">
          <Workflow class="size-3.5 text-cyan-100" />
          Double click or right click to add workflow nodes
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <button class="rounded-xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200/35" @click.stop="createRoute('video')">
            <FileVideo class="mb-3 size-5 text-cyan-100" />
            <div class="text-sm font-semibold text-white/88">Video route</div>
            <div class="mt-1 text-xs leading-5 text-white/45">Prompt -> Image -> Video -> Output</div>
          </button>
          <button class="rounded-xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200/35" @click.stop="createRoute('poster')">
            <ImagePlus class="mb-3 size-5 text-cyan-100" />
            <div class="text-sm font-semibold text-white/88">Poster route</div>
            <div class="mt-1 text-xs leading-5 text-white/45">Prompt -> Image -> Enhance -> Output</div>
          </button>
          <button class="rounded-xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200/35" @click.stop="createRoute('merge')">
            <Merge class="mb-3 size-5 text-cyan-100" />
            <div class="text-sm font-semibold text-white/88">Merge route</div>
            <div class="mt-1 text-xs leading-5 text-white/45">Prompt -> Image -> Video -> Merge</div>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="menu.visible"
      class="fixed z-[999] w-64 rounded-2xl border border-cyan-100/14 bg-[#111722]/95 p-2 shadow-glass backdrop-blur-xl"
      :style="{ left: `${menu.x}px`, top: `${menu.y}px` }"
      @click.stop
      @dblclick.stop
    >
      <NodeMenu @select="addNodeFromMenu" />
    </div>

    <VueFlow
      v-model:nodes="workflowStore.nodes"
      v-model:edges="workflowStore.edges"
      fit-view-on-init
      class="h-full w-full bg-[#03050b]"
      @connect="handleConnect"
      @node-click="handleNodeClick"
      @pane-click="closeMenu"
      @nodes-delete="handleNodesDelete"
    >
      <template #node-base-workflow="nodeProps">
        <BaseWorkflowNode v-bind="nodeProps" @update="handleNodeUpdate(nodeProps.id, $event)" />
      </template>
      <Background :variant="BackgroundVariant.Dots" :gap="28" pattern-color="rgba(255,255,255,0.11)" />
      <MiniMap pannable zoomable mask-color="rgba(0,0,0,.42)" node-color="#66E4FF" />
      <Controls position="bottom-right" />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background, BackgroundVariant } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { FileVideo, ImagePlus, Loader2, Merge, Play, Plus, Trash2, Workflow } from 'lucide-vue-next'
import NodeMenu from '~/components/workflow/NodeMenu.vue'
import BaseWorkflowNode from './nodes/BaseWorkflowNode.vue'
import { useWorkflowStore } from '~/stores/workflowStore'
import type { NodeType } from '~/types'

const workflowStore = useWorkflowStore()
const root = ref<HTMLElement | null>(null)
const menu = reactive({ visible: false, x: 0, y: 0, flowX: 220, flowY: 220 })

function handleNodeUpdate(id: string, payload: { prompt?: string; model?: string; size?: string }) {
  workflowStore.updateNodeData(id, payload)
}

function openMenuFromEvent(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('.vue-flow__node, button, textarea, input, select')) return
  event.preventDefault()
  const rect = root.value?.getBoundingClientRect()
  menu.visible = true
  menu.x = Math.max(12, Math.min(event.clientX, window.innerWidth - 280))
  menu.y = Math.max(12, Math.min(event.clientY, window.innerHeight - 330))
  menu.flowX = event.clientX - (rect?.left ?? 0)
  menu.flowY = event.clientY - (rect?.top ?? 0)
}

function openMenuAtCenter() {
  const rect = root.value?.getBoundingClientRect()
  const eventLike = {
    clientX: (rect?.left ?? 0) + (rect?.width ?? window.innerWidth) / 2,
    clientY: (rect?.top ?? 0) + (rect?.height ?? window.innerHeight) / 2,
    preventDefault: () => {}
  } as MouseEvent
  openMenuFromEvent(eventLike)
}

function addNodeFromMenu(type: string) {
  workflowStore.addNode(type as NodeType, menu.flowX, menu.flowY)
  menu.visible = false
}

function handleConnect(connection: any) {
  workflowStore.addEdge(connection.source, connection.target)
}

function handleNodeClick(event: any) {
  workflowStore.selectNode(event.node?.id || null)
}

function handleNodesDelete(nodes: Array<{ id: string }>) {
  nodes.forEach((node) => workflowStore.removeNode(node.id))
}

function closeMenu() {
  menu.visible = false
}

function createRoute(type: 'video' | 'poster' | 'merge') {
  if (type === 'video') {
    workflowStore.addRoute(['prompt', 'image-gen', 'video-gen', 'output'])
  } else if (type === 'poster') {
    workflowStore.addRoute(['prompt', 'image-gen', 'enhance', 'output'])
  } else {
    workflowStore.addRoute(['prompt', 'image-gen', 'video-gen', 'merge', 'output'])
  }
}
</script>
