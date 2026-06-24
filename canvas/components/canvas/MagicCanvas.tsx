"use client";

import { useEffect, useState } from "react";
import { Compass, FileText, FileVideo, ImagePlus, LayoutTemplate, Sparkles, X } from "lucide-react";
import { CanvasCard } from "@/components/canvas/CanvasCard";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useAgentStore } from "@/stores/useAgentStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";

export function MagicCanvas() {
  const { objects, addObject, deleteSelected } = useCanvasStore();
  const setOpen = useAgentStore((state) => state.setOpen);
  const saveProject = useWorkspaceStore((state) => state.saveProject);
  const [nodeMenu, setNodeMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "c") setOpen(true);
      if (key === "delete") deleteSelected();
      if (key === "s" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        saveProject();
      }
      if (key === "n") addObject("prompt");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addObject, deleteSelected, saveProject, setOpen]);

  useEffect(() => {
    const raw = window.localStorage.getItem("polaris.pendingGoal");
    if (!raw) return;
    try {
      const pending = JSON.parse(raw) as { goal: string; content: string };
      addObject("prompt", {
        x: window.innerWidth / 2 - 260,
        y: window.innerHeight / 2 - 200,
        width: 520,
        height: 300,
        title: "DeepSeek 创作航线 / Creative route",
        content: `目标：${pending.goal}\n\n${pending.content}`
      });
      window.localStorage.removeItem("polaris.pendingGoal");
    } catch {
      window.localStorage.removeItem("polaris.pendingGoal");
    }
  }, [addObject]);

  const addQuickCard = (type: "image" | "video" | "prompt" | "moodboard") => {
    const base = { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 220 };
    if (type === "image") {
      addObject("image", {
        ...base,
        width: 600,
        height: 430,
        title: "Image 图像航点",
        content: "直接输入提示词，或上传图片后进行编辑。例如：将背景改为极光雪夜。"
      });
      return;
    }
    if (type === "video") {
      addObject("video", {
        ...base,
        width: 600,
        height: 430,
        title: "Video 视频航点",
        content: "描述你想生成的画面内容，Polaris 会把素材、镜头和模型连接成生成航线。"
      });
      return;
    }
    addObject(type, {
      ...base,
      title: type === "prompt" ? "Prompt 提示词航点" : "Template 模板航点"
    });
  };

  const createAt = (type: "image" | "video" | "prompt" | "moodboard", x: number, y: number) => {
    if (type === "image") {
      addObject("image", {
        x,
        y,
        width: 600,
        height: 430,
        title: "Image 图像航点",
        content: "直接输入提示词，或上传图片后进行编辑。例如：将背景改为极光雪夜。"
      });
      return;
    }
    if (type === "video") {
      addObject("video", {
        x,
        y,
        width: 600,
        height: 430,
        title: "Video 视频航点",
        content: "描述你想生成的画面内容，Polaris 会把素材、镜头和模型连接成生成航线。"
      });
      return;
    }
    addObject(type, {
      x,
      y,
      title: type === "prompt" ? "Prompt 提示词航点" : "Template 模板航点"
    });
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden dotted-grid bg-[#03050b]"
      onClick={() => setNodeMenu(null)}
      onDoubleClick={(event) => {
        event.preventDefault();
        setNodeMenu({ x: event.clientX, y: event.clientY });
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,.10),transparent_32%)]" />
      {objects.length === 0 ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100/12 bg-white/6 px-3 py-1.5 text-xs text-white/58">
              <Compass className="size-3.5 text-cyan-100" />
              双击创建航点，或选择一条生成航线 / Double click to add a waypoint, or choose a route
            </div>
            <div className="flex flex-wrap justify-center gap-3" onDoubleClick={(event) => event.stopPropagation()}>
              <button onClick={(event) => { event.stopPropagation(); addQuickCard("video"); }} className="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50">
                <FileVideo className="mr-2 inline size-4" />
                文字生视频 / Text to Video
              </button>
              <button onClick={(event) => { event.stopPropagation(); addQuickCard("image"); }} className="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50">
                <ImagePlus className="mr-2 inline size-4" />
                图片换背景 / Image Edit
              </button>
              <button onClick={(event) => { event.stopPropagation(); addQuickCard("video"); }} className="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50">
                <Sparkles className="mr-2 inline size-4" />
                首帧生成视频 / First-frame Video
              </button>
              <button onClick={(event) => { event.stopPropagation(); addQuickCard("moodboard"); }} className="rounded-full border border-cyan-100/12 bg-white/6 px-4 py-2 text-sm text-white/68 transition hover:border-cyan-200/35 hover:text-cyan-50">
                <LayoutTemplate className="mr-2 inline size-4" />
                模板 / Templates
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="absolute left-6 top-5 rounded-full border border-cyan-100/12 bg-black/45 px-3 py-1.5 text-xs text-white/45 backdrop-blur">
        Polaris 星图画布 / Star Map Canvas
      </div>
      {nodeMenu ? (
        <div
          className="absolute z-40 w-64 rounded-2xl border border-cyan-100/14 bg-[#111722]/95 p-3 shadow-glass backdrop-blur-xl"
          style={{ left: nodeMenu.x, top: nodeMenu.y }}
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium">添加航点 / Add waypoint</div>
            <button onClick={() => setNodeMenu(null)} className="grid size-7 place-items-center rounded-lg text-white/42 hover:bg-white/8 hover:text-white">
              <X className="size-4" />
            </button>
          </div>
          <div className="grid gap-2">
            {[
              { type: "prompt" as const, label: "提示词 / Prompt", icon: FileText },
              { type: "image" as const, label: "图像 / Image", icon: ImagePlus },
              { type: "video" as const, label: "视频 / Video", icon: FileVideo },
              { type: "moodboard" as const, label: "模板 / Template", icon: LayoutTemplate }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    createAt(item.type, nodeMenu.x - 120, nodeMenu.y - 60);
                    setNodeMenu(null);
                  }}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-left text-sm text-white/70 hover:border-cyan-200/30 hover:text-cyan-50"
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {objects.map((object) => (
        <CanvasCard key={object.id} object={object} />
      ))}
    </div>
  );
}
