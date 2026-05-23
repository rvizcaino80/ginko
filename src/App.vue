<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AiAssistant from '@/components/ai/AiAssistant.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useUiState } from '@/composables/useUiState'

const router = useRouter()
const { showAiPanel } = useUiState()

useKeyboardShortcuts({
  n: () => router.push('/orders/new'),
  Escape: () => {
    const active = document.querySelector('.p-dialog-mask')
    if (active) {
      ;(active as HTMLElement).click?.()
    }
  },
})
</script>

<template>
  <div class="min-h-screen flex">
    <div class="flex flex-col flex-1 min-w-0">
      <AppHeader />
      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
    <aside
      class="w-[400px] min-w-[400px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300"
      :class="showAiPanel ? 'xl:flex' : 'hidden'"
    >
      <AiAssistant />
    </aside>
  </div>
</template>
