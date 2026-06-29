import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PageHead",
  __ssrInlineRender: true,
  props: {
    title: {},
    desc: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" }, _attrs))}><div><p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">Admin Console</p><h1 class="mt-2 text-2xl font-semibold text-white">${ssrInterpolate(__props.title)}</h1><p class="mt-1 text-sm text-white/45">${ssrInterpolate(__props.desc)}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/dashboard",
        class: "rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dashboard`);
          } else {
            return [
              createTextVNode("Dashboard")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/PageHead.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PageHead = Object.assign(_sfc_main, { __name: "AdminPageHead" });

export { PageHead as P };
//# sourceMappingURL=PageHead-C40rZ_ja.mjs.map
