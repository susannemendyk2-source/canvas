<template>
  <div class="w-[280px] rounded-lg border border-white/10 bg-[#11131a]/90 p-3 shadow-glass backdrop-blur-xl">
    <Handle type="target" :position="Position.Left" class="!border-white/10 !bg-white/8" />

    <div class="mb-2 flex items-center gap-2">
      <component :is="iconComponent" class="size-4 text-studio-cyan" />
      <span class="text-sm font-medium text-white/80">{{ data.label }}</span>
      <div class="ml-auto">
        <StatusBadge :status="data.status" />
      </div>
    </div>

    <div v-if="data.nodeType" class="mb-2">
      <div class="flex items-center justify-between text-xs text-white/45">
        <span>Input</span>
        <span>Output</span>
      </div>
      <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          class="h-full rounded-full bg-studio-cyan transition-all"
          :style="{ width: data.progress + '%' }"
        />
      </div>
    </div>

    <Handle type="source" :position="Position.Right" class="!border-white/10 !bg-white/8" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { FileText, Image, Video, Sparkles, Merge, ExternalLink } from 'lucide-vue-next'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import type { NodeType } from '~/types'

const props = defineProps<{
  data: {
    label: string
    nodeType: NodeType
    status: 'idle' | 'queued' | 'running' | 'success' | 'failed'
    progress: number
    icon: string
  }
}>()

const iconMap: Record<string, any> = {
  prompt: FileText,
  'image-gen': Image,
  'video-gen': Video,
  enhance: Sparkles,
  merge: Merge,
  output: ExternalLink
}

const iconComponent = computed(() => iconMap[props.data.nodeType] || FileText)
</script>
