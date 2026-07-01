<template>
  <div class="goal-composer mx-auto mt-8 max-w-3xl rounded-2xl border border-cyan-100/15 bg-[#07111f]/80 shadow-[0_30px_120px_rgba(78,201,255,.16)] backdrop-blur-xl">
    <div class="relative p-3">
      <textarea
        v-model="goal"
        class="h-24 w-full resize-none rounded-xl bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/35"
        :placeholder="t('描述你的创作目标，例如：生成一支 15 秒新品发布短片', 'Describe your creative goal, for example: create a 15-second product launch film.')"
        @keydown.enter.exact.prevent="submit"
      />
      <div class="pointer-events-none absolute inset-x-5 bottom-2 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent opacity-0 transition group-focus-within:opacity-100" />
    </div>

    <div class="flex items-center justify-between gap-3 border-t border-cyan-100/10 px-4 pb-3 pt-3">
      <button class="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/62 transition hover:border-cyan-200/35 hover:text-white" @click="openSettings">
        <Settings class="size-4" />
        {{ t('API 设置', 'API Settings') }}
      </button>
      <div class="hidden min-w-0 items-center gap-2 text-xs text-white/42 sm:flex">
        <CircleDot class="size-4 shrink-0 text-cyan-100" />
        <span class="truncate">DeepSeek / Prompt / Image / Video / Export</span>
      </div>
      <button
        :disabled="loading"
        class="grid size-9 shrink-0 place-items-center rounded-full text-[#061018] transition"
        :class="loading ? 'bg-white/30' : 'bg-cyan-100 hover:bg-white hover:shadow-[0_0_28px_rgba(143,234,255,.45)]'"
        @click="submit"
      >
        <span v-if="loading" class="inline-block size-4 animate-spin rounded-full border-2 border-[#061018] border-t-transparent" />
        <ArrowRight v-else class="size-4" />
      </button>
    </div>
    <div v-if="error" class="px-4 pb-3 text-xs text-amber-200">{{ error }}</div>
  </div>

  <div v-if="showApiDialog" class="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" @click.self="showApiDialog = false">
    <aside class="h-full w-full max-w-[520px] border-l border-cyan-100/12 bg-[#07111f] text-white shadow-2xl">
      <div class="flex h-16 items-center justify-between border-b border-cyan-100/10 px-6">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg border border-cyan-100/18 bg-cyan-500/12 text-cyan-100">
            <Zap class="size-5" />
          </div>
          <div>
            <h2 class="text-lg font-semibold">{{ t('API 设置', 'API Settings') }}</h2>
            <p class="text-xs text-white/40">Model Connection Center</p>
          </div>
        </div>
        <button class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white" @click="showApiDialog = false">
          <X class="size-4" />
        </button>
      </div>

      <div class="p-5">
        <div class="rounded-xl border border-cyan-100/12 bg-black/20 p-4">
          <div class="mb-4 flex items-center gap-2 text-xs text-white/45">
            <span :class="['size-2 rounded-full', chatForm.apiKey ? 'bg-emerald-400' : 'bg-white/28']" />
            {{ chatForm.apiKey ? t('已配置', 'Configured') : t('未配置', 'Not configured') }}
          </div>
          <label class="mb-4 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/52"><Link2 class="size-4" />API Base URL</span>
            <input v-model="chatForm.baseUrl" class="h-11 w-full rounded-lg border border-white/10 bg-black/35 px-3 text-sm text-white outline-none focus:border-cyan-300/60" />
          </label>
          <label class="mb-4 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/52"><KeyRound class="size-4" />API Key</span>
            <div class="flex h-11 items-center rounded-lg border border-white/10 bg-black/35 focus-within:border-cyan-300/60">
              <input v-model="chatForm.apiKey" :type="showKey ? 'text' : 'password'" class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="sk-..." />
              <button type="button" class="grid size-10 place-items-center text-white/42 hover:text-white" @click="showKey = !showKey">
                <EyeOff v-if="showKey" class="size-4" />
                <Eye v-else class="size-4" />
              </button>
            </div>
          </label>
          <label class="mb-5 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/52"><Cpu class="size-4" />{{ t('默认模型', 'Default Model') }}</span>
            <input v-model="chatForm.model" class="h-11 w-full rounded-lg border border-white/10 bg-black/35 px-3 text-sm text-white outline-none focus:border-cyan-300/60" placeholder="deepseek-chat" />
          </label>
          <div class="grid gap-3 sm:grid-cols-2">
            <button class="h-11 rounded-lg bg-cyan-100 text-sm font-medium text-[#061018] transition hover:bg-white" @click="saveApiSettings">{{ t('保存配置', 'Save settings') }}</button>
            <button class="h-11 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:bg-white/10" :disabled="testing" @click="testConnection">
              <Loader2 v-if="testing" class="mx-auto size-4 animate-spin" />
              <span v-else>{{ t('测试连接', 'Test connection') }}</span>
            </button>
          </div>
          <div v-if="apiStatus" class="mt-4 flex items-start gap-2 rounded-lg border border-cyan-100/12 bg-white/5 p-3 text-xs leading-5 text-white/65">
            <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-cyan-100" />
            {{ apiStatus }}
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ArrowRight, CheckCircle2, CircleDot, Cpu, Eye, EyeOff, KeyRound, Link2, Loader2, Settings, X, Zap } from 'lucide-vue-next'
import { useSettingsStore } from '~/stores/settingsStore'
import { aiService, applyApiConfig, loadProviderConfigsFromBackend, readApiConfig, saveApiConfig } from '~/services/aiService'
import { uid } from '~/utils'

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const goal = ref('')
const loading = ref(false)
const error = ref('')
const showApiDialog = ref(false)
const showKey = ref(false)
const testing = ref(false)
const apiStatus = ref('')

const chatForm = reactive({ baseUrl: '', apiKey: '', model: '' })

function loadLocalChatConfig() {
  Object.assign(chatForm, { baseUrl: '', apiKey: '', model: '', ...readApiConfig('chat') })
}

async function loadBackendChatConfig() {
  try {
    const list = await loadProviderConfigsFromBackend()
    const chat = list.find((item: any) => item.provider === 'chat')
    if (chat) {
      if (chat.baseUrl) chatForm.baseUrl = chat.baseUrl
      if (chat.apiKey) chatForm.apiKey = chat.apiKey
      if (chat.model) chatForm.model = chat.model
    }
  } catch {}
}

function openSettings() {
  showApiDialog.value = true
}

function saveApiSettings() {
  saveApiConfig('chat', { provider: 'chat', baseUrl: chatForm.baseUrl, apiKey: chatForm.apiKey, model: chatForm.model })
  aiService.saveProviders({ provider: 'chat', baseUrl: chatForm.baseUrl, apiKey: chatForm.apiKey, model: chatForm.model })
    .then(() => { apiStatus.value = t('已保存配置', 'Settings saved.') })
    .catch(() => { apiStatus.value = t('已保存到本地', 'Saved locally.') })
}

async function testConnection() {
  apiStatus.value = ''
  testing.value = true
  try {
    const res: any = await aiService.chat(applyApiConfig('chat', {
      model: chatForm.model || 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a connection tester. Reply with one short sentence.' },
        { role: 'user', content: 'Polaris connection test' }
      ]
    }))
    apiStatus.value = res?.content ? t('连接成功', 'Connection successful.') : t('连接成功，但模型没有返回内容', 'Connected, but no reply was returned.')
  } catch (err: any) {
    apiStatus.value = err?.message || err?.response?.data?.message || t('连接失败', 'Connection failed')
  } finally {
    testing.value = false
  }
}

async function submit() {
  error.value = ''
  const config = readApiConfig('chat')
  if (!config.apiKey) {
    showApiDialog.value = true
    error.value = t('请先配置 API Key', 'Please configure your API Key first.')
    return
  }
  if (!goal.value.trim()) {
    error.value = t('请先输入一个创作目标。', 'Please enter a creative goal first.')
    return
  }
  loading.value = true
  try {
    const res: any = await aiService.chat(applyApiConfig('chat', {
      model: config.model || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: settingsStore.isZh
            ? '你是 Polaris AI Creation OS 的创作路线架构师。请将用户目标拆解为：1. 创意摘要；2. 正向提示词；3. 负向提示词；4. 推荐星图节点路线；5. 图像/视频比例与风格建议。使用清晰中文输出。'
            : 'You are the creative route architect for Polaris AI Creation OS. Break the user goal into: 1. concise creative summary; 2. positive prompt; 3. negative prompt; 4. recommended star-map node route; 5. image/video ratio and style suggestions. Reply in clear English.'
        },
        { role: 'user', content: goal.value }
      ]
    }))
    const reply = res?.content || ''
    if (!reply) throw new Error(t('AI 请求失败', 'AI request failed'))
    localStorage.setItem('polaris.pendingGoal', JSON.stringify({
      goal: goal.value, content: reply, createdAt: new Date().toISOString()
    }))
    const messages = [
      { id: uid('msg'), role: 'user', content: goal.value, timestamp: Date.now() },
      { id: uid('msg'), role: 'assistant', content: reply, timestamp: Date.now() + 1 }
    ]
    localStorage.setItem('polaris.pendingAgentMessages', JSON.stringify(messages))
    navigateTo('/studio')
  } catch (err: any) {
    error.value = err?.response?.data?.message || err?.message || t('请求失败', 'Request failed')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLocalChatConfig()
  loadBackendChatConfig()
})
</script>

<style scoped>
.goal-composer:focus-within {
  border-color: rgba(143, 234, 255, 0.38);
  box-shadow: 0 34px 140px rgba(78, 201, 255, 0.22), inset 0 0 0 1px rgba(223, 249, 255, 0.06);
}
</style>
