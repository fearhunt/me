// Search Console (Search Analytics API) fetcher for the weekly SEO report.
// Zero dependencies: signs the service-account JWT with node:crypto.
//
// Config (seo/config.json):
//   "gsc": { "property": "sc-domain:firhan.id", "keyFile": "~/.config/seo/gsc-key.json" }
// `property` is "sc-domain:<domain>" for a Domain property, or the full URL
// ("https://firhan.id/") for a URL-prefix property. GSC_KEY_FILE overrides keyFile.
//
// Never throws: returns { status: 'not-configured' | 'error', ... } so a missing
// key or a failed call can't break the weekly run.

import { createSign } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'
const DAYS = 28
const LAG_DAYS = 3 // Search Console data trails by 2 to 3 days
const ROW_LIMIT = 1000

const b64url = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url')
const iso = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => new Date(Date.now() - n * 24 * 3600 * 1000)

async function accessToken(key) {
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64url({ alg: 'RS256', typ: 'JWT' })}.${b64url({
    iss: key.client_email, scope: SCOPE, aud: key.token_uri, iat: now, exp: now + 3600,
  })}`
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url')
  const res = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}`,
    }),
  })
  if (!res.ok) throw new Error(`token request failed: ${res.status} ${await res.text()}`)
  return (await res.json()).access_token
}

async function query(token, property, body) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
    { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) },
  )
  if (!res.ok) throw new Error(`searchAnalytics failed: ${res.status} ${await res.text()}`)
  return (await res.json()).rows ?? []
}

const round = (n, p = 1) => Math.round(n * 10 ** p) / 10 ** p
const shape = (r) => ({
  key: r.keys?.[0], clicks: r.clicks, impressions: r.impressions, ctr: round(r.ctr * 100, 2), position: round(r.position),
})

export async function fetchGsc(config, { snapshotDir, date } = {}) {
  const cfg = config.gsc
  const keyPath = (process.env.GSC_KEY_FILE || cfg?.keyFile || '').replace(/^~/, homedir())
  if (!cfg?.property || !keyPath || !existsSync(keyPath)) return { status: 'not-configured' }

  try {
    const token = await accessToken(JSON.parse(readFileSync(keyPath, 'utf8')))
    const range = { startDate: iso(daysAgo(DAYS + LAG_DAYS)), endDate: iso(daysAgo(LAG_DAYS)) }
    const run = (dimensions) => query(token, cfg.property, { ...range, dimensions, rowLimit: ROW_LIMIT })

    const [totalRows, queries, pages] = await Promise.all([run([]), run(['query']), run(['page'])])
    const t = totalRows[0]
    const data = {
      status: 'ok', property: cfg.property, ...range,
      totals: t ? { clicks: t.clicks, impressions: t.impressions, ctr: round(t.ctr * 100, 2), position: round(t.position) } : null,
      queries: queries.map(shape), pages: pages.map(shape),
    }
    if (snapshotDir && date) {
      mkdirSync(snapshotDir, { recursive: true })
      writeFileSync(join(snapshotDir, `${date}.json`), JSON.stringify(data, null, 2) + '\n')
    }
    return data
  } catch (err) {
    return { status: 'error', message: String(err.message ?? err).slice(0, 300) }
  }
}

// Compact copy kept inside the report JSON (full rows live in the snapshot file).
export function summarizeGsc(g) {
  if (g?.status !== 'ok') return g
  const top = (rows) => rows.slice(0, 15)
  return {
    status: 'ok', property: g.property, startDate: g.startDate, endDate: g.endDate, totals: g.totals,
    topQueries: top(g.queries), topPages: top(g.pages),
    lowCtr: g.queries.filter((q) => q.impressions >= 50 && q.ctr < 2).slice(0, 10),
    nearPage1: g.queries.filter((q) => q.position >= 8 && q.position <= 20 && q.impressions >= 10).slice(0, 10),
  }
}

export function gscMarkdown(g, prev) {
  if (!g || g.status === 'not-configured') {
    return '_Not connected. Set `gsc.property` and `gsc.keyFile` in `seo/config.json` (see `seo/gsc.mjs`)._'
  }
  if (g.status === 'error') return `_Search Console fetch failed: ${g.message}_`
  if (!g.totals) return `_No Search Console data for ${g.startDate} to ${g.endDate} yet. New properties take a few days._`

  const p = prev?.status === 'ok' ? prev.totals : null
  const d = (cur, old, lowerIsBetter = false) => {
    if (old === undefined || old === null) return ''
    const diff = round(cur - old, 2)
    if (diff === 0) return ' (=)'
    return ` (${diff > 0 ? '+' : ''}${diff} ${(diff < 0) === lowerIsBetter ? '✅' : '⚠️'})`
  }
  const table = (rows) =>
    rows.length
      ? `| Item | Clicks | Impr. | CTR | Pos |\n|---|---|---|---|---|\n${rows.map((r) => `| ${r.key} | ${r.clicks} | ${r.impressions} | ${r.ctr}% | ${r.position} |`).join('\n')}`
      : '_none_'
  const t = g.totals
  return `${g.startDate} to ${g.endDate} (${g.property})

| Clicks | Impressions | CTR | Avg position |
|---|---|---|---|
| ${t.clicks}${d(t.clicks, p?.clicks)} | ${t.impressions}${d(t.impressions, p?.impressions)} | ${t.ctr}%${d(t.ctr, p?.ctr)} | ${t.position}${d(t.position, p?.position, true)} |

**Top queries**
${table(g.topQueries)}

**Top pages**
${table(g.topPages)}

**High impressions, low CTR** (50+ impressions, CTR under 2%)
${table(g.lowCtr)}

**Positions 8 to 20** (close to page 1)
${table(g.nearPage1)}
`
}
