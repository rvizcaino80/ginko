<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useOrderStore } from '@/stores/orderStore'
import { STATUS_TRANSITIONS, STATUS_LABELS, STATUS_SEVERITIES } from '@/types/order'
import type { OrderStatus } from '@/types/order'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const store = useOrderStore()

const confirmOpen = ref(false)
const pendingTransition = ref<OrderStatus | null>(null)
const transitionError = ref('')
const transitioning = ref(false)

onMounted(() => {
  store.loadOrder(route.params.id as string)
})

function allowedTransitions() {
  if (!store.currentOrder) return []
  return STATUS_TRANSITIONS[store.currentOrder.estado] ?? []
}

function requestTransition(estado: OrderStatus) {
  pendingTransition.value = estado
  confirmOpen.value = true
}

async function confirmTransition() {
  if (!pendingTransition.value || !store.currentOrder) return
  transitionError.value = ''
  transitioning.value = true
  try {
    await store.transition(store.currentOrder.id, pendingTransition.value)
    confirmOpen.value = false
    pendingTransition.value = null
  } catch (e: unknown) {
    transitionError.value = e instanceof Error ? e.message : 'Error al cambiar el estado'
  } finally {
    transitioning.value = false
  }
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long', timeStyle: 'short',
  }).format(new Date(iso))
}
</script>

<template>
  <div class="max-w-xl mx-auto">
    <Button
      label="Volver al listado"
      icon="pi pi-arrow-left"
      severity="secondary"
      variant="text"
      size="small"
      class="mb-4"
      @click="router.push('/')"
    />

    <LoadingState v-if="store.detailApi.loading" />

    <ErrorState v-else-if="store.detailApi.error" :message="store.detailApi.error" />

    <div v-else-if="store.currentOrder" class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ store.currentOrder.id }}</h1>
        <StatusBadge size="text-2xl" :estado="store.currentOrder.estado" />
      </div>

      <div class="flex flex-col divide-y divide-slate-200 dark:divide-slate-800">
        <div class="flex justify-between py-4">
          <span class="text-slate-500 dark:text-slate-400">Proveedor</span>
          <span class="font-medium text-right">{{ store.currentOrder.proveedor }}</span>
        </div>
        <div class="flex justify-between py-4">
          <span class="text-slate-500 dark:text-slate-400">Monto</span>
          <span class="font-mono font-medium">{{ formatCOP(store.currentOrder.monto) }}</span>
        </div>
        <div class="flex justify-between py-4">
          <span class="text-slate-500 dark:text-slate-400">Concepto</span>
          <span class="text-right max-w-[60%]">{{ store.currentOrder.concepto }}</span>
        </div>
        <div class="flex justify-between py-4">
          <span class="text-slate-500 dark:text-slate-400">Fecha de creación</span>
          <span class="text-right">{{ formatDate(store.currentOrder.fechaCreacion) }}</span>
        </div>
      </div>

      <div v-if="allowedTransitions().length > 0" class="pt-4 dark:border-slate-800">
        <div class="flex items-center gap-2 mb-3">
          <Icon :icon="'mi:switch'"></Icon>
          <p class="font-medium">Cambiar estado</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="next in allowedTransitions()"
            :key="next"
            class="cursor-pointer transition-opacity hover:opacity-80"
            @click="requestTransition(next)"
          >
            <Tag :value="STATUS_LABELS[next]" :severity="STATUS_SEVERITIES[next]" />
          </button>
        </div>
        <small v-if="transitionError" class="text-red-500 mt-2 block">{{ transitionError }}</small>
      </div>
    </div>

    <ConfirmDialog
      v-if="confirmOpen"
      :open="confirmOpen"
      title="Confirmar cambio de estado"
      :message="`¿Estás seguro de cambiar esta orden a «${pendingTransition ? STATUS_LABELS[pendingTransition] : ''}»?`"
      confirm-text="Cambiar"
      :loading="transitioning"
      @confirm="confirmTransition"
      @cancel="confirmOpen = false; pendingTransition = null"
    />
  </div>
</template>
