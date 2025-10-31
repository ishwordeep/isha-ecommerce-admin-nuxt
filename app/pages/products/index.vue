<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <div></div>
      <UButton as="a" href="/products/add" label="Add Product" />
    </div>
    <ProductTable />
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
  headerStore.setHeaders('Product', 'Manage your products here')
})

useSeoMeta({
  title: 'Product',
  description: 'Manage your products here',
  ogTitle: 'Product',
})
</script>
