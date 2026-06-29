import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { a as useSettingsStore } from './server.mjs';
import { P as PageHead } from './PageHead-C40rZ_ja.mjs';
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
import './nuxt-link-5Lsne2ZX.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const activeStatus = ref("all");
    const projects = ref([]);
    const filters = computed(() => [{ value: "all", label: t("全部", "All") }, { value: "0", label: t("待审核", "Pending") }, { value: "1", label: t("已通过", "Approved") }, { value: "2", label: t("已驳回", "Rejected") }]);
    const filteredProjects = computed(() => activeStatus.value === "all" ? projects.value : projects.value.filter((p) => String(p.status ?? 0) === activeStatus.value));
    function statusClass(status) {
      return status === 1 ? "bg-emerald-500/12 text-emerald-300" : status === 2 ? "bg-white/8 text-white/45" : "bg-amber-500/12 text-amber-300";
    }
    function statusLabel(status) {
      return status === 1 ? t("已通过", "Approved") : status === 2 ? t("已驳回", "Rejected") : t("待审核", "Pending");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-6 py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(PageHead, {
        title: t("项目审核", "Project Review"),
        desc: t("审核公开项目，并将优秀项目发布为模板。", "Review public projects and publish strong examples as templates.")
      }, null, _parent));
      _push(`<div class="mb-4 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(filters), (item) => {
        _push(`<button class="${ssrRenderClass([unref(activeStatus) === item.value ? "border-cyan-300/30 bg-cyan-100/10 text-white" : "border-white/10 bg-white/6 text-white/60 hover:text-white", "rounded-full border px-3 py-1.5 text-xs transition"])}">${ssrInterpolate(item.label)}</button>`);
      });
      _push(`<!--]--></div><div class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]"><table class="w-full min-w-[860px] text-sm"><thead><tr class="border-b border-white/8 text-left text-xs text-white/45"><th class="px-4 py-3">ID</th><th class="px-4 py-3">${ssrInterpolate(t("项目", "Project"))}</th><th class="px-4 py-3">${ssrInterpolate(t("创建者", "Owner"))}</th><th class="px-4 py-3">${ssrInterpolate(t("模式", "Mode"))}</th><th class="px-4 py-3">${ssrInterpolate(t("状态", "Status"))}</th><th class="px-4 py-3">${ssrInterpolate(t("时间", "Time"))}</th><th class="px-4 py-3">${ssrInterpolate(t("操作", "Actions"))}</th></tr></thead><tbody>`);
      if (unref(projects).length === 0) {
        _push(`<tr><td colspan="7" class="px-4 py-10 text-center text-white/35">${ssrInterpolate(t("暂无项目", "No projects"))}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(filteredProjects), (project) => {
        _push(`<tr class="border-b border-white/5 hover:bg-white/5"><td class="px-4 py-3 text-white/55">${ssrInterpolate(project.id)}</td><td class="px-4 py-3 font-medium text-white">${ssrInterpolate(project.name || project.title || t("未命名项目", "Untitled Project"))}</td><td class="px-4 py-3 text-white/60">${ssrInterpolate(project.owner || project.username || "-")}</td><td class="px-4 py-3 text-xs uppercase text-white/45">${ssrInterpolate(project.mode || project.type || "magic")}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["rounded-full px-2 py-0.5 text-[11px]", statusClass(project.status)])}">${ssrInterpolate(statusLabel(project.status))}</span></td><td class="px-4 py-3 text-xs text-white/40">${ssrInterpolate(project.createdAt || "-")}</td><td class="px-4 py-3"><div class="flex gap-2"><button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/62 hover:text-white">${ssrInterpolate(t("通过", "Approve"))}</button><button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-amber-300/70 hover:text-amber-300">${ssrInterpolate(t("驳回", "Reject"))}</button><button class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-cyan-300/70 hover:text-cyan-200">${ssrInterpolate(t("发布模板", "Template"))}</button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B879lF3o.mjs.map
