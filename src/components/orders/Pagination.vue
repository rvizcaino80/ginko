<script setup lang="ts">
defineProps<{ page: number; totalPages: number }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
    <button
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:cursor-default"
      :disabled="page <= 1"
      @click="emit('change', page - 1)"
    >
      Anterior
    </button>
    <span class="text-sm text-gray-500 dark:text-gray-400">
      {{ page }} / {{ totalPages }}
    </span>
    <button
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:cursor-default"
      :disabled="page >= totalPages"
      @click="emit('change', page + 1)"
    >
      Siguiente
    </button>
  </div>
</template>
