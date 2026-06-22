export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('polaris.token')
    if (!token) {
      return navigateTo('/login')
    }
    if (to.path.startsWith('/admin')) {
      const role = localStorage.getItem('polaris.role')
      if (role !== 'ADMIN') {
        return navigateTo('/studio')
      }
    }
  }
})
