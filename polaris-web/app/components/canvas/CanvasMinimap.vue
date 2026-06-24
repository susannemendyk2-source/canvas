<template>
  <div class="absolute bottom-20 right-5 z-30 h-32 w-48 overflow-hidden rounded border border-cyan-100/14 bg-[#0b1018]/82 shadow-glass backdrop-blur">
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[length:16px_16px]" />
    <div class="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-wide text-white/38">Map</div>
    <div class="absolute inset-x-3 bottom-3 top-6">
      <div
        v-for="item in minimapItems"
        :key="item.id"
        class="absolute rounded-sm border"
        :class="item.className"
        :style="{ left: `${item.left}%`, top: `${item.top}%`, width: `${item.width}%`, height: `${item.height}%` }"
      />
      <div v-if="canvasStore.objects.length === 0" class="grid h-full place-items-center text-[10px] text-white/30">
        Empty
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '~/stores/canvasStore'
import type { CanvasObject } from '~/types'

const canvasStore = useCanvasStore()

const typeClasses: Record<string, string> = {
  prompt: 'border-cyan-200/60 bg-cyan-200/35',
  image: 'border-violet-200/60 bg-violet-200/35',
  video: 'border-blue-200/60 bg-blue-200/35',
  moodboard: 'border-emerald-200/60 bg-emerald-200/35',
  generated: 'border-amber-200/60 bg-amber-200/35'
}

const minimapItems = computed(() => {
  const objects = canvasStore.objects
  if (!objects.length) return []

  const minX = Math.min(...objects.map((item) => item.x))
  const minY = Math.min(...objects.map((item) => item.y))
  const maxX = Math.max(...objects.map((item) => item.x + item.width))
  const maxY = Math.max(...objects.map((item) => item.y + item.height))
  const width = Math.max(1, maxX - minX)
  const height = Math.max(1, maxY - minY)
  const pad = 8

  return objects.map((item: CanvasObject) => ({
    id: item.id,
    left: pad + ((item.x - minX) / width) * (100 - pad * 2),
    top: pad + ((item.y - minY) / height) * (100 - pad * 2),
    width: Math.max(5, (item.width / width) * (100 - pad * 2)),
    height: Math.max(6, (item.height / height) * (100 - pad * 2)),
    className: typeClasses[item.type] || 'border-white/50 bg-white/25'
  }))
})
</script>
