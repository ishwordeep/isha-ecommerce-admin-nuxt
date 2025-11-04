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
  headerStore.setHeaders('Sliders', 'Manage your sliders here')
})

useSeoMeta({
  title: 'Sliders',
  description: 'Manage your sliders here',
  ogTitle: 'Sliders',
})
</script>
