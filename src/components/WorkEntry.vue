<template>
  <article v-reveal class="entry" :class="{ 'entry--clickable': to, 'entry--shot': screenshot }">
    <div class="entry__body">
      <div class="entry__head">
        <img v-if="logo" :src="logo" alt="" class="entry__logo" />
        <h3 class="entry__title">
          <router-link v-if="to" :to="to" class="entry__title-link">{{ title }}</router-link>
          <template v-else>{{ title }}</template>
        </h3>
        <span v-if="current" class="entry__badge">Current</span>
      </div>
      <p class="entry__meta">{{ meta }}</p>
      <p class="entry__description">{{ description }}</p>
      <ul v-if="tags.length" class="entry__tags">
        <li v-for="tag in tags" :key="tag">{{ tag }}</li>
      </ul>
      <div v-if="link || to" class="entry__actions">
        <a v-if="link" :href="link" target="_blank" rel="noopener noreferrer" class="entry__link">
          <Icon name="external-link" :size="14" />
          {{ linkLabel }}
        </a>
        <span v-if="to" class="entry__more" aria-hidden="true">
          Read breakdown
          <Icon name="arrow-right" :size="14" />
        </span>
      </div>
    </div>
    <img
      v-if="screenshot"
      :src="screenshot"
      :alt="`${title} screenshot`"
      class="entry__shot"
      loading="lazy"
    />
  </article>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon.vue'

withDefaults(
  defineProps<{
    title: string
    meta: string
    description: string
    tags?: string[]
    link?: string
    linkLabel?: string
    logo?: string
    current?: boolean
    screenshot?: string
    to?: string
  }>(),
  {
    tags: () => [],
    link: undefined,
    linkLabel: 'View',
    logo: undefined,
    current: false,
    screenshot: undefined,
    to: undefined,
  },
)
</script>

<style scoped>
.entry {
  position: relative;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-hairline);
}

.entry--shot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 12rem;
  gap: var(--space-3);
  align-items: start;
}

.entry__shot {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--color-hairline);
  background: var(--color-surface);
}

/* The title link stretches over the whole card; the external link sits above it. */
.entry__title-link {
  text-decoration: none;
}

.entry__title-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.entry--clickable:hover .entry__title-link {
  color: var(--color-accent);
}

.entry__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.entry__more {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  font-size: 0.9rem;
  color: var(--color-muted);
}

.entry--clickable:hover .entry__more {
  color: var(--color-accent);
}

@media (max-width: 40rem) {
  .entry--shot {
    grid-template-columns: 1fr;
  }

  .entry__shot {
    order: -1;
  }
}

.entry__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.entry__logo {
  width: 1.75rem;
  height: 1.75rem;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid var(--color-hairline);
  background: var(--color-surface);
  padding: 0.15rem;
}

.entry__title {
  font-size: 1.25rem;
}

.entry__badge {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: 3px;
  padding: 0.1em 0.5em;
}

.entry__meta {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--color-muted);
  margin-top: var(--space-1);
}

.entry__description {
  margin-top: var(--space-2);
  max-width: 40rem;
  color: var(--color-ink);
}

.entry__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: var(--space-2);
  list-style: none;
}

.entry__tags li {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-muted);
  border: 1px solid var(--color-hairline);
  border-radius: 3px;
  padding: 0.15em 0.55em;
}

.entry__link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--color-accent);
}

.entry__link:hover {
  text-decoration: underline;
}
</style>
