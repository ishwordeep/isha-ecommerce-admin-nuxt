<script setup lang="ts">
import ProductForm from '../components/ProductForm.vue'
import { useProductStore } from '~/stores/product.store'
import { useRoute } from 'vue-router'

const route = useRoute()
const productStore = useProductStore()

const headerStore = useHeaderStore()

definePageMeta({ layout: 'admin' })

useSeoMeta({
  title: 'Edit Product',
  description: 'Edit your product',
  ogTitle: 'Edit Product',
})

onBeforeMount(() => {
  headerStore.setHeaders('Products', 'Edit your product here.')
})

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await productStore.initializeForEdit(id)
  }
})
</script>

<template>
  <ProductForm mode="edit" />
</template>
