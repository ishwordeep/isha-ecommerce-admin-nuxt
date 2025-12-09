<script setup lang="ts">
import { useProductStore } from '~/stores/product.store'
import ProductForm from '~/views/products/components/ProductForm.vue'

const productStore = useProductStore()
const headerStore = useHeaderStore()

definePageMeta({ layout: 'admin' })

useSeoMeta({
  title: 'Add Product | Admin',
  description: 'Add your product',
  ogTitle: 'Add Product | Admin',
})

onBeforeMount(() => {
  headerStore.setHeaders('Products', 'Add your product here.')
})

onMounted(() => {
  productStore.initializeForAdd()
})
</script>

<template>
  <ClientOnly>
    <ProductForm mode="add" />
  </ClientOnly>
</template>
