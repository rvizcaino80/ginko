<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import ConceptSuggest from '@/components/ai/ConceptSuggest.vue'

const router = useRouter()
const store = useOrderStore()

const proveedor = ref('')
const monto = ref<number | null>(null)
const concepto = ref('')
const submitting = ref(false)
const submitError = ref('')

const conceptoCount = computed(() => concepto.value.length)

const proveedorError = computed(() => {
  if (!proveedor.value.trim()) return 'El proveedor es requerido'
  return ''
})

const montoError = computed(() => {
  if (monto.value === null || monto.value === undefined) return 'El monto es requerido'
  if (Number.isNaN(monto.value) || monto.value <= 0) return 'El monto debe ser mayor a cero'
  return ''
})

const conceptoError = computed(() => {
  if (!concepto.value.trim()) return 'El concepto es requerido'
  if (concepto.value.length > 250) return 'Máximo 250 caracteres'
  return ''
})

const valid = computed(
  () => !proveedorError.value && !montoError.value && !conceptoError.value,
)

async function submit() {
  if (!valid.value || submitting.value) return
  submitting.value = true
  submitError.value = ''
  try {
    await store.create({
      proveedor: proveedor.value.trim(),
      monto: monto.value!,
      concepto: concepto.value.trim(),
    })
    router.push('/')
  } catch {
    submitError.value = 'Error al crear la orden. Intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-xl font-semibold mb-6">Nueva orden de pago</h1>

    <form class="space-y-5" @submit.prevent="submit">
      <div>
        <label class="block text-sm font-medium mb-1">Proveedor</label>
        <input
          v-model="proveedor"
          type="text"
          class="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          :class="
            proveedor.trim() && proveedorError
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          "
          placeholder="Nombre del proveedor"
        />
        <p v-if="proveedor.trim() && proveedorError" class="text-xs text-red-500 mt-1">
          {{ proveedorError }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Monto (COP)</label>
        <input
          v-model.number="monto"
          type="number"
          min="1"
          step="1000"
          class="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          :class="
            monto !== null && montoError
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          "
          placeholder="0"
        />
        <p v-if="monto !== null && montoError" class="text-xs text-red-500 mt-1">
          {{ montoError }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">
          Concepto
          <span class="text-xs text-gray-400 dark:text-gray-500">({{ conceptoCount }}/250)</span>
        </label>
        <ConceptSuggest
          :proveedor="proveedor"
          :monto="monto"
          @suggest="(t: string) => concepto = t"
        />
        <textarea
          v-model="concepto"
          class="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          :class="
            concepto.trim() && conceptoError
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          "
          rows="3"
          maxlength="250"
          placeholder="Descripción del pago"
        />
        <p v-if="concepto.trim() && conceptoError" class="text-xs text-red-500 mt-1">
          {{ conceptoError }}
        </p>
      </div>

      <p v-if="submitError" class="text-sm text-red-500">{{ submitError }}</p>

      <button
        type="submit"
        class="w-full py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        :disabled="!valid || submitting"
      >
        {{ submitting ? 'Creando...' : 'Crear orden' }}
      </button>
    </form>
  </div>
</template>
