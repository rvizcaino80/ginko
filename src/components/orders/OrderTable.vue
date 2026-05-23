<script setup lang="ts">
import type { Order } from '@/types/order'
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
  <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-100 dark:bg-gray-900 text-left">
          <th class="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">ID</th>
          <th class="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Proveedor</th>
          <th class="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Monto</th>
          <th class="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Concepto</th>
          <th class="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Fecha</th>
          <th class="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
          class="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer"
          @click="emit('select', order.id)"
        >
          <td class="px-4 py-3 font-mono text-xs">{{ order.id }}</td>
          <td class="px-4 py-3">{{ order.proveedor }}</td>
          <td class="px-4 py-3 font-mono">{{ formatCOP(order.monto) }}</td>
          <td class="px-4 py-3 max-w-xs truncate">{{ order.concepto }}</td>
          <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ formatDate(order.fechaCreacion) }}</td>
          <td class="px-4 py-3"><StatusBadge :estado="order.estado" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
