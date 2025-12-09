<script setup lang="ts">
import Products from '~/views/products/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Products | Admin',
  description: 'Manage your products here',
  ogTitle: 'Products | Admin',
})
</script>

<template>
  <Products />
</template>
