<template>
  <section class="container container--reading page">
    <h1 class="page__title">Page not found</h1>
    <p class="prose">There's nothing here. <router-link to="/">Back home →</router-link></p>
  </section>
</template>

<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'

useMeta({
  title: 'Page not found',
  description: 'This page does not exist.',
  path: '/404',
})
</script>

<style scoped>
.page {
  padding-top: var(--space-6);
  padding-bottom: var(--space-7);
}

.page__title {
  font-size: clamp(2rem, 5vw, 2.75rem);
  margin-bottom: var(--space-3);
}

.prose a {
  color: var(--color-accent);
}
</style>
