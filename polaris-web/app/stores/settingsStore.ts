import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const language = ref<'zh' | 'en'>('zh')
  const theme = ref<'dark' | 'light'>('dark')
  const showSettings = ref(false)
  const showHistory = ref(false)
  const showAssets = ref(false)
  const showPanel = ref(true)

  function toggleLanguage() {
    language.value = language.value === 'zh' ? 'en' : 'zh'
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
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

  return {
    language, theme, showSettings, showHistory, showAssets, showPanel,
    toggleLanguage, toggleTheme, toggleSettings, toggleHistory, toggleAssets
  }
})
