<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { STATUS_TRANSITIONS, STATUS_LABELS } from '@/types/order'
import type { OrderStatus } from '@/types/order'
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
  try {
    await store.transition(store.currentOrder.id, pendingTransition.value)
    confirmOpen.value = false
    pendingTransition.value = null
  } catch (e: unknown) {
    transitionError.value = e instanceof Error ? e.message : 'Error al cambiar el estado'
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
  <div class="max-w-lg mx-auto">
    <button
      class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 cursor-pointer"
      @click="router.push('/')"
    >
      &larr; Volver al listado
    </button>

    <LoadingState v-if="store.detailApi.loading" />

    <ErrorState v-else-if="store.detailApi.error" :message="store.detailApi.error" />

    <div v-else-if="store.currentOrder" class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ store.currentOrder.id }}</h1>
        <StatusBadge :estado="store.currentOrder.estado" />
      </div>

      <div class="space-y-3 text-sm">
        <div
          class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800"
        >
          <span class="text-gray-500 dark:text-gray-400">Proveedor</span>
          <span class="font-medium text-right">{{ store.currentOrder.proveedor }}</span>
        </div>
        <div
          class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800"
        >
          <span class="text-gray-500 dark:text-gray-400">Monto</span>
          <span class="font-mono font-medium">{{
            formatCOP(store.currentOrder.monto)
          }}</span>
        </div>
        <div
          class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800"
        >
          <span class="text-gray-500 dark:text-gray-400">Concepto</span>
          <span class="text-right max-w-[60%]">{{ store.currentOrder.concepto }}</span>
        </div>
        <div
          class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800"
        >
          <span class="text-gray-500 dark:text-gray-400">Fecha de creación</span>
          <span class="text-right">{{ formatDate(store.currentOrder.fechaCreacion) }}</span>
        </div>
        <div class="flex justify-between py-2">
          <span class="text-gray-500 dark:text-gray-400">Estado</span>
          <StatusBadge :estado="store.currentOrder.estado" />
        </div>
      </div>

      <div
        v-if="allowedTransitions().length > 0"
        class="pt-4 border-t border-gray-200 dark:border-gray-800"
      >
        <p class="text-sm font-medium mb-3">Cambiar estado</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="next in allowedTransitions()"
            :key="next"
            class="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            @click="requestTransition(next)"
          >
            {{ STATUS_LABELS[next] }}
          </button>
        </div>
        <p v-if="transitionError" class="text-sm text-red-500 mt-2">
          {{ transitionError }}
        </p>
      </div>
    </div>

    <ConfirmDialog
      :open="confirmOpen"
      title="Confirmar cambio de estado"
      :message="`¿Estás seguro de cambiar esta orden a «${pendingTransition ? STATUS_LABELS[pendingTransition] : ''}»?`"
      confirm-text="Cambiar"
      @confirm="confirmTransition"
      @cancel="confirmOpen = false; pendingTransition = null"
    />
  </div>
</template>
