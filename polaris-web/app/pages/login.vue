<template>
  <main class="flex min-h-screen items-center justify-center bg-[#050608] p-4 text-white">
    <section class="w-full max-w-md rounded-xl border border-white/10 bg-[#10131a]/92 p-8 shadow-glass">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="mx-auto mb-4 grid size-11 w-fit place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow">
          <Navigation class="size-5 text-cyan-100" />
        </NuxtLink>
        <h1 class="text-xl font-semibold">Login</h1>
        <p class="mt-1 text-sm text-white/45">Welcome back to Polaris</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <label class="block">
          <span class="mb-1.5 block text-xs text-white/48">Username</span>
          <input
            v-model.trim="username"
            autocomplete="username"
            class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60"
            placeholder="Enter username"
          />
        </label>

        <label class="block">
          <span class="mb-1.5 block text-xs text-white/48">Password</span>
          <div class="flex h-11 items-center rounded-lg border border-white/8 bg-black/60 focus-within:border-cyan-400/60">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25"
              placeholder="Enter password"
            />
            <button type="button" class="grid size-10 place-items-center text-white/42 hover:text-white" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" class="size-4" />
              <Eye v-else class="size-4" />
            </button>
          </div>
        </label>

        <button
          type="submit"
          :disabled="loading"
          class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-100 text-sm font-medium text-[#061018] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Loader2 v-if="loading" class="size-4 animate-spin" />
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>

        <p v-if="error" class="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-center text-xs text-amber-100">{{ error }}</p>
      </form>

      <p class="mt-6 text-center text-sm text-white/42">
        No account yet?
        <NuxtLink to="/register" class="text-cyan-100 hover:underline">Register</NuxtLink>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Eye, EyeOff, Loader2, Navigation } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Please enter username and password'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await authStore.login({ username: username.value, password: password.value })
    const isAdmin = authStore.roles.some((role: string) => role.includes('ADMIN'))
    await navigateTo(isAdmin ? '/admin/dashboard' : '/studio')
  } catch (err: any) {
    error.value = err?.message || err?.msg || 'Login failed. Check your username and password.'
  } finally {
    loading.value = false
  }
}
</script>
