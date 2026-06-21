"use client";

import { Star } from "lucide-react";
import { useAssetStore } from "@/stores/useAssetStore";

export function AssetLibrary() {
  const assets = useAssetStore((state) => state.assets);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/82">素材库 / Asset Library</h3>
        <span className="text-xs text-white/38">{assets.length} 项 / items</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {assets.map((asset) => (
          <div key={asset.id} className="rounded-md border border-white/10 bg-white/6 p-2">
            <div className="mb-2 aspect-video rounded bg-gradient-to-br from-white/14 to-cyan-300/10" />
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs text-white/68">{asset.title}</span>
              {asset.favorite ? <Star className="size-3 fill-studio-warning text-studio-warning" /> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
