<template>
  <div class="min-h-screen bg-[#050608] text-white">
    <header v-if="!isHome" class="flex h-12 items-center border-b border-white/8 bg-[#04070d]/90 px-4">
      <NuxtLink to="/" class="flex items-center gap-2">
        <Compass class="size-4 text-studio-cyan" />
        <span class="text-sm font-semibold">Polaris</span>
      </NuxtLink>
      <span class="ml-3 text-xs text-white/30">|</span>
      <button class="ml-3 flex items-center gap-1 text-xs text-white/45 transition hover:text-white" @click="goBack">
        <ArrowLeft class="size-3" />
        Back
      </button>
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Compass } from 'lucide-vue-next'

const route = useRoute()
const isHome = computed(() => route.path === '/')

function goBack() {
  navigateTo('/studio')
}
</script>
