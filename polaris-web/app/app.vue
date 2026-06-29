<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
import { useSettingsStore } from '~/stores/settingsStore'

onMounted(() => {
  if (import.meta.client) {
    useAuthStore().init()
    const settings = useSettingsStore()
    settings.init()
    document.documentElement.classList.toggle('light', settings.theme === 'light')
  }
})
</script>
