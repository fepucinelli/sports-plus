export default defineNuxtConfig({
  compatibilityDate: '2026-07-07',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/eslint'],
  tailwindcss: {
    cssPath: '~/assets/main.css',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Sports+',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content:
            'Browse sports leagues from around the world and explore their badge history, powered by TheSportsDB.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://r2.thesportsdb.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
        },
      ],
    },
  },

  // Page-level HTML caching only — avoiding repeat TheSportsDB calls is
  // handled separately by server/api/leagues/* (see README "Caching").
  routeRules: {
    '/leagues/**': { swr: 3600 },
    '/favorites': { swr: 3600 },
    ...(process.env.NODE_ENV === 'production'
      ? {
          '/**': {
            headers: {
              'X-Content-Type-Options': 'nosniff',
              'Referrer-Policy': 'strict-origin-when-cross-origin',
              'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
              'X-Frame-Options': 'DENY',
              // script-src needs 'unsafe-inline' for Nuxt's own inline
              // window.__NUXT__ hydration bootstrap script
              'Content-Security-Policy': [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline'",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "font-src 'self' https://fonts.gstatic.com data:",
                "img-src 'self' https://r2.thesportsdb.com data:",
                "connect-src 'self'",
                "object-src 'none'",
                "base-uri 'self'",
                "frame-ancestors 'none'",
              ].join('; '),
            },
          },
        }
      : {}),
  },
})
