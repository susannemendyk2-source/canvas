<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">系统设置 / System Settings</h1>
      <p class="mt-1 text-sm text-white/45">配置全局系统参数 / Configure global system parameters</p>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-6">
      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-xs text-white/48">站点名称 / Site Name</label>
          <input v-model="settings.siteName" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">站点描述 / Site Description</label>
          <input v-model="settings.siteDescription" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">默认语言 / Default Language</label>
          <select v-model="settings.defaultLang" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60">
            <option value="zh-CN">中文</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">注册模式 / Registration Mode</label>
          <select v-model="settings.registrationMode" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60">
            <option value="open">开放注册 / Open</option>
            <option value="invite">邀请注册 / Invite Only</option>
            <option value="closed">关闭注册 / Closed</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">新用户初始星尘 / New User Credits</label>
          <input v-model.number="settings.defaultCredits" type="number" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">最大上传大小 (MB) / Max Upload Size</label>
          <input v-model.number="settings.maxUploadSize" type="number" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
      </div>

      <div class="mt-8">
        <label class="mb-1.5 block text-xs text-white/48">维护模式 / Maintenance Mode</label>
        <div class="flex items-center gap-3">
          <button @click="settings.maintenanceMode = true" :class="['rounded-lg px-4 py-2 text-sm', settings.maintenanceMode ? 'bg-amber-500/12 text-amber-300 ring-1 ring-amber-400/30' : 'bg-white/6 text-white/48']">开启 / On</button>
          <button @click="settings.maintenanceMode = false" :class="['rounded-lg px-4 py-2 text-sm', !settings.maintenanceMode ? 'bg-emerald-500/12 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-white/6 text-white/48']">关闭 / Off</button>
        </div>
      </div>

      <button class="mt-8 h-11 rounded-lg bg-cyan-100 px-6 text-sm font-medium text-[#061018]">保存设置 / Save Settings</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SystemSettings {
  siteName: string
  siteDescription: string
  defaultLang: string
  registrationMode: string
  defaultCredits: number
  maxUploadSize: number
  maintenanceMode: boolean
}

const settings = ref<SystemSettings>({
  siteName: 'Polaris',
  siteDescription: 'AI 创作系统',
  defaultLang: 'zh-CN',
  registrationMode: 'open',
  defaultCredits: 100,
  maxUploadSize: 50,
  maintenanceMode: false,
})
</script>
