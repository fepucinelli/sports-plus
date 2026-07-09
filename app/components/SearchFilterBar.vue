<script setup lang="ts">
defineProps<{
  sports: string[]
  countries: string[]
}>()

const search = defineModel<string>('search', { default: '' })
const sport = defineModel<string>('sport', { default: '' })
const country = defineModel<string>('country', { default: '' })
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row">
    <input
      v-model="search"
      type="search"
      placeholder="Search leagues…"
      aria-label="Search leagues"
      class="w-full rounded-sm border border-brand-gray bg-brand-bg px-3 py-2 text-sm text-brand-white placeholder:text-brand-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent"
    />
    <select
      v-model="sport"
      aria-label="Filter by sport"
      class="select-arrow rounded-sm border border-brand-gray bg-brand-bg py-2 pl-3 pr-8 font-mono text-sm text-brand-white focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent"
    >
      <option value="">All sports</option>
      <option v-for="option in sports" :key="option" :value="option">{{ option }}</option>
    </select>
    <select
      v-model="country"
      aria-label="Filter by country"
      class="select-arrow rounded-sm border border-brand-gray bg-brand-bg py-2 pl-3 pr-8 font-mono text-sm text-brand-white focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent"
    >
      <option value="">All countries</option>
      <option v-for="option in countries" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<style scoped>
.select-arrow {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23eaecef'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.65rem center;
  background-size: 1rem;
}
</style>
