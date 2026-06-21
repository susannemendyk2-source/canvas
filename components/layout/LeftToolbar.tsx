"use client";

import { BoxSelect, CircleHelp, Clock3, ImagePlus, Layers3, MousePointer2, Move, PanelLeft, Settings, WandSparkles } from "lucide-react";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useWorkflowStore } from "@/stores/useWorkflowStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";

const tools = [
  { icon: MousePointer2, label: "选择 / Select", action: "select" },
  { icon: Move, label: "移动 / Move", action: "move" },
  { icon: ImagePlus, label: "添加 / Add", action: "add" },
  { icon: Layers3, label: "素材 / Assets", action: "assets" },
  { icon: PanelLeft, label: "模板 / Templates", action: "templates" },
  { icon: Clock3, label: "历史 / History", action: "history" },
  { icon: CircleHelp, label: "帮助 / Help", action: "help" },
  { icon: Settings, label: "设置 / Settings", action: "settings" }
];

export function LeftToolbar() {
  const addObject = useCanvasStore((state) => state.addObject);
  const addNode = useWorkflowStore((state) => state.addNode);
  const mode = useWorkspaceStore((state) => state.mode);
  const openSettings = useSettingsStore((state) => state.setOpen);

  const handleAction = (action: string) => {
    if (action === "add") {
      if (mode === "magic-canvas") addObject("prompt", { title: "Prompt 提示词航点" });
      else addNode("prompt");
    }
    if (action === "settings") openSettings(true);
  };

  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-cyan-100/10 bg-[#050811]/82 py-4 backdrop-blur-xl">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.label}
            title={tool.label}
            onClick={() => handleAction(tool.action)}
            className="grid size-10 place-items-center rounded-lg text-white/58 transition hover:bg-cyan-100/10 hover:text-cyan-50"
          >
            <Icon className="size-5" />
          </button>
        );
      })}
      <button
        title="生成 / Generate"
        onClick={() =>
          addObject("generated", {
            title: "生成资产 / Generated asset",
            content: "Polaris mock 结果已投放到当前星图附近。Polaris mock result added near your current route."
          })
        }
        className="mt-auto grid size-10 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
      >
        <WandSparkles className="size-5" />
      </button>
      <BoxSelect className="size-4 text-white/25" />
    </aside>
  );
}
