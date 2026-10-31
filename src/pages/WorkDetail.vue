<template>
  <div v-if="detail" class="page container">
    <router-link to="/work" class="back">
      <Icon name="arrow-right" :size="16" class="back__icon" />
      Back to work
    </router-link>

    <header class="head">
      <p class="head__meta">{{ detail.meta }}</p>
      <h1 class="head__title">{{ detail.title }}</h1>
      <p class="head__summary">{{ detail.summary }}</p>
      <ul v-if="detail.tags.length" class="head__tags">
        <li v-for="tag in detail.tags" :key="tag">{{ tag }}</li>
      </ul>
      <a
        v-if="detail.link"
        :href="detail.link"
        target="_blank"
        rel="noopener noreferrer"
        class="button"
      >
        {{ detail.linkLabel ?? 'Visit Project' }}
        <Icon name="external-link" :size="14" />
      </a>
    </header>

    <img
      v-if="detail.screenshot"
      :src="detail.screenshot"
      :alt="`${detail.title} screenshot`"
      class="hero"
    />

    <div class="layout">
      <article class="article">
        <div class="prose" v-html="detail.html" />

        <section v-if="detail.gallery.length" aria-labelledby="gallery">
          <h2 id="gallery" class="gallery__title">Gallery</h2>
          <ul class="gallery">
            <li v-for="(image, i) in detail.gallery" :key="image.src">
              <button type="button" class="gallery__item" @click="lightbox?.open(i)">
                <img :src="image.src" :alt="image.alt" loading="lazy" />
                <span v-if="image.caption" class="gallery__caption">{{ image.caption }}</span>
              </button>
            </li>
          </ul>
        </section>
      </article>

      <aside
        v-if="toc.length"
        class="toc"
        aria-labelledby="toc-title"
        :style="headerHeight ? { '--header-h': `${headerHeight}px` } : undefined"
      >
        <p id="toc-title" class="toc__title">Contents</p>
        <button
          type="button"
          class="toc__toggle"
          :aria-expanded="tocOpen"
          aria-controls="toc-panel"
          @click="tocOpen = !tocOpen"
        >
          <span class="toc__toggle-label">Contents</span>
          <span class="toc__toggle-current">{{ activeText }}</span>
          <Icon name="arrow-right" :size="14" class="toc__chevron" />
        </button>
        <div id="toc-panel" class="toc__panel" :class="{ 'toc__panel--open': tocOpen }">
        <nav>
          <router-link
            v-for="item in toc"
            :key="item.id"
            :to="{ hash: `#${item.id}` }"
            class="toc__link"
            :class="{
              'toc__link--sub': item.level === 3,
              'toc__link--active': activeId === item.id,
            }"
            replace
            @click="tocOpen = false"
          >
            {{ item.text }}
          </router-link>
        </nav>
        </div>
      </aside>
    </div>

    <ImageLightbox v-if="detail.gallery.length" ref="lightbox" :images="detail.gallery" />
  </div>

  <section v-else class="container container--reading page">
    <h1 class="head__title">Not found</h1>
    <p class="head__summary">There is no write-up for that one yet.</p>
    <router-link to="/work" class="back">← Back to work</router-link>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/Icon.vue'
import ImageLightbox from '@/components/ImageLightbox.vue'
import { useMeta } from '@/composables/useMeta'
import { getDetail } from '@/content/detail'
import type { TocItem } from '@/content/types'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const detail = computed(() => getDetail(slug.value))

useMeta(() => ({
  title: detail.value?.title ?? 'Not found',
  description: detail.value?.summary ?? 'This write-up does not exist.',
  path: `/work/${slug.value}`,
}))

const toc = computed<TocItem[]>(() => {
  if (!detail.value) return []
  const items = [...detail.value.toc]
  if (detail.value.gallery.length) items.push({ id: 'gallery', text: 'Gallery', level: 2 })
  return items
})

// Scroll-spy: the active heading is the last one that has scrolled past the header.
const activeId = ref('')
const activeText = computed(() => toc.value.find((i) => i.id === activeId.value)?.text ?? '')
const tocOpen = ref(false)

// The glossary bar sticks right below the header, whatever height that ends up.
const headerHeight = ref(0)
const measureHeader = () => {
  headerHeight.value = document.querySelector('.header')?.getBoundingClientRect().height ?? 0
}
let frame = 0

function updateActive() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    let active = ''
    for (const item of toc.value) {
      const el = document.getElementById(item.id)
      if (el && el.getBoundingClientRect().top <= 160) active = item.id
    }
    activeId.value = active || toc.value[0]?.id || ''
  })
}

onMounted(() => {
  window.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('resize', measureHeader)
  measureHeader()
  updateActive()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActive)
  window.removeEventListener('resize', measureHeader)
  cancelAnimationFrame(frame)
})

const lightbox = ref<InstanceType<typeof ImageLightbox>>()

watch(slug, updateActive)
</script>

<style scoped>
.page {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  color: var(--color-muted);
  text-decoration: none;
  font-size: 0.95rem;
}

.back:hover {
  color: var(--color-ink);
}

.back__icon {
  transform: scaleX(-1);
}

.head {
  margin-top: var(--space-4);
  max-width: 52rem;
}

.head__meta {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted);
}

.head__title {
  margin-top: var(--space-1);
  font-size: clamp(2.75rem, 7vw, 4.5rem);
}

.head__summary {
  margin-top: var(--space-3);
  font-size: 1.25rem;
  color: var(--color-muted);
}

.head__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: var(--space-3);
  list-style: none;
}

.head__tags li {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-muted);
  border: 1px solid var(--color-hairline);
  border-radius: 3px;
  padding: 0.15em 0.55em;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  margin-top: var(--space-3);
  padding: 0.7em 1.4em;
  border: 1px solid var(--color-hairline);
  border-radius: 999px;
  background: var(--color-surface);
  text-decoration: none;
}

.button:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.hero {
  width: 100%;
  margin-top: var(--space-5);
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 1.25rem;
  border: 1px solid var(--color-hairline);
  background: var(--color-surface);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 15rem;
  gap: var(--space-6);
  align-items: start;
  margin-top: var(--space-6);
}

.article {
  max-width: 46rem;
}

/* Markdown output arrives through v-html, so it needs :deep(). */
.prose :deep(h2),
.gallery__title {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: -0.02em;
  font-size: 2.25rem;
  line-height: 1.1;
  margin: var(--space-6) 0 var(--space-2);
  scroll-margin-top: var(--anchor-offset, 6rem);
}

.prose :deep(h2:first-child) {
  margin-top: 0;
}

.prose :deep(h3) {
  font-size: 1.25rem;
  margin: var(--space-4) 0 var(--space-1);
  scroll-margin-top: var(--anchor-offset, 6rem);
}

.prose :deep(p),
.prose :deep(ul),
.prose :deep(ol),
.prose :deep(blockquote),
.prose :deep(pre) {
  margin: var(--space-2) 0 0;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.5rem;
}

.prose :deep(li) {
  margin-top: 0.4rem;
}

.prose :deep(a) {
  color: var(--color-accent);
}

.prose :deep(blockquote) {
  padding-left: var(--space-2);
  border-left: 3px solid var(--color-accent);
  color: var(--color-muted);
}

.prose :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-surface);
  border-radius: 3px;
  padding: 0.1em 0.35em;
}

.prose :deep(pre) {
  overflow-x: auto;
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
}

.prose :deep(pre code) {
  background: none;
  padding: 0;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--space-2);
  list-style: none;
}

.gallery__item {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: zoom-in;
}

.gallery__item img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--color-hairline);
  background: var(--color-surface);
}

.gallery__item:hover img {
  border-color: var(--color-accent);
}

.gallery__caption {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.toc {
  position: sticky;
  top: 6rem;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
}

.toc__title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted);
  margin-bottom: var(--space-2);
}

.toc__toggle {
  display: none;
}

.toc__panel {
  display: grid;
}

.toc nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.toc__link {
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  color: var(--color-muted);
  text-decoration: none;
  font-size: 0.95rem;
  line-height: 1.35;
}

.toc__link--sub {
  padding-left: 1.5rem;
}

.toc__link:hover {
  color: var(--color-ink);
}

.toc__link--active {
  background: var(--color-surface);
  color: var(--color-ink);
}

@media (max-width: 62rem) {
  .page {
    --anchor-offset: 9rem; /* header + sticky glossary bar */
  }

  .layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  .article {
    padding-top: var(--space-4);
  }

  /* On narrow screens the glossary becomes a full-width bar that sticks
     below the header and drops its list down on tap. */
  .toc {
    position: sticky;
    top: var(--header-h, 4.3rem);
    z-index: 40;
    order: -1;
    max-height: none;
    overflow: visible;
    margin: 0 calc(-1 * var(--space-3));
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-hairline);
  }

  .toc__title {
    display: none;
  }

  .toc__toggle {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: 0.8rem var(--space-3);
    border: 0;
    background: none;
    text-align: left;
    cursor: pointer;
  }

  .toc__toggle-label {
    flex: none;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-muted);
  }

  .toc__toggle-current {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.95rem;
  }

  .toc__chevron {
    flex: none;
    transform: rotate(90deg);
    transition: transform 0.25s ease;
  }

  .toc__toggle[aria-expanded='true'] .toc__chevron {
    transform: rotate(-90deg);
  }

  /* The list overlays the article. visibility keeps closed links out of the tab order. */
  .toc__panel {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: calc(100vh - var(--header-h, 4.3rem) - 4rem);
    overflow-y: auto;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-hairline);
    box-shadow: 0 14px 24px rgb(0 0 0 / 0.1);
    opacity: 0;
    transform: translateY(-8px);
    visibility: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
  }

  .toc__panel--open {
    opacity: 1;
    transform: none;
    visibility: visible;
  }

  .toc nav {
    padding: 0.25rem var(--space-2) var(--space-2);
  }
}
</style>
