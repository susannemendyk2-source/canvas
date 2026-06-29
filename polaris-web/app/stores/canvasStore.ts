import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CanvasLink, CanvasObject, CanvasObjectType } from '~/types'
import { uid } from '~/utils'
import { projectService } from '~/services/projectService'
import { useAssetStore } from '~/stores/assetStore'
import { useWorkspaceStore } from '~/stores/workspaceStore'

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
  const links = ref<CanvasLink[]>([])
  const selectedId = ref<string | null>(null)
  const connectionStartId = ref<string | null>(null)
  const activeProjectId = ref<number | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const lastSavedAt = ref<string | null>(null)
  const zoom = ref(86)
  const saveTimers = new Map<string, ReturnType<typeof setTimeout>>()
  let linksSaveTimer: ReturnType<typeof setTimeout> | null = null
  const creatingIds = new Set<string>()
  const createPromises = new Map<string, Promise<void>>()
  const historyStack = ref<{ objects: CanvasObject[]; links: CanvasLink[] }[]>([])
  const historyIndex = ref(-1)
  const maxHistory = 50

  const selectedObject = computed(() => objects.value.find((item) => item.id === selectedId.value) || null)
  const selectedLinks = computed(() => links.value.filter((link) => link.sourceId === selectedId.value || link.targetId === selectedId.value))

  function getLinksStorageKey(projectId = activeProjectId.value) {
    return projectId ? `polaris.canvas.links.${projectId}` : 'polaris.canvas.links.local'
  }

  function loadLocalLinks(projectId = activeProjectId.value) {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(getLinksStorageKey(projectId))
      links.value = raw ? JSON.parse(raw) : []
    } catch {
      links.value = []
    }
  }

  function persistLocalLinks() {
    if (!import.meta.client) return
    localStorage.setItem(getLinksStorageKey(), JSON.stringify(links.value))
  }

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
    useWorkspaceStore().setProjectName(project.name || 'Polaris Canvas')
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
      const [objectsResult, projectResult]: any = await Promise.all([
        projectService.getObjects(id),
        projectService.get(id)
      ])
      objects.value = Array.isArray(objectsResult) ? objectsResult.map(normalize) : []
      if (projectResult) {
        useWorkspaceStore().setProjectName(projectResult.name || projectResult.title || 'Untitled Project')
      }
      if (projectResult?.meta) {
        try {
          const parsed = JSON.parse(projectResult.meta)
          if (Array.isArray(parsed)) {
            links.value = parsed
            if (import.meta.client) persistLocalLinks()
          } else {
            loadLocalLinks(id)
          }
        } catch {
          loadLocalLinks(id)
        }
      } else {
        loadLocalLinks(id)
      }
      selectedId.value = null
    } catch (err: any) {
      error.value = err?.message || err?.messageText || 'Failed to load canvas'
    } finally {
      loading.value = false
    }
  }

  function addObject(obj: Partial<CanvasObject>) {
    pushHistory()
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
    if (createPromises.has(id)) return createPromises.get(id)!
    const promise = _createRemote(id)
    createPromises.set(id, promise)
    promise.finally(() => createPromises.delete(id))
    return promise
  }

  async function _createRemote(id: string) {
    if (creatingIds.has(id)) return
    creatingIds.add(id)
    try {
      const projectId = await ensureProject()
      const current = objects.value.find((object) => object.id === id)
      if (!current) return
      const created: any = await projectService.createObject(projectId, toPayload(current))
      const idx = objects.value.findIndex((object) => object.id === id)
      if (idx !== -1) objects.value[idx] = normalize(created)
      migrateLinkId(id, String(created.id))
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
    const prev = objects.value[idx]
    const updated = { ...prev, ...data, dirty: true }
    objects.value[idx] = updated

    // Propagate prompt content to linked cards
    if (data.content !== undefined && prev.type === 'prompt' && data.content !== prev.content) {
      const outgoing = links.value.filter((l) => l.sourceId === id)
      for (const link of outgoing) {
        const tgtIdx = objects.value.findIndex((o) => o.id === link.targetId)
        if (tgtIdx !== -1 && objects.value[tgtIdx].content !== data.content) {
          objects.value[tgtIdx] = { ...objects.value[tgtIdx], content: data.content as string, dirty: true }
          scheduleSave(objects.value[tgtIdx].id)
        }
      }
    }

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

  async function flushSave(id: string) {
    const existing = saveTimers.get(id)
    if (existing) { clearTimeout(existing); saveTimers.delete(id) }
    await saveObject(id)
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

  async function saveLinksToBackend() {
    if (!activeProjectId.value) return
    await projectService.update(activeProjectId.value, { meta: JSON.stringify(links.value) })
  }

  function scheduleLinksSave() {
    if (linksSaveTimer) clearTimeout(linksSaveTimer)
    linksSaveTimer = setTimeout(() => {
      linksSaveTimer = null
      void saveLinksToBackend()
    }, 500)
  }

  async function saveAll() {
    saving.value = true
    error.value = null
    try {
      await ensureProject()
      await Promise.all(objects.value.map((object) => saveObject(object.id)))
      await saveLinksToBackend()
      persistLocalLinks()
      markSaved()
      const assetStore = useAssetStore()
      if (activeProjectId.value && objects.value.length > 0) {
        assetStore.addHistory({
          id: String(activeProjectId.value),
          title: `Canvas (${objects.value.length} cards)`,
          type: 'project',
          status: 'success',
          progress: 100,
          createdAt: new Date().toLocaleString()
        })
      }
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
    pushHistory()
    const obj = objects.value.find((item) => item.id === id)
    objects.value = objects.value.filter((item) => item.id !== id)
    links.value = links.value.filter((link) => link.sourceId !== id && link.targetId !== id)
    persistLocalLinks()
    scheduleLinksSave()
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

  function clearAll() {
    pushHistory()
    objects.value = []
    links.value = []
    selectedId.value = null
    connectionStartId.value = null
    persistLocalLinks()
  }

  function deleteSelected() {
    if (selectedId.value) void removeObject(selectedId.value)
  }

  function selectObject(id: string | null) {
    selectedId.value = id
  }

  function migrateLinkId(oldId: string, newId: string) {
    if (oldId === newId) return
    let changed = false
    links.value = links.value.map((link) => {
      const next = { ...link }
      if (next.sourceId === oldId) {
        next.sourceId = newId
        changed = true
      }
      if (next.targetId === oldId) {
        next.targetId = newId
        changed = true
      }
      return next
    })
    if (changed) persistLocalLinks()
  }

  function addLink(sourceId: string, targetId: string, label?: string) {
    if (sourceId === targetId) return null
    const exists = links.value.some((link) => link.sourceId === sourceId && link.targetId === targetId)
    if (exists) return null
    pushHistory()
    const link: CanvasLink = { id: uid('link'), sourceId, targetId, label }
    links.value.push(link)
    persistLocalLinks()
    scheduleLinksSave()
    // Propagate prompt content to linked card immediately
    const src = objects.value.find((o) => o.id === sourceId)
    const tgtIdx = objects.value.findIndex((o) => o.id === targetId)
    if (src?.type === 'prompt' && src.content && tgtIdx !== -1 && objects.value[tgtIdx].content !== src.content) {
      objects.value[tgtIdx] = { ...objects.value[tgtIdx], content: src.content, dirty: true }
      scheduleSave(targetId)
    }
    return link
  }

  function removeLink(id: string) {
    pushHistory()
    links.value = links.value.filter((link) => link.id !== id)
    persistLocalLinks()
    scheduleLinksSave()
  }

  function startConnection(id: string) {
    connectionStartId.value = id
    selectedId.value = id
  }

  function finishConnection(targetId: string) {
    if (!connectionStartId.value) return null
    const link = addLink(connectionStartId.value, targetId)
    connectionStartId.value = null
    selectedId.value = targetId
    return link
  }

  function cancelConnection() {
    connectionStartId.value = null
  }

  function setZoom(value: number) {
    zoom.value = Math.min(180, Math.max(30, value))
  }

  function reset() {
    objects.value = []
    links.value = []
    selectedId.value = null
    connectionStartId.value = null
    activeProjectId.value = null
    loading.value = false
    saving.value = false
    error.value = null
    lastSavedAt.value = null
    zoom.value = 86
    saveTimers.clear()
    if (linksSaveTimer) clearTimeout(linksSaveTimer)
    linksSaveTimer = null
    creatingIds.clear()
    createPromises.clear()
    if (import.meta.client) {
      const toRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('polaris.canvas.') || key === 'polaris.activeProject') {
          toRemove.push(key)
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k))
    }
  }

  function markSaved() {
    lastSavedAt.value = new Date().toLocaleTimeString()
  }

  function pushHistory() {
    const snapshot = { objects: JSON.parse(JSON.stringify(objects.value)), links: JSON.parse(JSON.stringify(links.value)) }
    if (historyIndex.value < historyStack.value.length - 1) {
      historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
    }
    historyStack.value.push(snapshot)
    if (historyStack.value.length > maxHistory) historyStack.value.shift()
    historyIndex.value = historyStack.value.length - 1
  }

  function undo() {
    if (historyIndex.value <= 0) return
    historyIndex.value--
    const snapshot = historyStack.value[historyIndex.value]
    objects.value = JSON.parse(JSON.stringify(snapshot.objects))
    links.value = JSON.parse(JSON.stringify(snapshot.links))
  }

  function redo() {
    if (historyIndex.value >= historyStack.value.length - 1) return
    historyIndex.value++
    const snapshot = historyStack.value[historyIndex.value]
    objects.value = JSON.parse(JSON.stringify(snapshot.objects))
    links.value = JSON.parse(JSON.stringify(snapshot.links))
  }

  return {
    objects,
    links,
    selectedId,
    connectionStartId,
    selectedObject,
    selectedLinks,
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
    addLink,
    removeLink,
    startConnection,
    finishConnection,
    cancelConnection,
    saveAll,
    flushSave,
    clearAll,
    pushHistory,
    historyIndex,
    historyStack,
    setZoom,
    undo,
    redo,
    reset
  }
})
