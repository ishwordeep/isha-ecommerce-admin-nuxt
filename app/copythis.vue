<template>
  <div class="flex flex-col gap-4">A</div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('New Arrivals', 'Manage your new arrivals here')
})

useSeoMeta({
  title: 'Product',
  description: 'Manage your arrivals here',
  ogTitle: 'Product',
})
</script>
