<template>
  <Teleport to="body">
    <div v-if="settingsStore.showSettings" class="fixed inset-0 z-[100] flex justify-end">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="settingsStore.toggleSettings()" />
      <div class="relative max-w-[520px] flex-1 bg-[#1b1c1f] p-6 shadow-lg">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Settings class="size-4 text-white/72" />
            <h2 class="text-base font-semibold text-white">API Settings</h2>
          </div>
          <button class="rounded-lg p-1.5 text-white/38 transition hover:bg-white/8 hover:text-white/72" @click="settingsStore.toggleSettings()">
            <X class="size-4" />
          </button>
        </div>

        <div class="mb-6 flex gap-1 rounded-lg bg-black/20 p-1">
          <button
            v-for="tab in tabs" :key="tab.key"
            class="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"
            :class="activeTab === tab.key
              ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30'
              : 'text-white/55 hover:text-white/80'"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-xs text-white/55">Base URL</label>
            <input
              v-model="form.baseUrl"
              class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50"
              placeholder="https://api.example.com"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs text-white/55">API Key</label>
            <div class="relative">
              <input
                v-model="form.apiKey"
                :type="showKey ? 'text' : 'password'"
                class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 pr-9 text-sm text-white/80 outline-none focus:border-cyan-300/50"
                placeholder="sk-..."
              />
              <button class="absolute right-2 top-1/2 -translate-y-1/2 text-white/38 hover:text-white/72" @click="showKey = !showKey">
                <component :is="showKey ? EyeOff : Eye" class="size-3.5" />
              </button>
            </div>
          </div>
          <div>
            <label class="mb-1 block text-xs text-white/55">Model</label>
            <ModelSelector />
          </div>
        </div>

        <div class="mt-6 flex gap-3 border-t border-white/10 pt-4">
          <FloatingButton @click="handleSave">
            <Save class="size-3.5" />
            Save
          </FloatingButton>
          <FloatingButton @click="handleTest">
            <RefreshCw class="size-3.5" />
            Test
          </FloatingButton>
        </div>

        <p v-if="statusMsg" class="mt-3 text-xs" :class="statusError ? 'text-studio-danger' : 'text-studio-success'">
          {{ statusMsg }}
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Settings, X, Eye, EyeOff, Save, RefreshCw } from 'lucide-vue-next'
import ModelSelector from '~/components/ui/ModelSelector.vue'
import FloatingButton from '~/components/ui/FloatingButton.vue'
import { useSettingsStore } from '~/stores/settingsStore'

const settingsStore = useSettingsStore()

const tabs = [
  { key: 'deepseek', label: 'DeepSeek' },
  { key: 'runninghub', label: 'RunningHub' },
  { key: 'volc', label: '火山引擎' }
]

const activeTab = ref('deepseek')
const showKey = ref(false)
const statusMsg = ref('')
const statusError = ref(false)

const form = reactive({
  baseUrl: '',
  apiKey: '',
  model: ''
})

function handleSave() {
  localStorage.setItem('polaris.apiConfig', JSON.stringify({ ...form, provider: activeTab.value }))
  statusMsg.value = 'Settings saved'
  statusError.value = false
}

async function handleTest() {
  try {
    await $fetch('/api/health', { method: 'GET' })
    statusMsg.value = 'Connection successful'
    statusError.value = false
  } catch {
    statusMsg.value = 'Connection failed'
    statusError.value = true
  }
}
</script>
