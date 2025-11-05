<template>
  <ProductFlagManager
    flag="trending"
    key="trending"
    :title="meta.title"
    description="Products currently in this collection"
    icon="i-lucide-clock"
    gradient-from="blue-50"
    gradient-to="purple-50"
  />
</template>
<script setup lang="ts">
import ProductFlagManager from './components/ProductFlagManager.vue'

const headerStore = useHeaderStore()

const meta = ref({
  title: 'Trending Products',
  description: 'Manage your trending products here',
})

definePageMeta({
  layout: 'admin',
})

onBeforeMount(() => {
  headerStore.setHeaders(meta.value.title, meta.value.description)
})

useSeoMeta({
  title: meta.value.title,
  description: meta.value.description,
  ogTitle: meta.value.title,
})
</script>
