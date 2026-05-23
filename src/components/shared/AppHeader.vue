<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDarkMode } from '@/composables/useDarkMode'

const router = useRouter()
const { isDark, toggle } = useDarkMode()
</script>

<template>
  <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4 max-w-6xl flex items-center justify-between h-14">
      <button
        class="text-lg font-semibold tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        @click="router.push('/')"
      >
        Ginko · Pagos
      </button>
      <nav class="flex items-center gap-3">
        <button
          @click="router.push('/orders/new')"
          class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          + Nueva orden
        </button>
        <button
          @click="toggle"
          class="text-sm px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          :title="isDark ? 'Modo claro' : 'Modo oscuro'"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </nav>
    </div>
  </header>
</template>
