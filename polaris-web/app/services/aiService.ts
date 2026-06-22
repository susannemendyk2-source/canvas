import api from './api'

export const aiService = {
  chat: (data: any) => api.post('/api/ai/chat', data),
  imageGenerate: (data: any) => api.post('/api/ai/image/generate', data),
  videoGenerate: (data: any) => api.post('/api/ai/video/generate', data),
  promptEnhance: (data: any) => api.post('/api/ai/prompt/enhance', data),
  getTasks: (id: number) => api.get(`/api/ai/tasks/${id}`),
  getProviders: () => api.get('/api/ai/providers'),
  saveProviders: (data: any) => api.put('/api/ai/providers', data)
}
