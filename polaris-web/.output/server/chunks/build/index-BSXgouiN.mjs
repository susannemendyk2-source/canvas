import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, toDisplayString, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrRenderClass } from 'vue/server-renderer';
import { Users, FolderKanban, Image, Coins, ChevronRight } from 'lucide-vue-next';
import { a as useSettingsStore } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const stats = ref([
      { key: "users", label: t("用户总数", "Total Users"), value: 0, icon: Users, color: "text-cyan-300", hint: t("账号", "accounts") },
      { key: "projects", label: t("项目总数", "Total Projects"), value: 0, icon: FolderKanban, color: "text-violet-300", hint: t("画布", "canvases") },
      { key: "assets", label: t("素材总数", "Total Assets"), value: 0, icon: Image, color: "text-emerald-300", hint: t("文件", "files") },
      { key: "credits", label: t("积分消耗", "Credits Used"), value: 0, icon: Coins, color: "text-amber-300", hint: t("星尘", "credits") }
    ]);
    const health = computed(() => [
      { label: t("前端工作台", "Web workspace"), value: t("正常", "Healthy"), ok: true },
      { label: t("后端 API", "Backend API"), value: t("已连接", "Connected"), ok: true },
      { label: t("模型服务配置", "Provider config"), value: t("待完善", "Pending"), ok: false }
    ]);
    const quickLinks = computed(() => [
      { label: t("用户与积分", "Users and credits"), to: "/admin/users" },
      { label: t("模板管理", "Templates"), to: "/admin/templates" },
      { label: t("模型供应商", "Providers"), to: "/admin/providers" },
      { label: t("系统设置", "Settings"), to: "/admin/settings" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-6 py-8" }, _attrs))}><section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">${ssrInterpolate(t("管理后台", "Admin Console"))}</p><h1 class="mt-2 text-2xl font-semibold text-white">${ssrInterpolate(t("系统概览", "System Overview"))}</h1><p class="mt-1 text-sm text-white/45">${ssrInterpolate(t("查看用户、项目、素材和积分运行情况。", "Monitor users, projects, assets and credit usage."))}</p></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/users",
        class: "rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("用户管理", "Users"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("用户管理", "Users")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/projects",
        class: "rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("项目审核", "Projects"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("项目审核", "Projects")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/logs",
        class: "rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("系统日志", "Logs"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("系统日志", "Logs")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="rounded-lg border border-white/10 bg-white/[0.04] p-5"><div class="mb-4 flex items-center justify-between">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(stat.icon), {
          class: ["size-5", stat.color]
        }, null), _parent);
        _push(`<span class="text-xs text-white/35">${ssrInterpolate(stat.hint)}</span></div><p class="text-3xl font-semibold text-white">${ssrInterpolate(stat.value.toLocaleString())}</p><p class="mt-1 text-sm text-white/45">${ssrInterpolate(stat.label)}</p></div>`);
      });
      _push(`<!--]--></section><section class="mt-6 grid gap-4 lg:grid-cols-2"><div class="rounded-lg border border-white/10 bg-white/[0.04] p-5"><h2 class="text-sm font-semibold text-white">${ssrInterpolate(t("运营状态", "Operations"))}</h2><div class="mt-4 space-y-3"><!--[-->`);
      ssrRenderList(unref(health), (item) => {
        _push(`<div class="flex items-center justify-between rounded-md border border-white/8 bg-black/20 px-3 py-2"><span class="text-sm text-white/62">${ssrInterpolate(item.label)}</span><span class="${ssrRenderClass(["text-sm font-medium", item.ok ? "text-emerald-300" : "text-amber-300"])}">${ssrInterpolate(item.value)}</span></div>`);
      });
      _push(`<!--]--></div></div><div class="rounded-lg border border-white/10 bg-white/[0.04] p-5"><h2 class="text-sm font-semibold text-white">${ssrInterpolate(t("快捷入口", "Quick Actions"))}</h2><div class="mt-4 grid gap-3 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(unref(quickLinks), (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.to,
          to: link.to,
          class: "flex items-center justify-between rounded-md border border-white/8 bg-black/20 px-3 py-3 text-sm text-white/70 transition hover:border-cyan-200/30 hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)} `);
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "size-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(toDisplayString(link.label) + " ", 1),
                createVNode(unref(ChevronRight), { class: "size-4" })
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BSXgouiN.mjs.map
