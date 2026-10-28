<template>
  <article v-reveal class="entry">
    <div class="entry__head">
      <img v-if="logo" :src="logo" alt="" class="entry__logo" />
      <h3 class="entry__title">{{ title }}</h3>
      <span v-if="current" class="entry__badge">Current</span>
    </div>
    <p class="entry__meta">{{ meta }}</p>
    <p class="entry__description">{{ description }}</p>
    <ul v-if="tags.length" class="entry__tags">
      <li v-for="tag in tags" :key="tag">{{ tag }}</li>
    </ul>
    <a v-if="link" :href="link" target="_blank" rel="noopener noreferrer" class="entry__link">
      <Icon name="external-link" :size="14" />
      {{ linkLabel }}
    </a>
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
  }>(),
  {
    tags: () => [],
    link: undefined,
    linkLabel: 'View',
    logo: undefined,
    current: false,
  },
)
</script>

<style scoped>
.entry {
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-hairline);
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
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  margin-top: var(--space-2);
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--color-accent);
}

.entry__link:hover {
  text-decoration: underline;
}
</style>
