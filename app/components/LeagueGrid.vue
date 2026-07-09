<script setup lang="ts">
import type { League } from '@/types/thesportsdb'

defineProps<{
  leagues: League[]
  isFavorite: (leagueId: string) => boolean
}>()

const emit = defineEmits<{
  'toggle-favorite': [leagueId: string]
}>()
</script>

<template>
  <div
    v-if="leagues.length"
    class="grid grid-cols-1 gap-4 [perspective:800px] sm:grid-cols-2 lg:grid-cols-4"
  >
    <LeagueCard
      v-for="(league, index) in leagues"
      :key="league.idLeague"
      :league="league"
      :favorite="isFavorite(league.idLeague)"
      :index="index"
      @toggle-favorite="emit('toggle-favorite', $event)"
    />
  </div>
  <slot v-else name="empty" />
</template>
