<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AiAssistant from '@/components/ai/AiAssistant.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

const router = useRouter()

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
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <div class="flex flex-1 xl:mr-[400px]">
      <main class="flex-1 min-w-0 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
  <aside class="hidden xl:flex fixed top-0 right-0 h-screen w-[400px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-30">
    <AiAssistant />
  </aside>
</template>
