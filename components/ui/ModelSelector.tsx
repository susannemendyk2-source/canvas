"use client";

import { providers } from "@/lib/ai/providers";

export function ModelSelector() {
  return (
    <select className="h-9 w-full rounded-md border border-cyan-100/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50">
      {providers.map((provider) => (
        <option key={provider.id} value={provider.id}>
          {provider.name}
          {provider.configured ? "" : " - 未配置 / not configured"}
        </option>
      ))}
    </select>
  );
}
