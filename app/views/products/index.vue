<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-1 flex-wrap items-start gap-2 md:items-center">
        <UiSearchInput :delay="500" :loading="true" @search="handleSearch" />
        <USelectMenu
          class="max-w-[200px] min-w-[100px] sm:max-w-[250px] sm:min-w-[250px]"
          v-model="selectedCategory"
          :items="categoryList"
          value-key="value"
          placeholder="Filter by category"
        />
      </div>
      <UButton as="a" href="/products/add" label="Add Product" />
    </div>

    <div class="flex flex-wrap">
      <UBadge
        v-if="selectedCategory"
        class="rounded-full"
        color="neutral"
        :label="categoryList.find((cat) => cat.value === selectedCategory)?.label ?? ''"
        variant="subtle"
      >
        <template #trailing>
          <UIcon
            name="i-lucide-x"
            class="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
            @click="selectedCategory = ''"
          />
        </template>
      </UBadge>
    </div>

    <ProductTable :search="searchQuery" :category="selectedCategory" />
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '~/stores/category.store'
import { useHeaderStore } from '~/stores/header.store'
import ProductTable from './components/ProductTable.vue'

const headerStore = useHeaderStore()
const categoryStore = useCategoryStore()
const selectedCategory = ref('')

onBeforeMount(async () => {
  headerStore.setHeaders('Products', 'Manage your products here')
})

// Ensure categories are loaded
onMounted(async () => {
  if (!categoryStore.list?.length) {
    await categoryStore.fetchListOnly()
  }
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
