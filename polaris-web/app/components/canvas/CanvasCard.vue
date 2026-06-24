<template>
  <div
    class="glass group absolute rounded-lg border p-3 transition-[border-color,opacity,transform] duration-150"
    :class="[
      selected ? 'border-cyan-300/45 shadow-glow' : 'border-white/10',
      connecting ? 'ring-2 ring-emerald-300/60' : '',
      isDragging ? 'z-50 scale-[1.02] opacity-80 shadow-2xl' : ''
    ]"
    :style="{ left: object.x + 'px', top: object.y + 'px', width: object.width + 'px', minHeight: object.height + 'px', touchAction: isDragging ? 'none' : '' }"
    @pointerdown="onPointerDown"
  >
    <div class="mb-3 flex items-center justify-between gap-3">
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <div class="grid size-7 shrink-0 cursor-grab place-items-center rounded text-white/35 hover:bg-white/8 hover:text-white/70" :class="{ 'cursor-grabbing': isDragging }">
          <GripVertical class="size-4" />
        </div>
        <input
          :value="object.title"
          class="min-w-0 flex-1 truncate rounded border border-transparent bg-transparent px-1 py-1 text-sm font-medium text-white/86 outline-none focus:border-cyan-300/30 focus:bg-black/20"
          @input="updateTitle"
          @pointerdown.stop
          @click.stop
        />
      </div>
      <div class="flex opacity-0 transition group-hover:opacity-100" :class="{ 'opacity-100': selected }">
        <button :title="t('连接', 'Connect')" class="grid size-7 place-items-center rounded hover:bg-white/10 hover:text-emerald-200" @pointerdown.stop @click.stop="$emit('startConnect')">
          <Cable class="size-3.5" />
        </button>
        <button :title="t('复制', 'Duplicate')" class="grid size-7 place-items-center rounded hover:bg-white/10" @pointerdown.stop @click.stop="$emit('duplicate')">
          <Copy class="size-3.5" />
        </button>
        <button :title="t('发送到 Workflow', 'Send to workflow')" class="grid size-7 place-items-center rounded hover:bg-white/10" @pointerdown.stop @click.stop="$emit('sendToWorkflow')">
          <Workflow class="size-3.5" />
        </button>
        <button :title="t('删除', 'Delete')" class="grid size-7 place-items-center rounded hover:bg-white/10 hover:text-red-300" @pointerdown.stop @click.stop="$emit('delete')">
          <Trash2 class="size-3.5" />
        </button>
      </div>
    </div>

    <PromptCard v-if="object.type === 'prompt'" :content="object.content" @update="updateContent" />
    <ImageCard v-else-if="['image', 'generated', 'moodboard', 'reference'].includes(object.type)" :content="object.content" :meta="object.meta" @update="updateContent" />
    <VideoCard v-else-if="object.type === 'video'" :content="object.content" :meta="object.meta" :object-id="object.id" @update="updateContent" />
    <textarea
      v-else
      :value="object.content"
      class="min-h-28 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/72 outline-none focus:border-cyan-300/30"
      @input="updateContent"
      @pointerdown.stop
      @click.stop
    />

    <div
      class="absolute bottom-1 right-1 size-4 cursor-nwse-resize rounded-sm border-b border-r border-cyan-100/35 opacity-0 transition group-hover:opacity-100"
      @pointerdown.stop="startResize"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Cable, Copy, GripVertical, Trash2, Workflow } from 'lucide-vue-next'
import PromptCard from '~/components/canvas/PromptCard.vue'
import ImageCard from '~/components/canvas/ImageCard.vue'
import VideoCard from '~/components/canvas/VideoCard.vue'
import type { CanvasObject } from '~/types'
import { useSettingsStore } from '~/stores/settingsStore'

const props = defineProps<{
  object: CanvasObject
  selected?: boolean
  connecting?: boolean
}>()

const emit = defineEmits<{
  select: []
  delete: []
  duplicate: []
  move: [x: number, y: number]
  resize: [width: number, height: number]
  update: [data: Partial<CanvasObject>]
  sendToWorkflow: []
  startConnect: []
}>()

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const isDragging = ref(false)

function shouldIgnore(e: PointerEvent): boolean {
  return !!(e.target as HTMLElement).closest('textarea, input, select, [data-no-drag]')
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 || shouldIgnore(e)) return

  emit('select')

  const dragStartX = e.clientX
  const dragStartY = e.clientY
  const objX = props.object.x
  const objY = props.object.y

  function onMove(ev: PointerEvent) {
    if (!isDragging.value) {
      isDragging.value = true
    }
    emit('move', objX + ev.clientX - dragStartX, objY + ev.clientY - dragStartY)
  }

  function onUp() {
    isDragging.value = false
    cleanup()
  }

  function cleanup() {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function startResize(e: PointerEvent) {
  emit('select')
  const startX = e.clientX
  const startY = e.clientY
  const startW = props.object.width
  const startH = props.object.height

  function onMove(ev: PointerEvent) {
    emit('resize', startW + ev.clientX - startX, startH + ev.clientY - startY)
  }

  function onUp() {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function updateTitle(event: Event) {
  emit('update', { title: (event.target as HTMLInputElement).value })
}

function updateContent(valueOrEvent: string | Record<string, unknown> | Event) {
  if (typeof valueOrEvent === 'object' && !(valueOrEvent instanceof Event)) {
    emit('update', valueOrEvent as Record<string, unknown>)
    return
  }
  const content = typeof valueOrEvent === 'string'
    ? valueOrEvent
    : (valueOrEvent.target as HTMLTextAreaElement).value
  emit('update', { content })
}
</script>
