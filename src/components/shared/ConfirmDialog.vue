<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="emit('cancel')"
      >
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
          <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ message }}</p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              @click="emit('cancel')"
            >
              {{ cancelText ?? 'Cancelar' }}
            </button>
            <button
              class="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 cursor-pointer"
              :disabled="loading"
              @click="emit('confirm')"
            >
              {{ confirmText ?? 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
