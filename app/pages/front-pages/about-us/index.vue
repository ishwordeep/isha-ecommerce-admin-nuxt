<script setup lang="ts">
import AboutUs from '~/views/pages/about-us/index.vue'

definePageMeta({
  layout: 'admin',
})
useSeoMeta({
  title: 'About Us',
  ogTitle: 'About Us',
})
</script>

<template>
  <AboutUs />
</template>
