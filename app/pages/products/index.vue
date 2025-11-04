<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <UiSearchInput :delay="500" :loading="true" @search="handleSearch" />
      <UButton as="a" href="/products/add" label="Add Product" />
    </div>
    <ProductTable :search="searchQuery" />
  </div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import ProductTable from '~/pages/products/components/ProductTable.vue'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()

onBeforeMount(() => {
  headerStore.setHeaders('Products', 'Manage your products here')
})
useSeoMeta({
  title: 'Products',
  description: 'Manage your products here',
  ogTitle: 'Products',
})

const searchQuery = ref('')
const handleSearch = (value: string) => {
  searchQuery.value = value
}
</script>
