import { http, HttpResponse, delay } from 'msw'
import type { Order, OrderStatus } from '@/types/order'

const STATUSES: OrderStatus[] = ['BORRADOR', 'APROBADA', 'RECHAZADA', 'PAGADA']
const PROVIDERS = [
  'Ingeniería y Construcciones SAS', 'Tecnología Avanzada Ltda', 'Servicios Logísticos Integrales',
  'Consultoría Estratégica SAS', 'Distribuidora del Valle', 'Automatización Industrial SA',
  'Soluciones Eléctricas SAS', 'Transportes Rápidos Ltda', 'Alimentos y Bebidas del Sur',
  'Mantenimiento General SAS', 'Publicidad Digital Creativa', 'Seguridad Privada Elite',
  'Asesoría Jurídica Corporativa', 'Suministros de Oficina SAS', 'Limpieza Especializada Ltda',
  'Software y Sistemas SA', 'Materiales de Construcción SAS', 'Logística de Última Milla',
  'Recursos Humanos Integrales', 'Gestión Documental SAS',
]

function randomAmount(): number {
  return Math.floor(Math.random() * 500_000_000) + 50_000
}

function randomDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * 90))
  return d.toISOString()
}

const seed: Order[] = Array.from({ length: 53 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(4, '0')}`,
  proveedor: PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)],
  monto: randomAmount(),
  concepto: `Pago de servicios profesionales correspondientes al mes de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio'][Math.floor(Math.random() * 6)]} de 2026`,
  fechaCreacion: randomDate(),
  estado: STATUSES[Math.floor(Math.random() * STATUSES.length)],
}))

let orders = [...seed]

export const handlers = [
  http.get('/api/orders', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const status = url.searchParams.get('status') || ''
    const q = url.searchParams.get('q') || ''
    const limit = 10

    let filtered = [...orders]
    if (status && status !== 'todos') filtered = filtered.filter((o) => o.estado === status)
    if (q) {
      const term = q.toLowerCase()
      filtered = filtered.filter((o) => o.proveedor.toLowerCase().includes(term))
    }
    filtered.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const items = filtered.slice(start, start + limit)

    return HttpResponse.json({ items, total, page, totalPages })
  }),

  http.get('/api/orders/:id', async ({ params }) => {
    await delay(200)
    const order = orders.find((o) => o.id === params.id)
    if (!order) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(order)
  }),

  http.post('/api/orders', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as Partial<Order>
    if (!body.proveedor || !body.monto || !body.concepto) {
      return HttpResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
    }
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(4, '0')}`,
      proveedor: body.proveedor,
      monto: body.monto,
      concepto: body.concepto,
      fechaCreacion: new Date().toISOString(),
      estado: 'BORRADOR',
    }
    orders.unshift(newOrder)
    return HttpResponse.json(newOrder, { status: 201 })
  }),

  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    await delay(300)
    const { estado } = (await request.json()) as { estado: OrderStatus }
    const order = orders.find((o) => o.id === params.id)
    if (!order) return new HttpResponse(null, { status: 404 })

    const transitions: Record<OrderStatus, OrderStatus[]> = {
      BORRADOR: ['APROBADA', 'RECHAZADA'],
      APROBADA: ['PAGADA'],
      RECHAZADA: [],
      PAGADA: [],
    }

    if (!transitions[order.estado].includes(estado)) {
      return HttpResponse.json(
        { error: `Transición inválida de ${order.estado} a ${estado}` },
        { status: 400 },
      )
    }

    order.estado = estado
    return HttpResponse.json(order)
  }),
]
