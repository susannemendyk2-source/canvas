import { Sparkles } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-lg border border-white/10 bg-white/8">
          <Sparkles className="size-5 text-studio-cyan" />
        </div>
        <h2 className="text-lg font-medium text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-white/55">{body}</p>
      </div>
    </div>
  );
}
