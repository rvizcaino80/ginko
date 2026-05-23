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
  <div class="min-h-screen flex">
    <div class="flex flex-col flex-1 min-w-0">
      <AppHeader />
      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
    <aside class="hidden xl:flex bg-gray-100 w-100 border-l border-gray-200 dark:border-gray-800 dark:bg-gray-900">
      <AiAssistant />
    </aside>
  </div>
</template>
