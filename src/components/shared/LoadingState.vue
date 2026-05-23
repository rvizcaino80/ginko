<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
    <svg class="animate-spin h-8 w-8 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <p class="text-sm">{{ message ?? 'Cargando...' }}</p>
  </div>
</template>
