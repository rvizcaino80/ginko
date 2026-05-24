<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

defineProps<{ size?: string }>()
const router = useRouter()
</script>

<template>
  <Button
    label="Nueva orden"
    icon="pi pi-plus"
    :size="size ?? 'small'"
    class="nueva-orden-btn"
    @click="router.push('/orders/new')"
  />
</template>

