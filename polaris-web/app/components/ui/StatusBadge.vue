<template>
  <span class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-normal" :class="badgeClass">
    <span class="size-1.5 rounded-full" :class="dotClass" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatusType } from '~/types'

const props = withDefaults(defineProps<{
  status?: StatusType
}>(), {
  status: 'idle'
})

const colorMap: Record<StatusType, { dot: string; border: string; text: string }> = {
  idle:    { dot: 'bg-white/25', border: 'border-white/10', text: 'text-white/55' },
  queued:  { dot: 'bg-studio-warning', border: 'border-studio-warning/30', text: 'text-studio-warning' },
  running: { dot: 'bg-studio-cyan', border: 'border-studio-cyan/30', text: 'text-studio-cyan' },
  success: { dot: 'bg-studio-success', border: 'border-studio-success/30', text: 'text-studio-success' },
  failed:  { dot: 'bg-studio-danger', border: 'border-studio-danger/30', text: 'text-studio-danger' }
}

const labelMap: Record<StatusType, string> = {
  idle: '待运行 / idle',
  queued: '排队 / queued',
  running: '运行中 / running',
  success: '成功 / success',
  failed: '失败 / failed'
}

const badgeClass = computed(() => {
  const c = colorMap[props.status]
  return [c.border, c.text].join(' ')
})

const dotClass = computed(() => colorMap[props.status].dot)

const label = computed(() => labelMap[props.status])
</script>
