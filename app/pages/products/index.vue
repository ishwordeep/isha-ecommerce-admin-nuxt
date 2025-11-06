<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <UiSearchInput :delay="500" :loading="true" @search="handleSearch" />
        <USelect
          class="max-w-[250px]"
          v-model="selectedCategory"
          :items="categoryList"
          placeholder="Filter by category"
        />
      </div>
      <UButton as="a" href="/products/add" label="Add Product" />
    </div>
    <ProductTable :search="searchQuery" :category="selectedCategory" />
  </div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import ProductTable from '~/pages/products/components/ProductTable.vue'
import { useCategoryStore } from '~/stores/category.store'

definePageMeta({
  layout: 'admin',
})

const headerStore = useHeaderStore()
const categoryStore = useCategoryStore()
const selectedCategory = ref('')

onBeforeMount(async () => {
  headerStore.setHeaders('Products', 'Manage your products here')
  if (!categoryStore.list?.length) {
    await categoryStore.fetchListOnly()
  }
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

// Category dropdown items
const categoryList = computed(
  () =>
    categoryStore.list?.map((c) => ({
      label: c.name,
      value: c._id, // we store name in form, map to ID on submit
    })) ?? []
)
</script>
