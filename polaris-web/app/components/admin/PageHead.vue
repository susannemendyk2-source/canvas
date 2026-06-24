<template>
  <section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">Admin Console</p>
      <h1 class="mt-2 text-2xl font-semibold text-white">{{ title }}</h1>
      <p class="mt-1 text-sm text-white/45">{{ desc }}</p>
    </div>
    <NuxtLink to="/admin/dashboard" class="rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">Dashboard</NuxtLink>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; desc: string }>()
</script>
