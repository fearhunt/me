import MarkdownIt from 'markdown-it'
import type { Plugin } from 'vite'

const md = new MarkdownIt({ linkify: true, typographer: true })

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

// Compiles `*.md` into `{ html, toc }`. h2/h3 headings get ids and feed the
// table of contents shown beside project pages.
export function markdown(): Plugin {
  return {
    name: 'markdown',
    transform(src, id) {
      if (!id.endsWith('.md')) return null

      const tokens = md.parse(src, {})
      const toc: { id: string; text: string; level: number }[] = []
      const seen = new Map<string, number>()

      tokens.forEach((token, i) => {
        if (token.type !== 'heading_open' || !['h2', 'h3'].includes(token.tag)) return
        const text = tokens[i + 1].content
        const base = slugify(text) || 'section'
        const n = seen.get(base) ?? 0
        seen.set(base, n + 1)
        const slug = n ? `${base}-${n}` : base
        token.attrSet('id', slug)
        toc.push({ id: slug, text, level: Number(token.tag[1]) })
      })

      const html = md.renderer.render(tokens, md.options, {})
      return {
        code: `export const html = ${JSON.stringify(html)}\nexport const toc = ${JSON.stringify(toc)}`,
        map: null,
      }
    },
  }
}
