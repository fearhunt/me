<template>
  <section v-reveal class="container container--reading page">
    <h1 class="page__title">Writing</h1>
    <p class="prose">
      Nothing published yet :b
    </p>
    <p class="prose">
      If you want to know when something goes up, the fastest way is to
      <a :href="`mailto:${site.email}`">email me</a> and ask.
    </p>
  </section>
</template>

<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'
import { site } from '@/content/site'

useMeta({
  title: 'Writing',
  description: 'Notes and writing from Firhan Mahdi Ramadhani — coming soon.',
  path: '/writing',
})
</script>

<style scoped>
.page {
  padding-top: var(--space-6);
  padding-bottom: var(--space-7);
}

.page__title {
  font-size: clamp(2.75rem, 7vw, 4.25rem);
  margin-bottom: var(--space-4);
}

.prose {
  margin-top: var(--space-3);
  color: var(--color-muted);
}

.prose:first-of-type {
  margin-top: 0;
}

.prose a {
  color: var(--color-accent);
}
</style>
