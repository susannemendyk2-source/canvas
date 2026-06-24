<template>
  <main class="mx-auto max-w-5xl px-6 py-8">
    <PageHead :title="t('系统设置', 'System Settings')" :desc="t('维护站点基础参数、注册策略和积分默认值。', 'Maintain site basics, registration policy and default credits.')" />
    <section class="rounded-lg border border-white/10 bg-white/[0.04] p-6">
      <div class="grid gap-5 md:grid-cols-2">
        <label class="block"><span class="mb-1.5 block text-xs text-white/48">{{ t('站点名称', 'Site Name') }}</span><input v-model="settings.siteName" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" /></label>
        <label class="block"><span class="mb-1.5 block text-xs text-white/48">{{ t('站点描述', 'Site Description') }}</span><input v-model="settings.siteDescription" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" /></label>
        <label class="block"><span class="mb-1.5 block text-xs text-white/48">{{ t('默认语言', 'Default Language') }}</span><select v-model="settings.defaultLang" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option value="zh">中文</option><option value="en">English</option></select></label>
        <label class="block"><span class="mb-1.5 block text-xs text-white/48">{{ t('注册模式', 'Registration Mode') }}</span><select v-model="settings.registrationMode" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option value="open">{{ t('开放注册', 'Open') }}</option><option value="invite">{{ t('邀请注册', 'Invite Only') }}</option><option value="closed">{{ t('关闭注册', 'Closed') }}</option></select></label>
        <label class="block"><span class="mb-1.5 block text-xs text-white/48">{{ t('新用户初始积分', 'New User Credits') }}</span><input v-model.number="settings.defaultCredits" type="number" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" /></label>
        <label class="block"><span class="mb-1.5 block text-xs text-white/48">{{ t('最大上传大小 MB', 'Max Upload Size MB') }}</span><input v-model.number="settings.maxUploadSize" type="number" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" /></label>
      </div>
      <div class="mt-6 flex items-center justify-between rounded-lg border border-white/8 bg-black/20 px-4 py-3">
        <div><p class="text-sm font-medium text-white">{{ t('维护模式', 'Maintenance Mode') }}</p><p class="text-xs text-white/35">{{ t('开启后普通用户将无法进入创作工作台。', 'When enabled, regular users cannot enter the workspace.') }}</p></div>
        <button class="rounded-full border px-3 py-1.5 text-xs transition" :class="settings.maintenanceMode ? 'border-amber-300/30 bg-amber-500/12 text-amber-300' : 'border-emerald-300/30 bg-emerald-500/12 text-emerald-300'" @click="settings.maintenanceMode = !settings.maintenanceMode">{{ settings.maintenanceMode ? t('开启', 'On') : t('关闭', 'Off') }}</button>
      </div>
      <div class="mt-6 flex items-center gap-3"><button class="h-10 rounded-lg bg-cyan-100 px-5 text-sm font-medium text-[#061018]" @click="save">{{ t('保存设置', 'Save Settings') }}</button><span class="text-xs text-emerald-300/80">{{ saved }}</span></div>
    </section>
  </main>
</template>

<script setup lang="ts">
import PageHead from '~/components/admin/PageHead.vue'
import { useSettingsStore } from '~/stores/settingsStore'

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const saved = ref('')
const settings = reactive({ siteName: 'Polaris', siteDescription: 'AI creative workspace', defaultLang: 'zh', registrationMode: 'open', defaultCredits: 100, maxUploadSize: 50, maintenanceMode: false })
onMounted(() => { settingsStore.init(); if (import.meta.client) { try { Object.assign(settings, JSON.parse(localStorage.getItem('polaris.systemSettings') || '{}')) } catch {} } })
function save() { if (import.meta.client) localStorage.setItem('polaris.systemSettings', JSON.stringify(settings)); saved.value = t('已保存', 'Saved'); window.setTimeout(() => (saved.value = ''), 1800) }
</script>
