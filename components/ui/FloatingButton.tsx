"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function FloatingButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 text-sm text-white/88 transition hover:border-cyan-300/35 hover:bg-white/12",
        className
      )}
      {...props}
    />
  );
}
