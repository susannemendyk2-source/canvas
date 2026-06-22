<template>
  <div />
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.id as string

onMounted(() => {
  if (import.meta.client) {
    localStorage.setItem('polaris.activeProject', projectId)
    navigateTo('/studio')
  }
})
</script>
