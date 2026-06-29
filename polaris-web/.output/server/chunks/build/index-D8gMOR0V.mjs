import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { FileText } from 'lucide-vue-next';
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
    const templates = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-6 py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(PageHead, {
        title: t("模板管理", "Template Management"),
        desc: t("维护面向用户的公开工作流和星图模板。", "Maintain public workflow and star map templates.")
      }, null, _parent));
      if (unref(templates).length === 0) {
        _push(`<section class="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] py-20 text-white/35">`);
        _push(ssrRenderComponent(unref(FileText), { class: "mb-3 size-12" }, null, _parent));
        _push(`<p class="text-sm">${ssrInterpolate(t("暂无模板", "No templates yet"))}</p></section>`);
      } else {
        _push(`<section class="grid gap-4 md:grid-cols-3 xl:grid-cols-4"><!--[-->`);
        ssrRenderList(unref(templates), (tmpl) => {
          _push(`<article class="rounded-lg border border-white/10 bg-white/[0.04] p-5"><div class="mb-3 flex items-start justify-between gap-3"><h3 class="line-clamp-2 font-semibold text-white">${ssrInterpolate(tmpl.name || tmpl.title)}</h3><span class="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] uppercase text-white/50">${ssrInterpolate(tmpl.mode || tmpl.type || "template")}</span></div><p class="mb-4 line-clamp-2 min-h-8 text-xs text-white/45">${ssrInterpolate(tmpl.description || t("暂无描述", "No description"))}</p><p class="mb-4 text-[11px] text-white/35">${ssrInterpolate(tmpl.createdAt || "-")}</p><div class="flex gap-2"><button class="rounded-md border border-white/8 bg-white/6 px-3 py-1.5 text-xs text-white/62 hover:text-white">${ssrInterpolate(t("编辑", "Edit"))}</button><button class="rounded-md border border-white/8 bg-white/6 px-3 py-1.5 text-xs text-amber-300/70 hover:text-amber-300">${ssrInterpolate(t("下架", "Remove"))}</button></div></article>`);
        });
        _push(`<!--]--></section>`);
      }
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/templates/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D8gMOR0V.mjs.map
