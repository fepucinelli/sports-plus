import type { AllLeaguesResponse } from '@/types/thesportsdb'

const ALL_LEAGUES_URL = 'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php'

// Test key id=3 normally returns a stable 10 leagues; under rate-limiting
// it can truncate instead of erroring, so guard against caching a short list
const MIN_EXPECTED_LEAGUES = 10

// Caches the upstream response for an hour regardless of who's asking
export default defineCachedEventHandler(
  async () => {
    const response = await $fetch<AllLeaguesResponse>(ALL_LEAGUES_URL)
    if ((response.leagues?.length ?? 0) < MIN_EXPECTED_LEAGUES) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Incomplete response from TheSportsDB',
      })
    }
    return response
  },
  { maxAge: 60 * 60, swr: true, name: 'leagues-all' },
)
