<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useUiState } from '@/composables/useUiState'
import Button from 'primevue/button'

const router = useRouter()
const { isDark, toggle } = useDarkMode()
const { showAiPanel, toggleAiPanel } = useUiState()
</script>

<template>
  <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="flex items-center justify-between h-14 px-6">
      <button
        class="flex items-center gap-2 font-semibold tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        @click="router.push('/')"
      >
        <img src="/logo.svg" alt="Ginko" class="h-7 w-7" />
        <span>Ginko · Pagos</span>
      </button>
      <nav class="flex items-center gap-3">
        <Button
          label="Nueva orden"
          size="small"
          @click="router.push('/orders/new')"
        >
          <template #icon>
            <Icon icon="mdi:plus" class="text-sm" />
          </template>
        </Button>
        <Button
          severity="secondary"
          size="small"
          variant="outlined"
          :title="isDark ? 'Modo claro' : 'Modo oscuro'"
          @click="toggle"
        >
          <template #icon>
            <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="text-sm" />
          </template>
        </Button>
        <Button
          severity="secondary"
          size="small"
          variant="outlined"
          class="hidden xl:inline-flex"
          :title="showAiPanel ? 'Ocultar asistente' : 'Mostrar asistente'"
          @click="toggleAiPanel"
        >
          <template #icon>
            <Icon :icon="showAiPanel ? 'mdi:robot' : 'mdi:robot-outline'" class="text-sm" />
          </template>
        </Button>
      </nav>
    </div>
  </header>
</template>
