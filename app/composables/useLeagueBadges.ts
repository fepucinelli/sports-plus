import type { SearchAllSeasonsResponse, SeasonBadge } from '@/types/thesportsdb'

export function useLeagueBadges(leagueId: Ref<string>) {
  // Proxied and cached server-side by server/api/leagues/[id]/badges.get.ts.
  const { data, pending, error, refresh } = useFetch<SearchAllSeasonsResponse>(
    () => `/api/leagues/${leagueId.value}/badges`,
    {
      key: () => `leagues:${leagueId.value}:badges`,
      transform: (response) => (response.seasons ?? []).filter((season) => season.strBadge),
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
    },
  )

  const badges = computed<SeasonBadge[]>(() => data.value ?? [])
  const errorMessage = computed(() => (error.value ? 'Failed to load badge history.' : null))

  return { badges, isLoading: pending, error: errorMessage, reload: refresh }
}
