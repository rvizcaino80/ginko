<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types/order'
import { STATUS_LABELS, STATUS_SEVERITIES } from '@/types/order'
import Tag from 'primevue/tag'

const props = defineProps<{ estado: OrderStatus; size?: string }>()

const severity = computed(() => STATUS_SEVERITIES[props.estado])
const label = computed(() => STATUS_LABELS[props.estado])

const sizeMap: Record<string, string> = {
  'text-xs': '0.75rem', 'text-sm': '0.875rem', 'text-base': '1rem',
  'text-lg': '1.125rem', 'text-xl': '1.25rem', 'text-2xl': '1.5rem',
}

const fontSize = computed(() => sizeMap[props.size ?? 'text-sm'] ?? '0.875rem')
</script>

<template>
  <Tag :value="label" :severity="severity" />
</template>

<style scoped>
:deep(.p-tag-value) {
  font-size: v-bind(fontSize) !important;
}
</style>
