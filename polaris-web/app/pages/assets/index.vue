<template>
  <main class="polaris-shell min-h-screen px-6 py-8 text-white">
    <section class="mx-auto max-w-7xl">
      <div class="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/65">Explore Constellations</p>
          <h1 class="mt-3 text-3xl font-semibold text-white md:text-4xl">{{ t('探索创作星座', 'Explore Constellations') }}</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            {{ t('发现可复用的创作路线、素材组合与工作流模板，并将它们导入你的星图画布。', 'Discover reusable routes, asset bundles and workflow templates, then import them into your Star Map Canvas.') }}
          </p>
        </div>
        <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white hover:shadow-[0_0_28px_rgba(143,234,255,.35)]" @click="showUpload = true">
          <Upload class="size-4" />
          {{ t('上传资源', 'Upload Asset') }}
        </button>
      </div>

      <section class="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label class="flex h-11 w-full max-w-md items-center gap-2 rounded-full border border-cyan-100/14 bg-white/6 px-4 text-sm text-white/42 backdrop-blur">
          <Search class="size-4" />
          <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" :placeholder="t('搜索星座、模板或素材', 'Search constellations, templates or assets')" />
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in filters"
            :key="tag.value"
            class="rounded-full border px-3 py-1.5 text-xs transition"
            :class="activeFilter === tag.value ? 'border-cyan-200/40 bg-cyan-100/12 text-cyan-50 shadow-[0_0_20px_rgba(143,234,255,.12)]' : 'border-white/10 bg-white/6 text-white/60 hover:border-cyan-100/22 hover:text-white'"
            @click="activeFilter = tag.value"
          >
            {{ tag.label }}
          </button>
        </div>
      </section>

      <section v-if="filteredAssets.length === 0" class="polaris-card flex flex-col items-center justify-center py-20 text-white/40">
        <Compass class="mb-4 size-12 text-cyan-100/55" />
        <p class="text-sm">{{ t('暂无创作星座', 'No constellations yet') }}</p>
      </section>

      <section v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <article v-for="asset in filteredAssets" :key="asset.id" class="polaris-card group overflow-hidden p-2 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-100/35">
          <div class="relative mb-4 aspect-[16/10] overflow-hidden rounded-lg bg-[#030814]">
            <img v-if="asset.url" :src="asset.url" :alt="asset.title" class="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
            <div v-else class="starfield flex h-full items-center justify-center">
              <Sparkles class="size-10 text-cyan-100/45" />
            </div>
            <span class="absolute left-3 top-3 rounded-full border border-cyan-100/16 bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-cyan-50/80">
              {{ typeLabel(asset.type) }}
            </span>
            <button class="absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-white/10 bg-black/45 text-white/45 transition hover:text-amber-200" @click.prevent="toggleFavorite(asset)">
              <Heart :class="['size-4', asset.favorite ? 'fill-amber-200 text-amber-200' : '']" />
            </button>
          </div>
          <div class="px-2 pb-2">
            <h3 class="truncate text-sm font-semibold text-white">{{ asset.title || asset.name || t('未命名星座', 'Untitled Constellation') }}</h3>
            <p class="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-white/45">{{ asset.description || t('可导入星图的创作资源与节点路线。', 'A creative resource and node route ready for your star map.') }}</p>
            <div class="mt-4 flex items-center justify-between text-[11px] text-white/35">
              <span>{{ asset.createdAt || t('最近更新', 'Recently updated') }}</span>
              <button class="rounded-full border border-cyan-100/18 px-3 py-1 text-cyan-50/80 transition hover:border-cyan-100/45 hover:bg-cyan-100/10">
                {{ t('导入星图', 'Import') }}
              </button>
            </div>
          </div>
        </article>
      </section>
    </section>

    <Teleport to="body">
      <div v-if="showUpload" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-xl border border-cyan-100/14 bg-[#07111f] p-5 shadow-glass">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-white">{{ t('上传资源', 'Upload Asset') }}</h2>
            <button class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white" @click="showUpload = false">
              <X class="size-4" />
            </button>
          </div>
          <label class="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-cyan-100/18 bg-black/24 p-10 text-center transition hover:border-cyan-200/40">
            <Upload class="mb-3 size-8 text-cyan-100/45" />
            <p class="text-sm text-white/62">{{ uploadName || t('选择本地文件', 'Choose a local file') }}</p>
            <p class="mt-1 text-xs text-white/35">{{ t('支持图片、视频、音频和参考文件', 'Images, videos, audio and references') }}</p>
            <input type="file" class="hidden" @change="onFileChange" />
          </label>
          <div class="mt-4 flex justify-end gap-3">
            <button class="h-10 rounded-lg border border-white/10 bg-white/6 px-4 text-sm text-white/72" @click="showUpload = false">{{ t('取消', 'Cancel') }}</button>
            <button class="h-10 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018]" @click="addLocalAsset">{{ t('加入星座库', 'Add to Library') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { Compass, Heart, Search, Sparkles, Upload, X } from 'lucide-vue-next'
import { assetService } from '~/services/assetService'
import { useSettingsStore } from '~/stores/settingsStore'

interface AssetItem {
  id: string | number
  title?: string
  name?: string
  description?: string
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
  { value: 'video', label: t('短片', 'Video') },
  { value: 'poster', label: t('海报', 'Poster') },
  { value: 'brand', label: t('品牌视觉', 'Brand') },
  { value: 'storyboard', label: t('分镜脚本', 'Storyboard') },
  { value: 'workflow', label: t('工作流模板', 'Workflow') },
])

const filteredAssets = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return assets.value.filter((asset) => {
    const text = `${asset.title || ''} ${asset.name || ''} ${asset.description || ''}`.toLowerCase()
    const type = `${asset.type || ''}`.toLowerCase()
    return (!q || text.includes(q)) && (activeFilter.value === 'all' || type.includes(activeFilter.value))
  })
})

onMounted(async () => {
  settingsStore.init()
  try {
    const res: any = await assetService.list({})
    const records = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || []
    assets.value = records.length > 0 ? records : seedConstellations()
  } catch {
    assets.value = seedConstellations()
  }
})

function seedConstellations(): AssetItem[] {
  return [
    { id: 'short-video', title: t('新品发布短片路线', 'Product Launch Short'), type: 'video workflow', description: t('从 Brief、Prompt、首帧到视频输出的完整短片星图。', 'A complete route from brief, prompt, first frame to video output.') },
    { id: 'poster-map', title: t('海报星图模板', 'Poster Star Map'), type: 'poster image', description: t('适合品牌视觉、活动海报和社媒封面的图像生成路线。', 'An image route for brand visuals, event posters and social covers.') },
    { id: 'storyboard-route', title: t('六镜头分镜脚本', 'Six-shot Storyboard'), type: 'storyboard workflow', description: t('把故事目标拆成 6 个镜头，并继续连接视频生成节点。', 'Break a story goal into 6 shots and connect to video generation.') },
    { id: 'brand-kit', title: t('品牌视觉资产包', 'Brand Visual Kit'), type: 'brand asset', description: t('统一色彩、角色、参考图和输出规格的品牌资产星座。', 'A constellation for colors, characters, references and output specs.') },
  ]
}

function typeLabel(type?: string) {
  const value = (type || '').toLowerCase()
  if (value.includes('workflow')) return 'Workflow'
  if (value.includes('storyboard')) return 'Storyboard'
  if (value.includes('poster')) return 'Poster'
  if (value.includes('video')) return 'Video'
  if (value.includes('brand')) return 'Brand'
  return 'Asset'
}

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
    type: uploadName.value.match(/\.(mp4|mov|avi)$/i) ? 'video' : 'asset',
    createdAt: new Date().toLocaleString(),
  })
  uploadName.value = ''
  showUpload.value = false
}
</script>
