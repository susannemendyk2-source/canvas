<template>
  <div class="flex-1">
    <VueFlow
      :nodes="workflowStore.nodes"
      :edges="workflowStore.edges"
      :node-types="nodeTypes"
      fit-view-on-init
      class="bg-[#03050b]"
      @connect="(e: any) => workflowStore.addEdge(e.source, e.target)"
    >
      <Background :variant="BackgroundVariant.Dots" :gap="24" pattern-color="rgba(255,255,255,0.08)" />
      <Controls position="bottom-right" />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { Background, BackgroundVariant } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { useWorkflowStore } from '~/stores/workflowStore'
import BaseWorkflowNode from './nodes/BaseWorkflowNode.vue'

const workflowStore = useWorkflowStore()

const nodeTypes = {
  'base-workflow': BaseWorkflowNode
}
</script>
