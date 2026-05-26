<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'
import DatePicker from 'primevue/datepicker'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()
const store = useOrderStore()

const proveedor = ref('')
const monto = ref<number | null>(null)
const concepto = ref('')
const fechaVencimiento = ref<Date | null>(null)
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

const fechaVencimientoError = computed(() => {
  if (!fechaVencimiento.value) return 'La fecha de vencimiento es requerida'
  return ''
})

const valid = computed(
  () => !proveedorError.value && !montoError.value && !conceptoError.value && !fechaVencimientoError.value,
)

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function submit() {
  if (!valid.value || submitting.value) return
  submitting.value = true
  submitError.value = ''
  try {
    await store.create({
      proveedor: proveedor.value.trim(),
      monto: monto.value!,
      concepto: concepto.value.trim(),
      fechaVencimiento: formatDate(fechaVencimiento.value!),
    })
    resetForm()
    emit('close')
  } catch {
    submitError.value = 'Error al crear la orden. Intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  proveedor.value = ''
  monto.value = null
  concepto.value = ''
  fechaVencimiento.value = null
  submitError.value = ''
}

function onHide() {
  resetForm()
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="visible"
    header="Nueva orden de pago"
    modal
    closable
    class="w-full max-w-xl"
    @update:visible="(val: boolean) => { if (!val) onHide() }"
  >
    <form class="flex flex-col gap-5" @submit.prevent="submit">
      <div class="flex flex-col gap-1">
        <label class="font-medium">Proveedor</label>
        <InputText
          v-model="proveedor"
          placeholder="Nombre del proveedor"
          :invalid="proveedor.trim().length > 0 && !!proveedorError"
        />
        <small v-if="proveedor.trim() && proveedorError" class="text-red-500">{{ proveedorError }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-medium">Monto (COP)</label>
        <InputNumber
          v-model="monto"
          :min="1"
          :step="1000"
          placeholder="0"
          class="w-full"
          :invalid="monto !== null && !!montoError"
          mode="currency"
          currency="COP"
          locale="es-CO"
        />
        <small v-if="monto !== null && montoError" class="text-red-500">{{ montoError }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <label class="font-medium">Concepto</label>
          <span class="text-sm text-slate-400 dark:text-slate-500">({{ conceptoCount }}/250)</span>
        </div>
        <Textarea
          v-model="concepto"
          :maxlength="250"
          rows="3"
          placeholder="Descripción del pago"
          :invalid="concepto.trim().length > 0 && !!conceptoError"
          auto-resize
        />
        <small v-if="concepto.trim() && conceptoError" class="text-red-500">{{ conceptoError }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-medium">Fecha Vencimiento</label>
        <DatePicker
          v-model="fechaVencimiento"
          :invalid="fechaVencimiento !== null && !!fechaVencimientoError"
        />
        <small v-if="fechaVencimiento !== null && fechaVencimientoError" class="text-red-500">{{ fechaVencimientoError }}</small>
      </div>

      <Message v-if="submitError" severity="error" :life="5000">
        {{ submitError }}
      </Message>

      <div class="flex justify-end gap-3 pt-2">
        <Button
          label="Cancelar"
          severity="secondary"
          variant="outlined"
          size="small"
          @click="onHide"
        />
        <Button
          type="submit"
          label="Crear orden"
          :loading="submitting"
          :disabled="!valid"
        />
      </div>
    </form>
  </Dialog>
</template>
