"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AgentPanel } from "@/components/agent/AgentPanel";
import { BottomToolbar } from "@/components/layout/BottomToolbar";
import { LeftToolbar } from "@/components/layout/LeftToolbar";
import { TopBar } from "@/components/layout/TopBar";
import { MagicCanvas } from "@/components/canvas/MagicCanvas";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";

export function AppShell() {
  const mode = useWorkspaceStore((state) => state.mode);

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-studio-black text-white">
      <TopBar />
      <div className="relative flex min-h-0 flex-1">
        <LeftToolbar />
        <section className="relative min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.22 }}
            >
              {mode === "magic-canvas" ? <MagicCanvas /> : <WorkflowCanvas />}
            </motion.div>
          </AnimatePresence>
          <BottomToolbar />
        </section>
        <AgentPanel />
      </div>
    </main>
  );
}
