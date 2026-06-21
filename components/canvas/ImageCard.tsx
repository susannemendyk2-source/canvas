import { Expand, ImageIcon, Palette, Upload, WandSparkles } from "lucide-react";

export function ImageCard({ content }: { content: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="inline-flex items-center gap-2">
          <WandSparkles className="size-4" />
          Image
        </span>
        <button className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/72">
          <Upload className="mr-1 inline size-3.5" />
          上传 / Upload
        </button>
      </div>

      <div className="grid aspect-[16/9] place-items-center rounded-xl border border-white/20 bg-[#242424]">
        <ImageIcon className="size-12 text-white/28" />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0d0f15] p-3">
        <div className="mb-3 flex gap-2">
          <button className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68">
            <Palette className="mr-1 inline size-3.5" />
            风格 / Style
          </button>
          <button className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/68">标记 / Mark</button>
          <button className="ml-auto grid size-8 place-items-center rounded-lg text-white/45 hover:bg-white/8" title="展开 / Expand">
            <Expand className="size-4" />
          </button>
        </div>
        <p className="min-h-10 text-sm leading-6 text-white/56">{content}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <select className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72 outline-none">
            <option>Banana Pro</option>
            <option>Aura Image v1</option>
          </select>
          <select className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72 outline-none">
            <option>16:9</option>
            <option>9:16</option>
            <option>1:1</option>
          </select>
          <button className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72">2K</button>
          <button className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/72">风格 / Style</button>
          <button className="ml-auto grid size-9 place-items-center rounded-full bg-violet-300 text-black">↑</button>
        </div>
      </div>
    </div>
  );
}
