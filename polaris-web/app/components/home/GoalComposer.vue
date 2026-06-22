<template>
  <div class="mx-auto mt-8 max-w-3xl rounded-2xl border border-cyan-100/14 bg-[#111722]/88 p-3 shadow-[0_30px_120px_rgba(30,130,255,.18)] backdrop-blur-xl">
    <textarea
      v-model="goal"
      class="h-24 w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
      placeholder="输入你的创作航向，例如：为一款智能手表生成15 秒新品发布短片.. / Describe your north-star creative goal..."
    />
    <div class="flex items-center justify-between border-t border-white/10 px-2 pt-3">
      <button @click="openSettings" class="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/54 transition hover:text-white">
        <Settings class="size-4" />
        API 设置
      </button>
      <div class="hidden items-center gap-2 text-xs text-white/38 sm:flex">
        <CircleDot class="size-4 text-cyan-100" />
        DeepSeek · Prompt ?Image ?Video ?Export
      </div>
      <button
        @click="submit"
        :disabled="loading"
        class="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-[#061018] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Loader2 v-if="loading" class="size-4 animate-spin" />
        <ArrowRight v-else class="size-4" />
        生成航线
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
            <h2 class="text-lg font-semibold">设置</h2>
            <p class="text-xs text-white/40">API Connection Center</p>
          </div>
        </div>
        <button @click="showApiDialog = false" class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white">
          <X class="size-4" />
        </button>
      </div>
      <div class="p-5">
        <div class="mb-5 flex gap-2">
          <button v-for="tab in apiTabs" :key="tab.id" @click="activeProvider = tab.id; apiStatus = ''" :class="['rounded-lg px-4 py-2 text-sm transition', activeProvider === tab.id ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/48 hover:bg-white/6 hover:text-white']">
            <KeyRound class="mr-1 inline size-4" />
            {{ tab.label }}
          </button>
        </div>
        <div class="rounded-xl border border-white/8 bg-black/16 p-4">
          <div class="mb-4 flex items-center gap-2 text-xs text-white/42">
            <span :class="['size-2 rounded-full', currentProvider.apiKey ? 'bg-emerald-400' : 'bg-white/28']" />
            {{ currentProvider.apiKey ? '已配置 / Configured' : '未配置 / Not configured' }}
          </div>
          <label class="mb-4 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/48"><Link2 class="size-4" />API Base URL</span>
            <input v-model="currentProvider.baseUrl" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
          </label>
          <label class="mb-4 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/48"><KeyRound class="size-4" />API Key</span>
            <div class="flex h-11 items-center rounded-lg border border-white/8 bg-black focus-within:border-cyan-400/60">
              <input v-model="currentProvider.apiKey" :type="showKey ? 'text' : 'password'" class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="sk-..." />
              <button type="button" @click="showKey = !showKey" class="grid size-10 place-items-center text-white/42 hover:text-white">
                <EyeOff v-if="showKey" class="size-4" />
                <Eye v-else class="size-4" />
              </button>
            </div>
          </label>
          <label class="mb-5 block">
            <span class="mb-2 flex items-center gap-2 text-xs text-white/48"><Cpu class="size-4" />默认模型 / Default Model</span>
            <select v-model="currentProvider.model" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60">
              <option v-for="m in modelOptions[activeProvider]" :key="m" :value="m">{{ m }}</option>
            </select>
          </label>
          <div class="grid gap-3 sm:grid-cols-2">
            <button @click="saveApiSettings" class="h-11 rounded-lg bg-cyan-600 text-sm font-medium text-white transition hover:bg-cyan-500">保存配置</button>
            <button @click="testConnection" class="h-11 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:bg-white/10" :disabled="testing">
              <Loader2 v-if="testing" class="mx-auto size-4 animate-spin" />
              <span v-else>测试连接</span>
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
import { Settings, ArrowRight, Loader2, CircleDot, Zap, X, KeyRound, Link2, Cpu, Eye, EyeOff, CheckCircle2 } from 'lucide-vue-next'

const goal = ref('')
const loading = ref(false)
const error = ref('')
const showApiDialog = ref(false)

const showKey = ref(false)
const testing = ref(false)
const apiStatus = ref('')
const activeProvider = ref('deepseek')

const apiTabs = [
  { id: 'deepseek', label: 'DeepSeek API' },
  { id: 'runninghub', label: 'RunningHub' },
  { id: 'volcano', label: '火山引擎' },
]

type ProviderId = 'deepseek' | 'runninghub' | 'volcano'

const modelOptions: Record<ProviderId, string[]> = {
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  runninghub: ['nano-banana-pro', 'nano-banana', 'gpt-image-2', 'custom-workflow'],
  volcano: ['doubao-seed-1-6', 'doubao-vision-pro', 'seedream-3-0', 'custom-model'],
}

const providers = ref<Record<ProviderId, { baseUrl: string; apiKey: string; model: string }>>({
  deepseek: { baseUrl: 'https://api.deepseek.com', apiKey: '', model: 'deepseek-chat' },
  runninghub: { baseUrl: '', apiKey: '', model: 'nano-banana-pro' },
  volcano: { baseUrl: '', apiKey: '', model: 'doubao-seed-1-6' },
})

const currentProvider = computed(() => providers.value[activeProvider.value as ProviderId])

function openSettings() {
  showApiDialog.value = true
}

function saveApiSettings() {
  try {
    localStorage.setItem('polaris.apiProviders', JSON.stringify(providers.value))
    apiStatus.value = '配置已保存到本机浏览器'
  } catch {
    apiStatus.value = '保存失败'
  }
}

async function testConnection() {
  apiStatus.value = ''
  if (activeProvider.value !== 'deepseek') {
    apiStatus.value = '当前版本仅支持测试DeepSeek 对话接口'
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
          { role: 'user', content: 'Polaris connection test' },
        ],
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || '连接失败')
    apiStatus.value = '连接成功：DeepSeek 已可用于创作者目标输入框'
  } catch (err: any) {
    apiStatus.value = err.message || '连接失败'
  } finally {
    testing.value = false
  }
}

async function submit() {
  error.value = ''
  const cfg = providers.value.deepseek
  if (!cfg.apiKey.trim()) {
    showApiDialog.value = true
    error.value = '请先配置 DeepSeek API Key，然后再提交创作者目标'
    return
  }
  if (!goal.value.trim()) {
    error.value = '请先输入一个创作目标'
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
            content: '你是 Polaris AI 创作系统的创意架构师。请把用户目标拆成：1. 简短创意摘要；2. 正向提示词；3. 负向提示词；4. 推荐节点链路。图像/视频比例与风格建议。使用中文，结构清晰',
          },
          { role: 'user', content: goal.value },
        ],
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'DeepSeek 请求失败')
    localStorage.setItem(
      'polaris.pendingGoal',
      JSON.stringify({
        goal: goal.value,
        content: data.content,
        createdAt: new Date().toISOString(),
      })
    )
    navigateTo('/studio')
  } catch (err: any) {
    error.value = err.message || '请求失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('polaris.apiProviders')
    if (saved) providers.value = JSON.parse(saved)
  } catch {
    // ignore
  }
})
</script>
