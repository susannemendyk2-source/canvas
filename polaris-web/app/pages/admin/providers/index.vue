<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">AI 供应商配置 / AI Provider Config</h1>
      <p class="mt-1 text-sm text-white/45">管理全局 AI 供应商 / Manage global AI providers</p>
    </div>

    <div class="mb-5 flex gap-2">
      <button v-for="tab in providerTabs" :key="tab.id" @click="activeTab = tab.id" :class="['rounded-lg px-4 py-2 text-sm transition', activeTab === tab.id ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/48 hover:bg-white/6 hover:text-white']">
        <KeyRound class="mr-1 inline size-4" />
        {{ tab.label }}
      </button>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-6">
      <div class="mb-4 flex items-center gap-2 text-xs text-white/42">
        <span :class="['size-2 rounded-full', current.apiKey ? 'bg-emerald-400' : 'bg-white/28']" />
        {{ current.apiKey ? '已配置 / Configured' : '未配置 / Not configured' }}
      </div>

      <label class="mb-4 block">
        <span class="mb-2 flex items-center gap-2 text-xs text-white/48">
          <Link2 class="size-4" />
          API Base URL
        </span>
        <input v-model="current.baseUrl" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
      </label>

      <label class="mb-4 block">
        <span class="mb-2 flex items-center gap-2 text-xs text-white/48">
          <KeyRound class="size-4" />
          API Key
        </span>
        <div class="flex h-11 items-center rounded-lg border border-white/8 bg-black focus-within:border-cyan-400/60">
          <input v-model="current.apiKey" :type="showKey ? 'text' : 'password'" class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="API Key" />
          <button type="button" @click="showKey = !showKey" class="grid size-10 place-items-center text-white/42 hover:text-white">
            <EyeOff v-if="showKey" class="size-4" />
            <Eye v-else class="size-4" />
          </button>
        </div>
      </label>

      <label class="mb-5 block">
        <span class="mb-2 flex items-center gap-2 text-xs text-white/48">
          <Cpu class="size-4" />
          默认模型 / Default Model
        </span>
        <select v-model="current.model" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60">
          <option v-for="m in modelOptions[activeTab]" :key="m" :value="m">{{ m }}</option>
        </select>
      </label>

      <div class="grid gap-3 sm:grid-cols-2">
        <button class="h-11 rounded-lg bg-cyan-600 text-sm font-medium text-white transition hover:bg-cyan-500">保存 / Save</button>
        <button class="h-11 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:bg-white/10">测试连接 / Test</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyRound, Link2, Cpu, Eye, EyeOff } from 'lucide-vue-next'

const activeTab = ref('deepseek')
const showKey = ref(false)

const providerTabs = [
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

const configs = ref<Record<ProviderId, { baseUrl: string; apiKey: string; model: string }>>({
  deepseek: { baseUrl: 'https://api.deepseek.com', apiKey: '', model: 'deepseek-chat' },
  runninghub: { baseUrl: '', apiKey: '', model: 'nano-banana-pro' },
  volcano: { baseUrl: '', apiKey: '', model: 'doubao-seed-1-6' },
})

const current = computed(() => configs.value[activeTab.value as ProviderId])
</script>
