<template>
  <select
    class="h-9 w-full rounded-md border border-cyan-100/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const options = [
  { value: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash' },
  { value: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro' },
  { value: 'deepseek-r1', label: 'DeepSeek R1' },
  { value: 'runninghub-v2', label: 'RunningHub V2' },
  { value: 'volc-engine', label: '火山引擎 DeepSeek' },
  { value: 'jimeng-4.0', label: '即梦 4.0' },
  { value: 'jimeng-5.0', label: '即梦 5.0' },
  { value: 'jimeng-agent', label: '即梦 Agent' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'claude-3', label: 'Claude 3 Sonnet' }
]
</script>
