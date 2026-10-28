<template>
  <header class="header">
    <div class="container header__inner">
      <router-link to="/" class="header__brand" :aria-label="site.name" @click="scrollTopIfSame('/')">
        {{ firstName }}<span class="header__brand-rest">{{' '}} {{ restName }}</span>
      </router-link>
      <div class="header__right">
        <nav class="header__nav" aria-label="Primary">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="header__link" @click="scrollTopIfSame(link.to)">
            {{ link.label }}
          </router-link>
        </nav>
        <button
          type="button"
          class="header__theme-toggle"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggle"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6" />
            <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <line x1="12" y1="2" x2="12" y2="4.5" />
              <line x1="12" y1="19.5" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4.5" y2="12" />
              <line x1="19.5" y1="12" x2="22" y2="12" />
              <line x1="4.9" y1="4.9" x2="6.6" y2="6.6" />
              <line x1="17.4" y1="17.4" x2="19.1" y2="19.1" />
              <line x1="4.9" y1="19.1" x2="6.6" y2="17.4" />
              <line x1="17.4" y1="6.6" x2="19.1" y2="4.9" />
            </g>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { site } from '@/content/site'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const navLinks = [
  { to: '/work', label: 'Work' },
  { to: '/writing', label: 'Writing' },
  { to: '/about', label: 'About' },
]

const [firstName, ...rest] = site.name.split(' ')
const restName = rest.join(' ')

const route = useRoute()

// Clicking a link for the page you're already on isn't a navigation, so the
// router won't scroll; do it here.
const scrollTopIfSame = (to: string) => {
  if (route.path === to) window.scrollTo({ top: 0, behavior: 'instant' })
}

const { isDark, toggle } = useTheme()
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-hairline);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-2);
  padding-bottom: var(--space-2);
  gap: var(--space-3);
}

.header__brand {
  font-family: var(--font-display);
  font-size: 1.125rem;
  color: var(--color-accent);
  font-weight: 700;
  text-decoration: none;
  letter-spacing: -0.01em;
}

.header__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header__nav {
  display: flex;
  gap: var(--space-4);
}

.header__link {
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--color-muted);
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--color-ink);
}

.header__theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid var(--color-hairline);
  border-radius: 6px;
  background: transparent;
  color: var(--color-muted);
  cursor: pointer;
}

.header__theme-toggle:hover {
  color: var(--color-ink);
  border-color: var(--color-ink);
}

@media (max-width: 480px) {
  .header__brand-rest {
    display: none;
  }

  .header__nav {
    gap: var(--space-3);
  }

  .header__link {
    font-size: 0.875rem;
  }

  .header__right {
    gap: var(--space-2);
  }
}
</style>
