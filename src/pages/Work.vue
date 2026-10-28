<template>
  <div class="page-root">
  <section v-reveal class="page-head container container--reading">
    <h1 class="page-head__title">Work</h1>
    <p class="page-head__lede">
      Roles and projects, roughly in order. Not every technology I've touched, just what
      actually mattered.
    </p>
  </section>

  <section class="section container" aria-labelledby="experience-heading">
    <h2 id="experience-heading" v-reveal class="section__title">Experience</h2>
    <div class="entries">
      <WorkEntry
        v-for="item in experience"
        :key="item.slug"
        :title="item.org"
        :meta="`${item.role} · ${item.location} · ${item.period}`"
        :description="item.summary"
        :tags="item.tags"
        :current="item.current"
        :logo="item.logo"
        :link="item.link"
        :link-label="item.linkLabel"
      />
    </div>
  </section>

  <section class="section container" aria-labelledby="projects-heading">
    <h2 id="projects-heading" v-reveal class="section__title">Projects</h2>
    <div class="entries">
      <WorkEntry
        v-for="item in projects"
        :key="item.slug"
        :title="item.title"
        :meta="item.period"
        :description="`${item.description} ${item.role}`"
        :tags="item.tags"
        :logo="item.logo"
        :link="item.link"
        :link-label="item.linkLabel"
      />
    </div>
  </section>
  </div>
</template>

<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'
import { experience } from '@/content/experience'
import { projects } from '@/content/projects'
import WorkEntry from '@/components/WorkEntry.vue'

useMeta({
  title: 'Work',
  description:
    "A record of Firhan Mahdi Ramadhani's professional experience and personal projects — frontend, full-stack, and mobile work.",
  path: '/work',
})
</script>

<style scoped>
.page-head {
  padding-top: var(--space-6);
}

.page-head__title {
  font-size: clamp(2.75rem, 7vw, 4.25rem);
}

.page-head__lede {
  margin-top: var(--space-2);
  color: var(--color-muted);
}

.section {
  padding-top: var(--space-6);
  padding-bottom: var(--space-2);
}

.section__title {
  font-size: 1.5rem;
}

.entries {
  margin-top: var(--space-3);
}
</style>
