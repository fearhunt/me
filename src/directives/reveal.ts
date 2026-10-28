import type { Directive } from 'vue'

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: '0px 0px -8% 0px',
}

function supportsObserver() {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window
}

export const reveal: Directive<HTMLElement> = {
  mounted(el) {
    if (!supportsObserver()) return

    el.classList.add('reveal')

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible')
          observer.unobserve(entry.target)
        }
      }
    }, OBSERVER_OPTIONS)

    observer.observe(el)
  },
}
