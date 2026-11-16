#!/usr/bin/env bun
// Weekly SEO + web-performance snapshot for one site.
//
//   bun seo/run.mjs           run if the latest report is 7+ days old, else skip
//   bun seo/run.mjs --force   run now regardless
//
// Reads seo/config.json, runs Lighthouse (mobile + desktop) against the live URL,
// checks every sitemap URL for on-page SEO basics, then writes
// seo/reports/YYYY-MM-DD.{json,md} with a diff against the previous report.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchGsc, gscMarkdown, summarizeGsc } from './gsc.mjs'

const dir = dirname(fileURLToPath(import.meta.url))
const reportsDir = join(dir, 'reports')
const config = JSON.parse(readFileSync(join(dir, 'config.json'), 'utf8'))
const force = process.argv.includes('--force')
const today = new Date().toISOString().slice(0, 10)
const WEEK_MS = 7 * 24 * 3600 * 1000

mkdirSync(reportsDir, { recursive: true })
const previousFiles = readdirSync(reportsDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort()
const latest = previousFiles.at(-1)

if (!force && latest && Date.now() - statSync(join(reportsDir, latest)).mtimeMs < WEEK_MS) {
  console.log(`skip: ${latest} is less than 7 days old (use --force)`)
  process.exit(0)
}
const previous = latest && latest !== `${today}.json` ? JSON.parse(readFileSync(join(reportsDir, latest), 'utf8')) : null

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const root = join(homedir(), '.cache/ms-playwright')
  if (!existsSync(root)) return undefined
  const found = readdirSync(root).filter((d) => d.startsWith('chromium-')).sort().at(-1)
  return found ? join(root, found, 'chrome-linux64/chrome') : undefined
}

function lighthouse(preset) {
  const out = join(tmpdir(), `lh-${config.name}-${preset}.json`)
  const args = ['lighthouse', config.url, '--only-categories=performance,seo,accessibility,best-practices',
    '--chrome-flags=--headless=new --no-sandbox', '--output=json', `--output-path=${out}`, '--quiet']
  if (preset === 'desktop') args.push('--preset=desktop')
  execFileSync('bunx', args, { env: { ...process.env, CHROME_PATH: chromePath() }, stdio: 'ignore', timeout: 300_000 })
  const r = JSON.parse(readFileSync(out, 'utf8'))
  const a = r.audits
  const num = (k) => Math.round(a[k].numericValue * 1000) / 1000
  return {
    scores: Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)])),
    fcp: num('first-contentful-paint'), lcp: num('largest-contentful-paint'),
    tbt: num('total-blocking-time'), cls: num('cumulative-layout-shift'), ttfb: num('server-response-time'),
    failing: Object.entries(a).filter(([, v]) => v.score !== null && v.score < 0.9 && v.scoreDisplayMode !== 'informative').map(([k]) => k),
  }
}

async function checkPage(url) {
  const res = await fetch(url, { redirect: 'follow' })
  const html = await res.text()
  const pick = (re) => html.match(re)?.[1]
  const title = pick(/<title[^>]*>([^<]*)<\/title>/i)
  const description = pick(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)
  const issues = []
  if (res.status !== 200) issues.push(`status ${res.status}`)
  if (!title) issues.push('missing <title>'); else if (title.length > 60) issues.push(`title ${title.length} chars (>60)`)
  if (!description) issues.push('missing meta description'); else if (description.length > 160) issues.push(`description ${description.length} chars (>160)`)
  if (!/<link[^>]+rel="canonical"/i.test(html)) issues.push('missing canonical')
  if (!/property="og:image"/i.test(html)) issues.push('missing og:image')
  if (!/application\/ld\+json/i.test(html)) issues.push('no JSON-LD')
  const h1 = (html.match(/<h1[\s>]/gi) || []).length
  if (h1 !== 1) issues.push(`${h1} <h1> tags`)
  const noAlt = (html.match(/<img(?![^>]*\balt\b)[^>]*>/gi) || []).length
  if (noAlt) issues.push(`${noAlt} <img> without alt`)
  return { url, status: res.status, title, description, issues }
}

async function sitemapUrls() {
  const fetchText = async (u) => (await fetch(u)).text()
  let xml = await fetchText(`${config.url}/sitemap.xml`)
  if (!xml.includes('<urlset')) xml = await fetchText(`${config.url}/${config.sitemap || 'sitemap-index.xml'}`)
  let locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (xml.includes('<sitemapindex')) {
    locs = (await Promise.all(locs.map(async (u) => [...(await fetchText(u)).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])))).flat()
  }
  return locs
}

async function headers() {
  const res = await fetch(config.url, { headers: { 'accept-encoding': 'gzip, br' } })
  const h = (k) => res.headers.get(k)
  const t0 = performance.now(); await (await fetch(config.url)).arrayBuffer()
  return {
    hsts: !!h('strict-transport-security'), encoding: h('content-encoding'), cacheControl: h('cache-control'),
    xContentTypeOptions: !!h('x-content-type-options'), refetchMs: Math.round(performance.now() - t0),
  }
}

const urls = await sitemapUrls()
const report = {
  site: config.name, url: config.url, date: today,
  lighthouse: { mobile: lighthouse('mobile'), desktop: lighthouse('desktop') },
  headers: await headers(),
  pages: await Promise.all(urls.map(checkPage)),
  gsc: summarizeGsc(await fetchGsc(config, { snapshotDir: join(dir, 'gsc'), date: today })),
}
writeFileSync(join(reportsDir, `${today}.json`), JSON.stringify(report, null, 2) + '\n')

// ── markdown summary with week-over-week diff ──
const delta = (cur, prev, lowerIsBetter = false) => {
  if (prev === undefined || prev === null) return ''
  const d = Math.round((cur - prev) * 1000) / 1000
  if (d === 0) return ' (=)'
  return ` (${d > 0 ? '+' : ''}${d} ${(d < 0) === lowerIsBetter ? '✅' : '⚠️'})`
}
const rows = []
for (const form of ['mobile', 'desktop']) {
  const c = report.lighthouse[form], p = previous?.lighthouse?.[form]
  rows.push(`| ${form} | ${c.scores.performance}${delta(c.scores.performance, p?.scores.performance)} | ${c.scores.seo} | ${c.scores.accessibility} | ${(c.lcp / 1000).toFixed(2)}s${delta(c.lcp / 1000, p && p.lcp / 1000, true)} | ${Math.round(c.tbt)}ms${delta(Math.round(c.tbt), p && Math.round(p.tbt), true)} | ${c.cls}${delta(c.cls, p?.cls, true)} |`)
}
const pageIssues = report.pages.filter((p) => p.issues.length)
const md = `# ${config.name} — SEO & performance report, ${today}

${previous ? `Compared with ${previous.date}.` : 'First report, no previous data to compare.'}

| Form | Perf | SEO | A11y | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
${rows.join('\n')}

Failing Lighthouse audits (mobile): ${report.lighthouse.mobile.failing.join(', ') || 'none'}

## Server
HSTS: ${report.headers.hsts ? 'yes' : '**missing**'} · compression: ${report.headers.encoding || '**none**'} · HTML cache-control: ${report.headers.cacheControl}

## Pages (${report.pages.length} in sitemap)
${pageIssues.length ? pageIssues.map((p) => `- ${p.url}: ${p.issues.join('; ')}`).join('\n') : 'No on-page issues found.'}

## Search Console
${gscMarkdown(report.gsc, previous?.gsc)}`
writeFileSync(join(reportsDir, `${today}.md`), md)
console.log(md)
