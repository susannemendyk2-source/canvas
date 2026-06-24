"use client";

import { useCallback, useMemo, useState } from "react";
import { addEdge, Background, BackgroundVariant, Controls, MiniMap, ReactFlow, type Connection, type NodeTypes, useEdgesState, useNodesState } from "@xyflow/react";
import { Play } from "lucide-react";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { NodeMenu } from "@/components/workflow/NodeMenu";
import { ImageGenerateNode } from "@/components/workflow/nodes/ImageGenerateNode";
import { ImageToVideoNode } from "@/components/workflow/nodes/ImageToVideoNode";
import { OutputNode } from "@/components/workflow/nodes/OutputNode";
import { PromptNode } from "@/components/workflow/nodes/PromptNode";
import { TextNode } from "@/components/workflow/nodes/TextNode";
import { ImageNode } from "@/components/workflow/nodes/ImageNode";
import { VideoNode } from "@/components/workflow/nodes/VideoNode";
import { useWorkflowStore } from "@/stores/useWorkflowStore";

export function WorkflowCanvas() {
  const store = useWorkflowStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(store.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(store.edges);
  const [menuOpen, setMenuOpen] = useState(false);

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      text: TextNode,
      image: ImageNode,
      video: VideoNode,
      prompt: PromptNode,
      imageGenerate: ImageGenerateNode,
      imageToVideo: ImageToVideoNode,
      output: OutputNode
    }),
    []
  );

  const onConnect = useCallback((connection: Connection) => setEdges((current) => addEdge({ ...connection, animated: true }, current)), [setEdges]);

  const run = async () => {
    store.setNodes(nodes);
    store.setEdges(edges);
    await store.runWorkflow();
    setNodes(useWorkflowStore.getState().nodes);
  };

  const addPromptNode = (x = 220, y = 220) => {
    store.addNode("prompt", { x, y });
    setNodes(useWorkflowStore.getState().nodes);
  };

  return (
    <div
      className="relative h-full w-full bg-[#07080c]"
      onDoubleClickCapture={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest(".react-flow__node")) return;
        addPromptNode(event.clientX - 280, event.clientY - 120);
      }}
    >
      <div className="absolute right-5 top-5 z-20 flex gap-2">
        <FloatingButton onClick={() => setMenuOpen((value) => !value)}>添加节点 / Add Node</FloatingButton>
        <FloatingButton onClick={run} className="border-cyan-300/30 bg-cyan-300/12">
          <Play className="size-4" />
          运行工作流 / Run Workflow
        </FloatingButton>
      </div>
      {menuOpen ? (
        <NodeMenu
          onAdd={(type) => {
            store.addNode(type);
            setNodes(useWorkflowStore.getState().nodes);
            setMenuOpen(false);
          }}
        />
      ) : null}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.2} color="rgba(255,255,255,.16)" />
        <MiniMap pannable zoomable nodeColor="#66E4FF" maskColor="rgba(0,0,0,.42)" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
