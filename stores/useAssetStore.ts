import { create } from "zustand";
import type { Asset, GenerationTask } from "@/types";

interface AssetState {
  assets: Asset[];
  history: GenerationTask[];
  addAsset: (asset: Asset) => void;
  addHistory: (task: GenerationTask) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: [
    { id: "asset-1", type: "image", title: "玻璃产品微距 / Glass product macro", createdAt: new Date().toISOString(), favorite: true },
    { id: "asset-2", type: "video", title: "竖屏揭示片段 / Vertical reveal cut", createdAt: new Date().toISOString() }
  ],
  history: [
    { id: "task-1", title: "提示词转分镜 / Prompt to storyboard", status: "success", progress: 100, cost: 24, createdAt: new Date().toISOString() }
  ],
  addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),
  addHistory: (task) => set((state) => ({ history: [task, ...state.history] }))
}));
