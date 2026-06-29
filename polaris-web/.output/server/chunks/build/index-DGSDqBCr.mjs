import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { Search } from 'lucide-vue-next';
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
    const searchQuery = ref("");
    const dateFrom = ref("");
    const dateTo = ref("");
    const logs = ref([]);
    const filteredLogs = computed(() => logs.value.filter((log) => {
      const q = searchQuery.value.trim().toLowerCase();
      const text = `${log.username || ""} ${log.user || ""} ${log.action || ""} ${log.detail || ""} ${log.remark || ""}`.toLowerCase();
      const date = log.createdAt || "";
      return (!q || text.includes(q)) && (!dateFrom.value || date >= dateFrom.value) && (!dateTo.value || date <= `${dateTo.value} 23:59:59`);
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-6 py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(PageHead, {
        title: t("操作日志", "Operation Logs"),
        desc: t("查看登录、项目、积分和管理操作记录。", "View login, project, credit and admin operation records.")
      }, null, _parent));
      _push(`<div class="mb-4 flex flex-wrap items-center gap-3"><label class="flex h-10 w-full max-w-sm items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">`);
      _push(ssrRenderComponent(unref(Search), { class: "size-4" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} class="w-full bg-transparent outline-none placeholder:text-white/32"${ssrRenderAttr("placeholder", t("搜索日志", "Search logs"))}></label><input${ssrRenderAttr("value", unref(dateFrom))} type="date" class="h-10 rounded-lg border border-white/10 bg-white/6 px-3 text-xs text-white/72"><input${ssrRenderAttr("value", unref(dateTo))} type="date" class="h-10 rounded-lg border border-white/10 bg-white/6 px-3 text-xs text-white/72"></div><div class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]"><table class="w-full min-w-[820px] text-sm"><thead><tr class="border-b border-white/8 text-left text-xs text-white/45"><th class="px-4 py-3">ID</th><th class="px-4 py-3">${ssrInterpolate(t("用户", "User"))}</th><th class="px-4 py-3">${ssrInterpolate(t("操作", "Action"))}</th><th class="px-4 py-3">${ssrInterpolate(t("详情", "Detail"))}</th><th class="px-4 py-3">IP</th><th class="px-4 py-3">${ssrInterpolate(t("时间", "Time"))}</th></tr></thead><tbody>`);
      if (unref(filteredLogs).length === 0) {
        _push(`<tr><td colspan="6" class="px-4 py-10 text-center text-white/35">${ssrInterpolate(t("暂无日志", "No logs"))}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(filteredLogs), (log) => {
        _push(`<tr class="border-b border-white/5 hover:bg-white/5"><td class="px-4 py-3 text-white/55">${ssrInterpolate(log.id)}</td><td class="px-4 py-3 text-white">${ssrInterpolate(log.username || log.user || "-")}</td><td class="px-4 py-3"><span class="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-white/65">${ssrInterpolate(log.action)}</span></td><td class="max-w-xs truncate px-4 py-3 text-xs text-white/60">${ssrInterpolate(log.detail || log.remark || "-")}</td><td class="px-4 py-3 text-xs text-white/40">${ssrInterpolate(log.ip || "-")}</td><td class="px-4 py-3 text-xs text-white/40">${ssrInterpolate(log.createdAt || "-")}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/logs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DGSDqBCr.mjs.map
