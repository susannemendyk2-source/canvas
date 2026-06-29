import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { Navigation, EyeOff, Eye, Loader2 } from 'lucide-vue-next';
import { d as useAuthStore } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const username = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen items-center justify-center bg-[#050608] p-4 text-white" }, _attrs))}><section class="w-full max-w-md rounded-xl border border-white/10 bg-[#10131a]/92 p-8 shadow-glass"><div class="mb-8 text-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "mx-auto mb-4 grid size-11 w-fit place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Navigation), { class: "size-5 text-cyan-100" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Navigation), { class: "size-5 text-cyan-100" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-xl font-semibold">Login</h1><p class="mt-1 text-sm text-white/45">Welcome back to Polaris</p></div><form class="space-y-4"><label class="block"><span class="mb-1.5 block text-xs text-white/48">Username</span><input${ssrRenderAttr("value", unref(username))} autocomplete="username" class="h-11 w-full rounded-lg border border-white/8 bg-black/60 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60" placeholder="Enter username"></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">Password</span><div class="flex h-11 items-center rounded-lg border border-white/8 bg-black/60 focus-within:border-cyan-400/60"><input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} autocomplete="current-password" class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="Enter password"><button type="button" class="grid size-10 place-items-center text-white/42 hover:text-white">`);
      if (unref(showPassword)) {
        _push(ssrRenderComponent(unref(EyeOff), { class: "size-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Eye), { class: "size-4" }, null, _parent));
      }
      _push(`</button></div></label><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-100 text-sm font-medium text-[#061018] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">`);
      if (unref(loading)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "size-4 animate-spin" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(loading) ? "Signing in..." : "Login")}</button>`);
      if (unref(error)) {
        _push(`<p class="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-center text-xs text-amber-100">${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><p class="mt-6 text-center text-sm text-white/42"> No account yet? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "text-cyan-100 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Register`);
          } else {
            return [
              createTextVNode("Register")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DCoOhD9f.mjs.map
