import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { markdown } from './plugins/markdown'

// Short content hash of the CV, appended to its URL so a replaced PDF is never
// served from a stale cache.
const cvVersion = createHash('md5')
  .update(readFileSync(new URL('./public/cv/firhan-ramadhani-cv.pdf', import.meta.url)))
  .digest('hex')
  .slice(0, 8)

// Every content/{projects,experience}/<slug>.md becomes a /work/<slug> page.
const detailPaths = ['projects', 'experience'].flatMap((dir) =>
  readdirSync(new URL(`./src/content/${dir}`, import.meta.url))
    .filter((file) => file.endsWith('.md'))
    .map((file) => `/work/${file.replace(/\.md$/, '')}`),
)

export default defineConfig({
  plugins: [vue(), markdown()],
  ssgOptions: {
    includedRoutes: (paths) => [...paths.filter((p) => !p.includes(':')), ...detailPaths],
  },
  define: {
    __CV_VERSION__: JSON.stringify(cvVersion),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
