import api from './api'

export const adminService = {
  dashboard: () => api.get('/api/admin/stats/dashboard'),
  listUsers: (params: any) => api.get('/api/admin/users', { params }),
  updateUserStatus: (id: number, status: number) => api.put(`/api/admin/users/${id}/status`, { status }),
  updateUserCredits: (id: number, amount: number, remark: string) => api.put(`/api/admin/users/${id}/credits`, { amount, remark }),
  assignRole: (id: number, roleId: number) => api.put(`/api/admin/users/${id}/role`, { roleId }),
  listProjects: (params: any) => api.get('/api/admin/projects', { params }),
  reviewProject: (id: number, status: number) => api.put(`/api/admin/projects/${id}/status`, { status }),
  publishTemplate: (id: number) => api.post('/api/admin/templates', { projectId: id }),
  statsCredits: () => api.get('/api/admin/stats/credits'),
  logs: (params: any) => api.get('/api/admin/logs', { params }),
  getUserProviders: (userId: number) => api.get(`/api/admin/users/${userId}/providers`),
  saveUserProvider: (userId: number, data: any) => api.put(`/api/admin/users/${userId}/providers`, data)
}
