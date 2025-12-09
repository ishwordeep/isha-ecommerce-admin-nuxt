<script setup lang="ts">
import Category from '~/views/category/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Categories | Admin',
  description: 'Manage your categories here.',
})
</script>
<template>
  <Category />
</template>
