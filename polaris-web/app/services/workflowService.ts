import api from './api'

export const workflowService = {
  get: (projectId: number) => api.get(`/api/projects/${projectId}/workflow`),
  save: (projectId: number, data: any) => api.put(`/api/projects/${projectId}/workflow`, data),
  run: (projectId: number) => api.post(`/api/projects/${projectId}/workflow/run`),
  status: (projectId: number) => api.get(`/api/projects/${projectId}/workflow/status`)
}
