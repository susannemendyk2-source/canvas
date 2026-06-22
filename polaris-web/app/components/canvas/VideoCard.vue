<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-xs text-white/70">
      <span class="inline-flex items-center gap-2">
        <Clapperboard class="size-4" />
        Video
      </span>
      <button class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72" @click.stop>
        <Upload class="mr-1 inline size-3.5" />
        Upload
      </button>
    </div>
    <div class="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]">
      <Play class="size-14 text-white/28" />
    </div>
    <div class="rounded-xl border border-white/10 bg-[#0d0f15] p-3">
      <div class="mb-3 flex flex-wrap gap-2 text-xs text-white/54">
        <button v-for="tab in tabs" :key="tab" class="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 hover:text-white" @click.stop>
          {{ tab }}
        </button>
        <button class="ml-auto grid size-8 place-items-center rounded-lg text-white/45 hover:bg-white/8" title="Expand" @click.stop>
          <Expand class="size-4" />
        </button>
      </div>
      <div class="mb-3 flex flex-wrap gap-2">
        <button class="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68" @click.stop>
          <WandSparkles class="mr-1 inline size-3.5" />
          Smart
        </button>
        <button class="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68" @click.stop>
          <Plus class="mr-1 inline size-3.5" />
          Asset
        </button>
        <button class="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68" @click.stop>
          <Camera class="mr-1 inline size-3.5" />
          Camera
        </button>
      </div>
      <textarea
        :value="content"
        class="min-h-20 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/62 outline-none focus:border-cyan-300/30"
        placeholder="Describe the video, camera motion, duration, and references..."
        @input="$emit('update', ($event.target as HTMLTextAreaElement).value)"
        @mousedown.stop
        @click.stop
      />
      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option>Seedance 2.0 Fast</option>
          <option>Aura Video v1</option>
        </select>
        <select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option>16:9 · 720p · 5s</option>
          <option>9:16 · 1080p · 8s</option>
        </select>
        <button class="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72" @click.stop>18 credits</button>
        <button class="ml-auto grid size-9 place-items-center rounded-full bg-violet-300 text-black" @click.stop>→</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera, Clapperboard, Expand, Play, Plus, Upload, WandSparkles } from 'lucide-vue-next'

defineProps<{
  content?: string
}>()

defineEmits<{
  update: [content: string]
}>()

const tabs = ['Text to video', 'Reference', 'Image to video', 'First frame']
</script>
