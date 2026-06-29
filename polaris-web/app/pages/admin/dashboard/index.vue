<template>
  <main class="mx-auto max-w-7xl px-6 py-8">
    <section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">{{ t('管理后台', 'Admin Console') }}</p>
        <h1 class="mt-2 text-2xl font-semibold text-white">{{ t('系统概览', 'System Overview') }}</h1>
        <p class="mt-1 text-sm text-white/45">{{ t('查看用户、项目、素材和积分运行情况。', 'Monitor users, projects, assets and credit usage.') }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/admin/users" class="rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">{{ t('用户管理', 'Users') }}</NuxtLink>
        <NuxtLink to="/admin/projects" class="rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">{{ t('项目审核', 'Projects') }}</NuxtLink>
        <NuxtLink to="/admin/logs" class="rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">{{ t('系统日志', 'Logs') }}</NuxtLink>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="stat in stats" :key="stat.key" class="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <div class="mb-4 flex items-center justify-between">
          <component :is="stat.icon" class="size-5" :class="stat.color" />
          <span class="text-xs text-white/35">{{ stat.hint }}</span>
        </div>
        <p class="text-3xl font-semibold text-white">{{ stat.value.toLocaleString() }}</p>
        <p class="mt-1 text-sm text-white/45">{{ stat.label }}</p>
      </div>
    </section>

    <section class="mt-6 grid gap-4 lg:grid-cols-2">
      <div class="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <h2 class="text-sm font-semibold text-white">{{ t('运营状态', 'Operations') }}</h2>
        <div class="mt-4 space-y-3">
          <div v-for="item in health" :key="item.label" class="flex items-center justify-between rounded-md border border-white/8 bg-black/20 px-3 py-2">
            <span class="text-sm text-white/62">{{ item.label }}</span>
            <span :class="['text-sm font-medium', item.ok ? 'text-emerald-300' : 'text-amber-300']">{{ item.value }}</span>
          </div>
        </div>
      </div>
      <div class="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <h2 class="text-sm font-semibold text-white">{{ t('快捷入口', 'Quick Actions') }}</h2>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <NuxtLink v-for="link in quickLinks" :key="link.to" :to="link.to" class="flex items-center justify-between rounded-md border border-white/8 bg-black/20 px-3 py-3 text-sm text-white/70 transition hover:border-cyan-200/30 hover:text-white">
            {{ link.label }}
            <ChevronRight class="size-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ChevronRight, Coins, FolderKanban, Image, TrendingUp, Users } from 'lucide-vue-next'
import { adminService } from '~/services/adminService'
import { useSettingsStore } from '~/stores/settingsStore'

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const stats = ref([
  { key: 'users', label: t('用户总数', 'Total Users'), value: 0, icon: Users, color: 'text-cyan-300', hint: t('账号', 'accounts') },
  { key: 'projects', label: t('项目总数', 'Total Projects'), value: 0, icon: FolderKanban, color: 'text-violet-300', hint: t('画布', 'canvases') },
  { key: 'assets', label: t('素材总数', 'Total Assets'), value: 0, icon: Image, color: 'text-emerald-300', hint: t('文件', 'files') },
  { key: 'credits', label: t('积分消耗', 'Credits Used'), value: 0, icon: Coins, color: 'text-amber-300', hint: t('星尘', 'credits') },
])

const health = computed(() => [
  { label: t('前端工作台', 'Web workspace'), value: t('正常', 'Healthy'), ok: true },
  { label: t('后端 API', 'Backend API'), value: t('已连接', 'Connected'), ok: true },
  { label: t('模型服务配置', 'Provider config'), value: t('待完善', 'Pending'), ok: false },
])

const quickLinks = computed(() => [
  { label: t('用户与积分', 'Users and credits'), to: '/admin/users' },
  { label: t('模板管理', 'Templates'), to: '/admin/templates' },
  { label: t('模型供应商', 'Providers'), to: '/admin/providers' },
  { label: t('系统设置', 'Settings'), to: '/admin/settings' },
])

onMounted(async () => {
  settingsStore.init()
  try {
    const res: any = await adminService.dashboard()
    const data = res.data || res || {}
    stats.value = [
      { key: 'users', label: t('用户总数', 'Total Users'), value: Number(data.userCount || 0), icon: Users, color: 'text-cyan-300', hint: t('账号', 'accounts') },
      { key: 'projects', label: t('项目总数', 'Total Projects'), value: Number(data.projectCount || 0), icon: FolderKanban, color: 'text-violet-300', hint: t('画布', 'canvases') },
      { key: 'assets', label: t('素材总数', 'Total Assets'), value: Number(data.assetCount || 0), icon: Image, color: 'text-emerald-300', hint: t('文件', 'files') },
      { key: 'credits', label: t('总积分', 'Total Credits'), value: Number(data.totalCredits || 0), icon: Coins, color: 'text-amber-300', hint: t('星尘', 'credits') },
    ]
  } catch {}
})
</script>
