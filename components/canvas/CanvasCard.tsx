"use client";

import { Copy, Grip, Trash2, Workflow } from "lucide-react";
import { useRef } from "react";
import { ImageCard } from "@/components/canvas/ImageCard";
import { PromptCard } from "@/components/canvas/PromptCard";
import { VideoCard } from "@/components/canvas/VideoCard";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import type { CanvasObject } from "@/types";
import { cn } from "@/lib/utils";

export function CanvasCard({ object }: { object: CanvasObject }) {
  const selectedId = useCanvasStore((state) => state.selectedId);
  const selectObject = useCanvasStore((state) => state.selectObject);
  const updateObject = useCanvasStore((state) => state.updateObject);
  const duplicateObject = useCanvasStore((state) => state.duplicateObject);
  const deleteSelected = useCanvasStore((state) => state.deleteSelected);
  const setMode = useWorkspaceStore((state) => state.setMode);
  const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const selected = selectedId === object.id;

  return (
    <div
      onPointerDown={(event) => {
        selectObject(object.id);
        start.current = { x: event.clientX, y: event.clientY, ox: object.x, oy: object.y };
        (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!(event.buttons & 1)) return;
        updateObject(object.id, {
          x: start.current.ox + event.clientX - start.current.x,
          y: start.current.oy + event.clientY - start.current.y
        });
      }}
      className={cn(
        "glass group absolute rounded-lg p-3 transition hover:border-cyan-300/30",
        selected ? "border-cyan-300/45 shadow-glow" : "border-white/10"
      )}
      style={{ left: object.x, top: object.y, width: object.width, minHeight: object.height }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Grip className="size-4 shrink-0 text-white/28" />
          <span className="truncate text-sm font-medium text-white/86">{object.title}</span>
        </div>
        <div className="flex opacity-0 transition group-hover:opacity-100">
          <button title="复制 / Duplicate" onClick={(event) => { event.stopPropagation(); duplicateObject(object.id); }} className="grid size-7 place-items-center rounded hover:bg-white/10">
            <Copy className="size-3.5" />
          </button>
          <button title="发送到工作流 / Send to workflow" onClick={(event) => { event.stopPropagation(); setMode("workflow-nodes"); }} className="grid size-7 place-items-center rounded hover:bg-white/10">
            <Workflow className="size-3.5" />
          </button>
          <button title="删除 / Delete" onClick={(event) => { event.stopPropagation(); deleteSelected(); }} className="grid size-7 place-items-center rounded hover:bg-white/10">
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
      {object.type === "prompt" ? <PromptCard content={object.content} /> : null}
      {object.type === "image" || object.type === "generated" || object.type === "moodboard" || object.type === "reference" ? <ImageCard content={object.content} /> : null}
      {object.type === "video" ? <VideoCard content={object.content} /> : null}
      {object.type === "text" || object.type === "audio" ? <p className="text-sm leading-6 text-white/62">{object.content}</p> : null}
    </div>
  );
}
