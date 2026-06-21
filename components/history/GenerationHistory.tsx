"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAssetStore } from "@/stores/useAssetStore";

export function GenerationHistory() {
  const history = useAssetStore((state) => state.history);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/82">生成历史 / Generation History</h3>
        <span className="text-xs text-white/38">本地 / local</span>
      </div>
      <div className="space-y-2">
        {history.map((task) => (
          <div key={task.id} className="rounded-md border border-white/10 bg-white/6 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs text-white/76">{task.title}</span>
              <StatusBadge status={task.status} />
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/8">
              <div className="h-full rounded-full bg-cyan-300" style={{ width: `${task.progress}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-white/35">{task.cost} 点数 / credits</div>
          </div>
        ))}
      </div>
    </section>
  );
}
