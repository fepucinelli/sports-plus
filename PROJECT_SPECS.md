# Sports+ — Project Specifications

## 1. Overview

Sports+ is a web app for browsing sports leagues from around the world and exploring their badge/crest history across seasons, powered by [TheSportsDB](https://www.thesportsdb.com/free_sports_api)'s free API. Server-rendered, TypeScript-strict, sports-broadcast-inspired UI.

**Live:** https://sports-plus-delta.vercel.app

This document follows a requirements → design structure. Requirements describe what the system does and why; Design describes how it's built.

## 2. Constraints

- **Framework:** Nuxt 4 (Vue 3, Composition API, `<script setup>`, SSR — not a client-only SPA)
- **Language:** TypeScript, strict mode
- **Styling:** Tailwind CSS via `@nuxtjs/tailwindcss`
- **State management:** Pinia, scoped to favorites only — API data never goes in Pinia (see REQ-7/Design)
- **Linting:** ESLint (`@nuxt/eslint`) + Prettier, pre-commit hook via Husky/lint-staged
- **Deployment:** Vercel, auto-detected Nuxt/Nitro app, no `vercel.json`
- **Package manager:** npm

**Data source — TheSportsDB API**, free tier, key `3`, JSON responses:

- All Leagues: `https://www.thesportsdb.com/api/v1/json/3/all_leagues.php` — full list of leagues (id, name, sport, country)
- Badge Lookup: `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=<id>` — badge/crest artwork per league, across seasons
- Docs: https://www.thesportsdb.com/free_sports_api

**Known upstream limitation:** the free test key `id=3` returns a small, fixed dataset — exactly 10 leagues from `all_leagues.php` — and is publicly shared across an unknown number of other projects, so it's rate-limited and can return a truncated response instead of an error under load. The response-caching design accounts for this (see Design → Caching Architecture).

## 3. Requirements

### REQ-1 — League Browser

User story: as a visitor, I want to browse and search all available leagues so I can find ones I'm interested in.

Acceptance criteria:

- [x] Home page fetches and displays all leagues
- [x] Each league renders as a card with name, sport, country
- [x] Text search filters the list instantly, client-side, no network call
- [x] Sport and country dropdown filters, combinable with search
- [x] Filter state lives in the URL query string (`?search=&sport=&country=`) — shareable/bookmarkable, survives navigating to a league and back
- [x] Empty state ("No leagues found") when filters match nothing

### REQ-2 — League Detail / Badge Gallery

User story: as a visitor, I want to see a league's badge/crest history across seasons.

Acceptance criteria:

- [x] Clicking a league navigates to `/leagues/:id-:slug` (human-readable slug, e.g. `/leagues/4328-english-premier-league`), via a real, crawlable `<a href>`
- [x] Fetches season/badge data for that league
- [x] Season-by-season grid of badge artwork with season labels
- [x] Seasons with no badge image render a graceful placeholder, not a broken image
- [x] First row of badge images loads eagerly (protects LCP); the rest lazy-load below the fold

### REQ-3 — Favorites (Extra Touch)

User story: as a visitor, I want to star leagues so I can find them again later.

Acceptance criteria:

- [x] Star/bookmark toggle on both the league card and the detail view
- [x] Favorited ids persist to `localStorage`, survive a page reload
- [x] `/favorites` ("My Leagues") lists only favorited leagues, reusing the home grid components
- [x] Empty state with a prompt to go browse, when no favorites exist

### REQ-4 — Loading & Error States

Acceptance criteria:

- [x] Shimmer skeleton loaders (not static gray blocks) for the league grid and badge gallery
- [x] Visible error state with a retry action on fetch failure — no silent blank screen
- [x] Loading → content/error transitions are announced to screen readers (`aria-live="polite"`)

### REQ-5 — Responsive Layout

Acceptance criteria:

- [x] Mobile-first; league grid reflows 1 → 2 → 4 columns, badge grid 2 → 3 → 5
- [x] All interactive targets meet the 24×24px minimum tap-target size (WCAG 2.2 SC 2.5.8)

### REQ-6 — SEO

Acceptance criteria:

- [x] Server-rendered `<title>`/meta description per route via `useSeoMeta()`, verifiable with `curl`/view-source without executing JS
- [x] League detail page sets title/description dynamically from the fetched league name
- [x] Filtered home page URLs are crawlable, shareable links (query-string state, not client-only)
- [x] Semantic HTML (`<article>`, `<figure>`/`<figcaption>`), real crawlable links to every league detail page
- [x] `robots.txt` present (default allow-all)

### REQ-7 — Response Caching

User story: as the operator, I don't want every visitor to trigger a fresh TheSportsDB call — it's a public, rate-limited free API and repeat fetches are pure waste.

Acceptance criteria:

- [x] Client-side: repeat navigation to a page already fetched in this session doesn't re-request the same data
- [x] Server-side: concurrent/repeat visitors across _all_ routes share one cached upstream response per endpoint, independent of which page or query string triggered it
- [x] A response that looks incomplete/truncated is never cached — validated before being allowed into the cache

### REQ-8 — Accessibility

Acceptance criteria:

- [x] All text/background color combinations meet WCAG AA contrast (4.5:1 normal text, 3:1 large text/UI components) — verified by computing actual contrast ratios against the fixed palette, not eyeballed
- [x] No nested/invalid interactive ARIA roles (e.g. a real `<button>` inside an element faking `role="button"`)
- [x] Every page has exactly one `<h1>`
- [x] Skip-to-content link
- [x] Loading/content swaps announced via `aria-live`
- [x] `lang` attribute set on `<html>`

### REQ-9 — Security Headers

Acceptance criteria:

- [x] Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` set on all responses
- [x] Headers scoped to production only (a real CSP would break Vite's dev-mode HMR)
- [x] `npm audit` clean on production dependencies

### REQ-10 — Deployment

Acceptance criteria:

- [x] `npm run build` produces a deployable `.output/` with no TypeScript errors
- [x] `npm run lint` passes with no errors
- [x] Deployed to Vercel (auto-detected Nuxt/Nitro, SSR), reachable at https://sports-plus-delta.vercel.app
- [x] Verified via `curl`/view-source that SSR HTML contains real league/badge content and correct per-page meta, not just client-rendered

## 4. Design

### Component breakdown

Components live under `app/components/`, auto-imported, no manual `import` statements:

- `AppHeader` — logo/wordmark, nav (Browse / Favorites)
- `SearchFilterBar` — text search + sport/country filters; emits filter state, holds no data itself
- `LeagueGrid` — responsive grid; takes a league list as a prop, renders `LeagueCard`s, handles the empty-state slot
- `LeagueCard` — name, sport, country, favorite toggle. The clickable surface is a real stretched `<NuxtLink>`; the favorite `<button>` is a separate sibling control, so no interactive element is ever nested inside another
- `LeagueDetailHeader` — league name, sport, country, favorite toggle, on the detail view
- `BadgeGallery` — grid of `BadgeCard`s
- `BadgeCard` — single badge image (explicit width/height to avoid CLS; first row eager-loaded, rest lazy) + season label
- `SkeletonLoader` — shimmer placeholder, configurable for grid vs gallery shapes
- `EmptyState` / `ErrorState` — shared components with icon/message/optional retry action

### State management

- Pinia `useFavoritesStore` (`app/stores/favorites.ts`) — the only thing in Pinia. `toggleFavorite(id)` / `isFavorite(id)`, persisted to `localStorage`. The raw `favoriteIds` ref is deliberately **not** returned from the store: `@pinia/nuxt` would otherwise serialize it into the SSR payload and overwrite the client's real localStorage-loaded value with the server's empty one on hydration. It's populated client-only, in `onMounted`.
- League/badge data stays in composables (`useLeagues()`, `useLeagueBadges(id)`), never in Pinia — see Data flow below.

### Routing

| File                                | Route                | Notes                         |
| ----------------------------------- | -------------------- | ----------------------------- |
| `app/pages/index.vue`               | `/`                  | League Browser (home)         |
| `app/pages/leagues/[id]-[slug].vue` | `/leagues/:id-:slug` | League Detail / Badge Gallery |
| `app/pages/favorites.vue`           | `/favorites`         | My Leagues                    |

Each page calls `useSeoMeta({ title, description })` directly.

### Data flow / API layer

```
TheSportsDB API
   ├─ server/api/leagues/index.get.ts        → all_leagues.php
   └─ server/api/leagues/[id]/badges.get.ts  → search_all_seasons.php?badge=1&id=<id>
        ├─ useLeagues()       → GET /api/leagues
        └─ useLeagueBadges()  → GET /api/leagues/<id>/badges
             └─ consumed by pages (index, leagues/[id]-[slug], favorites)
```

Composables never call TheSportsDB directly. They call two internal Nitro routes, which own the upstream fetch and its caching — this keeps caching correctness independent of which page happens to be requesting the data.

### Caching architecture

Three layers, in order of how much they actually matter:

1. **Client-side reuse** — `useLeagues()`/`useLeagueBadges()` call `useFetch` with an explicit `key` and `getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]`. Navigating home → a league → home again doesn't refetch.
2. **Server-side response caching** (`server/api/leagues/*`, `defineCachedEventHandler({ maxAge: 60 * 60, swr: true })`) — this is what satisfies "avoid repeat calls to TheSportsDB." Cached per-endpoint, independent of which page or query string triggered the request.
3. **Page-level render caching** (`nuxt.config.ts` → `routeRules['/leagues/**'].swr`, `['/favorites'].swr`) — caches the rendered HTML itself, for pages whose output is identical for every visitor. A render-cost optimization on top of layer 2, not a substitute for it.

`/` is deliberately excluded from page-level render caching (layer 3): its output varies by `?search=`/`&sport=`/`&country=`, but `routeRules` caching matches by path only and ignores the query string, so caching it at the page level would risk serving one visitor's search results to another. Response caching (layer 2) doesn't have this problem — it's keyed on the API endpoint, not the page, so `/` is still fully covered there regardless of query string.

`server/api/leagues/index.get.ts` validates that `all_leagues.php` responses contain at least the expected 10 leagues (`MIN_EXPECTED_LEAGUES`) before allowing them into the cache, given the free key's tendency to return a truncated response under load (see Constraints). A short response is treated as a failure and surfaces through the existing `ErrorState`/retry UI rather than being cached.

### Visual design

Palette is fixed, centralized in `tailwind.config.ts` under the `brand` key — components reference `bg-brand-*`/`text-brand-*` utilities, never raw hex values:

```css
brand.bg:      #1b1e25  /* primary dark background */
brand.surface: #eaecef  /* primary light background */
brand.accent:  #e41827  /* accent / CTA / focus rings */
brand.white:   #ffffff
brand.black:   #000000
brand.gray:    #353a45  /* secondary surface, borders, muted text */
```

`brand.accent` is reserved for borders, large text (≥18.66px), backgrounds, and focus rings, where its 3.5:1 contrast against `brand.bg` meets WCAG's 3:1 threshold for large text/UI components. Small/normal-size text (eyebrow labels, CTA button text) uses `text-brand-white/70` instead, since `brand.accent` at that size measures 3.5:1 — below the 4.5:1 AA minimum for normal text.

Typography: Oswald (display) + JetBrains Mono (tabular/numeric), Google Fonts with `font-display: swap`.

### Security headers

Production-only (gated on `process.env.NODE_ENV === 'production'` in `nuxt.config.ts`, since a real CSP breaks Vite's dev-mode HMR): CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: DENY`. The CSP's `script-src` needs `'unsafe-inline'` specifically for Nuxt's own inline `window.__NUXT__` hydration bootstrap script (no nonce/hash support without a dedicated module) — acceptable here because the app has no `v-html`/dynamic-HTML rendering to actually exploit.

### File layout

- `app/` — Nuxt 4's srcDir (pages, components, composables, stores, types, utils)
- `server/api/leagues/` — cached Nitro proxy routes for TheSportsDB; composables call these, never TheSportsDB directly
- `public/` — static assets (favicon, robots.txt)
- `nuxt.config.ts` — modules, `app.head`, `routeRules` (page-level caching + production security headers)
