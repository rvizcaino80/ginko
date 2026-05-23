import { ref } from 'vue'
import type { Order } from '@/types/order'
import { STATUS_LABELS } from '@/types/order'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
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

  const top = orders.slice(0, 10)
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
    `Últimas órdenes:\n${topIds}\n\n` +
    `El usuario puede preguntar sobre cualquier aspecto de sus órdenes. Responde de forma ` +
    `clara y concisa basándote exclusivamente en estos datos. Si te pide un desglose, ` +
    `calcúlalo con los números que ves arriba. Si no tienes suficiente información para ` +
    `responder, dilo honestamente.`
  )
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

  async function chat(prompt: string, orders: Order[]) {
    messages.value.push({ role: 'user', content: prompt })
    thinking.value = true

    const systemPrompt = buildContextPrompt(orders)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.value.map((m) => ({ role: m.role, content: m.content })),
    ]

    const response = await callApi(apiMessages)
    messages.value.push({ role: 'assistant', content: response })
    thinking.value = false
    return response
  }

  async function suggestConcept(proveedor: string, monto: number): Promise<string> {
    const prompt = `Sugiere un concepto de pago profesional para "${proveedor}" por $${monto.toLocaleString('es-CO')} COP. Responde solo con el texto del concepto, máximo 250 caracteres.`
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
