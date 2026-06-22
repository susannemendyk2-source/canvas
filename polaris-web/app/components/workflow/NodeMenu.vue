<template>
  <div class="rounded-lg border border-white/10 bg-[#11131a]/95 p-2 shadow-glass backdrop-blur-xl">
    <button
      v-for="node in nodeTypes"
      :key="node.key"
      class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/68 transition hover:bg-white/8 hover:text-cyan-50"
      @click="$emit('select', node.key)"
    >
      <component :is="node.icon" class="size-4" />
      {{ node.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { FileText, Image, Video, Sparkles, Merge, ExternalLink } from 'lucide-vue-next'

defineEmits<{
  select: [type: string]
}>()

const nodeTypes = [
  { key: 'prompt', icon: FileText, label: 'Prompt' },
  { key: 'image-gen', icon: Image, label: 'Image Generation' },
  { key: 'video-gen', icon: Video, label: 'Video Generation' },
  { key: 'enhance', icon: Sparkles, label: 'Enhance' },
  { key: 'merge', icon: Merge, label: 'Merge' },
  { key: 'output', icon: ExternalLink, label: 'Output' }
]
</script>
