export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['./app/assets/css/main.css'],
  components: {
    prefix: false,
    dirs: ['~/components']
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || ''
    }
  }
})
