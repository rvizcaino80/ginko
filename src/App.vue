<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AiAssistant from '@/components/ai/AiAssistant.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useAiStatus } from '@/composables/useAiStatus'

const router = useRouter()
const { validated, validateKey } = useAiStatus()

onMounted(() => {
  validateKey()
})

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
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-900">
    <div class="flex flex-col flex-1 min-w-0">
      <AppHeader />
      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
    <template v-if="validated === 'valid'">
      <aside class="hidden xl:flex bg-slate-100 w-100 border-l border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <AiAssistant />
      </aside>
    </template>
  </div>
</template>
