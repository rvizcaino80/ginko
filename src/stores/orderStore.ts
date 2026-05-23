import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, PaginatedResponse, OrderFilters } from '@/types/order'
import * as api from '@/api/client'
import { useApi } from '@/composables/useApi'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const total = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const currentOrder = ref<Order | null>(null)

  const listApi = useApi<PaginatedResponse<Order>>()
  const detailApi = useApi<Order>()

  async function loadOrders(filters: OrderFilters) {
    const result = await listApi.execute(api.fetchOrders(filters))
    if (result) {
      orders.value = result.items
      total.value = result.total
      totalPages.value = result.totalPages
      currentPage.value = result.page
    }
  }

  async function loadOrder(id: string) {
    currentOrder.value = null
    const result = await detailApi.execute(api.fetchOrder(id))
    if (result) currentOrder.value = result
  }

  async function create(input: {
    proveedor: string
    monto: number
    concepto: string
  }) {
    return await api.createOrder(input)
  }

  async function transition(id: string, nuevoEstado: Order['estado']) {
    const idx = orders.value.findIndex((o) => o.id === id)
    const previous = idx >= 0 ? { ...orders.value[idx] } : null

    if (idx >= 0) orders.value[idx] = { ...orders.value[idx], estado: nuevoEstado }
    if (currentOrder.value?.id === id) {
      currentOrder.value = { ...currentOrder.value, estado: nuevoEstado }
    }

    try {
      const updated = await api.transitionOrder(id, nuevoEstado)
      if (idx >= 0) orders.value[idx] = updated
      if (currentOrder.value?.id === id) currentOrder.value = updated
      return updated
    } catch (e) {
      if (previous && idx >= 0) orders.value[idx] = previous
      if (currentOrder.value?.id === id && previous) currentOrder.value = previous
      throw e
    }
  }

  return {
    orders, total, totalPages, currentPage, currentOrder,
    listApi, detailApi,
    loadOrders, loadOrder, create, transition,
  }
})
