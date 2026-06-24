"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleDot, Loader2, Settings } from "lucide-react";
import { ApiSettingsDialog } from "@/components/settings/ApiSettingsDialog";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function GoalComposer() {
  const router = useRouter();
  const { hydrate, getActive, setOpen } = useSettingsStore();
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const submit = async () => {
    setError("");
    const settings = getActive();
    if (!settings.apiKey.trim()) {
      setOpen(true);
      setError("请先配置 DeepSeek API Key，然后再提交创作者目标。");
      return;
    }
    if (!goal.trim()) {
      setError("请先输入一个创作目标。");
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
                "你是 Polaris AI 创作系统的创意架构师。请把用户目标拆成：1. 简短创意摘要；2. 正向提示词；3. 负向提示词；4. 推荐节点链路；5. 图像/视频比例与风格建议。使用中文，结构清晰。"
            },
            { role: "user", content: goal }
          ]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "DeepSeek 请求失败");
      window.localStorage.setItem(
        "polaris.pendingGoal",
        JSON.stringify({
          goal,
          content: data.content,
          createdAt: new Date().toISOString()
        })
      );
      router.push("/studio");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-cyan-100/14 bg-[#111722]/88 p-3 shadow-[0_30px_120px_rgba(30,130,255,.18)] backdrop-blur-xl">
        <textarea
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          className="h-24 w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          placeholder="输入你的创作航向，例如：为一款智能手表生成 15 秒新品发布短片... / Describe your north-star creative goal..."
        />
        <div className="flex items-center justify-between border-t border-white/10 px-2 pt-3">
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/54 transition hover:text-white">
            <Settings className="size-4" />
            API 设置
          </button>
          <div className="hidden items-center gap-2 text-xs text-white/38 sm:flex">
            <CircleDot className="size-4 text-cyan-100" />
            DeepSeek · Prompt → Image → Video → Export
          </div>
          <button
            onClick={submit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-[#061018] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
            生成航线
          </button>
        </div>
        {error ? <div className="px-3 pt-3 text-xs text-amber-200">{error}</div> : null}
      </div>
      <ApiSettingsDialog />
    </>
  );
}
