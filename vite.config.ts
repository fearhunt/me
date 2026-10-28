import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Short content hash of the CV, appended to its URL so a replaced PDF is never
// served from a stale cache.
const cvVersion = createHash('md5')
  .update(readFileSync(new URL('./public/cv/firhan-ramadhani-cv.pdf', import.meta.url)))
  .digest('hex')
  .slice(0, 8)

export default defineConfig({
  plugins: [vue()],
  define: {
    __CV_VERSION__: JSON.stringify(cvVersion),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
