<template>
  <header class="fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-cyan-100/10 bg-[#030814]/94 px-4 backdrop-blur-xl">
    <div class="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div class="flex min-w-0 items-center gap-3">
        <button class="flex items-center gap-3" @click="navigateTo('/')">
          <span class="grid size-8 place-items-center overflow-hidden rounded-full border border-cyan-100/20 bg-cyan-100/8">
            <img src="/brand/polaris-logo.png" alt="Polaris" class="size-8 scale-[2.5] object-cover" />
          </span>
          <span class="hidden text-sm font-semibold text-white sm:inline">Polaris</span>
          <span class="hidden text-[10px] uppercase tracking-[0.18em] text-cyan-100/48 md:inline">AI Creation OS</span>
        </button>
        <div v-if="!renaming" class="group flex min-w-0 items-center gap-1.5">
          <span class="cursor-pointer truncate text-sm text-white/48" @dblclick="startRename">{{ workspaceStore.projectName }}</span>
          <Pencil class="size-3 text-white/25 opacity-0 transition group-hover:opacity-100" />
        </div>
        <div v-else class="flex items-center gap-1">
          <input ref="renameInput" v-model="renameValue" class="h-7 w-40 rounded-md border border-cyan-400/40 bg-black/60 px-2 text-sm text-white outline-none" @keydown.enter="doRename" @keydown.escape="renaming = false" @blur="doRename" />
        </div>
      </div>

      <div class="flex items-center gap-1 rounded-xl border border-cyan-100/10 bg-black/30 p-0.5">
        <button class="rounded-lg px-3 py-1.5 text-xs font-medium transition" :class="workspaceStore.mode === 'magic' ? 'bg-cyan-300/18 text-cyan-50 shadow-glow' : 'text-white/55 hover:text-white/80'" @click="workspaceStore.setMode('magic')">
          {{ t('星图画布', 'Star Map') }}
        </button>
        <button class="rounded-lg px-3 py-1.5 text-xs font-medium transition" :class="workspaceStore.mode === 'workflow' ? 'bg-cyan-300/18 text-cyan-50 shadow-glow' : 'text-white/55 hover:text-white/80'" @click="workspaceStore.setMode('workflow')">
          {{ t('节点工作流', 'Workflow') }}
        </button>
      </div>

      <div class="flex items-center justify-end gap-2">
        <button class="flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-white/62 transition hover:border-cyan-200/30 hover:text-cyan-50" @click="navigateTo('/credits')">
          <Crown class="size-3 text-[#c7a76b]" />
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
        <FloatingButton :title="t('分享', 'Share')">
          <Share2 class="size-3.5" />
        </FloatingButton>
        <FloatingButton :title="t('右侧面板', 'Panel')" @click="settingsStore.showPanel = !settingsStore.showPanel">
          <PanelRight class="size-3.5" />
        </FloatingButton>
        <FloatingButton :title="t('历史', 'History')" @click="settingsStore.toggleHistory()">
          <Clock class="size-3.5" />
        </FloatingButton>
        <FloatingButton :title="t('通知', 'Notifications')">
          <Bell class="size-3.5" />
        </FloatingButton>

        <div ref="avatarRef" class="relative">
          <button class="size-8 overflow-hidden rounded-full bg-gradient-to-br from-cyan-100 to-blue-500 text-xs font-bold text-[#061018]" @click.stop="toggleMenu">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="size-full object-cover" />
            <span v-else>{{ userInitial }}</span>
          </button>
          <Teleport to="body">
            <div v-if="menuOpen" class="fixed z-[999] w-52 rounded-xl border border-cyan-100/12 bg-[#07111f]/95 py-1 shadow-glass backdrop-blur-xl" :style="{ top: `${menuTop}px`, left: `${menuLeft}px` }" @click.stop>
              <div class="border-b border-white/8 px-4 py-3">
                <p class="text-sm font-medium text-white">{{ userName }}</p>
                <p class="text-xs text-white/45">{{ userRole }}</p>
              </div>
              <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" @click="navigateMenu('/profile')">
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
import { Bell, Clock, Crown, Globe, LogOut, Moon, PanelRight, Pencil, Share2, Shield, Sun, User } from 'lucide-vue-next'
import FloatingButton from '~/components/ui/FloatingButton.vue'
import { useAuthStore } from '~/stores/authStore'
import { useCanvasStore } from '~/stores/canvasStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useWorkspaceStore } from '~/stores/workspaceStore'
import { projectService } from '~/services/projectService'

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

function themeToggle() {
  settingsStore.toggleTheme()
  document.documentElement.classList.toggle('light', settingsStore.theme === 'light')
}

const renaming = ref(false)
const renameValue = ref('')
const renameInput = ref<HTMLInputElement>()

function startRename() {
  renameValue.value = workspaceStore.projectName
  renaming.value = true
  nextTick(() => renameInput.value?.select())
}

async function doRename() {
  renaming.value = false
  const name = renameValue.value.trim()
  if (!name || name === workspaceStore.projectName) return
  workspaceStore.setProjectName(name)
  const projectId = canvasStore.activeProjectId
  if (projectId) {
    try {
      await projectService.update(projectId, { name })
    } catch {}
  }
}

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>
