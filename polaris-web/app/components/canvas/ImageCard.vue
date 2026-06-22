<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-xs text-white/70">
      <span class="inline-flex items-center gap-2">
        <WandSparkles class="size-4" />
        Image
      </span>
      <button class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72" @click.stop>
        <Upload class="mr-1 inline size-3.5" />
        Upload
      </button>
    </div>
    <div class="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]">
      <ImageIcon class="size-12 text-white/28" />
    </div>
    <div class="rounded-xl border border-white/10 bg-[#0d0f15] p-3">
      <div class="mb-3 flex gap-2">
        <button class="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68" @click.stop>
          <Palette class="mr-1 inline size-3.5" />
          Style
        </button>
        <button class="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68" @click.stop>Mark</button>
        <button class="ml-auto grid size-8 place-items-center rounded-lg text-white/45 hover:bg-white/8" title="Expand" @click.stop>
          <Expand class="size-4" />
        </button>
      </div>
      <textarea
        :value="content"
        class="min-h-20 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/62 outline-none focus:border-cyan-300/30"
        placeholder="Prompt, references, edit notes..."
        @input="$emit('update', ($event.target as HTMLTextAreaElement).value)"
        @mousedown.stop
        @click.stop
      />
      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option>Banana Pro</option>
          <option>Aura Image v1</option>
        </select>
        <select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option>16:9</option>
          <option>9:16</option>
          <option>1:1</option>
        </select>
        <button class="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72" @click.stop>2K</button>
        <button class="ml-auto grid size-9 place-items-center rounded-full bg-violet-300 text-black" @click.stop>→</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Expand, ImageIcon, Palette, Upload, WandSparkles } from 'lucide-vue-next'

defineProps<{
  content?: string
}>()

defineEmits<{
  update: [content: string]
}>()
</script>
