<script setup lang="ts">
import { computed } from 'vue'
import type { OrderFilters } from '@/types/order'
import { STATUS_LABELS } from '@/types/order'

const model = defineModel<OrderFilters>({ required: true })
const emit = defineEmits<{ resetPage: [] }>()

const statusOptions = computed(() => {
  const entries = Object.entries(STATUS_LABELS) as [string, string][]
  return [
    { value: 'todos', label: 'Todos' },
    ...entries.map(([value, label]) => ({ value, label })),
  ]
})

function onChange() {
  model.value.page = 1
  emit('resetPage')
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3 mb-6">
    <div class="flex-1">
      <input
        v-model="model.q"
        type="text"
        placeholder="Buscar por proveedor..."
        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        @input="onChange"
      />
    </div>
    <select
      :value="model.status"
      class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      @change="(e) => { model.status = (e.target as HTMLSelectElement).value; onChange() }"
    >
      <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
