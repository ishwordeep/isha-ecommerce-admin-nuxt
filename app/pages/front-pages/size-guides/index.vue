<script setup lang="ts">
import SizeGuides from '~/views/pages/size-guides/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Size Guides | Admin',
  description: 'Manage your size guides here',
  ogTitle: 'Size Guides | Admin',
})
</script>
<template>
  <SizeGuides />
</template>
