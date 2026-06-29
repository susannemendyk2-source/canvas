<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-xs text-white/70">
      <span class="inline-flex items-center gap-2">
        <Clapperboard class="size-4" />
        {{ t('视频', 'Video') }}
      </span>
      <div class="flex gap-1">
        <button v-if="generatedUrl && (generatedUrl.startsWith('http') || generatedUrl.startsWith('data:') || generatedUrl.startsWith('blob:'))" class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72" @click.stop="handleDownload">
          <Download class="mr-1 inline size-3.5" />
          {{ t('下载', 'Download') }}
        </button>
        <button class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72" @click.stop="triggerUpload">
          <Upload class="mr-1 inline size-3.5" />
          {{ t('上传', 'Upload') }}
        </button>
      </div>
      <input ref="fileInput" type="file" accept="image/*,video/*" class="hidden" @change="handleFile" />
    </div>
    <div class="relative">
      <div v-if="generatedUrl && (generatedUrl.startsWith('http') || generatedUrl.startsWith('data:') || generatedUrl.startsWith('blob:'))" class="overflow-hidden rounded-xl border border-white/20">
        <video :src="generatedUrl" controls class="w-full" @click.stop />
      </div>
      <div v-else-if="errorMsg" class="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/8 p-4 text-center" style="aspect-ratio: 16/9">
        <p class="text-xs text-red-400">{{ errorMsg }}</p>
        <p class="text-[11px] text-white/40">{{ t('请修改提示词或参考图片后重试', 'Modify your prompt or reference image and try again') }}</p>
      </div>
      <div v-else class="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]">
        <Play v-if="!generating" class="size-14 text-white/28" />
        <span v-else class="inline-block size-8 animate-spin rounded-full border-2 border-white/40 border-t-studio-cyan" />
      </div>
      <div v-if="polling" class="absolute inset-0 grid place-items-center rounded-xl bg-black/60">
        <div class="flex flex-col items-center gap-2">
          <span class="inline-block size-6 animate-spin rounded-full border-2 border-white/40 border-t-studio-cyan" />
          <span class="text-xs text-white/60">{{ t('处理中...', 'Processing...') }}</span>
          <span class="text-[11px] text-white/40">{{ elapsed }}s</span>
        </div>
      </div>
    </div>
    <div class="rounded-xl border border-white/10 bg-[#0d0f15] p-3">
      <textarea
        v-model="promptText"
        class="min-h-20 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/62 outline-none focus:border-cyan-300/30"
        :placeholder="t('描述视频内容、镜头运动、时长和参考素材...', 'Describe the video, camera motion, duration, and references...')"
        @mousedown.stop
        @click.stop
      />
      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <select v-model="selectedModel" class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option value="seedance-2.0">Seedance 2.0 Fast</option>
          <option value="aura-video">Aura Video v1</option>
          <option value="jimeng-video-3.5-pro">即梦 Video 3.5 Pro</option>
          <option value="jimeng-video-seedance-2.0">即梦 Seedance 2.0</option>
          <option value="jimeng-video-seedance-2.0-fast">即梦 Seedance 2.0 Fast</option>
        </select>
        <select v-model="selectedDuration" class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option value="5">5s</option>
          <option value="10">10s</option>
          <option value="15">15s</option>
        </select>
        <select v-model="selectedResolution" class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
        <select v-model="selectedRatio" class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none" @mousedown.stop @click.stop>
          <option value="16:9">16:9</option>
          <option value="9:16">9:16</option>
          <option value="1:1">1:1</option>
          <option value="4:3">4:3</option>
          <option value="3:4">3:4</option>
          <option value="21:9">21:9</option>
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
import { onBeforeUnmount, ref, watch } from 'vue'
import { ArrowRight, Clapperboard, Download, Play, Upload } from 'lucide-vue-next'
import { aiService, applyApiConfig, readApiConfig } from '~/services/aiService'
import { useSettingsStore } from '~/stores/settingsStore'
import { useCanvasStore } from '~/stores/canvasStore'

const props = defineProps<{
  content?: string
  meta?: string
  objectId?: string
}>()

const emit = defineEmits<{
  update: [data: string | Record<string, unknown>]
}>()

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const promptText = ref(props.content || '')
watch(() => props.content, (v) => { if (v !== undefined) promptText.value = v })
const savedVideoConfig = readApiConfig('video')
const selectedModel = ref(savedVideoConfig.model || 'seedance-2.0')
const selectedDuration = ref(5)
const selectedResolution = ref('720p')
const selectedRatio = ref('16:9')
const generating = ref(false)
const generatedUrl = ref('')
const errorMsg = ref('')
const polling = ref(false)
const pollingActive = ref(false)
if (props.meta) {
  try { const p = JSON.parse(props.meta); if (p.generatedUrl) generatedUrl.value = p.generatedUrl } catch {}
}
watch(() => props.meta, (v) => {
  if (v) try { const p = JSON.parse(v); if (p.generatedUrl) generatedUrl.value = p.generatedUrl } catch {}
})
const fileInput = ref<HTMLInputElement>()

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
  const canvasStore = useCanvasStore()
  let imageUrl = ''
  if (props.objectId) {
    const incomingLinks = canvasStore.links.filter(l => l.targetId === props.objectId)
    for (const link of incomingLinks) {
      const src = canvasStore.objects.find(o => o.id === link.sourceId)
      if (src?.meta) {
        try {
          const parsed = JSON.parse(src.meta)
          if (parsed.generatedUrl) imageUrl = parsed.generatedUrl
        } catch {}
      }
    }
  }
  try {
    const res: any = await aiService.videoGenerate(applyApiConfig('video', {
      model: selectedModel.value,
      prompt: promptText.value,
      imageUrl: imageUrl || undefined,
      duration: Number(selectedDuration.value),
      resolution: selectedResolution.value,
      ratio: selectedRatio.value
    }))
    if (res?.url) {
      generatedUrl.value = res.url
      saveMeta({ generatedUrl: res.url, taskStatus: 'success' })
    } else if (res?.taskId) {
      saveMeta({ taskId: res.taskId, taskStatus: 'running', prompt: promptText.value, startedAt: Date.now() })
      pollTask(res.taskId)
    } else if (res?.error) {
      errorMsg.value = res.error
      saveMeta({ taskStatus: 'failed', error: res.error })
    } else {
      errorMsg.value = t('服务器没有返回结果', 'No response from server')
    }
  } catch (err: any) {
    errorMsg.value = err?.message || t('生成出错', 'Generation error')
  }
  if (!polling.value) generating.value = false
}

function saveMeta(extra: Record<string, unknown>) {
  if (!props.objectId) return
  const current: Record<string, unknown> = {}
  if (props.meta) { try { Object.assign(current, JSON.parse(props.meta)) } catch {} }
  Object.assign(current, extra)
  emit('update', { meta: JSON.stringify(current) })
}

const elapsed = ref(0)
let elapsedTimer: ReturnType<typeof setInterval> | null = null

async function pollTask(taskId: string) {
  polling.value = true
  pollingActive.value = true
  generating.value = false
  elapsed.value = 0
  elapsedTimer = setInterval(() => { elapsed.value++ }, 1000)
  while (pollingActive.value) {
    await new Promise(r => setTimeout(r, 2000))
    try {
      const res: any = await aiService.getTasks(applyApiConfig('video', { taskId }))
      if (res?.url) {
        generatedUrl.value = res.url
        saveMeta({ generatedUrl: res.url, taskStatus: 'success', taskId: undefined })
        flushSave()
        break
      }
      if (res?.error) {
        errorMsg.value = res.error
        saveMeta({ taskStatus: 'failed', error: res.error })
        flushSave()
        break
      }
      if (res?.status && res.status !== 'pending' && res.status !== 'running') {
        errorMsg.value = t(`任务 ${res.status || '失败'}`, `Task ${res.status || 'failed'}`)
        saveMeta({ taskStatus: 'failed', error: res.status })
        flushSave()
        break
      }
      saveMeta({ taskStatus: 'running', polledAt: Date.now() })
    } catch (err: any) {
      errorMsg.value = err?.message || t('任务状态查询失败', 'Task status check failed')
      break
    }
  }
  polling.value = false
  pollingActive.value = false
  if (elapsedTimer) { clearInterval(elapsedTimer); elapsedTimer = null }
}

function flushSave() {
  if (!props.objectId) return
  const canvasStore = useCanvasStore()
  canvasStore.flushSave(props.objectId)
}

onBeforeUnmount(() => { pollingActive.value = false; if (elapsedTimer) clearInterval(elapsedTimer) })

async function handleDownload() {
  const url = generatedUrl.value
  if (!url) return
  try {
    const resp = await fetch(url)
    const blob = await resp.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `video-${Date.now()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    const a = document.createElement('a')
    a.href = url
    a.download = `video-${Date.now()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
</script>
