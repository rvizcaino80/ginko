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

<style scoped>
:deep(.nueva-orden-btn .p-button-label)::after {
  content: 'N';
  margin-left: 8px;
  padding: 2px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.75);
  font-size: 0.75rem;
  line-height: 1;
  color: black;
}
</style>
