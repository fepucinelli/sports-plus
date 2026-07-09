# Sports+

Browse sports leagues from around the world and explore their badge/crest history across every season, powered by [TheSportsDB](https://www.thesportsdb.com/free_sports_api)'s free API.

**Live:** https://sports-plus-delta.vercel.app

## Stack

- **Nuxt 4** (Vue 3, Composition API, `<script setup>`, SSR)
- **TypeScript** (strict mode)
- **Tailwind CSS** (v3, via `@nuxtjs/tailwindcss` — JS-based `tailwind.config.ts` theme)
- **Pinia** (via `@pinia/nuxt`) — favorites only, see [State management](#state-management-why-pinia-is-scoped-to-just-favorites)
- **ESLint 9** (`@nuxt/eslint`, handles Nuxt's auto-imports) + **Prettier** + **Husky/lint-staged** pre-commit hook
- Deployed to **Vercel**, auto-detected as a Nuxt/Nitro app (no `vercel.json` needed)

```
npm install
npm run dev      # local dev server (SSR)
npm run build    # nuxt build → .output/
npm run preview  # run the production build locally
npm run lint     # eslint + prettier --check
npm run lint:fix
```

## Architecture

### Data flow

```
TheSportsDB API
   ├─ server/api/leagues/index.get.ts        → all_leagues.php                          (defineCachedEventHandler)
   └─ server/api/leagues/[id]/badges.get.ts  → search_all_seasons.php?badge=1&id=<id>   (defineCachedEventHandler)
        ├─ useLeagues.ts        → /api/leagues            (useFetch, key: 'leagues:all')
        └─ useLeagueBadges.ts   → /api/leagues/<id>/badges (useFetch, key: `leagues:${id}:badges`)
             └─ consumed directly by pages (index, leagues/[id]-[slug], favorites)
```

`useLeagues()` / `useLeagueBadges(id)` are the only places in `app/` that call `useFetch`. Neither talks to TheSportsDB directly — both go through the internal `server/api/leagues/*` routes shown above, which own the upstream fetch and its caching (see [Caching](#caching)).

### Project layout

Nuxt 4's `app/` srcDir convention, with auto-imports (only `type` imports from `app/types/` are explicit — Nuxt doesn't auto-import plain type-only files):

- `app/pages/*` — file-based routes (see [Routing](#routing)). Each fetches its own data and calls `useSeoMeta()`.
- `app/components/*` — presentational, auto-imported, mostly store-agnostic. `LeagueCard`, for example, never calls the favorites store itself — it emits `toggle-favorite` and the parent page decides what that means, which keeps it reusable across `index.vue` and `favorites.vue`.
- `app/composables/*` — `useLeagues`, `useLeagueBadges`.
- `app/stores/favorites.ts` — the one Pinia store.
- `app/layouts/default.vue` + `app/app.vue` — app shell (`AppHeader` + `<slot/>` / `<NuxtPage/>`).
- `server/api/leagues/*` — cached Nitro proxy routes for TheSportsDB (see [Caching](#caching)).

### State management: why Pinia is scoped to just favorites

Pinia (`app/stores/favorites.ts`) holds exactly one thing: the `Set<string>` of favorited league ids, via `toggleFavorite(id)` / `isFavorite(id)`, persisted to `localStorage`. That's deliberately the _only_ thing in Pinia:

- Favorites are read/written from three places with no shared parent (home grid, league detail, favorites view) — a real case for shared state.
- API data (leagues, badges) stays out of Pinia. It already has a dedicated caching layer (see [Caching](#caching)) that handles sharing/deduping across components — duplicating that in a store would mean two sources of truth. Pinia is for _app-owned_ state (favorites); fetched data is _server-owned_ and can always be re-derived from the network.

**SSR hydration gotcha:** the `favoriteIds` ref is deliberately _not_ returned from the store. `@pinia/nuxt` serializes every returned ref into the SSR payload for hydration — but the server has no `localStorage`, so hydrating `favoriteIds` would overwrite the client's real, just-loaded value with the server's empty one. Keeping it private (only `isFavorite`/`toggleFavorite` are exposed) means there's nothing for Pinia to hydrate; it's populated client-only, in `onMounted`, instead. Reactivity still works fine — Vue tracks `.value` access inside `isFavorite()` regardless of whether the store "returns" the ref.

### Routing

File-based, under `app/pages/`:

| File                      | Route                | Notes                               |
| ------------------------- | -------------------- | ----------------------------------- |
| `index.vue`               | `/`                  | League browser + search/filter      |
| `leagues/[id]-[slug].vue` | `/leagues/:id-:slug` | Badge/season gallery for one league |
| `favorites.vue`           | `/favorites`         | Favorited leagues only              |

`/leagues/:id-:slug` (e.g. `/leagues/4328-english-premier-league`) uses a human-readable slug — see [SEO](#seo). Only `route.params.id` is actually used to fetch data; `slugify()` (`app/utils/slugify.ts`) generates the slug from the league name when building links.

Search/sport/country filters on the home page live in the route's query string (`?search=&sport=&country=`), not local state or Pinia — so they survive navigating to a league and back, and filtered views are shareable/bookmarkable links.

## Caching

TheSportsDB's free tier is public, unauthenticated, rate-limited, and its data changes rarely — refetching the same thing twice is pure waste. Moving to SSR changed _who_ does the refetching: the server is now the API client on behalf of every visitor, not just one browser session. Caching happens at three layers:

1. **Client-side reuse across navigation** — `useLeagues()`/`useLeagueBadges()` call `useFetch` with an explicit `key` and `getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]`, so navigating home → a league → home again doesn't refetch. `useFetch` also de-dupes concurrent in-flight requests for the same key.
2. **Server-side response caching, per upstream endpoint** — `server/api/leagues/index.get.ts` and `server/api/leagues/[id]/badges.get.ts` wrap their fetch in `defineCachedEventHandler({ maxAge: 60 * 60, swr: true })`. This is what actually keeps repeat visitors from re-hitting TheSportsDB: it's keyed on the endpoint, not the page, so it covers `/`, `/leagues/:id-:slug`, and `/favorites` uniformly — including every `?search=` variation of `/`, since the internal routes themselves take no query string.
3. **Page-level HTML caching** — `nuxt.config.ts` sets `routeRules` `swr: 3600` on `/leagues/**` and `/favorites`, caching the rendered response so repeat visitors skip SSR render cost too. A render-cost optimization on top of layer 2, not required for it.

**`/favorites`'s caveat:** its real content (which leagues you've starred) depends on client-only `localStorage`/Pinia state the server can't see, so layer 3 there caches the page shell, not personalized data.

**Why `/` isn't in `routeRules` (layer 3):** its output varies by `?search=`/`&sport=`/`&country=`, but `routeRules` matches by path only and ignores the query string — caching it would risk serving one visitor's search results to another. It also used to crash outright: Nuxt's payload-extraction cache (which page-level `swr`/`isr` enables) keys on the full request URL, and `unstorage`'s `normalizeKey()` strips everything from `?` onward, collapsing `/?search=english` to an empty key that collided with the cache directory itself (`EISDIR` on write). Layer 2 is immune to this — its cache key is a hash, not a raw URL — and is what actually keeps `/` from hammering `all_leagues.php` on every request.

## SEO

- **Human-readable URLs**: `/leagues/:id-:slug` instead of `/leagues/:id`.
- **Server-rendered `<title>`/meta description per route**, via `useSeoMeta()` — present in the HTML a crawler receives, no JS required. The league detail page sets these dynamically from the fetched league name.
- **Shareable filtered views**: search/filter state lives in the query string, so a filtered URL is itself a valid, crawlable link.
- **Semantic markup**: `<article>`/`<figure>`/`<figcaption>` elements, explicit `aria-label`s on form controls, explicit `width`/`height` on images (avoids layout shift).

## Design

- Palette fixed in `tailwind.config.ts` under the `brand` key (`brand.bg`, `brand.surface`, `brand.accent`, `brand.white`, `brand.black`, `brand.gray`) — components use `bg-brand-*`/`text-brand-*` utilities, never raw hex values.
- Typography: **Oswald** (display) for headlines/nav/labels, **JetBrains Mono** for numeric/tabular content, loaded via Google Fonts with `font-display: swap`.
- Favicon (`public/favicon.svg`) is a plain inline SVG, crisp at any size.
