import api from './api'

export type ApiConfigKind = 'chat' | 'image' | 'video'

export interface StoredApiConfig {
  provider?: string
  baseUrl?: string
  apiKey?: string
  secretKey?: string
  model?: string
  configured?: boolean
}

const storageKeys: Record<ApiConfigKind, string> = {
  chat: 'polaris.apiConfig',
  image: 'polaris.imageApiConfig',
  video: 'polaris.videoApiConfig'
}

export function providerKeyFor(kind: ApiConfigKind, provider?: string) {
  if (kind === 'chat') return 'chat'
  if (kind === 'image') return `image-${provider || 'openai'}`
  return 'video-default'
}

export function readApiConfig(kind: ApiConfigKind): StoredApiConfig {
  if (!import.meta.client) return {}
  try {
    return JSON.parse(localStorage.getItem(storageKeys[kind]) || '{}') || {}
  } catch {
    return {}
  }
}

export function saveApiConfig(kind: ApiConfigKind, config: StoredApiConfig) {
  if (!import.meta.client) return
  localStorage.setItem(storageKeys[kind], JSON.stringify({ configured: true, ...config }))
}

export function applyApiConfig(kind: ApiConfigKind, payload: Record<string, any>) {
  const config = readApiConfig(kind)
  const next = { ...payload }
  if (!next.model && config.model) next.model = config.model
  return next
}

export async function loadProviderConfigsFromBackend() {
  const providers: any = await aiService.getProviders()
  const list = Array.isArray(providers) ? providers : Array.isArray(providers?.data) ? providers.data : []
  for (const item of list) {
    if (!item?.provider) continue
    if (item.provider === 'chat') {
      saveApiConfig('chat', {
        provider: 'chat',
        baseUrl: item.baseUrl || '',
        apiKey: item.apiKey || '',
        model: item.model || ''
      })
    } else if (item.provider.startsWith('image-')) {
      saveApiConfig('image', {
        provider: item.provider.replace(/^image-/, '') || 'openai',
        baseUrl: item.baseUrl || '',
        apiKey: item.apiKey || '',
        secretKey: item.secretKey || '',
        model: item.model || ''
      })
    } else if (item.provider === 'jimeng' || item.provider === 'jimeng-4') {
      saveApiConfig('image', {
        provider: 'ark',
        baseUrl: item.baseUrl || '',
        apiKey: item.apiKey || '',
        secretKey: item.secretKey || '',
        model: item.model || ''
      })
    } else if (item.provider.startsWith('video-') || item.provider === 'video-default') {
      saveApiConfig('video', {
        provider: item.provider === 'video-default' ? 'openai' : item.provider.replace(/^video-/, '') || 'openai',
        baseUrl: item.baseUrl || '',
        apiKey: item.apiKey || '',
        model: item.model || ''
      })
    }
  }
  return list
}

export const aiService = {
  chat: (data: any) => api.post('/api/ai/chat', data),
  imageGenerate: (data: any) => api.post('/api/ai/image/generate', data),
  videoGenerate: (data: any) => api.post('/api/ai/video/generate', data),
  promptEnhance: (data: any) => api.post('/api/ai/prompt/enhance', data),
  getTasks: (data: any) => api.post('/api/ai/tasks/status', data),
  getProviders: () => api.get('/api/ai/providers'),
  saveProviders: (data: any) => api.put('/api/ai/providers', data)
}
