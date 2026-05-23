import { ref } from 'vue'
import type { Order } from '@/types/order'
import { STATUS_LABELS } from '@/types/order'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AiAction {
  type: 'navigate' | 'filter' | 'search'
  route?: string
  value?: string
}

export interface ChatResult {
  message: string
  action: AiAction | null
}

function buildContextPrompt(orders: Order[]): string {
  const total = orders.length
  const byStatus: Record<string, number> = {}
  for (const o of orders) {
    byStatus[o.estado] = (byStatus[o.estado] || 0) + 1
  }
  const statusSummary = Object.entries(STATUS_LABELS)
    .map(([k, v]) => `${v}: ${byStatus[k] || 0}`)
    .join(', ')

  const top = orders.slice(0, 15)
  const topIds = top
    .map(
      (o) =>
        `  - ${o.id} | ${o.proveedor} | $${o.monto.toLocaleString('es-CO')} | ${STATUS_LABELS[o.estado]}`,
    )
    .join('\n')

  return (
    `Eres un asistente financiero integrado en una app de gestión de pagos llamada Ginko. ` +
    `Actualmente hay ${total} órdenes de pago cargadas en la aplicación.\n\n` +
    `Resumen por estado:\n${statusSummary}\n\n` +
    `Órdenes disponibles:\n${topIds}\n\n` +
    `PUEDES REALIZAR ACCIONES EN LA APLICACIÓN respondiendo con JSON en este formato:\n` +
    `{"message": "texto para el usuario", "action": {"type": "navigate", "route": "/orders/ORD-0001"}}\n` +
    `{"message": "texto", "action": {"type": "filter", "value": "APROBADA"}}\n` +
    `{"message": "texto", "action": {"type": "search", "value": "nombre proveedor"}}\n\n` +
    `Tipos de acción disponibles:\n` +
    `- navigate: Navega a una ruta. Usa "/orders/ID" para detalle, "/orders/new" para crear.\n` +
    `- filter: Filtra por estado. Valores: BORRADOR, APROBADA, RECHAZADA, PAGADA.\n` +
    `- search: Busca por nombre de proveedor.\n\n` +
    `Si el usuario pide ver/listar/mostrar una orden o conjunto de órdenes, USA UNA ACCIÓN. ` +
    `Si solo responde una pregunta, devuelve action: null.\n\n` +
    `Siempre usa el ID exacto de la orden (ej. "ORD-0001").\n` +
    `Responde SIEMPRE en español.`
  )
}

function parseResponse(text: string): ChatResult {
  try {
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === 'object' && parsed.action) {
      return {
        message: parsed.message || '',
        action: parsed.action as AiAction,
      }
    }
    return { message: text, action: null }
  } catch {
    return { message: text, action: null }
  }
}

async function callApi(messages: { role: string; content: string }[]) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) return 'La clave de DeepSeek no está configurada. Revisa tu archivo .env.'

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-v4-flash',
        messages,
        max_tokens: 800,
      }),
    })
    if (!res.ok) throw new Error(`DeepSeek API error: ${res.status}`)
    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
  } catch (e: unknown) {
    return e instanceof Error ? e.message : 'Error al contactar DeepSeek'
  }
}

export function useAi() {
  const messages = ref<ChatMessage[]>([])
  const thinking = ref(false)

  async function chat(prompt: string, orders: Order[]): Promise<ChatResult> {
    messages.value.push({ role: 'user', content: prompt })
    thinking.value = true

    const systemPrompt = buildContextPrompt(orders)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.value.map((m) => ({ role: m.role, content: m.content })),
    ]

    const response = await callApi(apiMessages)
    const result = parseResponse(response)
    messages.value.push({ role: 'assistant', content: result.message })
    thinking.value = false
    return result
  }

  async function suggestConcept(proveedor: string, monto: number): Promise<string> {
    const prompt =
      `Sugiere un concepto de pago profesional para "${proveedor}" por ` +
      `$${monto.toLocaleString('es-CO')} COP. Responde solo con el texto del concepto, máximo 250 caracteres.`
    const systemPrompt =
      'Eres un asistente financiero que ayuda a generar conceptos de pago claros y profesionales. Responde únicamente con el texto del concepto sugerido, sin explicaciones.'
    const response = await callApi([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ])
    return response || ''
  }

  return { messages, thinking, chat, suggestConcept }
}
