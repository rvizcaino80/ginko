<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useDarkMode } from '@/composables/useDarkMode'
import Button from 'primevue/button'
import NewOrderButton from '@/components/shared/NewOrderButton.vue'
import { useOrderStore } from '@/stores/orderStore'

const router = useRouter()
const store = useOrderStore()
const showAiAssistant = inject('show-ai-assistant') as Ref<boolean>
const { isDark, toggle } = useDarkMode()

function openCreateModal() {
  store.showCreateModal = true
}
function toggleAi() {
  showAiAssistant.value = !showAiAssistant.value
}
</script>

<template>
  <header class="flex items-center justify-between h-18 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6">
    <button
      class="flex items-center gap-2 font-semibold tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
      @click="router.push('/')"
    >
      <img src="/logo.svg" alt="Ginko" class="h-10 w-auto" />
    </button>

    <h1 class="hidden lg:block text-2xl font-bold">Órdenes de pago</h1>

    <nav class="flex items-center justify-stretch gap-4">
      <div class="hidden lg:block">
        <NewOrderButton size="medium" @create-order-modal="openCreateModal" />
      </div>
      <Button
        severity="primary"
        variant="outlined"
        :title="showAiAssistant ? 'Ocultar asistente' : 'Mostrar asistente'"
        @click="toggleAi"
      >
        <template #icon>
          <Icon :icon="showAiAssistant ? 'mdi:robot-off' : 'mdi:robot'" class="w-6 h-6" />
        </template>
      </Button>
      <Button
        severity="primary"
        variant="outlined"
        :title="isDark ? 'Modo claro' : 'Modo oscuro'"
        @click="toggle"
      >
        <template #icon>
          <Icon :icon="isDark ? 'mdi:white-balance-sunny' : 'mdi:moon-waxing-crescent'" class="w-6 h-6" />
        </template>
      </Button>
    </nav>
  </header>
</template>
