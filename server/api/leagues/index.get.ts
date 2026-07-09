import type { AllLeaguesResponse } from '@/types/thesportsdb'

const ALL_LEAGUES_URL = 'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php'

// Caches the upstream response for an hour regardless of who's asking
export default defineCachedEventHandler(
  async () => {
    return await $fetch<AllLeaguesResponse>(ALL_LEAGUES_URL)
  },
  { maxAge: 60 * 60, swr: true, name: 'leagues-all' },
)
