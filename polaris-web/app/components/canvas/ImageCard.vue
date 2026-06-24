<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-xs text-white/70">
      <span class="inline-flex items-center gap-2">
        <WandSparkles class="size-4" />
        {{ t('图像', 'Image') }}
      </span>
      <div class="flex gap-1">
        <button v-if="safeUrl" class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72" @click.stop="handleDownload">
          <Download class="mr-1 inline size-3.5" />
          {{ t('下载', 'Download') }}
        </button>
        <button class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72" @click.stop="triggerUpload">
          <Upload class="mr-1 inline size-3.5" />
          {{ t('上传', 'Upload') }}
        </button>
      </div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile" />
    </div>
    <div class="relative">
      <ClientOnly>
        <div v-if="safeUrl" class="overflow-hidden rounded-xl border border-white/20">
          <img :src="safeUrl" class="w-full object-cover" alt="Generated image" @click.stop />
        </div>
        <div v-else-if="errorMsg" class="grid aspect-[16/9] place-items-center rounded-xl border border-red-500/30 bg-red-500/8">
          <p class="max-w-[80%] text-center text-xs text-red-400">{{ errorMsg }}</p>
        </div>
        <div v-else class="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]">
          <ImageIcon v-if="!generating" class="size-12 text-white/28" />
          <span v-else class="inline-block size-8 animate-spin rounded-full border-2 border-white/40 border-t-studio-cyan" />
        </div>
        <template #fallback>
          <div class="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]">
            <ImageIcon class="size-12 text-white/28" />
          </div>
        </template>
      </ClientOnly>
    </div>
    <div class="rounded-xl border border-white/10 bg-[#0d0f15] p-3">
      <textarea
        v-model="promptText"
        class="min-h-20 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/62 outline-none focus:border-cyan-300/30"
        :placeholder="t('输入 Prompt、参考素材或编辑说明...', 'Prompt, references, edit notes...')"
        @mousedown.stop
        @click.stop
      />
      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <select v-model="selectedModel" class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option value="dall-e-3">DALL-E 3</option>
          <option value="dall-e-2">DALL-E 2</option>
          <option value="jimeng-4.0">Seedream 4.0</option>
          <option value="jimeng-5.0">Seedream 5.0</option>
          <option value="jimeng-agent">Seedream Agent</option>
        </select>
        <select v-model="selectedSize" class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option v-for="s in availableSizes" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
        <button
          class="ml-auto grid size-9 place-items-center rounded-full text-black transition"
          :class="generating ? 'bg-white/30' : 'bg-violet-300 hover:bg-violet-200'"
          :disabled="generating || !promptText"
          @click.stop="handleGenerate"
        >
          <span v-if="generating" class="inline-block size-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
          <ArrowRight v-else class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowRight, Download, ImageIcon, Upload, WandSparkles } from 'lucide-vue-next'
import { aiService, applyApiConfig, readApiConfig } from '~/services/aiService'
import { useSettingsStore } from '~/stores/settingsStore'

const props = defineProps<{
  content?: string
  meta?: string
}>()

const emit = defineEmits<{
  update: [data: string | { meta?: string; content?: string }]
}>()

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const promptText = ref(props.content || '')
watch(() => props.content, (v) => { if (v !== undefined) promptText.value = v })
const savedImageConfig = readApiConfig('image')
const selectedModel = ref('jimeng-4.0')
const selectedSize = ref('1024x1024')

const sizeOptions: Record<string, { value: string; label: string }[]> = {
  'dall-e-3': [
    { value: '1024x1024', label: '1024×1024' },
    { value: '1024x1792', label: '1024×1792' },
    { value: '1792x1024', label: '1792×1024' },
  ],
  'dall-e-2': [
    { value: '256x256', label: '256×256' },
    { value: '512x512', label: '512×512' },
    { value: '1024x1024', label: '1024×1024' },
  ],
  'jimeng-4.0': [
    { value: '1024x1024', label: '1024×1024' },
    { value: '1024x1792', label: '1024×1792' },
    { value: '1792x1024', label: '1792×1024' },
    { value: '1920x1920', label: '1920×1920' },
  ],
  'jimeng-5.0': [
    { value: '2048x2048', label: '2048×2048 (Seedream 5.0)' },
    { value: '1920x1920', label: '1920×1920' },
  ],
  'jimeng-agent': [
    { value: '2048x2048', label: '2048×2048 (Seedream 5.0)' },
    { value: '1920x1920', label: '1920×1920' },
  ],
}

const defaultSize: Record<string, string> = {
  'dall-e-3': '1024x1024',
  'dall-e-2': '1024x1024',
  'jimeng-4.0': '1024x1024',
  'jimeng-5.0': '2048x2048',
  'jimeng-agent': '2048x2048',
}

const availableSizes = computed(() => sizeOptions[selectedModel.value] || sizeOptions['dall-e-3'])

watch(selectedModel, (model) => {
  const valid = sizeOptions[model]?.find(s => s.value === selectedSize.value)
  if (!valid) selectedSize.value = defaultSize[model] || '1024x1024'
})
const generating = ref(false)
const generatedUrl = ref('')
const errorMsg = ref('')
if (props.meta) {
  try { const p = JSON.parse(props.meta); if (p.generatedUrl) generatedUrl.value = p.generatedUrl } catch {}
}
watch(() => props.meta, (v) => {
  if (v) try { const p = JSON.parse(v); if (p.generatedUrl) generatedUrl.value = p.generatedUrl } catch {}
})
const fileInput = ref<HTMLInputElement>()
const safeUrl = computed(() => {
  const u = generatedUrl.value
  if (u && (u.startsWith('http') || u.startsWith('data:'))) return u
  return ''
})

function triggerUpload() {
  fileInput.value?.click()
}

function handleFile(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    generatedUrl.value = reader.result as string
    errorMsg.value = ''
  }
  reader.readAsDataURL(file)
  target.value = ''
}

async function handleGenerate() {
  if (!promptText.value) return
  generating.value = true
  generatedUrl.value = ''
  errorMsg.value = ''
  try {
    const res: any = await aiService.imageGenerate(applyApiConfig('image', {
      model: selectedModel.value,
      prompt: promptText.value,
      size: selectedSize.value
    }))
    if (res?.url) {
      let url = res.url
      if (typeof url === 'string' && url.startsWith('//')) url = 'https:' + url
      generatedUrl.value = url
      emit('update', { meta: JSON.stringify({ generatedUrl: url }) })
    } else if (res?.error) {
      errorMsg.value = res.error || t('生成失败', 'Generation failed')
    } else {
      errorMsg.value = t('未返回图像 URL', 'No image URL returned')
    }
  } catch (err: any) {
    errorMsg.value = err?.message || t('生成出错', 'Generation error')
  }
  generating.value = false
}

async function handleDownload() {
  const url = generatedUrl.value
  if (!url) return
  try {
    const resp = await fetch(url)
    const blob = await resp.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `image-${Date.now()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    const a = document.createElement('a')
    a.href = url
    a.download = `image-${Date.now()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

</script>
