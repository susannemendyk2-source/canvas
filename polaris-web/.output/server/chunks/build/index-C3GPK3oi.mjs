import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, withCtx, createTextVNode, toDisplayString, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderDynamicModel, ssrRenderVNode } from 'vue/server-renderer';
import { Search, KeyRound, X, EyeOff, Eye, Save } from 'lucide-vue-next';
import { a as useSettingsStore, b as api } from './server.mjs';
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

const adminService = {
  dashboard: () => api.get("/api/admin/stats/dashboard"),
  listUsers: (params) => api.get("/api/admin/users", { params }),
  updateUserStatus: (id, status) => api.put(`/api/admin/users/${id}/status`, { status }),
  updateUserCredits: (id, amount, remark) => api.put(`/api/admin/users/${id}/credits`, { amount, remark }),
  assignRole: (id, roleId) => api.put(`/api/admin/users/${id}/role`, { roleId }),
  listProjects: (params) => api.get("/api/admin/projects", { params }),
  reviewProject: (id, status) => api.put(`/api/admin/projects/${id}/status`, { status }),
  publishTemplate: (id) => api.post("/api/admin/templates", { projectId: id }),
  statsCredits: () => api.get("/api/admin/stats/credits"),
  logs: (params) => api.get("/api/admin/logs", { params }),
  getUserProviders: (userId) => api.get(`/api/admin/users/${userId}/providers`),
  saveUserProvider: (userId, data) => api.put(`/api/admin/users/${userId}/providers`, data)
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const searchQuery = ref("");
    const users = ref([]);
    const loading = ref(false);
    const creditDialog = reactive({
      user: null,
      amount: 0,
      remark: ""
    });
    const filteredUsers = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return users.value;
      return users.value.filter((user) => `${user.username} ${user.nickname || ""} ${user.email || ""}`.toLowerCase().includes(q));
    });
    function normalizedStatus(user) {
      return user.status === 0 || user.status === "DISABLED" ? 0 : 1;
    }
    function roleText(user) {
      const value = user.roleNames || user.roles;
      return Array.isArray(value) ? value.join(", ") : value || "USER";
    }
    const apiDialog = reactive({ user: null });
    const apiActiveTab = ref("chat");
    const apiShowKey = ref(false);
    const apiMsg = ref("");
    const apiMsgError = ref(false);
    const apiForm = reactive({ provider: "", baseUrl: "", apiKey: "", model: "" });
    const apiTabs = computed(() => [
      { key: "chat", label: t("Chat", "Chat") },
      { key: "image", label: t("图像", "Image") },
      { key: "video", label: t("视频", "Video") }
    ]);
    async function loadUserProviders(userId) {
      try {
        const res = await adminService.getUserProviders(userId);
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        const active = apiActiveTab.value;
        const key = active === "chat" ? "chat" : active === "image" ? "image-openai" : "video-default";
        const found = list.find((p) => p.provider === key || p.provider?.startsWith(active === "image" ? "image-" : "video-"));
        if (found) {
          apiForm.baseUrl = found.baseUrl || "";
          apiForm.apiKey = found.apiKey || "";
          apiForm.model = found.model || "";
        }
      } catch {
      }
    }
    watch(apiActiveTab, () => {
      apiMsg.value = "";
      if (apiDialog.user) loadUserProviders(apiDialog.user.id);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-6 py-8" }, _attrs))}><section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">${ssrInterpolate(t("管理后台", "Admin Console"))}</p><h1 class="mt-2 text-2xl font-semibold text-white">${ssrInterpolate(t("用户与积分", "Users and Credits"))}</h1><p class="mt-1 text-sm text-white/45">${ssrInterpolate(t("管理账号状态、角色标识和积分余额。", "Manage account status, role labels and credit balances."))}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/dashboard",
        class: "rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("返回概览", "Back to Overview"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("返回概览", "Back to Overview")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><section class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><label class="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">`);
      _push(ssrRenderComponent(unref(Search), { class: "size-4" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} class="w-full bg-transparent outline-none placeholder:text-white/32"${ssrRenderAttr("placeholder", t("搜索用户名或邮箱", "Search username or email"))}></label><button class="h-10 rounded-lg border border-white/10 bg-white/6 px-4 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">${ssrInterpolate(t("刷新", "Refresh"))}</button></section><section class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]"><div class="overflow-x-auto"><table class="w-full min-w-[920px] text-sm"><thead><tr class="border-b border-white/8 text-left text-xs text-white/45"><th class="px-4 py-3 font-medium">ID</th><th class="px-4 py-3 font-medium">${ssrInterpolate(t("用户", "User"))}</th><th class="px-4 py-3 font-medium">${ssrInterpolate(t("邮箱", "Email"))}</th><th class="px-4 py-3 font-medium">${ssrInterpolate(t("状态", "Status"))}</th><th class="px-4 py-3 font-medium">${ssrInterpolate(t("积分", "Credits"))}</th><th class="px-4 py-3 font-medium">${ssrInterpolate(t("角色", "Roles"))}</th><th class="px-4 py-3 font-medium">${ssrInterpolate(t("创建时间", "Created"))}</th><th class="px-4 py-3 font-medium">${ssrInterpolate(t("操作", "Actions"))}</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr><td colspan="8" class="px-4 py-10 text-center text-white/35">${ssrInterpolate(t("加载中...", "Loading..."))}</td></tr>`);
      } else if (unref(filteredUsers).length === 0) {
        _push(`<tr><td colspan="8" class="px-4 py-10 text-center text-white/35">${ssrInterpolate(t("暂无用户", "No users found"))}</td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(filteredUsers), (user) => {
          _push(`<tr class="border-b border-white/5 transition hover:bg-white/5"><td class="px-4 py-3 text-white/55">${ssrInterpolate(user.id)}</td><td class="px-4 py-3"><p class="font-medium text-white">${ssrInterpolate(user.nickname || user.username)}</p><p class="text-xs text-white/35">${ssrInterpolate(user.username)}</p></td><td class="px-4 py-3 text-white/60">${ssrInterpolate(user.email || "-")}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["rounded-full px-2 py-0.5 text-[11px]", normalizedStatus(user) === 1 ? "bg-emerald-500/12 text-emerald-300" : "bg-white/8 text-white/45"])}">${ssrInterpolate(normalizedStatus(user) === 1 ? t("启用", "Active") : t("禁用", "Disabled"))}</span></td><td class="px-4 py-3 font-medium text-cyan-50">${ssrInterpolate(Number(user.credits || 0).toLocaleString())}</td><td class="px-4 py-3 text-white/60">${ssrInterpolate(roleText(user))}</td><td class="px-4 py-3 text-xs text-white/40">${ssrInterpolate(user.createdAt || "-")}</td><td class="px-4 py-3"><div class="flex flex-wrap gap-2"><button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/62 hover:text-white">${ssrInterpolate(normalizedStatus(user) === 1 ? t("禁用", "Disable") : t("启用", "Enable"))}</button><button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/62 hover:text-white">${ssrInterpolate(t("调整积分", "Credits"))}</button><button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/62 hover:text-white">`);
          _push(ssrRenderComponent(unref(KeyRound), { class: "mr-1 inline size-3" }, null, _parent));
          _push(`API </button></div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div></section>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(creditDialog).user) {
          _push2(`<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div class="w-full max-w-sm rounded-lg border border-white/10 bg-[#10131a] p-5 shadow-glass"><h2 class="text-base font-semibold text-white">${ssrInterpolate(t("调整积分", "Adjust Credits"))}</h2><p class="mt-1 text-sm text-white/45">${ssrInterpolate(unref(creditDialog).user.username)}</p><input${ssrRenderAttr("value", unref(creditDialog).amount)} type="number" class="mt-4 h-11 w-full rounded-lg border border-white/8 bg-black/50 px-3 text-sm text-white outline-none focus:border-cyan-400/60"${ssrRenderAttr("placeholder", t("输入正数或负数", "Positive or negative amount"))}><input${ssrRenderAttr("value", unref(creditDialog).remark)} class="mt-3 h-11 w-full rounded-lg border border-white/8 bg-black/50 px-3 text-sm text-white outline-none focus:border-cyan-400/60"${ssrRenderAttr("placeholder", t("备注", "Remark"))}><div class="mt-5 flex justify-end gap-3"><button class="h-10 rounded-lg border border-white/10 bg-white/6 px-4 text-sm text-white/72">${ssrInterpolate(t("取消", "Cancel"))}</button><button class="h-10 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018]">${ssrInterpolate(t("确认", "Confirm"))}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(apiDialog).user) {
          _push2(`<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div class="w-full max-w-lg rounded-lg border border-white/10 bg-[#10131a] p-5 shadow-glass"><div class="mb-4 flex items-center justify-between"><h2 class="text-base font-semibold text-white">${ssrInterpolate(t("API 配置", "API Config"))} — ${ssrInterpolate(unref(apiDialog).user?.username)}</h2><button class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white">`);
          _push2(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent));
          _push2(`</button></div><div class="mb-4 flex gap-1 rounded-lg bg-black/20 p-1"><!--[-->`);
          ssrRenderList(unref(apiTabs), (tab) => {
            _push2(`<button class="${ssrRenderClass([unref(apiActiveTab) === tab.key ? "bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30" : "text-white/55 hover:text-white/80", "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"])}">${ssrInterpolate(tab.label)}</button>`);
          });
          _push2(`<!--]--></div><div class="space-y-3"><label class="block"><span class="mb-1 block text-xs text-white/55">Base URL</span><input${ssrRenderAttr("value", unref(apiForm).baseUrl)} class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50"></label><label class="block"><span class="mb-1 block text-xs text-white/55">Model</span><input${ssrRenderAttr("value", unref(apiForm).model)} class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50"></label><label class="block"><span class="mb-1 block text-xs text-white/55">API Key</span><div class="relative"><input${ssrRenderDynamicModel(unref(apiShowKey) ? "text" : "password", unref(apiForm).apiKey, null)}${ssrRenderAttr("type", unref(apiShowKey) ? "text" : "password")} class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 pr-9 text-sm text-white/80 outline-none focus:border-cyan-300/50"><button class="absolute right-2 top-1/2 -translate-y-1/2 text-white/38 hover:text-white/72">`);
          ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(apiShowKey) ? unref(EyeOff) : unref(Eye)), { class: "size-3.5" }, null), _parent);
          _push2(`</button></div></label></div><div class="mt-5 flex items-center gap-3 border-t border-white/10 pt-4"><button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white">`);
          _push2(ssrRenderComponent(unref(Save), { class: "mr-1.5 inline size-3.5" }, null, _parent));
          _push2(`${ssrInterpolate(t("保存", "Save"))}</button>`);
          if (unref(apiMsg)) {
            _push2(`<span class="${ssrRenderClass([unref(apiMsgError) ? "text-red-400" : "text-emerald-300", "text-xs"])}">${ssrInterpolate(unref(apiMsg))}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C3GPK3oi.mjs.map
