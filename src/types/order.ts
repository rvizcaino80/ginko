export type OrderStatus = 'BORRADOR' | 'APROBADA' | 'RECHAZADA' | 'PAGADA'

export interface Order {
  id: string
  proveedor: string
  monto: number
  concepto: string
  fechaCreacion: string
  estado: OrderStatus
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

export interface OrderFilters {
  page: number
  status: string
  q: string
}

export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  BORRADOR: ['APROBADA', 'RECHAZADA'],
  APROBADA: ['PAGADA'],
  RECHAZADA: [],
  PAGADA: [],
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  BORRADOR: 'Borrador',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  PAGADA: 'Pagada',
}

export const STATUS_COLORS: Record<OrderStatus, string> = {
  BORRADOR: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  APROBADA: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  RECHAZADA: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  PAGADA: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
}
