import { ref, type Ref } from 'vue'

export function useApi<T>() {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  async function execute(promise: Promise<T>): Promise<T | null> {
    loading.value = true
    error.value = null
    try {
      const result = await promise
      data.value = result as T
      return result
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error inesperado'
      return null
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
