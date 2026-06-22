<template>
  <div class="mx-auto max-w-4xl p-6">
    <div class="mb-6 flex items-center gap-4">
      <button class="grid size-9 place-items-center rounded-lg border border-white/10 text-white/55 transition hover:bg-white/8 hover:text-white" @click="goBack">
        <ArrowLeft class="size-4" />
      </button>
      <h1 class="text-2xl font-semibold">设置 / Settings</h1>
    </div>

    <div class="mb-6 flex gap-2">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="['rounded-lg px-4 py-2 text-sm transition', activeTab === tab.id ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/48 hover:bg-white/6 hover:text-white']">
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'profile'" class="rounded-xl border border-white/10 bg-white/5 p-6">
      <div class="mb-6 flex items-center gap-4">
        <div class="grid size-16 place-items-center rounded-full bg-cyan-100 text-xl font-semibold text-[#061018]">
          {{ (nickname || 'U').charAt(0) }}
        </div>
        <div>
          <button class="rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white/72">更换头像 / Change Avatar</button>
          <p class="mt-1 text-xs text-white/35">支持 JPG, PNG, GIF</p>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-xs text-white/48">昵称 / Nickname</label>
          <input v-model="nickname" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">邮箱 / Email</label>
          <input v-model="email" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">手机 / Phone</label>
          <input v-model="phone" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
      </div>
      <button class="mt-6 h-10 rounded-lg bg-cyan-100 px-6 text-sm font-medium text-[#061018]">保存 / Save</button>
    </div>

    <div v-if="activeTab === 'password'" class="rounded-xl border border-white/10 bg-white/5 p-6">
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-xs text-white/48">旧密码 / Old Password</label>
          <input v-model="oldPassword" type="password" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">新密码 / New Password</label>
          <input v-model="newPassword" type="password" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-white/48">确认新密码 / Confirm Password</label>
          <input v-model="confirmNewPassword" type="password" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </div>
      </div>
      <button class="mt-6 h-10 rounded-lg bg-cyan-100 px-6 text-sm font-medium text-[#061018]">修改密码 / Change Password</button>
    </div>

    <div v-if="activeTab === 'api'" class="rounded-xl border border-white/10 bg-white/5 p-6">
      <div class="mb-5 flex gap-2">
        <button v-for="tab in apiTabs" :key="tab.id" @click="activeApiTab = tab.id" :class="['rounded-lg px-4 py-2 text-sm transition', activeApiTab === tab.id ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/48 hover:bg-white/6 hover:text-white']">
          {{ tab.label }}
        </button>
      </div>

      <div class="rounded-xl border border-white/8 bg-black/16 p-4">
        <div class="mb-4 flex items-center gap-2 text-xs text-white/42">
          <span :class="['size-2 rounded-full', currentProvider.apiKey ? 'bg-emerald-400' : 'bg-white/28']" />
          {{ currentProvider.apiKey ? '已配置 API / Configured' : '未配置 API / Not configured' }}
        </div>

        <label class="mb-4 block">
          <span class="mb-2 flex items-center gap-2 text-xs text-white/48">
            <Link2 class="size-4" />
            API Base URL
          </span>
          <input v-model="currentProvider.baseUrl" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
        </label>

        <label class="mb-4 block">
          <span class="mb-2 flex items-center gap-2 text-xs text-white/48">
            <KeyRound class="size-4" />
            API Key
          </span>
          <div class="flex h-11 items-center rounded-lg border border-white/8 bg-black focus-within:border-cyan-400/60">
            <input v-model="currentProvider.apiKey" :type="showApiKey ? 'text' : 'password'" class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" />
            <button type="button" @click="showApiKey = !showApiKey" class="grid size-10 place-items-center text-white/42 hover:text-white">
              <EyeOff v-if="showApiKey" class="size-4" />
              <Eye v-else class="size-4" />
            </button>
          </div>
        </label>

        <label class="mb-5 block">
          <span class="mb-2 flex items-center gap-2 text-xs text-white/48">
            <Cpu class="size-4" />
            默认模型 / Default Model
          </span>
          <select v-model="currentProvider.model" class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60">
            <option v-for="m in modelOptions[activeApiTab]" :key="m" :value="m">{{ m }}</option>
          </select>
        </label>

        <div class="grid gap-3 sm:grid-cols-2">
          <button class="h-11 rounded-lg bg-cyan-600 text-sm font-medium text-white transition hover:bg-cyan-500">保存配置 / Save</button>
          <button class="h-11 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:bg-white/10">测试连接 / Test</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link2, KeyRound, Cpu, Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'

const activeTab = ref('profile')

function goBack() {
  navigateTo('/studio')
}
const nickname = ref('')
const email = ref('')
const phone = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const activeApiTab = ref('deepseek')
const showApiKey = ref(false)

const tabs = [
  { id: 'profile', label: '个人资料 / Profile' },
  { id: 'password', label: '密码修改 / Password' },
  { id: 'api', label: 'API 配置 / API Config' },
]

const apiTabs = [
  { id: 'deepseek', label: 'DeepSeek API' },
  { id: 'runninghub', label: 'RunningHub' },
  { id: 'volcano', label: '火山引擎' },
]

const modelOptions: Record<string, string[]> = {
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  runninghub: ['nano-banana-pro', 'nano-banana', 'gpt-image-2', 'custom-workflow'],
  volcano: ['doubao-seed-1-6', 'doubao-vision-pro', 'seedream-3-0', 'custom-model'],
}

const providers = ref<Record<string, { baseUrl: string; apiKey: string; model: string }>>({
  deepseek: { baseUrl: 'https://api.deepseek.com', apiKey: '', model: 'deepseek-chat' },
  runninghub: { baseUrl: '', apiKey: '', model: 'nano-banana-pro' },
  volcano: { baseUrl: '', apiKey: '', model: 'doubao-seed-1-6' },
})

const currentProvider = computed(() => providers.value[activeApiTab.value])
</script>
