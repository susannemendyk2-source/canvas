import { _ as __nuxt_component_0 } from './nuxt-link-5Lsne2ZX.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderDynamicModel } from 'vue/server-renderer';
import { Navigation, Crown, Sun, Moon, Globe, Compass, Plus, Search, Map, Settings, CircleDot, ArrowRight, Zap, X, Link2, KeyRound, EyeOff, Eye, Cpu, Loader2, CheckCircle2 } from 'lucide-vue-next';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GoalComposer",
  __ssrInlineRender: true,
  setup(__props) {
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const goal = ref("");
    const loading = ref(false);
    const error = ref("");
    const showApiDialog = ref(false);
    const showKey = ref(false);
    const testing = ref(false);
    const apiStatus = ref("");
    const chatForm = reactive({ baseUrl: "", apiKey: "", model: "" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="mx-auto mt-8 max-w-3xl rounded-2xl border border-cyan-100/14 bg-[#111722]/88 shadow-[0_30px_120px_rgba(30,130,255,.18)] backdrop-blur-xl"><div class="p-3"><textarea class="h-24 w-full resize-none rounded-xl bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"${ssrRenderAttr("placeholder", t("输入你的创作航向，例如：为一款智能手表生成 15 秒新品发布短片。", "Describe your north-star creative goal, for example: create a 15-second launch film for a smartwatch."))}>${ssrInterpolate(goal.value)}</textarea></div><div class="flex items-center justify-between border-t border-cyan-100/10 px-4 pb-3"><button class="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/54 transition hover:text-white">`);
      _push(ssrRenderComponent(unref(Settings), { class: "size-4" }, null, _parent));
      _push(` ${ssrInterpolate(t("API 设置", "API Settings"))}</button><div class="hidden items-center gap-2 text-xs text-white/38 sm:flex">`);
      _push(ssrRenderComponent(unref(CircleDot), { class: "size-4 text-cyan-100" }, null, _parent));
      _push(` DeepSeek / Prompt / Image / Video / Export </div><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="${ssrRenderClass([loading.value ? "bg-white/30" : "bg-cyan-100 hover:bg-white", "grid size-9 place-items-center rounded-full text-[#061018] transition"])}">`);
      if (loading.value) {
        _push(`<span class="inline-block size-4 animate-spin rounded-full border-2 border-[#061018] border-t-transparent"></span>`);
      } else {
        _push(ssrRenderComponent(unref(ArrowRight), { class: "size-4" }, null, _parent));
      }
      _push(`</button></div>`);
      if (error.value) {
        _push(`<div class="px-4 pb-3 text-xs text-amber-200">${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (showApiDialog.value) {
        _push(`<div class="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"><aside class="h-full w-full max-w-[520px] border-l border-white/10 bg-[#1b1c1f] text-white shadow-2xl"><div class="flex h-16 items-center justify-between border-b border-white/8 px-6"><div class="flex items-center gap-3"><div class="grid size-9 place-items-center rounded-lg bg-cyan-500/12 text-cyan-200">`);
        _push(ssrRenderComponent(unref(Zap), { class: "size-5" }, null, _parent));
        _push(`</div><div><h2 class="text-lg font-semibold">${ssrInterpolate(t("API 设置", "API Settings"))}</h2><p class="text-xs text-white/40">API Connection Center</p></div></div><button class="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white">`);
        _push(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent));
        _push(`</button></div><div class="p-5"><div class="rounded-xl border border-white/8 bg-black/16 p-4"><div class="mb-4 flex items-center gap-2 text-xs text-white/42"><span class="${ssrRenderClass(["size-2 rounded-full", unref(chatForm).apiKey ? "bg-emerald-400" : "bg-white/28"])}"></span> ${ssrInterpolate(unref(chatForm).apiKey ? t("已配置", "Configured") : t("未配置", "Not configured"))}</div><label class="mb-4 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48">`);
        _push(ssrRenderComponent(unref(Link2), { class: "size-4" }, null, _parent));
        _push(`API Base URL</span><input${ssrRenderAttr("value", unref(chatForm).baseUrl)} class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60"></label><label class="mb-4 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48">`);
        _push(ssrRenderComponent(unref(KeyRound), { class: "size-4" }, null, _parent));
        _push(`API Key</span><div class="flex h-11 items-center rounded-lg border border-white/8 bg-black focus-within:border-cyan-400/60"><input${ssrRenderDynamicModel(showKey.value ? "text" : "password", unref(chatForm).apiKey, null)}${ssrRenderAttr("type", showKey.value ? "text" : "password")} class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="sk-..."><button type="button" class="grid size-10 place-items-center text-white/42 hover:text-white">`);
        if (showKey.value) {
          _push(ssrRenderComponent(unref(EyeOff), { class: "size-4" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Eye), { class: "size-4" }, null, _parent));
        }
        _push(`</button></div></label><label class="mb-5 block"><span class="mb-2 flex items-center gap-2 text-xs text-white/48">`);
        _push(ssrRenderComponent(unref(Cpu), { class: "size-4" }, null, _parent));
        _push(`${ssrInterpolate(t("默认模型 Model", "Default Model"))}</span><input${ssrRenderAttr("value", unref(chatForm).model)} class="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60" placeholder="deepseek-chat"></label><div class="grid gap-3 sm:grid-cols-2"><button class="h-11 rounded-lg bg-cyan-600 text-sm font-medium text-white transition hover:bg-cyan-500">${ssrInterpolate(t("保存配置", "Save settings"))}</button><button class="h-11 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:bg-white/10"${ssrIncludeBooleanAttr(testing.value) ? " disabled" : ""}>`);
        if (testing.value) {
          _push(ssrRenderComponent(unref(Loader2), { class: "mx-auto size-4 animate-spin" }, null, _parent));
        } else {
          _push(`<span>${ssrInterpolate(t("测试连接", "Test connection"))}</span>`);
        }
        _push(`</button></div>`);
        if (apiStatus.value) {
          _push(`<div class="mt-4 flex items-start gap-2 rounded-lg border border-white/8 bg-white/5 p-3 text-xs leading-5 text-white/62">`);
          _push(ssrRenderComponent(unref(CheckCircle2), { class: "mt-0.5 size-4 shrink-0 text-cyan-200" }, null, _parent));
          _push(` ${ssrInterpolate(apiStatus.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></aside></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/GoalComposer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const GoalComposer = Object.assign(_sfc_main$1, { __name: "HomeGoalComposer" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    const t = (zh, en) => settingsStore.t(zh, en);
    const searchQuery = ref("");
    const activeFilter = ref("All");
    const userInitial = computed(() => {
      const name = authStore.user?.nickname || authStore.user?.username || "";
      return name ? name.charAt(0).toUpperCase() : "P";
    });
    const navItems = computed(() => [
      { label: t("产品", "Product"), to: "/" },
      { label: t("画布", "Canvas"), to: "/studio" },
      { label: "Workflow", to: "/studio?mode=workflow" },
      { label: t("模板", "Templates"), to: "/admin/templates" },
      { label: t("探索", "Explore"), to: "/projects" }
    ]);
    const missionCards = computed(() => [
      { title: "Polaris Brief", subtitle: t("把一个想法对齐成可生产的创作路线。", "Align one idea into a production route."), metric: "01", tone: "from-cyan-400/24 via-blue-500/18 to-indigo-800/24" },
      { title: "Constellation Workflow", subtitle: t("映射 Prompt、图像、视频和输出节点。", "Map prompts, images, video and output nodes."), metric: "02", tone: "from-violet-400/24 via-sky-500/16 to-slate-900/30" },
      { title: "North Star Render", subtitle: t("生成短片、海报和品牌资产。", "Generate films, posters and brand assets."), metric: "03", tone: "from-emerald-300/18 via-cyan-400/18 to-blue-950/35" }
    ]);
    const explore = computed(() => [
      { title: t("极光产品短片", "Aurora Product Film"), subtitle: t("产品发布", "Product launch"), tag: "Video", tone: "from-cyan-400/30 to-blue-950/60" },
      { title: t("轨道分镜", "Orbit Storyboard"), subtitle: t("分镜路线", "Storyboard route"), tag: "Storyboard", tone: "from-indigo-400/30 to-violet-950/60" },
      { title: t("深空海报", "Deep Space Poster"), subtitle: t("品牌海报实验室", "Brand poster lab"), tag: "Image", tone: "from-fuchsia-400/24 to-slate-950/60" },
      { title: t("信号短切", "Signal Cutdown"), subtitle: t("短视频裁切", "Short-form cutdown"), tag: "Video", tone: "from-emerald-300/24 to-cyan-950/60" },
      { title: t("角色锁定", "Character Lock"), subtitle: t("角色一致性", "Character consistency"), tag: "Image", tone: "from-blue-300/24 to-indigo-950/60" },
      { title: t("工作室档案", "Studio Archive"), subtitle: t("素材档案", "Asset archive"), tag: "Team", tone: "from-amber-300/20 to-slate-950/60" }
    ]);
    const filters = computed(() => [
      { value: "All", label: t("全部", "All") },
      { value: "Star Map", label: t("星图", "Star Map") },
      { value: "Video", label: t("视频", "Video") },
      { value: "Image", label: t("图像", "Image") },
      { value: "Storyboard", label: t("分镜", "Storyboard") },
      { value: "Brand", label: t("品牌", "Brand") },
      { value: "Team", label: t("团队", "Team") }
    ]);
    const filteredExplore = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      return explore.value.filter((item) => {
        const matchesFilter = activeFilter.value === "All" || item.tag === activeFilter.value;
        const matchesQuery = !query || `${item.title} ${item.subtitle}`.toLowerCase().includes(query);
        return matchesFilter && matchesQuery;
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen overflow-hidden bg-[#03050b] text-white" }, _attrs))}><section class="relative min-h-screen overflow-hidden px-5 pb-16"><div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(83,142,255,.20),transparent_28%),radial-gradient(circle_at_18%_22%,rgba(70,229,255,.12),transparent_24%),linear-gradient(180deg,#05070d_0%,#060912_52%,#03050b_100%)]"></div><div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px]"></div><div class="absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-cyan-200/10"></div><div class="absolute left-1/2 top-32 h-[360px] w-[360px] -translate-x-1/2 rounded-full border border-indigo-200/10"></div><header class="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid size-9 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Navigation), { class: "size-5 text-cyan-100" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><div class="text-lg font-semibold tracking-wide"${_scopeId}>Polaris</div><div class="text-[11px] uppercase tracking-[0.32em] text-cyan-100/45"${_scopeId}>AI Creation OS</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid size-9 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow" }, [
                createVNode(unref(Navigation), { class: "size-5 text-cyan-100" })
              ]),
              createVNode("div", null, [
                createVNode("div", { class: "text-lg font-semibold tracking-wide" }, "Polaris"),
                createVNode("div", { class: "text-[11px] uppercase tracking-[0.32em] text-cyan-100/45" }, "AI Creation OS")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden items-center gap-6 text-sm text-white/52 lg:flex"><!--[-->`);
      ssrRenderList(navItems.value, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.label,
          to: item.to,
          class: "transition hover:text-cyan-100"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="flex items-center gap-2 text-xs text-white/58">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/credits",
        class: "hidden rounded-full border border-white/10 bg-white/6 px-3 py-1.5 md:inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Crown), { class: "mr-1 size-3.5 text-cyan-100" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(t("积分", "Credits"))}`);
          } else {
            return [
              createVNode(unref(Crown), { class: "mr-1 size-3.5 text-cyan-100" }),
              createTextVNode(" " + toDisplayString(t("积分", "Credits")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="inline-flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/6 px-3 text-xs text-white/72 transition hover:border-cyan-200/35 hover:text-cyan-50">`);
      if (unref(settingsStore).theme === "light") {
        _push(ssrRenderComponent(unref(Sun), { class: "size-3.5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "size-3.5" }, null, _parent));
      }
      _push(`</button><button class="inline-flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/6 px-3 text-xs text-white/72 transition hover:border-cyan-200/35 hover:text-cyan-50">`);
      _push(ssrRenderComponent(unref(Globe), { class: "size-3.5" }, null, _parent));
      _push(` ${ssrInterpolate(unref(settingsStore).language.toUpperCase())}</button>`);
      if (!unref(authStore).isAuthenticated) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "grid size-9 place-items-center rounded-full bg-cyan-100 font-semibold text-[#061018]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` P `);
            } else {
              return [
                createTextVNode(" P ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profile",
          class: "grid size-9 place-items-center rounded-full bg-gradient-to-br from-studio-cyan to-studio-violet text-xs font-bold text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(userInitial.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(userInitial.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div></header><div class="relative z-10 mx-auto max-w-[1120px] pt-10"><div class="text-center"><div class="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/8 px-4 py-2 text-xs text-cyan-100">`);
      _push(ssrRenderComponent(unref(Compass), { class: "size-4" }, null, _parent));
      _push(` ${ssrInterpolate(t("Polaris 指挥中心", "Polaris Command Center"))}</div><h1 class="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">${ssrInterpolate(t("把 AI 创作工作流对齐到一个北极星目标", "Align your AI creative workflow to a north star"))}</h1><p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/52 md:text-base">${ssrInterpolate(t("把一个想法转化为 Prompt、素材、画布卡片、Workflow 节点和生成结果，并集中在一个高效创作空间中。", "Turn one idea into prompts, assets, canvas cards, workflow nodes and generated results on one focused creative workspace."))}</p></div>`);
      _push(ssrRenderComponent(GoalComposer, null, null, _parent));
      _push(`<div class="mx-auto mt-5 grid max-w-3xl place-items-center"><button class="group grid h-28 w-28 place-items-center rounded-2xl border border-cyan-100/16 bg-white/6 text-sm text-white/78 transition hover:border-cyan-200/45 hover:bg-cyan-100/10"><span class="grid gap-2 text-center">`);
      _push(ssrRenderComponent(unref(Plus), { class: "mx-auto size-5 transition group-hover:rotate-90" }, null, _parent));
      _push(` ${ssrInterpolate(t("新建项目", "New Project"))}</span></button></div><section class="mt-16"><div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-semibold">${ssrInterpolate(t("推荐路线", "Recommended Routes"))}</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/projects",
        class: "text-xs text-white/44 hover:text-cyan-100"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("查看全部", "View all"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("查看全部", "View all")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-4 md:grid-cols-3"><!--[-->`);
      ssrRenderList(missionCards.value, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.title,
          to: "/studio",
          class: `group relative h-52 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-5 transition hover:-translate-y-1 hover:border-cyan-100/28`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="absolute right-5 top-5 text-5xl font-semibold text-white/8"${_scopeId}>${ssrInterpolate(item.metric)}</div><div class="absolute inset-0 bg-[radial-gradient(circle_at_75%_36%,rgba(255,255,255,.18),transparent_25%)]"${_scopeId}></div><div class="relative flex h-full flex-col justify-end"${_scopeId}><h3 class="text-base font-semibold"${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="mt-2 text-sm leading-6 text-white/58"${_scopeId}>${ssrInterpolate(item.subtitle)}</p></div>`);
            } else {
              return [
                createVNode("div", { class: "absolute right-5 top-5 text-5xl font-semibold text-white/8" }, toDisplayString(item.metric), 1),
                createVNode("div", { class: "absolute inset-0 bg-[radial-gradient(circle_at_75%_36%,rgba(255,255,255,.18),transparent_25%)]" }),
                createVNode("div", { class: "relative flex h-full flex-col justify-end" }, [
                  createVNode("h3", { class: "text-base font-semibold" }, toDisplayString(item.title), 1),
                  createVNode("p", { class: "mt-2 text-sm leading-6 text-white/58" }, toDisplayString(item.subtitle), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><section class="mt-12"><div class="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h2 class="text-xl font-semibold">${ssrInterpolate(t("探索 Polaris 星图", "Explore Polaris Maps"))}</h2><p class="mt-2 text-sm text-white/45">${ssrInterpolate(t("查找公开项目、模板和 Workflow 星座，为下一条创作路线做准备。", "Find public projects, templates and workflow constellations for your next route."))}</p></div><label class="flex h-10 w-full items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42 md:w-72">`);
      _push(ssrRenderComponent(unref(Search), { class: "size-4" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} class="w-full bg-transparent outline-none placeholder:text-white/32"${ssrRenderAttr("placeholder", t("搜索路线", "Search routes"))}></label></div><div class="mb-5 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(filters.value, (filter) => {
        _push(`<button class="${ssrRenderClass([activeFilter.value === filter.value ? "border-cyan-300/30 bg-cyan-100/10 text-white" : "border-white/10 bg-white/6 text-white/66 hover:border-cyan-300/30 hover:text-white", "rounded-full border px-3 py-1.5 text-xs transition"])}">${ssrInterpolate(filter.label)}</button>`);
      });
      _push(`<!--]--></div><div class="grid gap-4 md:grid-cols-4"><!--[-->`);
      ssrRenderList(filteredExplore.value, (item, index) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.title,
          to: "/studio",
          class: "group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-100/25"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass(`relative h-36 bg-gradient-to-br ${item.tone}`)}"${_scopeId}><div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,.18),transparent_28%)]"${_scopeId}></div></div><div class="p-3"${_scopeId}><div class="flex items-center gap-2 text-[11px] text-white/40"${_scopeId}><span class="grid size-5 place-items-center rounded-full bg-white/10"${_scopeId}>${ssrInterpolate(index + 1)}</span> ${ssrInterpolate(t("星座", "constellation"))}</div><h3 class="mt-2 text-sm font-semibold"${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="mt-1 line-clamp-1 text-xs text-white/45"${_scopeId}>${ssrInterpolate(item.subtitle)}</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: `relative h-36 bg-gradient-to-br ${item.tone}`
                }, [
                  createVNode("div", { class: "absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,.18),transparent_28%)]" })
                ], 2),
                createVNode("div", { class: "p-3" }, [
                  createVNode("div", { class: "flex items-center gap-2 text-[11px] text-white/40" }, [
                    createVNode("span", { class: "grid size-5 place-items-center rounded-full bg-white/10" }, toDisplayString(index + 1), 1),
                    createTextVNode(" " + toDisplayString(t("星座", "constellation")), 1)
                  ]),
                  createVNode("h3", { class: "mt-2 text-sm font-semibold" }, toDisplayString(item.title), 1),
                  createVNode("p", { class: "mt-1 line-clamp-1 text-xs text-white/45" }, toDisplayString(item.subtitle), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section></div><div class="pointer-events-none fixed bottom-5 left-5 grid size-9 place-items-center rounded-full border border-cyan-100/18 bg-black/50 text-sm">`);
      _push(ssrRenderComponent(unref(Map), { class: "size-4 text-cyan-100" }, null, _parent));
      _push(`</div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CG4QAl7b.mjs.map
