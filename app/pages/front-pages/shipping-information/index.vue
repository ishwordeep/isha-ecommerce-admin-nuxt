<script setup lang="ts">
import ShippingInformation from '~/views/pages/shipping-information/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Shipping Information | Admin',
  description: 'Manage your shipping information here',
  ogTitle: 'Shipping Information | Admin',
})
</script>
<template>
  <ShippingInformation />
</template>
