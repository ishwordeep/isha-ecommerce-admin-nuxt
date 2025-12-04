<template>
  <ProductFlagManager
    flag="new"
    key="new"
    :title="meta.title"
    description="Products currently in this collection"
    icon="i-lucide-clock"
    gradient-from="blue-500"
    gradient-to="purple-500"
  />
</template>
<script setup lang="ts">
import ProductFlagManager from '~/views/products/components/ProductFlagManager.vue'

const headerStore = useHeaderStore()

const meta = ref({
  title: 'New Arrivals',
  description: 'Manage your new arrivals here',
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
