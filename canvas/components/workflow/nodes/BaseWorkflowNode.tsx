"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { FileText, ImageIcon, PlaySquare, Sparkles, Upload, Video } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { WorkflowNodeData } from "@/types";

const icons = {
  text: FileText,
  image: ImageIcon,
  video: PlaySquare,
  prompt: Sparkles,
  "image-generate": ImageIcon,
  "image-to-video": Video,
  output: Upload
};

const handleColor = {
  text: "bg-cyan-300",
  image: "bg-violet-300",
  video: "bg-blue-300",
  audio: "bg-emerald-300",
  json: "bg-amber-300"
};

type WorkflowNodeProps = NodeProps<Node<WorkflowNodeData>>;

export function BaseWorkflowNode({ data }: WorkflowNodeProps) {
  const Icon = icons[data.nodeType];

  return (
    <div className="w-[280px] rounded-lg border border-white/10 bg-[#11131a]/90 p-3 shadow-glass backdrop-blur-xl">
      {data.inputs.map((kind, index) => (
        <Handle key={kind} type="target" position={Position.Left} id={kind} className={handleColor[kind]} style={{ top: 52 + index * 24 }} />
      ))}
      {data.outputs.map((kind, index) => (
        <Handle key={kind} type="source" position={Position.Right} id={kind} className={handleColor[kind]} style={{ top: 52 + index * 24 }} />
      ))}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid size-8 place-items-center rounded-md border border-white/10 bg-white/8">
            <Icon className="size-4 text-cyan-100" />
          </div>
          <span className="truncate text-sm font-medium text-white/86">{data.label}</span>
        </div>
        <StatusBadge status={data.status} />
      </div>
      <div className="mt-3 rounded-md border border-white/10 bg-black/24 p-3">
        <div className="mb-2 flex items-center justify-between text-[11px] text-white/40">
          <span>parameters</span>
          <span>{data.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/8">
          <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${data.progress}%` }} />
        </div>
        <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/58">{data.preview}</p>
      </div>
      <div className="mt-3 flex gap-2 text-[11px] text-white/36">
        {data.outputs.map((output) => (
          <span key={output} className="rounded-full border border-white/10 px-2 py-0.5">
            {output}
          </span>
        ))}
      </div>
    </div>
  );
}
