"use client";

import type { WorkflowNodeType } from "@/types";

const groups: { title: string; items: { label: string; type: WorkflowNodeType }[] }[] = [
  { title: "输入 / Input", items: [{ label: "文本 / Text", type: "text" }, { label: "提示词 / Prompt", type: "prompt" }, { label: "图像 / Image", type: "image" }, { label: "视频 / Video", type: "video" }] },
  { title: "生成 / Generate", items: [{ label: "文生图 / Text to Image", type: "image-generate" }, { label: "图生视频 / Image to Video", type: "image-to-video" }] },
  { title: "输出 / Output", items: [{ label: "导出 / Export", type: "output" }] }
];

export function NodeMenu({ onAdd }: { onAdd: (type: WorkflowNodeType) => void }) {
  return (
    <div className="absolute left-5 top-5 z-20 w-56 rounded-lg border border-white/10 bg-black/60 p-3 shadow-glass backdrop-blur-xl">
      {groups.map((group) => (
        <div key={group.title} className="mb-3 last:mb-0">
          <div className="mb-2 text-[11px] uppercase tracking-wider text-white/35">{group.title}</div>
          <div className="grid gap-1">
            {group.items.map((item) => (
              <button
                key={item.type}
                onClick={() => onAdd(item.type)}
                className="rounded-md px-2 py-1.5 text-left text-xs text-white/68 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
