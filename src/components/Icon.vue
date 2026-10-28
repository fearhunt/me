<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path v-for="d in paths" :key="d" :d="d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ICONS, type IconName } from '@/icons'

const props = withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 16 })
const paths = computed(() => ICONS[props.name])
</script>

<style scoped>
.icon {
  stroke: currentColor;
  vertical-align: -0.15em;
  flex-shrink: 0;
}
</style>
