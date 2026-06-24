<template>
  <div>
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2 text-xs text-cyan-100">
        <WandSparkles class="size-4" />
        {{ t('Prompt 配方', 'Prompt recipe') }}
      </div>
      <button
        v-if="content"
        class="flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-[11px] text-cyan-100 transition hover:bg-cyan-300/18"
        :disabled="polishing"
        @click.stop="handlePolish"
      >
        <span v-if="polishing" class="inline-block size-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        <Sparkles v-else class="size-3" />
        {{ polishing ? t('润色中...', 'Polishing...') : t('润色', 'Polish') }}
      </button>
    </div>
    <textarea
      :value="content"
      class="min-h-32 w-full resize-none rounded-xl border border-white/8 bg-[#0d0f15] p-3 text-sm leading-6 text-white/72 outline-none focus:border-cyan-300/30"
      :placeholder="t('描述场景、产品、氛围、约束或生成路线...', 'Describe the scene, product, mood, constraints, or generation route...')"
      @input="$emit('update', ($event.target as HTMLTextAreaElement).value)"
      @mousedown.stop
      @click.stop
    />
    <div class="mt-3 flex flex-wrap gap-1.5">
      <span v-for="tag in tags" :key="tag" class="rounded-full border border-cyan-100/10 px-2 py-0.5 text-[11px] text-white/45">
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles, WandSparkles } from 'lucide-vue-next'
import { aiService, applyApiConfig, readApiConfig } from '~/services/aiService'
import { useSettingsStore } from '~/stores/settingsStore'

const props = defineProps<{
  content?: string
}>()

const emit = defineEmits<{
  update: [content: string]
}>()

const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)
const polishing = ref(false)
const savedChatConfig = readApiConfig('chat')
const tags = ['9:16', 'cinematic', 'macro', 'soft glass']

async function handlePolish() {
  if (!props.content) return
  polishing.value = true
  const targetLang = settingsStore.isZh ? 'Chinese' : 'English'
  try {
    const res: any = await aiService.promptEnhance(applyApiConfig('chat', {
      model: savedChatConfig.model || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are a professional prompt engineer. Polish and expand the following prompt to make it more detailed and effective for AI image/video generation. Keep the core meaning but add visual details, style cues, and technical parameters. Reply in ${targetLang}. Only return the polished prompt, no explanation.`
        },
        { role: 'user', content: props.content }
      ]
    }))
    if (res && res.content) {
      emit('update', res.content)
    }
  } catch {}
  polishing.value = false
}
</script>
