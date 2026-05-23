<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-red-500 dark:text-red-400">
    <svg class="h-8 w-8 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
    <p class="text-sm">{{ message ?? 'Ocurrió un error al cargar los datos.' }}</p>
  </div>
</template>
