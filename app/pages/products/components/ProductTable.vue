<script setup lang="ts">
import { h, resolveComponent, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'

import DeleteProduct from '~/pages/products/components/DeleteProduct.vue'
import type { ProductInterface } from '~/services/product.service'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const productStore = useProductStore()
const openDelete = ref(false)

const pagination = reactive({
  page: 1,
  limit: 20,
  query: '',
})

watch(
  () => [pagination.page, pagination.limit, pagination.query],
  async () => {
    states.fetching = true
    await productStore.fetchProducts(pagination)
    states.fetching = false
  }
)

const columns: TableColumn<ProductInterface>[] = [
  {
    accessorKey: 's.n',
    header: 'S.N',
    cell: ({ row }) => `${row.index + 1}`,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return h('div', { class: 'font-medium' }, `${row.getValue('name')}`)
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      return row.getValue('category')
    },
  },
  {
    id: 'image',
    header: 'Image',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          color: row.getValue('isActive') ? 'success' : 'error',
          variant: 'subtle',
          class: 'px-2 py-1',
        },
        {
          default: () => (row.getValue('isActive') ? 'Active' : 'Inactive'),
        }
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
  },
]
const states = reactive({
  fetching: false,
  adding: false,
})

onMounted(async () => {
  states.fetching = true
  await productStore.fetchProducts(pagination)
  states.fetching = false
})
const handleDelete = async (row: ProductInterface) => {
  productStore.selectedProduct = row
  console.log('Selected Product for Deletion:', productStore.selectedProduct)
  openDelete.value = true
}
</script>

<template>
  <div class="border-default rounded-lg border bg-white">
    <UTable
      :data="productStore.products || []"
      :columns="columns"
      class="flex-1"
      :ui="{ thead: 'bg-gray-100' }"
      :loading="states.fetching"
    >
      <template #image-cell="{ row }">
        <NuxtImg :src="row.original.image" class="h-24 w-24 object-fill" />
      </template>
      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton variant="outline" size="md" icon="i-lucide-pencil" color="info" />
          <UButton
            variant="outline"
            size="md"
            @click="handleDelete(row.original)"
            icon="i-lucide-trash"
            color="error"
          />
        </div>
      </template>
    </UTable>
  </div>
  <div class="border-default flex justify-end pt-4">
    <UPagination
      v-model:page="pagination.page"
      :items-per-page="pagination.limit"
      :total="productStore.pagination?.total || 0"
    />
  </div>
  <DeleteProduct
    :open="openDelete"
    @update:open="
      () => {
        productStore.selectedProduct = null
        openDelete = false
      }
    "
  />
</template>
