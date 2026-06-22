<template>
  <Teleport to="body">
    <div v-if="settingsStore.showAssets" class="fixed inset-0 z-[90] flex justify-start">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="settingsStore.toggleAssets()" />
      <div class="relative w-[420px] bg-[#050811]/95 p-4 shadow-lg backdrop-blur-xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-white">Asset Library</h2>
          <button class="rounded-lg p-1.5 text-white/38 transition hover:bg-white/8 hover:text-white/72" @click="settingsStore.toggleAssets()">
            <X class="size-4" />
          </button>
        </div>

        <div v-if="assetStore.assets.length === 0" class="py-8 text-center text-sm text-white/38">
          No assets yet
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <div
            v-for="asset in assetStore.assets"
            :key="asset.id"
            class="rounded-md border border-white/10 bg-white/6 p-2 transition hover:border-cyan-300/30"
          >
            <div class="mb-2 aspect-video rounded bg-gradient-to-br from-studio-cyan/15 to-studio-violet/15" />
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/72">{{ asset.title }}</span>
              <button class="text-white/38 hover:text-studio-warning" @click="assetStore.toggleFavorite(asset.id)">
                <Star class="size-3.5" :class="{ 'fill-studio-warning text-studio-warning': asset.favorite }" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Star } from 'lucide-vue-next'
import { useSettingsStore } from '~/stores/settingsStore'
import { useAssetStore } from '~/stores/assetStore'

const settingsStore = useSettingsStore()
const assetStore = useAssetStore()
</script>
