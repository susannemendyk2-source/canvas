<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">模板管理 / Template Management</h1>
        <p class="mt-1 text-sm text-white/45">管理公开模板 / Manage public templates</p>
      </div>
      <button class="flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white">
        <Plus class="size-4" />
        新建模板 / New Template
      </button>
    </div>

    <div v-if="templates.length === 0" class="flex flex-col items-center justify-center py-20 text-white/35">
      <FileText class="mb-3 size-12" />
      <p class="text-sm">暂无模板 / No templates yet</p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div v-for="tmpl in templates" :key="tmpl.id" class="rounded-xl border border-white/10 bg-white/5 p-5">
        <div class="mb-2 flex items-start justify-between">
          <h3 class="font-semibold">{{ tmpl.name }}</h3>
          <span class="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] uppercase text-white/50">{{ tmpl.mode }}</span>
        </div>
        <p v-if="tmpl.description" class="mb-4 line-clamp-2 text-xs text-white/45">{{ tmpl.description }}</p>
        <p class="mb-4 text-[11px] text-white/35">{{ tmpl.createdAt }}</p>
        <div class="flex gap-2">
          <button class="rounded-md border border-white/8 bg-white/6 px-3 py-1.5 text-xs text-white/60 hover:text-white">编辑 / Edit</button>
          <button class="rounded-md border border-white/8 bg-white/6 px-3 py-1.5 text-xs text-amber-300/60 hover:text-amber-300">删除 / Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, FileText } from 'lucide-vue-next'

interface TemplateItem {
  id: number
  name: string
  description?: string
  mode: string
  createdAt: string
}

const templates = ref<TemplateItem[]>([])

onMounted(async () => {
  try {
    const { adminService } = await import('~/services/adminService')
    const res: any = await adminService.listProjects({ status: 3 })
    templates.value = res.data || res || []
  } catch {
    templates.value = []
  }
})
</script>
