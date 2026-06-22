<template>
  <div class="flex flex-col items-center justify-center gap-4 py-16">
    <div class="flex size-12 items-center justify-center rounded-lg border border-white/10 bg-white/8">
      <slot name="icon" />
    </div>
    <h2 class="text-lg font-medium text-white">{{ title }}</h2>
    <p class="text-sm text-white/55">{{ body }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  body?: string
}>()
</script>
