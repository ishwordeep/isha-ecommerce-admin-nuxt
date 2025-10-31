<template>
  <h1 class="text-2xl font-bold">Admin Dashboard</h1>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Dashboard', 'This is admin dashboard page')
})
</script>
