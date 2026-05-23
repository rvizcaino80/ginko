import { ref } from 'vue'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function useAi() {
  const messages = ref<ChatMessage[]>([])
  const thinking = ref(false)

  async function send(prompt: string, systemPrompt?: string) {
    messages.value.push({ role: 'user', content: prompt })
    thinking.value = true

    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (!apiKey) {
      const fallback = 'La clave de DeepSeek no está configurada. Revisa tu archivo .env.'
      messages.value.push({ role: 'assistant', content: fallback })
      thinking.value = false
      return fallback
    }

    try {
      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-v4-flash',
          messages: [
            ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          max_tokens: 500,
        }),
      })

      if (!res.ok) throw new Error(`DeepSeek API error: ${res.status}`)

      const data = await res.json()
      const text = data.choices?.[0]?.message?.content || ''
      messages.value.push({ role: 'assistant', content: text })
      return text
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al contactar DeepSeek'
      messages.value.push({ role: 'assistant', content: `Error: ${msg}` })
      return ''
    } finally {
      thinking.value = false
    }
  }

  async function suggestConcept(proveedor: string, monto: number): Promise<string> {
    const prompt =
      `Sugiere un concepto de pago profesional para "${proveedor}" por ` +
      `$${monto.toLocaleString('es-CO')} COP. Responde solo con el texto del concepto, máximo 250 caracteres.`
    const systemPrompt =
      'Eres un asistente financiero que ayuda a generar conceptos de pago claros y profesionales. Responde únicamente con el texto del concepto sugerido, sin explicaciones.'
    const text = await send(prompt, systemPrompt)
    return text || ''
  }

  return { messages, thinking, send, suggestConcept }
}
