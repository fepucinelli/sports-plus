<script setup lang="ts">
useSeoMeta({
  title: 'Sports+ — Browse Sports Leagues',
  description:
    'Browse sports leagues from around the world and explore their badge history, powered by TheSportsDB.',
})

const route = useRoute()
const router = useRouter()
const { leagues, isLoading, error, reload } = useLeagues()
const favoritesStore = useFavoritesStore()

// Filters live in the URL (not local refs) so they survive navigating to a
// league and back, and so filtered views are shareable/bookmarkable.
function useQueryFilter(key: 'search' | 'sport' | 'country') {
  return computed({
    get: () => (typeof route.query[key] === 'string' ? (route.query[key] as string) : ''),
    set: (value: string) => {
      router.replace({ query: { ...route.query, [key]: value || undefined } })
    },
  })
}

const search = useQueryFilter('search')
const sport = useQueryFilter('sport')
const country = useQueryFilter('country')

const sports = computed(() => [...new Set(leagues.value.map((l) => l.strSport))].sort())
const countries = computed(() =>
  [
    ...new Set(leagues.value.map((l) => l.strCountry).filter((c): c is string => Boolean(c))),
  ].sort(),
)

const filteredLeagues = computed(() => {
  const query = search.value.trim().toLowerCase()
  return leagues.value.filter((league) => {
    const matchesQuery = !query || league.strLeague.toLowerCase().includes(query)
    const matchesSport = !sport.value || league.strSport === sport.value
    const matchesCountry = !country.value || league.strCountry === country.value
    return matchesQuery && matchesSport && matchesCountry
  })
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
    <h1 class="font-display text-3xl uppercase tracking-tight text-brand-white">Browse Leagues</h1>

    <SearchFilterBar
      v-model:search="search"
      v-model:sport="sport"
      v-model:country="country"
      :sports="sports"
      :countries="countries"
    />

    <div aria-live="polite">
      <SkeletonLoader v-if="isLoading" variant="grid" />
      <ErrorState v-else-if="error" :message="error" @retry="reload" />
      <LeagueGrid
        v-else
        :leagues="filteredLeagues"
        :is-favorite="favoritesStore.isFavorite"
        @toggle-favorite="favoritesStore.toggleFavorite"
      >
        <template #empty>
          <EmptyState title="No leagues found" message="Try a different search or filter." />
        </template>
      </LeagueGrid>
    </div>
  </div>
</template>
