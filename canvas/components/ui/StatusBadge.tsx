import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

const tones: Record<TaskStatus, string> = {
  idle: "border-white/10 text-white/55",
  queued: "border-studio-warning/30 text-studio-warning",
  running: "border-studio-cyan/35 text-studio-cyan",
  success: "border-studio-success/35 text-studio-success",
  failed: "border-studio-danger/35 text-studio-danger"
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const labels: Record<TaskStatus, string> = {
    idle: "待运行 / idle",
    queued: "排队 / queued",
    running: "运行中 / running",
    success: "成功 / success",
    failed: "失败 / failed"
  };

  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px]", tones[status])}>{labels[status]}</span>;
}
