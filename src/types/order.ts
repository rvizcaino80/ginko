export type OrderStatus = 'BORRADOR' | 'APROBADA' | 'RECHAZADA' | 'PAGADA'

export interface Order {
  id: string
  proveedor: string
  monto: number
  concepto: string
  fechaCreacion: string
  estado: OrderStatus
}

export interface OrderFilters {
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

export const STATUS_SEVERITIES: Record<OrderStatus, 'warn' | 'success' | 'danger' | 'info'> = {
  BORRADOR: 'warn',
  APROBADA: 'success',
  RECHAZADA: 'danger',
  PAGADA: 'info',
}
