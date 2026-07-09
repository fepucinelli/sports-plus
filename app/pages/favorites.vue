<script setup lang="ts">
useSeoMeta({
  title: 'My Leagues — Sports+',
  description: 'Your favorited sports leagues, all in one place.',
})

const { leagues, isLoading, error, reload } = useLeagues()
const favoritesStore = useFavoritesStore()

const favoriteLeagues = computed(() =>
  leagues.value.filter((league) => favoritesStore.isFavorite(league.idLeague)),
)
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
    <h1 class="font-display text-3xl uppercase tracking-tight text-brand-white">My Leagues</h1>

    <div aria-live="polite">
      <SkeletonLoader v-if="isLoading" variant="grid" />
      <ErrorState v-else-if="error" :message="error" @retry="reload" />
      <LeagueGrid
        v-else
        :leagues="favoriteLeagues"
        :is-favorite="favoritesStore.isFavorite"
        @toggle-favorite="favoritesStore.toggleFavorite"
      >
        <template #empty>
          <EmptyState title="No favorites yet">
            <template #action>
              <NuxtLink
                to="/"
                class="rounded-sm border border-brand-accent px-4 py-2 font-display text-sm uppercase tracking-wide text-brand-white/70 transition-colors hover:bg-brand-accent hover:text-brand-white"
              >
                Browse leagues
              </NuxtLink>
            </template>
          </EmptyState>
        </template>
      </LeagueGrid>
    </div>
  </div>
</template>
