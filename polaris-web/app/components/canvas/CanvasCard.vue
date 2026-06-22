<template>
  <div
    class="glass group absolute rounded-lg border p-3 transition hover:border-cyan-300/30"
    :class="selected ? 'border-cyan-300/45 shadow-glow' : 'border-white/10'"
    :style="{ left: object.x + 'px', top: object.y + 'px', width: object.width + 'px', minHeight: object.height + 'px' }"
    @click.stop="$emit('select')"
  >
    <div class="mb-3 flex items-center justify-between gap-3">
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <button class="grid size-7 shrink-0 cursor-grab place-items-center rounded text-white/35 hover:bg-white/8 hover:text-white/70" @mousedown.stop.prevent="startDrag">
          <GripVertical class="size-4" />
        </button>
        <input
          :value="object.title"
          class="min-w-0 flex-1 truncate rounded border border-transparent bg-transparent px-1 py-1 text-sm font-medium text-white/86 outline-none focus:border-cyan-300/30 focus:bg-black/20"
          @input="updateTitle"
          @mousedown.stop
          @click.stop
        />
      </div>
      <div class="flex opacity-0 transition group-hover:opacity-100" :class="{ 'opacity-100': selected }">
        <button title="Duplicate" class="grid size-7 place-items-center rounded hover:bg-white/10" @click.stop="$emit('duplicate')">
          <Copy class="size-3.5" />
        </button>
        <button title="Send to workflow" class="grid size-7 place-items-center rounded hover:bg-white/10" @click.stop="$emit('sendToWorkflow')">
          <Workflow class="size-3.5" />
        </button>
        <button title="Delete" class="grid size-7 place-items-center rounded hover:bg-white/10 hover:text-red-300" @click.stop="$emit('delete')">
          <Trash2 class="size-3.5" />
        </button>
      </div>
    </div>

    <PromptCard v-if="object.type === 'prompt'" :content="object.content" @update="updateContent" />
    <ImageCard v-else-if="['image', 'generated', 'moodboard', 'reference'].includes(object.type)" :content="object.content" @update="updateContent" />
    <VideoCard v-else-if="object.type === 'video'" :content="object.content" @update="updateContent" />
    <textarea
      v-else
      :value="object.content"
      class="min-h-28 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/72 outline-none focus:border-cyan-300/30"
      @input="updateContent"
      @mousedown.stop
      @click.stop
    />

    <div
      class="absolute bottom-1 right-1 size-4 cursor-nwse-resize rounded-sm border-b border-r border-cyan-100/35 opacity-0 transition group-hover:opacity-100"
      @mousedown.stop.prevent="startResize"
    />
  </div>
</template>

<script setup lang="ts">
import { Copy, GripVertical, Trash2, Workflow } from 'lucide-vue-next'
import PromptCard from '~/components/canvas/PromptCard.vue'
import ImageCard from '~/components/canvas/ImageCard.vue'
import VideoCard from '~/components/canvas/VideoCard.vue'
import type { CanvasObject } from '~/types'

const props = defineProps<{
  object: CanvasObject
  selected?: boolean
}>()

const emit = defineEmits<{
  select: []
  delete: []
  duplicate: []
  move: [x: number, y: number]
  resize: [width: number, height: number]
  update: [data: Partial<CanvasObject>]
  sendToWorkflow: []
}>()

function updateTitle(event: Event) {
  emit('update', { title: (event.target as HTMLInputElement).value })
}

function updateContent(valueOrEvent: string | Event) {
  const content = typeof valueOrEvent === 'string'
    ? valueOrEvent
    : (valueOrEvent.target as HTMLTextAreaElement).value
  emit('update', { content })
}

function startDrag(event: MouseEvent) {
  emit('select')
  const startX = event.clientX
  const startY = event.clientY
  const objX = props.object.x
  const objY = props.object.y

  function onMove(ev: MouseEvent) {
    emit('move', objX + ev.clientX - startX, objY + ev.clientY - startY)
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function startResize(event: MouseEvent) {
  emit('select')
  const startX = event.clientX
  const startY = event.clientY
  const startW = props.object.width
  const startH = props.object.height

  function onMove(ev: MouseEvent) {
    emit('resize', startW + ev.clientX - startX, startH + ev.clientY - startY)
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>
