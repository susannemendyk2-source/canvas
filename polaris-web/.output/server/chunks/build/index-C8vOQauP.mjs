import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { Sparkles, Crown, Coins, Plus, Minus } from 'lucide-vue-next';
import { d as useAuthStore, a as useSettingsStore } from './server.mjs';
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
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    const logs = ref([]);
    const t = (zh, en) => settingsStore.t(zh, en);
    const costs = computed(() => [
      { name: t("图片生成", "Image generation"), cost: "40" },
      { name: t("分镜生成", "Storyboard generation"), cost: "80" },
      { name: t("视频生成", "Video generation"), cost: "120" },
      { name: t("工作流运行", "Workflow run"), cost: "160" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl px-6 py-8" }, _attrs))}><section class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p class="text-xs uppercase tracking-[0.18em] text-cyan-100/55">${ssrInterpolate(t("账户中心", "Account"))}</p><h1 class="mt-2 text-2xl font-semibold text-white">${ssrInterpolate(t("星尘积分", "Credits"))}</h1><p class="mt-1 text-sm text-white/45">${ssrInterpolate(t("用于生成图片、视频、分镜和工作流任务。", "Used for image, video, storyboard and workflow generation."))}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/studio",
        class: "inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Sparkles), { class: "size-4" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(t("回到画布", "Back to Studio"))}`);
          } else {
            return [
              createVNode(unref(Sparkles), { class: "size-4" }),
              createTextVNode(" " + toDisplayString(t("回到画布", "Back to Studio")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><section class="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><div class="rounded-lg border border-white/10 bg-white/[0.04] p-6"><div class="flex items-center justify-between gap-4"><div><p class="text-sm text-white/45">${ssrInterpolate(t("当前余额", "Current Balance"))}</p><p class="mt-3 text-5xl font-semibold text-cyan-50">${ssrInterpolate(unref(authStore).credits.toLocaleString())}</p></div><div class="grid size-16 place-items-center rounded-full border border-cyan-100/20 bg-cyan-100/10 text-cyan-100">`);
      _push(ssrRenderComponent(unref(Crown), { class: "size-7" }, null, _parent));
      _push(`</div></div><div class="mt-6 grid gap-3 sm:grid-cols-3"><button class="h-10 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">${ssrInterpolate(t("测试增加 500", "Add 500 Demo"))}</button><button class="h-10 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">${ssrInterpolate(t("模拟图片生成", "Simulate Image"))}</button><button class="h-10 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:border-cyan-200/30 hover:text-white">${ssrInterpolate(t("模拟视频生成", "Simulate Video"))}</button></div></div><div class="rounded-lg border border-white/10 bg-white/[0.04] p-6"><h2 class="text-sm font-semibold text-white">${ssrInterpolate(t("消耗规则", "Usage Cost"))}</h2><div class="mt-4 space-y-3"><!--[-->`);
      ssrRenderList(unref(costs), (item) => {
        _push(`<div class="flex items-center justify-between rounded-md border border-white/8 bg-black/20 px-3 py-2"><span class="text-sm text-white/72">${ssrInterpolate(item.name)}</span><span class="text-sm font-medium text-cyan-100">${ssrInterpolate(item.cost)}</span></div>`);
      });
      _push(`<!--]--></div></div></section><section class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]"><div class="flex items-center justify-between border-b border-white/8 px-5 py-4"><h2 class="text-sm font-semibold text-white">${ssrInterpolate(t("积分流水", "Credit Log"))}</h2><button class="text-xs text-white/45 transition hover:text-white">${ssrInterpolate(t("清空本地记录", "Clear Local Log"))}</button></div>`);
      if (unref(logs).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-16 text-white/35">`);
        _push(ssrRenderComponent(unref(Coins), { class: "mb-3 size-10" }, null, _parent));
        _push(`<p class="text-sm">${ssrInterpolate(t("暂无记录", "No records yet"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(logs), (log) => {
        _push(`<div class="flex items-center justify-between border-b border-white/5 px-5 py-4 last:border-b-0"><div class="flex min-w-0 items-center gap-3"><div class="${ssrRenderClass(["grid size-9 shrink-0 place-items-center rounded-full", log.amount > 0 ? "bg-emerald-500/12 text-emerald-300" : "bg-amber-500/12 text-amber-300"])}">`);
        if (log.amount > 0) {
          _push(ssrRenderComponent(unref(Plus), { class: "size-4" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Minus), { class: "size-4" }, null, _parent));
        }
        _push(`</div><div class="min-w-0"><p class="truncate text-sm font-medium text-white">${ssrInterpolate(log.remark)}</p><p class="text-xs text-white/35">${ssrInterpolate(log.createdAt)}</p></div></div><div class="text-right"><p class="${ssrRenderClass(["text-sm font-semibold", log.amount > 0 ? "text-emerald-300" : "text-amber-300"])}">${ssrInterpolate(log.amount > 0 ? `+${log.amount}` : log.amount)}</p><p class="text-xs text-white/35">${ssrInterpolate(t("余额", "Balance"))} ${ssrInterpolate(log.balance)}</p></div></div>`);
      });
      _push(`<!--]--></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/credits/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C8vOQauP.mjs.map
