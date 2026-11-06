import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Short content hash of the CV, appended to its URL so a replaced PDF is never
// served from a stale cache.
const cvVersion = createHash('md5')
  .update(readFileSync(new URL('./public/cv/firhan-ramadhani-cv.pdf', import.meta.url)))
  .digest('hex')
  .slice(0, 8)

const SITE_URL = 'https://firhan.id'

const sitemapPages = [
  { path: '/', source: 'src/pages/Home.vue' },
  { path: '/about', source: 'src/pages/About.vue' },
  { path: '/work', source: 'src/pages/Work.vue' },
  // /writing is noindex until it has content, so it stays out of the sitemap.
]

// <lastmod> is the last-commit date of the page's source file.
function lastModified(file: string) {
  const fallback = new Date().toISOString().slice(0, 10)
  try {
    return execSync(`git log -1 --format=%cs -- ${file}`, { encoding: 'utf8' }).trim() || fallback
  } catch {
    return fallback
  }
}

function buildSitemap() {
  const urls = sitemapPages
    .map(
      ({ path, source }) =>
        `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastModified(source)}</lastmod>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export default defineConfig({
  plugins: [vue()],
  ssgOptions: {
    // Beasties preloads every @font-face file it finds, ignoring unicode-range,
    // so Cyrillic/Vietnamese/latin-ext subsets were fetched on every page and
    // competed with the LCP image. The inlined critical CSS already declares the
    // fonts, and the browser fetches only the subsets the page actually uses.
    beastiesOptions: { preloadFonts: false },
    onFinished() {
      writeFileSync(fileURLToPath(new URL('./dist/sitemap.xml', import.meta.url)), buildSitemap())
    },
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
