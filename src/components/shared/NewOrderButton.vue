<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{ size?: string; short?: boolean }>()
const emit = defineEmits<{ 'create-order-modal': [] }>()
</script>

<template>
  <Button
    :label="short ? 'Nueva' : 'Nueva orden'"
    icon="pi pi-plus"
    :size="size ?? 'small'"
    class="nueva-orden-btn"
    @click="emit('create-order-modal')"
  />
</template>
