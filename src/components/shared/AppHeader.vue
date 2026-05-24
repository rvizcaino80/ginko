<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useDarkMode } from '@/composables/useDarkMode'
import Button from 'primevue/button'

const router = useRouter()
const { isDark, toggle } = useDarkMode()
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
      <Button
        label="Nueva orden"
        icon="pi pi-plus"
        size="medium"
        class="hidden lg:inline-flex nueva-orden-btn"
        @click="router.push('/orders/new')"
      />
      <Button
        severity="primary"
        variant="outlined"
        :title="isDark ? 'Modo claro' : 'Modo oscuro'"
        @click="toggle"
        class="bg-slate-300"
      >
        <template #icon>
          <Icon :icon="isDark ? 'mdi:white-balance-sunny' : 'mdi:moon-waxing-crescent'" class="w-6 h-6" />
        </template>
      </Button>
    </nav>
  </header>
</template>

<style scoped>
:deep(.nueva-orden-btn .p-button-label)::after {
  content: 'N';
  margin-left: 8px;
  padding: 2px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.75);
  font-size: 0.75rem;
  line-height: 1;
  color: black;
}
</style>
