<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useFilters } from '@/composables/useFilters'
import OrderTable from '@/components/orders/OrderTable.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import Pagination from '@/components/orders/Pagination.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const router = useRouter()
const store = useOrderStore()
const { filters } = useFilters()

async function load() {
  await store.loadOrders(filters.value)
}

watch(filters, load, { deep: true })
onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">Órdenes de pago</h1>
    </div>

    <OrderFilters v-model="filters" @reset-page="() => {}" />

    <LoadingState v-if="store.listApi.loading && store.orders.length === 0" />

    <ErrorState v-else-if="store.listApi.error" :message="store.listApi.error" />

    <EmptyState
      v-else-if="store.orders.length === 0"
      message="No se encontraron órdenes con los filtros actuales."
    />

    <template v-else>
      <OrderTable
        class="hidden md:block"
        :orders="store.orders"
        @select="(id) => router.push(`/orders/${id}`)"
      />
      <OrderCard
        class="md:hidden"
        :orders="store.orders"
        @select="(id) => router.push(`/orders/${id}`)"
      />
      <Pagination
        :page="store.currentPage"
        :total-pages="store.totalPages"
        @change="(p) => { filters.page = p; load() }"
      />
    </template>
  </div>
</template>
