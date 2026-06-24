export type WorkspaceMode = "magic-canvas" | "workflow-nodes";
export type ThemeMode = "dark" | "light";
export type CanvasCardType =
  | "text"
  | "prompt"
  | "image"
  | "video"
  | "audio"
  | "reference"
  | "generated"
  | "moodboard";

export type TaskStatus = "idle" | "queued" | "running" | "success" | "failed";
export type HandleKind = "text" | "image" | "video" | "audio" | "json";
export type WorkflowNodeType =
  | "text"
  | "image"
  | "video"
  | "prompt"
  | "image-generate"
  | "image-to-video"
  | "output";

export interface CanvasObject {
  id: string;
  type: CanvasCardType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  meta?: Record<string, string | number | boolean>;
}

export interface WorkflowNodeData {
  [key: string]: unknown;
  label: string;
  nodeType: WorkflowNodeType;
  status: TaskStatus;
  progress: number;
  preview?: string;
  inputs: HandleKind[];
  outputs: HandleKind[];
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Asset {
  id: string;
  type: CanvasCardType;
  title: string;
  url?: string;
  createdAt: string;
  favorite?: boolean;
}

export interface GenerationTask {
  id: string;
  title: string;
  status: TaskStatus;
  progress: number;
  cost: number;
  createdAt: string;
}

export interface AIProvider {
  id: string;
  name: string;
  configured: boolean;
  generateImage(input: ProviderInput): Promise<ProviderResult>;
  editImage(input: ProviderInput): Promise<ProviderResult>;
  generateVideo(input: ProviderInput): Promise<ProviderResult>;
  generateAudio(input: ProviderInput): Promise<ProviderResult>;
  enhancePrompt(input: ProviderInput): Promise<ProviderResult>;
  estimateCost(input: ProviderInput): Promise<number>;
}

export interface ProviderInput {
  prompt: string;
  mode?: string;
  assets?: Asset[];
}

export interface ProviderResult {
  title: string;
  content: string;
  assetType: CanvasCardType;
  preview?: string;
}

export interface ModelConfig {
  provider: string;
  model: string;
  modality: "image" | "video" | "audio" | "text";
}

export interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  mode: WorkspaceMode;
  savedAt: string;
  credits: number;
}
