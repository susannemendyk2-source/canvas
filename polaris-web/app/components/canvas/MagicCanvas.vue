<template>
  <div
    data-canvas-root="true"
    class="dotted-grid relative flex-1 overflow-hidden bg-[#03050b]"
    tabindex="0"
    @dblclick.capture.prevent="openMenuFromEvent"
    @contextmenu.capture.prevent="openMenuFromEvent"
    @pointerdown.capture="handlePointerDown"
    @click="handleCanvasClick"
  >
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,.10),transparent_32%)]" />

    <div v-if="canvasStore.loading" class="absolute inset-0 z-50 grid place-items-center bg-black/30 text-sm text-white/60">
      Loading canvas...
    </div>

    <div class="absolute left-6 top-5 z-30 rounded-full border border-cyan-100/12 bg-black/45 px-3 py-1.5 text-xs text-white/45 backdrop-blur">
      Polaris 星图画布 / Star Map Canvas
    </div>

    <div class="absolute right-6 top-7 z-30 flex items-center gap-2">
      <button data-no-canvas-menu="true" class="rounded-lg border border-cyan-100/12 bg-black/45 px-4 py-2 text-sm text-white/84 backdrop-blur transition hover:border-cyan-200/35" @click.stop="openMenuAtCenter">
        <Plus class="mr-2 inline size-4" />
        添加节点 / Add Node
      </button>
      <button data-no-canvas-menu="true" class="rounded-lg border border-cyan-100/12 bg-black/45 px-4 py-2 text-sm text-white/84 backdrop-blur transition hover:border-cyan-200/35" @click.stop="workspaceStore.setMode('workflow')">
        <Play class="mr-2 inline size-4" />
        运行工作流 / Run Workflow
      </button>
    </div>

    <template v-if="canvasStore.objects.length === 0">
      <div class="absolute inset-0 z-10 grid place-items-center px-8">
        <div class="max-w-2xl text-center">
          <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs text-white/58">
            <Compass class="size-3.5 text-cyan-100" />
            双击或右键创建节点 / Double click or right click to add a node
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
            <button class="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50" @click.stop="addQuickCard('video')">
              <FileVideo class="mr-2 inline size-4" />
              文字生成视频 / Text to Video
            </button>
            <button class="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50" @click.stop="addQuickCard('image')">
              <ImagePlus class="mr-2 inline size-4" />
              图片编辑 / Image Edit
            </button>
            <button class="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50" @click.stop="addQuickCard('moodboard')">
              <LayoutTemplate class="mr-2 inline size-4" />
              模板 / Templates
            </button>
          </div>
        </div>
      </div>
    </template>

    <div
      v-if="contextMenu.visible"
      class="fixed z-[999] w-64 rounded-2xl border border-cyan-100/14 bg-[#111722]/95 p-3 shadow-glass backdrop-blur-xl"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      @click.stop
      @dblclick.stop
    >
      <div class="mb-3 flex items-center justify-between">
        <div class="text-sm font-medium">添加节点 / Add Node</div>
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
      :class="{ 'pointer-events-none': canvasStore.objects.length === 0 }"
      :style="{ transform: `scale(${canvasStore.zoom / 100})`, width: `${10000 / canvasStore.zoom}%`, height: `${10000 / canvasStore.zoom}%` }"
    >
      <CanvasCard
        v-for="obj in canvasStore.objects"
        :key="obj.id"
        :object="obj"
        :selected="canvasStore.selectedId === obj.id"
        @select="canvasStore.selectObject(obj.id)"
        @delete="canvasStore.removeObject(obj.id)"
        @duplicate="canvasStore.duplicateObject(obj.id)"
        @send-to-workflow="workspaceStore.setMode('workflow')"
        @move="(x: number, y: number) => canvasStore.moveObject(obj.id, x, y)"
        @resize="(width: number, height: number) => canvasStore.resizeObject(obj.id, width, height)"
        @update="(data) => canvasStore.updateObject(obj.id, data)"
      />
    </div>

    <div v-if="canvasStore.error" class="absolute bottom-24 left-6 z-50 rounded-lg border border-red-300/20 bg-red-950/50 px-3 py-2 text-xs text-red-100">
      {{ canvasStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Boxes, Clapperboard, Compass, FileText, FileVideo, ImagePlus, LayoutTemplate, Play, Plus, X } from 'lucide-vue-next'
import CanvasCard from '~/components/canvas/CanvasCard.vue'
import { useCanvasStore } from '~/stores/canvasStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useWorkspaceStore } from '~/stores/workspaceStore'

const canvasStore = useCanvasStore()
const settingsStore = useSettingsStore()
const workspaceStore = useWorkspaceStore()

const contextMenu = reactive({ visible: false, x: 0, y: 0, canvasX: 0, canvasY: 0 })
let ignoreNextCanvasClick = false
let lastPointerTime = 0
let lastPointerX = 0
let lastPointerY = 0

const waypointTypes = [
  { type: 'prompt' as const, label: '提示词 / Prompt', icon: FileText },
  { type: 'image' as const, label: '图像 / Image', icon: ImagePlus },
  { type: 'video' as const, label: '视频 / Video', icon: FileVideo },
  { type: 'moodboard' as const, label: '模板 / Template', icon: LayoutTemplate }
]

const starterRoutes = [
  { kind: 'video' as const, title: '短视频航线', subtitle: 'Prompt -> Image -> Video', icon: Clapperboard },
  { kind: 'poster' as const, title: '海报星图', subtitle: 'Prompt -> Image -> Export', icon: ImagePlus },
  { kind: 'storyboard' as const, title: '分镜脚本', subtitle: 'Prompt -> Frames -> Route', icon: Boxes }
]

function canvasPointFromEvent(e: Pick<MouseEvent, 'clientX' | 'clientY'>) {
  const scale = canvasStore.zoom / 100
  const canvasEl = document.querySelector('[data-canvas-root="true"]') as HTMLElement | null
  const rect = canvasEl?.getBoundingClientRect()
  return {
    x: (e.clientX - (rect?.left ?? 0)) / scale,
    y: (e.clientY - (rect?.top ?? 0)) / scale
  }
}

function openMenuFromEvent(e: MouseEvent) {
  e.stopPropagation()
  ignoreNextCanvasClick = true
  const point = canvasPointFromEvent(e)
  contextMenu.x = Math.min(e.clientX, window.innerWidth - 280)
  contextMenu.y = Math.min(e.clientY, window.innerHeight - 280)
  contextMenu.canvasX = point.x
  contextMenu.canvasY = point.y
  contextMenu.visible = true
}

function handlePointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  const target = e.target as HTMLElement | null
  if (target?.closest('textarea,input,select,button,[data-no-canvas-menu="true"]')) return

  const now = Date.now()
  const dx = Math.abs(e.clientX - lastPointerX)
  const dy = Math.abs(e.clientY - lastPointerY)
  if (now - lastPointerTime < 320 && dx < 8 && dy < 8) {
    openMenuFromEvent(e as unknown as MouseEvent)
  }
  lastPointerTime = now
  lastPointerX = e.clientX
  lastPointerY = e.clientY
}

function openMenuAtCenter() {
  if (!import.meta.client) return
  openMenuFromEvent({
    clientX: window.innerWidth / 2,
    clientY: window.innerHeight / 2,
    stopPropagation: () => {}
  } as MouseEvent)
}

function addQuickCard(type: 'image' | 'video' | 'prompt' | 'moodboard') {
  if (!import.meta.client) return
  const canvasEl = document.querySelector('[data-canvas-root="true"]') as HTMLElement | null
  const rect = canvasEl?.getBoundingClientRect()
  const point = canvasPointFromEvent({
    clientX: (rect?.left ?? 0) + (rect?.width ?? window.innerWidth) / 2,
    clientY: (rect?.top ?? 0) + (rect?.height ?? window.innerHeight) / 2
  })
  createAt(type, point.x - 180, point.y - 120)
}

function createAt(type: 'image' | 'video' | 'prompt' | 'moodboard', x: number, y: number) {
  if (type === 'image') {
    canvasStore.addObject({ type: 'image', x, y, width: 600, height: 430, title: 'Image 图像节点', content: '输入图像生成或编辑提示词，例如：把背景改成极光雪夜。' })
  } else if (type === 'video') {
    canvasStore.addObject({ type: 'video', x, y, width: 600, height: 430, title: 'Video 视频节点', content: '描述你想生成的画面、镜头、时长和参考素材。' })
  } else {
    canvasStore.addObject({ type, x, y, title: type === 'prompt' ? 'Prompt 提示词节点' : 'Template 模板节点', content: 'New creative asset ready for refinement.' })
  }
  contextMenu.visible = false
}

function createStarterRoute(kind: 'video' | 'poster' | 'storyboard') {
  const baseX = 120
  const baseY = 260
  if (kind === 'video') {
    canvasStore.addObject({ type: 'prompt', x: baseX, y: baseY, width: 360, height: 220, title: '创意提示 / Creative Prompt', content: '四个主视觉候选画面。Four hero frame candidates.' })
    canvasStore.addObject({ type: 'image', x: baseX + 440, y: baseY + 70, width: 380, height: 260, title: '图像生成 / Image Generate', content: '生成关键首帧与参考图。' })
    canvasStore.addObject({ type: 'video', x: baseX + 900, y: baseY + 120, width: 420, height: 300, title: '图生视频 / Image to Video', content: '12 秒竖屏动态草稿。12s vertical motion draft.' })
    return
  }
  if (kind === 'poster') {
    canvasStore.addObject({ type: 'prompt', x: baseX, y: baseY, width: 360, height: 220, title: '海报文案 / Poster Brief', content: '产品、情绪、色彩、版式要求。' })
    canvasStore.addObject({ type: 'image', x: baseX + 440, y: baseY + 70, width: 430, height: 320, title: '海报生成 / Poster Render', content: '生成 1:1 和 9:16 版本。' })
    return
  }
  canvasStore.addObject({ type: 'prompt', x: baseX, y: baseY, width: 360, height: 220, title: '故事目标 / Story Goal', content: '输入角色、冲突、转场和镜头节奏。' })
  canvasStore.addObject({ type: 'moodboard', x: baseX + 430, y: baseY + 80, width: 380, height: 260, title: '分镜板 / Storyboard', content: '拆分为镜头 01-06。' })
}

function handleKeydown(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  if (key === 'c' && !e.ctrlKey) settingsStore.toggleSettings()
  if (key === 'n' && !e.ctrlKey) addQuickCard('prompt')
  if (key === 'delete' && canvasStore.selectedId) canvasStore.removeObject(canvasStore.selectedId)
  if (key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    canvasStore.saveAll()
  }
}

function handleCanvasClick() {
  if (ignoreNextCanvasClick) {
    ignoreNextCanvasClick = false
    return
  }
  contextMenu.visible = false
  canvasStore.selectObject(null)
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  canvasStore.loadProject()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
