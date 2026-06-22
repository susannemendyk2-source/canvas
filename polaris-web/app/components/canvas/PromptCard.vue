<template>
  <div>
    <div class="mb-3 flex items-center gap-2 text-xs text-cyan-100">
      <WandSparkles class="size-4" />
      Prompt recipe
    </div>
    <textarea
      :value="content"
      class="min-h-32 w-full resize-none rounded-xl border border-white/8 bg-[#0d0f15] p-3 text-sm leading-6 text-white/72 outline-none focus:border-cyan-300/30"
      placeholder="Describe the scene, product, mood, constraints, or generation route..."
      @input="$emit('update', ($event.target as HTMLTextAreaElement).value)"
      @mousedown.stop
      @click.stop
    />
    <div class="mt-3 flex flex-wrap gap-1.5">
      <span v-for="tag in tags" :key="tag" class="rounded-full border border-cyan-100/10 px-2 py-0.5 text-[11px] text-white/45">
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WandSparkles } from 'lucide-vue-next'

defineProps<{
  content?: string
}>()

defineEmits<{
  update: [content: string]
}>()

const tags = ['9:16', 'cinematic', 'macro', 'soft glass']
</script>
