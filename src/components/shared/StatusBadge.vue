<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types/order'
import { STATUS_LABELS, STATUS_SEVERITIES } from '@/types/order'
import Tag from 'primevue/tag'

const props = defineProps<{ estado: OrderStatus; size?: string }>()
const severity = computed(() => STATUS_SEVERITIES[props.estado])
const label = computed(() => STATUS_LABELS[props.estado])
</script>

<template>
  <Tag :value="label" :severity="severity" :class="size ?? 'text-sm'" />
</template>
