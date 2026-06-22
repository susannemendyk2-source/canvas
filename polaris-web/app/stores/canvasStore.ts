import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CanvasObject, CanvasObjectType } from '~/types'
import { uid } from '~/utils'
import { projectService } from '~/services/projectService'

type CanvasPatch = Partial<Omit<CanvasObject, 'id'>>

interface BackendCanvasObject {
  id: number
  projectId: number
  type: CanvasObjectType
  title?: string
  content?: string
  positionX?: number
  positionY?: number
  width?: number
  height?: number
  meta?: string
}

export const useCanvasStore = defineStore('canvas', () => {
  const objects = ref<CanvasObject[]>([])
  const selectedId = ref<string | null>(null)
  const activeProjectId = ref<number | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const lastSavedAt = ref<string | null>(null)
  const zoom = ref(86)
  const saveTimers = new Map<string, ReturnType<typeof setTimeout>>()
  const creatingIds = new Set<string>()

  const selectedObject = computed(() => objects.value.find((item) => item.id === selectedId.value) || null)

  function normalize(dto: BackendCanvasObject): CanvasObject {
    return {
      id: String(dto.id),
      backendId: dto.id,
      projectId: dto.projectId,
      type: dto.type || 'text',
      x: dto.positionX ?? 100,
      y: dto.positionY ?? 100,
      width: dto.width ?? 320,
      height: dto.height ?? 220,
      title: dto.title || `${dto.type || 'text'} card`,
      content: dto.content || '',
      meta: dto.meta,
      dirty: false
    }
  }

  function toPayload(obj: CanvasObject) {
    return {
      type: obj.type,
      title: obj.title,
      content: obj.content,
      positionX: obj.x,
      positionY: obj.y,
      width: obj.width,
      height: obj.height,
      meta: obj.meta
    }
  }

  function getStoredProjectId() {
    if (!import.meta.client) return null
    const raw = localStorage.getItem('polaris.activeProject')
    const parsed = raw ? Number(raw) : NaN
    return Number.isFinite(parsed) ? parsed : null
  }

  async function ensureProject() {
    if (activeProjectId.value) return activeProjectId.value
    const stored = getStoredProjectId()
    if (stored) {
      activeProjectId.value = stored
      return stored
    }
    const project: any = await projectService.create({
      name: `Polaris Canvas ${new Date().toLocaleString()}`,
      mode: 'magic-canvas',
      description: 'Created from Polaris Studio'
    })
    activeProjectId.value = Number(project.id)
    if (import.meta.client) localStorage.setItem('polaris.activeProject', String(project.id))
    return activeProjectId.value
  }

  async function loadProject(projectId?: number | string | null) {
    const id = projectId == null ? getStoredProjectId() : Number(projectId)
    if (!id || !Number.isFinite(id)) return
    activeProjectId.value = id
    if (import.meta.client) localStorage.setItem('polaris.activeProject', String(id))
    loading.value = true
    error.value = null
    try {
      const result: any = await projectService.getObjects(id)
      objects.value = Array.isArray(result) ? result.map(normalize) : []
      selectedId.value = null
    } catch (err: any) {
      error.value = err?.message || err?.messageText || 'Failed to load canvas'
    } finally {
      loading.value = false
    }
  }

  function addObject(obj: Partial<CanvasObject>) {
    const item: CanvasObject = {
      id: uid('obj'),
      type: obj.type || 'text',
      x: obj.x ?? 160 + objects.value.length * 28,
      y: obj.y ?? 140 + objects.value.length * 24,
      width: obj.width ?? 320,
      height: obj.height ?? 220,
      title: obj.title || `${obj.type || 'text'} card`,
      content: obj.content || 'New creative asset ready for refinement.',
      meta: obj.meta,
      dirty: true
    }
    objects.value.push(item)
    selectedId.value = item.id
    void createRemote(item.id)
    return item
  }

  async function createRemote(id: string) {
    if (creatingIds.has(id)) return
    creatingIds.add(id)
    try {
      const projectId = await ensureProject()
      const current = objects.value.find((object) => object.id === id)
      if (!current) return
      const created: any = await projectService.createObject(projectId, toPayload(current))
      const idx = objects.value.findIndex((object) => object.id === id)
      if (idx !== -1) objects.value[idx] = normalize(created)
      selectedId.value = String(created.id)
      markSaved()
    } catch (err: any) {
      error.value = err?.message || 'Saved locally. Backend sync failed.'
    } finally {
      creatingIds.delete(id)
    }
  }

  function updateObject(id: string, data: CanvasPatch, sync = true) {
    const idx = objects.value.findIndex((object) => object.id === id)
    if (idx === -1) return
    objects.value[idx] = { ...objects.value[idx], ...data, dirty: true }
    if (sync) scheduleSave(id)
  }

  function moveObject(id: string, x: number, y: number) {
    updateObject(id, { x, y })
  }

  function resizeObject(id: string, width: number, height: number) {
    updateObject(id, {
      width: Math.max(240, width),
      height: Math.max(160, height)
    })
  }

  function scheduleSave(id: string) {
    const existing = saveTimers.get(id)
    if (existing) clearTimeout(existing)
    saveTimers.set(id, setTimeout(() => {
      saveTimers.delete(id)
      void saveObject(id)
    }, 450))
  }

  async function saveObject(id: string) {
    const obj = objects.value.find((item) => item.id === id)
    if (!obj) return
    if (!obj.backendId) {
      await createRemote(obj.id)
      return
    }
    try {
      await projectService.updateObject(obj.projectId || activeProjectId.value || 0, obj.backendId, toPayload(obj))
      obj.dirty = false
      markSaved()
    } catch (err: any) {
      error.value = err?.message || 'Failed to save canvas object'
    }
  }

  async function saveAll() {
    saving.value = true
    error.value = null
    try {
      await ensureProject()
      await Promise.all(objects.value.map((object) => saveObject(object.id)))
      markSaved()
    } catch (err: any) {
      error.value = err?.message || 'Failed to save canvas'
    } finally {
      saving.value = false
    }
  }

  function duplicateObject(id: string) {
    const source = objects.value.find((item) => item.id === id)
    if (!source) return
    return addObject({
      ...source,
      id: undefined,
      backendId: undefined,
      x: source.x + 28,
      y: source.y + 28,
      title: `${source.title} copy`
    })
  }

  async function removeObject(id: string) {
    const obj = objects.value.find((item) => item.id === id)
    objects.value = objects.value.filter((item) => item.id !== id)
    if (selectedId.value === id) selectedId.value = null
    if (obj?.backendId) {
      try {
        await projectService.deleteObject(obj.projectId || activeProjectId.value || 0, obj.backendId)
        markSaved()
      } catch (err: any) {
        error.value = err?.message || 'Failed to delete canvas object'
      }
    }
  }

  function deleteSelected() {
    if (selectedId.value) void removeObject(selectedId.value)
  }

  function selectObject(id: string | null) {
    selectedId.value = id
  }

  function setZoom(value: number) {
    zoom.value = Math.min(180, Math.max(30, value))
  }

  function markSaved() {
    lastSavedAt.value = new Date().toLocaleTimeString()
  }

  return {
    objects,
    selectedId,
    selectedObject,
    activeProjectId,
    loading,
    saving,
    error,
    lastSavedAt,
    zoom,
    loadProject,
    ensureProject,
    addObject,
    removeObject,
    updateObject,
    moveObject,
    resizeObject,
    duplicateObject,
    deleteSelected,
    selectObject,
    saveAll,
    setZoom
  }
})
