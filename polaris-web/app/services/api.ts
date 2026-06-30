import axios from 'axios'

const getApiBase = () => {
  const configured = import.meta.env.NUXT_PUBLIC_API_BASE
  if (configured) return configured

  if (import.meta.client) {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8080'
    }
  }

  return ''
}

const api = axios.create({
  baseURL: getApiBase(),
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  if (import.meta.client) {
    const token = localStorage.getItem('polaris.token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const payload = response.data
    if (payload && typeof payload === 'object' && 'code' in payload) {
      if (payload.code !== 200) {
        return Promise.reject(payload)
      }
      return payload.data
    }
    return payload
  },
  (error) => {
    if (error.response?.status === 401) {
      if (import.meta.client) {
        localStorage.removeItem('polaris.token')
        localStorage.removeItem('polaris.refreshToken')
        localStorage.removeItem('polaris.role')
        navigateTo('/login')
      }
    }
    return Promise.reject(error.response?.data || error)
  }
)

export default api
