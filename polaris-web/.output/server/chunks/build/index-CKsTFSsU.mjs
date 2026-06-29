import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { Upload, Search, Image, Heart, X } from 'lucide-vue-next';
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
    const showUpload = ref(false);
    const uploadName = ref("");
    const searchQuery = ref("");
    const activeFilter = ref("all");
    const assets = ref([]);
    const filters = computed(() => [
      { value: "all", label: t("全部", "All") },
      { value: "image", label: t("图片", "Image") },
      { value: "video", label: t("视频", "Video") },
      { value: "audio", label: t("音频", "Audio") }
    ]);
    const filteredAssets = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return assets.value.filter((asset) => {
        const text = `${asset.title || ""} ${asset.name || ""}`.toLowerCase();
        const type = `${asset.type || ""}`.toLowerCase();
        return (!q || text.includes(q)) && (activeFilter.value === "all" || type.includes(activeFilter.value));
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-6 py-8" }, _attrs))}><section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">${ssrInterpolate(t("创作资源", "Creative Assets"))}</p><h1 class="mt-2 text-2xl font-semibold text-white">${ssrInterpolate(t("素材库", "Asset Library"))}</h1><p class="mt-1 text-sm text-white/45">${ssrInterpolate(t("管理可投放到星图画布的图片、视频和参考素材。", "Manage images, videos and references used on the star map canvas."))}</p></div><button class="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white">`);
      _push(ssrRenderComponent(unref(Upload), { class: "size-4" }, null, _parent));
      _push(` ${ssrInterpolate(t("上传素材", "Upload Asset"))}</button></section><section class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><label class="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">`);
      _push(ssrRenderComponent(unref(Search), { class: "size-4" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} class="w-full bg-transparent outline-none placeholder:text-white/32"${ssrRenderAttr("placeholder", t("搜索素材", "Search assets"))}></label><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(filters), (tag) => {
        _push(`<button class="${ssrRenderClass([unref(activeFilter) === tag.value ? "border-cyan-300/30 bg-cyan-100/10 text-white" : "border-white/10 bg-white/6 text-white/60 hover:text-white", "rounded-full border px-3 py-1.5 text-xs transition"])}">${ssrInterpolate(tag.label)}</button>`);
      });
      _push(`<!--]--></div></section>`);
      if (unref(filteredAssets).length === 0) {
        _push(`<section class="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] py-20 text-white/35">`);
        _push(ssrRenderComponent(unref(Image), { class: "mb-3 size-12" }, null, _parent));
        _push(`<p class="text-sm">${ssrInterpolate(t("暂无素材", "No assets yet"))}</p></section>`);
      } else {
        _push(`<section class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"><!--[-->`);
        ssrRenderList(unref(filteredAssets), (asset) => {
          _push(`<article class="group rounded-lg border border-white/10 bg-white/[0.04] p-2 transition hover:border-cyan-100/25"><div class="relative mb-3 aspect-video overflow-hidden rounded-md bg-black/35">`);
          if (asset.url) {
            _push(`<img${ssrRenderAttr("src", asset.url)}${ssrRenderAttr("alt", asset.title)} class="h-full w-full object-cover">`);
          } else {
            _push(`<div class="flex h-full items-center justify-center text-white/20">`);
            _push(ssrRenderComponent(unref(Image), { class: "size-8" }, null, _parent));
            _push(`</div>`);
          }
          _push(`<span class="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase text-white/70">${ssrInterpolate(asset.type || "asset")}</span></div><div class="flex items-center justify-between gap-2"><div class="min-w-0"><p class="truncate text-sm text-white/78">${ssrInterpolate(asset.title || asset.name || t("未命名素材", "Untitled Asset"))}</p><p class="text-[11px] text-white/35">${ssrInterpolate(asset.createdAt || "-")}</p></div><button class="grid size-8 shrink-0 place-items-center rounded-md text-white/35 transition hover:bg-white/8 hover:text-amber-300">`);
          _push(ssrRenderComponent(unref(Heart), {
            class: ["size-4", asset.favorite ? "fill-amber-300 text-amber-300" : ""]
          }, null, _parent));
          _push(`</button></div></article>`);
        });
        _push(`<!--]--></section>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showUpload)) {
          _push2(`<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div class="w-full max-w-md rounded-lg border border-white/10 bg-[#10131a] p-5 shadow-glass"><div class="mb-4 flex items-center justify-between"><h2 class="text-base font-semibold text-white">${ssrInterpolate(t("上传素材", "Upload Asset"))}</h2><button class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white">`);
          _push2(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent));
          _push2(`</button></div><label class="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/12 bg-black/24 p-10 text-center transition hover:border-cyan-200/30">`);
          _push2(ssrRenderComponent(unref(Upload), { class: "mb-3 size-8 text-white/30" }, null, _parent));
          _push2(`<p class="text-sm text-white/55">${ssrInterpolate(unref(uploadName) || t("选择本地文件", "Choose a local file"))}</p><p class="mt-1 text-xs text-white/30">${ssrInterpolate(t("支持图片、视频、音频和参考文件", "Images, videos, audio and references"))}</p><input type="file" class="hidden"></label><div class="mt-4 flex justify-end gap-3"><button class="h-10 rounded-lg border border-white/10 bg-white/6 px-4 text-sm text-white/72">${ssrInterpolate(t("取消", "Cancel"))}</button><button class="h-10 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018]">${ssrInterpolate(t("添加到素材库", "Add to Library"))}</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/assets/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CKsTFSsU.mjs.map
