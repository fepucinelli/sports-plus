import type { SearchAllSeasonsResponse } from '@/types/thesportsdb'

const SEARCH_ALL_SEASONS_URL = 'https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php'

export default defineCachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
    return await $fetch<SearchAllSeasonsResponse>(SEARCH_ALL_SEASONS_URL, {
      query: { badge: 1, id },
    })
  },
  { maxAge: 60 * 60, swr: true, name: 'league-badges' },
)
