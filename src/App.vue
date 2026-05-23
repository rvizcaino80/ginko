<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AiAssistant from '@/components/ai/AiAssistant.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 container mx-auto px-4 py-6 max-w-6xl">
      <RouterView />
    </main>
    <AiAssistant />
  </div>
</template>
