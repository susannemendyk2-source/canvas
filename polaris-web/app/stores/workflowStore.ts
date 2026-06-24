import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NodeType, StatusType } from '~/types'
import { uid } from '~/utils'
import { aiService, applyApiConfig } from '~/services/aiService'

interface WFNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    nodeType: NodeType
    status: StatusType
    progress: number
    icon: string
    prompt?: string
    output?: string
    error?: string
    model?: string
    size?: string
  }
}

interface WFEdge {
  id: string
  source: string
  target: string
  animated?: boolean
  style?: Record<string, string>
}

export const useWorkflowStore = defineStore('workflow', () => {
  const nodes = ref<WFNode[]>([])
  const edges = ref<WFEdge[]>([])
  const selectedNodeId = ref<string | null>(null)
  const running = ref(false)

  const labels: Record<NodeType, string> = {
    prompt: 'Prompt',
    'image-gen': 'Image Generation',
    'video-gen': 'Video Generation',
    enhance: 'Enhance',
    merge: 'Merge',
    output: 'Output'
  }

  const defaultModels: Record<NodeType, string> = {
    prompt: '',
    'image-gen': 'dall-e-3',
    'video-gen': 'jimeng-video-3.5-pro',
    enhance: 'deepseek-v4-flash',
    merge: '',
    output: ''
  }

  const defaultSizes: Record<NodeType, string> = {
    'image-gen': '1024x1024',
  }

  function addNode(type: NodeType, x: number, y: number) {
    const node: WFNode = {
      id: uid('wf'),
      type: 'base-workflow',
      position: { x, y },
      data: {
        label: labels[type] || type,
        nodeType: type,
        status: 'idle',
        progress: 0,
        icon: type,
        model: defaultModels[type] || undefined,
        size: defaultSizes[type] || undefined
      }
    }
    nodes.value.push(node)
    return node
  }

  function removeNode(id: string) {
    nodes.value = nodes.value.filter(n => n.id !== id)
    edges.value = edges.value.filter(e => e.source !== id && e.target !== id)
    if (selectedNodeId.value === id) selectedNodeId.value = null
  }

  function updateNodeData(id: string, data: Partial<WFNode['data']>) {
    const node = nodes.value.find(n => n.id === id)
    if (node) Object.assign(node.data, data)
  }

  function addEdge(source: string, target: string) {
    if (!source || !target || source === target) return null
    const exists = edges.value.some(e => e.source === source && e.target === target)
    if (exists) return null
    const edge: WFEdge = {
      id: uid('edge'),
      source,
      target,
      animated: true,
      style: { stroke: 'rgba(103,232,249,.72)' }
    }
    edges.value.push(edge)
    return edge
  }

  function addRoute(types: NodeType[], startX = 220, startY = 220) {
    const added = types.map((type, index) => addNode(type, startX + index * 300, startY + index * 70))
    for (let i = 0; i < added.length - 1; i += 1) {
      addEdge(added[i].id, added[i + 1].id)
    }
    return added
  }

  function selectNode(id: string | null) {
    selectedNodeId.value = id
  }

  function clear() {
    nodes.value = []
    edges.value = []
    selectedNodeId.value = null
  }

  async function pollTaskResult(taskId: string): Promise<string | null> {
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 2000))
      try {
        const res: any = await aiService.getTasks(applyApiConfig('video', { taskId }))
        if (res?.url) return res.url
        if (res?.status && res.status !== 'pending' && res.status !== 'running') return null
      } catch {
        return null
      }
    }
    return null
  }

  async function runWorkflow() {
    if (running.value || nodes.value.length === 0) return
    running.value = true

    for (const node of nodes.value) {
      node.data.status = 'idle'
      node.data.progress = 0
      node.data.output = ''
      node.data.error = ''
    }

    try {
      const inDegree: Record<string, number> = {}
      const graph: Record<string, string[]> = {}
      const reverseGraph: Record<string, string[]> = {}

      for (const node of nodes.value) {
        inDegree[node.id] = 0
        graph[node.id] = []
        reverseGraph[node.id] = []
      }
      for (const edge of edges.value) {
        graph[edge.source]?.push(edge.target)
        reverseGraph[edge.target]?.push(edge.source)
        inDegree[edge.target] = (inDegree[edge.target] || 0) + 1
      }

      const queue: string[] = Object.entries(inDegree).filter(([, d]) => d === 0).map(([id]) => id)
      const sorted: string[] = []
      while (queue.length) {
        const id = queue.shift()!
        sorted.push(id)
        for (const neighbor of graph[id] || []) {
          inDegree[neighbor]--
          if (inDegree[neighbor] === 0) queue.push(neighbor)
        }
      }

      const outputs: Record<string, string> = {}

      for (const nodeId of sorted) {
        const node = nodes.value.find(n => n.id === nodeId)
        if (!node) continue

        const predecessors = reverseGraph[nodeId] || []
        const inputText = predecessors.map(p => outputs[p]).filter(Boolean).join('\n') || node.data.prompt || ''

        node.data.status = 'running'
        node.data.progress = 10

        try {
          let result = ''
          const nodeType = node.data.nodeType

          if (nodeType === 'prompt') {
            result = inputText
          } else if (nodeType === 'image-gen') {
            node.data.progress = 30
            const res: any = await aiService.imageGenerate(applyApiConfig('image', {
              model: node.data.model || 'dall-e-3',
              prompt: inputText,
              size: node.data.size || '1024x1024'
            }))
            node.data.progress = 80
            if (res?.url) {
              result = res.url
            } else {
              throw new Error(res?.error || 'No image URL returned')
            }
          } else if (nodeType === 'video-gen') {
            node.data.progress = 30
            const res: any = await aiService.videoGenerate(applyApiConfig('video', {
              model: node.data.model || 'jimeng-video-3.5-pro',
              prompt: inputText
            }))
            node.data.progress = 60
            if (res?.url) {
              result = res.url
            } else if (res?.taskId) {
              node.data.progress = 70
              const url = await pollTaskResult(res.taskId)
              if (url) {
                result = url
              } else {
                throw new Error(res?.error || 'Video generation failed or timed out')
              }
            } else {
              throw new Error(res?.error || 'No video URL returned')
            }
          } else if (nodeType === 'enhance') {
            node.data.progress = 30
            const res: any = await aiService.promptEnhance(applyApiConfig('chat', {
              messages: [
                { role: 'system', content: 'You are a professional prompt engineer. Polish and expand the following prompt to make it more detailed and effective for AI image/video generation. Keep the core meaning but add visual details, style cues, and technical parameters. Reply in the same language as the input. Only return the polished prompt, no explanation.' },
                { role: 'user', content: inputText }
              ]
            }))
            node.data.progress = 80
            if (res?.content) {
              result = res.content
            } else {
              throw new Error('Prompt enhancement failed')
            }
          } else if (nodeType === 'merge') {
            result = predecessors.map(p => outputs[p]).filter(Boolean).join('\n---\n') || inputText
          } else if (nodeType === 'output') {
            result = inputText
          }

          outputs[nodeId] = result
          node.data.output = result
          node.data.progress = 100
          node.data.status = 'success'
        } catch (err: any) {
          node.data.error = err?.message || 'Node execution failed'
          node.data.status = 'failed'
          node.data.progress = 0
        }
      }
    } finally {
      running.value = false
    }
  }

  return {
    nodes,
    edges,
    selectedNodeId,
    running,
    addNode,
    removeNode,
    updateNodeData,
    addEdge,
    addRoute,
    selectNode,
    clear,
    runWorkflow
  }
})
