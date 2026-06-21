"use client";

import { FormEvent, useEffect, useState } from "react";
import { Boxes, Clapperboard, Compass, ImageIcon, Loader2, Send, Sparkles, WandSparkles } from "lucide-react";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { ModelSelector } from "@/components/ui/ModelSelector";
import { SkillChips } from "@/components/agent/SkillChips";
import { useAgentStore } from "@/stores/useAgentStore";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";

export function AgentPanel() {
  const { messages, addExchange } = useAgentStore();
  const addObject = useCanvasStore((state) => state.addObject);
  const setMode = useWorkspaceStore((state) => state.setMode);
  const { hydrate, getActive, setOpen } = useSettingsStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    const settings = getActive();
    if (!settings.apiKey.trim()) {
      setOpen(true);
      setInput(text);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/deepseek/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey,
          model: settings.model,
          messages: [
            {
              role: "system",
              content:
                "你是 Polaris Copilot。请把用户需求转换成 AI 创作建议，包含推荐节点、提示词、比例、镜头和下一步动作。回答中文，简洁。"
            },
            { role: "user", content: text }
          ]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "DeepSeek 请求失败");
      addExchange(text, `DeepSeek：${data.content}`);
      setInput("");
    } catch (error) {
      addExchange(text, `连接失败：${error instanceof Error ? error.message : "未知错误"}`);
      setInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-cyan-100/10 bg-[#050811]/95 backdrop-blur-xl">
      <div className="border-b border-cyan-100/10 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full border border-cyan-100/25 bg-cyan-100/10">
            <Compass className="size-5 text-cyan-100" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Polaris Copilot</h2>
            <p className="text-xs text-white/38">星图生成控制台 / Route generation console</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "ml-8" : ""}>
            <div className={message.role === "user" ? "whitespace-pre-wrap rounded-xl bg-cyan-100 px-3 py-2 text-sm text-[#061018]" : "whitespace-pre-wrap rounded-xl border border-cyan-100/10 bg-white/6 px-3 py-2 text-sm leading-6 text-white/72"}>
              {message.content}
            </div>
            {message.suggestions ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <FloatingButton onClick={() => addObject("prompt", { title: "Polaris 建议 / Copilot suggestion", content: message.content })}>
                  <WandSparkles className="size-4" />
                  投放到星图
                </FloatingButton>
                <FloatingButton onClick={() => setMode("workflow-nodes")}>生成工作流</FloatingButton>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="border-t border-cyan-100/10 p-4">
        <SkillChips onPick={(skill) => setInput(skill)} />
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <button onClick={() => addObject("video", { title: "视频航点 / Video waypoint", width: 600, height: 430 })} className="rounded-lg border border-cyan-100/10 bg-white/6 p-2 text-white/64 hover:text-cyan-100">
            <Clapperboard className="mx-auto mb-1 size-4" />
            视频
          </button>
          <button onClick={() => addObject("image", { title: "图像航点 / Image waypoint", width: 600, height: 430 })} className="rounded-lg border border-cyan-100/10 bg-white/6 p-2 text-white/64 hover:text-cyan-100">
            <ImageIcon className="mx-auto mb-1 size-4" />
            图像
          </button>
          <button onClick={() => setMode("workflow-nodes")} className="rounded-lg border border-cyan-100/10 bg-white/6 p-2 text-white/64 hover:text-cyan-100">
            <Boxes className="mx-auto mb-1 size-4" />
            分镜
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 rounded-2xl border border-cyan-100/12 bg-black/35 p-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="描述你的北极星目标，或输入 @ 引用素材 / Describe your north-star goal, or type @"
            className="h-20 w-full resize-none bg-transparent p-2 text-sm text-white outline-none placeholder:text-white/30"
          />
          <div className="flex items-center gap-2">
            <Sparkles className="ml-2 size-4 text-cyan-100" />
            <div className="min-w-0 flex-1">
              <ModelSelector />
            </div>
            <button className="grid size-9 place-items-center rounded-full bg-cyan-100 text-[#061018] transition hover:bg-white" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
