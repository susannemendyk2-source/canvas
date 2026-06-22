<template>
  <div class="mx-auto max-w-7xl p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">素材库 / Asset Library</h1>
        <p class="mt-1 text-sm text-white/45">管理你的创作素材 / Manage your creative assets</p>
      </div>
      <button @click="showUpload = true" class="flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white">
        <Upload class="size-4" />
        上传 / Upload
      </button>
    </div>

    <div v-if="assets.length === 0" class="flex flex-col items-center justify-center py-20 text-white/35">
      <Image class="mb-3 size-12" />
      <p class="text-sm">暂无素材 / No assets yet</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <div v-for="asset in assets" :key="asset.id" class="group relative rounded-md border border-white/10 bg-white/6 p-2">
        <div class="relative mb-2 aspect-video overflow-hidden rounded-md bg-white/5">
          <img v-if="asset.url" :src="asset.url" :alt="asset.title" class="h-full w-full object-cover" />
          <div v-else class="flex h-full items-center justify-center text-white/20">
            <Image class="size-8" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="truncate text-xs text-white/70">{{ asset.title }}</span>
          <button @click.prevent="toggleFavorite(asset)" class="shrink-0 text-white/30 transition hover:text-amber-400">
            <Heart v-if="!asset.favorite" class="size-4" />
            <Heart v-else class="size-4 fill-amber-400 text-amber-400" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="showUpload" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl border border-white/10 bg-[#111722] p-6 shadow-glass">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">上传素材 / Upload Asset</h2>
          <button @click="showUpload = false" class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white">
            <X class="size-4" />
          </button>
        </div>
        <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 p-10">
          <Upload class="mb-3 size-8 text-white/30" />
          <p class="text-sm text-white/45">拖拽文件到此处或点击上传</p>
          <p class="text-xs text-white/30">支持图片、视频、音频 / Images, video, audio</p>
        </div>
        <div class="mt-4 flex justify-end gap-3">
          <button @click="showUpload = false" class="h-10 rounded-lg border border-white/10 bg-white/6 px-4 text-sm text-white/72">取消 / Cancel</button>
          <button class="h-10 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018]">确认上传 / Upload</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, Image, X, Heart } from 'lucide-vue-next'

const showUpload = ref(false)

interface AssetItem {
  id: string
  title: string
  url?: string
  type: string
  favorite?: boolean
  createdAt: string
}

const assets = ref<AssetItem[]>([])

function toggleFavorite(asset: AssetItem) {
  asset.favorite = !asset.favorite
}

onMounted(async () => {
  try {
    const { assetService } = await import('~/services/assetService')
    const res: any = await assetService.list({})
    assets.value = res.data || res || []
  } catch {
    assets.value = []
  }
})
</script>
