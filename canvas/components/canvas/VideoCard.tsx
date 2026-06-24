import { Camera, Clapperboard, Expand, Play, Plus, Upload, WandSparkles, UserRound } from "lucide-react";

export function VideoCard({ content }: { content: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="inline-flex items-center gap-2">
          <Clapperboard className="size-4" />
          Video
        </span>
        <button className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72">
          <Upload className="mr-1 inline size-3.5" />
          上传 / Upload
        </button>
      </div>

      <div className="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]">
        <Play className="size-14 text-white/28" />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0d0f15] p-3">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-white/54">
          {["文生视频", "全能参考", "图生视频", "首尾帧", "图片参考"].map((tab) => (
            <button key={tab} className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 hover:text-white">
              {tab}
            </button>
          ))}
          <button className="ml-auto grid size-8 place-items-center rounded-lg text-white/45 hover:bg-white/8" title="展开 / Expand">
            <Expand className="size-4" />
          </button>
        </div>
        <div className="mb-3 flex gap-2">
          <button className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68">
            <WandSparkles className="mr-1 inline size-3.5" />
            智能生成 / Smart
          </button>
          <button className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68">
            <Plus className="mr-1 inline size-3.5" />
            添加素材 / Asset
          </button>
          <button className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68">
            <Camera className="mr-1 inline size-3.5" />
            运镜 / Camera
          </button>
          <button className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68">
            <UserRound className="mr-1 inline size-3.5" />
            角色 / Role
          </button>
        </div>
        <p className="min-h-10 text-sm leading-6 text-white/56">{content}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <select className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72 outline-none">
            <option>Seedance 2.0 Fast</option>
            <option>Aura Video v1</option>
          </select>
          <select className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72 outline-none">
            <option>16:9 · 720p · 5s</option>
            <option>9:16 · 1080p · 8s</option>
          </select>
          <button className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72">1x</button>
          <button className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72">18 点数</button>
          <button className="ml-auto grid size-9 place-items-center rounded-full bg-violet-300 text-black">↑</button>
        </div>
      </div>
    </div>
  );
}
