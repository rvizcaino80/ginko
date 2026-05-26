<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AiAssistant from '@/components/ai/AiAssistant.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useAiStatus } from '@/composables/useAiStatus'
import { useOrderStore } from '@/stores/orderStore'

const { validated, validateKey } = useAiStatus()
const store = useOrderStore()
const showAiAssistant = ref(false)
provide('show-ai-assistant', showAiAssistant)

onMounted(() => {
  validateKey()
})

useKeyboardShortcuts({
  n: () => { store.showCreateModal = true },
  Escape: () => {
    const active = document.querySelector('.p-dialog-mask')
    if (active) {
      ;(active as HTMLElement).click?.()
    }
  },
})
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-900">
    <div class="flex flex-col flex-1 min-w-0">
      <AppHeader />
      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
    <template v-if="showAiAssistant && validated === 'valid'">
      <aside class="hidden xl:flex bg-slate-100 w-100 border-l border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <AiAssistant />
      </aside>
    </template>
  </div>
</template>
