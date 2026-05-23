<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types/order'
import { STATUS_COLORS, STATUS_LABELS } from '@/types/order'

const props = defineProps<{ estado: OrderStatus }>()
const classes = computed(() => STATUS_COLORS[props.estado])
const label = computed(() => STATUS_LABELS[props.estado])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="classes"
  >
    <span class="w-1.5 h-1.5 rounded-full bg-current" />
    {{ label }}
  </span>
</template>
