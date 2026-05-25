import { ref } from 'vue'

const validated = ref<'pending' | 'valid' | 'invalid'>('pending')

async function validateKey(): Promise<boolean> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    validated.value = 'invalid'
    return false
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
        messages: [{ role: 'user', content: 'responde solo OK' }],
        max_tokens: 5,
      }),
    })
    const valid = res.ok
    validated.value = valid ? 'valid' : 'invalid'
    return valid
  } catch {
    validated.value = 'invalid'
    return false
  }
}

export function useAiStatus() {
  return { validated, validateKey }
}
