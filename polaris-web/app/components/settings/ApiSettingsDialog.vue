<template>
  <Teleport to="body">
    <div v-if="settingsStore.showSettings" class="fixed inset-0 z-[100] flex justify-end">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="settingsStore.toggleSettings()" />
      <div class="relative max-w-[560px] flex-1 overflow-y-auto bg-[#1b1c1f] p-6 shadow-lg">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Settings class="size-4 text-white/72" />
            <h2 class="text-base font-semibold text-white">{{ t('API 设置', 'API Settings') }}</h2>
          </div>
          <button class="rounded-lg p-1.5 text-white/38 transition hover:bg-white/8 hover:text-white/72" @click="settingsStore.toggleSettings()">
            <X class="size-4" />
          </button>
        </div>

        <div class="mb-6 flex gap-1 rounded-lg bg-black/20 p-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"
            :class="activeTab === tab.key ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/55 hover:text-white/80'"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="activeTab === 'chat'" class="space-y-4">
          <FieldInput v-model="chatForm.baseUrl" :label="t('Base URL 地址', 'Base URL')" placeholder="https://api.deepseek.com" />
          <FieldInput v-model="chatForm.model" :label="t('默认模型 Model', 'Default Model')" placeholder="deepseek-chat" />
          <FieldInput v-model="chatForm.apiKey" label="API Key" :type="showChatKey ? 'text' : 'password'" placeholder="sk-...">
            <button class="text-white/38 hover:text-white/72" @click="showChatKey = !showChatKey">
              <component :is="showChatKey ? EyeOff : Eye" class="size-3.5" />
            </button>
          </FieldInput>
        </div>

        <div v-if="activeTab === 'image'" class="space-y-4">
          <div class="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2">
            <p class="text-[11px] text-cyan-200/70">{{ t('用于图像卡片和图像 Workflow 节点。', 'Used by Image cards and image workflow nodes.') }}</p>
          </div>
          <div>
            <label class="mb-1 block text-xs text-white/55">{{ t('供应商 Provider', 'Provider') }}</label>
            <select v-model="imageForm.provider" class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50">
              <option value="openai">OpenAI compatible</option>
              <option value="ark">Volcengine ARK</option>
              <option value="custom">{{ t('自定义兼容接口', 'Custom compatible') }}</option>
            </select>
          </div>
          <FieldInput v-model="imageForm.baseUrl" :label="t('Base URL 地址', 'Base URL')" :placeholder="imageUrlPlaceholder" />
          <FieldInput v-model="imageForm.model" :label="t('默认模型 Model', 'Default Model')" placeholder="dall-e-3 / jimeng-5.0" />
          <FieldInput v-model="imageForm.apiKey" label="Access Key / API Key" :type="showImageKey ? 'text' : 'password'" placeholder="sk-... / AKTP...">
            <button class="text-white/38 hover:text-white/72" @click="showImageKey = !showImageKey">
              <component :is="showImageKey ? EyeOff : Eye" class="size-3.5" />
            </button>
          </FieldInput>

        </div>

        <div v-if="activeTab === 'video'" class="space-y-4">
          <div class="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2">
            <p class="text-[11px] text-cyan-200/70">{{ t('用于视频卡片、任务轮询和视频 Workflow 节点。', 'Used by Video cards, task polling, and video workflow nodes.') }}</p>
          </div>
          <div>
            <label class="mb-1 block text-xs text-white/55">{{ t('供应商 Provider', 'Provider') }}</label>
            <select v-model="videoForm.provider" class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50">
              <option value="openai">OpenAI compatible</option>
              <option value="custom">{{ t('自定义兼容接口', 'Custom compatible') }}</option>
            </select>
          </div>
          <FieldInput v-model="videoForm.baseUrl" :label="t('Base URL 地址', 'Base URL')" placeholder="https://api.example.com" />
          <FieldInput v-model="videoForm.model" :label="t('默认模型 Model', 'Default Model')" placeholder="seedance-2.0" />
          <FieldInput v-model="videoForm.apiKey" label="API Key" :type="showVideoKey ? 'text' : 'password'" placeholder="sk-...">
            <button class="text-white/38 hover:text-white/72" @click="showVideoKey = !showVideoKey">
              <component :is="showVideoKey ? EyeOff : Eye" class="size-3.5" />
            </button>
          </FieldInput>
        </div>

        <div class="mt-6 flex gap-3 border-t border-white/10 pt-4">
          <FloatingButton v-if="activeTab === 'chat'" @click="handleSaveChat">
            <Save class="size-3.5" />
            {{ t('保存 Chat', 'Save Chat') }}
          </FloatingButton>
          <FloatingButton v-if="activeTab === 'image'" @click="handleSaveImage">
            <Save class="size-3.5" />
            {{ t('保存图像 API', 'Save Image API') }}
          </FloatingButton>
          <FloatingButton v-if="activeTab === 'video'" @click="handleSaveVideo">
            <Save class="size-3.5" />
            {{ t('保存视频 API', 'Save Video API') }}
          </FloatingButton>
          <FloatingButton v-if="activeTab === 'image' || activeTab === 'video'" @click="handleTest">
            <RefreshCw class="size-3.5" />
            {{ t('测试', 'Test') }}
          </FloatingButton>
        </div>

        <p v-if="statusMsg" class="mt-3 text-xs" :class="statusError ? 'text-studio-danger' : 'text-studio-success'">
          {{ statusMsg }}
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue'
import { Eye, EyeOff, RefreshCw, Save, Settings, X } from 'lucide-vue-next'
import FloatingButton from '~/components/ui/FloatingButton.vue'
import { useSettingsStore } from '~/stores/settingsStore'
import { aiService, loadProviderConfigsFromBackend, providerKeyFor, readApiConfig, saveApiConfig } from '~/services/aiService'

const FieldInput = defineComponent({
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    return () => h('div', [
      h('label', { class: 'mb-1 block text-xs text-white/55' }, props.label),
      h('div', { class: slots.default ? 'relative' : '' }, [
        h('input', {
          value: props.modelValue,
          type: props.type,
          placeholder: props.placeholder,
          class: `h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50 ${slots.default ? 'pr-9' : ''}`,
          onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value)
        }),
        slots.default ? h('div', { class: 'absolute right-2 top-1/2 -translate-y-1/2' }, slots.default()) : null
      ])
    ])
  }
})

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const tabs = computed(() => [
  { key: 'chat', label: t('Chat / 润色', 'Chat / Enhance') },
  { key: 'image', label: t('图像 API', 'Image API') },
  { key: 'video', label: t('视频 API', 'Video API') }
])

const activeTab = ref('chat')
const showChatKey = ref(false)
const showImageKey = ref(false)
const showImageSecret = ref(false)
const showVideoKey = ref(false)
const statusMsg = ref('')
const statusError = ref(false)

const chatForm = reactive({ baseUrl: '', apiKey: '', model: '' })
const imageForm = reactive({ provider: 'openai', baseUrl: '', apiKey: '', secretKey: '', model: '' })
const videoForm = reactive({ provider: 'openai', baseUrl: '', apiKey: '', model: '' })

const imageUrlPlaceholder = computed(() => {
  if (imageForm.provider === 'ark') return 'https://ark.cn-beijing.volces.com/api/v3'
  if (imageForm.provider === 'openai') return 'https://api.openai.com'
  return 'https://your-api.example.com'
})

function loadLocalSettings() {
  Object.assign(chatForm, { baseUrl: '', apiKey: '', model: '', ...readApiConfig('chat') })
  Object.assign(imageForm, { provider: 'openai', baseUrl: '', apiKey: '', secretKey: '', model: '', ...readApiConfig('image') })
  Object.assign(videoForm, { provider: 'openai', baseUrl: '', apiKey: '', model: '', ...readApiConfig('video') })
}

async function loadBackendSettings() {
  try {
    const list = await loadProviderConfigsFromBackend()
    for (const item of list) {
      if (item.provider === 'chat') {
        Object.assign(chatForm, {
          baseUrl: item.baseUrl || chatForm.baseUrl,
          apiKey: item.apiKey || chatForm.apiKey,
          model: item.model || chatForm.model
        })
      } else if (item.provider === 'image-openai' || item.provider === 'image-custom' || item.provider === 'image-volcengine-jimeng') {
        Object.assign(imageForm, {
          provider: item.provider.replace(/^image-/, '') || 'openai',
          baseUrl: item.baseUrl || imageForm.baseUrl,
          apiKey: item.apiKey || imageForm.apiKey,
          secretKey: item.secretKey || imageForm.secretKey,
          model: item.model || imageForm.model
        })
      } else if (item.provider === 'jimeng' || item.provider === 'jimeng-4') {
        Object.assign(imageForm, {
          provider: 'ark',
          baseUrl: item.baseUrl || imageForm.baseUrl,
          apiKey: item.apiKey || imageForm.apiKey,
          secretKey: item.secretKey || imageForm.secretKey,
          model: item.model || imageForm.model
        })
      } else if (item.provider === 'video-default' || item.provider?.startsWith('video-')) {
        Object.assign(videoForm, {
          provider: item.provider === 'video-default' ? 'openai' : item.provider.replace(/^video-/, '') || 'openai',
          baseUrl: item.baseUrl || videoForm.baseUrl,
          apiKey: item.apiKey || videoForm.apiKey,
          model: item.model || videoForm.model
        })
      }
    }
  } catch {}
}

onMounted(() => {
  loadLocalSettings()
  loadBackendSettings()
})

watch(activeTab, () => {
  statusMsg.value = ''
  loadLocalSettings()
  loadBackendSettings()
})

function handleSaveChat() {
  saveApiConfig('chat', { provider: 'chat', baseUrl: chatForm.baseUrl, apiKey: chatForm.apiKey, model: chatForm.model })
  aiService.saveProviders({ provider: 'chat', baseUrl: chatForm.baseUrl, apiKey: chatForm.apiKey, model: chatForm.model })
    .then(() => { statusMsg.value = t('已保存，Key 已在服务端加密存储。', 'Saved. Key is encrypted on server.'); statusError.value = false })
    .catch(() => { statusMsg.value = t('已保存到本地，但服务端保存失败。', 'Saved locally, but server save failed.'); statusError.value = true })
}

function handleSaveImage() {
  saveApiConfig('image', { provider: imageForm.provider, baseUrl: imageForm.baseUrl, apiKey: imageForm.apiKey, secretKey: imageForm.secretKey, model: imageForm.model })
  const dbProvider = imageForm.provider === 'ark' ? 'jimeng' : providerKeyFor('image', imageForm.provider)
  aiService.saveProviders({
    provider: dbProvider,
    baseUrl: imageForm.baseUrl,
    apiKey: imageForm.apiKey,
    secretKey: imageForm.secretKey,
    model: imageForm.model
  }).then(() => { statusMsg.value = t('已保存，Key 已在服务端加密存储。', 'Saved. Key is encrypted on server.'); statusError.value = false })
    .catch(() => { statusMsg.value = t('已保存到本地，但服务端保存失败。', 'Saved locally, but server save failed.'); statusError.value = true })
}

function handleSaveVideo() {
  saveApiConfig('video', { provider: videoForm.provider, baseUrl: videoForm.baseUrl, apiKey: videoForm.apiKey, model: videoForm.model })
  aiService.saveProviders({
    provider: providerKeyFor('video', videoForm.provider),
    baseUrl: videoForm.baseUrl,
    apiKey: videoForm.apiKey,
    model: videoForm.model
  }).then(() => { statusMsg.value = t('已保存，Key 已在服务端加密存储。', 'Saved. Key is encrypted on server.'); statusError.value = false })
    .catch(() => { statusMsg.value = t('已保存到本地，但服务端保存失败。', 'Saved locally, but server save failed.'); statusError.value = true })
}

async function handleTest() {
  const isImage = activeTab.value === 'image'
  const form = isImage ? imageForm : videoForm
  if (!form.apiKey && !(isImage && imageForm.secretKey)) {
    statusMsg.value = t('请输入 API Key', 'Please enter API Key')
    statusError.value = true
    return
  }
  try {
    const res: any = isImage
      ? await aiService.imageGenerate({
          baseUrl: imageForm.baseUrl || undefined,
          apiKey: imageForm.apiKey,
          secretKey: undefined,
          provider: imageForm.provider,
          model: imageForm.model || 'dall-e-3',
          prompt: 'test',
          size: '1024x1024'
        })
      : await aiService.videoGenerate({
          baseUrl: videoForm.baseUrl || undefined,
          apiKey: videoForm.apiKey,
          model: videoForm.model || 'seedance-2.0',
          prompt: 'test'
        })

    if (res?.error) {
      statusMsg.value = res.error
      statusError.value = true
    } else {
      statusMsg.value = res?.url || res?.taskId ? t('连接成功。', 'Connected.') : t('连接成功，但未返回媒体 URL。', 'Connected, but no media URL returned.')
      statusError.value = false
    }
  } catch (err: any) {
    statusMsg.value = err?.message || t('连接失败', 'Connection failed')
    statusError.value = true
  }
}
</script>
