import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, resolveDynamicComponent, openBlock, createBlock, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { Navigation, LayoutDashboard, Users, FolderKanban, FileText, Cpu, Settings, ScrollText, ArrowLeft } from 'lucide-vue-next';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
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
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const links = [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/projects", label: "Projects", icon: FolderKanban },
      { to: "/admin/templates", label: "Templates", icon: FileText },
      { to: "/admin/providers", label: "AI Providers", icon: Cpu },
      { to: "/admin/settings", label: "Settings", icon: Settings },
      { to: "/admin/logs", label: "Logs", icon: ScrollText }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen bg-[#050608] text-white" }, _attrs))}><aside class="flex w-56 flex-col border-r border-white/10 bg-[#090A0F]">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex h-16 items-center gap-3 border-b border-white/8 px-5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid size-9 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Navigation), { class: "size-5 text-cyan-100" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><div class="text-sm font-semibold tracking-wide"${_scopeId}>Polaris</div><div class="text-[10px] uppercase tracking-[0.32em] text-cyan-100/45"${_scopeId}>Admin</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid size-9 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow" }, [
                createVNode(unref(Navigation), { class: "size-5 text-cyan-100" })
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "text-sm font-semibold tracking-wide" }, "Polaris"),
                createVNode("div", { class: "text-[10px] uppercase tracking-[0.32em] text-cyan-100/45" }, "Admin")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex-1 space-y-1 p-4 text-sm text-white/52"><!--[-->`);
      ssrRenderList(links, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: "flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/6 hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), { class: "size-4" }, null), _parent2, _scopeId);
              _push2(` ${ssrInterpolate(item.label)}`);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "size-4" })),
                createTextVNode(" " + toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="border-t border-white/8 p-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/studio",
        class: "flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/42 transition hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "size-4" }, null, _parent2, _scopeId));
            _push2(` Back to Studio `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "size-4" }),
              createTextVNode(" Back to Studio ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></aside><main class="flex-1 overflow-auto">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-B0aDmras.mjs.map
