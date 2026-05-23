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
  <div class="flex flex-col gap-3">
    <div
      v-for="order in orders"
      :key="order.id"
      class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 cursor-pointer hover:shadow-md transition-shadow"
      @click="emit('select', order.id)"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{{ order.id }}</span>
        <StatusBadge :estado="order.estado" />
      </div>
      <p class="font-medium text-sm mb-1">{{ order.proveedor }}</p>
      <p class="font-mono text-sm mb-1">{{ formatCOP(order.monto) }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ order.concepto }}</p>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(order.fechaCreacion) }}</p>
    </div>
  </div>
</template>
