import { useHead } from '@unhead/vue'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { site } from '@/content/site'

export interface MetaOptions {
  title: string
  description: string
  path: string
}

export function useMeta(options: MaybeRefOrGetter<MetaOptions>) {
  const resolved = computed(() => toValue(options))

  useHead(() => {
    const { title, description, path } = resolved.value
    const fullTitle = path === '/' ? title : `${title} — ${site.name}`
    const url = `${site.url}${path}`

    return {
      title: fullTitle,
      link: [{ rel: 'canonical', href: url }],
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
      ],
    }
  })
}
