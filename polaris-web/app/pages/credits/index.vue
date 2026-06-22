<template>
  <div class="mx-auto max-w-4xl p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold">星尘点数 / Credits</h1>
      <p class="mt-1 text-sm text-white/45">你的创作燃料 / Your creative fuel</p>
    </div>

    <div class="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-800/10 p-8 text-center">
      <p class="text-sm text-white/45">当前余额 / Current Balance</p>
      <p class="mt-2 text-5xl font-bold text-cyan-100">{{ balance.toLocaleString() }}</p>
      <p class="mt-4 text-xs text-white/35">星尘币 / Credits</p>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5">
      <div class="border-b border-white/8 px-6 py-4">
        <h2 class="text-sm font-semibold">消费记录 / Credit Log</h2>
      </div>

      <div v-if="logs.length === 0" class="flex flex-col items-center justify-center py-16 text-white/35">
        <Coins class="mb-3 size-10" />
        <p class="text-sm">暂无记录 / No records yet</p>
      </div>

      <div v-for="(log, index) in logs" :key="log.id || index" class="flex items-center justify-between border-b border-white/5 px-6 py-4 last:border-b-0">
        <div class="flex items-center gap-3">
          <div :class="['grid size-9 place-items-center rounded-full', log.amount > 0 ? 'bg-emerald-500/12 text-emerald-300' : 'bg-amber-500/12 text-amber-300']">
            <Plus v-if="log.amount > 0" class="size-4" />
            <Minus v-else class="size-4" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ log.remark || log.type || '操作' }}</p>
            <p class="text-xs text-white/35">{{ log.createdAt || log.date }}</p>
          </div>
        </div>
        <div class="text-right">
          <p :class="['text-sm font-semibold', log.amount > 0 ? 'text-emerald-300' : 'text-amber-300']">
            {{ log.amount > 0 ? `+${log.amount}` : log.amount }}
          </p>
          <p class="text-xs text-white/35">余额 {{ log.balance }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Coins, Plus, Minus } from 'lucide-vue-next'

const balance = ref(3520)

interface CreditLog {
  id?: string
  amount: number
  balance: number
  type: string
  remark?: string
  createdAt?: string
  date?: string
}

const logs = ref<CreditLog[]>([])

onMounted(async () => {
  try {
    const { adminService } = await import('~/services/adminService')
    const res: any = await adminService.statsCredits()
    const data = res.data || res
    if (data.logs) logs.value = data.logs
    if (data.balance !== undefined) balance.value = data.balance
  } catch {
    logs.value = [
      { amount: 500, balance: 3520, type: '充值', remark: '充值500星尘币', createdAt: '2026-06-20 14:30:00' },
      { amount: -50, balance: 3020, type: '消费', remark: '图片生成消费', createdAt: '2026-06-19 10:15:00' },
      { amount: -120, balance: 3070, type: '消费', remark: '视频生成消费', createdAt: '2026-06-18 16:42:00' },
    ]
  }
})
</script>
