import { defineStore } from 'pinia'
import { authService } from '~/services/authService'

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: any | null
  roles: string[]
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    user: null,
    roles: []
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(data: { username: string; password: string }) {
      const res: any = await authService.login(data)
      this.token = res.accessToken
      this.refreshToken = res.refreshToken
      this.user = {
        id: res.userId,
        username: res.username,
        nickname: res.nickname
      }
      this.roles = res.roles || []
      if (import.meta.client) {
        localStorage.setItem('polaris.token', res.accessToken)
        localStorage.setItem('polaris.refreshToken', res.refreshToken)
        localStorage.setItem('polaris.role', (res.roles?.[0] || '').replace(/^ROLE_/, ''))
      }
    },
    async logout() {
      try { await authService.logout() } catch {}
      this.token = null
      this.refreshToken = null
      this.user = null
      this.roles = []
      if (import.meta.client) {
        localStorage.removeItem('polaris.token')
        localStorage.removeItem('polaris.refreshToken')
        localStorage.removeItem('polaris.role')
        navigateTo('/login')
      }
    },
    async refreshUser() {
      try {
        const res: any = await authService.me()
        this.user = {
          id: res.userId,
          username: res.username
        }
        this.roles = res.roles || []
      } catch {
        this.token = null
        this.refreshToken = null
        this.user = null
        this.roles = []
        if (import.meta.client) {
          localStorage.removeItem('polaris.token')
          localStorage.removeItem('polaris.refreshToken')
          localStorage.removeItem('polaris.role')
        }
      }
    },
    init() {
      if (import.meta.client) {
        const saved = localStorage.getItem('polaris.token')
        if (saved) {
          this.token = saved
          this.refreshToken = localStorage.getItem('polaris.refreshToken')
          this.refreshUser()
        }
      }
    }
  }
})
