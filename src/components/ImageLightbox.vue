<template>
  <dialog
    ref="dialog"
    class="lightbox"
    :class="{ 'lightbox--closing': closing }"
    aria-label="Screenshot viewer"
    @click="onDialogClick"
    @cancel.prevent="close"
    @keydown.left.prevent="step(-1)"
    @keydown.right.prevent="step(1)"
  >
    <transition :name="`slide-${direction > 0 ? 'next' : 'prev'}`" mode="out-in">
      <figure v-if="image" :key="current" class="lightbox__figure">
        <img :src="image.src" :alt="image.alt" />
        <figcaption v-if="image.caption">{{ image.caption }}</figcaption>
      </figure>
    </transition>
    <div class="lightbox__controls">
      <span class="lightbox__count">{{ current + 1 }} / {{ images.length }}</span>
      <button type="button" aria-label="Previous screenshot" @click="step(-1)">←</button>
      <button type="button" aria-label="Next screenshot" @click="step(1)">→</button>
      <button type="button" aria-label="Close" @click="close">✕</button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GalleryImage } from '@/content/types'

const props = defineProps<{ images: GalleryImage[] }>()

const dialog = ref<HTMLDialogElement>()
const current = ref(0)
const direction = ref(1)

// Kept after closing so the image doesn't vanish mid fade-out.
const image = computed(() => props.images[current.value])

function open(index: number) {
  current.value = index
  dialog.value?.showModal()
}

function step(delta: number) {
  const count = props.images.length
  if (!count) return
  direction.value = delta
  current.value = (current.value + delta + count) % count
}

// Closing is driven from here rather than by the browser: dialog.close() takes
// the dialog out of the top layer immediately in Safari and Firefox, which
// would cut the exit animation short. Esc is routed here through @cancel.
const closing = ref(false)

function close() {
  const el = dialog.value
  if (!el?.open || closing.value) return
  closing.value = true
  setTimeout(() => {
    el.close()
    closing.value = false
  }, 250)
}

// A click on the backdrop lands on the <dialog> element itself.
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}

defineExpose({ open })
</script>

<style scoped>
.lightbox {
  width: min(92vw, 70rem);
  max-height: 92vh;
  padding: var(--space-2);
  overflow: hidden;
  border: 1px solid var(--color-hairline);
  border-radius: 1rem;
  background: var(--color-bg);
  color: var(--color-ink);

  /* Fades and rises in via @starting-style, and back out via --closing. */
  opacity: 1;
  transform: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.lightbox--closing {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

@starting-style {
  .lightbox[open] {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
}

.lightbox::backdrop {
  background: rgb(0 0 0 / 0.7);
  transition: background-color 0.25s ease;
}

.lightbox--closing::backdrop {
  background: rgb(0 0 0 / 0);
}

@starting-style {
  .lightbox[open]::backdrop {
    background: rgb(0 0 0 / 0);
  }
}

.lightbox__figure {
  margin: 0;
}

.lightbox__figure img {
  width: 100%;
  max-height: 76vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox__figure figcaption {
  margin-top: var(--space-1);
  font-size: 0.9rem;
  color: var(--color-muted);
}

/* Slide between images; the direction follows the button pressed. */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.slide-next-enter-from,
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(2rem);
}

.slide-next-leave-to,
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-2rem);
}

.lightbox__controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-1);
  margin-top: var(--space-1);
}

.lightbox__count {
  margin-right: auto;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-muted);
}

.lightbox__controls button {
  min-width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--color-hairline);
  border-radius: 999px;
  background: var(--color-surface);
  cursor: pointer;
}

.lightbox__controls button:hover {
  border-color: var(--color-accent);
}
</style>
