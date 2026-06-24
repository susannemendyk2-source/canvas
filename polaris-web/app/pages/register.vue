<template>
  <main class="flex min-h-screen items-center justify-center bg-[#050608] p-4 text-white">
    <section class="w-full max-w-md rounded-xl border border-white/10 bg-[#10131a]/92 p-8 shadow-glass">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="mx-auto mb-4 grid size-11 w-fit place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow">
          <Navigation class="size-5 text-cyan-100" />
        </NuxtLink>
        <h1 class="text-xl font-semibold">Create Polaris Account</h1>
        <p class="mt-1 text-sm text-white/45">Join the Polaris creative workspace</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <label class="block">
          <span class="mb-1.5 block text-xs text-white/48">Username</span>
          <input v-model.trim="username" autocomplete="username" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60" placeholder="Enter username" />
          <p v-if="errors.username" class="mt-1 text-xs text-amber-200">{{ errors.username }}</p>
        </label>

        <label class="block">
          <span class="mb-1.5 block text-xs text-white/48">Email</span>
          <input v-model.trim="email" type="email" autocomplete="email" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60" placeholder="Enter email, optional" />
        </label>

        <label class="block">
          <span class="mb-1.5 block text-xs text-white/48">Password</span>
          <div class="flex h-11 items-center rounded-lg border border-white/8 bg-black/60 focus-within:border-cyan-400/60">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="At least 6 characters" />
            <button type="button" class="grid size-10 place-items-center text-white/42 hover:text-white" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" class="size-4" />
              <Eye v-else class="size-4" />
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-xs text-amber-200">{{ errors.password }}</p>
        </label>

        <label class="block">
          <span class="mb-1.5 block text-xs text-white/48">Confirm Password</span>
          <input v-model="confirmPassword" type="password" autocomplete="new-password" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60" placeholder="Repeat password" />
          <p v-if="password !== confirmPassword && confirmPassword" class="mt-1 text-xs text-amber-200">Passwords do not match</p>
        </label>

        <button type="submit" :disabled="loading" class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-100 text-sm font-medium text-[#061018] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
          <Loader2 v-if="loading" class="size-4 animate-spin" />
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>

        <p v-if="error" class="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-center text-xs text-amber-100">{{ error }}</p>
      </form>

      <p class="mt-6 text-center text-sm text-white/42">
        Already have an account?
        <NuxtLink to="/login" class="text-cyan-100 hover:underline">Login</NuxtLink>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Eye, EyeOff, Loader2, Navigation } from 'lucide-vue-next'
import { authService } from '~/services/authService'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const errors = ref({ username: '', password: '' })

async function handleRegister() {
  errors.value = { username: '', password: '' }
  error.value = ''

  if (!username.value) {
    errors.value.username = 'Please enter a username'
    return
  }
  if (username.value.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
    return
  }
  if (!password.value) {
    errors.value.password = 'Please enter a password'
    return
  }
  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  try {
    await authService.register({ username: username.value, password: password.value, email: email.value || undefined })
    await navigateTo('/login')
  } catch (err: any) {
    error.value = err?.message || err?.msg || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
