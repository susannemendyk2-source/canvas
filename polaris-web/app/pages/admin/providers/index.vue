<template>
  <main class="mx-auto max-w-5xl px-6 py-8">
    <PageHead :title="t('AI 供应商', 'AI Providers')" :desc="t('配置全局模型服务，供画布和工作流调用。', 'Configure global model services for canvas and workflow calls.')" />
    <div class="mb-5 flex flex-wrap gap-2">
      <button v-for="tab in providerTabs" :key="tab.id" class="rounded-lg border px-4 py-2 text-sm transition" :class="activeTab === tab.id ? 'border-cyan-300/30 bg-cyan-100/10 text-cyan-50' : 'border-white/10 bg-white/6 text-white/55 hover:text-white'" @click="activeTab = tab.id">
        <KeyRound class="mr-1 inline size-4" />{{ tab.label }}
      </button>
    </div>
    <section class="rounded-lg border border-white/10 bg-white/[0.04] p-6">
      <div class="mb-4 flex items-center gap-2 text-xs text-white/42"><span :class="['size-2 rounded-full', current.apiKey ? 'bg-emerald-400' : 'bg-white/28']" />{{ current.apiKey ? t('已配置', 'Configured') : t('未配置', 'Not configured') }}</div>
      <label class="mb-4 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48"><Link2 class="size-4" />API Base URL</span><input v-model="current.baseUrl" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60" /></label>
      <label class="mb-4 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48"><KeyRound class="size-4" />API Key</span><input v-model="current.apiKey" :type="showKey ? 'text' : 'password'" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60" /></label>
      <label class="mb-5 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48"><Cpu class="size-4" />{{ t('默认模型', 'Default Model') }}</span><select v-model="current.model" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option v-for="m in modelOptions[activeTab]" :key="m" :value="m">{{ m }}</option></select></label>
      <div class="flex flex-wrap gap-3"><button class="h-10 rounded-lg bg-cyan-100 px-5 text-sm font-medium text-[#061018]" @click="save">{{ t('保存', 'Save') }}</button><button class="h-10 rounded-lg border border-white/10 bg-white/6 px-5 text-sm text-white/72" @click="showKey = !showKey">{{ showKey ? t('隐藏密钥', 'Hide Key') : t('显示密钥', 'Show Key') }}</button><span class="self-center text-xs text-emerald-300/80">{{ saved }}</span></div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Cpu, KeyRound, Link2 } from 'lucide-vue-next'
import PageHead from '~/components/admin/PageHead.vue'
import { useSettingsStore } from '~/stores/settingsStore'

type ProviderId = 'deepseek' | 'runninghub' | 'volcano'
const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const activeTab = ref<ProviderId>('deepseek')
const showKey = ref(false)
const saved = ref('')
const providerTabs = [{ id: 'deepseek' as ProviderId, label: 'DeepSeek' }, { id: 'runninghub' as ProviderId, label: 'RunningHub' }, { id: 'volcano' as ProviderId, label: 'Volcano' }]
const modelOptions: Record<ProviderId, string[]> = { deepseek: ['deepseek-chat', 'deepseek-reasoner'], runninghub: ['nano-banana-pro', 'nano-banana', 'gpt-image-2', 'custom-workflow'], volcano: ['doubao-seed-1-6', 'doubao-vision-pro', 'seedream-3-0'] }
const configs = ref<Record<ProviderId, { baseUrl: string; apiKey: string; model: string }>>({ deepseek: { baseUrl: 'https://api.deepseek.com', apiKey: '', model: 'deepseek-chat' }, runninghub: { baseUrl: '', apiKey: '', model: 'nano-banana-pro' }, volcano: { baseUrl: '', apiKey: '', model: 'doubao-seed-1-6' } })
const current = computed(() => configs.value[activeTab.value])
onMounted(() => { settingsStore.init(); if (import.meta.client) { try { configs.value = { ...configs.value, ...JSON.parse(localStorage.getItem('polaris.adminProviders') || '{}') } } catch {} } })
function save() { if (import.meta.client) localStorage.setItem('polaris.adminProviders', JSON.stringify(configs.value)); saved.value = t('已保存', 'Saved'); window.setTimeout(() => (saved.value = ''), 1800) }
</script>
