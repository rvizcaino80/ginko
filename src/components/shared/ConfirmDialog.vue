<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

defineProps<{
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Dialog
    :visible="open"
    :header="title"
    modal
    closable
    @update:visible="(val: boolean) => { if (!val) emit('cancel') }"
    class="w-full max-w-sm"
  >
    <p class="mb-6 text-slate-600 dark:text-slate-400">{{ message }}</p>
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          :label="cancelText ?? 'Cancelar'"
          severity="secondary"
          variant="outlined"
          size="small"
          @click="emit('cancel')"
        />
        <Button
          :label="confirmText ?? 'Confirmar'"
          :loading="loading"
          size="small"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </Dialog>
</template>
