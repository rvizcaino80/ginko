import axios from 'axios'
import type { Order, OrderFilters, OrderStatus } from '@/types/order'

const api = axios.create({ baseURL: '/api' })

export async function fetchOrders(filters: OrderFilters): Promise<Order[]> {
  const { data } = await api.get('/orders', {
    params: { status: filters.status, q: filters.q },
  })
  return data
}

export async function fetchOrder(id: string): Promise<Order> {
  const { data } = await api.get(`/orders/${id}`)
  return data
}

export async function createOrder(input: {
  proveedor: string
  monto: number
  concepto: string
}): Promise<Order> {
  const { data } = await api.post('/orders', input)
  return data
}

export async function transitionOrder(id: string, estado: OrderStatus): Promise<Order> {
  const { data } = await api.patch(`/orders/${id}/status`, { estado })
  return data
}
