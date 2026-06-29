import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
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
    const saved = ref("");
    const settings = reactive({ siteName: "Polaris", siteDescription: "AI creative workspace", defaultLang: "zh", registrationMode: "open", defaultCredits: 100, maxUploadSize: 50, maintenanceMode: false });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-6 py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(PageHead, {
        title: t("系统设置", "System Settings"),
        desc: t("维护站点基础参数、注册策略和积分默认值。", "Maintain site basics, registration policy and default credits.")
      }, null, _parent));
      _push(`<section class="rounded-lg border border-white/10 bg-white/[0.04] p-6"><div class="grid gap-5 md:grid-cols-2"><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("站点名称", "Site Name"))}</span><input${ssrRenderAttr("value", unref(settings).siteName)} class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("站点描述", "Site Description"))}</span><input${ssrRenderAttr("value", unref(settings).siteDescription)} class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("默认语言", "Default Language"))}</span><select class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option value="zh"${ssrIncludeBooleanAttr(Array.isArray(unref(settings).defaultLang) ? ssrLooseContain(unref(settings).defaultLang, "zh") : ssrLooseEqual(unref(settings).defaultLang, "zh")) ? " selected" : ""}>中文</option><option value="en"${ssrIncludeBooleanAttr(Array.isArray(unref(settings).defaultLang) ? ssrLooseContain(unref(settings).defaultLang, "en") : ssrLooseEqual(unref(settings).defaultLang, "en")) ? " selected" : ""}>English</option></select></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("注册模式", "Registration Mode"))}</span><select class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option value="open"${ssrIncludeBooleanAttr(Array.isArray(unref(settings).registrationMode) ? ssrLooseContain(unref(settings).registrationMode, "open") : ssrLooseEqual(unref(settings).registrationMode, "open")) ? " selected" : ""}>${ssrInterpolate(t("开放注册", "Open"))}</option><option value="invite"${ssrIncludeBooleanAttr(Array.isArray(unref(settings).registrationMode) ? ssrLooseContain(unref(settings).registrationMode, "invite") : ssrLooseEqual(unref(settings).registrationMode, "invite")) ? " selected" : ""}>${ssrInterpolate(t("邀请注册", "Invite Only"))}</option><option value="closed"${ssrIncludeBooleanAttr(Array.isArray(unref(settings).registrationMode) ? ssrLooseContain(unref(settings).registrationMode, "closed") : ssrLooseEqual(unref(settings).registrationMode, "closed")) ? " selected" : ""}>${ssrInterpolate(t("关闭注册", "Closed"))}</option></select></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("新用户初始积分", "New User Credits"))}</span><input${ssrRenderAttr("value", unref(settings).defaultCredits)} type="number" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("最大上传大小 MB", "Max Upload Size MB"))}</span><input${ssrRenderAttr("value", unref(settings).maxUploadSize)} type="number" class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label></div><div class="mt-6 flex items-center justify-between rounded-lg border border-white/8 bg-black/20 px-4 py-3"><div><p class="text-sm font-medium text-white">${ssrInterpolate(t("维护模式", "Maintenance Mode"))}</p><p class="text-xs text-white/35">${ssrInterpolate(t("开启后普通用户将无法进入创作工作台。", "When enabled, regular users cannot enter the workspace."))}</p></div><button class="${ssrRenderClass([unref(settings).maintenanceMode ? "border-amber-300/30 bg-amber-500/12 text-amber-300" : "border-emerald-300/30 bg-emerald-500/12 text-emerald-300", "rounded-full border px-3 py-1.5 text-xs transition"])}">${ssrInterpolate(unref(settings).maintenanceMode ? t("开启", "On") : t("关闭", "Off"))}</button></div><div class="mt-6 flex items-center gap-3"><button class="h-10 rounded-lg bg-cyan-100 px-5 text-sm font-medium text-[#061018]">${ssrInterpolate(t("保存设置", "Save Settings"))}</button><span class="text-xs text-emerald-300/80">${ssrInterpolate(unref(saved))}</span></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-7F9meSk9.mjs.map
