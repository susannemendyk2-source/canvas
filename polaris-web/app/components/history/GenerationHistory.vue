<template>
  <Teleport to="body">
    <div v-if="settingsStore.showHistory" class="fixed inset-0 z-[90] flex justify-start">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="settingsStore.toggleHistory()" />
      <div class="relative w-[380px] bg-[#050811]/95 p-4 shadow-lg backdrop-blur-xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-white">Generation History</h2>
          <button class="rounded-lg p-1.5 text-white/38 transition hover:bg-white/8 hover:text-white/72" @click="settingsStore.toggleHistory()">
            <X class="size-4" />
          </button>
        </div>

        <div v-if="assetStore.history.length === 0" class="py-8 text-center text-sm text-white/38">
          No history yet
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="item in assetStore.history"
            :key="item.id"
            class="rounded-lg border border-white/10 bg-white/6 p-3"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm text-white/72">{{ item.title }}</span>
              <StatusBadge :status="item.status" />
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                class="h-full rounded-full bg-studio-cyan transition-all"
                :style="{ width: item.progress + '%' }"
              />
            </div>
            <p class="mt-1 text-[11px] text-white/38">{{ item.createdAt }}</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import { useSettingsStore } from '~/stores/settingsStore'
import { useAssetStore } from '~/stores/assetStore'

const settingsStore = useSettingsStore()
const assetStore = useAssetStore()
</script>
