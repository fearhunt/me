import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import { reveal } from './directives/reveal'
import './style.css'

export const createApp = ViteSSG(App, { routes, base: import.meta.env.BASE_URL }, ({ app }) => {
  app.directive('reveal', reveal)
})
