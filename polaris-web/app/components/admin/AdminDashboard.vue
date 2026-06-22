<template>
  <div class="mx-auto max-w-6xl p-6">
    <h1 class="mb-6 text-xl font-semibold text-white">Admin Dashboard</h1>
    <div class="grid grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded-lg border border-white/10 bg-white/6 p-4">
        <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
        <p class="text-xs text-white/55">{{ stat.label }}</p>
      </div>
    </div>
    <div class="mt-6 rounded-lg border border-white/10 bg-white/6 p-6">
      <p class="text-sm text-white/45">Admin functionality coming soon.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { label: 'Users', value: '1,284' },
  { label: 'Projects', value: '3,591' },
  { label: 'Generations', value: '12.7K' },
  { label: 'API Calls', value: '89.2K' }
]
</script>
