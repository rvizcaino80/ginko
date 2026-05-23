<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAi } from '@/composables/useAi'

const props = defineProps<{
  proveedor: string
  monto: number | null
}>()
const emit = defineEmits<{ suggest: [text: string] }>()
const { suggestConcept, thinking } = useAi()

async function handleSuggest() {
  if (!props.proveedor.trim() || !props.monto) return
  const text = await suggestConcept(props.proveedor, props.monto)
  if (text) emit('suggest', text)
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
    :disabled="!proveedor.trim() || !monto || thinking"
    @click="handleSuggest"
  >
    <Icon icon="mdi:lightbulb-outline" class="text-base" />
    {{ thinking ? 'Generando...' : 'Sugerir con IA' }}
  </button>
</template>
