import { defineStore } from 'pinia'
import { authService } from '~/services/authService'

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: any | null
  roles: string[]
  credits: number
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    user: null,
    roles: [],
    credits: 0
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
        nickname: res.nickname,
        email: res.email
      }
      this.roles = res.roles || []
      this.credits = Number(res.credits ?? 0)
      if (import.meta.client) {
        localStorage.setItem('polaris.token', res.accessToken)
        localStorage.setItem('polaris.refreshToken', res.refreshToken)
        localStorage.setItem('polaris.role', (res.roles?.[0] || '').replace(/^ROLE_/, ''))
        localStorage.setItem('polaris.user', JSON.stringify(this.user))
        localStorage.setItem('polaris.credits', String(this.credits))
      }
    },
    async logout() {
      try { await authService.logout() } catch {}
      this.token = null
      this.refreshToken = null
      this.user = null
      this.roles = []
      this.credits = 0
      if (import.meta.client) {
        localStorage.removeItem('polaris.token')
        localStorage.removeItem('polaris.refreshToken')
        localStorage.removeItem('polaris.role')
        localStorage.removeItem('polaris.user')
        localStorage.removeItem('polaris.credits')
        const { useCanvasStore } = await import('~/stores/canvasStore')
        useCanvasStore().reset()
        navigateTo('/login')
      }
    },
    async refreshUser() {
      try {
        const res: any = await authService.me()
        this.user = {
          id: res.userId,
          username: res.username,
          nickname: res.nickname,
          email: res.email,
          phone: res.phone,
          avatar: res.avatar
        }
        this.roles = res.roles || []
        this.credits = Number(res.credits ?? this.credits ?? 0)
        if (import.meta.client) {
          localStorage.setItem('polaris.user', JSON.stringify(this.user))
          localStorage.setItem('polaris.credits', String(this.credits))
        }
      } catch {
        // refresh failed – keep existing user data from localStorage
      }
    },
    init() {
      if (import.meta.client) {
        const saved = localStorage.getItem('polaris.token')
        if (saved) {
          this.token = saved
          this.refreshToken = localStorage.getItem('polaris.refreshToken')
          const rawUser = localStorage.getItem('polaris.user')
          if (rawUser) {
            try { this.user = JSON.parse(rawUser) } catch {}
          }
          this.credits = Number(localStorage.getItem('polaris.credits') || 0)
          if (import.meta.client) {
            const rawRole = localStorage.getItem('polaris.role')
            if (rawRole && this.roles.length === 0) this.roles = [rawRole]
          }
          this.refreshUser().catch(() => {})
        }
      }
    },
    spendCredits(amount: number) {
      this.credits = Math.max(0, this.credits - amount)
      if (import.meta.client) localStorage.setItem('polaris.credits', String(this.credits))
    },
    addCredits(amount: number) {
      this.credits += amount
      if (import.meta.client) localStorage.setItem('polaris.credits', String(this.credits))
    }
  }
})
