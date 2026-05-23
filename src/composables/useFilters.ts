import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { OrderFilters } from '@/types/order'

export function useFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = ref<OrderFilters>({
    status: (route.query.status as string) || 'todos',
    q: (route.query.q as string) || '',
  })

  const syncing = ref(false)

  watch(
    () => route.query,
    () => {
      if (syncing.value) return
      filters.value = {
        status: (route.query.status as string) || 'todos',
        q: (route.query.q as string) || '',
      }
    },
  )

  watch(
    filters,
    (f) => {
      syncing.value = true
      router.replace({
        query: {
          status: f.status !== 'todos' ? f.status : undefined,
          q: f.q || undefined,
        },
      })
      setTimeout(() => { syncing.value = false }, 0)
    },
    { deep: true },
  )

  return { filters }
}
