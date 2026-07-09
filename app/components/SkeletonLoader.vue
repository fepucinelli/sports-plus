<script setup lang="ts">
withDefaults(
  defineProps<{
    variant: 'grid' | 'gallery'
    count?: number
  }>(),
  { count: 8 },
)
</script>

<template>
  <div
    :class="
      variant === 'grid'
        ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'
    "
  >
    <div
      v-for="n in count"
      :key="n"
      class="animate-shimmer-sweep border-t-2 border-brand-gray bg-gradient-to-r from-brand-gray/40 via-brand-white/10 to-brand-gray/40 bg-[length:200%_100%]"
      :class="variant === 'grid' ? 'h-28' : 'h-40'"
    />
  </div>
</template>
