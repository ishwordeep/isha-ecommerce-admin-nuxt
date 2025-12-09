<script setup lang="ts">
import ShippingInformation from '~/views/pages/shipping-information/index.vue'

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Shipping Information',
  description: 'Manage your shipping information here',
  ogTitle: 'Shipping Information',
})
</script>
<template>
  <ShippingInformation />
</template>
