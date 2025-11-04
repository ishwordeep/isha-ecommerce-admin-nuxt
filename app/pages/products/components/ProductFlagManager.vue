<!-- components/admin/ProductFlagManager.vue -->
<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-end">
      <UButton label="Save" @click="handleSave" />
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <!-- Available Products -->
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-200 p-4">
          <h2 class="mb-3 text-lg font-semibold text-gray-900">Add Products</h2>
          <div class="flex items-center justify-between gap-4">
            <UiSearchInput />
            <USelect
              class="max-w-[250px]"
              v-model="selectedCategoryId"
              :items="categoryList"
              placeholder="Select Category"
            />
          </div>
        </div>

        <div class="max-h-[50dvh] min-h-[20dvh] overflow-y-auto p-4 xl:min-h-[30dvh]">
          <div class="py-12 text-center" v-if="availableProducts?.length === 0">
            <UIcon name="i-lucide-search" class="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p class="text-gray-500">No products available</p>
            <p class="mt-1 text-sm text-gray-400">
              Try changing filters or all products are already in this collection
            </p>
          </div>
          <div class="space-y-2" v-else>
            <div
              v-for="product in availableProducts"
              :key="product._id"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="product.image"
                  :alt="product._id"
                  class="aspect-square max-w-[50px] min-w-[50px] object-cover"
                />
                <div>
                  <div class="font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ product.categoryDetails?.name }} • {{ formatPrice(product.price) }}
                  </div>
                </div>
              </div>
              <UButton
                @click="() => addToCollection(product)"
                icon="i-lucide-plus"
                class="text-gray-400 group-hover:text-green-600"
                variant="link"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Current Collection -->
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-pink-50 p-4">
          <div class="mb-2 flex items-center gap-2">
            <UIcon :name="icon" class="h-5 w-5" />
            <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          </div>
          <p class="text-sm text-gray-600">{{ description }}</p>
        </div>

        <div class="max-h-[50dvh] min-h-[20dvh] overflow-y-auto p-4 xl:min-h-[30dvh]">
          <div v-if="!collectionProducts?.length" class="m-auto py-12 text-center">
            <UIcon name="i-lucide-tag" class="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p class="text-gray-500">No products in this collection</p>
            <p class="mt-1 text-sm text-gray-400">Add products from the left panel</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="product in collectionProducts"
              :key="product._id"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="product.image"
                  :alt="product._id"
                  class="aspect-square max-w-[50px] min-w-[50px] object-cover"
                />
                <div>
                  <div class="font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ product.categoryDetails?.name || product.category }} •
                    {{ formatPrice(product.price) }}
                  </div>
                </div>
              </div>
              <UButton
                @click="removeFromCollection(product)"
                icon="i-lucide-x"
                class="text-gray-400 group-hover:text-red-600"
                variant="link"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header.store'
import { useProductStore } from '~/stores/product.store'
import { useCategoryStore } from '~/stores/category.store'
import type { ProductInterface } from '~/services/product.service'

const props = defineProps<{
  flag: 'new' | 'featured' | 'trending'
  title: string
  description?: string
  icon: string
}>()

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const selectedCategoryId = ref('')
const isSubmitting = ref(false)
// Dynamic state based on flag
const collectionProducts = computed(() => productStore.flagCollections[props.flag])
const availableProducts = computed(() => {
  const inCollection = new Set(collectionProducts.value?.map((p) => p._id) || [])
  return productStore.productByCategory?.filter((p) => !inCollection.has(p._id)) || []
})

// Load data
onBeforeMount(async () => {
  if (!collectionProducts.value?.length) {
    await productStore.fetchByFlag(props.flag)
  }

  if (!categoryStore.list?.length) {
    await categoryStore.fetchListOnly()
  }
})

watch(selectedCategoryId, async (newVal) => {
  if (newVal) {
    await productStore.fetchProductsByCategory(newVal)
  }
})

const categoryList = computed(
  () =>
    categoryStore.list?.map((c) => ({
      label: c.name,
      value: c._id,
    })) ?? []
)

const addToCollection = (product: ProductInterface) => {
  productStore.addToFlagCollection(props.flag, product)
}

const removeFromCollection = (product: ProductInterface) => {
  productStore.removeFromFlagCollection(props.flag, product._id!)
}

const handleSave = async () => {
  isSubmitting.value = true
  const ids = collectionProducts.value?.map((p) => p._id!).filter(Boolean) ?? []
  if (ids.length) {
    const response = await productStore.saveByFlag({ flag: props.flag, ids })
    if (response.data?.success) {
    }
  }
}

const formatPrice = (price?: number) => (price ? `$${price}` : '—')
</script>
