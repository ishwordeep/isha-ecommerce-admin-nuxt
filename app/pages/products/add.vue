<script setup lang="ts">
import { useProductStore } from '~/stores/product.store'
import ProductForm from '~/views/products/components/ProductForm.vue'

const productStore = useProductStore()
const headerStore = useHeaderStore()

definePageMeta({ layout: 'admin' })

useSeoMeta({
  title: 'Edit Product',
  description: 'Edit your product',
  ogTitle: 'Edit Product',
})

onBeforeMount(() => {
  headerStore.setHeaders('Products', 'Add your product here.')
})

onMounted(() => {
  productStore.initializeForAdd()
})
</script>

<template>
  <ProductForm mode="add" />
</template>
