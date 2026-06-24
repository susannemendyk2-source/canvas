import { create } from "zustand";
import type { Project, ThemeMode, WorkspaceMode } from "@/types";

interface WorkspaceState {
  project: Project;
  mode: WorkspaceMode;
  theme: ThemeMode;
  zoom: number;
  savedState: "saved" | "saving" | "dirty";
  setMode: (mode: WorkspaceMode) => void;
  setZoom: (zoom: number) => void;
  markDirty: () => void;
  saveProject: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  project: {
    id: "project-polaris-route",
    name: "Polaris 星图项目 / Polaris route",
    mode: "magic-canvas",
    savedAt: new Date().toISOString(),
    credits: 2480
  },
  mode: "magic-canvas",
  theme: "dark",
  zoom: 86,
  savedState: "saved",
  setMode: (mode) =>
    set((state) => ({
      mode,
      project: { ...state.project, mode },
      savedState: "dirty"
    })),
  setZoom: (zoom) => set({ zoom }),
  markDirty: () => set({ savedState: "dirty" }),
  saveProject: () => {
    const project = { ...get().project, savedAt: new Date().toISOString() };
    localStorage.setItem("polaris.project", JSON.stringify(project));
    set({ project, savedState: "saved" });
  }
}));
