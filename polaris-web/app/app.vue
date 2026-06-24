<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'

onMounted(() => {
  if (import.meta.client) {
    useAuthStore().init()
  }
})
</script>
