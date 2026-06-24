<template>
  <main class="mx-auto max-w-6xl px-6 py-8">
    <section class="mb-6 flex items-center gap-4">
      <button class="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition hover:bg-white/8 hover:text-white" @click="navigateTo('/studio')">
        <ArrowLeft class="size-4" />
      </button>
      <div>
        <h1 class="text-2xl font-semibold text-white">{{ t('设置', 'Settings') }}</h1>
        <p class="mt-1 text-sm text-white/45">{{ t('管理账号、偏好和模型服务配置。', 'Manage account, preferences and model provider settings.') }}</p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside class="rounded-lg border border-white/10 bg-white/[0.04] p-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition"
          :class="activeTab === tab.id ? 'bg-cyan-100/10 text-cyan-50' : 'text-white/55 hover:bg-white/6 hover:text-white'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="size-4" />
          {{ tab.label }}
        </button>
      </aside>

      <div class="min-w-0">
        <section v-if="activeTab === 'profile'" class="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <div class="mb-6 flex items-center gap-4">
            <div class="grid size-16 place-items-center rounded-full bg-cyan-100 text-xl font-semibold text-[#061018]">{{ profileInitial }}</div>
            <div>
              <h2 class="text-base font-semibold text-white">{{ t('个人资料', 'Profile') }}</h2>
              <p class="text-sm text-white/42">{{ t('这些信息用于顶部栏、用户中心和团队协作显示。', 'Shown in the top bar, account center and collaboration views.') }}</p>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-1.5 block text-xs text-white/48">{{ t('用户名', 'Username') }}</span>
              <input v-model="form.username" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
            </label>
            <label class="block">
              <span class="mb-1.5 block text-xs text-white/48">{{ t('昵称', 'Nickname') }}</span>
              <input v-model="form.nickname" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
            </label>
            <label class="block">
              <span class="mb-1.5 block text-xs text-white/48">{{ t('邮箱', 'Email') }}</span>
              <input v-model="form.email" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
            </label>
            <label class="block">
              <span class="mb-1.5 block text-xs text-white/48">{{ t('手机', 'Phone') }}</span>
              <input v-model="form.phone" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
            </label>
          </div>

          <div class="mt-6 flex items-center gap-3">
            <button class="h-10 rounded-lg bg-cyan-100 px-5 text-sm font-medium text-[#061018] transition hover:bg-white" @click="saveProfile">{{ t('保存资料', 'Save Profile') }}</button>
            <span class="text-xs text-emerald-300/80">{{ profileSaved }}</span>
          </div>
        </section>

        <section v-if="activeTab === 'preferences'" class="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <h2 class="text-base font-semibold text-white">{{ t('偏好设置', 'Preferences') }}</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-1.5 block text-xs text-white/48">{{ t('界面语言', 'Language') }}</span>
              <select v-model="languageProxy" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60">
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </label>
            <label class="block">
              <span class="mb-1.5 block text-xs text-white/48">{{ t('主题', 'Theme') }}</span>
              <select v-model="themeProxy" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60">
                <option value="dark">{{ t('深色', 'Dark') }}</option>
                <option value="light">{{ t('浅色', 'Light') }}</option>
              </select>
            </label>
          </div>
        </section>

        <section v-if="activeTab === 'security'" class="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <h2 class="text-base font-semibold text-white">{{ t('安全', 'Security') }}</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-3">
            <input v-model="password.old" type="password" :placeholder="t('当前密码', 'Current password')" class="h-11 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
            <input v-model="password.next" type="password" :placeholder="t('新密码', 'New password')" class="h-11 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
            <input v-model="password.confirm" type="password" :placeholder="t('确认新密码', 'Confirm password')" class="h-11 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
          </div>
          <p class="mt-3 text-xs text-white/35">{{ t('后端密码修改接口接入后，此处可以直接提交真实变更。', 'This form is ready to connect to the backend password update endpoint.') }}</p>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ArrowLeft, Languages, Lock, UserRound } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/authStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const activeTab = ref<'profile' | 'preferences' | 'security'>('profile')
const profileSaved = ref('')
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const form = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
})

const password = reactive({
  old: '',
  next: '',
  confirm: '',
})

const tabs = computed(() => [
  { id: 'profile', label: t('个人资料', 'Profile'), icon: UserRound },
  { id: 'preferences', label: t('偏好', 'Preferences'), icon: Languages },

  { id: 'security', label: t('安全', 'Security'), icon: Lock },
])

const profileInitial = computed(() => (form.nickname || form.username || 'P').charAt(0).toUpperCase())

const languageProxy = computed({
  get: () => settingsStore.language,
  set: (value: 'zh' | 'en') => settingsStore.setLanguage(value),
})

const themeProxy = computed({
  get: () => settingsStore.theme,
  set: (value: 'dark' | 'light') => {
    if (settingsStore.theme !== value) settingsStore.toggleTheme()
    if (import.meta.client) document.documentElement.classList.toggle('light', value === 'light')
  },
})

onMounted(() => {
  settingsStore.init()
  authStore.init()
  Object.assign(form, {
    username: authStore.user?.username || '',
    nickname: authStore.user?.nickname || '',
    email: authStore.user?.email || '',
    phone: authStore.user?.phone || '',
  })
})

function saveProfile() {
  authStore.user = { ...(authStore.user || {}), ...form }
  if (import.meta.client) localStorage.setItem('polaris.user', JSON.stringify(authStore.user))
  profileSaved.value = t('已保存', 'Saved')
  window.setTimeout(() => (profileSaved.value = ''), 1800)
}

</script>
