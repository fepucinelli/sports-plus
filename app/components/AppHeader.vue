<script setup lang="ts"></script>

<template>
  <header
    class="border-b border-brand-gray border-t-2 border-t-brand-accent bg-brand-bg text-brand-white"
  >
    <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
      <NuxtLink
        to="/"
        class="shrink-0 font-display text-2xl uppercase tracking-tight text-brand-white"
      >
        Sports<span class="text-brand-accent">+</span>
      </NuxtLink>

      <nav class="flex items-center gap-5 font-display text-sm uppercase tracking-widest">
        <NuxtLink
          to="/"
          class="border-b-2 border-transparent pb-1 pt-1 text-brand-white/70 transition-colors hover:text-brand-white"
          active-class="border-brand-accent text-brand-white"
          exact-active-class="border-brand-accent text-brand-white"
        >
          Browse
        </NuxtLink>
        <NuxtLink
          to="/favorites"
          class="border-b-2 border-transparent pb-1 pt-1 text-brand-white/70 transition-colors hover:text-brand-white"
          active-class="border-brand-accent text-brand-white"
        >
          Favorites
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
