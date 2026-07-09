<template>
  <div class="min-h-screen bg-brand-bg">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-brand-accent focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:uppercase focus:tracking-wide focus:text-brand-white"
    >
      Skip to content
    </a>
    <AppHeader />
    <main id="main">
      <slot />
    </main>
  </div>
</template>
