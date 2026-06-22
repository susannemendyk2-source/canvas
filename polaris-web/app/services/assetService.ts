import api from './api'

export const assetService = {
  list: (params?: any) => api.get('/api/assets', { params }),
  upload: (formData: FormData) => api.post('/api/assets/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/api/assets/${id}`),
  toggleFavorite: (id: number) => api.put(`/api/assets/${id}/favorite`)
}
