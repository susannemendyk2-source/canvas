"use client";

import { Bell, Compass, Crown, Globe2, Moon, PanelRight, Settings, Share2, Sparkles, Sun, Workflow } from "lucide-react";
import { ApiSettingsDialog } from "@/components/settings/ApiSettingsDialog";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";

export function TopBar() {
  const { project, savedState, saveProject, mode, setMode } = useWorkspaceStore();
  const setSettingsOpen = useSettingsStore((state) => state.setOpen);

  return (
    <>
      <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-cyan-100/10 bg-[#04070d]/95 px-3 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2 text-xl font-semibold tracking-wide">
            <Compass className="size-5 text-cyan-100" />
            Polaris
          </div>
          <div className="truncate text-sm font-medium text-white/72">{project.name}</div>
          <button onClick={saveProject} className="text-xs text-emerald-300">
            {savedState === "saved" ? "✓ 已保存 / Saved" : "保存 / Save"}
          </button>
        </div>

        <div className="flex rounded-full border border-cyan-100/14 bg-white/6 p-1">
          <button
            onClick={() => setMode("magic-canvas")}
            className={mode === "magic-canvas" ? "rounded-full bg-cyan-300/18 px-4 py-1.5 text-xs text-cyan-50 shadow-glow" : "rounded-full px-4 py-1.5 text-xs text-white/48"}
          >
            <Sparkles className="mr-1 inline size-3.5" />
            星图画布
          </button>
          <button
            onClick={() => setMode("workflow-nodes")}
            className={mode === "workflow-nodes" ? "rounded-full bg-cyan-300/18 px-4 py-1.5 text-xs text-cyan-50 shadow-glow" : "rounded-full px-4 py-1.5 text-xs text-white/48"}
          >
            <Workflow className="mr-1 inline size-3.5" />
            节点工作流
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs text-cyan-100">
            <Crown className="mr-1 inline size-3.5" />
            {project.credits} 星尘
          </span>
          <FloatingButton className="h-8 px-2 text-xs">
            <Globe2 className="size-3.5" />
            中 / EN
          </FloatingButton>
          <FloatingButton className="h-8 px-2" title="主题 / Theme">
            <Moon className="size-3.5" />
            <Sun className="size-3.5" />
          </FloatingButton>
          <FloatingButton className="h-8 px-2" onClick={() => setSettingsOpen(true)}>
            <Settings className="size-3.5" />
            设置
          </FloatingButton>
          <FloatingButton className="h-8 px-2">
            <Share2 className="size-3.5" />
            分享
          </FloatingButton>
          <FloatingButton className="h-8 px-2" title="侧栏 / Panel">
            <PanelRight className="size-3.5" />
          </FloatingButton>
          <button className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/6" title="通知 / Notifications">
            <Bell className="size-4" />
          </button>
          <div className="grid size-9 place-items-center rounded-full bg-cyan-100 font-semibold text-[#061018]">P</div>
        </div>
      </header>
      <ApiSettingsDialog />
    </>
  );
}
