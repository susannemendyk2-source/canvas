import api from './api'

export const authService = {
  login: (data: { username: string; password: string }) => api.post('/api/auth/login', data),
  register: (data: { username: string; password: string; email?: string; nickname?: string }) => api.post('/api/auth/register', data),
  refresh: (refreshToken: string) => api.post('/api/auth/refresh', { refreshToken }),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  updatePassword: (id: number, data: { oldPassword: string; newPassword: string }) => api.put(`/api/users/${id}/password`, data),
  uploadAvatar: (id: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/api/users/${id}/avatar`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
}
