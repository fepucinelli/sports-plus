import type { AllLeaguesResponse, League } from '@/types/thesportsdb'

// Proxied and cached server-side by server/api/leagues/index.get.ts.
const ALL_LEAGUES_URL = '/api/leagues'

export function useLeagues() {
  const { data, pending, error, refresh } = useFetch<AllLeaguesResponse>(ALL_LEAGUES_URL, {
    key: 'leagues:all',
    transform: (response) => response.leagues ?? [],
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })

  const leagues = computed<League[]>(() => data.value ?? [])
  const errorMessage = computed(() => (error.value ? 'Failed to load leagues.' : null))

  return { leagues, isLoading: pending, error: errorMessage, reload: refresh }
}
