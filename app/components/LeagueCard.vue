<script setup lang="ts">
import type { League } from '@/types/thesportsdb'

const props = defineProps<{
  league: League
  favorite: boolean
  index: number
}>()

const emit = defineEmits<{
  'toggle-favorite': [leagueId: string]
}>()

const href = computed(() => `/leagues/${props.league.idLeague}-${slugify(props.league.strLeague)}`)
</script>

<template>
  <article
    class="group relative flex animate-scoreboard-in flex-col gap-2 border-t-2 border-brand-accent bg-brand-bg p-4 text-brand-white ring-1 ring-inset ring-brand-gray transition-colors hover:ring-brand-accent"
    :style="{ animationDelay: `${Math.min(index, 20) * 40}ms` }"
  >
    <div class="flex items-start justify-between gap-2">
      <h3
        class="font-display text-lg uppercase leading-snug tracking-wide group-hover:text-brand-accent"
      >
        <NuxtLink :to="href" class="before:absolute before:inset-0">
          {{ league.strLeague }}
        </NuxtLink>
      </h3>
      <button
        type="button"
        class="relative z-10 flex min-h-6 min-w-6 shrink-0 items-center justify-center text-lg leading-none"
        :aria-pressed="favorite"
        :aria-label="favorite ? 'Remove from favorites' : 'Add to favorites'"
        @click="emit('toggle-favorite', league.idLeague)"
      >
        <span :class="favorite ? 'text-brand-accent' : 'text-brand-white/40'">{{
          favorite ? '★' : '☆'
        }}</span>
      </button>
    </div>
    <p class="font-mono text-sm text-brand-white/70">{{ league.strSport }}</p>
    <p v-if="league.strCountry" class="text-xs uppercase tracking-wide text-brand-white/50">
      {{ league.strCountry }}
    </p>
  </article>
</template>
