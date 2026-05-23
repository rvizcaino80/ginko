<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useAi } from '@/composables/useAi'
import { useOrderStore } from '@/stores/orderStore'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'

const input = ref('')
const scrollRef = ref<HTMLDivElement>()
const store = useOrderStore()
const { messages, thinking, chat } = useAi()

async function handleSend() {
  if (!input.value.trim() || thinking.value) return
  const q = input.value.trim()
  input.value = ''
  await chat(q, store.orders)
  nextTick(() => {
    scrollRef.value?.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
  })
}
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-900">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:robot-outline" class="text-blue-600 dark:text-blue-400 text-xl" />
        <span class="font-semibold">Asistente IA</span>
      </div>
      <Icon icon="mdi:sparkles" class="text-blue-600 dark:text-blue-400 text-xl" />
    </div>

    <ScrollPanel class="flex-1">
      <div ref="scrollRef" class="flex flex-col gap-3 p-4">
        <div v-if="messages.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500 text-base">
          <Icon icon="mdi:robot-outline" class="text-4xl block mb-3 mx-auto" />
          <p>Pregúntame sobre tus órdenes de pago.</p>
          <p class="text-sm mt-2">Ej: "¿Cuántas órdenes hay aprobadas?"</p>
        </div>
        <div v-for="(msg, i) in messages" :key="i" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <div
            class="rounded-xl px-4 py-3 max-w-[85%]"
            :class="msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'"
          >
            {{ msg.content }}
          </div>
        </div>
        <div v-if="thinking" class="flex justify-start">
          <div class="rounded-xl px-4 py-3 bg-gray-100 dark:bg-gray-800">
            <i class="pi pi-spin pi-spinner text-blue-600 dark:text-blue-400" />
            <span class="ml-2 text-sm text-gray-500">Pensando...</span>
          </div>
        </div>
      </div>
    </ScrollPanel>

    <div class="border-t border-gray-200 dark:border-gray-800 p-3 flex gap-2">
      <InputText
        v-model="input"
        placeholder="Escribe tu consulta..."
        class="flex-1"
        @keydown.enter="handleSend"
      />
      <Button
        icon="pi pi-send"
        :disabled="!input.trim() || thinking"
        @click="handleSend"
      />
    </div>
  </div>
</template>
