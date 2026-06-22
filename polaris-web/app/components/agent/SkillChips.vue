<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="skill in skills"
      :key="skill"
      class="rounded-full border border-cyan-100/10 bg-white/6 px-3 py-1.5 text-xs text-white/68 transition hover:border-cyan-300/30 hover:text-cyan-50"
      @click="$emit('select', skill)"
    >
      {{ skill }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  select: [skill: string]
}>()

const skills = [
  'Text to Video', 'Image Generation', 'Video Editing',
  'Storyboard', 'Character Design', 'Background Remover',
  'Color Grading', 'Audio Sync'
]
</script>
