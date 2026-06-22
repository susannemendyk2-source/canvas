<template>
  <slot />
</template>

<script setup lang="ts">
const user = useState('user', () => null)

onMounted(() => {
  if (import.meta.client) {
    const token = localStorage.getItem('polaris.token')
    if (!token) {
      navigateTo('/login')
    }
  }
})
</script>
