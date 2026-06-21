"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, Flame, ImageIcon, KeyRound, Link2, Loader2, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ApiProvider, useSettingsStore } from "@/stores/useSettingsStore";

const tabs: { id: ApiProvider; label: string; hint: string }[] = [
  { id: "deepseek", label: "DeepSeek API", hint: "创作者目标、AI 对话、提示词增强" },
  { id: "runninghub", label: "RunningHub", hint: "图像模型接入与视频生成扩展" },
  { id: "volcano", label: "火山引擎", hint: "豆包/方舟模型与国内云模型" }
];

const modelOptions: Record<ApiProvider, string[]> = {
  deepseek: ["deepseek-chat", "deepseek-reasoner"],
  runninghub: ["nano-banana-pro", "nano-banana", "gpt-image-2", "custom-workflow"],
  volcano: ["doubao-seed-1-6", "doubao-vision-pro", "seedream-3-0", "custom-model"]
};

export function ApiSettingsDialog() {
  const { open, setOpen, activeProvider, setActiveProvider, providers, updateProvider, hydrate, save } = useSettingsStore();
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const current = providers[activeProvider];

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!open) return null;

  const testConnection = async () => {
    setStatus("");
    if (activeProvider !== "deepseek") {
      setStatus("当前版本仅支持测试 DeepSeek 对话接口，其他供应商配置会先保存供后续图像/视频节点使用。");
      return;
    }
    setTesting(true);
    try {
      const response = await fetch("/api/deepseek/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: current.baseUrl,
          apiKey: current.apiKey,
          model: current.model,
          messages: [
            { role: "system", content: "You are a connection tester. Reply with one short sentence." },
            { role: "user", content: "Polaris connection test" }
          ]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "连接失败");
      setStatus("连接成功：DeepSeek 已可用于创作者目标输入框。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "连接失败");
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = () => {
    save();
    setStatus("配置已保存到本机浏览器。");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <aside className="h-full w-full max-w-[520px] border-l border-white/10 bg-[#1b1c1f] text-white shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-white/8 px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-cyan-500/12 text-cyan-200">
              <Zap className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">设置</h2>
              <p className="text-xs text-white/40">API Connection Center</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-lg border border-white/8 text-white/45 hover:bg-white/8 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-5 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveProvider(tab.id);
                  setStatus("");
                }}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm transition",
                  activeProvider === tab.id ? "bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30" : "text-white/48 hover:bg-white/6 hover:text-white"
                )}
              >
                {tab.id === "volcano" ? <Flame className="mr-1 inline size-4" /> : <KeyRound className="mr-1 inline size-4" />}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/8 bg-black/16 p-4">
            <div className="mb-4 flex items-center gap-2 text-xs text-white/42">
              <span className={cn("size-2 rounded-full", current.apiKey ? "bg-emerald-400" : "bg-white/28")} />
              {current.apiKey ? "已配置 API / Configured" : "未配置 API / Not configured"}
            </div>

            <div className="mb-5 rounded-xl border border-amber-400/20 bg-amber-400/8 p-4 text-xs leading-6 text-amber-200">
              {activeProvider === "deepseek"
                ? "DeepSeek 用于首页创作者目标输入框、AI 对话和提示词增强。Base URL 默认 https://api.deepseek.com，接口路径为 /chat/completions。"
                : tabs.find((tab) => tab.id === activeProvider)?.hint}
            </div>

            <label className="mb-4 block">
              <span className="mb-2 flex items-center gap-2 text-xs text-white/48">
                <Link2 className="size-4" />
                API Base URL
              </span>
              <input
                value={current.baseUrl}
                onChange={(event) => updateProvider(activeProvider, { baseUrl: event.target.value })}
                className="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-2 flex items-center gap-2 text-xs text-white/48">
                <KeyRound className="size-4" />
                API Key
              </span>
              <div className="flex h-11 items-center rounded-lg border border-white/8 bg-black focus-within:border-cyan-400/60">
                <input
                  value={current.apiKey}
                  onChange={(event) => updateProvider(activeProvider, { apiKey: event.target.value })}
                  type={showKey ? "text" : "password"}
                  placeholder={activeProvider === "runninghub" ? "Bearer key" : "sk-..."}
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25"
                />
                <button type="button" onClick={() => setShowKey((value) => !value)} className="grid size-10 place-items-center text-white/42 hover:text-white">
                  {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            <label className="mb-5 block">
              <span className="mb-2 flex items-center gap-2 text-xs text-white/48">
                <ImageIcon className="size-4" />
                默认模型 / Default Model
              </span>
              <select
                value={current.model}
                onChange={(event) => updateProvider(activeProvider, { model: event.target.value })}
                className="h-11 w-full rounded-lg border border-white/8 bg-black px-3 text-sm text-white outline-none focus:border-cyan-400/60"
              >
                {modelOptions[activeProvider].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button onClick={saveSettings} className="h-11 rounded-lg bg-cyan-600 text-sm font-medium text-white transition hover:bg-cyan-500">
                保存配置
              </button>
              <button onClick={testConnection} className="h-11 rounded-lg border border-white/10 bg-white/6 text-sm text-white/72 transition hover:bg-white/10" disabled={testing}>
                {testing ? <Loader2 className="mx-auto size-4 animate-spin" /> : "测试连接"}
              </button>
            </div>

            {status ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-white/8 bg-white/5 p-3 text-xs leading-5 text-white/62">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-200" />
                {status}
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
