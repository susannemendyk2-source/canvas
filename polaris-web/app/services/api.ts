import axios from 'axios'

let _api: any = null

function getApi() {
  if (!_api) {
    const { public: { apiBase } } = useRuntimeConfig()
    _api = axios.create({
      baseURL: apiBase,
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' }
    })

    _api.interceptors.request.use((config: any) => {
      if (import.meta.client) {
        const token = localStorage.getItem('polaris.token')
        if (token) config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    _api.interceptors.response.use(
      (response: any) => {
        const payload = response.data
        if (payload && typeof payload === 'object' && 'code' in payload) {
          if (payload.code !== 200) return Promise.reject(payload)
          return payload.data
        }
        return payload
      },
      (error: any) => {
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
  }
  return _api
}

export default new Proxy({}, {
  get(_target, prop: string) {
    return (...args: any[]) => getApi()[prop](...args)
  }
})
