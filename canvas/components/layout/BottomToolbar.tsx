"use client";

import { Compass, Maximize2, Redo2, Undo2, Workflow } from "lucide-react";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";

export function BottomToolbar() {
  const { mode, setMode, zoom, setZoom } = useWorkspaceStore();

  return (
    <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-cyan-100/12 bg-black/60 p-2 shadow-glass backdrop-blur-xl">
      <FloatingButton title="撤销 / Undo">
        <Undo2 className="size-4" />
      </FloatingButton>
      <FloatingButton title="重做 / Redo">
        <Redo2 className="size-4" />
      </FloatingButton>
      <FloatingButton onClick={() => setMode("magic-canvas")} className={mode === "magic-canvas" ? "border-cyan-300/35 bg-cyan-300/12" : ""}>
        <Compass className="size-4" />
        星图画布 / Star Map
      </FloatingButton>
      <FloatingButton onClick={() => setMode("workflow-nodes")} className={mode === "workflow-nodes" ? "border-cyan-300/35 bg-cyan-300/12" : ""}>
        <Workflow className="size-4" />
        节点工作流 / Workflow
      </FloatingButton>
      <FloatingButton onClick={() => setZoom(Math.max(30, zoom - 10))}>-</FloatingButton>
      <span className="w-12 text-center text-xs text-white/55">{zoom}%</span>
      <FloatingButton onClick={() => setZoom(Math.min(180, zoom + 10))}>+</FloatingButton>
      <FloatingButton title="适配屏幕 / Fit screen">
        <Maximize2 className="size-4" />
      </FloatingButton>
    </div>
  );
}
