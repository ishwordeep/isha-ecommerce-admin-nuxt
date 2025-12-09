<script setup lang="ts">
import Slider from '~/views/slider/index.vue'

definePageMeta({
  layout: 'admin',
})
useSeoMeta({
  title: 'Sliders | Admin',
  description: 'Manage your sliders here.',
})
</script>

<template>
  <Slider />
</template>
