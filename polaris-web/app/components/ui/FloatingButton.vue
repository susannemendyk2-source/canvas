<template>
  <button
    :type="type"
    :disabled="disabled"
    :title="title"
    class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 text-sm text-white/88 transition hover:border-cyan-300/35 hover:bg-white/12 disabled:pointer-events-none disabled:opacity-40"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  title?: string
}>(), {
  type: 'button',
  disabled: false
})
</script>

<style scoped>
button { font-family: inherit; }
</style>
