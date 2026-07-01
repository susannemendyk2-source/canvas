<template>
  <main class="polaris-shell min-h-screen px-6 py-8 text-white">
    <section class="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside class="polaris-card h-fit p-4">
        <p class="mb-4 text-xs uppercase tracking-[0.18em] text-cyan-100/55">Project Stages</p>
        <button
          v-for="stage in stages"
          :key="stage.name"
          class="mb-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition"
          :class="stage.active ? 'border-cyan-100/35 bg-cyan-100/10 text-white' : 'border-white/8 bg-white/4 text-white/55 hover:border-cyan-100/20 hover:text-white'"
        >
          <span>{{ stage.name }}</span>
          <span class="text-xs text-cyan-100/55">{{ stage.progress }}%</span>
        </button>
      </aside>

      <section class="min-w-0 space-y-5">
        <div class="polaris-card overflow-hidden">
          <div class="border-b border-cyan-100/10 p-5">
            <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">Project Command</p>
            <h1 class="mt-3 text-2xl font-semibold text-white">{{ projectTitle }}</h1>
            <p class="mt-2 text-sm leading-7 text-white/48">
              {{ t('从 Brief、参考素材、Prompt、分镜、图像输出到视频交付，集中管理项目的创作阶段。', 'Manage brief, references, prompts, storyboards, image outputs and video deliverables in one command view.') }}
            </p>
          </div>
          <div class="relative aspect-video bg-[#030814]">
            <div class="starfield absolute inset-0" />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="orbit-sphere scale-75" />
            </div>
            <button class="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-cyan-100/22 bg-black/50 px-4 py-2 text-sm text-cyan-50 backdrop-blur transition hover:border-cyan-100/45">
              <Play class="size-4" />
              {{ t('预览当前版本', 'Preview version') }}
            </button>
          </div>
          <div class="grid gap-3 border-t border-cyan-100/10 p-5 md:grid-cols-4">
            <div v-for="meta in previewMeta" :key="meta.label">
              <p class="text-xs text-white/35">{{ meta.label }}</p>
              <p class="mt-1 text-sm font-medium text-white/82">{{ meta.value }}</p>
            </div>
          </div>
        </div>

        <div class="polaris-card p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-white">{{ t('版本与活动日志', 'Version & Activity') }}</h2>
            <NuxtLink :to="`/studio?pid=${projectId}`" class="rounded-lg bg-cyan-100 px-3 py-2 text-xs font-medium text-[#061018]">{{ t('打开星图', 'Open Canvas') }}</NuxtLink>
          </div>
          <div class="space-y-3">
            <div v-for="item in activity" :key="item.title" class="rounded-lg border border-white/8 bg-white/5 p-3">
              <p class="text-sm text-white/80">{{ item.title }}</p>
              <p class="mt-1 text-xs text-white/38">{{ item.time }}</p>
            </div>
          </div>
        </div>
      </section>

      <aside class="space-y-5">
        <section class="polaris-card p-5">
          <p class="mb-4 text-xs uppercase tracking-[0.18em] text-cyan-100/55">Insights</p>
          <div class="space-y-4">
            <div v-for="insight in insights" :key="insight.label" class="flex items-center justify-between border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
              <span class="text-sm text-white/50">{{ insight.label }}</span>
              <span class="text-sm font-medium text-white">{{ insight.value }}</span>
            </div>
          </div>
        </section>

        <section class="polaris-card p-5">
          <h2 class="text-base font-semibold text-white">{{ t('协作评论', 'Collaboration') }}</h2>
          <div class="mt-4 space-y-3">
            <div class="rounded-lg border border-white/8 bg-white/5 p-3">
              <p class="text-sm text-white/75">{{ t('建议加强主光源，并统一角色服装细节。', 'Strengthen the key light and unify character wardrobe details.') }}</p>
              <p class="mt-2 text-xs text-white/35">@Creative Lead</p>
            </div>
            <textarea class="h-24 w-full resize-none rounded-lg border border-cyan-100/12 bg-black/25 p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-100/35" :placeholder="t('输入评论，或 @ 成员', 'Write a comment, or @ mention')" />
          </div>
        </section>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Play } from 'lucide-vue-next'
import { useSettingsStore } from '~/stores/settingsStore'

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const projectTitle = computed(() => t('AI 视频项目指挥舱', 'AI Video Project Command'))

const stages = computed(() => [
  { name: 'Brief', progress: 100, active: false },
  { name: 'References', progress: 85, active: false },
  { name: 'Prompt', progress: 90, active: false },
  { name: 'Storyboard', progress: 72, active: true },
  { name: 'Image Outputs', progress: 64, active: false },
  { name: 'Video Outputs', progress: 45, active: false },
  { name: 'Deliverables', progress: 20, active: false },
])

const previewMeta = computed(() => [
  { label: t('比例', 'Ratio'), value: '9:16' },
  { label: t('版本', 'Version'), value: 'v1.4' },
  { label: t('清晰度', 'Quality'), value: '1080p' },
  { label: t('阶段', 'Stage'), value: 'Storyboard' },
])

const insights = computed(() => [
  { label: t('资产总数', 'Assets'), value: '28' },
  { label: t('生成时长', 'Render Time'), value: '12m' },
  { label: t('存储占用', 'Storage'), value: '1.8GB' },
  { label: t('协作成员', 'Members'), value: '3' },
  { label: t('预计剩余', 'ETA'), value: '2h' },
])

const activity = computed(() => [
  { title: t('更新了分镜脚本 01-06', 'Updated storyboard shots 01-06'), time: '10 min ago' },
  { title: t('生成了 4 张首帧候选图', 'Generated 4 first-frame candidates'), time: '32 min ago' },
  { title: t('项目 Brief 已完成校准', 'Project brief calibrated'), time: '1 h ago' },
])

onMounted(() => settingsStore.init())
</script>
