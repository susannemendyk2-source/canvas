<template>
  <main class="mx-auto max-w-7xl px-6 py-8">
    <section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">{{ t('管理后台', 'Admin Console') }}</p>
        <h1 class="mt-2 text-2xl font-semibold text-white">{{ t('用户与积分', 'Users and Credits') }}</h1>
        <p class="mt-1 text-sm text-white/45">{{ t('管理账号状态、角色标识和积分余额。', 'Manage account status, role labels and credit balances.') }}</p>
      </div>
      <NuxtLink to="/admin/dashboard" class="rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">{{ t('返回概览', 'Back to Overview') }}</NuxtLink>
    </section>

    <section class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <label class="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">
        <Search class="size-4" />
        <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" :placeholder="t('搜索用户名或邮箱', 'Search username or email')" />
      </label>
      <button class="h-10 rounded-lg border border-white/10 bg-white/6 px-4 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white" @click="loadUsers">
        {{ t('刷新', 'Refresh') }}
      </button>
    </section>

    <section class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[920px] text-sm">
          <thead>
            <tr class="border-b border-white/8 text-left text-xs text-white/45">
              <th class="px-4 py-3 font-medium">ID</th>
              <th class="px-4 py-3 font-medium">{{ t('用户', 'User') }}</th>
              <th class="px-4 py-3 font-medium">{{ t('邮箱', 'Email') }}</th>
              <th class="px-4 py-3 font-medium">{{ t('状态', 'Status') }}</th>
              <th class="px-4 py-3 font-medium">{{ t('积分', 'Credits') }}</th>
              <th class="px-4 py-3 font-medium">{{ t('角色', 'Roles') }}</th>
              <th class="px-4 py-3 font-medium">{{ t('创建时间', 'Created') }}</th>
              <th class="px-4 py-3 font-medium">{{ t('操作', 'Actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-10 text-center text-white/35">{{ t('加载中...', 'Loading...') }}</td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="8" class="px-4 py-10 text-center text-white/35">{{ t('暂无用户', 'No users found') }}</td>
            </tr>
            <tr v-for="user in filteredUsers" v-else :key="user.id" class="border-b border-white/5 transition hover:bg-white/5">
              <td class="px-4 py-3 text-white/55">{{ user.id }}</td>
              <td class="px-4 py-3">
                <p class="font-medium text-white">{{ user.nickname || user.username }}</p>
                <p class="text-xs text-white/35">{{ user.username }}</p>
              </td>
              <td class="px-4 py-3 text-white/60">{{ user.email || '-' }}</td>
              <td class="px-4 py-3">
                <span :class="['rounded-full px-2 py-0.5 text-[11px]', normalizedStatus(user) === 1 ? 'bg-emerald-500/12 text-emerald-300' : 'bg-white/8 text-white/45']">
                  {{ normalizedStatus(user) === 1 ? t('启用', 'Active') : t('禁用', 'Disabled') }}
                </span>
              </td>
              <td class="px-4 py-3 font-medium text-cyan-50">{{ Number(user.credits || 0).toLocaleString() }}</td>
              <td class="px-4 py-3 text-white/60">{{ roleText(user) }}</td>
              <td class="px-4 py-3 text-xs text-white/40">{{ user.createdAt || '-' }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-2">
                  <button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/62 hover:text-white" @click="toggleStatus(user)">
                    {{ normalizedStatus(user) === 1 ? t('禁用', 'Disable') : t('启用', 'Enable') }}
                  </button>
                  <button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/62 hover:text-white" @click="openCreditDialog(user)">
                    {{ t('调整积分', 'Credits') }}
                  </button>
                  <button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/62 hover:text-white" @click="openApiDialog(user)">
                    <KeyRound class="mr-1 inline size-3" />API
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="creditDialog.user" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div class="w-full max-w-sm rounded-lg border border-white/10 bg-[#10131a] p-5 shadow-glass">
          <h2 class="text-base font-semibold text-white">{{ t('调整积分', 'Adjust Credits') }}</h2>
          <p class="mt-1 text-sm text-white/45">{{ creditDialog.user.username }}</p>
          <input v-model.number="creditDialog.amount" type="number" class="mt-4 h-11 w-full rounded-lg border border-white/8 bg-black/50 px-3 text-sm text-white outline-none focus:border-cyan-400/60" :placeholder="t('输入正数或负数', 'Positive or negative amount')" />
          <input v-model="creditDialog.remark" class="mt-3 h-11 w-full rounded-lg border border-white/8 bg-black/50 px-3 text-sm text-white outline-none focus:border-cyan-400/60" :placeholder="t('备注', 'Remark')" />
          <div class="mt-5 flex justify-end gap-3">
            <button class="h-10 rounded-lg border border-white/10 bg-white/6 px-4 text-sm text-white/72" @click="closeCreditDialog">{{ t('取消', 'Cancel') }}</button>
            <button class="h-10 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018]" @click="submitCredits">{{ t('确认', 'Confirm') }}</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="apiDialog.user" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" @click.self="apiDialog.user = null">
        <div class="w-full max-w-lg rounded-lg border border-white/10 bg-[#10131a] p-5 shadow-glass">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-white">{{ t('API 配置', 'API Config') }} — {{ apiDialog.user?.username }}</h2>
            <button class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white" @click="apiDialog.user = null">
              <X class="size-4" />
            </button>
          </div>

          <div class="mb-4 flex gap-1 rounded-lg bg-black/20 p-1">
            <button v-for="tab in apiTabs" :key="tab.key" class="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"
              :class="apiActiveTab === tab.key ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/55 hover:text-white/80'"
              @click="apiActiveTab = tab.key">
              {{ tab.label }}
            </button>
          </div>

          <div class="space-y-3">
            <label class="block">
              <span class="mb-1 block text-xs text-white/55">Base URL</span>
              <input v-model="apiForm.baseUrl" class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50" />
            </label>
            <label class="block">
              <span class="mb-1 block text-xs text-white/55">Model</span>
              <input v-model="apiForm.model" class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50" />
            </label>
            <label class="block">
              <span class="mb-1 block text-xs text-white/55">API Key</span>
              <div class="relative">
                <input v-model="apiForm.apiKey" :type="apiShowKey ? 'text' : 'password'" class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 pr-9 text-sm text-white/80 outline-none focus:border-cyan-300/50" />
                <button class="absolute right-2 top-1/2 -translate-y-1/2 text-white/38 hover:text-white/72" @click="apiShowKey = !apiShowKey">
                  <component :is="apiShowKey ? EyeOff : Eye" class="size-3.5" />
                </button>
              </div>
            </label>
          </div>

          <div class="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
            <button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white" @click="saveApiConfig">
              <Save class="mr-1.5 inline size-3.5" />{{ t('保存', 'Save') }}
            </button>
            <span v-if="apiMsg" class="text-xs" :class="apiMsgError ? 'text-red-400' : 'text-emerald-300'">{{ apiMsg }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { Eye, EyeOff, KeyRound, Save, Search, X } from 'lucide-vue-next'
import { adminService } from '~/services/adminService'
import { useSettingsStore } from '~/stores/settingsStore'
import { providerKeyFor } from '~/services/aiService'

interface AdminUser {
  id: number
  username: string
  nickname?: string
  email?: string
  status?: number | string
  credits?: number
  roles?: string | string[]
  roleNames?: string[]
  createdAt?: string
}

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const searchQuery = ref('')
const users = ref<AdminUser[]>([])
const loading = ref(false)
const creditDialog = reactive<{ user: AdminUser | null; amount: number; remark: string }>({
  user: null,
  amount: 0,
  remark: '',
})

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((user) => `${user.username} ${user.nickname || ''} ${user.email || ''}`.toLowerCase().includes(q))
})

onMounted(() => {
  settingsStore.init()
  loadUsers()
})

async function loadUsers() {
  loading.value = true
  try {
    const res: any = await adminService.listUsers({})
    users.value = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || []
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

function normalizedStatus(user: AdminUser) {
  return user.status === 0 || user.status === 'DISABLED' ? 0 : 1
}

function roleText(user: AdminUser) {
  const value = user.roleNames || user.roles
  return Array.isArray(value) ? value.join(', ') : value || 'USER'
}

async function toggleStatus(user: AdminUser) {
  const next = normalizedStatus(user) === 1 ? 0 : 1
  try {
    await adminService.updateUserStatus(user.id, next)
  } catch {}
  user.status = next
}

function openCreditDialog(user: AdminUser) {
  creditDialog.user = user
  creditDialog.amount = 0
  creditDialog.remark = t('管理员调整', 'Admin adjustment')
}

function closeCreditDialog() {
  creditDialog.user = null
}

async function submitCredits() {
  if (!creditDialog.user || !Number.isFinite(Number(creditDialog.amount)) || Number(creditDialog.amount) === 0) return
  const amount = Number(creditDialog.amount)
  try {
    await adminService.updateUserCredits(creditDialog.user.id, amount, creditDialog.remark)
  } catch {}
  creditDialog.user.credits = Number(creditDialog.user.credits || 0) + amount
  closeCreditDialog()
}

// ========== API Config Dialog ==========
const apiDialog = reactive<{ user: AdminUser | null }>({ user: null })
const apiActiveTab = ref<'chat' | 'image' | 'video'>('chat')
const apiShowKey = ref(false)
const apiMsg = ref('')
const apiMsgError = ref(false)
const apiForm = reactive({ provider: '', baseUrl: '', apiKey: '', model: '' })

const apiTabs = computed(() => [
  { key: 'chat', label: t('Chat', 'Chat') },
  { key: 'image', label: t('图像', 'Image') },
  { key: 'video', label: t('视频', 'Video') },
])

function openApiDialog(user: AdminUser) {
  apiDialog.user = user
  apiMsg.value = ''
  apiForm.provider = ''
  apiForm.baseUrl = ''
  apiForm.apiKey = ''
  apiForm.model = ''
  apiActiveTab.value = 'chat'
  loadUserProviders(user.id)
}

async function loadUserProviders(userId: number) {
  try {
    const res: any = await adminService.getUserProviders(userId)
    const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
    const active = apiActiveTab.value
    const key = active === 'chat' ? 'chat' : active === 'image' ? 'image-openai' : 'video-default'
    const found = list.find((p: any) => p.provider === key || p.provider?.startsWith(active === 'image' ? 'image-' : 'video-'))
    if (found) {
      apiForm.baseUrl = found.baseUrl || ''
      apiForm.apiKey = found.apiKey || ''
      apiForm.model = found.model || ''
    }
  } catch {}
}

watch(apiActiveTab, () => {
  apiMsg.value = ''
  if (apiDialog.user) loadUserProviders(apiDialog.user.id)
})

async function saveApiConfig() {
  const user = apiDialog.user
  if (!user) return
  const active = apiActiveTab.value
  const dbProvider = active === 'chat' ? 'chat' : providerKeyFor(active, apiForm.provider || 'openai')
  apiMsg.value = ''
  try {
    await adminService.saveUserProvider(user.id, {
      provider: dbProvider,
      baseUrl: apiForm.baseUrl,
      apiKey: apiForm.apiKey,
      model: apiForm.model,
    })
    apiMsg.value = t('已保存', 'Saved')
    apiMsgError.value = false
  } catch (err: any) {
    apiMsg.value = err?.response?.data?.message || err?.message || t('保存失败', 'Save failed')
    apiMsgError.value = true
  }
}
</script>
