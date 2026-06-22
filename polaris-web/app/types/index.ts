export type CanvasMode = 'magic' | 'workflow'
export type StatusType = 'idle' | 'queued' | 'running' | 'success' | 'failed'
export type CanvasObjectType = 'prompt' | 'image' | 'video' | 'text' | 'moodboard' | 'generated' | 'reference' | 'audio'
export type NodeType = 'prompt' | 'image-gen' | 'video-gen' | 'enhance' | 'merge' | 'output'

export interface CanvasObject {
  id: string
  backendId?: number
  projectId?: number
  type: CanvasObjectType
  x: number
  y: number
  width: number
  height: number
  title: string
  content: string
  thumbnail?: string
  meta?: string
  dirty?: boolean
}

export interface WorkflowNodeData {
  label: string
  nodeType: NodeType
  status: StatusType
  progress: number
  icon: string
}

export interface WorkflowEdgeData {
  label?: string
}

export interface HistoryItem {
  id: string
  title: string
  type: string
  status: StatusType
  progress: number
  createdAt: string
}

export interface AssetItem {
  id: string
  title: string
  type: string
  thumbnail?: string
  favorite: boolean
  createdAt: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}
