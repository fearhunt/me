<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__meta">© {{ year }} {{ site.fullName }}</p>
      <div class="footer__links">
        <a :href="`mailto:${site.email}`">Email</a>
        <a :href="site.links.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a :href="site.links.cv" target="_blank" rel="noopener noreferrer">CV</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { site } from '@/content/site'

const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--color-hairline);
  margin-top: var(--space-7);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding-top: var(--space-3);
  padding-bottom: var(--space-4);
  font-size: 0.875rem;
  color: var(--color-muted);
}

.footer__links {
  display: flex;
  gap: var(--space-3);
}

.footer__links a {
  text-decoration: none;
  color: var(--color-muted);
}

.footer__links a:hover {
  color: var(--color-ink);
}
</style>
