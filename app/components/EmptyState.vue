<script setup lang="ts">
defineProps<{
  title: string
  message?: string
}>()
</script>

<template>
  <div
    class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-brand-gray py-16 text-center"
  >
    <p class="font-display text-xl uppercase tracking-wide text-brand-white">{{ title }}</p>
    <p v-if="message" class="text-sm text-brand-white/60">{{ message }}</p>
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
