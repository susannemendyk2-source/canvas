<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="skill in skills"
      :key="skill.en"
      class="rounded-full border border-cyan-100/10 bg-white/6 px-3 py-1.5 text-xs text-white/68 transition hover:border-cyan-300/30 hover:text-cyan-50"
      @click="$emit('select', skill.en)"
    >
      {{ t(skill.zh, skill.en) }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  select: [skill: string]
}>()

import { useSettingsStore } from '~/stores/settingsStore'

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const skills = [
  { zh: '文生视频', en: 'Text to Video' },
  { zh: '图像生成', en: 'Image Generation' },
  { zh: '视频编辑', en: 'Video Editing' },
  { zh: '分镜', en: 'Storyboard' },
  { zh: '角色设计', en: 'Character Design' },
  { zh: '背景移除', en: 'Background Remover' },
  { zh: '色彩分级', en: 'Color Grading' },
  { zh: '音频同步', en: 'Audio Sync' }
]
</script>
