import { defineComponent, ref, reactive, computed, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { UserRound, Languages, Lock, ArrowLeft } from 'lucide-vue-next';
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
    useAuthStore();
    const settingsStore = useSettingsStore();
    const activeTab = ref("profile");
    const profileSaved = ref("");
    const t = (zh, en) => settingsStore.t(zh, en);
    const form = reactive({
      username: "",
      nickname: "",
      email: "",
      phone: ""
    });
    const password = reactive({
      old: "",
      next: "",
      confirm: ""
    });
    const tabs = computed(() => [
      { id: "profile", label: t("个人资料", "Profile"), icon: UserRound },
      { id: "preferences", label: t("偏好", "Preferences"), icon: Languages },
      { id: "security", label: t("安全", "Security"), icon: Lock }
    ]);
    const profileInitial = computed(() => (form.nickname || form.username || "P").charAt(0).toUpperCase());
    const languageProxy = computed({
      get: () => settingsStore.language,
      set: (value) => settingsStore.setLanguage(value)
    });
    const themeProxy = computed({
      get: () => settingsStore.theme,
      set: (value) => {
        if (settingsStore.theme !== value) settingsStore.toggleTheme();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl px-6 py-8" }, _attrs))}><section class="mb-6 flex items-center gap-4"><button class="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition hover:bg-white/8 hover:text-white">`);
      _push(ssrRenderComponent(unref(ArrowLeft), { class: "size-4" }, null, _parent));
      _push(`</button><div><h1 class="text-2xl font-semibold text-white">${ssrInterpolate(t("设置", "Settings"))}</h1><p class="mt-1 text-sm text-white/45">${ssrInterpolate(t("管理账号、偏好和模型服务配置。", "Manage account, preferences and model provider settings."))}</p></div></section><section class="grid gap-6 lg:grid-cols-[220px_1fr]"><aside class="rounded-lg border border-white/10 bg-white/[0.04] p-2"><!--[-->`);
      ssrRenderList(unref(tabs), (tab) => {
        _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "bg-cyan-100/10 text-cyan-50" : "text-white/55 hover:bg-white/6 hover:text-white", "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "size-4" }, null), _parent);
        _push(` ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></aside><div class="min-w-0">`);
      if (unref(activeTab) === "profile") {
        _push(`<section class="rounded-lg border border-white/10 bg-white/[0.04] p-6"><div class="mb-6 flex items-center gap-4"><div class="grid size-16 place-items-center rounded-full bg-cyan-100 text-xl font-semibold text-[#061018]">${ssrInterpolate(unref(profileInitial))}</div><div><h2 class="text-base font-semibold text-white">${ssrInterpolate(t("个人资料", "Profile"))}</h2><p class="text-sm text-white/42">${ssrInterpolate(t("这些信息用于顶部栏、用户中心和团队协作显示。", "Shown in the top bar, account center and collaboration views."))}</p></div></div><div class="grid gap-4 md:grid-cols-2"><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("用户名", "Username"))}</span><input${ssrRenderAttr("value", unref(form).username)} class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("昵称", "Nickname"))}</span><input${ssrRenderAttr("value", unref(form).nickname)} class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("邮箱", "Email"))}</span><input${ssrRenderAttr("value", unref(form).email)} class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("手机", "Phone"))}</span><input${ssrRenderAttr("value", unref(form).phone)} class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label></div><div class="mt-6 flex items-center gap-3"><button class="h-10 rounded-lg bg-cyan-100 px-5 text-sm font-medium text-[#061018] transition hover:bg-white">${ssrInterpolate(t("保存资料", "Save Profile"))}</button><span class="text-xs text-emerald-300/80">${ssrInterpolate(unref(profileSaved))}</span></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "preferences") {
        _push(`<section class="rounded-lg border border-white/10 bg-white/[0.04] p-6"><h2 class="text-base font-semibold text-white">${ssrInterpolate(t("偏好设置", "Preferences"))}</h2><div class="mt-5 grid gap-4 md:grid-cols-2"><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("界面语言", "Language"))}</span><select class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option value="zh"${ssrIncludeBooleanAttr(Array.isArray(unref(languageProxy)) ? ssrLooseContain(unref(languageProxy), "zh") : ssrLooseEqual(unref(languageProxy), "zh")) ? " selected" : ""}>中文</option><option value="en"${ssrIncludeBooleanAttr(Array.isArray(unref(languageProxy)) ? ssrLooseContain(unref(languageProxy), "en") : ssrLooseEqual(unref(languageProxy), "en")) ? " selected" : ""}>English</option></select></label><label class="block"><span class="mb-1.5 block text-xs text-white/48">${ssrInterpolate(t("主题", "Theme"))}</span><select class="h-11 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><option value="dark"${ssrIncludeBooleanAttr(Array.isArray(unref(themeProxy)) ? ssrLooseContain(unref(themeProxy), "dark") : ssrLooseEqual(unref(themeProxy), "dark")) ? " selected" : ""}>${ssrInterpolate(t("深色", "Dark"))}</option><option value="light"${ssrIncludeBooleanAttr(Array.isArray(unref(themeProxy)) ? ssrLooseContain(unref(themeProxy), "light") : ssrLooseEqual(unref(themeProxy), "light")) ? " selected" : ""}>${ssrInterpolate(t("浅色", "Light"))}</option></select></label></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "security") {
        _push(`<section class="rounded-lg border border-white/10 bg-white/[0.04] p-6"><h2 class="text-base font-semibold text-white">${ssrInterpolate(t("安全", "Security"))}</h2><div class="mt-5 grid gap-4 md:grid-cols-3"><input${ssrRenderAttr("value", unref(password).old)} type="password"${ssrRenderAttr("placeholder", t("当前密码", "Current password"))} class="h-11 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><input${ssrRenderAttr("value", unref(password).next)} type="password"${ssrRenderAttr("placeholder", t("新密码", "New password"))} class="h-11 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"><input${ssrRenderAttr("value", unref(password).confirm)} type="password"${ssrRenderAttr("placeholder", t("确认新密码", "Confirm password"))} class="h-11 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60"></div><p class="mt-3 text-xs text-white/35">${ssrInterpolate(t("后端密码修改接口接入后，此处可以直接提交真实变更。", "This form is ready to connect to the backend password update endpoint."))}</p></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BwcSknpz.mjs.map
