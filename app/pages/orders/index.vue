<template>
  <Orders />
</template>

<script setup lang="ts">
import Orders from '~/views/orders/index.vue'
definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Orders | Admin',
  description: 'Manage your orders here',
  ogTitle: 'Orders | Admin',
})
</script>
