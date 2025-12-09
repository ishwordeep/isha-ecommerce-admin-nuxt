<script setup lang="ts">
import AboutUs from '~/views/pages/about-us/index.vue'

definePageMeta({
  layout: 'admin',
})
useSeoMeta({
  title: 'About Us | Admin',
  ogTitle: 'About Us | Admin',
})
</script>

<template>
  <AboutUs />
</template>
