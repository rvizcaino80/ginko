<script setup lang="ts">
import { computed } from 'vue'
import type { OrderFilters } from '@/types/order'
import { STATUS_LABELS } from '@/types/order'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

const model = defineModel<OrderFilters>({ required: true })

const statusOptions = computed(() => {
  const entries = Object.entries(STATUS_LABELS) as [string, string][]
  return [
    { value: 'todos', label: 'Todos' },
    ...entries.map(([value, label]) => ({ value, label })),
  ]
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 mb-6">
    <div class="relative flex-1">
      <InputText
        v-model="model.q"
        placeholder="Buscar por proveedor..."
        class="w-full pr-10"
      />
      <kbd
        class="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-xs text-slate-400 dark:text-slate-500 pointer-events-none"
      >/</kbd>
    </div>
    <Select
      :model-value="model.status"
      :options="statusOptions"
      option-value="value"
      option-label="label"
      class="w-full sm:w-48"
      @update:model-value="(v: string) => model.status = v"
    />
  </div>
</template>
