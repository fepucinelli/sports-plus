<script setup lang="ts">
import type { League } from '@/types/thesportsdb'

defineProps<{
  league: League
  favorite: boolean
}>()

const emit = defineEmits<{
  'toggle-favorite': [leagueId: string]
}>()
</script>

<template>
  <div class="flex flex-wrap items-start justify-between gap-4 border-b-2 border-brand-gray pb-6">
    <div>
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-brand-white/70">
        {{ league.strCountry ? `${league.strSport} · ${league.strCountry}` : league.strSport }}
      </p>
      <h1 class="mt-1 font-display text-4xl uppercase tracking-tight text-brand-white sm:text-5xl">
        {{ league.strLeague }}
      </h1>
    </div>
    <button
      type="button"
      class="flex items-center gap-2 rounded-sm border border-brand-gray px-3 py-2 font-display text-sm uppercase tracking-wide text-brand-white transition-colors hover:border-brand-accent"
      :aria-pressed="favorite"
      @click="emit('toggle-favorite', league.idLeague)"
    >
      <span :class="favorite ? 'text-brand-accent' : 'text-brand-white/40'">{{
        favorite ? '★' : '☆'
      }}</span>
      {{ favorite ? 'Favorited' : 'Add to favorites' }}
    </button>
  </div>
</template>
