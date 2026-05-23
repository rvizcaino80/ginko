<script setup lang="ts">
import type { Order } from '@/types/order'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import StatusBadge from '@/components/shared/StatusBadge.vue'

defineProps<{ orders: Order[] }>()
const emit = defineEmits<{ select: [id: string] }>()

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(iso))
}
</script>

<template>
  <div class="fade-in">
    <DataTable
      :value="orders"
      :paginator="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 20]"
      sortable
      striped-rows
      selection-mode="single"
      @row-click="(e: { data: Order }) => emit('select', e.data.id)"
      class="cursor-pointer"
    >
      <Column field="id" header="ID" sortable style="min-width: 8rem" />
      <Column field="proveedor" header="Proveedor" sortable style="min-width: 14rem" />
      <Column field="concepto" header="Concepto" sortable style="min-width: 16rem">
        <template #body="{ data }">
          <span class="truncate block max-w-[200px]">{{ data.concepto }}</span>
        </template>
      </Column>
      <Column field="fechaCreacion" header="Fecha" sortable style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.fechaCreacion) }}
        </template>
      </Column>
      <Column field="monto" header="Monto" sortable header-class="text-right" style="min-width: 10rem">
        <template #body="{ data }">
          <div class="text-right font-mono">{{ formatCOP(data.monto) }}</div>
        </template>
      </Column>
      <Column field="estado" header="Estado" sortable style="min-width: 8rem">
        <template #body="{ data }">
          <StatusBadge :estado="data.estado" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeSlideIn 0.3s ease-out;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
:deep(.text-right .p-datatable-column-header-content) {
  justify-content: end !important;
}
</style>
