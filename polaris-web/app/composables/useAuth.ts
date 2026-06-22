import { authService } from '~/services/authService'

export const useAuth = () => {
  const token = useState<string | null>('polaris.token', () => null)
  const user = useState<any | null>('polaris.user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  const init = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('polaris.token')
      if (saved) {
        token.value = saved
        refreshUser()
      }
    }
  }

  const login = async (data: { username: string; password: string }) => {
    const res: any = await authService.login(data)
    token.value = res.token
    user.value = res.user
    if (import.meta.client) {
      localStorage.setItem('polaris.token', res.token)
    }
  }

  const register = async (data: { username: string; password: string; email?: string; nickname?: string }) => {
    const res: any = await authService.register(data)
    token.value = res.token
    user.value = res.user
    if (import.meta.client) {
      localStorage.setItem('polaris.token', res.token)
    }
  }

  const logout = async () => {
    try { await authService.logout() } catch {}
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('polaris.token')
      navigateTo('/login')
    }
  }

  const refreshUser = async () => {
    try {
      const res: any = await authService.me()
      user.value = res.user || res
    } catch {
      token.value = null
      user.value = null
      if (import.meta.client) localStorage.removeItem('polaris.token')
    }
  }

  if (import.meta.client) init()

  return { token, user, isAuthenticated, login, register, logout, refreshUser }
}
