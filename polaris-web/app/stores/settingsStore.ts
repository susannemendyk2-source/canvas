import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const language = ref<'zh' | 'en'>('zh')
  const theme = ref<'dark' | 'light'>('dark')
  const showSettings = ref(false)
  const showHistory = ref(false)
  const showAssets = ref(false)
  const showPanel = ref(true)

  const isZh = computed(() => language.value === 'zh')

  function t(zh: string, en: string) {
    return isZh.value ? zh : en
  }

  function setLanguage(value: 'zh' | 'en') {
    language.value = value
    if (import.meta.client) localStorage.setItem('polaris.language', value)
  }

  function toggleLanguage() {
    setLanguage(language.value === 'zh' ? 'en' : 'zh')
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    if (import.meta.client) localStorage.setItem('polaris.theme', theme.value)
  }

  function toggleSettings() {
    showSettings.value = !showSettings.value
  }

  function toggleHistory() {
    showHistory.value = !showHistory.value
  }

  function toggleAssets() {
    showAssets.value = !showAssets.value
  }

  function init() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('polaris.language')
    if (saved === 'zh' || saved === 'en') language.value = saved
    const savedTheme = localStorage.getItem('polaris.theme')
    if (savedTheme === 'dark' || savedTheme === 'light') theme.value = savedTheme
  }

  return {
    language, theme, isZh, showSettings, showHistory, showAssets, showPanel,
    t, setLanguage, init, toggleLanguage, toggleTheme, toggleSettings, toggleHistory, toggleAssets
  }
})
