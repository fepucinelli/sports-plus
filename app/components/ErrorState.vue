<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-lg border border-brand-accent/40 bg-brand-accent/10 py-12 text-center"
  >
    <p class="font-display text-lg uppercase tracking-wide text-brand-white">{{ message }}</p>
    <button
      type="button"
      class="rounded-sm border border-brand-accent px-4 py-2 font-display text-sm uppercase tracking-wide text-brand-white/70 transition-colors hover:bg-brand-accent hover:text-brand-white"
      @click="emit('retry')"
    >
      Try again
    </button>
  </div>
</template>
