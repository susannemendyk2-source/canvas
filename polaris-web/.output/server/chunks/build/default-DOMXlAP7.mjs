import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { Compass, ArrowLeft } from 'lucide-vue-next';
import { c as useRoute, f as useRouter } from './server.mjs';
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
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isHome = computed(() => route.path === "/");
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#050608] text-white" }, _attrs))}>`);
      if (!unref(isHome)) {
        _push(`<header class="flex h-12 items-center border-b border-white/8 bg-[#04070d]/90 px-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "flex items-center gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Compass), { class: "size-4 text-studio-cyan" }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm font-semibold"${_scopeId}>Polaris</span>`);
            } else {
              return [
                createVNode(unref(Compass), { class: "size-4 text-studio-cyan" }),
                createVNode("span", { class: "text-sm font-semibold" }, "Polaris")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="ml-3 text-xs text-white/30">|</span><button class="ml-3 flex items-center gap-1 text-xs text-white/45 transition hover:text-white">`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "size-3" }, null, _parent));
        _push(` Back </button></header>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DOMXlAP7.mjs.map
