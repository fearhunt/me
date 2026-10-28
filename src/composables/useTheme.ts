import { onMounted, ref } from 'vue'

type ThemeOverride = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredTheme(): ThemeOverride | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

function applyTheme(theme: ThemeOverride) {
  document.documentElement.setAttribute('data-theme', theme)
  window.localStorage.setItem(STORAGE_KEY, theme)
}

export function useTheme() {
  const isDark = ref(false)

  onMounted(() => {
    const stored = readStoredTheme()
    isDark.value = stored ? stored === 'dark' : systemPrefersDark()
  })

  function toggle() {
    const next: ThemeOverride = isDark.value ? 'light' : 'dark'
    applyTheme(next)
    isDark.value = next === 'dark'
  }

  return { isDark, toggle }
}
