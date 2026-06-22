<template>
  <header class="fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-cyan-100/10 bg-[#04070d]/95 px-4 backdrop-blur-xl">
    <div class="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-3" @click="navigateTo('/')">
          <Compass class="size-5 text-studio-cyan" />
          <span class="text-sm font-semibold text-white">Polaris</span>
        </button>
        <span class="text-sm text-white/45">{{ workspaceStore.projectName }}</span>
        <FloatingButton title="Save" @click="handleSave">
          <Save class="size-3.5" />
        </FloatingButton>
      </div>

      <div class="flex items-center gap-1 rounded-lg bg-black/30 p-0.5">
        <button
          class="rounded-md px-3 py-1.5 text-xs font-medium transition"
          :class="workspaceStore.mode === 'magic' ? 'bg-cyan-300/18 text-cyan-50 shadow-glow' : 'text-white/55 hover:text-white/80'"
          @click="workspaceStore.setMode('magic')"
        >
          星图画布/Star Map
        </button>
        <button
          class="rounded-md px-3 py-1.5 text-xs font-medium transition"
          :class="workspaceStore.mode === 'workflow' ? 'bg-cyan-300/18 text-cyan-50 shadow-glow' : 'text-white/55 hover:text-white/80'"
          @click="workspaceStore.setMode('workflow')"
        >
          节点工作流 / Workflow
        </button>
      </div>

      <div class="flex items-center justify-end gap-2">
        <span class="flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-white/45">
          <Crown class="size-3 text-cyan-100" />
          {{ credits }}
        </span>
        <FloatingButton title="中 / EN" @click="settingsStore.toggleLanguage()">
          <Globe class="size-3.5" />
        </FloatingButton>
        <FloatingButton title="切换主题 / Theme" @click="themeToggle">
          <Sun v-if="theme === 'light'" class="size-3.5" />
          <Moon v-else class="size-3.5" />
        </FloatingButton>
        <FloatingButton title="设置 / Settings" @click="settingsStore.toggleSettings()">
          <Settings class="size-3.5" />
        </FloatingButton>
        <FloatingButton title="分享 / Share">
          <Share2 class="size-3.5" />
        </FloatingButton>
        <FloatingButton title="侧栏 / Panel" @click="panelToggle">
          <PanelRight class="size-3.5" />
        </FloatingButton>
        <FloatingButton title="历史 / History" @click="settingsStore.toggleHistory()">
          <Clock class="size-3.5" />
        </FloatingButton>
        <FloatingButton title="通知 / Notifications">
          <Bell class="size-3.5" />
        </FloatingButton>
        <div class="relative" ref="avatarRef">
          <button
            class="size-8 rounded-full bg-gradient-to-br from-studio-cyan to-studio-violet text-xs font-bold text-white"
            @click.stop="toggleMenu"
          >
            {{ userInitial }}
          </button>
          <Teleport to="body">
            <div
              v-if="menuOpen"
              class="fixed z-[999] w-52 rounded-xl border border-white/10 bg-[#11131a]/95 py-1 shadow-glass backdrop-blur-xl"
              :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
              @click.stop
            >
              <div class="border-b border-white/8 px-4 py-3">
                <p class="text-sm font-medium text-white">{{ userName }}</p>
                <p class="text-xs text-white/45">{{ userRole === 'ADMIN' ? '管理员 / Admin' : '用户 / User' }}</p>
              </div>
              <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" @click="goProfile">
                <User class="size-4" /> 个人中心 / Profile
              </button>
              <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" @click="goSettings">
                <Settings class="size-4" /> 设置 / Settings
              </button>
              <button v-if="userRole === 'ADMIN'" class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" @click="goAdmin">
                <Shield class="size-4" /> 管理后台 / Admin
              </button>
              <div class="border-t border-white/8">
                <button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-300/80 transition hover:bg-white/8" @click="handleLogout">
                  <LogOut class="size-4" /> 退出登录 / Logout
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Compass, Save, Globe, Settings, Share2, Clock, Bell, User, Shield, LogOut, Crown, Moon, Sun, PanelRight } from 'lucide-vue-next'
import FloatingButton from '~/components/ui/FloatingButton.vue'
import { useWorkspaceStore } from '~/stores/workspaceStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useCanvasStore } from '~/stores/canvasStore'

const workspaceStore = useWorkspaceStore()
const settingsStore = useSettingsStore()
const canvasStore = useCanvasStore()
const menuOpen = ref(false)
const avatarRef = ref<HTMLElement>()
const menuTop = ref(0)
const menuLeft = ref(0)

const userName = ref('Polaris')
const userRole = ref('USER')
const theme = ref('dark')
const credits = ref(2480)
const panelOpen = ref(false)

const userInitial = computed(() => {
  const name = userName.value || 'Polaris'
  return name.charAt(0).toUpperCase()
})

onMounted(() => {
  if (import.meta.client) {
    try {
      const raw = localStorage.getItem('polaris.user')
      if (raw) {
        const u = JSON.parse(raw)
        userName.value = u.nickname || u.username || 'Polaris'
      }
      const r = localStorage.getItem('polaris.role')
      if (r) userRole.value = r
    } catch {
      // ignore
    }
    document.addEventListener('click', closeMenu)
  }
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

async function handleSave() {
  await canvasStore.saveAll()
}

function goProfile() {
  menuOpen.value = false
  navigateTo('/settings')
}

function goSettings() {
  menuOpen.value = false
  navigateTo('/settings')
}

function goAdmin() {
  menuOpen.value = false
  navigateTo('/admin/dashboard')
}

function handleLogout() {
  menuOpen.value = false
  localStorage.removeItem('polaris.token')
  localStorage.removeItem('polaris.role')
  localStorage.removeItem('polaris.user')
  navigateTo('/login')
}

function themeToggle() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.classList.toggle('light')
}

function panelToggle() {
  panelOpen.value = !panelOpen.value
  settingsStore.showPanel = !settingsStore.showPanel
}

onUnmounted(() => {
  if (import.meta.client) document.removeEventListener('click', closeMenu)
})
</script>
