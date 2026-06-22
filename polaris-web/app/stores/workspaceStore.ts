import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CanvasMode } from '~/types'

export const useWorkspaceStore = defineStore('workspace', () => {
  const mode = ref<CanvasMode>('magic')
  const projectName = ref('Untitled Project')
  const canvasObjects = ref<any[]>([])

  function setMode(m: CanvasMode) {
    mode.value = m
  }

  function toggleMode() {
    mode.value = mode.value === 'magic' ? 'workflow' : 'magic'
  }

  function setProjectName(name: string) {
    projectName.value = name
  }

  return { mode, projectName, canvasObjects, setMode, toggleMode, setProjectName }
})
