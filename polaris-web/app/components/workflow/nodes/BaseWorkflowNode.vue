<template>
  <div class="w-[300px] rounded-lg border border-white/10 bg-[#11131a]/90 p-3 shadow-glass backdrop-blur-xl">
    <Handle type="target" :position="Position.Left" class="!border-white/10 !bg-white/8" />

    <div class="mb-2 flex items-center gap-2">
      <component :is="iconComponent" class="size-4 text-studio-cyan" />
      <span class="text-sm font-medium text-white/80">{{ data.label }}</span>
      <div class="ml-auto">
        <StatusBadge :status="data.status" />
      </div>
    </div>

    <div v-if="data.nodeType === 'prompt'" class="mb-2">
      <textarea
        class="min-h-[60px] w-full resize-none rounded-lg border border-white/8 bg-black/20 p-2 text-xs leading-5 text-white/72 outline-none focus:border-cyan-300/30"
        placeholder="Enter your prompt..."
        :value="data.prompt"
        @input="emit('update', { prompt: ($event.target as HTMLTextAreaElement).value })"
        @mousedown.stop
        @click.stop
      />
    </div>

    <div v-if="data.nodeType === 'image-gen' || data.nodeType === 'video-gen'" class="mb-2 flex gap-1">
      <select
        v-if="data.nodeType === 'image-gen'"
        class="flex-1 rounded border border-white/10 bg-[#161b25] px-2 py-1 text-[10px] text-white/72 outline-none"
        :value="data.model || 'dall-e-3'"
        @change="emit('update', { model: ($event.target as HTMLSelectElement).value })"
        @mousedown.stop @click.stop
      >
        <option value="dall-e-3">DALL-E 3</option>
        <option value="dall-e-2">DALL-E 2</option>
        <option value="jimeng-4.0">即梦 4.0</option>
        <option value="jimeng-5.0">即梦 5.0</option>
      </select>
      <select
        v-if="data.nodeType === 'video-gen'"
        class="flex-1 rounded border border-white/10 bg-[#161b25] px-2 py-1 text-[10px] text-white/72 outline-none"
        :value="data.model || 'jimeng-video-3.5-pro'"
        @change="emit('update', { model: ($event.target as HTMLSelectElement).value })"
        @mousedown.stop @click.stop
      >
        <option value="jimeng-video-3.5-pro">即梦 Video 3.5 Pro</option>
        <option value="jimeng-video-seedance-2.0">即梦 Seedance 2.0</option>
        <option value="seedance-2.0">Seedance 2.0 Fast</option>
      </select>
      <select
        v-if="data.nodeType === 'image-gen'"
        class="rounded border border-white/10 bg-[#161b25] px-2 py-1 text-[10px] text-white/72 outline-none"
        :value="data.size || '1024x1024'"
        @change="emit('update', { size: ($event.target as HTMLSelectElement).value })"
        @mousedown.stop @click.stop
      >
        <option value="1024x1024">1:1</option>
        <option value="1024x1792">9:16</option>
        <option value="1792x1024">16:9</option>
      </select>
    </div>

    <div v-if="data.output && (data.nodeType === 'image-gen')" class="mb-2 overflow-hidden rounded-lg border border-white/10">
      <img :src="data.output" class="w-full object-cover" alt="Generated" @click.stop />
    </div>

    <div v-if="data.output && (data.nodeType === 'video-gen')" class="mb-2 overflow-hidden rounded-lg border border-white/10">
      <video :src="data.output" controls class="w-full" @click.stop />
    </div>

    <div v-if="data.error" class="mb-2 rounded-lg border border-red-500/30 bg-red-500/8 p-2">
      <p class="text-[10px] text-red-400">{{ data.error }}</p>
    </div>

    <div v-if="data.output && (data.nodeType === 'prompt' || data.nodeType === 'enhance' || data.nodeType === 'merge' || data.nodeType === 'output')" class="mb-2">
      <div class="max-h-[80px] overflow-y-auto rounded-lg border border-white/8 bg-black/20 p-2 text-[10px] leading-5 text-white/60">{{ data.output }}</div>
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
    prompt?: string
    output?: string
    error?: string
    model?: string
    size?: string
  }
}>()

const emit = defineEmits<{
  update: [payload: Partial<{ prompt: string; model: string; size: string }>]
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
