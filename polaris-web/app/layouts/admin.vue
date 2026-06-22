<template>
  <div class="flex min-h-screen bg-[#050608] text-white">
    <aside class="flex w-56 flex-col border-r border-white/10 bg-[#090A0F]">
      <NuxtLink to="/" class="flex h-16 items-center gap-3 border-b border-white/8 px-5">
        <div class="grid size-9 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow">
          <Navigation class="size-5 text-cyan-100" />
        </div>
        <div>
          <div class="text-sm font-semibold tracking-wide">Polaris</div>
          <div class="text-[10px] uppercase tracking-[0.32em] text-cyan-100/45">Admin</div>
        </div>
      </NuxtLink>
      <nav class="flex-1 space-y-1 p-4 text-sm text-white/52">
        <NuxtLink v-for="item in links" :key="item.to" :to="item.to" class="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/6 hover:text-white">
          <component :is="item.icon" class="size-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="border-t border-white/8 p-4">
        <NuxtLink to="/studio" class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/42 transition hover:text-white">
          <ArrowLeft class="size-4" />
          返回工作台 / Back to Studio
        </NuxtLink>
      </div>
    </aside>
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Navigation, ArrowLeft, LayoutDashboard, Users, FolderKanban, FileText, Cpu, Settings, ScrollText } from 'lucide-vue-next'

const user = useState('user', () => null)

const links = [
  { to: '/admin/dashboard', label: '控制台 / Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: '用户管理 / Users', icon: Users },
  { to: '/admin/projects', label: '项目审核 / Projects', icon: FolderKanban },
  { to: '/admin/templates', label: '模板管理 / Templates', icon: FileText },
  { to: '/admin/providers', label: 'AI 供应商 / Providers', icon: Cpu },
  { to: '/admin/settings', label: '系统设置 / Settings', icon: Settings },
  { to: '/admin/logs', label: '操作日志 / Logs', icon: ScrollText },
]

onMounted(() => {
  if (import.meta.client) {
    const token = localStorage.getItem('polaris.token')
    const role = localStorage.getItem('polaris.role')
    if (!token) {
      navigateTo('/login')
    } else if (role !== 'ADMIN') {
      navigateTo('/studio')
    }
  }
})
</script>
