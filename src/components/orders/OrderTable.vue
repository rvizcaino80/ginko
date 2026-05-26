<script setup lang="ts">
import type { Order } from '@/types/order'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import StatusBadge from '@/components/shared/StatusBadge.vue'

defineProps<{ orders: Order[] }>()
const emit = defineEmits<{ select: [id: string] }>()

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string | undefined | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(d)
}

function isOverdue(iso: string | undefined | null): boolean {
  if (!iso) return false
  const d = new Date(iso)
  if (isNaN(d.getTime())) return false
  return d < new Date(new Date().toDateString())
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
      sort-field="fechaCreacion"
      :sort-order="-1"
      striped-rows
      selection-mode="single"
      @row-click="(e: { data: Order }) => emit('select', e.data.id)"
      class="cursor-pointer text-sm"
    >
      <Column field="id" header="ID" sortable style="min-width: 8rem" />
      <Column field="proveedor" header="Proveedor" sortable style="min-width: 14rem" />
      <Column field="concepto" header="Concepto" sortable style="min-width: 16rem">
        <template #body="{ data }">
          {{ data.concepto }}
        </template>
      </Column>
      <Column field="fechaCreacion" header="Fecha" sortable style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.fechaCreacion) }}
        </template>
      </Column>
      <Column field="fechaVencimiento" header="Fecha Vencimiento" sortable style="min-width: 10rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ formatDate(data.fechaVencimiento) }}</span>
            <Tag v-if="isOverdue(data.fechaVencimiento)" value="Vencida" severity="secondary" class="text-xs" />
          </div>
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
      <Column header="Acciones">
            <template #body>
            <div class="flex items-center gap-2">
              <Button
                label="Editar"
                size="small"
              />
              <Button
                label="Eliminar"
                size="small"
                severity="danger"
              />
            </div>
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
