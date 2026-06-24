import Link from "next/link";
import {
  Bell,
  Compass,
  Crown,
  Globe2,
  Map,
  Moon,
  Navigation,
  Plus,
  Search
} from "lucide-react";
import { GoalComposer } from "@/components/home/GoalComposer";

const missionCards = [
  {
    title: "Polaris Brief",
    subtitle: "把一句想法校准成完整创作航线 / Align one idea into a production route",
    metric: "01",
    tone: "from-cyan-400/24 via-blue-500/18 to-indigo-800/24"
  },
  {
    title: "Constellation Workflow",
    subtitle: "提示词、图像、视频与输出节点自动成图 / Map prompts, images, video and output nodes",
    metric: "02",
    tone: "from-violet-400/24 via-sky-500/16 to-slate-900/30"
  },
  {
    title: "North Star Render",
    subtitle: "稳定生成短片、海报和品牌素材 / Generate films, posters and brand assets",
    metric: "03",
    tone: "from-emerald-300/18 via-cyan-400/18 to-blue-950/35"
  }
];

const explore = [
  ["Aurora Product Film", "电商新品发布 / Product launch", "from-cyan-400/30 to-blue-950/60"],
  ["Orbit Storyboard", "分镜脚本生成 / Storyboard route", "from-indigo-400/30 to-violet-950/60"],
  ["Deep Space Poster", "品牌海报实验 / Brand poster lab", "from-fuchsia-400/24 to-slate-950/60"],
  ["Signal Cutdown", "短视频混剪 / Short-form cutdown", "from-emerald-300/24 to-cyan-950/60"],
  ["Character Lock", "角色一致性 / Character consistency", "from-blue-300/24 to-indigo-950/60"],
  ["Studio Archive", "素材库管理 / Asset archive", "from-amber-300/20 to-slate-950/60"]
];

const filters = ["全部 / All", "星图画布 / Star Map", "视频生成 / Video", "图片生成 / Image", "分镜 / Storyboard", "品牌 / Brand", "电商 / Commerce", "团队 / Team"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#03050b] text-white">
      <section className="relative min-h-screen overflow-hidden px-5 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(83,142,255,.20),transparent_28%),radial-gradient(circle_at_18%_22%,rgba(70,229,255,.12),transparent_24%),linear-gradient(180deg,#05070d_0%,#060912_52%,#03050b_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-cyan-200/10" />
        <div className="absolute left-1/2 top-32 h-[360px] w-[360px] -translate-x-1/2 rounded-full border border-indigo-200/10" />

        <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-glow">
              <Navigation className="size-5 text-cyan-100" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-wide">Polaris</div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/45">AI Creation OS</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/52 lg:flex">
            {["产品 / Product", "星图画布 / Canvas", "工作流 / Workflow", "模板 / Templates", "探索 / Explore"].map((item) => (
              <Link key={item} href="/studio" className="transition hover:text-cyan-100">
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs text-white/58">
            <span className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 sm:flex">
              <Globe2 className="size-3.5" />
              中 / EN
            </span>
            <span className="hidden rounded-full border border-white/10 bg-white/6 px-3 py-1.5 md:inline-flex">
              <Crown className="mr-1 size-3.5 text-cyan-100" />
              会员中心 3,520
            </span>
            <button className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/6" title="夜间模式 / Dark mode">
              <Moon className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/6" title="通知 / Notifications">
              <Bell className="size-4" />
            </button>
            <Link href="/studio" className="grid size-9 place-items-center rounded-full bg-cyan-100 font-semibold text-[#061018]">
              P
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-[1120px] pt-10">
          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/8 px-4 py-2 text-xs text-cyan-100">
              <Compass className="size-4" />
              Polaris Command Center · 北极星创作中枢
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              向北极星校准你的 AI 创作流程
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/52 md:text-base">
              从一句灵感出发，Polaris 会把提示词、素材、节点工作流和生成结果组织成清晰的星图。Navigate prompts, assets, workflows and renders on one intelligent canvas.
            </p>
          </div>

          <GoalComposer />

          <div className="mx-auto mt-5 grid max-w-3xl place-items-center">
            <Link href="/studio" className="group grid h-28 w-28 place-items-center rounded-2xl border border-cyan-100/16 bg-white/6 text-sm text-white/78 transition hover:border-cyan-200/45 hover:bg-cyan-100/10">
              <span className="grid gap-2 text-center">
                <Plus className="mx-auto size-5 transition group-hover:rotate-90" />
                新建星图
                <span className="text-[11px] text-white/35">New Project</span>
              </span>
            </Link>
          </div>

          <section className="mt-16">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">推荐航线 / Recommended Routes</h2>
              <Link href="/studio" className="text-xs text-white/44 hover:text-cyan-100">
                查看全部 / View all
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {missionCards.map((item) => (
                <Link
                  href="/studio"
                  key={item.title}
                  className={`group relative h-52 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-5 transition hover:-translate-y-1 hover:border-cyan-100/28`}
                >
                  <div className="absolute right-5 top-5 text-5xl font-semibold text-white/8">{item.metric}</div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_36%,rgba(255,255,255,.18),transparent_25%)]" />
                  <div className="relative flex h-full flex-col justify-end">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/58">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">探索 Polaris 星图</h2>
                <p className="mt-2 text-sm text-white/45">从公开项目、模板和节点工作流里寻找下一条创作航线。Explore public projects, templates and workflow constellations.</p>
              </div>
              <label className="flex h-10 w-full items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42 md:w-72">
                <Search className="size-4" />
                <input className="w-full bg-transparent outline-none placeholder:text-white/32" placeholder="搜索星图 / Search routes" />
              </label>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button key={filter} className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white/66 transition hover:border-cyan-300/30 hover:text-white">
                  {filter}
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {explore.map(([title, subtitle, tone], index) => (
                <Link href="/studio" key={title} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-100/25">
                  <div className={`relative h-36 bg-gradient-to-br ${tone}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,.18),transparent_28%)]" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 text-[11px] text-white/40">
                      <span className="grid size-5 place-items-center rounded-full bg-white/10">{index + 1}</span>
                      constellation
                    </div>
                    <h3 className="mt-2 text-sm font-semibold">{title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs text-white/45">{subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="pointer-events-none fixed bottom-5 left-5 grid size-9 place-items-center rounded-full border border-cyan-100/18 bg-black/50 text-sm">
          <Map className="size-4 text-cyan-100" />
        </div>
      </section>
    </main>
  );
}
