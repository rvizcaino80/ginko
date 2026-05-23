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

let seedRandom = 42
function seeded(): number {
  seedRandom = (seedRandom * 16807) % 2147483647
  return (seedRandom - 1) / 2147483646
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(seeded() * arr.length)]
}

function randomAmount(): number {
  return Math.floor(seeded() * 500_000_000) + 50_000
}

function randomDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(seeded() * 90))
  return d.toISOString()
}

const CONCEPTOS = [
  'Honorarios consultoría estratégica abril 2026',
  'Mantenimiento preventivo equipos de cómputo',
  'Suministro de materiales de oficina Q1',
  'Servicio de vigilancia mensual sede principal',
  'Desarrollo módulo de pagos plataforma web',
  'Campaña publicidad digital redes sociales',
  'Licencias software antivirus corporativo 2026',
  'Transporte de mercancía ruta Bogotá-Medellín',
  'Adecuación locativa piso 5 oficinas',
  'Servicio de limpieza especializada mensual',
  'Capacitación equipo ventas atención cliente',
  'Actualización sistema facturación electrónica',
  'Seguro de responsabilidad civil anual',
  'Estudio de mercado nuevo producto financiero',
  'Reparación planta eléctrica sede administrativa',
  'Hosting y dominio sitio web corporativo',
  'Auditoría externa estados financieros 2025',
  'Dotación uniformes personal operativo',
  'Arriendo bodega centro logístico',
  'Fumigación y control de plagas trimestral',
  'Soporte técnico infraestructura de red',
  'Diseño empaques nueva línea productos',
  'Análisis de riesgos sistema de seguridad',
  'Consultoría legal cumplimiento normativo',
  'Implementación firma electrónica documentos',
]

const seed: Order[] = Array.from({ length: 53 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(4, '0')}`,
  proveedor: pick(PROVIDERS),
  monto: randomAmount(),
  concepto: pick(CONCEPTOS),
  fechaCreacion: randomDate(),
  estado: pick(STATUSES),
}))

let orders = [...seed]

export const handlers = [
  http.get('/api/orders', async ({ request }) => {
    await delay(350)
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || ''
    const q = url.searchParams.get('q') || ''

    let filtered = [...orders]
    if (status && status !== 'todos') {
      filtered = filtered.filter((o) => o.estado === status)
    }
    if (q) {
      const term = q.toLowerCase()
      filtered = filtered.filter((o) => o.proveedor.toLowerCase().includes(term))
    }
    filtered.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())

    return HttpResponse.json(filtered)
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
