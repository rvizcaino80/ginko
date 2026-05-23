<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useFilters } from '@/composables/useFilters'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import OrderTable from '@/components/orders/OrderTable.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const router = useRouter()
const store = useOrderStore()
const { filters } = useFilters()

async function load() {
  await store.loadOrders(filters.value)
}

watch(filters, load)
onMounted(load)

useKeyboardShortcuts({
  '/': () => {
    const input = document.querySelector<HTMLInputElement>('input[type="text"]')
    input?.focus()
  },
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Órdenes de pago</h1>
      <span class="text-sm text-gray-400 dark:text-gray-500 hidden sm:inline">
        <kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs">N</kbd>
        {' '}nueva ·{' '}
        <kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs">/</kbd>
        {' '}buscar
      </span>
    </div>

    <OrderFilters v-model="filters" />

    <LoadingState v-if="store.listApi.loading && store.orders.length === 0" />

    <ErrorState v-else-if="store.listApi.error" :message="store.listApi.error" />

    <EmptyState
      v-else-if="store.orders.length === 0"
      message="No se encontraron órdenes con los filtros actuales."
    />

    <template v-else>
      <OrderTable
        class="hidden lg:block"
        :orders="store.orders"
        @select="(id) => router.push(`/orders/${id}`)"
      />
      <OrderCard
        class="lg:hidden"
        :orders="store.orders"
        @select="(id) => router.push(`/orders/${id}`)"
      />
    </template>
  </div>
</template>
