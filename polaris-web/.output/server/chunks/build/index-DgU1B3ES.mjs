import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { KeyRound, Link2, Cpu } from 'lucide-vue-next';
import { P as PageHead } from './PageHead-C40rZ_ja.mjs';
import { a as useSettingsStore } from './server.mjs';
import './nuxt-link-5Lsne2ZX.mjs';
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
    const activeTab = ref("deepseek");
    const showKey = ref(false);
    const saved = ref("");
    const providerTabs = [{ id: "deepseek", label: "DeepSeek" }, { id: "runninghub", label: "RunningHub" }, { id: "volcano", label: "Volcano" }];
    const modelOptions = { deepseek: ["deepseek-chat", "deepseek-reasoner"], runninghub: ["nano-banana-pro", "nano-banana", "gpt-image-2", "custom-workflow"], volcano: ["doubao-seed-1-6", "doubao-vision-pro", "seedream-3-0"] };
    const configs = ref({ deepseek: { baseUrl: "https://api.deepseek.com", apiKey: "", model: "deepseek-chat" }, runninghub: { baseUrl: "", apiKey: "", model: "nano-banana-pro" }, volcano: { baseUrl: "", apiKey: "", model: "doubao-seed-1-6" } });
    const current = computed(() => configs.value[activeTab.value]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-6 py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(PageHead, {
        title: t("AI 供应商", "AI Providers"),
        desc: t("配置全局模型服务，供画布和工作流调用。", "Configure global model services for canvas and workflow calls.")
      }, null, _parent));
      _push(`<div class="mb-5 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(providerTabs, (tab) => {
        _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "border-cyan-300/30 bg-cyan-100/10 text-cyan-50" : "border-white/10 bg-white/6 text-white/55 hover:text-white", "rounded-lg border px-4 py-2 text-sm transition"])}">`);
        _push(ssrRenderComponent(unref(KeyRound), { class: "mr-1 inline size-4" }, null, _parent));
        _push(`${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><section class="rounded-lg border border-white/10 bg-white/[0.04] p-6"><div class="mb-4 flex items-center gap-2 text-xs text-white/42"><span class="${ssrRenderClass(["size-2 rounded-full", unref(current).apiKey ? "bg-emerald-400" : "bg-white/28"])}"></span>${ssrInterpolate(unref(current).apiKey ? t("已配置", "Configured") : t("未配置", "Not configured"))}</div><label class="mb-4 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48">`);
      _push(ssrRenderComponent(unref(Link2), { class: "size-4" }, null, _parent));
      _push(`API Base URL</span><input${ssrRenderAttr("value", unref(current).baseUrl)} class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="mb-4 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48">`);
      _push(ssrRenderComponent(unref(KeyRound), { class: "size-4" }, null, _parent));
      _push(`API Key</span><input${ssrRenderDynamicModel(unref(showKey) ? "text" : "password", unref(current).apiKey, null)}${ssrRenderAttr("type", unref(showKey) ? "text" : "password")} class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="mb-5 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48">`);
      _push(ssrRenderComponent(unref(Cpu), { class: "size-4" }, null, _parent));
      _push(`${ssrInterpolate(t("默认模型", "Default Model"))}</span><select class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60"><!--[-->`);
      ssrRenderList(modelOptions[unref(activeTab)], (m) => {
        _push(`<option${ssrRenderAttr("value", m)}${ssrIncludeBooleanAttr(Array.isArray(unref(current).model) ? ssrLooseContain(unref(current).model, m) : ssrLooseEqual(unref(current).model, m)) ? " selected" : ""}>${ssrInterpolate(m)}</option>`);
      });
      _push(`<!--]--></select></label><div class="flex flex-wrap gap-3"><button class="h-10 rounded-lg bg-cyan-100 px-5 text-sm font-medium text-[#061018]">${ssrInterpolate(t("保存", "Save"))}</button><button class="h-10 rounded-lg border border-white/10 bg-white/6 px-5 text-sm text-white/72">${ssrInterpolate(unref(showKey) ? t("隐藏密钥", "Hide Key") : t("显示密钥", "Show Key"))}</button><span class="self-center text-xs text-emerald-300/80">${ssrInterpolate(unref(saved))}</span></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/providers/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DgU1B3ES.mjs.map
