import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import { reveal } from './directives/reveal'
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/700.css'
import './style.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0, behavior: 'instant' }
    },
  },
  ({ app }) => {
    app.directive('reveal', reveal)
  },
)
