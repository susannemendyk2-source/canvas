import { create } from "zustand";
import type { AgentMessage } from "@/types";
import { uid } from "@/lib/utils";

interface AgentState {
  messages: AgentMessage[];
  open: boolean;
  sendMessage: (content: string) => void;
  addExchange: (userContent: string, assistantContent: string) => void;
  setOpen: (open: boolean) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  open: true,
  messages: [
    {
      id: "agent-welcome",
      role: "assistant",
      content: "告诉我你的北极星目标，我会把它拆成提示词、素材、节点和生成航线。Tell me your north-star goal, and I will map it into prompts, assets, nodes and render routes.",
      suggestions: ["生成工作流 / Create Workflow", "投放到星图 / Apply to Map"],
      createdAt: new Date().toISOString()
    }
  ],
  sendMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: uid("msg"), role: "user", content, createdAt: new Date().toISOString() },
        {
          id: uid("msg"),
          role: "assistant",
          content: "建议先创建 Prompt 航点，再连接 Image 与 Video 航点。比例用 9:16，镜头语言保持 slow push-in 与 macro cutaway。Create a Prompt waypoint, then connect Image and Video waypoints with a 9:16 cinematic route.",
          suggestions: ["生成工作流 / Create Workflow", "投放到星图 / Apply to Map"],
          createdAt: new Date().toISOString()
        }
      ]
    })),
  addExchange: (userContent, assistantContent) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: uid("msg"), role: "user", content: userContent, createdAt: new Date().toISOString() },
        {
          id: uid("msg"),
          role: "assistant",
          content: assistantContent,
          suggestions: ["生成工作流 / Create Workflow", "投放到星图 / Apply to Map"],
          createdAt: new Date().toISOString()
        }
      ]
    })),
  setOpen: (open) => set({ open })
}));
