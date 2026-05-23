<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useAi } from '@/composables/useAi'

const open = ref(false)
const input = ref('')
const chatRef = ref<HTMLDivElement>()
const { messages, thinking, send } = useAi()

async function handleSend() {
  if (!input.value.trim() || thinking.value) return
  const q = input.value.trim()
  input.value = ''
  await send(q)
  nextTick(() => {
    chatRef.value?.scrollTo({ top: chatRef.value.scrollHeight, behavior: 'smooth' })
  })
}
</script>

<template>
  <div class="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
    <Transition name="slide">
      <div
        v-if="open"
        class="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-80 sm:w-96 flex flex-col overflow-hidden"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800"
        >
          <span class="text-sm font-semibold">Asistente IA</span>
          <button
            class="text-gray-400 hover:text-gray-600 cursor-pointer text-lg leading-none"
            @click="open = false"
          >
            &times;
          </button>
        </div>

        <div
          ref="chatRef"
          class="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 text-sm"
        >
          <div
            v-if="messages.length === 0"
            class="text-gray-400 dark:text-gray-500 text-center py-6"
          >
            Pregúntame sobre tus órdenes de pago.<br />
            <span class="text-xs">Ej: "¿Cuántas órdenes hay aprobadas?"</span>
          </div>
          <div v-for="(msg, i) in messages" :key="i">
            <div
              class="rounded-lg px-3 py-2 max-w-[85%]"
              :class="
                msg.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              "
            >
              {{ msg.content }}
            </div>
          </div>
          <div
            v-if="thinking"
            class="text-gray-400 dark:text-gray-500 text-center text-xs animate-pulse"
          >
            Pensando...
          </div>
        </div>

        <div
          class="border-t border-gray-200 dark:border-gray-800 p-3 flex gap-2"
        >
          <input
            v-model="input"
            type="text"
            placeholder="Escribe tu consulta..."
            class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter="handleSend"
          />
          <button
            class="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 cursor-pointer"
            :disabled="!input.trim() || thinking"
            @click="handleSend"
          >
            Enviar
          </button>
        </div>
      </div>
    </Transition>

    <button
      class="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center text-xl transition-transform hover:scale-105 cursor-pointer"
      @click="open = !open"
    >
      <svg
        v-if="!open"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
      <span v-else class="text-lg">&times;</span>
    </button>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
