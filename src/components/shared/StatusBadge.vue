<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types/order'
import { STATUS_LABELS } from '@/types/order'

const props = defineProps<{ estado: OrderStatus; size?: string }>()

const colorMap: Record<OrderStatus, string> = {
  BORRADOR: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  APROBADA: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  RECHAZADA: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  PAGADA: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
}

const classes = computed(() => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full font-medium'
  return `${base} ${colorMap[props.estado]} ${props.size ?? 'text-sm'}`
})

const label = computed(() => STATUS_LABELS[props.estado])
</script>

<template>
  <span :class="classes">{{ label }}</span>
</template>
