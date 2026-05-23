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
  <header class="flex items-center justify-between h-18 border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
    <button
      class="flex items-center gap-2 font-semibold tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
      @click="router.push('/')"
    >
      <img src="/logo.svg" alt="Ginko" class="h-10 w-auto" />
    </button>

    <h1 class="text-2xl font-bold">Órdenes de pago</h1>

    <nav class="flex items-center justify-stretch gap-4">
      <Button
        label="Nueva orden"
        icon="pi pi-plus"
        size="medium"
        @click="router.push('/orders/new')"
      />
      <Button
        severity="secondary"
        variant="outlined"
        :title="isDark ? 'Modo claro' : 'Modo oscuro'"
        @click="toggle"
      >
        <template #icon>
          <Icon :icon="isDark ? 'mdi:white-balance-sunny' : 'mdi:moon-waxing-crescent'" class="w-6 h-6" />
        </template>
      </Button>
      <Button
        severity="secondary"
        variant="outlined"
        class="hidden xl:flex p-2"
        :style="{
          transform: showAiPanel ? 'translateX(80px)' : 'translateX(0)',
          opacity: showAiPanel ? 0 : 1,
          pointerEvents: showAiPanel ? 'none' : 'auto',
          transition: 'all 1000ms ease-in-out',
        }"
        :title="showAiPanel ? 'Ocultar asistente' : 'Mostrar asistente'"
        @click="toggleAiPanel"
      >
        <template #icon>
          <Icon icon="mdi:sparkles" class="w-6 h-6" />
        </template>
      </Button>
    </nav>
  </header>
</template>
