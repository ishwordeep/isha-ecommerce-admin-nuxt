<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-1 flex-wrap items-start gap-2 md:items-center">
        <UiSearchInput :delay="500" :loading="true" @search="handleSearch" />
        <USelect
          class="max-w-[200px] min-w-[100px] sm:max-w-[250px] sm:min-w-[250px]"
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
import ProductTable from '~/pages/products/components/ProductTable.vue'
import { useCategoryStore } from '~/stores/category.store'
import { useHeaderStore } from '~/stores/header.store'

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
