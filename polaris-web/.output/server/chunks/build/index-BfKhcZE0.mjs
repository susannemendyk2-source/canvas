import { defineComponent, mergeProps, unref, ref, computed, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, resolveDynamicComponent, reactive, h, watch, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderTeleport, ssrRenderStyle, ssrRenderList, ssrRenderVNode, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderSlot } from 'vue/server-renderer';
import { Compass, Pencil, Crown, Globe, Sun, Moon, Share2, PanelRight, Clock, Bell, User, Shield, LogOut, MousePointer2, Move, ImagePlus, Layers3, PanelLeft, Clock3, CircleHelp, Settings, Save, Plus, Trash2, WandSparkles, BoxSelect, FileText, FileVideo, LayoutTemplate, Clapperboard, Boxes, Play, X, Loader2, Workflow, Merge, Undo2, Redo2, ZoomOut, ZoomIn, Maximize2, ImageIcon, Sparkles, Send, Star, Ellipsis, File, ExternalLink, EyeOff, Eye, RefreshCw, GripVertical, Cable, Copy, Image, Video, Download, Upload, ArrowRight } from 'lucide-vue-next';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { a as useSettingsStore, d as useAuthStore, c as useRoute, b as api, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineStore } from 'pinia';
import { VueFlow, Handle, Position } from '@vue-flow/core';
import { Background, BackgroundVariant } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';
import 'axios';

function providerKeyFor(kind, provider) {
  if (kind === "chat") return "chat";
  if (kind === "image") return `image-${provider || "openai"}`;
  return "video-default";
}
function readApiConfig(kind) {
  return {};
}
function saveApiConfig(kind, config) {
  return;
}
function applyApiConfig(kind, payload) {
  const config = readApiConfig();
  const next = { ...payload };
  if (!next.model && config.model) next.model = config.model;
  return next;
}
async function loadProviderConfigsFromBackend() {
  const providers = await aiService.getProviders();
  const list = Array.isArray(providers) ? providers : Array.isArray(providers?.data) ? providers.data : [];
  for (const item of list) {
    if (!item?.provider) continue;
    if (item.provider === "chat") {
      saveApiConfig("chat", {
        baseUrl: item.baseUrl || "",
        apiKey: item.apiKey || "",
        model: item.model || ""
      });
    } else if (item.provider.startsWith("image-")) {
      saveApiConfig("image", {
        provider: item.provider.replace(/^image-/, "") || "openai",
        baseUrl: item.baseUrl || "",
        apiKey: item.apiKey || "",
        secretKey: item.secretKey || "",
        model: item.model || ""
      });
    } else if (item.provider === "jimeng" || item.provider === "jimeng-4") {
      saveApiConfig("image", {
        baseUrl: item.baseUrl || "",
        apiKey: item.apiKey || "",
        secretKey: item.secretKey || "",
        model: item.model || ""
      });
    } else if (item.provider.startsWith("video-") || item.provider === "video-default") {
      saveApiConfig("video", {
        provider: item.provider === "video-default" ? "openai" : item.provider.replace(/^video-/, "") || "openai",
        baseUrl: item.baseUrl || "",
        apiKey: item.apiKey || "",
        model: item.model || ""
      });
    }
  }
  return list;
}
const aiService = {
  chat: (data) => api.post("/api/ai/chat", data),
  imageGenerate: (data) => api.post("/api/ai/image/generate", data),
  videoGenerate: (data) => api.post("/api/ai/video/generate", data),
  promptEnhance: (data) => api.post("/api/ai/prompt/enhance", data),
  getTasks: (data) => api.post("/api/ai/tasks/status", data),
  getProviders: () => api.get("/api/ai/providers"),
  saveProviders: (data) => api.put("/api/ai/providers", data)
};
const projectService = {
  list: (params) => api.get("/api/projects", { params }),
  get: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post("/api/projects", data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
  duplicate: (id) => api.post(`/api/projects/${id}/duplicate`),
  getPublic: (params) => api.get("/api/projects/public", { params }),
  getObjects: (projectId) => api.get(`/api/projects/${projectId}/objects`),
  createObject: (projectId, data) => api.post(`/api/projects/${projectId}/objects`, data),
  updateObject: (projectId, objectId, data) => api.put(`/api/projects/${projectId}/objects/${objectId}`, data),
  deleteObject: (projectId, objectId) => api.delete(`/api/projects/${projectId}/objects/${objectId}`),
  batchUpdatePositions: (projectId, data) => api.put(`/api/projects/${projectId}/objects/batch`, data)
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "FloatingButton",
  __ssrInlineRender: true,
  props: {
    type: { default: "button" },
    disabled: { type: Boolean, default: false },
    title: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: __props.type,
        disabled: __props.disabled,
        title: __props.title,
        class: "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 text-sm text-white/88 transition hover:border-cyan-300/35 hover:bg-white/12 disabled:pointer-events-none disabled:opacity-40"
      }, _attrs))} data-v-55132fc0>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/FloatingButton.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const FloatingButton = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$l, [["__scopeId", "data-v-55132fc0"]]), { __name: "UiFloatingButton" });
let counter = 0;
function uid(prefix = "id") {
  counter++;
  return `${prefix}-${counter}-${Date.now().toString(36)}`;
}
const useAssetStore = defineStore("asset", () => {
  const history = ref([]);
  const assets = ref([]);
  const historyCount = computed(() => history.value.length);
  const assetCount = computed(() => assets.value.length);
  function addHistory(item) {
    const existing = history.value.findIndex((h2) => h2.id === item.id);
    if (existing >= 0) {
      history.value[existing] = item;
    } else {
      history.value.unshift(item);
    }
  }
  function removeHistory(id) {
    history.value = history.value.filter((h2) => h2.id !== id);
  }
  function updateHistoryStatus(id, status, progress) {
    const item = history.value.find((h2) => h2.id === id);
    if (item) {
      item.status = status;
      if (progress !== void 0) item.progress = progress;
    }
  }
  function addAsset(item) {
    assets.value.unshift(item);
  }
  function toggleFavorite(id) {
    const item = assets.value.find((a) => a.id === id);
    if (item) item.favorite = !item.favorite;
  }
  return { history, assets, historyCount, assetCount, addHistory, removeHistory, updateHistoryStatus, addAsset, toggleFavorite };
});
const useWorkspaceStore = defineStore("workspace", () => {
  const mode = ref("magic");
  const projectName = ref("Untitled Project");
  const canvasObjects = ref([]);
  function setMode(m) {
    mode.value = m;
  }
  function toggleMode() {
    mode.value = mode.value === "magic" ? "workflow" : "magic";
  }
  function setProjectName(name) {
    projectName.value = name;
  }
  return { mode, projectName, canvasObjects, setMode, toggleMode, setProjectName };
});
const useCanvasStore = defineStore("canvas", () => {
  const objects = ref([]);
  const links = ref([]);
  const selectedId = ref(null);
  const connectionStartId = ref(null);
  const activeProjectId = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const lastSavedAt = ref(null);
  const zoom = ref(86);
  const saveTimers = /* @__PURE__ */ new Map();
  let linksSaveTimer = null;
  const creatingIds = /* @__PURE__ */ new Set();
  const createPromises = /* @__PURE__ */ new Map();
  const historyStack = ref([]);
  const historyIndex = ref(-1);
  const maxHistory = 50;
  const selectedObject = computed(() => objects.value.find((item) => item.id === selectedId.value) || null);
  const selectedLinks = computed(() => links.value.filter((link) => link.sourceId === selectedId.value || link.targetId === selectedId.value));
  function loadLocalLinks(projectId = activeProjectId.value) {
    return;
  }
  function persistLocalLinks() {
    return;
  }
  function normalize(dto) {
    return {
      id: String(dto.id),
      backendId: dto.id,
      projectId: dto.projectId,
      type: dto.type || "text",
      x: dto.positionX ?? 100,
      y: dto.positionY ?? 100,
      width: dto.width ?? 320,
      height: dto.height ?? 220,
      title: dto.title || `${dto.type || "text"} card`,
      content: dto.content || "",
      meta: dto.meta,
      dirty: false
    };
  }
  function toPayload(obj) {
    return {
      type: obj.type,
      title: obj.title,
      content: obj.content,
      positionX: obj.x,
      positionY: obj.y,
      width: obj.width,
      height: obj.height,
      meta: obj.meta
    };
  }
  function getStoredProjectId() {
    return null;
  }
  async function ensureProject() {
    if (activeProjectId.value) return activeProjectId.value;
    const project = await projectService.create({
      name: `Polaris Canvas ${(/* @__PURE__ */ new Date()).toLocaleString()}`,
      mode: "magic-canvas",
      description: "Created from Polaris Studio"
    });
    activeProjectId.value = Number(project.id);
    useWorkspaceStore().setProjectName(project.name || "Polaris Canvas");
    return activeProjectId.value;
  }
  async function loadProject(projectId) {
    const id = projectId == null ? getStoredProjectId() : Number(projectId);
    if (!id || !Number.isFinite(id)) return;
    activeProjectId.value = id;
    loading.value = true;
    error.value = null;
    try {
      const [objectsResult, projectResult] = await Promise.all([
        projectService.getObjects(id),
        projectService.get(id)
      ]);
      objects.value = Array.isArray(objectsResult) ? objectsResult.map(normalize) : [];
      if (projectResult) {
        useWorkspaceStore().setProjectName(projectResult.name || projectResult.title || "Untitled Project");
      }
      if (projectResult?.meta) {
        try {
          const parsed = JSON.parse(projectResult.meta);
          if (Array.isArray(parsed)) {
            links.value = parsed;
            if (false) ;
          } else {
            loadLocalLinks(id);
          }
        } catch {
          loadLocalLinks(id);
        }
      } else {
        loadLocalLinks(id);
      }
      selectedId.value = null;
    } catch (err) {
      error.value = err?.message || err?.messageText || "Failed to load canvas";
    } finally {
      loading.value = false;
    }
  }
  function addObject(obj) {
    pushHistory();
    const item = {
      id: uid("obj"),
      type: obj.type || "text",
      x: obj.x ?? 160 + objects.value.length * 28,
      y: obj.y ?? 140 + objects.value.length * 24,
      width: obj.width ?? 320,
      height: obj.height ?? 220,
      title: obj.title || `${obj.type || "text"} card`,
      content: obj.content || "New creative asset ready for refinement.",
      meta: obj.meta,
      dirty: true
    };
    objects.value.push(item);
    selectedId.value = item.id;
    void createRemote(item.id);
    return item;
  }
  async function createRemote(id) {
    if (createPromises.has(id)) return createPromises.get(id);
    const promise = _createRemote(id);
    createPromises.set(id, promise);
    promise.finally(() => createPromises.delete(id));
    return promise;
  }
  async function _createRemote(id) {
    if (creatingIds.has(id)) return;
    creatingIds.add(id);
    try {
      const projectId = await ensureProject();
      const current = objects.value.find((object) => object.id === id);
      if (!current) return;
      const created = await projectService.createObject(projectId, toPayload(current));
      const idx = objects.value.findIndex((object) => object.id === id);
      if (idx !== -1) objects.value[idx] = normalize(created);
      migrateLinkId(id, String(created.id));
      selectedId.value = String(created.id);
      markSaved();
    } catch (err) {
      error.value = err?.message || "Saved locally. Backend sync failed.";
    } finally {
      creatingIds.delete(id);
    }
  }
  function updateObject(id, data, sync = true) {
    const idx = objects.value.findIndex((object) => object.id === id);
    if (idx === -1) return;
    const prev = objects.value[idx];
    const updated = { ...prev, ...data, dirty: true };
    objects.value[idx] = updated;
    if (data.content !== void 0 && prev.type === "prompt" && data.content !== prev.content) {
      const outgoing = links.value.filter((l) => l.sourceId === id);
      for (const link of outgoing) {
        const tgtIdx = objects.value.findIndex((o) => o.id === link.targetId);
        if (tgtIdx !== -1 && objects.value[tgtIdx].content !== data.content) {
          objects.value[tgtIdx] = { ...objects.value[tgtIdx], content: data.content, dirty: true };
          scheduleSave(objects.value[tgtIdx].id);
        }
      }
    }
    if (sync) scheduleSave(id);
  }
  function moveObject(id, x, y) {
    updateObject(id, { x, y });
  }
  function resizeObject(id, width, height) {
    updateObject(id, {
      width: Math.max(240, width),
      height: Math.max(160, height)
    });
  }
  function scheduleSave(id) {
    const existing = saveTimers.get(id);
    if (existing) clearTimeout(existing);
    saveTimers.set(id, setTimeout(() => {
      saveTimers.delete(id);
      void saveObject(id);
    }, 450));
  }
  async function flushSave(id) {
    const existing = saveTimers.get(id);
    if (existing) {
      clearTimeout(existing);
      saveTimers.delete(id);
    }
    await saveObject(id);
  }
  async function saveObject(id) {
    const obj = objects.value.find((item) => item.id === id);
    if (!obj) return;
    if (!obj.backendId) {
      await createRemote(obj.id);
      return;
    }
    try {
      await projectService.updateObject(obj.projectId || activeProjectId.value || 0, obj.backendId, toPayload(obj));
      obj.dirty = false;
      markSaved();
    } catch (err) {
      error.value = err?.message || "Failed to save canvas object";
    }
  }
  async function saveLinksToBackend() {
    if (!activeProjectId.value) return;
    await projectService.update(activeProjectId.value, { meta: JSON.stringify(links.value) });
  }
  function scheduleLinksSave() {
    if (linksSaveTimer) clearTimeout(linksSaveTimer);
    linksSaveTimer = setTimeout(() => {
      linksSaveTimer = null;
      void saveLinksToBackend();
    }, 500);
  }
  async function saveAll() {
    saving.value = true;
    error.value = null;
    try {
      await ensureProject();
      await Promise.all(objects.value.map((object) => saveObject(object.id)));
      await saveLinksToBackend();
      persistLocalLinks();
      markSaved();
      const assetStore = useAssetStore();
      if (activeProjectId.value && objects.value.length > 0) {
        assetStore.addHistory({
          id: String(activeProjectId.value),
          title: `Canvas (${objects.value.length} cards)`,
          type: "project",
          status: "success",
          progress: 100,
          createdAt: (/* @__PURE__ */ new Date()).toLocaleString()
        });
      }
    } catch (err) {
      error.value = err?.message || "Failed to save canvas";
    } finally {
      saving.value = false;
    }
  }
  function duplicateObject(id) {
    const source = objects.value.find((item) => item.id === id);
    if (!source) return;
    return addObject({
      ...source,
      x: source.x + 28,
      y: source.y + 28,
      title: `${source.title} copy`
    });
  }
  async function removeObject(id) {
    pushHistory();
    const obj = objects.value.find((item) => item.id === id);
    objects.value = objects.value.filter((item) => item.id !== id);
    links.value = links.value.filter((link) => link.sourceId !== id && link.targetId !== id);
    scheduleLinksSave();
    if (selectedId.value === id) selectedId.value = null;
    if (obj?.backendId) {
      try {
        await projectService.deleteObject(obj.projectId || activeProjectId.value || 0, obj.backendId);
        markSaved();
      } catch (err) {
        error.value = err?.message || "Failed to delete canvas object";
      }
    }
  }
  function clearAll() {
    pushHistory();
    objects.value = [];
    links.value = [];
    selectedId.value = null;
    connectionStartId.value = null;
  }
  function deleteSelected() {
    if (selectedId.value) void removeObject(selectedId.value);
  }
  function selectObject(id) {
    selectedId.value = id;
  }
  function migrateLinkId(oldId, newId) {
    if (oldId === newId) return;
    links.value = links.value.map((link) => {
      const next = { ...link };
      if (next.sourceId === oldId) {
        next.sourceId = newId;
      }
      if (next.targetId === oldId) {
        next.targetId = newId;
      }
      return next;
    });
  }
  function addLink(sourceId, targetId, label) {
    if (sourceId === targetId) return null;
    const exists = links.value.some((link2) => link2.sourceId === sourceId && link2.targetId === targetId);
    if (exists) return null;
    pushHistory();
    const link = { id: uid("link"), sourceId, targetId, label };
    links.value.push(link);
    scheduleLinksSave();
    const src = objects.value.find((o) => o.id === sourceId);
    const tgtIdx = objects.value.findIndex((o) => o.id === targetId);
    if (src?.type === "prompt" && src.content && tgtIdx !== -1 && objects.value[tgtIdx].content !== src.content) {
      objects.value[tgtIdx] = { ...objects.value[tgtIdx], content: src.content, dirty: true };
      scheduleSave(targetId);
    }
    return link;
  }
  function removeLink(id) {
    pushHistory();
    links.value = links.value.filter((link) => link.id !== id);
    scheduleLinksSave();
  }
  function startConnection(id) {
    connectionStartId.value = id;
    selectedId.value = id;
  }
  function finishConnection(targetId) {
    if (!connectionStartId.value) return null;
    const link = addLink(connectionStartId.value, targetId);
    connectionStartId.value = null;
    selectedId.value = targetId;
    return link;
  }
  function cancelConnection() {
    connectionStartId.value = null;
  }
  function setZoom(value) {
    zoom.value = Math.min(180, Math.max(30, value));
  }
  function reset() {
    objects.value = [];
    links.value = [];
    selectedId.value = null;
    connectionStartId.value = null;
    activeProjectId.value = null;
    loading.value = false;
    saving.value = false;
    error.value = null;
    lastSavedAt.value = null;
    zoom.value = 86;
    saveTimers.clear();
    if (linksSaveTimer) clearTimeout(linksSaveTimer);
    linksSaveTimer = null;
    creatingIds.clear();
    createPromises.clear();
  }
  function markSaved() {
    lastSavedAt.value = (/* @__PURE__ */ new Date()).toLocaleTimeString();
  }
  function pushHistory() {
    const snapshot = { objects: JSON.parse(JSON.stringify(objects.value)), links: JSON.parse(JSON.stringify(links.value)) };
    if (historyIndex.value < historyStack.value.length - 1) {
      historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
    }
    historyStack.value.push(snapshot);
    if (historyStack.value.length > maxHistory) historyStack.value.shift();
    historyIndex.value = historyStack.value.length - 1;
  }
  function undo() {
    if (historyIndex.value <= 0) return;
    historyIndex.value--;
    const snapshot = historyStack.value[historyIndex.value];
    objects.value = JSON.parse(JSON.stringify(snapshot.objects));
    links.value = JSON.parse(JSON.stringify(snapshot.links));
  }
  function redo() {
    if (historyIndex.value >= historyStack.value.length - 1) return;
    historyIndex.value++;
    const snapshot = historyStack.value[historyIndex.value];
    objects.value = JSON.parse(JSON.stringify(snapshot.objects));
    links.value = JSON.parse(JSON.stringify(snapshot.links));
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
  };
});
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "TopBar",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useCanvasStore();
    const settingsStore = useSettingsStore();
    const workspaceStore = useWorkspaceStore();
    const menuOpen = ref(false);
    ref();
    const menuTop = ref(0);
    const menuLeft = ref(0);
    const t = (zh, en) => settingsStore.t(zh, en);
    const userName = computed(() => authStore.user?.nickname || authStore.user?.username || "Polaris");
    const userInitial = computed(() => userName.value.charAt(0).toUpperCase());
    const userRole = computed(() => {
      const savedRole = "";
      return (authStore.roles[0] || savedRole || "USER").replace(/^ROLE_/, "");
    });
    const isAdmin = computed(() => ["ADMIN", "SUPER_ADMIN"].includes(userRole.value));
    function themeToggle() {
      settingsStore.toggleTheme();
      (void 0).documentElement.classList.toggle("light", settingsStore.theme === "light");
    }
    const renaming = ref(false);
    const renameValue = ref("");
    ref();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-cyan-100/10 bg-[#04070d]/95 px-4 backdrop-blur-xl" }, _attrs))} data-v-a0cbc035><div class="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4" data-v-a0cbc035><div class="flex min-w-0 items-center gap-3" data-v-a0cbc035><button class="flex items-center gap-3" data-v-a0cbc035>`);
      _push(ssrRenderComponent(unref(Compass), { class: "size-5 text-studio-cyan" }, null, _parent));
      _push(`<span class="text-sm font-semibold text-white" data-v-a0cbc035>Polaris</span></button>`);
      if (!unref(renaming)) {
        _push(`<div class="group flex items-center gap-1.5" data-v-a0cbc035><span class="truncate text-sm text-white/45 cursor-pointer" data-v-a0cbc035>${ssrInterpolate(unref(workspaceStore).projectName)}</span>`);
        _push(ssrRenderComponent(unref(Pencil), { class: "size-3 text-white/25 opacity-0 transition group-hover:opacity-100" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="flex items-center gap-1" data-v-a0cbc035><input${ssrRenderAttr("value", unref(renameValue))} class="h-7 w-40 rounded-md border border-cyan-400/40 bg-black/60 px-2 text-sm text-white outline-none" data-v-a0cbc035></div>`);
      }
      _push(`</div><div class="flex items-center gap-1 rounded-lg bg-black/30 p-0.5" data-v-a0cbc035><button class="${ssrRenderClass([unref(workspaceStore).mode === "magic" ? "bg-cyan-300/18 text-cyan-50 shadow-glow" : "text-white/55 hover:text-white/80", "rounded-md px-3 py-1.5 text-xs font-medium transition"])}" data-v-a0cbc035>${ssrInterpolate(t("星图画布", "Star Map"))}</button><button class="${ssrRenderClass([unref(workspaceStore).mode === "workflow" ? "bg-cyan-300/18 text-cyan-50 shadow-glow" : "text-white/55 hover:text-white/80", "rounded-md px-3 py-1.5 text-xs font-medium transition"])}" data-v-a0cbc035>${ssrInterpolate(t("节点工作流", "Workflow"))}</button></div><div class="flex items-center justify-end gap-2" data-v-a0cbc035><button class="flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-white/62 transition hover:border-cyan-200/30 hover:text-cyan-50" data-v-a0cbc035>`);
      _push(ssrRenderComponent(unref(Crown), { class: "size-3 text-cyan-100" }, null, _parent));
      _push(` ${ssrInterpolate(unref(authStore).credits.toLocaleString())}</button>`);
      _push(ssrRenderComponent(FloatingButton, {
        title: t("语言", "Language"),
        onClick: ($event) => unref(settingsStore).toggleLanguage()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Globe), { class: "size-3.5" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(settingsStore).language.toUpperCase())}`);
          } else {
            return [
              createVNode(unref(Globe), { class: "size-3.5" }),
              createTextVNode(" " + toDisplayString(unref(settingsStore).language.toUpperCase()), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(FloatingButton, {
        title: t("主题", "Theme"),
        onClick: themeToggle
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(settingsStore).theme === "light") {
              _push2(ssrRenderComponent(unref(Sun), { class: "size-3.5" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Moon), { class: "size-3.5" }, null, _parent2, _scopeId));
            }
          } else {
            return [
              unref(settingsStore).theme === "light" ? (openBlock(), createBlock(unref(Sun), {
                key: 0,
                class: "size-3.5"
              })) : (openBlock(), createBlock(unref(Moon), {
                key: 1,
                class: "size-3.5"
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(FloatingButton, {
        title: t("分享", "Share")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Share2), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Share2), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(FloatingButton, {
        title: t("侧栏", "Panel"),
        onClick: ($event) => unref(settingsStore).showPanel = !unref(settingsStore).showPanel
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PanelRight), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(PanelRight), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(FloatingButton, {
        title: t("历史", "History"),
        onClick: ($event) => unref(settingsStore).toggleHistory()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Clock), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Clock), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(FloatingButton, {
        title: t("通知", "Notifications")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Bell), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Bell), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative" data-v-a0cbc035><button class="size-8 overflow-hidden rounded-full bg-gradient-to-br from-studio-cyan to-studio-violet text-xs font-bold text-white" data-v-a0cbc035>`);
      if (unref(authStore).user?.avatar) {
        _push(`<img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="size-full object-cover" data-v-a0cbc035>`);
      } else {
        _push(`<span data-v-a0cbc035>${ssrInterpolate(unref(userInitial))}</span>`);
      }
      _push(`</button>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(menuOpen)) {
          _push2(`<div class="fixed z-[999] w-52 rounded-xl border border-white/10 bg-[#11131a]/95 py-1 shadow-glass backdrop-blur-xl" style="${ssrRenderStyle({ top: `${unref(menuTop)}px`, left: `${unref(menuLeft)}px` })}" data-v-a0cbc035><div class="border-b border-white/8 px-4 py-3" data-v-a0cbc035><p class="text-sm font-medium text-white" data-v-a0cbc035>${ssrInterpolate(unref(userName))}</p><p class="text-xs text-white/45" data-v-a0cbc035>${ssrInterpolate(unref(userRole))}</p></div><button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" data-v-a0cbc035>`);
          _push2(ssrRenderComponent(unref(User), { class: "size-4" }, null, _parent));
          _push2(` ${ssrInterpolate(t("个人中心", "Profile"))}</button>`);
          if (unref(isAdmin)) {
            _push2(`<button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8" data-v-a0cbc035>`);
            _push2(ssrRenderComponent(unref(Shield), { class: "size-4" }, null, _parent));
            _push2(` ${ssrInterpolate(t("管理后台", "Admin"))}</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="border-t border-white/8" data-v-a0cbc035><button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-300/80 transition hover:bg-white/8" data-v-a0cbc035>`);
          _push2(ssrRenderComponent(unref(LogOut), { class: "size-4" }, null, _parent));
          _push2(` ${ssrInterpolate(t("退出登录", "Logout"))}</button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div></div></div></header>`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/TopBar.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const TopBar = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$k, [["__scopeId", "data-v-a0cbc035"]]), { __name: "LayoutTopBar" });
function buildSeedancePromptOptimizerSystemPrompt(targetLanguage = "same language as the user input") {
  return `
You are a Seedance 2.0 multi-modal AI director and prompt optimization expert. Seedance 2.0 internally decomposes assets into a "spatial layer" (what is in the frame) and a "temporal layer" (how events change over time) to understand and generate video. Therefore, a good prompt is not decorative copywriting — it is an engineering instruction: who, in what scene, doing what action, how the camera moves, and in what shot order.

Output language:
- Reply in ${targetLanguage}.
- Preserve professional terms and asset references exactly: Seedance 2.0, Prompt, Workflow, @图片N, @视频N, @音频N, <主体N>, Logo.
- Return ONLY the optimized prompt. Do NOT add explanations or meta-commentary.

---

## REFERENCE SYNTAX

- Asset reference: \`@图片N\` / \`@视频N\` / \`@音频N\` (numbered in upload order, starting from 1).
- Subject reference (choose one):
  - **No prior definition**: \`<主体N>@图片N\`, emphasizing subject-asset binding. Example: \`张红@图片1\`.
  - **Multi-subject or reuse needed**: First define \`将 @图片N 中的[2-3 stable static features] 定义为 <主体N>\`, then use \`<主体N>\` throughout.
- **Asset ID shielding**: The underlying model cannot directly associate semantic-less asset IDs. NEVER write bare \`[asset-xxx]\` in action descriptions. Always bridge via \`@图片N\` / \`<主体N>\`.
- **Disambiguation**: Bare \`@图片N\` immediately followed by a verb or directional word (e.g. \`@图片1跑向…\`) triggers digit-glueing ambiguity. Rewrite as \`<主体N>@图片N\` or append a noun after \`@图片N\` (e.g. \`@图片1 中的女子\`).

---

## TASK CLASSIFICATION (classify first, then choose template)

| Type | Scenario | Recommended Template |
|---|---|---|
| **Multi-modal reference** | Action transfer, subject reuse, atmosphere borrowing | \`参考 @图片N 中的 <主体N>，生成…\` / \`参考 @视频N 中的<action/camera/style/sound>\` / \`参考 @音频N 中的音色\` |
| **Video editing** | Local replacement, subject removal, attribute modification | Add: describe \`<element feature> + <timing> + <position>\`; Modify: \`严格编辑 @视频N，将其中的<original>修改为<new>\`; Delete: specify removed element, emphasize retained elements |
| **Video extension** | Story continuation, action extension | \`向前/向后延长 @视频N，生成…\` / Track completion: \`@视频1，<transition description>，接 @视频2\` |
| **Combined task** | Reference one asset, edit another | \`参考 @图片/视频N 的[reference dimension]，严格编辑 @视频X，[specific edit]\` |

**Critical warning**: For editing/extension tasks, use \`严格编辑 @视频N\` or \`向后延长 @视频N\` directly. Do NOT write "参考 @视频N" — it will be misclassified as a reference task.

---

## EIGHT CORE ELEMENTS (checklist)

\`\`\`
Precise subject + Action details + Scene environment + Light/color mood + Camera movement + Visual style + Image quality + Constraints
\`\`\`

**Necessity table and default fill strategy:**

| # | Element | Necessity | Default if missing |
|---|---|---|---|
| 1 | Precise subject (who) | **Required** | Auto-bind via \`<主体N>@图片N\` if asset provided; keep generic ("a girl") only if no asset |
| 2 | Action details (doing what) | **Required** | Default to slow continuous small movements; refine with body-part detail + degree quantification |
| 3 | Scene environment (where) | Optional | Path A: omit or one phrase; Path B: first paragraph sets the scene |
| 4 | Light/color mood | Optional | Path A: merge into style phrase ("暖色调电影质感"); Path B: first paragraph sets tone |
| 5 | Camera movement | Optional | Path A: omit (model defaults to stable); Path B: required per shot, one movement per shot |
| 6 | Visual style | Optional | **Prefer user-specified style**; if unspecified, infer from video mood + reference assets; **Anime/non-realistic: upgrade to Required** to prevent style drift |
| 7 | Image quality | Optional | Default: \`高清，细节丰富，电影质感，色彩自然，光影柔和\`; Path A: compress to "高清电影质感" |
| 8 | Constraints (safety) | Optional (upgrade to Required for multi-person/text generation) | Default stability pack + watermark/logo shield; non-text: subtitle shield; multi-person: **must** add anti-twin shield; multi-person frontal dynamic: add stronger position constraint |

---

## WORKFLOW

### Step 0: Needs analysis & guided questions (only when user provides vague intent without concrete prompt)
If the user only gives a high-level idea (e.g. "I want a cyberpunk video", "generate a girl dancing"), enter guidance mode. Ask questions to help complete the eight elements. Do NOT fabricate details:
> Please provide more details: 1. Main character's appearance and clothing? 2. Scene (cyberpunk street / classical stage)? 3. Any reference assets like @图片1?

Proceed to Step 1 only after collecting sufficient information.

### Step 1: Task type & complexity determination
1. **Classify task type** per the task classification table above.
2. **Complexity determination (multi-modal reference only)**:
   - **Edit / Extend / Combined**: Single-point operation. Always go **Path A** directly. No complexity check needed.
   - **Multi-modal reference**: Judge from "temporal dimension" and "spatial dimension":
     - **Temporal**: Does the video contain many events / continuous actions / progressive emotional states? (Few = single continuous action; Many = multiple event chains / state transitions / dialogue exchanges)
     - **Spatial**: Does the video change locations / camera positions / does the subject traverse multiple areas? (Few = single scene fixed camera; Many = scene switching / follow-through traversal / multi-camera combination)
     - **Path A (simple)**: Both temporal AND spatial are "Few" — single scene, single continuous action / one speech / one state display. Even if dialogue is long or action has details, as long as it happens continuously in the same time-space, it's Path A.
     - **Path B (complex cinematic)**: Either temporal OR spatial is "Many" — multiple event chains ("First A then B then C") / space switching (street → store → exit) / cross-scene narrative / user input already contains "镜头1, 镜头2" cues / long story.
   - **Auxiliary signals (not standalone conditions)**: Asset count ≥ 4, user writes "镜头1/2/3", reference video is already multi-shot — these lean toward complex but must still be judged by time/space dimensions.

### Step 2: Element self-check & asset mapping (automatic)
1. **Multi-modal JSON / long text mapping**: If user pastes JSON with \`"content"\` array or similar structured text:
   - Scan all non-\`text\` objects (\`image_url\`, \`video_url\`, \`audio_url\`).
   - Auto-assign \`@图片1\`, \`@图片2\`, \`@视频1\`, \`@音频1\` in order of appearance.
   - Extract corresponding \`url\` or \`asset-xxx\` IDs.
   - Replace \`asset-xxx\` in the text with assigned labels.
2. **Long image / nine-grid**: If assets are long images or nine-grids, ask user to split into single images.
3. **Multi-view detection**: If user uploads character three-views / multi-views, suggest splitting into: close-up headshot (face only, no expression) + full-body shot (avoids twin effect and ID drift).
4. **Reference > 4 people**: If more than 4 reference people, suggest first group-generation (≤4 per group) then image-to-video.
5. **Important asset priority**: The more precision needed for an asset (e.g. face close-up), the earlier its position in the final prompt.
6. **Asset configuration strategy**: Recommended 4–5 assets: 1–2 character images (headshot + full-body) + 1 scene image + 1 camera-reference video + 1 audio. Do not max out the asset limit.

### Step 3: Element audit with graded handling

#### 3.1 Critical ambiguity detection (MUST pause for user confirmation)
Stop and present multi-choice options when:
- **Position/frame mapping unclear**: Multiple people or images without specifying left/right or first/last frame.
- **Task-type misclassification risk**: Edit/extend task containing "参考 @视频N" (should be rewritten as \`严格编辑 @视频N\` / \`向后延长 @视频N\`).
- **Explicit camera conflict**: Same shot requiring push + pull + pan + truck simultaneously.
- **Contradictory subject features**: Same \`<主体N>\` assigned conflicting static features.

Multi-choice interaction template:
> I detected the following critical ambiguities, please choose how to handle:
> 1. [Position unclear] @图片1 and @图片2 — who is on the left and who is on the right?
> 2. [Task misclassification] This is an "extend video" task. Suggest rewriting "参考 @视频1" as "向后延长 @视频1".
> 3. [Camera conflict] Shot 2 has both "push in" and "pan left". Suggest consolidating to one camera movement.
>
> Options:
> - Accept 1: @图片1 on the left, @图片2 on the right
> - Accept 2: Rewrite as "向后延长 @视频1"
> - Accept 3: Keep only "push in"
> - Other (please specify)

#### 3.2 Non-critical missing: eight-element audit + auto-complete (do NOT interrupt user)
Self-check against the eight-element table above. Items 1–2 are required; items 3–8 are optional. For missing optional items, auto-fill using the default strategies from the table and transparently disclose in the "优化问题" section of your output.

- **Path A overall feel**: Write items 1–2 clearly (who does what); fold items 3–8 into 1–2 lines at the end (e.g. "暖色调电影质感，画面稳定无变形，无字幕、无水印"). Do not expand every item.
- **Path B overall feel**: Items 1–2 are distributed across Paragraph 1 + Paragraph 2 shots; items 3–5 are woven into Paragraph 1 tone-setting and Paragraph 2 four-element shots; items 6–8 are concentrated in Paragraph 3.

Design principle: **Only interrupt the user for critical ambiguities (3.1)**. Non-critical missing elements are auto-completed and disclosed transparently.

### Step 4: Structured output (by complexity path)

**General rule**: 
- **Edit / Extend / Combined**: Always Path A (single-point operation, one-paragraph output).
- **Multi-modal reference**: Simple → Path A; ≥2 shots cinematic → Path B (three-paragraph).
- Task classification templates are **tool sets**, not top-level structures. In Path A they form the main clause of the paragraph; in Path B, shots only use \`<主体N> doing…\` reference form internally.

---

#### PATH A: Simple video (one paragraph, no section titles)

For single-shot / one-to-two-sentence requests, including all 4 task types. Do NOT force-split into "subject definition / shots / constraints" sections. Compose one paragraph:

\`\`\`
[task phrase subject], [subject-asset binding], [scene and brief action], [style and constraint pack]
\`\`\`

Examples:
- Multi-modal reference: \`参考 @图片1 中的<主体1>（短发女孩），生成她在 @图片2 的咖啡店里吃蛋糕的画面。暖色调电影质感，画面稳定无变形，保持无字幕，不要生成水印，不要生成 Logo。\`
- Single-point edit: \`严格编辑 @视频1，将其中的香水替换为 @图片1 中的面霜，动作和运镜不变。画面稳定无变形，不要生成水印，不要生成 Logo。\`
- Single-segment extension: \`向后延长 @视频1，生成两人继续走向街角并相视一笑的画面。画面稳定无变形，保持无字幕，不要生成水印，不要生成 Logo。\`

Path A MUST still append the default mandatory constraint pack (quality / stability / watermark Logo shield), folded into 1–2 clauses at the end.

---

#### PATH B: Complex cinematic scene (strict three paragraphs, almost always multi-modal reference)

For ≥2 shots / multi-subject / cinematic narrative multi-modal reference tasks. All three paragraphs are mandatory:

**Paragraph 1: Overall setting + subject definitions**
- Set overall scene and mood in one sentence (e.g. "傍晚悬崖竹林，烟雨江湖电影感" or "现代办公室文戏，自然柔和光照").
- Bind all subjects and core assets: \`<主体N>@图片N\` or \`将 @图片N 中的[2-3 stable features] 定义为 <主体N>\`.
- Multi-asset same subject: \`将 @图片1 中的[…]、@图片2 中的[…] 定义为 <主体N>\`.
- Face reference strategy (if applicable): \`<主体1> 的面部特征参考 @图片1（大头照），妆造参考 @图片2（全身照）\`.
- First/last frame constraint (if applicable): \`@图片N 作为首帧约束 / 尾帧约束\`.
- Camera reference source (if @视频N is used): declare here, e.g. \`运镜参考 @视频1 的中景推拉与轻微摇移\`.

**Paragraph 2: Shot breakdown (use only multi-modal reference form)**
- Use \`镜头1 / 镜头2 / 镜头3 …\` in sequence. Do NOT write absolute durations like \`0–3s\`. Seedance 2.0 does not reliably support precise timing.
- Each shot organized by: **camera movement → subject action & expression → position/space change → audio information**.
- **Camera limit**: One movement type per shot (push / pull / pan / truck / fixed / follow). Do not stack.
- **Action description requirements**:
  - Body-part refinement + degree quantification (hands / legs / head / shoulders + amplitude / speed / force).
  - **Prefer slow continuous small movements**, avoid sprinting / big jumps / violent rolling.
  - Add action transition continuity (inertia carry-over, e.g. "借着转身惯性顺势抬手").
  - Externalize emotions through specific body details instead of abstract words like "sad" / "angry". Example for sad: "肩膀微微颤抖、眼眶泛红、手指攥紧衣角".
- Use strong visual reference \`<主体N>\` or \`<主体N>@图片N\` for actions and positions:
  - Correct: \`<主体1>（李武）站起身走向 <主体2>（苏有）\`, \`@图片2 中的女生位于画面左侧\`.
  - Wrong: \`@图片2位于…\` (digit glue), \`@图片1跑向…\` (bare verb).

**Paragraph 3: Style + constraint pack** (auto-attach standard packs by scenario)
- Overall art direction / visual style.
- **Quality pack** (always mandatory): \`高清，细节丰富，电影质感，色彩自然，光影柔和\`.
- **Stability pack** (always mandatory): \`人物面部稳定不变形、五官清晰、动作连贯自然，不僵硬，无穿模无卡顿\`.
- **Subtitle shield** (non-text-generation always mandatory): \`保持无字幕，避免生成任何文字或字幕\`.
- **Watermark/Logo shield** (always mandatory): \`不要生成水印；不要生成 Logo\`.
- **Anti-twin shield** (multi-person scenes always mandatory): \`视频全程禁止出现外形、着装、配饰完全一致的人物，禁止生成同款分身、双胞胎效果，同一画面中仅保留单个对应人物，不出现人物重复复刻\`.
- **Style anchor** (anime/non-realistic always mandatory): Explicitly write \`2D 日漫风格\` / \`3D 国风漫画\` / \`赛博朋克冷蓝紫色调\` etc.
- **Strong position constraint** (multi-person frontal dynamic): Write strong directional descriptions like "左侧角色穿灰蓝色作训服", paired with fixed camera to avoid warp/face-jump.

> **Text generation templates** (ad slogan / subtitle / speech bubble) are orthogonal to task type — can be used in both Path A and B.

#### Practical examples

**Path A example** (input: 1 image + "the girl in @图片1 is eating cake at a coffee shop"):
> \`参考 @图片1 中的<主体1>（短发女孩），生成她坐在窗边咖啡店里专注吃蛋糕的画面，暖黄色光线柔和洒落。高清电影质感，画面稳定无变形，保持无字幕，不要生成水印，不要生成 Logo。\`

**Path B example** (input: 3 images + 1 video + 1 audio, dormitory emotional short drama, 3 shots):

> 整体设定为现代女生宿舍傍晚文戏，自然柔和光照。\`<主体1> 的面部特征参考 @图片1（大头照），妆造参考 @图片2（全身照）\`；\`将 @图片3 中的简约木质宿舍 定义为 <场景1>\`；运镜参考 @视频1 的中景推拉与轻微摇移；环境音色参考 @音频1。
>
> 镜头 1：中景平稳跟拍，<主体1> 脚步轻快地走到 <场景1> 门口，暖黄色日光从窗外洒进走廊，她在门口停顿一下，深呼吸，表情略带紧张，伴随轻微的脚步声与远处室内话语声。
>
> 镜头 2：镜头切到室内中景，<主体1> 推门进入，舍友们一边整理书本一边抬头看向她，其中一人笑着问 \`{考得怎么样呀，过了吗}\`，镜头在几人之间缓慢切换半身特写。
>
> 镜头 3：近景特写，<主体1> 先低头露出落寞表情，随后抬头憋不住笑意说 \`{骗你们的}\`，舍友们追着打闹起来，镜头缓慢拉远定格在宿舍内一片欢声笑语的全景。
>
> 全程画面高清电影纪实风，色调温暖，光影柔和；人物面部稳定不变形、五官清晰、动作连贯自然，不僵硬，无穿模无卡顿；保持无字幕，不要生成水印，不要生成 Logo；视频全程禁止出现外形、着装、配饰完全一致的人物，禁止生成同款分身、双胞胎效果。

#### Optimization issues section (transparency disclosure)
After the optimized prompt, include a section listing:
1. **Auto-filled non-critical missing items** (e.g. auto-attached quality pack; defaulted to slow continuous small movements; etc.)
2. **Detected issues** (e.g. missing elements, camera conflict, bare Asset ID, task misclassification, absolute timestamps, etc.)

#### Related principles
List the Seedance 2.0 engineering principles applied to the detected issues (e.g. Asset ID Shielding Principle, Disambiguation Principle, One-Camera-Per-Shot Principle, Shot-Order-Before-Absolute-Time Principle, Anti-Twin Principle, Important-Asset-First Principle, etc.)

---

## AUDIO CHANNEL

- **Voice reference**: \`参考 @音频N 中的音色，生成…\`; if voice fidelity is poor, supplement with detailed voice description (e.g. \`使用 @音频1 低厚温润带细碎颗粒感中年男声的音色说\`) and keep dialogue style close to reference audio tone.
- **Dialogue language consistency**: Avoid mixing Chinese and English (except proper nouns); mark minority language dialogue with language tag, e.g. \`用日语说道 {こんにちは}\`.
- **Chinese pronunciation shield**: The model may mispronounce polyphonic / rare / similar-looking characters. Rewrite with common homophones (e.g. "螭龙山" → "吃龙山") and disclose in the optimization issues section.
- **End-of-video noise**: Voiceover-containing videos may have truncated noise at the end. Recommend post-processing fade-out via editing software (non-mandatory suggestion).

---

## SPECIAL CHARACTER STANDARDS (mandatory)

| Information Type | Symbol | Example |
|---|---|---|
| Background music | \`（）\` | \`（背景中播放着快节奏的摇滚乐）\` |
| Sound effect | \`<>\` | \`<远处传来狗叫声>\` |
| Dialogue | \`{}\` | \`{你好，世界}\`; minority language needs language tag |
| Subtitle / Title | \`【】\` | \`【第一章：启程】\` |

---

## TEXT GENERATION THREE TEMPLATES

- **Ad slogan**: \`「text content」+「timing」+「position」+「appearance」，「text features (color, style)」\`.
- **Subtitle**: \`画面底部出现字幕，字幕内容为"…"，字幕需与音频节奏完全同步\`.
- **Speech bubble**: \`<role>说："…"，角色说话时周围出现气泡，气泡里写着台词\`.

---

## MANDATORY CONSTRAINTS SUMMARY
- **Task type first → multi-modal reference then check complexity**: Edit / extend / combined always Path A; multi-modal reference goes Path A or Path B by complexity. Task classification templates are tool sets, not top-level structure.
- **Critical ambiguity never silently modified**: Only pause for user confirmation on the four critical ambiguity types in 3.1. Ordinary element gaps auto-fill and transparently disclose.
- **Mandatory shield packs**: Final output MUST include quality pack + stability pack + watermark/Logo shield; add subtitle shield / anti-twin shield / style anchor by scenario.
- **Asset ID shielding**: NEVER let \`[asset-xxx]\` appear bare in action descriptions. Always bridge via \`@图片N\` / \`<主体N>\`.
- **Disambiguation**: \`@图片N\` followed by verb or directional word must be rewritten as \`<主体N>@图片N\` or with a noun separator.
- **One camera per shot**: Each shot specifies exactly 1 camera movement type. No push+pull+pan stacking.
- **Shot order before absolute time**: Use \`镜头1 / 镜头2 / …\`, not \`0–3s\` absolute timestamps.
- **Complex multi-person frontal dynamic**: MUST use strong position constraint + fixed camera + anti-twin shield to avoid warp/face-jump/identical-clones.
- **Face reference best practice**: Use headshot + full-body shot. **BAN multi-view / three-view images** (they trigger ID drift and twin effect).

Your final answer must be the optimized Seedance 2.0 prompt only, following the rules above.
`.trim();
}
const useWorkflowStore = defineStore("workflow", () => {
  const nodes = ref([]);
  const edges = ref([]);
  const selectedNodeId = ref(null);
  const running = ref(false);
  const labels = {
    prompt: "Prompt",
    "image-gen": "Image Generation",
    "video-gen": "Video Generation",
    enhance: "Enhance",
    merge: "Merge",
    output: "Output"
  };
  const defaultModels = {
    prompt: "",
    "image-gen": "dall-e-3",
    "video-gen": "jimeng-video-3.5-pro",
    enhance: "deepseek-v4-flash",
    merge: "",
    output: ""
  };
  const defaultSizes = {
    "image-gen": "1024x1024"
  };
  function addNode(type, x, y) {
    const node = {
      id: uid("wf"),
      type: "base-workflow",
      position: { x, y },
      data: {
        label: labels[type] || type,
        nodeType: type,
        status: "idle",
        progress: 0,
        icon: type,
        model: defaultModels[type] || void 0,
        size: defaultSizes[type] || void 0
      }
    };
    nodes.value.push(node);
    return node;
  }
  function removeNode(id) {
    nodes.value = nodes.value.filter((n) => n.id !== id);
    edges.value = edges.value.filter((e) => e.source !== id && e.target !== id);
    if (selectedNodeId.value === id) selectedNodeId.value = null;
  }
  function updateNodeData(id, data) {
    const node = nodes.value.find((n) => n.id === id);
    if (node) Object.assign(node.data, data);
  }
  function addEdge(source, target) {
    if (!source || !target || source === target) return null;
    const exists = edges.value.some((e) => e.source === source && e.target === target);
    if (exists) return null;
    const edge = {
      id: uid("edge"),
      source,
      target,
      animated: true,
      style: { stroke: "rgba(103,232,249,.72)" }
    };
    edges.value.push(edge);
    return edge;
  }
  function addRoute(types, startX = 220, startY = 220) {
    const added = types.map((type, index) => addNode(type, startX + index * 300, startY + index * 70));
    for (let i = 0; i < added.length - 1; i += 1) {
      addEdge(added[i].id, added[i + 1].id);
    }
    return added;
  }
  function selectNode(id) {
    selectedNodeId.value = id;
  }
  function clear() {
    nodes.value = [];
    edges.value = [];
    selectedNodeId.value = null;
  }
  async function pollTaskResult(taskId) {
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 2e3));
      try {
        const res = await aiService.getTasks(applyApiConfig("video", { taskId }));
        if (res?.url) return res.url;
        if (res?.status && res.status !== "pending" && res.status !== "running") return null;
      } catch {
        return null;
      }
    }
    return null;
  }
  async function runWorkflow() {
    if (running.value || nodes.value.length === 0) return;
    running.value = true;
    for (const node of nodes.value) {
      node.data.status = "idle";
      node.data.progress = 0;
      node.data.output = "";
      node.data.error = "";
    }
    try {
      const inDegree = {};
      const graph = {};
      const reverseGraph = {};
      for (const node of nodes.value) {
        inDegree[node.id] = 0;
        graph[node.id] = [];
        reverseGraph[node.id] = [];
      }
      for (const edge of edges.value) {
        graph[edge.source]?.push(edge.target);
        reverseGraph[edge.target]?.push(edge.source);
        inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
      }
      const queue = Object.entries(inDegree).filter(([, d]) => d === 0).map(([id]) => id);
      const sorted = [];
      while (queue.length) {
        const id = queue.shift();
        sorted.push(id);
        for (const neighbor of graph[id] || []) {
          inDegree[neighbor]--;
          if (inDegree[neighbor] === 0) queue.push(neighbor);
        }
      }
      const outputs = {};
      for (const nodeId of sorted) {
        const node = nodes.value.find((n) => n.id === nodeId);
        if (!node) continue;
        const predecessors = reverseGraph[nodeId] || [];
        const inputText = predecessors.map((p) => outputs[p]).filter(Boolean).join("\n") || node.data.prompt || "";
        node.data.status = "running";
        node.data.progress = 10;
        try {
          let result = "";
          const nodeType = node.data.nodeType;
          if (nodeType === "prompt") {
            result = inputText;
          } else if (nodeType === "image-gen") {
            node.data.progress = 30;
            const res = await aiService.imageGenerate(applyApiConfig("image", {
              model: node.data.model || "dall-e-3",
              prompt: inputText,
              size: node.data.size || "1024x1024"
            }));
            node.data.progress = 80;
            if (res?.url) {
              result = res.url;
            } else {
              throw new Error(res?.error || "No image URL returned");
            }
          } else if (nodeType === "video-gen") {
            node.data.progress = 30;
            const res = await aiService.videoGenerate(applyApiConfig("video", {
              model: node.data.model || "jimeng-video-3.5-pro",
              prompt: inputText
            }));
            node.data.progress = 60;
            if (res?.url) {
              result = res.url;
            } else if (res?.taskId) {
              node.data.progress = 70;
              const url = await pollTaskResult(res.taskId);
              if (url) {
                result = url;
              } else {
                throw new Error(res?.error || "Video generation failed or timed out");
              }
            } else {
              throw new Error(res?.error || "No video URL returned");
            }
          } else if (nodeType === "enhance") {
            node.data.progress = 30;
            const res = await aiService.promptEnhance(applyApiConfig("chat", {
              messages: [
                { role: "system", content: buildSeedancePromptOptimizerSystemPrompt("the same language as the user input") },
                { role: "user", content: inputText }
              ]
            }));
            node.data.progress = 80;
            if (res?.content) {
              result = res.content;
            } else {
              throw new Error("Prompt enhancement failed");
            }
          } else if (nodeType === "merge") {
            result = predecessors.map((p) => outputs[p]).filter(Boolean).join("\n---\n") || inputText;
          } else if (nodeType === "output") {
            result = inputText;
          }
          outputs[nodeId] = result;
          node.data.output = result;
          node.data.progress = 100;
          node.data.status = "success";
        } catch (err) {
          node.data.error = err?.message || "Node execution failed";
          node.data.status = "failed";
          node.data.progress = 0;
        }
      }
    } finally {
      running.value = false;
    }
  }
  return {
    nodes,
    edges,
    selectedNodeId,
    running,
    addNode,
    removeNode,
    updateNodeData,
    addEdge,
    addRoute,
    selectNode,
    clear,
    runWorkflow
  };
});
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "LeftToolbar",
  __ssrInlineRender: true,
  setup(__props) {
    const canvasStore = useCanvasStore();
    useSettingsStore();
    useWorkflowStore();
    useWorkspaceStore();
    const tools = [
      { key: "select", icon: MousePointer2, label: "选择 / Select" },
      { key: "move", icon: Move, label: "移动 / Move" },
      { key: "add", icon: ImagePlus, label: "添加 / Add" },
      { key: "assets", icon: Layers3, label: "素材 / Assets" },
      { key: "templates", icon: PanelLeft, label: "模板 / Templates" },
      { key: "history", icon: Clock3, label: "历史 / History" },
      { key: "help", icon: CircleHelp, label: "帮助 / Help" },
      { key: "settings", icon: Settings, label: "设置 / Settings" }
    ];
    const toastMsg = ref("");
    const toastError = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "flex w-16 flex-col items-center gap-1 border-r border-cyan-100/10 bg-[#050811]/82 py-3 backdrop-blur-xl" }, _attrs))}><!--[-->`);
      ssrRenderList(tools, (tool) => {
        _push(`<button class="grid size-10 place-items-center rounded-lg text-white/58 transition hover:bg-cyan-100/10 hover:text-cyan-50"${ssrRenderAttr("title", tool.label)}>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tool.icon), { class: "size-4" }, null), _parent);
        _push(`</button>`);
      });
      _push(`<!--]--><div class="mt-auto flex flex-col items-center gap-1"><button class="grid size-10 place-items-center rounded-lg text-white/58 transition hover:bg-cyan-100/10 hover:text-cyan-50 disabled:opacity-40" title="保存 / Save"${ssrIncludeBooleanAttr(unref(canvasStore).saving) ? " disabled" : ""}>`);
      if (unref(canvasStore).saving) {
        _push(`<span class="inline-block size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>`);
      } else {
        _push(ssrRenderComponent(unref(Save), { class: "size-4" }, null, _parent));
      }
      _push(`</button><button class="grid size-10 place-items-center rounded-lg text-white/38 transition hover:bg-cyan-100/10 hover:text-cyan-50" title="新建画布 / New Canvas">`);
      _push(ssrRenderComponent(unref(Plus), { class: "size-4" }, null, _parent));
      _push(`</button><button class="grid size-10 place-items-center rounded-lg text-white/38 transition hover:bg-red-500/15 hover:text-red-400" title="清空 / Clear">`);
      _push(ssrRenderComponent(unref(Trash2), { class: "size-4" }, null, _parent));
      _push(`</button><button class="grid size-10 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100" title="生成 / Generate">`);
      _push(ssrRenderComponent(unref(WandSparkles), { class: "size-4" }, null, _parent));
      _push(`</button>`);
      _push(ssrRenderComponent(unref(BoxSelect), { class: "size-4 text-white/25" }, null, _parent));
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(toastMsg)) {
          _push2(`<div class="${ssrRenderClass([unref(toastError) ? "bg-red-500/90 text-white" : "bg-emerald-500/90 text-white", "fixed bottom-6 left-20 z-[999] rounded-lg px-3 py-2 text-xs shadow-lg backdrop-blur"])}">${ssrInterpolate(unref(toastMsg))}</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</aside>`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/LeftToolbar.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const LeftToolbar = Object.assign(_sfc_main$j, { __name: "LayoutLeftToolbar" });
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "PromptCard",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const polishing = ref(false);
    const tags = ["9:16", "cinematic", "macro", "soft glass"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-3 flex items-center justify-between"><div class="flex items-center gap-2 text-xs text-cyan-100">`);
      _push(ssrRenderComponent(unref(WandSparkles), { class: "size-4" }, null, _parent));
      _push(` ${ssrInterpolate(t("Prompt 配方", "Prompt recipe"))}</div>`);
      if (__props.content) {
        _push(`<button class="flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-[11px] text-cyan-100 transition hover:bg-cyan-300/18"${ssrIncludeBooleanAttr(polishing.value) ? " disabled" : ""}>`);
        if (polishing.value) {
          _push(`<span class="inline-block size-3 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>`);
        } else {
          _push(ssrRenderComponent(unref(Sparkles), { class: "size-3" }, null, _parent));
        }
        _push(` ${ssrInterpolate(polishing.value ? t("润色中...", "Polishing...") : t("润色", "Polish"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><textarea class="min-h-32 w-full resize-none rounded-xl border border-white/8 bg-[#0d0f15] p-3 text-sm leading-6 text-white/72 outline-none focus:border-cyan-300/30"${ssrRenderAttr("placeholder", t("描述场景、产品、氛围、约束或生成路线...", "Describe the scene, product, mood, constraints, or generation route..."))}>${ssrInterpolate(__props.content)}</textarea><div class="mt-3 flex flex-wrap gap-1.5"><!--[-->`);
      ssrRenderList(tags, (tag) => {
        _push(`<span class="rounded-full border border-cyan-100/10 px-2 py-0.5 text-[11px] text-white/45">${ssrInterpolate(tag)}</span>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/canvas/PromptCard.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const PromptCard = Object.assign(_sfc_main$i, { __name: "CanvasPromptCard" });
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "ImageCard",
  __ssrInlineRender: true,
  props: {
    content: {},
    meta: {}
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const promptText = ref(props.content || "");
    watch(() => props.content, (v) => {
      if (v !== void 0) promptText.value = v;
    });
    const selectedModel = ref("jimeng-4.0");
    const selectedSize = ref("1024x1024");
    const sizeOptions = {
      "dall-e-3": [
        { value: "1024x1024", label: "1024×1024" },
        { value: "1024x1792", label: "1024×1792" },
        { value: "1792x1024", label: "1792×1024" }
      ],
      "dall-e-2": [
        { value: "256x256", label: "256×256" },
        { value: "512x512", label: "512×512" },
        { value: "1024x1024", label: "1024×1024" }
      ],
      "jimeng-4.0": [
        { value: "1024x1024", label: "1024×1024" },
        { value: "1024x1792", label: "1024×1792" },
        { value: "1792x1024", label: "1792×1024" },
        { value: "1920x1920", label: "1920×1920" }
      ],
      "jimeng-5.0": [
        { value: "2048x2048", label: "2048×2048 (Seedream 5.0)" },
        { value: "1920x1920", label: "1920×1920" }
      ],
      "jimeng-agent": [
        { value: "2048x2048", label: "2048×2048 (Seedream 5.0)" },
        { value: "1920x1920", label: "1920×1920" }
      ]
    };
    const defaultSize = {
      "dall-e-3": "1024x1024",
      "dall-e-2": "1024x1024",
      "jimeng-4.0": "1024x1024",
      "jimeng-5.0": "2048x2048",
      "jimeng-agent": "2048x2048"
    };
    const availableSizes = computed(() => sizeOptions[selectedModel.value] || sizeOptions["dall-e-3"]);
    watch(selectedModel, (model) => {
      const valid = sizeOptions[model]?.find((s) => s.value === selectedSize.value);
      if (!valid) selectedSize.value = defaultSize[model] || "1024x1024";
    });
    const generating = ref(false);
    const generatedUrl = ref("");
    ref("");
    if (props.meta) {
      try {
        const p = JSON.parse(props.meta);
        if (p.generatedUrl) generatedUrl.value = p.generatedUrl;
      } catch {
      }
    }
    watch(() => props.meta, (v) => {
      if (v) try {
        const p = JSON.parse(v);
        if (p.generatedUrl) generatedUrl.value = p.generatedUrl;
      } catch {
      }
    });
    ref();
    const safeUrl = computed(() => {
      const u = generatedUrl.value;
      if (u && (u.startsWith("http") || u.startsWith("data:"))) return u;
      return "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><div class="flex items-center justify-between text-xs text-white/70"><span class="inline-flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(WandSparkles), { class: "size-4" }, null, _parent));
      _push(` ${ssrInterpolate(t("图像", "Image"))}</span><div class="flex gap-1">`);
      if (safeUrl.value) {
        _push(`<button class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72">`);
        _push(ssrRenderComponent(unref(Download), { class: "mr-1 inline size-3.5" }, null, _parent));
        _push(` ${ssrInterpolate(t("下载", "Download"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72">`);
      _push(ssrRenderComponent(unref(Upload), { class: "mr-1 inline size-3.5" }, null, _parent));
      _push(` ${ssrInterpolate(t("上传", "Upload"))}</button></div><input type="file" accept="image/*" class="hidden"></div><div class="relative">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ImageIcon), { class: "size-12 text-white/28" }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]" }, [
                createVNode(unref(ImageIcon), { class: "size-12 text-white/28" })
              ])
            ];
          }
        })
      }, _parent));
      _push(`</div><div class="rounded-xl border border-white/10 bg-[#0d0f15] p-3"><textarea class="min-h-20 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/62 outline-none focus:border-cyan-300/30"${ssrRenderAttr("placeholder", t("输入 Prompt、参考素材或编辑说明...", "Prompt, references, edit notes..."))}>${ssrInterpolate(promptText.value)}</textarea><div class="mt-4 flex flex-wrap items-center gap-2 text-xs"><select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none"><option value="dall-e-3"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "dall-e-3") : ssrLooseEqual(selectedModel.value, "dall-e-3")) ? " selected" : ""}>DALL-E 3</option><option value="dall-e-2"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "dall-e-2") : ssrLooseEqual(selectedModel.value, "dall-e-2")) ? " selected" : ""}>DALL-E 2</option><option value="jimeng-4.0"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "jimeng-4.0") : ssrLooseEqual(selectedModel.value, "jimeng-4.0")) ? " selected" : ""}>Seedream 4.0</option><option value="jimeng-5.0"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "jimeng-5.0") : ssrLooseEqual(selectedModel.value, "jimeng-5.0")) ? " selected" : ""}>Seedream 5.0</option><option value="jimeng-agent"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "jimeng-agent") : ssrLooseEqual(selectedModel.value, "jimeng-agent")) ? " selected" : ""}>Seedream Agent</option></select><select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none"><!--[-->`);
      ssrRenderList(availableSizes.value, (s) => {
        _push(`<option${ssrRenderAttr("value", s.value)}${ssrIncludeBooleanAttr(Array.isArray(selectedSize.value) ? ssrLooseContain(selectedSize.value, s.value) : ssrLooseEqual(selectedSize.value, s.value)) ? " selected" : ""}>${ssrInterpolate(s.label)}</option>`);
      });
      _push(`<!--]--></select><button class="${ssrRenderClass([generating.value ? "bg-white/30" : "bg-violet-300 hover:bg-violet-200", "ml-auto grid size-9 place-items-center rounded-full text-black transition"])}"${ssrIncludeBooleanAttr(generating.value || !promptText.value) ? " disabled" : ""}>`);
      if (generating.value) {
        _push(`<span class="inline-block size-4 animate-spin rounded-full border-2 border-black/30 border-t-black"></span>`);
      } else {
        _push(ssrRenderComponent(unref(ArrowRight), { class: "size-4" }, null, _parent));
      }
      _push(`</button></div></div></div>`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/canvas/ImageCard.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const ImageCard = Object.assign(_sfc_main$h, { __name: "CanvasImageCard" });
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "VideoCard",
  __ssrInlineRender: true,
  props: {
    content: {},
    meta: {},
    objectId: {}
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const promptText = ref(props.content || "");
    watch(() => props.content, (v) => {
      if (v !== void 0) promptText.value = v;
    });
    const savedVideoConfig = readApiConfig();
    const selectedModel = ref(savedVideoConfig.model || "seedance-2.0");
    const selectedDuration = ref(5);
    const selectedResolution = ref("720p");
    const selectedRatio = ref("16:9");
    const generating = ref(false);
    const generatedUrl = ref("");
    const errorMsg = ref("");
    const polling = ref(false);
    ref(false);
    if (props.meta) {
      try {
        const p = JSON.parse(props.meta);
        if (p.generatedUrl) generatedUrl.value = p.generatedUrl;
      } catch {
      }
    }
    watch(() => props.meta, (v) => {
      if (v) try {
        const p = JSON.parse(v);
        if (p.generatedUrl) generatedUrl.value = p.generatedUrl;
      } catch {
      }
    });
    ref();
    const elapsed = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><div class="flex items-center justify-between text-xs text-white/70"><span class="inline-flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Clapperboard), { class: "size-4" }, null, _parent));
      _push(` ${ssrInterpolate(t("视频", "Video"))}</span><div class="flex gap-1">`);
      if (generatedUrl.value && (generatedUrl.value.startsWith("http") || generatedUrl.value.startsWith("data:") || generatedUrl.value.startsWith("blob:"))) {
        _push(`<button class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72">`);
        _push(ssrRenderComponent(unref(Download), { class: "mr-1 inline size-3.5" }, null, _parent));
        _push(` ${ssrInterpolate(t("下载", "Download"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72">`);
      _push(ssrRenderComponent(unref(Upload), { class: "mr-1 inline size-3.5" }, null, _parent));
      _push(` ${ssrInterpolate(t("上传", "Upload"))}</button></div><input type="file" accept="image/*,video/*" class="hidden"></div><div class="relative">`);
      if (generatedUrl.value && (generatedUrl.value.startsWith("http") || generatedUrl.value.startsWith("data:") || generatedUrl.value.startsWith("blob:"))) {
        _push(`<div class="overflow-hidden rounded-xl border border-white/20"><video${ssrRenderAttr("src", generatedUrl.value)} controls class="w-full"></video></div>`);
      } else if (errorMsg.value) {
        _push(`<div class="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/8 p-4 text-center" style="${ssrRenderStyle({ "aspect-ratio": "16/9" })}"><p class="text-xs text-red-400">${ssrInterpolate(errorMsg.value)}</p><p class="text-[11px] text-white/40">${ssrInterpolate(t("请修改提示词或参考图片后重试", "Modify your prompt or reference image and try again"))}</p></div>`);
      } else {
        _push(`<div class="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]">`);
        if (!generating.value) {
          _push(ssrRenderComponent(unref(Play), { class: "size-14 text-white/28" }, null, _parent));
        } else {
          _push(`<span class="inline-block size-8 animate-spin rounded-full border-2 border-white/40 border-t-studio-cyan"></span>`);
        }
        _push(`</div>`);
      }
      if (polling.value) {
        _push(`<div class="absolute inset-0 grid place-items-center rounded-xl bg-black/60"><div class="flex flex-col items-center gap-2"><span class="inline-block size-6 animate-spin rounded-full border-2 border-white/40 border-t-studio-cyan"></span><span class="text-xs text-white/60">${ssrInterpolate(t("处理中...", "Processing..."))}</span><span class="text-[11px] text-white/40">${ssrInterpolate(elapsed.value)}s</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="rounded-xl border border-white/10 bg-[#0d0f15] p-3"><textarea class="min-h-20 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/62 outline-none focus:border-cyan-300/30"${ssrRenderAttr("placeholder", t("描述视频内容、镜头运动、时长和参考素材...", "Describe the video, camera motion, duration, and references..."))}>${ssrInterpolate(promptText.value)}</textarea><div class="mt-4 flex flex-wrap items-center gap-2 text-xs"><select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none"><option value="seedance-2.0"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "seedance-2.0") : ssrLooseEqual(selectedModel.value, "seedance-2.0")) ? " selected" : ""}>Seedance 2.0 Fast</option><option value="aura-video"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "aura-video") : ssrLooseEqual(selectedModel.value, "aura-video")) ? " selected" : ""}>Aura Video v1</option><option value="jimeng-video-3.5-pro"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "jimeng-video-3.5-pro") : ssrLooseEqual(selectedModel.value, "jimeng-video-3.5-pro")) ? " selected" : ""}>即梦 Video 3.5 Pro</option><option value="jimeng-video-seedance-2.0"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "jimeng-video-seedance-2.0") : ssrLooseEqual(selectedModel.value, "jimeng-video-seedance-2.0")) ? " selected" : ""}>即梦 Seedance 2.0</option><option value="jimeng-video-seedance-2.0-fast"${ssrIncludeBooleanAttr(Array.isArray(selectedModel.value) ? ssrLooseContain(selectedModel.value, "jimeng-video-seedance-2.0-fast") : ssrLooseEqual(selectedModel.value, "jimeng-video-seedance-2.0-fast")) ? " selected" : ""}>即梦 Seedance 2.0 Fast</option></select><select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none"><option value="5"${ssrIncludeBooleanAttr(Array.isArray(selectedDuration.value) ? ssrLooseContain(selectedDuration.value, "5") : ssrLooseEqual(selectedDuration.value, "5")) ? " selected" : ""}>5s</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(selectedDuration.value) ? ssrLooseContain(selectedDuration.value, "10") : ssrLooseEqual(selectedDuration.value, "10")) ? " selected" : ""}>10s</option><option value="15"${ssrIncludeBooleanAttr(Array.isArray(selectedDuration.value) ? ssrLooseContain(selectedDuration.value, "15") : ssrLooseEqual(selectedDuration.value, "15")) ? " selected" : ""}>15s</option></select><select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none"><option value="480p"${ssrIncludeBooleanAttr(Array.isArray(selectedResolution.value) ? ssrLooseContain(selectedResolution.value, "480p") : ssrLooseEqual(selectedResolution.value, "480p")) ? " selected" : ""}>480p</option><option value="720p"${ssrIncludeBooleanAttr(Array.isArray(selectedResolution.value) ? ssrLooseContain(selectedResolution.value, "720p") : ssrLooseEqual(selectedResolution.value, "720p")) ? " selected" : ""}>720p</option><option value="1080p"${ssrIncludeBooleanAttr(Array.isArray(selectedResolution.value) ? ssrLooseContain(selectedResolution.value, "1080p") : ssrLooseEqual(selectedResolution.value, "1080p")) ? " selected" : ""}>1080p</option></select><select class="rounded-full border border-white/10 bg-[#161b25] px-3 py-1.5 text-white/72 outline-none"><option value="16:9"${ssrIncludeBooleanAttr(Array.isArray(selectedRatio.value) ? ssrLooseContain(selectedRatio.value, "16:9") : ssrLooseEqual(selectedRatio.value, "16:9")) ? " selected" : ""}>16:9</option><option value="9:16"${ssrIncludeBooleanAttr(Array.isArray(selectedRatio.value) ? ssrLooseContain(selectedRatio.value, "9:16") : ssrLooseEqual(selectedRatio.value, "9:16")) ? " selected" : ""}>9:16</option><option value="1:1"${ssrIncludeBooleanAttr(Array.isArray(selectedRatio.value) ? ssrLooseContain(selectedRatio.value, "1:1") : ssrLooseEqual(selectedRatio.value, "1:1")) ? " selected" : ""}>1:1</option><option value="4:3"${ssrIncludeBooleanAttr(Array.isArray(selectedRatio.value) ? ssrLooseContain(selectedRatio.value, "4:3") : ssrLooseEqual(selectedRatio.value, "4:3")) ? " selected" : ""}>4:3</option><option value="3:4"${ssrIncludeBooleanAttr(Array.isArray(selectedRatio.value) ? ssrLooseContain(selectedRatio.value, "3:4") : ssrLooseEqual(selectedRatio.value, "3:4")) ? " selected" : ""}>3:4</option><option value="21:9"${ssrIncludeBooleanAttr(Array.isArray(selectedRatio.value) ? ssrLooseContain(selectedRatio.value, "21:9") : ssrLooseEqual(selectedRatio.value, "21:9")) ? " selected" : ""}>21:9</option></select><button class="${ssrRenderClass([generating.value ? "bg-white/30" : "bg-violet-300 hover:bg-violet-200", "ml-auto grid size-9 place-items-center rounded-full text-black transition"])}"${ssrIncludeBooleanAttr(generating.value || !promptText.value) ? " disabled" : ""}>`);
      if (generating.value) {
        _push(`<span class="inline-block size-4 animate-spin rounded-full border-2 border-black/30 border-t-black"></span>`);
      } else {
        _push(ssrRenderComponent(unref(ArrowRight), { class: "size-4" }, null, _parent));
      }
      _push(`</button></div></div></div>`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/canvas/VideoCard.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const VideoCard = Object.assign(_sfc_main$g, { __name: "CanvasVideoCard" });
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "CanvasCard",
  __ssrInlineRender: true,
  props: {
    object: {},
    selected: { type: Boolean },
    connecting: { type: Boolean }
  },
  emits: ["select", "delete", "duplicate", "move", "resize", "update", "sendToWorkflow", "startConnect"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const isDragging = ref(false);
    function updateContent(valueOrEvent) {
      if (typeof valueOrEvent === "object" && !(valueOrEvent instanceof Event)) {
        emit("update", valueOrEvent);
        return;
      }
      const content = typeof valueOrEvent === "string" ? valueOrEvent : valueOrEvent.target.value;
      emit("update", { content });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["glass group absolute rounded-lg border p-3 transition-[border-color,opacity,transform] duration-150", [
          __props.selected ? "border-cyan-300/45 shadow-glow" : "border-white/10",
          __props.connecting ? "ring-2 ring-emerald-300/60" : "",
          isDragging.value ? "z-50 scale-[1.02] opacity-80 shadow-2xl" : ""
        ]],
        style: { left: __props.object.x + "px", top: __props.object.y + "px", width: __props.object.width + "px", minHeight: __props.object.height + "px", touchAction: isDragging.value ? "none" : "" }
      }, _attrs))}><div class="mb-3 flex items-center justify-between gap-3"><div class="flex min-w-0 flex-1 items-center gap-2"><div class="${ssrRenderClass([{ "cursor-grabbing": isDragging.value }, "grid size-7 shrink-0 cursor-grab place-items-center rounded text-white/35 hover:bg-white/8 hover:text-white/70"])}">`);
      _push(ssrRenderComponent(unref(GripVertical), { class: "size-4" }, null, _parent));
      _push(`</div><input${ssrRenderAttr("value", __props.object.title)} class="min-w-0 flex-1 truncate rounded border border-transparent bg-transparent px-1 py-1 text-sm font-medium text-white/86 outline-none focus:border-cyan-300/30 focus:bg-black/20"></div><div class="${ssrRenderClass([{ "opacity-100": __props.selected }, "flex opacity-0 transition group-hover:opacity-100"])}"><button${ssrRenderAttr("title", t("连接", "Connect"))} class="grid size-7 place-items-center rounded hover:bg-white/10 hover:text-emerald-200">`);
      _push(ssrRenderComponent(unref(Cable), { class: "size-3.5" }, null, _parent));
      _push(`</button><button${ssrRenderAttr("title", t("复制", "Duplicate"))} class="grid size-7 place-items-center rounded hover:bg-white/10">`);
      _push(ssrRenderComponent(unref(Copy), { class: "size-3.5" }, null, _parent));
      _push(`</button><button${ssrRenderAttr("title", t("发送到 Workflow", "Send to workflow"))} class="grid size-7 place-items-center rounded hover:bg-white/10">`);
      _push(ssrRenderComponent(unref(Workflow), { class: "size-3.5" }, null, _parent));
      _push(`</button><button${ssrRenderAttr("title", t("删除", "Delete"))} class="grid size-7 place-items-center rounded hover:bg-white/10 hover:text-red-300">`);
      _push(ssrRenderComponent(unref(Trash2), { class: "size-3.5" }, null, _parent));
      _push(`</button></div></div>`);
      if (__props.object.type === "prompt") {
        _push(ssrRenderComponent(PromptCard, {
          content: __props.object.content,
          onUpdate: updateContent
        }, null, _parent));
      } else if (["image", "generated", "moodboard", "reference"].includes(__props.object.type)) {
        _push(ssrRenderComponent(ImageCard, {
          content: __props.object.content,
          meta: __props.object.meta,
          onUpdate: updateContent
        }, null, _parent));
      } else if (__props.object.type === "video") {
        _push(ssrRenderComponent(VideoCard, {
          content: __props.object.content,
          meta: __props.object.meta,
          "object-id": __props.object.id,
          onUpdate: updateContent
        }, null, _parent));
      } else {
        _push(`<textarea class="min-h-28 w-full resize-none rounded-lg border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/72 outline-none focus:border-cyan-300/30">${ssrInterpolate(__props.object.content)}</textarea>`);
      }
      _push(`<div class="absolute bottom-1 right-1 size-4 cursor-nwse-resize rounded-sm border-b border-r border-cyan-100/35 opacity-0 transition group-hover:opacity-100"></div></div>`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/canvas/CanvasCard.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const CanvasCard = Object.assign(_sfc_main$f, { __name: "CanvasCard" });
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "CanvasMinimap",
  __ssrInlineRender: true,
  setup(__props) {
    const canvasStore = useCanvasStore();
    const typeClasses = {
      prompt: "border-cyan-200/60 bg-cyan-200/35",
      image: "border-violet-200/60 bg-violet-200/35",
      video: "border-blue-200/60 bg-blue-200/35",
      moodboard: "border-emerald-200/60 bg-emerald-200/35",
      generated: "border-amber-200/60 bg-amber-200/35"
    };
    const minimapItems = computed(() => {
      const objects = canvasStore.objects;
      if (!objects.length) return [];
      const minX = Math.min(...objects.map((item) => item.x));
      const minY = Math.min(...objects.map((item) => item.y));
      const maxX = Math.max(...objects.map((item) => item.x + item.width));
      const maxY = Math.max(...objects.map((item) => item.y + item.height));
      const width = Math.max(1, maxX - minX);
      const height = Math.max(1, maxY - minY);
      const pad = 8;
      return objects.map((item) => ({
        id: item.id,
        left: pad + (item.x - minX) / width * (100 - pad * 2),
        top: pad + (item.y - minY) / height * (100 - pad * 2),
        width: Math.max(5, item.width / width * (100 - pad * 2)),
        height: Math.max(6, item.height / height * (100 - pad * 2)),
        className: typeClasses[item.type] || "border-white/50 bg-white/25"
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute bottom-20 right-5 z-30 h-32 w-48 overflow-hidden rounded border border-cyan-100/14 bg-[#0b1018]/82 shadow-glass backdrop-blur" }, _attrs))}><div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[length:16px_16px]"></div><div class="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-wide text-white/38">Map</div><div class="absolute inset-x-3 bottom-3 top-6"><!--[-->`);
      ssrRenderList(minimapItems.value, (item) => {
        _push(`<div class="${ssrRenderClass([item.className, "absolute rounded-sm border"])}" style="${ssrRenderStyle({ left: `${item.left}%`, top: `${item.top}%`, width: `${item.width}%`, height: `${item.height}%` })}"></div>`);
      });
      _push(`<!--]-->`);
      if (unref(canvasStore).objects.length === 0) {
        _push(`<div class="grid h-full place-items-center text-[10px] text-white/30"> Empty </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/canvas/CanvasMinimap.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const CanvasMinimap = Object.assign(_sfc_main$e, { __name: "CanvasMinimap" });
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "MagicCanvas",
  __ssrInlineRender: true,
  setup(__props) {
    const canvasStore = useCanvasStore();
    const settingsStore = useSettingsStore();
    const workspaceStore = useWorkspaceStore();
    const canvasRoot = ref(null);
    useRoute();
    const contextMenu = reactive({ visible: false, x: 0, y: 0, canvasX: 0, canvasY: 0 });
    const panX = ref(0);
    const panY = ref(0);
    let isPanning = false;
    const t = (zh, en) => settingsStore.t(zh, en);
    const waypointTypes = computed(() => [
      { type: "prompt", label: t("Prompt 提示词", "Prompt"), icon: FileText },
      { type: "image", label: t("图像", "Image"), icon: ImagePlus },
      { type: "video", label: t("视频", "Video"), icon: FileVideo },
      { type: "moodboard", label: t("分镜", "Storyboard"), icon: LayoutTemplate }
    ]);
    const starterRoutes = computed(() => [
      { kind: "video", title: t("短视频路线", "Short video route"), subtitle: "Prompt -> Image -> Video", icon: Clapperboard },
      { kind: "poster", title: t("海报地图", "Poster map"), subtitle: t("Prompt -> 图像 -> 导出", "Prompt -> Image -> Export"), icon: ImagePlus },
      { kind: "storyboard", title: t("分镜路线", "Storyboard"), subtitle: t("故事 -> 分镜帧", "Story -> Frames"), icon: Boxes }
    ]);
    const linkPaths = computed(() => {
      return canvasStore.links.map((link) => {
        const source = canvasStore.objects.find((item) => item.id === link.sourceId);
        const target = canvasStore.objects.find((item) => item.id === link.targetId);
        if (!source || !target) return null;
        const startX = source.x + source.width;
        const startY = source.y + source.height / 2;
        const endX = target.x;
        const endY = target.y + target.height / 2;
        const gap = Math.max(80, Math.abs(endX - startX) * 0.42);
        return {
          id: link.id,
          path: `M ${startX} ${startY} C ${startX + gap} ${startY}, ${endX - gap} ${endY}, ${endX} ${endY}`,
          midX: (startX + endX) / 2,
          midY: (startY + endY) / 2
        };
      }).filter(Boolean);
    });
    function handleCardSelect(id) {
      if (canvasStore.connectionStartId && canvasStore.connectionStartId !== id) {
        canvasStore.finishConnection(id);
        return;
      }
      canvasStore.selectObject(id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "canvasRoot",
        ref: canvasRoot,
        "data-canvas-root": "true",
        class: ["dotted-grid absolute inset-0 overflow-hidden bg-[#03050b]", { "cursor-grab": !unref(isPanning), "cursor-grabbing": unref(isPanning) }],
        tabindex: "0"
      }, _attrs))}><div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,.10),transparent_32%)]"></div>`);
      if (unref(canvasStore).loading) {
        _push(`<div class="absolute inset-0 z-50 grid place-items-center bg-black/30 text-sm text-white/60">${ssrInterpolate(t("正在加载画布...", "Loading canvas..."))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute left-6 top-5 z-30 rounded-full border border-cyan-100/12 bg-black/45 px-3 py-1.5 text-xs text-white/45 backdrop-blur">${ssrInterpolate(t("Polaris 星图画布", "Polaris Star Map Canvas"))}</div>`);
      if (unref(canvasStore).connectionStartId) {
        _push(`<div class="absolute left-1/2 top-5 z-40 -translate-x-1/2 rounded-full border border-emerald-200/25 bg-emerald-300/10 px-4 py-2 text-xs text-emerald-100 backdrop-blur">${ssrInterpolate(t("选择另一张卡片完成连接。点击空白画布可取消。", "Pick another card to connect. Click empty canvas to cancel."))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute right-6 top-7 z-30 flex items-center gap-2"><button data-no-canvas-menu="true" class="rounded-lg border border-cyan-100/12 bg-black/45 px-4 py-2 text-sm text-white/84 backdrop-blur transition hover:border-cyan-200/35">`);
      _push(ssrRenderComponent(unref(Plus), { class: "mr-2 inline size-4" }, null, _parent));
      _push(` ${ssrInterpolate(t("添加 Prompt", "Add Prompt"))}</button><button data-no-canvas-menu="true" class="rounded-lg border border-cyan-100/12 bg-black/45 px-4 py-2 text-sm text-white/84 backdrop-blur transition hover:border-cyan-200/35">`);
      _push(ssrRenderComponent(unref(Play), { class: "mr-2 inline size-4" }, null, _parent));
      _push(` ${ssrInterpolate(t("运行 Workflow", "Run Workflow"))}</button></div>`);
      if (unref(canvasStore).objects.length === 0) {
        _push(`<div class="absolute inset-0 z-10 grid place-items-center px-8"><div class="max-w-2xl text-center"><div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs text-white/58">`);
        _push(ssrRenderComponent(unref(Compass), { class: "size-3.5 text-cyan-100" }, null, _parent));
        _push(` ${ssrInterpolate(t("双击空白区域添加节点", "Double click an empty area to add a node"))}</div><div class="mb-6 grid gap-3 sm:grid-cols-3"><!--[-->`);
        ssrRenderList(starterRoutes.value, (route2) => {
          _push(`<button class="rounded-xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200/35 hover:bg-cyan-100/8">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(route2.icon), { class: "mb-3 size-5 text-cyan-100" }, null), _parent);
          _push(`<div class="text-sm font-semibold text-white/88">${ssrInterpolate(route2.title)}</div><div class="mt-1 text-xs leading-5 text-white/45">${ssrInterpolate(route2.subtitle)}</div></button>`);
        });
        _push(`<!--]--></div><div class="flex flex-wrap justify-center gap-3"><!--[-->`);
        ssrRenderList(waypointTypes.value, (item) => {
          _push(`<button class="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "mr-2 inline size-4" }, null), _parent);
          _push(` ${ssrInterpolate(item.label)}</button>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (contextMenu.visible) {
        _push(`<div class="fixed z-[999] w-64 rounded-2xl border border-cyan-100/14 bg-[#111722]/95 p-3 shadow-glass backdrop-blur-xl" style="${ssrRenderStyle({ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` })}"><div class="mb-3 flex items-center justify-between"><div class="text-sm font-medium">${ssrInterpolate(t("添加节点", "Add Node"))}</div><button class="grid size-7 place-items-center rounded-lg text-white/42 hover:bg-white/8 hover:text-white">`);
        _push(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent));
        _push(`</button></div><div class="grid gap-2"><!--[-->`);
        ssrRenderList(waypointTypes.value, (item) => {
          _push(`<button class="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-left text-sm text-white/70 hover:border-cyan-200/30 hover:text-cyan-50">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "size-4" }, null), _parent);
          _push(` ${ssrInterpolate(item.label)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-canvas-surface="true" class="${ssrRenderClass([{ "pointer-events-none": unref(canvasStore).objects.length === 0 }, "absolute inset-0 z-20 origin-top-left"])}" style="${ssrRenderStyle({ transform: `translate(${panX.value}px, ${panY.value}px) scale(${unref(canvasStore).zoom / 100})`, width: `${1e4 / unref(canvasStore).zoom}%`, height: `${1e4 / unref(canvasStore).zoom}%` })}"><svg class="pointer-events-none absolute left-0 top-0 h-[4000px] w-[4000px] overflow-visible" data-canvas-surface="true"><defs><marker id="canvas-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(103,232,249,.72)"></path></marker></defs><!--[-->`);
      ssrRenderList(linkPaths.value, (edge) => {
        _push(`<g class="pointer-events-auto"><path${ssrRenderAttr("d", edge.path)} class="cursor-pointer fill-none stroke-cyan-200/55 transition hover:stroke-cyan-100" stroke-width="2" stroke-linecap="round" marker-end="url(#canvas-arrow)"></path><circle${ssrRenderAttr("cx", edge.midX)}${ssrRenderAttr("cy", edge.midY)} r="3" class="fill-cyan-100/80"></circle></g>`);
      });
      _push(`<!--]--></svg><!--[-->`);
      ssrRenderList(unref(canvasStore).objects, (obj) => {
        _push(ssrRenderComponent(CanvasCard, {
          key: obj.id,
          object: obj,
          selected: unref(canvasStore).selectedId === obj.id,
          connecting: unref(canvasStore).connectionStartId === obj.id,
          onSelect: ($event) => handleCardSelect(obj.id),
          onDelete: ($event) => unref(canvasStore).removeObject(obj.id),
          onDuplicate: ($event) => unref(canvasStore).duplicateObject(obj.id),
          onSendToWorkflow: ($event) => unref(workspaceStore).setMode("workflow"),
          onStartConnect: ($event) => unref(canvasStore).startConnection(obj.id),
          onMove: (x, y) => unref(canvasStore).moveObject(obj.id, x, y),
          onResize: (width, height) => unref(canvasStore).resizeObject(obj.id, width, height),
          onUpdate: (data) => unref(canvasStore).updateObject(obj.id, data)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(CanvasMinimap, null, null, _parent));
      if (unref(canvasStore).error) {
        _push(`<div class="absolute bottom-24 left-6 z-50 rounded-lg border border-red-300/20 bg-red-950/50 px-3 py-2 text-xs text-red-100">${ssrInterpolate(unref(canvasStore).error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/canvas/MagicCanvas.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const MagicCanvas = Object.assign(_sfc_main$d, { __name: "CanvasMagicCanvas" });
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "NodeMenu",
  __ssrInlineRender: true,
  emits: ["select"],
  setup(__props) {
    const nodeTypes = [
      { key: "prompt", icon: FileText, label: "Prompt" },
      { key: "image-gen", icon: Image, label: "Image Generation" },
      { key: "video-gen", icon: Video, label: "Video Generation" },
      { key: "enhance", icon: Sparkles, label: "Enhance" },
      { key: "merge", icon: Merge, label: "Merge" },
      { key: "output", icon: ExternalLink, label: "Output" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-white/10 bg-[#11131a]/95 p-2 shadow-glass backdrop-blur-xl" }, _attrs))}><!--[-->`);
      ssrRenderList(nodeTypes, (node) => {
        _push(`<button class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/68 transition hover:bg-white/8 hover:text-cyan-50">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(node.icon), { class: "size-4" }, null), _parent);
        _push(` ${ssrInterpolate(node.label)}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/workflow/NodeMenu.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const NodeMenu = Object.assign(_sfc_main$c, { __name: "WorkflowNodeMenu" });
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "StatusBadge",
  __ssrInlineRender: true,
  props: {
    status: { default: "idle" }
  },
  setup(__props) {
    const props = __props;
    const colorMap = {
      idle: { dot: "bg-white/25", border: "border-white/10", text: "text-white/55" },
      queued: { dot: "bg-studio-warning", border: "border-studio-warning/30", text: "text-studio-warning" },
      running: { dot: "bg-studio-cyan", border: "border-studio-cyan/30", text: "text-studio-cyan" },
      success: { dot: "bg-studio-success", border: "border-studio-success/30", text: "text-studio-success" },
      failed: { dot: "bg-studio-danger", border: "border-studio-danger/30", text: "text-studio-danger" }
    };
    const labelMap = {
      idle: "待运行 / idle",
      queued: "排队 / queued",
      running: "运行中 / running",
      success: "成功 / success",
      failed: "失败 / failed"
    };
    const badgeClass = computed(() => {
      const c = colorMap[props.status];
      return [c.border, c.text].join(" ");
    });
    const dotClass = computed(() => colorMap[props.status].dot);
    const label = computed(() => labelMap[props.status]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-normal", badgeClass.value]
      }, _attrs))}><span class="${ssrRenderClass([dotClass.value, "size-1.5 rounded-full"])}"></span> ${ssrInterpolate(label.value)}</span>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/StatusBadge.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const StatusBadge = Object.assign(_sfc_main$b, { __name: "UiStatusBadge" });
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "BaseWorkflowNode",
  __ssrInlineRender: true,
  props: {
    data: {}
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const iconMap = {
      prompt: FileText,
      "image-gen": Image,
      "video-gen": Video,
      enhance: Sparkles,
      merge: Merge,
      output: ExternalLink
    };
    const iconComponent = computed(() => iconMap[props.data.nodeType] || FileText);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-[300px] rounded-lg border border-white/10 bg-[#11131a]/90 p-3 shadow-glass backdrop-blur-xl" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Handle), {
        type: "target",
        position: unref(Position).Left,
        class: "!border-white/10 !bg-white/8"
      }, null, _parent));
      _push(`<div class="mb-2 flex items-center gap-2">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), { class: "size-4 text-studio-cyan" }, null), _parent);
      _push(`<span class="text-sm font-medium text-white/80">${ssrInterpolate(__props.data.label)}</span><div class="ml-auto">`);
      _push(ssrRenderComponent(StatusBadge, {
        status: __props.data.status
      }, null, _parent));
      _push(`</div></div>`);
      if (__props.data.nodeType === "prompt") {
        _push(`<div class="mb-2"><textarea class="min-h-[60px] w-full resize-none rounded-lg border border-white/8 bg-black/20 p-2 text-xs leading-5 text-white/72 outline-none focus:border-cyan-300/30" placeholder="Enter your prompt...">${ssrInterpolate(__props.data.prompt)}</textarea></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.data.nodeType === "image-gen" || __props.data.nodeType === "video-gen") {
        _push(`<div class="mb-2 flex gap-1">`);
        if (__props.data.nodeType === "image-gen") {
          _push(`<select class="flex-1 rounded border border-white/10 bg-[#161b25] px-2 py-1 text-[10px] text-white/72 outline-none"${ssrRenderAttr("value", __props.data.model || "dall-e-3")}><option value="dall-e-3">DALL-E 3</option><option value="dall-e-2">DALL-E 2</option><option value="jimeng-4.0">即梦 4.0</option><option value="jimeng-5.0">即梦 5.0</option></select>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.data.nodeType === "video-gen") {
          _push(`<select class="flex-1 rounded border border-white/10 bg-[#161b25] px-2 py-1 text-[10px] text-white/72 outline-none"${ssrRenderAttr("value", __props.data.model || "jimeng-video-3.5-pro")}><option value="jimeng-video-3.5-pro">即梦 Video 3.5 Pro</option><option value="jimeng-video-seedance-2.0">即梦 Seedance 2.0</option><option value="seedance-2.0">Seedance 2.0 Fast</option></select>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.data.nodeType === "image-gen") {
          _push(`<select class="rounded border border-white/10 bg-[#161b25] px-2 py-1 text-[10px] text-white/72 outline-none"${ssrRenderAttr("value", __props.data.size || "1024x1024")}><option value="1024x1024">1:1</option><option value="1024x1792">9:16</option><option value="1792x1024">16:9</option></select>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.data.output && __props.data.nodeType === "image-gen") {
        _push(`<div class="mb-2 overflow-hidden rounded-lg border border-white/10"><img${ssrRenderAttr("src", __props.data.output)} class="w-full object-cover" alt="Generated"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.data.output && __props.data.nodeType === "video-gen") {
        _push(`<div class="mb-2 overflow-hidden rounded-lg border border-white/10"><video${ssrRenderAttr("src", __props.data.output)} controls class="w-full"></video></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.data.error) {
        _push(`<div class="mb-2 rounded-lg border border-red-500/30 bg-red-500/8 p-2"><p class="text-[10px] text-red-400">${ssrInterpolate(__props.data.error)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.data.output && (__props.data.nodeType === "prompt" || __props.data.nodeType === "enhance" || __props.data.nodeType === "merge" || __props.data.nodeType === "output")) {
        _push(`<div class="mb-2"><div class="max-h-[80px] overflow-y-auto rounded-lg border border-white/8 bg-black/20 p-2 text-[10px] leading-5 text-white/60">${ssrInterpolate(__props.data.output)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.data.nodeType) {
        _push(`<div class="mb-2"><div class="flex items-center justify-between text-xs text-white/45"><span>Input</span><span>Output</span></div><div class="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-studio-cyan transition-all" style="${ssrRenderStyle({ width: __props.data.progress + "%" })}"></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Handle), {
        type: "source",
        position: unref(Position).Right,
        class: "!border-white/10 !bg-white/8"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/workflow/nodes/BaseWorkflowNode.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const BaseWorkflowNode = Object.assign(_sfc_main$a, { __name: "WorkflowNodesBaseWorkflowNode" });
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "WorkflowCanvas",
  __ssrInlineRender: true,
  setup(__props) {
    const workflowStore = useWorkflowStore();
    const root = ref(null);
    const menu = reactive({ visible: false, x: 0, y: 0, flowX: 220, flowY: 220 });
    function handleNodeUpdate(id, payload) {
      workflowStore.updateNodeData(id, payload);
    }
    function addNodeFromMenu(type) {
      workflowStore.addNode(type, menu.flowX, menu.flowY);
      menu.visible = false;
    }
    function handleConnect(connection) {
      workflowStore.addEdge(connection.source, connection.target);
    }
    function handleNodeClick(event) {
      workflowStore.selectNode(event.node?.id || null);
    }
    function handleNodesDelete(nodes) {
      nodes.forEach((node) => workflowStore.removeNode(node.id));
    }
    function closeMenu() {
      menu.visible = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "root",
        ref: root,
        class: "absolute inset-0 bg-[#03050b]"
      }, _attrs))}><div class="absolute left-6 top-5 z-30 rounded-full border border-cyan-100/12 bg-black/45 px-3 py-1.5 text-xs text-white/45 backdrop-blur"> Node Workflow Canvas </div><div class="absolute right-6 top-7 z-30 flex items-center gap-2"><button class="rounded-lg border border-cyan-100/12 bg-black/45 px-4 py-2 text-sm text-white/84 backdrop-blur transition hover:border-cyan-200/35">`);
      _push(ssrRenderComponent(unref(Plus), { class: "mr-2 inline size-4" }, null, _parent));
      _push(` Add Node </button><button class="rounded-lg border border-cyan-100/12 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-50 backdrop-blur transition hover:border-cyan-200/35"${ssrIncludeBooleanAttr(unref(workflowStore).running) ? " disabled" : ""}>`);
      if (unref(workflowStore).running) {
        _push(ssrRenderComponent(unref(Loader2), { class: "mr-2 inline size-4 animate-spin" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Play), { class: "mr-2 inline size-4" }, null, _parent));
      }
      _push(` ${ssrInterpolate(unref(workflowStore).running ? "Running..." : "Run Workflow")}</button><button class="rounded-lg border border-cyan-100/12 bg-black/45 px-3 py-2 text-sm text-white/64 backdrop-blur transition hover:border-red-200/35 hover:text-red-100">`);
      _push(ssrRenderComponent(unref(Trash2), { class: "size-4" }, null, _parent));
      _push(`</button></div>`);
      if (unref(workflowStore).nodes.length === 0) {
        _push(`<div class="absolute inset-0 z-10 grid place-items-center px-8"><div class="max-w-2xl text-center"><div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs text-white/58">`);
        _push(ssrRenderComponent(unref(Workflow), { class: "size-3.5 text-cyan-100" }, null, _parent));
        _push(` Double click or right click to add workflow nodes </div><div class="grid gap-3 sm:grid-cols-3"><button class="rounded-xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200/35">`);
        _push(ssrRenderComponent(unref(FileVideo), { class: "mb-3 size-5 text-cyan-100" }, null, _parent));
        _push(`<div class="text-sm font-semibold text-white/88">Video route</div><div class="mt-1 text-xs leading-5 text-white/45">Prompt -&gt; Image -&gt; Video -&gt; Output</div></button><button class="rounded-xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200/35">`);
        _push(ssrRenderComponent(unref(ImagePlus), { class: "mb-3 size-5 text-cyan-100" }, null, _parent));
        _push(`<div class="text-sm font-semibold text-white/88">Poster route</div><div class="mt-1 text-xs leading-5 text-white/45">Prompt -&gt; Image -&gt; Enhance -&gt; Output</div></button><button class="rounded-xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200/35">`);
        _push(ssrRenderComponent(unref(Merge), { class: "mb-3 size-5 text-cyan-100" }, null, _parent));
        _push(`<div class="text-sm font-semibold text-white/88">Merge route</div><div class="mt-1 text-xs leading-5 text-white/45">Prompt -&gt; Image -&gt; Video -&gt; Merge</div></button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (menu.visible) {
        _push(`<div class="fixed z-[999] w-64 rounded-2xl border border-cyan-100/14 bg-[#111722]/95 p-2 shadow-glass backdrop-blur-xl" style="${ssrRenderStyle({ left: `${menu.x}px`, top: `${menu.y}px` })}">`);
        _push(ssrRenderComponent(NodeMenu, { onSelect: addNodeFromMenu }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(VueFlow), {
        nodes: unref(workflowStore).nodes,
        "onUpdate:nodes": ($event) => unref(workflowStore).nodes = $event,
        edges: unref(workflowStore).edges,
        "onUpdate:edges": ($event) => unref(workflowStore).edges = $event,
        "fit-view-on-init": "",
        class: "h-full w-full bg-[#03050b]",
        onConnect: handleConnect,
        onNodeClick: handleNodeClick,
        onPaneClick: closeMenu,
        onNodesDelete: handleNodesDelete
      }, {
        "node-base-workflow": withCtx((nodeProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(BaseWorkflowNode, mergeProps(nodeProps, {
              onUpdate: ($event) => handleNodeUpdate(nodeProps.id, $event)
            }), null, _parent2, _scopeId));
          } else {
            return [
              createVNode(BaseWorkflowNode, mergeProps(nodeProps, {
                onUpdate: ($event) => handleNodeUpdate(nodeProps.id, $event)
              }), null, 16, ["onUpdate"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Background), {
              variant: unref(BackgroundVariant).Dots,
              gap: 28,
              "pattern-color": "rgba(255,255,255,0.11)"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(MiniMap), {
              pannable: "",
              zoomable: "",
              "mask-color": "rgba(0,0,0,.42)",
              "node-color": "#66E4FF"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Controls), { position: "bottom-right" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Background), {
                variant: unref(BackgroundVariant).Dots,
                gap: 28,
                "pattern-color": "rgba(255,255,255,0.11)"
              }, null, 8, ["variant"]),
              createVNode(unref(MiniMap), {
                pannable: "",
                zoomable: "",
                "mask-color": "rgba(0,0,0,.42)",
                "node-color": "#66E4FF"
              }),
              createVNode(unref(Controls), { position: "bottom-right" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/workflow/WorkflowCanvas.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const WorkflowCanvas = Object.assign(_sfc_main$9, { __name: "WorkflowCanvas" });
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "BottomToolbar",
  __ssrInlineRender: true,
  setup(__props) {
    const workspaceStore = useWorkspaceStore();
    const canvasStore = useCanvasStore();
    const canUndo = computed(() => canvasStore.historyIndex > 0);
    const canRedo = computed(() => canvasStore.historyIndex < canvasStore.historyStack.length - 1);
    function zoomIn() {
      canvasStore.setZoom(canvasStore.zoom + 10);
    }
    function zoomOut() {
      canvasStore.setZoom(canvasStore.zoom - 10);
    }
    function fitScreen() {
      canvasStore.setZoom(86);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-cyan-100/12 bg-black/60 p-2 shadow-glass backdrop-blur-xl" }, _attrs))}><div class="flex items-center gap-1">`);
      _push(ssrRenderComponent(FloatingButton, {
        title: "撤销 / Undo",
        disabled: !unref(canUndo),
        onClick: ($event) => unref(canvasStore).undo()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Undo2), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Undo2), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(FloatingButton, {
        title: "重做 / Redo",
        disabled: !unref(canRedo),
        onClick: ($event) => unref(canvasStore).redo()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Redo2), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Redo2), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="${ssrRenderClass([unref(workspaceStore).mode === "magic" ? "border border-cyan-300/35 bg-cyan-300/12 text-cyan-50" : "", "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/72 transition"])}">`);
      _push(ssrRenderComponent(unref(Compass), { class: "size-3.5" }, null, _parent));
      _push(` 星图画布 / Star Map </button><button class="${ssrRenderClass([unref(workspaceStore).mode === "workflow" ? "border border-cyan-300/35 bg-cyan-300/12 text-cyan-50" : "", "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/72 transition"])}">`);
      _push(ssrRenderComponent(unref(Workflow), { class: "size-3.5" }, null, _parent));
      _push(` 节点工作流 / Workflow </button>`);
      _push(ssrRenderComponent(FloatingButton, {
        title: "缩小 / Zoom Out",
        onClick: zoomOut
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ZoomOut), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ZoomOut), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="w-10 text-center text-xs text-white/55">${ssrInterpolate(unref(canvasStore).zoom)}%</span>`);
      _push(ssrRenderComponent(FloatingButton, {
        title: "放大 / Zoom In",
        onClick: zoomIn
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ZoomIn), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ZoomIn), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(FloatingButton, {
        title: "适配屏幕 / Fit screen",
        onClick: fitScreen
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Maximize2), { class: "size-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Maximize2), { class: "size-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/BottomToolbar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const BottomToolbar = Object.assign(_sfc_main$8, { __name: "LayoutBottomToolbar" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ModelSelector",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const options = [
      { value: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
      { value: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
      { value: "deepseek-r1", label: "DeepSeek R1" },
      { value: "runninghub-v2", label: "RunningHub V2" },
      { value: "volc-engine", label: "火山引擎 DeepSeek" },
      { value: "jimeng-4.0", label: "即梦 4.0" },
      { value: "jimeng-5.0", label: "即梦 5.0" },
      { value: "jimeng-agent", label: "即梦 Agent" },
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "claude-3", label: "Claude 3 Sonnet" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<select${ssrRenderAttrs(mergeProps({
        class: "h-9 w-full rounded-md border border-cyan-100/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50",
        value: __props.modelValue
      }, _attrs))}><!--[-->`);
      ssrRenderList(options, (opt) => {
        _push(`<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(opt.disabled) ? " disabled" : ""}>${ssrInterpolate(opt.label)}</option>`);
      });
      _push(`<!--]--></select>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ModelSelector.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const ModelSelector = Object.assign(_sfc_main$7, { __name: "UiModelSelector" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "SkillChips",
  __ssrInlineRender: true,
  emits: ["select"],
  setup(__props) {
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const skills = [
      { zh: "文生视频", en: "Text to Video" },
      { zh: "图像生成", en: "Image Generation" },
      { zh: "视频编辑", en: "Video Editing" },
      { zh: "分镜", en: "Storyboard" },
      { zh: "角色设计", en: "Character Design" },
      { zh: "背景移除", en: "Background Remover" },
      { zh: "色彩分级", en: "Color Grading" },
      { zh: "音频同步", en: "Audio Sync" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap gap-2" }, _attrs))}><!--[-->`);
      ssrRenderList(skills, (skill) => {
        _push(`<button class="rounded-full border border-cyan-100/10 bg-white/6 px-3 py-1.5 text-xs text-white/68 transition hover:border-cyan-300/30 hover:text-cyan-50">${ssrInterpolate(t(skill.zh, skill.en))}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/agent/SkillChips.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const SkillChips = Object.assign(_sfc_main$6, { __name: "AgentSkillChips" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AgentPanel",
  __ssrInlineRender: true,
  setup(__props) {
    const canvasStore = useCanvasStore();
    const workflowStore = useWorkflowStore();
    const workspaceStore = useWorkspaceStore();
    const settingsStore = useSettingsStore();
    const input = ref("");
    const t = (zh, en) => settingsStore.t(zh, en);
    const selectedModel = ref("deepseek-v4-flash");
    const loading = ref(false);
    const messages = ref([
      {
        id: uid("msg"),
        role: "assistant",
        content: t("告诉我你的北极星目标，我可以把它拆成 Prompt、图像、视频和分镜路线并连接到画布。", "Tell me your north-star goal. I can create linked prompt, image, video, and storyboard routes on the canvas."),
        timestamp: Date.now()
      }
    ]);
    const quickActions = computed(() => [
      { key: "video", label: t("视频", "Video"), icon: Clapperboard },
      { key: "image", label: t("图像", "Image"), icon: ImageIcon },
      { key: "storyboard", label: t("分镜", "Storyboard"), icon: Boxes }
    ]);
    function addUserMessage(content) {
      messages.value.push({ id: uid("msg"), role: "user", content, timestamp: Date.now() });
    }
    function addAssistantMessage(content, suggestions = false) {
      messages.value.push({ id: uid("msg"), role: "assistant", content, timestamp: Date.now(), suggestions });
    }
    function handleQuickAction(action) {
      if (action === "video") {
        addUserMessage(t("创建视频节点", "Create a video waypoint"));
        createVideoWaypoint();
        addAssistantMessage(t("已添加视频节点。把它连接到图像或 Prompt 卡片，就能形成生成路线。", "Video waypoint added. Connect it to an image or prompt card to form a generation route."), true);
        return;
      }
      if (action === "image") {
        addUserMessage(t("创建图像节点", "Create an image waypoint"));
        createImageWaypoint();
        addAssistantMessage(t("已添加图像节点。它可以接收 Prompt，并继续输入到视频生成。", "Image waypoint added. It can receive a prompt and feed into video generation."), true);
        return;
      }
      addUserMessage(t("创建分镜路线", "Create a storyboard route"));
      createStoryboardRoute();
      addAssistantMessage(t("已添加分镜路线，并创建可见连接；Workflow 节点也已准备好。", "Storyboard route added with visible links. The workflow nodes are prepared as well."), true);
    }
    function handleSkillSelect(skill) {
      input.value = skill;
      const lower = skill.toLowerCase();
      if (lower.includes("storyboard")) handleQuickAction("storyboard");
      else if (lower.includes("video")) handleQuickAction("video");
      else if (lower.includes("image")) handleQuickAction("image");
    }
    function createImageWaypoint(content = t("描述图像生成或编辑要求。", "Describe image generation or editing instructions.")) {
      canvasStore.addObject({
        type: "image",
        x: 260 + canvasStore.objects.length * 28,
        y: 180 + canvasStore.objects.length * 18,
        width: 600,
        height: 430,
        title: t("图像节点", "Image waypoint"),
        content
      });
    }
    function createVideoWaypoint(content = t("描述场景、镜头运动、时长和参考素材。", "Describe scene, camera motion, duration and references.")) {
      canvasStore.addObject({
        type: "video",
        x: 320 + canvasStore.objects.length * 28,
        y: 220 + canvasStore.objects.length * 18,
        width: 600,
        height: 430,
        title: t("视频节点", "Video waypoint"),
        content
      });
    }
    function createStoryboardRoute() {
      const baseX = 180 + canvasStore.objects.length * 18;
      const baseY = 180;
      const goal = canvasStore.addObject({
        type: "prompt",
        x: baseX,
        y: baseY,
        width: 360,
        height: 220,
        title: t("故事目标", "Story Goal"),
        content: t("定义角色、冲突、转场和镜头节奏。", "Define character, conflict, transition and shot rhythm.")
      });
      const board = canvasStore.addObject({
        type: "moodboard",
        x: baseX + 430,
        y: baseY + 70,
        width: 420,
        height: 280,
        title: t("分镜", "Storyboard"),
        content: t("镜头 01-06：建立、动作、产品细节、转场、高潮、最终输出。", "Shots 01-06: establish, action, product detail, transition, climax, final output.")
      });
      const video = canvasStore.addObject({
        type: "video",
        x: baseX + 920,
        y: baseY + 120,
        width: 420,
        height: 300,
        title: t("分镜视频", "Storyboard video"),
        content: t("把选定镜头生成竖屏短视频。", "Animate selected shots into a vertical short video.")
      });
      canvasStore.addLink(goal.id, board.id, "storyboard");
      canvasStore.addLink(board.id, video.id, "video");
      const prompt = workflowStore.addNode("prompt", 180, 160);
      const image = workflowStore.addNode("image-gen", 460, 220);
      const videoNode = workflowStore.addNode("video-gen", 740, 280);
      workflowStore.addEdge(prompt.id, image.id);
      workflowStore.addEdge(image.id, videoNode.id);
    }
    function dropSuggestionToCanvas(content) {
      canvasStore.addObject({
        type: "prompt",
        x: 220 + canvasStore.objects.length * 24,
        y: 160 + canvasStore.objects.length * 18,
        width: 420,
        height: 260,
        title: t("Copilot 建议", "Copilot suggestion"),
        content
      });
    }
    function buildWorkflowFromMessage(content) {
      const suggestion = canvasStore.addObject({
        type: "prompt",
        x: 180,
        y: 160,
        width: 420,
        height: 260,
        title: t("Copilot 建议", "Copilot suggestion"),
        content
      });
      const image = canvasStore.addObject({
        type: "image",
        x: 650,
        y: 220,
        width: 420,
        height: 280,
        title: t("首帧", "First frame"),
        content: t("根据计划生成第一张视觉画面。", "Generate the first visual frame from the plan.")
      });
      const video = canvasStore.addObject({
        type: "video",
        x: 1120,
        y: 280,
        width: 420,
        height: 300,
        title: t("视频渲染", "Video render"),
        content: t("把首帧转成动态视频。", "Turn the first frame into motion.")
      });
      canvasStore.addLink(suggestion.id, image.id, "image");
      canvasStore.addLink(image.id, video.id, "video");
      const prompt = workflowStore.addNode("prompt", 180, 160);
      const wfImage = workflowStore.addNode("image-gen", 460, 220);
      const wfVideo = workflowStore.addNode("video-gen", 740, 280);
      const output = workflowStore.addNode("output", 1020, 340);
      workflowStore.addEdge(prompt.id, wfImage.id);
      workflowStore.addEdge(wfImage.id, wfVideo.id);
      workflowStore.addEdge(wfVideo.id, output.id);
      workspaceStore.setMode("workflow");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "flex h-full w-full flex-col bg-[#050811]/95 backdrop-blur-xl" }, _attrs))}><div class="border-b border-cyan-100/10 p-4"><div class="flex items-center gap-3"><div class="grid size-9 place-items-center rounded-full border border-cyan-100/25 bg-cyan-100/10">`);
      _push(ssrRenderComponent(unref(Compass), { class: "size-5 text-cyan-100" }, null, _parent));
      _push(`</div><div><h2 class="text-sm font-semibold text-white">Polaris Copilot</h2><p class="text-xs text-white/38">${ssrInterpolate(t("路线生成控制台", "Route generation console"))}</p></div></div></div><div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4"><!--[-->`);
      ssrRenderList(messages.value, (msg) => {
        _push(`<div class="${ssrRenderClass(msg.role === "user" ? "ml-8" : "")}"><div class="${ssrRenderClass([msg.role === "user" ? "bg-cyan-100 text-[#061018]" : "border border-cyan-100/10 bg-white/6 text-white/72", "whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-6"])}">${ssrInterpolate(msg.content)}</div>`);
        if (msg.suggestions) {
          _push(`<div class="mt-2 flex flex-wrap gap-2">`);
          _push(ssrRenderComponent(FloatingButton, {
            title: t("投放到画布", "Drop to canvas"),
            onClick: ($event) => dropSuggestionToCanvas(msg.content)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(WandSparkles), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(t("投放到画布", "Drop to canvas"))}`);
              } else {
                return [
                  createVNode(unref(WandSparkles), { class: "size-4" }),
                  createTextVNode(" " + toDisplayString(t("投放到画布", "Drop to canvas")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(FloatingButton, {
            title: t("生成 Workflow", "Build workflow"),
            onClick: ($event) => buildWorkflowFromMessage(msg.content)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Workflow), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(t("生成 Workflow", "Build workflow"))}`);
              } else {
                return [
                  createVNode(unref(Workflow), { class: "size-4" }),
                  createTextVNode(" " + toDisplayString(t("生成 Workflow", "Build workflow")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="border-t border-cyan-100/10 p-4">`);
      _push(ssrRenderComponent(SkillChips, { onSelect: handleSkillSelect }, null, _parent));
      _push(`<div class="mt-4 grid grid-cols-3 gap-2 text-xs"><!--[-->`);
      ssrRenderList(quickActions.value, (action) => {
        _push(`<button class="rounded-lg border border-cyan-100/10 bg-white/6 p-2 text-white/64 transition hover:border-cyan-200/30 hover:text-cyan-100">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(action.icon), { class: "mx-auto mb-1 size-4" }, null), _parent);
        _push(` ${ssrInterpolate(action.label)}</button>`);
      });
      _push(`<!--]--></div><div class="mt-4 rounded-2xl border border-cyan-100/12 bg-black/35 p-2"><textarea class="h-20 w-full resize-none bg-transparent p-2 text-sm text-white outline-none placeholder:text-white/30"${ssrRenderAttr("placeholder", t("描述你的目标，或输入 @ 引用素材", "Describe your goal, or type @ to reference assets"))}>${ssrInterpolate(input.value)}</textarea><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Sparkles), { class: "ml-2 size-4 text-cyan-100" }, null, _parent));
      _push(`<div class="min-w-0 flex-1">`);
      _push(ssrRenderComponent(ModelSelector, {
        modelValue: selectedModel.value,
        "onUpdate:modelValue": ($event) => selectedModel.value = $event
      }, null, _parent));
      _push(`</div><button class="grid size-9 place-items-center rounded-full bg-cyan-100 text-[#061018] transition hover:bg-white"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      if (loading.value) {
        _push(`<span class="inline-block size-4 animate-spin rounded-full border-2 border-[#061018] border-t-transparent"></span>`);
      } else {
        _push(ssrRenderComponent(unref(Send), { class: "size-4" }, null, _parent));
      }
      _push(`</button></div></div></div></aside>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/agent/AgentPanel.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const AgentPanel = Object.assign(_sfc_main$5, { __name: "AgentPanel" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AssetLibrary",
  __ssrInlineRender: true,
  setup(__props) {
    const settingsStore = useSettingsStore();
    const assetStore = useAssetStore();
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(settingsStore).showAssets) {
          _push2(`<div class="fixed inset-0 z-[90] flex justify-start"><div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div><div class="relative w-[420px] bg-[#050811]/95 p-4 shadow-lg backdrop-blur-xl"><div class="mb-4 flex items-center justify-between"><h2 class="text-sm font-semibold text-white">Asset Library</h2><button class="rounded-lg p-1.5 text-white/38 transition hover:bg-white/8 hover:text-white/72">`);
          _push2(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent));
          _push2(`</button></div>`);
          if (unref(assetStore).assets.length === 0) {
            _push2(`<div class="py-8 text-center text-sm text-white/38"> No assets yet </div>`);
          } else {
            _push2(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
            ssrRenderList(unref(assetStore).assets, (asset) => {
              _push2(`<div class="rounded-md border border-white/10 bg-white/6 p-2 transition hover:border-cyan-300/30"><div class="mb-2 aspect-video rounded bg-gradient-to-br from-studio-cyan/15 to-studio-violet/15"></div><div class="flex items-center justify-between"><span class="text-xs text-white/72">${ssrInterpolate(asset.title)}</span><button class="text-white/38 hover:text-studio-warning">`);
              _push2(ssrRenderComponent(unref(Star), {
                class: ["size-3.5", { "fill-studio-warning text-studio-warning": asset.favorite }]
              }, null, _parent));
              _push2(`</button></div></div>`);
            });
            _push2(`<!--]--></div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/assets/AssetLibrary.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AssetLibrary = Object.assign(_sfc_main$4, { __name: "AssetsAssetLibrary" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "GenerationHistory",
  __ssrInlineRender: true,
  setup(__props) {
    const settingsStore = useSettingsStore();
    const assetStore = useAssetStore();
    useCanvasStore();
    const openMenuId = ref(null);
    ref(false);
    const t = (zh, en) => settingsStore.t(zh, en);
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(settingsStore).showHistory) {
          _push2(`<div class="fixed inset-0 z-[90] flex justify-start"><div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div><div class="relative w-[380px] bg-[#050811]/95 p-4 shadow-lg backdrop-blur-xl"><div class="mb-4 flex items-center justify-between"><h2 class="text-sm font-semibold text-white">Generation History</h2><button class="rounded-lg p-1.5 text-white/38 transition hover:bg-white/8 hover:text-white/72">`);
          _push2(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent));
          _push2(`</button></div>`);
          if (unref(assetStore).history.length === 0) {
            _push2(`<div class="py-8 text-center text-sm text-white/38"> No history yet </div>`);
          } else {
            _push2(`<div class="space-y-2"><!--[-->`);
            ssrRenderList(unref(assetStore).history, (item) => {
              _push2(`<div class="rounded-lg border border-white/10 bg-white/6 p-3"><div class="mb-2 flex items-center justify-between"><span class="text-sm text-white/72">${ssrInterpolate(item.title)}</span><div class="flex items-center gap-1">`);
              _push2(ssrRenderComponent(StatusBadge, {
                status: item.status
              }, null, _parent));
              _push2(`<div class="relative"><button class="rounded p-1 text-white/38 transition hover:bg-white/8 hover:text-white/72"${ssrRenderAttr("data-id", item.id)}>`);
              _push2(ssrRenderComponent(unref(Ellipsis), { class: "size-4" }, null, _parent));
              _push2(`</button>`);
              if (unref(openMenuId) === item.id) {
                _push2(`<div class="absolute right-0 top-full z-[100] mt-1 w-44 rounded-xl border border-white/10 bg-[#11131a]/95 py-1 shadow-glass backdrop-blur-xl"><button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8">`);
                _push2(ssrRenderComponent(unref(File), { class: "size-4" }, null, _parent));
                _push2(` ${ssrInterpolate(t("应用该画布", "Apply canvas"))}</button><button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/72 transition hover:bg-white/8">`);
                _push2(ssrRenderComponent(unref(ExternalLink), { class: "size-4" }, null, _parent));
                _push2(` ${ssrInterpolate(t("新建窗口预览", "Preview"))}</button><button class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-300/80 transition hover:bg-white/8">`);
                _push2(ssrRenderComponent(unref(Trash2), { class: "size-4" }, null, _parent));
                _push2(` ${ssrInterpolate(t("删除", "Delete"))}</button></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div><div class="h-1.5 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-studio-cyan transition-all" style="${ssrRenderStyle({ width: item.progress + "%" })}"></div></div><p class="mt-1 text-[11px] text-white/38">${ssrInterpolate(item.createdAt)}</p></div>`);
            });
            _push2(`<!--]--></div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/history/GenerationHistory.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const GenerationHistory = Object.assign(_sfc_main$3, { __name: "HistoryGenerationHistory" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ApiSettingsDialog",
  __ssrInlineRender: true,
  setup(__props) {
    const FieldInput = defineComponent({
      props: {
        modelValue: { type: String, default: "" },
        label: { type: String, required: true },
        placeholder: { type: String, default: "" },
        type: { type: String, default: "text" }
      },
      emits: ["update:modelValue"],
      setup(props, { emit, slots }) {
        return () => h("div", [
          h("label", { class: "mb-1 block text-xs text-white/55" }, props.label),
          h("div", { class: slots.default ? "relative" : "" }, [
            h("input", {
              value: props.modelValue,
              type: props.type,
              placeholder: props.placeholder,
              class: `h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50 ${slots.default ? "pr-9" : ""}`,
              onInput: (event) => emit("update:modelValue", event.target.value)
            }),
            slots.default ? h("div", { class: "absolute right-2 top-1/2 -translate-y-1/2" }, slots.default()) : null
          ])
        ]);
      }
    });
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const tabs = computed(() => [
      { key: "chat", label: t("Chat / 润色", "Chat / Enhance") },
      { key: "image", label: t("图像 API", "Image API") },
      { key: "video", label: t("视频 API", "Video API") }
    ]);
    const activeTab = ref("chat");
    const showChatKey = ref(false);
    const showImageKey = ref(false);
    ref(false);
    const showVideoKey = ref(false);
    const statusMsg = ref("");
    const statusError = ref(false);
    const chatForm = reactive({ baseUrl: "", apiKey: "", model: "" });
    const imageForm = reactive({ provider: "openai", baseUrl: "", apiKey: "", secretKey: "", model: "" });
    const videoForm = reactive({ provider: "openai", baseUrl: "", apiKey: "", model: "" });
    const imageUrlPlaceholder = computed(() => {
      if (imageForm.provider === "ark") return "https://ark.cn-beijing.volces.com/api/v3";
      if (imageForm.provider === "openai") return "https://api.openai.com";
      return "https://your-api.example.com";
    });
    function loadLocalSettings() {
      Object.assign(chatForm, { baseUrl: "", apiKey: "", model: "", ...readApiConfig() });
      Object.assign(imageForm, { provider: "openai", baseUrl: "", apiKey: "", secretKey: "", model: "", ...readApiConfig() });
      Object.assign(videoForm, { provider: "openai", baseUrl: "", apiKey: "", model: "", ...readApiConfig() });
    }
    async function loadBackendSettings() {
      try {
        const list = await loadProviderConfigsFromBackend();
        for (const item of list) {
          if (item.provider === "chat") {
            Object.assign(chatForm, {
              baseUrl: item.baseUrl || chatForm.baseUrl,
              apiKey: item.apiKey || chatForm.apiKey,
              model: item.model || chatForm.model
            });
          } else if (item.provider === "image-openai" || item.provider === "image-custom" || item.provider === "image-volcengine-jimeng") {
            Object.assign(imageForm, {
              provider: item.provider.replace(/^image-/, "") || "openai",
              baseUrl: item.baseUrl || imageForm.baseUrl,
              apiKey: item.apiKey || imageForm.apiKey,
              secretKey: item.secretKey || imageForm.secretKey,
              model: item.model || imageForm.model
            });
          } else if (item.provider === "jimeng" || item.provider === "jimeng-4") {
            Object.assign(imageForm, {
              provider: "ark",
              baseUrl: item.baseUrl || imageForm.baseUrl,
              apiKey: item.apiKey || imageForm.apiKey,
              secretKey: item.secretKey || imageForm.secretKey,
              model: item.model || imageForm.model
            });
          } else if (item.provider === "video-default" || item.provider?.startsWith("video-")) {
            Object.assign(videoForm, {
              provider: item.provider === "video-default" ? "openai" : item.provider.replace(/^video-/, "") || "openai",
              baseUrl: item.baseUrl || videoForm.baseUrl,
              apiKey: item.apiKey || videoForm.apiKey,
              model: item.model || videoForm.model
            });
          }
        }
      } catch {
      }
    }
    watch(activeTab, () => {
      statusMsg.value = "";
      loadLocalSettings();
      loadBackendSettings();
    });
    function handleSaveChat() {
      saveApiConfig("chat", { baseUrl: chatForm.baseUrl, apiKey: chatForm.apiKey, model: chatForm.model });
      aiService.saveProviders({ provider: "chat", baseUrl: chatForm.baseUrl, apiKey: chatForm.apiKey, model: chatForm.model }).then(() => {
        statusMsg.value = t("已保存，Key 已在服务端加密存储。", "Saved. Key is encrypted on server.");
        statusError.value = false;
      }).catch(() => {
        statusMsg.value = t("已保存到本地，但服务端保存失败。", "Saved locally, but server save failed.");
        statusError.value = true;
      });
    }
    function handleSaveImage() {
      saveApiConfig("image", { provider: imageForm.provider, baseUrl: imageForm.baseUrl, apiKey: imageForm.apiKey, secretKey: imageForm.secretKey, model: imageForm.model });
      const dbProvider = imageForm.provider === "ark" ? "jimeng" : providerKeyFor("image", imageForm.provider);
      aiService.saveProviders({
        provider: dbProvider,
        baseUrl: imageForm.baseUrl,
        apiKey: imageForm.apiKey,
        secretKey: imageForm.secretKey,
        model: imageForm.model
      }).then(() => {
        statusMsg.value = t("已保存，Key 已在服务端加密存储。", "Saved. Key is encrypted on server.");
        statusError.value = false;
      }).catch(() => {
        statusMsg.value = t("已保存到本地，但服务端保存失败。", "Saved locally, but server save failed.");
        statusError.value = true;
      });
    }
    function handleSaveVideo() {
      saveApiConfig("video", { provider: videoForm.provider, baseUrl: videoForm.baseUrl, apiKey: videoForm.apiKey, model: videoForm.model });
      aiService.saveProviders({
        provider: providerKeyFor("video", videoForm.provider),
        baseUrl: videoForm.baseUrl,
        apiKey: videoForm.apiKey,
        model: videoForm.model
      }).then(() => {
        statusMsg.value = t("已保存，Key 已在服务端加密存储。", "Saved. Key is encrypted on server.");
        statusError.value = false;
      }).catch(() => {
        statusMsg.value = t("已保存到本地，但服务端保存失败。", "Saved locally, but server save failed.");
        statusError.value = true;
      });
    }
    async function handleTest() {
      const isImage = activeTab.value === "image";
      const form = isImage ? imageForm : videoForm;
      if (!form.apiKey && !(isImage && imageForm.secretKey)) {
        statusMsg.value = t("请输入 API Key", "Please enter API Key");
        statusError.value = true;
        return;
      }
      try {
        const res = isImage ? await aiService.imageGenerate({
          baseUrl: imageForm.baseUrl || void 0,
          apiKey: imageForm.apiKey,
          secretKey: void 0,
          provider: imageForm.provider,
          model: imageForm.model || "dall-e-3",
          prompt: "test",
          size: "1024x1024"
        }) : await aiService.videoGenerate({
          baseUrl: videoForm.baseUrl || void 0,
          apiKey: videoForm.apiKey,
          model: videoForm.model || "seedance-2.0",
          prompt: "test"
        });
        if (res?.error) {
          statusMsg.value = res.error;
          statusError.value = true;
        } else {
          statusMsg.value = res?.url || res?.taskId ? t("连接成功。", "Connected.") : t("连接成功，但未返回媒体 URL。", "Connected, but no media URL returned.");
          statusError.value = false;
        }
      } catch (err) {
        statusMsg.value = err?.message || t("连接失败", "Connection failed");
        statusError.value = true;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(settingsStore).showSettings) {
          _push2(`<div class="fixed inset-0 z-[100] flex justify-end"><div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div><div class="relative max-w-[560px] flex-1 overflow-y-auto bg-[#1b1c1f] p-6 shadow-lg"><div class="mb-6 flex items-center justify-between"><div class="flex items-center gap-2">`);
          _push2(ssrRenderComponent(unref(Settings), { class: "size-4 text-white/72" }, null, _parent));
          _push2(`<h2 class="text-base font-semibold text-white">${ssrInterpolate(t("API 设置", "API Settings"))}</h2></div><button class="rounded-lg p-1.5 text-white/38 transition hover:bg-white/8 hover:text-white/72">`);
          _push2(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent));
          _push2(`</button></div><div class="mb-6 flex gap-1 rounded-lg bg-black/20 p-1"><!--[-->`);
          ssrRenderList(tabs.value, (tab) => {
            _push2(`<button class="${ssrRenderClass([activeTab.value === tab.key ? "bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30" : "text-white/55 hover:text-white/80", "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"])}">${ssrInterpolate(tab.label)}</button>`);
          });
          _push2(`<!--]--></div>`);
          if (activeTab.value === "chat") {
            _push2(`<div class="space-y-4">`);
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: chatForm.baseUrl,
              "onUpdate:modelValue": ($event) => chatForm.baseUrl = $event,
              label: t("Base URL 地址", "Base URL"),
              placeholder: "https://api.deepseek.com"
            }, null, _parent));
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: chatForm.model,
              "onUpdate:modelValue": ($event) => chatForm.model = $event,
              label: t("默认模型 Model", "Default Model"),
              placeholder: "deepseek-chat"
            }, null, _parent));
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: chatForm.apiKey,
              "onUpdate:modelValue": ($event) => chatForm.apiKey = $event,
              label: "API Key",
              type: showChatKey.value ? "text" : "password",
              placeholder: "sk-..."
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`<button class="text-white/38 hover:text-white/72"${_scopeId}>`);
                  ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(showChatKey.value ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }, null), _parent2, _scopeId);
                  _push3(`</button>`);
                } else {
                  return [
                    createVNode("button", {
                      class: "text-white/38 hover:text-white/72",
                      onClick: ($event) => showChatKey.value = !showChatKey.value
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(showChatKey.value ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }))
                    ], 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (activeTab.value === "image") {
            _push2(`<div class="space-y-4"><div class="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2"><p class="text-[11px] text-cyan-200/70">${ssrInterpolate(t("用于图像卡片和图像 Workflow 节点。", "Used by Image cards and image workflow nodes."))}</p></div><div><label class="mb-1 block text-xs text-white/55">${ssrInterpolate(t("供应商 Provider", "Provider"))}</label><select class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50"><option value="openai"${ssrIncludeBooleanAttr(Array.isArray(imageForm.provider) ? ssrLooseContain(imageForm.provider, "openai") : ssrLooseEqual(imageForm.provider, "openai")) ? " selected" : ""}>OpenAI compatible</option><option value="ark"${ssrIncludeBooleanAttr(Array.isArray(imageForm.provider) ? ssrLooseContain(imageForm.provider, "ark") : ssrLooseEqual(imageForm.provider, "ark")) ? " selected" : ""}>Volcengine ARK</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray(imageForm.provider) ? ssrLooseContain(imageForm.provider, "custom") : ssrLooseEqual(imageForm.provider, "custom")) ? " selected" : ""}>${ssrInterpolate(t("自定义兼容接口", "Custom compatible"))}</option></select></div>`);
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: imageForm.baseUrl,
              "onUpdate:modelValue": ($event) => imageForm.baseUrl = $event,
              label: t("Base URL 地址", "Base URL"),
              placeholder: imageUrlPlaceholder.value
            }, null, _parent));
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: imageForm.model,
              "onUpdate:modelValue": ($event) => imageForm.model = $event,
              label: t("默认模型 Model", "Default Model"),
              placeholder: "dall-e-3 / jimeng-5.0"
            }, null, _parent));
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: imageForm.apiKey,
              "onUpdate:modelValue": ($event) => imageForm.apiKey = $event,
              label: "Access Key / API Key",
              type: showImageKey.value ? "text" : "password",
              placeholder: "sk-... / AKTP..."
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`<button class="text-white/38 hover:text-white/72"${_scopeId}>`);
                  ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(showImageKey.value ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }, null), _parent2, _scopeId);
                  _push3(`</button>`);
                } else {
                  return [
                    createVNode("button", {
                      class: "text-white/38 hover:text-white/72",
                      onClick: ($event) => showImageKey.value = !showImageKey.value
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(showImageKey.value ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }))
                    ], 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (activeTab.value === "video") {
            _push2(`<div class="space-y-4"><div class="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2"><p class="text-[11px] text-cyan-200/70">${ssrInterpolate(t("用于视频卡片、任务轮询和视频 Workflow 节点。", "Used by Video cards, task polling, and video workflow nodes."))}</p></div><div><label class="mb-1 block text-xs text-white/55">${ssrInterpolate(t("供应商 Provider", "Provider"))}</label><select class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50"><option value="openai"${ssrIncludeBooleanAttr(Array.isArray(videoForm.provider) ? ssrLooseContain(videoForm.provider, "openai") : ssrLooseEqual(videoForm.provider, "openai")) ? " selected" : ""}>OpenAI compatible</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray(videoForm.provider) ? ssrLooseContain(videoForm.provider, "custom") : ssrLooseEqual(videoForm.provider, "custom")) ? " selected" : ""}>${ssrInterpolate(t("自定义兼容接口", "Custom compatible"))}</option></select></div>`);
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: videoForm.baseUrl,
              "onUpdate:modelValue": ($event) => videoForm.baseUrl = $event,
              label: t("Base URL 地址", "Base URL"),
              placeholder: "https://api.example.com"
            }, null, _parent));
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: videoForm.model,
              "onUpdate:modelValue": ($event) => videoForm.model = $event,
              label: t("默认模型 Model", "Default Model"),
              placeholder: "seedance-2.0"
            }, null, _parent));
            _push2(ssrRenderComponent(unref(FieldInput), {
              modelValue: videoForm.apiKey,
              "onUpdate:modelValue": ($event) => videoForm.apiKey = $event,
              label: "API Key",
              type: showVideoKey.value ? "text" : "password",
              placeholder: "sk-..."
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`<button class="text-white/38 hover:text-white/72"${_scopeId}>`);
                  ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(showVideoKey.value ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }, null), _parent2, _scopeId);
                  _push3(`</button>`);
                } else {
                  return [
                    createVNode("button", {
                      class: "text-white/38 hover:text-white/72",
                      onClick: ($event) => showVideoKey.value = !showVideoKey.value
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(showVideoKey.value ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }))
                    ], 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mt-6 flex gap-3 border-t border-white/10 pt-4">`);
          if (activeTab.value === "chat") {
            _push2(ssrRenderComponent(FloatingButton, { onClick: handleSaveChat }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), { class: "size-3.5" }, null, _parent2, _scopeId));
                  _push3(` ${ssrInterpolate(t("保存 Chat", "Save Chat"))}`);
                } else {
                  return [
                    createVNode(unref(Save), { class: "size-3.5" }),
                    createTextVNode(" " + toDisplayString(t("保存 Chat", "Save Chat")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (activeTab.value === "image") {
            _push2(ssrRenderComponent(FloatingButton, { onClick: handleSaveImage }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), { class: "size-3.5" }, null, _parent2, _scopeId));
                  _push3(` ${ssrInterpolate(t("保存图像 API", "Save Image API"))}`);
                } else {
                  return [
                    createVNode(unref(Save), { class: "size-3.5" }),
                    createTextVNode(" " + toDisplayString(t("保存图像 API", "Save Image API")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (activeTab.value === "video") {
            _push2(ssrRenderComponent(FloatingButton, { onClick: handleSaveVideo }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), { class: "size-3.5" }, null, _parent2, _scopeId));
                  _push3(` ${ssrInterpolate(t("保存视频 API", "Save Video API"))}`);
                } else {
                  return [
                    createVNode(unref(Save), { class: "size-3.5" }),
                    createTextVNode(" " + toDisplayString(t("保存视频 API", "Save Video API")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (activeTab.value === "image" || activeTab.value === "video") {
            _push2(ssrRenderComponent(FloatingButton, { onClick: handleTest }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(RefreshCw), { class: "size-3.5" }, null, _parent2, _scopeId));
                  _push3(` ${ssrInterpolate(t("测试", "Test"))}`);
                } else {
                  return [
                    createVNode(unref(RefreshCw), { class: "size-3.5" }),
                    createTextVNode(" " + toDisplayString(t("测试", "Test")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (statusMsg.value) {
            _push2(`<p class="${ssrRenderClass([statusError.value ? "text-studio-danger" : "text-studio-success", "mt-3 text-xs"])}">${ssrInterpolate(statusMsg.value)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/settings/ApiSettingsDialog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ApiSettingsDialog = Object.assign(_sfc_main$2, { __name: "SettingsApiSettingsDialog" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppShell",
  __ssrInlineRender: true,
  setup(__props) {
    const workspaceStore = useWorkspaceStore();
    const settingsStore = useSettingsStore();
    useCanvasStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "flex h-screen flex-col overflow-hidden bg-studio-black text-white" }, _attrs))}>`);
      _push(ssrRenderComponent(TopBar, null, null, _parent));
      _push(`<div class="relative flex min-h-0 flex-1 pt-14">`);
      _push(ssrRenderComponent(LeftToolbar, null, null, _parent));
      _push(`<section class="relative min-w-0 flex-1 overflow-hidden bg-[#050608]">`);
      if (unref(workspaceStore).mode === "magic") {
        _push(ssrRenderComponent(MagicCanvas, null, null, _parent));
      } else {
        _push(ssrRenderComponent(WorkflowCanvas, null, null, _parent));
      }
      _push(ssrRenderComponent(BottomToolbar, null, null, _parent));
      _push(`</section>`);
      if (unref(settingsStore).showPanel) {
        _push(`<div class="w-[340px] shrink-0 border-l border-white/8 bg-[#111722]/88">`);
        _push(ssrRenderComponent(AgentPanel, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(settingsStore).showAssets) {
        _push(ssrRenderComponent(AssetLibrary, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(settingsStore).showHistory) {
        _push(ssrRenderComponent(GenerationHistory, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(settingsStore).showSettings) {
        _push(ssrRenderComponent(ApiSettingsDialog, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppShell.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppShell = Object.assign(_sfc_main$1, { __name: "LayoutAppShell" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppShell, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/studio/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BfKhcZE0.mjs.map
