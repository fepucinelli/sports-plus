<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)

const {
  leagues,
  isLoading: leaguesLoading,
  error: leaguesError,
  reload: reloadLeagues,
} = useLeagues()
const league = computed(() => leagues.value.find((l) => l.idLeague === id.value))

const {
  badges,
  isLoading: badgesLoading,
  error: badgesError,
  reload: reloadBadges,
} = useLeagueBadges(id)

const favoritesStore = useFavoritesStore()

useSeoMeta({
  title: () => (league.value ? `${league.value.strLeague} — Sports+` : 'League — Sports+'),
  description: () =>
    league.value
      ? `Explore ${league.value.strLeague}'s badge and crest history across every season.`
      : 'Explore this league’s badge and crest history across every season.',
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
    <div aria-live="polite">
      <SkeletonLoader v-if="leaguesLoading && !league" variant="grid" :count="1" />
      <ErrorState v-else-if="leaguesError" :message="leaguesError" @retry="reloadLeagues" />
      <ErrorState
        v-else-if="!league"
        message="We couldn't find that league."
        @retry="reloadLeagues"
      />
      <LeagueDetailHeader
        v-else
        :league="league"
        :favorite="favoritesStore.isFavorite(league.idLeague)"
        @toggle-favorite="favoritesStore.toggleFavorite"
      />
    </div>

    <div aria-live="polite">
      <SkeletonLoader v-if="badgesLoading" variant="gallery" />
      <ErrorState v-else-if="badgesError" :message="badgesError" @retry="reloadBadges" />
      <BadgeGallery v-else :badges="badges">
        <template #empty>
          <EmptyState
            title="No badge history available"
            message="This league doesn't have any recorded season badges yet."
          />
        </template>
      </BadgeGallery>
    </div>
  </div>
</template>
