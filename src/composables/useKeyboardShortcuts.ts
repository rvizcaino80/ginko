import { onMounted, onUnmounted } from 'vue'

interface ShortcutMap {
  [key: string]: () => void
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  function handler(e: KeyboardEvent) {
    const target = e.target as HTMLElement
    const tag = target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
      if (e.key === 'Escape') {
        const cb = shortcuts['Escape']
        if (cb) { e.preventDefault(); cb() }
      }
      return
    }

    const key = e.key === ' ' ? 'Space' : e.key
    if (key in shortcuts) {
      e.preventDefault()
      shortcuts[key]()
    }
  }

  onMounted(() => document.addEventListener('keydown', handler))
  onUnmounted(() => document.removeEventListener('keydown', handler))
}
