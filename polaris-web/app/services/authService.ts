import api from './api'

export const authService = {
  login: (data: { username: string; password: string }) => api.post('/api/auth/login', data),
  register: (data: { username: string; password: string; email?: string; nickname?: string }) => api.post('/api/auth/register', data),
  refresh: (refreshToken: string) => api.post('/api/auth/refresh', { refreshToken }),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me')
}
