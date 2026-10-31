import { experience } from './experience'
import { projects } from './projects'
import type { GalleryImage, TocItem } from './types'

interface CompiledMarkdown {
  html: string
  toc: TocItem[]
}

// Drop `<slug>.md` into content/projects/ or content/experience/ to give that
// entry a breakdown page at /work/<slug>. Entries without one stay plain.
const files = import.meta.glob<CompiledMarkdown>(
  ['./projects/*.md', './experience/*.md'],
  { eager: true },
)

const bodies = new Map<string, CompiledMarkdown>()
for (const [path, mod] of Object.entries(files)) {
  bodies.set(path.split('/').pop()!.replace(/\.md$/, ''), mod)
}

export interface WorkDetail {
  slug: string
  title: string
  meta: string
  summary: string
  tags: string[]
  link?: string
  linkLabel?: string
  screenshot?: string
  gallery: GalleryImage[]
  html: string
  toc: TocItem[]
}

export const detailSlugs = [...bodies.keys()]

export const hasDetail = (slug: string) => bodies.has(slug)

export function getDetail(slug: string): WorkDetail | undefined {
  const body = bodies.get(slug)
  if (!body) return undefined

  const job = experience.find((e) => e.slug === slug)
  if (job) {
    return {
      slug,
      title: job.org,
      meta: `${job.role} · ${job.location} · ${job.period}`,
      summary: job.summary,
      tags: job.tags,
      link: job.link,
      linkLabel: job.linkLabel,
      screenshot: job.screenshot,
      gallery: job.gallery ?? [],
      ...body,
    }
  }

  const project = projects.find((p) => p.slug === slug)
  if (!project) return undefined
  return {
    slug,
    title: project.title,
    meta: project.period,
    summary: project.description,
    tags: project.tags,
    link: project.link,
    linkLabel: project.linkLabel,
    screenshot: project.screenshot,
    gallery: project.gallery ?? [],
    ...body,
  }
}
