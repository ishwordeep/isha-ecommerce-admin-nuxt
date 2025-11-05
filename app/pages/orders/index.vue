<template>
  <div>Orders</div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Orders', 'Manage your orders here')
})
useSeoMeta({
  title: 'Orders',
  description: 'Manage your orders here',
  ogTitle: 'Orders',
})
</script>
