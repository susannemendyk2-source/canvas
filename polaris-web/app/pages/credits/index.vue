<template>
  <main class="mx-auto max-w-6xl px-6 py-8">
    <section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">{{ t('账户中心', 'Account') }}</p>
        <h1 class="mt-2 text-2xl font-semibold text-white">{{ t('星尘积分', 'Credits') }}</h1>
        <p class="mt-1 text-sm text-white/45">{{ t('用于生成图片、视频、分镜和工作流任务。', 'Used for image, video, storyboard and workflow generation.') }}</p>
      </div>
      <NuxtLink to="/studio" class="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white">
        <Sparkles class="size-4" />
        {{ t('回到画布', 'Back to Studio') }}
      </NuxtLink>
    </section>

    <section class="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm text-white/45">{{ t('当前余额', 'Current Balance') }}</p>
            <p class="mt-3 text-5xl font-semibold text-cyan-50">{{ authStore.credits.toLocaleString() }}</p>
          </div>
          <div class="grid size-16 place-items-center rounded-full border border-cyan-100/20 bg-cyan-100/10 text-cyan-100">
            <Crown class="size-7" />
          </div>
        </div>
        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <button class="h-10 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white" @click="addDemoCredits(500)">
            {{ t('测试增加 500', 'Add 500 Demo') }}
          </button>
          <button class="h-10 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white" @click="spendDemoCredits(40)">
            {{ t('模拟图片生成', 'Simulate Image') }}
          </button>
          <button class="h-10 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white" @click="spendDemoCredits(120)">
            {{ t('模拟视频生成', 'Simulate Video') }}
          </button>
        </div>
      </div>

      <div class="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <h2 class="text-sm font-semibold text-white">{{ t('消耗规则', 'Usage Cost') }}</h2>
        <div class="mt-4 space-y-3">
          <div v-for="item in costs" :key="item.name" class="flex items-center justify-between rounded-md border border-white/8 bg-black/20 px-3 py-2">
            <span class="text-sm text-white/72">{{ item.name }}</span>
            <span class="text-sm font-medium text-cyan-100">{{ item.cost }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <div class="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <h2 class="text-sm font-semibold text-white">{{ t('积分流水', 'Credit Log') }}</h2>
        <button class="text-xs text-white/45 transition hover:text-white" @click="clearLogs">{{ t('清空本地记录', 'Clear Local Log') }}</button>
      </div>

      <div v-if="logs.length === 0" class="flex flex-col items-center justify-center py-16 text-white/35">
        <Coins class="mb-3 size-10" />
        <p class="text-sm">{{ t('暂无记录', 'No records yet') }}</p>
      </div>

      <div v-for="log in logs" :key="log.id" class="flex items-center justify-between border-b border-white/5 px-5 py-4 last:border-b-0">
        <div class="flex min-w-0 items-center gap-3">
          <div :class="['grid size-9 shrink-0 place-items-center rounded-full', log.amount > 0 ? 'bg-emerald-500/12 text-emerald-300' : 'bg-amber-500/12 text-amber-300']">
            <Plus v-if="log.amount > 0" class="size-4" />
            <Minus v-else class="size-4" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-white">{{ log.remark }}</p>
            <p class="text-xs text-white/35">{{ log.createdAt }}</p>
          </div>
        </div>
        <div class="text-right">
          <p :class="['text-sm font-semibold', log.amount > 0 ? 'text-emerald-300' : 'text-amber-300']">{{ log.amount > 0 ? `+${log.amount}` : log.amount }}</p>
          <p class="text-xs text-white/35">{{ t('余额', 'Balance') }} {{ log.balance }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Coins, Crown, Minus, Plus, Sparkles } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/authStore'
import { useSettingsStore } from '~/stores/settingsStore'

interface CreditLog {
  id: string
  amount: number
  balance: number
  remark: string
  createdAt: string
}

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const logs = ref<CreditLog[]>([])
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const costs = computed(() => [
  { name: t('图片生成', 'Image generation'), cost: '40' },
  { name: t('分镜生成', 'Storyboard generation'), cost: '80' },
  { name: t('视频生成', 'Video generation'), cost: '120' },
  { name: t('工作流运行', 'Workflow run'), cost: '160' },
])

onMounted(() => {
  settingsStore.init()
  authStore.init()
  loadLogs()
})

function loadLogs() {
  if (!import.meta.client) return
  try {
    logs.value = JSON.parse(localStorage.getItem('polaris.creditLogs') || '[]')
  } catch {
    logs.value = []
  }
}

function persistLogs() {
  if (import.meta.client) localStorage.setItem('polaris.creditLogs', JSON.stringify(logs.value.slice(0, 30)))
}

function pushLog(amount: number, remark: string) {
  logs.value.unshift({
    id: crypto.randomUUID(),
    amount,
    balance: authStore.credits,
    remark,
    createdAt: new Date().toLocaleString(),
  })
  persistLogs()
}

function addDemoCredits(amount: number) {
  authStore.addCredits(amount)
  pushLog(amount, t('测试积分入账', 'Demo credit grant'))
}

function spendDemoCredits(amount: number) {
  authStore.spendCredits(amount)
  pushLog(-amount, amount === 40 ? t('图片生成扣费', 'Image generation charge') : t('视频生成扣费', 'Video generation charge'))
}

function clearLogs() {
  logs.value = []
  persistLogs()
}
</script>
