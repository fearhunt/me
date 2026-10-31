<template>
  <div class="page-root">
  <section v-reveal class="hero container">
    <div class="hero__text">
      <p class="hero__eyebrow">{{ site.role }} · {{ site.location }}</p>
      <h1 class="hero__statement">
        <span class="hero__line">I build things</span>
        <em class="hero__line">people actually use.</em>
      </h1>
      <p class="hero__who">
        I start by talking to the people who'll use it, then build it collaboratively.
      </p>
      <div class="hero__links">
        <a :href="`mailto:${site.email}`">Email</a>
        <a :href="site.links.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a :href="site.links.cv" target="_blank" rel="noopener noreferrer">Download CV</a>
      </div>
    </div>
    <figure class="hero__figure" aria-hidden="true">
      <img :src="portrait" alt="" width="720" height="720" decoding="async" />
    </figure>
  </section>

  <section class="section container" aria-labelledby="work-heading">
    <div v-reveal class="section__head">
      <h2 id="work-heading" class="section__title">Selected work</h2>
      <router-link to="/work" class="section__all">See everything →</router-link>
    </div>
    <div class="entries">
      <WorkEntry
        v-for="item in selected"
        :key="item.data.slug"
        :title="item.kind === 'experience' ? item.data.org : item.data.title"
        :meta="
          item.kind === 'experience'
            ? `${item.data.role} · ${item.data.period}`
            : item.data.period
        "
        :description="item.kind === 'experience' ? item.data.summary : item.data.description"
        :tags="item.data.tags"
        :current="item.kind === 'experience' ? item.data.current : false"
        :logo="item.data.logo"
        :link="item.data.link"
        :link-label="item.data.linkLabel"
        :screenshot="item.data.screenshot"
        :to="hasDetail(item.data.slug) ? `/work/${item.data.slug}` : undefined"
      />
    </div>
  </section>

  <!-- <section v-reveal class="section container container--reading" aria-labelledby="currently-heading">
    <h2 id="currently-heading" class="section__title">Currently exploring</h2>
    <p class="prose">
      Outside of client work, I spend time on learning!. I'm also slowly turning Rakit Kala Teknologi from
      a side project into a real company.
    </p>
  </section> -->

  <section v-reveal class="section container container--reading writing-teaser" aria-labelledby="writing-heading">
    <h2 id="writing-heading" class="section__title">Writing</h2>
    <p class="prose">
      I haven't published anything here yet, but this space is reserved for whatever
      is worth writing down!
    </p>
    <router-link to="/writing" class="section__all">Visit Writing →</router-link>
  </section>
  </div>
</template>

<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'
import { site } from '@/content/site'
import { experience } from '@/content/experience'
import { projects } from '@/content/projects'
import { hasDetail } from '@/content/detail'
import WorkEntry from '@/components/WorkEntry.vue'
import portrait from '@/assets/portrait.webp'

useMeta({
  title: `${site.name} — Product Engineer`,
  description:
    'Firhan Mahdi Ramadhani is a product engineer from Yogyakarta, Indonesia, working across product definition, frontend, full-stack, and infrastructure.',
  path: '/',
})

const selected = [
  { kind: 'experience' as const, data: experience.find((e) => e.slug === 'accu3dx')! },
  { kind: 'experience' as const, data: experience.find((e) => e.slug === 'privyid')! },
  { kind: 'experience' as const, data: experience.find((e) => e.slug === 'beprofesion')! },
  { kind: 'project' as const, data: projects.find((p) => p.slug === 'baca-kakatua')! },
]
</script>

<style scoped>
.hero {
  --photo: 15rem;
  --gap: var(--space-4);
  container-type: inline-size;
  display: grid;
  grid-template-columns: 1fr minmax(0, var(--photo));
  gap: var(--gap);
  align-items: center;
  padding-top: var(--space-6);
  padding-bottom: var(--space-6);
}

.hero__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted);
}

/* Sized from the text column's width so the two lines always fit: the longer
   line, "people actually use.", is about 6.8 times the font size wide. */
.hero__statement {
  margin-top: var(--space-2);
  font-size: clamp(2rem, calc((100cqi - var(--photo) - var(--gap)) / 6.8), 8.5rem);
  letter-spacing: -0.035em;
  line-height: 0.95;
}

.hero__line {
  display: block;
}

.hero__statement em {
  font-style: italic;
  color: var(--color-accent);
}

.hero__who {
  margin-top: var(--space-4);
  max-width: 30rem;
  font-size: 1.125rem;
  color: var(--color-muted);
}

.hero__figure {
  position: relative;
  margin: 0;
  aspect-ratio: 1;
  transform: rotate(3deg);
}

.hero__figure::before {
  content: '';
  position: absolute;
  inset: 0;
  transform: translate(0.75rem, 0.75rem);
  border-radius: 1.5rem;
  background: var(--color-accent);
}

.hero__figure img {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.5rem;
  background: var(--color-surface);
}

@media (max-width: 56rem) {
  .hero {
    --photo: 0rem;
    --gap: 0rem;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .hero__figure {
    width: 12rem;
    order: -1;
  }
}

.hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.hero__links a {
  text-decoration: none;
  font-size: 0.95rem;
  color: var(--color-accent);
}

.hero__links a:hover {
  text-decoration: underline;
}

.section {
  padding-top: var(--space-6);
}

.section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.section__title {
  font-size: 1.5rem;
}

.section__all {
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--color-accent);
  white-space: nowrap;
}

.section__all:hover {
  text-decoration: underline;
}

.entries {
  margin-top: var(--space-3);
}

.prose {
  margin-top: var(--space-2);
  max-width: 40rem;
}

.writing-teaser {
  padding-bottom: var(--space-6);
}

.writing-teaser .section__all {
  display: inline-block;
  margin-top: var(--space-3);
}
</style>
