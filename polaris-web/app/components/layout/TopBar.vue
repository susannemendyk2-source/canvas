<template>
  <header class="fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-cyan-100/10 bg-[#04070d]/95 px-4 backdrop-blur-xl">
    <div class="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div class="flex min-w-0 items-center gap-3">
        <button class="flex items-center gap-3" @click="navigateTo('/')">
          <Compass class="size-5 text-studio-cyan" />
          <span class="text-sm font-semibold text-white">Polaris</span>
        </button>
        <span class="truncate text-sm text-white/45">{{ workspaceStore.projectName }}</span>
        <FloatingButton :title="t('保存', 'Save')" :disabled="canvasStore.saving" @click="handleSave">
          <Save v-if="!canvasStore.saving" class="size-3.5" />
          <span v-else class="inline-block size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        </FloatingButton>
        <span v-if="lastSaved" class="animate-fade-in text-[11px]" :class="lastSavedError ? 'text-red-400' : 'text-cyan-100/60'">{{ lastSaved }}</span>
      </div>

      <div class="flex items-center gap-1 rounded-lg bg-black/30 p-0.5">
        <button class="rounded-md px-3 py-1.5 text-xs font-medium transition" :class="workspaceStore.mode === 'magic' ? 'bg-cyan-300/18 text-cyan-50 shadow-glow' : 'text-white/55 hover:text-white/80'" @click="workspaceStore.setMode('magic')">
          {{ t('星图画布', 'Star Map') }}
        </button>
        <button class="rounded-md px-3 py-1.5 text-xs font-medium transition" :class="workspaceStore.mode === 'workflow' ? 'bg-cyan-300/18 text-cyan-50 shadow-glow' : 'text-white/55 hover:text-white/80'" @click="workspaceStore.setMode('workflow')">
          {{ t('节点工作流', 'Workflow') }}
        </button>
      </div>

      <div class="flex items-center justify-end gap-2">
        <button class="flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-white/62 transition hover:border-cyan-200/30 hover:text-cyan-50" @click="navigateTo('/credits')">
          <Crown class="size-3 text-cyan-100" />
          {{ authStore.credits.toLocaleString() }}
        </button>
        <FloatingButton :title="t('语言', 'Language')" @click="settingsStore.toggleLanguage()">
          <Globe class="size-3.5" />
          {{ settingsStore.language.toUpperCase() }}
        </FloatingButton>
        <FloatingButton :title="t('主题', 'Theme')" @click="themeToggle">
          <Sun v-if="settingsStore.theme === 'light'" class="size-3.5" />
          <Moon v-else class="size-3.5" />
        </FloatingButton>
        <FloatingButton :title="t('设置', 'Settings')" @click="navigateTo('/settings')">
          <Settings class="size-3.5" />
        </FloatingButton>
        <FloatingButton :title="t('分享', 'Share')">
          <Share2 class="size-3.5" />
        </FloatingButton>
        <FloatingButton :title="t('侧栏', 'Panel')" @click="settingsStore.showPanel = !settingsStore.showPanel">
          <PanelRight class="size-3.5" />
        </FloatingButton>
        <FloatingButton :title="t('历史', 'History')" @click="settingsStore.toggleHistory()">
          <Clock class="size-3.5" />
        </FloatingButton>
        <FloatingButton :title="t('通知', 'Notifications')">
          <Bell class="size-3.5" />
        </FloatingButton>

        <div ref="avatarRef" class="relative">
          <button class="size-8 rounded-full bg-gradient-to-br from-studio-cyan to-studio-violet text-xs font-bold text-white" @click.stop="toggleMenu">
            {{ userInitial }}
          </button>
          <Teleport to="body">
            <div v-if="menuOpen" class="fixed z-[999] w-52 rounded-xl border border-white/10 bg-[#11131a]/95 py-1 shadow-glass backdrop-blur-xl" :style="{ top: `${menuTop}px`, left: `${menuLeft}px` }" @click.stop>
              <div class="border-b border-white/8 px-4 py-3">
                <p class="text-sm font-medium text-white">{{ userName }}</p>
                <p class="text-xs text-white/45">{{ userRole }}</p>
              </div>
              <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" @click="navigateMenu('/settings')">
                <User class="size-4" /> {{ t('个人中心', 'Profile') }}
              </button>
              <button v-if="isAdmin" class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" @click="navigateMenu('/admin/dashboard')">
                <Shield class="size-4" /> {{ t('管理后台', 'Admin') }}
              </button>
              <div class="border-t border-white/8">
                <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-300/80 transition hover:bg-white/8" @click="authStore.logout()">
                  <LogOut class="size-4" /> {{ t('退出登录', 'Logout') }}
                </button>
              </div>
            </div>
          </Teleport>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell, Clock, Compass, Crown, Globe, LogOut, Moon, PanelRight, Save, Settings, Share2, Shield, Sun, User } from 'lucide-vue-next'
import FloatingButton from '~/components/ui/FloatingButton.vue'
import { useAuthStore } from '~/stores/authStore'
import { useCanvasStore } from '~/stores/canvasStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useWorkspaceStore } from '~/stores/workspaceStore'

const authStore = useAuthStore()
const canvasStore = useCanvasStore()
const settingsStore = useSettingsStore()
const workspaceStore = useWorkspaceStore()
const menuOpen = ref(false)
const avatarRef = ref<HTMLElement>()
const menuTop = ref(0)
const menuLeft = ref(0)
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const userName = computed(() => authStore.user?.nickname || authStore.user?.username || 'Polaris')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
const userRole = computed(() => {
  const savedRole = import.meta.client ? localStorage.getItem('polaris.role') : ''
  return (authStore.roles[0] || savedRole || 'USER').replace(/^ROLE_/, '')
})
const isAdmin = computed(() => ['ADMIN', 'SUPER_ADMIN'].includes(userRole.value))

onMounted(() => {
  settingsStore.init()
  document.documentElement.classList.toggle('light', settingsStore.theme === 'light')
  document.addEventListener('click', closeMenu)
})

function toggleMenu() {
  const el = avatarRef.value?.querySelector('button')
  if (el) {
    const rect = el.getBoundingClientRect()
    menuTop.value = rect.bottom + 6
    menuLeft.value = Math.max(8, rect.left - 160 + rect.width / 2)
  }
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function navigateMenu(path: string) {
  menuOpen.value = false
  navigateTo(path)
}

const lastSaved = ref('')
const lastSavedError = ref(false)

async function handleSave() {
  lastSavedError.value = false
  await canvasStore.saveAll()
  if (canvasStore.error) {
    lastSaved.value = t('保存失败', 'Save failed')
    lastSavedError.value = true
  } else {
    lastSaved.value = t('已保存', 'Saved')
    lastSavedError.value = false
  }
  setTimeout(() => { lastSaved.value = '' }, 2500)
}

function themeToggle() {
  settingsStore.toggleTheme()
  document.documentElement.classList.toggle('light', settingsStore.theme === 'light')
}

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.25s ease-out;
}
</style>
