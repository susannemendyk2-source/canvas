<template>
  <main class="mx-auto max-w-7xl px-6 py-8">
    <section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">{{ t('创作资源', 'Creative Assets') }}</p>
        <h1 class="mt-2 text-2xl font-semibold text-white">{{ t('素材库', 'Asset Library') }}</h1>
        <p class="mt-1 text-sm text-white/45">{{ t('管理可投放到星图画布的图片、视频和参考素材。', 'Manage images, videos and references used on the star map canvas.') }}</p>
      </div>
      <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white" @click="showUpload = true">
        <Upload class="size-4" />
        {{ t('上传素材', 'Upload Asset') }}
      </button>
    </section>

    <section class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <label class="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">
        <Search class="size-4" />
        <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" :placeholder="t('搜索素材', 'Search assets')" />
      </label>
      <div class="flex flex-wrap gap-2">
        <button v-for="tag in filters" :key="tag.value" class="rounded-full border px-3 py-1.5 text-xs transition" :class="activeFilter === tag.value ? 'border-cyan-300/30 bg-cyan-100/10 text-white' : 'border-white/10 bg-white/6 text-white/60 hover:text-white'" @click="activeFilter = tag.value">
          {{ tag.label }}
        </button>
      </div>
    </section>

    <section v-if="filteredAssets.length === 0" class="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] py-20 text-white/35">
      <Image class="mb-3 size-12" />
      <p class="text-sm">{{ t('暂无素材', 'No assets yet') }}</p>
    </section>

    <section v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      <article v-for="asset in filteredAssets" :key="asset.id" class="group rounded-lg border border-white/10 bg-white/[0.04] p-2 transition hover:border-cyan-100/25">
        <div class="relative mb-3 aspect-video overflow-hidden rounded-md bg-black/35">
          <img v-if="asset.url" :src="asset.url" :alt="asset.title" class="h-full w-full object-cover" />
          <div v-else class="flex h-full items-center justify-center text-white/20">
            <Image class="size-8" />
          </div>
          <span class="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase text-white/70">{{ asset.type || 'asset' }}</span>
        </div>
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="truncate text-sm text-white/78">{{ asset.title || asset.name || t('未命名素材', 'Untitled Asset') }}</p>
            <p class="text-[11px] text-white/35">{{ asset.createdAt || '-' }}</p>
          </div>
          <button class="grid size-8 shrink-0 place-items-center rounded-md text-white/35 transition hover:bg-white/8 hover:text-amber-300" @click.prevent="toggleFavorite(asset)">
            <Heart :class="['size-4', asset.favorite ? 'fill-amber-300 text-amber-300' : '']" />
          </button>
        </div>
      </article>
    </section>

    <Teleport to="body">
      <div v-if="showUpload" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-lg border border-white/10 bg-[#10131a] p-5 shadow-glass">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-white">{{ t('上传素材', 'Upload Asset') }}</h2>
            <button class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white" @click="showUpload = false">
              <X class="size-4" />
            </button>
          </div>
          <label class="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/12 bg-black/24 p-10 text-center transition hover:border-cyan-200/30">
            <Upload class="mb-3 size-8 text-white/30" />
            <p class="text-sm text-white/55">{{ uploadName || t('选择本地文件', 'Choose a local file') }}</p>
            <p class="mt-1 text-xs text-white/30">{{ t('支持图片、视频、音频和参考文件', 'Images, videos, audio and references') }}</p>
            <input type="file" class="hidden" @change="onFileChange" />
          </label>
          <div class="mt-4 flex justify-end gap-3">
            <button class="h-10 rounded-lg border border-white/10 bg-white/6 px-4 text-sm text-white/72" @click="showUpload = false">{{ t('取消', 'Cancel') }}</button>
            <button class="h-10 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018]" @click="addLocalAsset">{{ t('添加到素材库', 'Add to Library') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { Heart, Image, Search, Upload, X } from 'lucide-vue-next'
import { assetService } from '~/services/assetService'
import { useSettingsStore } from '~/stores/settingsStore'

interface AssetItem {
  id: string | number
  title?: string
  name?: string
  url?: string
  type?: string
  favorite?: boolean
  createdAt?: string
}

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const showUpload = ref(false)
const uploadName = ref('')
const searchQuery = ref('')
const activeFilter = ref('all')
const assets = ref<AssetItem[]>([])

const filters = computed(() => [
  { value: 'all', label: t('全部', 'All') },
  { value: 'image', label: t('图片', 'Image') },
  { value: 'video', label: t('视频', 'Video') },
  { value: 'audio', label: t('音频', 'Audio') },
])

const filteredAssets = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return assets.value.filter((asset) => {
    const text = `${asset.title || ''} ${asset.name || ''}`.toLowerCase()
    const type = `${asset.type || ''}`.toLowerCase()
    return (!q || text.includes(q)) && (activeFilter.value === 'all' || type.includes(activeFilter.value))
  })
})

onMounted(async () => {
  settingsStore.init()
  try {
    const res: any = await assetService.list({})
    assets.value = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || []
  } catch {
    assets.value = []
  }
})

function toggleFavorite(asset: AssetItem) {
  asset.favorite = !asset.favorite
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  uploadName.value = file?.name || ''
}

function addLocalAsset() {
  if (!uploadName.value) return
  assets.value.unshift({
    id: crypto.randomUUID(),
    title: uploadName.value,
    type: uploadName.value.match(/\.(mp4|mov|avi)$/i) ? 'video' : 'image',
    createdAt: new Date().toLocaleString(),
  })
  uploadName.value = ''
  showUpload.value = false
}
</script>
