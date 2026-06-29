import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, h, ref, computed, reactive, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderComponent, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Layout, Crown, Key, UserRound, ArrowLeft, Plus, Search, ExternalLink, Pencil, Trash2, Coins, Minus, EyeOff, Eye, Save, RefreshCw, Camera, LogOut } from 'lucide-vue-next';
import { d as useAuthStore, a as useSettingsStore } from './server.mjs';
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
import 'pinia';
import 'vue-router';
import '@vue/shared';
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
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
        return () => h("div", { class: "space-y-1" }, [
          h("label", { class: "block text-xs text-white/55" }, props.label),
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
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const activeTab = ref("projects");
    const tabs = computed(() => [
      { id: "projects", label: t("画布管理", "Canvases"), icon: Layout },
      { id: "credits", label: t("积分管理", "Credits"), icon: Crown },
      { id: "api", label: t("API 管理", "API"), icon: Key },
      { id: "account", label: t("账号设置", "Account"), icon: UserRound }
    ]);
    const profileInitial = computed(() => (authStore.user?.nickname || authStore.user?.username || "P").charAt(0).toUpperCase());
    const userName = computed(() => authStore.user?.nickname || authStore.user?.username || "Polaris");
    const userEmail = computed(() => authStore.user?.email || "");
    const activeSubTab = ref("profile");
    const subTabs = computed(() => [
      { key: "profile", label: t("个人资料", "Profile") },
      { key: "preferences", label: t("偏好", "Preferences") },
      { key: "security", label: t("安全", "Security") }
    ]);
    const languageProxy = computed({
      get: () => settingsStore.language,
      set: (value) => settingsStore.setLanguage(value)
    });
    const themeProxy = computed({
      get: () => settingsStore.theme,
      set: (value) => {
        if (settingsStore.theme !== value) settingsStore.toggleTheme();
      }
    });
    const profileForm = reactive({ username: "", nickname: "", email: "", phone: "" });
    const profileSavedMsg = ref("");
    ref();
    const avatarMsg = ref("");
    const avatarMsgError = ref(false);
    const passwordForm = reactive({ old: "", next: "", confirm: "" });
    const passwordSaving = ref(false);
    const passwordMsg = ref("");
    const passwordMsgError = ref(false);
    const projectQuery = ref("");
    const projects = ref([]);
    const projectObjectCounts = ref({});
    const projectRunningTasks = ref({});
    const renaming = ref(null);
    const renameValue = ref("");
    const deleting = ref(null);
    const filteredProjects = computed(() => {
      const q = projectQuery.value.trim().toLowerCase();
      return projects.value.filter((p) => {
        const text = `${p.name || ""} ${p.title || ""} ${p.description || ""}`.toLowerCase();
        return !q || text.includes(q);
      });
    });
    function modeLabel(mode) {
      const value = (mode || "magic").toLowerCase();
      if (value.includes("workflow")) return t("工作流", "Workflow");
      if (value.includes("image")) return t("图片", "Image");
      if (value.includes("video")) return t("视频", "Video");
      return t("星图", "Star");
    }
    function modeIcon(mode) {
      const value = (mode || "magic").toLowerCase();
      if (value.includes("workflow")) return "GitBranch";
      if (value.includes("image")) return "Image";
      if (value.includes("video")) return "Video";
      return "Stars";
    }
    function previewBg(mode) {
      const value = (mode || "magic").toLowerCase();
      if (value.includes("workflow")) return "bg-gradient-to-br from-violet-500/30 via-violet-500/10 to-transparent";
      if (value.includes("image")) return "bg-gradient-to-br from-emerald-500/30 via-emerald-500/10 to-transparent";
      if (value.includes("video")) return "bg-gradient-to-br from-rose-500/30 via-rose-500/10 to-transparent";
      return "bg-gradient-to-br from-cyan-500/30 via-blue-500/10 to-transparent";
    }
    const tick = ref(0);
    function timeAgo(dateStr) {
      void tick.value;
      const now = Date.now();
      const date = new Date(dateStr).getTime();
      const diff = now - date;
      const mins = Math.floor(diff / 6e4);
      if (mins < 1) return t("刚刚", "just now");
      if (mins < 60) return `${mins}m`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}d`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months}mo`;
      return `${Math.floor(months / 12)}y`;
    }
    const creditLogs = ref([]);
    const costs = computed(() => [
      { name: t("图片生成", "Image generation"), cost: "40" },
      { name: t("分镜生成", "Storyboard generation"), cost: "80" },
      { name: t("视频生成", "Video generation"), cost: "120" },
      { name: t("工作流运行", "Workflow run"), cost: "160" }
    ]);
    const activeApiTab = ref("chat");
    const showChatKey = ref(false);
    const showImageKey = ref(false);
    const showVideoKey = ref(false);
    const apiStatusMsg = ref("");
    const apiStatusError = ref(false);
    const chatForm = reactive({ baseUrl: "", apiKey: "", model: "" });
    const imageForm = reactive({ provider: "openai", baseUrl: "", apiKey: "", secretKey: "", model: "" });
    const videoForm = reactive({ baseUrl: "", apiKey: "", model: "" });
    const apiTabs = computed(() => [
      { key: "chat", label: t("Chat / 润色", "Chat / Enhance") },
      { key: "image", label: t("图像 API", "Image API") },
      { key: "video", label: t("视频 API", "Video API") }
    ]);
    const imageUrlPlaceholder = computed(() => {
      if (imageForm.provider === "ark") return "https://ark.cn-beijing.volces.com/api/v3";
      if (imageForm.provider === "openai") return "https://api.openai.com";
      return "https://your-api.example.com";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto flex min-h-screen max-w-7xl gap-0 px-4 py-6 lg:gap-6" }, _attrs))}><aside class="hidden w-56 shrink-0 lg:block"><div class="sticky top-20 rounded-xl border border-white/10 bg-white/[0.04] p-2"><div class="mb-3 flex items-center gap-3 border-b border-white/8 px-3 pb-3">`);
      if (unref(authStore).user?.avatar) {
        _push(`<div class="size-10 overflow-hidden rounded-full"><img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="size-full object-cover"></div>`);
      } else {
        _push(`<div class="grid size-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-white">${ssrInterpolate(unref(profileInitial))}</div>`);
      }
      _push(`<div class="min-w-0"><p class="truncate text-sm font-medium text-white">${ssrInterpolate(unref(userName))}</p><p class="truncate text-xs text-white/42">${ssrInterpolate(unref(userEmail) || t("未设置邮箱", "No email"))}</p></div></div><!--[-->`);
      ssrRenderList(unref(tabs), (tab) => {
        _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "bg-cyan-100/10 text-cyan-50" : "text-white/55 hover:bg-white/6 hover:text-white", "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "size-4" }, null), _parent);
        _push(` ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div></aside><div class="min-w-0 flex-1"><section class="mb-4 flex items-center gap-3 lg:hidden"><button class="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition hover:bg-white/8 hover:text-white">`);
      _push(ssrRenderComponent(unref(ArrowLeft), { class: "size-4" }, null, _parent));
      _push(`</button><div class="flex gap-1 overflow-x-auto rounded-lg bg-black/30 p-0.5"><!--[-->`);
      ssrRenderList(unref(tabs), (tab) => {
        _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "bg-cyan-300/18 text-cyan-50" : "text-white/55 hover:text-white/80", "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div></section>`);
      if (unref(activeTab) === "projects") {
        _push(`<section class="space-y-4"><div class="flex items-center justify-between"><div><h1 class="text-xl font-semibold text-white">${ssrInterpolate(t("画布管理", "Canvas Projects"))}</h1><p class="mt-0.5 text-sm text-white/45">${ssrInterpolate(t("管理已保存的画布项目", "Manage your saved canvas projects"))}</p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/studio",
          class: "inline-flex h-9 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Plus), { class: "size-4" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(t("新建", "New"))}`);
            } else {
              return [
                createVNode(unref(Plus), { class: "size-4" }),
                createTextVNode(" " + toDisplayString(t("新建", "New")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="flex gap-2"><label class="flex h-9 max-w-xs flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-3 text-sm text-white/42">`);
        _push(ssrRenderComponent(unref(Search), { class: "size-4" }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(projectQuery))} class="w-full bg-transparent outline-none placeholder:text-white/32"${ssrRenderAttr("placeholder", t("搜索画布", "Search canvases"))}></label></div>`);
        if (unref(filteredProjects).length === 0) {
          _push(`<div class="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] py-20 text-white/35">`);
          _push(ssrRenderComponent(unref(Layout), { class: "mb-3 size-10" }, null, _parent));
          _push(`<p class="text-sm">${ssrInterpolate(t("暂无保存的画布", "No saved canvases yet"))}</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/studio",
            class: "mt-3 text-xs text-cyan-300/70 underline underline-offset-2 hover:text-cyan-200"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(t("前往画布创建", "Go to studio"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(t("前往画布创建", "Go to studio")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(filteredProjects), (project) => {
            _push(`<div class="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-0.5 hover:border-cyan-100/25 hover:bg-white/[0.06] hover:shadow-lg"><div class="${ssrRenderClass([previewBg(project.mode || project.type), "relative flex h-24 items-end overflow-hidden rounded-t-lg px-4 pb-3"])}">`);
            if (unref(projectRunningTasks)[project.id]) {
              _push(`<span class="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-medium text-amber-200 backdrop-blur-sm"><span class="inline-block size-2 animate-pulse rounded-full bg-amber-400"></span> ${ssrInterpolate(t("生成中", "Generating"))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="absolute right-2 top-2 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70 backdrop-blur-sm">${ssrInterpolate(modeLabel(project.mode || project.type))}</span><div class="flex items-center gap-2 text-xs text-white/60">`);
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(modeIcon(project.mode || project.type)), { class: "size-4 text-white/80" }, null), _parent);
            _push(`<span>${ssrInterpolate(project.updatedAt ? timeAgo(project.updatedAt) : project.createdAt ? timeAgo(project.createdAt) : "")}</span></div></div><div class="p-4 pt-3"><h3 class="line-clamp-1 text-sm font-semibold text-white">${ssrInterpolate(project.name || project.title || t("未命名项目", "Untitled"))}</h3><p class="mt-1 line-clamp-2 min-h-7 text-xs text-white/45">${ssrInterpolate(project.description || t("暂无描述", "No description"))}</p><div class="mt-3 flex items-center justify-between border-t border-white/8 pt-3"><div class="flex items-center gap-3 text-[11px] text-white/40"><span class="flex items-center gap-1">`);
            _push(ssrRenderComponent(unref(Layout), { class: "size-3" }, null, _parent));
            _push(` ${ssrInterpolate(unref(projectObjectCounts)[project.id] ?? "...")} ${ssrInterpolate(t("卡片", "cards"))}</span></div><div class="flex gap-1 opacity-0 transition group-hover:opacity-100"><button class="grid size-7 place-items-center rounded-md text-white/40 transition hover:bg-cyan-100/10 hover:text-cyan-50"${ssrRenderAttr("title", t("打开", "Open"))}>`);
            _push(ssrRenderComponent(unref(ExternalLink), { class: "size-3.5" }, null, _parent));
            _push(`</button><button class="grid size-7 place-items-center rounded-md text-white/40 transition hover:bg-amber-100/10 hover:text-amber-300"${ssrRenderAttr("title", t("重命名", "Rename"))}>`);
            _push(ssrRenderComponent(unref(Pencil), { class: "size-3.5" }, null, _parent));
            _push(`</button><button class="grid size-7 place-items-center rounded-md text-white/40 transition hover:bg-red-100/10 hover:text-red-400"${ssrRenderAttr("title", t("删除", "Delete"))}>`);
            _push(ssrRenderComponent(unref(Trash2), { class: "size-3.5" }, null, _parent));
            _push(`</button></div></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(renaming)) {
            _push2(`<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm"><div class="w-80 rounded-xl border border-white/10 bg-[#10131a] p-5 shadow-glass"><h3 class="text-sm font-semibold text-white">${ssrInterpolate(t("重命名项目", "Rename Project"))}</h3><input${ssrRenderAttr("value", unref(renameValue))} class="mt-3 h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><div class="mt-4 flex justify-end gap-2"><button class="h-9 rounded-lg border border-white/10 bg-white/6 px-4 text-xs text-white/72 transition hover:bg-white/10">${ssrInterpolate(t("取消", "Cancel"))}</button><button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white">${ssrInterpolate(t("确认", "Confirm"))}</button></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(deleting)) {
            _push2(`<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm"><div class="w-80 rounded-xl border border-white/10 bg-[#10131a] p-5 shadow-glass"><h3 class="text-sm font-semibold text-white">${ssrInterpolate(t("删除项目", "Delete Project"))}</h3><p class="mt-2 text-xs text-white/55">${ssrInterpolate(t("确定要删除", "Are you sure to delete"))} &quot;${ssrInterpolate(unref(deleting).name || unref(deleting).title)}&quot;？</p><div class="mt-4 flex justify-end gap-2"><button class="h-9 rounded-lg border border-white/10 bg-white/6 px-4 text-xs text-white/72 transition hover:bg-white/10">${ssrInterpolate(t("取消", "Cancel"))}</button><button class="h-9 rounded-lg bg-red-500 px-4 text-xs font-medium text-white transition hover:bg-red-400">${ssrInterpolate(t("删除", "Delete"))}</button></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "credits") {
        _push(`<section class="space-y-4"><div><h1 class="text-xl font-semibold text-white">${ssrInterpolate(t("积分管理", "Credits"))}</h1><p class="mt-0.5 text-sm text-white/45">${ssrInterpolate(t("用于生成图片、视频和工作流任务", "Used for image, video and workflow generation"))}</p></div><div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><div class="rounded-xl border border-white/10 bg-white/[0.04] p-6"><div class="flex items-center justify-between gap-4"><div><p class="text-sm text-white/45">${ssrInterpolate(t("当前余额", "Current Balance"))}</p><p class="mt-2 text-4xl font-semibold text-cyan-50">${ssrInterpolate(unref(authStore).credits.toLocaleString())}</p></div><div class="grid size-14 place-items-center rounded-full border border-cyan-100/20 bg-cyan-100/10 text-cyan-100">`);
        _push(ssrRenderComponent(unref(Crown), { class: "size-6" }, null, _parent));
        _push(`</div></div><div class="mt-4 grid gap-2 sm:grid-cols-3"><button class="h-9 rounded-lg border border-white/10 bg-white/6 text-xs text-white/72 transition hover:border-cyan-200/30 hover:text-cyan-50">${ssrInterpolate(t("测试增加 500", "Add 500 Demo"))}</button><button class="h-9 rounded-lg border border-white/10 bg-white/6 text-xs text-white/72 transition hover:border-cyan-200/30 hover:text-cyan-50">${ssrInterpolate(t("模拟图片生成", "Simulate Image"))}</button><button class="h-9 rounded-lg border border-white/10 bg-white/6 text-xs text-white/72 transition hover:border-cyan-200/30 hover:text-cyan-50">${ssrInterpolate(t("模拟视频生成", "Simulate Video"))}</button></div></div><div class="rounded-xl border border-white/10 bg-white/[0.04] p-6"><h2 class="text-sm font-semibold text-white">${ssrInterpolate(t("消耗规则", "Usage Cost"))}</h2><div class="mt-3 space-y-2"><!--[-->`);
        ssrRenderList(unref(costs), (item) => {
          _push(`<div class="flex items-center justify-between rounded-md border border-white/8 bg-black/20 px-3 py-2"><span class="text-sm text-white/72">${ssrInterpolate(item.name)}</span><span class="text-sm font-medium text-cyan-100">${ssrInterpolate(item.cost)}</span></div>`);
        });
        _push(`<!--]--></div></div></div><div class="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]"><div class="flex items-center justify-between border-b border-white/8 px-5 py-3"><h2 class="text-sm font-semibold text-white">${ssrInterpolate(t("积分流水", "Credit Log"))}</h2><button class="text-xs text-white/45 transition hover:text-white">${ssrInterpolate(t("清空记录", "Clear Log"))}</button></div>`);
        if (unref(creditLogs).length === 0) {
          _push(`<div class="flex flex-col items-center justify-center py-14 text-white/35">`);
          _push(ssrRenderComponent(unref(Coins), { class: "mb-2 size-8" }, null, _parent));
          _push(`<p class="text-sm">${ssrInterpolate(t("暂无记录", "No records yet"))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(creditLogs), (log) => {
          _push(`<div class="flex items-center justify-between border-b border-white/5 px-5 py-3 last:border-b-0"><div class="flex min-w-0 items-center gap-3"><div class="${ssrRenderClass(["grid size-8 shrink-0 place-items-center rounded-full", log.amount > 0 ? "bg-emerald-500/12 text-emerald-300" : "bg-amber-500/12 text-amber-300"])}">`);
          if (log.amount > 0) {
            _push(ssrRenderComponent(unref(Plus), { class: "size-3.5" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Minus), { class: "size-3.5" }, null, _parent));
          }
          _push(`</div><div class="min-w-0"><p class="truncate text-sm font-medium text-white">${ssrInterpolate(log.remark)}</p><p class="text-xs text-white/35">${ssrInterpolate(log.createdAt)}</p></div></div><div class="text-right"><p class="${ssrRenderClass(["text-sm font-semibold", log.amount > 0 ? "text-emerald-300" : "text-amber-300"])}">${ssrInterpolate(log.amount > 0 ? `+${log.amount}` : log.amount)}</p><p class="text-xs text-white/35">${ssrInterpolate(t("余额", "Balance"))} ${ssrInterpolate(log.balance)}</p></div></div>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "api") {
        _push(`<section class="space-y-4"><div><h1 class="text-xl font-semibold text-white">${ssrInterpolate(t("API 管理", "API Management"))}</h1><p class="mt-0.5 text-sm text-white/45">${ssrInterpolate(t("管理 AI 服务供应商的 API 配置", "Manage AI provider API configurations"))}</p></div><div class="rounded-xl border border-white/10 bg-white/[0.04] p-5"><div class="mb-5 flex gap-1 rounded-lg bg-black/20 p-1"><!--[-->`);
        ssrRenderList(unref(apiTabs), (apiTab) => {
          _push(`<button class="${ssrRenderClass([unref(activeApiTab) === apiTab.key ? "bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30" : "text-white/55 hover:text-white/80", "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"])}">${ssrInterpolate(apiTab.label)}</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(activeApiTab) === "chat") {
          _push(`<div class="space-y-3">`);
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(chatForm).baseUrl,
            "onUpdate:modelValue": ($event) => unref(chatForm).baseUrl = $event,
            label: t("Base URL", "Base URL"),
            placeholder: "https://api.deepseek.com"
          }, null, _parent));
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(chatForm).model,
            "onUpdate:modelValue": ($event) => unref(chatForm).model = $event,
            label: t("默认模型", "Default Model"),
            placeholder: "deepseek-chat"
          }, null, _parent));
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(chatForm).apiKey,
            "onUpdate:modelValue": ($event) => unref(chatForm).apiKey = $event,
            label: "API Key",
            type: unref(showChatKey) ? "text" : "password",
            placeholder: "sk-..."
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button class="text-white/38 hover:text-white/72"${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(showChatKey) ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }, null), _parent2, _scopeId);
                _push2(`</button>`);
              } else {
                return [
                  createVNode("button", {
                    class: "text-white/38 hover:text-white/72",
                    onClick: ($event) => showChatKey.value = !unref(showChatKey)
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(unref(showChatKey) ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }))
                  ], 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="flex items-center gap-3 pt-2"><button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white">`);
          _push(ssrRenderComponent(unref(Save), { class: "mr-1.5 inline-block size-3.5" }, null, _parent));
          _push(`${ssrInterpolate(t("保存", "Save"))}</button>`);
          if (unref(apiStatusMsg)) {
            _push(`<span class="${ssrRenderClass([unref(apiStatusError) ? "text-red-400" : "text-emerald-300", "text-xs"])}">${ssrInterpolate(unref(apiStatusMsg))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeApiTab) === "image") {
          _push(`<div class="space-y-3"><div class="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2"><p class="text-[11px] text-cyan-200/70">${ssrInterpolate(t("用于图像卡片和图像生成节点", "Used by Image cards and image generation nodes"))}</p></div><div><label class="mb-1 block text-xs text-white/55">${ssrInterpolate(t("供应商", "Provider"))}</label><select class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50"><option value="openai"${ssrIncludeBooleanAttr(Array.isArray(unref(imageForm).provider) ? ssrLooseContain(unref(imageForm).provider, "openai") : ssrLooseEqual(unref(imageForm).provider, "openai")) ? " selected" : ""}>OpenAI compatible</option><option value="ark"${ssrIncludeBooleanAttr(Array.isArray(unref(imageForm).provider) ? ssrLooseContain(unref(imageForm).provider, "ark") : ssrLooseEqual(unref(imageForm).provider, "ark")) ? " selected" : ""}>Volcengine ARK</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray(unref(imageForm).provider) ? ssrLooseContain(unref(imageForm).provider, "custom") : ssrLooseEqual(unref(imageForm).provider, "custom")) ? " selected" : ""}>${ssrInterpolate(t("自定义", "Custom compatible"))}</option></select></div>`);
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(imageForm).baseUrl,
            "onUpdate:modelValue": ($event) => unref(imageForm).baseUrl = $event,
            label: t("Base URL", "Base URL"),
            placeholder: unref(imageUrlPlaceholder)
          }, null, _parent));
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(imageForm).model,
            "onUpdate:modelValue": ($event) => unref(imageForm).model = $event,
            label: t("默认模型", "Default Model"),
            placeholder: "dall-e-3 / jimeng-5.0"
          }, null, _parent));
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(imageForm).apiKey,
            "onUpdate:modelValue": ($event) => unref(imageForm).apiKey = $event,
            label: "Access Key / API Key",
            type: unref(showImageKey) ? "text" : "password",
            placeholder: "sk-... / AKTP..."
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button class="text-white/38 hover:text-white/72"${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(showImageKey) ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }, null), _parent2, _scopeId);
                _push2(`</button>`);
              } else {
                return [
                  createVNode("button", {
                    class: "text-white/38 hover:text-white/72",
                    onClick: ($event) => showImageKey.value = !unref(showImageKey)
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(unref(showImageKey) ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }))
                  ], 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="flex items-center gap-3 pt-2"><button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white">`);
          _push(ssrRenderComponent(unref(Save), { class: "mr-1.5 inline-block size-3.5" }, null, _parent));
          _push(`${ssrInterpolate(t("保存", "Save"))}</button><button class="h-9 rounded-lg border border-white/10 bg-white/6 px-4 text-xs text-white/72 transition hover:bg-white/10">`);
          _push(ssrRenderComponent(unref(RefreshCw), { class: "mr-1.5 inline-block size-3.5" }, null, _parent));
          _push(`${ssrInterpolate(t("测试", "Test"))}</button>`);
          if (unref(apiStatusMsg)) {
            _push(`<span class="${ssrRenderClass([unref(apiStatusError) ? "text-red-400" : "text-emerald-300", "text-xs"])}">${ssrInterpolate(unref(apiStatusMsg))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeApiTab) === "video") {
          _push(`<div class="space-y-3"><div class="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2"><p class="text-[11px] text-cyan-200/70">${ssrInterpolate(t("用于视频卡片和视频生成节点", "Used by Video cards and video generation nodes"))}</p></div>`);
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(videoForm).baseUrl,
            "onUpdate:modelValue": ($event) => unref(videoForm).baseUrl = $event,
            label: t("Base URL", "Base URL"),
            placeholder: "https://ark.cn-beijing.volces.com/api/v3"
          }, null, _parent));
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(videoForm).model,
            "onUpdate:modelValue": ($event) => unref(videoForm).model = $event,
            label: t("默认模型", "Default Model"),
            placeholder: "doubao-seedance-2.0"
          }, null, _parent));
          _push(ssrRenderComponent(unref(FieldInput), {
            modelValue: unref(videoForm).apiKey,
            "onUpdate:modelValue": ($event) => unref(videoForm).apiKey = $event,
            label: "API Key",
            type: unref(showVideoKey) ? "text" : "password",
            placeholder: "sk-..."
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button class="text-white/38 hover:text-white/72"${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(showVideoKey) ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }, null), _parent2, _scopeId);
                _push2(`</button>`);
              } else {
                return [
                  createVNode("button", {
                    class: "text-white/38 hover:text-white/72",
                    onClick: ($event) => showVideoKey.value = !unref(showVideoKey)
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(unref(showVideoKey) ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }))
                  ], 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="flex items-center gap-3 pt-2"><button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white">`);
          _push(ssrRenderComponent(unref(Save), { class: "mr-1.5 inline-block size-3.5" }, null, _parent));
          _push(`${ssrInterpolate(t("保存", "Save"))}</button><button class="h-9 rounded-lg border border-white/10 bg-white/6 px-4 text-xs text-white/72 transition hover:bg-white/10">`);
          _push(ssrRenderComponent(unref(RefreshCw), { class: "mr-1.5 inline-block size-3.5" }, null, _parent));
          _push(`${ssrInterpolate(t("测试", "Test"))}</button>`);
          if (unref(apiStatusMsg)) {
            _push(`<span class="${ssrRenderClass([unref(apiStatusError) ? "text-red-400" : "text-emerald-300", "text-xs"])}">${ssrInterpolate(unref(apiStatusMsg))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "account") {
        _push(`<section class="space-y-4"><div><h1 class="text-xl font-semibold text-white">${ssrInterpolate(t("账号设置", "Account Settings"))}</h1><p class="mt-0.5 text-sm text-white/45">${ssrInterpolate(t("管理个人资料、偏好和安全设置", "Manage profile, preferences and security"))}</p></div><div class="rounded-xl border border-white/10 bg-white/[0.04] p-5"><div class="mb-4 flex gap-1 rounded-lg bg-black/20 p-1"><!--[-->`);
        ssrRenderList(unref(subTabs), (st) => {
          _push(`<button class="${ssrRenderClass([unref(activeSubTab) === st.key ? "bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30" : "text-white/55 hover:text-white/80", "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"])}">${ssrInterpolate(st.label)}</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(activeSubTab) === "profile") {
          _push(`<div class="space-y-4"><div class="flex items-center gap-4"><div class="relative cursor-pointer group">`);
          if (unref(authStore).user?.avatar) {
            _push(`<div class="size-14 overflow-hidden rounded-full"><img${ssrRenderAttr("src", unref(authStore).user.avatar)} class="size-full object-cover"></div>`);
          } else {
            _push(`<div class="grid size-14 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">${ssrInterpolate(unref(profileInitial))}</div>`);
          }
          _push(`<div class="absolute inset-0 grid place-items-center rounded-full bg-black/50 text-[10px] text-white opacity-0 transition group-hover:opacity-100">`);
          _push(ssrRenderComponent(unref(Camera), { class: "size-5" }, null, _parent));
          _push(`</div><input type="file" accept="image/*" class="hidden"></div><div><h2 class="text-sm font-semibold text-white">${ssrInterpolate(unref(userName))}</h2><p class="text-xs text-white/42">${ssrInterpolate(unref(userEmail) || t("未设置邮箱", "No email"))}</p></div>`);
          if (unref(avatarMsg)) {
            _push(`<span class="${ssrRenderClass([unref(avatarMsgError) ? "text-red-400" : "text-emerald-300", "text-xs"])}">${ssrInterpolate(unref(avatarMsg))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="grid gap-4 md:grid-cols-2"><label class="block"><span class="mb-1 block text-xs text-white/48">${ssrInterpolate(t("用户名", "Username"))}</span><input${ssrRenderAttr("value", unref(profileForm).username)} class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1 block text-xs text-white/48">${ssrInterpolate(t("昵称", "Nickname"))}</span><input${ssrRenderAttr("value", unref(profileForm).nickname)} class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1 block text-xs text-white/48">${ssrInterpolate(t("邮箱", "Email"))}</span><input${ssrRenderAttr("value", unref(profileForm).email)} class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1 block text-xs text-white/48">${ssrInterpolate(t("手机", "Phone"))}</span><input${ssrRenderAttr("value", unref(profileForm).phone)} class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label></div><div class="flex items-center gap-3"><button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white">${ssrInterpolate(t("保存资料", "Save Profile"))}</button><span class="text-xs text-emerald-300/80">${ssrInterpolate(unref(profileSavedMsg))}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeSubTab) === "preferences") {
          _push(`<div class="space-y-4"><h2 class="text-sm font-semibold text-white">${ssrInterpolate(t("偏好设置", "Preferences"))}</h2><div class="grid gap-4 md:grid-cols-2"><label class="block"><span class="mb-1 block text-xs text-white/48">${ssrInterpolate(t("界面语言", "Language"))}</span><select class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option value="zh"${ssrIncludeBooleanAttr(Array.isArray(unref(languageProxy)) ? ssrLooseContain(unref(languageProxy), "zh") : ssrLooseEqual(unref(languageProxy), "zh")) ? " selected" : ""}>中文</option><option value="en"${ssrIncludeBooleanAttr(Array.isArray(unref(languageProxy)) ? ssrLooseContain(unref(languageProxy), "en") : ssrLooseEqual(unref(languageProxy), "en")) ? " selected" : ""}>English</option></select></label><label class="block"><span class="mb-1 block text-xs text-white/48">${ssrInterpolate(t("主题", "Theme"))}</span><select class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option value="dark"${ssrIncludeBooleanAttr(Array.isArray(unref(themeProxy)) ? ssrLooseContain(unref(themeProxy), "dark") : ssrLooseEqual(unref(themeProxy), "dark")) ? " selected" : ""}>${ssrInterpolate(t("深色", "Dark"))}</option><option value="light"${ssrIncludeBooleanAttr(Array.isArray(unref(themeProxy)) ? ssrLooseContain(unref(themeProxy), "light") : ssrLooseEqual(unref(themeProxy), "light")) ? " selected" : ""}>${ssrInterpolate(t("浅色", "Light"))}</option></select></label></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeSubTab) === "security") {
          _push(`<div class="space-y-4"><h2 class="text-sm font-semibold text-white">${ssrInterpolate(t("安全", "Security"))}</h2><div class="grid gap-4 md:grid-cols-3"><input${ssrRenderAttr("value", unref(passwordForm).old)} type="password"${ssrRenderAttr("placeholder", t("当前密码", "Current password"))} class="h-10 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><input${ssrRenderAttr("value", unref(passwordForm).next)} type="password"${ssrRenderAttr("placeholder", t("新密码", "New password"))} class="h-10 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><input${ssrRenderAttr("value", unref(passwordForm).confirm)} type="password"${ssrRenderAttr("placeholder", t("确认新密码", "Confirm password"))} class="h-10 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></div><div class="flex items-center gap-3"><button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white"${ssrIncludeBooleanAttr(unref(passwordSaving)) ? " disabled" : ""}>`);
          if (unref(passwordSaving)) {
            _push(`<span class="inline-block mr-1.5 size-3 animate-spin rounded-full border-2 border-[#061018] border-t-transparent"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(t("修改密码", "Change Password"))}</button>`);
          if (unref(passwordMsg)) {
            _push(`<span class="${ssrRenderClass([unref(passwordMsgError) ? "text-red-400" : "text-emerald-300", "text-xs"])}">${ssrInterpolate(unref(passwordMsg))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-6 border-t border-white/10 pt-5"><button class="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500/20 hover:text-red-200">`);
        _push(ssrRenderComponent(unref(LogOut), { class: "size-4" }, null, _parent));
        _push(` ${ssrInterpolate(t("退出账号", "Logout"))}</button></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-Cggsl70d.mjs.map
