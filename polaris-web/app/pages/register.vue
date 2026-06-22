<template>
  <div class="flex min-h-screen items-center justify-center bg-[#050608] p-4">
    <div class="w-full max-w-md rounded-2xl border border-white/10 bg-[#111722]/88 p-8 shadow-glass">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="mx-auto mb-4 flex w-fit items-center gap-3">
          <div class="grid size-10 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow">
            <Navigation class="size-5 text-cyan-100" />
          </div>
        </NuxtLink>
        <h1 class="text-xl font-semibold">注册 Polaris / Register</h1>
        <p class="mt-1 text-sm text-white/45">加入北极星创作系统</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="mb-1.5 block text-xs text-white/48">用户名 / Username</label>
          <input v-model="username" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" placeholder="输入用户名" />
          <p v-if="errors.username" class="mt-1 text-xs text-amber-200">{{ errors.username }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-xs text-white/48">邮箱 / Email</label>
          <input v-model="email" type="email" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" placeholder="输入邮箱" />
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
          <p v-if="errors.password" class="mt-1 text-xs text-amber-200">{{ errors.password }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-xs text-white/48">确认密码 / Confirm Password</label>
          <input v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none focus:border-cyan-400/60" placeholder="再次输入密码" />
          <p v-if="password !== confirmPassword && confirmPassword" class="mt-1 text-xs text-amber-200">两次密码不一致</p>
        </div>

        <button type="submit" :disabled="loading" class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-100 text-sm font-medium text-[#061018] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
          <Loader2 v-if="loading" class="size-4 animate-spin" />
          {{ loading ? '注册中...' : '注册 / Register' }}
        </button>

        <p v-if="error" class="text-center text-xs text-amber-200">{{ error }}</p>
      </form>

      <p class="mt-6 text-center text-sm text-white/42">
        已有账号？
        <NuxtLink to="/login" class="text-cyan-100 hover:underline">登录 / Login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Navigation, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')
const errors = ref({ username: '', password: '' })

const handleRegister = async () => {
  errors.value = { username: '', password: '' }
  if (!username.value) { errors.value.username = '请输入用户名'; return }
  if (username.value.length < 3) { errors.value.username = '用户名至少3个字符'; return }
  if (!password.value) { errors.value.password = '请输入密码'; return }
  if (password.value.length < 6) { errors.value.password = '密码至少6个字符'; return }
  if (password.value !== confirmPassword.value) { error.value = '两次密码不一致'; return }

  loading.value = true
  error.value = ''
  try {
    const { authService } = await import('~/services/authService')
    await authService.register({ username: username.value, password: password.value, email: email.value || undefined })
    navigateTo('/login')
  } catch (err: any) {
    error.value = err?.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>
