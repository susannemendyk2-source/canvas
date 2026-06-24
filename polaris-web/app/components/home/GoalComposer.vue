<template>
  <div class="mx-auto mt-8 max-w-3xl rounded-2xl border border-cyan-100/14 bg-[#111722]/88 p-3 shadow-[0_30px_120px_rgba(30,130,255,.18)] backdrop-blur-xl">
    <textarea
      v-model="goal"
      class="h-24 w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
      :placeholder="t('输入你的创作航向，例如：为一款智能手表生成 15 秒新品发布短片。', 'Describe your north-star creative goal, for example: create a 15-second launch film for a smartwatch.')"
    />
    <div class="flex items-center justify-between border-t border-white/10 px-2 pt-3">
      <button class="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/54 transition hover:text-white" @click="openSettings">
        <Settings class="size-4" />
        {{ t('API 设置', 'API Settings') }}
      </button>
      <div class="hidden items-center gap-2 text-xs text-white/38 sm:flex">
        <CircleDot class="size-4 text-cyan-100" />
        DeepSeek / Prompt / Image / Video / Export
      </div>
      <button
        :disabled="loading"
        class="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-[#061018] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        @click="submit"
      >
        <Loader2 v-if="loading" class="size-4 animate-spin" />
        <ArrowRight v-else class="size-4" />
        {{ t('生成航线', 'Generate route') }}
      </button>
    </div>
    <div v-if="error" class="px-3 pt-3 text-xs text-amber-200">{{ error }}</div>
  </div>

  <div v-if="showApiDialog" class="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" @click.self="showApiDialog = false">
    <aside class="h-full w-full max-w-[520px] border-l border-white/10 bg-[#1b1c1f] text-white shadow-2xl">
      <div class="flex h-16 items-center justify-between border-b border-white/8 px-6">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-cyan-500/12 text-cyan-200">
            <Zap class="size-5" />
          </div>
          <div>
            <h2 class="text-lg font-semibold">{{ t('API 设置', 'API Settings') }}</h2>
            <p class="text-xs text-white/40">API Connection Center</p>
          </div>
        </div>
        <button class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white" @click="showApiDialog = false">
          <X class="size-4" />
        </button>
      </div>

      <div class="p-5">
        <div class="mb-5 flex gap-2">
          <button
            v-for="tab in apiTabs"
            :key="tab.id"
            :class="['rounded-lg px-4 py-2 text-sm transition', activeProvider === tab.id ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/48 hover:bg-white/6 hover:text-white']"
            @click="activeProvider = tab.id; apiStatus = ''"
          >
            <KeyRound class="mr-1 inline size-4" />
            {{ tab.label }}
          </button>
        </div>

        <div class="rounded-xl border border-white/8 bg-black/16 p-4">
          <div class="mb-4 flex items-center gap-2 text-xs text-white/42">
            <span :class="['size-2 rounded-full', currentProvider.apiKey ? 'bg-emerald-400' : 'bg-white/28']" />
            {{ currentProvider.apiKey ? t('已配置', 'Configured') : t('未配置', 'Not configured') }}
          </div>
          <label class="mb-4 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/48"><Link2 class="size-4" />API Base URL</span>
            <input v-model="currentProvider.baseUrl" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
          </label>
          <label class="mb-4 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/48"><KeyRound class="size-4" />API Key</span>
            <div class="flex h-11 items-center rounded-lg border border-white/8 bg-black focus-within:border-cyan-400/60">
              <input v-model="currentProvider.apiKey" :type="showKey ? 'text' : 'password'" class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="sk-..." />
              <button type="button" class="grid size-10 place-items-center text-white/42 hover:text-white" @click="showKey = !showKey">
                <EyeOff v-if="showKey" class="size-4" />
                <Eye v-else class="size-4" />
              </button>
            </div>
          </label>
          <label class="mb-5 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/48"><Cpu class="size-4" />{{ t('默认模型 Model', 'Default Model') }}</span>
            <select v-model="currentProvider.model" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60">
              <option v-for="m in modelOptions[activeProvider]" :key="m" :value="m">{{ m }}</option>
            </select>
          </label>
          <div class="grid gap-3 sm:grid-cols-2">
            <button class="h-11 rounded-lg bg-cyan-600 text-sm font-medium text-white transition hover:bg-cyan-500" @click="saveApiSettings">{{ t('保存配置', 'Save settings') }}</button>
            <button class="h-11 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:bg-white/10" :disabled="testing" @click="testConnection">
              <Loader2 v-if="testing" class="mx-auto size-4 animate-spin" />
              <span v-else>{{ t('测试连接', 'Test connection') }}</span>
            </button>
          </div>
          <div v-if="apiStatus" class="mt-4 flex items-start gap-2 rounded-lg border border-white/8 bg-white/5 p-3 text-xs leading-5 text-white/62">
            <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-cyan-200" />
            {{ apiStatus }}
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowRight, CheckCircle2, CircleDot, Cpu, Eye, EyeOff, KeyRound, Link2, Loader2, Settings, X, Zap } from 'lucide-vue-next'
import { useSettingsStore } from '~/stores/settingsStore'

type ProviderId = 'deepseek' | 'runninghub' | 'volcano'

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const goal = ref('')
const loading = ref(false)
const error = ref('')
const showApiDialog = ref(false)
const showKey = ref(false)
const testing = ref(false)
const apiStatus = ref('')
const activeProvider = ref<ProviderId>('deepseek')

const apiTabs = [
  { id: 'deepseek' as const, label: 'DeepSeek API' },
  { id: 'runninghub' as const, label: 'RunningHub' },
  { id: 'volcano' as const, label: 'Volcengine' }
]

const modelOptions: Record<ProviderId, string[]> = {
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  runninghub: ['nano-banana-pro', 'nano-banana', 'gpt-image-2', 'custom-workflow'],
  volcano: ['doubao-seed-1-6', 'doubao-vision-pro', 'seedream-3-0', 'custom-model']
}

const providers = ref<Record<ProviderId, { baseUrl: string; apiKey: string; model: string }>>({
  deepseek: { baseUrl: 'https://api.deepseek.com', apiKey: '', model: 'deepseek-chat' },
  runninghub: { baseUrl: '', apiKey: '', model: 'nano-banana-pro' },
  volcano: { baseUrl: '', apiKey: '', model: 'doubao-seed-1-6' }
})

const currentProvider = computed(() => providers.value[activeProvider.value])

function openSettings() {
  showApiDialog.value = true
}

function saveApiSettings() {
  try {
    localStorage.setItem('polaris.apiProviders', JSON.stringify(providers.value))
    apiStatus.value = t('配置已保存到本机浏览器。', 'Settings saved to this browser.')
  } catch {
    apiStatus.value = t('保存失败。', 'Save failed.')
  }
}

async function testConnection() {
  apiStatus.value = ''
  if (activeProvider.value !== 'deepseek') {
    apiStatus.value = t('当前版本仅支持测试 DeepSeek 对话接口。', 'This version only supports testing the DeepSeek chat endpoint.')
    return
  }
  testing.value = true
  try {
    const response = await fetch('/api/deepseek/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseUrl: currentProvider.value.baseUrl,
        apiKey: currentProvider.value.apiKey,
        model: currentProvider.value.model,
        messages: [
          { role: 'system', content: 'You are a connection tester. Reply with one short sentence.' },
          { role: 'user', content: 'Polaris connection test' }
        ]
      })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || t('连接失败', 'Connection failed'))
    apiStatus.value = t('连接成功，DeepSeek 已可用于创作目标输入框。', 'Connection successful. DeepSeek is ready for the creative goal composer.')
  } catch (err: any) {
    apiStatus.value = err.message || t('连接失败', 'Connection failed')
  } finally {
    testing.value = false
  }
}

async function submit() {
  error.value = ''
  const cfg = providers.value.deepseek
  if (!cfg.apiKey.trim()) {
    showApiDialog.value = true
    error.value = t('请先配置 DeepSeek API Key，然后再提交创作目标。', 'Please configure your DeepSeek API Key before submitting a creative goal.')
    return
  }
  if (!goal.value.trim()) {
    error.value = t('请先输入一个创作目标。', 'Please enter a creative goal first.')
    return
  }
  loading.value = true
  try {
    const response = await fetch('/api/deepseek/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseUrl: cfg.baseUrl,
        apiKey: cfg.apiKey,
        model: cfg.model,
        messages: [
          {
            role: 'system',
            content: settingsStore.isZh
              ? '你是 Polaris AI 创作系统的创意架构师。请把用户目标拆成：1. 简短创意摘要；2. 正向提示词；3. 负向提示词；4. 推荐节点链路；5. 图像/视频比例与风格建议。使用中文，结构清晰。'
              : 'You are the creative architect for Polaris AI. Break the user goal into: 1. concise creative summary; 2. positive prompt; 3. negative prompt; 4. recommended node route; 5. image/video ratio and style suggestions. Reply in clear English.'
          },
          { role: 'user', content: goal.value }
        ]
      })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || t('DeepSeek 请求失败', 'DeepSeek request failed'))
    localStorage.setItem(
      'polaris.pendingGoal',
      JSON.stringify({
        goal: goal.value,
        content: data.content,
        createdAt: new Date().toISOString()
      })
    )
    navigateTo('/studio')
  } catch (err: any) {
    error.value = err.message || t('请求失败', 'Request failed')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('polaris.apiProviders')
    if (saved) providers.value = JSON.parse(saved)
  } catch {
    // ignore invalid local settings
  }
})
</script>
