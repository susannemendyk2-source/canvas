import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { Plus, Search, FolderKanban, ChevronRight } from 'lucide-vue-next';
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
    const searchQuery = ref("");
    const activeFilter = ref("all");
    const projects = ref([]);
    const filterTags = computed(() => [
      { value: "all", label: t("全部", "All") },
      { value: "magic", label: t("星图画布", "Star Map") },
      { value: "workflow", label: t("节点工作流", "Workflow") },
      { value: "image", label: t("图片", "Image") },
      { value: "video", label: t("视频", "Video") }
    ]);
    const filteredProjects = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return projects.value.filter((project) => {
        const text = `${project.name || ""} ${project.title || ""} ${project.description || ""}`.toLowerCase();
        const mode = `${project.mode || project.type || ""}`.toLowerCase();
        const matchQuery = !q || text.includes(q);
        const matchFilter = activeFilter.value === "all" || mode.includes(activeFilter.value);
        return matchQuery && matchFilter;
      });
    });
    function modeLabel(mode) {
      const value = (mode || "magic").toLowerCase();
      if (value.includes("workflow")) return t("工作流", "Workflow");
      if (value.includes("image")) return t("图片", "Image");
      if (value.includes("video")) return t("视频", "Video");
      return t("星图", "Star");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-6 py-8" }, _attrs))}><section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">${ssrInterpolate(t("工作区", "Workspace"))}</p><h1 class="mt-2 text-2xl font-semibold text-white">${ssrInterpolate(t("我的项目", "My Projects"))}</h1><p class="mt-1 text-sm text-white/45">${ssrInterpolate(t("管理星图画布、节点工作流和生成任务。", "Manage star maps, workflows and generation tasks."))}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/studio",
        class: "inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "size-4" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(t("新建项目", "New Project"))}`);
          } else {
            return [
              createVNode(unref(Plus), { class: "size-4" }),
              createTextVNode(" " + toDisplayString(t("新建项目", "New Project")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><section class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><label class="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">`);
      _push(ssrRenderComponent(unref(Search), { class: "size-4" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} class="w-full bg-transparent outline-none placeholder:text-white/32"${ssrRenderAttr("placeholder", t("搜索项目", "Search projects"))}></label><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(filterTags), (tag) => {
        _push(`<button class="${ssrRenderClass([unref(activeFilter) === tag.value ? "border-cyan-300/30 bg-cyan-100/10 text-white" : "border-white/10 bg-white/6 text-white/60 hover:text-white", "rounded-full border px-3 py-1.5 text-xs transition"])}">${ssrInterpolate(tag.label)}</button>`);
      });
      _push(`<!--]--></div></section>`);
      if (unref(filteredProjects).length === 0) {
        _push(`<section class="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] py-20 text-white/35">`);
        _push(ssrRenderComponent(unref(FolderKanban), { class: "mb-3 size-12" }, null, _parent));
        _push(`<p class="text-sm">${ssrInterpolate(t("暂无项目", "No projects yet"))}</p></section>`);
      } else {
        _push(`<section class="grid gap-4 md:grid-cols-3 xl:grid-cols-4"><!--[-->`);
        ssrRenderList(unref(filteredProjects), (project) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: project.id,
            to: `/projects/${project.id}`,
            class: "rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-cyan-100/25 hover:bg-white/[0.06]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="mb-3 flex items-start justify-between gap-3"${_scopeId}><h3 class="line-clamp-2 font-semibold text-white"${_scopeId}>${ssrInterpolate(project.name || project.title || t("未命名项目", "Untitled Project"))}</h3><span class="shrink-0 rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] uppercase text-white/50"${_scopeId}>${ssrInterpolate(modeLabel(project.mode || project.type))}</span></div><p class="mb-4 line-clamp-2 min-h-8 text-xs text-white/45"${_scopeId}>${ssrInterpolate(project.description || t("暂无描述", "No description"))}</p><div class="flex items-center justify-between text-[11px] text-white/35"${_scopeId}><span${_scopeId}>${ssrInterpolate(project.savedAt || project.updatedAt || project.createdAt || "-")}</span>`);
                _push2(ssrRenderComponent(unref(ChevronRight), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "mb-3 flex items-start justify-between gap-3" }, [
                    createVNode("h3", { class: "line-clamp-2 font-semibold text-white" }, toDisplayString(project.name || project.title || t("未命名项目", "Untitled Project")), 1),
                    createVNode("span", { class: "shrink-0 rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] uppercase text-white/50" }, toDisplayString(modeLabel(project.mode || project.type)), 1)
                  ]),
                  createVNode("p", { class: "mb-4 line-clamp-2 min-h-8 text-xs text-white/45" }, toDisplayString(project.description || t("暂无描述", "No description")), 1),
                  createVNode("div", { class: "flex items-center justify-between text-[11px] text-white/35" }, [
                    createVNode("span", null, toDisplayString(project.savedAt || project.updatedAt || project.createdAt || "-"), 1),
                    createVNode(unref(ChevronRight), { class: "size-4" })
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-RnLlwHrq.mjs.map
