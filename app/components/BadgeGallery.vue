<script setup lang="ts">
import type { SeasonBadge } from '@/types/thesportsdb'

defineProps<{
  badges: SeasonBadge[]
}>()
</script>

<template>
  <div
    v-if="badges.length"
    class="grid grid-cols-2 gap-4 [perspective:800px] sm:grid-cols-3 lg:grid-cols-5"
  >
    <BadgeCard
      v-for="(badge, index) in badges"
      :key="badge.strSeason"
      :season="badge.strSeason"
      :badge-url="badge.strBadge"
      :index="index"
    />
  </div>
  <slot v-else name="empty" />
</template>
