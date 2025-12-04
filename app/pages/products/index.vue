<script setup lang="ts">
import Products from '~/views/products/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Products',
  description: 'Manage your products here',
  ogTitle: 'Products',
})
</script>

<template>
  <Products />
</template>
