<template>
  <div class="flex min-h-screen items-center justify-center bg-[#050608] p-4">
    <div class="w-full max-w-md rounded-2xl border border-white/10 bg-[#111722]/88 p-8 shadow-glass">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="mx-auto mb-4 flex w-fit items-center gap-3">
          <div class="grid size-10 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow">
            <Navigation class="size-5 text-cyan-100" />
          </div>
        </NuxtLink>
        <h1 class="text-xl font-semibold">登录 / Login</h1>
        <p class="mt-1 text-sm text-white/45">欢迎回到北极星创作系统</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="mb-1.5 block text-xs text-white/48">用户名 / Username</label>
          <input v-model="username" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" placeholder="输入用户名" />
        </div>

        <div>
          <label class="mb-1.5 block text-xs text-white/48">密码 / Password</label>
          <div class="flex h-11 items-center rounded-lg border border-white/8 bg-black/60 focus-within:border-cyan-400/60">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="输入密码" />
            <button type="button" @click="showPassword = !showPassword" class="grid size-10 place-items-center text-white/42 hover:text-white">
              <EyeOff v-if="showPassword" class="size-4" />
              <Eye v-else class="size-4" />
            </button>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-100 text-sm font-medium text-[#061018] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
          <Loader2 v-if="loading" class="size-4 animate-spin" />
          {{ loading ? '登录中...' : '登录 / Login' }}
        </button>

        <p v-if="error" class="text-center text-xs text-amber-200">{{ error }}</p>
      </form>

      <p class="mt-6 text-center text-sm text-white/42">
        还没有账号？
        <NuxtLink to="/register" class="text-cyan-100 hover:underline">注册 / Register</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Navigation, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { authService } = await import('~/services/authService')
    const res: any = await authService.login({ username: username.value, password: password.value })
    const data = res.data || res
    const token = data.accessToken || data.token
    const roles: string[] = data.roles || []
    const role = roles.find(r => r.includes('ADMIN')) ? 'ADMIN' : 'USER'
    localStorage.setItem('polaris.token', token)
    localStorage.setItem('polaris.role', role)
    localStorage.setItem('polaris.user', JSON.stringify(data))
    navigateTo(role === 'ADMIN' ? '/admin/dashboard' : '/studio')
  } catch (err: any) {
    error.value = err?.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>
