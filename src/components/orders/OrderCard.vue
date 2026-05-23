<script setup lang="ts">
import type { Order } from '@/types/order'
import Card from 'primevue/card'
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
  <TransitionGroup name="card" tag="div" class="flex flex-col gap-4">
    <Card
      v-for="order in orders"
      :key="order.id"
      class="cursor-pointer hover:shadow-md transition-shadow"
      @click="emit('select', order.id)"
    >
      <template #content>
        <div class="flex items-center justify-between mb-2">
          <span class="font-mono text-sm text-slate-500 dark:text-slate-400">{{ order.id }}</span>
          <StatusBadge :estado="order.estado" />
        </div>
        <p class="font-medium mb-1">{{ order.proveedor }}</p>
        <p class="font-mono mb-1">{{ formatCOP(order.monto) }}</p>
        <p class="text-slate-500 dark:text-slate-400 truncate text-base">{{ order.concepto }}</p>
        <p class="text-slate-400 dark:text-slate-500 mt-2 text-base">{{ formatDate(order.fechaCreacion) }}</p>
      </template>
    </Card>
  </TransitionGroup>
</template>

<style scoped>
.card-enter-active {
  animation: cardIn 0.3s ease-out;
}
.card-leave-active {
  animation: cardIn 0.2s ease-in reverse;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
