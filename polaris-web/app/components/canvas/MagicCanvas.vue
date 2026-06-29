<template>
  <div
    ref="canvasRoot"
    data-canvas-root="true"
    class="dotted-grid absolute inset-0 overflow-hidden bg-[#03050b]" :class="{ 'cursor-grab': !isPanning, 'cursor-grabbing': isPanning }"
    tabindex="0"
    @dblclick="openMenuFromEvent"
    @contextmenu.capture.prevent
    @pointerdown.capture="handlePointerDown"
    @wheel.prevent="handleWheel"
    @click="handleCanvasClick"
  >
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,.10),transparent_32%)]" />

    <div v-if="canvasStore.loading" class="absolute inset-0 z-50 grid place-items-center bg-black/30 text-sm text-white/60">
      {{ t('正在加载画布...', 'Loading canvas...') }}
    </div>

    <div class="absolute left-6 top-5 z-30 rounded-full border border-cyan-100/12 bg-black/45 px-3 py-1.5 text-xs text-white/45 backdrop-blur">
      {{ t('Polaris 星图画布', 'Polaris Star Map Canvas') }}
    </div>

    <div v-if="canvasStore.connectionStartId" class="absolute left-1/2 top-5 z-40 -translate-x-1/2 rounded-full border border-emerald-200/25 bg-emerald-300/10 px-4 py-2 text-xs text-emerald-100 backdrop-blur">
      {{ t('选择另一张卡片完成连接。点击空白画布可取消。', 'Pick another card to connect. Click empty canvas to cancel.') }}
    </div>

    <div class="absolute right-6 top-7 z-30 flex items-center gap-2">
      <button data-no-canvas-menu="true" class="rounded-lg border border-cyan-100/12 bg-black/45 px-4 py-2 text-sm text-white/84 backdrop-blur transition hover:border-cyan-200/35" @click.stop="addQuickCard('prompt')">
        <Plus class="mr-2 inline size-4" />
        {{ t('添加 Prompt', 'Add Prompt') }}
      </button>
      <button data-no-canvas-menu="true" class="rounded-lg border border-cyan-100/12 bg-black/45 px-4 py-2 text-sm text-white/84 backdrop-blur transition hover:border-cyan-200/35" @click.stop="workspaceStore.setMode('workflow')">
        <Play class="mr-2 inline size-4" />
        {{ t('运行 Workflow', 'Run Workflow') }}
      </button>
    </div>

    <div v-if="canvasStore.objects.length === 0" class="absolute inset-0 z-10 grid place-items-center px-8">
      <div class="max-w-2xl text-center">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs text-white/58">
          <Compass class="size-3.5 text-cyan-100" />
          {{ t('双击空白区域添加节点', 'Double click an empty area to add a node') }}
        </div>

        <div class="mb-6 grid gap-3 sm:grid-cols-3" @dblclick.stop>
          <button
            v-for="route in starterRoutes"
            :key="route.title"
            class="rounded-xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200/35 hover:bg-cyan-100/8"
            @click.stop="createStarterRoute(route.kind)"
          >
            <component :is="route.icon" class="mb-3 size-5 text-cyan-100" />
            <div class="text-sm font-semibold text-white/88">{{ route.title }}</div>
            <div class="mt-1 text-xs leading-5 text-white/45">{{ route.subtitle }}</div>
          </button>
        </div>

        <div class="flex flex-wrap justify-center gap-3" @dblclick.stop>
          <button
            v-for="item in waypointTypes"
            :key="item.type"
            class="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50"
            @click.stop="addQuickCard(item.type)"
          >
            <component :is="item.icon" class="mr-2 inline size-4" />
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="contextMenu.visible"
      class="fixed z-[999] w-64 rounded-2xl border border-cyan-100/14 bg-[#111722]/95 p-3 shadow-glass backdrop-blur-xl"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
      @click.stop
      @dblclick.stop
    >
      <div class="mb-3 flex items-center justify-between">
        <div class="text-sm font-medium">{{ t('添加节点', 'Add Node') }}</div>
        <button class="grid size-7 place-items-center rounded-lg text-white/42 hover:bg-white/8 hover:text-white" @click="contextMenu.visible = false">
          <X class="size-4" />
        </button>
      </div>
      <div class="grid gap-2">
        <button
          v-for="item in waypointTypes"
          :key="item.type"
          class="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-left text-sm text-white/70 hover:border-cyan-200/30 hover:text-cyan-50"
          @click="createAt(item.type, contextMenu.canvasX - 120, contextMenu.canvasY - 60)"
        >
          <component :is="item.icon" class="size-4" />
          {{ item.label }}
        </button>
      </div>
    </div>

    <div
      class="absolute inset-0 z-20 origin-top-left"
      data-canvas-surface="true"
      :class="{ 'pointer-events-none': canvasStore.objects.length === 0 }"
      :style="{ transform: `translate(${panX}px, ${panY}px) scale(${canvasStore.zoom / 100})`, width: `${10000 / canvasStore.zoom}%`, height: `${10000 / canvasStore.zoom}%` }"
    >
      <svg class="pointer-events-none absolute left-0 top-0 h-[4000px] w-[4000px] overflow-visible" data-canvas-surface="true">
        <defs>
          <marker id="canvas-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0,0 L8,4 L0,8 Z" fill="rgba(103,232,249,.72)" />
          </marker>
        </defs>
        <g v-for="edge in linkPaths" :key="edge.id" class="pointer-events-auto">
          <path
            :d="edge.path"
            class="cursor-pointer fill-none stroke-cyan-200/55 transition hover:stroke-cyan-100"
            stroke-width="2"
            stroke-linecap="round"
            marker-end="url(#canvas-arrow)"
            @dblclick.stop="canvasStore.removeLink(edge.id)"
          />
          <circle :cx="edge.midX" :cy="edge.midY" r="3" class="fill-cyan-100/80" />
        </g>
      </svg>

      <CanvasCard
        v-for="obj in canvasStore.objects"
        :key="obj.id"
        :object="obj"
        :selected="canvasStore.selectedId === obj.id"
        :connecting="canvasStore.connectionStartId === obj.id"
        @select="handleCardSelect(obj.id)"
        @delete="canvasStore.removeObject(obj.id)"
        @duplicate="canvasStore.duplicateObject(obj.id)"
        @send-to-workflow="workspaceStore.setMode('workflow')"
        @start-connect="canvasStore.startConnection(obj.id)"
        @move="(x: number, y: number) => canvasStore.moveObject(obj.id, x, y)"
        @resize="(width: number, height: number) => canvasStore.resizeObject(obj.id, width, height)"
        @update="(data) => canvasStore.updateObject(obj.id, data)"
      />
    </div>

    <CanvasMinimap />

    <div v-if="canvasStore.error" class="absolute bottom-24 left-6 z-50 rounded-lg border border-red-300/20 bg-red-950/50 px-3 py-2 text-xs text-red-100">
      {{ canvasStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Boxes, Clapperboard, Compass, FileText, FileVideo, ImagePlus, LayoutTemplate, Play, Plus, X } from 'lucide-vue-next'
import CanvasCard from '~/components/canvas/CanvasCard.vue'
import CanvasMinimap from '~/components/canvas/CanvasMinimap.vue'
import { useCanvasStore } from '~/stores/canvasStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useWorkspaceStore } from '~/stores/workspaceStore'
import type { CanvasObjectType } from '~/types'

type NodeType = Extract<CanvasObjectType, 'prompt' | 'image' | 'video' | 'moodboard'>

const canvasStore = useCanvasStore()
const settingsStore = useSettingsStore()
const workspaceStore = useWorkspaceStore()
const canvasRoot = ref<HTMLElement | null>(null)
const route = useRoute()

const contextMenu = reactive({ visible: false, x: 0, y: 0, canvasX: 0, canvasY: 0 })
let ignoreNextCanvasClick = false
const panX = ref(0)
const panY = ref(0)
let isPanning = false
let panStartX = 0
let panStartY = 0
let panStartPanX = 0
let panStartPanY = 0

const t = (zh: string, en: string) => settingsStore.t(zh, en)

const waypointTypes = computed(() => [
  { type: 'prompt' as const, label: t('Prompt 提示词', 'Prompt'), icon: FileText },
  { type: 'image' as const, label: t('图像', 'Image'), icon: ImagePlus },
  { type: 'video' as const, label: t('视频', 'Video'), icon: FileVideo },
  { type: 'moodboard' as const, label: t('分镜', 'Storyboard'), icon: LayoutTemplate }
])

const starterRoutes = computed(() => [
  { kind: 'video' as const, title: t('短视频路线', 'Short video route'), subtitle: 'Prompt -> Image -> Video', icon: Clapperboard },
  { kind: 'poster' as const, title: t('海报地图', 'Poster map'), subtitle: t('Prompt -> 图像 -> 导出', 'Prompt -> Image -> Export'), icon: ImagePlus },
  { kind: 'storyboard' as const, title: t('分镜路线', 'Storyboard'), subtitle: t('故事 -> 分镜帧', 'Story -> Frames'), icon: Boxes }
])

const linkPaths = computed(() => {
  return canvasStore.links
    .map((link) => {
      const source = canvasStore.objects.find((item) => item.id === link.sourceId)
      const target = canvasStore.objects.find((item) => item.id === link.targetId)
      if (!source || !target) return null
      const startX = source.x + source.width
      const startY = source.y + source.height / 2
      const endX = target.x
      const endY = target.y + target.height / 2
      const gap = Math.max(80, Math.abs(endX - startX) * 0.42)
      return {
        id: link.id,
        path: `M ${startX} ${startY} C ${startX + gap} ${startY}, ${endX - gap} ${endY}, ${endX} ${endY}`,
        midX: (startX + endX) / 2,
        midY: (startY + endY) / 2
      }
    })
    .filter(Boolean) as Array<{ id: string; path: string; midX: number; midY: number }>
})

function canvasPointFromEvent(e: Pick<MouseEvent, 'clientX' | 'clientY'>) {
  const scale = canvasStore.zoom / 100
  const rect = canvasRoot.value?.getBoundingClientRect()
  return {
    x: (e.clientX - (rect?.left ?? 0) - panX.value) / scale,
    y: (e.clientY - (rect?.top ?? 0) - panY.value) / scale
  }
}

function clampMenuPosition(e: Pick<MouseEvent, 'clientX' | 'clientY'>) {
  contextMenu.x = Math.max(12, Math.min(e.clientX, window.innerWidth - 280))
  contextMenu.y = Math.max(12, Math.min(e.clientY, window.innerHeight - 280))
}

function openMenuFromEvent(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!isBlankCanvasTarget(target)) return
  e.stopPropagation()
  e.preventDefault()
  ignoreNextCanvasClick = true
  const point = canvasPointFromEvent(e)
  clampMenuPosition(e)
  contextMenu.canvasX = point.x
  contextMenu.canvasY = point.y
  contextMenu.visible = true
}

function handlePointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  const target = e.target as HTMLElement | null
  if (target?.closest('textarea,input,select,button,[data-no-canvas-menu="true"]')) return

  if (target?.closest('.group')) return

  isPanning = true
  panStartX = e.clientX
  panStartY = e.clientY
  panStartPanX = panX.value
  panStartPanY = panY.value

  function onMove(ev: PointerEvent) {
    panX.value = panStartPanX + (ev.clientX - panStartX)
    panY.value = panStartPanY + (ev.clientY - panStartY)
  }

  function onUp() {
    isPanning = false
    ignoreNextCanvasClick = true
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function isBlankCanvasTarget(target: HTMLElement | null) {
  if (!target) return false
  if (target.closest('.group, button, input, textarea, select, [data-no-canvas-menu]')) return false
  return target === canvasRoot.value || !!target.closest('[data-canvas-surface="true"]')
}

function addQuickCard(type: NodeType) {
  if (!import.meta.client) return
  const rect = canvasRoot.value?.getBoundingClientRect()
  const point = canvasPointFromEvent({
    clientX: (rect?.left ?? 0) + (rect?.width ?? window.innerWidth) / 2,
    clientY: (rect?.top ?? 0) + (rect?.height ?? window.innerHeight) / 2
  })
  createAt(type, point.x - 180, point.y - 120)
}

function createAt(type: NodeType, x: number, y: number) {
  if (type === 'image') {
    canvasStore.addObject({ type: 'image', x, y, width: 600, height: 430, title: t('图像节点', 'Image waypoint'), content: t('描述图像生成或编辑要求。', 'Describe image generation or editing instructions.') })
  } else if (type === 'video') {
    canvasStore.addObject({ type: 'video', x, y, width: 600, height: 430, title: t('视频节点', 'Video waypoint'), content: t('描述场景、镜头运动、时长和参考素材。', 'Describe scene, camera motion, duration and references.') })
  } else if (type === 'moodboard') {
    canvasStore.addObject({ type: 'moodboard', x, y, width: 420, height: 280, title: t('分镜', 'Storyboard'), content: t('镜头 01-06 和视觉方向。', 'Shots 01-06 and visual direction.') })
  } else {
    canvasStore.addObject({ type: 'prompt', x, y, width: 360, height: 220, title: t('Prompt 节点', 'Prompt waypoint'), content: t('新的创意资产，可继续细化。', 'New creative asset ready for refinement.') })
  }
  contextMenu.visible = false
}

function createStarterRoute(kind: 'video' | 'poster' | 'storyboard') {
  const baseX = 120
  const baseY = 260
  if (kind === 'video') {
    const prompt = canvasStore.addObject({ type: 'prompt', x: baseX, y: baseY, width: 360, height: 220, title: t('创意 Prompt', 'Creative Prompt'), content: t('四个主视觉候选画面。', 'Four hero frame candidates.') })
    const image = canvasStore.addObject({ type: 'image', x: baseX + 440, y: baseY + 70, width: 380, height: 260, title: t('图像生成', 'Image Generate'), content: t('生成关键首帧和参考图。', 'Generate key first frame and references.') })
    const video = canvasStore.addObject({ type: 'video', x: baseX + 900, y: baseY + 120, width: 420, height: 300, title: t('图生视频', 'Image to Video'), content: t('12 秒竖屏动态草稿。', '12s vertical motion draft.') })
    canvasStore.addLink(prompt.id, image.id, 'image')
    canvasStore.addLink(image.id, video.id, 'video')
    return
  }
  if (kind === 'poster') {
    const prompt = canvasStore.addObject({ type: 'prompt', x: baseX, y: baseY, width: 360, height: 220, title: t('海报 Brief', 'Poster Brief'), content: t('产品、氛围、色彩和版式要求。', 'Product, mood, color and layout requirements.') })
    const image = canvasStore.addObject({ type: 'image', x: baseX + 440, y: baseY + 70, width: 430, height: 320, title: t('海报渲染', 'Poster Render'), content: t('生成 1:1 和 9:16 版本。', 'Generate 1:1 and 9:16 versions.') })
    canvasStore.addLink(prompt.id, image.id, 'render')
    return
  }
  const prompt = canvasStore.addObject({ type: 'prompt', x: baseX, y: baseY, width: 360, height: 220, title: t('故事目标', 'Story Goal'), content: t('定义角色、冲突、转场和镜头节奏。', 'Define character, conflict, transition and shot rhythm.') })
  const board = canvasStore.addObject({ type: 'moodboard', x: baseX + 430, y: baseY + 80, width: 380, height: 260, title: t('分镜', 'Storyboard'), content: t('拆分为镜头 01-06。', 'Break into shots 01-06.') })
  canvasStore.addLink(prompt.id, board.id, 'storyboard')
}

function handleCardSelect(id: string) {
  if (canvasStore.connectionStartId && canvasStore.connectionStartId !== id) {
    canvasStore.finishConnection(id)
    return
  }
  canvasStore.selectObject(id)
}

function handleKeydown(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  if (key === 'n' && !e.ctrlKey) addQuickCard('prompt')
  if (key === 'escape') canvasStore.cancelConnection()
  if (key === 'delete' && canvasStore.selectedId) canvasStore.removeObject(canvasStore.selectedId)
  if (key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    canvasStore.saveAll()
  }
}

function handleWheel(e: WheelEvent) {
  canvasStore.setZoom(canvasStore.zoom + (e.deltaY > 0 ? -5 : 5))
}

function handleCanvasClick() {
  if (ignoreNextCanvasClick) {
    ignoreNextCanvasClick = false
    return
  }
  contextMenu.visible = false
  canvasStore.cancelConnection()
  canvasStore.selectObject(null)
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('beforeunload', handleBeforeUnload)
  const pid = route.query.pid as string | undefined
  if (pid) {
    if (import.meta.client) localStorage.setItem('polaris.activeProject', pid)
    canvasStore.loadProject(Number(pid))
  } else {
    canvasStore.loadProject()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('beforeunload', handleBeforeUnload)
  saveOnLeave()
})

async function saveOnLeave() {
  if (canvasStore.objects.length > 0) {
    await canvasStore.saveAll()
  }
}

function handleBeforeUnload() {
  if (canvasStore.objects.some(o => o.dirty)) {
    canvasStore.saveAll()
  }
}
</script>
