<template>
  <select
    class="h-9 w-full rounded-md border border-cyan-100/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50"
    v-bind="$attrs"
  >
    <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  options?: { value: string; label: string; disabled?: boolean }[]
}>(), {
  options: () => [
    { value: 'deepseek-v3', label: 'DeepSeek V3' },
    { value: 'deepseek-r1', label: 'DeepSeek R1' },
    { value: 'runninghub-v2', label: 'RunningHub V2' },
    { value: 'volc-engine', label: '火山引擎 DeepSeek' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'claude-3', label: 'Claude 3 Sonnet' }
  ]
})
</script>
