import api from './api'

export const projectService = {
  list: (params?: any) => api.get('/api/projects', { params }),
  get: (id: number) => api.get(`/api/projects/${id}`),
  create: (data: any) => api.post('/api/projects', data),
  update: (id: number, data: any) => api.put(`/api/projects/${id}`, data),
  delete: (id: number) => api.delete(`/api/projects/${id}`),
  duplicate: (id: number) => api.post(`/api/projects/${id}/duplicate`),
  getPublic: (params?: any) => api.get('/api/projects/public', { params }),
  getObjects: (projectId: number) => api.get(`/api/projects/${projectId}/objects`),
  createObject: (projectId: number, data: any) => api.post(`/api/projects/${projectId}/objects`, data),
  updateObject: (projectId: number, objectId: number, data: any) => api.put(`/api/projects/${projectId}/objects/${objectId}`, data),
  deleteObject: (projectId: number, objectId: number) => api.delete(`/api/projects/${projectId}/objects/${objectId}`),
  batchUpdatePositions: (projectId: number, data: any) => api.put(`/api/projects/${projectId}/objects/batch`, data)
}
