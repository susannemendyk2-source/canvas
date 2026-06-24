import { create } from "zustand";
import type { Edge, Node } from "@xyflow/react";
import type { WorkflowNodeData, WorkflowNodeType } from "@/types";
import { uid } from "@/lib/utils";

type FlowNode = Node<WorkflowNodeData>;

interface WorkflowState {
  nodes: FlowNode[];
  edges: Edge[];
  running: boolean;
  addNode: (type: WorkflowNodeType, position?: { x: number; y: number }) => void;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  runWorkflow: () => Promise<void>;
}

const baseNodes: FlowNode[] = [
  {
    id: "prompt-1",
    type: "prompt",
    position: { x: 40, y: 130 },
    data: { label: "文本提示词 / Text Prompt", nodeType: "prompt", status: "idle", progress: 0, inputs: [], outputs: ["text"], preview: "黑色玻璃影棚中的高端护肤设备发布片。Premium skincare device launch in a black glass studio." }
  },
  {
    id: "image-1",
    type: "imageGenerate",
    position: { x: 390, y: 90 },
    data: { label: "图像生成 / Image Generation", nodeType: "image-generate", status: "idle", progress: 0, inputs: ["text"], outputs: ["image"], preview: "四张主视觉候选画面。Four hero frame candidates." }
  },
  {
    id: "video-1",
    type: "imageToVideo",
    position: { x: 760, y: 160 },
    data: { label: "图生视频 / Image to Video", nodeType: "image-to-video", status: "idle", progress: 0, inputs: ["image"], outputs: ["video"], preview: "12 秒竖屏动态草稿。12s vertical motion draft." }
  },
  {
    id: "output-1",
    type: "output",
    position: { x: 1110, y: 130 },
    data: { label: "导出视频 / Export Video", nodeType: "output", status: "idle", progress: 0, inputs: ["video"], outputs: ["json"], preview: "已准备审核。Ready for review." }
  }
];

const baseEdges: Edge[] = [
  { id: "e1", source: "prompt-1", target: "image-1", animated: true },
  { id: "e2", source: "image-1", target: "video-1", animated: true },
  { id: "e3", source: "video-1", target: "output-1", animated: true }
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: baseNodes,
  edges: baseEdges,
  running: false,
  addNode: (type, position = { x: 220, y: 220 }) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: uid("node"),
          type: type === "image-generate" ? "imageGenerate" : type === "image-to-video" ? "imageToVideo" : type,
          position,
          data: {
            label: `${type.replaceAll("-", " ")} / ${type.replaceAll("-", " ")}`,
            nodeType: type,
            status: "idle",
            progress: 0,
            inputs: type.includes("output") ? ["video"] : ["text"],
            outputs: type.includes("video") ? ["video"] : ["image"],
            preview: "配置输入后运行。Configure inputs and run."
          }
        }
      ]
    })),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  runWorkflow: async () => {
    if (get().running) return;
    set({ running: true });
    for (const node of get().nodes) {
      set((state) => ({
        nodes: state.nodes.map((item) => (item.id === node.id ? { ...item, data: { ...item.data, status: "running", progress: 12 } } : item))
      }));
      for (const progress of [34, 66, 100]) {
        await new Promise((resolve) => setTimeout(resolve, 360));
        set((state) => ({
          nodes: state.nodes.map((item) => (item.id === node.id ? { ...item, data: { ...item.data, progress } } : item))
        }));
      }
      set((state) => ({
        nodes: state.nodes.map((item) =>
          item.id === node.id
            ? { ...item, data: { ...item.data, status: "success", progress: 100, preview: `${item.data.label} 已完成 mock 输出 / completed with mock output.` } }
            : item
        )
      }));
    }
    set({ running: false });
  }
}));
