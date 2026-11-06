<template>
  <section class="container container--reading page">
    <header class="page__head">
      <h1 class="page__title">About</h1>
      <figure class="portrait" aria-hidden="true">
        <img :src="portrait" alt="" width="720" height="720" decoding="async" />
      </figure>
    </header>

    <p class="prose">
      Most of my projects start with a conversation — with whoever will actually use the thing.
      Then I build it. The longer I do this, the more the interesting problems
      turn out to live: how a system holds up under real load, how a verification
      flow fails gracefully, how a team keeps shipping without stepping on each other
      how a system <strong>should works fit with the actual use</strong>.
    </p>

    <h2 v-reveal class="page__subtitle">Where I've worked</h2>
    <ul v-reveal class="rows">
      <li v-for="job in jobs" :key="job.slug" class="rows__item">
        <span class="rows__name">
          {{ job.org }}
          <span class="rows__role">{{ job.role }}</span>
        </span>
        <span class="rows__date">{{ job.period }}</span>
      </li>
    </ul>

    <div v-reveal>
      <div>
        <h2 class="page__subtitle">How I work</h2>
        <p class="prose">
          I'd rather refactor something slow than add a feature on top of it. I build from small,
          reusable pieces, shared workflows, and clear concepts so there are fewer
          surprises six months later. And a lot of "technical" problems are really communication
          problems: a weekly sync and asking the obvious question early beat most framework
          choices.
        </p>
      </div>
      <!-- <div>
        <h2 class="page__subtitle">Exploring now</h2>
        <p class="prose">
          Go, React Native, and the DevOps and AI engineering side of building software, plus
          turning <strong>Rakit Kala Teknologi</strong>, my own technology company, from a side
          project into something real.
        </p>
      </div> -->
    </div>

    <h2 v-reveal class="page__subtitle">Along the way</h2>
    <ul v-reveal class="rows">
      <li v-for="award in awards" :key="award.name" class="rows__item">
        <span class="rows__award">
          <img v-if="award.screenshot" :src="award.screenshot" :alt="`${award.name} screenshot`" class="rows__thumb" loading="lazy" />
          <a v-if="award.link" :href="award.link" target="_blank" rel="noopener noreferrer" class="rows__name rows__name--link">
            {{ award.name }}
            <Icon name="external-link" :size="12" />
          </a>
          <span v-else class="rows__name">{{ award.name }}</span>
        </span>
        <span class="rows__date">{{ award.date }}</span>
      </li>
    </ul>

    <div v-reveal class="closing">
      <h2 class="page__subtitle">Say hi~!</h2>
      <div class="closing__links">
        <a :href="`mailto:${site.email}`">Email</a>
        <a :href="site.links.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a :href="site.links.cv" target="_blank" rel="noopener noreferrer">Download CV</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'
import { site } from '@/content/site'
import { experience } from '@/content/experience'
import Icon from '@/components/Icon.vue'
import portrait from '@/assets/portrait.webp'

useMeta({
  title: 'About',
  description:
    "Background on Firhan Mahdi Ramadhani — how he got into product engineering, how he works, and what he's exploring now.",
  path: '/about',
})

// "April 2026 — Current" -> "Apr 2026 — Now"
const shortPeriod = (period: string) =>
  period.replace(/([A-Z][a-z]{2})[a-z]*/g, (word, abbr) => (word === 'Current' ? 'Now' : abbr))

const jobs = experience.map(({ slug, org, role, period }) => ({
  slug,
  org,
  role,
  period: shortPeriod(period),
}))

// TODO(firhan): this page sticks to what's verifiable from your CV and public
// record. Add a short paragraph here about personal interests / life outside
// work if you want the page to feel more rounded — things like what you do
// for fun, hobbies, or anything else that isn't a professional credential.
const awards: { name: string; date: string; link?: string; screenshot?: string }[] = [
  { name: '2nd Winner, National Hackathon HackBiz — 180DC UGM', date: 'August 2021' },
  { name: '2nd Winner, National Hackathon Technoscape 4.0', date: 'July 2021' },
  { name: 'Finalist, NextDev Summit Hackathon', date: 'November 2020' },
  { name: 'MURI Awardee — Most Digital Collage with LED Lamps', date: 'August 2020' },
]
</script>

<style scoped>
.page {
  padding-top: var(--space-6);
  padding-bottom: var(--space-7);
}

.page__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.page__title {
  font-size: clamp(3rem, 9vw, 5rem);
}

/* Same tilt and offset shadow as the Home hero. */
.portrait {
  position: relative;
  flex: none;
  margin: 0;
  width: clamp(7rem, 26vw, 11rem);
  aspect-ratio: 1;
  transform: rotate(3deg);
}

.portrait::before {
  content: '';
  position: absolute;
  inset: 0;
  transform: translate(0.5rem, 0.5rem);
  border-radius: 1.25rem;
  background: var(--color-accent);
}

.portrait img {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.25rem;
  background: var(--color-surface);
}

.page__subtitle {
  font-size: 1.375rem;
  margin-top: var(--space-5);
  margin-bottom: var(--space-2);
}

.prose {
  margin-top: var(--space-3);
}

.prose:first-of-type {
  margin-top: 0;
}

.rows {
  list-style: none;
  margin-top: var(--space-2);
}

.rows__item {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-hairline);
  font-size: 0.95rem;
}

.rows__role {
  display: block;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.rows__award {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.rows__thumb {
  flex: none;
  width: 3.5rem;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--color-hairline);
}

.rows__name--link {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  color: var(--color-accent);
  text-decoration: none;
}

.rows__name--link:hover {
  text-decoration: underline;
}

.rows__date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--color-muted);
  white-space: nowrap;
}

.closing__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.closing__links a {
  text-decoration: none;
  font-size: 0.95rem;
  color: var(--color-accent);
}

.closing__links a:hover {
  text-decoration: underline;
}

@media (max-width: 40rem) {
  .rows__item {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
