<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">控制台 / Dashboard</h1>
      <p class="mt-1 text-sm text-white/45">系统概览 / System Overview</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-white/10 bg-white/5 p-6">
        <component :is="stat.icon" class="mb-3 size-6" :class="stat.iconColor" />
        <p class="text-3xl font-bold">{{ stat.value.toLocaleString() }}</p>
        <p class="mt-1 text-sm text-white/45">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, FolderKanban, Image, TrendingUp } from 'lucide-vue-next'

interface StatItem {
  label: string
  value: number
  icon: any
  iconColor: string
}

const stats = ref<StatItem[]>([
  { label: '用户总数 / Total Users', value: 0, icon: Users, iconColor: 'text-cyan-300' },
  { label: '项目总数 / Total Projects', value: 0, icon: FolderKanban, iconColor: 'text-violet-300' },
  { label: '素材总数 / Total Assets', value: 0, icon: Image, iconColor: 'text-emerald-300' },
  { label: '星尘消耗 / Credits Used', value: 0, icon: TrendingUp, iconColor: 'text-amber-300' },
])

onMounted(async () => {
  try {
    const { adminService } = await import('~/services/adminService')
    const res: any = await adminService.dashboard()
    const data = res.data || res
    if (data) {
      stats.value = [
        { label: '用户总数 / Total Users', value: data.totalUsers || 0, icon: Users, iconColor: 'text-cyan-300' },
        { label: '项目总数 / Total Projects', value: data.totalProjects || 0, icon: FolderKanban, iconColor: 'text-violet-300' },
        { label: '素材总数 / Total Assets', value: data.totalAssets || 0, icon: Image, iconColor: 'text-emerald-300' },
        { label: '星尘消耗 / Credits Used', value: data.totalCredits || 0, icon: TrendingUp, iconColor: 'text-amber-300' },
      ]
    }
  } catch {
    // use defaults
  }
})
</script>
