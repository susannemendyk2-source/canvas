<template>
  <main class="mx-auto max-w-7xl px-6 py-8">
    <PageHead :title="t('模板管理', 'Template Management')" :desc="t('维护面向用户的公开工作流和星图模板。', 'Maintain public workflow and star map templates.')" />
    <section v-if="templates.length === 0" class="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] py-20 text-white/35">
      <FileText class="mb-3 size-12" />
      <p class="text-sm">{{ t('暂无模板', 'No templates yet') }}</p>
    </section>
    <section v-else class="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
      <article v-for="tmpl in templates" :key="tmpl.id" class="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <div class="mb-3 flex items-start justify-between gap-3">
          <h3 class="line-clamp-2 font-semibold text-white">{{ tmpl.name || tmpl.title }}</h3>
          <span class="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] uppercase text-white/50">{{ tmpl.mode || tmpl.type || 'template' }}</span>
        </div>
        <p class="mb-4 line-clamp-2 min-h-8 text-xs text-white/45">{{ tmpl.description || t('暂无描述', 'No description') }}</p>
        <p class="mb-4 text-[11px] text-white/35">{{ tmpl.createdAt || '-' }}</p>
        <div class="flex gap-2">
          <button class="rounded-md border border-white/8 bg-white/6 px-3 py-1.5 text-xs text-white/62 hover:text-white">{{ t('编辑', 'Edit') }}</button>
          <button class="rounded-md border border-white/8 bg-white/6 px-3 py-1.5 text-xs text-amber-300/70 hover:text-amber-300" @click="removeLocal(tmpl)">{{ t('下架', 'Remove') }}</button>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import PageHead from '~/components/admin/PageHead.vue'
import { adminService } from '~/services/adminService'
import { useSettingsStore } from '~/stores/settingsStore'

interface TemplateItem { id: number; name?: string; title?: string; description?: string; mode?: string; type?: string; createdAt?: string }
const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const templates = ref<TemplateItem[]>([])
onMounted(async () => {
  settingsStore.init()
  try { const res: any = await adminService.listProjects({ status: 3 }); templates.value = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || [] } catch { templates.value = [] }
})
function removeLocal(template: TemplateItem) { templates.value = templates.value.filter((item) => item.id !== template.id) }
</script>
