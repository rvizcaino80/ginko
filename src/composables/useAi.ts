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
  const byProvider: Record<string, { total: number; ids: string[] }> = {}
  for (const o of orders) {
    byStatus[o.estado] = (byStatus[o.estado] || 0) + 1
    if (!byProvider[o.proveedor]) byProvider[o.proveedor] = { total: 0, ids: [] }
    byProvider[o.proveedor].total++
    byProvider[o.proveedor].ids.push(o.id)
  }

  const statusSummary = Object.entries(STATUS_LABELS)
    .map(([k, v]) => `${v}: ${byStatus[k] || 0}`)
    .join(', ')

  const providerSummary = Object.entries(byProvider)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([name, info]) => {
      const ids = info.ids.length <= 3 ? info.ids.join(', ') : info.ids.slice(0, 3).join(', ') + '...'
      return `${name}: ${info.total} (${ids})`
    })
    .join('\n')

  const allOrders = orders
    .map(
      (o) =>
        `${o.id}|${o.proveedor}|$${o.monto.toLocaleString('es-CO')}|${STATUS_LABELS[o.estado]}`,
    )
    .join('\n')

  return (
    `Eres un asistente financiero integrado en una app de gestión de pagos llamada Ginko. ` +
    `Actualmente hay ${total} órdenes de pago cargadas en la aplicación.\n\n` +
    `Resumen por estado:\n${statusSummary}\n\n` +
    `Resumen por proveedor:\n${providerSummary}\n\n` +
    `Lista completa de órdenes:\n${allOrders}\n\n` +
    `PUEDES REALIZAR ACCIONES EN LA APLICACIÓN. Responde ÚNICAMENTE con JSON válido:\n` +
    `{"message": "texto", "action": {"type": "navigate", "route": "/orders/ORD-0001"}}\n` +
    `{"message": "texto", "action": {"type": "filter", "value": "APROBADA"}}\n` +
    `{"message": "texto", "action": {"type": "search", "value": "nombre"}}\n` +
    `{"message": "texto", "action": null}\n\n` +
    `Tipos de acción:\n` +
    `- navigate → "/orders/ID" para detalle, "/orders/new" para crear.\n` +
    `- filter → filtra por estado (BORRADOR, APROBADA, RECHAZADA, PAGADA).\n` +
    `- search → busca por proveedor.\n\n` +
    `REGLAS IMPORTANTES:\n` +
    `1. Cuando ejecutes filter o search, la ACCIÓN YA SE APLICÓ AUTOMÁTICAMENTE. ` +
    `No digas "aplica el filtro" ni "puedes ver el listado". Solo confirma: ` +
    `"Mostrando 14 aprobadas" o "Buscando «nombre»".\n` +
    `2. Cuando ejecutes navigate, el usuario YA está viendo la orden. ` +
    `Solo di algo como "Aquí tienes ORD-0001".\n` +
    `3. NO enlistes órdenes individuales en el mensaje. La app ya las muestra. ` +
    `Si quieres mencionar alguna, máximo 2 líneas.\n` +
    `4. Sé breve. 1-2 líneas como máximo.\n` +
    `5. Siempre usa el ID exacto (ej. "ORD-0001").\n` +
    `Responde SIEMPRE en español.`
  )
}

function extractJsonBlock(text: string): string | null {
  const start = text.indexOf('{')
  if (start === -1) return null
  let depth = 0
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) return text.slice(start, i + 1)
    }
  }
  return null
}

function parseResponse(text: string): ChatResult {
  const trimmed = text.trim()
  try {
    const parsed = JSON.parse(trimmed)
    if (parsed && typeof parsed === 'object' && parsed.action) {
      return {
        message: parsed.message || '',
        action: parsed.action as AiAction,
      }
    }
  } catch {}

  const block = extractJsonBlock(text)
  if (block) {
    try {
      const parsed = JSON.parse(block)
      if (parsed && parsed.action) {
        const prefix = text.slice(0, text.indexOf(block)).trim()
        const msg = parsed.message || ''
        return {
          message: prefix ? `${prefix}\n\n${msg}` : msg,
          action: parsed.action as AiAction,
        }
      }
    } catch {}
  }

  return { message: text, action: null }
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
        max_tokens: 1500,
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
