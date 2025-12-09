<script setup lang="ts">
import ReturnAndExchange from '~/views/pages/return-and-exchange/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Return and Exchange | Admin',
  description: 'Manage your return and exchange here',
  ogTitle: 'Return and Exchange | Admin',
})
</script>
<template>
  <ReturnAndExchange />
</template>
