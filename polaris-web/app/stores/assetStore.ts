import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HistoryItem, AssetItem } from '~/types'

export const useAssetStore = defineStore('asset', () => {
  const history = ref<HistoryItem[]>([])
  const assets = ref<AssetItem[]>([])

  const historyCount = computed(() => history.value.length)
  const assetCount = computed(() => assets.value.length)

  function addHistory(item: HistoryItem) {
    history.value.unshift(item)
  }

  function removeHistory(id: string) {
    history.value = history.value.filter(h => h.id !== id)
  }

  function updateHistoryStatus(id: string, status: HistoryItem['status'], progress?: number) {
    const item = history.value.find(h => h.id === id)
    if (item) {
      item.status = status
      if (progress !== undefined) item.progress = progress
    }
  }

  function addAsset(item: AssetItem) {
    assets.value.unshift(item)
  }

  function toggleFavorite(id: string) {
    const item = assets.value.find(a => a.id === id)
    if (item) item.favorite = !item.favorite
  }

  return { history, assets, historyCount, assetCount, addHistory, removeHistory, updateHistoryStatus, addAsset, toggleFavorite }
})
