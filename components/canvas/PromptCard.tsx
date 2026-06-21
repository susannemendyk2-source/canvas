import { WandSparkles } from "lucide-react";

export function PromptCard({ content }: { content: string }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs text-cyan-100">
        <WandSparkles className="size-4" />
        提示词配方 / Prompt recipe
      </div>
      <p className="line-clamp-6 whitespace-pre-wrap text-sm leading-6 text-white/72">{content}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["9:16", "cinematic", "macro", "soft glass"].map((tag) => (
          <span key={tag} className="rounded-full border border-cyan-100/10 px-2 py-0.5 text-[11px] text-white/45">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
