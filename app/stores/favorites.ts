import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'sports-plus:favorites'

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  // Kept out of the store's returned state on purpose: Pinia serializes
  // returned refs into the SSR payload for client hydration, which would
  // otherwise clobber this client-only, localStorage-backed value with the
  // server's (always empty) snapshot right after mount.
  const favoriteIds = ref<Set<string>>(new Set())

  onMounted(() => {
    favoriteIds.value = loadFromStorage()
  })

  watch(
    favoriteIds,
    (ids) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
      } catch {
        // localStorage unavailable — favorites simply won't persist across reloads
      }
    },
    { deep: true },
  )

  function isFavorite(leagueId: string): boolean {
    return favoriteIds.value.has(leagueId)
  }

  function toggleFavorite(leagueId: string): void {
    const next = new Set(favoriteIds.value)
    if (next.has(leagueId)) {
      next.delete(leagueId)
    } else {
      next.add(leagueId)
    }
    favoriteIds.value = next
  }

  return { isFavorite, toggleFavorite }
})
