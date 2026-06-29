<template>
  <aside class="flex h-full w-full flex-col bg-[#050811]/95 backdrop-blur-xl">
    <div class="border-b border-cyan-100/10 p-4">
      <div class="flex items-center gap-3">
        <div class="grid size-9 place-items-center rounded-full border border-cyan-100/25 bg-cyan-100/10">
          <Compass class="size-5 text-cyan-100" />
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white">Polaris Copilot</h2>
          <p class="text-xs text-white/38">{{ t('路线生成控制台', 'Route generation console') }}</p>
        </div>
      </div>
    </div>

    <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
      <div v-for="msg in messages" :key="msg.id" :class="msg.role === 'user' ? 'ml-8' : ''">
        <div
          class="whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-6"
          :class="msg.role === 'user'
            ? 'bg-cyan-100 text-[#061018]'
            : 'border border-cyan-100/10 bg-white/6 text-white/72'"
        >
          {{ msg.content }}
        </div>

        <div v-if="msg.suggestions" class="mt-2 flex flex-wrap gap-2">
          <FloatingButton :title="t('投放到画布', 'Drop to canvas')" @click="dropSuggestionToCanvas(msg.content)">
            <WandSparkles class="size-4" />
            {{ t('投放到画布', 'Drop to canvas') }}
          </FloatingButton>
          <FloatingButton :title="t('生成 Workflow', 'Build workflow')" @click="buildWorkflowFromMessage(msg.content)">
            <Workflow class="size-4" />
            {{ t('生成 Workflow', 'Build workflow') }}
          </FloatingButton>
        </div>
      </div>
    </div>

    <div class="border-t border-cyan-100/10 p-4">
      <SkillChips @select="handleSkillSelect" />

      <div class="mt-4 grid grid-cols-3 gap-2 text-xs">
        <button
          v-for="action in quickActions"
          :key="action.key"
          class="rounded-lg border border-cyan-100/10 bg-white/6 p-2 text-white/64 transition hover:border-cyan-200/30 hover:text-cyan-100"
          @click="handleQuickAction(action.key)"
        >
          <component :is="action.icon" class="mx-auto mb-1 size-4" />
          {{ action.label }}
        </button>
      </div>

      <div class="mt-4 rounded-2xl border border-cyan-100/12 bg-black/35 p-2">
        <textarea
          v-model="input"
          class="h-20 w-full resize-none bg-transparent p-2 text-sm text-white outline-none placeholder:text-white/30"
          :placeholder="t('描述你的目标，或输入 @ 引用素材', 'Describe your goal, or type @ to reference assets')"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <div class="flex items-center gap-2">
          <Sparkles class="ml-2 size-4 text-cyan-100" />
          <div class="min-w-0 flex-1">
            <ModelSelector v-model="selectedModel" />
          </div>
          <button class="grid size-9 place-items-center rounded-full bg-cyan-100 text-[#061018] transition hover:bg-white" :disabled="loading" @click="sendMessage">
            <span v-if="loading" class="inline-block size-4 animate-spin rounded-full border-2 border-[#061018] border-t-transparent" />
            <Send v-else class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Boxes, Clapperboard, Compass, ImageIcon, Send, Sparkles, WandSparkles, Workflow } from 'lucide-vue-next'
import FloatingButton from '~/components/ui/FloatingButton.vue'
import ModelSelector from '~/components/ui/ModelSelector.vue'
import SkillChips from '~/components/agent/SkillChips.vue'
import { useCanvasStore } from '~/stores/canvasStore'
import { useWorkflowStore } from '~/stores/workflowStore'
import { useWorkspaceStore } from '~/stores/workspaceStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { aiService, applyApiConfig } from '~/services/aiService'
import { uid } from '~/utils'

interface AgentMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  suggestions?: boolean
}

type QuickActionKey = 'video' | 'image' | 'storyboard'

const canvasStore = useCanvasStore()
const workflowStore = useWorkflowStore()
const workspaceStore = useWorkspaceStore()
const settingsStore = useSettingsStore()
const input = ref('')
const t = (zh: string, en: string) => settingsStore.t(zh, en)

const selectedModel = ref('deepseek-v4-flash')
const loading = ref(false)

const messages = ref<AgentMessage[]>([
  {
    id: uid('msg'),
    role: 'assistant',
    content: t('告诉我你的北极星目标，我可以把它拆成 Prompt、图像、视频和分镜路线并连接到画布。', 'Tell me your north-star goal. I can create linked prompt, image, video, and storyboard routes on the canvas.'),
    timestamp: Date.now()
  }
])

const quickActions = computed(() => [
  { key: 'video' as const, label: t('视频', 'Video'), icon: Clapperboard },
  { key: 'image' as const, label: t('图像', 'Image'), icon: ImageIcon },
  { key: 'storyboard' as const, label: t('分镜', 'Storyboard'), icon: Boxes }
])

function addUserMessage(content: string) {
  messages.value.push({ id: uid('msg'), role: 'user', content, timestamp: Date.now() })
}

function addAssistantMessage(content: string, suggestions = false) {
  messages.value.push({ id: uid('msg'), role: 'assistant', content, timestamp: Date.now(), suggestions })
}

function handleQuickAction(action: QuickActionKey) {
  if (action === 'video') {
    addUserMessage(t('创建视频节点', 'Create a video waypoint'))
    createVideoWaypoint()
    addAssistantMessage(t('已添加视频节点。把它连接到图像或 Prompt 卡片，就能形成生成路线。', 'Video waypoint added. Connect it to an image or prompt card to form a generation route.'), true)
    return
  }
  if (action === 'image') {
    addUserMessage(t('创建图像节点', 'Create an image waypoint'))
    createImageWaypoint()
    addAssistantMessage(t('已添加图像节点。它可以接收 Prompt，并继续输入到视频生成。', 'Image waypoint added. It can receive a prompt and feed into video generation.'), true)
    return
  }
  addUserMessage(t('创建分镜路线', 'Create a storyboard route'))
  createStoryboardRoute()
  addAssistantMessage(t('已添加分镜路线，并创建可见连接；Workflow 节点也已准备好。', 'Storyboard route added with visible links. The workflow nodes are prepared as well.'), true)
}

function handleSkillSelect(skill: string) {
  input.value = skill
  const lower = skill.toLowerCase()
  if (lower.includes('storyboard')) handleQuickAction('storyboard')
  else if (lower.includes('video')) handleQuickAction('video')
  else if (lower.includes('image')) handleQuickAction('image')
}

async function sendMessage() {
  const text = input.value.trim()
  if (!text || loading.value) return
  addUserMessage(text)
  input.value = ''
  loading.value = true
  try {
    const res: any = await aiService.chat(applyApiConfig('chat', {
      model: selectedModel.value,
      messages: [{ role: 'user', content: text }]
    }))
    addAssistantMessage(res?.content || t('无回复', 'No response'), true)
  } catch (err: any) {
    addAssistantMessage(err?.message || err?.error || t('请求失败', 'Request failed'), false)
  }
  loading.value = false
}

function createImageWaypoint(content = t('描述图像生成或编辑要求。', 'Describe image generation or editing instructions.')) {
  canvasStore.addObject({
    type: 'image',
    x: 260 + canvasStore.objects.length * 28,
    y: 180 + canvasStore.objects.length * 18,
    width: 600,
    height: 430,
    title: t('图像节点', 'Image waypoint'),
    content
  })
}

function createVideoWaypoint(content = t('描述场景、镜头运动、时长和参考素材。', 'Describe scene, camera motion, duration and references.')) {
  canvasStore.addObject({
    type: 'video',
    x: 320 + canvasStore.objects.length * 28,
    y: 220 + canvasStore.objects.length * 18,
    width: 600,
    height: 430,
    title: t('视频节点', 'Video waypoint'),
    content
  })
}

function createStoryboardRoute() {
  const baseX = 180 + canvasStore.objects.length * 18
  const baseY = 180
  const goal = canvasStore.addObject({
    type: 'prompt',
    x: baseX,
    y: baseY,
    width: 360,
    height: 220,
    title: t('故事目标', 'Story Goal'),
    content: t('定义角色、冲突、转场和镜头节奏。', 'Define character, conflict, transition and shot rhythm.')
  })
  const board = canvasStore.addObject({
    type: 'moodboard',
    x: baseX + 430,
    y: baseY + 70,
    width: 420,
    height: 280,
    title: t('分镜', 'Storyboard'),
    content: t('镜头 01-06：建立、动作、产品细节、转场、高潮、最终输出。', 'Shots 01-06: establish, action, product detail, transition, climax, final output.')
  })
  const video = canvasStore.addObject({
    type: 'video',
    x: baseX + 920,
    y: baseY + 120,
    width: 420,
    height: 300,
    title: t('分镜视频', 'Storyboard video'),
    content: t('把选定镜头生成竖屏短视频。', 'Animate selected shots into a vertical short video.')
  })
  canvasStore.addLink(goal.id, board.id, 'storyboard')
  canvasStore.addLink(board.id, video.id, 'video')

  const prompt = workflowStore.addNode('prompt', 180, 160)
  const image = workflowStore.addNode('image-gen', 460, 220)
  const videoNode = workflowStore.addNode('video-gen', 740, 280)
  workflowStore.addEdge(prompt.id, image.id)
  workflowStore.addEdge(image.id, videoNode.id)
}

function dropSuggestionToCanvas(content: string) {
  canvasStore.addObject({
    type: 'prompt',
    x: 220 + canvasStore.objects.length * 24,
    y: 160 + canvasStore.objects.length * 18,
    width: 420,
    height: 260,
    title: t('Copilot 建议', 'Copilot suggestion'),
    content
  })
}

function buildWorkflowFromMessage(content: string) {
  const suggestion = canvasStore.addObject({
    type: 'prompt',
    x: 180,
    y: 160,
    width: 420,
    height: 260,
    title: t('Copilot 建议', 'Copilot suggestion'),
    content
  })
  const image = canvasStore.addObject({
    type: 'image',
    x: 650,
    y: 220,
    width: 420,
    height: 280,
    title: t('首帧', 'First frame'),
    content: t('根据计划生成第一张视觉画面。', 'Generate the first visual frame from the plan.')
  })
  const video = canvasStore.addObject({
    type: 'video',
    x: 1120,
    y: 280,
    width: 420,
    height: 300,
    title: t('视频渲染', 'Video render'),
    content: t('把首帧转成动态视频。', 'Turn the first frame into motion.')
  })
  canvasStore.addLink(suggestion.id, image.id, 'image')
  canvasStore.addLink(image.id, video.id, 'video')

  const prompt = workflowStore.addNode('prompt', 180, 160)
  const wfImage = workflowStore.addNode('image-gen', 460, 220)
  const wfVideo = workflowStore.addNode('video-gen', 740, 280)
  const output = workflowStore.addNode('output', 1020, 340)
  workflowStore.addEdge(prompt.id, wfImage.id)
  workflowStore.addEdge(wfImage.id, wfVideo.id)
  workflowStore.addEdge(wfVideo.id, output.id)
  workspaceStore.setMode('workflow')
}

onMounted(() => {
  if (import.meta.client) {
    const raw = localStorage.getItem('polaris.pendingAgentMessages')
    if (raw) {
      try {
        const pending = JSON.parse(raw)
        if (Array.isArray(pending) && pending.length > 0) {
          messages.value = [
            ...pending,
            ...messages.value
          ]
        }
      } catch {}
      localStorage.removeItem('polaris.pendingAgentMessages')
    }
  }
})
</script>
