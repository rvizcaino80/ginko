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
    <div class="flex-1">
      <InputText
        v-model="model.q"
        placeholder="Buscar por proveedor..."
        class="w-full"
      />
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
