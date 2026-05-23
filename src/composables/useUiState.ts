import { ref } from 'vue'

const showAiPanel = ref(false)

export function useUiState() {
  function toggleAiPanel() {
    showAiPanel.value = !showAiPanel.value
  }
  return { showAiPanel, toggleAiPanel }
}
