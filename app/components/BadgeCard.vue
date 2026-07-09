<script setup lang="ts">
const props = defineProps<{
  season: string
  badgeUrl: string | null
  index: number
}>()
</script>

<template>
  <figure
    class="flex animate-scoreboard-in flex-col items-center gap-2 border-t-2 border-brand-accent bg-brand-bg p-4 ring-1 ring-inset ring-brand-gray transition-colors hover:ring-brand-accent"
    :style="{ animationDelay: `${Math.min(props.index, 24) * 30}ms` }"
  >
    <img
      v-if="badgeUrl"
      :src="badgeUrl"
      :alt="`Badge for the ${season} season`"
      width="120"
      height="120"
      :loading="index < 5 ? 'eager' : 'lazy'"
      :fetchpriority="index === 0 ? 'high' : undefined"
      class="h-[120px] w-[120px] object-contain"
    />
    <div v-else class="flex h-[120px] w-[120px] items-center justify-center text-brand-white/30">
      No badge
    </div>
    <figcaption class="font-mono text-xs uppercase tracking-widest text-brand-white/70">
      {{ season }}
    </figcaption>
  </figure>
</template>
