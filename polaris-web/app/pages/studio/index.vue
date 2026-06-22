<template>
  <AppShell />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'studio'
})

import AppShell from '~/components/layout/AppShell.vue'

onMounted(() => {
  if (import.meta.client) {
    const pending = localStorage.getItem('polaris.pendingGoal')
    if (pending) {
      try {
        const data = JSON.parse(pending)
        console.log('Pending goal loaded:', data)
      } catch {
        localStorage.removeItem('polaris.pendingGoal')
      }
    }
  }
})
</script>
