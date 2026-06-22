<template>
  <aside class="flex w-[340px] flex-col border-l border-cyan-100/10 bg-[#050811]/95 backdrop-blur-xl">
    <div class="flex items-center gap-2 border-b border-white/10 px-4 py-3">
      <Compass class="size-4 text-studio-cyan" />
      <span class="text-sm font-semibold text-white">Polaris Copilot</span>
    </div>

    <div class="flex-1 space-y-3 overflow-y-auto p-3">
      <div v-for="msg in messages" :key="msg.id" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div
          class="max-w-[85%] rounded-xl px-3 py-2 text-sm"
          :class="msg.role === 'user'
            ? 'bg-cyan-100 text-[#061018]'
            : 'border border-white/10 bg-white/6 text-white/72'"
        >
          {{ msg.content }}
        </div>
      </div>
    </div>

    <div class="border-t border-white/10 p-3">
      <div class="mb-3 flex gap-2">
        <FloatingButton v-for="action in quickActions" :key="action.label" class="text-xs" @click="handleQuickAction(action)">
          <component :is="action.icon" class="size-3.5" />
          {{ action.label }}
        </FloatingButton>
      </div>

      <SkillChips @select="handleSkillSelect" />

      <div class="mt-3">
        <ModelSelector />
      </div>

      <div class="mt-3 flex items-end gap-2 rounded-2xl border border-white/10 bg-black/35 p-2">
        <textarea
          v-model="input"
          class="max-h-24 min-h-[36px] flex-1 resize-none bg-transparent text-sm text-white/80 outline-none placeholder:text-white/25"
          placeholder="Type a message..."
          rows="1"
          @keydown.enter.prevent="sendMessage"
        />
        <button class="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[#061018] transition hover:bg-cyan-50" @click="sendMessage">
          <Send class="size-3.5" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Compass, Video, Image, LayoutTemplate, Send } from 'lucide-vue-next'
import FloatingButton from '~/components/ui/FloatingButton.vue'
import SkillChips from '~/components/agent/SkillChips.vue'
import ModelSelector from '~/components/ui/ModelSelector.vue'
import { uid } from '~/utils'
import type { Message } from '~/types'

const input = ref('')
const messages = ref<Message[]>([
  { id: uid('msg'), role: 'assistant', content: 'Hello! How can I help you create today?', timestamp: Date.now() }
])

const quickActions = [
  { label: 'Video', icon: Video },
  { label: 'Image', icon: Image },
  { label: 'Storyboard', icon: LayoutTemplate }
]

function handleQuickAction(action: typeof quickActions[0]) {
  messages.value.push({ id: uid('msg'), role: 'user', content: `Create a ${action.label.toLowerCase()}`, timestamp: Date.now() })
}

function handleSkillSelect(skill: string) {
  messages.value.push({ id: uid('msg'), role: 'user', content: `Use skill: ${skill}`, timestamp: Date.now() })
}

function sendMessage() {
  if (!input.value.trim()) return
  messages.value.push({ id: uid('msg'), role: 'user', content: input.value, timestamp: Date.now() })
  input.value = ''
}
</script>
