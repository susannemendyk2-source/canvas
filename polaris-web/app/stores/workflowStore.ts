import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NodeType, StatusType } from '~/types'
import { uid } from '~/utils'

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
  }
}

interface WFEdge {
  id: string
  source: string
  target: string
}

export const useWorkflowStore = defineStore('workflow', () => {
  const nodes = ref<WFNode[]>([])
  const edges = ref<WFEdge[]>([])

  function addNode(type: NodeType, x: number, y: number) {
    const node: WFNode = {
      id: uid('wf'),
      type: 'base-workflow',
      position: { x, y },
      data: {
        label: type,
        nodeType: type,
        status: 'idle',
        progress: 0,
        icon: type
      }
    }
    nodes.value.push(node)
    return node
  }

  function removeNode(id: string) {
    nodes.value = nodes.value.filter(n => n.id !== id)
    edges.value = edges.value.filter(e => e.source !== id && e.target !== id)
  }

  function updateNodeData(id: string, data: Partial<WFNode['data']>) {
    const node = nodes.value.find(n => n.id === id)
    if (node) Object.assign(node.data, data)
  }

  function addEdge(source: string, target: string) {
    const edge: WFEdge = { id: uid('edge'), source, target }
    edges.value.push(edge)
  }

  return { nodes, edges, addNode, removeNode, updateNodeData, addEdge }
})
