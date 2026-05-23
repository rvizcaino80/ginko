<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useFilters } from '@/composables/useFilters'
import OrderTable from '@/components/orders/OrderTable.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const router = useRouter()
const store = useOrderStore()
const { filters } = useFilters()

const filteredOrders = computed(() => {
  let result = store.orders
  if (filters.value.status !== 'todos') {
    result = result.filter((o) => o.estado === filters.value.status)
  }
  if (filters.value.q) {
    const term = filters.value.q.toLowerCase()
    result = result.filter((o) => o.proveedor.toLowerCase().includes(term))
  }
  return result
})

async function load() {
  await store.loadOrders({ status: 'todos', q: '' })
}

watch(filters, load)
onMounted(load)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Órdenes de pago</h1>

    <OrderFilters v-model="filters" />

    <LoadingState v-if="store.listApi.loading && store.orders.length === 0" />

    <ErrorState v-else-if="store.listApi.error" :message="store.listApi.error" />

    <EmptyState
      v-else-if="filteredOrders.length === 0"
      message="No se encontraron órdenes con los filtros actuales."
    />

    <div v-else>
      <OrderTable
        class="hidden md:block"
        :orders="filteredOrders"
        @select="(id) => router.push(`/orders/${id}`)"
      />
      <OrderCard
        class="md:hidden"
        :orders="filteredOrders"
        @select="(id) => router.push(`/orders/${id}`)"
      />
    </div>
  </div>
</template>
