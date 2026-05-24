<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useFilters } from '@/composables/useFilters'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import OrderTable from '@/components/orders/OrderTable.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const store = useOrderStore()
const { filters } = useFilters()

async function load() {
  await store.loadOrders(filters.value)
}

watch(filters, load, { deep: true })
onMounted(load)

const sortedOrders = computed(() => {
  const arr = [...store.orders]
  const sort = (route.query.sort as string) || ''
  if (!sort) return arr
  const [field, dir] = sort.split('-') as [string, 'asc' | 'desc']
  const mult = dir === 'desc' ? -1 : 1
  arr.sort((a, b) => {
    let cmp = 0
    if (field === 'monto') cmp = a.monto - b.monto
    else if (field === 'fecha') cmp = new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()
    else if (field === 'proveedor') cmp = a.proveedor.localeCompare(b.proveedor)
    return cmp * mult
  })
  return arr
})

useKeyboardShortcuts({
  '/': () => {
    const input = document.querySelector<HTMLInputElement>('input[type="text"]')
    input?.focus()
  },
})
</script>

<template>
  <div>
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
        :orders="sortedOrders"
        @select="(id) => router.push(`/orders/${id}`)"
      />
      <OrderCard
        class="lg:hidden"
        :orders="sortedOrders"
        @select="(id) => router.push(`/orders/${id}`)"
      />
    </template>
  </div>
</template>
